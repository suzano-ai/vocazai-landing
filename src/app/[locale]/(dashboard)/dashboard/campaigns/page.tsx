import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { CampaignsClient } from "./campaigns-client";

export default async function CampaignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const t = await getTranslations("dashboard.nav");

  const [campaignsRes, agentsRes] = await Promise.all([
    supabase
      .from("campaigns")
      .select("id, name, status, description, created_at, agent:agents(name)")
      .order("created_at", { ascending: false }),
    supabase.from("agents").select("id, name").order("name", { ascending: true }),
  ]);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-3xl font-bold">{t("campaigns")}</h1>
      <p className="mt-1.5 text-muted-foreground">
        Campagnes d&apos;appels sortants — vos agents appellent vos contacts.
      </p>

      <CampaignsClient
        locale={locale}
        campaigns={campaignsRes.data ?? []}
        agents={agentsRes.data ?? []}
      />
    </div>
  );
}
