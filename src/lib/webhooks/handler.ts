import { createServiceClient } from "@/lib/supabase/server";
import type { NormalizedWebhookEvent, ProviderId } from "@/lib/providers";

interface HandleArgs {
  provider: ProviderId;
  event: NormalizedWebhookEvent;
  payload: unknown;
  signatureValid: boolean;
  rawBody: string;
}

/**
 * Single sink for inbound voice webhooks. Upserts the call row keyed on
 * `provider_call_id`, storing the transcript inline as jsonb on that row.
 *
 * Uses the service-role Supabase client to bypass RLS — webhooks have no user
 * session. The tenant (`owner_id`) is resolved from the agent's
 * `provider_agent_id`; without a resolvable owner a new row cannot be inserted
 * (`calls.owner_id` is NOT NULL), so the event is dropped.
 *
 * DB schema (deploy/supabase-schema.sql → table `calls`):
 *   owner_id, agent_id, provider, provider_call_id, direction, status,
 *   from_number, to_number, started_at, ended_at, duration_sec, cost_usd,
 *   recording_url, transcript (jsonb), ended_reason, metadata (jsonb)
 */
export async function handleVoiceWebhook(args: HandleArgs) {
  const { provider, event, signatureValid } = args;

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(`[webhook:${provider}] SUPABASE_SERVICE_ROLE_KEY missing — skipping`);
    return;
  }
  if (!signatureValid) {
    console.warn(`[webhook:${provider}] invalid signature — ignoring payload`);
    return;
  }
  if (!event.providerCallId || !event.call) return;

  const sb = createServiceClient();
  const c = event.call;

  // ── Resolve agent + owner (tenant) via the agent's provider_agent_id ───────
  let agentId: string | null = null;
  let ownerId: string | null = null;
  if (c.agentId) {
    const { data: agent } = await sb
      .from("agents")
      .select("id, owner_id")
      .eq("provider", provider)
      .eq("provider_agent_id", c.agentId)
      .maybeSingle();
    if (agent) {
      agentId = agent.id;
      ownerId = agent.owner_id;
    }
  }

  // ── Build the column set — only include fields the event actually carries ──
  // Webhook events are partial; a `?? null` would wipe data saved by an
  // earlier event for the same call (e.g. call.ended has no started_at).
  const fields: Record<string, unknown> = {
    provider,
    provider_call_id: event.providerCallId,
    metadata: { ...(c.metadata ?? {}), raw_type: event.type },
  };
  const set = (key: string, val: unknown) => {
    if (val !== undefined && val !== null) fields[key] = val;
  };
  set("direction", c.direction);
  set("status", c.status);
  set("from_number", c.fromNumber);
  set("to_number", c.toNumber);
  set("started_at", c.startedAt);
  set("ended_at", c.endedAt);
  set("duration_sec", c.durationSec);
  set("cost_usd", c.costUsd);
  set("recording_url", c.recordingUrl);
  set("ended_reason", c.endedReason);
  if (c.transcript?.length) fields.transcript = c.transcript;

  // ── Persist ────────────────────────────────────────────────────────────────
  if (ownerId) {
    // Tenant known — upsert (handles inbound first-touch + later updates).
    const { error } = await sb
      .from("calls")
      .upsert(
        { ...fields, owner_id: ownerId, agent_id: agentId },
        { onConflict: "provider_call_id" }
      );
    if (error) {
      console.error(`[webhook:${provider}] upsert failed:`, error.message);
    } else {
      console.log(`[webhook:${provider}] call ${event.providerCallId} saved (${event.type})`);
    }
    return;
  }

  // No resolvable owner — only update an existing row; never insert a row with
  // a null owner_id (NOT NULL constraint, and RLS would block it anyway).
  const { data: existing } = await sb
    .from("calls")
    .select("id")
    .eq("provider", provider)
    .eq("provider_call_id", event.providerCallId)
    .maybeSingle();

  if (existing) {
    const { error } = await sb.from("calls").update(fields).eq("id", existing.id);
    if (error) console.error(`[webhook:${provider}] update failed:`, error.message);
  } else {
    console.warn(
      `[webhook:${provider}] no agent/owner for call ${event.providerCallId} — dropped`
    );
  }
}
