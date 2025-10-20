# 🚀 Supabase Admin System - Complete Guide

## Overview

This system adds a secret terminal-based admin panel to manage projects dynamically using Supabase as the database.

## Features

### 🔐 Secret Access
- Press **Ctrl+K** (or **Cmd+K** on Mac) anywhere on the site
- Mini terminal slides up from the bottom
- Enter secret code: **az8576**
- Admin panel opens with full project management

### 📊 Admin Panel Capabilities
- ✅ Add new projects with image upload
- ✅ Edit existing projects
- ✅ Delete projects
- ✅ Mark projects as featured
- ✅ Manage tech stack tags
- ✅ Set project URLs (live demo, GitHub)
- ✅ Real-time updates

### 🎨 UI Components
1. **MiniTerminal** - Secret code entry interface
2. **AdminPanel** - Full project management dashboard
3. **ProjectsSection** - Displays projects from database
4. **GlobalTerminalShortcut** - Keyboard shortcut handler

## Setup Instructions

### 1. Create Supabase Account
```bash
# Visit https://supabase.com and sign up
```

### 2. Create New Project
- Project name: `aariz-portfolio`
- Database password: *Save this securely!*
- Region: Choose closest to your users
- Plan: Free tier

### 3. Run SQL Setup
Copy and run the SQL from `docs/SUPABASE_SETUP.md` in your Supabase SQL Editor.

### 4. Create Storage Bucket
1. Go to **Storage** in Supabase
2. Create bucket named `project-images`
3. Make it **public**
4. Add the storage policies from the setup guide

### 5. Environment Variables
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your values from Supabase → Settings → API:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   NEXT_PUBLIC_ADMIN_SECRET=az8576
   ```

3. **Never commit `.env.local` to Git!** (already in .gitignore)

## Usage Guide

### Accessing Admin Panel

1. **Open Mini Terminal**
   - Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)
   - Mini terminal slides up from bottom

2. **Enter Secret Code**
   - Type: `az8576`
   - Press `Enter`
   - Admin panel opens automatically

3. **Alternative Commands**
   - `help` - Show available commands
   - `clear` - Clear terminal output
   - `exit` - Close mini terminal

### Managing Projects

#### Add New Project
1. Open admin panel (`Ctrl+K` → `az8576`)
2. Fill in the form:
   - **Title** * (required)
   - **Short Description** * (required)
   - **Description** * (required)
   - **Tech Stack** * (comma-separated, e.g., "React, Node.js, MongoDB")
   - **Image** (upload via file selector)
   - **Project URL** (optional)
   - **GitHub URL** (optional)
   - **Featured** (checkbox)
3. Click **Create Project**

#### Edit Existing Project
1. Find project in the right panel
2. Click **Edit**
3. Update fields as needed
4. Click **Update Project**
5. Click **Cancel** to discard changes

#### Delete Project
1. Find project in the right panel
2. Click **Delete**
3. Confirm deletion

### Image Upload

**Automatic Upload to Supabase Storage:**
1. Click "Choose File" in the image field
2. Select image (PNG, JPG, WebP, etc.)
3. Image automatically uploads to Supabase
4. URL is auto-filled in the form
5. ✓ Checkmark appears when upload complete

**Supported Formats:**
- PNG, JPG, JPEG, WebP, GIF
- Max size: 50MB (configurable)
- Automatically optimized with Next.js Image

## Database Schema

```typescript
type Project = {
  id: string;                    // Auto-generated UUID
  title: string;                 // Project name
  description: string;           // Full description
  short_description: string;     // Brief summary
  tech_stack: string[];          // Array of technologies
  image_url: string;             // Supabase storage URL
  project_url?: string;          // Live demo URL
  github_url?: string;           // GitHub repository
  featured: boolean;             // Featured status
  order_index: number;           // Display order
  status: 'active' | 'archived' | 'draft';
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
};
```

## File Structure

```
components/
├── ui/
│   ├── MiniTerminal.tsx          # Secret code entry
│   ├── AdminPanel.tsx            # Project management UI
│   └── GlobalTerminalShortcut.tsx # Keyboard handler
├── sections/
│   └── ProjectsSection.tsx       # Display projects
lib/
└── supabase.ts                   # Supabase client & types
docs/
├── SUPABASE_SETUP.md             # Database setup guide
└── SUPABASE_ADMIN.md             # This file
```

## Security

### Best Practices
✅ **Secret code** is stored in environment variable
✅ **Anon key** is safe for client-side use
✅ **Service role key** should NEVER be exposed to client
✅ **Storage policies** protect against unauthorized access
✅ **Row Level Security** can be added for extra protection

### Row Level Security (Optional)
If you want to restrict database access, add RLS policies in Supabase:

```sql
-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access"
ON projects FOR SELECT
USING (status = 'active');

-- Authenticated write access (admin only)
CREATE POLICY "Authenticated write access"
ON projects FOR ALL
TO authenticated
USING (true);
```

## Troubleshooting

### "Cannot connect to Supabase"
- Check `.env.local` variables are correct
- Verify Supabase URL doesn't have trailing slash
- Ensure anon key is correctly copied

### "Images not loading"
- Verify storage bucket is **public**
- Check storage policies are set correctly
- Ensure bucket name is `project-images`

### "Mini terminal not opening"
- Check browser console for errors
- Try clearing browser cache
- Verify `Ctrl+K` isn't captured by browser extension

### "Cannot upload images"
- Check storage bucket exists
- Verify upload policies are correct
- Check file size isn't too large
- Ensure file is a valid image format

## Development Tips

### Testing Locally
```bash
# Start dev server
npm run dev

# Open browser
# Press Ctrl+K
# Enter: az8576
```

### Adding Sample Data
Run this in Supabase SQL Editor:

```sql
INSERT INTO projects (title, description, short_description, tech_stack, image_url, featured)
VALUES
(
  'Sample Project',
  'This is a sample project for testing',
  'Test project',
  ARRAY['React', 'Next.js', 'Tailwind'],
  'https://placehold.co/600x400',
  true
);
```

### Real-time Updates (Optional)
To enable real-time project updates:

```typescript
// Add to ProjectsSection.tsx
useEffect(() => {
  const channel = supabase
    .channel('projects-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'projects' },
      () => loadProjects()
    )
    .subscribe();

  return () => { channel.unsubscribe(); };
}, []);
```

## Deployment

### Vercel Deployment
1. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_SECRET`

2. Deploy:
   ```bash
   git push origin main
   ```

3. Environment variables are automatically applied

### Environment Variables Priority
1. `.env.local` (local development - **never commit**)
2. `.env.production` (production builds)
3. Vercel environment variables (deployment)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` or `Cmd+K` | Open mini terminal |
| `ESC` | Close terminal/panel |
| `Enter` | Submit command |
| Type `help` | Show commands |
| Type `clear` | Clear terminal |
| Type `exit` | Close terminal |

## API Reference

### Supabase Client
```typescript
import { supabase } from '@/lib/supabase';

// Fetch projects
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'active')
  .order('order_index');

// Insert project
const { error } = await supabase
  .from('projects')
  .insert([{ title: 'New Project', ... }]);

// Update project
const { error } = await supabase
  .from('projects')
  .update({ title: 'Updated' })
  .eq('id', projectId);

// Delete project
const { error } = await supabase
  .from('projects')
  .delete()
  .eq('id', projectId);

// Upload image
const { data, error } = await supabase.storage
  .from('project-images')
  .upload(filePath, file);

// Get public URL
const { data } = supabase.storage
  .from('project-images')
  .getPublicUrl(filePath);
```

## Future Enhancements

Potential features to add:
- [ ] Drag & drop project reordering
- [ ] Bulk import/export (JSON/CSV)
- [ ] Project categories/tags
- [ ] Analytics dashboard
- [ ] Version history
- [ ] Collaborative editing
- [ ] Custom project templates
- [ ] API key management
- [ ] Webhook notifications

---

**Status**: ✅ Production Ready
**Database**: Supabase (PostgreSQL)
**Storage**: Supabase Storage
**Auth**: Secret code based
**Cost**: Free tier (perfect for portfolio)
