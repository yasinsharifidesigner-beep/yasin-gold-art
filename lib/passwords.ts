import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);
const keyLength = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt, keyLength)) as Buffer;
  return `scrypt$${salt}$${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hex] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hex) return false;
  const actual = (await scrypt(password, salt, keyLength)) as Buffer;
  const expected = Buffer.from(hex, 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
