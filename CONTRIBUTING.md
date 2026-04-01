# دليل المساهمة — PropTech AI

## قواعد Git

### تسمية الـ Branches

```
feature/اسم-الميزة        # ميزة جديدة
fix/وصف-الإصلاح           # إصلاح bug
refactor/ما-تم-تعديله     # تحسين كود
docs/ما-تمت-إضافته        # توثيق
```

### صيغة الـ Commits

```
feat: إضافة بحث ضبابي في صفحة العقارات
fix: إصلاح redirect بعد تسجيل الدخول
style: تحديث ألوان الـ Navbar
refactor: استبدال emoji بـ SVG في PropertyCard
docs: تحديث README بمتغيرات البيئة
```

## سير العمل

1. **فتح Issue** لأي ميزة أو إصلاح قبل البدء في التطوير
2. **إنشاء Branch** من `main`
3. **التطوير** مع commits منتظمة وواضحة
4. **فتح Pull Request** مع:
   - وصف واضح للتغييرات
   - لقطات شاشة إذا كانت تغييرات UI
   - الـ Issue المرتبط

## معايير الكود

- **TypeScript**: لا `any` إلا عند الضرورة القصوى
- **CSS**: Vanilla CSS فقط في user-app، TailwindCSS v4 في admin-dashboard
- **الأيقونات**: استخدم `Icons.tsx` دائماً (لا emoji، لا lucide-react)
- **الأرقام**: `toLocaleString('en-US')` دائماً
- **الاتجاه**: RTL في كل شيء (`dir="rtl"`)

## النقاط الحساسة

- ❌ لا ترفع `.env` أو `.env.local` أبداً
- ❌ لا تضيف بيانات حقيقية في الـ seed files
- ✅ تأكد من وجود `.env.example` محدّث عند إضافة متغير جديد
