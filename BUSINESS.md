# VocazAI — Business Playbook (CEO: Claude)
> Source of truth read by every cron fire. Update this when strategy pivots, not the cron prompts.
> Last revised: 2026-06-14

---

## 0. Mandate

CEO of VocazAI. Sole acquisition channel: **Google** (organic SEO + JSON-LD + AI Overview surfaces).
No paid ads (no budget). No outbound. No social. Every cron-fire output must move one of the three KPIs below.

## 1. KPIs (in priority order)

1. **Indexable URLs** in `/sitemap.xml` — proxy for surface area in Google.
2. **Sitewide lighthouse-perf** (mobile) — proxy for ranking signal weight.
3. **Conversion events on `/[locale]`** — `[ start trial ]` CTA clicks. Counted by upstream Vercel/Plausible if present, otherwise inferred from `signups` row count once Supabase is live.

We do not yet have analytics wired. So crons optimize for **#1 and #2 unconditionally**, and ship CRO changes that are *directionally* defensible without A/B data (proven landing patterns, schema markup, copy clarity).

## 2. Org chart (subagent roles, all invoked by crons)

| Role | Cron | Cadence | Deliverable per fire |
|---|---|---|---|
| **SEO Content Producer** | A | every 1h @ :17 | One new blog post in `src/content/blog/posts.ts` (FR/EN/AR), commit + push |
| **Growth Engineer** | B | every 1h @ :47 | Alternates: (B1) one landing CRO improvement OR (B2) one technical-SEO task. Commit + push |
| **CEO (this session)** | — | manual | Strategy, content calendar, kill-switch if a cron breaks something |

CI handles deploy on push to `main`. No cron pushes if `npm run build` fails.

## 3. Content calendar (priority queue — top of list = next to publish)

> Rule: pick next unwritten slug, write fr+en+ar, publish. Skip and pick next if slug already exists in posts.ts.

### Tier 1 — high-intent long-tail (publish first)
1. `prix-agent-vocal-ia-pme` — "Prix d'un agent vocal IA pour PME : grille complète 2026"
2. `agent-vocal-ia-prise-rdv-automatique` — "Agent vocal IA pour la prise de rendez-vous : ce qui change pour vos équipes"
3. `standardiste-virtuelle-24-7` — "Standardiste virtuelle 24/7 : ce qui marche, ce qui ne marche pas"
4. `agent-vocal-ia-restaurant-reservations` — "Agent vocal IA pour restaurant : réservations sans hôtesse"
5. `agent-vocal-ia-cabinet-medical` — "Agent vocal IA pour cabinet médical : confidentialité et conformité"
6. `agent-vocal-ia-agence-immobiliere` — "Agent vocal IA pour agence immobilière : qualifier les leads sans secrétaire"
7. `agent-vocal-ia-garage-atelier` — "Agent vocal IA pour garage : devis, RDV et urgences"
8. `voxtral-vs-whisper-transcription` — "Voxtral vs Whisper : quelle transcription pour un agent vocal multilingue"

### Tier 2 — explainer / awareness
9. `comment-fonctionne-agent-vocal-ia` — "Comment fonctionne un agent vocal IA : du décrochage au CRM"
10. `agent-vocal-ia-securite-rgpd` — "Agent vocal IA et RGPD : ce que vous devez savoir avant de déployer"
11. `latence-agent-vocal-ia` — "Latence et naturel d'un agent vocal IA : comment on descend sous 600ms"
12. `script-agent-vocal-comment-ecrire` — "Comment écrire le script de votre agent vocal IA en 30 minutes"

### Tier 3 — comparison / SEO money pages
13. `vocazai-vs-vapi-retell` — "VocazAI vs Vapi vs Retell : comparatif honnête pour PME"
14. `agent-vocal-ia-vs-chatbot-texte` — "Agent vocal IA vs chatbot texte : pourquoi l'oral convertit mieux"
15. `appel-sortant-ia-recouvrement` — "Appels sortants IA pour le recouvrement et la relance client"

### Tier 4 — local-language specific
16. `agent-vocal-ia-arabe-darija` — "Agent vocal IA en arabe et en darija : ce qu'il sait vraiment faire"
17. `agent-vocal-ia-anglais-business` — "AI voice agent for English-speaking customers — accent and clarity"
18. `multilingue-meme-numero` — "Un seul numéro, trois langues : comment ça marche techniquement"

### Tier 5 — vertical deepdives
19. `agent-vocal-ia-coiffeur-salon` — "Agent vocal IA pour salon de coiffure : RDV et upsell"
20. `agent-vocal-ia-pressing` — "Agent vocal IA pour pressing et services : suivi commande téléphonique"

## 4. CRO backlog (Growth Engineer cron B1 picks next)

> Each item is one ship. Do not bundle.

1. Add JSON-LD `FAQPage` to `/[locale]` if missing — answers from the `$ man vocazai` section.
2. Add `Service` schema with priceRange "$499–$1,490" + areaServed=global.
3. Above-the-fold: ensure H1 contains "agent vocal IA" exact phrase (fr) + "AI voice agent" (en) + "وكيل صوتي ذكي" (ar).
4. Add a "Trusted by" trust band — even with placeholders ("rejoignez X PME en essai") — needs concrete number; skip until we have one.
5. Add `<link rel="alternate" hreflang="x">` for every locale on every page (verify it's already there via Next-intl).
6. Add internal links: from each blog post end → /pricing + /use-cases + next blog post.
7. Inline FAQ accordion (open by default for first 3) — boosts FAQ schema impact.
8. Add `BreadcrumbList` JSON-LD to every secondary route.
9. CTA copy A/B (one-shot pick): "Démarrer l'essai gratuit" vs "Essayer en 2 minutes" → pick the one with measurable verb + time.
10. Add `loading="lazy"` and explicit `width/height` on every `<img>` (CLS).
11. Demo card: pre-fill the first user message with a real-sounding question so the value is obvious.
12. Footer: add city-agnostic "available worldwide" phrase + email + phone for E-E-A-T.
13. Open Graph image: make a per-locale variant (fr/en/ar headline).
14. Add `<meta name="theme-color">` to `<head>` (already in manifest but Safari reads it from `<head>`).
15. Author schema on blog posts (`author: { @type: Organization, name: VocazAI }` minimum).

## 5. Technical SEO backlog (Growth Engineer cron B2 picks next)

1. Ensure `sitemap.xml` includes every blog slug × every locale (`/fr/blog/[slug]`, `/en/...`, `/ar/...`).
2. Ensure `robots.txt` allows `/` and points to sitemap.
3. Build `llms.txt` if absent; refresh on every content addition.
4. Ping IndexNow (Bing + Yandex share endpoint) on every new blog publication.
5. Verify `<html lang>` is dynamic per locale (currently hardcoded `lang="fr"` in layout.tsx — fix).
6. Add `Speakable` schema spec to FAQ answers and blog `h2` blocks (boosts Google Assistant / AI Overview).
7. Verify canonical URLs across all locales — no duplicates.
8. Compress `/fonts/*.woff2` if any exceed 80KB (none currently expected).
9. Add `<link rel="preconnect">` to any 3rd-party origin still hit (Resend, Mistral, Supabase).
10. Generate a `humans.txt` and `security.txt` (minor E-E-A-T).
11. Add Article JSON-LD per blog post with `inLanguage`, `author`, `datePublished`, `dateModified`.
12. Verify mobile lighthouse > 90 on `/[locale]`, `/[locale]/pricing`, `/[locale]/blog`.

## 6. Hard rules (all crons MUST obey)

- **Never push a commit that breaks `npm run build`.** Always run it locally before `git push`.
- **Never deploy directly via SSH.** CI handles it on push to `main`.
- **Never touch `/api/*` route handlers** without a strong reason — they're production-critical.
- **Never modify `.env.local`** (it's in `.gitignore`).
- **Never write geographic positioning** in marketing copy (no "Maroc", "Casablanca", "Maghreb", "MENA", "darija"). The Arabic copy is in Moroccan dialect by convention, but we say "Arabic".
- **Always FR + EN + AR for blog posts.** A post in one language is incomplete and must not be merged.
- **Never use Date.now() / Math.random()** in committed code — use the existing ISO string convention.
- **Commit message convention:** `feat(blog): add <slug>` / `feat(seo): <description>` / `feat(cro): <description>`.
- **One deliverable per fire.** If you finish in 5 minutes, stop. Don't try to ship more.

## 7. Kill switch

If a cron starts misbehaving (loops, breaks build, pushes garbage), the user can:
1. Tell me to `CronList` then `CronDelete` the offending job ID.
2. Or just stop the session.

Crons are session-only — closing this REPL kills the entire org.

## 8. Long-term plan (week 1–4)

- **Week 1 (now):** ship Tier 1 + 2 content calendar (12 posts). Wire Article JSON-LD. Fix `<html lang>`. Run IndexNow on each publish.
- **Week 2:** ship Tier 3–5. Ship CRO backlog 1–8. First mobile lighthouse pass.
- **Week 3:** add 10 new article ideas to calendar based on Search Console queries (once user wires `GOOGLE_SITE_VERIFICATION`).
- **Week 4:** review traffic. Pivot content focus to whichever vertical is converting.

The CEO reviews this doc weekly. Crons read it every fire.
