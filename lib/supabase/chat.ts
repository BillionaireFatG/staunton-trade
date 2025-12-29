import { supabase } from '@/lib/supabase';
import type { Conversation, Message } from '@/types/profile';

export async function getOrCreateConversation(user1Id: string, user2Id: string): Promise<string | null> {
  try {
    // Check if conversation exists (either direction)
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${user1Id},participant_2.eq.${user2Id}),and(participant_1.eq.${user2Id},participant_2.eq.${user1Id})`)
      .single();

    if (existing) return existing.id;

    // Create new conversation
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

    // Get unread counts and last messages
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

export async function getTotalUnreadCount(userId: string): Promise<number> {
  try {
    const conversations = await getConversations(userId);
    return conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

