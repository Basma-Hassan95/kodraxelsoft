-- =============================================================================
-- Kodraxelsoft CMS — Initial Schema
-- Run in Supabase SQL Editor (or via supabase db push)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'delivered',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE project_status AS ENUM (
    'draft',
    'published',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE media_type AS ENUM ('image', 'video', 'document', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE activity_action AS ENUM (
    'create',
    'update',
    'delete',
    'login',
    'upload',
    'status_change'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- Admin (single admin only — enforced by trigger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION enforce_single_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM admins) >= 1 AND TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Only one admin account is allowed';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_single_admin ON admins;
CREATE TRIGGER trg_single_admin
  BEFORE INSERT ON admins
  FOR EACH ROW
  EXECUTE FUNCTION enforce_single_admin();

-- -----------------------------------------------------------------------------
-- Website settings (singleton row)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS website_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name    TEXT NOT NULL DEFAULT 'Kodraxelsoft',
  logo_url        TEXT,
  favicon_url     TEXT,
  email           TEXT,
  phone           TEXT,
  address         TEXT,
  google_maps_url TEXT,
  social_links    JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_defaults    JSONB NOT NULL DEFAULT '{}'::jsonb,
  footer_info     TEXT,
  copyright_text  TEXT,
  business_hours  JSONB NOT NULL DEFAULT '{}'::jsonb,
  extra           JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Hero banner (singleton active row pattern — keep history via soft flag)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hero_banners (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  subtitle          TEXT,
  description       TEXT,
  badge_text        TEXT,
  highlight_text    TEXT,
  cta_buttons       JSONB NOT NULL DEFAULT '[]'::jsonb,
  background_image  TEXT,
  hero_image        TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_banners_active ON hero_banners (is_active) WHERE is_active = TRUE;

-- -----------------------------------------------------------------------------
-- Services
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  subtitle        TEXT,
  description     TEXT,
  icon            TEXT,
  image_url       TEXT,
  features        JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables    JSONB NOT NULL DEFAULT '[]'::jsonb,
  technologies    JSONB NOT NULL DEFAULT '[]'::jsonb,
  button_text     TEXT DEFAULT 'Learn More',
  button_link     TEXT DEFAULT '/contact',
  base_price      TEXT,
  estimated_weeks TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  slug            TEXT UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_order ON services (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_services_enabled ON services (is_enabled);

-- -----------------------------------------------------------------------------
-- Projects / Portfolio
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  category         TEXT,
  technologies     JSONB NOT NULL DEFAULT '[]'::jsonb,
  description      TEXT,
  tagline          TEXT,
  challenge        TEXT,
  solution         TEXT,
  impact_metrics   JSONB NOT NULL DEFAULT '[]'::jsonb,
  images           JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_image      TEXT,
  live_url         TEXT,
  github_url       TEXT,
  client_name      TEXT,
  completion_date  DATE,
  year             TEXT,
  status           project_status NOT NULL DEFAULT 'published',
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  display_order    INTEGER NOT NULL DEFAULT 0,
  slug             TEXT UNIQUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);

-- -----------------------------------------------------------------------------
-- Meta Ads
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS meta_ads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  image_url    TEXT,
  cta_text     TEXT,
  link         TEXT,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  display_order INTEGER NOT NULL DEFAULT 0,
  channel      TEXT NOT NULL DEFAULT 'Meta / Facebook',
  badge        TEXT NOT NULL DEFAULT 'Sponsored Campaign',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meta_ads_status ON meta_ads (status);
CREATE INDEX IF NOT EXISTS idx_meta_ads_order ON meta_ads (display_order ASC);

-- -----------------------------------------------------------------------------
-- Testimonials / Reviews
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name   TEXT NOT NULL,
  company       TEXT,
  position      TEXT,
  review        TEXT NOT NULL,
  rating        SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  profile_image TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_enabled ON testimonials (is_enabled);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials (display_order ASC);

-- -----------------------------------------------------------------------------
-- Orders
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE,
  client_name     TEXT NOT NULL,
  client_email    TEXT NOT NULL,
  client_phone    TEXT,
  client_company  TEXT,
  project_type    TEXT,
  budget          TEXT,
  details         TEXT,
  status          order_status NOT NULL DEFAULT 'pending',
  notes           TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders (client_email);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_search ON orders
  USING gin (to_tsvector('english', coalesce(client_name,'') || ' ' || coalesce(client_email,'') || ' ' || coalesce(client_company,'') || ' ' || coalesce(project_type,'')));

-- -----------------------------------------------------------------------------
-- Contact messages
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  company    TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  metadata   JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages (is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_search ON contact_messages
  USING gin (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(email,'') || ' ' || coalesce(subject,'') || ' ' || coalesce(message,'')));

-- -----------------------------------------------------------------------------
-- SEO per page
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_pages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key         TEXT NOT NULL UNIQUE,
  page_path        TEXT NOT NULL,
  meta_title       TEXT,
  meta_description TEXT,
  meta_keywords    TEXT,
  og_image         TEXT,
  canonical_url    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_pages_path ON seo_pages (page_path);

-- -----------------------------------------------------------------------------
-- Media library
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename     TEXT NOT NULL,
  original_name TEXT,
  url          TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type    TEXT,
  size_bytes   BIGINT DEFAULT 0,
  media_type   media_type NOT NULL DEFAULT 'image',
  folder       TEXT NOT NULL DEFAULT 'uploads',
  alt_text     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_folder ON media_assets (folder);
CREATE INDEX IF NOT EXISTS idx_media_type ON media_assets (media_type);
CREATE INDEX IF NOT EXISTS idx_media_created ON media_assets (created_at DESC);

-- -----------------------------------------------------------------------------
-- Blog posts (aligned with existing admin UI)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  excerpt        TEXT,
  category       TEXT,
  author_name    TEXT,
  author_role    TEXT,
  author_avatar  TEXT,
  published_date DATE,
  read_time      TEXT,
  image_url      TEXT,
  content        JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured    BOOLEAN NOT NULL DEFAULT FALSE,
  is_published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_featured ON blog_posts (is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts (is_published);

-- -----------------------------------------------------------------------------
-- Careers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS careers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  department   TEXT,
  type         TEXT,
  location     TEXT,
  salary       TEXT,
  description  TEXT,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_careers_active ON careers (is_active);

-- -----------------------------------------------------------------------------
-- Activity log (dashboard recent activity)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action      activity_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   TEXT,
  summary     TEXT NOT NULL,
  metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs (created_at DESC);

-- -----------------------------------------------------------------------------
-- updated_at helper
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'admins', 'website_settings', 'hero_banners', 'services', 'projects',
    'meta_ads', 'testimonials', 'orders', 'contact_messages', 'seo_pages',
    'blog_posts', 'careers'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- -----------------------------------------------------------------------------
-- Order number generator
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'ORD-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_number ON orders;
CREATE TRIGGER trg_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();
