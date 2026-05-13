import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Plus, Bot } from "lucide-react";

export default async function AgentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const t = await getTranslations("dashboard.agents");

  const { data: agents } = await supabase
    .from("agents")
    .select("id, name, provider, locale, direction, is_active, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
          <p className="mt-1.5 text-muted-foreground">Vos standardistes IA, prêts à décrocher.</p>
        </div>
        <Link
          href={`/${locale}/dashboard/agents/new`}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-sand-50 transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> {t("createNew")}
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-elevated">
        {!agents || agents.length === 0 ? (
          <div className="grid place-items-center gap-3 p-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Bot className="h-6 w-6" />
            </div>
            <p className="max-w-md text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Nom</th>
                <th className="px-5 py-3.5">Provider</th>
                <th className="px-5 py-3.5">Langue</th>
                <th className="px-5 py-3.5">Direction</th>
                <th className="px-5 py-3.5">Statut</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-surface/40">
                  <td className="px-5 py-4">
                    <Link href={`/${locale}/dashboard/agents/${a.id}`} className="font-medium hover:text-emerald-600">
                      {a.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4 capitalize text-muted-foreground">{a.provider}</td>
                  <td className="px-5 py-4 uppercase">{a.locale}</td>
                  <td className="px-5 py-4">{a.direction}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs ${a.is_active ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${a.is_active ? "bg-emerald-600" : "bg-muted-foreground"}`} />
                      {a.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
