-- Répare les textes stockés échappés en HTML.
--
-- L'ancien sanitizeText() échappait avant stockage, puis React ré-échappait à
-- l'affichage : un « J'espère » saisi par un invité s'affichait « J&#x27;espère »
-- dans le livre d'or, et une date « 12/09 » devenait « 12&#x2F;09 ».
-- L'échappement se fait désormais à l'affichage ; on remet donc en base le
-- texte tel qu'il a été écrit.
--
-- L'ancienne fonction n'échappait jamais l'esperluette, donc aucun &amp;
-- n'a été produit par elle : les cinq entités ci-dessous se décodent sans
-- ambiguïté et dans n'importe quel ordre.

create or replace function unescape_legacy_html(t text) returns text as $$
  select replace(replace(replace(replace(replace(
    t, '&#x2F;', '/'), '&#x27;', ''''), '&quot;', '"'), '&gt;', '>'), '&lt;', '<')
$$ language sql immutable;

update guestbook
   set author_name = unescape_legacy_html(author_name),
       message     = unescape_legacy_html(message)
 where author_name like '%&%' or message like '%&%';

update rsvps
   set name = unescape_legacy_html(name),
       note = unescape_legacy_html(note)
 where name like '%&%' or note like '%&%';

update weddings
   set bride_name        = unescape_legacy_html(bride_name),
       groom_name        = unescape_legacy_html(groom_name),
       bride_name_ar     = unescape_legacy_html(bride_name_ar),
       groom_name_ar     = unescape_legacy_html(groom_name_ar),
       venue_name        = unescape_legacy_html(venue_name),
       couple_email      = unescape_legacy_html(couple_email),
       custom_message    = unescape_legacy_html(custom_message),
       families_intro_ar = unescape_legacy_html(families_intro_ar)
 where bride_name        like '%&%' or groom_name        like '%&%'
    or bride_name_ar     like '%&%' or groom_name_ar     like '%&%'
    or venue_name        like '%&%' or couple_email      like '%&%'
    or custom_message    like '%&%' or families_intro_ar like '%&%';

drop function unescape_legacy_html(text);
