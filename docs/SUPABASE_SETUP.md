# Supabase Setup Guide

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up with GitHub (recommended) or email
3. Create a new project:
   - **Project name**: `aariz-portfolio` (or any name you prefer)
   - **Database password**: Save this securely!
   - **Region**: Choose closest to your users
   - **Plan**: Free tier (perfect for portfolio)

## Step 2: Create Database Tables

Once your project is created:

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the SQL below:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, archived, draft
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data (optional)
INSERT INTO projects (title, description, short_description, tech_stack, image_url, project_url, github_url, featured, order_index)
VALUES
(
  'Terminal Portfolio',
  'An immersive terminal-themed portfolio showcasing development projects with interactive 3D effects and advanced animations.',
  'Interactive terminal-themed portfolio',
  ARRAY['Next.js', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind CSS'],
  '/placeholder-project.jpg',
  'https://example.com',
  'https://github.com/yourusername/portfolio',
  true,
  1
),
(
  'E-Commerce Platform',
  'Full-stack e-commerce solution with payment integration, inventory management, and real-time order tracking.',
  'Modern e-commerce solution',
  ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
  '/placeholder-project.jpg',
  'https://example.com',
  'https://github.com/yourusername/ecommerce',
  true,
  2
);

-- Create indexes for better performance
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_order ON projects(order_index);
CREATE INDEX idx_projects_status ON projects(status);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we're using anon key)
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
```

> **Note**: These policies allow public access for portfolio management.
> In production, you should implement proper authentication and restrict these policies to admin users only.

4. Click **Run** to execute the SQL

## Step 3: Set Up Storage Bucket for Images

1. Go to **Storage** in the left sidebar
2. Click **New Bucket**
3. Settings:
   - **Name**: `project-images`
   - **Public**: ✅ Enable (so images can be accessed publicly)
4. Click **Create Bucket**

### Configure Storage Policy

1. Click on the `project-images` bucket
2. Go to **Policies** tab
3. Click **New Policy** → **Custom** for each policy below:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );
```

**Policy 2: Public Upload (for Admin Panel)**
```sql
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project-images' );
```

**Policy 3: Public Update**
```sql
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'project-images' );
```

**Policy 4: Public Delete**
```sql
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'project-images' );
```

> **Note**: These policies allow public access since we're using the anon key from the client.
> In production, you should implement proper authentication and restrict these policies to authenticated users only.

## Step 4: Get Your API Keys

1. Go to **Settings** → **API** in the left sidebar
2. You'll need these values:

- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **Anon/Public Key**: `eyJhbGc...` (safe for client-side)
- **Service Role Key**: `eyJhbGc...` (⚠️ NEVER expose this!)

## Step 5: Add Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-key

# Admin Secret Code
NEXT_PUBLIC_ADMIN_SECRET=az8576
```

⚠️ **Important**: Add `.env.local` to your `.gitignore` file!

## Step 6: Install Supabase Client

Run this command in your terminal:

```bash
npm install @supabase/supabase-js
```

## Step 7: Verify Setup

You can verify your setup by:

1. Go to **Table Editor** in Supabase
2. You should see the `projects` table
3. Click on it to see the sample data

## Step 8: Create Project Docs Table

Run this SQL to enable documentation for projects:

```sql
-- Project Documentation table
CREATE TABLE project_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_project_docs_project_id ON project_docs(project_id);
CREATE INDEX idx_project_docs_order ON project_docs(order_index);

-- Trigger for updated_at
CREATE TRIGGER update_project_docs_updated_at BEFORE UPDATE ON project_docs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE project_docs ENABLE ROW LEVEL SECURITY;

-- Policies for project_docs
CREATE POLICY "Enable read access for project_docs"
ON project_docs FOR SELECT USING (true);

CREATE POLICY "Enable insert for project_docs"
ON project_docs FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for project_docs"
ON project_docs FOR UPDATE USING (true);

CREATE POLICY "Enable delete for project_docs"
ON project_docs FOR DELETE USING (true);
```

## Step 9: Create Visitor Counter

Run this SQL to enable the visitor counter:

```sql
-- Visitor count table (single row)
CREATE TABLE visitor_count (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  count INTEGER DEFAULT 0,
  last_visited TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row
INSERT INTO visitor_count (count) VALUES (0);

-- Enable RLS
ALTER TABLE visitor_count ENABLE ROW LEVEL SECURITY;

-- Policy for reading
CREATE POLICY "Enable read for visitor_count"
ON visitor_count FOR SELECT USING (true);

-- Policy for updating
CREATE POLICY "Enable update for visitor_count"
ON visitor_count FOR UPDATE USING (true);

-- Create function to increment visitor count
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE visitor_count
  SET count = count + 1,
      last_visited = NOW()
  WHERE id = (SELECT id FROM visitor_count LIMIT 1)
  RETURNING count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO anon;
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO authenticated;
```

## Next Steps

Once you complete these steps:
1. ✅ Create Supabase project
2. ✅ Run SQL to create tables
3. ✅ Set up storage bucket
4. ✅ Add environment variables
5. ✅ Install Supabase client
6. ✅ Create project_docs table
7. ✅ Create visitor_count table and function

The implementation will automatically connect and start working!

## Troubleshooting

### Can't see tables?
- Make sure you ran the SQL in the SQL Editor
- Check for any error messages

### Images not loading?
- Verify storage bucket is public
- Check policies are correctly set

### Connection errors?
- Double-check environment variables
- Ensure URLs don't have trailing slashes
- Verify API keys are correct

## Security Notes

- ✅ Anon key is safe for client-side use
- ⚠️ Service role key should ONLY be used in API routes (server-side)
- ✅ Row Level Security (RLS) will be configured for admin access
- ✅ Admin secret code adds extra layer of protection

---

**Status**: Ready for implementation
**Estimated Time**: 15-20 minutes
**Difficulty**: Easy
