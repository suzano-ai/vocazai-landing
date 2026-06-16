import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Khatam } from "@/components/zellige";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { POSTS, POSTS_BY_DATE, getPost, type BlogLocale, type Block } from "@/content/blog/posts";
import { routing } from "../../../../../i18n/routing";

const DATE_LOCALE: Record<string, string> = { fr: "fr-FR", en: "en-US", ar: "ar-MA" };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    POSTS.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const l = locale as BlogLocale;
  return {
    title: post.title[l],
    description: post.description[l],
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        fr: `/fr/blog/${slug}`,
        en: `/en/blog/${slug}`,
        ar: `/ar/blog/${slug}`,
        "x-default": `/fr/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title[l],
      description: post.description[l],
      url: `/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const tc = await getTranslations("common");
  const tNav = await getTranslations("nav");
  const l = locale as BlogLocale;
  const wa = `https://wa.me/33777345056?text=${encodeURIComponent(tc("whatsapp"))}`;
  const dateStr = new Date(post.date).toLocaleDateString(
    DATE_LOCALE[locale] ?? "fr-FR",
    { year: "numeric", month: "long", day: "numeric" }
  );

  // Word count for the BlogPosting schema (helps Article rich results).
  const wordCount = post.body[l].reduce((n, block) => {
    if (block.type === "p" || block.type === "h2") return n + block.text.split(/\s+/).length;
    if (block.type === "ul") return n + block.items.reduce((m, it) => m + it.split(/\s+/).length, 0);
    return n;
  }, 0);

  const articleJsonLd = blogPostingJsonLd({
    title: post.title[l],
    description: post.description[l],
    url: `/${locale}/blog/${slug}`,
    datePublished: post.date,
    inLanguage: locale,
    wordCount,
  });

  const breadcrumb = breadcrumbJsonLd([
    { name: "VocazAI", url: `/${locale}` },
    { name: t("kicker"), url: `/${locale}/blog` },
    { name: post.title[l], url: `/${locale}/blog/${slug}` },
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header locale={locale} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumb} />

      <article className="relative overflow-hidden">
        <Khatam
          size={300}
          className="pointer-events-none absolute -right-20 -top-10 text-saffron-500/8"
        />
        <div className="pointer-events-none absolute inset-0 paper" />

        <div className="container relative max-w-3xl py-20 lg:py-28">
          <Reveal>
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors duration-180 hover:text-saffron-600"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl:scale-x-[-1]" />
              {t("backToBlog")}
            </Link>

            <div className="mt-8 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>{t("publishedOn")}</span>
              <time dateTime={post.date}>{dateStr}</time>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{t("readingTime", { minutes: post.readingMinutes })}</span>
            </div>

            <h1 className="mt-4 font-display text-display-lg font-medium leading-[1.08]">
              {post.title[l]}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {post.description[l]}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-12 space-y-6">
              {post.body[l].map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>
          </Reveal>

          {/* Related posts — internal linking lifts SEO and dwell time. */}
          {(() => {
            const related = POSTS_BY_DATE.filter((p) => p.slug !== slug).slice(0, 2);
            if (related.length === 0) return null;
            return (
              <Reveal delay={120}>
                <section className="mt-16 border-t border-border pt-10">
                  <h2 className="mb-6 font-mono text-kicker uppercase tracking-widest text-muted-foreground">
                    {t("relatedTitle")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {related.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/${locale}/blog/${p.slug}`}
                        className="group flex h-full flex-col rounded-lg border border-border bg-elevated p-6 transition-colors duration-220 hover:border-foreground"
                      >
                        <span className="font-display text-lg font-medium leading-snug transition-colors duration-220 group-hover:text-saffron-600">
                          {p.title[l]}
                        </span>
                        <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {p.description[l]}
                        </span>
                        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-saffron-600">
                          {t("readMore")}
                          <ArrowUpRight className="h-3 w-3 transition-transform duration-220 group-hover:translate-x-0.5 rtl:scale-x-[-1]" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              </Reveal>
            );
          })()}

          {/* Next steps — internal links to money pages distribute link
              equity and route warm readers toward the commercial surface. */}
          <Reveal delay={130}>
            <nav
              aria-label="Next steps"
              className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              <span>{">"}</span>
              <Link
                href={`/${locale}/pricing`}
                className="inline-flex items-center gap-1.5 text-saffron-600 transition-colors duration-180 hover:text-saffron-400"
              >
                {tNav("pricing")}
                <ArrowUpRight className="h-3 w-3 rtl:scale-x-[-1]" />
              </Link>
              <Link
                href={`/${locale}/use-cases`}
                className="inline-flex items-center gap-1.5 text-saffron-600 transition-colors duration-180 hover:text-saffron-400"
              >
                {tNav("useCases")}
                <ArrowUpRight className="h-3 w-3 rtl:scale-x-[-1]" />
              </Link>
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-1.5 text-saffron-600 transition-colors duration-180 hover:text-saffron-400"
              >
                {tNav("blog")}
                <ArrowUpRight className="h-3 w-3 rtl:scale-x-[-1]" />
              </Link>
            </nav>
          </Reveal>

          {/* CTA */}
          <Reveal delay={140}>
            <div className="mt-16 rounded-lg border border-saffron-500/30 bg-saffron-500/8 p-8 text-center">
              <Link
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-sm font-medium text-saffron-50 transition-all duration-220 ease-soft hover:gap-3 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
              >
                {t("cta")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
              </Link>
            </div>
          </Reveal>
        </div>
      </article>

      <Footer locale={locale} />
    </main>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "h2") {
    return (
      <h2 className="pt-4 font-display text-2xl font-medium leading-snug">
        {block.text}
      </h2>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="space-y-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-base leading-relaxed text-muted-foreground">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="text-base leading-relaxed text-muted-foreground">{block.text}</p>
  );
}
