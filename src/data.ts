import { StrategicQuestion, WorkshopParticipant } from './types';

export const INITIAL_QUESTIONS: StrategicQuestion[] = [
  // --- Vision Engine (محرك الرؤية) ---
  // الحلم (The Dream)
  {
    id: 'v1',
    section: 'vision',
    category: 'الحلم',
    categoryEn: 'The Dream',
    text: 'ما الصورة المثالية التي نطمح أن يكون عليها الكيان بعد 15-20 عاماً؟',
    textEn: 'What is the ideal state we aspire for our organization to be in 15-20 years?',
  },
  {
    id: 'v2',
    section: 'vision',
    category: 'الحلم',
    categoryEn: 'The Dream',
    text: 'كيف يرى الكيان تأثيره المستقبلي ومساهمته الكبرى في نهضة المجتمع؟',
    textEn: 'How do we envision our future impact and major contribution to societal development?',
  },
  {
    id: 'v3',
    section: 'vision',
    category: 'الحلم',
    categoryEn: 'The Dream',
    text: 'ما هو الإنجاز أو الحلم الأسمى والأكثر طموحاً الذي نسعى لتحقيقه؟',
    textEn: 'What is the ultimate, most ambitious achievement or dream we strive to reach?',
  },
  {
    id: 'v4',
    section: 'vision',
    category: 'الحلم',
    categoryEn: 'The Dream',
    text: 'إذا تم تحقيق كافة أهدافنا بنجاح، كيف سيصفنا العالم في المستقبل؟',
    textEn: 'If all our goals are successfully met, how will the world describe us in the future?',
  },

  // ما يميزنا (What Makes Us Unique)
  {
    id: 'v5',
    section: 'vision',
    category: 'ما يميزنا',
    categoryEn: 'Our Unique Edge',
    text: 'ما هي الميزة التنافسية أو القيمة الفريدة التي نتفرد بها ولا يملكها غيرنا؟',
    textEn: 'What is the competitive edge or unique value proposition we possess that others don\'t?',
  },
  {
    id: 'v6',
    section: 'vision',
    category: 'ما يميزنا',
    categoryEn: 'Our Unique Edge',
    text: 'ما هي الكفاءات الأساسية أو المهارات المتميزة التي نتفوق فيها داخلياً؟',
    textEn: 'What are our core competencies or outstanding internal skills where we excel?',
  },
  {
    id: 'v7',
    section: 'vision',
    category: 'ما يميزنا',
    categoryEn: 'Our Unique Edge',
    text: 'لماذا يفضلنا المستفيدون والشركاء الرئيسيون على البدائل الأخرى المتوفرة؟',
    textEn: 'Why do our beneficiaries and main partners prefer us over other available alternatives?',
  },
  {
    id: 'v8',
    section: 'vision',
    category: 'ما يميزنا',
    categoryEn: 'Our Unique Edge',
    text: 'ما هي الأصول المعرفية أو الموارد والقدرات الحصرية التي نستند عليها؟',
    textEn: 'What knowledge assets, resources, or exclusive capabilities do we rely upon?',
  },

  // النطاق (Scope)
  {
    id: 'v9',
    section: 'vision',
    category: 'النطاق',
    categoryEn: 'Scope & Focus',
    text: 'من هي الشرائح أو الفئات المستهدفة الرئيسية التي نكرس جهودنا لخدمتها؟',
    textEn: 'Who are the primary target segments or audiences we dedicate our efforts to serve?',
  },
  {
    id: 'v10',
    section: 'vision',
    category: 'النطاق',
    categoryEn: 'Scope & Focus',
    text: 'ما هو النطاق الجغرافي أو السوق المستهدفة التي نسعى للتغطية والانتشار بها؟',
    textEn: 'What is the geographic scope or target market we seek to cover and expand within?',
  },
  {
    id: 'v11',
    section: 'vision',
    category: 'النطاق',
    categoryEn: 'Scope & Focus',
    text: 'ما هي حدود مجالات العمل والخدمات التي نمتنع عن الدخول فيها للحفاظ على التركيز؟',
    textEn: 'What boundaries of work or services do we avoid entering to maintain strategic focus?',
  },
  {
    id: 'v12',
    section: 'vision',
    category: 'النطاق',
    categoryEn: 'Scope & Focus',
    text: 'كيف نحدد ملامح التوسع المستقبلي في الخدمات أو الفئات والمنتجات الجديدة؟',
    textEn: 'How do we define our future expansion into new services, categories, or products?',
  },

  // --- Mission Engine (محرك الرسالة) ---
  // الكيان (The Entity)
  {
    id: 'm1',
    section: 'mission',
    category: 'الكيان',
    categoryEn: 'The Entity',
    text: 'من نحن؟ وما هي الهوية القانونية والتنظيمية الأساسية للكيان؟',
    textEn: 'Who are we? What is the core legal and organizational identity of the entity?',
  },
  {
    id: 'm2',
    section: 'mission',
    category: 'الكيان',
    categoryEn: 'The Entity',
    text: 'ما هو السبب الجوهري وراء تأسيس ووجود هذا الكيان في الوقت الراهن؟',
    textEn: 'What is the fundamental reason behind the founding and existence of this entity?',
  },
  {
    id: 'm3',
    section: 'mission',
    category: 'الكيان',
    categoryEn: 'The Entity',
    text: 'ما هي الفلسفة الإدارية والالتزامات الثقافية والأخلاقية التي توجه مسارنا؟',
    textEn: 'What management philosophy and cultural or ethical commitments guide our path?',
  },

  // المنتج / الخدمة (Product / Service)
  {
    id: 'm4',
    section: 'mission',
    category: 'المنتج / الخدمة',
    categoryEn: 'Product & Service',
    text: 'ما هي المنتجات أو الخدمات والحلول الأساسية التي نقوم بتقديمها فعلياً؟',
    textEn: 'What are the core products, services, and solutions we actively deliver?',
  },
  {
    id: 'm5',
    section: 'mission',
    category: 'المنتج / الخدمة',
    categoryEn: 'Product & Service',
    text: 'كيف تسهم مخرجاتنا في حل مشكلات حقيقية وتلبية احتياجات ملحة للمستفيدين؟',
    textEn: 'How do our outputs help solve real-world problems and meet critical needs?',
  },
  {
    id: 'm6',
    section: 'mission',
    category: 'المنتج / الخدمة',
    categoryEn: 'Product & Service',
    text: 'ما هي المعايير والمنهجيات العلمية والعملية التي تضمن جودة خدماتنا؟',
    textEn: 'What scientific or practical standards and methodologies ensure our quality?',
  },

  // فريق العمل (Working Team)
  {
    id: 'm7',
    section: 'mission',
    category: 'فريق العمل',
    categoryEn: 'Working Team',
    text: 'من هو فريق العمل الأساسي وما هي المهارات والقيم المهنية التي يتحلى بها؟',
    textEn: 'Who is our core team, and what professional skills and values do they possess?',
  },
  {
    id: 'm8',
    section: 'mission',
    category: 'فريق العمل',
    categoryEn: 'Working Team',
    text: 'كيف ننظم الجهود ونوزع المسؤوليات بين الكفاءات لضمان تحقيق غاياتنا؟',
    textEn: 'How do we organize efforts and distribute responsibilities to ensure our goals?',
  },
  {
    id: 'm9',
    section: 'mission',
    category: 'فريق العمل',
    categoryEn: 'Working Team',
    text: 'ما هي المنهجية التي نتبعها لتمكين فريق العمل ورفع مستوى تفاعله وولائه؟',
    textEn: 'What methodology do we use to empower the team and increase engagement and loyalty?',
  },

  // البيئة الداخلية (Internal Environment)
  {
    id: 'm10',
    section: 'mission',
    category: 'البيئة الداخلية',
    categoryEn: 'Internal Culture',
    text: 'كيف نصف المناخ التنظيمي وعلاقات التنسيق والتواصل الداخلي للكيان؟',
    textEn: 'How do we describe the organizational climate and internal communications?',
  },
  {
    id: 'm11',
    section: 'mission',
    category: 'البيئة الداخلية',
    categoryEn: 'Internal Culture',
    text: 'ما هي السياسات والحوكمة المعتمدة التي تضمن النزاهة والشفافية وتكامل الأداء؟',
    textEn: 'What policies and governance assure integrity, transparency, and integration?',
  },
  {
    id: 'm12',
    section: 'mission',
    category: 'البيئة الداخلية',
    categoryEn: 'Internal Culture',
    text: 'كيف نشجع الابتكار والتعلم المستمر وتناقل المعرفة داخل هيكل العمل؟',
    textEn: 'How do we encourage innovation, continuous learning, and knowledge transfer?',
  },

  // البعد الزمني (Time Dimension)
  {
    id: 'm13',
    section: 'mission',
    category: 'البعد الزمني',
    categoryEn: 'Time Horizon',
    text: 'ما هو الإطار أو المدى الزمني الذي نلتزم فيه بتحقيق تأثيرات رسالتنا؟',
    textEn: 'What is the time frame or horizon we commit to for achieving our mission\'s impact?',
  },
  {
    id: 'm14',
    section: 'mission',
    category: 'البعد الزمني',
    categoryEn: 'Time Horizon',
    text: 'كيف نوازن بين العمل على المبادرات العاجلة والاستثمار في الحلول الآجلة؟',
    textEn: 'How do we balance immediate urgent initiatives with long-term investments?',
  },
  {
    id: 'm15',
    section: 'mission',
    category: 'البعد الزمني',
    categoryEn: 'Time Horizon',
    text: 'ما هي الآليات والمؤشرات المعتمدة لمراجعة الرسالة وتحديث ملامحها دورياً؟',
    textEn: 'What mechanisms and key indicators are adopted to periodically review our mission?',
  },
];

export const INITIAL_PARTICIPANTS: WorkshopParticipant[] = [
  { id: 'p1', name: 'أحمد السعدني', nameEn: 'Ahmed Al-Saadani', avatar: 'AS', role: 'رئيس مجلس الإدارة', roleEn: 'Chairman of the Board', active: true },
  { id: 'p2', name: 'منى الراجحي', nameEn: 'Mona Al-Rajhi', avatar: 'MA', role: 'مدير التخطيط الاستراتيجي', roleEn: 'Director of Strategic Planning', active: true },
  { id: 'p3', name: 'رائد العتيبي', nameEn: 'Raed Al-Otaibi', avatar: 'RA', role: 'خبير الحوكمة والامتثال', roleEn: 'Governance & Compliance Expert', active: true },
  { id: 'p4', name: 'عبد الرحمن الشمري', nameEn: 'A. Al-Shammari', avatar: 'AS', role: 'مستشار تطوير الأعمال', roleEn: 'Business Dev Consultant', active: false },
  { id: 'p5', name: 'فاطمة الأنصاري', nameEn: 'Fatima Al-Ansari', avatar: 'FA', role: 'مسؤولة قياس الأثر', roleEn: 'Impact Assessment Lead', active: true },
  { id: 'p6', name: 'خالد الحربي', nameEn: 'Khalid Al-Harbi', avatar: 'KH', role: 'مدير العمليات التنفيذية', roleEn: 'Operations Director', active: false },
];

export const INITIAL_VALUES_STRATEGIES = [
  {
    id: 'val1',
    title: 'الشفافية والحوكمة',
    titleEn: 'Transparency & Governance',
    description: 'الالتزام بأقصى درجات الإفصاح والنزاهة وحماية مصالح الأطراف المعنية والشركاء.',
    descriptionEn: 'Commitment to full disclosure, integrity, and protecting stakeholders and partners interests.',
    alignment: 'تتماشى مع بناء كيان مستدام وموثوق يحظى باحترام المجتمع الدولي والمحلي.',
    alignmentEn: 'Aligns with building a sustainable, trusted entity respected both globally and locally.',
    priority: 'عالية جداً' as const,
    priorityEn: 'Critical' as const,
  },
  {
    id: 'val2',
    title: 'الابتكار والريادة',
    titleEn: 'Innovation & Leadership',
    description: 'تشجيع الحلول الإبداعية غير التقليدية والبحث المستمر عن أساليب عمل رائدة.',
    descriptionEn: 'Encouraging unconventional creative solutions and continuous research for pioneering methodologies.',
    alignment: 'تدعم الحلم بأن نكون الرواد والسباقين في تقديم القيمة النوعية والخدمات الذكية.',
    alignmentEn: 'Supports the dream of being pioneers in providing qualitative value and smart services.',
    priority: 'عالية' as const,
    priorityEn: 'High' as const,
  },
  {
    id: 'val3',
    title: 'التركيز على المستفيد',
    titleEn: 'Beneficiary Centered',
    description: 'وضع مصلحة وتوقعات الفئة المستهدفة في صدارة كافة القرارات والعمليات التشغيلية.',
    descriptionEn: 'Placing the interests and expectations of our target segments at the forefront of all decisions.',
    alignment: 'ترسم الحدود الدقيقة لنطاق العمل وتدعم معايير التميز والجودة في الخدمات.',
    alignmentEn: 'Delineates precise scope boundaries and supports standards of excellence in delivery.',
    priority: 'عالية جداً' as const,
    priorityEn: 'Critical' as const,
  },
  {
    id: 'val4',
    title: 'تمكين رأس المال البشري',
    titleEn: 'Empowering Human Capital',
    description: 'الاستثمار المستدام في تطوير مهارات وكفاءات كادرنا وإشراكه الفعال في اتخاذ القرار.',
    descriptionEn: 'Sustainable investment in developing team skills and actively engaging them in decision making.',
    alignment: 'تنظم وتفعل دور فريق العمل وتضمن بيئة عمل داخلية صحية ومحفزة للإنتاج.',
    alignmentEn: 'Organizes and activates the role of the working team, ensuring a healthy culture.',
    priority: 'متوسطة' as const,
    priorityEn: 'Medium' as const,
  },
];
