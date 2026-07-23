"use client";

import { useEffect, useRef } from "react";

/**
 * AtmosphereCanvas — a lightweight Canvas 2D effects layer that adds
 * volumetric depth to the exploration scene that the CSS particle/fog
 * layers can't: additive "dust in light" motes drifting through the frame,
 * a slow breathing bloom tinted by the active zone palette, and gentle
 * cursor parallax so the foreground feels three-dimensional.
 *
 * Kept deliberately cheap (a few dozen sprites, additive blending) in the
 * spirit of {@link ./Starfield}. Honors the reduced-motion preference by
 * painting a single static frame and then idling.
 */

/** Parse an `rgb()/rgba()/#hex` string down to an `[r,g,b]` triple. */
function parseRGB(color: string): [number, number, number] {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r, g, b] = m[1]!.split(",").map((n) => parseFloat(n));
    return [r ?? 200, g ?? 170, b ?? 110];
  }
  const hex = color.replace("#", "");
  if (hex.length >= 6) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  return [200, 170, 110];
}

interface Mote {
  x: number;
  y: number;
  r: number;
  depth: number; // 0 = far (slow, dim), 1 = near (fast, bright, parallax)
  vx: number;
  vy: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export function AtmosphereCanvas({
  accent = "rgba(201,169,97,0.45)",
  reducedMotion = false,
  className = "",
  density = 1,
}: {
  /** Zone palette accent (rgb/rgba/hex). Drives mote + bloom tint. */
  accent?: string;
  reducedMotion?: boolean;
  className?: string;
  /** Scales the mote count (1 = default). */
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef(accent);
  const motionRef = useRef(reducedMotion);
  const pointer = useRef({ x: 0, y: 0 });

  // Keep the latest props readable from inside the rAF loop without
  // re-subscribing the whole canvas on every palette change.
  accentRef.current = accent;
  motionRef.current = reducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let motes: Mote[] = [];

    function initMotes() {
      const count = Math.min(70, Math.floor((w * h) / 26000) * density);
      motes = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: (0.6 + depth * 2.6) * (0.8 + Math.random() * 0.6),
          depth,
          vx: (Math.random() - 0.5) * (0.08 + depth * 0.18),
          vy: -(0.04 + depth * 0.16) * (0.6 + Math.random()),
          baseAlpha: 0.06 + depth * 0.22,
          twinkleSpeed: 0.004 + Math.random() * 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        };
      });
    }

    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initMotes();
    }

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let t = 0;
    function frame() {
      if (!running || !ctx) return;
      const [r, g, b] = parseRGB(accentRef.current);
      const still = motionRef.current;
      t += still ? 0 : 1;

      ctx.clearRect(0, 0, w, h);

      // Slow breathing bloom near the horizon, tinted by the palette accent.
      const pulse = still ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.006);
      const bloom = ctx.createRadialGradient(
        w * 0.5, h * 0.58, 0,
        w * 0.5, h * 0.58, Math.max(w, h) * 0.6,
      );
      bloom.addColorStop(0, `rgba(${r},${g},${b},${0.05 + pulse * 0.05})`);
      bloom.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // Additive depth motes.
      ctx.globalCompositeOperation = "lighter";
      const px = pointer.current.x;
      const py = pointer.current.y;
      for (const m of motes) {
        const twinkle = still
          ? 1
          : 0.55 + 0.45 * Math.sin(t * m.twinkleSpeed + m.twinkleOffset);
        const alpha = m.baseAlpha * twinkle;
        // Parallax: nearer motes shift more against the cursor.
        const ox = px * m.depth * 22;
        const oy = py * m.depth * 14;
        const x = m.x + ox;
        const y = m.y + oy;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, m.r * 3);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, m.r * 3, 0, Math.PI * 2);
        ctx.fill();

        if (!still) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.y < -10) {
            m.y = h + 10;
            m.x = Math.random() * w;
          }
          if (m.x < -10) m.x = w + 10;
          if (m.x > w + 10) m.x = -10;
        }
      }
      ctx.globalCompositeOperation = "source-over";

      if (still) return; // one static frame, then idle
      requestAnimationFrame(frame);
    }

    frame();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}
