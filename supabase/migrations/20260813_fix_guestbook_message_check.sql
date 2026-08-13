-- Aligne la contrainte du livre d'or sur la limite réelle de l'application.
--
-- Elle rejetait « ss » : un minimum de longueur y était inscrit, si bien qu'un
-- invité écrivant un mot très court recevait « Erreur serveur ». Un message
-- court reste un message, et le seul minimum utile est qu'il ne soit pas vide —
-- ce que la route vérifie déjà.
--
-- Le plafond passe à 3000 caractères pour correspondre à ce que l'API accepte
-- désormais : laissé à 500, il aurait fait échouer tout message plus long.

alter table guestbook drop constraint if exists guestbook_message_check;

alter table guestbook
  add constraint guestbook_message_check
  check (char_length(message) between 1 and 3000);
