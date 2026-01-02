'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useProfile } from '@/components/ProfileProvider';
import {
  getVoiceRoomsWithCounts,
  getRoomParticipants,
  getRoomMessages,
  sendRoomMessage,
  joinRoom,
  leaveRoom,
  updateMuteStatus,
  subscribeToRoom,
  subscribeToRoomMessages,
  VoiceRoomWithParticipants,
  VoiceParticipant,
  VoiceRoomMessage,
} from '@/lib/supabase/voice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  Loader2, 
  Mic, 
  MicOff, 
  Phone, 
  Settings, 
  MessageSquare, 
  Send,
  Hash,
  ChevronRight,
  Headphones,
  Radio,
  Fuel,
  Zap,
  Wheat,
  Ship,
  Briefcase,
  type LucideIcon
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  fuel: Fuel,
  metals: Zap,
  agriculture: Wheat,
  logistics: Ship,
  general: Briefcase,
};

const getCategoryIcon = (category: string): LucideIcon => {
  return CATEGORY_ICONS[category] || Briefcase;
};

export default function VoiceRoomsPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomIdFromUrl = searchParams.get('room');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [rooms, setRooms] = useState<VoiceRoomWithParticipants[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(roomIdFromUrl);
  const [selectedRoom, setSelectedRoom] = useState<VoiceRoomWithParticipants | null>(null);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [messages, setMessages] = useState<VoiceRoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'voice' | 'chat'>('voice');

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (selectedRoomId) {
      loadRoomDetails(selectedRoomId);
    }
  }, [selectedRoomId]);

  useEffect(() => {
    if (!selectedRoomId) return;
    
    loadRoomMessages(selectedRoomId);
    
    const unsubscribe = subscribeToRoom(selectedRoomId, () => {
      loadRoomDetails(selectedRoomId);
    });
    
    const unsubscribeMessages = subscribeToRoomMessages(selectedRoomId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    
    return () => {
      unsubscribe();
      unsubscribeMessages();
    };
  }, [selectedRoomId]);

  const loadRoomMessages = async (roomId: string) => {
    const msgs = await getRoomMessages(roomId);
    setMessages(msgs);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInRoom) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleLeaveRoom();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInRoom, isMuted]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getVoiceRoomsWithCounts();
      setRooms(data);
    } catch (error) {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRoomDetails = async (roomId: string) => {
    try {
      const room = rooms.find((r) => r.id === roomId);
      if (room) setSelectedRoom(room);

      const participantsData = await getRoomParticipants(roomId);
      setParticipants(participantsData);

      if (user) {
        const userInRoom = participantsData.some((p) => p.user_id === user.id);
        setIsInRoom(userInRoom);
        if (userInRoom) {
          const userParticipant = participantsData.find((p) => p.user_id === user.id);
          if (userParticipant) setIsMuted(userParticipant.is_muted);
        }
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    try {
      setJoining(true);
      await joinRoom(roomId, user.id);
      setIsInRoom(true);
      setSelectedRoomId(roomId);
      await loadRoomDetails(roomId);
    } catch (error) {
      // Silent error handling
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!user || !selectedRoomId) return;
    try {
      await leaveRoom(selectedRoomId, user.id);
      setIsInRoom(false);
      setIsMuted(false);
      await loadRoomDetails(selectedRoomId);
    } catch (error) {
      // Silent error handling
    }
  };

  const handleToggleMute = async () => {
    if (!user || !selectedRoomId) return;
    try {
      const newMutedState = !isMuted;
      await updateMuteStatus(selectedRoomId, user.id, newMutedState);
      setIsMuted(newMutedState);
    } catch (error) {
      // Silent error handling
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedRoomId) return;

    const content = newMessage.trim();
    setNewMessage('');
    
    const sentMessage = await sendRoomMessage(selectedRoomId, user.id, content);
    if (!sentMessage) {
      setNewMessage(content);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fuel: 'from-orange-500 to-red-600',
      metals: 'from-slate-400 to-zinc-600',
      agriculture: 'from-green-500 to-emerald-600',
      logistics: 'from-blue-500 to-cyan-600',
      general: 'from-purple-500 to-indigo-600',
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading trading rooms...</p>
        </div>
      </div>
    );
  }

  if (!loading && rooms.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur flex items-center px-6 gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Voice Trading Rooms</h1>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
          <div className="text-center max-w-md p-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Radio className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Setup Required</h2>
            <p className="text-muted-foreground mb-6">
              Run the database migration <code className="bg-accent px-2 py-1 rounded">005_voice_rooms.sql</code> to enable voice rooms.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur flex items-center px-4 gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
          <ArrowLeft size={16} className="mr-2" />
          Dashboard
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium">Trading Rooms</span>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Headphones size={14} />
          <span>{participants.length} traders online</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar - Room List */}
        <div className="w-72 border-r border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trading Rooms</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group ${
                  selectedRoomId === room.id
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
              >
                {(() => {
                  const CategoryIcon = getCategoryIcon(room.category);
                  return (
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getCategoryColor(room.category)} flex items-center justify-center shadow-lg`}>
                      <CategoryIcon size={18} className="text-white" />
                    </div>
                  );
                })()}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{room.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users size={10} />
                    <span>{room.participant_count} online</span>
                    {room.verified_count > 0 && (
                      <>
                        <span>•</span>
                        <CheckCircle2 size={10} className="text-green-500" />
                        <span>{room.verified_count}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* User Status Bar */}
          {isInRoom && selectedRoom && (
            <div className="p-3 border-t border-border bg-muted/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">{profile?.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.full_name}</p>
                  <p className="text-xs text-green-600">Connected to {selectedRoom.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={isMuted ? 'destructive' : 'secondary'}
                  className="flex-1 h-9"
                  onClick={handleToggleMute}
                >
                  {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 h-9"
                  onClick={handleLeaveRoom}
                >
                  <Phone size={14} className="text-red-500" />
                </Button>
                <Button size="sm" variant="secondary" className="h-9 w-9 p-0">
                  <Settings size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedRoom ? (
            <>
              {/* Room Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const CategoryIcon = getCategoryIcon(selectedRoom.category);
                      return (
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedRoom.category)} flex items-center justify-center shadow-lg`}>
                          <CategoryIcon size={24} className="text-white" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="text-xl font-bold">{selectedRoom.name}</h2>
                      <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                    </div>
                  </div>
                  {!isInRoom && (
                    <Button
                      onClick={() => handleJoinRoom(selectedRoom.id)}
                      disabled={joining}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {joining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Headphones className="mr-2 h-4 w-4" />}
                      Join Voice
                    </Button>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-4">
                  <button
                    onClick={() => setActiveTab('voice')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'voice' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Mic size={14} className="inline mr-2" />
                    Voice ({participants.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'chat' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Hash size={14} className="inline mr-2" />
                    Chat
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden bg-background">
                {activeTab === 'voice' ? (
                  <div className="h-full p-6 overflow-y-auto">
                    {participants.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                            <Mic className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Room is empty</h3>
                          <p className="text-muted-foreground text-sm mb-4">Be the first to join and start trading discussions</p>
                          <Button onClick={() => handleJoinRoom(selectedRoom.id)} className="bg-green-600 hover:bg-green-700">
                            Join Voice
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {participants.map((participant) => (
                          <div
                            key={participant.id}
                            className={`relative p-4 rounded-2xl transition-all ${
                              participant.is_speaking
                                ? 'bg-green-500/20 ring-2 ring-green-500 ring-offset-2 ring-offset-background'
                                : 'bg-card border border-border hover:bg-accent/50'
                            }`}
                          >
                            <div className="relative mx-auto w-fit mb-3">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={participant.profile?.avatar_url || undefined} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-lg text-primary-foreground">
                                  {participant.profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              {participant.is_muted && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                                  <MicOff size={12} className="text-white" />
                                </div>
                              )}
                              {participant.is_speaking && (
                                <div className="absolute -inset-1 rounded-full border-2 border-green-500 animate-ping" />
                              )}
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-sm truncate">
                                {participant.profile?.full_name || 'Unknown'}
                                {participant.user_id === user?.id && <span className="text-muted-foreground ml-1">(You)</span>}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{participant.profile?.company_name}</p>
                              <div className="flex items-center justify-center gap-1 mt-2">
                                {participant.profile?.verification_status === 'verified' && (
                                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-[10px] px-1.5">
                                    <CheckCircle2 size={10} className="mr-0.5" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {participant.is_speaking && (
                              <div className="absolute top-2 right-2">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3].map((i) => (
                                    <div
                                      key={i}
                                      className="w-1 bg-green-500 rounded-full animate-pulse"
                                      style={{
                                        height: `${8 + Math.random() * 8}px`,
                                        animationDelay: `${i * 100}ms`,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                      {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center">
                            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className="flex gap-3 group">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={msg.profile?.avatar_url || undefined} />
                              <AvatarFallback className="text-xs">{msg.profile?.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{msg.profile?.full_name}</span>
                                {msg.profile?.verification_status === 'verified' && (
                                  <CheckCircle2 size={12} className="text-green-500" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-sm text-foreground/80">{msg.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={`Message #${selectedRoom.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                          <Send size={16} />
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                  <Radio className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Select a Trading Room</h3>
                <p className="text-muted-foreground mb-8">Join a room to start discussing deals with verified traders</p>
                <div className="grid grid-cols-2 gap-3">
                  {rooms.slice(0, 4).map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className="p-4 rounded-xl bg-card border border-border hover:bg-accent/50 transition-colors text-left group"
                    >
                      {(() => {
                        const CategoryIcon = getCategoryIcon(room.category);
                        return (
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getCategoryColor(room.category)} flex items-center justify-center mb-3`}>
                            <CategoryIcon size={18} className="text-white" />
                          </div>
                        );
                      })()}
                      <p className="font-medium text-sm">{room.name}</p>
                      <p className="text-xs text-muted-foreground">{room.participant_count} online</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
