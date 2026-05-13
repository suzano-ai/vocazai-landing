"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Phone, Play, RotateCcw, Loader2, Mic, CheckCircle } from "lucide-react";
import { Waveform } from "@/components/zellige";

// ─── Conversation script ──────────────────────────────────────────────────────
// Each turn: Yasmine speaks, then listens for a free-form or structured answer
const SCRIPT = [
  {
    id:     "greeting",
    speak:  "Bonjour ! Je suis Yasmine, l'assistante vocale VocazAI. Comment puis-je vous aider aujourd'hui ?",
    hint:   "Dites par exemple : « Je voudrais prendre un rendez-vous »",
    mode:   "intent",   // any speech → proceed
  },
  {
    id:     "name",
    speak:  "Parfait ! Pour commencer, pouvez-vous me donner votre nom complet ?",
    hint:   "Dites votre prénom et nom",
    mode:   "free",     // capture verbatim
  },
  {
    id:     "slot",
    speak:  "Merci. J'ai deux créneaux disponibles ce mercredi : 9h30 ou 11h15. Lequel vous convient ?",
    hint:   "Dites « 9h30 » ou « 11h15 »",
    mode:   "choice",
    choices: ["9h30", "11h15"],
  },
  {
    id:     "email",
    speak:  "Très bien. Quelle est votre adresse email pour recevoir la confirmation ?",
    hint:   "Épelez votre email ou dites-le clairement",
    mode:   "email",    // try to extract a valid email
  },
  // Turn 4 text is generated dynamically from collected data
];

type DemoState = "idle" | "loading" | "speaking" | "listening" | "processing" | "done" | "error";
type Message   = { role: "agent" | "user"; text: string };

// ─── Extract email from spoken text ──────────────────────────────────────────
function extractEmail(raw: string): string | null {
  // Direct match
  const direct = raw.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  if (direct) return direct[0].toLowerCase();

  // Normalize French spoken form: "arobase" → @, "point" → .
  const normalized = raw
    .toLowerCase()
    .replace(/\s+arobase\s+|\s*@\s*/g, "@")
    .replace(/\s+point\s+/g, ".")
    .replace(/\s+tiret\s+/g, "-")
    .replace(/\s+underscore\s+|\s+tiret bas\s+/g, "_")
    .replace(/\s/g, "");

  const fallback = normalized.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  return fallback ? fallback[0].toLowerCase() : null;
}

// ─── Match spoken answer to a slot choice ────────────────────────────────────
function matchSlot(text: string): string | null {
  const t = text.toLowerCase();
  if (/9|neuf|neuf\s*h|9\s*h|trente/.test(t))  return "9h30";
  if (/11|onze|onze\s*h|11\s*h|quinze/.test(t)) return "11h15";
  return null;
}

// ─── Bubble ───────────────────────────────────────────────────────────────────
function Bubble({ role, children }: { role: "agent" | "user"; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`mt-0.5 inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 font-mono text-[9px] uppercase tracking-wider ${
        role === "user" ? "bg-surface text-muted-foreground" : "bg-saffron-500 text-ink-900"
      }`}>
        {role === "user" ? "Vous" : "Yasmine"}
      </span>
      <p className={`flex-1 text-sm leading-relaxed ${role === "user" ? "text-muted-foreground" : ""}`}>
        {children}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function DemoCallCard() {
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [turn,      setTurn]      = useState(0);
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [elapsed,   setElapsed]   = useState(0);
  const [hint,      setHint]      = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Collected data
  const collected = useRef<{ name?: string; slot?: string; email?: string }>({});

  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Timer
  const startTimer = useCallback(() => {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  }, []);
  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);
  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Pick best French Canadian voice ───────────────────────────────────────
  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === "fr-CA") ??
      voices.find((v) => v.lang.startsWith("fr-CA")) ??
      voices.find((v) => v.lang === "fr-FR" && v.localService) ??
      voices.find((v) => v.lang.startsWith("fr")) ??
      null
    );
  }, []);

  // ── TTS — Web Speech API (native fr-CA), fallback to API ──────────────────
  const speak = useCallback(async (text: string): Promise<void> => {
    // ── Primary: native browser voice (French Canadian) ─────────────────────
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      return new Promise((resolve) => {
        setDemoState("speaking");
        window.speechSynthesis.cancel();

        const doSpeak = () => {
          const voice = pickVoice();
          const utter = new SpeechSynthesisUtterance(text);
          utter.lang   = "fr-CA";
          utter.rate   = 0.93;
          utter.pitch  = 1.08;
          utter.volume = 1;
          if (voice) utter.voice = voice;

          utter.onend   = () => resolve();
          utter.onerror = () => {
            // Fallback: server TTS
            fetch("/api/tts", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text, voice: "af_heart", speed: 0.92, lang: "fr-fr" }),
            })
              .then(async (res) => {
                if (!res.ok) throw new Error();
                const url = URL.createObjectURL(await res.blob());
                const audio = new Audio(url);
                audioRef.current = audio;
                audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
                audio.play().catch(() => setTimeout(resolve, Math.min(2000 + text.split(" ").length * 130, 7000)));
              })
              .catch(() => setTimeout(resolve, Math.min(2000 + text.split(" ").length * 130, 7000)));
          };

          window.speechSynthesis.speak(utter);
        };

        // Voices may need a tick to load on first call
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          doSpeak();
        } else {
          window.speechSynthesis.onvoiceschanged = () => doSpeak();
          setTimeout(doSpeak, 400); // safety
        }
      });
    }

    // ── Fallback: server TTS ─────────────────────────────────────────────────
    setDemoState("loading");
    return new Promise((resolve) => {
      fetch("/api/tts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "af_heart", speed: 0.92, lang: "fr-fr" }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error();
          const url = URL.createObjectURL(await res.blob());
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
          setDemoState("speaking");
          audio.play().catch(() => { setDemoState("speaking"); setTimeout(resolve, 3000); });
        })
        .catch(() => {
          setDemoState("speaking");
          setTimeout(resolve, Math.min(2000 + text.split(" ").length * 130, 7000));
        });
    });
  }, [pickVoice]);

  // ── STT: record → transcribe ────────────────────────────────────────────────
  const listen = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      setDemoState("listening");
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
            ? "audio/webm;codecs=opus"
            : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";

          const rec = new MediaRecorder(stream, { mimeType });
          mediaRecRef.current = rec;
          chunksRef.current   = [];

          rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
          rec.onstop = () => {
            stream.getTracks().forEach((t) => t.stop());
            setDemoState("processing");

            const blob = new Blob(chunksRef.current, { type: mimeType });
            const fd   = new FormData();
            fd.append("audio", blob, "recording.webm");
            fd.append("language", "fr");

            fetch("/api/stt", { method: "POST", body: fd })
              .then((r) => r.json())
              .then((d) => resolve((d.text ?? "").trim()))
              .catch(() => resolve(""));
          };

          rec.start();
          // Auto-stop after 8 s
          setTimeout(() => { if (rec.state === "recording") rec.stop(); }, 8000);
        })
        .catch(() => resolve(""));
    });
  }, []);

  // ── Send confirmation email ────────────────────────────────────────────────
  const sendEmail = useCallback(async () => {
    const { name, slot, email } = collected.current;
    if (!email) return;
    try {
      await fetch("/api/email", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:  name ?? "Client",
          email,
          slot:  slot ?? "9h30",
          date:  "Mercredi prochain",
        }),
      });
      setEmailSent(true);
    } catch { /* silent — demo still works */ }
  }, []);

  // ── Main conversation loop ─────────────────────────────────────────────────
  const runTurn = useCallback(async (idx: number) => {
    if (idx >= SCRIPT.length) return;
    const step = SCRIPT[idx];
    setHint(step.hint ?? "");

    // Yasmine speaks
    setMessages((m) => [...m, { role: "agent", text: step.speak }]);
    await speak(step.speak);

    // Listen for response
    const transcript = await listen();
    if (!transcript) {
      // Retry once silently
      setDemoState("speaking");
      await speak("Je n'ai pas entendu. Pouvez-vous répéter ?");
      const retry = await listen();
      if (!retry) { setDemoState("error"); return; }
    }

    const text = transcript || "";
    let userMsg = text;
    let advance = true;

    if (step.mode === "intent") {
      // Any response proceeds
    } else if (step.mode === "free") {
      collected.current[step.id as "name" | "email"] = text;
    } else if (step.mode === "choice") {
      const matched = matchSlot(text);
      if (!matched) {
        setMessages((m) => [...m, { role: "user", text }]);
        setDemoState("speaking");
        await speak("Je n'ai pas bien compris. Dites 9h30 ou 11h15.");
        const retry = await listen();
        const m2 = matchSlot(retry);
        if (!m2) { setDemoState("error"); return; }
        collected.current.slot = m2;
        userMsg = m2;
      } else {
        collected.current.slot = matched;
        userMsg = matched;
      }
    } else if (step.mode === "email") {
      const email = extractEmail(text);
      if (!email) {
        setMessages((m) => [...m, { role: "user", text }]);
        setDemoState("speaking");
        await speak("Je n'ai pas pu noter votre email. Pouvez-vous le répéter clairement ?");
        const retry = await listen();
        const e2 = extractEmail(retry);
        if (!e2) {
          // Accept anyway for demo
          collected.current.email = retry;
          userMsg = retry;
        } else {
          collected.current.email = e2;
          userMsg = e2;
        }
      } else {
        collected.current.email = email;
        userMsg = email;
      }
    }

    if (advance) {
      setMessages((m) => [...m, { role: "user", text: userMsg }]);
    }

    const nextIdx = idx + 1;
    setTurn(nextIdx);

    if (nextIdx >= SCRIPT.length) {
      // Final confirmation turn
      const { name, slot, email } = collected.current;
      const closingText = `Parfait${name ? `, ${name}` : ""} ! J'ai bien noté votre rendez-vous ${slot ? `à ${slot}` : ""} ce mercredi. Un email de confirmation vous a été envoyé${email ? ` à ${email}` : ""}. À très bientôt !`;

      setMessages((m) => [...m, { role: "agent", text: closingText }]);
      await speak(closingText);
      await sendEmail();
      setDemoState("done");
      stopTimer();
    } else {
      await runTurn(nextIdx);
    }
  }, [speak, listen, sendEmail, stopTimer]);

  // ── Start demo ─────────────────────────────────────────────────────────────
  const startDemo = useCallback(async () => {
    collected.current = {};
    setMessages([]);
    setTurn(0);
    setEmailSent(false);
    setHint("");
    startTimer();
    await runTurn(0);
  }, [runTurn, startTimer]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    audioRef.current?.pause(); audioRef.current = null;
    if (mediaRecRef.current?.state === "recording") mediaRecRef.current.stop();
    stopTimer();
    collected.current = {};
    setDemoState("idle"); setMessages([]); setTurn(0);
    setElapsed(0); setEmailSent(false); setHint("");
  }, [stopTimer]);

  const isActive   = demoState !== "idle";
  const isBusy     = demoState === "loading" || demoState === "speaking" || demoState === "processing";
  const isListening = demoState === "listening";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-border bg-elevated p-6 shadow-xl shadow-ink-900/5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-full bg-ink-900 text-saffron-500 dark:bg-saffron-500 dark:text-ink-900">
            <Phone className="h-5 w-5" />
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-elevated transition-colors duration-300 ${
              isActive ? "bg-saffron-500" : "bg-muted-foreground/40"
            }`} />
          </div>
          <div>
            <div className="font-display text-base font-medium">Yasmine</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`inline-block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                isActive ? "bg-saffron-500" : "bg-muted-foreground/40"
              }`} />
              {isActive ? `En direct · ${fmt(elapsed)}` : "En attente"}
            </div>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Demo</span>
      </div>

      {/* Waveform */}
      <div className="mt-6 border-t border-border pt-5">
        <Waveform className={`text-saffron-500 transition-opacity duration-500 ${
          demoState === "speaking" || isListening ? "opacity-100" : "opacity-25"
        }`} />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="mt-5 max-h-52 space-y-3 overflow-y-auto pr-1 text-sm">

        {demoState === "idle" && (
          <p className="italic text-muted-foreground">
            Appuyez sur <strong className="font-semibold not-italic text-foreground">Démarrer</strong> — Yasmine vous guidera entièrement par la voix.
          </p>
        )}

        {messages.map((m, i) => <Bubble key={i} role={m.role}>{m.text}</Bubble>)}

        {demoState === "loading" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Yasmine prépare sa réponse…</span>
          </div>
        )}

        {isListening && (
          <div className="flex items-center gap-2 text-saffron-500">
            <Mic className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-xs font-medium animate-pulse">Yasmine vous écoute…</span>
          </div>
        )}

        {demoState === "processing" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">Traitement…</span>
          </div>
        )}

        {emailSent && (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Email de confirmation envoyé ✓</span>
          </div>
        )}

        {demoState === "error" && (
          <p className="text-xs text-red-500 italic">
            Je n'ai pas pu comprendre. Veuillez recommencer.
          </p>
        )}
      </div>

      {/* Listening hint */}
      {isListening && hint && (
        <p className="mt-3 text-center text-[11px] text-muted-foreground italic">{hint}</p>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="text-[10px] text-muted-foreground/50">
          {isListening ? "🔴 Enregistrement en cours" : isActive ? "Appel IA en cours" : "Démo interactive"}
        </span>

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

        {(demoState === "done" || demoState === "error") && (
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
