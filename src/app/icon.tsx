import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/**
 * Site icon — generated at request time so it stays consistent with the
 * rest of the brand (saffron square, ink-900 italic "V"). Next.js picks
 * this up automatically and registers the right <link rel="icon"> tags.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#00FF87",
          color: "#1A1714",
          fontFamily: "serif",
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: 360,
          borderRadius: 96,
        }}
      >
        V
      </div>
    ),
    { ...size }
  );
}
