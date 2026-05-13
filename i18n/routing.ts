import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["fr", "en", "ar"],
  defaultLocale: "fr",
  // "always": every URL has a locale prefix. Middleware redirects / -> /fr.
  // Cleaner than "as-needed" because it avoids 404s on root when the
  // app router doesn't have an app/page.tsx at the root.
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
