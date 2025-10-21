-- Create storage bucket for blog images
-- NOTE: Do this via Supabase Dashboard instead of SQL
-- Go to Storage > Create a new bucket > Name: "blog-storage" > Public bucket: ON

-- Or use this SQL approach (requires proper permissions):
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-storage', 'blog-storage', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies are automatically created for public buckets
-- If you need custom policies, use the Supabase Dashboard:
-- Storage > blog-storage > Policies > New Policy

-- Alternative: If you have the right permissions, try these policies:
-- (These may fail in SQL Editor due to permission restrictions)

-- Public read access (allows anyone to view images)
-- CREATE POLICY "Public read access for blog images"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'blog-storage');

-- Public upload (allows anyone to upload - use with caution!)
-- For authenticated-only uploads, use: TO authenticated instead of TO public
-- CREATE POLICY "Public upload blog images"
-- ON storage.objects FOR INSERT
-- TO public
-- WITH CHECK (bucket_id = 'blog-storage');

-- Public update
-- CREATE POLICY "Public update blog images"
-- ON storage.objects FOR UPDATE
-- TO public
-- USING (bucket_id = 'blog-storage');

-- Public delete
-- CREATE POLICY "Public delete blog images"
-- ON storage.objects FOR DELETE
-- TO public
-- USING (bucket_id = 'blog-storage');
