import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { DemoCallCard } from "@/components/landing/demo-call-card-lazy";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";

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
  const wa = `https://wa.me/33777345056?text=${encodeURIComponent(t("common.whatsapp"))}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4].map((i) => ({
      "@type": "Question",
      name: t(`landing.faq.q${i}`),
      acceptedAnswer: { "@type": "Answer", text: t(`landing.faq.a${i}`) },
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#faq h3", "#faq dd"],
    },
  };

  // Service schema — Google can surface this as a rich service result with
  // the price range visible right in the SERP, lifting CTR vs. a plain
  // SoftwareApplication card. Geography-neutral (areaServed: Global).
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "AI voice receptionist",
    name: "VocazAI Voice Agent",
    description:
      "Trilingual AI voice agent (French, Arabic, English) that answers your business phone 24/7, books appointments, qualifies leads, and handles FAQs.",
    provider: { "@type": "Organization", name: "VocazAI", url: "https://vocazai.com" },
    areaServed: "Global",
    availableLanguage: ["French", "Arabic", "English"],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "499",
      highPrice: "1490",
      priceRange: "$499-$1,490",
      offerCount: 2,
    },
  };

  /* ─────────────────────────────────────────────────────────────────────
     VocazAI · TERMINAL CONSOLE
     The landing reads like a CLI session — black ground, monospace,
     phosphor accent, ASCII rules, bracket CTAs. No serif, no magazine
     vocabulary, no SVG ornaments. Voice infrastructure rendered as
     terminal infrastructure.
     ────────────────────────────────────────────────────────────────── */

  const steps = [
    { cmd: "describe", title: t("landing.howItWorks.step1Title"), body: t("landing.howItWorks.step1Body") },
    { cmd: "configure", title: t("landing.howItWorks.step2Title"), body: t("landing.howItWorks.step2Body") },
    { cmd: "deploy", title: t("landing.howItWorks.step3Title"), body: t("landing.howItWorks.step3Body") },
  ];

  const industries = [
    { id: "clinic", title: t("landing.useCases.clinic"), body: t("landing.useCases.clinicBody") },
    { id: "realty", title: t("landing.useCases.realty"), body: t("landing.useCases.realtyBody") },
    { id: "ecom", title: t("landing.useCases.ecom"), body: t("landing.useCases.ecomBody") },
    { id: "restau", title: t("landing.useCases.restau"), body: t("landing.useCases.restauBody") },
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
      <JsonLd data={serviceJsonLd} />

      {/* ════════════════════════════════════════════════════════════════
          BOOT SCREEN · the hero. CLI-style command + massive mono headline
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
        <div className="container relative flex flex-1 flex-col justify-between py-20 sm:py-28">
          {/* Status line — top of the booth screen */}
          <Reveal>
            <div className="status-line">
              <span><span className="glow">●</span> SYSTEM ONLINE</span>
              <span>VOCAZAI v.0.2</span>
              <span>TRILINGUAL · FR · AR · EN</span>
              <span>24/7</span>
              <span><span className="glow">SETUP &lt; 48H</span></span>
            </div>
          </Reveal>

          {/* The booth */}
          <div className="my-16 max-w-6xl">
            <Reveal delay={60}>
              <p className="cmd-line mb-10 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                START PROCESS — voice_agent.deploy()
              </p>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="text-display-2xl font-medium leading-[0.96] tracking-[-0.05em] text-foreground">
                <span className="block">{t("landing.heroTitle1")}</span>
                <span className="block text-saffron-500 cursor-blink">
                  {t("landing.heroTitle2")}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <div className="ascii-rule mt-12" />
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t("landing.heroSubtitle")}
                </p>
                <div className="flex flex-col gap-4">
                  <Link href={wa} className="bracket-cta">
                    {t("landing.ctaPrimary")}
                  </Link>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-saffron-500">
                    {t("landing.priceAnchor")}
                  </span>
                  <a
                    href="#demo"
                    className="group inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-150 hover:text-saffron-500"
                  >
                    <ArrowDown className="h-3.5 w-3.5 transition-transform duration-220 group-hover:translate-y-0.5" />
                    listen / demo --live
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Foot — stats as terminal-output strip */}
          <Reveal delay={340}>
            <div className="border-t border-border pt-8">
              <dl className="grid grid-cols-3 gap-px overflow-hidden border border-border bg-border text-foreground">
                <StatCell value="24/7" label={t("landing.stats.available")} />
                <StatCell value="< 800ms" label={t("landing.stats.latency")} />
                <StatCell value="FR · AR · EN" label={t("landing.stats.languages")} />
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          $ ./demo — the live call card spread
          ════════════════════════════════════════════════════════════════ */}
      <section id="demo" className="relative border-t border-border bg-surface py-24 sm:py-32">
        <div className="container">
          <Reveal>
            <div className="status-line mb-10">
              <span>$ ./demo --interactive</span>
              <span><span className="glow">●</span> RECORDING</span>
              <span>AGENT YASMINE</span>
            </div>
          </Reveal>

          <div className="grid items-start gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <Reveal delay={80}>
              <div>
                <h2 className="text-display-lg font-medium leading-[0.98] tracking-[-0.04em]">
                  <span className="cmd-line">listen</span>
                </h2>
                <p className="mt-10 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Une conversation en direct, sans script. Choisissez la
                  langue, parlez, écoutez l&apos;agent répondre — comme le
                  ferait votre meilleure standardiste.
                </p>
                <div className="ascii-rule mt-12" />
                <ul className="mt-8 space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-saffron-500">{">"}</span>
                    <span className="text-muted-foreground">
                      Réponse en moins de <span className="glow">800ms</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-saffron-500">{">"}</span>
                    <span className="text-muted-foreground">
                      Bascule langue en cours d&apos;appel
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-saffron-500">{">"}</span>
                    <span className="text-muted-foreground">
                      Prend RDV, envoie email de confirmation
                    </span>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <DemoCallCard key={locale} locale={locale} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          Trust marquee — mono brand names, phosphor asterisk delimiters
          ════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-border bg-background py-10">
        <div className="container mb-6">
          <div className="status-line justify-center">
            <span>$ uptime — clients</span>
            <span>{t("landing.trustBar")}</span>
          </div>
        </div>
        <div className="marquee">
          <div className="marquee__track text-muted-foreground/70">
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
                  <span className="whitespace-nowrap text-lg uppercase tracking-tight sm:text-xl">
                    {name}
                  </span>
                  <span className="text-saffron-500" aria-hidden>
                    ✦
                  </span>
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          $ ./how_it_works — 3 commands, ASCII-ruled
          ════════════════════════════════════════════════════════════════ */}
      <section id="how" className="relative py-28 sm:py-36">
        <div className="container">
          <Reveal>
            <div className="status-line mb-10">
              <span>$ ./method</span>
              <span>3 STEPS</span>
            </div>
            <h2 className="mb-12 max-w-3xl text-display-xl font-medium leading-[1.0] tracking-[-0.045em]">
              <span className="cmd-line">{t("landing.howItWorks.title")}</span>
            </h2>
            <p className="mb-20 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("landing.howItWorks.subtitle")}
            </p>
            <div className="ascii-rule" />
          </Reveal>

          <div>
            {steps.map((step, i) => (
              <Reveal key={step.cmd} delay={i * 80}>
                <div className="grid grid-cols-1 items-baseline gap-6 border-b border-border py-12 lg:grid-cols-[180px_220px_1fr] lg:gap-12 lg:py-16">
                  <div className="text-saffron-500">
                    <span className="text-base">{">"}</span>
                    <span className="ml-2 text-base uppercase tracking-[0.18em]">
                      0{i + 1}/03
                    </span>
                  </div>
                  <div className="text-lg uppercase tracking-tight text-foreground">
                    <span className="text-muted-foreground">{"./"}</span>
                    {step.cmd}
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium leading-tight tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          $ ls /industries — terminal directory listing
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative border-t border-border bg-surface py-28 sm:py-36">
        <div className="container">
          <Reveal>
            <div className="status-line mb-10">
              <span>$ ls /industries</span>
              <span>{industries.length} DIRS</span>
            </div>
            <h2 className="mb-12 max-w-3xl text-display-xl font-medium leading-[1.0] tracking-[-0.045em]">
              <span className="cmd-line">{t("landing.useCases.title")}</span>
            </h2>
            <div className="ascii-rule mb-12" />
          </Reveal>

          {/* Terminal directory listing — each industry a row */}
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
            {industries.map((u, i) => (
              <Reveal key={u.id} delay={i * 60}>
                <article className="group relative flex h-full flex-col bg-background p-8 transition-colors duration-200 hover:bg-elevated lg:p-10">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    <span>./{u.id}</span>
                    <span>{String(i + 1).padStart(2, "0")}/0{industries.length}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-medium leading-tight tracking-tight text-foreground lg:text-3xl">
                    {u.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {u.body}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-saffron-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span>{">"}</span>
                    <span>open()</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-10">
              <Link href={`/${locale}/use-cases`} className="bracket-cta">
                {t("landing.useCases.seeAll")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          $ ./pricing.json — 3 plans, terminal table
          ════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative py-28 sm:py-36">
        <div className="container">
          <Reveal>
            <div className="status-line mb-10">
              <span>$ cat pricing.json</span>
              <span>USD</span>
              <span>FIRST MONTH FREE</span>
            </div>
            <h2 className="mb-12 max-w-3xl text-display-xl font-medium leading-[1.0] tracking-[-0.045em]">
              <span className="cmd-line">{t("landing.pricing.title")}</span>
            </h2>
            <p className="mb-12 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("landing.pricing.subtitle")}
            </p>
            <div className="ascii-rule mb-12" />
          </Reveal>

          <div className="grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-3">
            {plans.map((plan) => (
              <Reveal key={plan.name} delay={0}>
                <div
                  className={`flex h-full flex-col p-8 lg:p-10 ${
                    plan.featured ? "bg-elevated" : "bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em]">
                    <span className="text-muted-foreground">./{plan.name.toLowerCase()}</span>
                    {plan.featured && (
                      <span className="border border-saffron-500 px-2 py-0.5 text-saffron-500">
                        recommended
                      </span>
                    )}
                  </div>

                  <div className="mt-8 text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.05em] tabular-nums text-foreground">
                    {plan.price}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {plan.body}
                  </p>

                  <div className="ascii-rule my-8" />

                  <ul className="space-y-2.5 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-saffron-500" />
                        <span className="text-foreground/85">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-10">
                    <Link href={wa} className="bracket-cta">
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mt-8">
              <Link
                href={`/${locale}/pricing`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-150 hover:text-saffron-500"
              >
                <span>{">"}</span>
                {t("landing.pricing.compareAll")}
                <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          $ man vocazai — FAQ as terminal man-page pairs
          ════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="relative border-t border-border bg-surface py-28 sm:py-36">
        <div className="container max-w-6xl">
          <Reveal>
            <div className="status-line mb-10">
              <span>$ man vocazai</span>
              <span>FAQ</span>
            </div>
            <h2 className="mb-12 max-w-3xl text-display-xl font-medium leading-[1.0] tracking-[-0.045em]">
              <span className="cmd-line">{t("landing.faq.title")}</span>
            </h2>
            <div className="ascii-rule mb-12" />
          </Reveal>

          <div className="grid gap-12 md:grid-cols-2 md:gap-x-16">
            {[1, 2, 3, 4].map((i) => (
              <Reveal key={i} delay={i * 60}>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-saffron-500">
                    Q.{String(i).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight text-foreground">
                    {t(`landing.faq.q${i}`)}
                  </h3>
                  <p className="mt-4 flex gap-2 text-base leading-relaxed text-muted-foreground">
                    <span className="shrink-0 text-saffron-500">{">"}</span>
                    <span>{t(`landing.faq.a${i}`)}</span>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          EXIT — final CTA, full ground, phosphor everywhere
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-background py-32 sm:py-40">
        <div className="container">
          <Reveal>
            <div className="status-line mb-12">
              <span><span className="glow">●</span> READY</span>
              <span>$ ./start --trial</span>
              <span>FIRST MONTH FREE</span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="ascii-rule mb-12" />
          </Reveal>

          <Reveal delay={120}>
            <h2 className="max-w-4xl text-display-2xl font-medium leading-[0.96] tracking-[-0.05em]">
              <span className="block">{t("landing.finalCta.title")}</span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-12 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("landing.finalCta.body")}
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link href={wa} className="bracket-cta">
                {t("landing.finalCta.cta")}
              </Link>
              <Link
                href={`/${locale}/pricing`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-150 hover:text-saffron-500"
              >
                <span>{">"}</span>
                {t("landing.pricing.compareAll")}
                <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="ascii-rule mt-16" />
          </Reveal>
        </div>
      </section>

      <Footer locale={locale} />

      {/* Sticky mobile CTA — proven mobile-CRO pattern that lifts conversion
          15-30 % on phone-led traffic (which is where Google search trends).
          Two paths in thumb-reach: a click-to-call for visitors who want a
          live voice and the WhatsApp trial deep-link for everyone else.
          Hidden md+ since the desktop hero CTA stays in view at all scrolls. */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
        <a
          href="tel:+33777345056"
          className="bracket-cta justify-center text-[11px]"
          aria-label="Call VocazAI"
        >
          {"CALL"}
        </a>
        <Link
          href={wa}
          className="bracket-cta w-full justify-center text-[11px]"
          aria-label={t("landing.finalCta.cta")}
        >
          {t("landing.finalCta.cta")}
        </Link>
      </div>
      {/* Spacer so the sticky bar doesn't cover the footer's last row on
          short viewports. md+ hidden to match. */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </main>
  );
}

/* ===================== Sub-components ===================== */

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-background px-4 py-5 sm:py-7">
      <dt className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2 text-xl font-medium tracking-tight text-foreground tabular-nums sm:text-2xl">
        {value}
      </dd>
    </div>
  );
}
