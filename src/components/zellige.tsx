/**
 * Geometric primitives — Moroccan-rooted, refined.
 * Three families:
 *   1. Heritage shapes  — Khatam, Arch, Quatrefoil
 *   2. Grid/Line accents — HexLattice, VerticalLines
 *   3. Voice-AI          — Waveform, NeuralNetwork, GlowOrb
 */

export function Khatam({
  size = 240,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} style={style} aria-hidden>
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

/**
 * Neural network — animated AI topology.
 * Nodes pulse, edges flow with traveling dashes.
 * Designed to evoke voice routing and AI inference.
 */
export function NeuralNetwork({
  className = "",
}: {
  className?: string;
}) {
  // Nodes: [x, y] in 800×500 viewBox
  const nodes: [number, number][] = [
    [400, 250], // central hub
    [160,  80], [400,  55], [640,  80],
    [ 60, 210], [200, 175], [600, 175], [740, 210],
    [ 80, 350], [220, 400], [400, 430], [580, 400], [720, 350],
    [300, 140], [500, 140], [300, 340], [500, 340],
    [150, 270], [650, 270],
  ];

  // Edges: pairs of node indices
  const edges: [number, number][] = [
    [0, 5], [0, 6], [0, 15], [0, 16],
    [1, 4], [1, 5], [1, 13],
    [2, 13], [2, 14],
    [3, 6], [3, 7], [3, 14],
    [4, 8], [4, 17],
    [5, 9], [5, 13], [5, 17],
    [6, 11], [6, 14], [6, 18],
    [7, 12], [7, 18],
    [8, 9], [9, 10], [10, 11], [11, 12],
    [13, 15], [14, 16], [15, 16],
    [15, 9], [16, 11],
  ];

  return (
    <svg
      viewBox="0 0 800 500"
      width="100%"
      height="100%"
      className={className}
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <defs>
        <style>{`
          @keyframes nn-flow {
            from { stroke-dashoffset: 60; }
            to   { stroke-dashoffset: 0; }
          }
          @keyframes nn-pulse {
            0%, 100% { opacity: 0.25; transform-box: fill-box; transform-origin: center; transform: scale(1); }
            50%       { opacity: 0.7;  transform: scale(1.6); }
          }
          @keyframes nn-hub {
            0%, 100% { opacity: 0.5; transform-box: fill-box; transform-origin: center; transform: scale(1); }
            50%       { opacity: 1;   transform: scale(1.35); }
          }
          @media (prefers-reduced-motion: reduce) {
            .nn-e, .nn-n, .nn-h { animation: none !important; }
          }
        `}</style>
      </defs>

      {/* Edges */}
      {edges.map(([a, b], k) => {
        const [x1, y1] = nodes[a];
        const [x2, y2] = nodes[b];
        const len = Math.hypot(x2 - x1, y2 - y1);
        return (
          <line
            key={k}
            className="nn-e"
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="8 5"
            style={{
              animation: `nn-flow ${2.5 + (k % 5) * 0.6}s linear infinite`,
              animationDelay: `${(k % 9) * 0.28}s`,
              opacity: Math.max(0.08, 0.35 - len / 1600),
            }}
          />
        );
      })}

      {/* Outer nodes */}
      {nodes.slice(1).map(([cx, cy], i) => (
        <circle
          key={i}
          className="nn-n"
          cx={cx} cy={cy} r="3.5"
          fill="currentColor"
          style={{
            animation: `nn-pulse ${1.8 + (i % 6) * 0.35}s ease-in-out infinite`,
            animationDelay: `${(i % 10) * 0.18}s`,
          }}
        />
      ))}

      {/* Central hub — larger, prominent */}
      <circle
        className="nn-h"
        cx={nodes[0][0]} cy={nodes[0][1]} r="7"
        fill="currentColor"
        style={{ animation: "nn-hub 2.2s ease-in-out infinite" }}
      />
      <circle
        cx={nodes[0][0]} cy={nodes[0][1]} r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="3 4"
        opacity="0.2"
      />
    </svg>
  );
}

/**
 * Ambient glow orb — soft radial gradient blob.
 * Use behind content for depth.
 */
export function GlowOrb({
  size = 500,
  color = "saffron",
  className = "",
}: {
  size?: number;
  color?: "saffron" | "teal";
  className?: string;
}) {
  const gradient =
    color === "teal"
      ? "radial-gradient(circle, hsl(181 79% 26% / 0.14) 0%, transparent 70%)"
      : "radial-gradient(circle, hsl(36 82% 54% / 0.12) 0%, transparent 70%)";

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: gradient,
        filter: `blur(${Math.round(size * 0.08)}px)`,
      }}
      aria-hidden
    />
  );
}
