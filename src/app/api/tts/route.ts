import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Piper TTS microservice (Docker internal network)
const TTS_URL = process.env.TTS_SERVICE_URL ?? "http://tts:8000";

async function piperTTS(text: string, voice: string, speed: number): Promise<ArrayBuffer> {
  const res = await fetch(`${TTS_URL}/tts`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ text, voice, speed }),
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

    const audio = await piperTTS(text, voice, speed);
    return new Response(audio, {
      headers: {
        "Content-Type":  "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/tts]", err);
    return NextResponse.json({ error: "TTS unavailable" }, { status: 503 });
  }
}

// ── GET /api/tts — health ─────────────────────────────────────────────────────
export async function GET() {
  try {
    const res  = await fetch(`${TTS_URL}/health`);
    const data = await res.json();
    return NextResponse.json({ ...data, engine: "piper" });
  } catch {
    return NextResponse.json({ status: "unavailable", engine: "piper" }, { status: 503 });
  }
}
