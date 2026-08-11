alter table weddings
  add column if not exists guestbook_private boolean not null default false;
