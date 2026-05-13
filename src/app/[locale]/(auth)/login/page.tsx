"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { ZelligeStar } from "@/components/zellige";

export default function LoginPage() {
  const t = useTranslations("common");
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
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
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
      <ZelligeStar
        size={520}
        className="pointer-events-none absolute -right-32 -top-20 text-emerald-600/15 animate-spin-slow"
      />
      <ZelligeStar
        size={320}
        className="pointer-events-none absolute -bottom-20 -left-20 text-saffron-500/15"
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          Retour
        </Link>

        <div className="rounded-3xl border border-border bg-elevated p-8 shadow-2xl">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 font-display font-bold text-sand-50">V</span>
            <span className="font-display text-lg font-semibold">VocazAI</span>
          </div>

          <h1 className="font-display text-2xl font-bold">{t("signIn")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Un lien magique par email — pas de mot de passe à retenir.
          </p>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-emerald-600/30 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <div className="font-medium text-emerald-700">Vérifiez votre boîte mail</div>
                  <p className="mt-1 text-sm text-emerald-700/80">
                    Un lien a été envoyé à <b>{email}</b>. Cliquez dessus pour vous connecter.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  placeholder="you@company.com"
                />
              </div>
              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 font-medium text-sand-50 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? t("loading") : "Envoyer le lien"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            En continuant, vous acceptez nos conditions et politique de confidentialité.
          </p>
        </div>
      </div>
    </main>
  );
}
