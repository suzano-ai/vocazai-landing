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
 */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
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
