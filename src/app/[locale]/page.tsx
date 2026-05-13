import { setRequestLocale, getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Phone,
  Calendar,
  Languages,
  ShieldCheck,
  Plus,
  Check,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Khatam, Waveform } from "@/components/zellige";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header locale={locale} />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Decorative khatam, top-right */}
        <Khatam
          size={520}
          className="pointer-events-none absolute -right-32 -top-16 text-saffron-500/12"
        />
        <div className="pointer-events-none absolute inset-0 paper" />

        <div className="container relative grid gap-16 pb-24 pt-16 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:pb-32 lg:pt-24">
          {/* LEFT — copy */}
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
              <span className="font-mono text-kicker uppercase text-muted-foreground">
                {t("landing.kicker")}
              </span>
            </div>

            <h1 className="font-display text-display-2xl font-medium">
              <span className="block">{t("landing.heroTitle1")}</span>
              <span className="block italic text-saffron-500">
                {t("landing.heroTitle2")}
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {t("landing.heroSubtitle")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/login`}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-medium text-saffron-50 transition-all duration-220 ease-soft hover:bg-saffron-500 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/50 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
              >
                {t("landing.ctaPrimary")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
              </Link>
              <a
                href="#how"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-elevated px-6 py-3.5 text-sm font-medium transition-colors duration-220 ease-soft hover:border-foreground"
              >
                {t("landing.ctaSecondary")}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </a>
            </div>

            {/* Tiny stats row */}
            <dl className="mt-16 grid max-w-md grid-cols-3 gap-6">
              <Stat value="24/7" label={t("landing.stats.available")} />
              <Stat value="< 800ms" label={t("landing.stats.latency")} />
              <Stat value="FR · AR · EN" label={t("landing.stats.languages")} />
            </dl>
          </div>

          {/* RIGHT — Live call card */}
          <div className="relative">
            <Khatam
              size={300}
              className="pointer-events-none absolute -right-8 -top-10 text-teal-500/10"
            />
            <DemoCallCard t={t} />
          </div>
        </div>

        <div className="hr-thin" />
      </section>

      {/* ============ TRUST / MARQUEE ============ */}
      <section className="border-b border-border bg-surface/50 py-10">
        <div className="container mb-5 text-center">
          <span className="font-mono text-kicker uppercase text-muted-foreground">
            {t("landing.trustBar")}
          </span>
        </div>
        <div className="marquee">
          <div className="marquee__track text-muted-foreground/60">
            {[
              "Cabinet médical Atlas",
              "Agence Immo Casa-Plage",
              "Restaurant Dar Zen",
              "Pharmacie Bouregreg",
              "Hôtel Riad Marrakech",
              "Studio Yoga Rabat",
              "Garage Bouznika Auto",
            ]
              .concat([
                "Cabinet médical Atlas",
                "Agence Immo Casa-Plage",
                "Restaurant Dar Zen",
                "Pharmacie Bouregreg",
                "Hôtel Riad Marrakech",
                "Studio Yoga Rabat",
                "Garage Bouznika Auto",
              ])
              .map((name, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap font-display text-2xl font-medium italic"
                >
                  {name}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="py-28 sm:py-36">
        <div className="container">
          <div className="mb-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <SectionKicker number="01" label="Process" color="saffron" />
              <h2 className="mt-4 font-display text-display-lg font-medium">
                {t("landing.howItWorks.title")}
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              {t("landing.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg bg-border md:grid-cols-3">
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
              icon={<ShieldCheck className="h-5 w-5" />}
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

      {/* ============ USE CASES ============ */}
      <section id="uses" className="border-y border-border bg-surface/40 py-28 sm:py-36">
        <div className="container">
          <div className="mb-20 max-w-2xl">
            <SectionKicker number="02" label="Industries" color="teal" />
            <h2 className="mt-4 font-display text-display-lg font-medium">
              {t("landing.useCases.title")}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <UseCase
              title={t("landing.useCases.clinic")}
              body={t("landing.useCases.clinicBody")}
              icon={<Calendar className="h-5 w-5" />}
            />
            <UseCase
              title={t("landing.useCases.realty")}
              body={t("landing.useCases.realtyBody")}
              icon={<Phone className="h-5 w-5" />}
            />
            <UseCase
              title={t("landing.useCases.ecom")}
              body={t("landing.useCases.ecomBody")}
              icon={<ShieldCheck className="h-5 w-5" />}
            />
            <UseCase
              title={t("landing.useCases.restau")}
              body={t("landing.useCases.restauBody")}
              icon={<Languages className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="py-28 sm:py-36">
        <div className="container">
          <div className="mb-20 max-w-2xl">
            <SectionKicker number="03" label="Pricing" color="saffron" />
            <h2 className="mt-4 font-display text-display-lg font-medium">
              {t("landing.pricing.title")}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              {t("landing.pricing.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <PriceCard
              name={t("landing.pricing.starter")}
              price={t("landing.pricing.starterPrice")}
              body={t("landing.pricing.starterBody")}
              cta={t("landing.pricing.cta")}
              href={`/${locale}/login`}
              features={["100 min/mois", "1 agent", "1 langue", "Email support"]}
            />
            <PriceCard
              featured
              name={t("landing.pricing.growth")}
              price={t("landing.pricing.growthPrice")}
              body={t("landing.pricing.growthBody")}
              cta={t("landing.pricing.cta")}
              href={`/${locale}/login`}
              features={[
                "500 min/mois",
                "3 agents",
                "Multilingue (FR/AR/EN)",
                "Intégration CRM",
                "Support prioritaire",
              ]}
            />
            <PriceCard
              name={t("landing.pricing.enterprise")}
              price="—"
              body={t("landing.pricing.enterpriseBody")}
              cta={t("landing.pricing.ctaContact")}
              href="https://wa.me/33777345056"
              features={[
                "Volume illimité",
                "SLA dédié",
                "Intégrations custom",
                "Manager dédié",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="border-t border-border bg-surface/40 py-28 sm:py-36">
        <div className="container max-w-4xl">
          <div className="mb-16">
            <SectionKicker number="04" label="FAQ" color="teal" />
            <h2 className="mt-4 font-display text-display-lg font-medium">
              {t("landing.faq.title")}
            </h2>
          </div>
          <div className="divide-y divide-border">
            <Faq q={t("landing.faq.q1")} a={t("landing.faq.a1")} />
            <Faq q={t("landing.faq.q2")} a={t("landing.faq.a2")} />
            <Faq q={t("landing.faq.q3")} a={t("landing.faq.a3")} />
            <Faq q={t("landing.faq.q4")} a={t("landing.faq.a4")} />
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden bg-ink-900 py-28 text-saffron-50 sm:py-36">
        <Khatam
          size={620}
          className="pointer-events-none absolute -right-32 -top-32 text-saffron-500/12"
        />
        <Khatam
          size={400}
          className="pointer-events-none absolute -bottom-20 -left-24 text-teal-500/12"
        />
        <div className="container relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 font-mono text-kicker uppercase text-saffron-400">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
              Conclure
            </span>
            <h2 className="mt-6 font-display text-display-xl font-medium">
              {t("landing.finalCta.title")}
            </h2>
            <p className="mt-6 max-w-xl text-lg text-saffron-50/70">
              {t("landing.finalCta.body")}
            </p>
            <Link
              href={`/${locale}/login`}
              className="group mt-12 inline-flex cursor-pointer items-center gap-2 rounded-full bg-saffron-500 px-7 py-4 text-base font-medium text-ink-900 transition-all duration-220 ease-soft hover:bg-saffron-400 hover:gap-3"
            >
              {t("landing.finalCta.cta")}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-ink-900 font-display font-extrabold italic text-saffron-500 dark:bg-saffron-500 dark:text-ink-900">
              V
            </span>
            <div>
              <div className="font-display font-semibold">VocazAI</div>
              <div className="text-xs text-muted-foreground">
                {t("landing.footer.tagline")}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {t("landing.footer.made")} · © {new Date().getFullYear()} ·{" "}
            {t("landing.footer.rights")}
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ===================== Sub-components ===================== */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-semibold tabular-nums">
        {value}
      </dt>
      <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dd>
    </div>
  );
}

function SectionKicker({
  number,
  label,
  color,
}: {
  number: string;
  label: string;
  color: "saffron" | "teal";
}) {
  const dotColor = color === "saffron" ? "bg-saffron-500" : "bg-teal-500";
  return (
    <div className="inline-flex items-center gap-2.5">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span className="font-mono text-kicker uppercase text-muted-foreground">
        {number} — {label}
      </span>
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
    <div className="group relative bg-elevated p-8 transition-colors duration-220 hover:bg-surface lg:p-10">
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs text-muted-foreground">{num}</span>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors duration-220 group-hover:border-saffron-500 group-hover:text-saffron-500">
          {icon}
        </span>
      </div>
      <h3 className="mt-10 font-display text-2xl font-medium">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function UseCase({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative cursor-default rounded-lg border border-border bg-elevated p-6 transition-all duration-220 ease-soft hover:-translate-y-0.5 hover:border-saffron-500">
      <span className="mb-6 inline-grid h-10 w-10 place-items-center rounded-full bg-saffron-50 text-saffron-600 dark:bg-saffron-50 dark:text-saffron-500">
        {icon}
      </span>
      <h3 className="font-display text-lg font-medium">{title}</h3>
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
  features,
  featured = false,
}: {
  name: string;
  price: string;
  body: string;
  cta: string;
  href: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-lg border bg-elevated p-8 transition-colors duration-220 ${
        featured ? "border-saffron-500" : "border-border"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-8 inline-flex items-center gap-1 rounded-full bg-saffron-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-900">
          Recommandé
        </div>
      )}
      <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {name}
      </div>
      <div className="mt-4 font-display text-4xl font-medium tabular-nums">
        {price}
        {price !== "—" && (
          <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
            / mois
          </span>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      <ul className="my-8 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-saffron-500" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-220 ease-soft ${
          featured
            ? "bg-ink-900 text-saffron-50 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
            : "border border-border hover:border-foreground"
        }`}
      >
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5 rtl:scale-x-[-1]" />
      </Link>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group cursor-pointer py-6">
      <summary className="flex list-none items-start justify-between gap-6">
        <span className="font-display text-xl font-medium transition-colors duration-220 group-hover:text-saffron-600">
          {q}
        </span>
        <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-220 group-open:rotate-45 group-open:border-saffron-500 group-open:text-saffron-500">
          <Plus className="h-3.5 w-3.5" />
        </span>
      </summary>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        {a}
      </p>
    </details>
  );
}

function DemoCallCard({ t }: { t: any }) {
  return (
    <div className="rounded-2xl border border-border bg-elevated p-6 shadow-xl shadow-ink-900/5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-full bg-ink-900 text-saffron-500 dark:bg-saffron-500 dark:text-ink-900">
            <Phone className="h-5 w-5" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-saffron-500 ring-2 ring-elevated" />
          </div>
          <div>
            <div className="font-display text-base font-medium">Yasmine</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron-500" />
              {t("common.live")} · 14:32
            </div>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Demo
        </span>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <Waveform className="text-saffron-500" />
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <Bubble role="caller">
          Bonjour, je voudrais un rendez-vous mercredi matin.
        </Bubble>
        <Bubble role="agent">
          Bien sûr. J&apos;ai 9h30 ou 11h15 mercredi. Lequel vous arrange ?
        </Bubble>
        <Bubble role="caller">9h30, ça marche.</Bubble>
        <Bubble role="agent">
          Parfait. Je note pour Mercredi 9h30. Votre nom complet, s&apos;il vous
          plaît ?
        </Bubble>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span>FR · transcription temps réel</span>
        <span className="font-mono">00:42</span>
      </div>
    </div>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "caller" | "agent";
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 font-mono text-[9px] uppercase tracking-wider ${
          role === "caller"
            ? "bg-surface text-muted-foreground"
            : "bg-saffron-500 text-ink-900"
        }`}
      >
        {role === "caller" ? "Client" : "Agent"}
      </span>
      <p
        className={`flex-1 leading-relaxed ${
          role === "caller" ? "text-muted-foreground" : ""
        }`}
      >
        {children}
      </p>
    </div>
  );
}
