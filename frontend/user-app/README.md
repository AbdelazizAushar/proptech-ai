# واجهة المستخدم — عقارات سوريا

تطبيق ويب RTL مبني بـ **Next.js 15** (App Router) يوفر تجربة تصفح احترافية للعقارات السورية.

## التشغيل

```bash
npm install
cp .env.local.example .env.local
# عدّل القيم في .env.local
npm run dev
```

## هيكل المجلدات

```
src/
├── app/                    # App Router pages
│   ├── page.tsx            # الصفحة الرئيسية
│   ├── properties/         # قائمة + تفاصيل العقارات
│   ├── admin/              # redirect → dashboard
│   └── layout.tsx
├── components/             # مكونات قابلة لإعادة الاستخدام
│   ├── Icons.tsx           # مكتبة SVG مشتركة
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── PropertyCard.tsx
│   ├── PropertiesClient.tsx
│   ├── FeaturedListings.tsx
│   ├── HowItWorks.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase.ts         # Supabase client (null-safe)
│   └── api.ts              # Data fetching + mock fallback
└── types/                  # TypeScript types
```

## المتغيرات البيئية

انسخ `.env.local.example` إلى `.env.local` وأضف:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ADMIN_URL=http://localhost:5173
```

## ملاحظات تقنية

- يعمل ببيانات تجريبية (mock data) إذا لم تُضبط Supabase
- يدعم البحث الضبابي (Fuzzy Search) عبر Fuse.js
- جميع الأيقونات SVG inline (لا تبعيات خارجية)
- جميع الأرقام بالصيغة الإنجليزية
