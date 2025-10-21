-- Blog Categories Table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  -- content is stored as JSONB blocks to allow mixed content (paragraphs, images, code blocks, etc.)
  -- Example: [{ type: 'paragraph', text: '...' }, { type: 'image', src: '...', caption: '...' }]
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_image TEXT,
  author VARCHAR(100) DEFAULT 'Aariz Sheikh',
  tags TEXT[], -- Array of tags
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  reading_time INTEGER, -- in minutes
  metadata JSONB, -- For additional flexible data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
-- JSONB index to speed up queries that search for image blocks or specific block types
CREATE INDEX IF NOT EXISTS idx_blog_posts_content_gin ON blog_posts USING GIN (content jsonb_path_ops);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view active categories"
  ON blog_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view published posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

-- Admin policies (you'll need to set up proper auth)
-- For now, authenticated users can do everything
CREATE POLICY "Authenticated users can manage categories"
  ON blog_categories
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage posts"
  ON blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert sample categories
INSERT INTO blog_categories (name, slug, description, display_order) VALUES
  ('PROJECTS', 'projects', 'Completed projects and case studies', 1),
  ('CODE', 'code', 'Technical articles and tutorials', 2),
  ('THOUGHTS', 'thoughts', 'Personal reflections and insights', 3),
  ('TUTORIALS', 'tutorials', 'Step-by-step guides and walkthroughs', 4),
  ('REVIEWS', 'reviews', 'Tech reviews and opinions', 5)
ON CONFLICT (slug) DO NOTHING;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate reading time from JSONB content blocks
CREATE OR REPLACE FUNCTION calculate_reading_time_from_blocks(content_blocks JSONB)
RETURNS INTEGER AS $$
DECLARE
  total_words INTEGER := 0;
  paragraph TEXT;
  paragraphs JSONB;
BEGIN
  IF content_blocks IS NULL THEN
    RETURN 1;
  END IF;

  -- Extract all paragraph blocks and sum word counts
  FOR paragraphs IN SELECT jsonb_array_elements(content_blocks) LOOP
    IF (paragraphs ->> 'type') = 'paragraph' THEN
      paragraph := (paragraphs ->> 'text')::text;
      total_words := total_words + COALESCE(array_length(regexp_split_to_array(paragraph, '\s+'), 1), 0);
    END IF;
  END LOOP;

  IF total_words <= 0 THEN
    RETURN 1;
  END IF;

  RETURN GREATEST(1, CEIL(total_words::FLOAT / 200));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-calculate reading time from content JSONB blocks
CREATE OR REPLACE FUNCTION set_reading_time_from_blocks()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time := calculate_reading_time_from_blocks(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_post_reading_time
  BEFORE INSERT OR UPDATE OF content ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_reading_time_from_blocks();
