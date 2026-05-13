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
 * Persists every webhook for audit/replay, then upserts call data + transcripts.
 * Uses the service role client to bypass RLS.
 */
export async function handleVoiceWebhook(args: HandleArgs) {
  const { provider, event, payload, signatureValid } = args;
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(`[webhook:${provider}] SUPABASE_SERVICE_ROLE_KEY missing — skipping persistence`);
    return;
  }
  const sb = createServiceClient();

  await sb.from("webhook_events").insert({
    provider,
    event_type: event.type,
    provider_call_id: event.providerCallId || null,
    payload,
    signature_valid: signatureValid,
    processed_at: new Date().toISOString(),
  });

  if (!signatureValid) {
    console.warn(`[webhook:${provider}] invalid signature, ignored`);
    return;
  }

  if (event.call && event.providerCallId) {
    const call = event.call;
    const { data: existing } = await sb
      .from("calls")
      .select("id, organization_id, agent_id")
      .eq("provider", provider)
      .eq("provider_call_id", event.providerCallId)
      .maybeSingle();

    if (existing) {
      await sb
        .from("calls")
        .update({
          status: call.status,
          started_at: call.startedAt,
          ended_at: call.endedAt,
          duration_sec: call.durationSec,
          recording_url: call.recordingUrl,
          cost_usd: call.costUsd,
          ended_reason: call.endedReason,
          metadata: call.metadata ?? {},
        })
        .eq("id", existing.id);

      if (event.type === "call.ended" && call.transcript?.length) {
        await sb.from("call_transcripts").delete().eq("call_id", existing.id);
        await sb.from("call_transcripts").insert(
          call.transcript.map((t) => ({
            call_id: existing.id,
            role: t.role,
            text: t.text,
            start_ms: t.startMs,
            end_ms: t.endMs,
          }))
        );
      }
    }
    // Inbound first-touch: we'd look up agent by phone_number and create the call row.
    // Left for a follow-up commit once phone-number assignment flow is wired.
  }
}
