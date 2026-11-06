'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Vazirmatn } from 'next/font/google';
import { track } from '@/lib/track';
import '@/app/lead.css';

const font = Vazirmatn({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], display: 'swap' });

const gift = 'دو قسمت اول دوره';
const ctaOut = `${gift} را بگیر`;
const ctaIn = 'ورود به پنل';

type AuthState = 'checking' | 'in' | 'out';

function useAuthState() {
  const [state, setState] = useState<AuthState>('checking');
  useEffect(() => {
    let gone = false;
    fetch('/api/me')
      .then(response => (response.ok ? response.json() : { user: null }))
      .then(data => {
        if (gone) return;
        setState(data.user ? 'in' : 'out');
        track('auth_state_resolved', data.user ? 'in' : 'out');
      })
      .catch(() => {
        if (!gone) setState('out');
      });
    return () => { gone = true; };
  }, []);
  return state;
}

function LeadButton({ state, place }: { state: AuthState; place: string }) {
  if (state === 'checking') return <span className="lead-placeholder" aria-hidden="true">{ctaIn}</span>;
  if (state === 'in') {
    return <Link className="lead-btn" href="/panel" onClick={() => track('cta_click', place)}>{ctaIn}</Link>;
  }
  return <a className="lead-btn" href="#signup" onClick={() => track('cta_click', place)}>{ctaOut}</a>;
}

export default function LeadLanding() {
  const state = useAuthState();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    track('page_view', 'landing');
    const marks = [25, 50, 75, 100];
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const depth = height <= 0 ? 100 : Math.round((window.scrollY / height) * 100);
      marks.forEach(mark => { if (depth >= mark) track('scroll_depth', String(mark)); });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = phone.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[^\d]/g, '');
    if (!/^09\d{9}$/.test(normalized)) { setError('شماره موبایل معتبر وارد کنید.'); return; }
    if (password.length < 8) { setError('رمز عبور باید حداقل ۸ نویسه باشد.'); return; }
    setError('');
    setPending(true);
    const payload = JSON.stringify({ phone: normalized, password, role: 'student', goal: '' });
    const login = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload });
    if (login.ok) { track('lead_created', 'login'); window.location.href = '/thanks'; return; }
    if (login.status !== 401) {
      const data = await login.json().catch(() => ({}));
      setError(data.error || 'ورود انجام نشد. دوباره تلاش کن.');
      setPending(false);
      return;
    }
    const registered = await fetch('/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: payload });
    const data = await registered.json().catch(() => ({}));
    if (!registered.ok) {
      setError(registered.status === 409 ? 'شماره یا رمز عبور نادرست است.' : (data.error || 'ثبت‌نام انجام نشد. دوباره تلاش کن.'));
      setPending(false);
      return;
    }
    track('lead_created', 'register');
    window.location.href = '/thanks';
  };

  return (
    <div className={`lead ${font.className}`}>
      <header className="lead-header lead-wrap">
        <Link href="/" className="lead-logo" aria-label="یاسین گلد آرت، صفحه اصلی">
          <strong>یاسین گلد آرت</strong>
          <small>آکادمی و آتلیه طراحی جواهر</small>
        </Link>
        <div className="lead-actions">
          {state === 'out' && <Link className="lead-login" href="/auth">ورود</Link>}
          <LeadButton state={state} place="header" />
        </div>
      </header>

      <main>
        <section className="lead-hero lead-wrap">
          <div>
            <p className="lead-kicker">یاسین گلد آرت</p>
            <h1>از ایده تا ریخته‌گری صنعتی</h1>
            <p>از یادگیری تا همکاری با کارگاه‌های ریخته‌گری و ساخت؛ مهارت طراحی صنعتی را به فرصت‌های حرفه‌ای پیوند بده.</p>
            <LeadButton state={state} place="hero" />
            <span className="lead-btn-line">بدون پرداخت. با شماره موبایل و رمز.</span>
          </div>
          <form id="signup" className="lead-form" onSubmit={onSubmit}>
            <h2>{gift}</h2>
            <p>با ثبت‌نام، {gift} در پنل باز می‌شود.</p>
            {state === 'out' && <>
            <label>شماره موبایل
              <input dir="ltr" inputMode="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} onFocus={() => { if (!started) { setStarted(true); track('form_start', 'hero'); } }} />
            </label>
            <label>رمز عبور
              <input dir="ltr" type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} />
            </label>
            </>}
            {state !== 'in' && error && <p className="lead-error" role="alert">{error}</p>}
            {state === 'checking' && <span className="lead-placeholder">{ctaOut}</span>}
            {state === 'out' && <button className="lead-btn" type="submit" disabled={pending}>{pending ? 'در حال ثبت…' : ctaOut}</button>}
            {state === 'in' && <Link className="lead-btn" href="/panel" onClick={() => track('cta_click', 'form')}>{ctaIn}</Link>}
            <p className="lead-privacy">شماره‌ات فقط برای ورود و ارسال هدیه یا پیام‌های محصول استفاده می‌شود و فروخته نمی‌شود.</p>
          </form>
        </section>

        <section className="lead-block lead-wrap">
          <h2>مدل زیبا، هنوز قطعه قابل تولید نیست</h2>
          <p>فاصله میان یک مدل زیبا و یک قطعه قابل تولید، همان‌جا گم می‌شود که فایل برای کارگاه آماده نشده باشد.</p>
        </section>

        <section className="lead-block lead-wrap">
          <h2>سه قدم</h2>
          <ol className="lead-steps">
            <li className="lead-card"><span>۱</span><strong>شماره و رمز را بنویس</strong></li>
            <li className="lead-card"><span>۲</span><strong>{gift} باز می‌شود</strong></li>
            <li className="lead-card"><span>۳</span><strong>در پنل ادامه بده</strong></li>
          </ol>
        </section>

        <section className="lead-block lead-wrap">
          <h2>بعد از ورود چه چیزی هست</h2>
          <ul className="lead-benefits">
            <li className="lead-card"><strong>یادگیری</strong><p>از مبانی راینو تا آماده‌سازی فایل برای تولید.</p></li>
            <li className="lead-card"><strong>فایل آماده</strong><p>مدل‌های پایه برای ویرایش و ادامه طراحی.</p></li>
            <li className="lead-card"><strong>سفارش طراحی</strong><p>ایده یا اسکچ را به طرح قابل ساخت بسپار.</p></li>
          </ul>
        </section>

        <section className="lead-block lead-wrap">
          <h2>هدیه ثبت‌نام</h2>
          <div className="lead-card">
            <strong>{gift}</strong>
            <p>بعد از ثبت‌نام، از پنل باز می‌شود.</p>
            <LeadButton state={state} place="magnet" />
          </div>
        </section>

        <section className="lead-block lead-wrap">
          <h2>پرسش‌ها</h2>
          <div className="lead-faq">
            <details>
              <summary>برای ثبت‌نام پول لازم است؟</summary>
              <p>نه. شماره و رمز کافی است. این هدیه پرداخت نمی‌خواهد.</p>
            </details>
            <details>
              <summary>کد پیامکی می‌آید؟</summary>
              <p>نه. الان با رمز وارد می‌شوی. کد پیامکی در فاز بعد فعال می‌شود.</p>
            </details>
            <details>
              <summary>هدیه چیست؟</summary>
              <p>{gift}. بعد از ثبت‌نام از پنل باز می‌شود.</p>
            </details>
            <details>
              <summary>اگر قبلاً حساب ساخته‌ام؟</summary>
              <p>همان شماره و رمز را بنویس. به پنل می‌روی.</p>
            </details>
            <details>
              <summary>بعد از ثبت‌نام کجا می‌روم؟</summary>
              <p>صفحه تأیید، بعد پنل خودت.</p>
            </details>
            <details>
              <summary>شماره‌ام کجا می‌ماند؟</summary>
              <p>فقط برای ورود و پیام‌های همین محصول. فروخته نمی‌شود.</p>
            </details>
          </div>
        </section>

        <section className="lead-block lead-wrap">
          <h2>همان هدیه، یک بار دیگر</h2>
          <LeadButton state={state} place="final" />
          <span className="lead-btn-line">بدون پرداخت. با شماره موبایل و رمز.</span>
        </section>
      </main>

      <footer className="lead-footer lead-wrap">
        <strong>یاسین گلد آرت</strong>
        <p>اطلاعات تماس به‌زودی</p>
        <p>شماره‌ات فقط برای ورود و ارسال هدیه یا پیام‌های محصول استفاده می‌شود و فروخته نمی‌شود.</p>
      </footer>

      <div className="lead-sticky">
        <LeadButton state={state} place="sticky" />
      </div>
    </div>
  );
}
