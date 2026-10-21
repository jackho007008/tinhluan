-- Account ownership and immutable test offer; reuses orders, frozen bindings and grants.
CREATE TABLE IF NOT EXISTS customer_checkouts(
 order_id uuid PRIMARY KEY REFERENCES orders(id),
 user_id uuid NOT NULL REFERENCES customer_users(id),
 reading_id uuid NOT NULL,
 offer jsonb NOT NULL,
 return_anchor text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,reading_id)
);
CREATE OR REPLACE FUNCTION prevent_checkout_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'CHECKOUT_IMMUTABLE'; END $$;
DROP TRIGGER IF EXISTS immutable_checkout ON customer_checkouts;
CREATE TRIGGER immutable_checkout BEFORE UPDATE ON customer_checkouts FOR EACH ROW EXECUTE FUNCTION prevent_checkout_change();
