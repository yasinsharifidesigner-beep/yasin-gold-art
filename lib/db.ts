import { Pool } from 'pg';

let pool: Pool | undefined;

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}
