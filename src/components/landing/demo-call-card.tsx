"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Phone, Play, RotateCcw, Loader2, Mic, CheckCircle } from "lucide-react";
import { Waveform } from "@/components/zellige";

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang      = "fr" | "en" | "ar";
type DemoState = "idle" | "loading" | "speaking" | "listening" | "processing" | "done" | "error";
type Message   = { role: "agent" | "user"; text: string };

// ─── Per-language config ──────────────────────────────────────────────────────
const LANG_CFG: Record<Lang, {
  bcp47:   string;       // Web Speech locale
  voice:   string;       // Kokoro voice (fallback)
  stt:     string;       // faster-whisper language code
  dir:     "ltr" | "rtl";
  label:   string;
  script: {
    id:      string;
    speak:   string;
    hint:    string;
    mode:    "intent" | "free" | "choice" | "email";
    choices?: string[];
  }[];
  retry:        string;
  retryEmail:   string;
  retrySlot:    string;
  closing:      (name: string, slot: string, email: string) => string;
}> = {
  fr: {
    bcp47:  "fr-CA",
    voice:  "ff_siwis",
    stt:    "fr",
    dir:    "ltr",
    label:  "FR",
    script: [
      {
        id:    "greeting",
        speak: "Bonjour ! Je suis Yasmine, l'assistante vocale VocazAI. Comment puis-je vous aider aujourd'hui ?",
        hint:  "Dites par exemple : « Je voudrais prendre un rendez-vous »",
        mode:  "intent",
      },
      {
        id:    "name",
        speak: "Parfait ! Pour commencer, pouvez-vous me donner votre nom complet ?",
        hint:  "Dites votre prénom et nom",
        mode:  "free",
      },
      {
        id:      "slot",
        speak:   "Merci. J'ai deux créneaux disponibles ce mercredi : 9h30 ou 11h15. Lequel vous convient ?",
        hint:    "Dites « 9h30 » ou « 11h15 »",
        mode:    "choice",
        choices: ["9h30", "11h15"],
      },
      {
        id:    "email",
        speak: "Très bien. Quelle est votre adresse email pour la confirmation ?",
        hint:  "Épelez votre email ou dites-le clairement",
        mode:  "email",
      },
    ],
    retry:      "Je n'ai pas entendu. Pouvez-vous répéter ?",
    retryEmail: "Je n'ai pas pu noter votre email. Pouvez-vous le répéter ?",
    retrySlot:  "Je n'ai pas bien compris. Dites 9h30 ou 11h15.",
    closing: (name, slot, email) =>
      `Parfait${name ? `, ${name}` : ""} ! Votre rendez-vous${slot ? ` à ${slot}` : ""} ce mercredi est confirmé. Un email vous a été envoyé${email ? ` à ${email}` : ""}. À très bientôt !`,
  },

  en: {
    bcp47:  "en-US",
    voice:  "af_heart",
    stt:    "en",
    dir:    "ltr",
    label:  "EN",
    script: [
      {
        id:    "greeting",
        speak: "Hello! I'm Yasmine, VocazAI's voice assistant. How can I help you today?",
        hint:  "Say for example: "I'd like to book an appointment"",
        mode:  "intent",
      },
      {
        id:    "name",
        speak: "Great! To get started, could you give me your full name?",
        hint:  "Say your first and last name",
        mode:  "free",
      },
      {
        id:      "slot",
        speak:   "Thank you. I have two slots available this Wednesday: 9:30 AM or 11:15 AM. Which works for you?",
        hint:    "Say "9:30" or "11:15"",
        mode:    "choice",
        choices: ["9:30 AM", "11:15 AM"],
      },
      {
        id:    "email",
        speak: "Perfect. What's your email address for the confirmation?",
        hint:  "Spell out your email clearly",
        mode:  "email",
      },
    ],
    retry:      "I didn't catch that. Could you repeat?",
    retryEmail: "I couldn't catch your email. Could you repeat it clearly?",
    retrySlot:  "I didn't understand. Please say 9:30 or 11:15.",
    closing: (name, slot, email) =>
      `Perfect${name ? `, ${name}` : ""}! Your appointment${slot ? ` at ${slot}` : ""} this Wednesday is confirmed. A confirmation email has been sent${email ? ` to ${email}` : ""}. Talk soon!`,
  },

  ar: {
    bcp47:  "ar-MA",
    voice:  "ff_siwis",   // Kokoro has no Arabic — Web Speech is primary
    stt:    "ar",
    dir:    "rtl",
    label:  "AR",
    script: [
      {
        id:    "greeting",
        speak: "مرحباً! أنا ياسمين، المساعدة الصوتية لـ VocazAI. كيف يمكنني مساعدتك اليوم؟",
        hint:  "قل مثلاً: أريد حجز موعد",
        mode:  "intent",
      },
      {
        id:    "name",
        speak: "رائع! للبدء، هل يمكنك إعطائي اسمك الكامل؟",
        hint:  "قل اسمك الأول واللقب",
        mode:  "free",
      },
      {
        id:      "slot",
        speak:   "شكراً. لديّ موعدان متاحان هذا الأربعاء: التاسعة والنصف، أو الحادية عشرة والربع. أيهما يناسبك؟",
        hint:    "قل «9:30» أو «11:15»",
        mode:    "choice",
        choices: ["9:30", "11:15"],
      },
      {
        id:    "email",
        speak: "ممتاز. ما هو بريدك الإلكتروني لإرسال التأكيد؟",
        hint:  "أملِ بريدك الإلكتروني بوضوح",
        mode:  "email",
      },
    ],
    retry:      "لم أسمع ذلك. هل يمكنك التكرار؟",
    retryEmail: "لم أتمكن من فهم بريدك الإلكتروني. هل يمكنك تكراره؟",
    retrySlot:  "لم أفهم جيداً. قل 9:30 أو 11:15.",
    closing: (name, slot, email) =>
      `ممتاز${name ? `، ${name}` : ""}! تم تأكيد موعدك${slot ? ` الساعة ${slot}` : ""} هذا الأربعاء. تم إرسال بريد تأكيد${email ? ` إلى ${email}` : ""}. إلى اللقاء!`,
  },
};

// ─── Detect visitor language ──────────────────────────────────────────────────
function detectLang(): Lang {
  if (typeof navigator === "undefined") return "fr";
  const raw = (navigator.language ?? "fr").toLowerCase();
  if (raw.startsWith("ar")) return "ar";
  if (raw.startsWith("fr")) return "fr";
  return "en";
}

// ─── Extract email from spoken text ──────────────────────────────────────────
function extractEmail(raw: string): string | null {
  const direct = raw.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  if (direct) return direct[0].toLowerCase();

  const normalized = raw
    .toLowerCase()
    .replace(/\s+arobase\s+|\s+at\s+|\s*@\s*/g, "@")
    .replace(/\s+point\s+|\s+dot\s+|\s+نقطة\s+/g, ".")
    .replace(/\s+tiret\s+|\s+dash\s+/g, "-")
    .replace(/\s+underscore\s+|\s+tiret bas\s+/g, "_")
    .replace(/\s/g, "");

  const fallback = normalized.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  return fallback ? fallback[0].toLowerCase() : null;
}

// ─── Match spoken answer to a time slot ──────────────────────────────────────
function matchSlot(text: string, lang: Lang): string | null {
  const t = text.toLowerCase();

  if (lang === "ar") {
    const is930  = /9|تسع|تسعة|نصف/.test(t);
    const is1115 = /11|احدى|إحدى|عشر|ربع/.test(t);
    if (is930)  return "9:30";
    if (is1115) return "11:15";
    return null;
  }

  const is930  = /9|nine|neuf|9\s*h|9\s*:\s*30|trente|thirty/.test(t);
  const is1115 = /11|eleven|onze|11\s*h|11\s*:\s*15|quinze|fifteen/.test(t);
  if (is930)  return lang === "en" ? "9:30 AM"  : "9h30";
  if (is1115) return lang === "en" ? "11:15 AM" : "11h15";
  return null;
}

// ─── Bubble ───────────────────────────────────────────────────────────────────
function Bubble({ role, children, dir }: {
  role: "agent" | "user"; children: React.ReactNode; dir?: "ltr" | "rtl"
}) {
  return (
    <div className="flex items-start gap-2.5" dir={dir}>
      <span className={`mt-0.5 inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 font-mono text-[9px] uppercase tracking-wider ${
        role === "user" ? "bg-surface text-muted-foreground" : "bg-saffron-500 text-ink-900"
      }`}>
        {role === "user" ? "You" : "Yasmine"}
      </span>
      <p className={`flex-1 text-sm leading-relaxed ${role === "user" ? "text-muted-foreground" : ""}`}>
        {children}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function DemoCallCard() {
  const [lang,      setLang]      = useState<Lang>("fr");
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [turn,      setTurn]      = useState(0);
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [elapsed,   setElapsed]   = useState(0);
  const [hint,      setHint]      = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const collected = useRef<{ name?: string; slot?: string; email?: string }>({});
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const langRef     = useRef<Lang>("fr");

  // Detect language once on mount
  useEffect(() => {
    const detected = detectLang();
    setLang(detected);
    langRef.current = detected;
  }, []);

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

  // ── Web Speech API voice picker ────────────────────────────────────────────
  const pickVoice = useCallback((bcp47: string): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const lang2  = bcp47.split("-")[0].toLowerCase();
    return (
      voices.find((v) => v.lang === bcp47) ??
      voices.find((v) => v.lang.startsWith(bcp47)) ??
      voices.find((v) => v.lang.startsWith(lang2) && v.localService) ??
      voices.find((v) => v.lang.startsWith(lang2)) ??
      null
    );
  }, []);

  // ── TTS — Web Speech (primary) → server TTS (fallback) ────────────────────
  const speak = useCallback(async (text: string): Promise<void> => {
    const cfg = LANG_CFG[langRef.current];

    // Primary: browser native voice
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      return new Promise((resolve) => {
        setDemoState("speaking");
        window.speechSynthesis.cancel();

        const doSpeak = () => {
          const voice = pickVoice(cfg.bcp47);
          const utter = new SpeechSynthesisUtterance(text);
          utter.lang   = cfg.bcp47;
          utter.rate   = langRef.current === "ar" ? 0.90 : 0.93;
          utter.pitch  = 1.08;
          utter.volume = 1;
          if (voice) utter.voice = voice;

          utter.onend   = () => resolve();
          utter.onerror = () => speakViaApi(text, cfg.voice).then(resolve);

          window.speechSynthesis.speak(utter);
        };

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) { doSpeak(); }
        else {
          window.speechSynthesis.onvoiceschanged = () => doSpeak();
          setTimeout(doSpeak, 400);
        }
      });
    }

    return speakViaApi(text, cfg.voice);
  }, [pickVoice]);

  // Server TTS fallback (Voxtral → Kokoro)
  const speakViaApi = useCallback(async (text: string, voice: string): Promise<void> => {
    return new Promise((resolve) => {
      setDemoState("loading");
      fetch("/api/tts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed: 0.92, lang: langRef.current === "fr" ? "fr-fr" : "en-us" }),
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
  }, []);

  // ── STT: record → faster-whisper ──────────────────────────────────────────
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
            fd.append("language", LANG_CFG[langRef.current].stt);   // fr / en / ar

            fetch("/api/stt", { method: "POST", body: fd })
              .then((r) => r.json())
              .then((d) => resolve((d.text ?? "").trim()))
              .catch(() => resolve(""));
          };

          rec.start();
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
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name ?? "Client", email, slot: slot ?? "9h30", date: "Mercredi prochain" }),
      });
      setEmailSent(true);
    } catch { /* silent */ }
  }, []);

  // ── Main conversation loop ─────────────────────────────────────────────────
  const runTurn = useCallback(async (idx: number) => {
    const cfg    = LANG_CFG[langRef.current];
    const script = cfg.script;
    if (idx >= script.length) return;

    const step = script[idx];
    setHint(step.hint ?? "");
    setMessages((m) => [...m, { role: "agent", text: step.speak }]);
    await speak(step.speak);

    let transcript = await listen();
    if (!transcript) {
      await speak(cfg.retry);
      transcript = await listen();
      if (!transcript) { setDemoState("error"); return; }
    }

    let userMsg = transcript;

    if (step.mode === "free") {
      collected.current[step.id as "name"] = transcript;

    } else if (step.mode === "choice") {
      let matched = matchSlot(transcript, langRef.current);
      if (!matched) {
        setMessages((m) => [...m, { role: "user", text: transcript }]);
        await speak(cfg.retrySlot);
        const retry = await listen();
        matched = matchSlot(retry, langRef.current);
        if (!matched) { setDemoState("error"); return; }
        userMsg = matched;
      }
      collected.current.slot = matched;
      userMsg = matched;

    } else if (step.mode === "email") {
      let email = extractEmail(transcript);
      if (!email) {
        setMessages((m) => [...m, { role: "user", text: transcript }]);
        await speak(cfg.retryEmail);
        const retry = await listen();
        email = extractEmail(retry) ?? retry;
        userMsg = email;
      }
      collected.current.email = email;
      userMsg = email;
    }

    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    const nextIdx = idx + 1;
    setTurn(nextIdx);

    if (nextIdx >= script.length) {
      const { name, slot, email } = collected.current;
      const closingText = cfg.closing(name ?? "", slot ?? "", email ?? "");
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
    setMessages([]); setTurn(0); setEmailSent(false); setHint("");
    startTimer();
    await runTurn(0);
  }, [runTurn, startTimer]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    audioRef.current?.pause(); audioRef.current = null;
    window.speechSynthesis?.cancel();
    if (mediaRecRef.current?.state === "recording") mediaRecRef.current.stop();
    stopTimer();
    collected.current = {};
    setDemoState("idle"); setMessages([]); setTurn(0);
    setElapsed(0); setEmailSent(false); setHint("");
  }, [stopTimer]);

  const cfg        = LANG_CFG[lang];
  const isActive   = demoState !== "idle";
  const isBusy     = demoState === "loading" || demoState === "speaking" || demoState === "processing";
  const isListening = demoState === "listening";

  // UI strings per language
  const UI = {
    fr: { idle: "Appuyez sur Démarrer — Yasmine vous guidera entièrement par la voix.", start: "Démarrer la démo", live: "En direct", waiting: "En attente", recording: "🔴 Enregistrement", active: "Appel IA en cours", demo: "Démo interactive", loading: "Yasmine prépare sa réponse…", listening: "Yasmine vous écoute…", processing: "Traitement…", email: "Email de confirmation envoyé ✓", error: "Je n'ai pas pu comprendre. Veuillez recommencer.", restart: "Recommencer" },
    en: { idle: "Press Start — Yasmine will guide you entirely by voice.", start: "Start demo", live: "Live", waiting: "Waiting", recording: "🔴 Recording", active: "AI call in progress", demo: "Interactive demo", loading: "Yasmine is preparing…", listening: "Yasmine is listening…", processing: "Processing…", email: "Confirmation email sent ✓", error: "I couldn't understand. Please try again.", restart: "Restart" },
    ar: { idle: "اضغط ابدأ — ياسمين ستوجهك بالكامل عبر الصوت.", start: "ابدأ التجربة", live: "مباشر", waiting: "في انتظار", recording: "🔴 تسجيل", active: "مكالمة ذكاء اصطناعي", demo: "عرض تفاعلي", loading: "ياسمين تحضّر ردّها…", listening: "ياسمين تستمع إليك…", processing: "معالجة…", email: "تم إرسال بريد التأكيد ✓", error: "لم أتمكن من الفهم. حاول مجدداً.", restart: "إعادة" },
  }[lang];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-2xl border border-border bg-elevated p-6 shadow-xl shadow-ink-900/5"
      dir={cfg.dir}
    >

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
              {isActive ? `${UI.live} · ${fmt(elapsed)}` : UI.waiting}
            </div>
          </div>
        </div>
        {/* Language badge */}
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {cfg.label} · Demo
        </span>
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
            {UI.idle}
          </p>
        )}

        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} dir={cfg.dir}>{m.text}</Bubble>
        ))}

        {demoState === "loading" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">{UI.loading}</span>
          </div>
        )}

        {isListening && (
          <div className="flex items-center gap-2 text-saffron-500">
            <Mic className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-xs font-medium animate-pulse">{UI.listening}</span>
          </div>
        )}

        {demoState === "processing" && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs">{UI.processing}</span>
          </div>
        )}

        {emailSent && (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{UI.email}</span>
          </div>
        )}

        {demoState === "error" && (
          <p className="text-xs text-red-500 italic">{UI.error}</p>
        )}
      </div>

      {/* Listening hint */}
      {isListening && hint && (
        <p className="mt-3 text-center text-[11px] text-muted-foreground italic">{hint}</p>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="text-[10px] text-muted-foreground/50">
          {isListening ? UI.recording : isActive ? UI.active : UI.demo}
        </span>

        {demoState === "idle" && (
          <button
            onClick={startDemo}
            className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500 px-4 py-1.5 text-xs font-semibold text-ink-900 transition-all duration-180 hover:bg-saffron-400 active:scale-95"
          >
            <Play className="h-3 w-3 fill-current" />
            {UI.start}
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
            {UI.restart}
          </button>
        )}
      </div>
    </div>
  );
}
