import { CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VerificationBadgeProps {
  verified: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ verified, size = 'md' }: VerificationBadgeProps) {
  if (!verified) return null;

  const sizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CheckCircle2
            size={sizes[size]}
            className="text-green-600 fill-green-100"
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified User</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


