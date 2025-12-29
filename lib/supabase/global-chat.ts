import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
    return (data || []).reverse(); // Reverse to show oldest first
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
    const { data, error} = await supabase
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
export function subscribeToGlobalChat(
  callback: (message: GlobalMessage) => void
): RealtimeChannel {
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
        // Fetch the complete message with sender info
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
 * Users who sent a message in the last 5 minutes
 */
export async function getOnlineUsersCount(): Promise<number> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('global_messages')
      .select('sender_id')
      .gte('created_at', fiveMinutesAgo);

    if (error) throw error;
    
    // Get unique sender IDs
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
    // Total messages
    const { count: totalMessages } = await supabase
      .from('global_messages')
      .select('*', { count: 'exact', head: true });

    // Messages in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: messagesLast24h } = await supabase
      .from('global_messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday);

    // Active users (sent message in last 24h)
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

