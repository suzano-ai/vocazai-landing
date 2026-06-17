import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { MobileStickyBar } from "@/components/landing/mobile-sticky-bar";
import { Khatam } from "@/components/zellige";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ReadingProgress } from "@/components/reading-progress";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { POSTS, POSTS_BY_DATE, getPost, type BlogLocale, type Block } from "@/content/blog/posts";
import { routing } from "../../../../../i18n/routing";

const DATE_LOCALE: Record<string, string> = { fr: "fr-FR", en: "en-US", ar: "ar-MA" };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    POSTS.map((post) => ({ locale, slug: post.slug }))
  );
}

// Derive a small tag list from the slug — same convention as
// blogPostingJsonLd. Groups "agent-vocal-ia" as one phrase, then any
// vertical tail tokens. Returns at most 5 OG tags.
function derivedTags(slug: string): string[] {
  const all = slug.split("-");
  const tags: string[] = [];
  if (all.length > 3) tags.push(all.slice(0, 3).join(" "));
  for (let i = 3; i < all.length; i++) tags.push(all[i]);
  return tags.slice(0, 5);
}

const OG_LOCALE: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
  ar: "ar_001",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const l = locale as BlogLocale;
  const tags = derivedTags(slug);
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
    // Complete Open Graph Article tag set. Without `images`, social
    // previews fall back to the site-wide OG; without `authors`,
    // `section`, `modifiedTime`, and `tags`, FB / LinkedIn / Slack
    // render a generic "website" card rather than the richer Article
    // card. Together these also pad the E-E-A-T signal Google reads
    // for Article rich-result eligibility.
    openGraph: {
      title: post.title[l],
      description: post.description[l],
      url: `/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ["VocazAI"],
      section: "AI Voice Agent",
      tags,
      locale: OG_LOCALE[locale] ?? "fr_FR",
      images: [
        {
          url: `/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title[l],
        },
      ],
    },
    // Explicit Twitter card so X / Slack / Mastodon render the large
    // image preview instead of falling back to the link-text card.
    twitter: {
      card: "summary_large_image",
      title: post.title[l],
      description: post.description[l],
      images: [`/${locale}/opengraph-image`],
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
  // Pre-fill the WhatsApp message with this post's title so the founder
  // sees immediate context on first reply ("I read your article on X").
  // Higher perceived attentiveness + faster qualification = better close
  // rate than the generic trial-start template used elsewhere on the site.
  const wa = `https://wa.me/33777345056?text=${encodeURIComponent(
    tc("whatsappFromBlog", { title: post.title[l] })
  )}`;
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

  // Flatten the typed body blocks into plain text for the BlogPosting
  // `articleBody` field. AI answer engines (Google AI Overviews,
  // Gemini, Bing Copilot) pick citations from articleBody directly
  // when it's present — without it they have to scrape HTML which is
  // slower and sometimes inaccurate. H2 → "## " prefix preserves
  // section boundaries; ul → "- " bullet prefix preserves list
  // structure. Newline-separated so the model can identify breaks.
  const articleBody = post.body[l]
    .map((block) => {
      if (block.type === "h2") return `## ${block.text}`;
      if (block.type === "ul") return block.items.map((it) => `- ${it}`).join("\n");
      return block.text;
    })
    .join("\n\n");

  // Compute 2 nearest neighbors for the BlogPosting `mentions` field.
  // Score = number of shared slug tokens between this post's slug and
  // each candidate's slug — higher = more topically related. Falls
  // back to recency when no candidate shares a token (rare). The
  // result is the cluster signal Google uses to spread authority
  // between semantically-adjacent posts.
  const thisTokens = new Set(slug.split("-"));
  const neighbors = POSTS_BY_DATE.filter((p) => p.slug !== slug)
    .map((p) => {
      const shared = p.slug
        .split("-")
        .reduce((n, tok) => n + (thisTokens.has(tok) ? 1 : 0), 0);
      return { post: p, score: shared };
    })
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, 2)
    .map((x) => ({
      url: `/${locale}/blog/${x.post.slug}`,
      title: x.post.title[l],
    }));

  const articleJsonLd = blogPostingJsonLd({
    title: post.title[l],
    description: post.description[l],
    url: `/${locale}/blog/${slug}`,
    datePublished: post.date,
    inLanguage: locale,
    wordCount,
    slug,
    readingMinutes: post.readingMinutes,
    articleBody,
    mentions: neighbors,
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
      {/* Sticky reading-progress bar — visible only on long-form posts.
          Tracks scroll position through the <article> below, encouraging
          completion and giving readers a low-cost progress signal. */}
      <ReadingProgress target="article" />

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
            {/* Topic tag chips — derived from the slug (same logic as the
                OG `tags` meta + BlogPosting `keywords`). Surfacing them
                visibly in the header gives skim-readers an immediate
                topic-relevance signal, mirrors the JSON-LD keyword set
                with visible text (good for Google semantic matching), and
                creates a future hook for tag-filtered blog views. */}
            {(() => {
              const tags = derivedTags(slug);
              if (tags.length === 0) return null;
              return (
                <ul
                  aria-label="Topic tags"
                  className="mt-6 flex flex-wrap items-center gap-2"
                >
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              );
            })()}
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-12 space-y-6">
              {post.body[l].map((block, i) => (
                <BlockView key={i} block={block} />
              ))}
            </div>
          </Reveal>

          {/* Back-to-top — server-rendered anchor link to the main element
              tagged in the locale layout. Helps mobile readers who scrolled
              through 1100+ chars per locale × 6+ h2 sections. */}
          <Reveal delay={100}>
            <div className="mt-10 flex justify-end">
              <a
                href="#main"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors duration-180 hover:text-saffron-500"
                aria-label="Back to top"
              >
                <ArrowLeft className="h-3 w-3 rotate-90 rtl:scale-x-[-1]" />
                Top
              </a>
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

          {/* CTA — hook microcopy above the button frames *why* now, and a
              risk-reversal chip below quantifies what the visitor commits
              to (nothing). Mirrors the landing-hero CTA pattern so the
              promise stays consistent across the funnel — a visitor who
              entered from a blog post sees the same trial terms they
              would on the home page. */}
          <Reveal delay={140}>
            <div className="mt-16 rounded-lg border border-saffron-500/30 bg-saffron-500/8 p-8 text-center">
              <p className="mb-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {t("ctaHook")}
              </p>
              <Link
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                data-vocazai-track="blog-post-cta"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-sm font-medium text-saffron-50 transition-all duration-220 ease-soft hover:gap-3 hover:bg-saffron-500 hover:text-ink-900 dark:bg-saffron-500 dark:text-ink-900 dark:hover:bg-saffron-400"
              >
                {t("cta")}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-220 group-hover:rotate-45 rtl:scale-x-[-1]" />
              </Link>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-saffron-700 dark:text-saffron-400">
                {t("trialChip")}
              </p>
            </div>
          </Reveal>
        </div>
      </article>

      <Footer locale={locale} />
      <MobileStickyBar wa={wa} />
    </main>
  );
}

// Stable per-locale slug for h2 ids — strip Latin accents, lowercase,
// fold any non-letter / non-digit run into a single dash. Works for FR,
// EN and AR text (Unicode \p{L} matches Arabic letters too); the URL
// fragment displays decoded in modern browsers.
function slugifyHeading(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function BlockView({ block }: { block: Block }) {
  if (block.type === "h2") {
    // Anchored heading — readers can share a deep link to a specific
    // section, and Google's "jump to section" SERP feature uses these
    // ids to surface in-page targets directly from search results.
    const id = slugifyHeading(block.text);
    return (
      <h2
        id={id}
        className="group scroll-mt-24 pt-4 font-display text-2xl font-medium leading-snug"
      >
        {block.text}
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="ms-2 align-middle font-mono text-saffron-500/0 transition-opacity duration-200 group-hover:text-saffron-500/70 hover:!text-saffron-500"
        >
          #
        </a>
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
