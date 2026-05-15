import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cascade: OpenAI gpt-4o-transcribe → Mistral Voxtral → self-hosted whisper.
// Each layer is optional — the chain degrades if a key/service is missing.
const STT_URL = process.env.STT_SERVICE_URL ?? "http://stt:9000";
const MISTRAL_KEY = process.env.MISTRAL_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_STT_MODEL ?? "gpt-4o-transcribe";

/**
 * OpenAI Audio Transcriptions — the strongest publicly available STT today
 * (gpt-4o-transcribe / gpt-4o-mini-transcribe; falls back to whisper-1 via env).
 * Same /v1/audio/transcriptions shape as Whisper — drop-in upgrade.
 * Returns the transcript string, or null so the caller falls back.
 */
async function openaiSTT(file: File, language: string): Promise<string | null> {
  if (!OPENAI_KEY) return null;
  try {
    const fd = new FormData();
    fd.append("file", file, file.name || "audio.webm");
    fd.append("model", OPENAI_MODEL);
    if (language && language !== "auto") fd.append("language", language);
    fd.append("response_format", "json");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_KEY}` },
      body: fd,
    });
    if (!res.ok) {
      console.warn(`[api/stt] OpenAI ${res.status} — falling back to Voxtral`);
      return null;
    }
    const data = await res.json();
    return (data.text ?? "").trim();
  } catch (e) {
    console.warn("[api/stt] OpenAI error — falling back to Voxtral:", e);
    return null;
  }
}

/**
 * Voxtral STT (Mistral, hosted) — FR/EN/AR. Model is picked per language:
 *  - fr/en → `voxtral-mini-transcribe-2507`, the dedicated transcription model
 *  - ar    → `voxtral-mini-2602`, because the dedicated transcribe model
 *            *translates* Arabic into French (verified) instead of
 *            transcribing it; the general model keeps Arabic script.
 */
function voxtralModel(language: string): string {
  return language === "ar" ? "voxtral-mini-2602" : "voxtral-mini-transcribe-2507";
}

async function voxtralSTT(file: File, language: string): Promise<string | null> {
  if (!MISTRAL_KEY) return null;
  try {
    const fd = new FormData();
    fd.append("file", file, file.name || "audio.webm");
    fd.append("model", voxtralModel(language));
    if (language && language !== "auto") fd.append("language", language);

    const res = await fetch("https://api.mistral.ai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${MISTRAL_KEY}` },
      body: fd,
    });
    if (!res.ok) {
      console.warn(`[api/stt] Voxtral ${res.status} — falling back to whisper`);
      return null;
    }
    const data = await res.json();
    return (data.text ?? "").trim();
  } catch (e) {
    console.warn("[api/stt] Voxtral error — falling back to whisper:", e);
    return null;
  }
}

/** faster-whisper (self-hosted) — last-resort fallback. */
async function whisperSTT(formData: FormData): Promise<{ text: string }> {
  const res = await fetch(`${STT_URL}/stt`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`whisper ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio");
    const language = (formData.get("language") as string) || "fr";

    if (file instanceof File) {
      // 1) OpenAI gpt-4o-transcribe — strongest available.
      const openai = await openaiSTT(file, language);
      if (openai !== null) {
        return NextResponse.json({ text: openai, engine: "openai", model: OPENAI_MODEL });
      }
      // 2) Mistral Voxtral — hosted backup.
      const voxtral = await voxtralSTT(file, language);
      if (voxtral !== null) {
        return NextResponse.json({ text: voxtral, engine: "voxtral" });
      }
    }

    // 3) faster-whisper — self-hosted last resort.
    const data = await whisperSTT(formData);
    return NextResponse.json({ ...data, engine: "whisper" });
  } catch (err) {
    console.error("[api/stt]", err);
    return NextResponse.json({ error: "STT unavailable" }, { status: 503 });
  }
}

export async function GET() {
  const engines: Record<string, string> = {
    openai: OPENAI_KEY ? `configured (${OPENAI_MODEL})` : "not configured",
    voxtral: MISTRAL_KEY ? "configured" : "not configured",
  };
  try {
    const res = await fetch(`${STT_URL}/health`);
    engines.whisper = res.ok ? "ok" : "unavailable";
  } catch {
    engines.whisper = "unavailable";
  }
  return NextResponse.json({ status: "ok", engines });
}
