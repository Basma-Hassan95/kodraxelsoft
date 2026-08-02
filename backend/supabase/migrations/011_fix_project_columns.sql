-- Ensure project media + live-project flag columns exist
-- Run once in Supabase → SQL Editor

ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;
COMMENT ON COLUMN projects.video_url IS 'Optional project demo / showcase video URL';

ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_live_project BOOLEAN NOT NULL DEFAULT false;
COMMENT ON COLUMN projects.is_live_project IS 'Show this project in homepage Live Projects section';

CREATE INDEX IF NOT EXISTS idx_projects_live ON projects (is_live_project) WHERE is_live_project = true;
