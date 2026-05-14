"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Play, Trash2, Loader2, Plus } from "lucide-react";
import { addTargetsAction, removeTargetAction, runCampaignAction } from "../actions";

type Ref<T> = T | T[] | null;
const one = <T,>(r: Ref<T>): T | null => (!r ? null : Array.isArray(r) ? (r[0] ?? null) : r);

type Contact = { id: string; name: string; phone: string };
type Target = { id: string; status: string; contact: Ref<Contact> };
type Campaign = {
  id: string;
  name: string;
  status: string;
  description: string | null;
  agent_id: string | null;
  agent: Ref<{ name: string }>;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  called:  "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  failed:  "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
};

export function CampaignDetailClient({
  locale,
  campaign,
  targets,
  allContacts,
}: {
  locale: string;
  campaign: Campaign;
  targets: Target[];
  allContacts: Contact[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<{ kind: "error" | "warning" | "success"; text: string } | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const agentName = one(campaign.agent)?.name ?? "—";
  const targetContactIds = new Set(
    targets.map((t) => one(t.contact)?.id).filter(Boolean) as string[],
  );
  const available = allContacts.filter((c) => !targetContactIds.has(c.id));
  const pendingCount = targets.filter((t) => t.status === "pending").length;

  function togglePick(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    if (picked.size === 0) return;
    setNotice(null);
    startTransition(async () => {
      const r = await addTargetsAction(campaign.id, [...picked]);
      if (!r.ok) setNotice({ kind: "error", text: r.error ?? "Erreur" });
      else setPicked(new Set());
      router.refresh();
    });
  }

  function handleRemove(targetId: string) {
    setNotice(null);
    startTransition(async () => {
      const r = await removeTargetAction(targetId);
      if (!r.ok) setNotice({ kind: "error", text: r.error ?? "Erreur" });
      router.refresh();
    });
  }

  async function handleRun() {
    setRunning(true);
    setNotice(null);
    const r = await runCampaignAction(campaign.id);
    setRunning(false);
    if (!r.ok) setNotice({ kind: "error", text: r.error ?? "Erreur" });
    else if (r.warning) setNotice({ kind: "warning", text: r.warning });
    else setNotice({ kind: "success", text: "Campagne lancée — appels en cours." });
    startTransition(() => router.refresh());
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
            href={`/${locale}/dashboard/campaigns`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-180 hover:border-foreground/40 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold">{campaign.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Agent : {agentName} ·{" "}
              <span className="rounded-full bg-surface px-2 py-0.5 text-xs">{campaign.status}</span>
            </p>
            {campaign.description && (
              <p className="mt-1 text-sm text-muted-foreground">{campaign.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleRun}
          disabled={running || pending || pendingCount === 0}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-saffron-50 transition-colors duration-220 hover:bg-saffron-500 hover:text-ink-900 disabled:opacity-50 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
          Lancer ({pendingCount})
        </button>
      </div>

      {notice && (
        <div
          className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
            notice.kind === "error"
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
              : notice.kind === "warning"
              ? "border-amber-300/60 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300"
              : "border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-400"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Targets */}
        <div className="overflow-hidden rounded-3xl border border-border bg-elevated">
          <div className="border-b border-border bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Cibles ({targets.length})
          </div>
          {targets.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">
              Aucune cible. Ajoutez des contacts depuis le panneau de droite.
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {targets.map((t) => {
                  const c = one(t.contact);
                  return (
                    <tr key={t.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium">{c?.name ?? "—"}</td>
                      <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{c?.phone ?? "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLES[t.status] ?? STATUS_STYLES.pending}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleRemove(t.id)}
                          disabled={pending}
                          aria-label="Retirer la cible"
                          className="text-muted-foreground transition-colors hover:text-red-600 disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Add contacts */}
        <div className="rounded-3xl border border-border bg-elevated p-5">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Ajouter des contacts
          </h2>
          {available.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tous vos contacts sont déjà dans cette campagne.{" "}
              <Link href={`/${locale}/dashboard/contacts`} className="text-saffron-600 hover:underline">
                Gérer les contacts
              </Link>
            </p>
          ) : (
            <>
              <div className="max-h-72 space-y-1 overflow-y-auto">
                {available.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-surface"
                  >
                    <input
                      type="checkbox"
                      checked={picked.has(c.id)}
                      onChange={() => togglePick(c.id)}
                      className="h-4 w-4 accent-saffron-500"
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {c.name}{" "}
                      <span className="font-mono text-xs text-muted-foreground">{c.phone}</span>
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleAdd}
                disabled={pending || picked.size === 0}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-2 text-sm font-medium text-saffron-50 disabled:opacity-50 dark:bg-saffron-500 dark:text-ink-900"
              >
                <Plus className="h-4 w-4" /> Ajouter ({picked.size})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
