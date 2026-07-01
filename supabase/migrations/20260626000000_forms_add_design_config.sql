-- Add design_config, language, and opens_at columns to forms table

ALTER TABLE forms
  ADD COLUMN IF NOT EXISTS design_config JSONB,
  ADD COLUMN IF NOT EXISTS language      TEXT,
  ADD COLUMN IF NOT EXISTS opens_at      TIMESTAMPTZ;
