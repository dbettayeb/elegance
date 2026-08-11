alter table weddings
  add column if not exists ar_font_theme text not null default 'classic'
    check (ar_font_theme in ('classic', 'modern'));
