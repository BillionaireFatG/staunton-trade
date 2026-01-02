-- Deal status enum
CREATE TYPE deal_status AS ENUM (
  'draft',
  'pending',
  'active',
  'injecting',
  'inspection',
  'completed',
  'cancelled',
  'disputed'
);

-- Commodity type enum
CREATE TYPE commodity_type AS ENUM (
  'fuel_diesel',
  'fuel_gasoline',
  'fuel_jet',
  'fuel_crude',
  'metal_copper',
  'metal_aluminum',
  'metal_zinc',
  'agriculture_grain',
  'agriculture_oil',
  'chemical_industrial'
);

-- Deals table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  broker_id UUID REFERENCES profiles(id),
  commodity_type commodity_type NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  total_value DECIMAL(18, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  currency TEXT DEFAULT 'USD',
  delivery_location TEXT NOT NULL,
  tank_farm TEXT,
  scheduled_injection_date TIMESTAMP WITH TIME ZONE,
  actual_injection_date TIMESTAMP WITH TIME ZONE,
  expected_completion_date TIMESTAMP WITH TIME ZONE,
  status deal_status DEFAULT 'draft',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  reference_number TEXT UNIQUE,
  vessel_name TEXT,
  cargo_tracking_url TEXT,
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  last_location_update TIMESTAMP WITH TIME ZONE,
  contract_url TEXT,
  inspection_report_url TEXT,
  quality_certificate_url TEXT,
  bill_of_lading_url TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Deal timeline events
CREATE TABLE deal_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspection results
CREATE TABLE inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  inspector_company TEXT NOT NULL,
  inspection_date TIMESTAMP WITH TIME ZONE,
  sulfur_content DECIMAL(5, 4),
  density DECIMAL(6, 4),
  flash_point INTEGER,
  water_content DECIMAL(5, 4),
  passed BOOLEAN,
  notes TEXT,
  report_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_deals_buyer ON deals(buyer_id);
CREATE INDEX idx_deals_seller ON deals(seller_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX idx_deals_reference ON deals(reference_number);
CREATE INDEX idx_deal_events_deal ON deal_events(deal_id, created_at DESC);
CREATE INDEX idx_inspections_deal ON inspections(deal_id);

-- RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deals" ON deals
  FOR SELECT USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id OR 
    auth.uid() = broker_id OR
    auth.uid() = created_by
  );

CREATE POLICY "Users can create deals" ON deals
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own deals" ON deals
  FOR UPDATE USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id OR 
    auth.uid() = created_by
  );

CREATE POLICY "Users can view deal events" ON deal_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = deal_events.deal_id
      AND (deals.buyer_id = auth.uid() OR deals.seller_id = auth.uid() OR deals.broker_id = auth.uid() OR deals.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can create deal events" ON deal_events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view inspections" ON inspections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM deals
      WHERE deals.id = inspections.deal_id
      AND (deals.buyer_id = auth.uid() OR deals.seller_id = auth.uid() OR deals.broker_id = auth.uid() OR deals.created_by = auth.uid())
    )
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate reference number
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
DECLARE
    ref_number TEXT;
BEGIN
    ref_number := 'STN-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));
    RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_reference_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reference_number IS NULL THEN
        NEW.reference_number := generate_reference_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_deal_reference_number BEFORE INSERT ON deals
    FOR EACH ROW EXECUTE FUNCTION set_reference_number();

