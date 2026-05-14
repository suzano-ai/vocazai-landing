import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { formatDuration, formatCurrency } from "@/lib/utils";
import { Phone } from "lucide-react";

export default async function CallsPage() {
  const supabase = await createClient();
  const t = await getTranslations("dashboard.calls");

  const { data: calls } = await supabase
    .from("calls")
    .select("id, started_at, status, direction, from_number, to_number, duration_sec, cost_usd, provider")
    .order("started_at", { ascending: false })
    .limit(100);

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
      <p className="mt-1.5 text-muted-foreground">Tous les appels reçus et émis par vos agents.</p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-elevated">
        {!calls || calls.length === 0 ? (
          <div className="grid place-items-center gap-3 p-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-50 text-saffron-600">
              <Phone className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Direction</th>
                <th className="px-5 py-3.5">De</th>
                <th className="px-5 py-3.5">Vers</th>
                <th className="px-5 py-3.5">Durée</th>
                <th className="px-5 py-3.5">Coût</th>
                <th className="px-5 py-3.5">Statut</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/40">
                  <td className="px-5 py-4 text-muted-foreground">
                    {c.started_at ? new Date(c.started_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-4 capitalize">{c.direction}</td>
                  <td className="px-5 py-4 font-mono text-xs">{c.from_number ?? "—"}</td>
                  <td className="px-5 py-4 font-mono text-xs">{c.to_number ?? "—"}</td>
                  <td className="px-5 py-4">{formatDuration(c.duration_sec)}</td>
                  <td className="px-5 py-4">{formatCurrency(c.cost_usd)}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs">{c.status}</span>
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
