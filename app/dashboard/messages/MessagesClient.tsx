'use client';

import { ChatSystem } from '@/components/ChatSystem';

interface MessagesClientProps {
  userId: string;
}

export default function MessagesClient({ userId }: MessagesClientProps) {
  return (
    <div className="fixed inset-0 top-16 bottom-0 md:relative md:inset-auto" style={{ height: 'calc(100vh - 8rem)' }}>
      <ChatSystem userId={userId} />
    </div>
  );
}

