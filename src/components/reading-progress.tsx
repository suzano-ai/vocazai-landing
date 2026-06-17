"use client";

import { useEffect, useState } from "react";

/**
 * Sticky reading-progress bar. Mounted on long-form pages (blog posts) so
 * readers see a visible indicator of how much remains — encourages
 * completion and gives a low-cost re-engagement signal on long verticals.
 *
 * Tracks scroll progress through the first element matching `target`
 * (defaults to "article" — the wrapper used on blog [slug]). Uses
 * requestAnimationFrame throttling so the scroll handler stays cheap.
 *
 * No transition is applied to the inner bar — width updates land on the
 * same frame as the scroll event, so the bar tracks the cursor 1:1 with
 * no animation that would conflict with prefers-reduced-motion.
 */
export function ReadingProgress({ target = "article" }: { target?: string }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = document.querySelector(target);
    if (!(el instanceof HTMLElement)) return;

    let ticking = false;
    const compute = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const ratio = total > 0 ? Math.min(1, scrolled / total) : 0;
      setPct(Math.round(ratio * 1000) / 10);
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(compute);
        ticking = true;
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
    >
      <div className="h-full bg-saffron-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
