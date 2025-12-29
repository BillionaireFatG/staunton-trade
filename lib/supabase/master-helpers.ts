/**
 * MASTER SUPABASE HELPERS FILE
 * 
 * This file contains ALL helper functions for:
 * - Profile management
 * - Global chat
 * - Direct messages
 * - Verification
 * - Storage (avatars, documents)
 */

import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ============================================================================
// TYPES
// ============================================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: string[] | null;
  verification_status: 'unverified' | 'pending' | 'verified';
  verification_requested_at: string | null;
  verified_at: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlobalMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    id: string;
    full_name: string | null;
    company_name: string | null;
    avatar_url: string | null;
    role: string[] | null;
    verification_status: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  created_at: string;
  other_user?: Profile;
  unread_count?: number;
  last_message?: Message;
}

// ============================================================================
// PROFILE FUNCTIONS
// ============================================================================

/**
 * Get the current user's profile
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching current profile:', error);
    return null;
  }
}

/**
 * Get any user's public profile by ID
 */
export async function getPublicProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return null;
  }
}

/**
 * Create a new profile (called after signup)
 */
export async function createProfile(userId: string, profileData: Partial<Profile>): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    return null;
  }
}

/**
 * Update existing profile
 */
export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}

/**
 * Search profiles by name or company
 */
export async function searchProfiles(query: string, limit = 20): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,company_name.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching profiles:', error);
    return [];
  }
}

/**
 * Get all verified profiles
 */
export async function getVerifiedProfiles(limit = 50): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('verification_status', 'verified')
      .order('verified_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching verified profiles:', error);
    return [];
  }
}

// ============================================================================
// STORAGE FUNCTIONS (Avatars & Documents)
// ============================================================================

/**
 * Upload avatar to Supabase storage
 */
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
}

/**
 * Delete avatar from storage
 */
export async function deleteAvatar(avatarUrl: string): Promise<boolean> {
  try {
    const urlParts = avatarUrl.split('/avatars/');
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return false;
  }
}

/**
 * Upload verification documents
 */
export async function uploadVerificationDocs(userId: string, files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  try {
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('verification-docs').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }
    }

    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading verification docs:', error);
    return uploadedUrls;
  }
}

// ============================================================================
// VERIFICATION FUNCTIONS
// ============================================================================

/**
 * Request verification
 */
export async function requestVerification(userId: string, documents: string[]): Promise<boolean> {
  try {
    const { error: requestError } = await supabase
      .from('verification_requests')
      .insert({
        user_id: userId,
        documents,
        status: 'pending',
      });

    if (requestError) throw requestError;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        verification_status: 'pending',
        verification_requested_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Error requesting verification:', error);
    return false;
  }
}

// ============================================================================
// GLOBAL CHAT FUNCTIONS
// ============================================================================

/**
 * Send a message to the global chat
 */
export async function sendGlobalMessage(senderId: string, content: string): Promise<GlobalMessage | null> {
  try {
    const { data, error } = await supabase
      .from('global_messages')
      .insert({
        sender_id: senderId,
        content: content.trim(),
      })
      .select(`
        *,
        sender:profiles(id, full_name, company_name, avatar_url, role, verification_status)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending global message:', error);
    return null;
  }
}

/**
 * Get recent global messages
 */
export async function getGlobalMessages(limit = 100): Promise<GlobalMessage[]> {
  try {
    const { data, error } = await supabase
      .from('global_messages')
      .select(`
        *,
        sender:profiles(id, full_name, company_name, avatar_url, role, verification_status)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).reverse();
  } catch (error) {
    console.error('Error fetching global messages:', error);
    return [];
  }
}

/**
 * Get older global messages (for pagination)
 */
export async function getOlderGlobalMessages(beforeTimestamp: string, limit = 50): Promise<GlobalMessage[]> {
  try {
    const { data, error } = await supabase
      .from('global_messages')
      .select(`
        *,
        sender:profiles(id, full_name, company_name, avatar_url, role, verification_status)
      `)
      .lt('created_at', beforeTimestamp)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).reverse();
  } catch (error) {
    console.error('Error fetching older global messages:', error);
    return [];
  }
}

/**
 * Subscribe to new global messages (Realtime)
 */
export function subscribeToGlobalChat(callback: (message: GlobalMessage) => void): RealtimeChannel {
  const channel = supabase
    .channel('global-chat')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'global_messages',
      },
      async (payload) => {
        const { data } = await supabase
          .from('global_messages')
          .select(`
            *,
            sender:profiles(id, full_name, company_name, avatar_url, role, verification_status)
          `)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          callback(data);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Delete a global message (user can only delete their own)
 */
export async function deleteGlobalMessage(messageId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('global_messages')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting global message:', error);
    return false;
  }
}

/**
 * Get online users count (approximate based on recent activity)
 */
export async function getOnlineUsersCount(): Promise<number> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('global_messages')
      .select('sender_id')
      .gte('created_at', fiveMinutesAgo);

    if (error) throw error;
    
    const uniqueSenders = new Set((data || []).map(m => m.sender_id));
    return uniqueSenders.size;
  } catch (error) {
    console.error('Error getting online users count:', error);
    return 0;
  }
}

/**
 * Get global chat statistics
 */
export async function getGlobalChatStats(): Promise<{
  totalMessages: number;
  activeUsers: number;
  messagesLast24h: number;
}> {
  try {
    const { count: totalMessages } = await supabase
      .from('global_messages')
      .select('*', { count: 'exact', head: true });

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: messagesLast24h } = await supabase
      .from('global_messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday);

    const { data: recentMessages } = await supabase
      .from('global_messages')
      .select('sender_id')
      .gte('created_at', yesterday);

    const activeUsers = new Set((recentMessages || []).map(m => m.sender_id)).size;

    return {
      totalMessages: totalMessages || 0,
      activeUsers,
      messagesLast24h: messagesLast24h || 0,
    };
  } catch (error) {
    console.error('Error getting global chat stats:', error);
    return {
      totalMessages: 0,
      activeUsers: 0,
      messagesLast24h: 0,
    };
  }
}

// ============================================================================
// DIRECT MESSAGE FUNCTIONS
// ============================================================================

/**
 * Get or create a conversation between two users
 */
export async function getOrCreateConversation(user1Id: string, user2Id: string): Promise<string | null> {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${user1Id},participant_2.eq.${user2Id}),and(participant_1.eq.${user2Id},participant_2.eq.${user1Id})`)
      .single();

    if (existing) return existing.id;

    const { data: newConv, error: createError } = await supabase
      .from('conversations')
      .insert({ participant_1: user1Id, participant_2: user2Id })
      .select('id')
      .single();

    if (createError) throw createError;
    return newConv?.id || null;
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    return null;
  }
}

/**
 * Send a direct message
 */
export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: senderId, content })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

/**
 * Mark messages as read
 */
export async function markAsRead(conversationId: string, userId: string): Promise<void> {
  try {
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}

/**
 * Get all conversations for a user
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant_1_profile:profiles!conversations_participant_1_fkey(*),
        participant_2_profile:profiles!conversations_participant_2_fkey(*)
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    const conversationsWithData = await Promise.all(
      (data || []).map(async (conv: any) => {
        const otherUser = conv.participant_1 === userId ? conv.participant_2_profile : conv.participant_1_profile;
        
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .neq('sender_id', userId)
          .eq('read', false);

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...conv,
          other_user: otherUser,
          unread_count: count || 0,
          last_message: lastMsg,
        };
      })
    );

    return conversationsWithData;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string, limit = 50): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(*)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []).reverse();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

/**
 * Get total unread message count
 */
export async function getTotalUnreadCount(userId: string): Promise<number> {
  try {
    const conversations = await getConversations(userId);
    return conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

/**
 * Subscribe to conversation messages (Realtime)
 */
export function subscribeToConversation(
  conversationId: string,
  callback: (message: Message) => void
): RealtimeChannel {
  const channel = supabase
    .channel(`conversation-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      async (payload) => {
        const { data } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles(*)
          `)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          callback(data);
        }
      }
    )
    .subscribe();

  return channel;
}

/**
 * Subscribe to conversation list updates (Realtime)
 */
export function subscribeToConversations(
  userId: string,
  callback: () => void
): RealtimeChannel {
  const channel = supabase
    .channel('conversations-list')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `or(participant_1.eq.${userId},participant_2.eq.${userId})`,
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      callback
    )
    .subscribe();

  return channel;
}

