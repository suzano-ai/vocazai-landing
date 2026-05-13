import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";
import { handleVoiceWebhook } from "@/lib/webhooks/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  if (!process.env.VAPI_API_KEY) {
    return NextResponse.json({ error: "VAPI_API_KEY not configured" }, { status: 503 });
  }

  const provider = getProvider("vapi");
  const valid = provider.verifyWebhookSignature(rawBody, headers);

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = provider.parseWebhook(payload);
  await handleVoiceWebhook({ provider: "vapi", event, payload, signatureValid: valid, rawBody });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "vapi webhook endpoint" });
}
