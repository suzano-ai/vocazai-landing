import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Phone, Calendar, Languages, ShieldCheck, Check, Sparkles } from "lucide-react";
import { Header } from "@/components/landing/header";
import { ZelligeStar, ZelligeBand } from "@/components/zellige";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="min-h-screen bg-background">
      <Header locale={locale} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Decorative zellige stars */}
        <ZelligeStar
          size={520}
          className="pointer-events-none absolute -right-32 -top-24 text-emerald-600/15 animate-spin-slow"
        />
        <ZelligeStar
          size={280}
          className="pointer-events-none absolute -left-20 top-72 text-saffron-500/20"
        />
        <div className="pointer-events-none absolute inset-0 bg-zellige opacity-40" />
        <div className="pointer-events-none absolute inset-0 grain opacity-50" />

        <div className="container relative pb-28 pt-20 lg:pt-28">
          {/* Kicker */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("landing.kicker")}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-display-xl">
            <span className="block text-foreground">{t("landing.heroTitle1")}</span>
            <span className="block">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-saffron-500 bg-clip-text text-transparent">
                {t("landing.heroTitle2")}
              </span>
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {t("landing.heroSubtitle")}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/login`}
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-base font-medium text-sand-50 transition hover:bg-emerald-700"
            >
              {t("landing.ctaPrimary")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-base font-medium transition hover:bg-surface"
            >
              {t("landing.ctaSecondary")}
            </a>
          </div>

          {/* Live indicator + stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:max-w-3xl sm:grid-cols-4">
            <Stat label={t("landing.stats.available")} value="24/7" />
            <Stat label={t("landing.stats.languages")} value="3+" />
            <Stat label={t("landing.stats.latency")} value="< 800ms" />
            <Stat label="—" value={t("landing.stats.missed")} accent />
          </div>

          {/* Live agent demo card */}
          <div className="mt-16 max-w-md rounded-2xl border border-border bg-elevated p-5 shadow-2xl shadow-emerald-900/5">
            <div className="flex items-center gap-3">
              <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-emerald-600">
                <Phone className="h-5 w-5 text-sand-50" />
                <span className="pulse-dot absolute -right-1 -top-1 ring-2 ring-elevated" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Yasmine, l&apos;agent VocazAI</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t("common.live")} · 14:32
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 items-center rounded-full bg-saffron-50 px-2 text-[10px] font-medium uppercase tracking-wide text-saffron-600">Client</span>
                <p className="text-muted-foreground">Bonjour, je voudrais un rendez-vous mercredi matin si possible.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 text-[10px] font-medium uppercase tracking-wide text-emerald-700">Agent</span>
                <p>Bien sûr. J&apos;ai 9h30 ou 11h15 mercredi. Lequel vous arrange ?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ZELLIGE BAND ================= */}
      <div className="relative border-y border-border/60 bg-surface py-3">
        <ZelligeBand className="h-6 w-full text-emerald-600/70" />
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="relative py-24 sm:py-32">
        <div className="container">
          <div className="mb-16 max-w-2xl">
            <div className="mb-4 text-xs font-medium uppercase tracking-widest text-emerald-600">01 · Process</div>
            <h2 className="font-display text-display-lg">{t("landing.howItWorks.title")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("landing.howItWorks.subtitle")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Step
              num="01"
              title={t("landing.howItWorks.step1Title")}
              body={t("landing.howItWorks.step1Body")}
              icon={<Languages className="h-5 w-5" />}
            />
            <Step
              num="02"
              title={t("landing.howItWorks.step2Title")}
              body={t("landing.howItWorks.step2Body")}
              icon={<Sparkles className="h-5 w-5" />}
            />
            <Step
              num="03"
              title={t("landing.howItWorks.step3Title")}
              body={t("landing.howItWorks.step3Body")}
              icon={<Phone className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section id="uses" className="relative border-y border-border/60 bg-surface py-24 sm:py-32">
        <div className="container">
          <div className="mb-16 max-w-2xl">
            <div className="mb-4 text-xs font-medium uppercase tracking-widest text-saffron-600">02 · Industries</div>
            <h2 className="font-display text-display-lg">{t("landing.useCases.title")}</h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
            <UseCase title={t("landing.useCases.clinic")} body={t("landing.useCases.clinicBody")} accent="emerald" icon={<Calendar className="h-5 w-5" />} />
            <UseCase title={t("landing.useCases.realty")} body={t("landing.useCases.realtyBody")} accent="saffron" icon={<Phone className="h-5 w-5" />} />
            <UseCase title={t("landing.useCases.ecom")} body={t("landing.useCases.ecomBody")} accent="terracotta" icon={<ShieldCheck className="h-5 w-5" />} />
            <UseCase title={t("landing.useCases.restau")} body={t("landing.useCases.restauBody")} accent="emerald" icon={<Languages className="h-5 w-5" />} />
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="container">
          <div className="mb-16 max-w-2xl">
            <div className="mb-4 text-xs font-medium uppercase tracking-widest text-emerald-600">03 · Pricing</div>
            <h2 className="font-display text-display-lg">{t("landing.pricing.title")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("landing.pricing.subtitle")}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <PriceCard
              name={t("landing.pricing.starter")}
              price={t("landing.pricing.starterPrice")}
              body={t("landing.pricing.starterBody")}
              cta={t("landing.pricing.cta")}
              href={`/${locale}/login`}
            />
            <PriceCard
              featured
              name={t("landing.pricing.growth")}
              price={t("landing.pricing.growthPrice")}
              body={t("landing.pricing.growthBody")}
              cta={t("landing.pricing.cta")}
              href={`/${locale}/login`}
            />
            <PriceCard
              name={t("landing.pricing.enterprise")}
              price="—"
              body={t("landing.pricing.enterpriseBody")}
              cta={t("landing.pricing.ctaContact")}
              href="https://wa.me/33777345056"
            />
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="relative border-t border-border/60 bg-surface py-24 sm:py-32">
        <div className="container max-w-4xl">
          <div className="mb-16">
            <div className="mb-4 text-xs font-medium uppercase tracking-widest text-saffron-600">04 · FAQ</div>
            <h2 className="font-display text-display-lg">{t("landing.faq.title")}</h2>
          </div>
          <div className="divide-y divide-border">
            <Faq q={t("landing.faq.q1")} a={t("landing.faq.a1")} />
            <Faq q={t("landing.faq.q2")} a={t("landing.faq.a2")} />
            <Faq q={t("landing.faq.q3")} a={t("landing.faq.a3")} />
            <Faq q={t("landing.faq.q4")} a={t("landing.faq.a4")} />
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative overflow-hidden bg-emerald-900 py-24 text-sand-50 sm:py-32">
        <ZelligeStar
          size={600}
          className="pointer-events-none absolute -right-32 -top-32 text-saffron-500/20 animate-spin-slow"
        />
        <ZelligeStar
          size={400}
          className="pointer-events-none absolute -bottom-24 -left-20 text-emerald-500/30"
        />
        <div className="container relative">
          <div className="max-w-3xl">
            <h2 className="font-display text-display-lg">{t("landing.finalCta.title")}</h2>
            <p className="mt-4 text-lg text-sand-50/80">{t("landing.finalCta.body")}</p>
            <Link
              href={`/${locale}/login`}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-saffron-500 px-7 py-4 text-base font-medium text-emerald-900 transition hover:bg-saffron-400"
            >
              {t("landing.finalCta.cta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 font-display font-bold text-sand-50">V</span>
            <div>
              <div className="font-display font-semibold">VocazAI</div>
              <div className="text-xs text-muted-foreground">{t("landing.footer.tagline")}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {t("landing.footer.made")} · © {new Date().getFullYear()} · {t("landing.footer.rights")}
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Small composable atoms (kept colocated for readability) ---------- */

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-elevated/50 p-4 backdrop-blur">
      <div className={`font-display text-2xl font-bold ${accent ? "text-saffron-500" : "text-emerald-600"}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Step({
  num,
  title,
  body,
  icon,
}: {
  num: string;
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-elevated p-7 transition hover:border-emerald-600/40">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{num}</span>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
          {icon}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function UseCase({
  title,
  body,
  accent,
  icon,
}: {
  title: string;
  body: string;
  accent: "emerald" | "saffron" | "terracotta";
  icon: React.ReactNode;
}) {
  const accentClass =
    accent === "emerald"
      ? "text-emerald-600 bg-emerald-50"
      : accent === "saffron"
      ? "text-saffron-600 bg-saffron-50"
      : "text-terracotta-700 bg-saffron-50";
  return (
    <div className="group bg-elevated p-7 transition hover:bg-surface">
      <div className={`mb-5 inline-grid h-10 w-10 place-items-center rounded-xl ${accentClass}`}>{icon}</div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function PriceCard({
  name,
  price,
  body,
  cta,
  href,
  featured = false,
}: {
  name: string;
  price: string;
  body: string;
  cta: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-7 ${
        featured
          ? "border-emerald-600 bg-elevated shadow-xl shadow-emerald-900/10"
          : "border-border bg-elevated"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-saffron-500 px-3 py-1 text-xs font-semibold text-emerald-900">
          <Check className="h-3 w-3" /> Recommandé
        </div>
      )}
      <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{name}</div>
      <div className="mt-3 font-display text-4xl font-bold">
        {price} <span className="text-sm font-normal text-muted-foreground">/ mois</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      <Link
        href={href}
        className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
          featured
            ? "bg-emerald-600 text-sand-50 hover:bg-emerald-700"
            : "border border-border hover:bg-surface"
        }`}
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
      </Link>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-6">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <span className="font-display text-lg font-semibold">{q}</span>
        <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-emerald-600 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 max-w-3xl text-muted-foreground">{a}</p>
    </details>
  );
}
