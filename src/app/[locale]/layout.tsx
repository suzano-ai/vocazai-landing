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

// Site-wide structured data — Organization + WebSite.
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VocazAI",
  url: SITE,
  logo: `${SITE}/opengraph-image`,
  description:
    "VocazAI déploie des agents vocaux IA (français, arabe, anglais) pour les PME du Maroc et d'Afrique : réception 24/7, prise de rendez-vous, qualification de leads.",
  foundingDate: "2025",
  areaServed: ["MA", "Africa"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+33777345056",
    availableLanguage: ["fr", "ar", "en"],
  },
};

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
      <JsonLd data={ORG_JSONLD} />
      <JsonLd data={WEBSITE_JSONLD} />
      {children}
      {/* Marketing voice-over — greets the visitor on marketing pages */}
      <VoiceOver locale={locale} />
    </NextIntlClientProvider>
  );
}
