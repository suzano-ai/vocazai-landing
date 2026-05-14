import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MISTRAL_KEY = process.env.MISTRAL_API_KEY;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Conversational LLM turn for the landing-page demo — proxies to Mistral so the
 * API key stays server-side. The caller sends the full message history
 * (system prompt + turns); the system prompt instructs the model to reply with
 * a JSON object, so we ask Mistral for `json_object` output and return the raw
 * content string for the client to parse.
 *
 * Without MISTRAL_API_KEY this returns 503 — the demo then falls back to its
 * scripted flow.
 */
export async function POST(request: NextRequest) {
  if (!MISTRAL_KEY) {
    return NextResponse.json({ error: "mistral_not_configured" }, { status: 503 });
  }

  try {
    const { messages } = (await request.json()) as { messages: ChatMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MISTRAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages,
        temperature: 0.5,
        max_tokens: 220,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.error(`[api/demo-chat] Mistral ${res.status}: ${await res.text()}`);
      return NextResponse.json({ error: "mistral_error" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ content });
  } catch (err) {
    console.error("[api/demo-chat]", err);
    return NextResponse.json({ error: "demo_chat_failed" }, { status: 500 });
  }
}
