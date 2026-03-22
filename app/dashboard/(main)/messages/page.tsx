'use client';

import { ChatSystem } from '@/components/ChatSystem';

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <ChatSystem className="h-full" />
    </div>
  );
}
