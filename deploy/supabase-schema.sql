-- ============================================================
-- VocazAI — Supabase SQL Schema
-- Run this in: https://supabase.com/dashboard/project/tvqnprxjmxvacmgzjhdd/sql/new
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles (linked to auth.users) ──────────────────────────────────────────
create table if not exists profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  full_name     text,
  plan          text not null default 'free',   -- free | starter | growth | enterprise
  stripe_customer_id text,
  created_at    timestamptz default now()
);
alter table profiles enable row level security;

drop policy if exists "Users see own profile" on profiles;
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── Agents ────────────────────────────────────────────────────────────────────
create table if not exists agents (
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

drop policy if exists "Owners manage own agents" on agents;
create policy "Owners manage own agents"
  on agents for all using (auth.uid() = owner_id);

-- ── Phone numbers ─────────────────────────────────────────────────────────────
create table if not exists phone_numbers (
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

drop policy if exists "Owners manage own numbers" on phone_numbers;
create policy "Owners manage own numbers"
  on phone_numbers for all using (auth.uid() = owner_id);

-- ── Calls ─────────────────────────────────────────────────────────────────────
create table if not exists calls (
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

drop policy if exists "Owners see own calls" on calls;
create policy "Owners see own calls"
  on calls for all using (auth.uid() = owner_id);

-- ── Contacts (CRM list, owner-scoped) ────────────────────────────────────────
create table if not exists contacts (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  name        text not null,
  phone       text not null,
  email       text,
  company     text,
  notes       text,
  tags        text[] default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table contacts enable row level security;

drop policy if exists "Owners manage own contacts" on contacts;
create policy "Owners manage own contacts"
  on contacts for all using (auth.uid() = owner_id);

-- ── Campaigns (outbound call campaigns tied to an agent) ─────────────────────
create table if not exists campaigns (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references profiles(id) on delete cascade,
  agent_id    uuid references agents(id) on delete set null,
  name        text not null,
  status      text not null default 'draft',   -- draft | running | paused | completed
  description text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table campaigns enable row level security;

drop policy if exists "Owners manage own campaigns" on campaigns;
create policy "Owners manage own campaigns"
  on campaigns for all using (auth.uid() = owner_id);

-- ── Campaign targets (campaign × contact, per-call status) ───────────────────
create table if not exists campaign_contacts (
  id           uuid primary key default uuid_generate_v4(),
  owner_id     uuid not null references profiles(id) on delete cascade,
  campaign_id  uuid not null references campaigns(id) on delete cascade,
  contact_id   uuid not null references contacts(id) on delete cascade,
  call_id      uuid references calls(id) on delete set null,
  status       text not null default 'pending',  -- pending | called | failed
  created_at   timestamptz default now(),
  unique (campaign_id, contact_id)
);
alter table campaign_contacts enable row level security;

drop policy if exists "Owners manage own campaign_contacts" on campaign_contacts;
create policy "Owners manage own campaign_contacts"
  on campaign_contacts for all using (auth.uid() = owner_id);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists agents_owner_idx  on agents  (owner_id);
create index if not exists calls_owner_idx   on calls   (owner_id, started_at desc);
create index if not exists calls_callid_idx  on calls   (provider_call_id);
create index if not exists phones_owner_idx  on phone_numbers (owner_id);
create index if not exists contacts_owner_idx   on contacts  (owner_id, created_at desc);
create index if not exists campaigns_owner_idx  on campaigns (owner_id, created_at desc);
create index if not exists camp_contacts_idx    on campaign_contacts (campaign_id);

-- ── Done ─────────────────────────────────────────────────────────────────────
-- Expected tables: profiles, agents, phone_numbers, calls,
--                  contacts, campaigns, campaign_contacts
-- Verify in: Table Editor → you should see all 7 tables
