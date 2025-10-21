# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in and create a new project
3. Note down your project URL and anon key

## 2. Set Environment Variables

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_SECRET=az8576
```

## 3. Run Database Schema

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/schema.sql`
5. Paste and click **Run**

This will create:
- `blog_categories` table
- `blog_posts` table with JSONB content
- Triggers for auto-updating timestamps and reading time
- RLS policies
- Sample categories (All, Tutorial, Project, etc.)

## 4. Create Storage Bucket (Manual Setup)

**Option A: Via Dashboard (Recommended)**

1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Set the following:
   - **Name**: `blog-storage`
   - **Public bucket**: ✅ ON (allows public read access)
   - **File size limit**: 5 MB (or as needed)
   - **Allowed MIME types**: `image/*` (optional)
4. Click **Create bucket**

**Default Policies (Automatic for Public Buckets):**
- ✅ Public SELECT (anyone can view images)
- ✅ Public INSERT (anyone can upload - you may want to change this!)
- ✅ Public UPDATE
- ✅ Public DELETE

**Option B: Restrict Uploads to Authenticated Users**

If you want only authenticated users to upload (recommended):

1. Go to **Storage** > **blog-storage** > **Policies**
2. Click on the **INSERT** policy
3. Edit the policy to use `authenticated` role instead of `public`
4. Or delete the auto-created policies and create custom ones:

```sql
-- Public read (anyone can view images)
CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-storage');

-- Authenticated users only can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-storage');

-- Authenticated users can update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-storage');

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-storage');
```

## 5. (Optional) Seed Sample Data

To add sample blog posts:

1. Go to **SQL Editor**
2. Open `supabase/seed.sql`
3. Copy and paste into the SQL Editor
4. Click **Run**

This will create 5 sample blog posts with rich content.

## 6. Test Your Setup

1. Start your dev server: `npm run dev`
2. Open the admin panel: Press `Ctrl+Shift+A` (or `Cmd+Shift+A`)
3. Enter password: `az8576`
4. Switch to **Blog Posts** tab
5. Click **+ New Post**
6. Try creating a blog post with:
   - Title
   - Category
   - Description
   - Content (use the BlockEditor)
   - Cover image (upload test)
7. Click **Create Post**
8. Navigate to `/blog` to see your post

## 7. Authentication Setup (For Upload Restrictions)

If you want to restrict uploads to authenticated users, you'll need to set up Supabase Auth:

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (or any other)
3. Update your admin panel to use actual Supabase authentication instead of the simple password check
4. Modify `lib/supabaseClient.ts` to use authenticated client

## Troubleshooting

### Storage Permission Errors

If you get `"must be owner of table objects"` error:
- ✅ Use the Dashboard to create the bucket (Option A above)
- ✅ Don't run `storage.sql` in SQL Editor
- The SQL file is there for reference only

### Categories Not Loading

Check:
1. Environment variables are set correctly in `.env.local`
2. Schema has been run successfully
3. Sample categories were inserted (check in Table Editor)

### Images Not Uploading

Check:
1. Storage bucket `blog-storage` exists
2. Bucket is set to **Public**
3. Storage policies allow INSERT operations
4. File size is within limits

### RLS Policy Errors

If you see "row-level security policy" errors:
1. Make sure you ran the complete `schema.sql`
2. RLS policies should be enabled on both tables
3. Check policies in Dashboard > Authentication > Policies

## Project Structure

```
supabase/
├── schema.sql           # Main database schema (RUN THIS FIRST)
├── storage.sql          # Reference only (use Dashboard instead)
├── seed.sql             # Optional sample data
└── SETUP_INSTRUCTIONS.md # This file
```

## Next Steps

- Customize the blog categories in the database
- Update the admin secret in `.env.local`
- Modify blog post template in `components/blog/ContentPreview.tsx`
- Add custom storage policies for better security
- Set up actual authentication instead of password check
