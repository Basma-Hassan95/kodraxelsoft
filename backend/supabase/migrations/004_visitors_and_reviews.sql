-- =============================================================================
-- Website visitors + public review moderation
-- =============================================================================

-- Page / session visit tracking
CREATE TABLE IF NOT EXISTS page_views (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      TEXT NOT NULL,
  visitor_hash    TEXT,
  page_path       TEXT NOT NULL DEFAULT '/',
  page_title      TEXT,
  referrer        TEXT,
  user_agent      TEXT,
  device_type     TEXT,
  browser         TEXT,
  os              TEXT,
  country         TEXT,
  city            TEXT,
  ip_hash         TEXT,
  is_unique_daily BOOLEAN NOT NULL DEFAULT FALSE,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views (visitor_hash);
CREATE INDEX IF NOT EXISTS idx_page_views_daily_unique
  ON page_views (created_at DESC)
  WHERE is_unique_daily = TRUE;

-- Daily aggregate rollups (fast dashboard queries)
CREATE TABLE IF NOT EXISTS visitor_daily_stats (
  stat_date       DATE PRIMARY KEY,
  total_views     INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_daily_stats_date ON visitor_daily_stats (stat_date DESC);

-- Public reviews need approval before showing on website
ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'admin';

ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE testimonials
  DROP CONSTRAINT IF EXISTS testimonials_source_check;

ALTER TABLE testimonials
  ADD CONSTRAINT testimonials_source_check
  CHECK (source IN ('admin', 'website'));

CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials (is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_pending
  ON testimonials (created_at DESC)
  WHERE is_approved = FALSE;

-- RLS
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_daily_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS page_views_deny_all ON page_views;
CREATE POLICY page_views_deny_all ON page_views FOR ALL USING (false);

DROP POLICY IF EXISTS visitor_stats_deny_all ON visitor_daily_stats;
CREATE POLICY visitor_stats_deny_all ON visitor_daily_stats FOR ALL USING (false);

-- Public can only see approved + enabled testimonials
DROP POLICY IF EXISTS testimonials_public_read ON testimonials;
CREATE POLICY testimonials_public_read ON testimonials
  FOR SELECT
  USING (is_enabled = true AND is_approved = true);

-- Public insert reviews (pending until admin approves)
DROP POLICY IF EXISTS testimonials_public_insert ON testimonials;
CREATE POLICY testimonials_public_insert ON testimonials
  FOR INSERT
  WITH CHECK (source = 'website' AND is_approved = false);
