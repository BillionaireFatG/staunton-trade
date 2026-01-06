'use client';

import { ChatSystem } from '@/components/ChatSystem';

interface MessagesClientProps {
  userId: string;
}

export default function MessagesClient({ userId }: MessagesClientProps) {
  return (
    <div className="w-full" style={{ height: 'calc(100vh - 12rem)' }}>
      <ChatSystem className="h-full w-full" userId={userId} />
    </div>
  );
}

