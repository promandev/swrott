"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { audioManager } from "@/game/audio/audio-manager";
import { Starfield } from "@/game/scenes/effects/Starfield";
import { useI18n } from "@/i18n";

/**
 * Opening cinematic for SWROTT.
 *
 * A pseudo-3D camera flight: the view drops out of hyperspace and pushes
 * forward through deep space, planets sweeping past the edges of the frame,
 * until the camera closes on Korriban — where the story begins. The story
 * cards fade in/out over the flight.
 *
 * Audio: the main menu theme starts here and continues seamlessly into the
 * menu (playMusic is a no-op for an already-playing track).
 *
 * The user can skip at any time.
 */

interface CinematicCard {
  primary: string;
  secondary?: string;
  accent?: boolean; // larger, blood-red primary line
  holdMs: number;
  fadeMs: number;
}

const CARD_TIMING: Array<{ accent?: boolean; holdMs: number; fadeMs: number }> = [
  { holdMs: 3200, fadeMs: 900 },
  { holdMs: 3600, fadeMs: 900 },
  { accent: true, holdMs: 3000, fadeMs: 900 },
  { holdMs: 3400, fadeMs: 900 },
  { accent: true, holdMs: 2800, fadeMs: 1100 },
];

// ─── 3D flight configuration ──────────────────────────────────────────

/** CSS perspective distance (px). */
const PERSPECTIVE = 900;
/** Total distance the camera travels (px). */
const FLIGHT_DEPTH = 4600;
/** Duration of the camera flight (s) — roughly the full card sequence. */
const FLIGHT_SECONDS = 21;

type PlanetKind = "ocean" | "gas" | "city" | "ice" | "storm" | "ember";

interface FlybyPlanet {
  id: string;
  kind: PlanetKind;
  /** Disc diameter in px (before perspective scaling). */
  size: number;
  /** Screen-anchored position (%) — offsets from center make it sweep past. */
  x: number;
  y: number;
  /** Depth (negative px — farther is more negative). */
  z: number;
  ring?: boolean;
}

/** The route to Korriban: worlds slide past as the camera pushes in. */
const FLYBY_PLANETS: FlybyPlanet[] = [
  { id: "p_ocean", kind: "ocean", size: 190, x: 17, y: 30, z: -700 },
  { id: "p_gas", kind: "gas", size: 320, x: 79, y: 64, z: -1500, ring: true },
  { id: "p_city", kind: "city", size: 240, x: 24, y: 70, z: -2300 },
  { id: "p_ice", kind: "ice", size: 200, x: 74, y: 24, z: -3000 },
  { id: "p_storm", kind: "storm", size: 290, x: 29, y: 40, z: -3700 },
  // Final destination — dead-center, the camera ends on it.
  { id: "p_korriban", kind: "ember", size: 660, x: 50, y: 46, z: -4300 },
];

/** Per-planet visibility keyframes along the (linear) camera flight. */
function planetOpacityTiming(p: FlybyPlanet): { opacity: number[]; times: number[] } {
  const depth = Math.abs(p.z);
  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  if (p.id === "p_korriban") {
    // Destination never fades out.
    return { opacity: [0, 1, 1], times: [clamp((depth - 2800) / FLIGHT_DEPTH), clamp((depth - 1600) / FLIGHT_DEPTH), 1] };
  }
  const fadeInStart = clamp((depth - 2600) / FLIGHT_DEPTH);
  const fadeInEnd = clamp((depth - 1800) / FLIGHT_DEPTH);
  const fadeOutStart = clamp((depth + 150) / FLIGHT_DEPTH);
  const fadeOutEnd = clamp((depth + 620) / FLIGHT_DEPTH);
  return { opacity: [0, 1, 1, 0], times: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] };
}

interface IntroCinematicProps {
  onComplete: () => void;
}

export function IntroCinematic({ onComplete }: IntroCinematicProps) {
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [phase, setPhase] = useState<"hold" | "fadeout">("hold");
  const [done, setDone] = useState(false);
  const t = useI18n((s) => s.t);

  const CARDS: CinematicCard[] = t.cinematic.cards.map((c, i) => ({
    ...CARD_TIMING[i],
    ...c,
    holdMs: CARD_TIMING[i]?.holdMs ?? 3000,
    fadeMs: CARD_TIMING[i]?.fadeMs ?? 900,
  }));

  // Start the main theme immediately — it carries straight into the menu.
  useEffect(() => {
    audioManager.resume();
    void audioManager.playMusic("theme_main", 2000);
  }, []);

  // Advance cards
  useEffect(() => {
    if (done) return;
    const card = CARDS[cardIndex];
    if (!card) return;

    const holdTimer = setTimeout(() => {
      setPhase("fadeout");
    }, card.holdMs);

    return () => clearTimeout(holdTimer);
  }, [cardIndex, done]);

  function advance() {
    if (done) return;
    const nextIndex = cardIndex + 1;
    if (nextIndex >= CARDS.length) {
      setDone(true);
      setTimeout(() => onComplete(), 1100);
    } else {
      setCardIndex(nextIndex);
      setPhase("hold");
    }
  }

  function skip() {
    setDone(true);
    setTimeout(() => onComplete(), 500);
  }

  const card = CARDS[cardIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
      onClick={() => {
        if (phase === "hold") advance();
      }}
    >
      {/* Deep space backdrop */}
      <Starfield />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: `
            radial-gradient(ellipse 60% 45% at 24% 30%, rgba(120,40,60,0.16) 0%, transparent 70%),
            radial-gradient(ellipse 55% 40% at 74% 64%, rgba(60,60,140,0.14) 0%, transparent 70%),
            radial-gradient(ellipse 40% 35% at 56% 18%, rgba(140,100,50,0.08) 0%, transparent 70%)
          `,
        }}
      />

      {/* Hyperspace drop — radial streaks that stretch away in the first moments */}
      <HyperspaceDrop />

      {/* 3D camera flight */}
      <div
        className="absolute inset-0"
        style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 48%" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          initial={{ transform: "translateZ(0px)" }}
          animate={{ transform: `translateZ(${FLIGHT_DEPTH}px)` }}
          transition={{ duration: FLIGHT_SECONDS, ease: "linear" }}
        >
          {FLYBY_PLANETS.map((p) => {
            const timing = planetOpacityTiming(p);
            return (
              <motion.div
                key={p.id}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  marginLeft: -p.size / 2,
                  marginTop: -p.size / 2,
                  transform: `translateZ(${p.z}px)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: timing.opacity }}
                transition={{ duration: FLIGHT_SECONDS, times: timing.times, ease: "linear" }}
              >
                <Planet kind={p.kind} size={p.size} ring={p.ring} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Subtle scanlines overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0.5)_1px,transparent_1px,transparent_2px)] [background-size:100%_4px]" />

      {/* Vignettes */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Card area */}
      <AnimatePresence mode="wait">
        {!done && card && (
          <motion.div
            key={cardIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "hold" ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: (card.fadeMs / 1000), ease: "easeInOut" }}
            onAnimationComplete={() => {
              if (phase === "fadeout") advance();
            }}
            className="relative z-10 flex flex-col items-center gap-6 px-8 text-center max-w-3xl"
          >
            {/* Decorative line above */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-gilt-700/60 to-transparent"
            />

            {/* Primary text */}
            <AnimatedWords
              text={card.primary}
              accent={card.accent ?? false}
              delay={0.4}
            />

            {/* Secondary text */}
            {card.secondary && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.9, ease: "easeOut" }}
                className="font-body text-base sm:text-lg text-ash-300 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              >
                {card.secondary}
              </motion.p>
            )}

            {/* Decorative line below */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="w-24 h-px bg-gradient-to-r from-transparent via-gilt-700/60 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrival flash — the camera "lands" as the cinematic ends */}
      <AnimatePresence>
        {done && (
          <motion.div
            key="arrival"
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, times: [0, 0.35, 1], ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle at 50% 46%, rgba(255,235,210,0.95) 0%, rgba(196,30,58,0.55) 35%, rgba(0,0,0,0.9) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Progress dots */}
      {!done && (
        <div className="absolute bottom-16 flex gap-2 z-10">
          {CARDS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                i === cardIndex
                  ? "bg-gilt-500 scale-125"
                  : i < cardIndex
                  ? "bg-gilt-700/60"
                  : "bg-ash-500/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Skip button */}
      {!done && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
          className="absolute bottom-10 right-8 z-10 text-[11px] uppercase tracking-[0.25em] text-ash-500 hover:text-ash-200 transition"
        >
          {t.cinematic.skip}
        </button>
      )}

      {/* Click hint */}
      {!done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-8 z-10 text-[10px] uppercase tracking-[0.2em] text-ash-600"
        >
          {t.cinematic.clickToAdvance}
        </motion.p>
      )}
    </div>
  );
}

// ─── Hyperspace drop effect ─────────────────────────────────────────────

function HyperspaceDrop() {
  const streaks = useMemo(() => {
    const out: Array<{ angle: number; len: number; width: number; dist: number; alpha: number }> = [];
    let seed = 31;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 46; i++) {
      out.push({
        angle: rnd() * 360,
        len: 16 + rnd() * 30,
        width: 1 + rnd() * 1.6,
        dist: 6 + rnd() * 42,
        alpha: 0.25 + rnd() * 0.6,
      });
    }
    return out;
  }, []);

  return (
    <div className="hyperspace-out pointer-events-none absolute inset-0">
      {streaks.map((s, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            width: `${s.len}vmin`,
            height: s.width,
            transformOrigin: "0 50%",
            transform: `rotate(${s.angle}deg) translateX(${s.dist}vmin)`,
            background: `linear-gradient(90deg, transparent, rgba(200,215,255,${s.alpha}))`,
            filter: "blur(0.4px)",
          }}
        />
      ))}
      {/* Center bloom that collapses */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "30vmin",
          height: "30vmin",
          background: "radial-gradient(circle, rgba(220,230,255,0.5) 0%, rgba(140,160,255,0.18) 40%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}

// ─── Planet rendering ───────────────────────────────────────────────────

interface PlanetPalette {
  base: string;
  mid: string;
  dark: string;
  glow: string;
  /** Surface texture (background-image for the drifting layer). */
  texture: string;
  /** Texture drift duration (s). */
  driftSeconds: number;
}

const PLANET_PALETTES: Record<PlanetKind, PlanetPalette> = {
  ocean: {
    base: "#7fb8d8", mid: "#3a7298", dark: "#102a40",
    glow: "rgba(120,190,235,0.45)",
    texture: `
      radial-gradient(22% 14% at 24% 38%, rgba(110,160,90,0.85) 0%, transparent 70%),
      radial-gradient(16% 10% at 58% 56%, rgba(120,170,100,0.7) 0%, transparent 70%),
      radial-gradient(26% 9% at 80% 30%, rgba(255,255,255,0.55) 0%, transparent 70%),
      radial-gradient(30% 8% at 38% 70%, rgba(255,255,255,0.4) 0%, transparent 70%),
      radial-gradient(20% 6% at 10% 55%, rgba(255,255,255,0.45) 0%, transparent 70%)`,
    driftSeconds: 60,
  },
  gas: {
    base: "#e0b07a", mid: "#9c6a3a", dark: "#3a2010",
    glow: "rgba(235,180,110,0.4)",
    texture: `
      repeating-linear-gradient(176deg,
        rgba(255,225,180,0.5) 0%, rgba(140,85,40,0.55) 6%,
        rgba(235,190,140,0.45) 11%, rgba(110,60,30,0.5) 17%,
        rgba(250,215,170,0.4) 23%, rgba(150,95,50,0.5) 30%),
      radial-gradient(18% 10% at 64% 58%, rgba(170,60,30,0.8) 0%, transparent 70%)`,
    driftSeconds: 90,
  },
  city: {
    base: "#b89868", mid: "#5e4a30", dark: "#171008",
    glow: "rgba(255,200,110,0.45)",
    texture: `
      radial-gradient(2.2% 2.2% at 62% 44%, rgba(255,210,120,0.9) 0%, transparent 60%),
      radial-gradient(1.8% 1.8% at 70% 56%, rgba(255,190,100,0.9) 0%, transparent 60%),
      radial-gradient(2.4% 2.4% at 78% 48%, rgba(255,215,130,0.85) 0%, transparent 60%),
      radial-gradient(1.6% 1.6% at 66% 64%, rgba(255,200,110,0.8) 0%, transparent 60%),
      radial-gradient(2% 2% at 84% 60%, rgba(255,190,90,0.8) 0%, transparent 60%),
      radial-gradient(1.5% 1.5% at 74% 38%, rgba(255,225,150,0.85) 0%, transparent 60%),
      radial-gradient(30% 12% at 30% 40%, rgba(120,95,60,0.6) 0%, transparent 70%)`,
    driftSeconds: 70,
  },
  ice: {
    base: "#ddedf8", mid: "#8fb4cc", dark: "#2c4a60",
    glow: "rgba(190,225,250,0.45)",
    texture: `
      radial-gradient(30% 10% at 40% 30%, rgba(255,255,255,0.75) 0%, transparent 70%),
      radial-gradient(24% 8% at 70% 60%, rgba(255,255,255,0.6) 0%, transparent 70%),
      radial-gradient(20% 12% at 20% 65%, rgba(160,200,225,0.7) 0%, transparent 70%)`,
    driftSeconds: 80,
  },
  storm: {
    base: "#5a6a9c", mid: "#2c3458", dark: "#0c0f22",
    glow: "rgba(160,170,255,0.5)",
    texture: `
      radial-gradient(26% 12% at 34% 36%, rgba(200,210,255,0.5) 0%, transparent 70%),
      radial-gradient(30% 10% at 66% 58%, rgba(170,180,240,0.45) 0%, transparent 70%),
      radial-gradient(18% 14% at 50% 74%, rgba(120,130,200,0.5) 0%, transparent 70%),
      radial-gradient(3% 3% at 42% 52%, rgba(230,220,255,0.95) 0%, transparent 60%)`,
    driftSeconds: 55,
  },
  ember: {
    base: "#e8915a", mid: "#8c3e1c", dark: "#2a0d05",
    glow: "rgba(255,130,70,0.55)",
    texture: `
      radial-gradient(26% 10% at 32% 40%, rgba(255,170,110,0.6) 0%, transparent 70%),
      radial-gradient(20% 12% at 64% 30%, rgba(120,40,18,0.75) 0%, transparent 70%),
      radial-gradient(30% 9% at 56% 64%, rgba(255,140,80,0.5) 0%, transparent 70%),
      radial-gradient(16% 7% at 22% 68%, rgba(90,28,12,0.8) 0%, transparent 70%),
      radial-gradient(2.5% 1.6% at 47% 55%, rgba(255,90,40,0.9) 0%, transparent 60%),
      radial-gradient(3% 1.4% at 38% 48%, rgba(255,110,50,0.8) 0%, transparent 60%)`,
    driftSeconds: 75,
  },
};

/**
 * A "realistic" CSS planet: lit sphere with drifting surface texture,
 * hard terminator shadow, specular highlight, atmospheric rim and glow.
 */
function Planet({ kind, size, ring = false }: { kind: PlanetKind; size: number; ring?: boolean }) {
  const pal = PLANET_PALETTES[kind];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Back half of the ring (behind the planet) */}
      {ring && <PlanetRing size={size} back />}

      {/* Atmospheric halo */}
      <div
        className="absolute rounded-full"
        style={{
          inset: `-${size * 0.05}px`,
          boxShadow: `0 0 ${size * 0.22}px ${size * 0.02}px ${pal.glow}`,
        }}
      />

      {/* Sphere */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          background: `radial-gradient(circle at 33% 30%, ${pal.base} 0%, ${pal.mid} 48%, ${pal.dark} 100%)`,
        }}
      >
        {/* Drifting surface texture (3x width, loops seamlessly) */}
        <div
          className="planet-drift absolute inset-y-0"
          style={{
            left: 0,
            width: "300%",
            backgroundImage: pal.texture,
            backgroundSize: "33.333% 100%",
            backgroundRepeat: "repeat-x",
            opacity: 0.85,
            animationDuration: `${pal.driftSeconds}s`,
          }}
        />
        {/* Storm world: lightning pulses on the night side */}
        {kind === "storm" && (
          <div
            className="storm-flash absolute rounded-full"
            style={{
              width: "26%",
              height: "20%",
              left: "58%",
              top: "56%",
              background: "radial-gradient(circle, rgba(210,200,255,0.9) 0%, transparent 70%)",
              filter: "blur(2px)",
              animationDuration: "5.5s",
            }}
          />
        )}
        {/* Terminator shadow (night side) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 72% 70%, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 38%, transparent 62%)",
          }}
        />
        {/* Specular highlight */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 18%, transparent 34%)",
          }}
        />
        {/* Atmospheric rim light on the lit limb */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: `inset ${size * 0.02}px ${size * 0.015}px ${size * 0.07}px ${pal.glow}, inset -${size * 0.04}px -${size * 0.03}px ${size * 0.12}px rgba(0,0,0,0.85)`,
          }}
        />
      </div>

      {/* Front half of the ring (over the planet) */}
      {ring && <PlanetRing size={size} />}
    </div>
  );
}

/** Fake-3D planetary ring: a flattened ellipse split into back/front halves. */
function PlanetRing({ size, back = false }: { size: number; back?: boolean }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size * 2.05,
        height: size * 0.62,
        left: -size * 0.525,
        top: size * 0.19,
        transform: "rotate(-14deg)",
        clipPath: back ? "inset(0 0 50% 0)" : "inset(50% 0 0 0)",
        zIndex: back ? 0 : 2,
      }}
    >
      <div
        className="absolute inset-0 rounded-[50%]"
        style={{
          border: `${Math.max(2, size * 0.035)}px solid rgba(220,190,150,0.4)`,
          boxShadow: "0 0 12px rgba(220,190,150,0.18)",
        }}
      />
      <div
        className="absolute rounded-[50%]"
        style={{
          inset: size * 0.05,
          border: `${Math.max(1, size * 0.018)}px solid rgba(190,160,120,0.3)`,
        }}
      />
    </div>
  );
}

/** Renders a string word-by-word with stagger animation. */
function AnimatedWords({
  text,
  accent,
  delay,
}: {
  text: string;
  accent: boolean;
  delay: number;
}) {
  const words = text.split(" ");
  const perWord = 0.09;

  return (
    <p
      className={
        accent
          ? "font-display text-3xl sm:text-5xl md:text-6xl uppercase tracking-[0.18em] text-blood-500 drop-shadow-[0_0_32px_rgba(196,30,58,0.6)]"
          : "font-display text-xl sm:text-3xl md:text-4xl tracking-[0.08em] text-ash-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
      }
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * perWord,
            duration: 0.55,
            ease: "easeOut",
          }}
          className="inline-block mr-[0.35em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
