import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Khatam, HexLattice } from "@/components/zellige";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, blogIndexJsonLd } from "@/lib/seo/structured-data";
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
        data={breadcrumbJsonLd(
          [
            { name: "VocazAI", url: `/${locale}` },
            { name: tNav("blog"), url: `/${locale}/blog` },
          ],
          { url: `/${locale}/blog`, locale }
        )}
      />
      {/* Blog collection JSON-LD — declares this index as a structured
          schema.org Blog with every post as a nested BlogPosting reference.
          Helps Google discover newly-added slugs without waiting for a
          full sitemap re-crawl, and makes the index page itself eligible
          for richer SERP presentation (multi-item list result). */}
      <JsonLd
        data={blogIndexJsonLd({
          locale,
          name: t("metaTitle"),
          description: t("metaDescription"),
          posts: POSTS_BY_DATE.map((p) => ({
            slug: p.slug,
            date: p.date,
            title: p.title[l],
            description: p.description[l],
          })),
        })}
      />
      {/* CollectionPage entity — wires /blog into the @id graph started
          in SEO #37 (Organization #organization + WebSite #website) and
          extended in SEO #40 (/use-cases CollectionPage, /pricing
          WebPage). Without it, /blog had a Blog node but no WebPage
          wrapper, leaving Google to guess at the page-level entity.
          `mainContentOfPage` references the Blog @id above so the
          hierarchy is unambiguous: WebSite → CollectionPage → Blog →
          BlogPosting[]. Closes the chain across every public surface. */}
      <JsonLd
        data={(() => {
          const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";
          const url = `${BASE}/${locale}/blog`;
          return {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${url}#webpage`,
            url,
            inLanguage: locale,
            name: t("metaTitle"),
            description: t("metaDescription"),
            isPartOf: { "@type": "WebSite", "@id": `${BASE}/#website` },
            mainContentOfPage: { "@id": url },
            about: { "@type": "Organization", "@id": `${BASE}/#organization` },
            breadcrumb: { "@id": `${url}#breadcrumb` },
          };
        })()}
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
            {/* Depth signal — total post count + cumulative reading time.
                Gives a buyer landing on /blog from search an immediate
                sense of the resource's scale ("40 guides · 250 min of
                reading") instead of having to scroll the grid to gauge
                it. The numbers auto-update as new posts ship — no
                copywriting maintenance required. */}
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-border bg-elevated px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-saffron-500" aria-hidden="true" />
              <span className="text-foreground">
                {POSTS_BY_DATE.length}{" "}
                {t("postCount")}
              </span>
              <span aria-hidden="true" className="text-muted-foreground/50">·</span>
              <span>
                {POSTS_BY_DATE.reduce((n, p) => n + p.readingMinutes, 0)}{" "}
                {t("totalMinutes")}
              </span>
            </div>
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
