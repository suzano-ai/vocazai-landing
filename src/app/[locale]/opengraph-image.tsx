import { ImageResponse } from "next/og";

// No `runtime = "edge"` here — Next disallows combining edge runtime with
// generateStaticParams. Node runtime is fine for per-locale OG since these
// are static-prerendered at build time.
export const alt = "VocazAI — the trilingual AI voice agent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }, { locale: "ar" }];
}

type LocaleCopy = {
  kicker: string;
  line1: string;
  line2: string;
  alt: string;
  dir: "ltr" | "rtl";
};

const COPY: Record<string, LocaleCopy> = {
  fr: {
    kicker: "TRILINGUE · FRANCAIS · ARABE · ANGLAIS",
    line1: "L'agent vocal",
    line2: "qui repond pour vous.",
    alt: "VocazAI — l'agent vocal qui repond pour vous",
    dir: "ltr",
  },
  en: {
    kicker: "TRILINGUAL · FRENCH · ARABIC · ENGLISH",
    line1: "The voice agent",
    line2: "that picks up for you.",
    alt: "VocazAI — the voice agent that picks up for you",
    dir: "ltr",
  },
  ar: {
    // ASCII only — @vercel/og at the edge does not have an Arabic font
    // baked in; rendering Tajawal via fetch is expensive and unreliable.
    // We ship a transliterated headline so the AR preview is at least
    // recognizable and brand-coherent, instead of a French fallback.
    kicker: "TRILINGUAL  FR  AR  EN",
    line1: "Al-wakil al-sawti",
    line2: "alladhi yujib niyabatan ank.",
    alt: "VocazAI — the trilingual AI voice agent",
    dir: "ltr",
  },
};

export default async function OG({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = COPY[locale] ?? COPY.fr;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#000000",
          color: "#EBEBEB",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 16, direction: c.dir }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 6,
              background: "#00FF87",
              color: "#000000",
              fontSize: 40,
              fontWeight: 800,
            }}
          >
            V
          </div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>VocazAI</div>
        </div>

        {/* Hero text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, direction: c.dir }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(235, 235, 235, 0.55)",
            }}
          >
            {`> ${c.kicker}`}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              lineHeight: 0.96,
              letterSpacing: "-0.05em",
              fontWeight: 500,
              maxWidth: 1000,
            }}
          >
            <div style={{ display: "flex" }}>{c.line1}</div>
            <div style={{ display: "flex", color: "#00FF87" }}>{c.line2}</div>
          </div>
        </div>

        {/* Footer band */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 32,
            borderTop: "1px solid rgba(235, 235, 235, 0.15)",
            fontSize: 22,
            color: "rgba(235, 235, 235, 0.6)",
          }}
        >
          <div>vocazai.com</div>
          <div>{locale.toUpperCase()}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
