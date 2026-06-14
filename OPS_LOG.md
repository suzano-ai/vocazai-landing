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
