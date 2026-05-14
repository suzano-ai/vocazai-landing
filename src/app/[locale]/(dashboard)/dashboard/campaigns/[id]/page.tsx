import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CampaignDetailClient } from "./campaign-detail-client";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name, status, description, agent_id, agent:agents(name)")
    .eq("id", id)
    .maybeSingle();
  if (!campaign) notFound();

  const [targetsRes, contactsRes] = await Promise.all([
    supabase
      .from("campaign_contacts")
      .select("id, status, contact:contacts(id, name, phone)")
      .eq("campaign_id", id),
    supabase.from("contacts").select("id, name, phone").order("name", { ascending: true }),
  ]);

  return (
    <CampaignDetailClient
      locale={locale}
      campaign={campaign}
      targets={targetsRes.data ?? []}
      allContacts={contactsRes.data ?? []}
    />
  );
}
