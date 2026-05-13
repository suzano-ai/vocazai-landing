# Architecture VocazAI

## Principes directeurs

1. **Pas de vendor lock-in** : tout passe par `IVoiceProvider`. Switcher de Vapi à Retell (ou ajouter LiveKit) = quelques heures.
2. **Multi-tenant strict** : isolation au niveau Postgres via RLS.
3. **Tout traçable** : chaque webhook reçu est persisté brut (`webhook_events`).
4. **i18n first-class** : fr/en/ar livrés dès jour 1, RTL fonctionnel.
5. **Light + Dark natifs** : design tokens HSL, switch sans rechargement.
6. **Design Maroc-tech** : emerald + saffron + terracotta, motifs zellige, identité culturelle assumée.

## Schéma DB (résumé)

```
organizations ──< organization_members >── auth.users
       │
       ├──< agents (provider, prompt, voice, llm, transcriber)
       │       └──< phone_numbers
       ├──< contacts ──< campaign_contacts >──< campaigns
       └──< calls ──< call_transcripts
                │
                └── webhook_events (audit, RLS-denied)
```

Voir [`src/db/migrations/0001_initial.sql`](../src/db/migrations/0001_initial.sql).

## Flux inbound

```
PSTN ──► Vapi/Retell ──► STT ──► LLM ──► TTS
                  │
                  ├─► POST /api/webhooks/{provider}
                  │      ├─ verify HMAC
                  │      ├─ insert webhook_events (raw)
                  │      ├─ upsert calls
                  │      └─ append call_transcripts
                  │
                  └─► tools mid-call → endpoints custom (RDV, CRM)
```

## Flux outbound

```
Dashboard: campaign + import CSV → contacts + campaign_contacts (pending)
   │
   ▼
Cron Render /api/cron/dial (cron-job.org ou Render Cron)
   │  - sélectionne contacts éligibles (horaires, daily_cap, retry)
   │  - getProvider(agent.provider).startOutboundCall(...)
   │
   ▼ Provider effectue l'appel
   │
   ▼ Webhook call.ended → campaign_contacts.status mis à jour
```

## Sécurité

- **Auth** : magic link Supabase, pas de mot de passe stocké
- **RLS** : toutes les tables métier ont des policies via `user_organizations()`
- **webhook_events** : RLS deny-all, service role uniquement
- **Webhooks** : signature HMAC-SHA256 vérifiée systématiquement
- **Secrets** : `.env*` gitignored, Render env vars en prod

## Performance

- Edge middleware pour auth refresh + locale routing
- Server Components pour les pages dashboard
- Webhooks : Node runtime, idempotents (clé unique `provider + provider_call_id`)
- Polices via `next/font/google` (auto-hosted, zero CLS)

## Décisions clés

| Décision | Alternative | Pourquoi rejetée |
|---|---|---|
| Render | Vercel | Render déjà connecté + budget prévisible |
| Supabase | Firebase/Neon+Clerk | Auth + Postgres + RLS dans un service |
| next-intl | next-i18next | Mieux supporté pour App Router |
| Tailwind + tokens HSL | CSS Modules / styled-components | Light/dark sans dupliquer du code |
| Zellige SVG inline | Images PNG | Léger, scalable, pas de requête réseau |
| Multi-provider | Vendor unique | Évite le lock-in, leverage négociation tarifs |

## Roadmap (post-foundation)

- Wizard de création d'agent (form complet avec test live)
- Widget de test web call (Vapi Web SDK)
- Worker outbound campaigns (Render Cron + queue)
- Analytics dashboard (Chart.js)
- Stripe billing + quotas
- WhatsApp Business agent (extension du concept)
