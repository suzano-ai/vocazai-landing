/**
 * Geometric primitives — Moroccan-rooted, refined.
 * Used sparingly at low opacity as editorial accents.
 *
 * No blobs, no clouds, no Memphis sprinkles. Three families only:
 *   1. Khatam (8-pointed star) — heritage anchor
 *   2. Arch (keyhole) — architectural reference
 *   3. Waveform / Lines — voice-AI signature
 */

export function Khatam({
  size = 240,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <g transform="translate(100 100)" stroke="currentColor" strokeWidth="0.6" fill="none">
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
 * Moorish keyhole arch — architectural Moroccan reference.
 * Use as section divider or backdrop element.
 */
export function Arch({
  size = 280,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={(size * 280) / 200} className={className} aria-hidden>
      <path
        d="M20 280 L20 110 Q20 0 100 0 Q180 0 180 110 L180 280 Z"
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
      />
      <path
        d="M40 280 L40 120 Q40 25 100 25 Q160 25 160 120 L160 280"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

/**
 * Hexagonal lattice (subtle).
 * Use as repeating background for a "data infrastructure" feel.
 */
export function HexLattice({
  size = 320,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <defs>
        <pattern id="hexp" x="0" y="0" width="40" height="34.64" patternUnits="userSpaceOnUse">
          <path
            d="M20 0 L40 11.55 L40 23.09 L20 34.64 L0 23.09 L0 11.55 Z"
            stroke="currentColor"
            strokeWidth="0.4"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#hexp)" />
    </svg>
  );
}

/**
 * Vertical hairlines — minimalist rhythm marker.
 */
export function VerticalLines({
  count = 24,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`flex h-full items-stretch gap-3 ${className}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="block w-px bg-current opacity-30"
          style={{ height: `${30 + (i * 7) % 70}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Quatrefoil — four-lobed Moroccan motif.
 */
export function Quatrefoil({
  size = 180,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="0.7" fill="none">
        <path d="M100 30 Q140 30 140 70 Q170 70 170 100 Q170 130 140 130 Q140 170 100 170 Q60 170 60 130 Q30 130 30 100 Q30 70 60 70 Q60 30 100 30 Z" />
        <circle cx="100" cy="100" r="32" strokeDasharray="2 3" />
      </g>
    </svg>
  );
}

/**
 * Animated audio waveform — voice-AI essence.
 * Respects prefers-reduced-motion via globals.
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
            style={{ height: `${h * 100}%`, animationDelay: `${(i % 7) * 0.08}s` }}
          />
        );
      })}
    </div>
  );
}
