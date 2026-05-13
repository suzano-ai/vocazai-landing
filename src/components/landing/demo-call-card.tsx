"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Phone, Play, RotateCcw, Loader2 } from "lucide-react";
import { Waveform } from "@/components/zellige";

// ─── Scripted conversation ────────────────────────────────────────────────────
const TURNS = [
  {
    agent: "Bonjour ! Je suis Yasmine, votre assistante vocale VocazAI. Comment puis-je vous aider aujourd'hui ?",
    options: ["Je voudrais prendre un rendez-vous", "Quelles sont vos disponibilités ?"],
  },
  {
    agent: "Bien sûr. J'ai deux créneaux disponibles mercredi matin : 9h30 ou 11h15. Lequel vous convient ?",
    options: ["9h30, c'est parfait !", "Je préfère 11h15"],
  },
  {
    agent: "Parfait ! Je note votre rendez-vous pour mercredi à 9h30. Votre nom complet, s'il vous plaît ?",
    options: ["Mohammed Benali", "Aymane Tazi"],
  },
  {
    agent: "Très bien, c'est enregistré. Rendez-vous mercredi à 9h30. À très bientôt !",
    options: [],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type DemoState = "idle" | "loading" | "speaking" | "waiting" | "done";
type Message   = { role: "agent" | "user"; text: string };

// ─── Bubble sub-component (must be defined before DemoCallCard) ───────────────
function Bubble({
  role,
  children,
}: {
  role: "agent" | "user";
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 font-mono text-[9px] uppercase tracking-wider ${
          role === "user"
            ? "bg-surface text-muted-foreground"
            : "bg-saffron-500 text-ink-900"
        }`}
      >
        {role === "user" ? "Vous" : "Agent"}
      </span>
      <p className={`flex-1 text-sm leading-relaxed ${role === "user" ? "text-muted-foreground" : ""}`}>
        {children}
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DemoCallCard() {
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [turn,      setTurn]      = useState(0);
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [elapsed,   setElapsed]   = useState(0);

  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ── Timer helpers ──────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── TTS call ───────────────────────────────────────────────────────────────
  const speak = useCallback(async (text: string, onDone: () => void) => {
    setDemoState("loading");
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "ff_siwis", lang: "fr-fr" }),
      });

      if (!res.ok) throw new Error("TTS error");

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => { URL.revokeObjectURL(url); onDone(); };
      setDemoState("speaking");
      await audio.play();
    } catch {
      // Graceful fallback: show text, advance after 2 s per 10 words
      const delay = Math.min(2000 + text.split(" ").length * 120, 6000);
      setDemoState("speaking");
      setTimeout(onDone, delay);
    }
  }, []);

  // ── Start demo ─────────────────────────────────────────────────────────────
  const startDemo = useCallback(async () => {
    setMessages([]);
    setTurn(0);
    startTimer();

    const text = TURNS[0].agent;
    setMessages([{ role: "agent", text }]);
    await speak(text, () => setDemoState("waiting"));
  }, [speak, startTimer]);

  // ── User picks a reply ─────────────────────────────────────────────────────
  const handleChoice = useCallback(async (choice: string, currentTurn: number) => {
    if (demoState !== "waiting") return;

    const nextTurn = currentTurn + 1;
    setMessages((m) => [...m, { role: "user", text: choice }]);
    setTurn(nextTurn);

    if (nextTurn >= TURNS.length) {
      setDemoState("done");
      stopTimer();
      return;
    }

    const text   = TURNS[nextTurn].agent;
    const isLast = nextTurn === TURNS.length - 1;
    setMessages((m) => [...m, { role: "agent", text }]);

    await speak(text, () => {
      if (isLast) { setDemoState("done"); stopTimer(); }
      else          setDemoState("waiting");
    });
  }, [demoState, speak, stopTimer]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    stopTimer();
    setDemoState("idle");
    setMessages([]);
    setTurn(0);
    setElapsed(0);
  }, [stopTimer]);

  const isActive = demoState !== "idle";
  const isBusy   = demoState === "loading" || demoState === "speaking";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-border bg-elevated p-6 shadow-xl shadow-ink-900/5">

      {/* Header — Yasmine identity */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-full bg-ink-900 text-saffron-500 dark:bg-saffron-500 dark:text-ink-900">
            <Phone className="h-5 w-5" />
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-elevated transition-colors duration-300 ${
                isActive ? "bg-saffron-500" : "bg-muted-foreground/40"
              }`}
            />
          </div>
          <div>
            <div className="font-display text-base font-medium">Yasmine</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  isActive ? "bg-saffron-500" : "bg-muted-foreground/40"
                }`}
              />
              {isActive ? `En direct · ${fmt(elapsed)}` : "En attente"}
            </div>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Demo
        </span>
      </div>

      {/* Waveform — animates only while speaking */}
      <div className="mt-6 border-t border-border pt-5">
        <Waveform
          className={`text-saffron-500 transition-opacity duration-500 ${
            demoState === "speaking" ? "opacity-100" : "opacity-25"
          }`}
        />
      </div>

      {/* Messages feed */}
      <div
        ref={scrollRef}
        className="mt-5 max-h-48 space-y-3 overflow-y-auto pr-1 text-sm"
      >
        {demoState === "idle" && (
          <p className="italic text-muted-foreground">
            Cliquez sur <strong className="font-semibold not-italic text-foreground">Démarrer</strong> pour entendre Yasmine en voix réelle.
          </p>
        )}

        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.text}
          </Bubble>
        ))}

        {demoState === "loading" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Yasmine prépare sa réponse…</span>
          </div>
        )}
      </div>

      {/* User reply buttons — shown only while waiting */}
      {demoState === "waiting" && turn < TURNS.length && TURNS[turn].options.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {TURNS[turn].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleChoice(opt, turn)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium transition-all duration-180 hover:border-saffron-500 hover:text-saffron-600 active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span>FR · Kokoro TTS · ff_siwis</span>

        {demoState === "idle" && (
          <button
            onClick={startDemo}
            className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500 px-4 py-1.5 text-xs font-semibold text-ink-900 transition-all duration-180 hover:bg-saffron-400 active:scale-95"
          >
            <Play className="h-3 w-3 fill-current" />
            Démarrer la démo
          </button>
        )}

        {isBusy && (
          <span className="font-mono tabular-nums">{fmt(elapsed)}</span>
        )}

        {demoState === "done" && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-xs font-medium transition-all duration-180 hover:border-foreground active:scale-95"
          >
            <RotateCcw className="h-3 w-3" />
            Recommencer
          </button>
        )}
      </div>
    </div>
  );
}
