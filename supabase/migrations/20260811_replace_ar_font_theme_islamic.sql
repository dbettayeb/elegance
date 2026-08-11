-- Migrer les anciennes valeurs calligraphique/contemporain vers classic
update weddings
  set ar_font_theme = 'classic'
  where ar_font_theme in ('calligraphique', 'contemporain');

-- Remplacer la contrainte CHECK avec les 4 thèmes islamiques
alter table weddings
  drop constraint if exists weddings_ar_font_theme_check;

alter table weddings
  add constraint weddings_ar_font_theme_check
    check (ar_font_theme in ('classic', 'modern', 'andalous', 'naskh'));
