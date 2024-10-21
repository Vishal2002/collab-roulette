
import { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';

export function usePeerjs(userId: string) {
  const [peer, setPeer] = useState<Peer | null>(null);
  //@ts-ignore
  const [connection, setConnection] = useState<Peer.DataConnection | null>(null);
  //@ts-ignore
  const [call, setCall] = useState<Peer.MediaConnection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const newPeer = new Peer(userId);

    newPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setPeer(newPeer);
    });

    newPeer.on('error', (err) => {
      console.error('Peer error:', err);
      setError(err.message);
    });

    return () => {
      newPeer.destroy();
    };
  }, [userId]);

  const connectToPeer = (partnerId: string) => {
    if (!peer) return;

    const conn = peer.connect(partnerId);
    setConnection(conn);

    conn.on('open', () => {
      console.log('Connected to peer:', partnerId);
    });

    conn.on('data', (data) => {
      console.log('Received data:', data);
    });
  };

  const startCall = async (partnerId: string) => {
    if (!peer) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;

      const newCall = peer.call(partnerId, stream);
      setCall(newCall);

      newCall.on('stream', (remoteStream) => {
        remoteStreamRef.current = remoteStream;
      });
    } catch (err) {
      console.error('Failed to get local stream', err);
      setError('Failed to access camera and microphone');
    }
  };

  useEffect(() => {
    if (!peer) return;

    peer.on('call', async (incomingCall) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        incomingCall.answer(stream);
        setCall(incomingCall);

        incomingCall.on('stream', (remoteStream) => {
          remoteStreamRef.current = remoteStream;
        });
      } catch (err) {
        console.error('Failed to get local stream', err);
        setError('Failed to access camera and microphone');
      }
    });
  }, [peer]);

  const endCall = () => {
    if (call) {
      call.close();
      setCall(null);
    }
    if (connection) {
      connection.close();
      setConnection(null);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    remoteStreamRef.current = null;
  };

  return {
    peer,
    connection,
    call,
    error,
    localStream: localStreamRef.current,
    remoteStream: remoteStreamRef.current,
    connectToPeer,
    startCall,
    endCall,
  };
}