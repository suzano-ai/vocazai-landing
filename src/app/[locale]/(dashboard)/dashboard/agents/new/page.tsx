"use client";

import { useState, type ReactNode, type ChangeEvent, type FormEvent, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createAgentAction } from "../actions";
import { ArrowLeft, Bot, Loader2, Check, ChevronDown } from "lucide-react";

// ─── Form field helpers ────────────────────────────────────────────────────────
function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {children}
    </label>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-xs text-muted-foreground">{children}</p>;
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm transition-colors duration-180 placeholder:text-muted-foreground/60 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm transition-colors duration-180 placeholder:text-muted-foreground/60 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 resize-none ${props.className ?? ""}`}
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

// ─── LLM options ─────────────────────────────────────────────────────────────
const LLM_MODELS = [
  { value: "gpt-4o-mini",      label: "GPT-4o Mini — Fast & affordable" },
  { value: "gpt-4o",           label: "GPT-4o — Most capable" },
  { value: "claude-haiku-4-5", label: "Claude Haiku — Ultra fast" },
  { value: "claude-sonnet-4-6",label: "Claude Sonnet — Balanced" },
  { value: "mistral-small",    label: "Mistral Small — Low latency" },
];

// ─── Voice options per locale ─────────────────────────────────────────────────
const VOICE_IDS: Record<string, { value: string; label: string }[]> = {
  fr: [
    { value: "fr_FR-siwis-medium",     label: "Siwis — Voix féminine (Piper)" },
    { value: "JBFqnCBsd6RMkjVDRZzb",  label: "Georges — ElevenLabs FR" },
    { value: "pFZP5JQG7iQjIQuC4Bku",  label: "Lily — ElevenLabs FR" },
  ],
  en: [
    { value: "en_US-hfc_female-medium", label: "HFC Female — (Piper)" },
    { value: "EXAVITQu4vr4xnSDxMaL",  label: "Bella — ElevenLabs EN" },
    { value: "VR6AewLTigWG4xSOukaG",  label: "Arnold — ElevenLabs EN" },
  ],
  ar: [
    { value: "ar_JO-kareem-medium",    label: "Kareem — Voix masculine (Piper)" },
  ],
};

// ─── Default system prompt ────────────────────────────────────────────────────
function defaultPrompt(name: string, lang: string) {
  if (lang === "fr")
    return `Tu es ${name || "Yasmine"}, standardiste IA de l'entreprise. Tu réponds aux appels entrants, prends des rendez-vous et réponds aux questions fréquentes. Sois concise, professionnelle et chaleureuse. Tu parles exclusivement en français.`;
  if (lang === "ar")
    return `أنت ${name || "ياسمين"}، موظفة استقبال رقمية للشركة. تردّ على المكالمات الواردة، تحجز المواعيد وتجيب على الأسئلة الشائعة. كوني موجزة ومحترفة ودودة. تتحدثين باللغة العربية حصراً.`;
  return `You are ${name || "Yasmine"}, the company's AI receptionist. You handle inbound calls, book appointments, and answer FAQs. Be concise, professional, and warm. Speak exclusively in English.`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function NewAgentPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "fr";

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const [form, setForm] = useState({
    name:            "",
    provider:        "vapi",
    locale:          "fr",
    direction:       "inbound",
    llm_model:       "gpt-4o-mini",
    voice_vendor:    "piper",
    voice_id:        "fr_FR-siwis-medium",
    max_duration_sec: 300,
    first_message:   "",
    system_prompt:   defaultPrompt("", "fr"),
  });

  const set = (key: keyof typeof form) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      // Auto-regenerate system_prompt when name or locale changes
      if ((key === "name" || key === "locale") && !prev.system_prompt.startsWith("// ")) {
        next.system_prompt = defaultPrompt(
          key === "name" ? String(val) : prev.name,
          key === "locale" ? String(val) : prev.locale,
        );
      }
      // Reset voice_id when locale changes
      if (key === "locale") {
        const voices = VOICE_IDS[String(val)] ?? VOICE_IDS.fr;
        next.voice_id = voices[0].value;
      }
      return next;
    });
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setWarning(null);

    const result = await createAgentAction({
      name:             form.name,
      provider:         form.provider,
      locale:           form.locale,
      direction:        form.direction,
      llm_model:        form.llm_model,
      voice_vendor:     form.voice_vendor,
      voice_id:         form.voice_id,
      max_duration_sec: form.max_duration_sec,
      first_message:    form.first_message,
      system_prompt:    form.system_prompt,
      is_active:        true,
    });

    if (!result.ok) {
      setError(result.error ?? "Erreur lors de la création");
      setSaving(false);
      return;
    }

    setSaved(true);
    if (result.warning) setWarning(result.warning);
    setTimeout(() => {
      router.push(`/${locale}/dashboard/agents/${result.id}`);
    }, result.warning ? 2600 : 800);
  }

  const voiceOptions = VOICE_IDS[form.locale] ?? VOICE_IDS.fr;

  return (
    <div className="p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/${locale}/dashboard/agents`}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-180 hover:border-foreground/40 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Créer un agent</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configurez votre standardiste IA
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">

        {/* ── Left column — main config ─────────────────────────────────── */}
        <div className="space-y-6">

          {/* Identity */}
          <section className="rounded-2xl border border-border bg-elevated p-6">
            <h2 className="mb-5 flex items-center gap-2 font-display text-base font-semibold">
              <Bot className="h-4 w-4 text-saffron-500" />
              Identité de l&apos;agent
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Nom de l&apos;agent *</Label>
                <Input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Ex: Yasmine, Support Client, Réservations…"
                  required
                />
                <Hint>Ce nom apparaît dans vos logs et peut être utilisé dans le prompt.</Hint>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Langue</Label>
                  <Select value={form.locale} onChange={set("locale")}>
                    <option value="fr">Français (fr)</option>
                    <option value="en">English (en)</option>
                    <option value="ar">العربية (ar)</option>
                  </Select>
                </div>
                <div>
                  <Label>Direction</Label>
                  <Select value={form.direction} onChange={set("direction")}>
                    <option value="inbound">Entrant (répond aux appels)</option>
                    <option value="outbound">Sortant (passe des appels)</option>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          {/* Prompt */}
          <section className="rounded-2xl border border-border bg-elevated p-6">
            <h2 className="mb-1 font-display text-base font-semibold">Prompt système</h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Décrit qui est l&apos;agent, comment il se comporte, ce qu&apos;il peut faire.
            </p>
            <div className="space-y-4">
              <div>
                <Label>Message d&apos;accueil</Label>
                <Input
                  value={form.first_message}
                  onChange={set("first_message")}
                  placeholder={`Ex: Bonjour ! Je suis ${form.name || "Yasmine"}, comment puis-je vous aider ?`}
                />
                <Hint>Première phrase prononcée lorsque l&apos;appel est décroché.</Hint>
              </div>
              <div>
                <Label>Prompt système *</Label>
                <Textarea
                  value={form.system_prompt}
                  onChange={set("system_prompt")}
                  rows={8}
                  required
                  placeholder="Décrivez le comportement, le ton, les capacités de l'agent…"
                />
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Warning — saved, but provider deployment didn't complete */}
          {warning && (
            <div className="rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
              {warning}
            </div>
          )}
        </div>

        {/* ── Right column — technical settings ────────────────────────── */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-elevated p-5">
            <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Paramètres techniques
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Provider vocal</Label>
                <Select value={form.provider} onChange={set("provider")}>
                  <option value="vapi">Vapi</option>
                  <option value="retell">Retell AI</option>
                </Select>
              </div>
              <div>
                <Label>Modèle LLM</Label>
                <Select value={form.llm_model} onChange={set("llm_model")}>
                  {LLM_MODELS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>Voix</Label>
                <Select value={form.voice_vendor} onChange={set("voice_vendor")}>
                  <option value="piper">Piper (auto-hébergé)</option>
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="openai">OpenAI TTS</option>
                </Select>
              </div>
              <div>
                <Label>Voice ID</Label>
                <Select value={form.voice_id} onChange={set("voice_id")}>
                  {voiceOptions.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </Select>
                <Hint>Voix disponibles pour {form.locale === "fr" ? "le français" : form.locale === "ar" ? "l'arabe" : "l'anglais"}.</Hint>
              </div>
              <div>
                <Label>Durée max (secondes)</Label>
                <Input
                  type="number"
                  min={30}
                  max={3600}
                  value={form.max_duration_sec}
                  onChange={set("max_duration_sec")}
                />
                <Hint>L&apos;appel est raccroché après cette durée. 300 = 5 min.</Hint>
              </div>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || saved}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-3 text-sm font-semibold text-saffron-50 transition-all duration-220 hover:bg-saffron-500 hover:text-ink-900 disabled:opacity-60 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
          >
            {saved ? (
              <><Check className="h-4 w-4" /> Agent créé !</>
            ) : saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Création…</>
            ) : (
              "Créer l'agent"
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Vous pourrez modifier ces paramètres après création.
          </p>
        </div>
      </form>
    </div>
  );
}
