-- Messages table for direct messaging between traders
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure sender and receiver are different
  CONSTRAINT different_users CHECK (sender_id != receiver_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, read) WHERE read = FALSE;

-- Composite index for conversation queries
CREATE INDEX idx_messages_conversation ON messages(
  LEAST(sender_id, receiver_id),
  GREATEST(sender_id, receiver_id),
  created_at DESC
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see messages they sent or received
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Policy: Users can only send messages as themselves
CREATE POLICY "Users can insert messages as sender"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can only mark messages as read if they are the receiver
CREATE POLICY "Users can update read status on received messages"
  ON messages FOR UPDATE
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- View for conversations list (last message per conversation partner)
CREATE OR REPLACE VIEW conversations AS
SELECT DISTINCT ON (partner_id)
  CASE 
    WHEN sender_id = auth.uid() THEN receiver_id 
    ELSE sender_id 
  END AS partner_id,
  id AS last_message_id,
  message_text AS last_message,
  created_at AS last_message_at,
  sender_id,
  receiver_id,
  CASE 
    WHEN receiver_id = auth.uid() AND read = FALSE THEN 1 
    ELSE 0 
  END AS is_unread
FROM messages
WHERE sender_id = auth.uid() OR receiver_id = auth.uid()
ORDER BY partner_id, created_at DESC;

-- Function to get unread count for a user
CREATE OR REPLACE FUNCTION get_unread_message_count(user_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM messages
  WHERE receiver_id = user_id AND read = FALSE;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get unread count per conversation partner
CREATE OR REPLACE FUNCTION get_unread_count_by_partner(user_id UUID, partner_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM messages
  WHERE receiver_id = user_id 
    AND sender_id = partner_id 
    AND read = FALSE;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to mark all messages from a partner as read
CREATE OR REPLACE FUNCTION mark_conversation_as_read(user_id UUID, partner_id UUID)
RETURNS VOID AS $$
  UPDATE messages
  SET read = TRUE
  WHERE receiver_id = user_id 
    AND sender_id = partner_id 
    AND read = FALSE;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Grant permissions
GRANT SELECT ON conversations TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_message_count TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_count_by_partner TO authenticated;
GRANT EXECUTE ON FUNCTION mark_conversation_as_read TO authenticated;



