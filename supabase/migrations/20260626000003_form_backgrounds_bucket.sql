-- Storage bucket for form background images uploaded via the design tab.
-- Files are stored at {form_id}/bg_{timestamp}.{ext}
-- Path structure lets RLS validate ownership by joining forms on split_part(name,'/','1').

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'form-backgrounds',
  'form-backgrounds',
  true,
  5242880,   -- 5 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- SELECT: anyone can read (backgrounds are in publicly shared forms)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage'
      AND policyname = 'Anyone can view form backgrounds'
  ) THEN
    CREATE POLICY "Anyone can view form backgrounds"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'form-backgrounds');
  END IF;
END;
$$;

-- INSERT: only the form owner can upload to their own form's folder
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage'
      AND policyname = 'Form owners can upload background images'
  ) THEN
    CREATE POLICY "Form owners can upload background images"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'form-backgrounds'
      AND EXISTS (
        SELECT 1 FROM public.forms f
        WHERE f.id::text = split_part(name, '/', 1)
          AND f.owner_id = auth.uid()
      )
    );
  END IF;
END;
$$;

-- UPDATE (upsert): form owners can replace their backgrounds
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage'
      AND policyname = 'Form owners can replace background images'
  ) THEN
    CREATE POLICY "Form owners can replace background images"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'form-backgrounds'
      AND EXISTS (
        SELECT 1 FROM public.forms f
        WHERE f.id::text = split_part(storage.objects.name, '/', 1)
          AND f.owner_id = auth.uid()
      )
    );
  END IF;
END;
$$;

-- DELETE: form owners can remove their background images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects' AND schemaname = 'storage'
      AND policyname = 'Form owners can delete background images'
  ) THEN
    CREATE POLICY "Form owners can delete background images"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'form-backgrounds'
      AND EXISTS (
        SELECT 1 FROM public.forms f
        WHERE f.id::text = split_part(storage.objects.name, '/', 1)
          AND f.owner_id = auth.uid()
      )
    );
  END IF;
END;
$$;
