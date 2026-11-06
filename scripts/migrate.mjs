import { createHash } from 'crypto';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

function toman(label) {
  const digits = String(label).replace(/[۰-۹]/g, digit => String(persianDigits.indexOf(digit))).replace(/[^\d]/g, '');
  return Number(digits);
}

async function catalog() {
  const source = await readFile(path.join(root, 'lib', 'data.ts'), 'utf8');
  const body = source
    .replace(/export const (faNumber|money)[\s\S]*/, '')
    .replace(/export const /g, 'const ');
  return new Function(`${body}\nreturn { tiers, courses, products, articles };`)();
}

async function seed(client) {
  const data = await catalog();
  for (const [index, tier] of data.tiers.entries()) {
    await client.query(
      `INSERT INTO tiers (id, name, en, price_label, price_toman, cadence, subtitle, features, icon, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10)
       ON CONFLICT (id) DO NOTHING`,
      [tier.id, tier.name, tier.en, tier.price, toman(tier.price), tier.cadence, tier.subtitle, JSON.stringify(tier.features), tier.icon, index]
    );
  }
  for (const [index, course] of data.courses.entries()) {
    await client.query(
      `INSERT INTO courses (id, title, level, software, duration, lessons, price_label, image, description, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO NOTHING`,
      [course.id, course.title, course.level, course.software, course.duration, course.lessons, course.price, course.image, course.description, index]
    );
  }
  for (const [index, product] of data.products.entries()) {
    await client.query(
      `INSERT INTO products (id, title, en, category, formats, weight, stones, resize, price, image, badge, sort_order)
       VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO NOTHING`,
      [product.id, product.title, product.en, product.category, JSON.stringify(product.format), product.weight, product.stones, product.resize, product.price, product.image, product.badge, index]
    );
  }
  for (const [index, article] of data.articles.entries()) {
    await client.query(
      `INSERT INTO articles (id, category, read_label, title, excerpt, image, published_label, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO NOTHING`,
      [article.id, article.category, article.read, article.title, article.excerpt, article.image, article.date, index]
    );
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Refusing to touch a database.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});
await client.connect();
await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
)`);
await client.query('BEGIN');
const dir = path.join(root, 'db', 'migrations');
const files = (await readdir(dir)).filter(name => name.endsWith('.sql')).sort();
for (const file of files) {
  const id = createHash('sha256').update(await readFile(path.join(dir, file))).digest('hex').slice(0, 16);
  const seen = await client.query('SELECT 1 FROM schema_migrations WHERE id = $1', [id]);
  const sql = await readFile(path.join(dir, file), 'utf8');
  if (!seen.rowCount) {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (id) VALUES ($1) ON CONFLICT DO NOTHING', [id]);
    console.log(`applied ${file}`);
  }
}
await seed(client);
await client.query('COMMIT');
await client.end();
console.log('database is ready');
