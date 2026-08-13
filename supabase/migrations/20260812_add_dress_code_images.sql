-- Photos d'inspiration du dress code.
--
-- Liens saisis à la création de l'invitation, hébergés côté Supabase Storage,
-- plutôt que des fichiers embarqués dans le projet comme le fait Alexa &
-- Richard : chaque couple montre ses propres tenues.
alter table weddings
  add column if not exists dress_code_images jsonb not null default '[]'::jsonb;
