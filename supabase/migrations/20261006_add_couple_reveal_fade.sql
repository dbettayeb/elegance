alter table weddings
  add column if not exists couple_reveal_photo_url text;

alter table weddings
  add column if not exists couple_reveal_fade_seconds integer not null default 4
  check (couple_reveal_fade_seconds between 1 and 15);