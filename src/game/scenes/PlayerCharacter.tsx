"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/game/store/game-store";
import { useCombatStore } from "@/game/engine/combat/combat-store";
import type { ClassId } from "@/game/data/schemas";
import { getClassImage } from "@/game/utils/character-images";

/**
 * PlayerCharacter v4 — portrait-based sprite with physics walk simulation.
 *
 * Uses the actual class portrait SVG images (same as character creation) as the
 * in-game sprite. A CSS animation system simulates bipedal walking and breathing
 * without requiring sprite sheets:
 *   • Walking: double-bounce bob + lateral sway + forward lean
 *   • Idle:    slow breathing rise/fall + gentle weight-shift sway
 *
 * The inline SVG feColorMatrix filter removes residual near-white pixels from
 * the portrait images so they render cleanly against the dark scene backgrounds.
 *
 * External API (unchanged):
 *   window.__playerWalkTo(x, y)         → Promise<void>
 *   window.__playerReturnToCenter()     → Promise<void>
 */

// ─── Types ──────────────────────────────────────────────────────────────────

type WalkState = "idle" | "walking";

interface CharacterPos {
  x: number;
  y: number;
  facing: "left" | "right";
  state: WalkState;
}

// ─── Saber glow colors per class (for drop-shadow) ──────────────────────────

const SABER_GLOW: Record<ClassId, string> = {
  marauder:   "rgba(220,30,60,0.5)",
  inquisitor: "rgba(140,30,220,0.5)",
  assassin:   "rgba(180,20,40,0.5)",
};

// ─── Limb rigs (paper-doll slicing) ──────────────────────────────────────────
//
// Each slice is a clipped copy of the portrait image rotated around a pivot.
// A darkened static copy of the lower body sits behind the leg slices so the
// gap that opens between them during the stride reads as inner shadow.
// Slice geometry is in % of the 1024×1024 portrait.

interface LimbSlice {
  clip: string;      // CSS clip-path for this body part
  pivot: string;     // transform-origin ("x% y%") — the joint
  amp: number;       // swing amplitude (deg) while walking
  idleAmp: number;   // residual sway (deg) while idle
  phase: number;     // stride phase offset (rad)
}

interface LimbRig {
  /** clip for the static darkened backfill behind the legs */
  backClip: string;
  /** clip for the static torso/head layer, drawn above the legs */
  topClip: string;
  legs: LimbSlice[];
  arms: LimbSlice[];
}

const LIMB_RIGS: Partial<Record<ClassId, LimbRig>> = {
  // Assassin: wide stance — scissor legs split at the center tabard.
  // The saber arm (viewer-left) stays static because the blade crosses the
  // body diagonally and would detach; the open arm swings counter to stride.
  assassin: {
    backClip: "inset(55% 0 0 0)",
    topClip:  "inset(0 0 40% 0)",
    legs: [
      { clip: "polygon(0% 57%, 51% 57%, 51% 100%, 0% 100%)",   pivot: "38% 60%", amp: 3.5, idleAmp: 0,   phase: 0 },
      { clip: "polygon(49% 57%, 100% 57%, 100% 100%, 49% 100%)", pivot: "62% 60%", amp: 3.5, idleAmp: 0,   phase: Math.PI },
    ],
    arms: [
      { clip: "polygon(54% 28%, 76% 28%, 76% 58%, 54% 58%)",   pivot: "58% 33%", amp: 6,   idleAmp: 1.2, phase: Math.PI },
    ],
  },
  // Inquisitor: full robe — the leg slices produce a subtle skirt swish.
  // The saber arm slice includes the whole blade (it points away from the
  // body, down-left) so the saber sways with the arm.
  inquisitor: {
    backClip: "inset(58% 0 0 0)",
    topClip:  "inset(0 0 38% 0)",
    legs: [
      { clip: "polygon(0% 60%, 51% 60%, 51% 100%, 0% 100%)",   pivot: "44% 62%", amp: 2.5, idleAmp: 0,   phase: 0 },
      { clip: "polygon(49% 60%, 100% 60%, 100% 100%, 49% 100%)", pivot: "56% 62%", amp: 2.5, idleAmp: 0,   phase: Math.PI },
    ],
    arms: [
      { clip: "polygon(0% 45%, 43% 45%, 43% 60%, 28% 67%, 22% 100%, 0% 100%)", pivot: "39% 50%", amp: 4, idleAmp: 1,   phase: 0 },
      { clip: "polygon(55% 46%, 71% 46%, 71% 64%, 55% 64%)",   pivot: "60% 50%", amp: 4,   idleAmp: 1,   phase: Math.PI },
    ],
  },
};

// ─── Character sprite ────────────────────────────────────────────────────────

function CharacterSprite({
  classId,
  walking,
  frame,
  walkPhase,
}: {
  classId: ClassId;
  walking: boolean;
  frame: number;
  walkPhase: number;
}) {
  const imageUrl = getClassImage(classId);
  const glow = SABER_GLOW[classId];
  const rig  = LIMB_RIGS[classId];

  // Walking: double-bounce (two footfalls per stride cycle) + sway + lean
  const walkBob  = walking ? -Math.abs(Math.sin(walkPhase * 2)) * 5   : 0;
  const walkSway = walking ? Math.sin(walkPhase) * 2                   : 0;
  const walkLean = walking ? Math.sin(walkPhase) * 2.5                 : 0;

  // Idle: gentle breathing and weight-shift
  const idleBob  = !walking ? -Math.sin(frame * 0.025) * 2           : 0;
  const idleSway = !walking ? Math.sin(frame * 0.018) * 0.5          : 0;

  const translateY = walkBob + idleBob;
  const translateX = walkSway;
  const rotate     = walkLean + idleSway;

  return (
    <>
      {/* Hidden SVG: feColorMatrix filter removes near-white portrait artifacts */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="sprite-bg-clean" colorInterpolationFilters="sRGB">
            {/* Alpha = -2.2*(R+G+B) + 5*A  →  white→transparent, dark→opaque */}
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                     -2.2 -2.2 -2.2 5 -0.1"
            />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          height: 190,
          display: "flex",
          alignItems: "flex-end",
          transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`,
          transformOrigin: "bottom center",
          willChange: "transform",
        }}
      >
        {rig ? (
          <LimbAnimatedImage
            imageUrl={imageUrl}
            glow={glow}
            rig={rig}
            walking={walking}
            frame={frame}
            walkPhase={walkPhase}
          />
        ) : (
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            style={{
              height: "100%",
              width: "auto",
              objectFit: "contain",
              objectPosition: "bottom",
              display: "block",
              /* SVG filter first (removes white bg), then CSS glow */
              filter: `url(#sprite-bg-clean) drop-shadow(0 4px 20px ${glow}) drop-shadow(0 0 10px rgba(0,0,0,0.95))`,
            }}
          />
        )}
      </div>
    </>
  );
}

// ─── Limb-animated sprite ────────────────────────────────────────────────────

function sliceAngle(s: LimbSlice, walking: boolean, walkPhase: number, frame: number): number {
  return walking
    ? Math.sin(walkPhase + s.phase) * s.amp
    : Math.sin(frame * 0.03 + s.phase) * s.idleAmp;
}

function LimbAnimatedImage({
  imageUrl,
  glow,
  rig,
  walking,
  frame,
  walkPhase,
}: {
  imageUrl: string;
  glow: string;
  rig: LimbRig;
  walking: boolean;
  frame: number;
  walkPhase: number;
}) {
  const layerBase: CSSProperties = {
    position: "absolute",
    inset: 0,
    height: "100%",
    width: "100%",
    objectFit: "contain",
    objectPosition: "bottom",
    display: "block",
    filter: "url(#sprite-bg-clean)",
    willChange: "transform",
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        aspectRatio: "1 / 1",
        /* glow applied once on the wrapper so layered copies don't stack shadows */
        filter: `drop-shadow(0 4px 20px ${glow}) drop-shadow(0 0 10px rgba(0,0,0,0.95))`,
      }}
    >
      {/* Darkened backfill: hides the gap that opens between the leg slices */}
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        style={{ ...layerBase, clipPath: rig.backClip, filter: "url(#sprite-bg-clean) brightness(0.4)" }}
      />

      {/* Legs */}
      {rig.legs.map((s, i) => (
        <img
          key={`leg-${i}`}
          src={imageUrl}
          alt=""
          aria-hidden="true"
          style={{
            ...layerBase,
            clipPath: s.clip,
            transformOrigin: s.pivot,
            transform: `rotate(${sliceAngle(s, walking, walkPhase, frame)}deg)`,
          }}
        />
      ))}

      {/* Torso + head, drawn over the hip seam */}
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        style={{ ...layerBase, clipPath: rig.topClip }}
      />

      {/* Arms, drawn above the torso so the swing stays visible */}
      {rig.arms.map((s, i) => (
        <img
          key={`arm-${i}`}
          src={imageUrl}
          alt=""
          aria-hidden="true"
          style={{
            ...layerBase,
            clipPath: s.clip,
            transformOrigin: s.pivot,
            transform: `rotate(${sliceAngle(s, walking, walkPhase, frame)}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Walk tuning ─────────────────────────────────────────────────────────────

const WALK_SPEED      = 0.28;   // % of scene per frame
const WALK_CYCLE_FREQ = 0.085;  // rad/frame for stride animation

// ─── Root component ──────────────────────────────────────────────────────────

export function PlayerCharacter() {
  const character   = useGameStore((s) => s.character);
  const openPanel   = useGameStore((s) => s.openPanel);
  const combatPhase = useCombatStore((s) => s.phase);

  const [frame, setFrame] = useState(0);
  const rafRef = useRef<number>(0);

  const [pos, setPos] = useState<CharacterPos>({ x: 50, y: 82, facing: "right", state: "idle" });
  const walkResolveRef = useRef<(() => void) | null>(null);
  const targetRef      = useRef<{ x: number; y: number } | null>(null);
  const walkFrameRef   = useRef<number>(0);

  // Animation loop
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      setFrame((f) => f + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); };
  }, []);

  // Walk interpolation
  useEffect(() => {
    if (pos.state !== "walking" || !targetRef.current) return;
    const target = targetRef.current;

    const interval = setInterval(() => {
      setPos((prev) => {
        const dx   = target.x - prev.x;
        const dy   = target.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < WALK_SPEED) {
          clearInterval(interval);
          walkResolveRef.current?.();
          walkResolveRef.current = null;
          targetRef.current      = null;
          walkFrameRef.current   = 0;
          return { ...prev, x: target.x, y: target.y, state: "idle" as const };
        }

        walkFrameRef.current += 1;
        const nx = dx / dist;
        const ny = dy / dist;
        return {
          ...prev,
          x: prev.x + nx * WALK_SPEED,
          y: prev.y + ny * WALK_SPEED,
          facing: dx > 0 ? "right" : "left",
        };
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [pos.state]);

  // Expose walkTo globally
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__playerWalkTo = (x: number, y: number): Promise<void> =>
      new Promise((resolve) => {
        walkResolveRef.current = resolve;
        targetRef.current      = { x, y };
        walkFrameRef.current   = 0;
        setPos((prev) => ({ ...prev, state: "walking", facing: x > prev.x ? "right" : "left" }));
      });
    w.__playerReturnToCenter = (): Promise<void> =>
      new Promise((resolve) => {
        walkResolveRef.current = resolve;
        targetRef.current      = { x: 50, y: 82 };
        walkFrameRef.current   = 0;
        setPos((prev) => ({ ...prev, state: "walking", facing: 50 > prev.x ? "right" : "left" }));
      });
    return () => { delete w.__playerWalkTo; delete w.__playerReturnToCenter; };
  }, []);

  // Reset position on zone change
  const zoneId = useGameStore((s) => s.world?.zoneId);
  useEffect(() => {
    setPos({ x: 50, y: 82, facing: "right", state: "idle" });
  }, [zoneId]);

  if (!character || combatPhase !== "idle") return null;

  const scaleX    = pos.facing === "left" ? -1 : 1;
  const walkPhase = walkFrameRef.current * WALK_CYCLE_FREQ;

  return (
    <AnimatePresence>
      <motion.div
        key="player-character"
        className="absolute inset-0 pointer-events-none select-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute"
          style={{
            left:      `${pos.x}%`,
            top:       `${pos.y}%`,
            transform: `translate(-50%, -100%) scaleX(${scaleX})`,
          }}
        >
          <div
            className="pointer-events-auto cursor-pointer"
            onClick={() => openPanel("character")}
            role="button"
            aria-label="Open character sheet"
          >
            <CharacterSprite
              classId={character.classId}
              walking={pos.state === "walking"}
              frame={frame}
              walkPhase={walkPhase}
            />
          </div>

          {/* Ground shadow */}
          <div
            className="mx-auto -mt-2"
            style={{
              width: 100, height: 12, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)",
              transform: `scaleX(${scaleX})`,
            }}
          />
          {/* Nameplate */}
          <div
            className="text-center mt-1 pointer-events-none"
            style={{ transform: `scaleX(${scaleX})` }}
          >
            <span className="font-display text-[10px] tracking-[0.2em] text-gilt-500/70 uppercase">
              {character.name}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
