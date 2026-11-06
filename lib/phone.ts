const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

export function normalizePhone(value: string) {
  const ascii = value
    .replace(/[۰-۹]/g, digit => String(persianDigits.indexOf(digit)))
    .replace(/[^\d]/g, '');
  return /^09\d{9}$/.test(ascii) ? ascii : null;
}
