-- =============================================================================
-- Supabase Storage buckets + policies
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'media',
    'media',
    true,
    52428800,
    ARRAY[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'image/x-icon', 'video/mp4', 'video/webm', 'application/pdf'
    ]
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Folder convention inside bucket `media`:
--   heroes/  services/  projects/  testimonials/  meta-ads/  seo/  logos/  uploads/

DROP POLICY IF EXISTS media_public_read ON storage.objects;
CREATE POLICY media_public_read ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Writes go through Express with service role (bypasses RLS).
-- Keep anon writes disabled.
DROP POLICY IF EXISTS media_deny_anon_write ON storage.objects;
CREATE POLICY media_deny_anon_write ON storage.objects
  FOR INSERT
  WITH CHECK (false);

DROP POLICY IF EXISTS media_deny_anon_update ON storage.objects;
CREATE POLICY media_deny_anon_update ON storage.objects
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS media_deny_anon_delete ON storage.objects;
CREATE POLICY media_deny_anon_delete ON storage.objects
  FOR DELETE
  USING (false);
