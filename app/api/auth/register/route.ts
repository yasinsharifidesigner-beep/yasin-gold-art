import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { hashPassword } from '@/lib/passwords';
import { normalizePhone } from '@/lib/phone';
import { createSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

const displayName = { student: 'هنرجوی آتلیه', workshop: 'همکار کارگاه' } as const;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = normalizePhone(String(body?.phone || ''));
  const password = String(body?.password || '');
  const role = body?.role === 'workshop' ? 'workshop' : 'student';
  const goal = String(body?.goal || '').slice(0, 80);
  if (!phone) return NextResponse.json({ error: 'شماره موبایل معتبر وارد کنید.' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'رمز عبور باید حداقل ۸ نویسه باشد.' }, { status: 400 });

  const db = getPool();
  const existing = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
  if (existing.rowCount) return NextResponse.json({ error: 'این شماره قبلاً ثبت شده است. وارد شوید.' }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const inserted = await db.query(
    'INSERT INTO users (phone, password_hash, display_name, role, goal) VALUES ($1, $2, $3, $4, $5) RETURNING id, display_name',
    [phone, passwordHash, displayName[role], role, goal]
  );
  await createSession(inserted.rows[0].id);
  return NextResponse.json({ displayName: inserted.rows[0].display_name });
}
