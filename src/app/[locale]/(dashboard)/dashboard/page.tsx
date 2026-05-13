import { createClient } from "@/lib/supabase/server";
import { Phone, TrendingUp, Clock, DollarSign } from "lucide-react";

export default async function OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold">Vue d&apos;ensemble</h1>
        <p className="mt-1.5 text-muted-foreground">Bienvenue {user?.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Agents actifs" value="—" icon={<Phone className="h-4 w-4" />} />
        <StatCard label="Appels (7j)" value="—" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Durée moyenne" value="—" icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Coût (7j)" value="—" icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <div className="mt-12 rounded-3xl border border-border bg-elevated p-8">
        <h2 className="font-display text-xl font-semibold">Premiers pas</h2>
        <p className="mt-2 text-muted-foreground">Pour démarrer, créez votre premier agent vocal puis attachez un numéro de téléphone.</p>
        <ol className="mt-6 space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">1</span>
            <span>Créer un agent dans <b>Agents</b> — choisissez la voix, la langue, le prompt</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">2</span>
            <span>Acheter un numéro via Vapi/Retell et le rattacher à l&apos;agent dans <b>Numéros</b></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">3</span>
            <span>Appelez le numéro 🎉 — l&apos;appel apparaîtra dans <b>Appels</b></span>
          </li>
        </ol>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-elevated p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">{icon}</div>
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
    </div>
  );
}
