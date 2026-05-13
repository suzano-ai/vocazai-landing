import type { MetadataRoute } from "next";
import { routing } from "../../i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

const PATHS = ["", "/about", "/pricing", "/use-cases"] as const;

/**
 * Dynamic sitemap.
 * Lists every (locale × path) combination with hreflang alternates so
 * Google understands which page maps to which language.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  );
}
