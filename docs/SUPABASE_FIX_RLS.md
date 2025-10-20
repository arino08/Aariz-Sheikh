# Fix Row Level Security Policies

If you're getting the error: **"new row violates row-level security policy"**, it means the RLS policies need to be configured correctly.

## Quick Fix - Run This SQL

Go to your Supabase project → **SQL Editor** → **New Query** and run this:

```sql
-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for all users" ON projects;
DROP POLICY IF EXISTS "Enable update for all users" ON projects;
DROP POLICY IF EXISTS "Enable delete for all users" ON projects;

-- Recreate policies with correct syntax
CREATE POLICY "Public read access"
ON projects FOR SELECT
TO public
USING (true);

CREATE POLICY "Public insert access"
ON projects FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public update access"
ON projects FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public delete access"
ON projects FOR DELETE
TO public
USING (true);
```

## Storage Policies Fix

If image uploads are failing, run this SQL:

```sql
-- Drop existing storage policies if any
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Recreate storage policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Public update access"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'project-images')
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Public delete access"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'project-images');
```

## Verify Policies Are Working

After running the SQL above, test in the SQL Editor:

```sql
-- Test SELECT (should work)
SELECT * FROM projects;

-- Test INSERT (should work)
INSERT INTO projects (title, description, short_description, tech_stack)
VALUES ('Test Project', 'Test description', 'Test short', ARRAY['React', 'Next.js']);

-- Test UPDATE (should work)
UPDATE projects SET title = 'Updated Test' WHERE title = 'Test Project';

-- Test DELETE (should work)
DELETE FROM projects WHERE title = 'Updated Test';
```

If all queries work, your RLS is configured correctly!

## Security Note

⚠️ **Important**: These policies allow PUBLIC access for portfolio management.

For production, you should:
1. Add proper authentication
2. Create a service role key for admin operations
3. Restrict policies to authenticated users only

Example secure policy:
```sql
-- Only for authenticated users
CREATE POLICY "Authenticated users can insert"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);
```

But for a personal portfolio with a secret code, public policies are fine.
