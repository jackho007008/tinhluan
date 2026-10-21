BEGIN;
CREATE TABLE IF NOT EXISTS beta_reports(
 id uuid PRIMARY KEY, cohort text NOT NULL, demo boolean NOT NULL,
 document jsonb NOT NULL, snapshot jsonb NOT NULL, versions jsonb NOT NULL,
 expires_at timestamptz NOT NULL, delete_after timestamptz NOT NULL CHECK(delete_after>=expires_at),
 released_at timestamptz, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS beta_grants(
 id uuid PRIMARY KEY, report_id uuid NOT NULL REFERENCES beta_reports(id) ON DELETE CASCADE,
 alias text NOT NULL UNIQUE, token_hash text UNIQUE, session_hash text UNIQUE,
 expires_at timestamptz NOT NULL, revoked_at timestamptz, invited_at timestamptz,
 started_at timestamptz, completed_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS beta_feedback(
 id uuid PRIMARY KEY, grant_id uuid NOT NULL REFERENCES beta_grants(id) ON DELETE CASCADE,
 report_id uuid NOT NULL REFERENCES beta_reports(id) ON DELETE CASCADE,
 section_id text NOT NULL, claim_id text, versions jsonb NOT NULL,
 answers jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(grant_id,id)
);
CREATE OR REPLACE FUNCTION beta_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.document IS DISTINCT FROM OLD.document OR NEW.snapshot IS DISTINCT FROM OLD.snapshot OR NEW.versions IS DISTINCT FROM OLD.versions OR NEW.demo IS DISTINCT FROM OLD.demo OR NEW.cohort IS DISTINCT FROM OLD.cohort THEN
 RAISE EXCEPTION 'BETA_EDITION_IMMUTABLE'; END IF; RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS beta_edition_immutable ON beta_reports;
CREATE TRIGGER beta_edition_immutable BEFORE UPDATE ON beta_reports FOR EACH ROW EXECUTE FUNCTION beta_immutable();
CREATE OR REPLACE FUNCTION beta_feedback_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'BETA_FEEDBACK_APPEND_ONLY'; END $$;
DROP TRIGGER IF EXISTS beta_answers_immutable ON beta_feedback;
CREATE TRIGGER beta_answers_immutable BEFORE UPDATE ON beta_feedback FOR EACH ROW EXECUTE FUNCTION beta_feedback_immutable();
COMMIT;
