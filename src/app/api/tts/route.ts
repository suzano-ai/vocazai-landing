import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Kokoro TTS microservice (Docker internal network)
const KOKORO_URL = process.env.TTS_SERVICE_URL ?? "http://tts:8000";

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
    const body  = await request.json();
    const text  = (body.text  ?? "").trim();
    const voice = body.voice  ?? "ff_siwis";
    const speed = body.speed  ?? 0.92;
    const lang  = body.lang   ?? "fr-fr";

    if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });

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
  try {
    const res  = await fetch(`${KOKORO_URL}/health`);
    const data = await res.json();
    return NextResponse.json({ ...data, engine: "kokoro" });
  } catch {
    return NextResponse.json({ status: "unavailable", engine: "kokoro" }, { status: 503 });
  }
}
