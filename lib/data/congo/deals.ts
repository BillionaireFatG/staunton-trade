import { Deal } from '@/types/database'

export const congoDeals: Deal[] = [
  {
    id: 'congo-deal-1',
    user_id: '',
    commodity: 'copper',
    quantity: 5000,
    quantity_unit: 'mt',
    price_per_unit: 8650,
    currency: 'USD',
    payment_terms: 'LC at sight',
    delivery_terms: 'FOB Matadi',
    delivery_date: '2024-06-15',
    status: 'active',
    counterparty_id: 'congo-cp-1',
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-15T14:20:00Z',
    notes: 'Katanga Province - CEEC certified, E-trace verified'
  },
  {
    id: 'congo-deal-2',
    user_id: '',
    commodity: 'cobalt',
    quantity: 1000,
    quantity_unit: 'mt',
    price_per_unit: 32500,
    currency: 'USD',
    payment_terms: 'CAD',
    delivery_terms: 'CIF Antwerp',
    delivery_date: '2024-07-20',
    status: 'pending',
    counterparty_id: 'congo-cp-2',
    created_at: '2024-03-05T14:30:00Z',
    updated_at: '2024-03-05T14:30:00Z',
    notes: 'Battery grade - OECD compliant, conflict-free certified'
  },
  {
    id: 'congo-deal-3',
    user_id: '',
    commodity: 'coltan',
    quantity: 250,
    quantity_unit: 'mt',
    price_per_unit: 180000,
    currency: 'USD',
    payment_terms: 'T/T 30 days',
    delivery_terms: 'FOB Kigali',
    delivery_date: '2024-05-10',
    status: 'active',
    counterparty_id: 'congo-cp-4',
    created_at: '2024-02-15T09:00:00Z',
    updated_at: '2024-03-10T11:00:00Z',
    notes: 'North Kivu - ITSCI tagged, traceability verified'
  },
  {
    id: 'congo-deal-4',
    user_id: '',
    commodity: 'gold',
    quantity: 50,
    quantity_unit: 'kg',
    price_per_unit: 62000,
    currency: 'USD',
    payment_terms: 'Advance payment',
    delivery_terms: 'EXW Bukavu',
    delivery_date: '2024-04-30',
    status: 'completed',
    counterparty_id: 'congo-cp-5',
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-03-12T16:45:00Z',
    notes: 'ASM cooperative - CEEC certified, conflict-free'
  },
  {
    id: 'congo-deal-5',
    user_id: '',
    commodity: 'timber',
    quantity: 2500,
    quantity_unit: 'm3',
    price_per_unit: 460,
    currency: 'USD',
    payment_terms: 'T/T 30 days',
    delivery_terms: 'FOB Pointe-Noire',
    delivery_date: '2024-05-25',
    status: 'active',
    counterparty_id: 'congo-cp-3',
    created_at: '2024-02-20T09:00:00Z',
    updated_at: '2024-02-20T09:00:00Z',
    notes: 'Congo Basin - FSC certified sustainable forestry'
  }
]

export const congoCounterparties = [
  {
    id: 'congo-cp-1',
    name: 'Gécamines (State Mining Corp)',
    email: 'exports@gecamines.cd',
    country: 'Democratic Republic of Congo',
    company_type: 'producer' as const,
    trust_score: 95,
    verified: true
  },
  {
    id: 'congo-cp-2',
    name: 'Lubumbashi Mining Cooperative',
    email: 'trade@lubcoop.cd',
    country: 'Democratic Republic of Congo',
    company_type: 'producer' as const,
    trust_score: 88,
    verified: true
  },
  {
    id: 'congo-cp-3',
    name: 'Congo Basin Timber Ltd',
    email: 'sales@congotimber.cd',
    country: 'Republic of Congo',
    company_type: 'producer' as const,
    trust_score: 85,
    verified: true
  },
  {
    id: 'congo-cp-4',
    name: 'North Kivu Minerals Traders',
    email: 'export@nkminerals.cd',
    country: 'Democratic Republic of Congo',
    company_type: 'trader' as const,
    trust_score: 82,
    verified: true
  },
  {
    id: 'congo-cp-5',
    name: 'Bukavu ASM Gold Cooperative',
    email: 'contact@bukavugold.cd',
    country: 'Democratic Republic of Congo',
    company_type: 'producer' as const,
    trust_score: 78,
    verified: true
  }
]
