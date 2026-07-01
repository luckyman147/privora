ALTER TABLE forms
  ADD COLUMN IF NOT EXISTS notifications_config JSONB DEFAULT '{}'::jsonb;
