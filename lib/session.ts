import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { getPool } from './db';

const cookieName = 'yga_session';
const month = 60 * 60 * 24 * 30;

function hashToken(token: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return createHash('sha256').update(`${secret}:${token}`).digest('hex');
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + month * 1000);
  await getPool().query(
    'INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, hashToken(token), expires]
  );
  cookies().set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: month,
  });
}

export async function destroySession() {
  const token = cookies().get(cookieName)?.value;
  if (token) {
    await getPool().query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);
  }
  cookies().set(cookieName, '', { httpOnly: true, path: '/', maxAge: 0 });
}

export async function currentUser() {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  const result = await getPool().query(
    `SELECT users.id, users.phone, users.display_name, users.role, users.goal
     FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = $1 AND sessions.expires_at > now()`,
    [hashToken(token)]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id as string,
    phone: row.phone as string,
    displayName: row.display_name as string,
    role: row.role as 'student' | 'workshop',
    goal: row.goal as string,
  };
}
