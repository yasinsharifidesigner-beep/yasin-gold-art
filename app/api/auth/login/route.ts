import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyPassword } from '@/lib/passwords';
import { normalizePhone } from '@/lib/phone';
import { createSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = normalizePhone(String(body?.phone || ''));
  const password = String(body?.password || '');
  if (!phone || !password) return NextResponse.json({ error: 'شماره موبایل و رمز عبور را وارد کنید.' }, { status: 400 });

  const db = getPool();
  const recent = await db.query(
    "SELECT count(*)::int AS count FROM login_attempts WHERE phone = $1 AND created_at > now() - interval '15 minutes'",
    [phone]
  );
  if (recent.rows[0].count >= 8) {
    return NextResponse.json({ error: 'تلاش‌های ورود زیاد است. کمی بعد دوباره امتحان کنید.' }, { status: 429 });
  }
  await db.query('INSERT INTO login_attempts (phone) VALUES ($1)', [phone]);

  const found = await db.query('SELECT id, password_hash, display_name FROM users WHERE phone = $1', [phone]);
  const user = found.rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'شماره یا رمز عبور نادرست است.' }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ displayName: user.display_name });
}
