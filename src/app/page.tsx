import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Khatam, Arch, Waveform, NeuralNetwork } from "@/components/zellige";
import { VoiceOver } from "@/components/voice-over";

export const metadata: Metadata = {
  title: "VocazAI — Choose your language · اختر لغتك",
  description:
    "VocazAI — trilingual AI voice agents in French, English and Arabic. Choose your language to enter.",
  alternates: {
    canonical: "/",
    languages: { fr: "/fr", en: "/en", ar: "/ar", "x-default": "/fr" },
  },
};

const LOCALES = [
  {
    code: "fr",
    label: "Français",
    flag: "Langue par défaut",
    cta: "Entrer en français",
    hint: "Trilingue · 24/7",
  },
  {
    code: "en",
    label: "English",
    flag: "International",
    cta: "Enter in English",
    hint: "Trilingual · 24/7",
  },
  {
    code: "ar",
    label: "العربية",
    flag: "اللغة العربية",
    cta: "دخول بالعربية",
    hint: "بثلاث لغات · 24/7",
    rtl: true,
  },
] as const;

export default function SplashPage() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink-900 text-saffron-50">
      {/* Voice greeting — the splash language picker */}
      <VoiceOver locale="fr" />
      {/* AI topology — animated neural network, the "voice-AI" signature */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="h-[78%] w-[94%] max-w-6xl text-saffron-500/[0.13]">
          <NeuralNetwork />
        </div>
      </div>

      {/* Geometric ornament — heritage anchors over the AI mesh */}
      <Khatam
        size={780}
        className="slow-rotate pointer-events-none absolute -right-44 -top-44 text-saffron-500/[0.16]"
      />
      <Arch
        size={520}
        className="slow-rotate-reverse pointer-events-none absolute -left-28 -bottom-36 text-teal-500/[0.16]"
      />
      {/* Massive editorial "00" numeral behind the splash — drop-num. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 right-8 select-none font-display italic font-medium leading-none text-saffron-500/[0.08] text-[clamp(18rem,38vw,36rem)]"
      >
        00
      </div>

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
      <header className="container relative z-10 flex h-16 shrink-0 items-center justify-between">
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
          <span>2025 · Trilingual Voice AI</span>
        </div>
      </header>

      {/* Center — headline + tiles. Sized to fit one viewport. */}
      <div className="container relative z-10 flex min-h-0 flex-1 flex-col items-start justify-center py-6">
        {/* Kicker */}
        <div className="mb-5 inline-flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" />
          <span className="font-mono text-kicker uppercase text-saffron-50/60">
            01 — Voice AI · Trilingual
          </span>
        </div>

        {/* Headline — staged in three languages, magazine-cover scale. */}
        <h1 className="font-display text-display-xl font-medium leading-[0.92] tracking-tight lg:text-display-2xl">
          <span className="block text-saffron-50">L&apos;agent qui décroche</span>
          <span className="relative inline-block italic text-saffron-500">
            même quand vous dormez.
            {/* Hand-drawn underline — saffron, signing the headline. */}
            <svg
              aria-hidden
              viewBox="0 0 300 8"
              className="absolute -bottom-1 left-0 h-2 w-full text-saffron-500/70"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 2 5 Q 80 1, 150 4 T 298 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <div className="mt-5 max-w-2xl space-y-1.5 text-saffron-50/55">
          <p className="font-display text-base italic sm:text-lg">
            The voice agent that picks up — even when you sleep.
          </p>
          <p
            dir="rtl"
            className="font-display text-base italic sm:text-lg"
            lang="ar"
          >
            الوكيل الذي يرد — حتى عندما تنام.
          </p>
        </div>

        {/* Language tiles */}
        <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
          {LOCALES.map((l, idx) => (
            <Link
              key={l.code}
              href={`/${l.code}`}
              dir={"rtl" in l && l.rtl ? "rtl" : "ltr"}
              className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-saffron-50/10 bg-saffron-50/[0.025] p-5 backdrop-blur-sm transition-all duration-260 ease-soft hover:-translate-y-1 hover:border-saffron-500 hover:bg-saffron-50/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/50 sm:p-6"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-saffron-50/50">
                  <span>0{idx + 1}</span>
                  <span className="h-px flex-1 bg-saffron-50/15" />
                  <span>{l.code.toUpperCase()}</span>
                </div>
                <div
                  className={`mt-5 font-display text-3xl font-medium sm:text-4xl ${
                    "rtl" in l && l.rtl ? "" : "italic"
                  }`}
                >
                  {l.label}
                </div>
                <div className="mt-1.5 text-xs uppercase tracking-wider text-saffron-50/40">
                  {l.flag}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between sm:mt-8">
                <span className="text-sm text-saffron-50/70 transition-colors duration-220 group-hover:text-saffron-500">
                  {l.cta}
                </span>
                <ArrowUpRight className="h-5 w-5 text-saffron-50/40 transition-all duration-220 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-saffron-500" />
              </div>
              {/* Bottom hint */}
              <div className="mt-2.5 text-[10px] uppercase tracking-widest text-saffron-50/30">
                {l.hint}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom band */}
      <footer className="container relative z-10 flex shrink-0 flex-col items-start justify-between gap-4 border-t border-saffron-50/10 py-5 text-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Waveform bars={18} className="text-saffron-500/70" />
          <span className="font-mono uppercase tracking-widest text-saffron-50/40">
            Live voice AI · 24/7
          </span>
        </div>
        <div className="font-mono uppercase tracking-widest text-saffron-50/40">
          © 2025 VocazAI · Trilingue
        </div>
      </footer>
    </main>
  );
}
