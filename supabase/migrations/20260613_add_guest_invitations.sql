CREATE TABLE guest_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  guest_name_ar text NOT NULL,
  token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX guest_invitations_wedding_id_idx ON guest_invitations(wedding_id);
CREATE INDEX guest_invitations_token_idx ON guest_invitations(token);
