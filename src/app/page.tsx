import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Khatam, Arch, Waveform } from "@/components/zellige";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vocazai.com";

export const metadata: Metadata = {
  title: "VocazAI — Choose your language · اختر لغتك",
  description:
    "VocazAI — AI voice agents for the MENA region. Choose your language to enter: French, English, or Arabic.",
  alternates: {
    canonical: "/",
    languages: { fr: "/fr", en: "/en", ar: "/ar", "x-default": "/fr" },
  },
};

const LOCALES = [
  {
    code: "fr",
    label: "Français",
    flag: "France · Maroc",
    cta: "Entrer en français",
    hint: "Conçu au Maroc",
  },
  {
    code: "en",
    label: "English",
    flag: "International",
    cta: "Enter in English",
    hint: "Built in Casablanca",
  },
  {
    code: "ar",
    label: "العربية",
    flag: "المغرب · المنطقة",
    cta: "ادخل بالعربية",
    hint: "صُمّم في الدار البيضاء",
    rtl: true,
  },
] as const;

export default function SplashPage() {
  return (
    <main className="relative grid min-h-screen overflow-hidden bg-ink-900 text-saffron-50">
      {/* Decorative geometry — varied shapes, low opacity, soft motion */}
      <Khatam
        size={780}
        className="pointer-events-none absolute -right-40 -top-40 text-saffron-500/12"
        style={{ animation: "spin 60s linear infinite" }}
      />
      <Arch
        size={520}
        className="pointer-events-none absolute -left-20 -bottom-32 text-teal-500/12"
      />
      <Khatam
        size={260}
        className="pointer-events-none absolute right-1/4 top-1/3 text-saffron-500/8"
      />

      {/* Hairline grid effect — vertical lines */}
      <div className="pointer-events-none absolute inset-0 flex justify-center" aria-hidden>
        <div className="flex h-full w-full max-w-7xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-r border-saffron-50/[0.025] last:border-r-0"
            />
          ))}
        </div>
      </div>

      {/* Top bar */}
      <header className="container relative z-10 flex h-20 items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-saffron-500 font-display text-base font-extrabold italic text-ink-900">
            V
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            VocazAI
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-saffron-50/50">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
          <span>2025 · Maghreb &amp; West Africa</span>
        </div>
      </header>

      {/* Center — headline + tiles */}
      <div className="container relative z-10 flex flex-1 flex-col items-start justify-center py-12 lg:justify-center">
        {/* Kicker */}
        <div className="mb-10 inline-flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
          <span className="font-mono text-kicker uppercase text-saffron-50/60">
            01 — Voice AI · MENA Native
          </span>
        </div>

        {/* Headline — staged in three languages */}
        <h1 className="font-display text-display-2xl font-medium leading-[0.92]">
          <span className="block text-saffron-50">L&apos;agent qui décroche</span>
          <span className="block italic text-saffron-500">
            même quand vous dormez.
          </span>
        </h1>

        <div className="mt-8 max-w-2xl space-y-2 text-saffron-50/55">
          <p className="font-display text-xl italic">
            The voice agent that picks up — even when you sleep.
          </p>
          <p
            dir="rtl"
            className="font-display text-xl italic"
            lang="ar"
          >
            الوكيل الذي يرد — حتى عندما تنام.
          </p>
        </div>

        {/* Language tiles */}
        <div className="mt-16 grid w-full gap-3 sm:grid-cols-3">
          {LOCALES.map((l, idx) => (
            <Link
              key={l.code}
              href={`/${l.code}`}
              dir={"rtl" in l && l.rtl ? "rtl" : "ltr"}
              className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-saffron-50/10 bg-saffron-50/[0.025] p-7 backdrop-blur-sm transition-all duration-260 ease-soft hover:-translate-y-1 hover:border-saffron-500 hover:bg-saffron-50/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/50"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-saffron-50/50">
                  <span>0{idx + 1}</span>
                  <span className="h-px flex-1 bg-saffron-50/15" />
                  <span>{l.code.toUpperCase()}</span>
                </div>
                <div
                  className={`mt-8 font-display text-5xl font-medium ${
                    "rtl" in l && l.rtl ? "" : "italic"
                  }`}
                >
                  {l.label}
                </div>
                <div className="mt-2 text-xs uppercase tracking-wider text-saffron-50/40">
                  {l.flag}
                </div>
              </div>
              <div className="mt-12 flex items-center justify-between">
                <span className="text-sm text-saffron-50/70 transition-colors duration-220 group-hover:text-saffron-500">
                  {l.cta}
                </span>
                <ArrowUpRight className="h-5 w-5 text-saffron-50/40 transition-all duration-220 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-saffron-500" />
              </div>
              {/* Bottom hint */}
              <div className="mt-3 text-[10px] uppercase tracking-widest text-saffron-50/30">
                {l.hint}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom band */}
      <footer className="container relative z-10 flex flex-col items-start justify-between gap-4 border-t border-saffron-50/10 py-6 text-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Waveform bars={18} className="text-saffron-500/70" />
          <span className="font-mono uppercase tracking-widest text-saffron-50/40">
            Live voice AI · 24/7
          </span>
        </div>
        <div className="font-mono uppercase tracking-widest text-saffron-50/40">
          Conçu à Casablanca · © 2025 VocazAI
        </div>
      </footer>
    </main>
  );
}
