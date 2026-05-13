/**
 * Subtle geometric ornaments — Moroccan-rooted but refined.
 * No heavy zellige; just an 8-pointed khatam and a sound waveform
 * used sparingly as editorial accents.
 */

export function Khatam({
  size = 240,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <g
        transform="translate(100 100)"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
      >
        <polygon points="0,-92 26,-26 92,0 26,26 0,92 -26,26 -92,0 -26,-26" />
        <polygon
          points="0,-92 26,-26 92,0 26,26 0,92 -26,26 -92,0 -26,-26"
          transform="rotate(22.5)"
        />
        <circle r="48" strokeDasharray="2 4" />
      </g>
    </svg>
  );
}

/**
 * Animated audio waveform — visualizes the voice-AI essence.
 * Pure CSS animation; respects prefers-reduced-motion via globals.
 */
export function Waveform({
  bars = 28,
  className = "",
}: {
  bars?: number;
  className?: string;
}) {
  return (
    <div className={`flex h-12 items-center gap-[3px] ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => {
        const heights = [0.4, 0.7, 0.5, 0.9, 0.6, 1, 0.55, 0.3, 0.8, 0.45];
        const h = heights[i % heights.length];
        return (
          <span
            key={i}
            className="wave-bar"
            style={{
              height: `${h * 100}%`,
              animationDelay: `${(i % 7) * 0.08}s`,
            }}
          />
        );
      })}
    </div>
  );
}
