-- Global Chat Room Table
CREATE TABLE IF NOT EXISTS global_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_global_messages_created_at ON global_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_global_messages_sender_id ON global_messages(sender_id);

-- Enable RLS
ALTER TABLE global_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can read global messages
CREATE POLICY "Anyone can view global messages" ON global_messages
  FOR SELECT USING (true);

-- Authenticated users can send global messages
CREATE POLICY "Authenticated users can send global messages" ON global_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can delete their own messages (optional - for moderation)
CREATE POLICY "Users can delete own global messages" ON global_messages
  FOR DELETE USING (auth.uid() = sender_id);

-- Enable Realtime for global messages
ALTER PUBLICATION supabase_realtime ADD TABLE global_messages;

-- Function to clean up old global messages (keep last 1000)
CREATE OR REPLACE FUNCTION cleanup_old_global_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM global_messages
  WHERE id NOT IN (
    SELECT id FROM global_messages
    ORDER BY created_at DESC
    LIMIT 1000
  );
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run cleanup (requires pg_cron extension)
-- This keeps the table size manageable on free tier
-- SELECT cron.schedule('cleanup-global-messages', '0 0 * * *', 'SELECT cleanup_old_global_messages()');

