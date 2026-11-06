import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone } from '../lib/phone.ts';
import { hashPassword, verifyPassword } from '../lib/passwords.ts';

test('normalizes persian and ascii mobile numbers', () => {
  assert.equal(normalizePhone('۰۹۱۲۳۴۵۶۷۸۹'), '09123456789');
  assert.equal(normalizePhone('0912 345 6789'), '09123456789');
  assert.equal(normalizePhone('123'), null);
});

test('password hash verifies only the same password', async () => {
  const hash = await hashPassword('atelier-pass');
  assert.equal(await verifyPassword('atelier-pass', hash), true);
  assert.equal(await verifyPassword('wrong-pass', hash), false);
});
