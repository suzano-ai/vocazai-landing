"use server";

import { createClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/providers";
import type { AgentConfig, Locale, AgentDirection, ProviderId } from "@/lib/providers";

export type CampaignActionResult = { ok: boolean; id?: string; error?: string; warning?: string };

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Erreur inconnue");

export async function createCampaignAction(input: {
  name: string;
  agent_id: string;
  description: string;
}): Promise<CampaignActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };
  if (!input.name.trim()) return { ok: false, error: "Le nom est requis" };

  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      owner_id: user.id,
      name: input.name.trim(),
      agent_id: input.agent_id || null,
      description: input.description.trim() || null,
      status: "draft",
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Échec de la création" };
  return { ok: true, id: data.id };
}

export async function deleteCampaignAction(id: string): Promise<CampaignActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function addTargetsAction(
  campaignId: string,
  contactIds: string[],
): Promise<CampaignActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };
  if (contactIds.length === 0) return { ok: true };

  const rows = contactIds.map((cid) => ({
    owner_id: user.id,
    campaign_id: campaignId,
    contact_id: cid,
    status: "pending",
  }));
  const { error } = await supabase
    .from("campaign_contacts")
    .upsert(rows, { onConflict: "campaign_id,contact_id", ignoreDuplicates: true });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function removeTargetAction(targetId: string): Promise<CampaignActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("campaign_contacts").delete().eq("id", targetId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Run a campaign — place an outbound call for every pending target via the
 * voice provider, write a `calls` row, and link it back on the target.
 * Best-effort: a failed call marks that target "failed" and the run continues.
 */
export async function runCampaignAction(campaignId: string): Promise<CampaignActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, owner_id, agent_id")
    .eq("id", campaignId)
    .maybeSingle();
  if (!campaign) return { ok: false, error: "Campagne introuvable" };
  if (!campaign.agent_id) return { ok: false, error: "Aucun agent associé à la campagne" };

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("id", campaign.agent_id)
    .maybeSingle();
  if (!agent) return { ok: false, error: "Agent introuvable" };
  if (!agent.provider_agent_id) {
    return { ok: false, error: "L'agent n'est pas encore déployé chez le provider vocal" };
  }

  const { data: fromNum } = await supabase
    .from("phone_numbers")
    .select("number")
    .eq("agent_id", agent.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (!fromNum) return { ok: false, error: "Aucun numéro de téléphone attribué à cet agent" };

  const { data: targets } = await supabase
    .from("campaign_contacts")
    .select("id, contacts(phone)")
    .eq("campaign_id", campaignId)
    .eq("status", "pending");
  if (!targets || targets.length === 0) {
    return { ok: false, error: "Aucune cible en attente dans cette campagne" };
  }

  let provider;
  try {
    provider = getProvider(agent.provider as ProviderId);
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }

  const cfg: AgentConfig = {
    id: agent.id,
    provider: agent.provider as ProviderId,
    providerAgentId: agent.provider_agent_id,
    name: agent.name,
    direction: (agent.direction as AgentDirection) ?? "outbound",
    locale: (agent.locale as Locale) ?? "fr",
    systemPrompt: agent.system_prompt ?? "",
    firstMessage: agent.first_message ?? "",
    voice: { vendor: "openai", voiceId: "shimmer" },
    llm: { model: agent.llm_model ?? "gpt-4o-mini" },
    transcriber: { vendor: "deepgram", language: (agent.locale as Locale) ?? "fr" },
    maxDurationSec: agent.max_duration_sec ?? 300,
  };

  let placed = 0;
  let failed = 0;
  for (const tgt of targets) {
    const contact = Array.isArray(tgt.contacts) ? tgt.contacts[0] : tgt.contacts;
    const toNumber = (contact as { phone?: string } | null)?.phone;
    if (!toNumber) {
      await supabase.from("campaign_contacts").update({ status: "failed" }).eq("id", tgt.id);
      failed++;
      continue;
    }
    try {
      const { providerCallId } = await provider.startOutboundCall(
        { agentId: agent.provider_agent_id, toNumber, fromNumber: fromNum.number },
        cfg,
      );
      const { data: callRow } = await supabase
        .from("calls")
        .insert({
          owner_id: campaign.owner_id,
          agent_id: agent.id,
          provider: agent.provider,
          provider_call_id: providerCallId,
          direction: "outbound",
          status: "queued",
          from_number: fromNum.number,
          to_number: toNumber,
          started_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      await supabase
        .from("campaign_contacts")
        .update({ status: "called", call_id: callRow?.id ?? null })
        .eq("id", tgt.id);
      placed++;
    } catch {
      await supabase.from("campaign_contacts").update({ status: "failed" }).eq("id", tgt.id);
      failed++;
    }
  }

  await supabase
    .from("campaigns")
    .update({ status: placed > 0 ? "running" : "draft", updated_at: new Date().toISOString() })
    .eq("id", campaignId);

  if (placed === 0) return { ok: false, error: `Aucun appel placé — ${failed} échec(s)` };
  return {
    ok: true,
    warning: failed > 0 ? `${placed} appel(s) placé(s), ${failed} échec(s)` : undefined,
  };
}
