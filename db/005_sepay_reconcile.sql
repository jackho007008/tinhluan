-- Additive Test Mode bookkeeping. No raw bank narrative, credentials or customer data.
CREATE TABLE IF NOT EXISTS sepay_test_identities (
 identity_key text PRIMARY KEY,
 reference_key text,
 transaction_id text NOT NULL REFERENCES sepay_test_events(transaction_id),
 business_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sepay_test_reconcile_issues (
 source_id text NOT NULL,
 reason text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(source_id,reason)
);
CREATE TABLE IF NOT EXISTS sepay_test_checkpoints (
 scope text PRIMARY KEY,
 completed_at timestamptz,
 processed_count integer NOT NULL DEFAULT 0
);
