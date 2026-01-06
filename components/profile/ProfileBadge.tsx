import { Badge } from '@/components/ui/badge';
import { VerificationBadge } from './VerificationBadge';
import type { UserRole } from '@/types/profile';

interface ProfileBadgeProps {
  roles: UserRole[];
  verified?: boolean;
  showVerification?: boolean;
}

const roleColors: Record<UserRole, string> = {
  buyer: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  seller: 'bg-green-100 text-green-700 hover:bg-green-100',
  trader: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
};

export function ProfileBadge({ roles, verified = false, showVerification = true }: ProfileBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {roles.map((role) => (
        <Badge key={role} variant="secondary" className={`text-xs ${roleColors[role]}`}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Badge>
      ))}
      {showVerification && verified && <VerificationBadge verified={verified} size="sm" />}
    </div>
  );
}






