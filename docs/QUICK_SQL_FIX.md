# 🚨 QUICK FIX - Copy & Paste This SQL

Having the "row violates row-level security policy" error?

**👉 Copy this entire code block and paste it into Supabase SQL Editor:**

```sql
-- ==================================================================
-- QUICK FIX FOR RLS POLICY ERRORS
-- Copy and paste this entire block into Supabase SQL Editor
-- ==================================================================

-- 1. DROP OLD POLICIES (if they exist)
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for all users" ON projects;
DROP POLICY IF EXISTS "Enable update for all users" ON projects;
DROP POLICY IF EXISTS "Enable delete for all users" ON projects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- 2. CREATE NEW DATABASE POLICIES (for projects table)
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

-- 3. CREATE NEW STORAGE POLICIES (for project-images bucket)
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

-- 4. VERIFY IT WORKS
SELECT 'SUCCESS! Policies are now configured correctly.' as status;
```

---

## ✅ After Running the SQL

1. ✅ Close the SQL Editor
2. ✅ Go back to your app
3. ✅ Press `Ctrl+K` → Enter `az8576`
4. ✅ Try uploading an image
5. ✅ Create a project
6. ✅ Should work without errors!

---

## 🔍 Verify It Worked

Run this test query in SQL Editor:

```sql
-- Test that policies work
INSERT INTO projects (title, description, short_description, tech_stack)
VALUES ('Test Project', 'Testing RLS', 'Test', ARRAY['React', 'Next.js']);

-- If no error, it worked! Clean up:
DELETE FROM projects WHERE title = 'Test Project';
```

---

## 🆘 Still Having Issues?

Check these:

### Issue: "bucket does not exist"
**Fix**: Make sure you created the `project-images` bucket in Supabase Storage

### Issue: "permission denied for table projects"
**Fix**: Make sure RLS is enabled:
```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

### Issue: "invalid input syntax for type uuid"
**Fix**: Make sure the `uuid-ossp` extension is enabled:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 📖 Full Documentation

For complete setup instructions, see:
- `docs/SUPABASE_SETUP.md` - Complete setup guide
- `docs/SUPABASE_FIX_RLS.md` - Detailed RLS explanation
- `docs/FIXES_APPLIED.md` - All fixes explained
