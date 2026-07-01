# RCard — خدمة تصميم الكروت الرسمية
### Official Invitation & Occasion Card Design Service

منصة ويب لإنشاء وتخصيص كروت الدعوات والأعياد الرسمية والدينية — مبنية لأمانة منطقة نجران.  
A web platform for creating and personalizing official invitation and holiday greeting cards — built for **Najran Municipality**.

![License](https://img.shields.io/badge/License-Proprietary-red)
![Status](https://img.shields.io/badge/Status-Private-blue)

---

## المحتويات | Table of Contents

- [نظرة عامة | Overview](#نظرة-عامة--overview)
- [المميزات | Features](#المميزات--features)
- [التقنيات | Tech Stack](#التقنيات--tech-stack)
- [المتطلبات | Prerequisites](#المتطلبات--prerequisites)
- [التثبيت والتشغيل | Setup & Run](#التثبيت-والتشغيل--setup--run)
- [متغيرات البيئة | Environment Variables](#متغيرات-البيئة--environment-variables)
- [هيكل المشروع | Project Structure](#هيكل-المشروع--project-structure)
- [لوحة التحكم | Admin Panel](#لوحة-التحكم--admin-panel)
- [الأوامر المتاحة | Available Scripts](#الأوامر-المتاحة--available-scripts)
- [النشر | Deployment](#النشر--deployment)
- [الترخيص | License](#الترخيص--license)

---

## نظرة عامة | Overview

**RCard** تتيح للموظفين والزوار تصميم كروت مخصصة بإدخال الاسم والجهة، مع معاينة فورية وتحميل الصورة النهائية. يدير المسؤولون المناسبات والقوالب ويتابعون الإحصائيات من لوحة تحكم مركزية.

**RCard** lets employees and visitors design personalized cards by entering their name and department, with live preview and instant download. Administrators manage occasions, templates, and analytics from a central dashboard.

| المسار | Path | الوصف | Description |
|--------|------|--------|-------------|
| `/` | Home | عرض المناسبات النشطة | Lists active occasions |
| `/occasion/[slug]` | Occasion | تصميم وتحميل الكرت | Design & download cards |
| `/admin` | Admin | لوحة الإحصائيات والإدارة | Stats & management dashboard |
| `/login` | User Login | دخول المستخدمين | User authentication |
| `/admin/login` | Admin Login | دخول المسؤولين | Admin authentication |

---

## المميزات | Features

### للمستخدمين | For Users
- اختيار المناسبة من الصفحة الرئيسية — Browse active occasions from the home page
- تخصيص الاسم والجهة على قوالب جاهزة — Customize name & department on ready-made templates
- معاينة مباشرة وتحميل الكرت — Live preview and card download
- مشاركة عبر وسائل التواصل — Social sharing buttons
- نموذج تقييم بعد التحميل — Post-download feedback form

### للمسؤولين | For Administrators
- إدارة المناسبات (إنشاء، تعديل، تفعيل/إيقاف) — Occasion CRUD with active/inactive toggle
- رفع وضبط مواقع النصوص على القوالب — Upload templates and configure text positions
- إحصائيات التحميلات والزوار والتقييمات — Download, visitor, and feedback analytics
- تصدير بيانات التحميلات — Export download records
- تتبع المعالم (Milestones) وإشعارات التقدم — Milestone tracking & progress notifications

---

## التقنيات | Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | React 18, Tailwind CSS, Framer Motion |
| Database | PostgreSQL via [Prisma 7](https://www.prisma.io/) |
| Storage | [Supabase](https://supabase.com/) (template images) |
| Auth | JWT sessions (`jose`) + bcrypt |
| Validation | Zod |

---

## المتطلبات | Prerequisites

- **Node.js** 18 أو أحدث | 18+
- **PostgreSQL** قاعدة بيانات نشطة | active database instance
- **حساب Supabase** (لتخزين صور القوالب) | Supabase account for template image storage
- **npm** أو **pnpm** أو **yarn**

---

## التثبيت والتشغيل | Setup & Run

### 1. استنساخ المشروع | Clone the repository

```bash
git clone <repository-url>
cd rcard
```

### 2. تثبيت الاعتماديات | Install dependencies

```bash
npm install
```

### 3. إعداد متغيرات البيئة | Configure environment

أنشئ ملف `.env` في جذر المشروع — Create a `.env` file at the project root (see [Environment Variables](#متغيرات-البيئة--environment-variables)).

### 4. إعداد قاعدة البيانات | Set up the database

```bash
# تطبيق الهجرات | Apply migrations
npx prisma migrate deploy

# توليد عميل Prisma | Generate Prisma client
npx prisma generate

# بيانات أولية للتطوير المحلي فقط | Seed dev data (local only)
npx prisma db seed
```

### 5. تشغيل بيئة التطوير | Start development server

```bash
npm run dev
```

افتح المتصفح على — Open [http://localhost:3000](http://localhost:3000)

---

## متغيرات البيئة | Environment Variables

| Variable | Required | الوصف | Description |
|----------|----------|--------|-------------|
| `DATABASE_URL` | ✅ | رابط اتصال PostgreSQL | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ | مفتاح تشفير الجلسات (JWT) | Secret key for JWT session encryption |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | رابط مشروع Supabase | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | مفتاح الخدمة (خادم فقط) | Service role key (server-side only) |
| `NODE_ENV` | — | `development` أو `production` | Runtime environment |

> **تنبيه أمني | Security note**
>
> - لا ترفع ملف `.env` إلى Git — Never commit `.env`
> - لا تضع قيماً حقيقية لمتغيرات البيئة في README أو في التعليقات — Never put real env values in README or code comments
> - لا تشارك مفاتيح API أو كلمات مرور أو روابط قواعد بيانات — Never share API keys, passwords, or database URLs
> - استخدم متغيرات بيئة منفصلة لكل بيئة (تطوير / اختبار / إنتاج) — Use separate env config per environment (dev / staging / production)

---

## هيكل المشروع | Project Structure

```
rcard/
├── prisma/
│   ├── schema.prisma      # نماذج البيانات | Data models
│   ├── migrations/        # هجرات قاعدة البيانات | DB migrations
│   └── seed.js            # بيانات أولية | Seed data
├── public/                # أصول ثابتة | Static assets
├── src/
│   ├── app/
│   │   ├── api/           # مسارات API | API routes
│   │   ├── admin/         # لوحة التحكم | Admin dashboard
│   │   ├── occasion/      # صفحات المناسبات | Occasion pages
│   │   └── (cards)/       # مسارات الكروت المحمية | Protected card routes
│   ├── components/        # مكوّنات React | React components
│   ├── lib/               # أدوات مشتركة | Shared utilities
│   └── middleware.js      # حماية المسارات والجلسات | Route & session guard
└── package.json
```

---

## لوحة التحكم | Admin Panel

| المسار | Path | الوصف | Description |
|--------|------|--------|-------------|
| `/admin/login` | Admin Login | صفحة دخول المسؤولين | Administrator sign-in |
| `/admin` | Dashboard | الإحصائيات والإدارة | Stats & management |

لإعداد حساب مسؤول في بيئة التطوير، راجع `prisma/seed.js` محلياً أو أنشئ المستخدم مباشرة في قاعدة البيانات — لا تُخزَّن بيانات الدخول في هذا الملف أو في Git.  
To set up an admin account in development, refer to `prisma/seed.js` locally or create the user directly in the database — never store credentials in this file or in Git.

> **مهم | Important:** استخدم كلمات مرور قوية وفريدة لكل بيئة، وغيّرها فور النشر في الإنتاج.  
> Use strong, unique passwords per environment and rotate them before going to production.

---

## الأوامر المتاحة | Available Scripts

| Command | الوصف | Description |
|---------|--------|-------------|
| `npm run dev` | تشغيل خادم التطوير | Start development server |
| `npm run build` | بناء للإنتاج (يتضمن `prisma generate`) | Production build |
| `npm run start` | تشغيل خادم الإنتاج | Start production server |
| `npm run lint` | فحص ESLint | Run ESLint |
| `npx prisma studio` | واجهة مرئية لقاعدة البيانات | Visual database browser |
| `npx prisma db seed` | إدخال البيانات الأولية | Seed the database |

---

## النشر | Deployment

### Vercel (موصى به | Recommended)

1. اربط المستودع بـ [Vercel](https://vercel.com)
2. أضف متغيرات البيئة في إعدادات المشروع — Add environment variables in project settings
3. تأكد من تطبيق الهجرات على قاعدة الإنتاج — Run migrations on the production database:

```bash
npx prisma migrate deploy
```

### ملاحظات الإنتاج | Production Notes

- عيّن جميع متغيرات البيئة من لوحة النشر أو مدير الأسرار — Set all env vars via your host or secrets manager
- استخدم `SESSION_SECRET` عشوائياً وطويلاً (32+ حرف) — Use a long, random `SESSION_SECRET` (32+ chars)
- لا تستخدم بيانات seed الافتراضية في الإنتاج — Do not use default seed data in production
- فعّل HTTPS (يُفعَّل تلقائياً على Vercel) — HTTPS is enforced automatically on Vercel
- راجع [Next.js Deployment Docs](https://nextjs.org/docs/deployment) للتفاصيل

---

## الترخيص | License

**Licensed — ترخيص خاص (Proprietary)**

| | |
|---|---|
| **المالك / Owner** | أمانة منطقة نجران — Najran Municipality |
| **النوع / Type** | Proprietary / خاص |
| **الاستخدام / Use** | للأغراض الرسمية للأمانة فقط — Official municipal use only |
| **الملف / File** | [LICENSE](./LICENSE) |

جميع الحقوق محفوظة © 2026 أمانة منطقة نجران.  
All rights reserved © 2026 Najran Municipality.

لا يجوز نسخ أو توزيع أو تعديل أي جزء من هذا المشروع دون إذن كتابي مسبق من الجهة المالكة.  
No part of this project may be copied, distributed, or modified without prior written permission from the copyright holder.

للاطلاع على الشروط الكاملة، راجع ملف [LICENSE](./LICENSE).  
For the full terms, see [LICENSE](./LICENSE).
