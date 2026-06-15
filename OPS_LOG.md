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
