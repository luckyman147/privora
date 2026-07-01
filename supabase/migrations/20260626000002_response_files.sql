-- Dedicated table for file upload answers.
-- Each row is one file URL for one question in one response.
-- Linked to responses ON DELETE CASCADE so files are deleted from this
-- table automatically when a response is deleted.

CREATE TABLE IF NOT EXISTS response_files (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  form_id     UUID NOT NULL REFERENCES forms(id)     ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_name   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_response_files_response_id ON response_files(response_id);
CREATE INDEX IF NOT EXISTS idx_response_files_form_id     ON response_files(form_id);

ALTER TABLE response_files ENABLE ROW LEVEL SECURITY;

-- INSERT: same gate as the responses table — the form must be active.
-- The submit API route (anon key + RLS) inserts on behalf of respondents.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'response_files' AND policyname = 'Anyone can insert files for active forms'
  ) THEN
    CREATE POLICY "Anyone can insert files for active forms"
    ON response_files FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.forms f
        WHERE f.id = form_id AND f.status = 'active'
      )
    );
  END IF;
END;
$$;

-- SELECT: form owners can read their own response files.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'response_files' AND policyname = 'Form owners can read response files'
  ) THEN
    CREATE POLICY "Form owners can read response files"
    ON response_files FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.forms f
        WHERE f.id = form_id AND f.owner_id = auth.uid()
      )
    );
  END IF;
END;
$$;

-- DELETE: form owners can remove individual file records.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'response_files' AND policyname = 'Form owners can delete response files'
  ) THEN
    CREATE POLICY "Form owners can delete response files"
    ON response_files FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM public.forms f
        WHERE f.id = form_id AND f.owner_id = auth.uid()
      )
    );
  END IF;
END;
$$;
