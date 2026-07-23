"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useGameStore } from "@/game/store/game-store";
import { PLANETS, ZONE_MAP } from "@/game/data/zones/all-zones";
import type { PlanetDefinition } from "@/game/engine/world/zone-types";

/**
 * Galaxy Map — a star chart of the Outer Rim.
 * Planets sit on a starfield with per-world colors, orbit rings, and a
 * hyperspace route tracing the campaign order. Opened via "M" or the HUD.
 */

interface PlanetVisual {
  /** Position on the chart as percentages. */
  pos: [number, number];
  /** Disc diameter in px. */
  size: number;
  /** Planet disc gradient (CSS background). */
  disc: string;
  /** Glow color. */
  glow: string;
  /** Short flavor tag under the name. */
  tag: string;
}

const PLANET_VISUALS: Record<string, PlanetVisual> = {
  korriban: {
    pos: [14, 62], size: 52,
    disc: "radial-gradient(circle at 32% 30%, #e08a4e 0%, #9c4a22 45%, #4a1c0c 100%)",
    glow: "rgba(255,140,70,0.5)", tag: "Sith Homeworld",
  },
  dromund_kaas: {
    pos: [30, 38], size: 56,
    disc: "radial-gradient(circle at 35% 30%, #7d8bc4 0%, #3c4470 45%, #14182e 100%)",
    glow: "rgba(150,160,255,0.5)", tag: "Imperial Capital",
  },
  ziost: {
    pos: [22, 20], size: 44,
    disc: "radial-gradient(circle at 33% 28%, #d6ecff 0%, #6f99bc 45%, #1c2c3c 100%)",
    glow: "rgba(170,220,255,0.5)", tag: "Frozen First Throne",
  },
  nar_shaddaa: {
    pos: [46, 60], size: 48,
    disc: "radial-gradient(circle at 30% 32%, #e8c068 0%, #8a6430 50%, #2e2210 100%)",
    glow: "rgba(255,200,90,0.5)", tag: "Smuggler's Moon",
  },
  onderon: {
    pos: [58, 34], size: 50,
    disc: "radial-gradient(circle at 34% 28%, #9ec47a 0%, #4e7038 50%, #1c2c12 100%)",
    glow: "rgba(180,230,130,0.45)", tag: "Royal World",
  },
  dxun: {
    pos: [65, 24], size: 26,
    disc: "radial-gradient(circle at 35% 30%, #6a9a58 0%, #35562a 50%, #101e0c 100%)",
    glow: "rgba(120,210,110,0.4)", tag: "Demon Moon",
  },
  dantooine: {
    pos: [72, 56], size: 46,
    disc: "radial-gradient(circle at 32% 30%, #c4d8ec 0%, #6e94b4 45%, #28415c 100%)",
    glow: "rgba(160,210,250,0.45)", tag: "Jedi Ruins",
  },
  telos: {
    pos: [83, 36], size: 44,
    disc: "radial-gradient(circle at 33% 30%, #88c4d8 0%, #3c7488 48%, #122a34 100%)",
    glow: "rgba(120,210,240,0.45)", tag: "Restoration World",
  },
  malachor_v: {
    pos: [91, 68], size: 50,
    disc: "radial-gradient(circle at 35% 32%, #7aa86a 0%, #3a5230 45%, #0e160a 100%), radial-gradient(circle, #1a241a, #060906)",
    glow: "rgba(140,255,150,0.5)", tag: "The Shattered World",
  },
};

/** Campaign order, for the dotted hyperspace route. */
const ROUTE = ["korriban", "dromund_kaas", "ziost", "nar_shaddaa", "onderon", "dxun", "dantooine", "telos", "malachor_v"];

/** Arrival flags — flipping these starts/advances the act main quests. */
const ARRIVAL_FLAGS: Record<string, string> = {
  nar_shaddaa: "act2_arrived_nar",
  onderon: "act2_arrived_onderon",
  dxun: "act3_arrived_dxun",
  dantooine: "act3_arrived_dantooine",
  telos: "act4_arrived_telos",
  malachor_v: "act5_arrived_malachor",
};

export function GalaxyMap() {
  const world = useGameStore((s) => s.world);
  const character = useGameStore((s) => s.character);
  const setWorldField = useGameStore((s) => s.setWorldField);
  const setQuestFlag = useGameStore((s) => s.setQuestFlag);
  const closePanel = useGameStore((s) => s.closePanel);
  const showToast = useGameStore((s) => s.showToast);
  const [hovered, setHovered] = useState<string | null>(null);

  const stars = useMemo(() => makeStars(90), []);

  if (!world || !character) return null;

  const currentPlanet = PLANETS.find((p) => p.zoneIds.includes(world.zoneId));

  const handleTravel = (planet: PlanetDefinition) => {
    if (!isPlanetUnlocked(planet, world.completedQuests)) {
      showToast("This planet is not yet available.", "warn");
      return;
    }
    if (currentPlanet?.id === planet.id) {
      showToast("You are already here.", "info");
      closePanel();
      return;
    }
    if (!world.discoveredZones.includes(planet.startingZoneId)) {
      setWorldField("discoveredZones", [
        ...world.discoveredZones,
        planet.startingZoneId,
      ]);
    }
    setWorldField("zoneId", planet.startingZoneId);
    showToast(`Traveled to ${planet.name}`, "info");
    const arrivalFlag = ARRIVAL_FLAGS[planet.id];
    if (arrivalFlag && !world.questFlags[arrivalFlag]) {
      setQuestFlag(arrivalFlag, true);
    }
    closePanel();
  };

  const hoveredPlanet = hovered ? PLANETS.find((p) => p.id === hovered) : null;
  const hoveredUnlocked = hoveredPlanet
    ? isPlanetUnlocked(hoveredPlanet, world.completedQuests)
    : false;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-void-950/90 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-5xl rounded border border-gilt-600/30 bg-void-900/95 shadow-panel overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-gilt-600/20 px-6 py-3">
          <h2 className="heading-display text-xl tracking-widest text-gilt-400">
            Galaxy Map
          </h2>
          <button
            onClick={closePanel}
            className="rounded px-3 py-1 text-sm text-ash-400 transition-colors hover:bg-void-800 hover:text-ash-200"
          >
            Close (Esc)
          </button>
        </div>

        {/* Star chart */}
        <div className="relative h-[26rem] sm:h-[30rem]">
          {/* Deep space backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 30% 20%, #131228 0%, #0a0a18 55%, #050510 100%)",
            }}
          />
          {/* Nebula washes */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(ellipse 45% 35% at 22% 45%, rgba(170,70,40,0.16) 0%, transparent 70%),
                radial-gradient(ellipse 50% 40% at 55% 30%, rgba(90,90,200,0.14) 0%, transparent 70%),
                radial-gradient(ellipse 45% 40% at 85% 60%, rgba(70,170,110,0.12) 0%, transparent 70%)
              `,
            }}
          />
          {/* Starfield */}
          <div className="absolute inset-0" style={{ backgroundImage: stars }} />
          {/* Galactic plane band */}
          <div
            className="absolute inset-x-0 opacity-25"
            style={{
              top: "42%", height: "16%",
              background:
                "linear-gradient(to bottom, transparent, rgba(190,180,220,0.12), transparent)",
              transform: "rotate(-6deg) scale(1.2)",
            }}
          />

          {/* Hyperspace route */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {ROUTE.slice(0, -1).map((id, i) => {
              const a = PLANET_VISUALS[id];
              const b = PLANET_VISUALS[ROUTE[i + 1]!];
              if (!a || !b) return null;
              return (
                <line
                  key={id}
                  x1={`${a.pos[0]}%`} y1={`${a.pos[1]}%`}
                  x2={`${b.pos[0]}%`} y2={`${b.pos[1]}%`}
                  stroke="rgba(200,180,120,0.22)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
              );
            })}
          </svg>

          {/* Planets */}
          {PLANETS.map((planet) => {
            const v = PLANET_VISUALS[planet.id];
            if (!v) return null;
            const unlocked = isPlanetUnlocked(planet, world.completedQuests);
            const isCurrent = currentPlanet?.id === planet.id;
            return (
              <button
                key={planet.id}
                onClick={() => handleTravel(planet)}
                onMouseEnter={() => setHovered(planet.id)}
                onMouseLeave={() => setHovered((h) => (h === planet.id ? null : h))}
                disabled={!unlocked}
                className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${v.pos[0]}%`, top: `${v.pos[1]}%` }}
              >
                {/* Orbit ring for the current planet */}
                {isCurrent && (
                  <span
                    className="absolute rounded-full border border-gilt-400/60 animate-pulse"
                    style={{
                      width: v.size + 18, height: v.size + 18,
                      top: -9, left: "50%", transform: "translateX(-50%)",
                    }}
                  />
                )}
                {/* Disc */}
                <span
                  className="relative rounded-full transition-transform duration-200 group-hover:scale-110"
                  style={{
                    width: v.size,
                    height: v.size,
                    background: v.disc,
                    boxShadow: unlocked
                      ? `0 0 ${isCurrent ? 26 : 14}px ${v.glow}`
                      : "none",
                    filter: unlocked ? "none" : "grayscale(0.9) brightness(0.45)",
                  }}
                >
                  {/* Terminator shadow */}
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 68% 70%, rgba(0,0,0,0.55) 0%, transparent 60%)",
                    }}
                  />
                </span>
                {/* Label */}
                <span
                  className={`mt-1.5 text-[11px] tracking-wide font-medium transition-colors ${
                    isCurrent
                      ? "text-gilt-300"
                      : unlocked
                        ? "text-ash-300 group-hover:text-gilt-400"
                        : "text-ash-600"
                  }`}
                >
                  {unlocked ? planet.name : "???"}
                </span>
                <span className="text-[9px] text-ash-500">
                  {unlocked ? `Lv ${planet.levelRange[0]}-${planet.levelRange[1]}` : "🔒"}
                </span>
              </button>
            );
          })}

          {/* Hover info card */}
          {hoveredPlanet && (
            <div className="absolute bottom-3 left-4 right-4 sm:right-auto sm:w-96 rounded border border-gilt-600/25 bg-void-950/85 backdrop-blur-sm px-4 py-3 pointer-events-none">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gilt-300 font-medium">
                  {hoveredUnlocked ? hoveredPlanet.name : "Unknown World"}
                </span>
                {hoveredUnlocked && (
                  <span className="text-[10px] uppercase tracking-widest text-ash-500">
                    {PLANET_VISUALS[hoveredPlanet.id]?.tag}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-ash-400 leading-relaxed">
                {hoveredUnlocked
                  ? hoveredPlanet.description
                  : "Navigation data unavailable. Advance the campaign to chart a route."}
              </p>
            </div>
          )}
        </div>

        {/* Footer — current location */}
        <div className="relative z-10 border-t border-gilt-600/20 px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
          <span className="text-ash-500">
            Current:&nbsp;
            <span className="text-gilt-400">{currentPlanet?.name ?? "Deep Space"}</span>
            <span className="text-ash-600"> · {ZONE_MAP.get(world.zoneId)?.name ?? world.zoneId}</span>
          </span>
          <span className="text-ash-600">
            Click an unlocked world to travel. Locked worlds open as the story advances.
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function makeStars(count: number): string {
  const layers: string[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    const x = (rnd() * 100).toFixed(1);
    const y = (rnd() * 100).toFixed(1);
    const size = (0.5 + rnd() * 1.4).toFixed(1);
    const a = (0.2 + rnd() * 0.6).toFixed(2);
    layers.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(255,245,230,${a}) 50%, transparent 50%)`,
    );
  }
  return layers.join(",");
}

function isPlanetUnlocked(
  planet: PlanetDefinition,
  completedQuests: string[],
): boolean {
  if (planet.available) return true;
  if (!planet.unlockQuestId) return false;
  return completedQuests.includes(planet.unlockQuestId);
}
