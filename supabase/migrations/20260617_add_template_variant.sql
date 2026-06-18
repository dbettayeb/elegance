INSERT INTO templates (id) VALUES ('ivoire_dore')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS template_variant text;
