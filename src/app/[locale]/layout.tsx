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
      <LangSetter locale={locale} />
      <JsonLd data={WEBSITE_JSONLD} />
      {children}
      {/* Marketing voice-over — greets the visitor on marketing pages */}
      <VoiceOver locale={locale} />
    </NextIntlClientProvider>
  );
}
