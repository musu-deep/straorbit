import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));

// Initialize GoogleGenAI client lazy-style to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ warning: GEMINI_API_KEY is not defined. Copilot will run in mock simulation mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'straorbit/1.0',
        }
      }
    });
  }
  return aiClient;
}

// REST API Endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "STRAORBIT",
    aiMode: process.env.GEMINI_API_KEY ? "gemini" : "simulation",
    model: GEMINI_MODEL,
    time: new Date().toISOString(),
  });
});

// Strategic Copilot Endpoint
app.post("/api/copilot", async (req: express.Request, res: express.Response) => {
  const {
    action = "ask",
    section = "vision",
    questions = [],
    additionalPrompt = "",
    extraContext = "",
    lang = "ar",
  } = req.body ?? {};

  if (!Array.isArray(questions)) {
    return res.status(400).json({ error: "questions must be an array" });
  }
  const isAr = lang !== "en";

  // If API key is missing or is placeholder, run highly polished fallback simulation
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" || process.env.GEMINI_API_KEY.includes("MOCK")) {
    return handleMockCopilot(action, section, questions, additionalPrompt, extraContext, lang, res);
  }

  try {
    const ai = getAI();
    let prompt = "";

    if (isAr) {
      if (action === "draft") {
        prompt = `أنت مستشار استراتيجي من الدرجة الأولى وخبير في صياغة الرؤى والرسائل المؤسسية وفق المعايير العالمية.
المطلوب هو صياغة مسودة احترافية رصينة للـ **${section === "vision" ? "الرؤية (Vision)" : "الرسالة (Mission)"}**.

إليك إجابات ورشة التخطيط الحالية التي قدمها فريق العمل:
${questions.map((q: any) => `- السؤال: ${q.text}\n  الإجابة: ${q.answer || "غير مجاب"}`).join("\n")}

التعليمات الفنية للصياغة:
1. صياغة رصينة، بليغة، واضحة ومباشرة تخاطب المستقبل وتلهم الشركاء والموظفين.
2. بالنسبة للرؤية: يجب أن تدمج "الحلم المستقبلي"، "ما يُميزنا (القيمة التنافسية)"، و"النطاق (الجمهور والميدان)".
3. بالنسبة للرسالة: يجب أن تحدد بوضوح "من نحن (الكيان)"، "ماذا نقدم (الخدمة/المنتج)"، "لمن (الشريحة المستهدفة)"، و"كيف (بيئة العمل والمنهجية)".
4. تجنب الحشو والإنشاء غير المفيد، واعتمد لغة مؤسسية قوية.
5. أضف 3 خيارات أو سيناريوهات للصياغة (صياغة ملهمة قصيرة، صياغة شاملة تفصيلية، صياغة حديثة تركز على الابتكار).

الرجاء الإجابة باللغة العربية الفصحى الأنيقة وتنسيق النص بنقاط واضحة وعناوين منسقة بماركداون (Markdown).`;
      } else if (action === "analyze") {
        prompt = `أنت خبير تدقيق استراتيجي معتمد. قم بتحليل جودة واتساق الإجابات التالية وتحديد الثغرات الاستراتيجية (Strategic Gaps) في نموذج الـ **${section === "vision" ? "الرؤية" : "الرسالة"}**:

إليك إجابات ورشة التخطيط الحالية:
${questions.map((q: any) => `- السؤال: ${q.text}\n  الإجابة: ${q.answer || "غير مجاب"}`).join("\n")}

المطلوب تقديم تحليل نقدي بناء يشمل:
1. **نقاط القوة**: الجوانب الواضحة والمميزة في الإجابات الحالية.
2. **الثغرات الاستراتيجية (Gaps)**: الجوانب التي تفتقر للوضوح أو التفصيل (مثل غياب الميزة التنافسية أو عدم تحديد النطاق بوضوح).
3. **توصيات عملية**: كيف يمكن للفريق تحسين صياغة إجاباته لتتوافق مع النماذج المعيارية؟
4. **توقع الأثر**: مدى توافق هذه التوجهات مع الممارسات العالمية الحديثة.

الرجاء التنسيق بلغة عربية رسمية فخمة وباستخدام Markdown ونقاط واضحة.`;
      } else if (action === "compare") {
        prompt = `بصفتك مقيِّم خطط استراتيجية محترف، قارن بين الخيارات الاستراتيجية التالية للـ **${section === "vision" ? "الرؤية" : "الرسالة"}** لتقديم توصية نهائية للقيادة العليا:

الخيارات المتاحة للصياغة:
${extraContext || "لا توجد خيارات واضحة مدخلة"}

المطلوب تقديم تقرير مقارنة ذكي يتضمن:
1. تحليل نقاط القوة والضعف لكل خيار على حدة.
2. درجة ملاءمة كل خيار لطبيعة العصر والتحول الرقمي.
3. التوصية النهائية بالخيار الأفضل مع مبررات استراتيجية واضحة ومقترحات لتحسينه أكثر.

اكتب التقرير بلغة عربية إدارية راقية ومنسقة بشكل ممتاز بـ Markdown.`;
      } else {
        prompt = `أنت مساعد استراتيجي ذكي ومستشار للقيادة العليا في منصة STRAORBIT Strategic Intelligence OS. 
أجب عن استفسار المستخدم الاستراتيجي التالي بكل دقة ورصانة علمية:
"${additionalPrompt}"

سياق الورشة الحالية:
إجابات الرؤية والرسالة المتوفرة:
${questions.map((q: any) => `- [${q.category}]: ${q.answer || "لم يتم توفير إجابة بعد"}`).join("\n")}

أجب بلغة عربية فصحى وبأعلى درجات الموثوقية والدقة المعيارية.`;
      }
    } else {
      // English requested
      if (action === "draft") {
        prompt = `You are a world-class Strategic Consultant and an expert in formulating corporate vision and mission statements following global frameworks.
The task is to formulate a professional, highly polished draft statement for the **${section === "vision" ? "Vision" : "Mission"}**.

Here are the inputs answered by the strategic planning team:
${questions.map((q: any) => `- Question (${q.categoryEn || q.category}): ${q.textEn || q.text}\n  Answer: ${q.answer || "Not answered yet"}`).join("\n")}

Technical Guidelines for Formulation:
1. Draft a cohesive, elegant, inspiring, and clear statement that addresses the future and inspires stakeholders and talents.
2. For Vision: Integrate "The Future Dream", "Our Edge (Competitive Advantage)", and "Scope (Target Audience & Field)".
3. For Mission: Clearly define "Who we are (The Entity)", "What we deliver (The Service/Product)", "For whom (Target Beneficiaries)", and "How (Internal environment & methodology)".
4. Avoid fluff or redundant slogans; maintain an authoritative corporate voice.
5. Provide 3 options or scenarios (Inspiring impact-focused, Detailed standard-aligned, and Modern innovation-focused statement).

Please respond in professional English, formatted elegantly using Markdown and lists.`;
      } else if (action === "analyze") {
        prompt = `You are an accredited Strategic Auditor. Analyze the quality, completeness, and consistency of the following responses, and identify strategic gaps for the **${section === "vision" ? "Vision" : "Mission"}** framework:

Here are the workshop responses:
${questions.map((q: any) => `- Category (${q.categoryEn || q.category}): ${q.textEn || q.text}\n  Answer: ${q.answer || "Not answered"}`).join("\n")}

Provide a constructive analytical audit including:
1. **Strengths**: Solid, well-defined components of the current answers.
2. **Strategic Gaps**: Missing, vague, or underdeveloped dimensions (such as lacking clear competitive advantage or missing scope details).
3. **Actionable Recommendations**: How the planning team can improve their strategic inputs to match international standards.
4. **Future Synergy**: Expected alignment with modern global methodologies.

Please write in professional English, styled with Markdown and bullet points.`;
      } else if (action === "compare") {
        prompt = `As a professional Strategic Planner, compare the following proposed draft scenarios for the **${section === "vision" ? "Vision" : "Mission"}** statement to deliver a clear final executive recommendation:

Proposed scenarios:
${extraContext || "No options provided"}

Your comparison report should include:
1. Strengths and weaknesses of each scenario.
2. Suitability of each scenario for modern digital leadership.
3. Final recommended choice supported by clear strategic justifications and refinements.

Please write in formal business English, formatted beautifully with Markdown.`;
      } else {
        prompt = `You are an AI Strategic Advisor on the STRAORBIT Strategic Intelligence OS platform.
Answer the following strategic query from the user with deep administrative and scientific precision:
"${additionalPrompt}"

Current session context:
Bilingual strategic inputs available:
${questions.map((q: any) => `- [${q.categoryEn || q.category}]: ${q.answer || "No response provided yet"}`).join("\n")}

Respond in professional English, providing structured and highly authoritative advice.`;
      }
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const resultText = response.text || (isAr ? "لم نتمكن من الحصول على رد من الذكاء الاصطناعي حالياً." : "Failed to retrieve AI Advisory response.");
    return res.json({ result: resultText });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    return res.status(500).json({ error: error?.message || (isAr ? "فشل الاتصال بمحرك الذكاء الاصطناعي." : "Failed to communicate with AI Advisory engine.") });
  }
});

// Fallback high-quality simulation if Gemini key is missing
function handleMockCopilot(
  action: string,
  section: string,
  questions: any[],
  additionalPrompt: string,
  extraContext: string,
  lang: string,
  res: express.Response
) {
  const isAr = lang !== "en";
  const answered = questions.filter(q => q.answer && q.answer.trim().length > 0);
  const answeredCount = answered.length;
  const totalCount = questions.length;
  const progressPercent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  let responseText = "";

  if (isAr) {
    if (action === "draft") {
      if (section === "vision") {
        responseText = `### 🌟 مسودة الرؤية الاستراتيجية المقترحة (محاكاة ذكية)

استناداً إلى إجاباتكم في محاور **الحلم**، **ما يميزنا**، و**النطاق**، قمنا بصياغة ثلاثة خيارات تعبر عن طموحات الكيان:

#### 1️⃣ الخيار الأول: الصياغة الملهمة الفخمة (التركيز على التأثير)
> "ريادة المستقبل في تمكين المجتمعات وبناء القدرات المستدامة، لنكون المرجعية الأولى إقليمياً بنهج مبتكر وأثر ممتد."

* **الوزن الاستراتيجي**: يعبر بقوة عن "الحلم" والتوسع الجغرافي.

#### 2️⃣ الخيار الثاني: الصياغة الشاملة (المتطابقة تماماً مع النموذج المعياري)
> "نسعى إلى صناعة نموذج مستقبلي فريد عبر تقديم خدمات ذات جودة فائقة تستهدف تمكين كفاءاتنا وبناء شراكات ذكية ممتدة وطنياً ودولياً."

* **الوزن الاستراتيجي**: يغطي النطاق والتميز الخدمي بدقة متناهية.

#### 3️⃣ الخيار الثالث: الصياغة الحديثة (الرقمية والريادية)
> "تطوير منظومة ذكية متكاملة تصنع أثراً تنموياً مستداماً وتتفوق في تلبية متطلبات الشركاء والمستفيدين برؤية تستبق المستقبل."

---
*💡 نصيحة المستشار: يفضل دمج الخيار الأول والثالث للحصول على عبارة مقتضبة وذات رنين قيادي قوي.*`;
      } else {
        responseText = `### 📝 مسودة الرسالة الاستراتيجية المقترحة (محاكاة ذكية)

بناءً على أبعاد الرسالة المعيارية المتكاملة (**الكيان**، **الخدمة**، **فريق العمل**، **البيئة الداخلية**، **البعد الزمني**):

#### 1️⃣ الخيار الأول: صياغة عملية رصينة
> "نحن كيان استراتيجي ملتزم بتقديم أرقى الخدمات والحلول التنموية لمستفيدينا، عبر تمكين أفضل الكفاءات وبناء بيئة تنظيمية مرنة ومحوكمة لضمان استدامة الأثر اليومي والبعيد."

#### 2️⃣ الخيار الثاني: صياغة ريادية تركز على الجودة والابتكار
> "توفير حلول ومنتجات مبتكرة فائقة الجودة تلبي تطلعات شركائنا اليومية، مستندين إلى فريق عمل متميز وثقافة مؤسسية محفزة للحوكمة والتعلم المتبادل لمواجهة تحديات الحاضر وصناعة المستقبل."

---
*✨ العناصر المحققة بالصياغة:*
* **الهوية والكيان**: محققة بنسبة 100%.
* **الخدمة والتميز**: واضحة ومباشرة.
* **فريق العمل والبيئة**: مدمجة بشكل ممتاز لتعبر عن حيوية المؤسسة.`;
      }
    } else if (action === "analyze") {
      responseText = `### 🔍 تقرير التحليل الاستراتيجي والتدقيق المعياري

* **حالة التقدم**: تم الإجابة على **${answeredCount}** سؤال من أصل **${totalCount}** بنسبة إنجاز بلغت **${progressPercent}%**.

#### ✅ نقاط القوة المرصودة:
- تحديد مبدئي للهوية الاستراتيجية للكيان.
- الاهتمام بتمكين الكوادر البشرية وتحفيز الابتكار.
- الرغبة في التوسع وبناء علاقات استراتيجية متكاملة.

#### ⚠️ الثغرات الاستراتيجية (Strategic Gaps):
${answeredCount < 3 ? "- **قلة البيانات المدخلة**: يرجى تعبئة المزيد من الإجابات لكي يستطيع المستشار الذكي رسم الملامح الدقيقة للميزة التنافسية ونطاق العمل الاستراتيجي." : ""}
- **تحديد الميزة التنافسية**: هناك حاجة لتحديد "ما يميزنا فعلياً" بمصطلحات أكثر تحديداً وقابلية للقياس وتجنب الكلمات العامة مثل "الجودة والتميز" دون ربطها بآليات عمل حصرية.
- **تأطير البعد الزمني**: يفضل صياغة معايير دقيقة لمراجعة وتطوير الخطط مع ربطها بمستهدفات رؤية المملكة 2030 لتعزيز المواكبة والاتساق الوطني.

#### 💡 توصيات عاجلة للورشة:
1. التركيز على الإجابة عن الأسئلة المتبقية لرفع كفاءة الصياغات التلقائية.
2. استخدام لغة أرقام ونسب مستهدفة في تحديد النطاقات الجغرافية والخدمية.
3. عقد جلسة عصف ذهني مغلقة مع ممثلي الكيانات والشركاء لتحديد توقعاتهم الدقيقة.`;
    } else if (action === "compare") {
      responseText = `### ⚖️ تقرير مقارنة السيناريوهات والخيارات الاستراتيجية

قمنا بتحليل الخيارات المطروحة لمقارنتها بالنموذج الاستراتيجي المعياري:

| معيار التقييم | السيناريو الأول (الملهم) | السيناريو الثاني (المتطابق) | السيناريو الثالث (الريادي الحديث) |
| :--- | :---: | :---: | :---: |
| **السهولة والحفظ** | ممتازة (قصير ورنان) | متوسطة (طويل نسبياً) | جيدة جداً (حديث ومحفز) |
| **شمول الأبعاد** | 70% (يركز على الغاية) | 95% (يغطي التفاصيل) | 85% (يوازن بين الأثر والوسيلة) |
| **الملائمة للمستقبل** | عالية جداً | متوسطة | ممتازة جداً |
| **القرار المقترح** | **موصى به كشعار رئيسي** | **يستخدم في كتيب التعريف** | **موصى به كصياغة رسمية** |

#### 🏆 التوصية الاستراتيجية النهائية للقيادة:
ننصح باعتماد **السيناريو الثالث** كرسالة/رؤية رسمية لمرونته ومواكبته لمتطلبات الابتكار، مع استخلاص شعار مقتضب مستوحى من **السيناريو الأول** لاستخدامه في الحملات التسويقية واللقاءات الإعلامية للكيان.`;
    } else {
      responseText = `### 💡 إجابة استشارية سريعة من STRAORBIT Copilot

مرحباً بك! رداً على سؤالك الاستراتيجي: **"${additionalPrompt}"**

إليك المبدأ المعياري في التخطيط:
1. **الرؤية** تجيب على سؤال **(إلى أين نتجه؟)** وترسم ملامح الغد الأكثر إشراقاً وتلهم الموظفين والعملاء على حد سواء.
2. **الرسالة** تجيب على سؤال **(ماذا نفعل الآن؟ ولمن؟ وكيف؟)** وتعد الموجه اليومي للأولويات والقرارات التشغيلية في المؤسسة.
3. **القيم** تحدد **(كيف نتصرف أثناء رحلتنا؟)** وهي البوصلة الأخلاقية والمهنية السلوكية لفرق العمل.

لتحقيق أقصى درجات الترابط والدقة، يجب أن تنعكس قيمك المؤسسية مباشرة في طريقة تأدية رسالتك اليومية لتصل بك بنجاح إلى حلمك الكبير المصاغ في الرؤية.`;
    }
  } else {
    // English mock response
    if (action === "draft") {
      if (section === "vision") {
        responseText = `### 🌟 Proposed Strategic Vision Statement (AI Simulation)

Based on your answers under the **Dream**, **Our Edge**, and **Geographic Scope** categories, we have formulated three options for your organization:

#### 1️⃣ Option 1: Inspiring Statement (Focus on Impact)
> "Pioneering the future of community empowerment and sustainable capacity building, to become the ultimate regional reference with an innovative model and a lasting legacy."

* **Strategic Weight**: Strongly represents "The Dream" and geographic expansion.

#### 2️⃣ Option 2: Integrated Standard Formulation (Fully aligned with the standard framework)
> "We strive to craft a unique future model by delivering high-end, outstanding services aimed at empowering our talents and building smart, enduring partnerships locally and internationally."

* **Strategic Weight**: Accurately addresses scope, beneficiaries, and excellence.

#### 3️⃣ Option 3: Modern Formulation (Digital & Pioneering)
> "Developing a smart, integrated ecosystem that fosters sustainable developmental impact and excels in meeting the expectations of stakeholders and beneficiaries with a future-ready outlook."

---
*💡 Advisor Tip: We recommend blending Option 1 and Option 3 to produce a concise, authoritative leading statement.*`;
      } else {
        responseText = `### 📝 Proposed Strategic Mission Statement (AI Simulation)

Based on the standard multidimensional framework (**Entity**, **Service**, **Talents**, **Internal Culture**, and **Temporal Horizon**):

#### 1️⃣ Option 1: Robust Pragmatic Formulation
> "We are a strategic entity committed to delivering high-end developmental services and solutions to our beneficiaries, by empowering top talents and building a flexible, well-governed organizational environment to ensure daily and long-term sustainable impact."

#### 2️⃣ Option 2: Pioneering Innovation-focused Formulation
> "Providing innovative, high-quality solutions and products that fulfill our partners' daily aspirations, backed by an outstanding workforce and an institutional culture that promotes governance and mutual learning to address present challenges and shape the future."

---
*✨ Achieved Framework Pillars:*
* **Identity & Entity**: 100% covered.
* **Service Excellence**: Clear and direct.
* **Workforce & Culture**: Exceptionally integrated to express corporate vitality.`;
      }
    } else if (action === "analyze") {
      responseText = `### 🔍 Strategic Gap Analysis & Audit Report

* **Progress Status**: Answered **${answeredCount}** out of **${totalCount}** questions (**${progressPercent}%** complete).

#### ✅ Observed Strengths:
- Initial definition of the strategic identity and purpose of the entity.
- Strong emphasis on human talent empowerment and fostering innovation.
- A clear aspiration for geographical outreach and building comprehensive strategic relations.

#### ⚠️ Strategic Gaps:
${answeredCount < 3 ? "- **Insufficient input data**: Please fill out more answers to allow the AI Copilot to map precise competitive advantages." : ""}
- **Competitive Edge Definition**: Need to refine "what truly distinguishes us" using highly specific, measurable parameters, avoiding generic terms like "quality and excellence" unless tied to exclusive methodologies.
- **Temporal Framing**: We recommend incorporating precise milestones and linking plans directly to national strategic goals (e.g., Saudi Vision 2030) to boost alignment and synergy.

#### 💡 Actionable Recommendations:
1. Complete the remaining standard questions to enhance formulation fidelity.
2. Use metrics and targeted ratios when defining geographic and service boundaries.
3. Conduct interactive focus sessions with key stakeholders to align on specific expectations.`;
    } else if (action === "compare") {
      responseText = `### ⚖️ Scenario Comparison & Strategic Assessment Report

We analyzed the proposed scenarios against the standard strategic framework:

| Assessment Metric | Scenario 1 (Inspiring) | Scenario 2 (Aligned Standard) | Scenario 3 (Modern Pioneer) |
| :--- | :---: | :---: | :---: |
| **Recall & Retention** | Excellent (Concise & catchy) | Moderate (Relatively long) | Very Good (Modern & inspiring) |
| **Framework Coverage** | 70% (Focuses on Ultimate Goal) | 95% (Covers all details) | 85% (Balances impact & means) |
| **Future Relevance** | Very High | Moderate | Exceptionally High |
| **Proposed Decision** | **Recommended as main Tagline** | **Best for corporate brochures** | **Recommended as Official Statement** |

#### 🏆 Final Executive Recommendation:
We recommend adopting **Scenario 3** as the official statement for its flexibility and alignment with modern innovation standards, while extracting a short marketing tagline inspired by **Scenario 1** for communication and media branding.`;
    } else {
      responseText = `### 💡 Strategic Response from STRAORBIT Copilot

Hello! Regarding your strategic query: **"${additionalPrompt}"**

Here is the standard framework guideline for planning:
1. **Vision** answers **(Where are we going?)**, outlining an inspiring future and motivating stakeholders and teams.
2. **Mission** answers **(What do we do now? For whom? How?)**, acting as the daily compass for operational priorities and choices.
3. **Core Values** answer **(How do we behave during the journey?)**, providing the ethical and behavioral guide for the workforce.

To ensure maximum coherence, your core values must directly influence how you deliver your daily mission to successfully reach the inspiring destination defined in your vision.`;
    }
  }

  return res.json({ result: responseText });
}

// Start Server Setup (supports production build and development dev-server routing)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 STRAORBIT Strategic Intelligence OS Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start STRAORBIT server:", error);
  process.exit(1);
});
