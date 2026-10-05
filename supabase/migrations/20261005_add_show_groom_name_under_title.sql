alter table weddings
  add column if not exists show_groom_name_under_title boolean not null default false;