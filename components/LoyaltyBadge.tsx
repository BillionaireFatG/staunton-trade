'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getUserLoyalty, TIER_CONFIG, LoyaltyTier, UserLoyalty } from '@/lib/supabase/loyalty';
import { Crown, Sparkles, Medal, Star, Gem, Trophy, type LucideIcon } from 'lucide-react';

const TIER_ICONS: Record<string, LucideIcon> = {
  medal: Medal,
  star: Star,
  crown: Crown,
  gem: Gem,
  trophy: Trophy,
};

const getTierIcon = (iconType: string): LucideIcon => {
  return TIER_ICONS[iconType] || Star;
};

interface LoyaltyBadgeProps {
  variant?: 'default' | 'compact' | 'full';
  className?: string;
}

export default function LoyaltyBadge({ variant = 'default', className = '' }: LoyaltyBadgeProps) {
  const { user } = useAuth();
  const [loyalty, setLoyalty] = useState<UserLoyalty | null>(null);

  useEffect(() => {
    if (user) {
      loadLoyalty();
    }
  }, [user]);

  const loadLoyalty = async () => {
    if (!user) return;
    const data = await getUserLoyalty(user.id);
    setLoyalty(data);
  };

  const tier: LoyaltyTier = loyalty?.tier || 'bronze';
  const config = TIER_CONFIG[tier];
  const points = loyalty?.available_points || 0;
  const TierIcon = getTierIcon(config.iconType);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <TierIcon size={14} />
        <span className="text-xs font-medium">{points.toLocaleString()}</span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${config.gradient} text-white ${className}`}>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <TierIcon size={20} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{config.name} Member</p>
          <p className="text-xs text-white/80">{points.toLocaleString()} points</p>
        </div>
        <Sparkles className="w-5 h-5 text-white/60" />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} text-white text-sm ${className}`}>
      <TierIcon size={14} />
      <span className="font-medium">{config.name}</span>
      <span className="text-white/70">•</span>
      <span className="font-bold">{points.toLocaleString()}</span>
      <span className="text-white/70 text-xs">pts</span>
    </div>
  );
}

