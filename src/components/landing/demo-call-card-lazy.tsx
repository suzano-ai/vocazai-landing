"use client";

import dynamic from "next/dynamic";

/**
 * Lazy wrapper for DemoCallCard — defers ~30KB of audio/STT/TTS/WebRTC
 * code from the initial JS bundle. SSR stays on so the pre-filled sample
 * conversation paints from the first byte; only the interactive layer
 * (recording, streaming LLM, voice) hydrates on demand.
 */
const DemoCallCardImpl = dynamic(
  () => import("./demo-call-card").then((m) => ({ default: m.DemoCallCard })),
  {
    ssr: true,
    loading: () => (
      <div
        aria-busy="true"
        className="min-h-[420px] rounded-lg border border-border bg-surface"
      />
    ),
  }
);

export function DemoCallCard({ locale }: { locale?: string }) {
  return <DemoCallCardImpl locale={locale} />;
}
