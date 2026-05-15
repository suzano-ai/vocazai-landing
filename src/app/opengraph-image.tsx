import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VocazAI — L'agent vocal qui répond pour vous";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
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
          background: "#0E0D0B",
          color: "#F5EFE6",
          position: "relative",
        }}
      >
        {/* Khatam SVG, top-right */}
        <svg
          width="380"
          height="380"
          viewBox="0 0 200 200"
          style={{ position: "absolute", right: -60, top: -60, opacity: 0.12 }}
        >
          <g transform="translate(100 100)" stroke="#E8A12C" strokeWidth="0.8" fill="none">
            <polygon points="0,-92 26,-26 92,0 26,26 0,92 -26,26 -92,0 -26,-26" />
            <polygon
              points="0,-92 26,-26 92,0 26,26 0,92 -26,26 -92,0 -26,-26"
              transform="rotate(22.5)"
            />
            <circle r="48" strokeDasharray="2 4" />
          </g>
        </svg>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "#E8A12C",
              color: "#0E0D0B",
              fontSize: 40,
              fontWeight: 800,
              fontStyle: "italic",
              fontFamily: "serif",
            }}
          >
            V
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, fontFamily: "serif" }}>
            VocazAI
          </div>
        </div>

        {/* Hero text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(245, 239, 230, 0.55)",
              fontFamily: "monospace",
            }}
          >
            {"• Trilingue · Français · Arabe · Anglais"}
          </div>
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontFamily: "serif",
              fontWeight: 500,
              maxWidth: 1000,
            }}
          >
            L&apos;agent vocal
            <br />
            <span style={{ color: "#E8A12C", fontStyle: "italic" }}>
              qui répond pour vous.
            </span>
          </div>
        </div>

        {/* Footer band */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 32,
            borderTop: "1px solid rgba(245, 239, 230, 0.15)",
            fontSize: 22,
            color: "rgba(245, 239, 230, 0.6)",
          }}
        >
          <div>vocazai.com</div>
          <div>FR · العربية · EN</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
