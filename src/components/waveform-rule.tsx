/**
 * Waveform-rule — the only structural ornament of the new design system.
 *
 * 1px hairline running edge-to-edge with a single envelope swell on the
 * right side. Replaces every zellige glyph (Khatam/Arch/Quatrefoil) the
 * previous design relied on. Reads as a quiet sound-cue without being
 * literal about microphones or sound-waves.
 *
 * Used between sections and inside hero compositions.
 */
export function WaveformRule({
  className = "",
  variant = "calm",
}: {
  className?: string;
  /** "calm" — single tiny swell. "active" — heavier 3-bump envelope. */
  variant?: "calm" | "active";
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={`h-6 w-full ${className}`}
    >
      {variant === "calm" ? (
        <path
          d="M0 12 H880 Q900 12 910 6 T930 18 T950 12 H1200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M0 12 H520 Q540 12 555 2 T585 22 T615 4 T645 20 T675 8 T705 16 T735 12 H1200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
