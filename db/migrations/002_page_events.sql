CREATE TABLE IF NOT EXISTS page_events (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  place text NOT NULL DEFAULT '',
  path text NOT NULL DEFAULT '',
  user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_events_name_time ON page_events (name, created_at DESC);
