import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Self-hosted Piper TTS microservice (Docker internal network) — the fallback.
const TTS_URL = process.env.TTS_SERVICE_URL ?? "http://tts:8000";
const MISTRAL_KEY = process.env.MISTRAL_API_KEY;

// Voxtral preset voices (female, "Yasmine"). Verified via /v1/audio/voices —
// the library has only English + French presets, no Arabic.
const VOXTRAL_VOICES: Record<string, string> = {
  fr: "fr_marie_neutral",
  en: "gb_jane_neutral",
};

// Arabic has no preset Voxtral voice, but Voxtral clones any voice from a short
// reference clip ("zero-shot cross-lingual adaptation" — verified locally).
// We ship a reference at public/voices/ar-ref.wav; VOXTRAL_AR_REF_B64 overrides
// it (e.g. a female Darija sample). Loaded once, then cached.
let arabicRef: string | null | undefined;
function getArabicRef(): string | null {
  if (arabicRef !== undefined) return arabicRef;
  if (process.env.VOXTRAL_AR_REF_B64) {
    arabicRef = process.env.VOXTRAL_AR_REF_B64.trim();
    return arabicRef;
  }
  try {
    arabicRef = fs
      .readFileSync(path.join(process.cwd(), "public", "voices", "ar-ref.wav"))
      .toString("base64");
  } catch {
    arabicRef = null; // no reference clip → Arabic falls back to Piper
  }
  return arabicRef;
}

/** Derive fr/en/ar from an explicit lang or from a Piper voice id like "fr_FR-…". */
function resolveLang(lang: string | undefined, voice: string): string {
  if (lang === "fr" || lang === "en" || lang === "ar") return lang;
  const head = voice.slice(0, 2).toLowerCase();
  return head === "en" || head === "ar" ? head : "fr";
}

/**
 * Voxtral TTS (Mistral, hosted) — human-quality. fr/en use a preset voice;
 * Arabic uses ref_audio voice-cloning. Returns mp3 bytes, or null so the caller
 * falls back to Piper (no key, no Arabic reference, or any error).
 * The endpoint replies with JSON `{ audio_data: "<base64 mp3>" }`.
 */
async function voxtralTTS(text: string, lang: string): Promise<ArrayBuffer | null> {
  if (!MISTRAL_KEY) return null;

  const body: Record<string, unknown> = {
    model: "voxtral-mini-tts-2603",
    input: text,
    response_format: "mp3",
  };
  if (lang === "ar") {
    const ref = getArabicRef();
    if (!ref) return null; // no reference clip → Piper handles Arabic
    body.ref_audio = ref;
  } else {
    const voice = VOXTRAL_VOICES[lang];
    if (!voice) return null;
    body.voice = voice;
  }

  try {
    const res = await fetch("https://api.mistral.ai/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn(`[api/tts] Voxtral ${res.status} — falling back to Piper`);
      return null;
    }
    const data = await res.json();
    if (!data.audio_data) return null;
    const bin = Buffer.from(data.audio_data, "base64");
    return bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength);
  } catch (e) {
    console.warn("[api/tts] Voxtral error — falling back to Piper:", e);
    return null;
  }
}

/** Piper TTS (self-hosted) — the fallback. Returns wav bytes. */
async function piperTTS(text: string, voice: string, speed: number): Promise<ArrayBuffer> {
  const res = await fetch(`${TTS_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, speed }),
  });
  if (!res.ok) throw new Error(`Piper TTS ${res.status}: ${await res.text()}`);
  return res.arrayBuffer();
}

// ── POST /api/tts ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body  = await request.json();
    const text  = (body.text  ?? "").trim();
    const voice = body.voice  ?? "fr_FR-siwis-medium";
    const speed = body.speed  ?? 0.92;
    const lang  = resolveLang(body.lang, voice);

    if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

    // 1) Voxtral — hosted, human-quality (FR/EN).
    const voxtral = await voxtralTTS(text, lang);
    if (voxtral) {
      return new Response(voxtral, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "no-store",
          "X-TTS-Engine": "voxtral",
        },
      });
    }

    // 2) Piper — self-hosted fallback.
    const piper = await piperTTS(text, voice, speed);
    return new Response(piper, {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
        "X-TTS-Engine": "piper",
      },
    });
  } catch (err) {
    console.error("[api/tts]", err);
    return NextResponse.json({ error: "TTS unavailable" }, { status: 503 });
  }
}

// ── GET /api/tts — health ─────────────────────────────────────────────────────
export async function GET() {
  const engines: Record<string, string> = {
    voxtral: MISTRAL_KEY ? "configured" : "not configured",
  };
  try {
    const res = await fetch(`${TTS_URL}/health`);
    engines.piper = res.ok ? "ok" : "unavailable";
  } catch {
    engines.piper = "unavailable";
  }
  return NextResponse.json({ status: "ok", engines });
}
