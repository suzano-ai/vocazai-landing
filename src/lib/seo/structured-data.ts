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
}): Record<string, unknown> {
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
    keywords: args.keywords,
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
