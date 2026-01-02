-- Voice Rooms Migration
-- Creates tables for Discord-style voice trading rooms

-- Voice rooms table
CREATE TABLE voice_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'fuel', 'metals', 'agriculture', 'logistics', 'general'
  emoji TEXT NOT NULL,
  agora_channel_name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voice participants table
CREATE TABLE voice_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES voice_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_muted BOOLEAN DEFAULT false,
  is_speaking BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- RLS Policies
ALTER TABLE voice_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_participants ENABLE ROW LEVEL SECURITY;

-- Anyone can view public rooms
CREATE POLICY "Public rooms viewable by all" ON voice_rooms
  FOR SELECT USING (is_public = true);

-- Authenticated users can view participants
CREATE POLICY "Participants viewable by authenticated users" ON voice_participants
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can join/leave rooms
CREATE POLICY "Users can join rooms" ON voice_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON voice_participants
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their status" ON voice_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_voice_participants_room ON voice_participants(room_id);
CREATE INDEX idx_voice_participants_user ON voice_participants(user_id);
CREATE INDEX idx_voice_rooms_category ON voice_rooms(category);

-- Default rooms
INSERT INTO voice_rooms (name, category, emoji, agora_channel_name, description) VALUES
('Fuel Trading', 'fuel', '🛢️', 'fuel-trading-main', 'Discuss petroleum products, pricing, and fuel deals'),
('Metals & Commodities', 'metals', '⚡', 'metals-trading-main', 'Trading base metals, precious metals, and industrial commodities'),
('Agriculture Trading', 'agriculture', '🌾', 'agriculture-trading-main', 'Grains, oils, and agricultural commodity deals'),
('Logistics & Shipping', 'logistics', '🚢', 'logistics-coordination-main', 'Coordinate shipments, tank farms, and delivery schedules'),
('Market Discussion', 'general', '📊', 'market-discussion-main', 'General market analysis and trading insights'),
('General Trading', 'general', '💼', 'general-trading-main', 'Open discussion for all commodity types');

-- Function to clean up stale participants (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_stale_participants()
RETURNS void AS $$
BEGIN
  -- Remove participants who have been in rooms for more than 24 hours
  -- This is a safety measure for cases where disconnect events are missed
  DELETE FROM voice_participants
  WHERE joined_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Trigger to update participant count (for future analytics)
CREATE OR REPLACE FUNCTION update_room_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- This can be extended to track room activity metrics
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER voice_participant_activity
  AFTER INSERT OR DELETE ON voice_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_room_activity();

