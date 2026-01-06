'use client';

import { ChatSystem } from '@/components/ChatSystem';

interface MessagesClientProps {
  userId: string;
}

export default function MessagesClient({ userId }: MessagesClientProps) {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <ChatSystem className="h-full" userId={userId} />
    </div>
  );
}

