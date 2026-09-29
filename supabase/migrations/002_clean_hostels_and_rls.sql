-- Migration 002: Clean Hostels and enforce Profiles RLS

-- 1. Ensure RLS is explicitly enabled on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS Policies for Profiles
-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- 3. Clean up existing stale data (Nilgiri etc.)
DELETE FROM hostels;

-- 4. Insert Ramanujan Hostel exactly once
INSERT INTO hostels (id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'Ramanujan');

-- 5. Insert exactly 10 Floors for Ramanujan
INSERT INTO floors (id, hostel_id, floor_number) VALUES 
('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 1),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 2),
('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 3),
('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 4),
('22222222-2222-2222-2222-222222222225', '11111111-1111-1111-1111-111111111111', 5),
('22222222-2222-2222-2222-222222222226', '11111111-1111-1111-1111-111111111111', 6),
('22222222-2222-2222-2222-222222222227', '11111111-1111-1111-1111-111111111111', 7),
('22222222-2222-2222-2222-222222222228', '11111111-1111-1111-1111-111111111111', 8),
('22222222-2222-2222-2222-222222222229', '11111111-1111-1111-1111-111111111111', 9),
('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111111', 10);
