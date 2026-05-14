"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactInput = {
  name: string;
  phone: string;
  email: string;
  company: string;
  notes: string;
};
export type ContactActionResult = { ok: boolean; error?: string };

export async function createContactAction(input: ContactInput): Promise<ContactActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };
  if (!input.name.trim() || !input.phone.trim()) {
    return { ok: false, error: "Le nom et le téléphone sont requis" };
  }

  const { error } = await supabase.from("contacts").insert({
    owner_id: user.id,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email.trim() || null,
    company: input.company.trim() || null,
    notes: input.notes.trim() || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateContactAction(id: string, input: ContactInput): Promise<ContactActionResult> {
  const supabase = await createClient();
  if (!input.name.trim() || !input.phone.trim()) {
    return { ok: false, error: "Le nom et le téléphone sont requis" };
  }
  const { error } = await supabase
    .from("contacts")
    .update({
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim() || null,
      company: input.company.trim() || null,
      notes: input.notes.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteContactAction(id: string): Promise<ContactActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
