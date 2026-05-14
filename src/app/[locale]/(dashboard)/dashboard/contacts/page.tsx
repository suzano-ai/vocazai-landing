import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { ContactsClient } from "./contacts-client";

export default async function ContactsPage() {
  const supabase = await createClient();
  const t = await getTranslations("dashboard.nav");

  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, name, phone, email, company, notes, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-3xl font-bold">{t("contacts")}</h1>
      <p className="mt-1.5 text-muted-foreground">
        Votre répertoire — les personnes que vos agents peuvent appeler.
      </p>

      <ContactsClient contacts={contacts ?? []} />
    </div>
  );
}
