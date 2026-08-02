-- Live Projects homepage showcase flag
-- Run in Supabase → SQL Editor

ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_live_project BOOLEAN NOT NULL DEFAULT false;
COMMENT ON COLUMN projects.is_live_project IS 'Show this project in homepage Live Projects section (image/video + live URL)';

CREATE INDEX IF NOT EXISTS idx_projects_live ON projects (is_live_project) WHERE is_live_project = true;
