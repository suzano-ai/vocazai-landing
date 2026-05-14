"use server";

import { createClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/providers";
import type { AgentConfig, Locale, AgentDirection, ProviderId } from "@/lib/providers";

/**
 * Server actions for agent CRUD. These run server-side so the provider secret
 * keys (VAPI_API_KEY / RETELL_API_KEY) never reach the browser. Each action
 * writes to Supabase with the RLS-scoped server client, then syncs the change
 * to the voice provider (Vapi/Retell) and persists `provider_agent_id`.
 */

export interface AgentInput {
  name: string;
  provider: string;
  locale: string;
  direction: string;
  llm_model: string;
  voice_vendor: string;
  voice_id: string;
  max_duration_sec: number;
  first_message: string;
  system_prompt: string;
  is_active?: boolean;
}

export type AgentActionResult = {
  ok: boolean;
  id?: string;
  error?: string;
  warning?: string;
};

const VOICE_VENDORS = ["elevenlabs", "openai", "deepgram", "playht", "azure", "cartesia"] as const;

/** Map a DB agent row + form input into the provider-agnostic AgentConfig. */
function buildConfig(id: string, providerAgentId: string | null, a: AgentInput): AgentConfig {
  // The form allows "piper" (the self-hosted demo voice) — providers can't use
  // it, so fall back to a sane hosted voice the provider supports.
  const knownVendor = (VOICE_VENDORS as readonly string[]).includes(a.voice_vendor);
  const vendor = (knownVendor ? a.voice_vendor : "openai") as AgentConfig["voice"]["vendor"];
  const voiceId = knownVendor ? a.voice_id : "shimmer";

  return {
    id,
    provider: a.provider as ProviderId,
    providerAgentId,
    name: a.name.trim() || "Agent",
    direction: a.direction as AgentDirection,
    locale: a.locale as Locale,
    systemPrompt: a.system_prompt.trim(),
    firstMessage: a.first_message.trim(),
    voice: { vendor, voiceId },
    llm: { model: a.llm_model },
    transcriber: { vendor: "deepgram", language: a.locale as Locale },
    maxDurationSec: a.max_duration_sec,
  };
}

const isMissingKey = (e: unknown) => e instanceof Error && /is not set/i.test(e.message);
const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Erreur inconnue");

export async function createAgentAction(input: AgentInput): Promise<AgentActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const { data: row, error: insertErr } = await supabase
    .from("agents")
    .insert({
      owner_id: user.id,
      name: input.name.trim() || "Agent sans nom",
      provider: input.provider,
      locale: input.locale,
      direction: input.direction,
      llm_model: input.llm_model,
      voice_vendor: input.voice_vendor,
      voice_id: input.voice_id,
      max_duration_sec: input.max_duration_sec,
      first_message: input.first_message.trim() || null,
      system_prompt: input.system_prompt.trim() || null,
      is_active: input.is_active ?? true,
    })
    .select("id")
    .single();

  if (insertErr || !row) return { ok: false, error: insertErr?.message ?? "Échec de l'insertion" };

  // Deploy to the voice provider. On failure we keep the DB row as a draft
  // (the user's config isn't lost; a row with a null provider_agent_id is a
  // valid not-yet-deployed agent that the edit page can retry) — a row without
  // a provider agent is not an orphan; the dangerous direction can't happen
  // because the DB row is created first.
  try {
    const provider = getProvider(input.provider as ProviderId);
    const { providerAgentId } = await provider.createAgent(buildConfig(row.id, null, input));
    await supabase.from("agents").update({ provider_agent_id: providerAgentId }).eq("id", row.id);
    return { ok: true, id: row.id };
  } catch (e) {
    return {
      ok: true,
      id: row.id,
      warning: isMissingKey(e)
        ? "Agent enregistré. Le provider vocal n'est pas configuré (clé API manquante) — le déploiement se fera plus tard."
        : `Agent enregistré, mais le déploiement vers le provider a échoué : ${errMsg(e)}`,
    };
  }
}

export async function updateAgentAction(id: string, input: AgentInput): Promise<AgentActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const { data: existing } = await supabase
    .from("agents")
    .select("id, provider, provider_agent_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return { ok: false, error: "Agent introuvable" };

  const { error: updErr } = await supabase
    .from("agents")
    .update({
      name: input.name,
      provider: input.provider,
      locale: input.locale,
      direction: input.direction,
      is_active: input.is_active ?? true,
      llm_model: input.llm_model,
      voice_vendor: input.voice_vendor,
      voice_id: input.voice_id,
      max_duration_sec: input.max_duration_sec,
      first_message: input.first_message.trim() || null,
      system_prompt: input.system_prompt.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (updErr) return { ok: false, error: updErr.message };

  // Sync to the provider — update if already deployed, otherwise deploy now.
  try {
    const provider = getProvider(input.provider as ProviderId);
    const cfg = buildConfig(id, existing.provider_agent_id, input);
    if (existing.provider_agent_id) {
      await provider.updateAgent(existing.provider_agent_id, cfg);
    } else {
      const { providerAgentId } = await provider.createAgent(cfg);
      await supabase.from("agents").update({ provider_agent_id: providerAgentId }).eq("id", id);
    }
    return { ok: true, id };
  } catch (e) {
    return {
      ok: true,
      id,
      warning: isMissingKey(e)
        ? "Modifications enregistrées. Provider vocal non configuré — synchronisation à faire plus tard."
        : `Modifications enregistrées, mais la synchronisation provider a échoué : ${errMsg(e)}`,
    };
  }
}

export async function deleteAgentAction(id: string): Promise<AgentActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const { data: existing } = await supabase
    .from("agents")
    .select("id, provider, provider_agent_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return { ok: false, error: "Agent introuvable" };

  // Provider-first: remove the remote agent before the DB row so we never
  // orphan a live agent on the provider. Treat 404 / missing-key as "gone".
  if (existing.provider_agent_id) {
    try {
      await getProvider(existing.provider as ProviderId).deleteAgent(existing.provider_agent_id);
    } catch (e) {
      const msg = errMsg(e);
      const gone = /404|not.?found/i.test(msg) || isMissingKey(e);
      if (!gone) return { ok: false, error: `Suppression côté provider échouée : ${msg}` };
    }
  }

  const { error: delErr } = await supabase.from("agents").delete().eq("id", id);
  if (delErr) return { ok: false, error: delErr.message };
  return { ok: true };
}
