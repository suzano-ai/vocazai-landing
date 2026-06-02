import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon (iOS home-screen icon). Mirrors `/icon` but at the
 * 180×180 size iOS expects.
 */
export default function AppleIcon() {
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
          fontSize: 128,
          borderRadius: 36,
        }}
      >
        V
      </div>
    ),
    { ...size }
  );
}
