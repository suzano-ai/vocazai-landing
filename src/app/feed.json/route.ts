import { POSTS_BY_DATE } from "@/content/blog/posts";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

/**
 * JSON Feed v1.1 (https://www.jsonfeed.org/version/1.1/) — complements the
 * RSS feed at /feed.xml. Modern AI summarizers and feed readers (NetNewsWire,
 * Reeder, Feedbin, FeedLand) consume JSON Feed natively; preserves XML for
 * legacy readers via the existing /feed.xml.
 */
export async function GET(): Promise<Response> {
  const latest = POSTS_BY_DATE[0]?.date ?? "2026-01-01";

  const items = POSTS_BY_DATE.map((p) => {
    const url = `${BASE}/en/blog/${p.slug}`;
    return {
      id: url,
      url,
      title: p.title.en,
      content_text: p.description.en,
      date_published: new Date(p.date).toISOString(),
      authors: [{ name: "VocazAI", url: BASE }],
      language: "en",
    };
  });

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "VocazAI Blog",
    home_page_url: `${BASE}/en/blog`,
    feed_url: `${BASE}/feed.json`,
    description:
      "Resources on AI voice agents, trilingual phone reception, and small-business automation.",
    language: "en",
    icon: `${BASE}/opengraph-image`,
    favicon: `${BASE}/icon`,
    authors: [{ name: "VocazAI", url: BASE }],
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Last-Modified": new Date(latest).toUTCString(),
    },
  });
}
