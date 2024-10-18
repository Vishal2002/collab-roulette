import { auth } from "@clerk/nextjs/server";
import StreamComponent from "@/components/StreamComponent";
import { redirect } from "next/navigation";

export default function StreamPage() {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Let's Collab</h1>
        <StreamComponent userId={userId} />
      </main>
    </div>
  );
}