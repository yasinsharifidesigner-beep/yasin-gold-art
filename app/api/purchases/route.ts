import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'وارد حساب شوید.' }, { status: 401 });
  const db = getPool();
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const cart = await client.query(
      'SELECT product_id FROM cart_items WHERE user_id = $1 ORDER BY position FOR UPDATE',
      [user.id]
    );
    for (const row of cart.rows) {
      await client.query(
        'INSERT INTO purchases (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING',
        [user.id, row.product_id]
      );
    }
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [user.id]);
    const owned = await client.query(
      'SELECT product_id FROM purchases WHERE user_id = $1 ORDER BY created_at',
      [user.id]
    );
    await client.query('COMMIT');
    return NextResponse.json({ ids: owned.rows.map(row => row.product_id) });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
