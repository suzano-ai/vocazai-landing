import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
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
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { DemoCallCard } from "@/components/landing/demo-call-card";
import { AICanvas } from "@/components/ai-canvas";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { WaveformRule } from "@/components/waveform-rule";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en", ar: "/ar", "x-default": "/fr" },
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  // All demo / convert CTAs open WhatsApp with a pre-filled message.
  const wa = `https://wa.me/33777345056?text=${encodeURIComponent(t("common.whatsapp"))}`;

  // FAQ structured data (rich result). Organization + SoftwareApplication
  // are emitted site-wide from the root layout.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((i) => ({
      "@type": "Question",
      name: t(`landing.faq.q${i}`),
      acceptedAnswer: { "@type": "Answer", text: t(`landing.faq.a${i}`) },
    })),
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header locale={locale} />
      <JsonLd data={faqJsonLd} />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden">

        {/* Background — interactive neural-particle field at the back. */}
        <AICanvas className="pointer-events-none absolute inset-0 h-full w-full" />

        {/* Soft vignette — pulls focus to the content, adds depth. */}
        <div className="hero-vignette pointer-events-none absolute inset-0" />

        {/* Editorial cover-numeral — replaces every zellige ornament. The
            massive italic "01" anchors the hero like a magazine cover number. */}
        <div
          aria-hidden
          className="cover-numeral pointer-events-none absolute -bottom-8 right-4 select-none sm:right-12"
        >
          01
        </div>
        {/* Waveform-rule — the only structural ornament of the new system. */}
        <div className="pointer-events-none absolute inset-x-0 top-16 text-foreground/20">
          <WaveformRule variant="active" />
        </div>

        <div className="container relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-0">
          {/* LEFT — copy */}
          <div className="max-w-xl">
            <Reveal>
              <div className="mb-8 inline-flex items-center gap-2.5 border-y border-saffron-500/40 bg-saffron-500/8 px-4 py-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-saffron-500" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-saffron-700 dark:text-saffron-400">
                  {t("landing.kicker")}
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="font-display text-display-xl font-medium leading-[0.95] tracking-tight lg:text-display-2xl">
                <span className="block">{t("landing.heroTitle1")}</span>
                <span className="relative block italic text-saffron-500">
                  {t("landing.heroTitle2")}
                  {/* Editorial underline — hand-drawn feel. */}
                  <svg
                    aria-hidden
                    viewBox="0 0 200 8"
                    className="absolute -bottom-1 left-0 h-2 w-[42%] text-saffron-500/60"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 2 5 Q 50 1, 100 4 T 198 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("landing.heroSubtitle")}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={wa}
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
            </Reveal>

            <Reveal delay={320}>
              <dl className="mt-7 grid max-w-md grid-cols-3 gap-3 divide-x divide-border border-t border-border pt-5 sm:gap-6">
                <Stat value="24/7" label={t("landing.stats.available")} />
                <Stat value="< 800ms" label={t("landing.stats.latency")} />
                <Stat value="FR · AR · EN" label={t("landing.stats.languages")} />
              </dl>
            </Reveal>
          </div>

          {/* RIGHT — Live call card */}
          <Reveal delay={200}>
            <div className="relative">
              <DemoCallCard key={locale} locale={locale} />
            </div>
          </Reveal>
        </div>

        <div className="hr-thin" />
      </section>

      {/* ============ TRUST MARQUEE ============ */}
      {/* Names separated by a mono asterisk — magazine-style folio rule. */}
      <section className="relative border-y border-border bg-surface/50 py-12">
        <div className="container mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-border" />
          <span className="font-mono text-kicker uppercase text-muted-foreground">
            {t("landing.trustBar")}
          </span>
          <span className="h-px w-12 bg-border" />
        </div>
        <div className="marquee">
          <div className="marquee__track text-muted-foreground/65">
            {[
              "Clinique Solène",
              "Atelier Vega",
              "Studio Lumen",
              "Maison Aurora",
              "Cabinet Botanique",
              "Refuge Olive",
              "Bureau Calame",
              "Pharmacie Méridienne",
            ]
              .concat([
                "Clinique Solène",
                "Atelier Vega",
                "Studio Lumen",
                "Maison Aurora",
                "Cabinet Botanique",
                "Refuge Olive",
                "Bureau Calame",
                "Pharmacie Méridienne",
              ])
              .map((name, i) => (
                <span key={i} className="inline-flex items-center gap-8">
                  <span className="whitespace-nowrap font-display text-xl font-medium italic sm:text-2xl">
                    {name}
                  </span>
                  <span className="font-mono text-sm text-saffron-500" aria-hidden>
                    ✱
                  </span>
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="relative overflow-hidden py-28 sm:py-36">
        {/* Cover-numeral N°02 outdented into the gutter — magazine convention. */}
        <div aria-hidden className="cover-numeral pointer-events-none absolute -top-10 -right-4 sm:-right-2">
          02
        </div>
        <div className="container">
          <Reveal>
            <div className="mb-12 text-saffron-500">
              <WaveformRule variant="calm" />
            </div>
            <div className="mb-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <SectionKicker number="02" label={t("landing.howItWorks.kicker")} color="saffron" />
                <h2 className="mt-4 font-display text-display-lg font-medium">
                  {t("landing.howItWorks.title")}
                </h2>
              </div>
              <p className="max-w-sm text-muted-foreground">
                {t("landing.howItWorks.subtitle")}
              </p>
            </div>
          </Reveal>

          {/* 3 cards as standalone editorial blocks. A dashed thread runs
              across the row at icon-height to visually link the steps. */}
          <div className="relative">
            <div
              aria-hidden
              className="thread pointer-events-none absolute inset-x-12 top-[88px] hidden h-px md:block"
            />
            <div className="relative grid gap-4 md:grid-cols-3">
              {[
                {
                  num: "01",
                  title: t("landing.howItWorks.step1Title"),
                  body: t("landing.howItWorks.step1Body"),
                  icon: <Languages className="h-5 w-5" />,
                },
                {
                  num: "02",
                  title: t("landing.howItWorks.step2Title"),
                  body: t("landing.howItWorks.step2Body"),
                  icon: <ShieldCheck className="h-5 w-5" />,
                },
                {
                  num: "03",
                  title: t("landing.howItWorks.step3Title"),
                  body: t("landing.howItWorks.step3Body"),
                  icon: <Phone className="h-5 w-5" />,
                },
              ].map((s, i) => (
                <Reveal key={s.num} delay={i * 100}>
                  <Step {...s} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ USE CASES ============ */}
      <section id="uses" className="relative overflow-hidden border-y border-border bg-surface/40 py-28 sm:py-36">
        <div aria-hidden className="cover-numeral pointer-events-none absolute -top-10 left-0 sm:left-6">
          03
        </div>
        <div className="container">
          <Reveal>
            <div className="mb-12 text-saffron-500">
              <WaveformRule variant="calm" />
            </div>
            <div className="mb-20 max-w-2xl">
              <SectionKicker number="03" label={t("landing.useCases.kicker")} color="teal" />
              <h2 className="mt-4 font-display text-display-lg font-medium">
                {t("landing.useCases.title")}
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: t("landing.useCases.clinic"),
                body: t("landing.useCases.clinicBody"),
                icon: <Calendar className="h-5 w-5" />,
              },
              {
                title: t("landing.useCases.realty"),
                body: t("landing.useCases.realtyBody"),
                icon: <Phone className="h-5 w-5" />,
              },
              {
                title: t("landing.useCases.ecom"),
                body: t("landing.useCases.ecomBody"),
                icon: <ShieldCheck className="h-5 w-5" />,
              },
              {
                title: t("landing.useCases.restau"),
                body: t("landing.useCases.restauBody"),
                icon: <Languages className="h-5 w-5" />,
              },
            ].map((u, i) => (
              <Reveal key={u.title} delay={i * 70}>
                <UseCase {...u} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 text-center">
              <Link
                href={`/${locale}/use-cases`}
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-saffron-600 transition-colors duration-180 hover:text-saffron-700"
              >
                {t("landing.useCases.seeAll")}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="relative overflow-hidden py-28 sm:py-36">
        <div aria-hidden className="cover-numeral pointer-events-none absolute -top-12 right-0 sm:right-6">
          04
        </div>
        <div className="container">
          <Reveal>
            <div className="mb-12 text-saffron-500">
              <WaveformRule variant="calm" />
            </div>
            <div className="mb-20 max-w-2xl">
              <SectionKicker number="04" label={t("landing.pricing.kicker")} color="saffron" />
              <h2 className="mt-4 font-display text-display-lg font-medium">
                {t("landing.pricing.title")}
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                {t("landing.pricing.subtitle")}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              {
                name: t("landing.pricing.starter"),
                price: t("landing.pricing.starterPrice"),
                body: t("landing.pricing.starterBody"),
                cta: t("landing.pricing.cta"),
                href: wa,
                features: [
                  t("landing.pricing.starterFeature1"),
                  t("landing.pricing.starterFeature2"),
                  t("landing.pricing.starterFeature3"),
                  t("landing.pricing.starterFeature4"),
                ],
              },
              {
                name: t("landing.pricing.growth"),
                price: t("landing.pricing.growthPrice"),
                body: t("landing.pricing.growthBody"),
                cta: t("landing.pricing.cta"),
                href: wa,
                features: [
                  t("landing.pricing.growthFeature1"),
                  t("landing.pricing.growthFeature2"),
                  t("landing.pricing.growthFeature3"),
                  t("landing.pricing.growthFeature4"),
                  t("landing.pricing.growthFeature5"),
                ],
                featured: true,
              },
              {
                name: t("landing.pricing.enterprise"),
                price: "—",
                body: t("landing.pricing.enterpriseBody"),
                cta: t("landing.pricing.ctaContact"),
                href: wa,
                features: [
                  t("landing.pricing.enterpriseFeature1"),
                  t("landing.pricing.enterpriseFeature2"),
                  t("landing.pricing.enterpriseFeature3"),
                  t("landing.pricing.enterpriseFeature4"),
                ],
              },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 80}>
                <PriceCard
                  {...p}
                  recommendedLabel={t("landing.pricing.recommended")}
                  perMonthLabel={t("landing.pricing.perMonth")}
                />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 text-center">
              <Link
                href={`/${locale}/pricing`}
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-saffron-600 transition-colors duration-180 hover:text-saffron-700"
              >
                {t("landing.pricing.compareAll")}
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="border-t border-border bg-surface/40 py-28 sm:py-36">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="mb-16">
              <SectionKicker number="04" label="FAQ" color="teal" />
              <h2 className="mt-4 font-display text-display-lg font-medium">
                {t("landing.faq.title")}
              </h2>
            </div>
          </Reveal>
          <div className="divide-y divide-border">
            <Reveal delay={0}><Faq q={t("landing.faq.q1")} a={t("landing.faq.a1")} /></Reveal>
            <Reveal delay={60}><Faq q={t("landing.faq.q2")} a={t("landing.faq.a2")} /></Reveal>
            <Reveal delay={120}><Faq q={t("landing.faq.q3")} a={t("landing.faq.a3")} /></Reveal>
            <Reveal delay={180}><Faq q={t("landing.faq.q4")} a={t("landing.faq.a4")} /></Reveal>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      {/* Editorial close — ink ground, vermillion accent, magazine spread. */}
      <section className="relative overflow-hidden bg-ink-900 py-32 text-saffron-50 sm:py-40">
        {/* Massive cover-numeral "06" — the back cover of the magazine. */}
        <div aria-hidden className="cover-numeral pointer-events-none absolute -bottom-12 right-4 select-none text-saffron-500/30 sm:right-16">
          06
        </div>
        {/* Waveform — single signature ornament, top of the section. */}
        <div className="pointer-events-none absolute inset-x-0 top-20 text-saffron-50/30">
          <WaveformRule variant="active" />
        </div>
        {/* Vertical hairline — magazine column gutter. */}
        <div className="pointer-events-none absolute inset-y-0 right-[14%] hidden w-px bg-saffron-50/12 lg:block" />

        <div className="container relative">
          <Reveal>
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 font-mono text-kicker uppercase text-saffron-400">
                <Sparkles className="h-3 w-3" />
                {t("landing.finalCta.kicker")}
              </span>
              <h2 className="mt-8 font-display text-display-lg font-medium leading-[1.02] lg:text-[5.5rem]">
                {t("landing.finalCta.title")}
              </h2>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-saffron-50/70">
                {t("landing.finalCta.body")}
              </p>
              <div className="mt-14 flex flex-wrap items-center gap-4">
                <Link
                  href={wa}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-saffron-500 px-8 py-4 text-base font-medium text-ink-900 transition-all duration-220 ease-soft hover:gap-3 hover:bg-saffron-400"
                >
                  {t("landing.finalCta.cta")}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
                </Link>
                <Link
                  href={`/${locale}/pricing`}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-saffron-50/20 px-7 py-4 text-sm font-medium text-saffron-50/80 transition-colors duration-220 hover:border-saffron-500/60 hover:text-saffron-50"
                >
                  {t("landing.pricing.compareAll")}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}

/* ===================== Sub-components ===================== */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="pl-3 first:pl-0 sm:pl-6">
      <dt className="font-display text-lg font-semibold tabular-nums sm:text-2xl">{value}</dt>
      <dd className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
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
  const pillColor = color === "saffron"
    ? "border-saffron-500/30 bg-saffron-500/8 text-saffron-700 dark:text-saffron-400"
    : "border-teal-500/30 bg-teal-500/8 text-teal-700 dark:text-teal-400";
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${pillColor}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span className="font-mono text-kicker uppercase">
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
    <div className="lift group relative flex h-full flex-col rounded-lg border border-border bg-elevated p-8 hover:border-saffron-500/60 hover:shadow-lg hover:shadow-saffron-500/5 lg:p-10">
      {/* Icon punches through the threading line — opaque background keeps
          the thread visible *between* cards but invisible *through* them. */}
      <span className="relative z-10 mb-10 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-background text-muted-foreground shadow-sm transition-all duration-220 group-hover:border-saffron-500 group-hover:bg-saffron-500/8 group-hover:text-saffron-500">
        {icon}
      </span>
      {/* Editorial numeral — quietly large, ink-on-paper feel. */}
      <span className="absolute right-6 top-6 font-display text-5xl font-medium italic leading-none text-border transition-colors duration-220 group-hover:text-saffron-500/50 lg:text-6xl">
        {num}
      </span>
      <h3 className="font-display text-2xl font-medium leading-snug">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-auto pt-8">
        <div className="h-px w-10 bg-border transition-all duration-300 group-hover:w-16 group-hover:bg-saffron-500" />
      </div>
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
    <div className="lift group relative cursor-default overflow-hidden rounded-xl border border-border bg-elevated p-6 hover:border-saffron-500/60 hover:shadow-md hover:shadow-saffron-500/5">
      {/* Vermillion corner mark — quiet on idle, lit on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-saffron-500/0 transition-colors duration-300 group-hover:bg-saffron-500"
      />
      <span className="relative mb-5 inline-grid h-11 w-11 place-items-center rounded-2xl border border-border bg-background text-muted-foreground shadow-sm transition-all duration-220 group-hover:border-saffron-500/50 group-hover:bg-saffron-500/8 group-hover:text-saffron-600">
        {icon}
      </span>
      <h3 className="relative font-display text-lg font-medium">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
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
  recommendedLabel,
  perMonthLabel,
}: {
  name: string;
  price: string;
  body: string;
  cta: string;
  href: string;
  features: string[];
  featured?: boolean;
  recommendedLabel: string;
  perMonthLabel: string;
}) {
  return (
    <div
      className={`lift relative flex h-full flex-col overflow-hidden rounded-xl border p-8 ${
        featured
          ? "stripe-saffron border-saffron-500 bg-elevated shadow-xl shadow-saffron-500/15 lg:-translate-y-2"
          : "border-border bg-elevated hover:border-foreground/30"
      }`}
    >
      {/* Diagonal ribbon corner — only on the featured tier. */}
      {featured && <div className="ribbon-corner" data-text={recommendedLabel} />}

      {/* Plan name — small mono kicker. */}
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {name}
      </div>

      {/* Big editorial price — Fraunces display, generous tracking. */}
      <div className="mt-3 flex items-baseline gap-2 font-display text-[64px] font-medium leading-none tracking-tight tabular-nums sm:text-[72px]">
        <span>{price}</span>
        {price !== "—" && (
          <span className="font-sans text-sm font-normal text-muted-foreground">
            {perMonthLabel}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>

      <div className="my-8 h-px w-full bg-border" />

      <ul className="space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-saffron-500" />
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`group/cta mt-10 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-medium transition-all duration-220 ease-soft ${
          featured
            ? "bg-ink-900 text-saffron-50 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
            : "border border-border bg-background hover:border-foreground hover:bg-foreground hover:text-background"
        }`}
      >
        {cta}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-220 group-hover/cta:rotate-45 rtl:scale-x-[-1]" />
      </Link>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group cursor-pointer py-5">
      <summary className="flex list-none items-start justify-between gap-6 rounded-lg px-1 py-1 transition-colors duration-180 hover:text-foreground">
        <span className="font-display text-lg font-medium transition-colors duration-220 group-hover:text-saffron-600">
          {q}
        </span>
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border bg-elevated text-muted-foreground shadow-sm transition-all duration-220 group-open:rotate-45 group-open:border-saffron-500 group-open:bg-saffron-500/8 group-open:text-saffron-500">
          <Plus className="h-3.5 w-3.5" />
        </span>
      </summary>
      <p className="mt-3 max-w-3xl pb-2 pl-1 text-base leading-relaxed text-muted-foreground">
        {a}
      </p>
    </details>
  );
}

