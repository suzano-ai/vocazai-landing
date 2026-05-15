/**
 * Blog content — typed, no MDX. Each post carries fr/en/ar title, description
 * and a structured body (Block[]). Rendered by [locale]/blog/[slug]/page.tsx,
 * listed by [locale]/blog/page.tsx, and emitted into the sitemap.
 *
 * To add a post: append a BlogPost object. `slug` must be URL-safe and unique.
 */

export type BlogLocale = "fr" | "en" | "ar";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  /** ISO date — drives sort order and <time>/JSON-LD datePublished. */
  date: string;
  /** Minutes — shown on the card and post header. */
  readingMinutes: number;
  title: Record<BlogLocale, string>;
  description: Record<BlogLocale, string>;
  body: Record<BlogLocale, Block[]>;
}

export const POSTS: BlogPost[] = [
  {
    slug: "appels-manques-cout-reel",
    date: "2026-05-02",
    readingMinutes: 5,
    title: {
      fr: "Appels manqués : combien votre entreprise perd vraiment chaque mois",
      en: "Missed calls: how much your business really loses every month",
      ar: "المكالمات الفائتة: كم تخسر شركتك فعليًا كل شهر",
    },
    description: {
      fr: "Un appel manqué, c'est un client qui appelle un concurrent. Voici le coût réel des appels non décrochés — et comment un agent vocal IA y met fin.",
      en: "A missed call is a customer dialing your competitor. Here's the real cost of unanswered calls — and how an AI voice agent stops the leak.",
      ar: "المكالمة الفائتة تعني زبونًا يتصل بمنافسك. إليك التكلفة الحقيقية للمكالمات غير المُجابة، وكيف يوقف الوكيل الصوتي الذكي هذا النزيف.",
    },
    body: {
      fr: [
        { type: "p", text: "La plupart des entreprises mesurent leurs ventes, leur stock, leurs charges — mais presque jamais leurs appels manqués. Pourtant, c'est l'une des fuites de chiffre d'affaires les plus silencieuses et les plus coûteuses." },
        { type: "h2", text: "Un appel manqué ne rappelle pas" },
        { type: "p", text: "Quand un client tombe sur une sonnerie dans le vide ou un répondeur, il ne laisse presque jamais de message. Il raccroche et compose le numéro suivant. Pour une clinique, une agence immobilière ou un restaurant, ce client perdu vaut souvent plusieurs centaines, voire milliers de dollars." },
        { type: "ul", items: [
          "Heure du déjeuner : 12h–14h, personne ne décroche.",
          "Après 18h et le week-end : la moitié des appels entrants.",
          "Pics d'activité : le standard est déjà en ligne avec un autre client.",
        ] },
        { type: "h2", text: "Le calcul que personne ne fait" },
        { type: "p", text: "Prenez votre nombre d'appels entrants par jour, multipliez par la part que vous ne décrochez pas, puis par votre panier moyen et votre taux de conversion habituel. La plupart des dirigeants découvrent qu'ils laissent filer l'équivalent d'un salaire chaque mois." },
        { type: "h2", text: "Ce qu'un agent vocal IA change" },
        { type: "p", text: "Un agent vocal IA décroche au premier coup, 24h/24, en français, en arabe ou en anglais. Il prend les rendez-vous, répond aux questions fréquentes et transmet les demandes urgentes. Aucun appel ne tombe dans le vide — et vous récupérez une visibilité chiffrée sur chaque conversation." },
        { type: "p", text: "VocazAI se met en place en quelques minutes et le premier mois est gratuit. C'est généralement le temps qu'il faut pour voir la différence sur l'agenda." },
      ],
      en: [
        { type: "p", text: "Most businesses track sales, stock and expenses — but almost never their missed calls. Yet it's one of the quietest and most expensive revenue leaks there is." },
        { type: "h2", text: "A missed call doesn't call back" },
        { type: "p", text: "When a customer hits a ringing void or voicemail, they almost never leave a message. They hang up and dial the next number. For a clinic, a real-estate agency or a restaurant, that lost customer is often worth hundreds or thousands of dollars." },
        { type: "ul", items: [
          "Lunch hour: 12–2pm, nobody picks up.",
          "After 6pm and weekends: half of all inbound calls.",
          "Busy spikes: the front desk is already on another line.",
        ] },
        { type: "h2", text: "The math nobody runs" },
        { type: "p", text: "Take your inbound calls per day, multiply by the share you don't answer, then by your average order value and usual conversion rate. Most owners discover they're letting a full salary walk out the door every month." },
        { type: "h2", text: "What an AI voice agent changes" },
        { type: "p", text: "An AI voice agent answers on the first ring, around the clock, in French, Arabic or English. It books appointments, answers FAQs and routes urgent requests. No call falls into the void — and you get measurable visibility on every conversation." },
        { type: "p", text: "VocazAI sets up in minutes and the first month is free. That's usually all it takes to see the difference on your calendar." },
      ],
      ar: [
        { type: "p", text: "معظم الشركات تتابع المبيعات والمخزون والمصاريف، لكنها نادرًا ما تتابع المكالمات الفائتة. ومع ذلك فهي من أكثر تسريبات المداخيل صمتًا وكلفةً." },
        { type: "h2", text: "المكالمة الفائتة لا تُعاود الاتصال" },
        { type: "p", text: "عندما يصطدم الزبون برنين بلا جواب أو بصندوق صوتي، فإنه لا يترك رسالة تقريبًا. يُغلق الخط ويتصل بالرقم الموالي. بالنسبة لعيادة أو وكالة عقارية أو مطعم، هذا الزبون الضائع يساوي غالبًا مئات بل آلاف الدولارات." },
        { type: "ul", items: [
          "وقت الغداء: من منتصف النهار حتى الثانية، لا أحد يجيب.",
          "بعد السادسة مساءً وفي العطل: نصف المكالمات الواردة.",
          "أوقات الذروة: المكتب مشغول بزبون آخر.",
        ] },
        { type: "h2", text: "الحساب الذي لا يقوم به أحد" },
        { type: "p", text: "خذ عدد مكالماتك الواردة يوميًا، اضربه في النسبة التي لا تجيب عليها، ثم في معدل سلة الشراء ونسبة التحويل المعتادة. معظم المسيّرين يكتشفون أنهم يضيّعون ما يعادل أجرًا كاملًا كل شهر." },
        { type: "h2", text: "ما الذي يغيّره الوكيل الصوتي الذكي" },
        { type: "p", text: "الوكيل الصوتي الذكي يجيب من أول رنّة، على مدار الساعة، بالفرنسية أو العربية أو الإنجليزية. يأخذ المواعيد، يجيب عن الأسئلة المتكررة، ويحوّل الطلبات المستعجلة. ولا تضيع أي مكالمة، وتحصل على رؤية مرقّمة لكل محادثة." },
        { type: "p", text: "فوكازاي تُثبَّت في دقائق والشهر الأول مجاني. وهذا عادةً ما يكفي لرؤية الفرق في أجندتك." },
      ],
    },
  },
  {
    slug: "agent-vocal-ia-vs-standardiste",
    date: "2026-05-08",
    readingMinutes: 6,
    title: {
      fr: "Agent vocal IA ou standardiste : le comparatif pour votre entreprise",
      en: "AI voice agent or human receptionist: the comparison for your business",
      ar: "وكيل صوتي ذكي أم موظف استقبال: المقارنة لشركتك",
    },
    description: {
      fr: "Coût, disponibilité, langues, montée en charge : ce qui sépare vraiment un agent vocal IA d'une standardiste.",
      en: "Cost, availability, languages, scalability: what really separates an AI voice agent from a human receptionist.",
      ar: "التكلفة، التوفر، اللغات، القدرة على التوسّع: ما الذي يفصل فعليًا بين الوكيل الصوتي الذكي وموظف الاستقبال.",
    },
    body: {
      fr: [
        { type: "p", text: "La question n'est pas de remplacer vos équipes, mais de savoir qui doit décrocher le téléphone. Voici une comparaison honnête, poste par poste." },
        { type: "h2", text: "Disponibilité" },
        { type: "p", text: "Une standardiste couvre des horaires de bureau et prend des pauses, des congés, des arrêts. Un agent vocal IA répond 24h/24, 7j/7, y compris pendant le déjeuner et les jours fériés — là où tombent justement beaucoup d'appels." },
        { type: "h2", text: "Coût" },
        { type: "p", text: "Un poste d'accueil représente un salaire, des charges et de la formation. Un agent vocal IA fonctionne sur un abonnement prévisible, sans gestion RH, et ne coûte rien quand le téléphone ne sonne pas." },
        { type: "h2", text: "Langues et montée en charge" },
        { type: "ul", items: [
          "Trois langues d'un coup : français, arabe et anglais, sans recrutement.",
          "Dix appels simultanés gérés aussi bien qu'un seul.",
          "Chaque conversation transcrite et consultable dans un tableau de bord.",
        ] },
        { type: "h2", text: "Le bon arbitrage" },
        { type: "p", text: "L'agent vocal IA prend le volume, les questions répétitives et les heures creuses. Votre équipe se concentre sur les dossiers à forte valeur et les clients déjà en confiance. Les deux ne s'opposent pas — ils se complètent." },
        { type: "p", text: "Avec VocazAI, vous pouvez tester ce partage des rôles pendant un mois, gratuitement, avant de décider." },
      ],
      en: [
        { type: "p", text: "The question isn't about replacing your team — it's about who should pick up the phone. Here's an honest, line-by-line comparison." },
        { type: "h2", text: "Availability" },
        { type: "p", text: "A human receptionist covers office hours and takes breaks, holidays and sick days. An AI voice agent answers 24/7, including lunch hours and public holidays — exactly when many calls land." },
        { type: "h2", text: "Cost" },
        { type: "p", text: "A front-desk role means a salary, payroll charges and training. An AI voice agent runs on a predictable subscription, with no HR overhead, and costs nothing when the phone isn't ringing." },
        { type: "h2", text: "Languages and scalability" },
        { type: "ul", items: [
          "Three languages at once: French, Arabic and English, with no hiring.",
          "Ten simultaneous calls handled as well as one.",
          "Every conversation transcribed and searchable in a dashboard.",
        ] },
        { type: "h2", text: "The right trade-off" },
        { type: "p", text: "The AI voice agent takes the volume, the repetitive questions and the off-hours. Your team focuses on high-value cases and customers who already trust you. The two aren't rivals — they complement each other." },
        { type: "p", text: "With VocazAI you can test this split of roles for a month, free, before deciding." },
      ],
      ar: [
        { type: "p", text: "السؤال ليس استبدال فريقك، بل من يجب أن يرفع الهاتف. إليك مقارنة صادقة، نقطة بنقطة." },
        { type: "h2", text: "التوفّر" },
        { type: "p", text: "موظف الاستقبال يغطّي ساعات العمل ويأخذ استراحات وعطلًا وأيام مرض. أما الوكيل الصوتي الذكي فيجيب على مدار الساعة طوال الأسبوع، بما في ذلك وقت الغداء والأعياد، وهي بالضبط الأوقات التي تأتي فيها مكالمات كثيرة." },
        { type: "h2", text: "التكلفة" },
        { type: "p", text: "منصب الاستقبال يعني أجرًا وتكاليف اجتماعية وتكوينًا. الوكيل الصوتي الذكي يعمل باشتراك يمكن توقّعه، بدون تدبير للموارد البشرية، ولا يكلّف شيئًا حين لا يرنّ الهاتف." },
        { type: "h2", text: "اللغات والقدرة على التوسّع" },
        { type: "ul", items: [
          "ثلاث لغات دفعة واحدة: الفرنسية والعربية والإنجليزية، بدون توظيف.",
          "عشر مكالمات متزامنة تُدار بنفس جودة مكالمة واحدة.",
          "كل محادثة مكتوبة وقابلة للبحث في لوحة تحكّم.",
        ] },
        { type: "h2", text: "الموازنة الصحيحة" },
        { type: "p", text: "الوكيل الصوتي الذكي يتكفّل بالكمّ والأسئلة المتكررة والساعات الفارغة. وفريقك يركّز على الملفات ذات القيمة العالية والزبناء الذين يثقون بك أصلًا. الاثنان لا يتعارضان، بل يكمّل أحدهما الآخر." },
        { type: "p", text: "مع فوكازاي يمكنك تجربة هذا التقسيم للأدوار لمدة شهر، مجانًا، قبل أن تقرّر." },
      ],
    },
  },
  {
    slug: "agent-vocal-multilingue-accueil-telephonique",
    date: "2026-05-13",
    readingMinutes: 5,
    title: {
      fr: "Pourquoi un agent vocal trilingue change l'accueil téléphonique",
      en: "Why a trilingual voice agent changes phone reception",
      ar: "لماذا يغيّر وكيل صوتي بثلاث لغات الاستقبال الهاتفي",
    },
    description: {
      fr: "Vos clients n'appellent pas tous dans la même langue. Voici pourquoi un agent vocal IA qui gère français, arabe et anglais fait toute la différence.",
      en: "Your customers don't all call in the same language. Here's why an AI voice agent that handles French, Arabic and English makes all the difference.",
      ar: "زبناؤك لا يتصلون كلّهم بنفس اللغة. إليك لماذا يُحدث وكيل صوتي ذكي يتقن الفرنسية والعربية والإنجليزية فرقًا حقيقيًا.",
    },
    body: {
      fr: [
        { type: "p", text: "Un client qui appelle veut être compris vite et sans effort — dans sa langue. Forcer quelqu'un à changer de langue dès la première phrase, c'est déjà dégrader l'expérience." },
        { type: "h2", text: "La langue, c'est la première impression" },
        { type: "p", text: "Beaucoup d'outils vocaux ne gèrent qu'une seule langue, ou butent dès qu'on en change. Résultat : le client répète, s'agace, et l'accueil donne une image d'amateurisme avant même la vraie conversation." },
        { type: "h2", text: "Ce que le trilingue débloque" },
        { type: "ul", items: [
          "Le client parle naturellement, dans la langue qu'il préfère.",
          "Moins de malentendus, donc des rendez-vous mieux pris.",
          "Une image professionnelle — l'entreprise s'adapte au client, pas l'inverse.",
        ] },
        { type: "h2", text: "Trilingue, sans compromis" },
        { type: "p", text: "Un bon agent vocal IA bascule entre français, arabe et anglais selon le client, sans réglage manuel et en cours d'appel. Il garde le même ton, la même politesse, et la même capacité à prendre un rendez-vous ou répondre à une question." },
        { type: "p", text: "VocazAI est trilingue par conception : les trois langues ne sont pas une option ajoutée après coup, c'est le cœur du produit. Le premier mois est gratuit pour l'entendre par vous-même." },
      ],
      en: [
        { type: "p", text: "A customer who calls wants to be understood quickly and effortlessly — in their own language. Forcing someone to switch languages from the first sentence already degrades the experience." },
        { type: "h2", text: "Language is the first impression" },
        { type: "p", text: "Many voice tools handle only one language, or stumble the moment it changes. The result: the customer repeats themselves, gets annoyed, and reception looks amateurish before the real conversation even starts." },
        { type: "h2", text: "What trilingual unlocks" },
        { type: "ul", items: [
          "The customer speaks naturally, in the language they prefer.",
          "Fewer misunderstandings, so appointments are booked correctly.",
          "A professional image — the business adapts to the customer, not the other way around.",
        ] },
        { type: "h2", text: "Trilingual, no compromise" },
        { type: "p", text: "A good AI voice agent switches between French, Arabic and English depending on the caller, with no manual setting and mid-call. It keeps the same tone, the same courtesy, and the same ability to book an appointment or answer a question." },
        { type: "p", text: "VocazAI is trilingual by design: the three languages aren't a bolt-on, they're the core of the product. The first month is free so you can hear it for yourself." },
      ],
      ar: [
        { type: "p", text: "الزبون الذي يتصل يريد أن يُفهَم بسرعة وبدون عناء، وبلغته. إجبار شخص على تغيير لغته من الجملة الأولى يُفسد التجربة منذ البداية." },
        { type: "h2", text: "اللغة هي الانطباع الأول" },
        { type: "p", text: "كثير من الأدوات الصوتية تتعامل مع لغة واحدة فقط، أو تتعثّر بمجرد تغيّرها. والنتيجة: الزبون يُعيد كلامه، ينزعج، ويبدو الاستقبال غير احترافي قبل أن تبدأ المحادثة الحقيقية." },
        { type: "h2", text: "ما الذي تفتحه الثلاثية اللغوية" },
        { type: "ul", items: [
          "الزبون يتحدّث بشكل طبيعي، باللغة التي يفضّلها.",
          "سوء فهم أقل، وبالتالي مواعيد تُؤخَذ بشكل صحيح.",
          "صورة احترافية — الشركة تتكيّف مع الزبون، لا العكس.",
        ] },
        { type: "h2", text: "ثلاثي اللغة، بدون تنازل" },
        { type: "p", text: "الوكيل الصوتي الذكي الجيّد ينتقل بين الفرنسية والعربية والإنجليزية حسب المتصل، دون ضبط يدوي وأثناء المكالمة. يحافظ على نفس النبرة ونفس اللباقة ونفس القدرة على أخذ موعد أو الإجابة عن سؤال." },
        { type: "p", text: "فوكازاي ثلاثية اللغة بحكم تصميمها: اللغات الثلاث ليست خيارًا أُضيف لاحقًا، بل هي جوهر المنتج. الشهر الأول مجاني لتسمعها بنفسك." },
      ],
    },
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Newest first — used by the index and the sitemap. */
export const POSTS_BY_DATE: BlogPost[] = [...POSTS].sort((a, b) =>
  b.date.localeCompare(a.date)
);
