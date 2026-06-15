import { POSTS_BY_DATE } from "@/content/blog/posts";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

/**
 * Dynamic /llms.txt — replaces the old static /public/llms.txt so the file
 * is rebuilt with every new blog post on every CI deploy. Spec: https://llmstxt.org
 *
 * Why this matters: AI answer engines (ChatGPT search, Perplexity, Gemini,
 * Claude.ai) read llms.txt to understand a site's surface and decide what
 * to cite. A stale file under-represents the content we want surfaced.
 */
export async function GET(): Promise<Response> {
  const intro = [
    "# VocazAI",
    "",
    "> Trilingual AI voice receptionist (French · Arabic · English) for businesses of every size. The AI answers your phone 24/7, takes appointments, qualifies leads, and handles FAQs — switching between the three languages mid-call based on the caller.",
    "",
    "VocazAI is a SaaS product. A business subscribes, configures an AI agent through a dashboard, attaches a phone number, and the agent starts answering calls within 24-48 hours. Pricing is in US dollars: Starter $499/mo (100 minutes, 1 agent, 1 language), Growth $1,490/mo (500 minutes, 3 agents, full trilingual, CRM integration), Custom (unlimited, dedicated SLA). The first month is free.",
    "",
    "VocazAI is operated by Mare Nostrum SARL. Contact: hello@vocazai.com · +33 7 77 34 50 56. Available worldwide.",
    "",
    "## Core pages",
    "",
    `- [Home (English)](${BASE}/en): Product overview, live demo, FAQ`,
    `- [Home (French)](${BASE}/fr): Same content in French`,
    `- [Home (Arabic)](${BASE}/ar): Same content in Arabic`,
    `- [Pricing](${BASE}/en/pricing): All three plans with feature comparison and USD pricing`,
    `- [Use cases](${BASE}/en/use-cases): Clinics, real estate, restaurants, auto shops, salons`,
    `- [About](${BASE}/en/about): Mission, values, story, team`,
    `- [Blog](${BASE}/en/blog): Resources for phone reception, AI voice agents and trilingual deployment`,
    "",
    "## Blog posts",
    "",
  ].join("\n");

  const posts = POSTS_BY_DATE.map(
    (p) => `- [${p.title.en}](${BASE}/en/blog/${p.slug}): ${p.description.en}`
  ).join("\n");

  const outro = [
    "",
    "## Optional",
    "",
    `- [Terms of Service](${BASE}/en/legal/terms)`,
    `- [Privacy Policy](${BASE}/en/legal/privacy)`,
    `- [Sitemap](${BASE}/sitemap.xml)`,
    `- [Security policy (RFC 9116)](${BASE}/.well-known/security.txt)`,
    "",
  ].join("\n");

  return new Response(intro + posts + outro, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
