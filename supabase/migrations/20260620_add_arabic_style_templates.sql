INSERT INTO templates (id) VALUES
  ('toile_bleue_ar'),
  ('jardin_rose_ar'),
  ('floral_arch_ar'),
  ('roses_ivoire_ar'),
  ('rose_bleu_ar')
ON CONFLICT (id) DO NOTHING;
