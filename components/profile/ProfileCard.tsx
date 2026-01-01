import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileBadge } from './ProfileBadge';
import { MapPin, Building2 } from 'lucide-react';
import type { Profile } from '@/types/profile';

interface ProfileCardProps {
  profile: Profile;
  showBio?: boolean;
}

export function ProfileCard({ profile, showBio = true }: ProfileCardProps) {
  const initials = profile.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-neutral-900 truncate">
                {profile.full_name}
              </h3>
            </div>
            
            {profile.company_name && (
              <div className="flex items-center gap-1.5 text-sm text-neutral-600 mb-2">
                <Building2 size={14} />
                <span className="truncate">{profile.company_name}</span>
              </div>
            )}
            
            <ProfileBadge 
              roles={profile.role} 
              verified={profile.verification_status === 'verified'} 
            />
            
            {profile.location && (
              <div className="flex items-center gap-1.5 text-sm text-neutral-500 mt-2">
                <MapPin size={14} />
                <span>{profile.location}</span>
              </div>
            )}
            
            {showBio && profile.bio && (
              <p className="text-sm text-neutral-600 mt-3 line-clamp-3">{profile.bio}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



