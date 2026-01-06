-- Voice Room Chat Messages
-- Allow chat within voice trading rooms

CREATE TABLE IF NOT EXISTS voice_room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES voice_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  reply_to UUID REFERENCES voice_room_messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voice_room_messages_room_id ON voice_room_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_voice_room_messages_user_id ON voice_room_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_room_messages_created_at ON voice_room_messages(room_id, created_at DESC);

ALTER TABLE voice_room_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view room messages" ON voice_room_messages 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert messages" ON voice_room_messages 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON voice_room_messages 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON voice_room_messages 
  FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION get_room_messages(p_room_id UUID, p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  room_id UUID,
  user_id UUID,
  content TEXT,
  message_type TEXT,
  reply_to UUID,
  created_at TIMESTAMPTZ,
  profile_full_name TEXT,
  profile_avatar_url TEXT,
  profile_company_name TEXT,
  profile_verification_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.room_id,
    m.user_id,
    m.content,
    m.message_type,
    m.reply_to,
    m.created_at,
    p.full_name AS profile_full_name,
    p.avatar_url AS profile_avatar_url,
    p.company_name AS profile_company_name,
    p.verification_status AS profile_verification_status
  FROM voice_room_messages m
  LEFT JOIN profiles p ON m.user_id = p.id
  WHERE m.room_id = p_room_id
  ORDER BY m.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;



