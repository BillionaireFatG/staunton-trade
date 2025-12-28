export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Deal Status Lifecycle
export type DealStatus = 
  | 'draft'
  | 'pending'
  | 'counterparty_review'
  | 'in_progress'
  | 'injection_scheduled'
  | 'injection_in_progress'
  | 'verification'
  | 'completed'
  | 'cancelled'
  | 'disputed';

// Deal Stage for progress tracking (0-100%)
export const DEAL_STAGES: Record<DealStatus, number> = {
  draft: 5,
  pending: 15,
  counterparty_review: 25,
  in_progress: 40,
  injection_scheduled: 55,
  injection_in_progress: 70,
  verification: 85,
  completed: 100,
  cancelled: 0,
  disputed: 0,
};

export interface Database {
  public: {
    Tables: {
      deals: {
        Row: {
          id: string
          user_id: string
          reference_number: string
          commodity_type: string
          volume: number
          volume_unit: string
          price_per_unit: number
          total_value: number
          buyer_name: string
          buyer_id: string | null
          seller_name: string
          seller_id: string | null
          status: DealStatus
          progress_percentage: number
          contract_date: string | null
          injection_date: string | null
          injection_scheduled_time: string | null
          injection_facility: string | null
          delivery_date: string | null
          vessel_name: string | null
          vessel_imo: string | null
          origin_port: string | null
          destination_port: string | null
          current_location_lat: number | null
          current_location_lng: number | null
          eta: string | null
          notes: string | null
          staunton_report_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reference_number?: string
          commodity_type: string
          volume: number | string
          volume_unit?: string
          price_per_unit: number | string
          total_value: number | string
          buyer_name: string
          buyer_id?: string | null
          seller_name: string
          seller_id?: string | null
          status?: DealStatus
          progress_percentage?: number
          contract_date?: string | null
          injection_date?: string | null
          injection_scheduled_time?: string | null
          injection_facility?: string | null
          delivery_date?: string | null
          vessel_name?: string | null
          vessel_imo?: string | null
          origin_port?: string | null
          destination_port?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          eta?: string | null
          notes?: string | null
          staunton_report_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reference_number?: string
          commodity_type?: string
          volume?: number
          volume_unit?: string
          price_per_unit?: number
          total_value?: number
          buyer_name?: string
          buyer_id?: string | null
          seller_name?: string
          seller_id?: string | null
          status?: DealStatus
          progress_percentage?: number
          contract_date?: string | null
          injection_date?: string | null
          injection_scheduled_time?: string | null
          injection_facility?: string | null
          delivery_date?: string | null
          vessel_name?: string | null
          vessel_imo?: string | null
          origin_port?: string | null
          destination_port?: string | null
          current_location_lat?: number | null
          current_location_lng?: number | null
          eta?: string | null
          notes?: string | null
          staunton_report_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      counterparties: {
        Row: {
          id: string
          user_id: string
          company_name: string
          company_type: 'buyer' | 'seller' | 'both'
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          country: string | null
          trust_score: number
          honor_points: number
          dishonor_points: number
          total_deals: number
          completed_deals: number
          total_volume_traded: number
          on_time_delivery_rate: number
          quality_compliance_rate: number
          payment_performance_rate: number
          verified: boolean
          verification_date: string | null
          badges: string[]
          loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
          loyalty_points: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          company_type?: 'buyer' | 'seller' | 'both'
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          country?: string | null
          trust_score?: number
          honor_points?: number
          dishonor_points?: number
          total_deals?: number
          completed_deals?: number
          total_volume_traded?: number
          on_time_delivery_rate?: number
          quality_compliance_rate?: number
          payment_performance_rate?: number
          verified?: boolean
          verification_date?: string | null
          badges?: string[]
          loyalty_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          loyalty_points?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          company_type?: 'buyer' | 'seller' | 'both'
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          country?: string | null
          trust_score?: number
          honor_points?: number
          dishonor_points?: number
          total_deals?: number
          completed_deals?: number
          total_volume_traded?: number
          on_time_delivery_rate?: number
          quality_compliance_rate?: number
          payment_performance_rate?: number
          verified?: boolean
          verification_date?: string | null
          badges?: string[]
          loyalty_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          loyalty_points?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "counterparties_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      documents: {
        Row: {
          id: string
          deal_id: string
          document_type: string
          file_name: string
          file_url: string
          verified: boolean
          verified_by: string | null
          verified_at: string | null
          blockchain_hash: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          deal_id: string
          document_type: string
          file_name: string
          file_url: string
          verified?: boolean
          verified_by?: string | null
          verified_at?: string | null
          blockchain_hash?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          deal_id?: string
          document_type?: string
          file_name?: string
          file_url?: string
          verified?: boolean
          verified_by?: string | null
          verified_at?: string | null
          blockchain_hash?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "deals"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_feed: {
        Row: {
          id: string
          user_id: string
          deal_id: string | null
          action_type: string
          description: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deal_id?: string | null
          action_type: string
          description: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deal_id?: string | null
          action_type?: string
          description?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_feed_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_feed_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "deals"
            referencedColumns: ["id"]
          }
        ]
      }
      staunton_reports: {
        Row: {
          id: string
          deal_id: string
          reference_number: string
          report_type: 'tank_to_vessel' | 'vessel_to_tank' | 'tank_to_tank' | 'vessel_to_vessel'
          status: 'draft' | 'pending' | 'verified' | 'completed'
          commodity_details: Json
          parties: Json
          logistics: Json
          verification: Json
          documents: Json
          milestones: Json
          blockchain_hash: string | null
          generated_at: string
          verified_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          deal_id: string
          reference_number?: string
          report_type: 'tank_to_vessel' | 'vessel_to_tank' | 'tank_to_tank' | 'vessel_to_vessel'
          status?: 'draft' | 'pending' | 'verified' | 'completed'
          commodity_details: Json
          parties: Json
          logistics: Json
          verification?: Json
          documents?: Json
          milestones?: Json
          blockchain_hash?: string | null
          generated_at?: string
          verified_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          deal_id?: string
          reference_number?: string
          report_type?: 'tank_to_vessel' | 'vessel_to_tank' | 'tank_to_tank' | 'vessel_to_vessel'
          status?: 'draft' | 'pending' | 'verified' | 'completed'
          commodity_details?: Json
          parties?: Json
          logistics?: Json
          verification?: Json
          documents?: Json
          milestones?: Json
          blockchain_hash?: string | null
          generated_at?: string
          verified_at?: string | null
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staunton_reports_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "deals"
            referencedColumns: ["id"]
          }
        ]
      }
      tank_farms: {
        Row: {
          id: string
          name: string
          operator: string
          location: string
          country: string
          latitude: number
          longitude: number
          total_capacity: number
          available_capacity: number
          commodities_accepted: string[]
          daily_rate: number
          injection_fee: number
          average_wait_time_hours: number
          rating: number
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          operator: string
          location: string
          country: string
          latitude: number
          longitude: number
          total_capacity: number
          available_capacity?: number
          commodities_accepted: string[]
          daily_rate: number
          injection_fee: number
          average_wait_time_hours?: number
          rating?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          operator?: string
          location?: string
          country?: string
          latitude?: number
          longitude?: number
          total_capacity?: number
          available_capacity?: number
          commodities_accepted?: string[]
          daily_rate?: number
          injection_fee?: number
          average_wait_time_hours?: number
          rating?: number
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      injection_bookings: {
        Row: {
          id: string
          deal_id: string
          tank_farm_id: string
          user_id: string
          scheduled_date: string
          scheduled_time: string
          volume: number
          commodity_type: string
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          estimated_duration_hours: number
          actual_start_time: string | null
          actual_end_time: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_id: string
          tank_farm_id: string
          user_id: string
          scheduled_date: string
          scheduled_time: string
          volume: number
          commodity_type: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          estimated_duration_hours?: number
          actual_start_time?: string | null
          actual_end_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_id?: string
          tank_farm_id?: string
          user_id?: string
          scheduled_date?: string
          scheduled_time?: string
          volume?: number
          commodity_type?: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          estimated_duration_hours?: number
          actual_start_time?: string | null
          actual_end_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "injection_bookings_deal_id_fkey"
            columns: ["deal_id"]
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "injection_bookings_tank_farm_id_fkey"
            columns: ["tank_farm_id"]
            referencedRelation: "tank_farms"
            referencedColumns: ["id"]
          }
        ]
      }
      price_data: {
        Row: {
          id: string
          commodity: string
          region: string
          price: number
          currency: string
          unit: string
          change_24h: number
          change_percentage: number
          high_24h: number
          low_24h: number
          volume_24h: number
          source: 'platts' | 'argus' | 'staunton' | 'ice'
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          commodity: string
          region: string
          price: number
          currency?: string
          unit?: string
          change_24h?: number
          change_percentage?: number
          high_24h?: number
          low_24h?: number
          volume_24h?: number
          source?: 'platts' | 'argus' | 'staunton' | 'ice'
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          commodity?: string
          region?: string
          price?: number
          currency?: string
          unit?: string
          change_24h?: number
          change_percentage?: number
          high_24h?: number
          low_24h?: number
          volume_24h?: number
          source?: 'platts' | 'argus' | 'staunton' | 'ice'
          timestamp?: string
          created_at?: string
        }
        Relationships: []
      }
      fixed_rate_contracts: {
        Row: {
          id: string
          user_id: string
          commodity_type: string
          volume: number
          volume_unit: string
          fixed_price: number
          market_price_at_creation: number
          currency: string
          start_date: string
          end_date: string
          delivery_schedule: 'monthly' | 'quarterly' | 'single'
          status: 'pending' | 'active' | 'completed' | 'cancelled'
          total_value: number
          deliveries_made: number
          volume_delivered: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          commodity_type: string
          volume: number
          volume_unit?: string
          fixed_price: number
          market_price_at_creation: number
          currency?: string
          start_date: string
          end_date: string
          delivery_schedule?: 'monthly' | 'quarterly' | 'single'
          status?: 'pending' | 'active' | 'completed' | 'cancelled'
          total_value?: number
          deliveries_made?: number
          volume_delivered?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          commodity_type?: string
          volume?: number
          volume_unit?: string
          fixed_price?: number
          market_price_at_creation?: number
          currency?: string
          start_date?: string
          end_date?: string
          delivery_schedule?: 'monthly' | 'quarterly' | 'single'
          status?: 'pending' | 'active' | 'completed' | 'cancelled'
          total_value?: number
          deliveries_made?: number
          volume_delivered?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fixed_rate_contracts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      loyalty_transactions: {
        Row: {
          id: string
          user_id: string
          type: 'earned' | 'redeemed' | 'bonus' | 'expired'
          points: number
          description: string
          deal_id: string | null
          service_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'earned' | 'redeemed' | 'bonus' | 'expired'
          points: number
          description: string
          deal_id?: string | null
          service_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'earned' | 'redeemed' | 'bonus' | 'expired'
          points?: number
          description?: string
          deal_id?: string | null
          service_type?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          company_type: 'trader' | 'buyer' | 'seller' | 'broker' | 'government'
          trust_score: number
          honor_points: number
          dishonor_points: number
          loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
          loyalty_points: number
          total_deals: number
          completed_deals: number
          total_volume_traded: number
          badges: string[]
          verified: boolean
          verification_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          company_type?: 'trader' | 'buyer' | 'seller' | 'broker' | 'government'
          trust_score?: number
          honor_points?: number
          dishonor_points?: number
          loyalty_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          loyalty_points?: number
          total_deals?: number
          completed_deals?: number
          total_volume_traded?: number
          badges?: string[]
          verified?: boolean
          verification_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          company_type?: 'trader' | 'buyer' | 'seller' | 'broker' | 'government'
          trust_score?: number
          honor_points?: number
          dishonor_points?: number
          loyalty_tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
          loyalty_points?: number
          total_deals?: number
          completed_deals?: number
          total_volume_traded?: number
          badges?: string[]
          verified?: boolean
          verification_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers for easier usage
export type Deal = Database['public']['Tables']['deals']['Row']
export type DealInsert = Database['public']['Tables']['deals']['Insert']
export type DealUpdate = Database['public']['Tables']['deals']['Update']

export type Counterparty = Database['public']['Tables']['counterparties']['Row']
export type CounterpartyInsert = Database['public']['Tables']['counterparties']['Insert']
export type CounterpartyUpdate = Database['public']['Tables']['counterparties']['Update']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type ActivityFeed = Database['public']['Tables']['activity_feed']['Row']
export type ActivityFeedInsert = Database['public']['Tables']['activity_feed']['Insert']
export type ActivityFeedUpdate = Database['public']['Tables']['activity_feed']['Update']

export type StauntonReport = Database['public']['Tables']['staunton_reports']['Row']
export type StauntonReportInsert = Database['public']['Tables']['staunton_reports']['Insert']
export type StauntonReportUpdate = Database['public']['Tables']['staunton_reports']['Update']

export type TankFarm = Database['public']['Tables']['tank_farms']['Row']
export type TankFarmInsert = Database['public']['Tables']['tank_farms']['Insert']
export type TankFarmUpdate = Database['public']['Tables']['tank_farms']['Update']

export type InjectionBooking = Database['public']['Tables']['injection_bookings']['Row']
export type InjectionBookingInsert = Database['public']['Tables']['injection_bookings']['Insert']
export type InjectionBookingUpdate = Database['public']['Tables']['injection_bookings']['Update']

export type PriceData = Database['public']['Tables']['price_data']['Row']
export type PriceDataInsert = Database['public']['Tables']['price_data']['Insert']
export type PriceDataUpdate = Database['public']['Tables']['price_data']['Update']

export type FixedRateContract = Database['public']['Tables']['fixed_rate_contracts']['Row']
export type FixedRateContractInsert = Database['public']['Tables']['fixed_rate_contracts']['Insert']
export type FixedRateContractUpdate = Database['public']['Tables']['fixed_rate_contracts']['Update']

export type LoyaltyTransaction = Database['public']['Tables']['loyalty_transactions']['Row']
export type LoyaltyTransactionInsert = Database['public']['Tables']['loyalty_transactions']['Insert']
export type LoyaltyTransactionUpdate = Database['public']['Tables']['loyalty_transactions']['Update']

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

// Message types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  read: boolean;
  created_at: string;
}

export interface MessageInsert {
  id?: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  read?: boolean;
  created_at?: string;
}

export interface Conversation {
  partner_id: string;
  partner_name?: string;
  partner_email?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  is_online?: boolean;
}

export interface ChatUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  is_online?: boolean;
}

// Badge types
export type Badge = 
  | 'verified_trader'
  | 'staunton_logistics'
  | 'staunton_verification'
  | 'staunton_storage'
  | 'premium_member'
  | 'top_performer'
  | 'early_adopter'
  | 'high_volume'
  | 'perfect_record'
  | 'fast_payer';

// Loyalty tier thresholds
export const LOYALTY_TIERS = {
  bronze: { min: 0, max: 999, discount: 0 },
  silver: { min: 1000, max: 4999, discount: 5 },
  gold: { min: 5000, max: 19999, discount: 15 },
  platinum: { min: 20000, max: Infinity, discount: 25 },
} as const;

// Trust score calculation weights
export const TRUST_SCORE_WEIGHTS = {
  on_time_delivery: 0.3,
  quality_compliance: 0.25,
  payment_performance: 0.25,
  honor_points: 0.1,
  completed_deals: 0.1,
} as const;
