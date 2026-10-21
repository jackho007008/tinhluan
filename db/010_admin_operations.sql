-- Additive G5. No customer role, grant, report or article is changed by migration.
CREATE TABLE IF NOT EXISTS admin_roles (
 user_id uuid PRIMARY KEY REFERENCES customer_users(id),
 role text NOT NULL CHECK(role='admin'), granted_at timestamptz NOT NULL DEFAULT now(),
 revoked_at timestamptz
);
CREATE TABLE IF NOT EXISTS admin_audit (
 id uuid PRIMARY KEY, actor_user_id uuid REFERENCES customer_users(id),
 actor_kind text NOT NULL CHECK(actor_kind IN ('admin','server-operator')),
 action text NOT NULL CHECK(action IN ('article.create','article.save','article.publish','article.hide','role.grant','role.revoke')),
 target_id uuid NOT NULL, revision integer, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS operations_events (
 id uuid PRIMARY KEY, channel text NOT NULL CHECK(channel IN ('pdf','email','report','webhook')),
 outcome text NOT NULL CHECK(outcome IN ('success','failure','received')),
 code text NOT NULL, reading_id uuid, order_id uuid, transaction_id text, job_id uuid,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS operations_events_order ON operations_events(order_id,created_at DESC);
CREATE INDEX IF NOT EXISTS operations_events_reading ON operations_events(reading_id,created_at DESC);
CREATE INDEX IF NOT EXISTS operations_events_time ON operations_events(created_at DESC);
CREATE TABLE IF NOT EXISTS operations_metadata (key text PRIMARY KEY, started_at timestamptz NOT NULL DEFAULT now());
INSERT INTO operations_metadata(key) VALUES('g5-observation') ON CONFLICT DO NOTHING;
