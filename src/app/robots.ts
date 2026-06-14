import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

/**
 * Robots — search engines and AI assistants are explicitly welcome.
 *
 * Why we DO NOT disallow /dashboard or /login here even though they are
 * private: Google has been reporting "Indexed though blocked by robots.txt"
 * for those routes, because internal links from the marketing site point
 * at /login, and Google indexes them anyway from the link signal. Result:
 * ghost entries in the index with no snippet. The fix is the inverse —
 * leave them CRAWLABLE, and emit `noindex` from the page-level metadata
 * so Google can read it and remove them properly. See:
 *   /[locale]/(dashboard)/layout.tsx and /[locale]/(auth)/layout.tsx.
 *
 * /api/ and /auth/callback are NOT pages (no html output) so disallowing
 * them is fine — Google will never try to index them.
 */
const APP_DISALLOW = ["/api/", "/auth/"];

// Major AI / generative-engine crawlers — all explicitly allowed.
// References (provider docs): OpenAI, Anthropic, Perplexity, Google, Apple,
// Common Crawl, ByteDance, Meta, Amazon, Cohere, DuckDuckGo, Diffbot, You.
const AI_CRAWLERS = [
  "GPTBot",            // OpenAI training crawl
  "OAI-SearchBot",     // ChatGPT search index
  "ChatGPT-User",      // ChatGPT live browsing
  "ClaudeBot",         // Anthropic training crawl
  "Claude-Web",        // Anthropic live fetches
  "anthropic-ai",      // Legacy Anthropic UA
  "PerplexityBot",     // Perplexity index
  "Perplexity-User",   // Perplexity live fetches
  "Google-Extended",   // Gemini / Bard training opt-in
  "Applebot",          // Apple search + Siri
  "Applebot-Extended", // Apple Intelligence training
  "CCBot",             // Common Crawl (feeds many LLMs)
  "Amazonbot",         // Alexa / Q
  "Meta-ExternalAgent",// Meta AI training
  "FacebookBot",       // Meta link preview + AI
  "Bytespider",        // TikTok / Doubao
  "DuckAssistBot",     // DuckDuckGo AI
  "Diffbot",           // Diffbot KG (feeds AI agents)
  "YouBot",            // You.com
  "cohere-ai",         // Cohere
  "MistralAI-User",    // Mistral live fetches
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default — search engines + everything not explicitly named.
      {
        userAgent: "*",
        allow: "/",
        disallow: APP_DISALLOW,
      },
      // AI / answer engines — explicitly allowed (same disallow surface).
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: APP_DISALLOW,
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
