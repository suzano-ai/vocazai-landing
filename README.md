# VocazAI

> Plateforme d'agents vocaux IA multi-provider (Vapi & Retell) avec dashboard client multi-tenant — pensée pour les PME marocaines, africaines et francophones.

## Stack

| Couche | Choix |
|---|---|
| Framework | Next.js 15 App Router + TypeScript |
| UI | Tailwind CSS + design system Maroc-tech + shadcn-ready |
| Mode | Light + Dark avec toggle (next-themes) |
| Fonts | Space Grotesk (display) + Inter (body) + Noto Sans Arabic |
| i18n | next-intl — fr · en · ar (avec RTL) |
| Auth | Supabase Auth (magic link) |
| DB | Supabase Postgres + Row Level Security (multi-tenant) |
| Voice providers | Vapi + Retell via `IVoiceProvider` |
| Déploiement | Render (Web Service Node) — `render.yaml` à la racine |

## Démarrage

```bash
npm install
cp .env.example .env.local
# remplir les clés (voir docs/SETUP.md)
npm run dev
```

→ http://localhost:3000

## Structure

```
.
├── render.yaml                 # Blueprint Render (build + start + env)
├── middleware.ts               # Auth Supabase + locale routing
├── i18n/                       # next-intl config
├── messages/                   # fr.json · en.json · ar.json
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx          # ThemeProvider + fonts + i18n
│   │   │   ├── page.tsx            # Landing redesignée Maroc-tech
│   │   │   ├── (auth)/login/       # Magic link
│   │   │   └── (dashboard)/        # Dashboard protégé
│   │   ├── api/webhooks/{vapi,retell}/route.ts
│   │   ├── auth/callback/route.ts
│   │   └── globals.css             # Design tokens (light/dark)
│   ├── components/
│   │   ├── landing/                # Header, LocaleSwitch
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   └── zellige.tsx             # SVG motifs marocains
│   ├── lib/
│   │   ├── providers/              # IVoiceProvider + Vapi + Retell
│   │   ├── supabase/               # Client / Server / Middleware
│   │   ├── webhooks/handler.ts
│   │   └── utils.ts
│   └── db/migrations/0001_initial.sql
└── docs/
    ├── ARCHITECTURE.md
    └── SETUP.md
```

## Design system

**Palette Maroc-tech** :

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--emerald-600` | `#047857` | `#10b981` | Primary (drapeau MA) |
| `--saffron-500` | `#D97706` | `#F59E0B` | Accent chaud |
| `--terracotta-500` | `#B45309` | `#EA580C` | Secondaire |
| `--bg` | `#FEFCF8` cream | `#0F1611` forêt nuit | Background |
| `--surface` | `#F7F2EA` sand | `#1A2419` | Surface |

**Typo** : Space Grotesk (display) + Inter (body) + Noto Sans Arabic (RTL auto-switch).

**Motifs** : étoiles 8-pointes (khatam) en SVG, rotation très lente, opacités basses pour rester subtile.

## Multi-tenant

Chaque user appartient à une ou plusieurs `organizations`. Toutes les ressources (`agents`, `calls`, `campaigns`, `contacts`, `phone_numbers`) sont scopées par `organization_id` et protégées par **Row Level Security** Postgres.

## Provider abstraction

Le fichier [`src/lib/providers/types.ts`](src/lib/providers/types.ts) définit `IVoiceProvider`. Toute opération métier passe par cette interface — jamais un appel direct à Vapi ou Retell depuis les routes ou composants.

```ts
import { getProvider } from "@/lib/providers";

const provider = getProvider(agent.provider); // "vapi" | "retell"
const { providerAgentId } = await provider.createAgent(agentConfig);
const { providerCallId } = await provider.startOutboundCall({ ... }, agent);
```

## Webhooks

- `POST /api/webhooks/vapi`
- `POST /api/webhooks/retell`

Chacun vérifie la signature HMAC, normalise l'event via l'adapter, persiste le payload brut dans `webhook_events` (audit), et upsert dans `calls` + `call_transcripts`.

## Déploiement Render

Le fichier `render.yaml` configure le service automatiquement. À la première création :

1. Render Dashboard → New → Blueprint → Connect this repo
2. Render lit `render.yaml`, crée le service `vocazai`
3. **Ajouter les env vars** manuellement dans Settings → Environment (Supabase, Vapi, Retell)
4. Trigger un manual deploy

## Documentation

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — décisions techniques, schéma DB, flux providers
- **[docs/SETUP.md](docs/SETUP.md)** — obtention des clés, déploiement, configuration DNS

## License

Proprietary © VocazAI / Suzano AI
