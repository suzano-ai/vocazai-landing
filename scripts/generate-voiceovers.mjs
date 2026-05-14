#!/usr/bin/env node
/**
 * Generate the marketing voice-overs with Mistral Voxtral TTS.
 *
 *   node scripts/generate-voiceovers.mjs
 *
 * Reads MISTRAL_API_KEY from the env or .env.local. Writes one mp3 per
 * page × language into public/voiceovers/{page}-{lang}.mp3. These are static
 * marketing assets — the same for every visitor — so they're generated once
 * and committed, not synthesised per request.
 *
 * fr/en use Voxtral preset voices; ar is voice-cloned from public/voices/ar-ref.wav
 * (the same Darija reference used by /api/tts).
 */
import fs from "node:fs";
import path from "node:path";

function loadKey() {
  if (process.env.MISTRAL_API_KEY) return process.env.MISTRAL_API_KEY.trim();
  try {
    const env = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
    const m = env.match(/^MISTRAL_API_KEY\s*=\s*(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  } catch { /* none */ }
  return null;
}

const KEY = loadKey();
if (!KEY) {
  console.error("✗ MISTRAL_API_KEY not found (env or .env.local).");
  process.exit(1);
}

const VOICES = { fr: "fr_marie_neutral", en: "gb_jane_neutral" };
const AR_REF_PATH = path.join(process.cwd(), "public", "voices", "ar-ref.wav");

// ── Voice-over scripts — short, warm, ~15-20s spoken, in the page's language ──
// `splash` is the language picker (pre-selection) — a single French clip.
const SCRIPTS = {
  splash: {
    fr: "Bienvenue chez VocazAI. Je suis Yasmine, votre agent vocal. Choisissez votre langue — français, anglais ou arabe — pour découvrir comment je réponds à vos appels, jour et nuit.",
  },
  landing: {
    fr: "Bienvenue chez VocazAI. Moi c'est Yasmine, votre agent vocal. Je réponds aux appels de votre entreprise vingt-quatre heures sur vingt-quatre — je prends les rendez-vous, je réponds aux questions, je ne rate jamais un client. Essayez la démo, et parlez-moi directement.",
    en: "Welcome to VocazAI. I'm Yasmine, your AI voice agent. I answer your business calls around the clock — booking appointments, handling questions, never missing a customer. Try the live demo and talk to me yourself.",
    ar: "مرحبا بكم في فوكاز آي. أنا ياسمين، وكيلك الصوتي. أنا جاوب على مكالمات شركتك 24 ساعة على 24 — حجز المواعيد، جاوب على الأسئلة، ما ضيعش أي عميل. جرب العرض التوضيحي، وحدرني مباشرة.",
  },
  about: {
    fr: "VocazAI est née à Casablanca. Notre mission : rendre l'agent vocal intelligent accessible à toutes les petites entreprises d'Afrique. Une technologie qui parle votre langue, votre darija, et qui ne dort jamais.",
    en: "VocazAI was born in Casablanca. Our mission: make intelligent voice agents accessible to every small business in Africa. Technology that speaks your language — and never sleeps.",
    ar: "فوكاز آي ولدت في الدار البيضاء. مهمتنا : نجعل الوكيل الصوتي الذكي في متناول كل المقاولات الصغيرة في أفريقيا. تكنولوجيا تحكي لغتك، Darija ديالك، وما تنامش.",
  },
  pricing: {
    fr: "Nos offres sont simples et transparentes. Vous payez à l'usage, pas à l'attente. Démarrez petit, grandissez quand vous voulez. La première semaine est gratuite, sans aucun engagement.",
    en: "Our pricing is simple and transparent. You pay for usage, not for waiting. Start small, scale when you're ready. The first week is free — no commitment.",
    ar: "عروضنا بسيطة وشفافة. تدفع على الاستعمال، مش على الانتظار. بدا صغير، كبر متى بدك. الأسبوع الأول مجاني، من غير أي التزام.",
  },
  "use-cases": {
    fr: "Cliniques, agences immobilières, restaurants, e-commerce — partout où chaque appel compte, VocazAI répond. Découvrez comment des entreprises comme la vôtre ne ratent plus jamais un client.",
    en: "Clinics, real-estate agencies, restaurants, e-commerce — wherever every call counts, VocazAI picks up. See how businesses like yours never miss a customer again.",
    ar: "عيادات، وكالات عقارات، مطاعم، التجارة الإلكترونية — في كل مكان لي كل مكالمة مهمة، فوكاز آي جاوب. شوف كيف الشركات زين شركتك ما تخسرش أي عميل.",
  },
};

async function synth(text, lang) {
  const body = { model: "voxtral-mini-tts-2603", input: text, response_format: "mp3" };
  if (lang === "ar") {
    body.ref_audio = fs.readFileSync(AR_REF_PATH).toString("base64");
  } else {
    body.voice = VOICES[lang];
  }
  const res = await fetch("https://api.mistral.ai/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (!data.audio_data) throw new Error("no audio_data in response");
  return Buffer.from(data.audio_data, "base64");
}

(async () => {
  const outDir = path.join(process.cwd(), "public", "voiceovers");
  fs.mkdirSync(outDir, { recursive: true });
  let ok = 0;
  let failed = 0;

  for (const [page, langs] of Object.entries(SCRIPTS)) {
    for (const [lang, text] of Object.entries(langs)) {
      const out = path.join(outDir, `${page}-${lang}.mp3`);
      try {
        const t = Date.now();
        const buf = await synth(text, lang);
        fs.writeFileSync(out, buf);
        console.log(`✓ ${page}-${lang}.mp3  (${(buf.length / 1024).toFixed(1)} KB, ${Date.now() - t}ms)`);
        ok++;
      } catch (e) {
        console.error(`✗ ${page}-${lang}: ${e.message}`);
        failed++;
      }
    }
  }
  console.log(`\n${failed === 0 ? "✓" : "✗"} ${ok} generated, ${failed} failed → public/voiceovers/`);
  process.exit(failed === 0 ? 0 : 1);
})();
