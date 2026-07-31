-- =============================================================================
-- Run this in Supabase → SQL Editor → New query → Run
-- Creates job_applications for /careers apply form
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS job_applications (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id        UUID REFERENCES careers(id) ON DELETE SET NULL,
  career_title     TEXT NOT NULL,
  applicant_name   TEXT NOT NULL,
  applicant_email  TEXT NOT NULL,
  portfolio_url    TEXT,
  cover_note       TEXT,
  status           TEXT NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'reviewing', 'interview', 'hired', 'rejected')),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications (status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created ON job_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications (applicant_email);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS job_applications_public_insert ON job_applications;
CREATE POLICY job_applications_public_insert ON job_applications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS job_applications_deny_select ON job_applications;
CREATE POLICY job_applications_deny_select ON job_applications
  FOR SELECT USING (false);

DROP TRIGGER IF EXISTS trg_job_applications_updated_at ON job_applications;
CREATE TRIGGER trg_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
