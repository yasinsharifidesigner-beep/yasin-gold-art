import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ user: null, cart: [], purchases: [] });
  const db = getPool();
  const [cart, purchases] = await Promise.all([
    db.query('SELECT product_id FROM cart_items WHERE user_id = $1 ORDER BY position', [user.id]),
    db.query('SELECT product_id FROM purchases WHERE user_id = $1 ORDER BY created_at', [user.id]),
  ]);
  return NextResponse.json({
    user: { displayName: user.displayName, role: user.role },
    cart: cart.rows.map(row => row.product_id),
    purchases: purchases.rows.map(row => row.product_id),
  });
}
