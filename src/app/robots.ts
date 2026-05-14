import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // App surfaces, not indexable content. Dashboard + login are
        // locale-prefixed (/fr/dashboard…), so the patterns need the wildcard.
        disallow: ["/*/dashboard", "/*/login", "/api/", "/auth/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
