-- Additive AI-only queue/artifacts. No foreign key to, or UPDATE of, historical
-- file reports, orders, grants, payment jobs, or published encyclopedia content.
CREATE TABLE IF NOT EXISTS ai_reading_jobs (
 id uuid PRIMARY KEY,
 reading_id uuid NOT NULL,
 reading_hash text NOT NULL,
 palace text NOT NULL,
 edition text NOT NULL,
 prompt_version text NOT NULL,
 input jsonb NOT NULL,
 input_hash text NOT NULL,
 status text NOT NULL CHECK(status IN ('queued','running','completed','error','uncertain')),
 attempts integer NOT NULL DEFAULT 0,
 attempt_id uuid,
 requested_model text,
 locked_at timestamptz,
 run_after timestamptz NOT NULL DEFAULT now(),
 error_code text,
 retryable boolean NOT NULL DEFAULT false,
 result jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 completed_at timestamptz,
 UNIQUE(reading_id,reading_hash,palace,edition),
 CHECK(status <> 'completed' OR result IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS ai_reading_queue ON ai_reading_jobs(run_after,created_at) WHERE status='queued';
CREATE TABLE IF NOT EXISTS ai_reading_attempts (
 id uuid PRIMARY KEY,
 job_id uuid NOT NULL REFERENCES ai_reading_jobs(id),
 status text NOT NULL,
 model text,
 provider text,
 response_id text,
 usage jsonb,
 duration_ms integer,
 estimated_cost_usd numeric,
 error_code text,
 started_at timestamptz NOT NULL DEFAULT now(),
 finished_at timestamptz
);
