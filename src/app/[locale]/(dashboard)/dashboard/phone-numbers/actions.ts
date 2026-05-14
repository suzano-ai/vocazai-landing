"use server";

import { createClient } from "@/lib/supabase/server";
import { getProvider } from "@/lib/providers";
import type { ProviderId } from "@/lib/providers";

export type NumberActionResult = { ok: boolean; error?: string; warning?: string };

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Erreur inconnue");

export async function addNumberAction(input: {
  number: string;
  country: string;
  provider: string;
  provider_number_id: string;
}): Promise<NumberActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  if (!input.number.trim()) return { ok: false, error: "Le numéro est requis" };

  const { error } = await supabase.from("phone_numbers").insert({
    owner_id: user.id,
    number: input.number.trim(),
    country: input.country.trim() || "MA",
    provider: input.provider,
    provider_number_id: input.provider_number_id.trim() || null,
    is_active: true,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteNumberAction(id: string): Promise<NumberActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("phone_numbers").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Assign a number to an agent (or clear it with agentId = null). */
export async function assignNumberAction(
  numberId: string,
  agentId: string | null,
): Promise<NumberActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const { data: num } = await supabase
    .from("phone_numbers")
    .select("id, provider, provider_number_id")
    .eq("id", numberId)
    .maybeSingle();
  if (!num) return { ok: false, error: "Numéro introuvable" };

  const { error: updErr } = await supabase
    .from("phone_numbers")
    .update({ agent_id: agentId })
    .eq("id", numberId);
  if (updErr) return { ok: false, error: updErr.message };

  // Sync the assignment with the voice provider when we have the ids for it.
  if (!num.provider_number_id) return { ok: true };
  try {
    const provider = getProvider(num.provider as ProviderId);
    if (agentId) {
      const { data: agent } = await supabase
        .from("agents")
        .select("provider_agent_id")
        .eq("id", agentId)
        .maybeSingle();
      if (agent?.provider_agent_id) {
        await provider.attachPhoneNumber(agent.provider_agent_id, num.provider_number_id);
      } else {
        return { ok: true, warning: "Lien enregistré. L'agent n'est pas encore déployé chez le provider." };
      }
    } else {
      await provider.detachPhoneNumber("", num.provider_number_id);
    }
    return { ok: true };
  } catch (e) {
    return { ok: true, warning: `Lien enregistré, mais la synchronisation provider a échoué : ${errMsg(e)}` };
  }
}
