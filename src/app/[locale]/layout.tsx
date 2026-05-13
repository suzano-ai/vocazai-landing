import type { Metadata } from "next";
import { Inter, Space_Grotesk, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-noto-arabic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://vocazai.com"),
  title: {
    default: "VocazAI — L'agent vocal qui répond pour vous",
    template: "%s · VocazAI",
  },
  description:
    "VocazAI déploie des standardistes IA bilingues pour les PME marocaines et africaines. Réception, prise de RDV, support 24/7.",
  alternates: {
    canonical: "/",
    languages: { fr: "/fr", en: "/en", ar: "/ar" },
  },
  openGraph: {
    type: "website",
    siteName: "VocazAI",
    url: "https://vocazai.com",
    locale: "fr_MA",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23047857'/><text x='50%25' y='56%25' dominant-baseline='middle' text-anchor='middle' font-family='Space Grotesk, sans-serif' font-weight='700' font-size='18' fill='%23FEFCF8'>V</text></svg>",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${notoArabic.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
