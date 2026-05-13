import type { Metadata } from "next";
import { Inter, Fraunces, Tajawal } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VocazAI — L'agent vocal IA pour PME marocaines et africaines",
    template: "%s · VocazAI",
  },
  description:
    "VocazAI déploie des standardistes IA bilingues (FR · AR · EN) pour les PME marocaines et africaines. Réception 24/7, prise de RDV, qualification de leads, support client.",
  applicationName: "VocazAI",
  authors: [{ name: "VocazAI", url: BASE_URL }],
  generator: "Next.js",
  keywords: [
    "agent vocal IA",
    "AI voice agent",
    "standardiste IA",
    "réception automatique",
    "Maroc",
    "Casablanca",
    "PME",
    "voice AI Morocco",
    "Vapi",
    "Retell",
    "agent téléphonique IA",
    "darija",
    "français arabe",
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
    locale: "fr_MA",
    alternateLocale: ["en_US", "ar_MA"],
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
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23E8A12C'/><text x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' font-family='Fraunces, serif' font-weight='800' font-style='italic' font-size='22' fill='%231A1714'>V</text></svg>",
  },
  verification: {
    // Add your Google Search Console verification code here once registered.
    // google: "your-verification-code",
  },
  category: "technology",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VocazAI",
  url: BASE_URL,
  logo: `${BASE_URL}/opengraph-image`,
  description:
    "AI voice agents for SMBs across Morocco and Africa. Bilingual (FR/AR/EN) virtual receptionists available 24/7.",
  founderType: "Organization",
  foundingLocation: { "@type": "Place", name: "Casablanca, Morocco" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Casablanca",
    addressCountry: "MA",
  },
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
      priceCurrency: "MAD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
    },
    {
      "@type": "Offer",
      name: "Growth",
      price: "1490",
      priceCurrency: "MAD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "12",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${tajawal.variable}`}
    >
      <head>
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
