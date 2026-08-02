ALTER TABLE public.concern_reports ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.concern_reports ADD COLUMN IF NOT EXISTS image_path text;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('concern-images', 'concern-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Users upload their own concern images" ON storage.objects;
CREATE POLICY "Users upload their own concern images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'concern-images'
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

DROP POLICY IF EXISTS "Users delete their own concern images" ON storage.objects;
CREATE POLICY "Users delete their own concern images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'concern-images'
  AND owner_id = (SELECT auth.uid()::text)
);
