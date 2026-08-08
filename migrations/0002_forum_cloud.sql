-- Cross-device cloud state for KonyaGo Arşiv
CREATE TABLE IF NOT EXISTS cloud_docs (
  doc_key TEXT PRIMARY KEY,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  rev BIGINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cloud_docs_updated_idx ON cloud_docs (updated_at DESC);
