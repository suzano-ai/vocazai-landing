import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STT_URL = process.env.STT_SERVICE_URL ?? "http://stt:9000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const upstream = await fetch(`${STT_URL}/stt`, {
      method: "POST",
      body: formData,
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return NextResponse.json({ error: err }, { status: upstream.status });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[api/stt]", err);
    return NextResponse.json({ error: "STT unavailable" }, { status: 503 });
  }
}

export async function GET() {
  try {
    const res = await fetch(`${STT_URL}/health`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: "unavailable" }, { status: 503 });
  }
}
