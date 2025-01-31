import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function AuthCallback() {
  return <AuthenticateWithRedirectCallback afterSignInUrl="/stream" afterSignUpUrl="/stream" />;
}