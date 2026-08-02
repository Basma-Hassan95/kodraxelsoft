-- Project media + pricing plans with discounts
-- Run in Supabase → SQL Editor

ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;
COMMENT ON COLUMN projects.video_url IS 'Optional project demo / showcase video URL';

CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price TEXT NOT NULL,
  compare_at_price TEXT,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_label TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge TEXT,
  cta_text TEXT DEFAULT 'Contact Us',
  cta_link TEXT DEFAULT '/contact',
  service_slug TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pricing_plans_active_order
  ON pricing_plans (is_active, display_order ASC);

ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS pricing_plans_public_select ON pricing_plans;
CREATE POLICY pricing_plans_public_select ON pricing_plans
  FOR SELECT USING (is_active = true);

DROP TRIGGER IF EXISTS trg_pricing_plans_updated_at ON pricing_plans;
CREATE TRIGGER trg_pricing_plans_updated_at
  BEFORE UPDATE ON pricing_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
