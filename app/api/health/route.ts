import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  await getPool().query('SELECT 1');
  return NextResponse.json({ ok: true });
}
