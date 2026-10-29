-- Preserve exact verified snapshot serialization for NEW AI checkout editions.
-- JSONB reorders keys and cannot validate the original engine byte-order receipt.
-- No backfill or UPDATE of historical orders, grants or reports.
CREATE TABLE IF NOT EXISTS ai_paid_sources (
 order_id uuid PRIMARY KEY REFERENCES orders(id),
 reading_hash text NOT NULL,
 raw_reading text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
