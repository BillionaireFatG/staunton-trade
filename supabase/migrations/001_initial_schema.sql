-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create deals table
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    commodity_type TEXT NOT NULL,
    volume NUMERIC NOT NULL,
    price_per_unit NUMERIC NOT NULL,
    total_value NUMERIC NOT NULL,
    buyer_name TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    contract_date DATE,
    injection_date DATE,
    delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counterparties table
CREATE TABLE counterparties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    trust_score NUMERIC DEFAULT 0,
    total_deals INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_feed table
CREATE TABLE activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_counterparties_user_id ON counterparties(user_id);
CREATE INDEX idx_documents_deal_id ON documents(deal_id);
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_deal_id ON activity_feed(deal_id);

-- Enable Row Level Security on all tables
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE counterparties ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deals table
CREATE POLICY "Users can view their own deals"
    ON deals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deals"
    ON deals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals"
    ON deals FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals"
    ON deals FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for counterparties table
CREATE POLICY "Users can view their own counterparties"
    ON counterparties FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own counterparties"
    ON counterparties FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own counterparties"
    ON counterparties FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own counterparties"
    ON counterparties FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for documents table
-- Users can only access documents for deals they own
CREATE POLICY "Users can view documents for their own deals"
    ON documents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM deals
            WHERE deals.id = documents.deal_id
            AND deals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert documents for their own deals"
    ON documents FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM deals
            WHERE deals.id = documents.deal_id
            AND deals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update documents for their own deals"
    ON documents FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM deals
            WHERE deals.id = documents.deal_id
            AND deals.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM deals
            WHERE deals.id = documents.deal_id
            AND deals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete documents for their own deals"
    ON documents FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM deals
            WHERE deals.id = documents.deal_id
            AND deals.user_id = auth.uid()
        )
    );

-- RLS Policies for activity_feed table
CREATE POLICY "Users can view their own activity feed"
    ON activity_feed FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity feed entries"
    ON activity_feed FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity feed entries"
    ON activity_feed FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity feed entries"
    ON activity_feed FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on deals table
CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON deals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();



