"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/game/store/game-store";
import { ZONE_MAP } from "@/game/data/zones/all-zones";
import type { ZoneHotspot } from "@/game/engine/world/zone-types";
import { getCharacterImage } from "@/game/utils/character-images";
import { projectToGround, depthScale, depthZIndex } from "@/game/scenes/scene-projection";

/**
 * SceneEntities — renders NPC and enemy silhouettes at their hotspot positions
 * within the 2D scene. Each entity type has a distinct visual:
 *
 *   NPC      → hooded/robed figures, neutral colors, subtle breathing
 *   Encounter → darker/red-tinted aggressive silhouettes, weapon glow
 *   Loot     → glowing chest/container
 *
 * These are purely visual — interaction still happens through ZoneView hotspots.
 */

export function SceneEntities() {
  const world = useGameStore((s) => s.world);
  const zone = world?.zoneId ? ZONE_MAP.get(world.zoneId) ?? null : null;
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      setFrame((f) => f + 1);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { running = false; };
  }, []);

  if (!zone || !world) return null;

  const visible = zone.hotspots.filter((hs) => {
    if (hs.hideIfFlag && world.questFlags[hs.hideIfFlag]) return false;
    if (hs.requireFlag && !world.questFlags[hs.requireFlag]) return false;
    // Consumed encounters/loot are hidden by ZoneView — hide their sprites too,
    // or defeated enemies would keep haunting the map.
    if (hs.type === "encounter" && world.questFlags[`encounter_done_${hs.id}`]) return false;
    if (hs.type === "loot" && world.questFlags[`loot_done_${hs.id}`]) return false;
    return hs.type === "npc" || hs.type === "encounter" || hs.type === "loot";
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-[5]">
      {/* feColorMatrix filter: strips residual near-white pixels from portrait sprites */}
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="entity-bg-clean" colorInterpolationFilters="sRGB">
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
      {visible.map((hs) => (
        <EntitySilhouette key={hs.id} hotspot={hs} frame={frame} />
      ))}
    </div>
  );
}

/** Resolves the portrait image for an NPC or encounter hotspot, if registered. */
function hotspotImage(hs: ZoneHotspot): string | null {
  if (hs.type === "npc" && hs.npcId) return getCharacterImage(hs.npcId);
  if (hs.type === "encounter" && hs.encounterEnemies?.length)
    return getCharacterImage(hs.encounterEnemies[0]!);
  return null;
}

/**
 * Non-humanoid enemy templates get a creature silhouette instead of the
 * generic armored-humanoid figure (a slug should not look like a Sith).
 */
type CreatureKind = "beast" | "slug" | "flyer" | "droid" | "wraith";

const CREATURE_KIND: Record<string, CreatureKind> = {
  // Quadruped predators
  tuk_ata: "beast", tukata_alpha: "beast", kath_hound: "beast",
  boma_beast: "beast", kaas_vine_cat: "beast", wild_beast: "beast",
  storm_beast: "beast", hssiss: "beast", terentatek: "beast", cannok: "beast",
  kaas_gundark: "beast", kaas_gundark_alpha: "beast", undercroft_horror: "beast",
  // Crawlers / larvae
  klor_slug: "slug", klor_slug_queen: "slug", kinrath: "slug",
  drexl_larva: "slug", rakghoul: "slug", sludge_creeper: "slug",
  // Winged
  shyrack: "flyer",
  // Machines
  tomb_droid: "droid", salvage_droid: "droid", rakata_construct: "droid",
  temple_sentinel: "droid", sanctum_keeper: "droid",
  // Spectres
  tomb_wraith: "wraith", void_wraith: "wraith", ghost_captain: "wraith",
  kaas_temple_voice: "wraith", tomb_guardian_boss: "wraith",
};

function hotspotCreatureKind(hs: ZoneHotspot): CreatureKind | null {
  if (hs.type !== "encounter" || !hs.encounterEnemies?.length) return null;
  return CREATURE_KIND[hs.encounterEnemies[0]!] ?? null;
}

/**
 * Visual height (px, before depth scaling is applied to markers) of the
 * entity standing at a hotspot. ZoneView uses this to float the interaction
 * marker above the sprite's head instead of drawing on top of it.
 */
export function entityVisualHeight(hs: ZoneHotspot): number {
  const ground = projectToGround(hs.position);
  const scale = depthScale(ground.depth);
  if (hs.type === "loot") return 30 * scale;
  if (hs.type !== "npc" && hs.type !== "encounter") return 0;
  if (hotspotImage(hs)) return (hs.type === "encounter" ? 120 : 110) * scale;
  if (hotspotCreatureKind(hs)) return 60 * scale;
  return (hs.type === "encounter" ? 80 : 65) * scale;
}

/** Portrait-based entity sprite, standing on the projected ground point. */
function EntityImageSprite({
  hotspot,
  imageUrl,
  frame,
}: {
  hotspot: ZoneHotspot;
  imageUrl: string;
  frame: number;
}) {
  const ground = projectToGround(hotspot.position);
  const isEnemy = hotspot.type === "encounter";
  const height = (isEnemy ? 120 : 110) * depthScale(ground.depth);
  const breathe = Math.sin(frame * 0.02 + hotspot.position[0]) * 2;
  const glow = isEnemy ? "rgba(220,30,60,0.35)" : "rgba(120,140,255,0.25)";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute"
      style={{
        left: `${ground.x}%`,
        top: `${ground.y}%`,
        transform: "translate(-50%, -100%)",
        zIndex: depthZIndex(ground.depth),
      }}
    >
      <img
        src={imageUrl}
        alt=""
        aria-hidden="true"
        style={{
          height,
          width: "auto",
          display: "block",
          margin: "0 auto",
          transform: `translateY(${breathe}px)`,
          transformOrigin: "bottom center",
          filter: `url(#entity-bg-clean) drop-shadow(0 3px 14px ${glow}) drop-shadow(0 0 8px rgba(0,0,0,0.9))`,
          willChange: "transform",
        }}
      />
      {/* Ground shadow */}
      <div
        className="mx-auto -mt-1"
        style={{
          width: height * 0.5,
          height: 8,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

function EntitySilhouette({ hotspot, frame }: { hotspot: ZoneHotspot; frame: number }) {
  const breathe = Math.sin(frame * 0.025 + hotspot.position[0]) * 0.5 + 0.5;

  if (hotspot.type === "loot") {
    return <LootContainer hotspot={hotspot} frame={frame} />;
  }

  // Registered portrait sprite takes precedence over the generic silhouette
  const imageUrl = hotspotImage(hotspot);
  if (imageUrl) {
    return <EntityImageSprite hotspot={hotspot} imageUrl={imageUrl} frame={frame} />;
  }

  const isEnemy = hotspot.type === "encounter";
  const creature = hotspotCreatureKind(hotspot);
  const ground = projectToGround(hotspot.position);
  const scale = depthScale(ground.depth);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: Math.random() * 0.5 }}
      className="absolute"
      style={{
        left: `${ground.x}%`,
        top: `${ground.y}%`,
        transform: "translate(-50%, -100%)",
        zIndex: depthZIndex(ground.depth),
      }}
    >
      <svg
        viewBox={creature ? "0 0 110 70" : isEnemy ? "0 0 60 100" : "0 0 50 100"}
        overflow="visible"
        style={{ width: "auto", height: (creature ? 60 : isEnemy ? 80 : 65) * scale }}
        aria-hidden="true"
      >
        {/* Glow filter */}
        <defs>
          <filter id={`eg-${hotspot.id}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {creature ? (
          <CreatureFigure kind={creature} frame={frame} breathe={breathe} filterId={`eg-${hotspot.id}`} />
        ) : isEnemy ? (
          <EnemyFigure frame={frame} breathe={breathe} filterId={`eg-${hotspot.id}`} />
        ) : (
          <NPCFigure frame={frame} breathe={breathe} filterId={`eg-${hotspot.id}`} />
        )}
      </svg>

      {/* Ground shadow */}
      <div
        className="mx-auto -mt-0.5"
        style={{
          width: isEnemy ? 40 : 30,
          height: 6,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}

// ─── NPC figure — robed, neutral ──────────────────────────────────────

function NPCFigure({ frame, breathe, filterId }: { frame: number; breathe: number; filterId: string }) {
  const sway = Math.sin(frame * 0.015) * 1.5;

  return (
    <g transform={`translate(0, ${-breathe * 1})`}>
      {/* Robe / body */}
      <g fill="#14142a" stroke="#1e1e38" strokeWidth="0.4">
        {/* Robe skirt */}
        <path d={`M12,45 L${8 + sway},95 L${42 - sway},95 L38,45 Z`} />
        {/* Torso */}
        <path d="M15,22 L35,22 L38,48 L12,48 Z" />
        {/* Hood */}
        <path d="M16,4 L25,0 L34,4 L36,24 L14,24 Z" fill="#10102a" />
        <path d="M18,7 L25,3 L32,7 L33,20 L17,20 Z" fill="#0a0a1e" />
        <ellipse cx="25" cy="14" rx="6" ry="8" fill="#08081a" />
      </g>

      {/* Subtle eye glow — amber for NPCs */}
      <circle cx="22" cy="13" r="1.2" fill="#c9a961" opacity={0.5 + breathe * 0.3} />
      <circle cx="28" cy="13" r="1.2" fill="#c9a961" opacity={0.5 + breathe * 0.3} />
      <circle cx="22" cy="13" r="2" fill="rgba(201,169,97,0.3)" filter={`url(#${filterId})`} />
      <circle cx="28" cy="13" r="2" fill="rgba(201,169,97,0.3)" filter={`url(#${filterId})`} />

      {/* Arms at sides */}
      <path d={`M15,26 L8,50 L12,52 L17,30 Z`} fill="#14142a" />
      <path d={`M35,26 L42,50 L38,52 L33,30 Z`} fill="#14142a" />
    </g>
  );
}

// ─── Enemy figure — aggressive, red-tinged ────────────────────────────

function EnemyFigure({ frame, breathe, filterId }: { frame: number; breathe: number; filterId: string }) {
  const sway = Math.sin(frame * 0.02) * 2;
  const armSwing = Math.sin(frame * 0.03) * 3;

  return (
    <g transform={`translate(0, ${-breathe * 1.5})`}>
      {/* Body */}
      <g fill="#0f0810" stroke="#1a0a18" strokeWidth="0.4">
        {/* Legs */}
        <path d="M18,58 L14,92 L22,92 L24,58 Z" />
        <path d="M36,58 L38,92 L46,92 L42,58 Z" />
        {/* Boots */}
        <path d="M12,88 L24,88 L25,96 L10,96 Z" />
        <path d="M36,88 L48,88 L50,96 L34,96 Z" />
        {/* Torso */}
        <path d="M16,24 L44,24 L42,60 L18,60 Z" />
        {/* Armor plate */}
        <path d="M20,28 L40,28 L38,55 L22,55 Z" fill="#120c18" />
        {/* Shoulder pads */}
        <path d="M16,24 L8,22 L6,34 L16,36" fill="#120c18" />
        <path d="M44,24 L52,22 L54,34 L44,36" fill="#120c18" />
        {/* Neck */}
        <rect x="26" y="18" width="8" height="6" rx="2" />
        {/* Helmet / head */}
        <ellipse cx="30" cy="12" rx="10" ry="12" fill="#0c0810" />
      </g>

      {/* Red eye glow */}
      <rect x="23" y="10" width="14" height="3" rx="1.5" fill="#ff3355" opacity={0.6 + breathe * 0.3} />
      <rect x="23" y="10" width="14" height="3" rx="1.5" fill="rgba(220,30,60,0.4)" filter={`url(#${filterId})`} />

      {/* Right arm — weapon raised */}
      <g transform={`rotate(${armSwing}, 44, 28)`}>
        <path d="M44,28 L54,12 L58,15 L48,32 Z" fill="#0f0810" />
        {/* Weapon — dark energy blade */}
        <line x1="56" y1="14" x2="62" y2="-10" stroke="rgba(220,30,60,0.3)" strokeWidth="4" strokeLinecap="round" filter={`url(#${filterId})`} />
        <line x1="56" y1="14" x2="62" y2="-10" stroke="#cc2244" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* Left arm */}
      <g transform={`rotate(${-armSwing * 0.5}, 16, 28)`}>
        <path d="M16,28 L6,48 L10,50 L18,32 Z" fill="#0f0810" />
      </g>
    </g>
  );
}

// ─── Creature figures — beasts, slugs, flyers, droids, wraiths ────────

function CreatureFigure({
  kind,
  frame,
  breathe,
  filterId,
}: {
  kind: CreatureKind;
  frame: number;
  breathe: number;
  filterId: string;
}) {
  const sway = Math.sin(frame * 0.02) * 2;

  if (kind === "beast") {
    // Quadruped predator — low stance, raised haunches, glowing eyes
    return (
      <g transform={`translate(0, ${-breathe * 1.2})`}>
        <g fill="#140a0c" stroke="#241015" strokeWidth="0.5">
          {/* Haunches + body */}
          <ellipse cx="38" cy="42" rx="22" ry="15" />
          <ellipse cx="64" cy="44" rx="18" ry="12" />
          {/* Neck + head, low and forward */}
          <path d={`M76,40 L94,${30 + sway} L102,${34 + sway} L96,${42 + sway} L80,48 Z`} />
          {/* Jaw */}
          <path d={`M96,${38 + sway} L106,${42 + sway} L96,${44 + sway} Z`} fill="#1c0e12" />
          {/* Legs */}
          <path d="M26,50 L22,66 L28,66 L32,52 Z" />
          <path d="M44,52 L42,67 L48,67 L50,53 Z" />
          <path d="M60,52 L58,66 L64,66 L66,53 Z" />
          <path d="M74,50 L76,66 L82,66 L80,51 Z" />
          {/* Tail */}
          <path d={`M18,40 Q${6 - sway},34 ${2 - sway},24`} fill="none" stroke="#140a0c" strokeWidth="4" strokeLinecap="round" />
          {/* Spine ridges */}
          <path d="M28,28 L32,22 L36,28 M44,26 L48,20 L52,26 M58,28 L62,23 L66,29" fill="none" stroke="#241015" strokeWidth="2" />
        </g>
        {/* Eyes */}
        <circle cx="92" cy={33 + sway} r="1.6" fill="#ff4433" opacity={0.6 + breathe * 0.4} />
        <circle cx="92" cy={33 + sway} r="3" fill="rgba(255,60,40,0.35)" filter={`url(#${filterId})`} />
      </g>
    );
  }

  if (kind === "slug") {
    // Segmented crawler rearing its maw up
    const rear = Math.sin(frame * 0.025) * 3;
    return (
      <g transform={`translate(0, ${-breathe})`}>
        <g fill="#101408" stroke="#1e2410" strokeWidth="0.5">
          {/* Body segments trailing back */}
          <ellipse cx="30" cy="58" rx="26" ry="10" />
          <ellipse cx="52" cy="52" rx="20" ry="11" />
          <ellipse cx="68" cy="44" rx="15" ry="11" />
          {/* Reared head */}
          <ellipse cx="80" cy={28 - rear} rx="12" ry="14" />
          {/* Open maw */}
          <path d={`M74,${20 - rear} L88,${14 - rear} L90,${26 - rear} L76,${30 - rear} Z`} fill="#2a1208" />
          {/* Segment lines */}
          <path d="M14,54 Q16,62 20,64 M34,50 Q36,60 40,62 M56,44 Q58,54 62,56" fill="none" stroke="#1e2410" strokeWidth="1.5" />
        </g>
        {/* Maw glow */}
        <ellipse cx="82" cy={21 - rear} rx="4" ry="3" fill="rgba(255,120,50,0.4)" filter={`url(#${filterId})`} opacity={0.5 + breathe * 0.4} />
      </g>
    );
  }

  if (kind === "flyer") {
    // Bat-like shyrack hovering above the floor, wings flapping
    const flap = Math.sin(frame * 0.08) * 14;
    return (
      <g transform={`translate(0, ${-14 - breathe * 3})`}>
        <g fill="#100a14" stroke="#1e1424" strokeWidth="0.5">
          {/* Wings */}
          <path d={`M55,34 L20,${24 - flap} L8,${34 - flap} L26,36 L12,${42 - flap * 0.4} L34,40 Z`} />
          <path d={`M55,34 L90,${24 - flap} L102,${34 - flap} L84,36 L98,${42 - flap * 0.4} L76,40 Z`} />
          {/* Body */}
          <ellipse cx="55" cy="36" rx="9" ry="13" />
          {/* Head */}
          <circle cx="55" cy="24" r="6" />
          <path d="M50,20 L48,12 L53,18 M60,20 L62,12 L57,18" fill="none" stroke="#1e1424" strokeWidth="1.5" />
        </g>
        <circle cx="52" cy="23" r="1.3" fill="#ff5544" opacity={0.7 + breathe * 0.3} />
        <circle cx="58" cy="23" r="1.3" fill="#ff5544" opacity={0.7 + breathe * 0.3} />
        <circle cx="55" cy="23" r="4" fill="rgba(255,70,60,0.3)" filter={`url(#${filterId})`} />
      </g>
    );
  }

  if (kind === "droid") {
    // Boxy war droid with a single photoreceptor
    return (
      <g transform={`translate(20, ${-breathe * 0.6})`}>
        <g fill="#12141c" stroke="#222634" strokeWidth="0.6">
          {/* Legs */}
          <path d="M26,44 L22,64 L28,64 L32,46 Z" />
          <path d="M44,44 L48,64 L54,64 L50,46 Z" />
          {/* Torso */}
          <rect x="22" y="20" width="34" height="26" rx="3" />
          <rect x="26" y="24" width="26" height="8" rx="2" fill="#1a1e2c" />
          {/* Shoulder cannons */}
          <rect x="12" y="22" width="12" height="6" rx="2" />
          <rect x="54" y="22" width="12" height="6" rx="2" />
          {/* Head */}
          <rect x="30" y="8" width="18" height="12" rx="2" />
        </g>
        {/* Photoreceptor */}
        <circle cx="39" cy="14" r="2.2" fill="#ff3344" opacity={0.7 + breathe * 0.3} />
        <circle cx="39" cy="14" r="4.5" fill="rgba(255,40,60,0.35)" filter={`url(#${filterId})`} />
        {/* Status lights */}
        <circle cx="30" cy="28" r="1" fill="#44ddff" opacity={breathe} />
        <circle cx="34" cy="28" r="1" fill="#44ddff" opacity={1 - breathe} />
      </g>
    );
  }

  // wraith — translucent tattered spectre, floating
  return (
    <g transform={`translate(25, ${-8 - breathe * 4})`} opacity="0.85">
      <g fill="rgba(40,52,90,0.55)" stroke="rgba(90,110,180,0.4)" strokeWidth="0.5">
        {/* Tattered robe trailing into nothing */}
        <path d={`M14,16 L46,16 L44,40 L${40 + sway},52 L34,44 L${28 + sway},56 L24,46 L${16 - sway},54 L16,40 Z`} />
        {/* Hood */}
        <path d="M18,18 L30,2 L42,18 L38,24 L22,24 Z" fill="rgba(30,40,72,0.65)" />
        <ellipse cx="30" cy="15" rx="7" ry="8" fill="rgba(8,10,24,0.9)" />
      </g>
      {/* Hollow eyes */}
      <circle cx="27" cy="14" r="1.4" fill="#9fc4ff" opacity={0.6 + breathe * 0.4} />
      <circle cx="33" cy="14" r="1.4" fill="#9fc4ff" opacity={0.6 + breathe * 0.4} />
      <ellipse cx="30" cy="15" rx="8" ry="6" fill="rgba(130,170,255,0.25)" filter={`url(#${filterId})`} />
      {/* Spectral wisp below */}
      <ellipse cx="30" cy="58" rx="14" ry="3" fill="rgba(120,150,255,0.15)" filter={`url(#${filterId})`} />
    </g>
  );
}

// ─── Loot container — glowing chest ────────────────────────────────────

function LootContainer({ hotspot, frame }: { hotspot: ZoneHotspot; frame: number }) {
  const pulse = Math.sin(frame * 0.04) * 0.5 + 0.5;
  const ground = projectToGround(hotspot.position);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute"
      style={{
        left: `${ground.x}%`,
        top: `${ground.y}%`,
        transform: "translate(-50%, -100%)",
        zIndex: depthZIndex(ground.depth),
      }}
    >
      <svg viewBox="0 0 40 30" overflow="visible" style={{ width: "auto", height: 30 * depthScale(ground.depth) }} aria-hidden="true">
        <defs>
          <filter id={`lg-${hotspot.id}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>
        {/* Glow */}
        <ellipse cx="20" cy="15" rx="18" ry="12" fill="rgba(201,169,97,0.2)" filter={`url(#lg-${hotspot.id})`} opacity={0.4 + pulse * 0.3} />
        {/* Chest body */}
        <rect x="5" y="12" width="30" height="16" rx="2" fill="#1a1530" stroke="#c9a961" strokeWidth="0.8" opacity="0.8" />
        {/* Chest lid */}
        <path d="M4,12 L20,6 L36,12 L36,14 L4,14 Z" fill="#1e1a35" stroke="#c9a961" strokeWidth="0.5" opacity="0.8" />
        {/* Lock/clasp glow */}
        <circle cx="20" cy="20" r="2" fill="#c9a961" opacity={0.5 + pulse * 0.4} />
        <circle cx="20" cy="20" r="4" fill="rgba(201,169,97,0.3)" filter={`url(#lg-${hotspot.id})`} opacity={0.3 + pulse * 0.2} />
      </svg>
    </motion.div>
  );
}
