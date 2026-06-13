ALTER TABLE weddings
  ADD COLUMN guest_invite_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN guest_invite_prefix_ar text,
  ADD COLUMN guest_invite_suffix_ar text;
