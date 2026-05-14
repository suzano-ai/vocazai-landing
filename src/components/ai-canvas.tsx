"use client";

/**
 * AICanvas — interactive particle neural network.
 * Particles float, connect when close, pulse randomly.
 * Mouse repels nearby particles. Fully GPU-composited.
 */

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  alpha: number;
  pulse: number;  // frame counter; pulses when < 50
  pulseOffset: number;
}

const MAX_DIST    = 155;
const MAX_DIST_SQ = MAX_DIST * MAX_DIST;
const MOUSE_R     = 130;
const MOUSE_R_SQ  = MOUSE_R * MOUSE_R;
const MAX_SPEED   = 0.75;

// Saffron: hsl(36 82% 54%) ≈ rgb(228,161,44)
const CR = 228, CG = 161, CB = 44;

export function AICanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const mouseRef  = useRef<{ x: number; y: number } | null>(null);
  const partsRef  = useRef<Particle[]>([]);
  const dimsRef   = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // ── Setup / resize ──────────────────────────────────────────────────────────
  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr  = Math.min(window.devicePixelRatio || 1, 2);
    const w = rect.width, h = rect.height;

    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    dimsRef.current = { w, h };

    // Particle density: ~1 per 11 000 px²
    const N = Math.max(30, Math.min(80, Math.floor((w * h) / 11000)));

    partsRef.current = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: 1.4 + Math.random() * 1.8,
      alpha: 0.14 + Math.random() * 0.20,
      pulse: Math.floor(Math.random() * 500),
      pulseOffset: Math.random() * 400,
    }));
  }, []);

  // ── Animation loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    setup();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Advance particle positions one frame.
    const step = () => {
      const { w, h } = dimsRef.current;
      const parts = partsRef.current;
      const mouse = mouseRef.current;

      for (const p of parts) {
        if (mouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_R_SQ && d2 > 0) {
            const d   = Math.sqrt(d2);
            const mag = ((MOUSE_R - d) / MOUSE_R) * 0.014;
            p.vx += (dx / d) * mag;
            p.vy += (dy / d) * mag;
          }
        }

        // Speed clamp
        const spd2 = p.vx * p.vx + p.vy * p.vy;
        if (spd2 > MAX_SPEED * MAX_SPEED) {
          const inv = MAX_SPEED / Math.sqrt(spd2);
          p.vx *= inv; p.vy *= inv;
        }

        // Soft friction
        p.vx *= 0.997;
        p.vy *= 0.997;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges with 30px padding
        if (p.x < -30)     p.x = w + 30;
        if (p.x > w + 30)  p.x = -30;
        if (p.y < -30)     p.y = h + 30;
        if (p.y > h + 30)  p.y = -30;

        // Pulse cycle
        p.pulse = (p.pulse + 1) % 500;
      }
    };

    // Draw edges + nodes for the current positions.
    const render = () => {
      const { w, h } = dimsRef.current;
      const parts = partsRef.current;

      ctx.clearRect(0, 0, w, h);

      // ── Edges ────────────────────────────────────────────────────────────
      ctx.lineWidth = 0.55;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b  = parts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST_SQ) {
            const t = 1 - Math.sqrt(d2) / MAX_DIST;   // 0..1, closer = stronger
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${CR},${CG},${CB},${(t * t * 0.20).toFixed(3)})`;
            ctx.stroke();
          }
        }
      }

      // ── Nodes ────────────────────────────────────────────────────────────
      for (const p of parts) {
        // Pulse envelope: smooth sine over 50 frames
        const phase = p.pulse < 50
          ? Math.sin((p.pulse / 50) * Math.PI)
          : 0;

        const r  = p.r + phase * 3.2;
        const al = p.alpha + phase * 0.32;

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CR},${CG},${CB},${al.toFixed(3)})`;
        ctx.fill();

        // Outer halo on pulse
        if (phase > 0.05) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${CR},${CG},${CB},${(phase * 0.10).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.lineWidth = 0.55; // restore
        }
      }
    };

    // Respect reduced-motion: paint a single static frame, no rAF, no mouse tracking.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      render();
      const onResizeStatic = () => { setup(); render(); };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    const tick = () => {
      step();
      render();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // ── Events ────────────────────────────────────────────────────────────────
    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      setup();
      rafRef.current = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = null; };

    // Track mouse on the section (parent of canvas)
    const section = canvas.parentElement;
    if (section) {
      section.addEventListener("mousemove",  onMouseMove  as EventListener);
      section.addEventListener("mouseleave", onMouseLeave);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      if (section) {
        section.removeEventListener("mousemove",  onMouseMove  as EventListener);
        section.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [setup]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
