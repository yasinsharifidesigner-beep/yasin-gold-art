import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'یاسین گلد آرت | آموزش و طراحی طلا و جواهر',
  description: 'آموزش تخصصی طراحی سه‌بعدی، فایل‌های آماده صنعتی و سفارش طراحی اختصاصی طلا و جواهر.',
  manifest: '/manifest.webmanifest'
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#16253c' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
