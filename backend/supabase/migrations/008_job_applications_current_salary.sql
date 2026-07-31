-- Add current salary to job applications
-- Run in Supabase → SQL Editor after 007_job_applications_full.sql

ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS current_salary TEXT;

COMMENT ON COLUMN job_applications.current_salary IS 'Applicant current salary';
