"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

type StreamComponentProps = {
  userId: string;
};

export default function StreamComponent({ userId }: StreamComponentProps) {
  const { user } = useUser();
  const [partner, setPartner] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSearching) {
      timer = setTimeout(() => {
        setPartner("RandomUser123");
        setIsSearching(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isSearching]);

  const startSearching = () => {
    setIsSearching(true);
    setPartner(null);
  };

  const endStream = () => {
    setPartner(null);
    setIsSearching(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            {user?.username || "Your Stream"}
          </div>
          <div className="flex justify-between">
            <button
              onClick={startSearching}
              disabled={isSearching || partner !== null}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              {isSearching ? "Searching..." : "Find Partner"}
            </button>
            <button
              onClick={endStream}
              disabled={!partner && !isSearching}
              className="bg-red-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              End Stream
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            {partner ? partner : "Waiting for partner..."}
          </div>
          {partner && (
            <div className="text-center">
              <p>You are now streaming with {partner}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}