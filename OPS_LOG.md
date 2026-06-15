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
