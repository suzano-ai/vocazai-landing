"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Volume2, Pause, RotateCcw } from "lucide-react";

/**
 * Marketing voice-over — a floating player that greets the visitor in the
 * page's language. Clips are pre-generated (public/voiceovers/{page}-{lang}.mp3)
 * with Voxtral. Browsers block autoplay-with-sound, so it starts on the first
 * user gesture (click / scroll / tap) — once per page per session — and the
 * pill itself is a play / pause / replay control.
 */

type PageKey = "splash" | "landing" | "about" | "pricing" | "use-cases";
type Lang = "fr" | "en" | "ar";

const LABELS: Record<Lang, { intro: string; playing: string; replay: string; aria: string }> = {
  fr: {
    intro: "Écoutez la présentation",
    playing: "Yasmine vous parle…",
    replay: "Réécouter",
    aria: "Lire la présentation audio de la page",
  },
  en: {
    intro: "Hear the intro",
    playing: "Yasmine is speaking…",
    replay: "Replay",
    aria: "Play the page audio intro",
  },
  ar: {
    intro: "استمع إلى التقديم",
    playing: "ياسمين تتحدّث إليك…",
    replay: "إعادة الاستماع",
    aria: "تشغيل التقديم الصوتي للصفحة",
  },
};

/** Map a pathname to a voice-over page key, or null when there's no clip. */
function pageKeyFromPath(pathname: string, locale: string): PageKey | null {
  if (pathname === "/") return "splash"; // the bare language picker
  const p = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
  if (p === "" || p === "/") return "landing";
  const seg = p.split("/").filter(Boolean)[0];
  if (seg === "about") return "about";
  if (seg === "pricing") return "pricing";
  if (seg === "use-cases") return "use-cases";
  return null; // login, dashboard, legal… → no voice-over
}

export function VoiceOver({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lang: Lang = locale === "en" || locale === "ar" ? locale : "fr";
  const pageKey = pageKeyFromPath(pathname ?? "/", locale);
  // The splash (language picker) is pre-selection → a single French clip.
  const src = !pageKey
    ? null
    : pageKey === "splash"
    ? "/voiceovers/splash-fr.mp3"
    : `/voiceovers/${pageKey}-${lang}.mp3`;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<"idle" | "playing" | "done">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.preload = "auto";
    audioRef.current = audio;
    audio.onplay = () => setState("playing");
    audio.onpause = () => setState((s) => (s === "playing" ? "idle" : s));
    audio.onended = () => setState("done");

    setMounted(true);
    setState("idle");

    // Auto-play on the first user gesture — once per page per session.
    const sessionKey = `vo:${src}`;
    let armed = typeof sessionStorage !== "undefined" && !sessionStorage.getItem(sessionKey);
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];

    const cleanup = () => events.forEach((e) => window.removeEventListener(e, tryAutoplay));
    const tryAutoplay = () => {
      if (!armed) return;
      armed = false;
      try { sessionStorage.setItem(sessionKey, "1"); } catch { /* private mode */ }
      audio.play().catch(() => { /* still blocked — the pill stays clickable */ });
      cleanup();
    };
    if (armed) events.forEach((e) => window.addEventListener(e, tryAutoplay, { passive: true }));

    return () => {
      cleanup();
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src]);

  if (!src) return null;

  const labels = LABELS[lang];
  const side = lang === "ar" ? "left-4 sm:left-6" : "right-4 sm:right-6";

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (state === "done") audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const label =
    state === "playing" ? labels.playing : state === "done" ? labels.replay : labels.intro;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`fixed bottom-4 z-40 sm:bottom-6 ${side} transition-all duration-500 ease-soft ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <button
        onClick={toggle}
        aria-label={labels.aria}
        className="group flex items-center gap-2.5 rounded-full border border-border bg-elevated/95 py-2.5 pl-2.5 pr-4 shadow-xl shadow-ink-900/10 backdrop-blur-md transition-colors duration-220 hover:border-saffron-500/60"
      >
        {/* Icon / waveform */}
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-saffron-500 text-ink-900">
          {state === "playing" ? (
            <span className="flex h-3.5 items-center gap-[2px]" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="wave-bar !bg-ink-900"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </span>
          ) : state === "done" ? (
            <RotateCcw className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
          {/* Attention pulse — idle only */}
          {state === "idle" && (
            <span className="absolute inset-0 animate-ping rounded-full bg-saffron-500/40" aria-hidden />
          )}
        </span>

        <span className="whitespace-nowrap text-sm font-medium text-foreground">
          {label}
        </span>

        {state === "playing" && (
          <Pause className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        )}
      </button>
    </div>
  );
}
