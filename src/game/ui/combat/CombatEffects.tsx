"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import type { DamageEvent, AttackKind } from "@/game/engine/combat/combat-store";
import type { AttackRoll } from "@/game/engine/combat/damage";

/**
 * Combat visual effects — impact overlays, self-cast auras, floating damage
 * numbers, and enemy death bursts. Extracted from CombatUI and beefed up:
 * every hit now layers a shockwave + sparks with gravity over the old arcs,
 * lightning gets a flicker halo, force hits ripple, and crits punch.
 *
 * All components are render-once fire-and-forget — the parent unmounts them
 * by clearing the originating event, so none of them manage timers.
 */

/** Deterministic 0..1 from a string — keeps per-event randomness stable across re-renders. */
function hash01(s: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

// ─── Impact effects (played on the TARGET) ───────────────────────────

export function ImpactEffect({ kind }: { kind: AttackKind }) {
  if (kind === "lightning") return <LightningImpact />;
  if (kind === "force") return <ForceImpact />;
  if (kind === "ranged") return <RangedImpact />;
  return <MeleeImpact />;
}

function LightningImpact() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 55 }}>
      {/* Flickering electric halo around the whole target */}
      <motion.div
        className="absolute inset-x-1 inset-y-2 rounded-full blur-lg"
        style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(176,140,255,0.55) 0%, transparent 70%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.2, 1, 0.3, 0.7, 0] }}
        transition={{ duration: 0.7, times: [0, 0.08, 0.2, 0.4, 0.55, 0.75, 1] }}
      />
      <motion.svg
        viewBox="0 0 80 120"
        className="absolute inset-0 m-auto"
        style={{ width: "100%", height: "100%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.3, 1, 0.5, 0] }}
        transition={{ duration: 0.7, times: [0, 0.1, 0.3, 0.5, 0.7, 1] }}
      >
        <polyline
          points="42,0 30,28 48,38 28,66 46,78 32,110"
          fill="none" stroke="#b08cff" strokeWidth="5" strokeLinejoin="round" opacity="0.5"
        />
        <polyline
          points="42,0 30,28 48,38 28,66 46,78 32,110"
          fill="none" stroke="#e6d8ff" strokeWidth="2" strokeLinejoin="round"
        />
        <polyline
          points="55,8 46,32 58,44 44,72"
          fill="none" stroke="#c8b0ff" strokeWidth="1.5" strokeLinejoin="round" opacity="0.8"
        />
        <polyline
          points="24,14 34,40 20,52 34,84"
          fill="none" stroke="#c8b0ff" strokeWidth="1" strokeLinejoin="round" opacity="0.6"
        />
      </motion.svg>
      {/* Ground scorch */}
      <motion.div
        className="absolute inset-x-3 bottom-0 h-3 rounded-full blur-sm"
        style={{ background: "radial-gradient(ellipse at center, rgba(176,140,255,0.7) 0%, transparent 70%)" }}
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0.4, 1.3, 1.5] }}
        transition={{ duration: 0.7 }}
      />
    </div>
  );
}

function ForceImpact() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 55 }}>
      {/* Concentric ripple rings */}
      {[0, 0.1, 0.22].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 rounded-full border-2 border-force-400/80"
          style={{ width: 40, height: 40, top: "35%", x: "-50%" }}
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 3.4 - i * 0.5, opacity: 0 }}
          transition={{ duration: 0.65, delay, ease: "easeOut" }}
        />
      ))}
      {/* Imploding motes — drawn in toward the target center */}
      {[...Array(6)].map((_, i) => {
        const ang = (i / 6) * Math.PI * 2;
        return (
          <motion.span
            key={`m${i}`}
            className="absolute left-1/2 top-[45%] h-1.5 w-1.5 rounded-full bg-force-300"
            style={{ boxShadow: "0 0 6px rgba(168,130,255,0.9)" }}
            initial={{ x: Math.cos(ang) * 58, y: Math.sin(ang) * 44, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: [0, 1, 0.9, 0] }}
            transition={{ duration: 0.5, delay: 0.05 + i * 0.03, ease: "easeIn" }}
          />
        );
      })}
      {/* Core flash */}
      <motion.div
        className="absolute left-1/2 top-[42%] h-10 w-10 -translate-x-1/2 rounded-full blur-md bg-force-300/70"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.4, 0.6], opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, delay: 0.18 }}
      />
    </div>
  );
}

function RangedImpact() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 55 }}>
      {/* Bolt streaking in */}
      <motion.div
        className="absolute"
        style={{ top: "45%", left: "-30%" }}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 90, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 0.3, ease: "linear", times: [0, 0.2, 0.8, 1] }}
      >
        <div className="h-[3px] w-10 rounded-full bg-gradient-to-r from-transparent via-red-400 to-red-200 shadow-[0_0_8px_rgba(255,80,80,0.9)]" />
      </motion.div>
      {/* Impact starburst where the bolt lands */}
      <motion.div
        className="absolute left-1/2 top-[45%] h-6 w-6 -translate-x-1/2 rounded-full blur-[2px]"
        style={{ background: "radial-gradient(circle, #ffd9c0 0%, rgba(255,100,70,0.8) 40%, transparent 70%)" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.8, 0.4], opacity: [0, 1, 0] }}
        transition={{ duration: 0.35, delay: 0.22 }}
      />
      {[...Array(4)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-[45%] h-[2px] w-3 rounded-full bg-orange-200"
          style={{ rotate: i * 90 + 45 }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: Math.cos((i * 90 + 45) * (Math.PI / 180)) * 26,
            y: Math.sin((i * 90 + 45) * (Math.PI / 180)) * 26,
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 0.32, delay: 0.24, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function MeleeImpact() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 55 }}>
      {/* Crossing saber arcs */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[3px] w-20 -translate-x-1/2 rounded-full"
        style={{
          rotate: -38,
          background: "linear-gradient(90deg, transparent, #fff4f0, #ff4466, transparent)",
          boxShadow: "0 0 12px rgba(255,68,102,0.9)",
        }}
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1.15, 1.3] }}
        transition={{ duration: 0.4, times: [0, 0.3, 1] }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full"
        style={{
          rotate: 34,
          background: "linear-gradient(90deg, transparent, #ffe9d8, #ffaa44, transparent)",
          boxShadow: "0 0 10px rgba(255,170,68,0.8)",
        }}
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0.2, 1.1, 1.25] }}
        transition={{ duration: 0.45, delay: 0.12, times: [0, 0.3, 1] }}
      />
      {/* Radial shockwave at the point of contact */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gilt-200/80"
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
      />
      {/* Sparks with gravity — fly out, then fall */}
      {[...Array(8)].map((_, i) => {
        const dx = (i - 3.5) * 14 + (i % 2 === 0 ? 5 : -5);
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-gilt-200"
            style={{ boxShadow: "0 0 4px rgba(255,220,160,0.9)" }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: dx,
              y: [0, -16 - (i % 3) * 14, 18 + (i % 4) * 8],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut", times: [0, 0.45, 1] }}
          />
        );
      })}
    </div>
  );
}

// ─── Self-cast aura (buff / heal) ─────────────────────────────────────

export function SelfAura({ kind }: { kind: AttackKind }) {
  const isHeal = kind === "heal";
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 54 }}>
      <motion.div
        className={clsx(
          "absolute inset-x-2 bottom-0 top-4 rounded-full blur-md",
          isHeal ? "bg-emerald-400/25" : "bg-force-500/25",
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1.2] }}
        transition={{ duration: 0.8 }}
      />
      {/* Ground ring pulse */}
      <motion.div
        className={clsx(
          "absolute inset-x-1 bottom-0 h-4 rounded-[50%] border",
          isHeal ? "border-emerald-300/70" : "border-force-300/70",
        )}
        initial={{ opacity: 0, scaleX: 0.5 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0.5, 1.15, 1.3] }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className={clsx(
            "absolute h-1.5 w-1.5 rounded-full",
            isHeal ? "bg-emerald-300" : "bg-force-300",
          )}
          style={{
            left: `${16 + i * 13}%`,
            bottom: "12%",
            boxShadow: isHeal ? "0 0 6px rgba(80,220,140,0.8)" : "0 0 6px rgba(168,130,255,0.8)",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -60 - (i % 3) * 14, opacity: [0, 1, 0] }}
          transition={{ duration: 0.85, delay: i * 0.07, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── Floating damage numbers ──────────────────────────────────────────

export function FloatingNumber({ event, side }: { event: DamageEvent; side: "left" | "right" }) {
  const isPlayer = event.targetId === "player";
  // Stable per-event drift so stacked hits fan out instead of overlapping.
  const drift = (hash01(event.id) - 0.5) * 64;
  const tilt = (hash01(event.id, 7) - 0.5) * 14;
  let label: string;
  let color: string;
  let textSize: string;

  if (event.isHeal) {
    label = `+${event.amount}`;
    color = "text-emerald-300 drop-shadow-[0_0_10px_rgba(80,220,140,0.8)]";
    textSize = "text-4xl";
  } else if (event.isMiss) {
    label = "MISS";
    color = "text-ash-400";
    textSize = "text-2xl";
  } else if (event.isDodged) {
    label = "DODGE";
    color = "text-force-300";
    textSize = "text-2xl";
  } else if (event.isCrit) {
    label = `${event.amount}`;
    color = isPlayer
      ? "text-blood-200 drop-shadow-[0_0_12px_rgba(220,40,80,0.85)]"
      : "text-gilt-200 drop-shadow-[0_0_14px_rgba(217,168,90,0.85)]";
    textSize = "text-6xl";
  } else {
    label = `${event.amount}`;
    color = isPlayer
      ? "text-blood-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
      : "text-ash-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]";
    textSize = "text-4xl";
  }

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 0, scale: event.isCrit ? 0.3 : 0.6, rotate: 0 }}
      animate={{
        y: event.isCrit ? -116 : -84,
        x: drift,
        opacity: [0, 1, 1, 0],
        scale: event.isCrit ? [0.3, 1.75, 1.25] : [0.6, 1.12, 1],
        rotate: tilt,
      }}
      transition={{ duration: event.isCrit ? 1.35 : 1.1, ease: "easeOut", times: [0, 0.2, 0.7, 1] }}
      className={clsx(
        "absolute pointer-events-none font-display font-black select-none whitespace-nowrap",
        textSize,
        color,
        side === "left" ? "left-1/2 -translate-x-1/2 top-0" : "left-1/2 -translate-x-1/2 top-0",
      )}
      style={{ zIndex: 60, textShadow: event.isCrit ? "0 0 18px currentColor, 0 2px 4px rgba(0,0,0,0.95)" : undefined }}
    >
      {event.isCrit && (
        <>
          {/* Starburst behind the number */}
          <motion.span
            className="absolute left-1/2 top-1/2 -z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
            style={{ background: "radial-gradient(circle, currentColor 0%, transparent 65%)", opacity: 0.4 }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.6, 1] }}
            transition={{ duration: 0.5 }}
          />
          <span className="absolute -left-12 top-1 font-display text-base tracking-widest text-gilt-400">
            CRIT!
          </span>
        </>
      )}
      {label}
    </motion.div>
  );
}

// ─── Persistent status aura ───────────────────────────────────────────

/**
 * Soft persistent glow around a combatant suffering a visceral status
 * (burn / poison / shock / bleed / corruption). Subtle and slow so it
 * reads as "afflicted" without competing with hit effects.
 */
export function StatusAura({ color }: { color: string }) {
  return (
    <motion.div
      className="absolute inset-x-1 bottom-0 top-3 rounded-full blur-md pointer-events-none"
      style={{ background: `radial-gradient(ellipse at 50% 60%, ${color} 0%, transparent 70%)`, zIndex: 52 }}
      animate={{ opacity: [0.35, 0.7, 0.35] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Weather overlay ──────────────────────────────────────────────────

interface WeatherVisual {
  tint: string;
  /** Drifting mote color + direction, if any. */
  mote?: { color: string; dir: "fall" | "side" };
  vignette?: boolean;
}

const WEATHER_VISUALS: Record<string, WeatherVisual> = {
  korriban_storm: { tint: "rgba(130,75,30,0.20)", mote: { color: "rgba(220,180,130,0.6)", dir: "side" } },
  kaas_mist:      { tint: "rgba(120,140,165,0.16)", vignette: true },
  malachor_wound: { tint: "rgba(80,200,110,0.13)", vignette: true },
  frozen_winds:   { tint: "rgba(150,185,215,0.16)", mote: { color: "rgba(225,238,250,0.7)", dir: "fall" } },
  blood_moon:     { tint: "rgba(160,20,40,0.15)" },
  sith_eclipse:   { tint: "rgba(95,40,125,0.22)", vignette: true },
};

/** Atmospheric tint + light drifting motes that match the encounter weather. */
export function WeatherOverlay({ weather, reducedMotion }: { weather: string; reducedMotion: boolean }) {
  const v = WEATHER_VISUALS[weather];
  if (!v) return null;
  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: 6 }}>
      <div className="absolute inset-0" style={{ background: v.tint }} />
      {v.vignette && (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)" }}
        />
      )}
      {!reducedMotion && v.mote &&
        [...Array(14)].map((_, i) => {
          const left = (i * 37) % 100;
          const fall = v.mote!.dir === "fall";
          return (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${(i * 23) % 100}%`,
                left: `${left}%`,
                width: fall ? 2 : 3,
                height: fall ? 2 : 1.5,
                background: v.mote!.color,
              }}
              initial={{ opacity: 0 }}
              animate={
                fall
                  ? { y: [0, 220], x: [0, 12], opacity: [0, 0.8, 0] }
                  : { x: [0, 260], y: [0, 18], opacity: [0, 0.8, 0] }
              }
              transition={{ duration: 4 + (i % 5), repeat: Infinity, ease: "linear", delay: (i % 7) * 0.5 }}
            />
          );
        })}
    </div>
  );
}

// ─── Wounded state (low HP) ───────────────────────────────────────────

/**
 * Heartbeat vignette layered over a combatant below ~30% HP — a fast red
 * pulse that reads as "on the brink" without obscuring the figure.
 */
export function WoundedAura() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-full"
      style={{
        zIndex: 53,
        background: "radial-gradient(ellipse at 50% 58%, transparent 42%, rgba(150,8,22,0.4) 100%)",
      }}
      animate={{ opacity: [0.45, 0.95, 0.45] }}
      transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── KOTOR d20 roll chip ──────────────────────────────────────────────

/**
 * Small floating roll readout shown under the damage number, exposing the
 * KOTOR d20 math the combat log already records: `d20 + attack bonus vs DEF`.
 * Natural 20s glow gold, natural 1s bleed red.
 */
export function D20Chip({ d20 }: { d20: AttackRoll }) {
  const total = d20.roll + d20.attackBonus;
  const nat = d20.isNat20 ? "nat20" : d20.isNat1 ? "nat1" : null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.85 }}
      animate={{ opacity: [0, 1, 1, 0], y: -10, scale: 1 }}
      transition={{ duration: 1.2, times: [0, 0.18, 0.7, 1], ease: "easeOut" }}
      className={clsx(
        "absolute left-1/2 -translate-x-1/2 bottom-1 pointer-events-none whitespace-nowrap select-none",
        "font-display text-[10px] tracking-wider px-1.5 py-0.5 rounded-sm border backdrop-blur-sm",
        nat === "nat20"
          ? "border-gilt-400/70 text-gilt-200 bg-gilt-950/80 shadow-[0_0_8px_rgba(217,168,90,0.4)]"
          : nat === "nat1"
            ? "border-blood-500/60 text-blood-300 bg-blood-950/80"
            : "border-ash-700/50 text-ash-300 bg-void-950/85",
      )}
      style={{ zIndex: 59 }}
    >
      <span className="text-ash-500">d20</span> {d20.roll}
      {d20.attackBonus >= 0 ? "+" : ""}
      {d20.attackBonus}={total} <span className="text-ash-600">vs</span> {d20.defense}
      {nat === "nat20" && <span className="ml-1 text-gilt-300">NAT20!</span>}
      {nat === "nat1" && <span className="ml-1 text-blood-400">NAT1</span>}
    </motion.div>
  );
}

// ─── Death burst (enemy defeat) ───────────────────────────────────────

/** Dark-side dissolve when an enemy falls: flash, smoke ring, ember scatter. */
export function DeathBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 56 }}>
      {/* Blood flash silhouette */}
      <motion.div
        className="absolute inset-x-1 inset-y-2 rounded-full blur-lg"
        style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(220,40,70,0.7) 0%, transparent 70%)" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 1, 0], scale: [0.7, 1.25, 1.45] }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      {/* Expanding smoke ring at the feet */}
      <motion.div
        className="absolute inset-x-0 bottom-1 h-6 rounded-[50%] border-2 border-ash-500/50 blur-[1px]"
        initial={{ opacity: 0, scaleX: 0.3 }}
        animate={{ opacity: [0, 0.9, 0], scaleX: [0.3, 1.5, 1.9] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {/* Ember scatter */}
      {[...Array(10)].map((_, i) => {
        const ang = (i / 10) * Math.PI * 2;
        const dist = 34 + (i % 3) * 16;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-[55%] h-1 w-1 rounded-full"
            style={{
              backgroundColor: i % 3 === 0 ? "#ff6644" : "#c41e3a",
              boxShadow: "0 0 5px rgba(255,80,60,0.8)",
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(ang) * dist,
              y: [0, Math.sin(ang) * dist * 0.7 - 12, Math.sin(ang) * dist * 0.7 + 22],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.85, ease: "easeOut", times: [0, 0.5, 1] }}
          />
        );
      })}
    </div>
  );
}
