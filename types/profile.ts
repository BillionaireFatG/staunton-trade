export type UserRole = 'buyer' | 'seller' | 'trader';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: UserRole[];
  verification_status: VerificationStatus;
  verification_requested_at: string | null;
  verified_at: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  created_at: string;
  other_user?: Profile;
  unread_count?: number;
  last_message?: Message;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
}







