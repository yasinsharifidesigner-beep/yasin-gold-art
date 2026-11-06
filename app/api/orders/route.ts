import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { normalizePhone } from '@/lib/phone';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = normalizePhone(String(body?.phone || ''));
  const name = String(body?.name || '').trim().slice(0, 80);
  if (!phone || !name) return NextResponse.json({ error: 'نام و شماره موبایل معتبر وارد کنید' }, { status: 400 });
  const user = await currentUser();
  await getPool().query(
    `INSERT INTO bespoke_orders (user_id, category, file_name, weight, setting, quantity, name, phone)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      user?.id || null,
      String(body?.category || '').slice(0, 80),
      String(body?.fileName || '').slice(0, 120),
      String(body?.weight || '').slice(0, 40),
      String(body?.setting || '').slice(0, 40),
      String(body?.quantity || '').slice(0, 40),
      name,
      phone,
    ]
  );
  return NextResponse.json({ ok: true });
}
