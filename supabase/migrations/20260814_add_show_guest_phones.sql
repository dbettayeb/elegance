-- Affichage des numéros de téléphone dans le portail des mariés.
--
-- Masqués par défaut : un numéro n'apporte rien au coup d'œil quotidien sur
-- les réponses, et il encombrait la carte sur téléphone. Les couples qui
-- veulent rappeler leurs invités l'activent à la demande.
alter table weddings
  add column if not exists show_guest_phones boolean not null default false;
