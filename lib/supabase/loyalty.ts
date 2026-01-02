import { supabase } from '@/lib/supabase';

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface UserLoyalty {
  id: string;
  user_id: string;
  tier: LoyaltyTier;
  total_points: number;
  available_points: number;
  lifetime_points: number;
  deals_completed: number;
  total_volume_usd: number;
  current_streak: number;
  longest_streak: number;
  tier_progress: number;
  next_tier_threshold: number;
  joined_at: string;
  tier_updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: string;
  description: string;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  tier_required: LoyaltyTier;
  icon: string;
  is_active: boolean;
  quantity_available: number | null;
  expires_at: string | null;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  status: string;
  redeemed_at: string;
  fulfilled_at: string | null;
  notes: string | null;
  reward?: Reward;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  points_reward: number;
  requirement_type: string;
  requirement_value: number;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 15000,
  diamond: 50000,
};

export const TIER_CONFIG: Record<LoyaltyTier, { name: string; color: string; gradient: string; iconType: 'medal' | 'star' | 'crown' | 'gem' | 'trophy' }> = {
  bronze: { 
    name: 'Bronze', 
    color: '#CD7F32', 
    gradient: 'from-amber-700 to-orange-600',
    iconType: 'medal' 
  },
  silver: { 
    name: 'Silver', 
    color: '#C0C0C0', 
    gradient: 'from-gray-400 to-slate-500',
    iconType: 'star' 
  },
  gold: { 
    name: 'Gold', 
    color: '#FFD700', 
    gradient: 'from-yellow-400 to-amber-500',
    iconType: 'crown' 
  },
  platinum: { 
    name: 'Platinum', 
    color: '#E5E4E2', 
    gradient: 'from-slate-300 to-zinc-400',
    iconType: 'gem' 
  },
  diamond: { 
    name: 'Diamond', 
    color: '#B9F2FF', 
    gradient: 'from-cyan-300 to-blue-400',
    iconType: 'trophy' 
  },
};

export async function getUserLoyalty(userId: string): Promise<UserLoyalty | null> {
  try {
    const { data, error } = await supabase
      .from('user_loyalty')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function getLoyaltyTransactions(userId: string, limit = 20): Promise<LoyaltyTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getRewards(): Promise<Reward[]> {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('points_cost', { ascending: true });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function redeemReward(userId: string, rewardId: string, pointsCost: number): Promise<boolean> {
  try {
    const { error } = await supabase.from('reward_redemptions').insert({
      user_id: userId,
      reward_id: rewardId,
      points_spent: pointsCost,
      status: 'pending',
    });

    if (error) return false;
    return true;
  } catch {
    return false;
  }
}

export async function getUserRedemptions(userId: string): Promise<RewardRedemption[]> {
  try {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .select('*, reward:rewards(*)')
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points_reward', { ascending: true });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function getUserAchievements(userId: string): Promise<UserAchievement[]> {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export function getNextTier(currentTier: LoyaltyTier): LoyaltyTier | null {
  const tiers: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const currentIndex = tiers.indexOf(currentTier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}

export function calculateProgress(points: number, currentTier: LoyaltyTier): number {
  const tiers: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex >= tiers.length - 1) return 100;
  
  const currentThreshold = TIER_THRESHOLDS[currentTier];
  const nextThreshold = TIER_THRESHOLDS[tiers[currentIndex + 1]];
  const progressPoints = points - currentThreshold;
  const rangePoints = nextThreshold - currentThreshold;
  
  return Math.min(100, Math.floor((progressPoints / rangePoints) * 100));
}

