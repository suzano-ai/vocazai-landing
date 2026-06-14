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
  {
    slug: "ivr-vs-agent-vocal-ia",
    date: "2026-05-14",
    readingMinutes: 5,
    title: {
      fr: "IVR ou agent vocal IA : pourquoi vos clients abandonnent l'arborescence à touches",
      en: "IVR or AI voice agent: why your customers hang up on phone trees",
      ar: "نظام الرد الآلي IVR أم وكيل صوتي ذكي: لماذا يُغلق زبناؤك الخط على شجرة الأرقام",
    },
    description: {
      fr: "« Tapez 1 pour les commandes, 2 pour le SAV, 3 pour… » clic. L'arborescence à touches coûte plus cher qu'elle ne rapporte. Voici pourquoi, et par quoi la remplacer.",
      en: "\"Press 1 for orders, 2 for support, 3 for…\" click. The phone-tree menu costs more than it saves. Here's why, and what to replace it with.",
      ar: "«اضغط 1 للطلبات، 2 للدعم، 3 لـ…» قَطْع. قائمة الأرقام تكلّفك أكثر مما توفّر. إليك لماذا، وبماذا تستبدلها.",
    },
    body: {
      fr: [
        { type: "p", text: "L'arborescence à touches a été inventée en 1973 pour absorber le volume sans embaucher. Cinquante ans plus tard, elle est toujours là — mais le client, lui, a changé." },
        { type: "h2", text: "Le coût caché des menus à touches" },
        { type: "p", text: "Une étude récente de l'industrie le mesure : entre 25 et 40 % des appelants abandonnent dans les 60 premières secondes d'un IVR. Ce sont autant de prospects, de réservations, de paiements qui passent à la trappe — sans qu'aucune statistique de votre standard ne le révèle." },
        { type: "ul", items: [
          "Le client doit deviner la bonne touche, sans contexte.",
          "Une mauvaise touche le renvoie au début, ou pire, le piège dans une boucle.",
          "Trois minutes pour atteindre un humain ; le concurrent décroche en quinze secondes.",
        ] },
        { type: "h2", text: "Ce qu'un agent vocal IA fait différemment" },
        { type: "p", text: "L'agent vocal IA ne demande pas « tapez un chiffre ». Il écoute. Le client dit « je voudrais déplacer mon RDV de mardi », et l'agent vérifie le créneau, propose une alternative, confirme. Pas de menu, pas d'attente — la conversation que le client attend." },
        { type: "h2", text: "Le test simple à faire ce soir" },
        { type: "p", text: "Appelez votre propre numéro depuis un autre téléphone. Chronométrez le temps entre la sonnerie et le moment où vous obtenez une vraie réponse à votre question. Si c'est plus d'une minute, vous perdez des clients chaque jour." },
        { type: "p", text: "Avec VocazAI, ce temps tombe à zéro. Le premier mois est gratuit — appelez-vous, mesurez la différence." },
      ],
      en: [
        { type: "p", text: "The phone-tree IVR was invented in 1973 to absorb call volume without hiring. Fifty years later it's still here — but the customer has changed." },
        { type: "h2", text: "The hidden cost of phone menus" },
        { type: "p", text: "Industry studies put it at 25 to 40 % — that's the share of callers who hang up within the first 60 seconds of an IVR. Each one is a prospect, a booking, a payment that disappears, and your switchboard stats don't even show it." },
        { type: "ul", items: [
          "The caller has to guess the right key, with no context.",
          "A wrong press sends them back to the start, or worse, traps them in a loop.",
          "Three minutes to reach a human; the competitor picks up in fifteen seconds.",
        ] },
        { type: "h2", text: "What an AI voice agent does differently" },
        { type: "p", text: "An AI voice agent doesn't ask you to \"press a number\". It listens. The caller says \"I'd like to move my Tuesday appointment\", the agent checks the slot, offers an alternative, confirms. No menu, no waiting — the conversation the customer was expecting." },
        { type: "h2", text: "The simple test to run tonight" },
        { type: "p", text: "Call your own number from another phone. Time how long it takes between the ring and the moment you get an actual answer to your question. If it's over a minute, you're losing customers every single day." },
        { type: "p", text: "With VocazAI that time drops to zero. The first month is free — call yourself and measure the difference." },
      ],
      ar: [
        { type: "p", text: "اختُرع نظام شجرة الأرقام IVR سنة 1973 لاستيعاب الكمّ بدون توظيف. وبعد خمسين عامًا لا يزال موجودًا، لكنّ الزبون قد تغيّر." },
        { type: "h2", text: "التكلفة المخفية لقوائم الأرقام" },
        { type: "p", text: "تُظهر الدراسات الميدانية أن ما بين 25 و40 % من المتصلين يُغلقون الخط خلال أول ستين ثانية من نظام IVR. كل واحد منهم زبون محتمل أو حجز أو دفعة تضيع، ولا تكشف عنها أي إحصائية لاستقبالك." },
        { type: "ul", items: [
          "على المتصل أن يخمّن الرقم الصحيح، دون أي سياق.",
          "ضغطة خاطئة تُعيده إلى البداية، أو الأسوأ، تُحاصره في حلقة.",
          "ثلاث دقائق للوصول إلى إنسان، بينما المنافس يردّ في خمس عشرة ثانية.",
        ] },
        { type: "h2", text: "ما الذي يفعله الوكيل الصوتي الذكي بشكل مختلف" },
        { type: "p", text: "الوكيل الصوتي الذكي لا يطلب «اضغط رقمًا»، بل يُصغي. يقول الزبون «أريد تغيير موعدي يوم الثلاثاء»، فيتحقّق الوكيل من التوفّر ويقترح بديلًا ويُؤكّد. لا قائمة، لا انتظار، فقط المحادثة التي كان الزبون يتوقّعها." },
        { type: "h2", text: "اختبار بسيط تقوم به الليلة" },
        { type: "p", text: "اتّصل برقمك من هاتف آخر، وقِس الوقت بين الرنّة وبين الحصول على جواب فعلي لسؤالك. إن تجاوز الدقيقة، فأنت تخسر زبناء كل يوم." },
        { type: "p", text: "مع فوكازاي ينزل هذا الوقت إلى الصفر. الشهر الأول مجاني، اتّصل بنفسك وقِس الفرق." },
      ],
    },
  },
  {
    slug: "calculer-roi-agent-vocal-ia",
    date: "2026-05-15",
    readingMinutes: 6,
    title: {
      fr: "Calculer le ROI d'un agent vocal IA en trois chiffres",
      en: "Calculate the ROI of an AI voice agent in three numbers",
      ar: "احسب العائد على الاستثمار لوكيل صوتي ذكي في ثلاثة أرقام",
    },
    description: {
      fr: "Pas besoin de tableur de douze onglets. Trois chiffres suffisent à savoir si un agent vocal IA est rentable pour votre entreprise — et la réponse est presque toujours oui.",
      en: "You don't need a twelve-tab spreadsheet. Three numbers tell you whether an AI voice agent pays off for your business — and the answer is almost always yes.",
      ar: "لا تحتاج جدولًا من اثني عشر ورقة. ثلاثة أرقام كافية لمعرفة ما إذا كان الوكيل الصوتي الذكي مربحًا لشركتك، والجواب غالبًا نعم.",
    },
    body: {
      fr: [
        { type: "p", text: "On ne décide pas d'un outil pro à l'intuition. Voici le calcul en trois lignes pour savoir si un agent vocal IA rapporte plus qu'il ne coûte." },
        { type: "h2", text: "Chiffre 1 — Vos appels manqués par mois" },
        { type: "p", text: "Regardez vos relevés d'appels (opérateur, GSM, standard) sur les 30 derniers jours. Comptez ceux qui n'ont pas été décrochés, ou décrochés mais raccrochés avant un échange. Pour une PME moyenne : 30 à 200 par mois." },
        { type: "h2", text: "Chiffre 2 — Votre panier moyen" },
        { type: "p", text: "Quelle est la valeur typique d'un client qui réussit à vous joindre ? Pour une clinique, c'est une consultation. Pour un restaurant, une table de quatre. Pour une agence immo, une commission. Mettez un chiffre dessus, même approximatif." },
        { type: "h2", text: "Chiffre 3 — Votre taux de conversion" },
        { type: "p", text: "Parmi les appels entrants qui aboutissent à un échange, quelle part devient client/réservation/paiement ? La plupart des PME se situent entre 20 et 50 %." },
        { type: "h2", text: "Le calcul" },
        { type: "ul", items: [
          "Appels manqués × panier moyen × taux de conversion = perte mensuelle.",
          "Exemple : 80 × 120 $ × 30 % = 2 880 $ par mois perdus.",
          "Agent vocal Growth : 1 490 $. ROI : 1 390 $ de gain net dès le premier mois.",
        ] },
        { type: "p", text: "Même en divisant les chiffres par trois pour être conservateur, l'agent reste rentable. Le premier mois est gratuit chez VocazAI — vous pouvez mesurer le vrai ROI sur vos propres données avant de payer." },
      ],
      en: [
        { type: "p", text: "You don't pick a business tool on intuition. Here's the three-line calculation that tells you whether an AI voice agent earns more than it costs." },
        { type: "h2", text: "Number 1 — Your missed calls per month" },
        { type: "p", text: "Pull your call logs (telco, mobile, switchboard) for the last 30 days. Count the ones that weren't answered, or were picked up but hung up before any real exchange. Typical SMB range: 30 to 200 per month." },
        { type: "h2", text: "Number 2 — Your average order value" },
        { type: "p", text: "What's a typical customer worth, when they actually reach you? For a clinic, one consultation. For a restaurant, a table of four. For a real-estate agency, one commission. Put a number on it, even rough." },
        { type: "h2", text: "Number 3 — Your conversion rate" },
        { type: "p", text: "Out of inbound calls that turn into a real conversation, what share becomes a customer, a booking, a paying job? Most SMBs land between 20 and 50 %." },
        { type: "h2", text: "The calculation" },
        { type: "ul", items: [
          "Missed calls × average order value × conversion rate = monthly loss.",
          "Example: 80 × $120 × 30 % = $2,880 lost every month.",
          "Growth voice agent: $1,490. ROI: $1,390 net gain in the very first month.",
        ] },
        { type: "p", text: "Even if you divide all numbers by three to stay conservative, the agent still pays off. The first month at VocazAI is free — measure the real ROI on your own data before paying a cent." },
      ],
      ar: [
        { type: "p", text: "لا يُختار أداة احترافية بالحدس. إليك حساب من ثلاثة أسطر يخبرك إن كان الوكيل الصوتي الذكي يربح أكثر مما يكلّف." },
        { type: "h2", text: "الرقم 1 — مكالماتك الفائتة شهريًا" },
        { type: "p", text: "راجع سجلّ مكالماتك (المشغّل، الموبايل، الاستقبال) لآخر ثلاثين يومًا، وعُدّ ما لم يُجَب أو ما رُفع وأُغلق قبل أي حوار. الشركات الصغيرة في الغالب: من 30 إلى 200 شهريًا." },
        { type: "h2", text: "الرقم 2 — متوسّط قيمة الزبون" },
        { type: "p", text: "كم يساوي الزبون النموذجي حين ينجح فعليًا في الوصول إليك؟ بالنسبة لعيادة، استشارة واحدة. لمطعم، طاولة لأربعة. لوكالة عقارية، عمولة. ضع رقمًا ولو تقريبيًا." },
        { type: "h2", text: "الرقم 3 — معدّل التحويل" },
        { type: "p", text: "من بين المكالمات الواردة التي تنتهي بحوار حقيقي، ما النسبة التي تتحوّل إلى زبون أو حجز أو دفع؟ أغلب الشركات الصغيرة بين 20 و50 %." },
        { type: "h2", text: "الحساب" },
        { type: "ul", items: [
          "المكالمات الفائتة × متوسّط القيمة × معدّل التحويل = خسارة شهرية.",
          "مثال: 80 × 120 $ × 30 % = 2 880 $ تضيع كل شهر.",
          "وكيل Growth: 1 490 $. العائد: 1 390 $ ربح صافٍ منذ الشهر الأول.",
        ] },
        { type: "p", text: "حتى لو قسمت الأرقام على ثلاثة لتكون متحفّظًا، يظلّ الوكيل مربحًا. الشهر الأول مجاني في فوكازاي، يمكنك قياس العائد الحقيقي على بياناتك قبل أن تدفع." },
      ],
    },
  },
  {
    slug: "checklist-24h-premier-agent-vocal",
    date: "2026-05-16",
    readingMinutes: 5,
    title: {
      fr: "Lancer son premier agent vocal IA en 24 heures : la checklist",
      en: "Launching your first AI voice agent in 24 hours: the checklist",
      ar: "إطلاق أول وكيل صوتي ذكي خلال 24 ساعة: قائمة المراجعة",
    },
    description: {
      fr: "Pas besoin d'un projet de trois mois. Voici exactement ce qu'il faut préparer côté entreprise pour que votre agent vocal décroche son premier appel demain matin.",
      en: "You don't need a three-month project. Here's exactly what your business has to prepare so your voice agent answers its first call tomorrow morning.",
      ar: "لا تحتاج مشروعًا من ثلاثة أشهر. إليك بالضبط ما يجب أن تُجهّزه من جهة الشركة كي يردّ وكيلك الصوتي على أول مكالمة غدًا صباحًا.",
    },
    body: {
      fr: [
        { type: "p", text: "Mettre en place un agent vocal IA n'est plus un projet IT. C'est une journée de prépa côté métier — et l'agent décroche le lendemain. Voici la checklist." },
        { type: "h2", text: "Avant le brief (30 minutes)" },
        { type: "ul", items: [
          "Listez vos 5 à 10 questions les plus fréquentes au téléphone, avec leur réponse type.",
          "Décrivez votre prise de RDV : durée d'un créneau, services proposés, agenda utilisé.",
          "Définissez les cas de transfert : qui appeler en urgence, sur quel numéro, quand.",
        ] },
        { type: "h2", text: "Pendant le brief (1 heure)" },
        { type: "p", text: "Notre équipe configure le ton de l'agent (chaleureux, neutre, énergique), la voix (homme/femme), les langues actives (fr/ar/en ou plusieurs), et branche votre agenda ou CRM." },
        { type: "h2", text: "Avant la mise en service (le lendemain matin)" },
        { type: "ul", items: [
          "Faites trois appels de test en équipe — un par langue.",
          "Validez deux scénarios « tordus » : appel pendant la pause déjeuner, demande hors champ.",
          "Configurez la redirection : votre numéro vers VocazAI (l'opérateur s'en charge en 5 min).",
        ] },
        { type: "h2", text: "Premier jour de production" },
        { type: "p", text: "Pas de big bang : laissez l'agent prendre 100 % des appels, mais vérifiez les transcripts chaque soir pendant la première semaine. Ajustez le prompt si nécessaire. Au bout de sept jours, vous oublierez qu'il est là." },
        { type: "p", text: "Le premier mois est gratuit. Brief aujourd'hui, agent en service demain." },
      ],
      en: [
        { type: "p", text: "Setting up an AI voice agent isn't an IT project anymore. It's a one-day business prep — and the agent answers the next morning. Here's the checklist." },
        { type: "h2", text: "Before the brief (30 minutes)" },
        { type: "ul", items: [
          "List your 5 to 10 most frequent phone questions, with the canonical answer for each.",
          "Describe how you book appointments: slot length, services offered, calendar in use.",
          "Define transfer cases: who to call in an emergency, on what number, when.",
        ] },
        { type: "h2", text: "During the brief (1 hour)" },
        { type: "p", text: "Our team configures the agent's tone (warm, neutral, energetic), the voice (male/female), the active languages (fr/ar/en or any combination), and connects your calendar or CRM." },
        { type: "h2", text: "Before going live (the next morning)" },
        { type: "ul", items: [
          "Make three team test calls — one per language.",
          "Validate two awkward scenarios: a call during lunch, an out-of-scope request.",
          "Set up the redirect: your number to VocazAI (your telco does this in 5 minutes).",
        ] },
        { type: "h2", text: "First day in production" },
        { type: "p", text: "No big bang: let the agent take 100 % of calls, but review the transcripts each evening for the first week. Tweak the prompt where needed. After seven days, you'll forget the agent is there." },
        { type: "p", text: "The first month is free. Brief today, agent in production tomorrow." },
      ],
      ar: [
        { type: "p", text: "تركيب وكيل صوتي ذكي لم يعد مشروعًا تقنيًا، بل تحضيرًا تجاريًا ليوم واحد، والوكيل يردّ في اليوم التالي. إليك قائمة المراجعة." },
        { type: "h2", text: "قبل اللقاء التعريفي (30 دقيقة)" },
        { type: "ul", items: [
          "اكتب 5 إلى 10 أسئلة هي الأكثر تكرارًا على الهاتف، مع الجواب النموذجي لكل واحدة.",
          "اشرح كيف تأخذ المواعيد: مدة الموعد، الخدمات المُقدَّمة، الأجندة المستعملة.",
          "حدّد حالات التحويل: من تتّصل به في الطوارئ، على أي رقم، ومتى.",
        ] },
        { type: "h2", text: "أثناء اللقاء (ساعة)" },
        { type: "p", text: "يضبط فريقنا نبرة الوكيل (دافئ، محايد، نشِط)، الصوت (رجل/امرأة)، اللغات الفعّالة (فرنسية/عربية/إنجليزية أو أي مزيج)، ويربط الأجندة أو الـCRM." },
        { type: "h2", text: "قبل التشغيل (صباح اليوم التالي)" },
        { type: "ul", items: [
          "اتّصلوا في الفريق ثلاث مرات تجريبيًا، مكالمة لكل لغة.",
          "اختبروا سيناريوهين «صعبين»: مكالمة وقت الغداء، طلب خارج المجال.",
          "اضبط تحويل الرقم: من رقمك إلى VocazAI (المشغّل يقوم بها في 5 دقائق).",
        ] },
        { type: "h2", text: "أول يوم في الإنتاج" },
        { type: "p", text: "بدون انفجار كبير: دع الوكيل يأخذ 100 % من المكالمات، لكن راجع النصوص كل مساء طوال الأسبوع الأول، واضبط الـPrompt عند الحاجة. بعد سبعة أيام ستنسى أنه موجود." },
        { type: "p", text: "الشهر الأول مجاني. لقاء اليوم، وكيل في الإنتاج غدًا." },
      ],
    },
  },
  {
    slug: "comment-agent-choisit-langue",
    date: "2026-05-17",
    readingMinutes: 4,
    title: {
      fr: "Comment un agent vocal IA choisit la langue à parler — en cours d'appel",
      en: "How an AI voice agent picks which language to speak — mid-call",
      ar: "كيف يختار الوكيل الصوتي الذكي اللغة التي يتحدّث بها — أثناء المكالمة",
    },
    description: {
      fr: "Sous le capot du switch français/arabe/anglais : ce que l'agent écoute réellement pour décider, et pourquoi ça marche sans bouton à appuyer.",
      en: "Under the hood of French/Arabic/English switching: what the agent actually listens for, and why it works without any button to press.",
      ar: "خلف كواليس التبديل بين الفرنسية والعربية والإنجليزية: ما الذي يُصغي إليه الوكيل فعلًا ليُقرّر، ولماذا يشتغل بدون أي زرّ.",
    },
    body: {
      fr: [
        { type: "p", text: "« Et l'agent comprend tout seul si je parle français ou arabe ? » C'est la question qu'on nous pose le plus. Voici la réponse — sans jargon, avec ce qui se passe vraiment." },
        { type: "h2", text: "Étape 1 — Identification de la langue" },
        { type: "p", text: "Dès la première phrase complète, un modèle de reconnaissance vocale détecte la langue avec une probabilité chiffrée. Au-dessus de 80 % de confiance, l'agent bascule sur cette langue. En dessous, il pose une question neutre (« je vous écoute ») pour obtenir une deuxième phrase." },
        { type: "h2", text: "Étape 2 — Verrouillage souple" },
        { type: "p", text: "Une fois la langue identifiée, l'agent y reste tant que le client ne change pas franchement. Une expression empruntée à une autre langue (« okay », « bonjour », « شكرا ») ne déclenche pas un switch — la langue de l'appel domine." },
        { type: "h2", text: "Étape 3 — Switch volontaire" },
        { type: "p", text: "Si le client change vraiment de langue (deux phrases entières), l'agent suit. Il continue dans la nouvelle langue avec le même contexte — il n'oublie pas ce qui a été dit avant." },
        { type: "p", text: "Tout ça se passe en quelques centaines de millisecondes, sans menu, sans bouton. Le client a juste l'impression de parler à quelqu'un qui s'adapte. Vous pouvez le tester gratuitement le premier mois." },
      ],
      en: [
        { type: "p", text: "\"And the agent figures out by itself whether I'm speaking French or Arabic?\" That's the question we get most often. Here's the answer — no jargon, what actually happens." },
        { type: "h2", text: "Step 1 — Language identification" },
        { type: "p", text: "From the first complete sentence, a speech-recognition model detects the language with a numerical confidence. Above 80 % confidence, the agent switches to that language. Below, it asks a neutral question (\"go ahead\") to get a second sentence." },
        { type: "h2", text: "Step 2 — Soft lock" },
        { type: "p", text: "Once the language is identified, the agent stays in it as long as the caller doesn't switch decisively. A borrowed expression from another language (\"okay\", \"bonjour\", \"شكرا\") doesn't trigger a switch — the call's main language dominates." },
        { type: "h2", text: "Step 3 — Deliberate switch" },
        { type: "p", text: "If the caller truly changes language (two full sentences), the agent follows. It continues in the new language with the same context — it doesn't forget what was said before." },
        { type: "p", text: "All of this happens in a few hundred milliseconds, no menu, no button. The customer just gets the feeling of talking to someone who adapts. You can test it free during the first month." },
      ],
      ar: [
        { type: "p", text: "«وهل يفهم الوكيل وحده هل أتحدّث الفرنسية أم العربية؟» هذا هو السؤال الأكثر تكرارًا. إليك الجواب، بدون لغة تقنية، وما يحدث فعلًا." },
        { type: "h2", text: "الخطوة 1 — تحديد اللغة" },
        { type: "p", text: "منذ أول جملة كاملة، يكتشف نموذج التعرف الصوتي اللغة باحتمالية مرقّمة. إن تجاوزت الثقة 80 %، يبدّل الوكيل إلى تلك اللغة. وإلا طرح سؤالًا محايدًا («تفضّل») للحصول على جملة ثانية." },
        { type: "h2", text: "الخطوة 2 — قفل مرن" },
        { type: "p", text: "بمجرد تحديد اللغة، يبقى الوكيل فيها ما دام المتصل لا يبدّل بشكل واضح. كلمة مستعارة من لغة أخرى («okay»، «شكرا»، «bonjour») لا تُفعّل التبديل، فاللغة الرئيسية للمكالمة هي السائدة." },
        { type: "h2", text: "الخطوة 3 — تبديل مقصود" },
        { type: "p", text: "إذا غيّر المتصل اللغة فعلًا (جملتان كاملتان)، يتبعه الوكيل. ويُكمل بالّلغة الجديدة بنفس السياق، فهو لا ينسى ما قيل من قبل." },
        { type: "p", text: "كلّ ذلك يحدث في بضع مئات من الميلّي ثانية، بدون قائمة وبدون زرّ. يشعر الزبون فقط بأنه يتحدّث إلى شخص يتكيّف. يمكنك تجربته مجانًا الشهر الأول." },
      ],
    },
  },
  {
    slug: "prix-agent-vocal-ia-pme",
    date: "2026-06-14",
    readingMinutes: 6,
    title: {
      fr: "Prix d'un agent vocal IA pour PME : la grille complète 2026",
      en: "Price of an AI voice agent for small businesses: the complete 2026 breakdown",
      ar: "سعر الوكيل الصوتي الذكي للشركات الصغيرة: الدليل الكامل لعام 2026",
    },
    description: {
      fr: "Combien coûte vraiment un agent vocal IA en 2026 ? Forfait, appels, intégrations, langues, support. Voici la grille honnête — et la fourchette à viser pour une PME.",
      en: "What does an AI voice agent really cost in 2026? Plans, per-minute fees, integrations, languages, support — here's the honest breakdown and the range a small business should target.",
      ar: "ما هي التكلفة الفعلية للوكيل الصوتي الذكي عام 2026؟ الباقات، أسعار الدقيقة، التكاملات، اللغات والدعم. إليك الدليل الصادق والمجال الذي يجب أن تستهدفه الشركة الصغيرة.",
    },
    body: {
      fr: [
        { type: "p", text: "« Combien ça coûte ? » C'est la première question qu'on nous pose. La réponse honnête : entre $499 et $1 490 par mois pour une PME, tout compris — mais ce qui fait varier le prix mérite d'être détaillé, parce que la grille du marché reste opaque." },
        { type: "h2", text: "Ce qu'on paie réellement dans un agent vocal IA" },
        { type: "p", text: "Le tarif affiché ne dit pas tout. Quatre lignes composent la facture réelle : la plateforme, les minutes d'appel, les modèles vocaux, et l'intégration au reste de votre stack (CRM, agenda, mail). Ignorer une de ces lignes, c'est se retrouver avec un devis qui double au deuxième mois." },
        { type: "ul", items: [
          "Forfait plateforme : entre $300 et $1 000 par mois selon le nombre d'agents et de numéros.",
          "Minutes d'appel : $0,08 à $0,18 par minute si elles ne sont pas incluses.",
          "Voix premium et langues additionnelles : parfois facturées séparément.",
          "Intégrations (Calendly, HubSpot, Make) : souvent en supplément ou via un connecteur tiers.",
        ] },
        { type: "h2", text: "La fourchette à viser pour une PME en 2026" },
        { type: "p", text: "Pour une entreprise de 1 à 20 personnes recevant 100 à 800 appels par mois, le prix raisonnable se situe entre $499 et $1 490 par mois, tout inclus — c'est exactement la grille VocazAI. Sous $400, vous n'avez pas de support humain ni de voix correctes. Au-delà de $1 800, vous payez un enterprise tier dont vous n'avez pas besoin." },
        { type: "h2", text: "Le calcul du retour sur investissement" },
        { type: "p", text: "Un agent vocal IA décroche 100 % des appels au lieu des 60–70 % typiques d'un standard humain. Si votre panier moyen est de $80 et votre taux de conversion téléphonique de 30 %, récupérer 30 appels manqués par mois ramène environ $720 — soit déjà plus que le forfait Starter. Au-dessus de 300 appels mensuels, le ROI dépasse souvent 4x." },
        { type: "h2", text: "Les pièges à éviter dans un devis" },
        { type: "ul", items: [
          "Un prix « à partir de » très bas qui exclut les minutes d'appel.",
          "Un seul agent inclus alors qu'il vous en faut deux (inbound + outbound).",
          "L'arabe ou l'anglais facturés en option si vous êtes multilingue.",
          "Aucun support — vous bricolerez seul à 22h le soir d'un bug.",
        ] },
        { type: "p", text: "Chez VocazAI, $499 et $1 490 incluent tout : trois langues (français, arabe, anglais), minutes, intégrations standards et support. Le premier mois est gratuit, donc le risque de tester est nul." },
      ],
      en: [
        { type: "p", text: "\"How much does it cost?\" That's the first question we hear. The honest answer: between $499 and $1,490 a month for a small business, all in — but what drives the price is worth unpacking, because market pricing is still opaque." },
        { type: "h2", text: "What you actually pay for in an AI voice agent" },
        { type: "p", text: "The headline price doesn't say much. Your real invoice has four lines: the platform, call minutes, voice models, and the integration with the rest of your stack (CRM, calendar, email). Ignore one of these lines and the quote you signed at month one doubles by month two." },
        { type: "ul", items: [
          "Platform fee: $300–$1,000 per month depending on agent and number count.",
          "Call minutes: $0.08–$0.18 per minute if not bundled.",
          "Premium voices and extra languages: sometimes billed separately.",
          "Integrations (Calendly, HubSpot, Make): often add-ons or via third-party connectors.",
        ] },
        { type: "h2", text: "The range a small business should target in 2026" },
        { type: "p", text: "For a 1-to-20-person company receiving 100 to 800 calls per month, the reasonable price sits between $499 and $1,490 monthly, all included — that's exactly VocazAI's grid. Below $400 you have no human support and no decent voices. Above $1,800 you're paying for an enterprise tier you don't need." },
        { type: "h2", text: "The ROI math" },
        { type: "p", text: "An AI voice agent picks up 100 % of calls instead of the typical 60–70 % human front desk hit rate. If your average order is $80 and your phone-to-sale conversion 30 %, recovering 30 missed calls a month is already $720 — more than the Starter plan. Past 300 monthly calls, ROI usually clears 4x." },
        { type: "h2", text: "Quote red flags" },
        { type: "ul", items: [
          "A very low \"starting at\" price that excludes call minutes.",
          "One agent included when you actually need two (inbound + outbound).",
          "Arabic or English billed extra if you operate multilingually.",
          "No support — you'll be on your own at 10pm the night something breaks.",
        ] },
        { type: "p", text: "At VocazAI, $499 and $1,490 bundle everything: three languages (French, Arabic, English), minutes, standard integrations and support. The first month is free, so the cost of trying is zero." },
      ],
      ar: [
        { type: "p", text: "«كم يكلف؟» هذا أول سؤال يصلنا. الجواب الصادق: ما بين 499 و1490 دولارًا شهريًا للشركة الصغيرة، شاملًا كل شيء. لكن ما يجعل السعر يتفاوت يستحق التفصيل، لأن أسعار السوق لا تزال مبهمة." },
        { type: "h2", text: "ما الذي تدفعه فعليًا في الوكيل الصوتي الذكي" },
        { type: "p", text: "السعر المعلن لا يكشف كل شيء. فاتورتك الحقيقية تتكوّن من أربعة بنود: المنصة، دقائق المكالمات، النماذج الصوتية، والتكامل مع باقي أدواتك (CRM، أجندة، بريد). تجاهل أحدها يعني أن العرض الذي قبلته في الشهر الأول يتضاعف في الشهر الثاني." },
        { type: "ul", items: [
          "اشتراك المنصة: ما بين 300 و1000 دولار شهريًا حسب عدد الوكلاء والأرقام.",
          "دقائق المكالمات: من 0.08 إلى 0.18 دولار للدقيقة إن لم تكن مشمولة.",
          "الأصوات المميزة واللغات الإضافية: تُحاسب أحيانًا بشكل منفصل.",
          "التكاملات (Calendly، HubSpot، Make): غالبًا إضافة أو عبر موصّل خارجي.",
        ] },
        { type: "h2", text: "المجال المناسب لشركة صغيرة في 2026" },
        { type: "p", text: "لشركة من شخص إلى عشرين شخصًا تتلقى من 100 إلى 800 مكالمة شهريًا، السعر المعقول بين 499 و1490 دولارًا شهريًا، شاملًا كل شيء. وهذا بالضبط ما تقدمه فوكازاي. تحت 400 دولار لن تحصل على دعم بشري ولا على أصوات لائقة. وفوق 1800 دولار، أنت تدفع لباقة شركات لست بحاجة إليها." },
        { type: "h2", text: "حساب العائد على الاستثمار" },
        { type: "p", text: "الوكيل الصوتي الذكي يجيب على 100 % من المكالمات بدلًا من نسبة 60 إلى 70 % المعتادة لمكتب الاستقبال البشري. إن كان متوسط طلبك 80 دولارًا ومعدل تحويلك الهاتفي 30 %، فإن استرجاع 30 مكالمة فائتة شهريًا يُعيد 720 دولارًا، أي أكثر من باقة Starter. وبعد 300 مكالمة شهريًا، يتجاوز العائد عادةً 4 أضعاف." },
        { type: "h2", text: "إشارات تحذيرية في أي عرض" },
        { type: "ul", items: [
          "سعر «ابتداءً من» منخفض جدًا لا يشمل دقائق المكالمات.",
          "وكيل واحد فقط في حين تحتاج اثنين (وارد وصادر).",
          "العربية أو الإنجليزية كميزات مدفوعة إن كنت تعمل بلغات متعددة.",
          "غياب الدعم: ستتدبّر أمرك وحدك ليلة عطل في العاشرة مساءً.",
        ] },
        { type: "p", text: "في فوكازاي، باقتا 499 و1490 دولارًا تشملان كل شيء: ثلاث لغات (الفرنسية، العربية، الإنجليزية)، الدقائق، التكاملات القياسية والدعم. الشهر الأول مجاني، فتكلفة التجربة صفر." },
      ],
    },
  },
  {
    slug: "agent-vocal-ia-prise-rdv-automatique",
    date: "2026-06-15",
    readingMinutes: 6,
    title: {
      fr: "Agent vocal IA pour la prise de rendez-vous : ce qui change vraiment pour vos équipes",
      en: "AI voice agent for automatic appointment booking: what really changes for your team",
      ar: "الوكيل الصوتي الذكي لأخذ المواعيد: ما الذي يتغيّر فعلًا لفريقك",
    },
    description: {
      fr: "Un agent vocal IA qui prend les rendez-vous tout seul, c'est combien d'heures rendues à vos équipes ? Voici le calcul, les intégrations agenda et le piège à éviter.",
      en: "An AI voice agent that books appointments by itself — how many hours does it give back to your team? Here's the math, the calendar integrations, and the trap to avoid.",
      ar: "وكيل صوتي ذكي يأخذ المواعيد لوحده — كم ساعة يُرجِع لفريقك؟ إليك الحساب، تكاملات الأجندة، والمصيدة الواجب تجنّبها.",
    },
    body: {
      fr: [
        { type: "p", text: "La prise de rendez-vous au téléphone, c'est l'activité la plus prévisible d'un standard — et la plus coûteuse en attention humaine. Un agent vocal IA bien configuré peut absorber 80 à 95 % de ces appels sans qu'un humain intervienne, en libérant exactement les minutes où vos équipes sont déjà sous pression." },
        { type: "h2", text: "Ce que l'agent fait réellement" },
        { type: "p", text: "Concrètement, l'agent ouvre votre agenda en lecture, propose 2 à 3 créneaux compatibles, confirme le nom et le téléphone, écrit l'événement et envoie le SMS de rappel. Tout ça en français, en arabe ou en anglais, en moins de 90 secondes par appel." },
        { type: "ul", items: [
          "Demande de rendez-vous classique : « j'aimerais passer mardi vers 10h ».",
          "Modification : « finalement, repoussez d'une semaine ».",
          "Annulation : l'agent libère le créneau et propose un autre client en liste d'attente si vous l'avez activée.",
          "Question hors-sujet : l'agent ramène la conversation au RDV ou transfère.",
        ] },
        { type: "h2", text: "Intégrations agenda" },
        { type: "p", text: "Les connecteurs standards couvrent Google Calendar, Microsoft 365, Calendly, Cal.com et la plupart des PMS sectoriels (médical, salon, atelier). L'agent ne crée jamais un doublon : il vérifie la disponibilité au moment précis de la prise, pas au début de l'appel." },
        { type: "h2", text: "Le piège : l'agent qui sur-promet" },
        { type: "p", text: "Le réflexe à éviter, c'est de demander à l'agent de gérer aussi le diagnostic, le devis et le suivi commercial dans le même appel. Un bon agent de prise de RDV reste focalisé sur une tâche unique — ça maximise le taux de complétion et ça raccourcit la durée moyenne, donc votre facture en minutes." },
        { type: "h2", text: "Le ROI en deux lignes" },
        { type: "p", text: "Si votre standard passe en moyenne 4 minutes par RDV et en prend 20 par jour, ça représente environ 27 heures par mois. À un coût horaire chargé de $18, c'est $486/mois économisés — sans compter les RDV manqués que vous récupérez en plus. Le forfait Starter VocazAI est à $499 et le premier mois est gratuit." },
      ],
      en: [
        { type: "p", text: "Phone appointment booking is the most predictable activity at a front desk — and the most expensive in human attention. A well-configured AI voice agent can absorb 80 to 95 % of these calls without a human stepping in, freeing up the exact minutes when your team is already under pressure." },
        { type: "h2", text: "What the agent actually does" },
        { type: "p", text: "In practice the agent opens your calendar read-only, offers 2 to 3 compatible slots, confirms name and phone, writes the event and sends the reminder SMS. All in French, Arabic or English, in under 90 seconds per call." },
        { type: "ul", items: [
          "Classic request: \"I'd like to come in Tuesday around 10.\"",
          "Reschedule: \"actually, push it back a week.\"",
          "Cancellation: the agent frees the slot and offers it to a waitlisted customer if you've enabled that.",
          "Off-topic question: the agent steers back to the booking or transfers.",
        ] },
        { type: "h2", text: "Calendar integrations" },
        { type: "p", text: "Standard connectors cover Google Calendar, Microsoft 365, Calendly, Cal.com and most vertical PMS (medical, salon, garage). The agent never creates a double-booking — it checks availability at the moment of the write, not at the start of the call." },
        { type: "h2", text: "The trap: the agent that overpromises" },
        { type: "p", text: "The reflex to avoid is asking the agent to also handle triage, quotes and sales follow-up in the same call. A good booking agent stays focused on a single task — that maximizes completion rate and shortens average duration, which lowers your per-minute bill." },
        { type: "h2", text: "ROI in two lines" },
        { type: "p", text: "If your front desk spends an average of 4 minutes per booking and takes 20 a day, that's about 27 hours a month. At a loaded hourly cost of $18, that's $486/month saved — not counting the missed bookings you also recover. VocazAI's Starter plan is $499 and the first month is free." },
      ],
      ar: [
        { type: "p", text: "أخذ المواعيد عبر الهاتف هو النشاط الأكثر قابلية للتنبؤ في مكتب الاستقبال، والأكثر استنزافًا لانتباه البشر. الوكيل الصوتي الذكي المُعدّ جيدًا يستطيع امتصاص 80 إلى 95 % من هذه المكالمات دون تدخل بشري، ويحرّر بالضبط الدقائق التي يكون فيها فريقك تحت الضغط." },
        { type: "h2", text: "ما الذي يفعله الوكيل فعلًا" },
        { type: "p", text: "عمليًا، الوكيل يفتح أجندتك بصلاحية القراءة، يقترح موعدين إلى ثلاثة متوافقة، يؤكد الاسم والهاتف، يكتب الموعد ويُرسل رسالة التذكير. كل ذلك بالفرنسية أو العربية أو الإنجليزية، في أقل من 90 ثانية لكل مكالمة." },
        { type: "ul", items: [
          "طلب موعد كلاسيكي: «بغيت نجي يوم الثلاثاء قرب العاشرة».",
          "تأجيل: «أجّله بأسبوع».",
          "إلغاء: الوكيل يُحرّر الموعد ويعرضه على زبون في قائمة الانتظار إن فعّلتَ ذلك.",
          "سؤال خارج الموضوع: الوكيل يُعيد المحادثة إلى الموعد أو يُحوّلها.",
        ] },
        { type: "h2", text: "تكاملات الأجندة" },
        { type: "p", text: "الموصّلات القياسية تغطّي Google Calendar، Microsoft 365، Calendly، Cal.com ومعظم أنظمة الإدارة القطاعية (طب، صالون، ميكانيك). الوكيل لا ينشئ موعدًا مكرّرًا أبدًا — فهو يتحقق من التوافر لحظة الكتابة، وليس عند بداية المكالمة." },
        { type: "h2", text: "المصيدة: الوكيل الذي يَعِد بأكثر مما يستطيع" },
        { type: "p", text: "الخطأ الشائع هو أن تطلب من الوكيل أن يتولى التشخيص والعرض والمتابعة التجارية في نفس المكالمة. الوكيل الجيد لأخذ المواعيد يبقى مركّزًا على مهمة واحدة، وهذا يرفع نسبة الإتمام ويُقصّر مدة المكالمة، فتنخفض فاتورتك بالدقيقة." },
        { type: "h2", text: "العائد على الاستثمار في سطرين" },
        { type: "p", text: "إن كان مكتب استقبالك يقضي معدّل 4 دقائق لكل موعد ويأخذ 20 موعدًا يوميًا، فذلك يعادل تقريبًا 27 ساعة شهريًا. بتكلفة ساعة محمّلة بـ18 دولارًا، فالادخار يبلغ 486 دولارًا شهريًا، ومن دون احتساب المواعيد الفائتة التي تستردّها أيضًا. باقة Starter من فوكازاي بـ499 دولارًا والشهر الأول مجاني." },
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
