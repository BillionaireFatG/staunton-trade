'use client';

import { VoiceParticipant } from '@/lib/supabase/voice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, User, MicOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ParticipantCardProps {
  participant: VoiceParticipant;
  currentUserId?: string;
}

export function ParticipantCard({ participant, currentUserId }: ParticipantCardProps) {
  const router = useRouter();
  const profile = participant.profile;
  const isCurrentUser = participant.user_id === currentUserId;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'buyer':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'seller':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'trader':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const handleSendMessage = () => {
    router.push(`/messages?user=${participant.user_id}`);
  };

  const handleViewProfile = () => {
    router.push(`/profile/${participant.user_id}`);
  };

  return (
    <div className="relative group">
      <div className={`p-4 rounded-lg border transition-all ${
        participant.is_speaking
          ? 'border-green-500 bg-green-500/5 shadow-lg shadow-green-500/20'
          : 'border-border bg-card hover:bg-accent/50'
      }`}>
        {/* Avatar with status */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-lg font-semibold">
                {profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {/* Online status dot */}
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-2 border-card" />
            
            {/* Speaking indicator */}
            {participant.is_speaking && (
              <div className="absolute -inset-1 rounded-full border-2 border-green-500 animate-pulse" />
            )}
            
            {/* Muted indicator */}
            {participant.is_muted && (
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                <MicOff size={12} className="text-white" />
              </div>
            )}
          </div>

          {/* Name and Company */}
          <div className="text-center w-full">
            <p className="font-medium text-sm truncate">
              {profile?.full_name || 'Unknown User'}
              {isCurrentUser && (
                <span className="text-xs text-muted-foreground ml-1">(You)</span>
              )}
            </p>
            {profile?.company_name && (
              <p className="text-xs text-muted-foreground truncate">
                {profile.company_name}
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {/* Verification Badge */}
            {profile?.verification_status === 'verified' && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-500 border-green-500/20">
                ✓ Verified
              </Badge>
            )}
            
            {/* Role Badges */}
            {profile?.role && profile.role.length > 0 && (
              <>
                {profile.role.map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${getRoleBadgeColor(role)}`}
                  >
                    {role}
                  </Badge>
                ))}
              </>
            )}
          </div>

          {/* Speaking Indicator Text */}
          {participant.is_speaking && (
            <div className="flex items-center gap-1 text-xs text-green-500 font-medium">
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
              Speaking
            </div>
          )}
        </div>

        {/* Hover Actions */}
        {!isCurrentUser && (
          <div className="absolute inset-0 bg-background/95 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSendMessage}
              className="h-8"
            >
              <MessageSquare size={14} className="mr-1" />
              Message
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewProfile}
              className="h-8"
            >
              <User size={14} className="mr-1" />
              Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}




