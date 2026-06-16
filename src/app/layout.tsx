import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Theme color = phosphor green; tints the Safari iOS URL bar and the
// Android Chrome status bar. Manifest covers the PWA install case;
// this <meta> covers the in-tab browser chrome.
export const viewport: Viewport = {
  themeColor: "#00FF87",
};

// Self-hosted fonts (src/fonts/) — no build-time fetch to fonts.gstatic.com,
// so Docker builds on the VPS are fast and never fail on a flaky Google reach.
const inter = localFont({
  src: "../fonts/inter-latin.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

const fraunces = localFont({
  src: [
    { path: "../fonts/fraunces-latin.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/fraunces-latin-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const tajawal = localFont({
  src: [
    { path: "../fonts/tajawal-arabic-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/tajawal-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/tajawal-arabic-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/tajawal-arabic-700.woff2", weight: "700", style: "normal" },
    { path: "../fonts/tajawal-arabic-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-tajawal",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VocazAI — L'agent vocal IA trilingue : français, arabe, anglais",
    template: "%s · VocazAI",
  },
  description:
    "VocazAI déploie des standardistes IA trilingues (FR · AR · EN) pour les entreprises de toutes tailles. Réception 24/7, prise de RDV, qualification de leads, support client.",
  applicationName: "VocazAI",
  authors: [{ name: "VocazAI", url: BASE_URL }],
  generator: "Next.js",
  keywords: [
    "agent vocal IA",
    "AI voice agent",
    "standardiste IA",
    "réception automatique",
    "agent vocal multilingue",
    "PME",
    "voice AI",
    "Vapi",
    "Retell",
    "agent téléphonique IA",
    "agent vocal trilingue",
    "français arabe anglais",
    "prise de rendez-vous automatique",
  ],
  alternates: {
    canonical: "/",
    languages: {
      fr: "/fr",
      en: "/en",
      ar: "/ar",
      "x-default": "/fr",
    },
  },
  openGraph: {
    type: "website",
    siteName: "VocazAI",
    url: BASE_URL,
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_001"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "VocazAI — L'agent vocal qui répond pour vous",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vocazai",
    creator: "@vocazai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2300FF87'/><text x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' font-family='Fraunces, serif' font-weight='800' font-style='italic' font-size='22' fill='%231A1714'>V</text></svg>",
  },
  // Search-engine ownership verification — wired to env so each console's
  // verification meta tag appears as soon as the value is set in .env.local.
  // Set GOOGLE_SITE_VERIFICATION (Search Console), BING_SITE_VERIFICATION
  // (Bing Webmaster Tools), YANDEX_SITE_VERIFICATION (Yandex Webmaster).
  verification: (() => {
    const v: NonNullable<Metadata["verification"]> = {};
    if (process.env.GOOGLE_SITE_VERIFICATION) v.google = process.env.GOOGLE_SITE_VERIFICATION;
    if (process.env.YANDEX_SITE_VERIFICATION) v.yandex = process.env.YANDEX_SITE_VERIFICATION;
    const other: Record<string, string> = {};
    if (process.env.BING_SITE_VERIFICATION) other["msvalidate.01"] = process.env.BING_SITE_VERIFICATION;
    if (Object.keys(other).length) v.other = other;
    return v;
  })(),
  category: "technology",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VocazAI",
  // Legal entity attribution — matches the operator named in the footer.
  // Google E-E-A-T treats legalName + numberOfEmployees as quality signals
  // when present alongside the brand name.
  legalName: "Mare Nostrum SARL",
  alternateName: "VocazAI by Mare Nostrum",
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 1, maxValue: 10 },
  url: BASE_URL,
  logo: `${BASE_URL}/opengraph-image`,
  description:
    "Trilingual AI voice agents (French / Arabic / English) for businesses of every size. Virtual receptionists available 24/7 — front-desk, appointment booking, lead qualification.",
  slogan: "The trilingual AI voice agent that picks up for you.",
  foundingDate: "2025",
  knowsLanguage: ["fr", "ar", "en"],
  knowsAbout: [
    "AI voice agent",
    "Voice receptionist",
    "Appointment booking",
    "Phone automation",
    "Conversational AI",
    "Speech-to-text",
    "Text-to-speech",
    "Lead qualification",
    "Multilingual customer service",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+33-7-77-34-50-56",
      availableLanguage: ["French", "Arabic", "English"],
    },
  ],
  sameAs: [
    "https://github.com/suzano-ai/vocazai-landing",
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "VocazAI Voice Agent",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: [
    {
      "@type": "Offer",
      name: "Starter",
      price: "499",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
    },
    {
      "@type": "Offer",
      name: "Growth",
      price: "1490",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read locale from the request header set in middleware so <html lang>
  // is correct at SSR time — Googlebot reads the initial HTML and uses
  // `lang` to map the page to its language. Client-side mutation arrives
  // too late for SEO.
  const { headers } = await import("next/headers");
  const h = await headers();
  const locale = h.get("x-locale") ?? "fr";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${tajawal.variable}`}
    >
      <head>
        {/* Preconnect / dns-prefetch — shaves DNS+TLS handshake off the first
            auth request to Supabase. Browsers that support preconnect skip
            the dns-prefetch fallback automatically. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="VocazAI Blog"
          href="/feed.xml"
        />
        <link
          rel="alternate"
          type="application/feed+json"
          title="VocazAI Blog (JSON Feed)"
          href="/feed.json"
        />
        {/* OpenSearch — lets users add VocazAI to their browser's search
            bar (Firefox/Edge/Chrome auto-detect this). Distinct discovery
            surface that survives a Google ranking dip. */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="VocazAI"
          href="/opensearch.xml"
        />
        {/* IndieAuth / Mastodon rel=me identity claim — makes the site
            bidirectionally verifiable for any third-party that links back
            via the GitHub profile. Mastodon shows a green checkmark on
            verified profile links; IndieAuth uses it for login federation. */}
        <link rel="me" href="https://github.com/suzano-ai/vocazai-landing" />
        {/* Windows Start menu / Edge tile branding. When a Windows user
            pins vocazai.com, the OS reads browserconfig.xml + these meta
            tags to render a proper phosphor tile instead of a generic
            screenshot preview. Distinct discovery surface. */}
        <meta name="msapplication-TileColor" content="#00FF87" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* Pre-resolve the WhatsApp shortlink so the [ START TRIAL ] click
            doesn't pay the DNS+TLS cost — every CTA on the site eventually
            redirects to wa.me. Shaves ~30-100ms off the perceived open
            time on mobile, where most Google traffic lands. */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preconnect" href="https://wa.me" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_SUPABASE_URL ? (() => {
          try {
            const origin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin;
            return (
              <>
                <link rel="preconnect" href={origin} crossOrigin="anonymous" />
                <link rel="dns-prefetch" href={origin} />
              </>
            );
          } catch {
            return null;
          }
        })() : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd),
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
