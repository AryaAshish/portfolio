-- ============================================================
-- Portfolio Supabase — baseline snapshot
-- ============================================================
-- Reproduces the live schema of the portfolio project
-- (the one referenced by NEXT_PUBLIC_SUPABASE_URL).
--
-- Apply once against a fresh database via the Supabase CLI or psql:
--   psql "$PORTFOLIO_DB_URL" -f supabase/migrations/portfolio/0000_init.sql
--
-- This snapshot flattens every ad-hoc change that was applied
-- directly to Supabase before the repo tracked migrations:
--   - blog_posts, content_pages, newsletter_subscribers, social_posts
--     (from the original supabase/schema.sql)
--   - auth_users (added 2026-04-18, previously at
--     supabase/migrations/20260418_create_auth_users.sql)
--
-- Every future schema change for the portfolio project lands as
-- a new timestamped file under supabase/migrations/portfolio/.
-- See supabase/migrations/README.md for the policy.
-- ============================================================

-- ── Blog Posts ───────────────────────────────────────────────
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

-- ── Content Pages ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Newsletter Subscribers ───────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ── Social Posts Cache ───────────────────────────────────────
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

-- ── Auth Users (admin + fittrack credentials) ────────────────
CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'fittrack')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug         ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published    ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category     ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags         ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_pages_type      ON content_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_subscribers_email       ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform   ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_published_at ON social_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_cached_at  ON social_posts(cached_at);
CREATE INDEX IF NOT EXISTS auth_users_username_idx     ON auth_users(username);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE blog_posts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts           ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published blog posts"     ON blog_posts;
DROP POLICY IF EXISTS "Public can read content pages"            ON content_pages;
DROP POLICY IF EXISTS "Public can insert newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can read social posts"             ON social_posts;

CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Public can read content pages"
  ON content_pages FOR SELECT
  USING (true);

CREATE POLICY "Public can insert newsletter subscribers"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read social posts"
  ON social_posts FOR SELECT
  USING (true);

-- auth_users is intentionally not exposed via RLS — all access
-- goes through the service-role key in server code.

-- ── updated_at trigger plumbing ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_posts_updated_at    ON blog_posts;
DROP TRIGGER IF EXISTS update_content_pages_updated_at ON content_pages;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
