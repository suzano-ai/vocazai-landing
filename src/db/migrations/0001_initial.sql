-- ============================================
-- VocazAI — Initial schema
-- Multi-tenant model: every row scoped to an organization
-- RLS policies enforce organization isolation
-- ============================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ----- Enums -----
create type provider_id as enum ('vapi', 'retell');
create type agent_direction as enum ('inbound', 'outbound', 'both');
create type call_direction as enum ('inbound', 'outbound');
create type call_status as enum (
  'queued', 'ringing', 'in-progress', 'completed',
  'failed', 'no-answer', 'busy', 'canceled'
);
create type org_role as enum ('owner', 'admin', 'member', 'viewer');
create type campaign_status as enum ('draft', 'running', 'paused', 'completed', 'archived');
create type contact_call_status as enum (
  'pending', 'queued', 'dialing', 'completed', 'failed', 'no-answer', 'opted-out'
);

-- ============================================
-- Organizations + membership
-- ============================================
create table organizations (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  slug          text not null unique,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table organization_members (
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  role            org_role not null default 'member',
  created_at      timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index on organization_members(user_id);

-- Helper: orgs the current user belongs to
create or replace function public.user_organizations()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from organization_members where user_id = auth.uid();
$$;

-- ============================================
-- Agents
-- ============================================
create table agents (
  id                  uuid primary key default uuid_generate_v4(),
  organization_id     uuid not null references organizations(id) on delete cascade,
  name                text not null,
  provider            provider_id not null,
  provider_agent_id   text,
  direction           agent_direction not null default 'both',
  locale              text not null default 'fr',

  system_prompt       text not null,
  first_message       text not null,

  voice_vendor        text not null default 'elevenlabs',
  voice_id            text not null,
  voice_speed         numeric(3, 2),
  voice_stability     numeric(3, 2),

  llm_model           text not null default 'gpt-4o-mini',
  llm_temperature     numeric(3, 2) default 0.4,
  llm_max_tokens      int default 250,

  transcriber_vendor  text default 'deepgram',
  transcriber_model   text,
  transcriber_lang    text,

  tools               jsonb default '[]'::jsonb,
  max_duration_sec    int default 600,
  endpointing_ms      int default 500,

  is_active           boolean not null default true,
  created_by          uuid references auth.users(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index on agents(organization_id);
create index on agents(provider, provider_agent_id);

-- ============================================
-- Phone numbers
-- ============================================
create table phone_numbers (
  id                  uuid primary key default uuid_generate_v4(),
  organization_id     uuid not null references organizations(id) on delete cascade,
  number              text not null,
  country_code        text,
  provider            provider_id not null,
  provider_number_id  text not null,
  agent_id            uuid references agents(id) on delete set null,
  created_at          timestamptz not null default now(),
  unique (provider, provider_number_id)
);
create index on phone_numbers(organization_id);
create index on phone_numbers(agent_id);

-- ============================================
-- Contacts (for outbound + CRM-lite)
-- ============================================
create table contacts (
  id                uuid primary key default uuid_generate_v4(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  phone             text not null,
  first_name        text,
  last_name         text,
  email             text,
  locale            text default 'fr',
  attributes        jsonb default '{}'::jsonb,
  opted_out         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (organization_id, phone)
);
create index on contacts(organization_id);
create index on contacts(phone);

-- ============================================
-- Outbound campaigns
-- ============================================
create table campaigns (
  id                uuid primary key default uuid_generate_v4(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  name              text not null,
  agent_id          uuid not null references agents(id) on delete restrict,
  from_number_id    uuid references phone_numbers(id) on delete set null,
  status            campaign_status not null default 'draft',

  daily_cap         int default 200,
  start_hour        int default 9,
  end_hour          int default 19,
  timezone          text default 'Africa/Casablanca',
  retry_max         int default 2,
  retry_delay_min   int default 30,

  variables_schema  jsonb default '{}'::jsonb,
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index on campaigns(organization_id);

create table campaign_contacts (
  id                uuid primary key default uuid_generate_v4(),
  campaign_id       uuid not null references campaigns(id) on delete cascade,
  contact_id        uuid not null references contacts(id) on delete cascade,
  status            contact_call_status not null default 'pending',
  attempts          int not null default 0,
  variables         jsonb default '{}'::jsonb,
  last_attempt_at   timestamptz,
  next_attempt_at   timestamptz,
  call_id           uuid,
  unique (campaign_id, contact_id)
);
create index on campaign_contacts(campaign_id, status);
create index on campaign_contacts(next_attempt_at) where status in ('pending', 'queued');

-- ============================================
-- Calls + transcripts
-- ============================================
create table calls (
  id                uuid primary key default uuid_generate_v4(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  agent_id          uuid references agents(id) on delete set null,
  campaign_id       uuid references campaigns(id) on delete set null,
  contact_id        uuid references contacts(id) on delete set null,

  provider          provider_id not null,
  provider_call_id  text not null,
  direction         call_direction not null,
  status            call_status not null default 'queued',

  from_number       text,
  to_number         text,
  started_at        timestamptz,
  ended_at          timestamptz,
  duration_sec      int,
  recording_url     text,
  cost_usd          numeric(10, 4),
  ended_reason      text,

  summary           text,
  sentiment         text,
  metadata          jsonb default '{}'::jsonb,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (provider, provider_call_id)
);
create index on calls(organization_id, created_at desc);
create index on calls(agent_id);
create index on calls(campaign_id);
create index on calls(status);

create table call_transcripts (
  id                uuid primary key default uuid_generate_v4(),
  call_id           uuid not null references calls(id) on delete cascade,
  role              text not null check (role in ('user', 'agent', 'system', 'tool')),
  text              text not null,
  start_ms          int,
  end_ms            int,
  created_at        timestamptz not null default now()
);
create index on call_transcripts(call_id, start_ms);

-- ============================================
-- Webhook events (audit log + replay)
-- ============================================
create table webhook_events (
  id                uuid primary key default uuid_generate_v4(),
  provider          provider_id not null,
  event_type        text not null,
  provider_call_id  text,
  payload           jsonb not null,
  signature_valid   boolean,
  processed_at      timestamptz,
  error             text,
  received_at       timestamptz not null default now()
);
create index on webhook_events(provider, received_at desc);
create index on webhook_events(provider_call_id);

-- ============================================
-- updated_at trigger
-- ============================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;

create trigger trg_orgs_updated      before update on organizations for each row execute function set_updated_at();
create trigger trg_agents_updated    before update on agents        for each row execute function set_updated_at();
create trigger trg_campaigns_updated before update on campaigns     for each row execute function set_updated_at();
create trigger trg_contacts_updated  before update on contacts      for each row execute function set_updated_at();
create trigger trg_calls_updated     before update on calls         for each row execute function set_updated_at();

-- ============================================
-- Row Level Security
-- ============================================
alter table organizations         enable row level security;
alter table organization_members  enable row level security;
alter table agents                enable row level security;
alter table phone_numbers         enable row level security;
alter table contacts              enable row level security;
alter table campaigns             enable row level security;
alter table campaign_contacts     enable row level security;
alter table calls                 enable row level security;
alter table call_transcripts      enable row level security;

create policy "org_select_members"
  on organizations for select
  using (id in (select user_organizations()));

create policy "org_update_owner"
  on organizations for update
  using (id in (
    select organization_id from organization_members
    where user_id = auth.uid() and role in ('owner', 'admin')
  ));

create policy "members_select_self_org"
  on organization_members for select
  using (organization_id in (select user_organizations()));

create policy "agents_org_all"        on agents             using (organization_id in (select user_organizations()));
create policy "phones_org_all"        on phone_numbers      using (organization_id in (select user_organizations()));
create policy "contacts_org_all"      on contacts           using (organization_id in (select user_organizations()));
create policy "campaigns_org_all"     on campaigns          using (organization_id in (select user_organizations()));
create policy "calls_org_all"         on calls              using (organization_id in (select user_organizations()));

create policy "campaign_contacts_org" on campaign_contacts
  using (campaign_id in (select id from campaigns where organization_id in (select user_organizations())));

create policy "transcripts_org" on call_transcripts
  using (call_id in (select id from calls where organization_id in (select user_organizations())));

-- webhook_events: service-role only
alter table webhook_events enable row level security;
create policy "webhooks_deny_all" on webhook_events for all using (false);

-- ============================================
-- Helper: create an org and add caller as owner
-- ============================================
create or replace function public.create_organization(p_name text, p_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  insert into organizations(name, slug) values (p_name, p_slug) returning id into v_org_id;
  insert into organization_members(organization_id, user_id, role)
    values (v_org_id, auth.uid(), 'owner');
  return v_org_id;
end;
$$;
