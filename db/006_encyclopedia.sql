-- Independent editorial storage; no changes to readings or payment tables.
CREATE TABLE IF NOT EXISTS encyclopedia_articles (
 id uuid PRIMARY KEY,
 draft jsonb NOT NULL,
 revision integer NOT NULL DEFAULT 1,
 published_version integer,
 published_slug text UNIQUE,
 visible boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS encyclopedia_versions (
 article_id uuid NOT NULL REFERENCES encyclopedia_articles(id),
 version integer NOT NULL,
 draft_revision integer NOT NULL,
 content jsonb NOT NULL,
 published_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(article_id,version)
);
