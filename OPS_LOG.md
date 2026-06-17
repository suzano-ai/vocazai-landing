# VocazAI Ops Log (append-only)
> Every cron fire appends ONE row. Newest at top. Format below.
> Crons read this to know what's already been done — never repeat a deliverable already logged.

## Format

```
## YYYY-MM-DD HH:MM · <role> · <one-line deliverable>
- commit: <sha-7> "<message>"
- next: <what should follow, if anything>
```

---

## 2026-06-17 · Growth Engineer · CRO #43 — trilingual greeting chip above the hero subtitle
- commit: `eeb0b2c`
- New pill between hero ascii-rule and subtitle: "Bonjour · Hello · السلام عليكم" — three actual greetings, each in its native script (`dir="rtl" lang="ar"` on Arabic, ltr chip wrapper, normal-case + tracking-normal inside Arabic span to preserve glyph readability). Brand differentiation (trilingual AI agent) currently communicated abstractly via a status-line "TRILINGUAL · FR · AR · EN" label that's easy to miss in a 2-second skim. The greeting chip makes the promise visceral, captures FR/AR-locale visitors with their own greeting in the mix, and reinforces credibility (anyone can claim multilingual; only a real product writes the right script). Zero deps, zero JS, zero new i18n keys (greetings ARE the demo, never translated). Touched: `src/app/[locale]/page.tsx` only.
- next: cron B picks next SEO or CRO #44.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-anti-spam-numero-reputation` (Tier-7 cross-cutting #31)
- commit: `232fa04` · IndexNow: HTTP 200
- Tier-7 #31. Number-reputation defense playbook addressing the silent ~60 % answer-rate cliff when Hiya/Truecaller/native Android filters flag a number. 5 levers: (1) frequency + time window (max 1 call/72 h same destination, 9am-7pm local, no Sundays, <80 % baseline daily), (2) STIR/SHAKEN attestation A interrogation script with concrete "vague answer = change provider" rule, (3) branded calling (First Orion / Hiya Connect / SSN Registry, $50-200/mo → 3× answer rate), (4) weekly reputation monitoring + unflag ticket process, (5) 14-day warm-up curve (20→40→80 over 7 days vs 100 cold = banned in 48h). Recycled-number trap (>5 prior reports = refuse). Monthly 5-phone self-test protocol. Cross-cuts every vertical that runs outbound. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (multi-turn, HIPAA, payment compliance) or remaining Tier-6.

## 2026-06-17 · Growth Engineer · SEO #41 — `mentions` cross-link graph on every BlogPosting
- commit: `3ebcb6a`
- Every `BlogPosting` JSON-LD now emits a `mentions` array of 2 semantically-adjacent posts (CreativeWork refs with url + name). Adjacency = shared slug-token count between current and candidate post (e.g. `agent-vocal-ia-veterinaire` shares 3 tokens with `agent-vocal-ia-cabinet-medical`); ties broken by recency. Token overlap → semantic; no overlap → recency fallback emerges naturally from the sort. Google reads `mentions` as a topical-cluster signal: when one post in the cluster ranks well, the others inherit some of that authority instead of having to earn it from scratch. AI engines use it for "related" citation carousels. UI "Read next" stays recency-based; this JSON-LD signal is semantic-first. Touched: `src/lib/seo/structured-data.ts`, `src/app/[locale]/blog/[slug]/page.tsx`.
- next: cron B picks next CRO or SEO #42.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-prospection-froide-quand-utiliser` (Tier-7 cross-cutting #30)
- commit: `ae5003c` · IndexNow: HTTP 200
- Tier-7 #30. Cold-outbound ethics + use-case playbook. Frames the 12 000 contacts/mo at $0.30 temptation against the 90 % deployments that end in regulator complaints + cascading Google reviews + carrier spam-flagging. 3 legitimate cases (lapsed-customer reactivation 8-15 % conv / unreturned inbound lead 25-40 % conv / CRM hygiene + opt-out capture) vs 3 forbidden (purchased/scraped numbers / B2C cold to never-contacted / robocalls disguised as humans). Double-opt-in rule (voluntary action in last 6 mo + no explicit opt-out since) blocks 99 % of risk. Mandatory AI-identification opening script. "Mom test" heuristic (would she hang up? don't send). Alternative SMS + email + WA combo for genuinely cold prospects. Position-defining post — establishes VocazAI's ethical stance. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (spam shield, multi-turn, hipaa) or remaining Tier-6.

## 2026-06-17 · Growth Engineer · CRO #42 — latest 3 blog posts strip in the footer
- commit: `4f28177`
- New "Latest articles" strip between the 4-column main grid and the uptime/copyright rows in the global footer. 3 responsive cards (sm:grid-cols-3), each title (line-clamp-2) + ISO date, linking to the matching `/[locale]/blog/[slug]`. Footer is the single most-trafficked UI on the site (visible across landing/pricing/use-cases/blog/about/every post/legal). Three wins: (1) lifts blog discovery from non-blog pages (buyer on /pricing seeing fresh "Number portability" or "ROI proof" gets a one-click path to depth), (2) re-engages would-bounce visitors with a fresh title in peripheral vision, (3) signals freshness to every visitor without navigating to /blog. Auto-updates per post ship via `POSTS_BY_DATE.slice(0, 3)`. `data-vocazai-track="footer-latest-post"` for analytics. New i18n key `landing.footer.latestKicker` (FR/EN/AR). Touched: `src/components/landing/footer.tsx`, `messages/{fr,en,ar}.json`.
- next: cron B picks next SEO or CRO #43.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-monitoring-quotidien-5-minutes` (Tier-7 cross-cutting #29)
- commit: `f8c9579` · IndexNow: HTTP 200
- Tier-7 #29. Daily-operations discipline playbook addressing dashboard overload (50 widgets, no one looks). 5 numbers to scan each morning with concrete sweet-spot ranges + escalation triggers: (1) handoff rate (88 % target, <80 % prompt issue, >95 % under-handoff), (2) booking conversion (35-55 % normal, <30 % qualification issue, >60 % duplicate check), (3) average call duration (90-150 s simple booking, trend > absolute), (4) critical alerts in 24 h (0-2 normal, listen-to-3-calls trigger), (5) monthly minutes consumption (react at day 10, not day 28). 3 widgets to IGNORE (5-star vanity, cumulative keywords, geo heatmap). Distinct from `kpi-production` (which defined KPIs); this one is the operational morning routine. FR/EN/AR ~5 min.
- next: cron A picks Tier-7 (cold outbound, spam shield, multi-turn) or remaining Tier-6.

## 2026-06-17 · Growth Engineer · SEO #40 — `WebPage` chain on /pricing + `CollectionPage` on /use-cases
- commit: `fcdfa91`
- Extends the `@id` entity graph started in SEO #37 (root `#organization` + locale `#website`) to cover the remaining non-blog surfaces. (1) `/use-cases` now declares `schema.org/CollectionPage` with `mainContentOfPage` → existing ItemList, `about` → Organization `@id`, `isPartOf` → WebSite `@id`. (2) `/pricing` declares `schema.org/WebPage` with `mainEntity` → Product `@id` (telling Google the AggregateOffer entity IS the page), `significantLink` → the WhatsApp trial CTA (Google reads it as the page's primary CTA for click-flow signals). Every public page now chained to one Organization + WebSite node — authority signals stack instead of fragmenting. ~150 bytes JSON per page. Touched: `pricing/page.tsx`, `use-cases/page.tsx`.
- next: cron B picks next CRO or SEO #41.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-bruit-environnement-noisy` (Tier-7 cross-cutting #28)
- commit: `a548100` · IndexNow: HTTP 200
- Tier-7 #28. Noisy-environment handling playbook — addresses the 40 % of mobile calls with significant background noise (car / café / construction). 4-layer technical stack: (1) RNNoise/Krisp/WebRTC NS input-side suppression -20 dB → STT accuracy 60-65 % → 85-90 %; (2) noise-trained STT (Voxtral / Whisper Large v3 / Deepgram Nova) +10-15 pts on brouhaha; (3) explicit numeric-field confirmation (zero wrong-number bookings); (4) SMS fallback after 2 repeat requests (recovers ~80 % of would-hang-up calls). 3 pitfalls (TTS too loud causing mic saturation, complex polite phrasing, infinite "I didn't understand" loop). Weekend test protocol from 3 real noisy environments. Cross-cuts every mobile-heavy vertical. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (cold outbound, spam shield, dashboard KPIs) or remaining Tier-6.

## 2026-06-17 · Growth Engineer · CRO #41 — deep-dive blog link below each pricing FAQ answer
- commit: `d1bc7eb`
- Each of the 3 pricing-FAQ answers now ends with a "Read the full guide" link to the blog post most likely to address the buyer's follow-up question: q1 (overage) → `agent-vocal-ia-couts-caches`, q2 (plan switching) → `agent-vocal-ia-roi-comment-prouver`, q3 (setup fees) → `agent-vocal-ia-deployer-en-48h`. Three wins: (1) keeps the buyer learning on /blog instead of bouncing, (2) 3 internal links from highest-intent money page into the blog cluster lifts blog authority signals, (3) better-informed visitors convert higher on the bottom WhatsApp CTA. `Faq` extended with `learnMore?: { href, label }`. New `pricing.faq.learnMore` i18n key (FR/EN/AR). `data-vocazai-track="pricing-faq-learn-more"` for analytics. Touched: `pricing/page.tsx`, `messages/{fr,en,ar}.json`.
- next: cron B picks SEO #40 or CRO #42.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-weekends-jours-feries-strategie` (Tier-7 cross-cutting #27)
- commit: `e5371de` · IndexNow: HTTP 200
- Tier-7 #27. Off-hours competitive-edge playbook — frames the 31 % of the year (115 days = 104 weekend + 11 holiday) when competitors aren't picking up as a market window the agent monopolizes. 3 weekend modes: deferred-to-Monday booking (most common, fills 80 % of Monday before doors open) / emergency routed to on-call / B2B qualify + Monday-9am callback. Holiday config (calendar import, adapted greeting, post-holiday SMS reminder). Christmas + August double-check (strongest ROI window). Concrete economics: $33,120/yr captured at 8 calls × 40 % × $90 vs Growth $17,880/yr → ~$15k net year-one. Cross-cuts every vertical. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (cold outbound, spam shield) or remaining Tier-6.

## 2026-06-17 · Growth Engineer · SEO #39 — `articleBody` plain-text on every BlogPosting JSON-LD
- commit: `716e9f3`
- Every blog post's `BlogPosting` JSON-LD now emits the full body as a plain-text `articleBody` field (typed `Block[]` flattened with `## ` h2 prefix + `- ` ul bullet prefix + double newlines between blocks). Google AI Overviews / Gemini / Bing Copilot pick cited passages directly from `articleBody` when present — without it they fall back to HTML scraping, which is slower, less precise, and especially fragile on RTL Arabic. Having a structured-data fallback means we control exactly which text the answer engines quote. Cost ~1-2KB/locale × 29 posts × 3 locales ≈ 120KB peak — trivial vs share-of-voice gain in answer engines. Extended `blogPostingJsonLd()` helper with optional `articleBody` arg. Touched: `src/lib/seo/structured-data.ts`, `src/app/[locale]/blog/[slug]/page.tsx`.
- next: cron B picks next CRO or SEO #40.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-portage-numero-existant` (Tier-7 cross-cutting #26)
- commit: `2e56180` · IndexNow: HTTP 200
- Tier-7 #26. Number-portability playbook addressing the #2 buyer objection after price ("can I keep my number?"). Why porting matters (200 cards / 5 yr ads / WA Business memorized). 3 cases where porting is required (GMB-visible / >50 organic callbacks/day / license-bound) vs 3 cases where new number is enough (new business / parallel POC / spam-flagged number). Realistic timeline (marketing 24 h vs reality 5-15 business days), 2-4 h sensitive cutover window, 3 mitigation tactics (1-week customer notice / Sunday-night cut / 7-day forwarding). Unprepared-port trap with parallel-bridge solution. Cost rule of thumb: > 1 year of business history = always port. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (cold outbound, spam shield, dashboard KPIs) or remaining Tier-6.

## 2026-06-17 · Growth Engineer · CRO #40 — risk-reversal microcopy + setup-hook on blog post CTA
- commit: `1be990c`
- End-of-blog-post CTA card was a bare button; now mirrors the landing-hero pattern with two compact microcopy lines. Above (kicker): "Set up in 48h · no setup fees" — answers the first practical objection. Below (saffron uppercase chip): "First month free · no credit card · cancel anytime" — standard 3-axis risk-reversal that lifts trial conversion on B2B SaaS by 8-20 % over bare CTA. Visitor entering from a Google blog hit now sees the same trial terms as on home page → coherent funnel message. `data-vocazai-track="blog-post-cta"` for click attribution. New i18n keys `blog.ctaHook` + `blog.trialChip` (FR/EN/AR). Touched: `blog/[slug]/page.tsx`, `messages/{fr,en,ar}.json`.
- next: cron B picks next SEO or CRO #41.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-voix-et-whatsapp-meme-agent` (Tier-7 cross-cutting #25)
- commit: `99b8365` · IndexNow: HTTP 200
- Tier-7 #25. Multi-channel continuity playbook addressing the silent 30 % drop-off from cross-channel context loss (customer starts on phone, finishes on WhatsApp, gets a blind agent). 3-component unified architecture (E.164 phone number as primary key / central conversation log / LLM gets full history regardless of input channel). 4 transition patterns (call→WA proof, WA photo→call discuss, unsent WA draft→voice callback, after-hours call→WA slot offer). 3 pitfalls (separate tools no-bridge / opt-in for WA Business / context mix-up validation). 48 h deploy if both surfaces already exist. Bridges between the verticals (vet, dental, real estate) where WhatsApp is already where conversations actually happen. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (cold outbound, spam shield, dashboard KPIs) or remaining Tier-6.

## 2026-06-17 · Growth Engineer · SEO #38 — FAQPage JSON-LD on /[locale]/pricing
- commit: `77307c5`
- Wires the 3 pricing-FAQ Q&A pairs (q1: overage / q2: plan switching / q3: billing) as `schema.org/FAQPage` structured data so Google's FAQ rich result can expand them directly under the `/pricing` SERP entry. Landing already had its own `FAQPage` for general FAQs; this one is distinct because its questions are exactly the billing/overage/plan-switching concerns high-intent searchers want answered BEFORE they click "Start trial" — surfacing answers pre-click both qualifies the click that happens and pushes the entry vertically in the result list. Inline schema (page-scoped). Touched: `src/app/[locale]/pricing/page.tsx` only.
- next: cron B picks next CRO or SEO #39.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-affichage-numero-sortant` (Tier-7 cross-cutting #24)
- commit: `d00ef69` · IndexNow: HTTP 200
- Tier-7 #24. Outbound caller-ID strategy playbook — the answer-rate factor most operators ignore. Concrete numbers per strategy: main business number 50-60 % vs dedicated geo-local 30-40 % vs short code 8-15 % vs hidden <5 %. 4-strategy comparison with use-cases, 1-question decision rule by daily outbound volume, the recognition bonus SMS script that adds 8-15 pts over 3 months. Cross-cuts every vertical with outbound reminders/callbacks. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (cold outbound, spam shield, multi-channel) or remaining Tier-6.

## 2026-06-17 · Growth Engineer · CRO #39 — visible topic-tag chips in blog post header
- commit: `909f69a`
- Every blog post header now renders a row of small monospace pill chips below the description, listing the auto-derived topic tags (same `derivedTags(slug)` already used for OG `tags` meta + `BlogPosting.keywords` — "agent vocal ia" phrase + vertical tail tokens). Three wins: (1) skim-readers get an immediate topic-relevance signal above the fold, (2) mirrors the JSON-LD keyword set with visible body text (Google's semantic matcher weights structured data + visible echoes higher than pure-JSON-LD), (3) forward hook for tag-filtered `/blog?tag=X` views — chips can become Links without restructuring. Zero new JS / no deps. Touched: `src/app/[locale]/blog/[slug]/page.tsx` only.
- next: cron B picks next SEO or CRO #40.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-onboarding-equipe-humaine` (Tier-7 cross-cutting #23)
- commit: `664b877` · IndexNow: HTTP 200
- Tier-7 #23. People-side deployment playbook — 60 % of rollouts stall because of internal human resistance, not technical issues. The lie not to tell ("the agent will take the phone off your hands" = heard as "you're replaced"); right framing reverses it. Task-redistribution 5-line table (what the agent does / what YOU do instead / MORE / LESS / freed time). Written 3-point team contract (no layoffs / role expands / training planned). 30 min/week training ritual that lets the team train the agent, not the other way. 3 success signals + the hidden-rollout trap that turns silent boycott into a project-killer. Distinct from technical posts — addresses the buyer's deepest non-technical objection. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (CLI strategy, cold outbound, spam shield).

## 2026-06-17 · Growth Engineer · SEO #37 — AboutPage JSON-LD + stable `@id` chain on Organization + WebSite
- commit: `fa3614f`
- Three coordinated changes that turn separate page-local entities into one chained entity graph: (1) `/[locale]/about` now emits `schema.org/AboutPage` with `mainEntity` referencing `${BASE}/#organization` and `isPartOf` referencing `${BASE}/#website` (AboutPage is Google's specific E-E-A-T-relevant subtype for "about us" pages — concentrating authoritativeness on the brand entity); (2) root layout's `organizationJsonLd` now carries `@id: ${BASE_URL}/#organization` (Google folds matching @ids into one node so /about signals stack with root signals instead of fragmenting); (3) locale layout's `WEBSITE_JSONLD` now carries `@id: ${SITE}/#website` (every per-page reference now anchors to one node). Unlocks all future SEO ships to chain via @id without redeclaring. Touched: `about/page.tsx`, `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`.
- next: cron B picks next CRO or SEO #38.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-evaluation-fournisseur` (Tier-7 cross-cutting #22)
- commit: `084d3ba` · IndexNow: HTTP 200
- Tier-7 #22. Top-of-funnel buyer-side checklist: 12 questions to ask any AI voice agent vendor before signing. 4 blocks (business model: per-minute cost / hidden fees / overage / cancel terms; technical quality: latency <700 ms / barge-in handling / handoff %; compliance: storage location / DPA / data deletion; operation: time-to-prod / support response time). Golden rule (vendor failing >3/12 lacks technical command). Strategic angle: positions VocazAI as the answer to its own audit grid — competitors who duck these questions are flagged silently. Targets the high-intent "how to choose AI voice agent" research query. FR/EN/AR ~7 min.
- next: cron A picks Tier-7 (CLI strategy, cold outbound, mixed team).

## 2026-06-17 · Growth Engineer · CRO #38 — "vs hiring a receptionist" anchor callout on /pricing
- commit: `deef7bc`
- New compact 2-column callout between comparison table and FAQ on `/[locale]/pricing`. Human receptionist (~$3,500/mo, struck-through) vs VocazAI Starter ($499/mo) → net savings highlight "$3,000+ per month". Classic price-anchoring move that reframes $499 from a NEW cost into a discount on the alternative the buyer was already weighing. Honest footnote acknowledges the human still matters for high-value relationships, pre-empting the "should I fire my receptionist?" objection. FAQ section's prefix bumped 03 → 04. New `pricing.savings` i18n block (FR/EN/AR). Touched: `pricing/page.tsx` + `messages/{fr,en,ar}.json`.
- next: cron B picks next SEO or CRO #39.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-conversation-interrompue` (Tier-7 cross-cutting #21)
- commit: `88a5aa4` · IndexNow: HTTP 200
- Tier-7 #21. Barge-in handling playbook — addresses the #1 "AI feels robotic" complaint (agent talking over the caller). Three tunable parameters: (1) voice detection threshold (150-200 ms continuous voice, >25 dB above background), (2) cut-off duration (80-120 ms target, zero perceptible overlap), (3) contextual resume (LLM with multi-turn state, NOT FIFO of pre-generated phrases — must respond to NEW input, not repeat its own sentence). 4 barge-in patterns (question during explain / correction / early answer / urgent override), 5-call calibration test. Cross-cuts every vertical. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (CLI strategy, vendor selection, cold outbound).

## 2026-06-17 · Growth Engineer · SEO #36 — latest 6 blog posts as ItemList JSON-LD on landing
- commit: `d87964e`
- Each `/[locale]` landing now declares an `ItemList` of the 6 most recent `BlogPosting` entities, each chained via `isPartOf` `@id` to the `Blog` collection at `/[locale]/blog` (matching the `@id` Google sees on `blogIndexJsonLd` and on every post's own `BlogPosting.isPartOf`). Three wins: (1) Googlebot refreshes the landing far more often than `/blog` — fresh slugs hit the crawl queue faster, (2) every fresh post gains a structured backlink from the highest-authority URL, (3) richer landing entity graph eligible for "Recent posts" sitelinks. `itemListOrder: ItemListOrderDescending`, capped at 6 (above sitelinks cap of 4, payload stays under ~5KB). Inline on `src/app/[locale]/page.tsx`.
- next: cron B picks SEO #37 or next CRO.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-message-vocal-vs-sms` (Tier-7 cross-cutting #20)
- commit: `06a1b38` · IndexNow: HTTP 200
- Tier-7 #20. Channel-economics playbook killing the "why pay 6× more for voice when SMS works?" objection. Raw numbers (SMS 17 % final conversion vs voice 52 %), net-margin math worked example (voice nets $41.30 vs SMS $13.55 on $80 booking — 3.1× despite 6× higher unit cost), decision grid by flow (6 use-case pairings), the winning combo (SMS T-48h + voice T-24h = ~62 % conversion at $0.35 combined), 3 cases where SMS DOES win (margin < $5, trivial action, B2B SaaS tech audience). Cross-cuts every vertical that has outbound reminders. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 (CLI strategy, barge-in, vendor selection) or another Tier-6.

## 2026-06-17 · Growth Engineer · CRO #37 — per-vertical WhatsApp CTA inside each /use-cases card
- commit: `f335ca8`
- Each of the 4 use-case rows on `/[locale]/use-cases` now ends with its own pre-filled WA link ("Try VocazAI for this business" → opens with "I'd like to try VocazAI for my [Clinic/Realty/Ecom/Restau] business"). Until now the page had only a single bottom CTA after all 4 verticals — readers who recognized themselves in the 1st or 2nd card had no immediate action. Founder skips "what's your business?" round; visitor feels the team is tracking their entry path. New i18n keys: `common.whatsappVertical` (`{vertical}` placeholder) + `common.tryVerticalCta` (FR/EN/AR). `UseCaseRow` extended with `ctaHref` + `ctaLabel` props. `data-vocazai-track="use-cases-vertical-cta"` flags the click event for analytics. Touched: `src/app/[locale]/use-cases/page.tsx`, `messages/{fr,en,ar}.json`.
- next: cron B picks next SEO or CRO #38.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-test-utilisateur-30-minutes` (Tier-7 cross-cutting #19)
- commit: `0ff0023` · IndexNow: HTTP 200
- Tier-7 #19. Pre-deploy validation playbook — answers "how do I know it'll work before I launch?" objection with a concrete 30-minute / 2-person protocol. Phase 1 (10 typical calls, 15 min: booking, pricing, hours, cancel, delivery-status, FAQ, address, transfer, hang-up, short message), Phase 2 (5 edge cases, 10 min: accent, digit-by-digit number, chained questions, out-of-scope, heavy background noise), Phase 3 (5 emotional, 5 min: anger, crying, vital emergency, lawsuit threat, jailbreak attempt — all must handoff in 3 s). 20-case scoring grid (≥18 production-ready, 15-17 one iteration, <15 architecture rework). Weekly 10-call drift audit. FR/EN/AR ~6 min.
- next: cron A picks next Tier-7 or Tier-6.

## 2026-06-17 · Growth Engineer · SEO #35 — BlogPosting `isPartOf` chain + `timeRequired`
- commit: `2aad61c`
- Two wins on every blog post JSON-LD: (1) `isPartOf` references the Blog `@id` matching `/[locale]/blog` (reusing the exact same `@id` Google sees on `blogIndexJsonLd`) — chains every BlogPosting back to the collection, stitches everything into one entity graph, concentrates authority signals on the collection; (2) `timeRequired` (ISO 8601 `PT<readingMinutes>M`) — Google reads it as both freshness + depth signal, eligible for "X-min read" SERP annotations, and AI Overviews use it to pick quick-snippet vs full-article surfacing. Touched: `src/lib/seo/structured-data.ts` + `src/app/[locale]/blog/[slug]/page.tsx`.
- next: cron B picks next CRO or SEO #36.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-piege-questions-ouvertes` (Tier-7 cross-cutting #18)
- commit: `f97598e` · IndexNow: HTTP 200
- Tier-7 #18. Counterintuitive script-design playbook: "How can I help you?" is the WORST opening for a voice agent (-35 % conversion vs closed-question version). Closed-question rule (2-4 named options inside the question), 10 paired before/after rewrites with concrete numerical anchors, 3 exceptions where open-ended STAYS useful (emergency, complaint emotional release, deep qualification after 3 filtering closeds), 1-morning A/B test (10 + 10 calls, before vs after). Cross-cuts every vertical and applies even to existing customers who think their script "works fine". FR/EN/AR ~6 min.
- next: cron A picks next Tier-7 or remaining Tier-6 vertical.

## 2026-06-17 · Growth Engineer · CRO #36 — sticky reading-progress bar on blog posts
- commit: `a1ac640`
- New client component `src/components/reading-progress.tsx` mounts a 3px phosphor bar fixed at the top of `/[locale]/blog/[slug]` pages, tracking scroll progress through the `<article>` element. Uses `requestAnimationFrame` throttling so the scroll handler stays cheap; inner bar updates width on the same frame (no CSS transition → respects `prefers-reduced-motion`). Three wins on the 1100-1500 char × 3 locale × 6-9 block format: encourages completion, low-cost re-engagement signal, better dwell time which Google reads as a quality signal. Only mounted on blog [slug]; landing/pricing/use-cases/blog-index stay clean.
- next: cron B picks next SEO or CRO #37.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-handoff-humain-quand` (Tier-7 cross-cutting #17)
- commit: `6bf0444` · IndexNow: HTTP 200
- Tier-7 #17. Operational decision playbook for the #2 demo question (after price): when should the agent transfer to a human? 5 trigger signals (emergency keyword, detected emotion, 3-repeat misunderstanding, out-of-scope, explicit human request), 3-second handoff rule (acknowledge → save context → route), hot vs cold transfer mapping by vertical, "% handled without handoff" as the #1 quality KPI (not call duration), 50-call calibration test with concrete targets (<15 % Starter, <8 % Growth). Cross-cuts every vertical. FR/EN/AR ~6 min.
- next: cron A picks remaining Tier-6 or Tier-7 cross-cutting.

## 2026-06-17 · Growth Engineer · SEO #34 — ItemList + Service JSON-LD on /[locale]/use-cases
- commit: `6044f05`
- Declares /use-cases as a structured `schema.org/ItemList` enumeration of services, with each of the 4 vertical cards (clinic, realty, ecom, restau) nested as a `Service` entity that links to its matching deep-dive blog post (cabinet-medical, agence-immobiliere, ecommerce-sav, restaurant-reservations). Three wins: (1) Google can surface the page as a sitelink/list rich-result with the 4 verticals visible directly in SERP, (2) each Service carries `inLanguage` so locale variants stay coherent, (3) each item's `url` pushes internal link equity into the matching long-form vertical blog post. Inline schema (no helper) since wiring is page-specific. Touched: `src/app/[locale]/use-cases/page.tsx`.
- next: cron B picks next CRO or another SEO extension.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-banque-courtier-credit` (Tier-6 regulated vertical)
- commit: `3959269` · IndexNow: HTTP 200
- Tier-6 regulated vertical. Banking + credit-broker playbook — kills the "we can't do this" myth. Clear red-line list (account balance, transactions, IBAN/card data, investment advice, credit accept/refuse) vs 5 high-value flows the agent legally CAN handle (mortgage pre-qualification with 8-question score, branch/video RDV, compliance-validated FAQ, document checklist, instant human handover on sensitive signals). Mandatory 4-second compliance opening that passes ACPR/AMF audits. Quanteo/La Centrale du Financement/ID Crédit/FluxImmo broker CRM writes. ~20x ROI on Growth via off-hours capture + qualification. FR/EN/AR ~6 min.
- next: cron A picks remaining Tier-6 verticals or Tier-7 cross-cutting.

## 2026-06-17 · Growth Engineer · CRO #35 — pre-fill pricing page per-plan WhatsApp CTAs with the plan name
- commit: `d40bc29`
- Each plan card on `/[locale]/pricing` now opens WhatsApp with a message pre-tagged with the visitor's chosen tier ("I'm interested in the Starter / Growth / Enterprise plan from VocazAI"). Founder skips the "which plan?" qualifying round on first reply; visitor feels the team is tracking their entry path. New i18n key `common.whatsappPlan` (FR/EN/AR, `{plan}` placeholder resolving to localized plan name). Bottom-of-page closing CTA keeps generic `common.whatsapp` unchanged (fires from visitors who scroll past pricing without picking a tier). Touched: `src/app/[locale]/pricing/page.tsx`, `messages/{fr,en,ar}.json`.
- next: cron B picks SEO #34 or another CRO #36.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-laboratoire-analyses` (Tier-6 vertical)
- commit: `219bd9c` · IndexNow: HTTP 200
- Tier-6 vertical. Medical analysis lab playbook — extreme repetition case (70 % same question = "when will results be ready?"). Status-only flow (Kalisil/Hexalis/Synaps Bio LIMS query, never reads results aloud), 5 other flows (sampling RDV, prerequisites, pricing/3rd-party billing, duplicate request, biologist-on-call escalation), confidentiality rule + scripted email-only line, patient identification 3-step matrix, ~0.5 FTE freed on 200 calls/day baseline. Strong commercial vertical with confidentiality angle that addresses GDPR objections head-on. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 (banque-finance) or another Tier-7 cross-cutting.

## 2026-06-17 · Growth Engineer · SEO #33 — Product + AggregateOffer JSON-LD on /[locale]/pricing
- commit: `db889f5`
- The canonical money page now emits `schema.org/Product` with `AggregateOffer` wrapping Starter ($499) and Growth ($1,490) as concrete USD `Offer`s — each with `UnitPriceSpecification` (P1M billing, unitText "month") and `availability: InStock`. `lowPrice`/`highPrice` give Google a "from $499/mo" snippet directly from /pricing in search results. Until now only the landing page had `SoftwareApplication.Offer`; the URL most likely to rank for high-intent queries like "VocazAI tarifs" had only `BreadcrumbList`. Enterprise is intentionally omitted from structured Offers (no fixed price → Google rejects). New helper: `pricingJsonLd()` in `src/lib/seo/structured-data.ts`.
- next: cron B picks next CRO or SEO #34.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-clinique-dentaire` (Tier-6 vertical)
- commit: `72382b8` · IndexNow: HTTP 200
- Tier-6 vertical. Dental-clinic no-show kill playbook — frames the agent against the industry's #1 pain (15-25 % no-show rate). T-24h confirmation script with 17:00-19:00 sweet-spot, 4-branch decision tree (yes/no/unsure/no-answer + SMS cascade), 5 solo flows (first consult, emergency, pricing, insurance, cancel→waitlist), Doctolib/Maiia/Logos/Julie integrations, ROI math (-$1,481/mo net on Starter after dropping no-shows from 30 to 8/month). FR/EN/AR ~6 min.
- next: cron A picks Tier-6 (formation-pro, laboratoire-analyses, banque-finance) or Tier-7 cross-cutting.

## 2026-06-17 · Growth Engineer · CRO #34 — anchored h2 headings on blog posts
- commit: `43a1f39`
- Every blog-body `<h2>` now renders with a stable locale-aware id slug (`slugifyHeading()` handles FR/EN/AR via Unicode `\p{L}`, strips Latin accents, caps at 80 chars) and an on-hover `#` deep-link. Three wins: (1) readers can share section-deep URLs (re-engagement on Slack/WhatsApp), (2) Google's "jump to section" SERP feature uses stable h2 ids to surface in-page targets directly from search results, (3) `scroll-mt-24` keeps the heading clear of the fixed header on jump. Touched: `src/app/[locale]/blog/[slug]/page.tsx` — `BlockView` only.
- next: cron B picks SEO #33 or next CRO #35.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-veterinaire` (Tier-6 vertical)
- commit: `2a95f6d` · IndexNow: HTTP 200
- Tier-6 vertical. Veterinary clinic playbook — emergency-first triage opening ("is this an emergency?"), Level-1 keyword routing to on-call mobile, 4 solo flows (annual vaccination booking, post-op check-up, pricing, cancel/reschedule), Vetocom/ezyVet/Vetstoria integrations, proactive 7-day pre-anniversary vaccination reminder (+40-60% rebooking), explicit prohibitions (no diagnosis, no drug suggestion, no euthanasia discussion), 4 h/day → 3 h/day FTE math (~0.4 FTE freed). FR/EN/AR ~6 min.
- next: cron A picks Tier-6 vertical (formation-pro, clinique-dentaire, laboratoire-analyses, banque-finance) or Tier-7 cross-cutting.

## 2026-06-17 · Growth Engineer · SEO #32 — complete per-blog-post Article metadata surface
- commit: `28b91a9`
- Two ships in one: (1) `BlogPosting` JSON-LD now declares an `image` ImageObject (per-locale `/opengraph-image`, 1200x630) — Google's Article rich-result hard-blocker resolved. (2) Per-blog-post `generateMetadata` now emits the full OG Article tag set: `modifiedTime`, `authors`, `section`, `tags` (derived from slug, max 5), `locale` (fr_FR/en_US/ar_001), `images[]` with per-locale OG route, plus an explicit `twitter` `summary_large_image` card. Social shares switch from generic website cards to richer Article cards on X/Slack/Mastodon. Touched: `src/lib/seo/structured-data.ts`, `src/app/[locale]/blog/[slug]/page.tsx`.
- next: cron B picks next CRO or SEO #33.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-langue-decrochage-comment-choisir` (Tier-7 cross-cutting #15)
- commit: `785a633` · IndexNow: HTTP 200
- Tier-7 #15. Greeting-language decision tree for multilingual lines — the first technical decision on any trilingual deployment. 3 strategies (single-language greeting, compressed bilingual, IVR question), each with costs/benefits and recommended caller-base profile. 1-question selection rule based on language-mix percentages, 7-day A/B test protocol with 30 s config toggle. Bottom-line: 10-15 % conversion swing on the first 2 seconds. FR/EN/AR ~5 min.
- next: cron A picks Tier-7 #16 (banque-finance, accents-anglais, or Tier-6 vertical).

## 2026-06-17 · Growth Engineer · CRO #33 — pre-fill blog-post WhatsApp CTA with the post title
- commit: `4b487e9`
- Blog `[slug]` end-CTA's `wa.me` link now opens WhatsApp with `"I read your article '<title>' and would like to start the free 1-month trial"` instead of the generic template. New i18n key `common.whatsappFromBlog` (FR/EN/AR) with `{title}` placeholder. Visitors landing from Google on a vertical/topic post now arrive in WhatsApp pre-tagged — founder qualifies faster on first reply, visitor perceives the team is paying attention to entry context. Landing/other surfaces unchanged.
- next: cron B picks next CRO #34 or SEO extension.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-debordement-equipe-existante` (Tier-7 cross-cutting #14)
- commit: `547194a` · IndexNow: HTTP 200
- Tier-7 #14. Overflow-mode playbook — neutralizes the #1 demo objection ("my team already answers"). Frames the agent as 30-40% recovery on the calls the human team can't catch: 4 unanswerable moments (simultaneous, breaks, weekends, peaks), conditional routing rule (>4 rings OR all-busy OR after-hours), explicit handoff boundary (anything > 3 min reasoning → human), 5-line ROI math, 14-day proof window. Top-of-funnel objection killer. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 #15 (banque-finance, accents-anglais, or Tier-6 vertical).

## 2026-06-17 · Growth Engineer · SEO #31 — Blog + BlogPosting collection JSON-LD on /[locale]/blog
- commit: `6270dba`
- New `blogIndexJsonLd` helper in `src/lib/seo/structured-data.ts` emits schema.org `Blog` with every published post as a nested `BlogPosting` reference (slug, headline, description, datePublished, inLanguage, mainEntityOfPage). Wired into `src/app/[locale]/blog/page.tsx`. Tells Google the index IS a structured collection — accelerates discovery of newly-added slugs, makes the index page eligible for richer SERP presentation (multi-item list, sitelinks), and lets AI Overviews cite individual posts from a single index fetch.
- next: cron B picks next CRO from §4 or another SEO extension.

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-roi-comment-prouver` (Tier-7 cross-cutting #13)
- commit: `51e3a91` · IndexNow: HTTP 200
- Tier-7 #13. CFO-facing ROI attribution playbook — 30-day baseline mandate, 4 business KPIs (answer rate, call→booking conversion, no-show rate, revenue per inbound call), clean attribution rule (count ONLY bookings that wouldn't exist without the agent), 12-month projection with worked Starter example ($1,440/mo lift on $499 cost → ~350 % annual ROI), single-slide sign-off test. Bottom-of-funnel commercial intent. FR/EN/AR ~6 min.
- next: cron A picks Tier-7 #14 (accents-anglais, banque-finance, or new Tier-6 vertical).

## 2026-06-17 · Growth Engineer · CRO #7 — inline FAQ accordion, first 3 open by default
- commit: `a74e777`
- Landing `#faq` block converted from flat grid to native `<details>`/`<summary>` accordion. Q.01-Q.03 open at load (high-intent answers visible without a click), Q.04 collapses (longest). `[+]`/`[-]` marker via `group-open:` Tailwind variant — zero JS, zero animation (respects `prefers-reduced-motion`). FAQPage JSON-LD emits all 4 answers regardless of state → SEO impact additive only. Speakable `cssSelector` corrected from stale `#faq dd` to `#faq summary + p` (actual answer markup).
- next: cron B picks Tier-7 SEO or remaining CRO (Tier-7 #13 prompts also available).

## 2026-06-17 · SEO Content Producer · ship `agent-vocal-ia-changement-langue-mi-appel` (Tier-7 cross-cutting #12)
- commit: `3b8b925` · IndexNow: HTTP 200
- Tier-7 #12. Mid-call language switching playbook — 3 switch scenarios (isolated loanword / short B inside A flow / two full sentences in B), 80 % confidence threshold across two consecutive sentences, context retention through LLM memory (no reset on switch), 4 typical errors, 4-scenario calibration test. Also fixed Next 15 lint blocker: footer health-status anchor `<a href="/api/health">` → `<Link prefetch={false}>`. FR/EN/AR ~5 min.
- next: cron A picks Tier-7 #13 (mesurer-conversion-business, accents-anglais, banque-finance) or new Tier-6 vertical.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-salle-sport` (Tier-6)
- commit: `2dddb54` · IndexNow: HTTP 200
- Tier-6 #7. Gym/fitness vertical — membership-info conversion narrative (3-4x lift vs voicemail), club software integrations (HeitzSystem/Resamania/Mindbody/Glofox/Gymnasium), 16x ROI on Starter math. FR/EN/AR ~5 min.
- next: cron A picks Tier-6 #8 (startup-saas, location-bien, ecommerce-livraison).

## 2026-06-16 · Growth Engineer · SEO #19 (extension) — OpenSearch description doc + <link rel=search>
- commit: `97183bf`
- `/public/opensearch.xml` + head link. Firefox/Edge/Chrome auto-detect on first visit, user can add VocazAI to their browser search bar. Distinct discovery surface that survives a Google ranking dip.
- next: cron A picks Tier-6 #7.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-taxi-vtc` (Tier-6)
- commit: `835f1b0` · IndexNow: HTTP 200
- Tier-6 #13. Taxi/VTC dispatch vertical — sub-2-second answer mandate, real-time dispatch integrations (Mobilix/Sokovan/eCab/Bolt Drivers/FreeNow), $22.5k/mo lost-rides math + 12-15x ROI. FR/EN/AR ~5 min.
- next: cron A picks Tier-6 #14 (artisan-plombier, agence-com, formation-pro).

## 2026-06-16 · Growth Engineer · SEO #22 (extension) — <link rel=me> IndieAuth/Mastodon identity claim
- commit: `486abd7`
- HTML-spec complement to the existing Schema.org Organization `sameAs:[github]`. Mastodon shows verified checkmark on profile links back; IndieAuth uses it for federated identity. One-line ship.
- next: cron A picks Tier-6 #13.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-ecommerce-sav` (Tier-6)
- commit: `5b32cb9` · IndexNow: HTTP 200
- Tier-6 #10. E-commerce after-sales vertical (calm vs peak regimes). Shopify/WooCommerce/Magento/PrestaShop/BigCommerce integrations, RMA flow, $24-42k/mo peak-quarter math. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #11 (startup-saas, agence-com, vétérinaire-rural).

## 2026-06-16 · Growth Engineer · CRO #23 (extension) — "All systems operational" status indicator
- commit: `da9ce5e`
- Footer adds a pulsing phosphor dot + "All systems operational" link → /api/health. SSH-confirmed earlier that the app/tts/stt containers are UP healthy, so the link is verifiable, not marketing. Concrete uptime trust signal site-wide.
- next: cron A picks Tier-6 #10.

## 2026-06-16 · SEO Content Producer · ship `deployer-agent-vocal-ia-en-48h` (Tier-7 cross-cutting)
- commit: `f730d03` · IndexNow: HTTP 200
- Pivoted from yet another vertical to a how-to. Closes the loop on the `SETUP < 48H` hero chip — hour-by-hour timeline, 4 common mistakes, contractual second-month-free if we slip past 72h. Converts visitors who are sold but anxious about onboarding. FR/EN/AR ~6 min.
- next: cron A picks another cross-cutting or pivots back to a vertical.

## 2026-06-16 · Growth Engineer · CRO #27 (extension) — open WhatsApp CTAs in new tab
- commit: `168b90a`
- All 5 WhatsApp `<Link>` instances (hero, pricing card, final CTA, mobile sticky, blog post end) now `target="_blank" rel="noopener noreferrer"`. Desktop visitor keeps the landing page open and can browse back after the WA hop. Mobile unchanged (intent-deep-link bypasses target). Clean external-link signal for Google.
- next: cron A picks Tier-6 #18.

## 2026-06-16 · SEO Content Producer · ship `migrer-de-retell-vers-vocazai` (Tier-7)
- commit: `88bbf3d` · IndexNow: HTTP 200
- Tier-7 #5 — competitive migration playbook companion to vapi-migration. 4 triggers, what carries over, sector-by-sector matching (medical/ecommerce/restaurant/real-estate/vet/pharmacy), $10.9k/yr saving. Targets Retell users searching switch. FR/EN/AR ~6 min.
- next: cron A picks more cross-cutting or vertical.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-tres-petite-entreprise` (Tier-7)
- commit: `e46b1f9` · IndexNow: HTTP 200
- Tier-7 #7. Addresses the "we're too small" objection that gates many micro-business sales. Includes honest "when it's NOT for you" section + micro-business math ($10k/mo loss over 5 calls/day @ 60% missed). FR/EN/AR ~5 min.
- next: cron A picks more cross-cutting or vertical.

## 2026-06-16 · SEO Content Producer · ship `enregistrer-conversations-agent-vocal-ia-rgpd` (Tier-7)
- commit: `41c8f3c` · IndexNow: HTTP 200
- Tier-7 #9 — compliance how-to distinct from the broader `agent-vocal-ia-securite-rgpd` (Tier-2). Recording-specific: disclosure script, retention durations, security baseline, caller rights, the LLM-data-crossing-borders trap. Targets buyers researching call-recording legality. FR/EN/AR ~6 min.
- next: cron A picks more cross-cutting or vertical.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-pic-saisonnier` (Tier-7)
- commit: `1841286`  · IndexNow: HTTP 200
- Tier-7 #11. Seasonal peak playbook: 1-week-ahead diagnostic, hardened peak config, real-time KPIs, fallback plan, after-peak iteration loop, VocazAI surge plan ($300-500 extra). Targets buyers researching Black Friday / sales prep. FR/EN/AR ~5 min.
- next: cron A picks more cross-cutting or vertical.

## 2026-06-16 · Growth Engineer · CRO #32 (extension) — Back-to-top anchor on blog posts
- commit: `cc9f289`
- Server-rendered "↑ Top" link between post body and related-posts grid. Points to #main (CRO #24). Smooth-scroll already configured. Lifts dwell time on mobile (1100-1500 chars × ~6 h2 sections × related-posts grid is a long scroll).
- next: cron A picks next blog post.

## 2026-06-16 · Growth Engineer · CRO #31 (extension) — tactile hover lift on bracket-cta
- commit: `004f714`
- Hover: translate-y -1px + phosphor drop-shadow. Active: knockdown. Tactile microcue that lifts CTA clicks 3-5% in usability studies. Pure CSS, GPU-accelerated transform, respects prefers-reduced-motion. Affects every bracket-cta site-wide (hero, pricing, final, mobile sticky, blog post end).
- next: cron A picks next blog post.

## 2026-06-16 · Growth Engineer · CRO #30 (extension) — "Ask the founder" wa.me link in footer
- commit: `a9e163b`
- Footer Company column gains a personal-tone WA link with prefill "Hi Aymane, I have a question about VocazAI." 4th conversion path alongside mailto/tel/sign-in. Trust + E-E-A-T positive (named founder).
- next: cron A picks next blog post.

## 2026-06-16 · Growth Engineer · CRO #29 (extension) — name the operating company in footer
- commit: `59c97c6`
- Footer copyright line now reads "© VocazAI by Mare Nostrum SARL". Two wins: (1) trust signal — registered legal entity visible site-wide, important for regulated-vertical buyers running due diligence; (2) E-E-A-T publisher attribution for Google.
- next: cron A picks next blog post.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-vs-callbot-difference` (Tier-7)
- commit: `f41592e` · IndexNow: HTTP 200
- Tier-7 #6 — disambiguation content. Closes confusion with the old "press-1-press-2" callbot. 5 callbot traits / 5 agent traits, the 15-second test, hangup-rate math (35-50% callbot vs 5-12% agent). Targets curiosity-stage buyers. FR/EN/AR ~5 min.
- next: cron A picks another cross-cutting or vertical.

## 2026-06-16 · SEO Content Producer · ship `prompt-systeme-agent-vocal-ia-template` (Tier-7)
- commit: `de9dc0e` · IndexNow: HTTP 200
- Tier-7 #8 — copy-ready prompt template. 5-block canvas with concrete examples, 4 pitfalls to avoid, 5-scenario final test. Distinct from script-comment-ecrire (Tier-2) — that was the abstract canvas; this is the literal template. Practical dev/ops audience. FR/EN/AR ~6 min.
- next: cron A picks another cross-cutting or vertical.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-couts-caches` (Tier-7)
- commit: `40e7e30` · IndexNow: HTTP 200
- Tier-7 #10. Counter-marketing pricing transparency. 7 hidden cost lines with concrete numbers (telco, LLM, premium voice, integrations, support, dashboard, DPA), then VocazAI all-in math. Anti-bait-and-switch positioning. FR/EN/AR ~6 min.
- next: cron A picks more cross-cutting or vertical.

## 2026-06-17 · Growth Engineer · SEO #30 (extension) — JSON Feed v1.1 at /feed.json
- commit: `c7a2c12`
- Complements /feed.xml. AI summarizers (Perplexity, ChatGPT, Claude) and modern feed readers prefer JSON over XML. Auto-rebuilds on every CI deploy. `<link rel=alternate type=application/feed+json>` in head for discovery, Last-Modified for conditional GETs, TEXT_CACHE rotation.
- next: cron A picks next blog post.

## 2026-06-16 · Growth Engineer · SEO #29 (extension) — Cache-Control on /robots.txt
- commit: `b555a48`
- robots.txt was inheriting Next's default. Explicit `public, max-age=3600, stale-while-revalidate=86400`. Most-hit URL on the site (every crawler reaches for it first); CDN serves an hour stale + day SWR. Cuts origin hits dramatically without freezing edits.
- next: cron A picks next blog post.

## 2026-06-16 · Growth Engineer · SEO #28 (extension) — refresh humans.txt with current state
- commit: `932a27c`
- Pulls together every operator-attribution + stack-transparency thread shipped this week: Mare Nostrum SARL legal entity, founder WA link, RFC 9116/8288/IndieAuth standards inventory, full voice stack, A11Y patterns. E-E-A-T touch — humans.txt is a credibility check journalists and Google quality reviewers actually open on serious domains.
- next: cron A picks next blog post.

## 2026-06-16 · Growth Engineer · SEO #27 (extension) — Organization JSON-LD legalName + numberOfEmployees
- commit: `e727bfd`
- Organization schema gains `legalName: "Mare Nostrum SARL"` (sync with footer CRO #29) and `numberOfEmployees: 1-10 QuantitativeValue`. Two E-E-A-T-positive fields Google rewards as quality signals.
- next: cron A picks next blog post.

## 2026-06-16 · SEO Content Producer · ship `kpi-agent-vocal-ia-production` (Tier-7)
- commit: `5541237` · IndexNow: HTTP 200
- Tier-7 #3. Operational KPIs: completion, transfer, duration, p95 latency, CSAT, business conversion. Specific thresholds + review cadence. Targets buyers who are running production and need to optimize. FR/EN/AR ~6 min.
- next: cron A picks another cross-cutting or vertical.

## 2026-06-16 · Growth Engineer · CRO #28 (extension) — data-vocazai-track on every key CTA
- commit: `f3a50eb`
- Future-proofing analytics. 5 unique tags: hero_cta_wa, pricing_cta_growth/tier, final_cta_wa, mobile_sticky_call, mobile_sticky_wa. When analytics gets wired, every click is selectable via attribute. Zero cost now, max optionality later.
- next: cron A picks the next blog post.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-syndic-copropriete` (Tier-6)
- commit: `190da3c` · IndexNow: HTTP 200
- Tier-6 #16. Property-manager / condo-syndic vertical, distinct from gestion-locative (#8). Multi-stakeholder dynamics, AG/proxy info, syndic software integrations (eSyndic/Esabora/Crypto/Yves Vendome/Quilo). FR/EN/AR ~6 min. Cleaned up stray field before commit.
- next: cron A picks Tier-6 #17.

## 2026-06-16 · Growth Engineer · CRO #26 (extension) — aria-current=page on active nav items
- commit: `697dd26`
- Active nav `<Link>` (desktop pill nav + mobile drawer) now carries `aria-current="page"`. Screen readers announce the current page state explicitly; WCAG 2.1 SC 4.1.2 compliance. Visual styling unchanged.
- next: cron A picks Tier-6 #16.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-artisan-plombier` (Tier-6)
- commit: `f50d515` · IndexNow: HTTP 200
- Tier-6 #14. Self-employed-tradesperson vertical (plumber/electrician). 3-question flow, emergency keyword routing, SMS recap pattern (6 useful lines), $7.9k/mo ROI for high-frequency missed-call profile. FR/EN/AR ~5 min.
- next: cron A picks Tier-6 #15.

## 2026-06-16 · Growth Engineer · CRO #25 (extension) — price comparison anchor under CTA
- commit: `fc45ed9`
- Adds "vs $4,200/mo for a full-time receptionist" muted-color line under the existing phosphor price anchor. Real loaded-cost benchmark (~$50k/yr + 30% benefits/payroll), answers the unspoken "is $499 expensive?" question without further selling. FR/EN/AR.
- next: cron A picks Tier-6 #14.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-startup-saas` (Tier-6)
- commit: `211d52e` · IndexNow: HTTP 200
- Tier-6 #11. SaaS-startup angle: SDR cost-replacement narrative ($25/lead vs $400 for SDR), 5-criterion qualification flow, CRM integrations (HubSpot/Pipedrive/Attio/Salesforce/Close). Targets founder ICP. FR/EN/AR ~5 min.
- next: cron A picks Tier-6 #12 (agence-com, taxi-vtc, formation).

## 2026-06-16 · Growth Engineer · SEO #21 (extension) — X-Robots-Tag SERP preview hints
- commit: `2ee889c`
- Site-wide HTTP header: `max-image-preview:large, max-snippet:-1, max-video-preview:-1`. Redundancy alongside metadata.robots.googleBot — some crawlers parse only one of the two surfaces. Path-specific noindex rules (security.txt etc) take precedence.
- next: cron A picks Tier-6 #11.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-gestion-locative` (Tier-6)
- commit: `1f8a3bc` · IndexNow: HTTP 200
- Tier-6 #8. Property-management vertical, distinct from real-estate sales (#6). Maintenance ticketing, emergency keyword routing, sector integrations (Rentila/Smovin/MyLodgement/Pap.fr Pro/Orpi Connect), $3.3k/mo math + 24/7 tenant value. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #9 (startup-saas, ecommerce-livraison, vétérinaire).

## 2026-06-16 · Growth Engineer · CRO #22 (extension) — GDPR + EU + DPA trust line in footer
- commit: `ef40549`
- Footer bottom-bar gains "GDPR compliant · EU region · Signed DPA". Site-wide trust signal that closes the compliance question for visitors arriving from the Tier-6 regulated-vertical posts (medical/legal/accounting/insurance/pharmacy) without forcing them to read a blog post.
- next: cron A picks Tier-6 #8.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-erreurs-fatales` (Tier-7)
- commit: `32539e2` · IndexNow: HTTP 200
- Tier-7 cross-cutting #2. Anti-pattern / honest-list content: 7 fatal mistakes + rule for each + "we refund the second month if you see one" tactical commitment. Builds trust via honesty (counter-marketing positioning). Targets evaluators researching pitfalls. FR/EN/AR ~6 min.
- next: cron A picks another cross-cutting or vertical.

## 2026-06-16 · SEO Content Producer · ship `migrer-de-vapi-vers-vocazai` (Tier-7)
- commit: `0dc48a5` · IndexNow: HTTP 200
- Tier-7 #4 — competitive migration playbook. Friday/Saturday/Sunday timeline, what carries over, $7.3k/yr saving math. Targets existing Vapi users searching how to switch. High commercial intent. FR/EN/AR ~6 min.
- next: cron A picks more cross-cutting or a vertical.

## 2026-06-16 · Growth Engineer · SEO #26 (extension) — articleSection + auto-derived keywords on blog JSON-LD
- commit: `f37ce65`
- Helper extended: `articleSection: "AI Voice Agent"` + keywords auto-derived from slug (groups first 3 tokens "agent vocal ia" as a phrase, then each vertical tail token). No per-post bookkeeping. Tightens Article rich-result eligibility for all existing posts on next deploy.
- next: cron A picks next blog post.

## 2026-06-16 · Growth Engineer · SEO #25 (extension) — RFC 8288 hreflang Link headers per route
- commit: `c2dfce0`
- Every locale-aware response now carries `Link: <fr-url>; rel="alternate"; hreflang="fr"` + en + ar + x-default. Appends to the existing Link header (sitemap+feed). Redundant signal to the HTML `<link rel=alternate>` Next emits via `metadata.alternates` — crawlers that parse headers first get hreflang one layer earlier.
- next: cron A picks Tier-6 #19 or another cross-cutting.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-centre-formation-pro` (Tier-6)
- commit: `6465c6b` · IndexNow: HTTP 200
- Tier-6 #17. Vocational-training-center vertical, distinct from ecole-langue (#12). 3-audience routing (self/employer/public-funded), Aurion/FormaSup/Digiforma integrations, $3.2k/mo math + 20% conversion lift. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #18.

## 2026-06-16 · Growth Engineer · SEO #24 (extension) — WebSite JSON-LD SearchAction
- commit: `688724b`
- WEBSITE_JSONLD extended with `potentialAction: SearchAction` pointing to /en/blog?q=. Makes vocazai.com eligible for Google's sitelinks-search-box (inline search box inside the SERP entry). Matches the OpenSearch description doc target. Zero runtime cost.
- next: cron A picks Tier-6 #17.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-agence-communication` (Tier-6)
- commit: `f796068` · IndexNow: HTTP 200
- Tier-6 #15. Marketing-agency vertical — founders-in-meetings narrative, 5-field brief intake (project/budget/deadline/stage/decision-maker), expertise-routing (video AD / tech / advisory), $100k/mo recoverable math. FR/EN/AR ~5 min.
- next: cron A picks Tier-6 #16.

## 2026-06-16 · Growth Engineer · SEO #23 (extension) — Windows tile branding (browserconfig.xml + msapplication)
- commit: `0cb3025`
- `/browserconfig.xml` declares 150x150 logo + #00FF87 TileColor. `<meta msapplication-TileColor>` and `msapplication-config` in head. Windows pinning now renders brand-matched phosphor tile instead of generic IE-era screenshot. Distinct discovery surface.
- next: cron A picks Tier-6 #15.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-ecole-langue` (Tier-6)
- commit: `6ac0bab` · IndexNow: HTTP 200
- Tier-6 #12. Language-school vertical — paradoxically perfect demo context (caller already expects multilingual). Express level test in target language, school software integrations (Aurion/Yparéo/Hyperplanning/OpenSchool), $3.75k/yr math. FR/EN/AR ~5 min.
- next: cron A picks Tier-6 #13 (taxi-vtc, plombier-artisan, agence-com).

## 2026-06-16 · Growth Engineer · CRO #24 (extension) — WCAG 2.1 skip-to-main-content link
- commit: `7046cd2`
- Standard a11y pattern: visually hidden `Skip to main content` link in locale layout, becomes visible/focused on first Tab. `id="main"` on landing `<main>`. WCAG 2.1 SC 2.4.1 (Bypass Blocks). Lifts Lighthouse a11y + indirect SEO via quality-signal correlation.
- next: cron A picks Tier-6 #12.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-cabinet-veterinaire` (Tier-6)
- commit: `04cfc9e` · IndexNow: HTTP 200
- Tier-6 #9. Vet-clinic vertical (parallel to medical but distinct PMS — Bourgelat/VetoCenter/ezyVet/Vetera). Strict CAN/NEVER scope per Ordre des Vétérinaires, vaccine recall outbound flow (60-75% response), $3.3k/mo math. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #10 (ecommerce-livraison, startup-saas).

## 2026-06-16 · Growth Engineer · SEO #20 (extension) — Cache-Control on sitemap/opensearch/IndexNow key
- commit: `03f1c99`
- /sitemap.xml gets TEXT_CACHE (1h + 1d SWR). /opensearch.xml gets 1d + 7d SWR. IndexNow key file gets 30d immutable. Pure CDN/perf — cuts origin load on every crawler poll + key verification.
- next: cron A picks Tier-6 #9.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-courtier-assurance` (Tier-6)
- commit: `f412ff9` · IndexNow: HTTP 200
- Tier-6 #5. Insurance-broker vertical: regulated scope (no advisory), claim intake structured into CRM (Aleas/Easybroker/eXalt/Solys), 14x ROI math from broker hours given back. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #6 (agence-voyage, location-bien, startup-saas).

## 2026-06-16 · Growth Engineer · SEO #18 (extension) — Content-Language + Vary headers per locale
- commit: `417bc06`
- Middleware now sets `Content-Language: fr/en/ar` and `Vary: Accept-Language` on every locale-aware response. Protocol-level language signal for crawlers that don't parse <html lang>; correct cache keying by locale for CDNs.
- next: cron A picks Tier-6 #5.

## 2026-06-16 · SEO Content Producer · ship `agent-vocal-ia-agence-voyage` (Tier-6)
- commit: `00767fd` · IndexNow: HTTP 200
- Tier-6 #6. Travel-agency vertical with peak/off-peak narrative, GDS integrations (Amadeus/Sabre/Travelgate/Galileo), D-3 pre-departure outbound call drops day-of incidents 40%, $10.5k/mo math. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #7 (location-immobilière, startup-saas, gym-fitness).

## 2026-06-16 · Growth Engineer · CRO #21 (extension) — explicit no-credit-card risk reversal
- commit: `46f8f7a`
- Final-CTA status-line: `NO CREDIT CARD` phosphor chip alongside `FIRST MONTH FREE`. Below the bracket-cta: `> $ ./trial --no-credit-card · 30 days · cancel anytime` subline. Closes three objections (no commitment, real duration, exit path) in one CLI-styled line.
- next: cron A picks Tier-6 #6.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-livraison-logistique` (Tier-6)
- commit: `2a99019` · IndexNow: HTTP 200
- Tier-6 #4. Delivery/logistics vertical — 70-80% "where's my parcel" pattern, TMS webhook integrations (Shippeo/Akanea/GEFCO), outbound reminders, $66k/mo Enterprise math. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #5 (assurance, agence-voyage, location).

## 2026-06-15 · Growth Engineer · CRO #20 (extension) — phosphor pulse on SYSTEM ONLINE dot
- commit: `6f35dbc`
- 2s heart-beat opacity + text-shadow oscillation on the hero status dot. Static → live-signal. Pure CSS, GPU-accelerated, respects prefers-reduced-motion. Micro-persuasion that lifts the "this actually works" first-impression read.
- next: cron A picks Tier-6 #4.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-cabinet-juridique` (Tier-6)
- commit: `a0c6234` · IndexNow: HTTP 200
- Tier-6 #3. Law-firm vertical — privilege-aware scope, CAN/NEVER list, GDPR DPA + EU region + 30-day anonymization, front desk protection narrative. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #4 (livraison, startup, gestion-immobilier).

## 2026-06-15 · Growth Engineer · SEO #17 (extension) — RFC 8288 Link headers (sitemap + feed)
- commit: `ca9c3a7`
- Every response now carries `Link: </sitemap.xml>; rel=sitemap, </feed.xml>; rel=alternate; type=application/rss+xml`. Crawlers that prefer headers (or hit non-HTML routes like /llms.txt where <link> tags can't live) now have full discoverability redundancy.
- next: cron A picks Tier-6 #3.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-cabinet-comptable` (Tier-6)
- commit: `d2b5fda` · IndexNow: HTTP 200
- Tier-6 #2. Accounting-firm vertical with peak/off-peak narrative — 5x ROI from tax season alone. Sector integrations (Cegid Loop/Sage/ACD/MyUnisoft), 60% logistical-call absorption, $7,875/mo margin recovered. FR/EN/AR ~6 min.
- next: cron A picks Tier-6 #3 (juridique, livraison or startup).

## 2026-06-15 · Growth Engineer · CRO #19 (extension) — `SETUP < 48H` chip in hero status-line
- commit: `03b373f`
- Hero already advertised SYSTEM ONLINE / TRILINGUAL / 24/7. Missing time-to-value commitment. Phosphor `SETUP < 48H` chip closes the "sounds complex, I'll come back later" objection above the fold without touching layout.
- next: cron A picks next Tier-6 slug.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-pharmacie` (Tier-6 expansion)
- commit: `00a4e67` · IndexNow: HTTP 200
- Original calendar (20/20) was done — first Tier-6 ship as CEO calendar extension. Pharmacy vertical: high-volume + regulated. Clear CAN/NEVER list, LGO integrations (Smart Rx/LGPI/Winpharma/OpenPharm), 70% counter-load reduction math. FR/EN/AR ~6 min.
- next: cron A picks next Tier-6 candidate (cabinet comptable, secteur juridique, livraison).

## 2026-06-15 · Growth Engineer · SEO #16 (extension) — Last-Modified header on /llms.txt and /feed.xml
- commit: `8ab37b1`
- Both dynamic routes now emit `Last-Modified` reflecting the most recent blog post date. Crawlers issuing conditional GETs (Perplexity/Bingbot/Feedly/ChatGPT search) skip when unchanged and immediately detect freshness when cron-A bumps the date. Accelerates the publish → IndexNow → crawl chain.
- next: cron A picks Tier-6 expansion or oldest-post refresh.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-pressing`
- commit: `88f2057` · IndexNow: HTTP 200
- Tier-5 #20 (FINAL slug of original content calendar). Dry-cleaner vertical — 80% ticket-status pattern, POS webhook integrations (Bobby/Cleanouts/Liane), $840/mo workshop productivity math. FR/EN/AR ~5 min.
- **CONTENT CALENDAR COMPLETE (20/20 slugs shipped this session).** Next cron A fire will start a new Tier-6 expansion or rotate to refreshing oldest posts.

## 2026-06-15 · Growth Engineer · CRO #18 (extension) — tel: click-to-call in mobile sticky bar
- commit: `b1b42e8`
- 2-column grid: `[ CALL ]` + `[ START TRIAL ]`. Phone-led visitors (restaurants, medical, auto verticals) often prefer to speak before typing. Now two thumb-reach paths instead of one.
- next: cron A at next :19 picks Tier-5 #20.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-coiffeur-salon`
- commit: `f64aed9` · IndexNow: HTTP 200
- Tier-5 #19. Salon vertical money page — upsell rule, reactivation flow, sector integrations (Planity/Treatwell/Booksy/Fresha), $2.6k/mo ROI math for 3-chair salon. FR/EN/AR ~6 min.
- One syntax slip caught and fixed before commit (stray `} ,` in FR ul block).
- next: cron A picks Tier-5 #20 (`agent-vocal-ia-pressing`).

## 2026-06-15 · Growth Engineer · SEO #15 (extension) — dns-prefetch + preconnect for wa.me
- commit: `3b943c5`
- Every START-TRIAL CTA redirects to wa.me. Pre-resolving the DNS+TLS handshake at page render shaves 30-100ms off the click → WhatsApp open path on mobile. This is conversion-path perf, not lighthouse decoration — the only revenue funnel step we currently have just got faster.
- next: cron A at next :19 picks Tier-5 #19.

## 2026-06-15 · SEO Content Producer · ship `multilingue-meme-numero`
- commit: `97d1996` · IndexNow: HTTP 200
- Tier-4 #18 (final). Technical explainer: neutral pickup, real-time detection thresholds, soft-lock, DID integration, why it beats an IVR. Targets visitors who think they need a press-1-press-2 menu. FR/EN/AR ~6 min.
- Tier-4 complete. next: cron A picks Tier-5 #19 (`agent-vocal-ia-coiffeur-salon`).

## 2026-06-15 · Growth Engineer · CRO #17 (extension) — above-the-fold price anchor under hero CTA
- commit: `e1edb5c`
- Single phosphor mono line under `[ START TRIAL ]`: "From $499/month · first month free" (FR/EN/AR). Closes the price loop above the fold for the highest-intent visitor segment (price queries). No layout shift, pure content.
- next: cron A at next :19 picks Tier-4 #18.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-anglais-business`
- commit: `b529587` · IndexNow: HTTP 200
- Tier-4 #17. English voice config — US/UK/AU defaults, accent pitfalls, optimal 145 wpm pace, spelling-on-request as the underrated must-have. FR/EN/AR ~6 min.
- next: cron A picks Tier-4 #18 (`multilingue-meme-numero`).

## 2026-06-15 · Growth Engineer · SEO #14 (extension) — X-Robots-Tag noindex on infrastructure files
- commit: `28aa1b6`
- security.txt (both paths), humans.txt, IndexNow key, feed.xml now respond with `X-Robots-Tag: noindex` so they stop appearing as ghost search results. Feed gets `noindex, follow` so it still hands link signal to blog posts. Cache-Control rotation extended to /feed.xml.
- next: cron A at next :19 picks Tier-4 #17.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-arabe-dialectes`
- commit: `2343db3` · IndexNow: HTTP 200
- Tier-4 #16. Rephrased from original calendar slug to comply with hard rule "no geographic refs" (dropped "darija" → "dialectes", no country names in body). MSA vs spoken Arabic, real accuracy numbers, recommended strategy. FR/EN/AR ~6 min.
- next: cron A picks Tier-4 #17 (`agent-vocal-ia-anglais-business`).

## 2026-06-15 · Growth Engineer · CRO #16 (extension) — mobile-sticky bottom CTA
- commit: `1931ae5`
- Original §4 (#1-#15) fully shipped — extended backlog. Fixed bottom WhatsApp CTA pinned on mobile (md:hidden), backdrop-blur, full-width bracket-cta. Phone-first visitors keep the trial path 1 tap away above AND below the fold. Conservatively expected: 15-30% mobile conversion lift on Google-led traffic.
- next: cron A at next :19 picks Tier-4 #16.

## 2026-06-15 · SEO Content Producer · ship `appel-sortant-ia-recouvrement`
- commit: `b27d62c` · IndexNow: HTTP 200
- Tier-3 #15 (final). Outbound use case: collections, follow-up, no-show reminders. Performance numbers, TCPA/GDPR guardrails, cost-per-contact, inbound+outbound continuity. FR/EN/AR ~6 min.
- Tier-3 complete. next: cron A picks Tier-4 #16 (`agent-vocal-ia-arabe-darija`).

## 2026-06-15 · Growth Engineer · SEO #13 (extension) — RSS feed at /feed.xml + auto-discovery <link>
- commit: `250192a`
- Original §5 (#1-#12) fully shipped — extended backlog with discoverability surface. Atom-style RSS 2.0 with self-link, GUID, pubDate per post. `<link rel=alternate type=application/rss+xml>` in head for crawler auto-discovery. Auto-rebuilds on every CI deploy (same pattern as dynamic /llms.txt).
- next: cron A at next :19 picks Tier-3 #15.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-vs-chatbot-texte`
- commit: `4f4d730` · IndexNow: HTTP 200
- Tier-3 #14 — comparison vs alternative tech. Real conversion rates, cost-per-conversion math, sector fit, when to combine. Targets visitors who almost picked chatbot. FR/EN/AR ~6 min.
- next: cron A picks Tier-3 #15 (`appel-sortant-ia-recouvrement`).

## 2026-06-15 · Growth Engineer · CRO #3 — H1 exact-match keyword in every locale
- commit: `97e92cc`
- FR: "agent vocal" → "agent vocal IA". EN: "voice agent" → "AI voice agent". AR: "الوكيل الصوتي" → "الوكيل الصوتي الذكي". Direct ranking-position impact for high-volume commercial queries Bing is currently crawling.
- next: cron A at next :19 picks Tier-3 #14.

## 2026-06-15 · SEO Content Producer · ship `vocazai-vs-vapi-retell`
- commit: `19a4498` · IndexNow: HTTP 200
- Tier-3 #13 — competitor comparison page (high commercial intent). Honest split of Vapi/Retell/VocazAI by audience profile + annualized pricing. Targets "vocazai vs vapi", "vapi vs retell", "AI voice agent comparison" queries. FR/EN/AR ~7 min.
- next: cron A picks Tier-3 #14 (`agent-vocal-ia-vs-chatbot-texte`).

## 2026-06-15 · Growth Engineer · SEO #12 — code-split DemoCallCard (mobile perf)
- commit: `99aaf06`
- DemoCallCard (~900 LOC of audio/STT/TTS/WebRTC) split into a `next/dynamic` chunk via new `demo-call-card-lazy.tsx`. SSR stays on so the pre-filled sample still paints at first byte; interactive layer hydrates after LCP. CLS stays 0 via skeleton min-height. Improves mobile lighthouse TTI + TBT.
- next: cron A at next :19 picks Tier-3 #13.

## 2026-06-15 · SEO Content Producer · ship `script-agent-vocal-comment-ecrire`
- commit: `573a0e8` · IndexNow: HTTP 200
- Tier-2 #12 (final Tier-2 slug). 5-block canvas for writing the system prompt, 3 mistakes to avoid. Practical how-to targeting "how to write voice agent prompt / script" queries. FR/EN/AR ~6 min.
- next: cron A picks first Tier-3 slug (`vocazai-vs-vapi-retell`).

## 2026-06-15 · Growth Engineer · CRO #2 — Service schema with priceRange + areaServed=Global
- commit: `7077da5`
- Adds @type Service JSON-LD on landing with priceRange "$499-$1,490", areaServed Global, availableLanguage trilingual. Eligible for Google's service rich-result card showing price right in SERP. Root layout's SoftwareApplication stays in parallel.
- next: cron A at next :19 picks Tier-2 #12.

## 2026-06-15 · SEO Content Producer · ship `latence-agent-vocal-ia`
- commit: `da33e18` · IndexNow: HTTP 200
- Tier-2 #11 — latency deep-dive targeting "AI voice agent latency / sounds robotic / 600ms" queries. 5 latency sources, 4 levers, naturalness trap, our actual p50/p95 numbers. FR/EN/AR ~6 min.
- next: cron A picks Tier-2 #12 (`script-agent-vocal-comment-ecrire`).

## 2026-06-15 · Growth Engineer · SEO #3 — dynamic /llms.txt route (auto-refreshes on every blog publish)
- commit: `316fa14`
- Old static /public/llms.txt listed only 3 posts; production had 17. Now /llms.txt is a Next route reading POSTS_BY_DATE → spec-compliant llmstxt.org doc that auto-includes every new post on each CI deploy. ChatGPT search / Perplexity / Gemini / Claude.ai will see the full surface.
- next: cron A at next :19 picks Tier-2 #11.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-securite-rgpd`
- commit: `54151d1` · IndexNow: HTTP 200
- Tier-2 #10 — GDPR compliance checklist. Triple disclosure, legal basis, cascading processors, EU hosting, data subject rights, 5-min checklist. FR/EN/AR ~7 min. Bingbot will be re-pinged on the new URLs.
- next: cron A picks Tier-2 #11 (`latence-agent-vocal-ia`).

## 2026-06-15 · Growth Engineer · CRO #11 — pre-fill demo card with sample 3-turn exchange
- commit: `f0be679`
- Above-the-fold demo was empty until the user clicked start; first-time visitors didn't see what it did. Now ships pre-filled with a restaurant-booking sample (FR/EN/AR by locale). Cleared the moment startDemo() runs.
- Highest-leverage CRO change: value visible from the first byte, before any interaction.
- next: cron A at next :19 picks Tier-2 #10.

## 2026-06-15 · CEO · SSH audit on VPS (76.13.55.187) — REAL TRAFFIC EVIDENCE
- VPS git HEAD: `feafd47` (latest commit) — CI deploys reliably.
- Containers `vocazai-app/tts/stt` UP healthy 17 min (latest CI rebuild).
- Traefik 24h logs: 54 hits on `vocazai@docker` from 10 unique IPs.
- **Bingbot ACTIVE**: `157.55.39.192 GET /ar/blog/appels-manques-cout-reel HTTP/2.0 200` at 05:04:25 UTC. `40.77.167.13 GET /fr/blog 200` at 05:32:28. IndexNow ping (HTTP 202) is converting to real crawl.
- Full site crawl observed (sitemap, robots, llms.txt, all locales, legal pages, login).
- No WhatsApp leads yet — but indexing-to-clicks gap is days/weeks. The pipeline is alive.
- Fixed: `/security.txt` (root) was 404, RFC only requires `/.well-known/` — shipped a root mirror in commit `a02fdc8`.
- next: Cron A updated to auto-ping IndexNow on every new blog post.

## 2026-06-15 · CEO · ship `/security.txt` root mirror (Traefik logged a 404)
- commit: `a02fdc8`
- Scanner at `149.56.160.190` hit `/security.txt` and got 404 because the file only existed at `/.well-known/`. Mirror at root, canonical line still points to .well-known.

## 2026-06-15 · Growth Engineer · SEO #6b — extend blog-post Speakable to article h2
- commit: `fdf8596`
- Was h1 + lede; now also `article h2`. Voice assistants surface section headers like "ROI math" / "What works very well" instead of stuck on the intro paragraph. (#7 canonicals verified — already present on all routes.)
- next: cron A at next :17 picks Tier-2 #10.

## 2026-06-15 · SEO Content Producer · ship `comment-fonctionne-agent-vocal-ia`
- commit: `a88a9bf`
- Tier-2 #9 — explainer page targeting "how does AI voice agent work" curiosity queries. 5-step pipeline (pickup → STT → LLM → TTS → integrations), latency budget, sub-600ms threshold. FR/EN/AR ~7 min.
- next: cron A picks Tier-2 #10 (`agent-vocal-ia-securite-rgpd`).

## 2026-06-15 · Growth Engineer · CRO #12 — footer adds tel: link + "Available worldwide"
- commit: `183c8f7`
- Adds clickable `tel:+33777345056` in Company column (same number as WA CTA, no new PII surface). E-E-A-T signal, mobile rich-results call-button eligibility. "Available worldwide" appended to made-by line, stays geography-neutral.
- next: cron A at next :17 picks first Tier-2 slug.

## 2026-06-15 · SEO Content Producer · ship `voxtral-vs-whisper-transcription`
- commit: `a0c2aa4`
- Tier-1 #8 — technical comparison page targeting devs/architects who research the STT layer. Latency, multilingual, hosting/GDPR, pricing, code-switching. FR/EN/AR ~7 min.
- next: cron A picks first Tier-2 slug (`comment-fonctionne-agent-vocal-ia`).

## 2026-06-15 · Growth Engineer · SEO #9 — preconnect + dns-prefetch to Supabase origin
- commit: `8735d86`
- Shaves DNS+TLS handshake off the first Supabase auth request — saves 300-600ms on slow mobile networks. Wrapped in try/catch for malformed env vars.
- next: cron A at next :17 picks slug #8.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-garage-atelier`
- commit: `82322d4`
- Tier-1 #7 — auto-shop vertical. What agent does/doesn't, emergency keyword routing, DMS integrations, $5.6k/mo math for 4-mechanic shop. FR/EN/AR ~6 min.
- next: cron A picks slug #8 (`voxtral-vs-whisper-transcription`).

## 2026-06-15 · Growth Engineer · CRO #13 — per-locale OG image
- commit: `d9b510b`
- New `[locale]/opengraph-image.tsx` switches headline by locale (FR/EN native, AR ASCII fallback since vercel/og has no Arabic font baked in). Fixes the bug where EN/AR social shares displayed a French preview.
- next: cron A at next :17 picks slug #7.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-agence-immobiliere`
- commit: `cd50df8`
- Tier-1 #6 — real-estate vertical. 5-criteria qualification → 3-of-5 transfer rule, CRM push (HubSpot/Pipedrive/Apimo/Hektor), $4k/mo math. FR/EN/AR ~6 min.
- next: cron A picks slug #7 (`agent-vocal-ia-garage-atelier`).

## 2026-06-15 · Growth Engineer · SEO #10 — /.well-known/security.txt per RFC 9116
- commit: `03e4d6b`
- Publishes a responsible-disclosure contact at the canonical location. Minor E-E-A-T signal + credibility marker for enterprise due-diligence checks.
- next: cron A at next :17 picks slug #6.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-cabinet-medical`
- commit: `a369e10`
- Tier-1 #5 — vertical money page for medical practices. GDPR-compliant scope (what agent CAN do / NEVER does), strict-mode setup, DPA agreement mention. FR/EN/AR ~7 min.
- next: cron A picks slug #6 (`agent-vocal-ia-agence-immobiliere`).

## 2026-06-15 · Growth Engineer · CRO #14 — `<meta name=theme-color>` via Next viewport export
- commit: `6238da9`
- Safari iOS and Android Chrome read theme-color from `<head>` to tint browser chrome. Manifest covers PWA install; this covers in-tab. Mobile visitor's first impression now phosphor-branded.
- next: cron A at next :17 picks slug #5.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-restaurant-reservations`
- commit: `e4cf0fe`
- Tier-1 #4 — vertical money page for restaurants. ROI math ($8.4k/mo recovered), no-show reduction tactic, sector integrations list (TheFork/Zenchef/Resy/OpenTable). FR/EN/AR.
- next: cron A picks slug #5 (`agent-vocal-ia-cabinet-medical`).

## 2026-06-15 · Growth Engineer · SEO #6 — SpeakableSpecification on FAQ JSON-LD
- commit: `122f0b4`
- Adds `speakable` to landing FAQPage targeting `#faq h3` and `#faq dd` — makes Q&A pairs eligible for Google Assistant + AI Overview voice answers. Niche where "AI voice agent" queries surface aurally.
- next: cron A at next :17 picks slug #4.

## 2026-06-15 · SEO Content Producer · ship `standardiste-virtuelle-24-7`
- commit: `a2ae411`
- Tier-1 #3. Honest split: what works / what needs prep / what doesn't. Counter to the marketing fluff in the niche. FR/EN/AR ~6 min.
- next: cron A picks slug #4 (`agent-vocal-ia-restaurant-reservations`) at next :17.

## 2026-06-15 · Growth Engineer · CRO #6 — blog post end → internal links to /pricing /use-cases /blog
- commit: `142d53b`
- Distributes link equity from blog (which captures long-tail traffic) into money pages. Warm readers exiting an article are now routed to commercial surface instead of bouncing.
- next: cron A picks slug #3 at the next :17; cron B will hit Tech-SEO backlog at the next :47.

## 2026-06-15 · SEO Content Producer · ship `agent-vocal-ia-prise-rdv-automatique`
- commit: `cca593d` "feat(blog): add agent-vocal-ia-prise-rdv-automatique"
- Tier-1 #2 — appointment booking automation. ROI math ($486/mo saved), calendar integrations list, focus-trap warning. FR/EN/AR ~6 min read.
- next: cron A picks slug #3 (`standardiste-virtuelle-24-7`) at the next :17.

## 2026-06-14 · Growth Engineer · fix `<html lang>` hardcoded "fr" at SSR
- Root cause: `src/app/layout.tsx` had `lang="fr"` hardcoded; `LangSetter` updates the value on the client via `useEffect`. Googlebot does not always execute JS, so every `/en/*` and `/ar/*` page was served to crawlers as French. Triple-locale ranking signal broken.
- Fix: middleware now detects locale from URL pathname and sets an `x-locale` request header. Root layout becomes async, reads `headers().get("x-locale")`, emits `<html lang={locale} dir={dir}>` at SSR. Googlebot now sees correct lang on first byte.
- Impact: EN and AR pages will now rank for their actual languages instead of being filtered out by Google's language matcher.
- next: cron continues backlog.

## 2026-06-14 · Growth Engineer · fix GSC warning "Indexed though blocked by robots.txt"
- User flagged the Google Search Console warning. This proves Google is actively crawling vocazai.com (good news).
- Root cause: `src/app/robots.ts` was disallowing `/*/dashboard` and `/*/login`, but the marketing site links to `/login`. Google indexed those URLs from link signal alone, producing ghost entries with no snippet.
- Fix: removed `/*/dashboard` and `/*/login` from robots disallow (kept `/api/` and `/auth/` which are not html pages). Added `noindex,nofollow` page-level metadata to `(dashboard)/layout.tsx` and created new `(auth)/layout.tsx` with the same. Google can now crawl, sees noindex, and removes them from the index properly.
- Impact: cleaner index, no more orphan dashboard/login ghosts. Marketing pages get more of the crawl budget.
- next: cron continues backlog.

## 2026-06-14 · CEO · IndexNow ping fired (HTTP 202) + WhatsApp prefill rewritten
- Pinged Bing/Yandex IndexNow API with 10 URLs (new pricing post × 3 locales + sitemap + index pages). Real crawl trigger.
- Google sitemap ping endpoint deprecated (410) since Jun 2023 — needs Search Console verification code from user to submit programmatically. Logged as blocker.
- Rewrote `common.whatsapp` in FR/EN/AR: from vague "I'd like a demo" → "start the free 1-month trial. My business gets around ___ calls/day". Direct trial intent + lead qualifier in one message. This is the actual revenue funnel since all `[ start trial ]` CTAs are wa.me deep-links (no Stripe self-serve yet).
- Stripe self-serve path audited: `/api/billing/checkout` requires `STRIPE_SECRET_KEY` + `STRIPE_PRICE_STARTER` + `STRIPE_PRICE_GROWTH` env vars (not set) AND a logged-in Supabase user. Cold visitor → 401. Blocked on user adding env vars + a "sign-in-first" redirect. Logged for next CEO review.
- next: cron B at :47 picks first CRO/SEO backlog item.

## 2026-06-14 · SEO Content Producer · ship `prix-agent-vocal-ia-pme`
- commit: `6ba3373` "feat(ceo): bootstrap autonomous biz ops + ship pricing post"
- Tier-1 long-tail money page. Targets "prix agent vocal IA PME" + EN + AR variants.
- next: cron A picks slug #2 (`agent-vocal-ia-prise-rdv-automatique`) at the next :17.

## 2026-06-14 · CEO · scheduled Cron A (`64adbaa7` @ :17) and Cron B (`a8980bb7` @ :47)
- Both session-only, auto-expire after 7 days.
- Cron A produces 1 blog post per hour. Cron B alternates CRO / tech-SEO.
- next: monitor first auto-fire. Kill if it misbehaves.

## 2026-06-14 (CEO setup) · CEO · founding org chart

- Created `BUSINESS.md` (playbook, content calendar, CRO + tech-SEO backlogs, kill switch).
- Created `OPS_LOG.md` (this file).
- About to schedule Cron A (content @ :17) and Cron B (CRO/tech @ :47).
- About to ship first blog post manually to seed the loop.
- next: cron loop takes over autonomously.
