import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Khatam, HexLattice } from "@/components/zellige";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { POSTS_BY_DATE, type BlogLocale } from "@/content/blog/posts";

const DATE_LOCALE: Record<string, string> = { fr: "fr-FR", en: "en-US", ar: "ar-MA" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/blog`,
      languages: {
        fr: "/fr/blog",
        en: "/en/blog",
        ar: "/ar/blog",
        "x-default": "/fr/blog",
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `/${locale}/blog`,
      type: "website",
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const l = locale as BlogLocale;
  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleDateString(DATE_LOCALE[locale] ?? "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const tNav = await getTranslations("nav");
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header locale={locale} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "VocazAI", url: `/${locale}` },
          { name: tNav("blog"), url: `/${locale}/blog` },
        ])}
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
              {t("title")}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* POST GRID */}
      <section className="pb-24 sm:pb-32">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {POSTS_BY_DATE.map((post, idx) => (
              <Reveal key={post.slug} delay={idx * 80}>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-border bg-elevated p-7 transition-colors duration-220 ease-soft hover:border-foreground"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <time dateTime={post.date}>{dateFmt(post.date)}</time>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{t("readingTime", { minutes: post.readingMinutes })}</span>
                  </div>
                  <h2 className="mt-4 font-display text-xl font-medium leading-snug transition-colors duration-220 group-hover:text-saffron-600">
                    {post.title[l]}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.description[l]}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-saffron-600">
                    {t("readMore")}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-220 group-hover:translate-x-0.5 rtl:scale-x-[-1]" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
