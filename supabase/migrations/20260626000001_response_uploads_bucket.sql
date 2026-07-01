-- Storage bucket for form response file uploads
--
-- Path convention: {form_id}/{question_id}/{timestamp}_{filename}
-- The form_id as the first path segment is used by RLS policies to scope
-- permissions to the owning form.

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('response-uploads', 'response-uploads', true, 52428800)  -- 50 MB max
ON CONFLICT (id) DO NOTHING;

-- INSERT: only allow uploads whose path starts with an existing *active* form id.
-- This prevents the bucket from being used as anonymous free file hosting —
-- every upload must correspond to a real, open form.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects'
    AND schemaname = 'storage'
    AND policyname = 'Respondents can upload to active form folders'
  ) THEN
    CREATE POLICY "Respondents can upload to active form folders"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'response-uploads' AND
      EXISTS (
        SELECT 1 FROM public.forms f
        WHERE f.id::text = split_part(name, '/', 1)
        AND   f.status   = 'active'
      )
    );
  END IF;
END;
$$;

-- SELECT: public read so URLs stored in the answers JSONB are directly accessible.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects'
    AND schemaname = 'storage'
    AND policyname = 'Public can read response files'
  ) THEN
    CREATE POLICY "Public can read response files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'response-uploads');
  END IF;
END;
$$;

-- DELETE: only the owner of the form that the file belongs to may delete it.
-- Extracts the form_id from the first path segment and checks forms.owner_id.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects'
    AND schemaname = 'storage'
    AND policyname = 'Form owners can delete their response files'
  ) THEN
    CREATE POLICY "Form owners can delete their response files"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'response-uploads' AND
      EXISTS (
        SELECT 1 FROM public.forms f
        WHERE f.id::text    = split_part(storage.objects.name, '/', 1)
        AND   f.owner_id    = auth.uid()
      )
    );
  END IF;
END;
$$;
