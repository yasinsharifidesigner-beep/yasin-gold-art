import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { normalizePhone } from '@/lib/phone';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const kind = body?.kind === 'consult' ? 'consult' : 'partner';
  const user = await currentUser();
  if (kind === 'consult') {
    if (!user) return NextResponse.json({ error: 'برای ثبت زمان، اول وارد حساب شوید.' }, { status: 401 });
    const day = Number(body?.day);
    const timeLabel = String(body?.time || '').slice(0, 20);
    if (!Number.isInteger(day) || day < 1) return NextResponse.json({ error: 'ابتدا یک روز را انتخاب کنید' }, { status: 400 });
    await getPool().query(
      'INSERT INTO contact_requests (user_id, kind, name, phone, day, time_label) VALUES ($1, $2, $3, $4, $5, $6)',
      [user.id, kind, user.displayName, user.phone, day, timeLabel]
    );
    return NextResponse.json({ ok: true });
  }

  const phone = normalizePhone(String(body?.phone || ''));
  const name = String(body?.name || '').trim().slice(0, 80);
  if (!phone || !name) return NextResponse.json({ error: 'نام مجموعه و شماره تماس را وارد کنید' }, { status: 400 });
  await getPool().query(
    'INSERT INTO contact_requests (user_id, kind, name, phone, activity) VALUES ($1, $2, $3, $4, $5)',
    [user?.id || null, kind, name, phone, String(body?.activity || '').trim().slice(0, 500)]
  );
  return NextResponse.json({ ok: true });
}
