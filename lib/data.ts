export const tiers = [
  { id: 'silver', name: 'پکیج نقره‌ای', en: 'SILVER', price: '۱۲٬۹۰۰٬۰۰۰', cadence: 'تومان', subtitle: 'شروع حرفه‌ای با ابزارهای ضروری', features: ['Rhino 5 + Matrix 9', '۱ ماه پشتیبانی چالش‌محور', 'دسترسی مادام‌العمر به درس‌ها', 'پروژه‌های عملی پایه'], icon: '◇' },
  { id: 'gold', name: 'پکیج طلایی', en: 'GOLD', price: '۲۴٬۹۰۰٬۰۰۰', cadence: 'تومان', subtitle: 'از مهارت تا آمادگی کارگاهی', features: ['Rhino 7 + MatrixGold', '۲ ماه پشتیبانی چالش‌محور', 'آزمون صلاحیت کارگاهی', 'بازخورد تخصصی روی پروژه‌ها'], icon: '✦' },
  { id: 'platinum', name: 'پکیج پلاتینیوم', en: 'PLATINUM', price: '۴۹٬۹۰۰٬۰۰۰', cadence: 'تومان', subtitle: 'مسیر طراح ارشد و منتورشیپ', features: ['Rhino 7 + MatrixGold + ZBrush', 'اسکچینگ دستی و ۳ ماه منتورشیپ', 'معرفی به کارگاه‌های همکار', 'مسیر پروژه‌های ارزی'], icon: '✧' }
];

export const courses = [
  { id: 'matrixgold', title: 'طراحی صنعتی جواهر با MatrixGold', level: 'پیشرفته', software: 'MatrixGold', duration: '۴۲ ساعت', lessons: '۳۲ درس', price: '۲۴٬۹۰۰٬۰۰۰', image: 'ring', description: 'از مدل‌سازی پارامتریک تا آماده‌سازی فایل برای چاپ و ریخته‌گری.' },
  { id: 'rhino', title: 'راینو برای طراحان طلا و جواهر', level: 'مقدماتی', software: 'Rhino', duration: '۲۸ ساعت', lessons: '۲۴ درس', price: '۱۲٬۹۰۰٬۰۰۰', image: 'band', description: 'ساخت فرم دقیق، سطوح تمیز و پایه‌های محکم برای طراحی حرفه‌ای.' },
  { id: 'zbrush', title: 'حجم‌پردازی هنری با ZBrush', level: 'منتورشیپ ارشد', software: 'ZBrush', duration: '۳۶ ساعت', lessons: '۲۸ درس', price: '۱۹٬۹۰۰٬۰۰۰', image: 'pendant', description: 'ساخت جزئیات ارگانیک و فرم‌های منحصربه‌فرد قابل تولید.' },
  { id: 'setting', title: 'استانداردهای مخراج‌کاری و تولید', level: 'پیشرفته', software: 'Rhino', duration: '۱۸ ساعت', lessons: '۱۶ درس', price: '۹٬۹۰۰٬۰۰۰', image: 'gem', description: 'تلرانس نگین، ضخامت دیواره و آماده‌سازی مدل برای کارگاه.' }
];

export const products = [
  { id: 'p1', title: 'پایه انگشتر تک‌نگین آوینا', en: 'AVINA SOLITAIRE BASE', category: 'انگشتر', format: ['3DM','STL'], weight: '۳٫۸ گرم', stones: '۱ نگین ۶×۸ میلی‌متر', resize: 'قابل تغییر', price: 890000, image: 'ring', badge: 'پرفروش' },
  { id: 'p2', title: 'فریم هالو بیضی آتریسا', en: 'ATRISA HALO SETTING', category: 'مخراجی', format: ['3DM','STL','OBJ'], weight: '۲٫۴ گرم', stones: '۱۷ نگین، ۱٫۲ میلی‌متر', resize: 'قابل تغییر', price: 1240000, image: 'gem', badge: 'جدید' },
  { id: 'p3', title: 'رکاب ارگونومیک آریا', en: 'ARIA ERGONOMIC BAND', category: 'انگشتر', format: ['3DM','STL'], weight: '۴٫۱ گرم', stones: 'بدون نگین', resize: 'قابل تغییر', price: 760000, image: 'band', badge: '' },
  { id: 'p4', title: 'قالب پاوه ظریف لیانا', en: 'LIANA PAVÉ TEMPLATE', category: 'قالب آماده', format: ['3DM','OBJ'], weight: '۲٫۹ گرم', stones: '۲۸ نگین، ۱ میلی‌متر', resize: 'با ویرایش فایل', price: 980000, image: 'pendant', badge: '' },
  { id: 'p5', title: 'مدال اسلیمی نوا', en: 'NAVA PENDANT', category: 'مدال', format: ['STL','OBJ'], weight: '۳٫۲ گرم', stones: '۳ نگین، ۱٫۵ میلی‌متر', resize: 'نامرتبط', price: 1120000, image: 'pendant', badge: 'منتخب' },
  { id: 'p6', title: 'پایه چنگی چهارشاخه', en: 'FOUR PRONG BASE', category: 'مخراجی', format: ['3DM','STL'], weight: '۱٫۷ گرم', stones: '۱ نگین ۵ میلی‌متر', resize: 'قابل تغییر', price: 640000, image: 'gem', badge: '' }
];

export const articles = [
  { id: 'ai', category: 'بینش طراحی', read: '۸ دقیقه', title: 'هوش مصنوعی یا مدل‌سازی پارامتریک؛ آینده طراحی جواهر کجاست؟', excerpt: 'چطور از ایده‌پردازی سریع با AI به مدلی برسیم که واقعاً در کارگاه تولید شود؟', image: 'ring', date: '۱۲ شهریور ۱۴۰۵' },
  { id: 'casting', category: 'استاندارد صنعتی', read: '۶ دقیقه', title: 'انقباض ریخته‌گری طلا؛ میلی‌مترهایی که سرنوشت طرح را عوض می‌کنند', excerpt: 'مروری کاربردی بر تلرانس‌ها، ضخامت دیواره و تصمیم‌های پیش از چاپ.', image: 'band', date: '۴ شهریور ۱۴۰۵' },
  { id: 'stones', category: 'مخراج‌کاری', read: '۵ دقیقه', title: 'تلرانس نشاندن نگین در طراحی سه‌بعدی؛ از چنگ تا هالو', excerpt: 'جایگذاری اصولی نگین و نکاتی برای ارتباط بهتر میان طراح و مخراج‌کار.', image: 'gem', date: '۲۸ مرداد ۱۴۰۵' },
  { id: 'stl', category: 'فناوری چاپ', read: '۷ دقیقه', title: 'خروجی STL برای پرینترهای SLA و DLP؛ چک‌لیست قبل از ارسال', excerpt: 'بهینه‌سازی مش، بررسی ضخامت و کنترل نهایی یک فایل قابل چاپ.', image: 'pendant', date: '۱۷ مرداد ۱۴۰۵' }
];

export const faNumber = (value: number | string) => String(value).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
export const money = (value: number) => `${faNumber(value.toLocaleString('en-US'))} تومان`;
