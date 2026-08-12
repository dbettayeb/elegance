-- Template arabe "Soirée" : vidéo du couple dans le hero (intro_video_url)
-- et titre libre au-dessus de la date (wedding_day_text).
INSERT INTO templates (id) VALUES
  ('soiree_ar')
ON CONFLICT (id) DO NOTHING;
