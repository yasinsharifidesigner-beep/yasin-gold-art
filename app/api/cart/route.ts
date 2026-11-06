import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

async function ids(userId: string) {
  const result = await getPool().query(
    'SELECT product_id FROM cart_items WHERE user_id = $1 ORDER BY position',
    [userId]
  );
  return result.rows.map(row => row.product_id as string);
}

async function replace(userId: string, productIds: string[]) {
  const db = getPool();
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
    for (let position = 0; position < productIds.length; position += 1) {
      await client.query(
        'INSERT INTO cart_items (user_id, position, product_id) VALUES ($1, $2, $3)',
        [userId, position, productIds[position]]
      );
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'وارد حساب شوید.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const productId = String(body?.productId || '');
  const exists = await getPool().query('SELECT 1 FROM products WHERE id = $1', [productId]);
  if (!exists.rowCount) return NextResponse.json({ error: 'این فایل پیدا نشد.' }, { status: 404 });
  const current = await ids(user.id);
  await replace(user.id, [...current, productId]);
  return NextResponse.json({ ids: await ids(user.id) });
}

export async function DELETE(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'وارد حساب شوید.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const index = Number(body?.index);
  const current = await ids(user.id);
  if (!Number.isInteger(index) || index < 0 || index >= current.length) {
    return NextResponse.json({ error: 'این مورد در سبد نیست.' }, { status: 400 });
  }
  current.splice(index, 1);
  await replace(user.id, current);
  return NextResponse.json({ ids: current });
}
