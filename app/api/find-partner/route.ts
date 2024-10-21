import { NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
  });

let waitingUsers: string[] = [];

export async function POST(req: Request) {
    try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Check if the user is already in the waiting list
    if (waitingUsers.includes(userId)) {
      return NextResponse.json({ message: 'Already waiting for a partner' }, { status: 400 });
    }

    // If there's a waiting user, match them
    if (waitingUsers.length > 0) {
      const partnerId = waitingUsers.shift()!;
      
      try {
        // Notify both users about the match
        await Promise.all([
          pusher.trigger(`user-${userId}`, 'partner-found', { partnerId }),
          pusher.trigger(`user-${partnerId}`, 'partner-found', { partnerId: userId })
        ]);

        return NextResponse.json({ message: 'Partner found', partnerId });
      } catch (error) {
        console.error('Failed to notify users:', error);
        // If notification fails, add the partner back to the waiting list
        waitingUsers.unshift(partnerId);
        return NextResponse.json({ message: 'Failed to match partners' }, { status: 500 });
      }
    } else {
      // If no waiting users, add this user to the list
      waitingUsers.push(userId);
      return NextResponse.json({ message: 'Waiting for a partner' });
    }
  } catch (error) {
    console.error('Error in find-partner route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}