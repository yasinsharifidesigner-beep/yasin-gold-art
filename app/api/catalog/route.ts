import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getPool();
  const [tiers, courses, products, articles] = await Promise.all([
    db.query('SELECT id, name, en, price_label, cadence, subtitle, features, icon FROM tiers ORDER BY sort_order'),
    db.query('SELECT id, title, level, software, duration, lessons, price_label, image, description FROM courses ORDER BY sort_order'),
    db.query('SELECT id, title, en, category, formats, weight, stones, resize, price, image, badge FROM products ORDER BY sort_order'),
    db.query('SELECT id, category, read_label, title, excerpt, image, published_label FROM articles ORDER BY sort_order'),
  ]);
  return NextResponse.json({
    tiers: tiers.rows.map(row => ({
      id: row.id,
      name: row.name,
      en: row.en,
      price: row.price_label,
      cadence: row.cadence,
      subtitle: row.subtitle,
      features: row.features,
      icon: row.icon,
    })),
    courses: courses.rows.map(row => ({
      id: row.id,
      title: row.title,
      level: row.level,
      software: row.software,
      duration: row.duration,
      lessons: row.lessons,
      price: row.price_label,
      image: row.image,
      description: row.description,
    })),
    products: products.rows.map(row => ({
      id: row.id,
      title: row.title,
      en: row.en,
      category: row.category,
      format: row.formats,
      weight: row.weight,
      stones: row.stones,
      resize: row.resize,
      price: row.price,
      image: row.image,
      badge: row.badge,
    })),
    articles: articles.rows.map(row => ({
      id: row.id,
      category: row.category,
      read: row.read_label,
      title: row.title,
      excerpt: row.excerpt,
      image: row.image,
      date: row.published_label,
    })),
  });
}
