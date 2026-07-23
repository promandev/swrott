"use client";

import { useRef, useEffect } from "react";

/**
 * Animated starfield background — rendered in a <canvas> element.
 * Lightweight (2D canvas, ~200 stars), perfect for menus and cinematics.
 * Stars slowly drift and twinkle.
 */
export function Starfield({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let w = 0;
    let h = 0;

    interface Star {
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      drift: number;
    }

    let stars: Star[] = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
      initStars();
    }

    function initStars() {
      const count = Math.min(250, Math.floor((w * h) / 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.8 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.15,
        twinkleSpeed: Math.random() * 0.003 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.08,
      }));
    }

    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    function draw() {
      if (!running || !ctx) return;
      t++;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const alpha =
          s.baseAlpha *
          (0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 210, 230, ${alpha})`;
        ctx.fill();

        // Very slow drift
        s.x += s.drift;
        if (s.x < -5) s.x = w + 5;
        if (s.x > w + 5) s.x = -5;
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}
