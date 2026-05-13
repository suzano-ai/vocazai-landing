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

export const metadata: Metadata = {
  metadataBase: new URL("https://vocazai.com"),
  title: {
    default: "VocazAI — L'agent vocal qui répond pour vous",
    template: "%s · VocazAI",
  },
  description:
    "VocazAI déploie des standardistes IA bilingues pour les PME marocaines et africaines. Réception, prise de rendez-vous, support 24/7.",
  openGraph: {
    type: "website",
    siteName: "VocazAI",
    url: "https://vocazai.com",
    locale: "fr_MA",
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23E8A12C'/><text x='50%25' y='58%25' dominant-baseline='middle' text-anchor='middle' font-family='Fraunces, serif' font-weight='800' font-style='italic' font-size='22' fill='%231A1714'>V</text></svg>",
  },
};

/**
 * Root layout — the ONLY place where <html> and <body> live.
 * The locale-specific layout under `[locale]/` provides translations
 * and updates html lang/dir via a Client Component side-effect.
 */
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
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
