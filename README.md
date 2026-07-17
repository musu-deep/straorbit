# STRAORBIT

**AI Strategic Intelligence OS — نظام تشغيل ذكي لبناء الاستراتيجية وإدارة الورش المؤسسية.**

STRAORBIT is a bilingual Arabic/English platform for formulating vision, mission, and values; conducting collaborative strategic workshops; monitoring alignment and readiness indicators; and generating AI-assisted strategic drafts and gap analyses.

## أبرز الإمكانات

- مختبر تفاعلي لصياغة الرؤية والرسالة والقيم.
- مساعد استراتيجي يعمل عبر Gemini، مع وضع محاكاة تلقائي عند غياب مفتاح API.
- إدارة المشاركين والكيانات والورش ومركز القيادة.
- تحليلات ومؤشرات جاهزية ومواءمة استراتيجية.
- واجهة عربية/إنجليزية متجاوبة بالكامل.
- حفظ تلقائي لمدخلات الورشة والمسودات داخل المتصفح.
- خادم Express موحد للواجهة وواجهات API، جاهز للتشغيل بالحاويات أو Render.

## التشغيل المحلي

### المتطلبات

- Node.js 20 أو أحدث
- npm 10 أو أحدث

```bash
npm install
cp .env.example .env
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

يعمل المساعد في **وضع المحاكاة** دون أي إعداد إضافي. لتفعيل Gemini، ضع المفتاح في `.env`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.5-flash
```

## فحوصات الجودة والبناء

```bash
npm run check
```

ولتشغيل نسخة الإنتاج:

```bash
npm run build
NODE_ENV=production npm start
```

## واجهات API

- `GET /api/health` — حالة الخدمة ووضع محرك الذكاء.
- `POST /api/copilot` — الصياغة والتحليل والمقارنة والاستشارات الاستراتيجية.

## النشر

### Render

الملف `render.yaml` يهيئ خدمة Web تلقائيًا. أضف `GEMINI_API_KEY` من لوحة الأسرار فقط، ولا تحفظه داخل المستودع.

### Docker

```bash
docker build -t straorbit .
docker run --rm -p 3000:3000 --env-file .env straorbit
```

## التقنية

React 19 · TypeScript · Vite · Tailwind CSS · Express · Google GenAI SDK · Recharts · Motion
