-- Heure de fin, dress code, et version française du template Soirée.

-- Heure de fin de la fête. Un instant complet et non une simple heure : une
-- réception qui commence à 19h et se termine à 2h finit le lendemain, et une
-- colonne « time » seule rendrait cette fin antérieure à son début.
alter table weddings add column if not exists event_end_date timestamptz;

-- Dress code. Les deux textes sont libres ; les couleurs sont un tableau de
-- codes hexadécimaux, affichés en pastilles sous les consignes.
alter table weddings add column if not exists show_dress_code   boolean not null default false;
alter table weddings add column if not exists dress_code_women  text;
alter table weddings add column if not exists dress_code_men    text;
alter table weddings add column if not exists dress_code_colors jsonb not null default '[]'::jsonb;

-- Version française de Soirée. Même template, langue différente.
insert into templates (id) values ('soiree_fr') on conflict (id) do nothing;
