"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Peer from 'peerjs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, UserPlus, X, Loader2, AlertCircle } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type StreamComponentProps = {
  userId: string|null;
};

export default function StreamComponent({ userId }: StreamComponentProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [partner, setPartner] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  //@ts-ignore
  const [call, setCall] = useState<Peer.MediaConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is not available. Please make sure you're logged in.");
      return;
    }

    const newPeer = new Peer(userId);
    setPeer(newPeer);

    newPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });

    newPeer.on('call', async (incomingCall) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        incomingCall.answer(stream);
        setCall(incomingCall);

        incomingCall.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error answering call:', err);
        setError('Failed to access camera and microphone');
      }
    });

    const channel = pusherClient.subscribe(`user-${userId}`);

    channel.bind('partner-found', async (data: { partnerId: string }) => {
      setPartner(data.partnerId);
      setIsSearching(false);
      setError(null);
      toast({
        title: "Partner Found!",
        description: `You are now connected with ${data.partnerId}.`,
        duration: 5000,
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const outgoingCall = newPeer.call(data.partnerId, stream);
        
        if (outgoingCall) {
          setCall(outgoingCall);

          outgoingCall.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          throw new Error('Failed to initiate call');
        }
      } catch (err) {
        console.error('Error initiating call:', err);
        setError('Failed to start video call');
      }
    });

    channel.bind('partner-disconnected', () => {
      setPartner(null);
      if (call) {
        call.close();
        setCall(null);
      }
      toast({
        title: "Partner Disconnected",
        description: "Your partner has ended the stream.",
        variant: "destructive",
        duration: 5000,
      });
    });

    return () => {
      pusherClient.unsubscribe(`user-${userId}`);
      if (peer) {
        peer.destroy();
      }
    };
  }, [userId, toast]);

  const startSearching = async () => {
    if (!userId) {
      setError("User ID is not available. Please make sure you're logged in.");
      return;
    }

    setIsSearching(true);
    setPartner(null);
    setError(null);
    
    try {
      const response = await fetch('/api/find-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.message === 'Waiting for a partner') {
        toast({
          title: "Searching for Partner",
          description: "Please wait while we find a match for you.",
          duration: 5000,
        });
      } else if (data.message === 'Partner found') {
        setPartner(data.partnerId);
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Failed to start searching:', error);
      setIsSearching(false);
      setError('Failed to start searching. Please try again.');
      toast({
        title: "Error",
        description: "Failed to start searching. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const endStream = async () => {
    if (!userId) {
      setError("User ID is not available. Please make sure you're logged in.");
      return;
    }

    if (partner) {
      try {
        const response = await fetch('/api/end-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, partnerId: partner }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setPartner(null);
        if (call) {
          call.close();
          setCall(null);
        }
        toast({
          title: "Stream Ended",
          description: "You have successfully ended the stream.",
          duration: 5000,
        });
      } catch (error) {
        console.error('Failed to end stream:', error);
        setError('Failed to end stream. Please try again.');
        toast({
          title: "Error",
          description: "Failed to end stream. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
    setIsSearching(false);
  };

  if (!userId) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>User ID is not available. Please make sure you're logged in.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="mr-2 h-5 w-5 text-purple-600" />
              Your Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full aspect-video bg-gray-800 rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5 text-purple-600" />
              Partner's Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partner ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full aspect-video bg-gray-800 rounded-lg" />
            ) : (
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center text-white">
                {isSearching ? "Searching for partner..." : "Waiting for partner..."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={startSearching}
          disabled={isSearching || partner !== null}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Find Partner"
          )}
        </Button>
        <Button
          onClick={endStream}
          disabled={!partner && !isSearching}
          variant="destructive"
        >
          <X className="mr-2 h-4 w-4" />
          End Stream
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {partner && (
        <Alert variant="default" className="bg-green-100 text-green-800 border-green-300">
          <AlertTitle>Connected</AlertTitle>
          <AlertDescription>You are now streaming with {partner}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}