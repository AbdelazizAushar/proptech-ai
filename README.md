# PropTech AI — منصة العقارات الذكية السورية

<div align="center">

![PropTech AI](https://img.shields.io/badge/PropTech-AI-gold?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-green?style=for-the-badge&logo=supabase)
![Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)

**منصة عقارية متكاملة تجمع بين واجهة مستخدم RTL احترافية، لوحة تحكم إدارية، وبوت واتساب ذكي.**

</div>

---

## 📐 هيكل المشروع

```
proptech-ai/
├── frontend/
│   ├── user-app/          # تطبيق المستخدم (Next.js 15 + App Router)
│   └── admin-dashboard/   # لوحة التحكم الإدارية (Vite + React + Tailwind)
├── database/              # مخططات قاعدة البيانات (Supabase / PostgreSQL)
├── n8n/                   # سير عمل الأتمتة (JSON Workflows)
└── docs/                  # التوثيق والخطط التقنية
```

---

## 🚀 تشغيل المشروع محلياً

### 1. واجهة المستخدم (user-app) 

```bash
cd frontend/user-app
cp .env.local.example .env.local     # أضف متغيرات Supabase
npm install
npm run dev                          # http://localhost:3000
```

### 2. لوحة التحكم (admin-dashboard)

```bash
cd frontend/admin-dashboard
cp .env.example .env                 # أضف متغيرات Supabase
npm install
npm run dev                          # http://localhost:5173
```

---

## ⚙️ المتغيرات البيئية المطلوبة

### `frontend/user-app/.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_ADMIN_URL=http://localhost:5173
```

### `frontend/admin-dashboard/.env`

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🛠️ التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| واجهة المستخدم | Next.js 15 (App Router, RSC), Vanilla CSS, RTL |
| لوحة التحكم | Vite + React + TailwindCSS v4 |
| قاعدة البيانات | Supabase (PostgreSQL) |
| البحث | Fuse.js (Fuzzy Search) |
| الأتمتة | n8n Workflows |
| المراسلة | WhatsApp Business (Evolution API) |
| الاستضافة | Netlify (user-app), Vercel/custom (admin) |

---

## 🔐 تسجيل الدخول للداشبورد

- اذهب إلى `http://localhost:5173/login`  
- أدخل بيانات حساب المشرف من جدول `admins` في Supabase  
- بعد نجاح تسجيل الدخول، يُوجَّه المستخدم تلقائياً للداشبورد

---

## 📋 خطوات الإعداد الأولي لقاعدة البيانات

راجع مجلد `database/` للحصول على:
- مخططات الجداول (schema)
- بيانات تجريبية (seed data)
- سكريبتات RLS (Row Level Security)

---

## 🤝 المساهمة

1. `git checkout -b feature/اسم-الميزة`
2. نفذ التغييرات واكتب commit واضح
3. افتح Pull Request مع وصف واضح

---

<div align="center">
  <sub>Built with ❤️ — Team 1 | PropTech AI © 2025</sub>
</div>
