'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useUnreadMessages() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUnreadCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setUnreadCount(0);
          setLoading(false);
          return;
        }

        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('receiver_id', user.id)
          .eq('read', false);

        if (error) throw error;
        
        if (mounted) {
          setUnreadCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUnreadCount();

    // Subscribe to new messages
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel('unread-messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            // Refetch count on any message change
            fetchUnreadCount();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    setupSubscription();

    return () => {
      mounted = false;
    };
  }, []);

  return { unreadCount, loading };
}

export default useUnreadMessages;


