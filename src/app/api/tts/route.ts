import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Config ────────────────────────────────────────────────────────────────────
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY ?? "";
const MISTRAL_VOICE_ID = process.env.MISTRAL_VOICE_ID ?? "";   // set after vocazai tts setup
const MISTRAL_MODEL    = "voxtral-mini-tts-2603";

// Fallback: local Kokoro TTS (Docker service)
const KOKORO_URL = process.env.TTS_SERVICE_URL ?? "http://tts:8000";

// ── Voxtral (Mistral API) ─────────────────────────────────────────────────────
async function voxtralTTS(text: string): Promise<ArrayBuffer> {
  const body: Record<string, string> = {
    model:           MISTRAL_MODEL,
    input:           text,
    voice_id:        MISTRAL_VOICE_ID,
    response_format: "mp3",
  };

  const res = await fetch("https://api.mistral.ai/v1/audio/speech", {
    method:  "POST",
    headers: {
      "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Mistral TTS ${res.status}: ${err}`);
  }

  const json = await res.json() as { audio_data: string };
  const binary = Buffer.from(json.audio_data, "base64");
  return binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
}

// ── Kokoro fallback ───────────────────────────────────────────────────────────
async function kokoroTTS(text: string, voice: string, speed: number, lang: string): Promise<ArrayBuffer> {
  const res = await fetch(`${KOKORO_URL}/tts`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ text, voice, speed, lang }),
  });

  if (!res.ok) throw new Error(`Kokoro TTS ${res.status}`);
  return res.arrayBuffer();
}

// ── POST /api/tts ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text  = (body.text ?? "").trim();
    const voice = body.voice ?? "af_heart";
    const speed = body.speed ?? 0.92;
    const lang  = body.lang  ?? "fr-fr";

    if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

    // Try Voxtral first if configured
    if (MISTRAL_API_KEY && MISTRAL_VOICE_ID) {
      try {
        console.log("[api/tts] Using Voxtral (Mistral)");
        const audio = await voxtralTTS(text);
        return new Response(audio, {
          headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" },
        });
      } catch (err) {
        console.warn("[api/tts] Voxtral failed, falling back to Kokoro:", err);
      }
    }

    // Fallback to local Kokoro
    console.log("[api/tts] Using Kokoro (local)");
    const audio = await kokoroTTS(text, voice, speed, lang);
    return new Response(audio, {
      headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store" },
    });

  } catch (err) {
    console.error("[api/tts]", err);
    return NextResponse.json({ error: "TTS unavailable" }, { status: 503 });
  }
}

// ── GET /api/tts — health ─────────────────────────────────────────────────────
export async function GET() {
  const useVoxtral = !!(MISTRAL_API_KEY && MISTRAL_VOICE_ID);

  if (useVoxtral) {
    return NextResponse.json({
      status:       "ok",
      engine:       "voxtral",
      model:        MISTRAL_MODEL,
      voice_id:     MISTRAL_VOICE_ID,
      model_loaded: true,
    });
  }

  try {
    const res  = await fetch(`${KOKORO_URL}/health`);
    const data = await res.json();
    return NextResponse.json({ ...data, engine: "kokoro" });
  } catch {
    return NextResponse.json({ status: "unavailable", engine: "none" }, { status: 503 });
  }
}
