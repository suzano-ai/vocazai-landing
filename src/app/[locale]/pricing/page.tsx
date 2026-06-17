import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, X, Sparkles } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Khatam, HexLattice, Arch } from "@/components/zellige";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pricingJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "Tarifs — VocazAI",
    en: "Pricing — VocazAI",
    ar: "الأسعار — فوكازاي",
  };
  const desc: Record<string, string> = {
    fr: "Trois formules transparentes — Starter, Croissance, Sur mesure. Premier mois gratuit, sans engagement.",
    en: "Three transparent plans — Starter, Growth, Custom. First month free, no commitment.",
    ar: "ثلاث باقات واضحة — ستارتر، النمو، حسب الطلب. الشهر الأول مجاني، بدون التزام.",
  };
  return {
    title: titles[locale] ?? titles.fr,
    description: desc[locale] ?? desc.fr,
    alternates: {
      canonical: `/${locale}/pricing`,
      languages: {
        fr: "/fr/pricing",
        en: "/en/pricing",
        ar: "/ar/pricing",
        "x-default": "/fr/pricing",
      },
    },
    openGraph: {
      title: titles[locale] ?? titles.fr,
      description: desc[locale] ?? desc.fr,
      url: `/${locale}/pricing`,
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const tCommon = await getTranslations("landing.pricing");
  const tc = await getTranslations("common");
  const wa = `https://wa.me/33777345056?text=${encodeURIComponent(tc("whatsapp"))}`;

  const plans = [
    {
      key: "starter" as const,
      featured: false,
      features: ["100 min/mois", "1 agent", "1 langue", "Email support", "Dashboard standard"],
    },
    {
      key: "growth" as const,
      featured: true,
      features: [
        "500 min/mois",
        "3 agents",
        "Multilingue (FR/AR/EN)",
        "Intégration CRM",
        "Support prioritaire",
        "Analytics avancés",
      ],
    },
    {
      key: "enterprise" as const,
      featured: false,
      features: [
        "Volume illimité",
        "Agents illimités",
        "SLA dédié 99.9%",
        "Intégrations custom",
        "Manager dédié",
        "On-premise possible",
      ],
    },
  ];

  const tNav = await getTranslations("nav");
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header locale={locale} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "VocazAI", url: `/${locale}` },
          { name: tNav("pricing"), url: `/${locale}/pricing` },
        ])}
      />
      {/* Product + AggregateOffer — declares the page as the canonical
          source of truth for VocazAI pricing. Without it, Google can't
          extract the price from /pricing (the SoftwareApplication Offer
          on the landing page helps the homepage, not this URL). */}
      <JsonLd
        data={pricingJsonLd({
          locale,
          name: "VocazAI Voice Agent",
          description:
            "Trilingual AI voice agents (French / Arabic / English) for businesses of every size. Virtual receptionist available 24/7 — front-desk, appointment booking, lead qualification.",
        })}
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <HexLattice
          size={420}
          className="pointer-events-none absolute -right-24 -top-10 text-teal-500/10"
        />
        <Khatam
          size={300}
          className="pointer-events-none absolute -left-20 top-72 text-saffron-500/10"
        />
        <div className="pointer-events-none absolute inset-0 paper" />

        <div className="container relative py-24 lg:py-32">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
              <span className="font-mono text-kicker uppercase text-muted-foreground">
                {t("kicker")}
              </span>
            </div>
            <h1 className="max-w-4xl font-display text-display-xl font-medium">
              {t("title1")}{" "}
              <span className="italic text-saffron-500">{t("title2")}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3.5 py-1.5 text-xs text-saffron-700 dark:text-saffron-400">
              <Sparkles className="h-3 w-3" />
              <span>{t("trial")}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CARDS */}
      <section className="pb-24">
        <div className="container">
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((p, idx) => (
              <Reveal key={p.key} delay={idx * 80}>
                <PlanCard
                  name={tCommon(`${p.key}`)}
                  price={p.key === "enterprise" ? "—" : tCommon(`${p.key}Price`)}
                  body={tCommon(`${p.key}Body`)}
                  cta={p.key === "enterprise" ? tCommon("ctaContact") : tCommon("cta")}
                  href={wa}
                  features={p.features}
                  featured={p.featured}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="border-y border-border bg-surface/40 py-24 sm:py-32">
        <div className="container">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                <span className="font-mono text-kicker uppercase text-muted-foreground">
                  02 — {t("compare.kicker")}
                </span>
              </div>
              <h2 className="mt-4 font-display text-display-lg font-medium">
                {t("compare.title")}
              </h2>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-x-auto rounded-lg border border-border bg-elevated">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-medium">{t("compare.feature")}</th>
                    <th className="px-5 py-4 text-center font-medium">Starter</th>
                    <th className="px-5 py-4 text-center font-medium text-saffron-600">Growth</th>
                    <th className="px-5 py-4 text-center font-medium">Custom</th>
                  </tr>
                </thead>
                <tbody>
                  <CompareRow feature={t("compare.rows.minutes")} starter="100" growth="500" custom="∞" />
                  <CompareRow feature={t("compare.rows.agents")} starter="1" growth="3" custom="∞" />
                  <CompareRow
                    feature={t("compare.rows.languages")}
                    starter="1"
                    growth="3"
                    custom="∞"
                  />
                  <CompareRow feature={t("compare.rows.crm")} starter={false} growth={true} custom={true} />
                  <CompareRow feature={t("compare.rows.api")} starter={false} growth={true} custom={true} />
                  <CompareRow feature={t("compare.rows.sla")} starter={false} growth={false} custom={true} />
                  <CompareRow
                    feature={t("compare.rows.support")}
                    starter="Email"
                    growth={t("compare.rows.priority")}
                    custom={t("compare.rows.dedicated")}
                  />
                  <CompareRow feature={t("compare.rows.onprem")} starter={false} growth={false} custom={true} />
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ light */}
      <section className="py-24 sm:py-32">
        <div className="container max-w-4xl">
          <Reveal>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
                <span className="font-mono text-kicker uppercase text-muted-foreground">
                  03 — {t("faq.kicker")}
                </span>
              </div>
              <h2 className="mt-4 font-display text-display-lg font-medium">
                {t("faq.title")}
              </h2>
            </div>
          </Reveal>
          <div className="divide-y divide-border">
            <Faq q={t("faq.q1")} a={t("faq.a1")} />
            <Faq q={t("faq.q2")} a={t("faq.a2")} />
            <Faq q={t("faq.q3")} a={t("faq.a3")} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-900 py-24 text-saffron-50 sm:py-32">
        <Arch
          size={500}
          className="pointer-events-none absolute -right-20 -top-20 text-saffron-500/12"
        />
        <div className="container relative max-w-3xl">
          <h2 className="font-display text-display-lg font-medium">
            {t("cta.title")}
          </h2>
          <p className="mt-6 max-w-xl text-lg text-saffron-50/70">{t("cta.body")}</p>
          <Link
            href={wa}
            className="group mt-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-saffron-500 px-7 py-4 text-sm font-medium text-ink-900 transition-all duration-220 ease-soft hover:bg-saffron-400 hover:gap-3"
          >
            {t("cta.button")}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
          </Link>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}

function PlanCard({
  name,
  price,
  body,
  cta,
  href,
  features,
  featured,
}: {
  name: string;
  price: string;
  body: string;
  cta: string;
  href: string;
  features: string[];
  featured: boolean;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-lg border bg-elevated p-8 transition-colors duration-220 ${
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

function CompareRow({
  feature,
  starter,
  growth,
  custom,
}: {
  feature: string;
  starter: string | boolean;
  growth: string | boolean;
  custom: string | boolean;
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-5 py-3.5">{feature}</td>
      <td className="px-5 py-3.5 text-center text-muted-foreground">
        <Cell v={starter} />
      </td>
      <td className="bg-saffron-500/5 px-5 py-3.5 text-center font-medium">
        <Cell v={growth} highlight />
      </td>
      <td className="px-5 py-3.5 text-center text-muted-foreground">
        <Cell v={custom} />
      </td>
    </tr>
  );
}

function Cell({ v, highlight = false }: { v: string | boolean; highlight?: boolean }) {
  if (typeof v === "boolean") {
    return v ? (
      <Check className={`mx-auto h-4 w-4 ${highlight ? "text-saffron-500" : "text-foreground"}`} />
    ) : (
      <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
    );
  }
  return <span>{v}</span>;
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group cursor-pointer py-6">
      <summary className="flex list-none items-start justify-between gap-6">
        <span className="font-display text-xl font-medium transition-colors duration-220 group-hover:text-saffron-600">
          {q}
        </span>
        <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-220 group-open:rotate-45 group-open:border-saffron-500 group-open:text-saffron-500">
          +
        </span>
      </summary>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
        {a}
      </p>
    </details>
  );
}
