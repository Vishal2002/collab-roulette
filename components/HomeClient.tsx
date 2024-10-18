"use client"

import TwitchSignIn from '@/components/TwitchSignIn'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TwitchIcon, Users, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'

interface HomeClientProps {
  userId: string | null
}

export default function HomeClient({ userId }: HomeClientProps) {
  const { toast } = useToast();

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Collab Roulette</h1>
          <p className="text-xl text-purple-100 mb-8">Connect with random Twitch streamers and make new friends!</p>
          <TwitchSignIn />
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TwitchIcon className="mr-2 h-6 w-6 text-purple-600" />
                Twitch Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seamlessly connect with your Twitch account and start streaming in seconds.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6 text-purple-600" />
                Random Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get paired with random Twitch streamers and expand your network.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-6 w-6 text-purple-600" />
                Live Streaming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Engage in live video chats and showcase your content to new audiences.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
          {userId ? (
            <Button asChild size="lg" className="bg-purple-700 hover:bg-purple-800">
              <Link href="/stream">Find Friends</Link>
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="bg-purple-700 hover:bg-purple-800"
              onClick={() => {
                toast({
                  variant: 'destructive',
                  title: "Uh oh! Something went wrong.",
                  description: "Please sign in to find friends.",
                })
              }}
            >
              Find Friends
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}