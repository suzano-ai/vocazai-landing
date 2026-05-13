import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";
import { handleVoiceWebhook } from "@/lib/webhooks/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  if (!process.env.RETELL_API_KEY) {
    return NextResponse.json({ error: "RETELL_API_KEY not configured" }, { status: 503 });
  }

  const provider = getProvider("retell");
  const valid = provider.verifyWebhookSignature(rawBody, headers);

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = provider.parseWebhook(payload);
  await handleVoiceWebhook({ provider: "retell", event, payload, signatureValid: valid, rawBody });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "retell webhook endpoint" });
}
