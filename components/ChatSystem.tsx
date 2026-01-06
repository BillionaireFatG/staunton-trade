'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { Message, Conversation as ConversationType, ChatUser } from '@/types/database';
import {
  Send,
  Search,
  Check,
  CheckCheck,
  Circle,
  MessageSquare,
  Plus,
  ChevronLeft,
  User,
  Loader2,
  Users,
} from 'lucide-react';
import { 
  getGlobalMessages, 
  sendGlobalMessage, 
  subscribeToGlobalChat,
  type GlobalMessage 
} from '@/lib/supabase/master-helpers';
import { VerificationBadge } from '@/components/profile/VerificationBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Format time helper
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
}

function formatMessageTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Message Status Icon
function MessageStatus({ read, isSent }: { read: boolean; isSent: boolean }) {
  if (!isSent) {
    return <Circle size={12} className="text-muted-foreground animate-pulse" />;
  }
  if (read) {
    return <CheckCheck size={12} className="text-blue-500" />;
  }
  return <Check size={12} className="text-muted-foreground" />;
}

// Conversation List Item
interface ConversationItemProps {
  conversation: ConversationType;
  isActive: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const initials = conversation.partner_name 
    ? conversation.partner_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : conversation.partner_email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-3 flex gap-3 text-left transition-colors rounded-lg',
        isActive ? 'bg-primary/10' : 'hover:bg-muted/50'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        {conversation.is_online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className={cn(
            'text-sm truncate',
            conversation.unread_count > 0 ? 'font-semibold text-foreground' : 'font-medium text-foreground'
          )}>
            {conversation.partner_name || conversation.partner_email || 'Unknown User'}
          </span>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">
            {formatTime(conversation.last_message_at)}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            'text-xs truncate',
            conversation.unread_count > 0 ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {conversation.last_message}
          </p>
          
          {conversation.unread_count > 0 && (
            <Badge className="h-5 min-w-[20px] px-1.5 text-[10px] font-bold">
              {conversation.unread_count}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// Message Bubble
interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTime: boolean;
}

function MessageBubble({ message, isOwn, showTime }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2 px-4', isOwn ? 'flex-row-reverse' : '')}
    >
      <div className={cn('max-w-[70%] space-y-1', isOwn ? 'items-end' : '')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5',
          isOwn 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted rounded-bl-md'
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.message_text}</p>
        </div>

        {/* Time & Status */}
        {showTime && (
          <div className={cn(
            'flex items-center gap-1.5 px-1',
            isOwn ? 'justify-end' : ''
          )}>
            <span className="text-[10px] text-muted-foreground">
              {formatMessageTime(message.created_at)}
            </span>
            {isOwn && <MessageStatus read={message.read} isSent={true} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Chat Header
interface ChatHeaderProps {
  partner: ChatUser | null;
  onBack?: () => void;
}

function ChatHeader({ partner, onBack }: ChatHeaderProps) {
  if (!partner) return null;

  const initials = partner.name 
    ? partner.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : partner.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="h-16 px-4 border-b border-border flex items-center gap-3 bg-card">
      {onBack && (
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={onBack}>
          <ChevronLeft size={18} />
        </Button>
      )}
      
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        {partner.is_online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
        )}
      </div>

      <div>
        <h3 className="font-semibold text-foreground text-sm">
          {partner.name || partner.email || 'Unknown User'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {partner.is_online ? (
            <span className="text-emerald-500">Online</span>
          ) : (
            partner.email
          )}
        </p>
      </div>
    </div>
  );
}

// Message Input
interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

function MessageInput({ onSend, disabled, loading }: MessageInputProps) {
  const [content, setContent] = React.useState('');

  const handleSend = () => {
    if (!content.trim() || disabled || loading) return;
    onSend(content.trim());
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          className="flex-1"
        />
        <Button 
          size="icon" 
          className="h-10 w-10 flex-shrink-0"
          onClick={handleSend}
          disabled={!content.trim() || disabled || loading}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </Button>
      </div>
    </div>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <MessageSquare size={32} className="text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
      <p className="text-sm text-muted-foreground max-w-[300px]">
        Choose from your existing conversations or start a new one with a trading partner.
      </p>
    </div>
  );
}

// New Message Dialog
interface NewMessageDialogProps {
  onStartConversation: (userId: string) => void;
}

function NewMessageDialog({ onStartConversation }: NewMessageDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [users, setUsers] = React.useState<ChatUser[]>([]);
  const [loading, setLoading] = React.useState(false);

  const searchUsers = React.useCallback(async (query: string) => {
    if (query.length < 2) {
      setUsers([]);
      return;
    }
    
    setLoading(true);
    try {
      // Search for users by company name
      const { data, error } = await supabase
        .from('profiles')
        .select('id, company_name, full_name, email')
        .ilike('company_name', `%${query}%`)
        .limit(10);
      
      if (error) throw error;
      
      // Map to ChatUser format
      setUsers(data?.map(d => ({
        id: d.id,
        email: d.email || 'Unknown',
        name: d.full_name || d.company_name || 'Unknown',
      })) || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-muted-foreground" />
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-1">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onStartConversation(user.id);
                      setOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-3 flex items-center gap-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground">
                        {user.name?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium text-sm">{user.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <User size={32} className="text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search size={32} className="text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Chat System Component
interface ChatSystemProps {
  className?: string;
  initialPartnerId?: string;
  userId?: string;
}

export function ChatSystem({ className, initialPartnerId, userId }: ChatSystemProps) {
  const currentUserId = userId || null;
  const [conversations, setConversations] = React.useState<ConversationType[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = React.useState<string | null>(initialPartnerId || null);
  const [selectedPartner, setSelectedPartner] = React.useState<ChatUser | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [globalMessages, setGlobalMessages] = React.useState<GlobalMessage[]>([]);
  const [isGlobalChat, setIsGlobalChat] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showMobileChat, setShowMobileChat] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [sendingMessage, setSendingMessage] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Fetch conversations
  React.useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      setLoading(true);
      try {
        // Get all messages for this user
        const { data: messagesData, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching messages:', error);
          setConversations([]);
          setLoading(false);
          return;
        }

        // Group messages by conversation partner
        const conversationMap = new Map<string, ConversationType>();
        
        for (const msg of messagesData || []) {
          const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
          
          if (!conversationMap.has(partnerId)) {
            // Get partner info
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('company_name, full_name')
              .eq('id', partnerId)
              .single();
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
            }
            
            // Count unread messages from this partner
            const unreadCount = (messagesData || []).filter(
              m => m.sender_id === partnerId && m.receiver_id === currentUserId && !m.read
            ).length;

            conversationMap.set(partnerId, {
              partner_id: partnerId,
              partner_name: profile?.full_name || profile?.company_name || undefined,
              last_message: msg.message_text,
              last_message_at: msg.created_at,
              unread_count: unreadCount,
            });
          }
        }

        setConversations(Array.from(conversationMap.values()));
      } catch (error) {
        console.error('Error in fetchConversations:', error);
        setConversations([]);
      }
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Update messages if currently viewing this conversation
          if (selectedPartnerId === newMessage.sender_id) {
            setMessages(prev => [...prev, newMessage]);
            // Mark as read
            supabase
              .from('messages')
              .update({ read: true })
              .eq('id', newMessage.id);
          }
          
          // Refresh conversations
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId, selectedPartnerId]);

  // Load global chat messages and subscribe
  React.useEffect(() => {
    if (!isGlobalChat) return;

    const loadGlobalChat = async () => {
      const msgs = await getGlobalMessages(100);
      setGlobalMessages(msgs);
    };

    loadGlobalChat();

    const channel = subscribeToGlobalChat((newMsg) => {
      setGlobalMessages(prev => [...prev, newMsg]);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [isGlobalChat]);

  // Fetch messages for selected conversation
  React.useEffect(() => {
    if (!currentUserId || !selectedPartnerId || isGlobalChat) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(
            `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedPartnerId}),` +
            `and(sender_id.eq.${selectedPartnerId},receiver_id.eq.${currentUserId})`
          )
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);

        // Mark messages as read
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('sender_id', selectedPartnerId)
          .eq('receiver_id', currentUserId)
          .eq('read', false);

        // Get partner info
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_name, full_name, email')
          .eq('id', selectedPartnerId)
          .single();

        setSelectedPartner({
          id: selectedPartnerId,
          email: profile?.email || 'Unknown',
          name: profile?.full_name || profile?.company_name || 'Unknown',
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentUserId, selectedPartnerId]);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectConversation = (conv: ConversationType) => {
    setIsGlobalChat(false);
    setSelectedPartnerId(conv.partner_id);
    setShowMobileChat(true);
  };

  const handleStartConversation = (userId: string) => {
    setSelectedPartnerId(userId);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUserId) return;

    setSendingMessage(true);
    try {
      if (isGlobalChat) {
        await sendGlobalMessage(currentUserId, content);
      } else if (selectedPartnerId) {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_id: currentUserId,
            receiver_id: selectedPartnerId,
            message_text: content,
          })
          .select()
          .single();

        if (error) throw error;
        
        setMessages(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setSendingMessage(false);
  };

  const handleOpenGlobalChat = () => {
    setIsGlobalChat(true);
    setSelectedPartnerId(null);
    setSelectedPartner(null);
    setShowMobileChat(true);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.partner_name?.toLowerCase().includes(searchLower) ||
      conv.partner_email?.toLowerCase().includes(searchLower) ||
      conv.last_message.toLowerCase().includes(searchLower)
    );
  });

  // Sort by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
  });

  // Show loading while conversations are loading
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-background border rounded-xl', className)}>
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If no user, show error
  if (!currentUserId) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-background border rounded-xl', className)}>
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Unable to load messages</p>
          <p className="text-sm text-muted-foreground">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex h-full bg-background border rounded-xl overflow-hidden', className)}>
      {/* Sidebar - Conversation List */}
      <div className={cn(
        'w-80 border-r border-border flex flex-col bg-card',
        showMobileChat ? 'hidden md:flex' : 'flex'
      )}>
        {/* Search Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Messages</h2>
            <NewMessageDialog onStartConversation={handleStartConversation} />
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Global Chat Button */}
            <button
              onClick={handleOpenGlobalChat}
              className={cn(
                'w-full p-3 flex gap-3 text-left transition-colors rounded-lg mb-2',
                isGlobalChat ? 'bg-primary/10' : 'hover:bg-muted/50'
              )}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">Global Chat</span>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Community</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Chat with everyone</p>
              </div>
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-muted-foreground" />
              </div>
            ) : sortedConversations.length > 0 ? (
              sortedConversations.map((conv) => (
                <ConversationItem
                  key={conv.partner_id}
                  conversation={conv}
                  isActive={selectedPartnerId === conv.partner_id && !isGlobalChat}
                  onClick={() => handleSelectConversation(conv)}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <MessageSquare size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start a new message to begin
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={cn(
        'flex-1 flex flex-col',
        !showMobileChat && !selectedPartnerId && !isGlobalChat ? 'hidden md:flex' : 'flex'
      )}>
        {isGlobalChat ? (
          <>
            {/* Global Chat Header */}
            <div className="h-16 px-4 border-b border-border flex items-center gap-3 bg-card">
              <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={() => setShowMobileChat(false)}>
                <ChevronLeft size={18} />
              </Button>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <MessageSquare size={20} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Global Chat</h3>
                <p className="text-xs text-muted-foreground">Community conversation</p>
              </div>
            </div>

            {/* Global Messages */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="py-4 space-y-3">
                {globalMessages.map((msg, index) => {
                  const isOwn = msg.sender_id === currentUserId;
                  const showAvatar = index === 0 || globalMessages[index - 1].sender_id !== msg.sender_id;
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn('flex gap-2 px-4', isOwn ? 'flex-row-reverse' : '')}
                    >
                      {showAvatar ? (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs">
                            {msg.sender?.full_name?.[0] || '?'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 flex-shrink-0" />
                      )}
                      <div className={cn('flex-1 max-w-[70%] space-y-1', isOwn ? 'items-end flex flex-col' : '')}>
                        {showAvatar && (
                          <div className={cn('flex items-center gap-2', isOwn ? 'flex-row-reverse' : '')}>
                            <span className="text-xs font-semibold">{msg.sender?.full_name || 'Unknown'}</span>
                            {msg.sender?.verification_status === 'verified' && <VerificationBadge verified={true} size="sm" />}
                          </div>
                        )}
                        <div className={cn(
                          'rounded-2xl px-4 py-2.5',
                          isOwn 
                            ? 'bg-primary text-primary-foreground rounded-br-md' 
                            : 'bg-muted rounded-bl-md'
                        )}>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        </div>
                        <span className={cn('text-[10px] text-muted-foreground px-1', isOwn ? 'text-right' : '')}>
                          {formatMessageTime(msg.created_at)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
                
                {globalMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users size={48} className="text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Be the first to say hello!
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <MessageInput onSend={handleSendMessage} loading={sendingMessage} />
          </>
        ) : selectedPartnerId && selectedPartner ? (
          <>
            <ChatHeader 
              partner={selectedPartner} 
              onBack={() => setShowMobileChat(false)}
            />
            
            {/* Messages */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="py-4 space-y-3">
                {messages.map((message, index) => {
                  const isOwn = message.sender_id === currentUserId;
                  const prevMessage = messages[index - 1];
                  const showTime = !prevMessage || 
                    new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() > 60000;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={isOwn}
                      showTime={showTime}
                    />
                  );
                })}
                
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare size={48} className="text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send a message to start the conversation
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <MessageInput onSend={handleSendMessage} loading={sendingMessage} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default ChatSystem;
