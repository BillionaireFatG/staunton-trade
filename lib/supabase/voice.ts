import { supabase } from '@/lib/supabase';

export interface VoiceRoom {
  id: string;
  name: string;
  category: string;
  emoji: string;
  agora_channel_name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
}

export interface VoiceParticipant {
  id: string;
  room_id: string;
  user_id: string;
  is_muted: boolean;
  is_speaking: boolean;
  joined_at: string;
  profile?: {
    id: string;
    full_name: string | null;
    company_name: string | null;
    verification_status: string | null;
    role: string[] | null;
    avatar_url: string | null;
  };
}

export interface VoiceRoomWithParticipants extends VoiceRoom {
  participant_count: number;
  participants: VoiceParticipant[];
  verified_count: number;
}

/**
 * Get all public voice rooms
 */
export async function getVoiceRooms(): Promise<VoiceRoom[]> {
  const { data, error } = await supabase
    .from('voice_rooms')
    .select('*')
    .eq('is_public', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching voice rooms:', error);
    return [];
  }
  return data || [];
}

/**
 * Get voice rooms with participant counts
 */
export async function getVoiceRoomsWithCounts(): Promise<VoiceRoomWithParticipants[]> {
  try {
    const rooms = await getVoiceRooms();
    
    if (rooms.length === 0) {
      return [];
    }
    
    const roomsWithCounts = await Promise.all(
      rooms.map(async (room) => {
        try {
          const participants = await getRoomParticipants(room.id);
          const verifiedCount = participants.filter(
            (p) => p.profile?.verification_status === 'verified'
          ).length;
          
          return {
            ...room,
            participant_count: participants.length,
            participants: participants.slice(0, 4), // First 4 for avatar stack
            verified_count: verifiedCount,
          };
        } catch (error) {
          console.error(`Error loading participants for room ${room.id}:`, error);
          return {
            ...room,
            participant_count: 0,
            participants: [],
            verified_count: 0,
          };
        }
      })
    );
    
    return roomsWithCounts;
  } catch (error) {
    console.error('Error in getVoiceRoomsWithCounts:', error);
    return [];
  }
}

/**
 * Get a specific voice room by ID
 */
export async function getVoiceRoom(roomId: string): Promise<VoiceRoom | null> {
  const { data, error } = await supabase
    .from('voice_rooms')
    .select('*')
    .eq('id', roomId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return data;
}

/**
 * Get all participants in a room with their profiles
 */
export async function getRoomParticipants(roomId: string): Promise<VoiceParticipant[]> {
  const { data, error } = await supabase
    .from('voice_participants')
    .select(`
      *,
      profile:profiles(
        id,
        full_name,
        company_name,
        verification_status,
        role,
        avatar_url
      )
    `)
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching room participants:', error);
    return [];
  }
  return data || [];
}

/**
 * Join a voice room
 */
export async function joinRoom(roomId: string, userId: string): Promise<VoiceParticipant> {
  const { data, error } = await supabase
    .from('voice_participants')
    .insert({
      room_id: roomId,
      user_id: userId,
      is_muted: false,
    })
    .select(`
      *,
      profile:profiles(
        id,
        full_name,
        company_name,
        verification_status,
        role,
        avatar_url
      )
    `)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Leave a voice room
 */
export async function leaveRoom(roomId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('voice_participants')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);
  
  if (error) throw error;
}

/**
 * Update mute status
 */
export async function updateMuteStatus(
  roomId: string,
  userId: string,
  isMuted: boolean
): Promise<void> {
  const { error } = await supabase
    .from('voice_participants')
    .update({ is_muted: isMuted })
    .eq('room_id', roomId)
    .eq('user_id', userId);
  
  if (error) throw error;
}

/**
 * Update speaking status
 */
export async function updateSpeakingStatus(
  roomId: string,
  userId: string,
  isSpeaking: boolean
): Promise<void> {
  const { error } = await supabase
    .from('voice_participants')
    .update({ is_speaking: isSpeaking })
    .eq('room_id', roomId)
    .eq('user_id', userId);
  
  if (error) throw error;
}

/**
 * Get current user's active room (if any)
 */
export async function getUserActiveRoom(userId: string): Promise<VoiceParticipant | null> {
  const { data, error } = await supabase
    .from('voice_participants')
    .select(`
      *,
      profile:profiles(
        id,
        full_name,
        company_name,
        verification_status,
        role,
        avatar_url
      )
    `)
    .eq('user_id', userId)
    .single();
  
  if (error) {
    // Return null for any error (table doesn't exist, no rows, etc.)
    return null;
  }
  
  return data;
}

/**
 * Subscribe to room participant changes
 */
export function subscribeToRoom(roomId: string, callback: () => void) {
  const channel = supabase
    .channel(`voice_room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'voice_participants',
        filter: `room_id=eq.${roomId}`,
      },
      callback
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Subscribe to all voice rooms changes
 */
export function subscribeToAllRooms(callback: () => void) {
  const channel = supabase
    .channel('voice_rooms_all')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'voice_participants',
      },
      callback
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}

export interface VoiceRoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  message_type: string;
  reply_to: string | null;
  created_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    company_name: string | null;
    verification_status: string | null;
  };
}

export async function getRoomMessages(roomId: string, limit = 50): Promise<VoiceRoomMessage[]> {
  const { data, error } = await supabase
    .from('voice_room_messages')
    .select(`
      *,
      profile:profiles(
        full_name,
        avatar_url,
        company_name,
        verification_status
      )
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching room messages:', error);
    return [];
  }
  return data || [];
}

export async function sendRoomMessage(roomId: string, userId: string, content: string): Promise<VoiceRoomMessage | null> {
  const { data, error } = await supabase
    .from('voice_room_messages')
    .insert({
      room_id: roomId,
      user_id: userId,
      content,
      message_type: 'text',
    })
    .select(`
      *,
      profile:profiles(
        full_name,
        avatar_url,
        company_name,
        verification_status
      )
    `)
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }
  return data;
}

export function subscribeToRoomMessages(roomId: string, callback: (message: VoiceRoomMessage) => void) {
  const channel = supabase
    .channel(`voice_room_messages:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'voice_room_messages',
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        const { data } = await supabase
          .from('voice_room_messages')
          .select(`
            *,
            profile:profiles(
              full_name,
              avatar_url,
              company_name,
              verification_status
            )
          `)
          .eq('id', payload.new.id)
          .single();
        
        if (data) {
          callback(data);
        }
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}

