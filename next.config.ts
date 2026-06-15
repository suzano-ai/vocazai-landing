import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * Security headers — applied site-wide. Microphone is allowed on `self`
 * so the in-page voice demo can capture audio. No CSP yet: would need
 * to thread a nonce through every <script dangerouslySetInnerHTML>
 * (JSON-LD, locale 404 hydration shim) — to be added carefully later.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), payment=(), interest-cohort=()",
  },
];

const TEXT_CACHE = "public, max-age=3600, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standalone output bundles only the files needed to run in production.
  // Used by the Docker image — copies .next/standalone + .next/static.
  output: "standalone",
  async headers() {
    return [
      // Site-wide hardening — every route, including assets.
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Discoverability / AI-discovery files: cacheable but cheap to revalidate.
      { source: "/llms.txt", headers: [{ key: "Cache-Control", value: TEXT_CACHE }] },
      { source: "/humans.txt", headers: [{ key: "Cache-Control", value: TEXT_CACHE }] },
      { source: "/feed.xml", headers: [{ key: "Cache-Control", value: TEXT_CACHE }] },
      // Non-page assets that crawlers find but shouldn't show in search
      // results. RFC 9116 security.txt, humans.txt, IndexNow key file and
      // the RSS feed are all infrastructure — let them be crawled, but tell
      // search engines not to index them as standalone results.
      {
        source: "/security.txt",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/.well-known/security.txt",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/humans.txt",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/c33f90e268df7ba8f138ee23aa4b571b.txt",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/feed.xml",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
