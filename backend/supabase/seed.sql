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
  '{"metaTitle":"Kodraxelsoft | Custom Software & AI Tools for Growing Businesses","metaDescription":"We build simple digital tools, smart AI helpers, and custom websites that save you time and grow your sales. No confusing tech speak.","keywords":"custom software, AI tools, business websites, automation"}'::jsonb,
  'Kodraxelsoft builds fast, clean custom software and AI tools that save time and increase sales for growing businesses.',
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
  ('home', '/', 'Kodraxelsoft | Custom Software & AI Tools for Growing Businesses', 'We build simple digital tools, smart AI helpers, and custom websites that save you time and grow your sales. No confusing tech speak.', 'custom software, AI tools, business websites', '/'),
  ('services', '/services', 'Services | Kodraxelsoft', 'Next.js apps, AI agents, cloud infrastructure, and mobile.', 'services, software development', '/services'),
  ('portfolio', '/portfolio', 'Portfolio | Kodraxelsoft', 'Featured case studies and enterprise builds.', 'portfolio, case studies', '/portfolio'),
  ('about', '/about', 'About Kodraxelsoft | Experts in Simple Software & AI Solutions', 'Learn how Kodraxelsoft helps growing businesses build fast websites and smart AI tools. No middle agency overhead or technical jargon.', 'about, software team, AI solutions', '/about'),
  ('contact', '/contact', 'Contact Kodraxelsoft | Get a Free Custom Software Quote', 'Ready to build your next custom website or AI tool? Contact Kodraxelsoft today. We reply within 24 hours with a clear plan and zero pushy sales talk.', 'contact, hire, quote', '/contact'),
  ('blog', '/blog', 'Software Engineering Insights & Tech Guides | Kodraxelsoft Blog', 'Explore practical tech guides, web development case studies, and AI automation insights written directly by senior software engineers at Kodraxelsoft.', 'blog, software engineering, tech guides, AI automation', '/blog'),
  ('careers', '/careers', 'Careers at Kodraxelsoft | Join Our Team of Senior Builders', 'Build simple, high-speed software and smart AI tools with Kodraxelsoft. Remote-first culture, direct mentorship, and great benefits. Apply today.', 'careers, jobs, remote', '/careers'),
  ('process', '/process', 'Our Simple 6-Step Software Development Process | Kodraxelsoft', 'Discover how Kodraxelsoft takes your project from initial idea to live launch in 6 clear, stress-free stages. Guaranteed timelines and zero technical speak.', 'process, software development, timeline', '/process')
ON CONFLICT (page_key) DO NOTHING;

-- Sample Meta Ads (only when table is empty) so public showcase has live CMS data
INSERT INTO meta_ads (
  title, description, image_url, cta_text, link, status, display_order, channel, badge
)
SELECT * FROM (VALUES
  (
    'Fast Custom Websites That Convert Visitors into Customers',
    'See how we help growing businesses launch clean, high-speed websites that look great on phones and bring in more leads.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    'View Our Services',
    '/services',
    'active',
    0,
    'LinkedIn',
    'LinkedIn Sponsored'
  ),
  (
    'Smooth Mobile Apps Your Customers Love Using',
    'From food ordering to business dashboards — we build mobile-friendly apps with clean design and simple checkout flows.',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200',
    'See Live Projects',
    '/portfolio',
    'active',
    1,
    'Instagram',
    'Instagram Campaign'
  ),
  (
    'Smart AI Helpers That Handle Support 24/7',
    'Train digital assistants on your business info to answer customers, qualify leads, and cut hours of repetitive work.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    'Talk to Us',
    '/contact',
    'active',
    2,
    'Meta / Facebook',
    'Meta Sponsored Ad'
  )
) AS v(title, description, image_url, cta_text, link, status, display_order, channel, badge)
WHERE NOT EXISTS (SELECT 1 FROM meta_ads LIMIT 1);
