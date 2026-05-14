"use client";

import { useEffect, useState, type ReactNode, type InputHTMLAttributes } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2, User, CreditCard, Key, Trash2, AlertTriangle } from "lucide-react";

// Plan accent colours — labels/prices/features come from i18n.
const PLAN_COLORS: Record<string, string> = {
  free:       "bg-muted text-muted-foreground",
  starter:    "bg-saffron-50 text-saffron-700",
  growth:     "bg-blue-50 text-blue-700",
  enterprise: "bg-purple-50 text-purple-700",
};
const PLAN_KEYS = ["free", "starter", "growth", "enterprise"] as const;

function Section({ title, icon, children }: {
  title: string; icon: ReactNode; children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-elevated p-6">
      <h2 className="mb-5 flex items-center gap-2 font-display text-base font-semibold">
        <span className="text-saffron-500">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 transition-colors duration-180 focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-500/20 disabled:opacity-60"
    />
  );
}

export default function SettingsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "fr";
  const t = useTranslations("dashboard.settings");

  const [user, setUser]         = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile]   = useState<{ full_name: string | null; plan: string } | null>(null);
  const [name, setName]         = useState("");
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [delConfirm, setDelConfirm] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUser({ id: user.id, email: user.email ?? "" });
      const { data } = await supabase.from("profiles").select("full_name, plan").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setName(data.full_name ?? "");
      }
      setLoading(false);
    });
  }, []);

  async function saveName() {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({ full_name: name.trim() || null }).eq("id", user.id);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  // ── Billing — Stripe Checkout / Customer Portal ────────────────────────────
  async function handleUpgrade() {
    setBillingLoading(true);
    const target = (profile?.plan ?? "free") === "free" ? "starter" : "growth";
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: target }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // external Stripe domain
      } else {
        setBillingLoading(false);
        alert(data.error ?? t("billing.error"));
      }
    } catch {
      setBillingLoading(false);
      alert(t("billing.error"));
    }
  }

  async function handleManage() {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setBillingLoading(false);
        alert(data.error ?? t("billing.error"));
      }
    } catch {
      setBillingLoading(false);
      alert(t("billing.error"));
    }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/${locale}/login`;
  }

  async function deleteAccount() {
    if (!delConfirm) { setDelConfirm(true); return; }
    const supabase = createClient();
    await supabase.auth.signOut();
    alert(t("danger.deleteAlert"));
    window.location.href = `/${locale}`;
  }

  const plan = profile?.plan ?? "free";
  const planColor = PLAN_COLORS[plan] ?? PLAN_COLORS.free;
  const planFeatures = t.raw(`plans.${PLAN_KEYS.includes(plan as typeof PLAN_KEYS[number]) ? plan : "free"}.features`) as string[];

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
        <p className="mt-1.5 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:max-w-2xl">

        {/* ── Profile ───────────────────────────────────────────────────── */}
        <Section title={t("profile.title")} icon={<User className="h-4 w-4" />}>
          <div className="space-y-4">
            <Field label={t("profile.emailLabel")} hint={t("profile.emailHint")}>
              <Input value={user?.email ?? ""} disabled />
            </Field>
            <Field label={t("profile.nameLabel")}>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("profile.namePlaceholder")}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
              />
            </Field>
            <button
              onClick={saveName}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-medium text-saffron-50 transition-all duration-220 hover:bg-saffron-500 hover:text-ink-900 disabled:opacity-60 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
            >
              {saved ? <><Check className="h-3.5 w-3.5" /> {t("profile.saved")}</> : saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("profile.saving")}</> : t("profile.save")}
            </button>
          </div>
        </Section>

        {/* ── Plan ──────────────────────────────────────────────────────── */}
        <Section title={t("billing.title")} icon={<CreditCard className="h-4 w-4" />}>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
            <div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${planColor}`}>
                {t(`plans.${plan}.label`)}
              </span>
              <p className="mt-1.5 text-sm text-muted-foreground">{t(`plans.${plan}.price`)}</p>
              <ul className="mt-2 space-y-0.5">
                {planFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-saffron-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {plan === "free" || plan === "starter" ? (
              <button
                onClick={handleUpgrade}
                disabled={billingLoading}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-saffron-50 transition-colors duration-220 hover:bg-saffron-500 hover:text-ink-900 disabled:opacity-60 dark:bg-saffron-500 dark:text-ink-900"
              >
                {billingLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                {t("billing.upgrade")}
              </button>
            ) : (
              <button
                onClick={handleManage}
                disabled={billingLoading}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors duration-180 hover:text-foreground disabled:opacity-60"
              >
                {billingLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                {t("billing.manage")}
              </button>
            )}
          </div>
        </Section>

        {/* ── API Keys ──────────────────────────────────────────────────── */}
        <Section title={t("apiKeys.title")} icon={<Key className="h-4 w-4" />}>
          <p className="mb-4 text-sm text-muted-foreground">{t("apiKeys.description")}</p>
          <div className="space-y-3">
            <Field label={t("apiKeys.projectId")} hint={t("apiKeys.projectIdHint")}>
              <Input value={user?.id ?? "—"} disabled className="font-mono text-xs" />
            </Field>
            <Field label={t("apiKeys.publicKey")} hint={t("apiKeys.publicKeyHint")}>
              <Input value={`vz_pub_${(user?.id ?? "").slice(0, 12)}...`} disabled className="font-mono text-xs" />
            </Field>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("apiKeys.secretNote")}{" "}
            <a href="mailto:api@vocazai.com" className="text-saffron-600 hover:underline">api@vocazai.com</a>.
          </p>
        </Section>

        {/* ── Danger zone ───────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-red-200/60 bg-red-50/20 p-6 dark:border-red-900/30 dark:bg-red-950/10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            {t("danger.title")}
          </h2>
          <div className="space-y-3">
            <button
              onClick={signOut}
              className="w-full rounded-full border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-180 hover:border-foreground/40 hover:text-foreground"
            >
              {t("danger.signOut")}
            </button>
            <button
              onClick={deleteAccount}
              className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors duration-180 ${
                delConfirm
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              {delConfirm ? t("danger.deleteConfirm") : t("danger.delete")}
            </button>
            {delConfirm && (
              <button onClick={() => setDelConfirm(false)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                {t("danger.cancel")}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
