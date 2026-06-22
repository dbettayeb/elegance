-- Multi-party weddings (e.g. Tunisia): additional celebrations stored as JSONB.
-- The main reception stays driven by event_date / venue_name.
ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS parties jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Viktor & Paula media fields (previously applied manually in prod).
ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS couple_photo     text,
  ADD COLUMN IF NOT EXISTS intro_video_url  text,
  ADD COLUMN IF NOT EXISTS wedding_day_text text,
  ADD COLUMN IF NOT EXISTS venue_photo      text;
