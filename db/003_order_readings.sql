-- Frozen customer artifact: captured once at order creation, delivered by the existing queue.
CREATE TABLE IF NOT EXISTS order_reading_bindings (
 order_id uuid PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
 owner_hash text NOT NULL,
 owner_expires_at timestamptz NOT NULL,
 reading_id uuid NOT NULL,
 snapshot_id text NOT NULL,
 presentation_version text NOT NULL,
 catalog_version text NOT NULL,
 content_hash text NOT NULL,
 data jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(owner_hash,reading_id)
);
CREATE OR REPLACE FUNCTION immutable_order_reading_binding() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'ORDER_READING_IMMUTABLE'; END $$;
DROP TRIGGER IF EXISTS order_reading_binding_immutable ON order_reading_bindings;
CREATE TRIGGER order_reading_binding_immutable BEFORE UPDATE ON order_reading_bindings FOR EACH ROW EXECUTE FUNCTION immutable_order_reading_binding();
