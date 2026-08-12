-- Limite d'accompagnants par invité pour le RSVP.
-- NULL = illimité (comportement historique, plafonné à 20 côté serveur).
ALTER TABLE weddings
  ADD COLUMN IF NOT EXISTS max_guests integer;
