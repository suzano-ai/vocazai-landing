# VocazAI — CLAUDE.md
> Agent reference doc. Keep this updated. Read this before touching any file.

---

## What is VocazAI

AI voice receptionist SaaS for Moroccan SMBs. A business subscribes, configures an AI agent (French/Arabic/English), attaches a phone number — the AI answers calls 24/7, books appointments, handles FAQs. Built by Aymane @ Mare Nostrum.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router + TypeScript strict |
| Styling | Tailwind CSS v3 + custom design tokens |
| i18n | next-intl · locales: `fr` (default) · `en` · `ar` |
| Auth | Supabase (magic-link OTP email) |
| DB | Supabase Postgres |
| Voice | Vapi **or** Retell (provider abstraction in `src/lib/providers/`) |
| TTS | Piper ONNX (self-hosted Docker) — fr_FR-siwis / en_US-lessac-high / ar_JO-kareem |
| STT | faster-whisper medium (self-hosted Docker) + Web Speech API (browser primary) |
| Email | Resend (`RESEND_API_KEY`) |
| Deploy | Hostinger KVM VPS · Docker Compose · Traefik v2 · HTTPS auto-cert |
| CI/CD | GitHub Actions → SSH → `vocazai update` on every push to `main` |

---

## Repo layout

```
/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              ← landing page (FR/EN/AR)
│   │   │   ├── (auth)/login/         ← magic-link login
│   │   │   ├── (dashboard)/          ← protected app shell
│   │   │   │   ├── layout.tsx        ← sidebar + auth guard
│   │   │   │   └── dashboard/
│   │   │   │       ├── page.tsx      ← overview (stats)
│   │   │   │       ├── agents/       ← agents list + CRUD
│   │   │   │       └── calls/        ← calls history
│   │   │   ├── pricing/ about/ use-cases/
│   │   │   └── legal/ (terms, privacy)
│   │   ├── api/
│   │   │   ├── tts/route.ts          ← POST synthesis, GET health
│   │   │   ├── stt/route.ts          ← POST transcription, GET health
│   │   │   ├── email/route.ts        ← POST send (Resend)
│   │   │   ├── webhooks/
│   │   │   │   ├── vapi/route.ts
│   │   │   │   └── retell/route.ts
│   │   │   └── health/route.ts
│   │   └── auth/callback/route.ts    ← Supabase OTP callback
│   ├── components/
│   │   ├── landing/                  ← header, footer, demo-call-card, locale-switch
│   │   ├── ai-canvas.tsx             ← WebGL particle hero background
│   │   ├── zellige.tsx               ← Moroccan SVG geometry decorations
│   │   └── reveal.tsx                ← scroll reveal animation
│   └── lib/
│       ├── supabase/                 ← client.ts / server.ts / middleware.ts
│       └── providers/                ← IVoiceProvider abstraction (vapi.ts, retell.ts)
├── services/
│   ├── tts/                          ← Piper TTS microservice (Python/FastAPI)
│   └── stt/                          ← faster-whisper STT microservice (Python/FastAPI)
├── deploy/
│   ├── vocazai-cli.sh               ← `vocazai` CLI (update, doctor, logs…)
│   ├── traefik.yml                   ← Traefik static config
│   └── install.sh                    ← one-shot VPS provisioner
└── docker-compose.yml               ← app + tts + stt + traefik
```

---

## Environment variables

### VPS `/var/www/vocazai-landing/.env.local`
```env
# ── Supabase ──────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # server-only, never exposed to browser

# ── Voice providers (use one or both) ─────────────────────────────────
VAPI_API_KEY=
VAPI_WEBHOOK_SECRET=
RETELL_API_KEY=
RETELL_WEBHOOK_SECRET=

# ── Email ─────────────────────────────────────────────────────────────
RESEND_API_KEY=re_...                    # already set on VPS ✓

# ── Mistral — demo LLM + Voxtral voice (TTS/STT) ──────────────────────
MISTRAL_API_KEY=                         # powers /api/demo-chat + Voxtral
                                         # in /api/tts and /api/stt.
                                         # Missing → demo falls back to the
                                         # scripted flow + Piper/whisper.
VOXTRAL_AR_REF_B64=                      # optional. base64 of a short (~5-10s)
                                         # Arabic voice clip. Voxtral has no
                                         # preset Arabic voice, so Arabic TTS is
                                         # voice-CLONED from a reference. Unset →
                                         # falls back to public/voices/ar-ref.wav
                                         # (a placeholder MSA clip); swap that
                                         # file or set this for a Darija voice.

# ── App ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://vocazai.com

# ── Services (Docker internal) ────────────────────────────────────────
TTS_SERVICE_URL=http://tts:8000
STT_SERVICE_URL=http://stt:9000
```

---

## Supabase DB schema (to apply in SQL editor)

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles (linked to auth.users) ──────────────────────────────────
create table profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  full_name     text,
  plan          text not null default 'free',   -- free | starter | growth | enterprise
  stripe_customer_id text,
  created_at    timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users see own profile"
  on profiles for all using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Agents ────────────────────────────────────────────────────────────
create table agents (
  id                  uuid primary key default uuid_generate_v4(),
  owner_id            uuid not null references profiles(id) on delete cascade,
  name                text not null,
  provider            text not null default 'vapi',  -- vapi | retell
  provider_agent_id   text,
  locale              text not null default 'fr',
  direction           text not null default 'inbound',
  is_active           boolean default true,
  system_prompt       text,
  first_message       text,
  voice_vendor        text default 'elevenlabs',
  voice_id            text,
  llm_model           text default 'gpt-4o-mini',
  max_duration_sec    int  default 300,
  updated_at          timestamptz default now(),
  created_at          timestamptz default now()
);
alter table agents enable row level security;
create policy "Owners manage own agents"
  on agents for all using (auth.uid() = owner_id);

-- ── Phone numbers ─────────────────────────────────────────────────────
create table phone_numbers (
  id                    uuid primary key default uuid_generate_v4(),
  owner_id              uuid not null references profiles(id) on delete cascade,
  agent_id              uuid references agents(id) on delete set null,
  provider              text not null,
  provider_number_id    text,
  number                text not null,
  country               text default 'MA',
  is_active             boolean default true,
  created_at            timestamptz default now()
);
alter table phone_numbers enable row level security;
create policy "Owners manage own numbers"
  on phone_numbers for all using (auth.uid() = owner_id);

-- ── Calls ─────────────────────────────────────────────────────────────
create table calls (
  id                uuid primary key default uuid_generate_v4(),
  owner_id          uuid not null references profiles(id) on delete cascade,
  agent_id          uuid references agents(id) on delete set null,
  provider          text not null,
  provider_call_id  text unique,
  direction         text,
  status            text,
  from_number       text,
  to_number         text,
  started_at        timestamptz,
  ended_at          timestamptz,
  duration_sec      int,
  cost_usd          numeric(8,4),
  recording_url     text,
  transcript        jsonb,
  ended_reason      text,
  metadata          jsonb default '{}',
  created_at        timestamptz default now()
);
alter table calls enable row level security;
create policy "Owners see own calls"
  on calls for all using (auth.uid() = owner_id);

-- ── Indexes ───────────────────────────────────────────────────────────
create index on agents  (owner_id);
create index on calls   (owner_id, started_at desc);
create index on calls   (provider_call_id);
create index on phone_numbers (owner_id);
```

---

## Supabase Auth config (Dashboard → Authentication → URL Configuration)

- **Site URL**: `https://vocazai.com`
- **Redirect URLs** (allowlist): `https://vocazai.com/**`, `http://localhost:3000/**`
  — wildcards so `/auth/callback?next=/{locale}/dashboard` is permitted. Without
  the right entry Supabase silently falls back to the Site URL and the magic
  link never reaches the project. Managed via the Management API (`config/auth`,
  `uri_allow_list`) — needs a `SUPABASE_ACCESS_TOKEN` (sbp_…).
- **Email OTP**: enabled
- **Disable email confirmation**: OFF (keep it ON — magic link IS the confirmation)

---

## Voice providers

### Vapi
- Dashboard: https://dashboard.vapi.ai
- Needed: `VAPI_API_KEY`, `VAPI_WEBHOOK_SECRET`
- Webhook URL to set in Vapi dashboard: `https://vocazai.com/api/webhooks/vapi`

### Retell
- Dashboard: https://app.retellai.com
- Needed: `RETELL_API_KEY`, `RETELL_WEBHOOK_SECRET`
- Webhook URL to set in Retell dashboard: `https://vocazai.com/api/webhooks/retell`

---

## CLI commands (on VPS)

```bash
vocazai update          # git pull + rebuild app only (fast, ~30s)
vocazai update --all    # rebuild app + tts + stt (use after model changes)
vocazai logs            # tail app container logs
vocazai logs tts        # tail tts logs
vocazai doctor          # health check all services
vocazai restart         # docker compose restart
```

---

## Remaining work — priority order

### 🔴 BLOCKER (nothing works without these)
- [ ] **P0** Add Supabase keys to VPS `.env.local` → `vocazai update`
- [ ] **P0** Run SQL schema above in Supabase SQL editor
- [ ] **P0** Configure Supabase Auth redirect URLs

### 🟠 CORE PRODUCT
- [ ] **P1** Agent creation wizard (`/dashboard/agents/new`) — form with all AgentConfig fields
- [ ] **P1** Agent edit page (`/dashboard/agents/[id]`) — update + sync to Vapi/Retell
- [ ] **P1** Agent delete with provider cleanup
- [ ] **P1** Webhook handler (`src/lib/webhooks/handler.ts`) — save calls to DB
- [ ] **P1** Calls page — list with status, duration, cost; click to see transcript
- [ ] **P1** Phone numbers page — list + assign to agent

### 🟡 GROWTH
- [ ] **P2** Dashboard stats — real data from calls table (Chart.js or recharts)
- [ ] **P2** Stripe billing integration — plans map to `profiles.plan`
- [ ] **P2** Usage limits enforcement — check plan before allowing agent creation
- [ ] **P2** Outbound call trigger — API endpoint to start a call programmatically
- [ ] **P2** Settings page — update profile, manage API keys, delete account

### 🟢 POLISH
- [ ] **P3** Email flows — welcome email, magic link custom template (Resend)
- [ ] **P3** Legal pages — terms + privacy (currently empty routes)
- [ ] **P3** Error/empty states for all dashboard pages
- [ ] **P3** i18n dashboard translations (currently FR hardcoded)
- [ ] **P3** Agent analytics — per-agent call volume, avg duration
- [ ] **P3** Call recording playback in transcript view

---

## Design tokens (Tailwind)

```
bg-background    bg-elevated    bg-surface
text-foreground  text-muted-foreground
border-border
saffron-500      ← primary accent (#F59E0B)
teal-500         ← secondary accent
ink-900          ← near-black
font-display     ← Fraunces (headings)
font-sans        ← Inter (body)
font-mono        ← system mono (kickers, badges)
```

---

## Key patterns

```typescript
// Server component with auth guard (dashboard)
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect(`/${locale}/login`);

// Client component Supabase
const supabase = createClient(); // from @/lib/supabase/client

// Voice provider (server)
import { getProvider } from "@/lib/providers";
const provider = getProvider("vapi"); // or "retell"
await provider.createAgent(config);
```
