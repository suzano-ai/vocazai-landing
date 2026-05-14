#!/usr/bin/env node
/**
 * Local Voxtral smoke test — verifies Mistral's LLM + Voxtral TTS/STT before
 * the demo is wired to them. Run on this machine, listen to the output file,
 * judge quality + latency, THEN deploy.
 *
 *   node scripts/test-voxtral.mjs
 *
 * Needs MISTRAL_API_KEY in the environment or in .env.local.
 */
import fs from "node:fs";
import path from "node:path";

function loadKey() {
  if (process.env.MISTRAL_API_KEY) return process.env.MISTRAL_API_KEY.trim();
  try {
    const env = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    const m = env.match(/^MISTRAL_API_KEY\s*=\s*(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  } catch { /* no .env.local */ }
  return null;
}

const KEY = loadKey();
if (!KEY) {
  console.error("✗ MISTRAL_API_KEY not found (env or .env.local). Add it and re-run.");
  process.exit(1);
}

const BASE = "https://api.mistral.ai/v1";
const auth = { Authorization: `Bearer ${KEY}` };

async function testChat() {
  console.log("\n— Chat · mistral-small-latest —");
  const t = Date.now();
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: "Tu es Yasmine, réceptionniste IA. Réponds en une seule phrase." },
        { role: "user", content: "Bonjour, je voudrais prendre un rendez-vous." },
      ],
      max_tokens: 80,
    }),
  });
  if (!res.ok) {
    console.error(`✗ chat ${res.status}: ${await res.text()}`);
    return false;
  }
  const data = await res.json();
  console.log(`✓ ${Date.now() - t}ms — "${data.choices?.[0]?.message?.content?.trim()}"`);
  return true;
}

async function testTTS() {
  console.log("\n— TTS · voxtral-mini-tts-2603 —");
  const t = Date.now();
  // The endpoint requires a `voice` and replies with JSON { audio_data: <base64 mp3> }.
  const res = await fetch(`${BASE}/audio/speech`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "voxtral-mini-tts-2603",
      input: "Bonjour ! Je suis Yasmine, l'assistante vocale de VocazAI. Comment puis-je vous aider ?",
      voice: "fr_marie_neutral",
      response_format: "mp3",
    }),
  });
  if (!res.ok) {
    console.error(`✗ tts ${res.status}: ${await res.text()}`);
    return null;
  }
  const data = await res.json();
  if (!data.audio_data) {
    console.error("✗ tts — no audio_data in response");
    return null;
  }
  const buf = Buffer.from(data.audio_data, "base64");
  const out = path.join(process.cwd(), "voxtral-test.mp3");
  fs.writeFileSync(out, buf);
  console.log(`✓ ${Date.now() - t}ms — ${(buf.length / 1024).toFixed(1)} KB → ${out}`);
  console.log("  ▶ open voxtral-test.mp3 and judge whether the voice is human enough.");
  return out;
}

async function testSTT(audioPath) {
  console.log("\n— STT · voxtral-mini-latest —");
  if (!audioPath || !fs.existsSync(audioPath)) {
    console.log("· skipped (no audio from the TTS step)");
    return;
  }
  const t = Date.now();
  const fd = new FormData();
  fd.append("file", new Blob([fs.readFileSync(audioPath)]), "audio.mp3");
  fd.append("model", "voxtral-mini-latest");
  fd.append("language", "fr");
  const res = await fetch(`${BASE}/audio/transcriptions`, { method: "POST", headers: auth, body: fd });
  if (!res.ok) {
    console.error(`✗ stt ${res.status}: ${await res.text()}`);
    return;
  }
  const data = await res.json();
  console.log(`✓ ${Date.now() - t}ms — "${data.text?.trim()}"`);
}

(async () => {
  console.log("Voxtral smoke test → api.mistral.ai");
  const chatOk = await testChat();
  const audio = await testTTS();
  await testSTT(audio);
  console.log(`\n${chatOk && audio ? "✓ All three endpoints responded." : "✗ Something failed — see above."}`);
})();
