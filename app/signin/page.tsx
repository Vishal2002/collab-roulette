"use client"

import { Button } from "@/components/ui/button"
import {signIn} from "next-auth/react"

export default function SignIn() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Collab Roulette</h1>
        <Button
          onClick={() => signIn("twitch", { callbackUrl: "/stream" })}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in with Twitch
        </Button>
      </div>
    </div>
  )
}