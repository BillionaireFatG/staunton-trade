'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useProfile } from '@/components/ProfileProvider';
import { 
  getUserLoyalty, 
  getLoyaltyTransactions, 
  getRewards, 
  getAchievements,
  getUserAchievements,
  getUserRedemptions,
  redeemReward,
  getNextTier,
  calculateProgress,
  TIER_CONFIG,
  TIER_THRESHOLDS,
  UserLoyalty,
  LoyaltyTransaction,
  Reward,
  Achievement,
  UserAchievement,
  RewardRedemption,
  LoyaltyTier,
} from '@/lib/supabase/loyalty';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Gift, 
  Trophy, 
  Flame, 
  TrendingUp, 
  Star, 
  ChevronRight, 
  Lock, 
  Check,
  Zap,
  Target,
  Award,
  Sparkles,
  ArrowUp,
  Clock,
  BarChart3,
  Loader2,
  Medal,
  Gem,
  type LucideIcon
} from 'lucide-react';

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

const mockLoyalty: UserLoyalty = {
  id: '1',
  user_id: '1',
  tier: 'gold',
  total_points: 7500,
  available_points: 4200,
  lifetime_points: 12500,
  deals_completed: 23,
  total_volume_usd: 2500000,
  current_streak: 5,
  longest_streak: 14,
  tier_progress: 50,
  next_tier_threshold: 15000,
  joined_at: '2025-01-01',
  tier_updated_at: '2025-06-15',
};

const mockTransactions: LoyaltyTransaction[] = [
  { id: '1', user_id: '1', points: 500, transaction_type: 'earn', description: 'Completed Deal STN-001', reference_id: null, reference_type: null, created_at: '2025-12-28T10:00:00Z' },
  { id: '2', user_id: '1', points: -1000, transaction_type: 'redeem', description: 'Redeemed: Reduced Fees', reference_id: null, reference_type: null, created_at: '2025-12-27T15:30:00Z' },
  { id: '3', user_id: '1', points: 250, transaction_type: 'bonus', description: 'Weekly Streak Bonus', reference_id: null, reference_type: null, created_at: '2025-12-26T09:00:00Z' },
  { id: '4', user_id: '1', points: 750, transaction_type: 'earn', description: 'Completed Deal STN-002', reference_id: null, reference_type: null, created_at: '2025-12-25T14:20:00Z' },
  { id: '5', user_id: '1', points: 100, transaction_type: 'referral', description: 'Referral: John Doe joined', reference_id: null, reference_type: null, created_at: '2025-12-24T11:00:00Z' },
];

const mockRewards: Reward[] = [
  { id: '1', name: 'Priority Support', description: '24/7 priority customer support for 30 days', points_cost: 500, category: 'service', tier_required: 'bronze', icon: 'headphones', is_active: true, quantity_available: null, expires_at: null },
  { id: '2', name: 'Reduced Fees', description: '10% fee reduction on next deal', points_cost: 1000, category: 'discount', tier_required: 'silver', icon: 'wallet', is_active: true, quantity_available: null, expires_at: null },
  { id: '3', name: 'Analytics Pro', description: 'Access to advanced market analytics for 7 days', points_cost: 1500, category: 'feature', tier_required: 'silver', icon: 'chart', is_active: true, quantity_available: null, expires_at: null },
  { id: '4', name: 'Featured Listing', description: 'Get your next deal featured for 48 hours', points_cost: 2000, category: 'promotion', tier_required: 'gold', icon: 'star', is_active: true, quantity_available: null, expires_at: null },
  { id: '5', name: 'Verified Badge', description: 'Fast-track verification process', points_cost: 3000, category: 'service', tier_required: 'gold', icon: 'check', is_active: true, quantity_available: null, expires_at: null },
  { id: '6', name: 'VIP Webinar', description: 'Access to exclusive trading webinar', points_cost: 2500, category: 'education', tier_required: 'gold', icon: 'video', is_active: true, quantity_available: null, expires_at: null },
  { id: '7', name: 'Free Inspection', description: 'Complimentary cargo inspection on next deal', points_cost: 5000, category: 'service', tier_required: 'platinum', icon: 'search', is_active: true, quantity_available: null, expires_at: null },
  { id: '8', name: 'Premium Analytics', description: 'Lifetime premium analytics access', points_cost: 10000, category: 'feature', tier_required: 'platinum', icon: 'trending', is_active: true, quantity_available: null, expires_at: null },
];

const mockAchievements: Achievement[] = [
  { id: '1', name: 'First Trade', description: 'Complete your first deal', icon: 'flag', category: 'milestone', points_reward: 100, requirement_type: 'deals', requirement_value: 1 },
  { id: '2', name: 'Trusted Trader', description: 'Complete 10 deals successfully', icon: 'star', category: 'milestone', points_reward: 500, requirement_type: 'deals', requirement_value: 10 },
  { id: '3', name: 'Volume King', description: 'Trade over $1M in total volume', icon: 'crown', category: 'volume', points_reward: 1000, requirement_type: 'volume', requirement_value: 1000000 },
  { id: '4', name: 'Streak Master', description: 'Maintain a 7-day activity streak', icon: 'flame', category: 'engagement', points_reward: 250, requirement_type: 'streak', requirement_value: 7 },
  { id: '5', name: 'Verified Pro', description: 'Get your profile verified', icon: 'check', category: 'profile', points_reward: 200, requirement_type: 'verification', requirement_value: 1 },
  { id: '6', name: 'Deal Maker', description: 'Complete 50 deals', icon: 'briefcase', category: 'milestone', points_reward: 2000, requirement_type: 'deals', requirement_value: 50 },
];

const REWARD_ICONS: Record<string, LucideIcon> = {
  headphones: Award,
  wallet: Gift,
  chart: BarChart3,
  star: Star,
  check: Check,
  video: Award,
  search: Target,
  trending: TrendingUp,
};

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  flag: Award,
  star: Star,
  crown: Crown,
  flame: Flame,
  check: Check,
  briefcase: Trophy,
};

const getRewardIcon = (icon: string): LucideIcon => REWARD_ICONS[icon] || Gift;
const getAchievementIcon = (icon: string): LucideIcon => ACHIEVEMENT_ICONS[icon] || Award;

export default function LoyaltyPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [loyalty, setLoyalty] = useState<UserLoyalty | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<string[]>(['1', '4', '5']);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'achievements' | 'history'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user) {
        const [loyaltyData, transactionsData, rewardsData, achievementsData] = await Promise.all([
          getUserLoyalty(user.id),
          getLoyaltyTransactions(user.id),
          getRewards(),
          getAchievements(),
        ]);
        setLoyalty(loyaltyData || mockLoyalty);
        setTransactions(transactionsData.length > 0 ? transactionsData : mockTransactions);
        setRewards(rewardsData.length > 0 ? rewardsData : mockRewards);
        setAchievements(achievementsData.length > 0 ? achievementsData : mockAchievements);
      } else {
        setLoyalty(mockLoyalty);
        setTransactions(mockTransactions);
        setRewards(mockRewards);
        setAchievements(mockAchievements);
      }
    } catch (error) {
      console.error('Error loading loyalty data:', error);
      setLoyalty(mockLoyalty);
      setTransactions(mockTransactions);
      setRewards(mockRewards);
      setAchievements(mockAchievements);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!loyalty) return null;

  const tierConfig = TIER_CONFIG[loyalty.tier];
  const nextTier = getNextTier(loyalty.tier);
  const progressPercent = calculateProgress(loyalty.lifetime_points, loyalty.tier);
  const pointsToNext = nextTier ? TIER_THRESHOLDS[nextTier] - loyalty.lifetime_points : 0;

  const tierOrder: LoyaltyTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const currentTierIndex = tierOrder.indexOf(loyalty.tier);

  const canRedeem = (reward: Reward) => {
    const rewardTierIndex = tierOrder.indexOf(reward.tier_required);
    return currentTierIndex >= rewardTierIndex && loyalty.available_points >= reward.points_cost;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Hero Card - Fidelity Status */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tierConfig.gradient} p-8 text-white`}>
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="200" height="200" fill="url(#grid)" />
            </svg>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          
          <div className="relative">
            {(() => {
              const TierIcon = getTierIcon(tierConfig.iconType);
              return (
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                        <TierIcon size={28} />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold">{tierConfig.name} Member</h1>
                        <p className="text-white/80">Member since {new Date(loyalty.joined_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/70">Available Points</p>
                    <p className="text-4xl font-bold">{loyalty.available_points.toLocaleString()}</p>
                    <p className="text-sm text-white/70">Lifetime: {loyalty.lifetime_points.toLocaleString()}</p>
                  </div>
                </div>
              );
            })()}

            {/* Progress Bar to Next Tier */}
            {nextTier && (
              <div className="space-y-2">
                {(() => {
                  const CurrentTierIcon = getTierIcon(tierConfig.iconType);
                  const NextTierIcon = getTierIcon(TIER_CONFIG[nextTier].iconType);
                  return (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <CurrentTierIcon size={18} />
                        <span>{tierConfig.name}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <NextTierIcon size={18} />
                        <span>{TIER_CONFIG[nextTier].name}</span>
                      </span>
                    </div>
                  );
                })()}
                <div className="relative h-4 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                    {progressPercent}%
                  </div>
                </div>
                <p className="text-sm text-white/80 text-center">
                  <ArrowUp className="inline w-4 h-4 mr-1" />
                  {pointsToNext.toLocaleString()} points to {TIER_CONFIG[nextTier].name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tier Ladder */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Your Journey to Diamond
          </h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2" />
            <div 
              className={`absolute top-1/2 left-0 h-1 bg-gradient-to-r ${tierConfig.gradient} -translate-y-1/2 transition-all duration-1000`}
              style={{ width: `${(currentTierIndex / 4) * 100}%` }}
            />
            {tierOrder.map((tier, index) => {
              const config = TIER_CONFIG[tier];
              const isActive = index <= currentTierIndex;
              const isCurrent = tier === loyalty.tier;
              const TierIcon = getTierIcon(config.iconType);
              return (
                <div key={tier} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? `bg-gradient-to-br ${config.gradient} shadow-lg ring-4 ring-background text-white` 
                        : 'bg-muted border-2 border-border'
                    } ${isCurrent ? 'scale-125' : ''}`}
                  >
                    {isActive ? <TierIcon size={20} /> : <Lock className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <p className={`mt-2 text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {config.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {TIER_THRESHOLDS[tier].toLocaleString()} pts
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={<Trophy className="w-5 h-5" />}
            label="Deals Completed"
            value={loyalty.deals_completed}
            color="text-yellow-500"
            bgColor="bg-yellow-500/10"
          />
          <StatCard 
            icon={<BarChart3 className="w-5 h-5" />}
            label="Total Volume"
            value={`$${(loyalty.total_volume_usd / 1000000).toFixed(1)}M`}
            color="text-green-500"
            bgColor="bg-green-500/10"
          />
          <StatCard 
            icon={<Flame className="w-5 h-5" />}
            label="Current Streak"
            value={`${loyalty.current_streak} days`}
            color="text-orange-500"
            bgColor="bg-orange-500/10"
          />
          <StatCard 
            icon={<Star className="w-5 h-5" />}
            label="Achievements"
            value={`${userAchievements.length}/${achievements.length}`}
            color="text-purple-500"
            bgColor="bg-purple-500/10"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          {(['overview', 'rewards', 'achievements', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Rewards */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  Available Rewards
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('rewards')}>
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {rewards.slice(0, 4).map((reward) => {
                  const RewardIcon = getRewardIcon(reward.icon);
                  return (
                  <div key={reward.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <RewardIcon size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{reward.name}</p>
                      <p className="text-xs text-muted-foreground">{reward.points_cost.toLocaleString()} pts</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant={canRedeem(reward) ? 'default' : 'secondary'}
                      disabled={!canRedeem(reward)}
                    >
                      {canRedeem(reward) ? 'Redeem' : <Lock className="w-3 h-3" />}
                    </Button>
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('history')}>
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.points > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {tx.points > 0 ? <TrendingUp className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-semibold ${tx.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.points > 0 ? '+' : ''}{tx.points.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => {
              const canGet = canRedeem(reward);
              const rewardTierIndex = tierOrder.indexOf(reward.tier_required);
              const tierLocked = currentTierIndex < rewardTierIndex;
              
              return (
                <div 
                  key={reward.id} 
                  className={`relative bg-card rounded-xl border border-border p-6 transition-all ${
                    canGet ? 'hover:shadow-lg hover:border-primary/50' : 'opacity-70'
                  }`}
                >
                  {tierLocked && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        {TIER_CONFIG[reward.tier_required].name}
                      </Badge>
                    </div>
                  )}
                  {(() => {
                    const RewardIcon = getRewardIcon(reward.icon);
                    return (
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <RewardIcon size={28} className="text-primary" />
                      </div>
                    );
                  })()}
                  <h4 className="font-semibold mb-1">{reward.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="font-bold">{reward.points_cost.toLocaleString()}</span>
                      <span className="text-muted-foreground text-sm">pts</span>
                    </div>
                    <Button 
                      size="sm"
                      disabled={!canGet}
                      variant={canGet ? 'default' : 'secondary'}
                    >
                      {canGet ? 'Redeem' : tierLocked ? 'Locked' : 'Not Enough'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const unlocked = userAchievements.includes(achievement.id);
              return (
                <div 
                  key={achievement.id}
                  className={`relative bg-card rounded-xl border p-6 transition-all ${
                    unlocked 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-border opacity-70'
                  }`}
                >
                  {unlocked && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  {(() => {
                    const AchievementIcon = getAchievementIcon(achievement.icon);
                    return (
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                        unlocked ? 'bg-primary/20 text-primary' : 'bg-muted grayscale text-muted-foreground'
                      }`}>
                        <AchievementIcon size={28} />
                      </div>
                    );
                  })()}
                  <h4 className="font-semibold mb-1">{achievement.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">+{achievement.points_reward} pts</span>
                    {unlocked && (
                      <Badge variant="secondary" className="ml-auto text-xs text-green-600 bg-green-500/10">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Points History</h3>
            </div>
            <div className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.points > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.transaction_type === 'earn' && <Trophy className="w-5 h-5" />}
                    {tx.transaction_type === 'redeem' && <Gift className="w-5 h-5" />}
                    {tx.transaction_type === 'bonus' && <Zap className="w-5 h-5" />}
                    {tx.transaction_type === 'referral' && <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${tx.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.points > 0 ? '+' : ''}{tx.points.toLocaleString()}
                    </span>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color, 
  bgColor 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className={`w-10 h-10 rounded-lg ${bgColor} ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
