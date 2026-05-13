/**
 * Zellige-inspired SVG decoratives.
 * Used as background ornaments to evoke Moroccan geometric art without
 * being kitsch — kept very subtle via low opacity + monochrome strokes.
 */
export function ZelligeStar({
  size = 320,
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
      {/* 8-pointed star (khatam) */}
      <g
        transform="translate(100 100)"
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
        opacity="0.9"
      >
        <polygon points="0,-90 25,-25 90,0 25,25 0,90 -25,25 -90,0 -25,-25" />
        <polygon
          points="0,-90 25,-25 90,0 25,25 0,90 -25,25 -90,0 -25,-25"
          transform="rotate(22.5)"
        />
        <circle r="36" />
        <circle r="60" strokeDasharray="2 4" opacity="0.6" />
        <circle r="84" />
      </g>
    </svg>
  );
}

export function ZelligeBand({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 24"
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.5">
        {Array.from({ length: 25 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 24} 12)`}>
            <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" />
          </g>
        ))}
      </g>
    </svg>
  );
}
