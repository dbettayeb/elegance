-- Remplace la contrainte CHECK pour accepter les 4 thèmes typographiques
alter table weddings
  drop constraint if exists weddings_ar_font_theme_check;

alter table weddings
  add constraint weddings_ar_font_theme_check
    check (ar_font_theme in ('classic', 'modern', 'calligraphique', 'contemporain'));
