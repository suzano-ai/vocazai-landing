import Link from "next/link";
import type { Metadata } from "next";

/**
 * Global 404 — rendered for paths outside the [locale] segment. Sends
 * the visitor back to the French splash. Locale-aware 404 lives under
 * src/app/[locale]/not-found.tsx.
 */
export const metadata: Metadata = {
  title: "Page introuvable · VocazAI",
  description: "Cette page n'existe pas. Retour à l'accueil.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink-900 px-6 text-saffron-50">
      <div className="max-w-lg text-center">
        <div className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-saffron-50/50">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
          <span>404 · Not Found</span>
        </div>
        <h1 className="font-display text-display-lg font-medium leading-[1.05] sm:text-display-xl">
          Page introuvable
        </h1>
        <p className="mt-6 text-base text-saffron-50/60">
          Cette page n&apos;existe pas — peut-être déplacée ou supprimée.
          Retournez à l&apos;accueil pour continuer.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-saffron-500 px-7 py-3 text-sm font-medium text-ink-900 transition-colors duration-220 hover:bg-saffron-400"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/fr/blog"
            className="rounded-full border border-saffron-50/20 px-7 py-3 text-sm font-medium text-saffron-50/80 transition-colors duration-220 hover:border-saffron-500/60 hover:text-saffron-50"
          >
            Lire le blog
          </Link>
        </div>
      </div>
    </main>
  );
}
