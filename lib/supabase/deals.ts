import { supabase } from '@/lib/supabase';

export type DealStatus = 'draft' | 'pending' | 'active' | 'injecting' | 'inspection' | 'completed' | 'cancelled' | 'disputed';

export type CommodityType = 
  | 'fuel_diesel' | 'fuel_gasoline' | 'fuel_jet' | 'fuel_crude'
  | 'metal_copper' | 'metal_aluminum' | 'metal_zinc'
  | 'agriculture_grain' | 'agriculture_oil' | 'chemical_industrial';

export interface Deal {
  id: string;
  buyer_id: string | null;
  seller_id: string | null;
  broker_id: string | null;
  commodity_type: CommodityType;
  quantity: number;
  unit_price: number;
  total_value: number;
  currency: string;
  delivery_location: string;
  tank_farm: string | null;
  scheduled_injection_date: string | null;
  actual_injection_date: string | null;
  expected_completion_date: string | null;
  status: DealStatus;
  progress_percentage: number;
  reference_number: string;
  vessel_name: string | null;
  cargo_tracking_url: string | null;
  current_location_lat: number | null;
  current_location_lng: number | null;
  last_location_update: string | null;
  contract_url: string | null;
  inspection_report_url: string | null;
  quality_certificate_url: string | null;
  bill_of_lading_url: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  buyer?: any;
  seller?: any;
  broker?: any;
  events?: DealEvent[];
  inspections?: Inspection[];
}

export interface DealEvent {
  id: string;
  deal_id: string;
  event_type: string;
  description: string;
  metadata: any;
  created_by: string | null;
  created_at: string;
  created_by_profile?: any;
}

export interface Inspection {
  id: string;
  deal_id: string;
  inspector_company: string;
  inspection_date: string | null;
  sulfur_content: number | null;
  density: number | null;
  flash_point: number | null;
  water_content: number | null;
  passed: boolean | null;
  notes: string | null;
  report_url: string | null;
  created_at: string;
}

export interface CreateDealInput {
  buyer_id?: string;
  seller_id?: string;
  broker_id?: string;
  commodity_type: CommodityType;
  quantity: number;
  unit_price: number;
  currency?: string;
  delivery_location: string;
  tank_farm?: string;
  scheduled_injection_date?: string;
  expected_completion_date?: string;
  vessel_name?: string;
  notes?: string;
}

export const COMMODITY_LABELS: Record<CommodityType, string> = {
  fuel_diesel: 'Diesel',
  fuel_gasoline: 'Gasoline',
  fuel_jet: 'Jet Fuel',
  fuel_crude: 'Crude Oil',
  metal_copper: 'Copper',
  metal_aluminum: 'Aluminum',
  metal_zinc: 'Zinc',
  agriculture_grain: 'Grain',
  agriculture_oil: 'Vegetable Oil',
  chemical_industrial: 'Industrial Chemicals',
};

export const STATUS_LABELS: Record<DealStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  active: 'Active',
  injecting: 'Injecting',
  inspection: 'Inspection',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
};

export async function createDeal(input: CreateDealInput): Promise<Deal> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('deals')
    .insert({
      ...input,
      created_by: user.id,
      status: 'draft',
      progress_percentage: 0,
    })
    .select(`
      *,
      buyer:buyer_id(id, full_name, company_name, verification_status, avatar_url),
      seller:seller_id(id, full_name, company_name, verification_status, avatar_url)
    `)
    .single();

  if (error) throw error;

  await createDealEvent(data.id, 'created', 'Deal created');

  return data;
}

export async function getDeals(filters?: {
  status?: DealStatus;
  role?: 'buyer' | 'seller' | 'all';
}): Promise<Deal[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('deals')
    .select(`
      *,
      buyer:buyer_id(id, full_name, company_name, verification_status, avatar_url),
      seller:seller_id(id, full_name, company_name, verification_status, avatar_url),
      broker:broker_id(id, full_name, company_name, verification_status, avatar_url)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id},broker_id.eq.${user.id},created_by.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.role === 'buyer') {
    query = query.eq('buyer_id', user.id);
  } else if (filters?.role === 'seller') {
    query = query.eq('seller_id', user.id);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
  return data || [];
}

export async function getDeal(dealId: string): Promise<Deal | null> {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      buyer:buyer_id(*),
      seller:seller_id(*),
      broker:broker_id(*),
      events:deal_events(*, created_by_profile:created_by(*)),
      inspections(*)
    `)
    .eq('id', dealId)
    .single();

  if (error) {
    console.error('Error fetching deal:', error);
    return null;
  }
  return data;
}

export async function updateDeal(dealId: string, updates: Partial<Deal>): Promise<Deal | null> {
  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', dealId)
    .select()
    .single();

  if (error) {
    console.error('Error updating deal:', error);
    return null;
  }

  if (updates.status) {
    await createDealEvent(dealId, 'status_changed', `Status changed to ${STATUS_LABELS[updates.status as DealStatus]}`);
  }

  return data;
}

export async function createDealEvent(
  dealId: string,
  eventType: string,
  description: string,
  metadata?: any
): Promise<DealEvent | null> {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('deal_events')
    .insert({
      deal_id: dealId,
      event_type: eventType,
      description,
      metadata,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating deal event:', error);
    return null;
  }
  return data;
}

export async function getDealEvents(dealId: string): Promise<DealEvent[]> {
  const { data, error } = await supabase
    .from('deal_events')
    .select('*, created_by_profile:created_by(*)')
    .eq('deal_id', dealId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching deal events:', error);
    return [];
  }
  return data || [];
}

export async function updateDealProgress(dealId: string, percentage: number): Promise<Deal | null> {
  return updateDeal(dealId, { progress_percentage: percentage });
}

export function subscribeToDeal(dealId: string, callback: () => void) {
  const channel = supabase
    .channel(`deal:${dealId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'deals', filter: `id=eq.${dealId}` },
      callback
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'deal_events', filter: `deal_id=eq.${dealId}` },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function searchCounterparties(query: string): Promise<any[]> {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, company_name, verification_status, avatar_url, role')
    .or(`full_name.ilike.%${query}%,company_name.ilike.%${query}%`)
    .limit(10);

  if (error) {
    console.error('Error searching counterparties:', error);
    return [];
  }
  return data || [];
}



