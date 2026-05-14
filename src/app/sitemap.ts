import type { MetadataRoute } from "next";
import { routing } from "../../i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

/**
 * Dynamic sitemap — every (locale × path) with hreflang alternates so Google
 * maps each page to its language. Marketing pages rank; legal pages are
 * indexable but minor. Blog posts are appended once the blog ships.
 */
const PAGES: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "",               priority: 1.0, changeFrequency: "weekly" },
  { path: "/about",         priority: 0.8, changeFrequency: "monthly" },
  { path: "/pricing",       priority: 0.8, changeFrequency: "monthly" },
  { path: "/use-cases",     priority: 0.8, changeFrequency: "monthly" },
  { path: "/legal/terms",   priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
        ),
      },
    }))
  );
}
