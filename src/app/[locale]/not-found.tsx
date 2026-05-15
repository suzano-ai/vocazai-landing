import Link from "next/link";

const COPY: Record<string, { title: string; body: string; home: string; blog: string }> = {
  fr: {
    title: "Page introuvable",
    body: "Cette page n'existe pas — peut-être déplacée ou supprimée. Retournez à l'accueil pour continuer.",
    home: "Retour à l'accueil",
    blog: "Lire le blog",
  },
  en: {
    title: "Page not found",
    body: "This page doesn't exist — it may have moved or been removed. Head back home to keep going.",
    home: "Back to home",
    blog: "Read the blog",
  },
  ar: {
    title: "الصفحة غير موجودة",
    body: "هذه الصفحة غير موجودة — ربما نُقلت أو حُذفت. عُد إلى الصفحة الرئيسية للمتابعة.",
    home: "العودة إلى الصفحة الرئيسية",
    blog: "اقرأ المدوّنة",
  },
};

/**
 * Locale-scoped 404 — picked when a route under /[locale]/... doesn't
 * exist. Next.js can't reliably resolve the active locale from params
 * in not-found, so we render all three sections via hidden DOM and let
 * a tiny inline script pick the matching one from <html lang>. Good
 * enough for an error page; no extra round-trip.
 */
export default function LocaleNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink-900 px-6 text-saffron-50">
      <div className="max-w-lg text-center">
        <div className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-saffron-50/50">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
          <span>404 · Not Found</span>
        </div>
        <h1 className="font-display text-display-lg font-medium leading-[1.05] sm:text-display-xl">
          {COPY.fr.title}
          <span data-l="en" hidden>{COPY.en.title}</span>
          <span data-l="ar" hidden dir="rtl">{COPY.ar.title}</span>
        </h1>
        <p className="mt-6 text-base text-saffron-50/60">
          <span data-l="fr">{COPY.fr.body}</span>
          <span data-l="en" hidden>{COPY.en.body}</span>
          <span data-l="ar" hidden dir="rtl">{COPY.ar.body}</span>
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-saffron-500 px-7 py-3 text-sm font-medium text-ink-900 transition-colors duration-220 hover:bg-saffron-400"
          >
            <span data-l="fr">{COPY.fr.home}</span>
            <span data-l="en" hidden>{COPY.en.home}</span>
            <span data-l="ar" hidden>{COPY.ar.home}</span>
          </Link>
          <Link
            href="/fr/blog"
            className="rounded-full border border-saffron-50/20 px-7 py-3 text-sm font-medium text-saffron-50/80 transition-colors duration-220 hover:border-saffron-500/60 hover:text-saffron-50"
          >
            <span data-l="fr">{COPY.fr.blog}</span>
            <span data-l="en" hidden>{COPY.en.blog}</span>
            <span data-l="ar" hidden>{COPY.ar.blog}</span>
          </Link>
        </div>
      </div>
      <script
        // Surface the correct locale section based on <html lang>.
        dangerouslySetInnerHTML={{
          __html:
            "(()=>{var l=document.documentElement.lang||'fr';document.querySelectorAll('[data-l]').forEach(e=>{if(e.dataset.l===l){e.hidden=false}else if(e.dataset.l==='fr'){e.hidden=true}});})();",
        }}
      />
    </main>
  );
}
