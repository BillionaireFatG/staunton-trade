'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Phone, Settings as SettingsIcon, Volume2 } from 'lucide-react';
import { getUserActiveRoom, getVoiceRoom, leaveRoom } from '@/lib/supabase/voice';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VoiceStatusBarProps {
  onLeave?: () => void;
}

export function VoiceStatusBar({ onLeave }: VoiceStatusBarProps) {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkActiveRoom = async () => {
      try {
        const room = await getUserActiveRoom(user.id);
        setActiveRoom(room);

        if (room) {
          const details = await getVoiceRoom(room.room_id);
          setRoomDetails(details);
          setIsMuted(room.is_muted);
        }
      } catch (error) {
        // Silently fail if tables don't exist yet
        setActiveRoom(null);
        setRoomDetails(null);
      }
    };

    checkActiveRoom();

    // Poll for updates every 5 seconds
    const interval = setInterval(checkActiveRoom, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const handleLeave = async () => {
    if (!user || !activeRoom) return;

    try {
      await leaveRoom(activeRoom.room_id, user.id);
      setActiveRoom(null);
      setRoomDetails(null);
      onLeave?.();
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement actual mute toggle with Agora
  };

  if (!activeRoom || !roomDetails) {
    return (
      <a
        href="/voice-rooms"
        className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent/80 text-sm font-medium transition-colors"
      >
        Browse Voice Rooms
      </a>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
      <span className="text-lg">{roomDetails.emoji}</span>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{roomDetails.name}</span>
        <span className="text-xs text-muted-foreground">
          {participantCount || 1} online
        </span>
      </div>
      
      <div className="flex items-center gap-1 ml-2">
        <Button
          size="sm"
          variant={isMuted ? 'destructive' : 'ghost'}
          className="h-8 w-8 p-0"
          onClick={handleToggleMute}
        >
          {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={handleLeave}
        >
          <Phone size={16} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <SettingsIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Volume2 size={14} className="mr-2" />
              Audio Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon size={14} className="mr-2" />
              Room Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

