-- Toggle to show/hide the "Programme du mariage" / schedule-of-events section
-- in the public invitation. Mirrors the show_program option already exposed
-- in the client template preview.
ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS show_program boolean NOT NULL DEFAULT true;
