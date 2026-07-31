-- =============================================================================
-- Seed default CMS content (safe to re-run for empty tables)
-- =============================================================================

INSERT INTO website_settings (
  company_name, email, phone, address, logo_url, favicon_url,
  social_links, seo_defaults, footer_info, copyright_text, business_hours
)
SELECT
  'Kodraxelsoft Inc.',
  'hello@kodraxelsoft.com',
  '+1 (415) 890-4221',
  'Market Street, Suite 1400, San Francisco, CA',
  '/logo.jpg',
  '/ks-emblem.jpg',
  '{"github":"https://github.com","linkedin":"https://linkedin.com","twitter":"https://twitter.com"}'::jsonb,
  '{"metaTitle":"Kodraxelsoft | Ultra-Premium Software Engineering & AI Studio","metaDescription":"Elite software architecture laboratory specializing in Next.js web applications, custom AI model integration, and high-scale cloud infrastructure.","keywords":"Next.js 16, AI Engineering, Web Architecture"}'::jsonb,
  'Elite software engineering laboratory for Next.js, AI, and cloud.',
  '© 2026 Kodraxelsoft Inc. All rights reserved.',
  '{"monday_friday":"9:00 AM – 6:00 PM PST","saturday":"Closed","sunday":"Closed"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM website_settings LIMIT 1);

INSERT INTO hero_banners (
  title, subtitle, description, badge_text, highlight_text, cta_buttons, is_active
)
SELECT
  'Engineering High-Scale Web Apps & Autonomous AI Systems',
  'Kodraxelsoft is an ultra-premium software engineering laboratory.',
  'We partner with enterprise visionaries to architect sub-50ms Next.js web platforms, custom AI models, and cloud infrastructure.',
  '• Elite Engineering Studio • Next-Gen AI & Web Platforms',
  'Autonomous AI Systems',
  '[
    {"label":"Start a Project","href":"/contact","variant":"primary"},
    {"label":"Explore Capabilities","href":"/services","variant":"outline"}
  ]'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM hero_banners WHERE is_active = true);

INSERT INTO seo_pages (page_key, page_path, meta_title, meta_description, meta_keywords, canonical_url)
VALUES
  ('home', '/', 'Kodraxelsoft | Ultra-Premium Software Engineering', 'Elite Next.js, AI, and cloud engineering studio.', 'software house, Next.js, AI', '/'),
  ('services', '/services', 'Services | Kodraxelsoft', 'Next.js apps, AI agents, cloud infrastructure, and mobile.', 'services, software development', '/services'),
  ('portfolio', '/portfolio', 'Portfolio | Kodraxelsoft', 'Featured case studies and enterprise builds.', 'portfolio, case studies', '/portfolio'),
  ('about', '/about', 'About | Kodraxelsoft', 'Meet the Kodraxelsoft engineering laboratory.', 'about, team', '/about'),
  ('contact', '/contact', 'Contact | Kodraxelsoft', 'Start a project with Kodraxelsoft.', 'contact, hire', '/contact'),
  ('blog', '/blog', 'Blog | Kodraxelsoft', 'Engineering notes on Next.js, AI, and cloud.', 'blog, engineering', '/blog'),
  ('careers', '/careers', 'Careers | Kodraxelsoft', 'Join the Kodraxelsoft team.', 'careers, jobs', '/careers'),
  ('process', '/process', 'Process | Kodraxelsoft', 'How we design, build, and ship.', 'process, methodology', '/process')
ON CONFLICT (page_key) DO NOTHING;
