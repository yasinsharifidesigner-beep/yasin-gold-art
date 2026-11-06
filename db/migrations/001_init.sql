CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'workshop')),
  goal text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id bigserial PRIMARY KEY,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_attempts_phone_time ON login_attempts (phone, created_at DESC);

CREATE TABLE IF NOT EXISTS tiers (
  id text PRIMARY KEY,
  name text NOT NULL,
  en text NOT NULL,
  price_label text NOT NULL,
  price_toman integer NOT NULL,
  cadence text NOT NULL,
  subtitle text NOT NULL,
  features jsonb NOT NULL,
  icon text NOT NULL,
  sort_order integer NOT NULL
);

CREATE TABLE IF NOT EXISTS courses (
  id text PRIMARY KEY,
  title text NOT NULL,
  level text NOT NULL,
  software text NOT NULL,
  duration text NOT NULL,
  lessons text NOT NULL,
  price_label text NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  title text NOT NULL,
  en text NOT NULL,
  category text NOT NULL,
  formats jsonb NOT NULL,
  weight text NOT NULL,
  stones text NOT NULL,
  resize text NOT NULL,
  price integer NOT NULL,
  image text NOT NULL,
  badge text NOT NULL DEFAULT '',
  sort_order integer NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id text PRIMARY KEY,
  category text NOT NULL,
  read_label text NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  image text NOT NULL,
  published_label text NOT NULL,
  sort_order integer NOT NULL
);

CREATE TABLE IF NOT EXISTS cart_items (
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  position integer NOT NULL,
  product_id text NOT NULL REFERENCES products (id),
  PRIMARY KEY (user_id, position)
);

CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES products (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS bespoke_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  category text NOT NULL,
  file_name text NOT NULL DEFAULT '',
  weight text NOT NULL DEFAULT '',
  setting text NOT NULL DEFAULT '',
  quantity text NOT NULL DEFAULT '',
  name text NOT NULL,
  phone text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users (id) ON DELETE SET NULL,
  kind text NOT NULL CHECK (kind IN ('partner', 'consult')),
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  activity text NOT NULL DEFAULT '',
  day integer,
  time_label text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
