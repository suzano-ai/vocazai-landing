"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Hash, Plus, Trash2, Loader2, ChevronDown } from "lucide-react";
import { addNumberAction, deleteNumberAction, assignNumberAction } from "./actions";

type PhoneNumber = {
  id: string;
  number: string;
  country: string | null;
  provider: string;
  provider_number_id: string | null;
  agent_id: string | null;
  is_active: boolean | null;
};
type AgentLite = { id: string; name: string; provider_agent_id: string | null };

export function NumbersClient({
  numbers,
  agents,
}: {
  numbers: PhoneNumber[];
  agents: AgentLite[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ kind: "error" | "warning"; text: string } | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ number: "", country: "MA", provider: "vapi", provider_number_id: "" });

  const refresh = () => startTransition(() => router.refresh());

  function run(fn: () => Promise<{ ok: boolean; error?: string; warning?: string }>) {
    setNotice(null);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) setNotice({ kind: "error", text: r.error ?? "Erreur" });
      else if (r.warning) setNotice({ kind: "warning", text: r.warning });
      router.refresh();
    });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setNotice(null);
    const r = await addNumberAction(form);
    if (!r.ok) { setNotice({ kind: "error", text: r.error ?? "Erreur" }); return; }
    setForm({ number: "", country: "MA", provider: "vapi", provider_number_id: "" });
    setShowAdd(false);
    refresh();
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-saffron-50 transition-colors duration-220 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
        >
          <Plus className="h-4 w-4" /> Ajouter un numéro
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="mb-4 grid gap-3 rounded-2xl border border-border bg-elevated p-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <input
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            placeholder="+212 6 12 34 56 78"
            required
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-saffron-500 focus:outline-none"
          />
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="MA"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-saffron-500 focus:outline-none"
          />
          <select
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-saffron-500 focus:outline-none"
          >
            <option value="vapi">Vapi</option>
            <option value="retell">Retell</option>
          </select>
          <input
            value={form.provider_number_id}
            onChange={(e) => setForm({ ...form, provider_number_id: e.target.value })}
            placeholder="ID provider (optionnel)"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-saffron-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-medium text-saffron-50 disabled:opacity-60 dark:bg-saffron-500 dark:text-ink-900 sm:col-span-2 lg:col-span-1"
          >
            Enregistrer
          </button>
        </form>
      )}

      {notice && (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            notice.kind === "error"
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
              : "border-amber-300/60 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-border bg-elevated">
        {numbers.length === 0 ? (
          <div className="grid place-items-center gap-3 p-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron-50 text-saffron-600">
              <Hash className="h-6 w-6" />
            </div>
            <p className="max-w-md text-muted-foreground">
              Aucun numéro pour le moment. Ajoutez un numéro acheté chez Vapi ou Retell, puis attribuez-le à un agent.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Numéro</th>
                <th className="px-5 py-3.5">Pays</th>
                <th className="px-5 py-3.5">Provider</th>
                <th className="px-5 py-3.5">Agent</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {numbers.map((n) => (
                <tr key={n.id} className="border-b border-border last:border-0 hover:bg-surface/40">
                  <td className="px-5 py-4 font-mono text-xs">{n.number}</td>
                  <td className="px-5 py-4 text-muted-foreground">{n.country ?? "—"}</td>
                  <td className="px-5 py-4 capitalize text-muted-foreground">{n.provider}</td>
                  <td className="px-5 py-4">
                    <div className="relative inline-block">
                      <select
                        value={n.agent_id ?? ""}
                        disabled={pending}
                        onChange={(e) =>
                          run(() => assignNumberAction(n.id, e.target.value || null))
                        }
                        className="appearance-none rounded-lg border border-border bg-background py-1.5 pl-3 pr-8 text-xs focus:border-saffron-500 focus:outline-none disabled:opacity-60"
                      >
                        <option value="">— Non attribué —</option>
                        {agents.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => run(() => deleteNumberAction(n.id))}
                      disabled={pending}
                      aria-label="Supprimer le numéro"
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
