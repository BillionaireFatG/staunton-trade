'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { getConversations, getMessages, sendMessage, markAsRead, type Conversation, type Message } from '@/lib/supabase/master-helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2 } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv.id);
      markAsRead(activeConv.id, user!.id);
    }
  }, [activeConv]);

  useEffect(() => {
    if (!activeConv) return;

    const channel = supabase
      .channel(`messages:${activeConv.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${activeConv.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        scrollToBottom();
        if (payload.new.sender_id !== user?.id) {
          markAsRead(activeConv.id, user!.id);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [activeConv, user]);

  const loadConversations = async () => {
    setLoading(true);
    const convs = await getConversations(user!.id);
    setConversations(convs);
    if (convs.length > 0 && !activeConv) {
      setActiveConv(convs[0]);
    }
    setLoading(false);
  };

  const loadMessages = async (convId: string) => {
    const msgs = await getMessages(convId);
    setMessages(msgs);
    scrollToBottom();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv || !user) return;

    setSending(true);
    await sendMessage(activeConv.id, user.id, newMessage.trim());
    setNewMessage('');
    setSending(false);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Conversations List */}
      <div className="w-80 border-r border-neutral-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className={`w-full p-4 text-left hover:bg-neutral-50 transition-colors ${
                activeConv?.id === conv.id ? 'bg-neutral-100' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={conv.other_user?.avatar_url || undefined} />
                  <AvatarFallback>
                    {conv.other_user?.full_name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm truncate">
                      {conv.other_user?.full_name}
                    </span>
                    {conv.unread_count! > 0 && (
                      <Badge className="ml-2">{conv.unread_count}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {conv.last_message?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col bg-neutral-50">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={activeConv.other_user?.avatar_url || undefined} />
                  <AvatarFallback>
                    {activeConv.other_user?.full_name?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{activeConv.other_user?.full_name}</h3>
                  <p className="text-sm text-neutral-500">
                    {activeConv.other_user?.company_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isOwn = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md ${isOwn ? 'bg-blue-600 text-white' : 'bg-white'} rounded-lg px-4 py-2 shadow-sm`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className={`text-xs ${isOwn ? 'text-blue-100' : 'text-neutral-400'} mt-1 block`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-neutral-200">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                />
                <Button type="submit" disabled={sending || !newMessage.trim()}>
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

