"use client";

import { useState } from "react";
import { useSignIn, useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TwitchIcon, LogOut, AlertCircle } from "lucide-react";


export default function TwitchSignIn() {
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center h-40">
          <div className="animate-pulse text-lg font-semibold">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const signInWithTwitch = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_twitch",
        redirectUrl: "/auth-callback",
        redirectUrlComplete: "/stream",
      });
    } catch (err: any) {
      console.error("Error during sign in:", err);
      if (err.errors && err.errors[0]?.code === "session_exists") {
        setError("You're already signed in. Please sign out first to use a different account.");
      } else {
        setError(`An error occurred during sign in: ${err.message || "Unknown error"}`);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setError(null);
    } catch (err) {
      console.error("Error during sign out:", err);
      setError("An error occurred during sign out. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Collab-Roulette</CardTitle>
        <CardDescription>Connect with random Twitch streamers</CardDescription>
      </CardHeader>
      <CardContent>
        {isSignedIn ? (
          <Button 
            onClick={handleSignOut} 
            variant="destructive"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        ) : (
          <Button 
            onClick={signInWithTwitch} 
            className="w-full bg-[#9146FF] hover:bg-[#7C3AED]"
          >
            <TwitchIcon className="mr-2 h-4 w-4" /> Sign in with Twitch
          </Button>
        )}
      </CardContent>
      {error && (
        <CardFooter>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
}