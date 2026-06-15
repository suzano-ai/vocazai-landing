import { POSTS_BY_DATE } from "@/content/blog/posts";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

/**
 * Atom-style RSS feed of the blog. AI summarizers (Perplexity, ChatGPT
 * plugins), feed readers, and aggregators consume this to track new
 * publications. Auto-rebuilt on every blog publish via CI.
 *
 * English locale used for the feed body; per-locale items reference the
 * English URL. Lightweight implementation — no enclosures, no media.
 */
function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const latest = POSTS_BY_DATE[0]?.date ?? "2026-01-01";

  const items = POSTS_BY_DATE.map((p) => {
    const url = `${BASE}/en/blog/${p.slug}`;
    return [
      "  <item>",
      `    <title>${escape(p.title.en)}</title>`,
      `    <link>${url}</link>`,
      `    <guid isPermaLink="true">${url}</guid>`,
      `    <pubDate>${new Date(p.date).toUTCString()}</pubDate>`,
      `    <description>${escape(p.description.en)}</description>`,
      "  </item>",
    ].join("\n");
  }).join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    "  <title>VocazAI Blog</title>",
    `  <link>${BASE}/en/blog</link>`,
    `  <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />`,
    "  <description>Resources on AI voice agents, trilingual phone reception, and small-business automation.</description>",
    "  <language>en-us</language>",
    `  <lastBuildDate>${new Date(latest).toUTCString()}</lastBuildDate>`,
    items,
    "</channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
