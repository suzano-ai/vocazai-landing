import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Stethoscope,
  Home,
  Truck,
  Utensils,
} from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Khatam, Quatrefoil, Arch } from "@/components/zellige";
import { Reveal } from "@/components/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    fr: "Cas d'usage — VocazAI",
    en: "Use cases — VocazAI",
    ar: "حالات الاستخدام — فوكازاي",
  };
  return {
    title: titles[locale] ?? titles.fr,
    description:
      "Cliniques, agences immobilières, e-commerce, restauration — comment VocazAI répond aux besoins de chaque métier.",
    alternates: {
      canonical: `/${locale}/use-cases`,
      languages: { fr: "/fr/use-cases", en: "/en/use-cases", ar: "/ar/use-cases" },
    },
  };
}

export default async function UseCasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("useCases");

  const cases = [
    { key: "clinic", icon: <Stethoscope className="h-5 w-5" />, shape: "khatam" as const },
    { key: "realty", icon: <Home className="h-5 w-5" />, shape: "arch" as const },
    { key: "ecom", icon: <Truck className="h-5 w-5" />, shape: "quatrefoil" as const },
    { key: "restau", icon: <Utensils className="h-5 w-5" />, shape: "khatam" as const },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header locale={locale} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <Quatrefoil
          size={500}
          className="pointer-events-none absolute -right-32 -top-10 text-saffron-500/10"
        />
        <div className="pointer-events-none absolute inset-0 paper" />
        <div className="container relative py-24 lg:py-32">
          <Reveal>
            <div className="mb-8 inline-flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <span className="font-mono text-kicker uppercase text-muted-foreground">
                {t("kicker")}
              </span>
            </div>
            <h1 className="max-w-4xl font-display text-display-xl font-medium">
              {t("title1")}{" "}
              <span className="italic text-saffron-500">{t("title2")}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("intro")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* CASES — alternating layout */}
      <section className="border-t border-border py-24 sm:py-32">
        <div className="container space-y-32">
          {cases.map((c, idx) => (
            <Reveal key={c.key} delay={(idx % 2) * 80}>
              <UseCaseRow
                idx={idx}
                title={t(`${c.key}.title`)}
                lede={t(`${c.key}.lede`)}
                body={t(`${c.key}.body`)}
                bullets={[
                  t(`${c.key}.b1`),
                  t(`${c.key}.b2`),
                  t(`${c.key}.b3`),
                ]}
                icon={c.icon}
                shape={c.shape}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-900 py-24 text-saffron-50 sm:py-32">
        <Khatam
          size={500}
          className="pointer-events-none absolute -right-24 -top-24 text-saffron-500/12"
        />
        <div className="container relative max-w-3xl">
          <h2 className="font-display text-display-lg font-medium">{t("cta.title")}</h2>
          <p className="mt-6 max-w-xl text-lg text-saffron-50/70">{t("cta.body")}</p>
          <Link
            href={`/${locale}/login`}
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

function UseCaseRow({
  idx,
  title,
  lede,
  body,
  bullets,
  icon,
  shape,
}: {
  idx: number;
  title: string;
  lede: string;
  body: string;
  bullets: string[];
  icon: React.ReactNode;
  shape: "khatam" | "arch" | "quatrefoil";
}) {
  const reverse = idx % 2 === 1;
  const Shape = shape === "arch" ? Arch : shape === "quatrefoil" ? Quatrefoil : Khatam;

  return (
    <div
      className={`grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center ${
        reverse ? "lg:[&>div:first-child]:order-2" : ""
      }`}
    >
      <div>
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-saffron-500/40 text-saffron-600">
            {icon}
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            0{idx + 1}
          </span>
        </div>
        <h2 className="font-display text-display-md font-medium">{title}</h2>
        <p className="mt-4 text-lg italic text-saffron-600">{lede}</p>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">{body}</p>
        <ul className="mt-8 space-y-3 text-sm">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span className="mt-2 h-1 w-3 shrink-0 bg-saffron-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative">
        <div className="relative overflow-hidden rounded-lg border border-border bg-elevated p-12 lg:aspect-[5/4]">
          <Shape size={360} className="absolute right-4 top-4 text-saffron-500/15" />
          <div className="relative z-10 flex h-full flex-col justify-end">
            <div className="font-mono text-kicker uppercase text-muted-foreground">
              Scénario
            </div>
            <p className="mt-3 font-display text-2xl font-medium leading-tight">
              {lede}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
