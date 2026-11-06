'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Vazirmatn } from 'next/font/google';
import { track } from '@/lib/track';
import '@/app/lead.css';

const font = Vazirmatn({ subsets: ['arabic'], weight: ['400', '600', '700'], display: 'swap' });
const gift = 'دو قسمت اول دوره';

export default function LeadThanks() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    track('thankyou_view', 'thanks');
    fetch('/api/me')
      .then(response => (response.ok ? response.json() : { user: null }))
      .then(data => { setSignedIn(Boolean(data.user)); setReady(true); })
      .catch(() => setReady(true));
  }, []);

  return (
    <div className={`lead ${font.className}`}>
      <main className="lead-wrap lead-block">
        <p className="lead-kicker">یاسین گلد آرت</p>
        <h1>ثبت‌نام انجام شد</h1>
        <p>هدیه تو {gift} است. عنوان دقیق این دو قسمت هنوز در پنل گذاشته نشده؛ همین که باشد، از دکمه زیر باز می‌شود.</p>
        {ready && signedIn && (
          <p>
            <Link className="lead-btn" href="/panel" onClick={() => { track('magnet_opened', 'thanks'); track('activation', 'panel'); }}>
              باز کردن {gift}
            </Link>
          </p>
        )}
        {ready && !signedIn && <p><Link className="lead-btn" href="/#signup">بازگشت به ثبت‌نام</Link></p>}
        {!ready && <span className="lead-placeholder">باز کردن {gift}</span>}
      </main>
    </div>
  );
}
