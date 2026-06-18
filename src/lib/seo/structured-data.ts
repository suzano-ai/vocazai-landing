/**
 * JSON-LD helpers. Page components import these and render the result via
 * the <JsonLd> component (src/components/json-ld.tsx).
 *
 * Why this matters: Google + AI answer engines parse schema.org structured
 * data to pick rich results, sitelinks, voice-assistant snippets, and to
 * understand page hierarchy. The richer and more accurate the markup, the
 * better the chance of being cited.
 */

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

function abs(url: string): string {
  return url.startsWith("http") ? url : `${SITE}${url}`;
}

/**
 * BreadcrumbList — tells search engines the page's place in the site
 * hierarchy. Emit on every non-home page.
 *
 * When `opts.url` is provided, the list is given a stable `@id`
 * (`${abs(url)}#breadcrumb`) so per-page WebPage / CollectionPage /
 * AboutPage entities can reference it via `breadcrumb: { @id: ... }`.
 * Matching @ids let Google fold every reference into one node and
 * concentrate authority signals on a single graph.
 *
 * When `opts.locale` is provided, `inLanguage` is emitted so the
 * breadcrumb is correctly localized in the entity graph alongside
 * the hreflang signals.
 */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
  opts?: { url?: string; locale?: string }
): Record<string, unknown> {
  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
  if (opts?.url) json["@id"] = `${abs(opts.url)}#breadcrumb`;
  if (opts?.locale) json.inLanguage = opts.locale;
  return json;
}

/**
 * BlogPosting — a richer post schema than the bare-bones one. Includes
 * `speakable` so voice assistants can read out the headline + summary.
 */
export function blogPostingJsonLd(args: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  inLanguage: string;
  wordCount?: number;
  keywords?: string[];
  slug?: string;
  readingMinutes?: number;
  articleBody?: string;
  mentions?: { url: string; title: string }[];
}): Record<string, unknown> {
  // Auto-derive keywords from the slug when none provided. Slugs are
  // hyphen-separated semantic tokens (e.g. "agent-vocal-ia-pharmacie"
  // -> ["agent vocal ia", "pharmacie"]) — usable as-is by Google.
  const derivedKeywords =
    args.keywords ??
    (args.slug ? args.slug.split("-").reduce<string[]>((acc, token, i, all) => {
      // Group "agent-vocal-ia" as one keyword phrase, then the vertical tail.
      if (i === 0 && all.length > 3) acc.push(all.slice(0, 3).join(" "));
      if (i >= 3) acc.push(token);
      return acc;
    }, []) : undefined);

  // Locale-aware Blog @id reference — links every BlogPosting back to
  // the collection emitted on /[locale]/blog (see blogIndexJsonLd). Tells
  // Google the post is a child of the blog entity, not a standalone page.
  const blogIndexId = `${SITE}/${args.inLanguage}/blog`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.description,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    inLanguage: args.inLanguage,
    mainEntityOfPage: abs(args.url),
    url: abs(args.url),
    wordCount: args.wordCount,
    // Full plain-text body. AI Overviews / Gemini / Bing Copilot pick
    // citations from `articleBody` directly when it's present; without
    // it, they have to infer the body from HTML scraping (slower, less
    // precise, sometimes wrong). The payload cost is small (~1-2KB
    // per locale) for a meaningful share of voice in answer engines.
    articleBody: args.articleBody,
    // Cross-link siblings — each post mentions its 2 nearest neighbors
    // (semantic for vertical posts via shared keyword tokens, recency
    // for cross-cutting ones). Google reads `mentions` as a topical-
    // cluster signal: when one post in the cluster ranks well, the
    // others inherit some of that authority instead of having to
    // earn it from scratch. Also helps AI engines surface a "related"
    // carousel when citing the post.
    mentions: args.mentions?.map((m) => ({
      "@type": "CreativeWork",
      url: abs(m.url),
      name: m.title,
    })),
    // ISO 8601 duration — Google reads `timeRequired` as a freshness +
    // depth signal and may use it for "X-min read" SERP annotations.
    timeRequired:
      typeof args.readingMinutes === "number"
        ? `PT${args.readingMinutes}M`
        : undefined,
    // Entity-graph chain: post → blog collection → website. Reusing the
    // same @id Google saw on /blog stitches everything into one graph
    // and concentrates authority signals on the collection.
    isPartOf: {
      "@type": "Blog",
      "@id": blogIndexId,
      url: blogIndexId,
    },
    keywords: derivedKeywords,
    articleSection: "AI Voice Agent",
    // Article rich-result eligibility on Google requires a non-empty
    // `image` field. We point at the per-locale OG route so the chosen
    // image matches the reading language; 1200x630 is Google's preferred
    // aspect ratio for Top Stories / Article carousels.
    image: {
      "@type": "ImageObject",
      url: `${SITE}/${args.inLanguage}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    author: { "@type": "Organization", name: "VocazAI", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "VocazAI",
      logo: { "@type": "ImageObject", url: `${SITE}/opengraph-image` },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      // h1 + lede + every section header. Google Assistant / AI Overview
      // use this to pick the spoken excerpt; including h2s lets them
      // surface the most relevant section, not just the opening line.
      cssSelector: ["h1", "article p:first-of-type", "article h2"],
    },
  };
}

/**
 * Blog (collection) — schema.org Blog with every published post nested as
 * a BlogPosting reference. Tells Google the index page IS a structured
 * list of articles (not just a generic page), accelerates discovery of
 * newly-added slugs, and makes the blog index eligible for richer SERP
 * presentation (multi-item list, sitelinks, "more from this blog").
 */
export function blogIndexJsonLd(args: {
  locale: string;
  name: string;
  description: string;
  posts: { slug: string; date: string; title: string; description: string }[];
}): Record<string, unknown> {
  const indexUrl = `${SITE}/${args.locale}/blog`;
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": indexUrl,
    url: indexUrl,
    name: args.name,
    description: args.description,
    inLanguage: args.locale,
    publisher: {
      "@type": "Organization",
      name: "VocazAI",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/opengraph-image` },
    },
    blogPost: args.posts.map((p) => {
      const url = `${SITE}/${args.locale}/blog/${p.slug}`;
      return {
        "@type": "BlogPosting",
        "@id": url,
        url,
        mainEntityOfPage: url,
        headline: p.title,
        description: p.description,
        datePublished: new Date(p.date).toISOString(),
        inLanguage: args.locale,
        author: { "@type": "Organization", name: "VocazAI", url: SITE },
      };
    }),
  };
}

/**
 * Pricing (Product + AggregateOffer) — declares /pricing as a Product page
 * with a concrete USD price range. Without it, Google can't extract price
 * directly from this URL (the SoftwareApplication Offer on the landing page
 * helps the homepage, not /pricing). Adding it here unlocks rich-result
 * eligibility for the canonical money page — price chips in SERP, "from
 * $499/mo" snippets, and the Shopping/Software-pricing carousel.
 *
 * Only Starter + Growth are emitted as concrete Offers (offerCount: 2).
 * Enterprise is "contact us" with no fixed price and is described in copy
 * but intentionally NOT as a structured Offer (Google rejects Offers with
 * missing price).
 */
export function pricingJsonLd(args: {
  locale: string;
  name: string;
  description: string;
}): Record<string, unknown> {
  const url = `${SITE}/${args.locale}/pricing`;
  const offer = (name: string, price: string) => ({
    "@type": "Offer",
    name,
    price,
    priceCurrency: "USD",
    url,
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price,
      priceCurrency: "USD",
      billingDuration: "P1M",
      unitText: "month",
    },
  });
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    name: args.name,
    description: args.description,
    url,
    image: `${SITE}/${args.locale}/opengraph-image`,
    brand: { "@type": "Brand", name: "VocazAI" },
    category: "AI voice receptionist software",
    inLanguage: args.locale,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "499",
      highPrice: "1490",
      offerCount: 2,
      offers: [offer("Starter", "499"), offer("Growth", "1490")],
    },
  };
}
