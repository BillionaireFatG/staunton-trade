-- Loyalty & Rewards System
-- Fidelity program for Staunton Trade

-- Loyalty Tiers
CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');

-- User Loyalty Status
CREATE TABLE IF NOT EXISTS user_loyalty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tier loyalty_tier DEFAULT 'bronze',
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  deals_completed INTEGER DEFAULT 0,
  total_volume_usd DECIMAL(15,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  tier_progress INTEGER DEFAULT 0,
  next_tier_threshold INTEGER DEFAULT 1000,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  tier_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Points History
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Available Rewards
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  category TEXT NOT NULL,
  tier_required loyalty_tier DEFAULT 'bronze',
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  quantity_available INTEGER,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Redeemed Rewards
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  fulfilled_at TIMESTAMPTZ,
  notes TEXT
);

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT,
  points_reward INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_loyalty_user_id ON user_loyalty(user_id);
CREATE INDEX IF NOT EXISTS idx_user_loyalty_tier ON user_loyalty(tier);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user_id ON reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- RLS Policies
ALTER TABLE user_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own loyalty" ON user_loyalty FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON loyalty_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view active rewards" ON rewards FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own redemptions" ON reward_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can redeem rewards" ON reward_redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, points_reward, requirement_type, requirement_value) VALUES
('First Trade', 'Complete your first deal on Staunton', '🎉', 'milestone', 100, 'deals_completed', 1),
('Trusted Trader', 'Complete 10 deals successfully', '⭐', 'milestone', 500, 'deals_completed', 10),
('Volume King', 'Trade over $1M in total volume', '👑', 'volume', 1000, 'volume_usd', 1000000),
('Streak Master', 'Maintain a 7-day activity streak', '🔥', 'engagement', 250, 'streak_days', 7),
('Verified Pro', 'Get your profile verified', '✓', 'profile', 200, 'verification', 1),
('Social Butterfly', 'Join 5 voice rooms', '🦋', 'engagement', 150, 'voice_rooms', 5),
('Deal Maker', 'Complete 50 deals', '💼', 'milestone', 2000, 'deals_completed', 50),
('Whale', 'Trade over $10M in volume', '🐋', 'volume', 5000, 'volume_usd', 10000000),
('Diamond Hands', 'Complete 100 deals', '💎', 'milestone', 10000, 'deals_completed', 100),
('Elite Trader', 'Reach Diamond tier', '🏆', 'tier', 25000, 'tier', 5);

-- Insert default rewards
INSERT INTO rewards (name, description, points_cost, category, tier_required, icon) VALUES
('Priority Support', '24/7 priority customer support for 30 days', 500, 'service', 'bronze', '🎧'),
('Reduced Fees', '10% fee reduction on next deal', 1000, 'discount', 'silver', '💰'),
('Analytics Pro', 'Access to advanced market analytics for 7 days', 1500, 'feature', 'silver', '📊'),
('Featured Listing', 'Get your next deal featured for 48 hours', 2000, 'promotion', 'gold', '⭐'),
('Verified Badge', 'Fast-track verification process', 3000, 'service', 'gold', '✓'),
('VIP Webinar', 'Access to exclusive trading webinar', 2500, 'education', 'gold', '🎓'),
('Free Inspection', 'Complimentary cargo inspection on next deal', 5000, 'service', 'platinum', '🔍'),
('Premium Analytics', 'Lifetime premium analytics access', 10000, 'feature', 'platinum', '📈'),
('Concierge Service', 'Personal trade concierge for one month', 15000, 'service', 'diamond', '🤵'),
('Annual Membership', 'One year premium membership', 25000, 'membership', 'diamond', '👑');

-- Tier thresholds
COMMENT ON TABLE user_loyalty IS 'Tier thresholds: Bronze (0), Silver (1000), Gold (5000), Platinum (15000), Diamond (50000)';

