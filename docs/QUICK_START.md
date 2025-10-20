# 🚀 Quick Start Guide - Supabase Admin System

## ⚡ 5-Minute Setup

### Step 1: Create Supabase Project (2 minutes)
1. Go to **[supabase.com](https://supabase.com)** and sign up
2. Click **New Project**
3. Fill in:
   - Name: `aariz-portfolio`
   - Database Password: *Create a strong password*
   - Region: *Choose closest to you*
4. Click **Create Project** and wait ~2 minutes

### Step 2: Set Up Database (1 minute)
1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy ALL the SQL from `docs/SUPABASE_SETUP.md`
4. Paste and click **Run**
5. You should see "Success. No rows returned"

### Step 3: Create Storage Bucket (1 minute)
1. Click **Storage** (left sidebar)
2. Click **New Bucket**
3. Name: `project-images`
4. Check **Public bucket**
5. Click **Create**
6. Go to **Policies** tab on the bucket
7. Add three policies from `docs/SUPABASE_SETUP.md`

### Step 4: Get API Keys (30 seconds)
1. Click **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL**
   - **anon public** key (not service_role!)

### Step 5: Configure Environment (30 seconds)
1. In your project root, create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and paste your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key
   NEXT_PUBLIC_ADMIN_SECRET=az8576
   ```

### Step 6: Start Using! (1 second)
```bash
npm run dev
```

Then:
1. Open http://localhost:3000
2. Press **Ctrl+K** (or **Cmd+K** on Mac)
3. Type: **az8576**
4. Press Enter
5. **Admin panel opens!** 🎉

## ✅ First Project

Once admin panel is open:

1. **Fill in the form:**
   - Title: "My Awesome Project"
   - Short Description: "A cool project I built"
   - Description: "Full description here..."
   - Tech Stack: "React, Next.js, Tailwind CSS"

2. **Upload an image:**
   - Click "Choose File"
   - Select any image
   - Wait for ✓ confirmation

3. **Add URLs (optional):**
   - Project URL: https://yourproject.com
   - GitHub URL: https://github.com/you/project

4. **Click "Create Project"**

5. **Refresh page** - Your project appears! 🚀

## 🎯 Common Tasks

### Add a Project
`Ctrl+K` → Type `az8576` → Fill form → Click "Create Project"

### Edit a Project
`Ctrl+K` → Type `az8576` → Find project on right → Click "Edit" → Update → "Update Project"

### Delete a Project
`Ctrl+K` → Type `az8576` → Find project → Click "Delete" → Confirm

### Make Project Featured
When adding/editing → Check "Featured" box → Save

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
→ Check `.env.local` has correct values
→ Restart dev server (`Ctrl+C` then `npm run dev`)

### "Images not uploading"
→ Make sure storage bucket is **public**
→ Check you added all 3 storage policies

### Terminal not opening
→ Try `Ctrl+K` or `Cmd+K`
→ Check browser console for errors

### Wrong secret code
→ Default is `az8576`
→ Check `NEXT_PUBLIC_ADMIN_SECRET` in `.env.local`

## 📚 Full Documentation

- **Setup Guide**: `docs/SUPABASE_SETUP.md`
- **Admin Guide**: `docs/SUPABASE_ADMIN.md`
- **Terminal Menu**: `docs/TERMINAL_MENU.md`

## 🎨 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+K` / `Cmd+K` | Open admin terminal |
| `ESC` | Close terminal/panel |
| `Enter` | Submit command |

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_SECRET`
4. Deploy!

---

**That's it!** You now have a fully functional admin system for managing your portfolio projects. 🎉

Need help? Check the full documentation in the `docs/` folder.
