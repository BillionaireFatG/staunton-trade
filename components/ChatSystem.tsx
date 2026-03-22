'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  Check,
  CheckCheck,
  Image,
  FileText,
  Download,
  X,
  Plus,
  Hash,
  Users,
  Circle,
  MessageSquare,
  Star,
  Pin,
  Archive,
  Trash2,
  Bell,
  BellOff,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TrustBadge, VerifiedBadge } from '@/components/TrustScore';

// Types
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  trustScore: number;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: Date;
  company?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: {
    id: string;
    name: string;
    type: 'image' | 'document';
    url: string;
    size: string;
  }[];
  replyTo?: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'deal' | 'channel';
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  dealId?: string;
  dealTitle?: string;
}

// Sample data
const SAMPLE_USERS: ChatUser[] = [
  { 
    id: '1', 
    name: 'John Smith', 
    email: 'john@shell.com', 
    trustScore: 4.9, 
    isVerified: true, 
    isOnline: true,
    company: 'Shell Trading'
  },
  { 
    id: '2', 
    name: 'Maria Garcia', 
    email: 'maria@petrobras.com', 
    trustScore: 4.7, 
    isVerified: true, 
    isOnline: true,
    company: 'Petrobras'
  },
  { 
    id: '3', 
    name: 'Ahmed Hassan', 
    email: 'ahmed@gulf-energy.ae', 
    trustScore: 4.2, 
    isVerified: true, 
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
    company: 'Gulf Energy Partners'
  },
  { 
    id: '4', 
    name: 'Li Wei', 
    email: 'li.wei@sinopec.cn', 
    trustScore: 4.5, 
    isVerified: true, 
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    company: 'Sinopec Trading'
  },
];

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    type: 'direct',
    participants: [SAMPLE_USERS[0]],
    lastMessage: {
      id: 'm1',
      senderId: '1',
      content: 'The shipment documents are ready for review',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'read',
    },
    unreadCount: 2,
    isPinned: true,
  },
  {
    id: 'conv2',
    type: 'deal',
    participants: [SAMPLE_USERS[1]],
    dealId: 'STN-2024-000847',
    dealTitle: '50K MT ULSD to Lagos',
    lastMessage: {
      id: 'm2',
      senderId: '2',
      content: 'Can we discuss the loading schedule?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'delivered',
    },
    unreadCount: 0,
  },
  {
    id: 'conv3',
    type: 'direct',
    participants: [SAMPLE_USERS[2]],
    lastMessage: {
      id: 'm3',
      senderId: 'me',
      content: 'Let me check and get back to you',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'read',
    },
    unreadCount: 0,
  },
  {
    id: 'conv4',
    type: 'channel',
    participants: SAMPLE_USERS,
    lastMessage: {
      id: 'm4',
      senderId: '4',
      content: 'Q1 2025 pricing discussion',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'read',
    },
    unreadCount: 5,
  },
];

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: 'msg1',
    senderId: '1',
    content: 'Hi, I wanted to follow up on our discussion about the diesel shipment to Rotterdam.',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: 'read',
  },
  {
    id: 'msg2',
    senderId: 'me',
    content: 'Of course! We\'ve prepared the draft contract. Would you like to review it?',
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    status: 'read',
  },
  {
    id: 'msg3',
    senderId: '1',
    content: 'Yes, please send it over. Also, I\'ve attached the updated specifications.',
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    status: 'read',
    attachments: [
      { id: 'a1', name: 'ULSD_Specs_v2.pdf', type: 'document', url: '#', size: '2.4 MB' },
    ],
  },
  {
    id: 'msg4',
    senderId: 'me',
    content: 'Perfect, I\'ll review these specs and send the contract shortly.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'read',
  },
  {
    id: 'msg5',
    senderId: '1',
    content: 'The shipment documents are ready for review',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'read',
    attachments: [
      { id: 'a2', name: 'Bill_of_Lading.pdf', type: 'document', url: '#', size: '1.8 MB' },
      { id: 'a3', name: 'Cargo_Manifest.pdf', type: 'document', url: '#', size: '956 KB' },
    ],
  },
];

// Format time
function formatTime(date: Date): string {
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

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Message Status Icon
function MessageStatus({ status }: { status: ChatMessage['status'] }) {
  switch (status) {
    case 'sending':
      return <Circle size={12} className="text-muted-foreground animate-pulse" />;
    case 'sent':
      return <Check size={12} className="text-muted-foreground" />;
    case 'delivered':
      return <CheckCheck size={12} className="text-muted-foreground" />;
    case 'read':
      return <CheckCheck size={12} className="text-blue-500" />;
    default:
      return null;
  }
}

// Conversation List Item
interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const participant = conversation.participants[0];
  const isGroup = conversation.type === 'channel' || conversation.participants.length > 1;

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
        {isGroup ? (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            {conversation.type === 'channel' ? (
              <Hash size={20} className="text-white" />
            ) : (
              <Users size={20} className="text-white" />
            )}
          </div>
        ) : (
          <Avatar className="w-12 h-12">
            <AvatarImage src={participant.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {participant.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        )}
        
        {/* Online indicator */}
        {!isGroup && participant.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background" />
        )}
        
        {/* Pinned indicator */}
        {conversation.isPinned && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
            <Pin size={8} className="text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn(
              'text-sm truncate',
              conversation.unreadCount > 0 ? 'font-semibold text-foreground' : 'font-medium text-foreground'
            )}>
              {isGroup ? (conversation.dealTitle || 'Team Channel') : participant.name}
            </span>
            {!isGroup && participant.isVerified && (
              <VerifiedBadge isVerified size="sm" />
            )}
          </div>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">
            {conversation.lastMessage && formatTime(conversation.lastMessage.timestamp)}
          </span>
        </div>
        
        {/* Deal badge */}
        {conversation.type === 'deal' && conversation.dealId && (
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 mb-1 h-4">
            {conversation.dealId}
          </Badge>
        )}
        
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            'text-xs truncate',
            conversation.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {conversation.lastMessage?.senderId === 'me' && (
              <span className="text-muted-foreground">You: </span>
            )}
            {conversation.lastMessage?.content}
          </p>
          
          {conversation.unreadCount > 0 && (
            <Badge className="h-5 min-w-[20px] px-1.5 text-[10px] font-bold">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// Message Bubble
interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
  sender?: ChatUser;
}

function MessageBubble({ message, isOwn, showAvatar, sender }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-2 px-4', isOwn ? 'flex-row-reverse' : '')}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-8">
        {showAvatar && !isOwn && sender && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={sender.avatar} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              {sender.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {/* Content */}
      <div className={cn('max-w-[70%] space-y-1', isOwn ? 'items-end' : '')}>
        <div className={cn(
          'rounded-2xl px-4 py-2.5',
          isOwn 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted rounded-bl-md'
        )}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-1.5">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-lg border',
                  isOwn ? 'bg-primary/10 border-primary/20' : 'bg-muted border-border'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center',
                  isOwn ? 'bg-primary/20' : 'bg-background'
                )}>
                  {attachment.type === 'image' ? (
                    <Image size={16} className={isOwn ? 'text-primary' : 'text-muted-foreground'} />
                  ) : (
                    <FileText size={16} className={isOwn ? 'text-primary' : 'text-muted-foreground'} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-xs font-medium truncate',
                    isOwn ? 'text-primary' : 'text-foreground'
                  )}>
                    {attachment.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{attachment.size}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Download size={12} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Time & Status */}
        <div className={cn(
          'flex items-center gap-1.5 px-1',
          isOwn ? 'justify-end' : ''
        )}>
          <span className="text-[10px] text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwn && <MessageStatus status={message.status} />}
        </div>
      </div>
    </motion.div>
  );
}

// Chat Header
interface ChatHeaderProps {
  conversation: Conversation | null;
  onBack?: () => void;
}

function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  if (!conversation) return null;

  const participant = conversation.participants[0];
  const isGroup = conversation.type === 'channel' || conversation.participants.length > 1;

  return (
    <div className="h-16 px-4 border-b border-border flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={onBack}>
            <ChevronLeft size={18} />
          </Button>
        )}
        
        {/* Avatar */}
        <div className="relative">
          {isGroup ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              {conversation.type === 'channel' ? (
                <Hash size={18} className="text-white" />
              ) : (
                <Users size={18} className="text-white" />
              )}
            </div>
          ) : (
            <Avatar className="w-10 h-10">
              <AvatarImage src={participant.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                {participant.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
          {!isGroup && participant.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm">
              {isGroup ? (conversation.dealTitle || 'Team Channel') : participant.name}
            </h3>
            {!isGroup && <VerifiedBadge isVerified={participant.isVerified} size="sm" />}
            {!isGroup && (
              <TrustBadge score={participant.trustScore} size="sm" showScore={false} />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isGroup ? (
              `${conversation.participants.length} members`
            ) : participant.isOnline ? (
              <span className="text-emerald-500">Online</span>
            ) : participant.lastSeen ? (
              `Last seen ${formatTime(participant.lastSeen)}`
            ) : (
              participant.company
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Phone size={16} />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Video size={16} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Star size={14} className="mr-2" />
              Star conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pin size={14} className="mr-2" />
              Pin to top
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BellOff size={14} className="mr-2" />
              Mute notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive size={14} className="mr-2" />
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Message Input
interface MessageInputProps {
  onSend: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
}

function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [content, setContent] = React.useState('');
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    onSend(content, attachments);
    setContent('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted"
            >
              <FileText size={14} className="text-muted-foreground" />
              <span className="text-xs font-medium truncate max-w-[120px]">{file.name}</span>
              <button 
                onClick={() => removeAttachment(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={18} />
        </Button>

        <div className="flex-1 relative">
          <Input
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="pr-10 min-h-[44px] resize-none"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <Smile size={16} />
          </Button>
        </div>

        <Button 
          size="icon" 
          className="h-10 w-10 flex-shrink-0"
          onClick={handleSend}
          disabled={(!content.trim() && attachments.length === 0) || disabled}
        >
          <Send size={18} />
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

// Main Chat System Component
interface ChatSystemProps {
  className?: string;
}

export function ChatSystem({ className }: ChatSystemProps) {
  const [conversations] = React.useState<Conversation[]>(SAMPLE_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showMobileChat, setShowMobileChat] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowMobileChat(true);
    // Load messages for this conversation (in real app, fetch from API)
  };

  const handleSendMessage = (content: string, attachments?: File[]) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      content,
      timestamp: new Date(),
      status: 'sending',
      attachments: attachments?.map((file, i) => ({
        id: `att-${i}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024).toFixed(1)} KB`,
      })),
    };

    setMessages([...messages, newMessage]);

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'sent' } : m
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'delivered' } : m
      ));
    }, 1000);
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.participants.some(p => p.name.toLowerCase().includes(searchLower)) ||
      conv.dealTitle?.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  // Sort: pinned first, then by last message time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const aTime = a.lastMessage?.timestamp.getTime() || 0;
    const bTime = b.lastMessage?.timestamp.getTime() || 0;
    return bTime - aTime;
  });

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
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Plus size={16} />
            </Button>
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
            {sortedConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={selectedConversation?.id === conv.id}
                onClick={() => handleSelectConversation(conv)}
              />
            ))}

            {sortedConversations.length === 0 && (
              <div className="py-8 text-center">
                <MessageSquare size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No conversations found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={cn(
        'flex-1 flex flex-col',
        !showMobileChat && !selectedConversation ? 'hidden md:flex' : 'flex'
      )}>
        {selectedConversation ? (
          <>
            <ChatHeader 
              conversation={selectedConversation} 
              onBack={() => setShowMobileChat(false)}
            />
            
            {/* Messages */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="py-4 space-y-4">
                {messages.map((message, index) => {
                  const isOwn = message.senderId === 'me';
                  const sender = selectedConversation.participants.find(p => p.id === message.senderId);
                  const prevMessage = messages[index - 1];
                  const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                      sender={sender}
                    />
                  );
                })}
              </div>
            </ScrollArea>

            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default ChatSystem;


