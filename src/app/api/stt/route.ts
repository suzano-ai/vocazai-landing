import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Self-hosted faster-whisper STT microservice — the fallback.
const STT_URL = process.env.STT_SERVICE_URL ?? "http://stt:9000";
const MISTRAL_KEY = process.env.MISTRAL_API_KEY;

/**
 * Voxtral Transcribe (Mistral, hosted) — best-in-class accuracy, FR/EN/AR.
 * Returns the transcript string, or null so the caller falls back to whisper.
 */
async function voxtralSTT(file: File, language: string): Promise<string | null> {
  if (!MISTRAL_KEY) return null;
  try {
    const fd = new FormData();
    fd.append("file", file, file.name || "audio.webm");
    fd.append("model", "voxtral-mini-latest");
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

/** faster-whisper (self-hosted) — the fallback. */
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

    // 1) Voxtral Transcribe — hosted, best accuracy.
    if (file instanceof File) {
      const text = await voxtralSTT(file, language);
      if (text !== null) {
        return NextResponse.json({ text, engine: "voxtral" });
      }
    }

    // 2) faster-whisper — self-hosted fallback.
    const data = await whisperSTT(formData);
    return NextResponse.json({ ...data, engine: "whisper" });
  } catch (err) {
    console.error("[api/stt]", err);
    return NextResponse.json({ error: "STT unavailable" }, { status: 503 });
  }
}

export async function GET() {
  const engines: Record<string, string> = {
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
