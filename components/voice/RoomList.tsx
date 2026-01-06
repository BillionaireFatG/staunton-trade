'use client';

import { useState } from 'react';
import { VoiceRoomWithParticipants } from '@/lib/supabase/voice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle2 } from 'lucide-react';

interface RoomListProps {
  rooms: VoiceRoomWithParticipants[];
  selectedRoomId?: string;
  onRoomSelect: (roomId: string) => void;
  onJoinRoom: (roomId: string) => void;
  filterCategory?: string;
}

export function RoomList({
  rooms,
  selectedRoomId,
  onRoomSelect,
  onJoinRoom,
  filterCategory,
}: RoomListProps) {
  const [sortBy, setSortBy] = useState<'active' | 'category' | 'name'>('active');

  // Filter by category if specified
  let filteredRooms = filterCategory
    ? rooms.filter((room) => room.category === filterCategory)
    : rooms;

  // Sort rooms
  filteredRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'active':
        return b.participant_count - a.participant_count;
      case 'category':
        return a.category.localeCompare(b.category);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const categories = [
    { value: '', label: 'All' },
    { value: 'fuel', label: 'Fuel' },
    { value: 'metals', label: 'Metals' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'general', label: 'General' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header with filters */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Voice Rooms</h2>
        
        {/* Category Filter */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              size="sm"
              variant={filterCategory === cat.value ? 'default' : 'outline'}
              onClick={() => onRoomSelect(cat.value)}
              className="whitespace-nowrap"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={sortBy === 'active' ? 'secondary' : 'ghost'}
            onClick={() => setSortBy('active')}
            className="text-xs"
          >
            Most Active
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'category' ? 'secondary' : 'ghost'}
            onClick={() => setSortBy('category')}
            className="text-xs"
          >
            Category
          </Button>
          <Button
            size="sm"
            variant={sortBy === 'name' ? 'secondary' : 'ghost'}
            onClick={() => setSortBy('name')}
            className="text-xs"
          >
            Name
          </Button>
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No rooms available
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                selectedRoomId === room.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
              onClick={() => onRoomSelect(room.id)}
            >
              {/* Room Header */}
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{room.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{room.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {room.description}
                  </p>
                </div>
              </div>

              {/* Room Stats */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users size={12} />
                  <span>{room.participant_count} online</span>
                </div>
                
                {room.verified_count > 0 && (
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <CheckCircle2 size={12} />
                    <span>{room.verified_count} verified</span>
                  </div>
                )}

                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {room.category}
                </Badge>
              </div>

              {/* Participant Avatars */}
              {room.participants.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    {room.participants.slice(0, 4).map((participant) => (
                      <Avatar
                        key={participant.id}
                        className="h-6 w-6 border-2 border-card"
                      >
                        <AvatarImage src={participant.profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {participant.profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {room.participant_count > 4 && (
                    <span className="text-xs text-muted-foreground">
                      +{room.participant_count - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Join Button (on hover) */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoinRoom(room.id);
                  }}
                >
                  Join Room
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}




