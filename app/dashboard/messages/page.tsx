'use client';

import { useEffect, useState } from 'react';
import { ChatSystem } from '@/components/ChatSystem';
import { useAuth } from '@/components/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please sign in to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <ChatSystem className="h-full" />
    </div>
  );
}
