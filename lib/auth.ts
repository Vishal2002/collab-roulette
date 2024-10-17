import { AuthOptions } from "next-auth"
   import TwitchProvider from "next-auth/providers/twitch"
   import { SupabaseAdapter } from "@auth/supabase-adapter"

   export const authOptions: AuthOptions = {
     providers: [
       TwitchProvider({
         clientId: process.env.TWITCH_CLIENT_ID!,
         clientSecret: process.env.TWITCH_CLIENT_SECRET!,
       }),
     ],
     adapter: SupabaseAdapter({
       url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
       secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
     }) as any,
     secret: process.env.NEXTAUTH_SECRET,
     debug: true, // Enable debug messages
     callbacks: {
       async signIn({ user, account, profile, email, credentials }) {
         console.log("SignIn callback", { user, account, profile, email })
         return true
       },
       async redirect({ url, baseUrl }) {
         console.log("Redirect callback", { url, baseUrl })
         if (url.startsWith("/")) return `${baseUrl}${url}`
         else if (new URL(url).origin === baseUrl) return url
         return baseUrl
       },
       async session({ session, user, token }) {
         console.log("Session callback", { session, user, token })
         return session
       },
       async jwt({ token, user, account, profile, isNewUser }) {
         console.log("JWT callback", { token, user, account, profile, isNewUser })
         return token
       }
     },
   }