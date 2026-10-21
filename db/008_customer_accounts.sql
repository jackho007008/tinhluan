-- Additive identity model. Email is display metadata, never an ownership key.
CREATE TABLE IF NOT EXISTS customer_users (
 id uuid PRIMARY KEY, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS customer_identities (
 provider text NOT NULL, subject text NOT NULL, user_id uuid NOT NULL REFERENCES customer_users(id),
 email text, display_name text, created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(provider,subject)
);
CREATE TABLE IF NOT EXISTS customer_sessions (
 hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES customer_users(id),
 expires_at timestamptz NOT NULL, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS customer_sessions_user ON customer_sessions(user_id);
CREATE TABLE IF NOT EXISTS customer_oauth_flows (
 state_hash text PRIMARY KEY, nonce text NOT NULL, verifier text NOT NULL,
 return_to text NOT NULL, expires_at timestamptz NOT NULL, consumed_at timestamptz
);
CREATE TABLE IF NOT EXISTS customer_reading_links (
 id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES customer_users(id),
 owner_hash text NOT NULL, reading_id uuid NOT NULL, order_id uuid REFERENCES orders(id),
 recovery_binding_id uuid REFERENCES reading_recovery_bindings(id),
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS customer_reading_links_original
 ON customer_reading_links(owner_hash,reading_id,COALESCE(order_id,'00000000-0000-0000-0000-000000000000'::uuid));
CREATE INDEX IF NOT EXISTS customer_reading_links_user ON customer_reading_links(user_id);
