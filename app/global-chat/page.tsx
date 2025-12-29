'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useProfile } from '@/components/ProfileProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Users, MessageCircle, ChevronDown } from 'lucide-react';
import { VerificationBadge } from '@/components/profile/VerificationBadge';
import {
  getGlobalMessages,
  sendGlobalMessage,
  subscribeToGlobalChat,
  getOnlineUsersCount,
  getOlderGlobalMessages,
  type GlobalMessage,
} from '@/lib/supabase/global-chat';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function GlobalChatPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<GlobalMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await getGlobalMessages(100);
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => scrollToBottom(false), 100);
    };

    const loadOnlineCount = async () => {
      const count = await getOnlineUsersCount();
      setOnlineCount(count);
    };

    loadMessages();
    loadOnlineCount();

    // Refresh online count every 30 seconds
    const interval = setInterval(loadOnlineCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Subscribe to new messages
  useEffect(() => {
    const channel = subscribeToGlobalChat((newMsg) => {
      setMessages(prev => [...prev, newMsg]);
      // Auto-scroll if user is near bottom
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
        if (isNearBottom) {
          setTimeout(() => scrollToBottom(), 100);
        }
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Load older messages
  const loadOlderMessages = async () => {
    if (loadingOlder || !hasMore || messages.length === 0) return;

    setLoadingOlder(true);
    const oldestMessage = messages[0];
    const olderMsgs = await getOlderGlobalMessages(oldestMessage.created_at, 50);
    
    if (olderMsgs.length === 0) {
      setHasMore(false);
    } else {
      setMessages(prev => [...olderMsgs, ...prev]);
    }
    setLoadingOlder(false);
  };

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    const sent = await sendGlobalMessage(user.id, newMessage);
    if (sent) {
      setNewMessage('');
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <MessageCircle size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Global Chat</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={14} />
                  <span>{onlineCount} online</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Load More Button */}
          {hasMore && messages.length >= 50 && (
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={loadOlderMessages}
                disabled={loadingOlder}
              >
                {loadingOlder ? (
                  <><Loader2 size={14} className="mr-2 animate-spin" />Loading...</>
                ) : (
                  <><ChevronDown size={14} className="mr-2" />Load Older Messages</>
                )}
              </Button>
            </div>
          )}

          {/* Welcome Message */}
          {messages.length === 0 && (
            <Card className="p-8 text-center">
              <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Welcome to Global Chat!</h3>
              <p className="text-muted-foreground">
                Be the first to start the conversation. Say hello to the community!
              </p>
            </Card>
          )}

          {/* Messages List */}
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user?.id;
              const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {showAvatar ? (
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={message.sender?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                          {message.sender?.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-2xl ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                    {showAvatar && (
                      <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                        <span className="font-semibold text-sm">
                          {message.sender?.full_name || 'Anonymous'}
                        </span>
                        {message.sender?.verification_status === 'verified' && (
                          <VerificationBadge size="sm" />
                        )}
                        {message.sender?.role && message.sender.role.length > 0 && (
                          <div className="flex gap-1">
                            {message.sender.role.slice(0, 2).map((role) => (
                              <Badge key={role} variant="secondary" className="text-xs capitalize">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-card/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          {profile ? (
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                disabled={sending}
                maxLength={500}
              />
              <Button type="submit" disabled={!newMessage.trim() || sending}>
                {sending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">
                Please <a href="/sign-in" className="text-primary hover:underline">sign in</a> to join the conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

