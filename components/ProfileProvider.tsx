'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthProvider';
import type { Profile } from '@/types/profile';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  updateProfile: async () => false,
});

export const useProfile = () => useContext(ProfileContext);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        // Silently handle - table might not exist yet or other DB issues
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      // Silently handle all errors - profile system is optional until migration runs
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile();
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();

    // Subscribe to profile changes
    const subscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user?.id}`,
      }, fetchProfile)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile: fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

