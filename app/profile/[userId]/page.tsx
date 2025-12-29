'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { getOrCreateConversation } from '@/lib/supabase/master-helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileBadge } from '@/components/profile/ProfileBadge';
import { Loader2, MessageCircle, MapPin, Building2 } from 'lucide-react';
import type { Profile } from '@/types/profile';

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [params.userId]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!user || !profile) return;

    setStartingChat(true);
    const convId = await getOrCreateConversation(user.id, profile.id);
    if (convId) {
      router.push('/messages');
    }
    setStartingChat(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-neutral-500">Profile not found</p>
      </div>
    );
  }

  const initials = profile.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                {profile.full_name}
              </h1>

              {profile.company_name && (
                <div className="flex items-center gap-2 text-neutral-600 mb-3">
                  <Building2 size={18} />
                  <span className="text-lg">{profile.company_name}</span>
                </div>
              )}

              <ProfileBadge
                roles={profile.role}
                verified={profile.verification_status === 'verified'}
              />

              {profile.location && (
                <div className="flex items-center gap-2 text-neutral-500 mt-3">
                  <MapPin size={16} />
                  <span>{profile.location}</span>
                </div>
              )}

              {user && user.id !== profile.id && (
                <Button
                  onClick={handleStartChat}
                  disabled={startingChat}
                  className="mt-4"
                >
                  {startingChat ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" />Starting Chat...</>
                  ) : (
                    <><MessageCircle size={16} className="mr-2" />Send Message</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {profile.bio && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-neutral-600 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

