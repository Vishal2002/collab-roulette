import { AuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";
import { SupabaseAdapter } from "@auth/supabase-adapter";

export const authOptions: AuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }) as any, // Type assertion needed due to compatibility issues
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        //@ts-ignore
        session.user.id = user.id;
      }
      return session;
    },
  },

};