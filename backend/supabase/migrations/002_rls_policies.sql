-- =============================================================================
-- Row Level Security policies
-- Backend uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- Anon key is locked down: public read for published content only.
-- =============================================================================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- No direct client access to admins
DROP POLICY IF EXISTS admins_deny_all ON admins;
CREATE POLICY admins_deny_all ON admins FOR ALL USING (false);

-- Public read: settings
DROP POLICY IF EXISTS settings_public_read ON website_settings;
CREATE POLICY settings_public_read ON website_settings
  FOR SELECT USING (true);

-- Public read: active hero
DROP POLICY IF EXISTS hero_public_read ON hero_banners;
CREATE POLICY hero_public_read ON hero_banners
  FOR SELECT USING (is_active = true);

-- Public read: enabled services
DROP POLICY IF EXISTS services_public_read ON services;
CREATE POLICY services_public_read ON services
  FOR SELECT USING (is_enabled = true);

-- Public read: published projects
DROP POLICY IF EXISTS projects_public_read ON projects;
CREATE POLICY projects_public_read ON projects
  FOR SELECT USING (status = 'published');

-- Public read: active meta ads
DROP POLICY IF EXISTS meta_ads_public_read ON meta_ads;
CREATE POLICY meta_ads_public_read ON meta_ads
  FOR SELECT USING (status = 'active');

-- Public read: enabled testimonials
DROP POLICY IF EXISTS testimonials_public_read ON testimonials;
CREATE POLICY testimonials_public_read ON testimonials
  FOR SELECT USING (is_enabled = true);

-- Public read: SEO
DROP POLICY IF EXISTS seo_public_read ON seo_pages;
CREATE POLICY seo_public_read ON seo_pages
  FOR SELECT USING (true);

-- Public read: media metadata
DROP POLICY IF EXISTS media_public_read ON media_assets;
CREATE POLICY media_public_read ON media_assets
  FOR SELECT USING (true);

-- Public read: published blog
DROP POLICY IF EXISTS blog_public_read ON blog_posts;
CREATE POLICY blog_public_read ON blog_posts
  FOR SELECT USING (is_published = true);

-- Public read: active careers
DROP POLICY IF EXISTS careers_public_read ON careers;
CREATE POLICY careers_public_read ON careers
  FOR SELECT USING (is_active = true);

-- Public insert: contact + orders (forms)
DROP POLICY IF EXISTS contact_public_insert ON contact_messages;
CREATE POLICY contact_public_insert ON contact_messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS orders_public_insert ON orders;
CREATE POLICY orders_public_insert ON orders
  FOR INSERT WITH CHECK (true);

-- Deny public reads on private tables
DROP POLICY IF EXISTS orders_deny_select ON orders;
CREATE POLICY orders_deny_select ON orders FOR SELECT USING (false);

DROP POLICY IF EXISTS contact_deny_select ON contact_messages;
CREATE POLICY contact_deny_select ON contact_messages FOR SELECT USING (false);

DROP POLICY IF EXISTS activity_deny_all ON activity_logs;
CREATE POLICY activity_deny_all ON activity_logs FOR ALL USING (false);
