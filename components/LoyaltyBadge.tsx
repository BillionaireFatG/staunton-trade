'use client';

import { Crown, Sparkles, Star, Zap, Gift, Award, Truck, FileCheck, Warehouse } from 'lucide-react';
import type { Badge } from '@/types/database';

interface LoyaltyBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  size?: 'sm' | 'md' | 'lg';
}

const tierConfig = {
  bronze: {
    color: 'from-[#cd7f32] to-[#8b5a2b]',
    bg: 'bg-[#cd7f32]/10',
    border: 'border-[#cd7f32]/30',
    text: 'text-[#cd7f32]',
    icon: Star,
    label: 'Bronze',
    nextTier: 1000,
  },
  silver: {
    color: 'from-[#c0c0c0] to-[#808080]',
    bg: 'bg-[#c0c0c0]/10',
    border: 'border-[#c0c0c0]/30',
    text: 'text-[#c0c0c0]',
    icon: Zap,
    label: 'Silver',
    nextTier: 5000,
  },
  gold: {
    color: 'from-[#ffd700] to-[#daa520]',
    bg: 'bg-[#ffd700]/10',
    border: 'border-[#ffd700]/30',
    text: 'text-[#ffd700]',
    icon: Award,
    label: 'Gold',
    nextTier: 20000,
  },
  platinum: {
    color: 'from-[#e5e4e2] to-[#a0a0a0]',
    bg: 'bg-[#e5e4e2]/10',
    border: 'border-[#e5e4e2]/30',
    text: 'text-[#e5e4e2]',
    icon: Crown,
    label: 'Platinum',
    nextTier: Infinity,
  },
};

export function LoyaltyBadge({ tier, points, size = 'md' }: LoyaltyBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-[11px]',
    lg: 'px-4 py-2 text-[13px]',
  };

  const iconSizes = { sm: 12, md: 14, lg: 18 };

  const progressToNext = tier === 'platinum' 
    ? 100 
    : Math.min(100, (points / config.nextTier) * 100);

  return (
    <div className={`inline-flex items-center gap-2 rounded-full ${config.bg} border ${config.border} ${sizeClasses[size]}`}>
      <div className={`bg-gradient-to-br ${config.color} p-1 rounded-full`}>
        <Icon size={iconSizes[size]} className="text-white" />
      </div>
      <span className={`font-semibold ${config.text}`}>{config.label}</span>
      <span className="text-[#666]">•</span>
      <span className="font-mono text-white">{points.toLocaleString()} pts</span>
    </div>
  );
}

// Service badges that users can collect
const serviceBadges: Record<Badge, { icon: any; label: string; color: string; bg: string }> = {
  verified_trader: { icon: FileCheck, label: 'Verified Trader', color: 'text-[#10b981]', bg: 'bg-[#10b981]/10' },
  staunton_logistics: { icon: Truck, label: 'Staunton Logistics', color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/10' },
  staunton_verification: { icon: FileCheck, label: 'Staunton Verification', color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10' },
  staunton_storage: { icon: Warehouse, label: 'Staunton Storage', color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
  premium_member: { icon: Crown, label: 'Premium Member', color: 'text-[#ffd700]', bg: 'bg-[#ffd700]/10' },
  top_performer: { icon: Award, label: 'Top Performer', color: 'text-[#ec4899]', bg: 'bg-[#ec4899]/10' },
  early_adopter: { icon: Sparkles, label: 'Early Adopter', color: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]/10' },
  high_volume: { icon: Zap, label: 'High Volume', color: 'text-[#f97316]', bg: 'bg-[#f97316]/10' },
  perfect_record: { icon: Star, label: 'Perfect Record', color: 'text-[#84cc16]', bg: 'bg-[#84cc16]/10' },
  fast_payer: { icon: Gift, label: 'Fast Payer', color: 'text-[#14b8a6]', bg: 'bg-[#14b8a6]/10' },
};

export function ServiceBadge({ badge, size = 'sm' }: { badge: Badge; size?: 'sm' | 'md' }) {
  const config = serviceBadges[badge];
  if (!config) return null;
  
  const Icon = config.icon;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg} border border-current/20 ${config.color}`}>
      <Icon size={iconSize} />
      <span className={`font-medium ${size === 'sm' ? 'text-[10px]' : 'text-[11px]'}`}>{config.label}</span>
    </div>
  );
}

export function BadgeCollection({ badges, maxDisplay = 3 }: { badges: Badge[]; maxDisplay?: number }) {
  const displayedBadges = badges.slice(0, maxDisplay);
  const remainingCount = badges.length - maxDisplay;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayedBadges.map((badge) => (
        <ServiceBadge key={badge} badge={badge} size="sm" />
      ))}
      {remainingCount > 0 && (
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#262626] text-[10px] font-medium text-[#888]">
          +{remainingCount} more
        </div>
      )}
    </div>
  );
}


