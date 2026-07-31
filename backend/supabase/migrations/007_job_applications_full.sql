-- =============================================================================
-- Run in Supabase → SQL Editor after 006_job_applications.sql
-- Full professional hiring application fields + CV
-- NOTE: do not use column name "current_role" — it is reserved in PostgreSQL
-- =============================================================================

ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS years_experience TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS current_position TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS expected_salary TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS notice_period TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS cv_url TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS cv_filename TEXT;

COMMENT ON COLUMN job_applications.phone IS 'Applicant phone / WhatsApp';
COMMENT ON COLUMN job_applications.cv_url IS 'Uploaded CV/resume public URL';
COMMENT ON COLUMN job_applications.cover_note IS 'Cover letter';
COMMENT ON COLUMN job_applications.current_position IS 'Applicant current job title';
