-- Portfolio Database Schema for Supabase

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'general',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Pages Table (for home, about, experience, skills, courses, life)
CREATE TABLE IF NOT EXISTS content_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT UNIQUE NOT NULL, -- 'home', 'about', 'experience', 'skills', 'courses', 'life'
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_pages_type ON content_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);

-- Row Level Security (RLS) Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blog posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- Allow public read access to content pages
CREATE POLICY "Public can read content pages"
  ON content_pages FOR SELECT
  USING (true);

-- Allow public to insert newsletter subscribers
CREATE POLICY "Public can insert newsletter subscribers"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Admin policies (require service role key)
-- Note: These are handled via service role key, not RLS policies
-- Service role key bypasses RLS

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Social Posts Cache Table (for YouTube and Instagram)
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram')),
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT NOT NULL,
  url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  metadata JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(platform, external_id)
);

-- Indexes for social posts
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_published_at ON social_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_cached_at ON social_posts(cached_at);

-- RLS for social posts
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to social posts
CREATE POLICY "Public can read social posts"
  ON social_posts FOR SELECT
  USING (true);

