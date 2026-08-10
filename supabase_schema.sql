-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: invitations
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    accepted BOOLEAN DEFAULT FALSE,
    selected_day DATE,
    selected_time TEXT,
    food_choice TEXT,
    final_confirmed BOOLEAN DEFAULT FALSE,
    no_attempts INTEGER DEFAULT 0,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: invitation_events
CREATE TABLE IF NOT EXISTS invitation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
    event_type TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_events ENABLE ROW LEVEL SECURITY;

-- Policies for invitations
-- Allow public insert (anyone can create an invitation)
CREATE POLICY "Allow public insert on invitations" ON invitations FOR INSERT TO public WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access on invitations" ON invitations FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Policies for invitation_events
CREATE POLICY "Allow public insert on invitation_events" ON invitation_events FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow service role full access on invitation_events" ON invitation_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- To allow Admin (authenticated users) to read/manage all:
CREATE POLICY "Allow authenticated users to select invitations" ON invitations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to update invitations" ON invitations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to select events" ON invitation_events FOR SELECT TO authenticated USING (true);

-- Function to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invitations_modtime
BEFORE UPDATE ON invitations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
