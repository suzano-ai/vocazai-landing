import type { MetadataRoute } from "next";
import { routing } from "../../i18n/routing";
import { POSTS_BY_DATE } from "@/content/blog/posts";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

/**
 * Dynamic sitemap — every (locale × path) with hreflang alternates so Google
 * maps each page to its language. Marketing pages rank; legal pages are
 * indexable but minor. Blog posts are appended from the typed content module.
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
  { path: "/blog",          priority: 0.7, changeFrequency: "weekly" },
  { path: "/legal/terms",   priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" },
];

function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`])
    ),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = PAGES.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: alternates(path),
    }))
  );

  const blogEntries = POSTS_BY_DATE.flatMap((post) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: alternates(`/blog/${post.slug}`),
    }))
  );

  return [...staticEntries, ...blogEntries];
}
