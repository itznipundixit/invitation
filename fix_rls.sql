-- Fix for RLS errors: allow anon (public) users to SELECT and UPDATE their invitations

-- 1. Allow anon to SELECT invitations so that .insert().select() works
CREATE POLICY "Allow anon select on invitations" 
ON invitations FOR SELECT 
TO anon USING (true);

-- 2. Allow anon to UPDATE invitations so that they can proceed through the steps
CREATE POLICY "Allow anon update on invitations" 
ON invitations FOR UPDATE 
TO anon USING (true) WITH CHECK (true);

-- 3. Also allow anon to SELECT on invitation_events if needed
CREATE POLICY "Allow anon select on invitation_events" 
ON invitation_events FOR SELECT 
TO anon USING (true);
