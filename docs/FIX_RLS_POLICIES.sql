-- ============================================
-- FIX ROW LEVEL SECURITY POLICIES
-- Run this in Supabase SQL Editor to fix the RLS issues
-- ============================================

-- 1. Enable RLS on projects table (if not already enabled)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for all users" ON projects;
DROP POLICY IF EXISTS "Enable update for all users" ON projects;
DROP POLICY IF EXISTS "Enable delete for all users" ON projects;

-- 3. Create new policies for public access
-- Policy 1: Allow public read access
CREATE POLICY "Enable read access for all users"
ON projects FOR SELECT
USING (true);

-- Policy 2: Allow public insert (for admin panel)
CREATE POLICY "Enable insert for all users"
ON projects FOR INSERT
WITH CHECK (true);

-- Policy 3: Allow public update
CREATE POLICY "Enable update for all users"
ON projects FOR UPDATE
USING (true);

-- Policy 4: Allow public delete
CREATE POLICY "Enable delete for all users"
ON projects FOR DELETE
USING (true);

-- ============================================
-- STORAGE POLICIES FIX
-- Run these separately in Storage → project-images → Policies
-- ============================================

-- First, delete any existing storage policies on project-images bucket
-- Then add these 4 policies:

-- Storage Policy 1: Public Read Access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );

-- Storage Policy 2: Public Upload
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-images' );

-- Storage Policy 3: Public Update
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'project-images' );

-- Storage Policy 4: Public Delete
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'project-images' );

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify everything is working
-- ============================================

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'projects';

-- List all policies on projects table
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Test insert (should succeed)
-- INSERT INTO projects (title, description, short_description, tech_stack)
-- VALUES ('Test Project', 'Test description', 'Test short', ARRAY['Test']);

-- Test select (should succeed)
-- SELECT * FROM projects;
