import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../i18n/routing";
import { LangSetter } from "@/components/lang-setter";
import { VoiceOver } from "@/components/voice-over";
import { JsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

// WebSite structured data. Organization + SoftwareApplication live in the
// root layout's <head> — don't duplicate them here.
const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "VocazAI",
  url: SITE,
  inLanguage: ["fr", "en", "ar"],
  // SearchAction — makes the site eligible for Google's sitelinks search
  // box (an inline search box inside the SERP entry for vocazai.com). The
  // urlTemplate matches the OpenSearch description doc at /opensearch.xml.
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE}/en/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/**
 * Locale layout — no <html>/<body> (those are in the root layout).
 * Provides translations and updates html lang/dir on the client.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* WCAG 2.1 skip-link — invisible until tabbed, then jumps focus to
          the main content. Standard for keyboard and screen-reader users. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-saffron-500 focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:text-foreground focus:outline-none"
      >
        Skip to main content
      </a>
      <LangSetter locale={locale} />
      <JsonLd data={WEBSITE_JSONLD} />
      {children}
      {/* Marketing voice-over — greets the visitor on marketing pages */}
      <VoiceOver locale={locale} />
    </NextIntlClientProvider>
  );
}
