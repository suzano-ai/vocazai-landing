import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Self-hosted Piper TTS microservice (Docker internal network) — the fallback.
const TTS_URL = process.env.TTS_SERVICE_URL ?? "http://tts:8000";
const MISTRAL_KEY = process.env.MISTRAL_API_KEY;

/**
 * Voxtral TTS (Mistral, hosted) — human-quality, supports FR/EN/AR, no VPS
 * load. Returns mp3 bytes, or null so the caller falls back to Piper.
 */
async function voxtralTTS(text: string): Promise<ArrayBuffer | null> {
  if (!MISTRAL_KEY) return null;
  try {
    const res = await fetch("https://api.mistral.ai/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "voxtral-mini-tts-2603",
        input: text,
        response_format: "mp3",
      }),
    });
    if (!res.ok) {
      console.warn(`[api/tts] Voxtral ${res.status} — falling back to Piper`);
      return null;
    }
    return await res.arrayBuffer();
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

    if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

    // 1) Voxtral — hosted, human-quality.
    const voxtral = await voxtralTTS(text);
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
