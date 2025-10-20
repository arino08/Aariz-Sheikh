# 🚀 Quick Fix Guide - Visual Steps

## Fix the RLS Error in 5 Minutes

### Issue Summary
- ❌ Error: "new row violates row-level security policy"
- ❌ Tech stack input not registering commas properly

### ✅ Solution Applied
- Fixed storage policies in documentation
- Fixed database RLS policies in documentation
- Improved tech stack input handling
- Added live tag counter

---

## Step-by-Step Fix

### Part 1: Fix Storage Policies (for Image Uploads)

#### 1. Go to Storage
```
Supabase Dashboard → Storage (left sidebar)
```

#### 2. Click on `project-images` bucket
```
Storage → project-images
```

#### 3. Go to Policies Tab
```
project-images → Policies (top tabs)
```

#### 4. Delete All Existing Policies
```
Click the trash icon 🗑️ next to each policy
Confirm deletion
```

#### 5. Add New Policies (4 total)
For each policy below, click **"New Policy"** → **"Custom"** → **"Use this template"** → Paste SQL:

**Policy 1: Public Read**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );
```
- Name: `Public Access`
- Target roles: `public` (default)
- Policy command: `SELECT`
- Click **Review** → **Save policy**

**Policy 2: Public Upload**
```sql
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-images' );
```
- Name: `Public Upload`
- Target roles: `public` (default)
- Policy command: `INSERT`
- Click **Review** → **Save policy**

**Policy 3: Public Update**
```sql
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'project-images' );
```
- Name: `Public Update`
- Target roles: `public` (default)
- Policy command: `UPDATE`
- Click **Review** → **Save policy**

**Policy 4: Public Delete**
```sql
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'project-images' );
```
- Name: `Public Delete`
- Target roles: `public` (default)
- Policy command: `DELETE`
- Click **Review** → **Save policy**

#### 6. Verify Storage Policies
You should now see 4 policies in the list:
- ✅ Public Access (SELECT)
- ✅ Public Upload (INSERT)
- ✅ Public Update (UPDATE)
- ✅ Public Delete (DELETE)

---

### Part 2: Fix Database Policies (for Project CRUD)

#### 1. Go to SQL Editor
```
Supabase Dashboard → SQL Editor (left sidebar)
```

#### 2. Create New Query
```
Click "+ New query" button
```

#### 3. Paste and Run This SQL
Copy the entire block below and paste it:

```sql
-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON projects;
DROP POLICY IF EXISTS "Enable insert for all users" ON projects;
DROP POLICY IF EXISTS "Enable update for all users" ON projects;
DROP POLICY IF EXISTS "Enable delete for all users" ON projects;

-- Create new policies for public access
CREATE POLICY "Enable read access for all users"
ON projects FOR SELECT
USING (true);

CREATE POLICY "Enable insert for all users"
ON projects FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update for all users"
ON projects FOR UPDATE
USING (true);

CREATE POLICY "Enable delete for all users"
ON projects FOR DELETE
USING (true);
```

#### 4. Click "Run" (or press Ctrl+Enter)
You should see: `Success. No rows returned`

#### 5. Verify Database Policies
```
Table Editor → projects → RLS (Row Level Security icon)
```
You should see 4 policies:
- ✅ Enable read access for all users (SELECT)
- ✅ Enable insert for all users (INSERT)
- ✅ Enable update for all users (UPDATE)
- ✅ Enable delete for all users (DELETE)

---

## Test Your Fix

### Test 1: Image Upload
1. Open your portfolio: `http://localhost:3000`
2. Press **Ctrl+K** (or Cmd+K on Mac)
3. Type `az8576` and press Enter
4. Click "Choose File" under "Project Image"
5. Select an image
6. ✅ Should say "Image uploaded" (no error!)

### Test 2: Tech Stack Input
1. In the admin panel, find "Tech Stack" field
2. Type: `React, Next.js, TypeScript, Tailwind`
3. ✅ Should see "Type tags separated by commas: 4 tags"
4. The commas and spaces should work smoothly now

### Test 3: Create Project
1. Fill in all required fields (marked with *)
2. Upload an image
3. Click "Create Project"
4. ✅ Should see "Project created successfully!"
5. Project should appear in the right column

### Test 4: View on Homepage
1. Close admin panel (X button or ESC)
2. Scroll to Projects section
3. ✅ Your new project should be visible with image

---

## Visual Checklist

```
┌─────────────────────────────────────────────────────┐
│ SUPABASE DASHBOARD                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Storage                                            │
│  └─ project-images                                  │
│      └─ Policies                                    │
│          ├─ ✅ Public Access (SELECT)              │
│          ├─ ✅ Public Upload (INSERT)              │
│          ├─ ✅ Public Update (UPDATE)              │
│          └─ ✅ Public Delete (DELETE)              │
│                                                     │
│  SQL Editor                                         │
│  └─ Run RLS policies SQL ✅                        │
│                                                     │
│  Table Editor → projects                            │
│  └─ RLS (Row Level Security)                        │
│      ├─ ✅ Enable read access for all users        │
│      ├─ ✅ Enable insert for all users             │
│      ├─ ✅ Enable update for all users             │
│      └─ ✅ Enable delete for all users             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## What Changed in the Code?

### AdminPanel.tsx
**Before:**
```typescript
const handleTechStackChange = (value: string) => {
  const techArray = value.split(",").map((t) => t.trim()).filter(Boolean);
  setFormData({ ...formData, tech_stack: techArray });
};
```

**After:**
```typescript
const handleTechStackChange = (value: string) => {
  // Split by comma and trim each item, filter out empty strings
  const techArray = value
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  setFormData({ ...formData, tech_stack: techArray });
};
```

**Added to UI:**
```tsx
<p className="text-xs text-gray-500 mt-1">
  Type tags separated by commas: {formData.tech_stack.length} tag{formData.tech_stack.length !== 1 ? 's' : ''}
</p>
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Wrong Policy Target
```
Target roles: authenticated  ← WRONG
Target roles: public         ← CORRECT
```

### ❌ Mistake 2: Forgetting to Enable Public Bucket
```
Storage → project-images → Settings
Public bucket: OFF  ← WRONG
Public bucket: ON   ← CORRECT
```

### ❌ Mistake 3: Not Restarting Dev Server
After any .env.local changes:
```bash
# Stop server (Ctrl+C)
npm run dev  # Start again
```

### ❌ Mistake 4: Using Wrong Bucket Name
```sql
bucket_id = 'project_images'   ← WRONG (underscore)
bucket_id = 'project-images'   ← CORRECT (hyphen)
```

---

## Success Indicators

You know it's working when:

1. ✅ Image upload shows "✓ Image uploaded" (not "Error uploading image")
2. ✅ Tech stack counter updates as you type
3. ✅ "Create Project" shows success alert
4. ✅ Project appears in admin panel list immediately
5. ✅ Project visible on homepage with image
6. ✅ No errors in browser console (F12)

---

## Still Getting Errors?

### If image upload still fails:
1. Check browser console (F12) for exact error
2. Go to Supabase → Storage → project-images → Files
3. Try manually uploading a file
4. If manual upload works, the issue is in the code
5. If manual upload fails, the issue is in policies

### If tech stack input still buggy:
1. Hard refresh the page (Ctrl+Shift+R)
2. Clear browser cache
3. Check if you see the tag counter below the input
4. If not, code changes didn't apply properly

### If database insert fails:
1. Go to Supabase → Table Editor → projects
2. Try manually inserting a row
3. If manual insert works, the issue is in the code
4. If manual insert fails, RLS policies need fixing

---

## Quick Reference: Where to Find Things

| What | Where |
|------|-------|
| Storage Policies | Storage → project-images → Policies |
| Database Policies | Table Editor → projects → RLS |
| Run SQL | SQL Editor → New query |
| Check Logs | Logs → Postgres Logs or API Logs |
| API Keys | Settings → API |
| Bucket Settings | Storage → project-images → Settings |

---

## Time to Complete
- ⏱️ Part 1 (Storage): 3 minutes
- ⏱️ Part 2 (Database): 2 minutes
- ⏱️ Testing: 2 minutes
- **Total: ~7 minutes**

---

## Need More Help?
Check out:
- 📖 `docs/TROUBLESHOOTING.md` - Comprehensive troubleshooting guide
- 📖 `docs/FIX_RLS_POLICIES.sql` - Copy-paste SQL fix
- 📖 `docs/SUPABASE_SETUP.md` - Complete setup guide
