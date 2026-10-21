-- Recovery attaches to existing immutable artifacts; it never copies or rebuilds a reading.
CREATE TABLE IF NOT EXISTS reading_recovery_bindings (
 id uuid PRIMARY KEY,
 owner_hash text NOT NULL,
 reading_id uuid NOT NULL,
 order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
 email text NOT NULL,
 expires_at timestamptz NOT NULL,
 verified_at timestamptz,
 revoked_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS recovery_binding_identity ON reading_recovery_bindings(owner_hash,reading_id,COALESCE(order_id::text,''),email);
CREATE INDEX IF NOT EXISTS recovery_verified_email ON reading_recovery_bindings(email) WHERE verified_at IS NOT NULL;
ALTER TABLE access_tokens ADD COLUMN IF NOT EXISTS recovery_binding_id uuid REFERENCES reading_recovery_bindings(id) ON DELETE CASCADE;
ALTER TABLE email_deliveries ADD COLUMN IF NOT EXISTS recovery_binding_id uuid UNIQUE REFERENCES reading_recovery_bindings(id) ON DELETE CASCADE;

-- Preserve deletion semantics of the existing maintenance flow, including upgrade from QA iterations.
ALTER TABLE reading_recovery_bindings DROP CONSTRAINT IF EXISTS reading_recovery_bindings_order_id_fkey;
ALTER TABLE reading_recovery_bindings ADD CONSTRAINT reading_recovery_bindings_order_id_fkey FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE access_tokens DROP CONSTRAINT IF EXISTS access_tokens_recovery_binding_id_fkey;
ALTER TABLE access_tokens ADD CONSTRAINT access_tokens_recovery_binding_id_fkey FOREIGN KEY(recovery_binding_id) REFERENCES reading_recovery_bindings(id) ON DELETE CASCADE;
ALTER TABLE email_deliveries DROP CONSTRAINT IF EXISTS email_deliveries_recovery_binding_id_fkey;
ALTER TABLE email_deliveries ADD CONSTRAINT email_deliveries_recovery_binding_id_fkey FOREIGN KEY(recovery_binding_id) REFERENCES reading_recovery_bindings(id) ON DELETE CASCADE;
