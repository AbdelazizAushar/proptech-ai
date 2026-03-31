# لوحة التحكم الإدارية — عقارات سوريا

لوحة إدارية مبنية بـ **Vite + React + TailwindCSS** تتيح إدارة العقارات والمشرفين والحجوزات.

## التشغيل

```bash
npm install
cp .env.example .env
# عدّل القيم في .env
npm run dev
```

## هيكل المجلدات

```
src/
├── App.tsx                 # Router الرئيسي (محمي بـ ProtectedRoute)
├── layouts/
│   └── AdminLayout.tsx     # Sidebar + Header + Outlet
├── components/
│   └── ProtectedRoute.tsx  # حماية المسارات (auth guard)
├── pages/
│   ├── Login.tsx           # صفحة تسجيل الدخول
│   ├── Dashboard.tsx       # نظرة عامة
│   ├── Admins.tsx          # إدارة المشرفين
│   └── Bookings.tsx        # إدارة الحجوزات
└── lib/
    └── supabase.ts         # Supabase client
```

## تدفق المصادقة

```
/login  →  إدخال بيانات المشرف
        →  التحقق من جدول admins في Supabase
        →  حفظ بيانات الجلسة في localStorage
        →  redirect إلى / (Dashboard)
        →  ProtectedRoute يتحقق تلقائياً عند كل Visit
```

## المتغيرات البيئية

أنشئ ملف `.env` من `.env.example`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```
