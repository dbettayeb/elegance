INSERT INTO template_ids (id) VALUES ('jardin_rose')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS template_variant text;
