"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Phone, Play, RotateCcw, Loader2, Mic, CheckCircle } from "lucide-react";
import { Waveform } from "@/components/zellige";

// ─── Types ────────────────────────────────────────────────────────────────────
type Lang      = "fr" | "en" | "ar";
type DemoState = "idle" | "loading" | "speaking" | "listening" | "processing" | "done" | "error";
type Message   = { role: "agent" | "user"; text: string };
type Collected = { name?: string; slot?: string; email?: string };

// ─── Per-language config ──────────────────────────────────────────────────────
const LANG_CFG: Record<Lang, {
  bcp47:   string;
  voice:   string;
  stt:     string;
  dir:     "ltr" | "rtl";
  label:   string;
  script: {
    id:       string;
    speak:    string | ((c: Collected) => string);
    hint:     string;
    mode:     "intent" | "free" | "choice" | "email";
    choices?: string[];
  }[];
  retry:      string;
  retryEmail: string;
  retrySlot:  string;
  bailout:    string;
  closing:    (name: string, slot: string, email: string) => string;
}> = {
  fr: {
    bcp47:  "fr-FR",
    voice:  "fr_FR-siwis-medium",
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
        speak:   (c) => c.name
          ? `Merci ${c.name}. J'ai deux créneaux disponibles ce mercredi : 9h30 ou 11h15. Lequel vous convient ?`
          : `Parfait. J'ai deux créneaux disponibles ce mercredi : 9h30 ou 11h15. Lequel vous convient ?`,
        hint:    "Dites « 9h30 » ou « 11h15 »",
        mode:    "choice",
        choices: ["9h30", "11h15"],
      },
      {
        id:    "email",
        speak: (c) => c.slot
          ? `${c.name ? `${c.name}, votre` : "Votre"} créneau de ${c.slot} est retenu. Quelle est votre adresse email pour la confirmation ?`
          : `Quelle est votre adresse email pour la confirmation ?`,
        hint:  "Épelez votre email ou dites-le clairement",
        mode:  "email",
      },
    ],
    retry:      "Je n'ai pas entendu. Pouvez-vous répéter ?",
    retryEmail: "Je n'ai pas pu noter votre email. Pouvez-vous le répéter lentement ?",
    retrySlot:  "Je n'ai pas bien compris. Dites 9h30 ou 11h15.",
    bailout:    "Je n'arrive pas à vous entendre correctement. N'hésitez pas à relancer la démo dans un instant.",
    closing: (name, slot, email) =>
      `Parfait${name ? `, ${name}` : ""}. Votre rendez-vous${slot ? ` à ${slot}` : ""} ce mercredi est confirmé. Un email de confirmation${email ? ` a été envoyé à ${email}` : " vous sera envoyé"}. À très bientôt.`,
  },

  en: {
    bcp47:  "en-US",
    voice:  "en_US-hfc_female-medium",
    stt:    "en",
    dir:    "ltr",
    label:  "EN",
    script: [
      {
        id:    "greeting",
        speak: "Hello! I'm Yasmine, VocazAI's voice assistant. How can I help you today?",
        hint:  "Say for example: \"I'd like to book an appointment\"",
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
        speak:   (c) => c.name
          ? `Thank you, ${c.name}. I have two slots this Wednesday: 9:30 AM or 11:15 AM. Which works for you?`
          : `Thank you. I have two slots this Wednesday: 9:30 AM or 11:15 AM. Which works for you?`,
        hint:    'Say "9:30" or "11:15"',
        mode:    "choice",
        choices: ["9:30 AM", "11:15 AM"],
      },
      {
        id:    "email",
        speak: (c) => c.slot
          ? `${c.name ? `${c.name}, your` : "Your"} ${c.slot} slot is locked in. What is your email address for the confirmation?`
          : `What is your email address for the confirmation?`,
        hint:  "Spell out your email clearly",
        mode:  "email",
      },
    ],
    retry:      "I didn't catch that. Could you repeat?",
    retryEmail: "I couldn't catch your email. Could you repeat it clearly?",
    retrySlot:  "I didn't understand. Please say 9:30 or 11:15.",
    bailout:    "I'm having trouble hearing you. Feel free to restart the demo in a moment.",
    closing: (name, slot, email) =>
      `Perfect${name ? `, ${name}` : ""}. Your appointment${slot ? ` at ${slot}` : ""} this Wednesday is confirmed. A confirmation email${email ? ` has been sent to ${email}` : " will be sent to you"}. Talk soon.`,
  },

  ar: {
    bcp47:  "ar-MA",
    voice:  "ar_JO-kareem-medium",
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
        speak:   (c) => c.name
          ? `شكراً ${c.name}. لديّ موعدان متاحان هذا الأربعاء: التاسعة والنصف، أو الحادية عشرة والربع. أيهما يناسبك؟`
          : `شكراً. لديّ موعدان متاحان هذا الأربعاء: التاسعة والنصف، أو الحادية عشرة والربع. أيهما يناسبك؟`,
        hint:    "قل «9:30» أو «11:15»",
        mode:    "choice",
        choices: ["9:30", "11:15"],
      },
      {
        id:    "email",
        speak: (c) => c.slot
          ? `${c.name ? `${c.name}، ` : ""}موعدك${` الساعة ${c.slot}`} محجوز. ما هو بريدك الإلكتروني لإرسال التأكيد؟`
          : `ما هو بريدك الإلكتروني لإرسال التأكيد؟`,
        hint:  "أملِ بريدك الإلكتروني بوضوح",
        mode:  "email",
      },
    ],
    retry:      "لم أسمع ذلك. هل يمكنك التكرار؟",
    retryEmail: "لم أتمكن من فهم بريدك الإلكتروني. هل يمكنك تكراره ببطء؟",
    retrySlot:  "لم أفهم جيداً. قل 9:30 أو 11:15.",
    bailout:    "أجد صعوبة في سماعك. يمكنك إعادة تشغيل العرض التجريبي في أي وقت.",
    closing: (name, slot, email) =>
      `ممتاز${name ? `، ${name}` : ""}. تم تأكيد موعدك${slot ? ` الساعة ${slot}` : ""} هذا الأربعاء. ${email ? `تم إرسال بريد التأكيد إلى ${email}` : "سيصلك بريد التأكيد قريباً"}. إلى اللقاء.`,
  },
};

// ─── Detect visitor language ──────────────────────────────────────────────────
// locale from the URL takes priority; browser language is only a fallback.
function detectLang(locale?: string): Lang {
  if (locale === "fr" || locale === "en" || locale === "ar") return locale as Lang;
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
export function DemoCallCard({ locale }: { locale?: string }) {
  const [lang,      setLang]      = useState<Lang>(() => detectLang(locale));
  const [demoState, setDemoState] = useState<DemoState>("idle");
  const [,          setTurn]      = useState(0);
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

  // Sync langRef on mount (state initialiser already set the value)
  useEffect(() => {
    const detected = detectLang(locale);
    setLang(detected);
    langRef.current = detected;
  }, [locale]);

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

  // ── TTS Architecture ──────────────────────────────────────────────────────
  //  1. Piper TTS (/api/tts) — the correct, consistent voice model per language
  //     (fr_FR-siwis / en_US-hfc_female / ar_JO-kareem). Same on every device.
  //  2. Web Speech API — fallback, only ever with a SAME-LANGUAGE voice.
  //  3. Silent timeout — last resort, keeps the conversation flowing.

  // ── Web Speech API voice picker — same-language only ──────────────────────
  const pickVoice = useCallback((bcp47: string): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const tag  = bcp47.toLowerCase();
    const base = tag.split("-")[0]; // "fr-fr" → "fr"
    // exact locale → same language + local → any same-language. Never cross-language.
    return (
      voices.find((v) => v.lang.toLowerCase() === tag) ??
      voices.find((v) => v.lang.toLowerCase().split("-")[0] === base && v.localService) ??
      voices.find((v) => v.lang.toLowerCase().split("-")[0] === base) ??
      null
    );
  }, []);

  // ── Piper TTS (self-hosted) — resolves true only if audio actually played ──
  const speakViaApi = useCallback((text: string, voice: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setDemoState("loading");
      const ctrl = new AbortController();
      const netTimeout = setTimeout(() => ctrl.abort(), 8000);

      fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed: 0.92 }),
        signal: ctrl.signal,
      })
        .then(async (res) => {
          clearTimeout(netTimeout);
          if (!res.ok) { resolve(false); return; }
          const url   = URL.createObjectURL(await res.blob());
          const audio = new Audio(url);
          audioRef.current = audio;
          const done = (ok: boolean) => { URL.revokeObjectURL(url); resolve(ok); };
          audio.onended = () => done(true);
          audio.onerror = () => done(false);
          setDemoState("speaking");
          audio.play().catch(() => done(false));
        })
        .catch(() => { clearTimeout(netTimeout); resolve(false); });
    });
  }, []);

  // ── Web Speech API TTS — fallback. Resolves true if it spoke, false if not. ─
  const speakViaBrowser = useCallback((text: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        resolve(false);
        return;
      }
      const cfg   = LANG_CFG[langRef.current];
      const synth = window.speechSynthesis;
      synth.cancel();

      let settled = false;
      let watchdog: ReturnType<typeof setTimeout> | null = null;
      const settle = (ok: boolean) => {
        if (settled) return;
        settled = true;
        if (watchdog) clearTimeout(watchdog);
        resolve(ok);
      };

      const doSpeak = () => {
        const voice = pickVoice(cfg.bcp47);
        // No same-language voice → let the dispatcher fall through to silence.
        if (!voice) { settle(false); return; }

        const utter  = new SpeechSynthesisUtterance(text);
        utter.voice  = voice;
        utter.lang   = voice.lang;
        utter.rate   = langRef.current === "ar" ? 0.9 : 0.95;
        utter.pitch  = 1.0;
        utter.volume = 1;

        utter.onend = () => settle(true);
        utter.onerror = (e: SpeechSynthesisErrorEvent) => {
          // "interrupted"/"canceled" fire right after a normal finish in some browsers
          settle(e.error === "interrupted" || e.error === "canceled");
        };

        setDemoState("speaking");
        synth.speak(utter);

        // Watchdog: some browsers never fire onend/onerror — never hang the demo.
        watchdog = setTimeout(
          () => settle(true),
          Math.min(3000 + text.length * 90, 20000),
        );
      };

      const voices = synth.getVoices();
      if (voices.length > 0) {
        doSpeak();
      } else {
        let fired = false;
        const onceFire = () => { if (fired) return; fired = true; doSpeak(); };
        synth.onvoiceschanged = onceFire;
        setTimeout(onceFire, 700);
      }
    });
  }, [pickVoice]);

  // ── TTS dispatcher — Piper first (correct voice), browser fallback, silence ─
  const speak = useCallback(async (text: string): Promise<void> => {
    const cfg = LANG_CFG[langRef.current];

    if (await speakViaApi(text, cfg.voice)) return;
    if (await speakViaBrowser(text)) return;

    // Last resort: pace the conversation without audio.
    setDemoState("speaking");
    await new Promise((r) =>
      setTimeout(r, Math.min(1800 + text.split(/\s+/).length * 120, 7000)),
    );
  }, [speakViaApi, speakViaBrowser]);

  // ── STT: record → faster-whisper (server fallback) ───────────────────────
  const listenViaServer = useCallback((): Promise<string> => {
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

          rec.ondataavailable = (e: any) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
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

  // ── STT: Web Speech API (primary) → server fallback ──────────────────────
  // Web Speech API uses Google/Apple cloud models — instant, accurate, no server
  // round-trip. Falls back to faster-whisper when unavailable (Firefox, etc.).
  const listen = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      setDemoState("listening");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type AnySpeechRecog = new () => any;
      const SpeechRecog: AnySpeechRecog | false =
        typeof window !== "undefined"
          ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || false)
          : false;

      if (SpeechRecog) {
        const recog = new SpeechRecog();
        recog.lang              = LANG_CFG[langRef.current].bcp47;
        recog.continuous        = false;
        recog.interimResults    = false;
        recog.maxAlternatives   = 3;

        let settled = false;
        const settle = (text: string) => {
          if (settled) return;
          settled = true;
          resolve(text);
        };

        recog.onresult = (e: any) => {
          const transcript = Array.from(e.results)
            .map((r: any) => r[0]?.transcript ?? "")
            .join(" ")
            .trim();
          settle(transcript);
        };

        recog.onerror = (e: any) => {
          if (settled) return;
          // no-speech: user was silent — return empty so retry logic kicks in
          if (e.error === "no-speech" || e.error === "audio-capture") {
            settle("");
          } else {
            // network / service-not-allowed / etc. → try server
            settled = true;
            listenViaServer().then(resolve);
          }
        };

        recog.onend = () => { if (!settled) settle(""); };

        try { recog.start(); }
        catch { listenViaServer().then(resolve); }
        return;
      }

      // No Web Speech API → fall back to faster-whisper
      listenViaServer().then(resolve);
    });
  }, [listenViaServer]);

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

  // ── Graceful bailout — Yasmine speaks and ends the demo (no error button) ──
  const gracefulBailout = useCallback(async () => {
    const cfg = LANG_CFG[langRef.current];
    await speak(cfg.bailout);
    setMessages((m) => [...m, { role: "agent", text: cfg.bailout }]);
    setDemoState("done");
    stopTimer();
  }, [speak, stopTimer]);

  // ── Main conversation loop ─────────────────────────────────────────────────
  const runTurn = useCallback(async (idx: number) => {
    const cfg    = LANG_CFG[langRef.current];
    const script = cfg.script;
    if (idx >= script.length) return;

    const step = script[idx];
    const speakText = typeof step.speak === "function"
      ? step.speak(collected.current)
      : step.speak;

    setHint(step.hint ?? "");
    await speak(speakText);
    setMessages((m) => [...m, { role: "agent", text: speakText }]);

    // ── Retry loop: up to 3 attempts; Yasmine speaks every retry ────────────
    const getTranscript = async (): Promise<string> => {
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await speak(cfg.retry);
        const t = await listen();
        if (t) return t;
      }
      return "";
    };

    // ── Intent step — any non-empty response advances the conversation ───────
    if (step.mode === "intent") {
      const transcript = await getTranscript();
      if (!transcript) { await gracefulBailout(); return; }
      setMessages((m) => [...m, { role: "user", text: transcript }]);

    // ── Free-form step (name, etc.) ──────────────────────────────────────────
    } else if (step.mode === "free") {
      const transcript = await getTranscript();
      if (!transcript) { await gracefulBailout(); return; }
      collected.current[step.id as "name"] = transcript;
      setMessages((m) => [...m, { role: "user", text: transcript }]);

    // ── Choice step (time slot) ──────────────────────────────────────────────
    } else if (step.mode === "choice") {
      let matched: string | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await speak(cfg.retrySlot);
        const t = await listen();
        if (t) {
          setMessages((m) => [...m, { role: "user", text: t }]);
          matched = matchSlot(t, langRef.current);
          if (matched) break;
        }
      }
      if (!matched) { await gracefulBailout(); return; }
      collected.current.slot = matched;

    // ── Email step ───────────────────────────────────────────────────────────
    } else if (step.mode === "email") {
      let email: string | null = null;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await speak(cfg.retryEmail);
        const t = await listen();
        if (t) {
          setMessages((m) => [...m, { role: "user", text: t }]);
          email = extractEmail(t) ?? t;
          if (email) break;
        }
      }
      if (!email) { await gracefulBailout(); return; }
      collected.current.email = email;
      setMessages((m) => [...m, { role: "user", text: email }]);
    }

    const nextIdx = idx + 1;
    setTurn(nextIdx);

    if (nextIdx >= script.length) {
      const { name, slot, email } = collected.current;
      const closingText = cfg.closing(name ?? "", slot ?? "", email ?? "");
      await speak(closingText);
      setMessages((m) => [...m, { role: "agent", text: closingText }]);
      await sendEmail();
      setDemoState("done");
      stopTimer();
    } else {
      await runTurn(nextIdx);
    }
  }, [speak, listen, gracefulBailout, sendEmail, stopTimer]);

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
    fr: { idle: "Appuyez sur Démarrer — Yasmine vous guidera entièrement par la voix.", start: "Démarrer la démo", live: "En direct", waiting: "En attente", recording: "Enregistrement", active: "Appel IA en cours", demo: "Démo interactive", loading: "Yasmine prépare sa réponse…", listening: "Yasmine vous écoute…", processing: "Traitement…", email: "Email de confirmation envoyé", error: "Je n'ai pas pu comprendre. Veuillez recommencer.", restart: "Recommencer" },
    en: { idle: "Press Start — Yasmine will guide you entirely by voice.", start: "Start demo", live: "Live", waiting: "Waiting", recording: "Recording", active: "AI call in progress", demo: "Interactive demo", loading: "Yasmine is preparing…", listening: "Yasmine is listening…", processing: "Processing…", email: "Confirmation email sent", error: "I couldn't understand. Please try again.", restart: "Restart" },
    ar: { idle: "اضغط ابدأ — ياسمين ستوجهك بالكامل عبر الصوت.", start: "ابدأ التجربة", live: "مباشر", waiting: "في انتظار", recording: "تسجيل", active: "مكالمة ذكاء اصطناعي", demo: "عرض تفاعلي", loading: "ياسمين تحضّر ردّها…", listening: "ياسمين تستمع إليك…", processing: "معالجة…", email: "تم إرسال بريد التأكيد", error: "لم أتمكن من الفهم. حاول مجدداً.", restart: "إعادة" },
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

        {/* No error state — Yasmine always speaks a graceful goodbye instead */}
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
