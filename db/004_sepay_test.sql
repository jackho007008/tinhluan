-- Explicit operator enrollment; never permits sandbox events to pay live/legacy orders.
CREATE TABLE IF NOT EXISTS sepay_test_orders (
 order_id uuid PRIMARY KEY REFERENCES order_reading_bindings(order_id),
 recipient_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE OR REPLACE FUNCTION reject_sepay_test_order_update() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'SEPAY_TEST_ORDER_IMMUTABLE'; END $$;
DROP TRIGGER IF EXISTS sepay_test_order_immutable ON sepay_test_orders;
CREATE TRIGGER sepay_test_order_immutable BEFORE UPDATE ON sepay_test_orders
 FOR EACH ROW EXECUTE FUNCTION reject_sepay_test_order_update();
-- Sanitized authenticated inbox. No bank narrative, name, balance, raw body, secret or cookie.
CREATE TABLE IF NOT EXISTS sepay_test_events (
 transaction_id text PRIMARY KEY,
 settlement_hash text NOT NULL,
 body_hash text NOT NULL,
 order_id uuid REFERENCES orders(id),
 amount bigint NOT NULL,
 recipient_hash text NOT NULL,
 direction text NOT NULL,
 disposition text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
