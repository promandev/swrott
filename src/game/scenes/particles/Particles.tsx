"use client";

import { useEffect, useRef } from "react";

/**
 * High-performance CSS-only particle system.
 * Renders floating embers, dust motes, or force sparks using
 * lightweight <span> elements with CSS animations.
 *
 * Each particle has randomized:
 *  - horizontal position, drift direction
 *  - size, opacity, animation duration
 *  - color (from the preset palette)
 */

export type ParticlePreset = "embers" | "dust" | "force" | "snow" | "ash" | "rain";

interface ParticleConfig {
  count: number;
  colors: string[];
  sizeRange: [number, number];
  durationRange: [number, number];
  opacityRange: [number, number];
  drift: number; // max horizontal sway in px
  glow: boolean;
  direction: "up" | "down";
  /** Render as a thin falling streak (rain) instead of a round mote. */
  streak?: boolean;
}

const PRESETS: Record<ParticlePreset, ParticleConfig> = {
  embers: {
    count: 35,
    colors: ["#ff4422", "#ff6633", "#cc2200", "#ff8844", "#ffaa33"],
    sizeRange: [2, 5],
    durationRange: [3, 8],
    opacityRange: [0.3, 0.9],
    drift: 60,
    glow: true,
    direction: "up",
  },
  dust: {
    count: 25,
    colors: ["#c9a961", "#a08040", "#d4b88a", "#8a6e3e"],
    sizeRange: [1.5, 4],
    durationRange: [6, 14],
    opacityRange: [0.15, 0.45],
    drift: 80,
    glow: false,
    direction: "down",
  },
  force: {
    count: 20,
    colors: ["#7c3aed", "#a855f7", "#5a1a8a", "#c084fc"],
    sizeRange: [2, 6],
    durationRange: [2, 6],
    opacityRange: [0.25, 0.7],
    drift: 40,
    glow: true,
    direction: "up",
  },
  snow: {
    count: 40,
    colors: ["#e4e4e7", "#d4d4d8", "#a1a1aa"],
    sizeRange: [2, 5],
    durationRange: [8, 16],
    opacityRange: [0.2, 0.6],
    drift: 100,
    glow: false,
    direction: "down",
  },
  ash: {
    count: 30,
    colors: ["#3a3a42", "#52525b", "#71717a", "#5a1410"],
    sizeRange: [2, 6],
    durationRange: [5, 12],
    opacityRange: [0.15, 0.5],
    drift: 70,
    glow: false,
    direction: "down",
  },
  rain: {
    count: 70,
    colors: ["#9fb4d8", "#7e94bc", "#b8c8e4"],
    sizeRange: [2, 4],
    durationRange: [0.7, 1.6],
    opacityRange: [0.2, 0.5],
    drift: 30,
    glow: false,
    direction: "down",
    streak: true,
  },
};

interface ParticlesProps {
  preset: ParticlePreset;
  className?: string;
  /** Override count. */
  count?: number;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function Particles({ preset, className = "", count }: ParticlesProps) {
  const cfg = PRESETS[preset];
  const n = count ?? cfg.count;

  // Generate particles once on mount
  const particles = useRef(
    Array.from({ length: n }, (_, i) => {
      const size = rand(cfg.sizeRange[0], cfg.sizeRange[1]);
      const duration = rand(cfg.durationRange[0], cfg.durationRange[1]);
      const delay = rand(0, duration);
      const opacity = rand(cfg.opacityRange[0], cfg.opacityRange[1]);
      const x = rand(0, 100);
      const driftX = rand(-cfg.drift, cfg.drift);
      const color = pick(cfg.colors);
      return { i, size, duration, delay, opacity, x, driftX, color };
    }),
  ).current;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.i}
          className={cfg.direction === "up" ? "particle-up" : "particle-down"}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            bottom: cfg.direction === "up" ? "-5%" : undefined,
            top: cfg.direction === "down" ? "-5%" : undefined,
            width: cfg.streak ? 1.5 : p.size,
            height: cfg.streak ? p.size * 7 : p.size,
            borderRadius: cfg.streak ? 1 : "50%",
            backgroundColor: cfg.streak ? undefined : p.color,
            backgroundImage: cfg.streak
              ? `linear-gradient(to bottom, transparent, ${p.color})`
              : undefined,
            opacity: p.opacity,
            boxShadow: cfg.glow
              ? `0 0 ${p.size * 3}px ${p.color}`
              : "none",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ["--drift" as string]: `${p.driftX}px`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Ambient light rays — purely CSS gradient overlays that animate slowly.
 * Creates volumetric "god ray" effect like light streaming through a crack.
 */
export function LightRays({
  color = "rgba(201, 169, 97, 0.06)",
  angle = -25,
  count = 3,
}: {
  color?: string;
  angle?: number;
  count?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const offset = 20 + (i / count) * 60;
        const width = rand(8, 20);
        const opacity = rand(0.4, 1);
        const dur = rand(8, 16);
        return (
          <div
            key={i}
            className="absolute inset-0 animate-pulse"
            style={{
              background: `linear-gradient(${angle}deg, transparent ${offset - width / 2}%, ${color} ${offset}%, transparent ${offset + width / 2}%)`,
              opacity,
              animationDuration: `${dur}s`,
            }}
          />
        );
      })}
    </div>
  );
}

/**
 * Storm lightning — a periodic sky flash for storm worlds (Dromund Kaas,
 * Malachor). Pure CSS-driven pulse: a broad sheet flash high in the sky.
 */
export function StormFlash({
  color = "rgba(190,175,255,0.55)",
  intervalSeconds = 8,
}: {
  color?: string;
  intervalSeconds?: number;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 storm-flash"
        style={{
          background: `radial-gradient(ellipse 85% 55% at ${20 + Math.random() * 60}% 8%, ${color} 0%, transparent 60%)`,
          animationDuration: `${intervalSeconds}s`,
        }}
      />
    </div>
  );
}

/**
 * Atmospheric fog layers — animated gradient overlays.
 *
 * By default the fog is masked to the horizon band (~40-75% height) so it
 * reads as atmospheric depth at distance instead of a flat wash over the
 * whole frame. Use band="full" for enclosed interiors where wall-to-wall
 * haze is intentional.
 */
const FOG_BAND_MASKS: Record<string, string> = {
  horizon:
    "linear-gradient(to bottom, transparent 0%, transparent 34%, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.9) 64%, rgba(0,0,0,0.25) 78%, transparent 92%)",
  ground:
    "linear-gradient(to bottom, transparent 0%, transparent 58%, rgba(0,0,0,0.8) 78%, black 100%)",
  full: "none",
};

export function FogLayer({
  color = "rgba(26, 6, 8, 0.5)",
  speed = 40,
  direction = "left",
  band = "horizon",
}: {
  color?: string;
  speed?: number;
  direction?: "left" | "right";
  band?: "horizon" | "ground" | "full";
}) {
  const mask = FOG_BAND_MASKS[band] ?? FOG_BAND_MASKS["horizon"]!;
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={
        mask !== "none"
          ? { maskImage: mask, WebkitMaskImage: mask }
          : undefined
      }
    >
      <div
        className="absolute w-[200%] h-full fog-drift"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 25%, transparent 50%, ${color} 75%, transparent 100%)`,
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      />
    </div>
  );
}
