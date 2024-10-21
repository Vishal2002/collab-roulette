import { auth } from "@clerk/nextjs/server";
import StreamComponent from "@/components/StreamComponent";

export default function StreamPage() {
  const { userId } = auth();

  return (
    <div className="container mx-auto py-6">
      <div className="flex gap-5">
      <h1 className="text-3xl font-bold mb-6">Stream Now</h1>
     
      </div>
     
      <StreamComponent userId={userId} />
    </div>
  );
}