-- Newsletter / Engineering Brief subscribers (footer form)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT NOT NULL,
  source       TEXT NOT NULL DEFAULT 'footer',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  metadata     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscribers_email_unique
  ON newsletter_subscribers (lower(email));

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created
  ON newsletter_subscribers (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active
  ON newsletter_subscribers (is_active);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS newsletter_deny_all ON newsletter_subscribers;
CREATE POLICY newsletter_deny_all ON newsletter_subscribers
  FOR ALL USING (false);
