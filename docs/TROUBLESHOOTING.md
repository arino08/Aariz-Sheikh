# 🔧 Troubleshooting Guide

## Issue 1: "Error uploading image: new row violates row-level security policy"

### Problem
When trying to upload an image in the admin panel, you get a Row Level Security (RLS) error.

### Cause
Supabase has Row Level Security enabled, but the policies aren't configured to allow public access (since we're using the anonymous API key).

### Solution

#### Step 1: Fix Storage Policies
1. Go to **Storage** in Supabase dashboard
2. Click on `project-images` bucket
3. Go to **Policies** tab
4. **Delete all existing policies**
5. Click **New Policy** → **Custom** for each of these:

```sql
-- Policy 1: Public Read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );

-- Policy 2: Public Upload
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-images' );

-- Policy 3: Public Update
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'project-images' );

-- Policy 4: Public Delete
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'project-images' );
```

#### Step 2: Fix Database Policies
1. Go to **SQL Editor** in Supabase
2. Run the SQL from `/docs/FIX_RLS_POLICIES.sql`

Or manually:
1. Go to **Table Editor** → **projects**
2. Click on **RLS** (Row Level Security)
3. **Delete all existing policies**
4. Add these 4 policies via SQL Editor:

```sql
-- Policy 1: Allow public read
CREATE POLICY "Enable read access for all users"
ON projects FOR SELECT
USING (true);

-- Policy 2: Allow public insert
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
```

#### Step 3: Test
1. Press Ctrl+K
2. Enter "az8576"
3. Try uploading an image
4. Should work now! ✅

---

## Issue 2: Tech Stack Input Not Registering Commas/Spaces

### Problem
When typing tech stack items separated by commas, the input doesn't register properly or seems buggy.

### Cause
The input was converting array to string and back, causing issues with real-time updates.

### Solution
✅ **Already Fixed!** The component now:
- Properly handles comma-separated values
- Trims whitespace
- Shows live count of tags below input
- Displays: "Type tags separated by commas: X tags"

### How to Use
1. Type tech names separated by commas: `React, Next.js, TypeScript`
2. Spaces after commas are automatically trimmed
3. Empty entries are filtered out
4. You'll see the tag count update in real-time

**Example:**
```
Input: "React, Node.js, MongoDB, "
Result: ["React", "Node.js", "MongoDB"] (3 tags)
```

---

## Issue 3: Image Upload Stuck on "Uploading..."

### Symptoms
- Uploading spinner never stops
- No error message shown
- Image doesn't upload

### Causes & Solutions

#### Cause 1: Wrong bucket name
**Check:** Is your bucket named exactly `project-images`?
- Go to Storage → Check bucket name
- Must be exactly `project-images` (no spaces, dashes in right place)

#### Cause 2: Bucket not public
**Check:** Is the bucket set to public?
- Go to Storage → Click bucket → Settings
- Toggle "Public bucket" to ON

#### Cause 3: File too large
**Solution:** Supabase free tier has limits
- Max file size: 50MB
- Compress images before uploading
- Recommended: < 2MB for web images

#### Cause 4: Invalid file type
**Check:** Is it a valid image format?
- Supported: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- Not supported: `.psd`, `.ai`, `.sketch`, etc.

---

## Issue 4: Projects Not Showing After Creation

### Symptoms
- Project created successfully
- Alert shows "Project created successfully!"
- But project doesn't appear in list or homepage

### Solutions

#### Solution 1: Refresh the page
- Sometimes React state doesn't update
- Press `Ctrl+R` or `Cmd+R` to hard refresh

#### Solution 2: Check database
1. Go to Supabase → Table Editor → projects
2. See if project exists in database
3. If yes, it's a frontend issue
4. If no, check RLS policies (see Issue 1)

#### Solution 3: Check browser console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors in red
4. Share error message for help

---

## Issue 5: "Access Denied" When Opening Admin Panel

### Symptoms
- Press Ctrl+K
- Enter "az8576"
- Shows "Access denied" or nothing happens

### Solutions

#### Solution 1: Check environment variable
1. Open `.env.local`
2. Verify: `NEXT_PUBLIC_ADMIN_SECRET=az8576`
3. Make sure no extra spaces or quotes
4. Restart dev server: `npm run dev`

#### Solution 2: Check mini terminal is working
1. Press Ctrl+K
2. Type `help` and press Enter
3. Should show available commands
4. If nothing happens, keyboard shortcut may be conflicting

#### Solution 3: Check secret code spelling
- Must be exactly: `az8576`
- No spaces, no capital letters
- Just lowercase letters and numbers

---

## Issue 6: Images Not Displaying on Homepage

### Symptoms
- Projects show up
- But images are broken (broken image icon)

### Causes & Solutions

#### Cause 1: Wrong image URL format
**Check image URL in database:**
- Should be: `https://xxxxx.supabase.co/storage/v1/object/public/project-images/filename.jpg`
- NOT: `/project-images/filename.jpg`

**Fix:** Get the correct URL:
```javascript
const { data } = supabase.storage
  .from('project-images')
  .getPublicUrl(filePath);

// Use data.publicUrl
```

#### Cause 2: Bucket not public
- Go to Storage → project-images → Settings
- Make sure "Public bucket" is enabled

#### Cause 3: CORS issue
- In Supabase, go to Settings → API
- Check allowed origins
- Should include your local dev URL: `http://localhost:3000`

---

## Issue 7: Database Connection Error

### Symptoms
- Error: "Failed to fetch"
- Error: "Network request failed"
- Console shows Supabase connection errors

### Solutions

#### Solution 1: Check API keys
1. Open `.env.local`
2. Verify both keys are correct:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Get correct keys from Supabase → Settings → API
4. Restart dev server after changing

#### Solution 2: Check Supabase project status
- Go to Supabase dashboard
- Check if project is paused (free tier auto-pauses)
- Click "Resume" if paused

#### Solution 3: Check internet connection
- Supabase is cloud-based
- Requires active internet connection
- Try opening supabase.com in browser

---

## General Debugging Tips

### Enable Verbose Logging
Add this to `lib/supabase.ts` temporarily:

```typescript
supabase
  .from('projects')
  .select('*')
  .then(({ data, error }) => {
    console.log('Supabase Response:', { data, error });
  });
```

### Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "fetch/XHR"
4. Look for Supabase requests
5. Check status codes:
   - 200 = Success
   - 401 = Unauthorized (check API keys)
   - 403 = Forbidden (check RLS policies)
   - 500 = Server error (check Supabase logs)

### Check Supabase Logs
1. Go to Supabase dashboard
2. Click on "Logs" in left sidebar
3. Select "Postgres Logs" or "API Logs"
4. Look for recent errors

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `new row violates row-level security policy` | RLS is blocking insert | Fix RLS policies (Issue 1) |
| `relation "projects" does not exist` | Table not created | Run setup SQL again |
| `column "tech_stack" is of type text[] but expression is of type text` | Wrong data type | Use `ARRAY['item1', 'item2']` |
| `Invalid API key` | Wrong Supabase key | Check .env.local keys |
| `Failed to fetch` | Network/connection issue | Check internet & Supabase status |

---

## Quick Health Check

Run this checklist to verify everything is working:

### ✅ Supabase Setup
- [ ] Account created
- [ ] Project created
- [ ] Database table `projects` exists
- [ ] Storage bucket `project-images` exists
- [ ] Bucket is public
- [ ] RLS policies configured
- [ ] Storage policies configured

### ✅ Environment Variables
- [ ] `.env.local` file exists
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] `NEXT_PUBLIC_ADMIN_SECRET` is set to `az8576`
- [ ] Dev server restarted after adding env vars

### ✅ Admin Panel
- [ ] Ctrl+K opens mini terminal
- [ ] Typing "az8576" opens admin panel
- [ ] Can see the form
- [ ] Can upload images
- [ ] Can create projects
- [ ] Projects appear in list

### ✅ Frontend Display
- [ ] Projects section shows on homepage
- [ ] Projects are visible
- [ ] Images load correctly
- [ ] Links work

---

## Still Having Issues?

If you've tried everything and it's still not working:

1. **Copy the error message** exactly as it appears
2. **Take a screenshot** of the issue
3. **Check browser console** (F12) for errors
4. **Share the details** with specifics:
   - What were you trying to do?
   - What happened instead?
   - Any error messages?
   - Browser and OS?

## Need to Reset Everything?

If things are really broken, you can start fresh:

1. **Delete and recreate storage bucket:**
   - Storage → project-images → Settings → Delete bucket
   - Create new bucket with same name
   - Add policies again

2. **Drop and recreate database table:**
   ```sql
   DROP TABLE IF EXISTS projects CASCADE;
   -- Then run the CREATE TABLE SQL again
   ```

3. **Clear browser cache:**
   - Ctrl+Shift+Delete
   - Clear site data for localhost:3000

4. **Restart everything:**
   ```bash
   # Stop dev server (Ctrl+C)
   # Clear node modules
   rm -rf node_modules .next
   npm install
   npm run dev
   ```
