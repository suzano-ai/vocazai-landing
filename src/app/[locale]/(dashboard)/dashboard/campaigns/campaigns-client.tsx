"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Megaphone, Plus, Trash2, Loader2, X, ChevronDown } from "lucide-react";
import { createCampaignAction, deleteCampaignAction } from "./actions";

type AgentRef = { name: string } | { name: string }[] | null;
type Campaign = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  created_at: string;
  agent: AgentRef;
};
type AgentLite = { id: string; name: string };

const agentName = (a: AgentRef): string => {
  if (!a) return "—";
  return Array.isArray(a) ? (a[0]?.name ?? "—") : a.name;
};

const STATUS_STYLES: Record<string, string> = {
  draft:     "bg-muted text-muted-foreground",
  running:   "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  paused:    "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  completed: "bg-saffron-50 text-saffron-700",
};

export function CampaignsClient({
  locale,
  campaigns,
  agents,
}: {
  locale: string;
  campaigns: Campaign[];
  agents: AgentLite[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", agent_id: agents[0]?.id ?? "", description: "" });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await createCampaignAction(form);
    if (!r.ok) { setError(r.error ?? "Erreur"); return; }
    setForm({ name: "", agent_id: agents[0]?.id ?? "", description: "" });
    setShowForm(false);
    if (r.id) router.push(`/${locale}/dashboard/campaigns/${r.id}`);
    else startTransition(() => router.refresh());
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      const r = await deleteCampaignAction(id);
      if (!r.ok) setError(r.error ?? "Erreur");
      router.refresh();
    });
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20";

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-saffron-50 transition-colors duration-220 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
        >
          <Plus className="h-4 w-4" /> Nouvelle campagne
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 rounded-2xl border border-border bg-elevated p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Nouvelle campagne</h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Fermer" className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nom de la campagne *"
              required
              className={inputCls}
            />
            <div className="relative">
              <select
                value={form.agent_id}
                onChange={(e) => setForm({ ...form, agent_id: e.target.value })}
                className={`${inputCls} appearance-none pr-9`}
              >
                <option value="">— Choisir un agent —</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description (optionnel)"
              rows={2}
              className={`${inputCls} resize-none sm:col-span-2`}
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="mt-3 rounded-full bg-ink-900 px-5 py-2 text-sm font-medium text-saffron-50 dark:bg-saffron-500 dark:text-ink-900"
          >
            Créer la campagne
          </button>
        </form>
      )}

      {error && !showForm && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-border bg-elevated">
        {campaigns.length === 0 ? (
          <div className="grid place-items-center gap-3 p-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-50 text-saffron-600">
              <Megaphone className="h-6 w-6" />
            </div>
            <p className="max-w-md text-muted-foreground">
              Aucune campagne pour le moment. Créez une campagne pour lancer des appels sortants vers vos contacts.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Nom</th>
                <th className="px-5 py-3.5">Agent</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5">Créée</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/40">
                  <td className="px-5 py-4">
                    <Link
                      href={`/${locale}/dashboard/campaigns/${c.id}`}
                      className="font-medium transition-colors duration-180 hover:text-saffron-600"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{agentName(c.agent)}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLES[c.status] ?? STATUS_STYLES.draft}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={pending}
                      aria-label="Supprimer la campagne"
                      className="text-muted-foreground transition-colors hover:text-red-600 disabled:opacity-60"
                    >
                      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
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
