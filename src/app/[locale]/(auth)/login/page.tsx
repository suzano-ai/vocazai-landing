"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Khatam } from "@/components/zellige";

export default function LoginPage() {
  const t = useTranslations("common");
  const params = useParams();
  const locale = (params?.locale as string) ?? "fr";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      // Carry the locale through the email round-trip so the callback lands
      // on the right locale-prefixed dashboard.
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/${locale}/dashboard`,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background p-6">
      <Khatam
        size={520}
        className="pointer-events-none absolute -right-32 -top-20 text-saffron-500/12"
      />
      <Khatam
        size={320}
        className="pointer-events-none absolute -bottom-20 -left-20 text-teal-500/10"
      />
      <div className="pointer-events-none absolute inset-0 paper" />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-180 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          Retour
        </Link>

        <div className="rounded-2xl border border-border bg-elevated p-8 shadow-xl shadow-ink-900/5">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-ink-900 font-display text-base font-extrabold italic text-saffron-500 dark:bg-saffron-500 dark:text-ink-900">
              V
            </span>
            <span className="font-display text-lg font-semibold">VocazAI</span>
          </div>

          <h1 className="font-display text-3xl font-medium">{t("signIn")}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Un lien magique par email — pas de mot de passe à retenir.
          </p>

          {sent ? (
            <div className="mt-6 rounded-lg border border-saffron-500/30 bg-saffron-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-saffron-600" />
                <div>
                  <div className="font-medium text-saffron-700">
                    Vérifiez votre boîte mail
                  </div>
                  <p className="mt-1 text-sm text-saffron-700/80">
                    Un lien a été envoyé à <b>{email}</b>. Cliquez dessus pour
                    vous connecter.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="font-mono text-kicker uppercase text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 block w-full rounded-md border border-input bg-background px-4 py-2.5 text-foreground outline-none transition-colors duration-180 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/30"
                  placeholder="you@company.com"
                />
              </div>
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full cursor-pointer rounded-full bg-ink-900 px-4 py-3 text-sm font-medium text-saffron-50 transition-colors duration-220 ease-soft hover:bg-saffron-500 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
              >
                {loading ? t("loading") : "Envoyer le lien"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground">
            En continuant, vous acceptez nos conditions et politique de
            confidentialité.
          </p>
        </div>
      </div>
    </main>
  );
}
