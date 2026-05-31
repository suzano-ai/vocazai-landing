import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
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

  /* ─────────────────────────────────────────────────────────────────────
     "VOICE ISSUE · No. 01"
     A magazine-format landing. Each section is one numbered "page" with
     its own folio (running header), cover-numeral (italic Fraunces 14rem
     outdented into the gutter) and waveform-rule (the only structural
     ornament). Patterns deliberately picked to NOT echo SaaS templates:
       · hero is a single full-bleed cover, no two-column split
       · demo lives in its own "page", not stuffed into the hero
       · how-it-works is a vertical manifesto (one row per step)
       · use cases are a horizontal scroll-snap portfolio
       · pricing is one horizontal strip, no three-card grid
       · FAQ is a 2-column magazine spread with Q.01 / Q.02 markers
       · final-CTA is a back-cover signoff
     ────────────────────────────────────────────────────────────────── */

  const steps = [
    { title: t("landing.howItWorks.step1Title"), body: t("landing.howItWorks.step1Body") },
    { title: t("landing.howItWorks.step2Title"), body: t("landing.howItWorks.step2Body") },
    { title: t("landing.howItWorks.step3Title"), body: t("landing.howItWorks.step3Body") },
  ];

  const industries = [
    { kicker: "01 · CLINIQUES", title: t("landing.useCases.clinic"), body: t("landing.useCases.clinicBody") },
    { kicker: "02 · IMMOBILIER", title: t("landing.useCases.realty"), body: t("landing.useCases.realtyBody") },
    { kicker: "03 · E-COMMERCE", title: t("landing.useCases.ecom"), body: t("landing.useCases.ecomBody") },
    { kicker: "04 · RESTAURATION", title: t("landing.useCases.restau"), body: t("landing.useCases.restauBody") },
  ];

  const plans = [
    {
      name: t("landing.pricing.starter"),
      price: t("landing.pricing.starterPrice"),
      body: t("landing.pricing.starterBody"),
      cta: t("landing.pricing.cta"),
      features: [
        t("landing.pricing.starterFeature1"),
        t("landing.pricing.starterFeature2"),
        t("landing.pricing.starterFeature3"),
        t("landing.pricing.starterFeature4"),
      ],
      featured: false,
    },
    {
      name: t("landing.pricing.growth"),
      price: t("landing.pricing.growthPrice"),
      body: t("landing.pricing.growthBody"),
      cta: t("landing.pricing.cta"),
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
      features: [
        t("landing.pricing.enterpriseFeature1"),
        t("landing.pricing.enterpriseFeature2"),
        t("landing.pricing.enterpriseFeature3"),
        t("landing.pricing.enterpriseFeature4"),
      ],
      featured: false,
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <Header locale={locale} />
      <JsonLd data={faqJsonLd} />

      {/* ════════════════════════════════════════════════════════════════
          COVER · PAGE 01 — full viewport, one column, massive serif headline
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
        <AICanvas className="pointer-events-none absolute inset-0 h-full w-full" />
        <div className="hero-vignette pointer-events-none absolute inset-0" />

        {/* Cover-numeral — magazine binding mark */}
        <div
          aria-hidden
          className="cover-numeral pointer-events-none absolute -bottom-12 right-2 select-none text-saffron-500/20 sm:right-10"
        >
          01
        </div>

        <div className="container relative flex flex-1 flex-col justify-end pb-24 pt-32 sm:pb-32 lg:pb-40">
          {/* Folio running header */}
          <Reveal>
            <p className="folio mb-14">
              <span className="text-foreground">VocazAI</span>
              <span aria-hidden>·</span>
              <span>N°01</span>
              <span aria-hidden>·</span>
              <span>{t("landing.kicker")}</span>
            </p>
          </Reveal>

          {/* The cover headline — display-2xl clamps up to ~11.5rem */}
          <Reveal delay={60}>
            <h1 className="font-display text-display-2xl font-medium leading-[0.86] tracking-[-0.04em]">
              <span className="block">{t("landing.heroTitle1")}</span>
              <span className="block italic text-saffron-500">
                {t("landing.heroTitle2")}
              </span>
            </h1>
          </Reveal>

          {/* Subtitle + CTAs sit in a magazine "stand-first" row */}
          <Reveal delay={140}>
            <div className="mt-16 flex flex-col gap-12 border-t border-border pt-10 lg:flex-row lg:items-end lg:justify-between">
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
                {t("landing.heroSubtitle")}
              </p>
              <div className="flex flex-wrap items-center gap-8">
                <Link
                  href={wa}
                  className="group inline-flex cursor-pointer items-center gap-3 bg-foreground px-7 py-4 text-sm font-medium uppercase tracking-[0.18em] text-background transition-colors duration-220 hover:bg-saffron-500 hover:text-foreground"
                >
                  {t("landing.ctaPrimary")}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
                </Link>
                <a
                  href="#demo"
                  className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-foreground transition-colors duration-220 hover:text-saffron-500"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-current">
                    <ArrowDown className="h-3.5 w-3.5 transition-transform duration-220 group-hover:translate-y-0.5" />
                  </span>
                  Écouter la démo
                </a>
              </div>
            </div>
          </Reveal>

          {/* Stats foot strip — replaces the old <Stat /> grid */}
          <Reveal delay={220}>
            <ul className="mt-16 grid grid-cols-3 gap-px border border-border bg-border text-center">
              <Stat value="24/7" label={t("landing.stats.available")} />
              <Stat value="< 800ms" label={t("landing.stats.latency")} />
              <Stat value="FR · AR · EN" label={t("landing.stats.languages")} />
            </ul>
          </Reveal>
        </div>

        {/* Waveform-rule — closes the cover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 text-saffron-500/30">
          <WaveformRule variant="active" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 02 — DEMO. Promoted to its own spread, no longer a hero side-car
          ════════════════════════════════════════════════════════════════ */}
      <section
        id="demo"
        className="relative overflow-hidden border-t border-border bg-surface/40 py-24 sm:py-32"
      >
        <div
          aria-hidden
          className="cover-numeral pointer-events-none absolute -top-12 -left-2 select-none sm:left-6"
        >
          02
        </div>
        <div className="container relative">
          <Reveal>
            <p className="folio mb-10">
              <span>N°02</span>
              <span aria-hidden>·</span>
              <span>DEMO LIVE</span>
              <span aria-hidden>·</span>
              <span>YASMINE</span>
            </p>
          </Reveal>

          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-24">
            <Reveal delay={80}>
              <div>
                <h2 className="font-display text-display-xl font-medium leading-[0.92] tracking-tight">
                  Écoutez{" "}
                  <span className="italic text-saffron-500">Yasmine</span>{" "}
                  décrocher.
                </h2>
                <p className="mt-10 max-w-md text-lg leading-relaxed text-muted-foreground">
                  Une conversation en direct, sans script. Choisissez la
                  langue, parlez, et entendez l&apos;agent répondre — comme
                  le ferait votre meilleure standardiste.
                </p>
                <div className="mt-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="relative grid h-2.5 w-2.5 place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-saffron-500/60" />
                    <span className="relative h-2 w-2 rounded-full bg-saffron-500" />
                  </span>
                  En direct · sans configuration
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <DemoCallCard key={locale} locale={locale} />
            </Reveal>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 -bottom-3 text-saffron-500/20">
          <WaveformRule variant="calm" />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          TRUST BAND — magazine-style names, mono asterisk delimiters
          ════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-border bg-background py-12">
        <div className="container mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-border" />
          <span className="font-mono text-kicker uppercase text-muted-foreground">
            {t("landing.trustBar")}
          </span>
          <span className="h-px w-12 bg-border" />
        </div>
        <div className="marquee">
          <div className="marquee__track text-muted-foreground/60">
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

      {/* ════════════════════════════════════════════════════════════════
          PAGE 03 — METHOD. Vertical manifesto, one row per step
          ════════════════════════════════════════════════════════════════ */}
      <section id="how" className="relative py-32 sm:py-40">
        <div
          aria-hidden
          className="cover-numeral pointer-events-none absolute -top-10 right-0 select-none sm:right-6"
        >
          03
        </div>
        <div className="container relative">
          <Reveal>
            <p className="folio mb-10">
              <span>N°03</span>
              <span aria-hidden>·</span>
              <span>METHOD</span>
            </p>
            <h2 className="mb-20 max-w-3xl font-display text-display-xl font-medium leading-[0.92] tracking-tight">
              {t("landing.howItWorks.title")}
            </h2>
          </Reveal>

          <div className="border-t border-border">
            {steps.map((step, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="grid grid-cols-1 items-baseline gap-8 border-b border-border py-14 lg:grid-cols-[160px_1fr_1.4fr] lg:gap-16 lg:py-20">
                  <div className="font-display text-7xl font-medium italic leading-none tracking-tight text-saffron-500 lg:text-8xl">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-2xl font-medium leading-tight lg:text-3xl">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 04 — INDUSTRIES. Horizontal scroll-snap portfolio
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-border bg-surface/40 py-32 sm:py-40">
        <div
          aria-hidden
          className="cover-numeral pointer-events-none absolute -top-10 left-0 select-none sm:left-6"
        >
          04
        </div>
        <div className="container relative">
          <Reveal>
            <p className="folio mb-10">
              <span>N°04</span>
              <span aria-hidden>·</span>
              <span>INDUSTRIES</span>
            </p>
            <div className="mb-14 grid items-end gap-8 sm:grid-cols-[1fr_auto]">
              <h2 className="max-w-3xl font-display text-display-xl font-medium leading-[0.92] tracking-tight">
                {t("landing.useCases.title")}
              </h2>
              <Link
                href={`/${locale}/use-cases`}
                className="rule-underline inline-flex items-center gap-2 self-end font-mono text-xs uppercase tracking-[0.22em] text-foreground"
              >
                {t("landing.useCases.seeAll")}
                <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </div>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
              ← Glissez pour parcourir →
            </p>
          </Reveal>
        </div>

        {/* Horizontal scroll-snap — full bleed past container */}
        <div className="snap-x snap-mandatory overflow-x-auto">
          <div className="flex gap-6 px-6 pb-12 lg:px-12 xl:px-20">
            {industries.map((u, i) => (
              <Reveal key={u.title} delay={i * 60}>
                <article className="lift relative flex min-w-[86vw] max-w-2xl shrink-0 snap-center flex-col justify-between border border-border bg-elevated p-10 hover:border-foreground/40 sm:min-w-[560px] lg:p-14">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-saffron-500">
                      {u.kicker}
                    </p>
                    <h3 className="mt-8 font-display text-3xl font-medium italic leading-tight lg:text-4xl">
                      {u.title}
                    </h3>
                    <p className="mt-6 text-base leading-relaxed text-muted-foreground lg:text-lg">
                      {u.body}
                    </p>
                  </div>
                  <div className="mt-16 flex items-center justify-between border-t border-border pt-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} / 04
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 05 — PRICING. Horizontal strip, 3 cells with hairline dividers
          ════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative py-32 sm:py-40">
        <div
          aria-hidden
          className="cover-numeral pointer-events-none absolute -top-12 right-0 select-none sm:right-6"
        >
          05
        </div>
        <div className="container relative">
          <Reveal>
            <p className="folio mb-10">
              <span>N°05</span>
              <span aria-hidden>·</span>
              <span>PRICING</span>
            </p>
            <div className="mb-16 grid items-end gap-8 sm:grid-cols-[1fr_auto]">
              <h2 className="max-w-3xl font-display text-display-xl font-medium leading-[0.92] tracking-tight">
                {t("landing.pricing.title")}
              </h2>
              <p className="self-end text-base text-muted-foreground sm:max-w-xs sm:text-right">
                {t("landing.pricing.subtitle")}
              </p>
            </div>
          </Reveal>

          {/* The horizontal strip — one row, three cells. On mobile stacks. */}
          <Reveal delay={80}>
            <div className="grid border-y-2 border-foreground lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col border-b border-border p-10 lg:border-b-0 lg:border-r lg:p-12 [&:last-child]:border-r-0 [&:last-child]:border-b-0 ${
                    plan.featured ? "bg-saffron-500/5" : ""
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 bg-saffron-500 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-background">
                      <Sparkles className="h-3 w-3" />
                      {t("landing.pricing.recommended")}
                    </span>
                  )}

                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {plan.name}
                  </div>

                  {/* MASSIVE price — Fraunces display, 96px tabular */}
                  <div className="mt-6 font-display text-[clamp(64px,9vw,96px)] font-medium leading-none tracking-tight tabular-nums">
                    {plan.price}
                  </div>

                  <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {plan.body}
                  </p>

                  <ul className="mt-10 space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-saffron-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-12">
                    <Link
                      href={wa}
                      className={`group inline-flex items-center gap-3 ${
                        plan.featured
                          ? "bg-foreground px-5 py-3 text-sm font-medium uppercase tracking-[0.18em] text-background transition-colors duration-220 hover:bg-saffron-500 hover:text-foreground"
                          : "rule-underline font-mono text-xs uppercase tracking-[0.22em] text-foreground"
                      }`}
                    >
                      {plan.cta}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-10 text-center">
              <Link
                href={`/${locale}/pricing`}
                className="rule-underline inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-foreground"
              >
                {t("landing.pricing.compareAll")}
                <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PAGE 06 — FAQ. Two-column magazine spread, Q.01 / Q.02 markers
          ════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="relative border-t border-border bg-surface/40 py-32 sm:py-40">
        <div
          aria-hidden
          className="cover-numeral pointer-events-none absolute -top-12 left-0 select-none sm:left-6"
        >
          06
        </div>
        <div className="container relative max-w-6xl">
          <Reveal>
            <p className="folio mb-10">
              <span>N°06</span>
              <span aria-hidden>·</span>
              <span>FAQ</span>
            </p>
            <h2 className="mb-20 max-w-3xl font-display text-display-xl font-medium leading-[0.92] tracking-tight">
              {t("landing.faq.title")}
            </h2>
          </Reveal>

          <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="border-t border-foreground pt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-saffron-500">
                    Q.0{i}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-medium italic leading-snug">
                    {t(`landing.faq.q${i}`)}
                  </h3>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                    {t(`landing.faq.a${i}`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          BACK COVER · PAGE 07 — final CTA, inverted, ink ground
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ink-900 py-40 text-saffron-50 sm:py-48">
        <div
          aria-hidden
          className="cover-numeral pointer-events-none absolute -bottom-16 right-2 select-none text-saffron-500/30 sm:right-10"
        >
          07
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-20 text-saffron-50/25">
          <WaveformRule variant="active" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-[12%] hidden w-px bg-saffron-50/10 lg:block" />

        <div className="container relative">
          <Reveal>
            <p className="folio mb-12" style={{ color: "hsl(var(--saffron-50) / 0.6)" }}>
              <span>BACK COVER</span>
              <span aria-hidden>·</span>
              <span>N°07</span>
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="max-w-4xl font-display text-display-2xl font-medium leading-[0.86] tracking-[-0.04em]">
              {t("landing.finalCta.title")}
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-12 max-w-2xl text-lg leading-relaxed text-saffron-50/75">
              {t("landing.finalCta.body")}
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-saffron-50/15 pt-10">
              <Link
                href={wa}
                className="group inline-flex cursor-pointer items-center gap-3 bg-saffron-500 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ink-900 transition-colors duration-220 hover:bg-saffron-400"
              >
                {t("landing.finalCta.cta")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
              </Link>
              <Link
                href={`/${locale}/pricing`}
                className="rule-underline inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-saffron-50/80"
              >
                {t("landing.pricing.compareAll")}
                <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
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
    <li className="bg-background px-4 py-5 sm:py-7">
      <div className="font-display text-xl font-medium tabular-nums sm:text-2xl">
        {value}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
    </li>
  );
}
