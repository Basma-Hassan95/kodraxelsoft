-- Meta ads: persist channel + badge so admin edits stick on the public site
ALTER TABLE meta_ads
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'Meta / Facebook',
  ADD COLUMN IF NOT EXISTS badge TEXT NOT NULL DEFAULT 'Sponsored Campaign';

-- Keep updated_at fresh on every edit
CREATE OR REPLACE FUNCTION set_meta_ads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_meta_ads_updated_at ON meta_ads;
CREATE TRIGGER trg_meta_ads_updated_at
  BEFORE UPDATE ON meta_ads
  FOR EACH ROW
  EXECUTE PROCEDURE set_meta_ads_updated_at();
