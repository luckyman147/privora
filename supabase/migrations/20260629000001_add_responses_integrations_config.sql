ALTER TABLE forms
  ADD COLUMN IF NOT EXISTS responses_config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS integrations_config JSONB DEFAULT '{}'::jsonb;
