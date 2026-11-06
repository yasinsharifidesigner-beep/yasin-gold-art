import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

const names = new Set([
  'page_view',
  'scroll_depth',
  'cta_click',
  'form_start',
  'otp_requested',
  'otp_verified',
  'lead_created',
  'thankyou_view',
  'magnet_opened',
  'activation',
  'auth_state_resolved',
]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = String(body?.name || '');
  if (!names.has(name)) return NextResponse.json({ ok: false }, { status: 400 });
  const user = await currentUser().catch(() => null);
  await getPool().query(
    'INSERT INTO page_events (name, place, path, user_id) VALUES ($1, $2, $3, $4)',
    [name, String(body?.place || '').slice(0, 40), String(body?.path || '').slice(0, 120), user?.id || null]
  );
  return NextResponse.json({ ok: true });
}
