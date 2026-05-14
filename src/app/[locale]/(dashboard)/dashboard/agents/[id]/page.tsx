"use client";

import { useEffect, useState, type ReactNode, type ChangeEvent, type FormEvent, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updateAgentAction, deleteAgentAction } from "../actions";
import { ArrowLeft, Loader2, Check, Trash2, ChevronDown, AlertTriangle } from "lucide-react";

// ─── Shared field components ──────────────────────────────────────────────────
function Label({ children }: { children: ReactNode }) {
  return <label className="block text-sm font-medium text-foreground mb-1.5">{children}</label>;
}
function Hint({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}
function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 transition-colors duration-180 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 ${props.className ?? ""}`}
    />
  );
}
function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 transition-colors duration-180 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 resize-none ${props.className ?? ""}`}
    />
  );
}
function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full appearance-none rounded-xl border border-border bg-background px-3.5 py-2.5 pr-9 text-sm transition-colors duration-180 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 ${props.className ?? ""}`}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

const LLM_MODELS = [
  { value: "gpt-4o-mini",       label: "GPT-4o Mini" },
  { value: "gpt-4o",            label: "GPT-4o" },
  { value: "claude-haiku-4-5",  label: "Claude Haiku" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet" },
  { value: "mistral-small",     label: "Mistral Small" },
];

type Agent = {
  id: string;
  name: string;
  provider: string;
  locale: string;
  direction: string;
  is_active: boolean;
  system_prompt: string | null;
  first_message: string | null;
  voice_vendor: string | null;
  voice_id: string | null;
  llm_model: string | null;
  max_duration_sec: number | null;
  provider_agent_id: string | null;
  created_at: string;
};

export default function AgentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "fr";
  const id     = params?.id as string;

  const [agent,   setAgent]   = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  // Load agent
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("agents")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          router.push(`/${locale}/dashboard/agents`);
        } else {
          setAgent(data as Agent);
        }
        setLoading(false);
      });
  }, [id, locale, router]);

  const set = (key: keyof Agent) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setAgent((prev) => prev ? { ...prev, [key]: val } : prev);
    setSaved(false);
  };

  const toggle = (key: keyof Agent) => () => {
    setAgent((prev) => prev ? { ...prev, [key]: !prev[key as keyof Agent] } : prev);
    setSaved(false);
  };

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!agent) return;
    setSaving(true);
    setError(null);
    setWarning(null);

    const result = await updateAgentAction(id, {
      name:             agent.name,
      provider:         agent.provider,
      locale:           agent.locale,
      direction:        agent.direction,
      is_active:        agent.is_active,
      llm_model:        agent.llm_model ?? "gpt-4o-mini",
      voice_vendor:     agent.voice_vendor ?? "piper",
      voice_id:         agent.voice_id ?? "",
      max_duration_sec: agent.max_duration_sec ?? 300,
      first_message:    agent.first_message ?? "",
      system_prompt:    agent.system_prompt ?? "",
    });

    if (!result.ok) {
      setError(result.error ?? "Erreur lors de la sauvegarde");
    } else {
      setSaved(true);
      if (result.warning) setWarning(result.warning);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    setError(null);
    const result = await deleteAgentAction(id);
    if (!result.ok) {
      setError(result.error ?? "Erreur lors de la suppression");
      setDeleting(false);
      setConfirmDelete(false);
      return;
    }
    router.push(`/${locale}/dashboard/agents`);
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!agent) return null;

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/dashboard/agents`}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-180 hover:border-foreground/40 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold">{agent.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${agent.is_active ? "bg-saffron-50 text-saffron-700" : "bg-muted text-muted-foreground"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${agent.is_active ? "bg-saffron-500" : "bg-muted-foreground"}`} />
                {agent.is_active ? "Actif" : "Inactif"}
              </span>
              {agent.provider_agent_id && (
                <span className="ml-2 font-mono text-[10px]">{agent.provider}: {agent.provider_agent_id}</span>
              )}
            </p>
          </div>
        </div>

        {/* Active toggle */}
        <button
          type="button"
          onClick={toggle("is_active")}
          className={`rounded-full px-4 py-2 text-xs font-medium transition-colors duration-180 ${
            agent.is_active
              ? "bg-saffron-50 text-saffron-700 hover:bg-saffron-100"
              : "bg-muted text-muted-foreground hover:bg-elevated"
          }`}
        >
          {agent.is_active ? "Désactiver" : "Activer"}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">

        {/* ── Left: main config ─────────────────────────────────────────── */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-elevated p-6">
            <h2 className="mb-5 font-display text-base font-semibold">Identité</h2>
            <div className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input value={agent.name} onChange={set("name")} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Langue</Label>
                  <Select value={agent.locale} onChange={set("locale")}>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </Select>
                </div>
                <div>
                  <Label>Direction</Label>
                  <Select value={agent.direction} onChange={set("direction")}>
                    <option value="inbound">Entrant</option>
                    <option value="outbound">Sortant</option>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-elevated p-6">
            <h2 className="mb-5 font-display text-base font-semibold">Prompt</h2>
            <div className="space-y-4">
              <div>
                <Label>Message d&apos;accueil</Label>
                <Input
                  value={agent.first_message ?? ""}
                  onChange={set("first_message")}
                  placeholder="Bonjour, comment puis-je vous aider ?"
                />
              </div>
              <div>
                <Label>Prompt système</Label>
                <Textarea
                  value={agent.system_prompt ?? ""}
                  onChange={set("system_prompt")}
                  rows={10}
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {warning && (
            <div className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
              {warning}
            </div>
          )}
        </div>

        {/* ── Right: technical ──────────────────────────────────────────── */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-elevated p-5">
            <h2 className="mb-4 font-display text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Technique
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Provider</Label>
                <Select value={agent.provider} onChange={set("provider")}>
                  <option value="vapi">Vapi</option>
                  <option value="retell">Retell AI</option>
                </Select>
              </div>
              <div>
                <Label>Modèle LLM</Label>
                <Select value={agent.llm_model ?? "gpt-4o-mini"} onChange={set("llm_model")}>
                  {LLM_MODELS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Voice Vendor</Label>
                <Select value={agent.voice_vendor ?? "piper"} onChange={set("voice_vendor")}>
                  <option value="piper">Piper</option>
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="openai">OpenAI TTS</option>
                </Select>
              </div>
              <div>
                <Label>Voice ID</Label>
                <Input
                  value={agent.voice_id ?? ""}
                  onChange={set("voice_id")}
                  placeholder="Ex: fr_FR-siwis-medium"
                />
                <Hint>Identifiant de voix pour {agent.voice_vendor ?? "piper"}.</Hint>
              </div>
              <div>
                <Label>Durée max (s)</Label>
                <Input
                  type="number"
                  min={30}
                  max={3600}
                  value={agent.max_duration_sec ?? 300}
                  onChange={set("max_duration_sec")}
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-3 text-sm font-semibold text-saffron-50 transition-all duration-220 hover:bg-saffron-500 hover:text-ink-900 disabled:opacity-60 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
          >
            {saved ? (
              <><Check className="h-4 w-4" /> Sauvegardé</>
            ) : saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sauvegarde…</>
            ) : (
              "Sauvegarder"
            )}
          </button>

          {/* Delete zone */}
          <section className="rounded-2xl border border-red-200/60 bg-red-50/30 p-4 dark:border-red-900/30 dark:bg-red-950/10">
            <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              Zone dangereuse
            </h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Supprimer cet agent est irréversible. Tous les appels associés seront conservés.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-colors duration-180 ${
                confirmDelete
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/20"
              }`}
            >
              {deleting ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Suppression…</>
              ) : (
                <><Trash2 className="h-3.5 w-3.5" /> {confirmDelete ? "Confirmer la suppression" : "Supprimer l'agent"}</>
              )}
            </button>
            {confirmDelete && !deleting && (
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="mt-1.5 w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Annuler
              </button>
            )}
          </section>
        </div>
      </form>
    </div>
  );
}
