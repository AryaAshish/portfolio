-- Auth credentials for admin + fittrack access.
-- Lives in the portfolio Supabase project.

CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'fittrack')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_users_username_idx ON auth_users (username);
