CREATE EXTENSION IF NOT EXISTS pgcrypto;

--------------------------------------------------------------------------------
-- PROFILES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  username   TEXT,
  image_url  TEXT,
  plan       TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'club', 'institution')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can read own profile') THEN
    CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END;
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, image_url, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'preferred_username', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'user_name', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'username', ''),
      SPLIT_PART(NEW.email, '@', 1)
    ),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'avatar_url', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'picture', '')
    ),
    'starter'
  );
  RETURN NEW;
EXCEPTION WHEN undefined_table THEN
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

--------------------------------------------------------------------------------
-- FORMS
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS forms (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  mode         TEXT NOT NULL CHECK (mode IN ('survey', 'election')),
  trust_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  questions    JSONB NOT NULL DEFAULT '[]'::jsonb,
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  closes_at    TIMESTAMPTZ
);

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'forms' AND policyname = 'Owners can CRUD their forms') THEN
    CREATE POLICY "Owners can CRUD their forms" ON forms FOR ALL USING (auth.uid() = owner_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'forms' AND policyname = 'Anyone can read active forms') THEN
    CREATE POLICY "Anyone can read active forms" ON forms FOR SELECT USING (status = 'active');
  END IF;
END;
$$;

--------------------------------------------------------------------------------
-- RESPONSES
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS responses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id      UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  answers      JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'responses' AND policyname = 'Form owners can read responses') THEN
    CREATE POLICY "Form owners can read responses" ON responses FOR SELECT
      USING (EXISTS (SELECT 1 FROM forms WHERE forms.id = responses.form_id AND forms.owner_id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'responses' AND policyname = 'Anyone can insert responses') THEN
    CREATE POLICY "Anyone can insert responses" ON responses FOR INSERT WITH CHECK (true);
  END IF;
END;
$$;

--------------------------------------------------------------------------------
-- SUBMISSION TOKENS (duplicate detection)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS submission_tokens (
  hash       TEXT PRIMARY KEY,
  form_id    UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE submission_tokens ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submission_tokens' AND policyname = 'Anyone can insert submission tokens') THEN
    CREATE POLICY "Anyone can insert submission tokens" ON submission_tokens FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submission_tokens' AND policyname = 'Anyone can read submission tokens') THEN
    CREATE POLICY "Anyone can read submission tokens" ON submission_tokens FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submission_tokens' AND policyname = 'Form owners can delete submission tokens') THEN
    CREATE POLICY "Form owners can delete submission tokens" ON submission_tokens FOR DELETE
      USING (EXISTS (SELECT 1 FROM forms WHERE forms.id = submission_tokens.form_id AND forms.owner_id = auth.uid()));
  END IF;
END;
$$;

--------------------------------------------------------------------------------
-- INDEXES
--------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_forms_owner_id               ON forms(owner_id);
CREATE INDEX IF NOT EXISTS idx_responses_form_id            ON responses(form_id);
CREATE INDEX IF NOT EXISTS idx_submission_tokens_form_id    ON submission_tokens(form_id);

-- Auto-update updated_at on forms
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_forms_updated_at ON forms;
CREATE TRIGGER trg_forms_updated_at
  BEFORE UPDATE ON forms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
