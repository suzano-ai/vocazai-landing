import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { NumbersClient } from "./numbers-client";

export default async function PhoneNumbersPage() {
  const supabase = await createClient();
  const t = await getTranslations("dashboard.nav");

  const [numbersRes, agentsRes] = await Promise.all([
    supabase
      .from("phone_numbers")
      .select("id, number, country, provider, provider_number_id, agent_id, is_active, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("agents")
      .select("id, name, provider_agent_id")
      .order("name", { ascending: true }),
  ]);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-3xl font-bold">{t("phoneNumbers")}</h1>
      <p className="mt-1.5 text-muted-foreground">
        Vos numéros de téléphone et l&apos;agent qui répond sur chacun.
      </p>

      <NumbersClient
        numbers={numbersRes.data ?? []}
        agents={agentsRes.data ?? []}
      />
    </div>
  );
}
