-- migrations/create_survey_responses_new.sql
-- Creates the table `survey_responses_new` in Supabase/Postgres
-- Fields mirror the existing `survey_responses` table but with a serial integer id

CREATE TABLE IF NOT EXISTS public.survey_responses_new (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  is_dev BOOLEAN DEFAULT FALSE,
  full_name TEXT,
  education_level TEXT,
  industry TEXT,
  mission_focus JSONB,
  strength_areas JSONB,
  learning_preference TEXT,
  portfolio JSONB,
  experience_summary TEXT,
  platform_connections JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index to speed up lookups by user
CREATE INDEX IF NOT EXISTS idx_survey_responses_new_user_id ON public.survey_responses_new (user_id);

-- Make id start from 1 (BIGSERIAL does this by default on creation)
-- If you ever need to reset the sequence:
-- ALTER SEQUENCE public.survey_responses_new_id_seq RESTART WITH 1;
