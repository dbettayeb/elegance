-- Réaligne les contraintes sur ce que l'application accepte réellement.
--
-- Elles avaient été écrites pour les anciennes limites et n'ont pas suivi. Une
-- saisie que le code laisse passer mais que la base refuse ne produit pas un
-- message d'erreur utile : elle remonte en « Erreur serveur », l'invité ne
-- comprend pas, et son message est perdu.
--
-- Deux de ces écarts sont actifs en production :
--   - un message de livre d'or de plus de 500 caractères échoue, alors que
--     c'est précisément la troncature silencieuse qu'on cherchait à supprimer ;
--   - une note de RSVP de plus de 300 caractères échoue de même.
--
-- Les minimums disparaissent : les routes exigent déjà des champs non vides, et
-- refuser « Bravo ! » parce qu'il fait moins de cinq caractères n'a pas de sens
-- pour un livre d'or.

begin;

-- ── Livre d'or ──
alter table guestbook drop constraint if exists guestbook_message_check;
alter table guestbook
  add constraint guestbook_message_check
  check (char_length(message) between 1 and 3000);

-- sanitizeName tronque à 80 : la base en refusait 60, donc un nom long échouait.
alter table guestbook drop constraint if exists guestbook_author_name_check;
alter table guestbook
  add constraint guestbook_author_name_check
  check (char_length(author_name) between 1 and 80);

-- ── RSVP ──
alter table rsvps drop constraint if exists rsvps_note_check;
alter table rsvps
  add constraint rsvps_note_check
  check (note is null or char_length(note) <= 1500);

alter table rsvps drop constraint if exists rsvps_name_check;
alter table rsvps
  add constraint rsvps_name_check
  check (char_length(name) between 1 and 80);

-- Le plafond d'accompagnants est désormais réglable par mariage (max_guests) :
-- figé à 20 ici, tout mariage autorisant davantage voyait ses RSVP échouer.
-- La vraie limite est appliquée par la route ; celle-ci n'est qu'un garde-fou.
alter table rsvps drop constraint if exists rsvps_guests_check;
alter table rsvps
  add constraint rsvps_guests_check
  check (guests >= 0 and guests <= 500);

commit;
