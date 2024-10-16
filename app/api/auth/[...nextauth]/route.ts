//@ts-nocheck
import NextAuth, { AuthOptions } from "next-auth"
import TwitchProvider from "next-auth/providers/twitch"
import { SupabaseAdapter } from "@auth/supabase-adapter"

export const authOptions:AuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }),
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }