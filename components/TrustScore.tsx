'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Star,
  StarHalf,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Award,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  Crown,
  Gem,
  Medal,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

// Trust Level Configuration
export const TRUST_LEVELS = {
  elite: {
    label: 'Elite Trader',
    minScore: 4.8,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: Crown,
    description: 'Top-tier verified trader with exceptional track record',
  },
  premium: {
    label: 'Premium',
    minScore: 4.0,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    icon: Gem,
    description: 'Highly trusted trader with strong reputation',
  },
  verified: {
    label: 'Verified',
    minScore: 3.0,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    icon: ShieldCheck,
    description: 'Identity verified with good standing',
  },
  standard: {
    label: 'Standard',
    minScore: 2.0,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    icon: Shield,
    description: 'Active trader building reputation',
  },
  new: {
    label: 'New',
    minScore: 0,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-border',
    icon: Info,
    description: 'New to the platform',
  },
  warning: {
    label: 'Caution',
    minScore: -1,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    icon: AlertTriangle,
    description: 'Some concerns flagged - proceed with caution',
  },
  blocked: {
    label: 'Blocked',
    minScore: -2,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    icon: ShieldX,
    description: 'Account restricted due to policy violations',
  },
} as const;

export type TrustLevel = keyof typeof TRUST_LEVELS;

// Get trust level from score
export function getTrustLevel(score: number, isBlocked?: boolean, hasWarning?: boolean): TrustLevel {
  if (isBlocked) return 'blocked';
  if (hasWarning) return 'warning';
  if (score >= 4.8) return 'elite';
  if (score >= 4.0) return 'premium';
  if (score >= 3.0) return 'verified';
  if (score >= 2.0) return 'standard';
  return 'new';
}

// Star Rating Component
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false,
  animated = true,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < maxRating; i++) {
    if (i < fullStars) {
      stars.push(
        <motion.div
          key={i}
          initial={animated ? { scale: 0, rotate: -180 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
        >
          <Star className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')} />
        </motion.div>
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <motion.div
          key={i}
          initial={animated ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <Star className={cn(sizeClasses[size], 'text-muted-foreground/30')} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={cn(sizeClasses[size], 'fill-amber-400 text-amber-400')} />
          </div>
        </motion.div>
      );
    } else {
      stars.push(
        <Star key={i} className={cn(sizeClasses[size], 'text-muted-foreground/30')} />
      );
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-foreground tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

// Verified Badge Component
interface VerifiedBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function VerifiedBadge({ isVerified, size = 'md', showLabel = false }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (!isVerified) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ShieldCheck className={cn(sizeClasses[size], 'text-blue-500')} />
            </motion.div>
            {showLabel && (
              <span className="text-xs font-medium text-blue-500">Verified</span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Identity verified by Staunton</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Trust Badge Component (Compact)
interface TrustBadgeProps {
  score: number;
  isVerified?: boolean;
  isBlocked?: boolean;
  hasWarning?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

export function TrustBadge({
  score,
  isVerified = false,
  isBlocked = false,
  hasWarning = false,
  size = 'md',
  showScore = true,
  className,
}: TrustBadgeProps) {
  const level = getTrustLevel(score, isBlocked, hasWarning);
  const config = TRUST_LEVELS[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5',
    lg: 'text-sm px-2.5 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              'inline-flex items-center rounded-full font-medium border',
              sizeClasses[size],
              config.bgColor,
              config.borderColor,
              config.color,
              className
            )}
          >
            <Icon size={iconSizes[size]} />
            {showScore && (
              <span className="tabular-nums">{score.toFixed(1)}</span>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Full Trust Score Card
interface TrustScoreCardProps {
  name: string;
  score: number;
  totalDeals: number;
  successRate: number;
  memberSince: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  hasWarning?: boolean;
  recentTrend?: 'up' | 'down' | 'stable';
  badges?: string[];
  className?: string;
}

export function TrustScoreCard({
  name,
  score,
  totalDeals,
  successRate,
  memberSince,
  isVerified = false,
  isBlocked = false,
  hasWarning = false,
  recentTrend = 'stable',
  badges = [],
  className,
}: TrustScoreCardProps) {
  const level = getTrustLevel(score, isBlocked, hasWarning);
  const config = TRUST_LEVELS[level];
  const LevelIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-5 rounded-xl border bg-card',
        config.borderColor,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            config.bgColor
          )}>
            <LevelIcon size={24} className={config.color} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{name}</h3>
              <VerifiedBadge isVerified={isVerified} size="sm" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="secondary" className={cn('text-[10px]', config.color, config.bgColor)}>
                {config.label}
              </Badge>
              {recentTrend === 'up' && (
                <TrendingUp size={12} className="text-green-500" />
              )}
              {recentTrend === 'down' && (
                <TrendingDown size={12} className="text-red-500" />
              )}
            </div>
          </div>
        </div>
        
        {/* Score Display */}
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground tabular-nums">
            {score.toFixed(1)}
          </div>
          <StarRating rating={score} size="sm" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
        <div className="text-center">
          <p className="text-xl font-semibold text-foreground tabular-nums">{totalDeals}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Deals</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-foreground tabular-nums">{successRate}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Success Rate</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-foreground tabular-nums">{memberSince}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Member Since</p>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Achievements</p>
          <div className="flex flex-wrap gap-1.5">
            {badges.map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Award size={10} />
                  {badge}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Banner */}
      {hasWarning && !isBlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-start gap-2"
        >
          <AlertTriangle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-500">Proceed with caution</p>
            <p className="text-xs text-orange-500/80">This account has some flagged concerns</p>
          </div>
        </motion.div>
      )}

      {/* Blocked Banner */}
      {isBlocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2"
        >
          <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-500">Account Restricted</p>
            <p className="text-xs text-red-500/80">This account has been blocked due to policy violations</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Trust Indicator for Tables (Minimal)
interface TrustIndicatorProps {
  score: number;
  isVerified?: boolean;
  size?: 'sm' | 'md';
}

export function TrustIndicator({ score, isVerified = false, size = 'sm' }: TrustIndicatorProps) {
  const level = getTrustLevel(score);
  const config = TRUST_LEVELS[level];

  return (
    <div className="flex items-center gap-1.5">
      <StarRating rating={score} size={size} animated={false} />
      {isVerified && <VerifiedBadge isVerified size={size} />}
    </div>
  );
}

export default TrustScoreCard;
