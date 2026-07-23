"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SceneRenderer, SceneLayer, SceneTransition } from "./SceneRenderer";
import { useAccessibilityStore } from "@/game/store/accessibility-store";
import { Particles, LightRays, FogLayer, StormFlash } from "./particles/Particles";
import { KorribanExteriorScene } from "./korriban/KorribanExterior";
import { useGameStore } from "@/game/store/game-store";
import { ZONE_MAP } from "@/game/data/zones/all-zones";

/**
 * Dynamic scene router — renders the correct 2D scene based on the current zone.
 *
 * Each planet/zone has a sceneId that maps to a specific scene component.
 * For zones without dedicated scenes, a procedural scene is generated
 * from gradient palettes per planet.
 */
export function DynamicScene() {
  const zoneId = useGameStore((s) => s.world?.zoneId);
  const zone = zoneId ? ZONE_MAP.get(zoneId) : null;
  const sceneId = zone?.sceneId ?? "korriban_exterior";

  return (
    <AnimatePresence mode="wait">
      <SceneTransition sceneKey={sceneId}>
        <SceneForId sceneId={sceneId} />
      </SceneTransition>
    </AnimatePresence>
  );
}

function SceneForId({ sceneId }: { sceneId: string }) {
  // Dedicated scenes
  if (sceneId === "korriban_exterior") return <KorribanExteriorScene />;

  // Procedural planet scenes
  const palette = PLANET_PALETTES[sceneId] ?? PLANET_PALETTES["default"]!;
  return <ProceduralScene palette={palette} sceneId={sceneId} />;
}

// ─── Planet color palettes ─────────────────────────────────────────

interface PlanetPalette {
  sky: [string, string, string];
  ground: [string, string];
  accent: string;
  fogColor: string;
  fogOpacity: number;
  particles: boolean;
  lightRays: boolean;
  starField: boolean;
  /** Falling rain streaks (storm worlds). */
  rain?: boolean;
  /** Periodic sky lightning strobe. */
  lightning?: boolean;
}

// Palettes tuned to the films' / KOTOR's look for each world: Korriban is
// rust-orange canyon under a hazy ochre sky, Dantooine golden grassland under
// blue, Dxun green jungle mist, Malachor V the sickly storm-green of KOTOR 2,
// Nar Shaddaa amber smog cut by neon. Values are intentionally brighter than
// before — the scene vignette darkens them back into mood.
const PLANET_PALETTES: Record<string, PlanetPalette> = {
  // Korriban — rust canyons under a burning ochre sky; blood-red stone.
  // Higher contrast than the rest of the galaxy: this world should feel hot.
  korriban_exterior: { sky: ["#241008", "#48220e", "#7a3d1c"], ground: ["#3a1c10", "#1c0d08"], accent: "rgba(255,140,70,0.45)", fogColor: "rgba(180,80,40,0.18)", fogOpacity: 0.4, particles: true, lightRays: true, starField: false },
  korriban_interior: { sky: ["#1d0e08", "#33190c", "#4c2410"], ground: ["#2c150a", "#150b05"], accent: "rgba(255,110,55,0.55)", fogColor: "rgba(170,60,30,0.18)", fogOpacity: 0.45, particles: true, lightRays: false, starField: false },
  korriban_valley: { sky: ["#330f04", "#642a0c", "#a85a22"], ground: ["#48220e", "#200e06"], accent: "rgba(255,160,80,0.6)", fogColor: "rgba(200,95,45,0.22)", fogOpacity: 0.5, particles: true, lightRays: true, starField: false },
  korriban_tomb: { sky: ["#150806", "#260f0a", "#3a1610"], ground: ["#200d06", "#0e0503"], accent: "rgba(255,85,45,0.6)", fogColor: "rgba(150,50,25,0.28)", fogOpacity: 0.7, particles: true, lightRays: false, starField: false },
  korriban_arena: { sky: ["#361506", "#5c2c10", "#8e4c1e"], ground: ["#4a2410", "#22100a"], accent: "rgba(255,170,85,0.55)", fogColor: "rgba(190,95,40,0.14)", fogOpacity: 0.3, particles: true, lightRays: true, starField: false },
  korriban_mines: { sky: ["#170c06", "#241307", "#331c0a"], ground: ["#1e0f07", "#0d0603"], accent: "rgba(255,150,60,0.5)", fogColor: "rgba(130,65,30,0.32)", fogOpacity: 0.6, particles: true, lightRays: false, starField: false },

  // Dromund Kaas — perpetual storm over the Imperial capital. Slate-blue
  // rain skies, violet lightning, black durasteel spires (SWTOR look).
  dromund_kaas_spaceport: { sky: ["#0d1220", "#1c2738", "#324358"], ground: ["#1e2433", "#0f121a"], accent: "rgba(150,160,255,0.45)", fogColor: "rgba(90,110,160,0.14)", fogOpacity: 0.4, particles: false, lightRays: false, starField: false, rain: true, lightning: true },
  dromund_kaas_citadel: { sky: ["#100c1e", "#201936", "#36294e"], ground: ["#221b32", "#110d1a"], accent: "rgba(190,130,255,0.5)", fogColor: "rgba(120,90,180,0.14)", fogOpacity: 0.4, particles: false, lightRays: false, starField: false, rain: true, lightning: true },
  dromund_kaas_jungle: { sky: ["#0b1216", "#16262c", "#27424a"], ground: ["#131e15", "#090f0a"], accent: "rgba(170,150,255,0.4)", fogColor: "rgba(70,120,110,0.18)", fogOpacity: 0.5, particles: true, lightRays: false, starField: false, rain: true, lightning: true },
  dromund_kaas_temple: { sky: ["#120e1e", "#241a34", "#3c2a50"], ground: ["#1e1628", "#0e0a14"], accent: "rgba(205,115,255,0.5)", fogColor: "rgba(130,70,180,0.18)", fogOpacity: 0.5, particles: true, lightRays: false, starField: false, rain: true, lightning: true },
  // Kaas City Bazaar — lantern-lit market under the storm; warmer ambers
  // against the slate sky so it reads as shelter.
  dromund_kaas_market: { sky: ["#11131f", "#222638", "#3a3c50"], ground: ["#241d1a", "#120e0c"], accent: "rgba(255,190,110,0.5)", fogColor: "rgba(140,110,80,0.14)", fogOpacity: 0.35, particles: true, lightRays: true, starField: false, rain: true, lightning: true },
  // Temple Sanctum — storm-free crypt; cold violet wards in dead air.
  dromund_kaas_sanctum: { sky: ["#0c0a16", "#181226", "#261c3a"], ground: ["#161020", "#0a0712"], accent: "rgba(170,120,255,0.6)", fogColor: "rgba(100,70,160,0.22)", fogOpacity: 0.6, particles: true, lightRays: false, starField: false },
  // The Undercroft — drowned foundations; sickly teal work-lights.
  dromund_kaas_undercroft: { sky: ["#0a1012", "#14201f", "#20302c"], ground: ["#121a16", "#080d0a"], accent: "rgba(110,220,190,0.45)", fogColor: "rgba(60,120,100,0.25)", fogOpacity: 0.65, particles: true, lightRays: false, starField: false },

  // Nar Shaddaa — amber smog and neon canyons
  nar_shaddaa_promenade: { sky: ["#141226", "#262044", "#403061"], ground: ["#1e1830", "#120e1e"], accent: "rgba(90,210,255,0.45)", fogColor: "rgba(90,80,160,0.18)", fogOpacity: 0.4, particles: true, lightRays: true, starField: false },
  nar_shaddaa_cantina: { sky: ["#221229", "#3a1c46", "#522860"], ground: ["#241328", "#120a14"], accent: "rgba(220,120,255,0.5)", fogColor: "rgba(140,60,170,0.2)", fogOpacity: 0.5, particles: false, lightRays: false, starField: false },
  nar_shaddaa_market: { sky: ["#241a14", "#42301e", "#64482a"], ground: ["#2c2014", "#16100a"], accent: "rgba(255,190,70,0.5)", fogColor: "rgba(190,130,50,0.18)", fogOpacity: 0.3, particles: true, lightRays: true, starField: false },
  nar_shaddaa_lower: { sky: ["#101418", "#1a2228", "#263238"], ground: ["#141a16", "#0a0e0c"], accent: "rgba(90,220,120,0.4)", fogColor: "rgba(50,110,60,0.25)", fogOpacity: 0.6, particles: true, lightRays: false, starField: false },
  nar_shaddaa_exchange: { sky: ["#1e1014", "#321820", "#48202c"], ground: ["#241218", "#12090c"], accent: "rgba(255,80,90,0.5)", fogColor: "rgba(170,50,50,0.2)", fogOpacity: 0.5, particles: false, lightRays: true, starField: false },

  // Onderon — walled city at golden hour
  onderon_city: { sky: ["#1c2440", "#3e3a58", "#8a5638"], ground: ["#34281a", "#1a140d"], accent: "rgba(255,200,120,0.45)", fogColor: "rgba(190,140,80,0.14)", fogOpacity: 0.3, particles: false, lightRays: true, starField: true },
  onderon_palace: { sky: ["#202036", "#3c3654", "#6a4c3a"], ground: ["#322618", "#19130c"], accent: "rgba(255,215,140,0.5)", fogColor: "rgba(200,160,90,0.12)", fogOpacity: 0.2, particles: false, lightRays: true, starField: false },
  onderon_undercity: { sky: ["#121418", "#1e2226", "#2a3034"], ground: ["#181a14", "#0c0e0a"], accent: "rgba(140,200,130,0.4)", fogColor: "rgba(70,120,70,0.2)", fogOpacity: 0.5, particles: true, lightRays: false, starField: false },

  // Dxun — dense jungle under storm light
  dxun_jungle: { sky: ["#0e1c14", "#1a3522", "#2a5232"], ground: ["#16240f", "#0b1208"], accent: "rgba(110,230,120,0.45)", fogColor: "rgba(50,140,70,0.25)", fogOpacity: 0.6, particles: true, lightRays: true, starField: false },
  dxun_mando_camp: { sky: ["#141c1e", "#243236", "#3a4c50"], ground: ["#202418", "#10120c"], accent: "rgba(230,180,80,0.45)", fogColor: "rgba(110,100,50,0.16)", fogOpacity: 0.4, particles: false, lightRays: true, starField: false },
  dxun_sith_tomb: { sky: ["#160e1c", "#241430", "#341c44"], ground: ["#1c1024", "#0e0812"], accent: "rgba(190,90,230,0.5)", fogColor: "rgba(110,40,140,0.25)", fogOpacity: 0.7, particles: true, lightRays: false, starField: false },

  // Dantooine — golden grass, wide blue sky
  dantooine_enclave: { sky: ["#1c3450", "#34587a", "#5c84a4"], ground: ["#2e3018", "#171a0e"], accent: "rgba(150,210,250,0.4)", fogColor: "rgba(100,150,190,0.12)", fogOpacity: 0.3, particles: false, lightRays: true, starField: false },
  dantooine_plains: { sky: ["#22405e", "#3e6890", "#6f9cc0"], ground: ["#3a3a1a", "#1d1e10"], accent: "rgba(240,220,130,0.45)", fogColor: "rgba(150,170,120,0.12)", fogOpacity: 0.2, particles: false, lightRays: true, starField: false },
  dantooine_crystal_cave: { sky: ["#10182e", "#1c2c50", "#2c4474"], ground: ["#141a26", "#0a0e16"], accent: "rgba(140,200,255,0.6)", fogColor: "rgba(70,110,200,0.2)", fogOpacity: 0.5, particles: true, lightRays: true, starField: false },
  dantooine_sublevel: { sky: ["#12141c", "#1e2230", "#2a3044"], ground: ["#181a20", "#0c0e12"], accent: "rgba(110,160,220,0.4)", fogColor: "rgba(60,80,120,0.2)", fogOpacity: 0.5, particles: false, lightRays: false, starField: false },

  // Telos — restored skies over Citadel steel
  telos_citadel: { sky: ["#16222e", "#28405a", "#3e6184"], ground: ["#222830", "#11151a"], accent: "rgba(110,190,250,0.45)", fogColor: "rgba(70,130,190,0.12)", fogOpacity: 0.3, particles: false, lightRays: true, starField: true },
  telos_surface: { sky: ["#1e2c30", "#36505a", "#557884"], ground: ["#28301e", "#141810"], accent: "rgba(170,210,150,0.45)", fogColor: "rgba(120,140,90,0.16)", fogOpacity: 0.4, particles: true, lightRays: true, starField: false },
  telos_rakata_lab: { sky: ["#1a1224", "#2c1e3c", "#402c54"], ground: ["#201730", "#100b18"], accent: "rgba(190,110,240,0.5)", fogColor: "rgba(110,50,150,0.2)", fogOpacity: 0.5, particles: true, lightRays: true, starField: false },

  // Malachor V — the storm-green graveyard of KOTOR 2
  malachor_surface: { sky: ["#0e140e", "#1c2a1a", "#2c4228"], ground: ["#161c12", "#0a0d08"], accent: "rgba(140,255,150,0.45)", fogColor: "rgba(70,140,70,0.25)", fogOpacity: 0.7, particles: true, lightRays: false, starField: true },
  malachor_depths: { sky: ["#0a100c", "#142018", "#1e3022"], ground: ["#10140c", "#070906"], accent: "rgba(110,230,130,0.55)", fogColor: "rgba(55,120,60,0.3)", fogOpacity: 0.8, particles: true, lightRays: false, starField: false },
  malachor_ghost_ship: { sky: ["#101c1e", "#1c3236", "#2a4a50"], ground: ["#142022", "#0a1012"], accent: "rgba(100,230,210,0.45)", fogColor: "rgba(50,130,110,0.2)", fogOpacity: 0.6, particles: true, lightRays: false, starField: false },
  malachor_trayus: { sky: ["#180c10", "#2c1218", "#441a22"], ground: ["#220e12", "#110709"], accent: "rgba(255,70,80,0.55)", fogColor: "rgba(170,40,40,0.25)", fogOpacity: 0.7, particles: true, lightRays: true, starField: false },

  // Ziost — frozen ancient Sith world: pale steel skies, black stone, ice and
  // aurora cyan. A dead-cold counterpoint to Korriban's heat.
  ziost_spaceport: { sky: ["#16202c", "#27384a", "#48637e"], ground: ["#222d38", "#0e141c"], accent: "rgba(150,220,255,0.5)", fogColor: "rgba(120,170,210,0.16)", fogOpacity: 0.4, particles: true, lightRays: true, starField: true },
  ziost_citadel: { sky: ["#141a26", "#222c3e", "#36445c"], ground: ["#1a2230", "#0c1018"], accent: "rgba(130,200,255,0.5)", fogColor: "rgba(90,140,190,0.16)", fogOpacity: 0.4, particles: true, lightRays: false, starField: true },
  ziost_wastes: { sky: ["#1e2c3a", "#3a5670", "#7ea0bc"], ground: ["#26343f", "#121a20"], accent: "rgba(190,230,255,0.55)", fogColor: "rgba(160,200,230,0.2)", fogOpacity: 0.55, particles: true, lightRays: true, starField: false },
  ziost_tomb: { sky: ["#0e141c", "#162230", "#223444"], ground: ["#161e26", "#0a0e12"], accent: "rgba(120,220,235,0.55)", fogColor: "rgba(70,140,160,0.22)", fogOpacity: 0.65, particles: true, lightRays: false, starField: false },

  // Tomb of Ragnos (Korriban dungeon) — blood-red crypt, deepening toward the
  // sanctum; the vault warms to gold treasure-light.
  dungeon_ragnos_entry: { sky: ["#1a0c08", "#2e150c", "#4a2410"], ground: ["#241008", "#100704"], accent: "rgba(255,110,55,0.5)", fogColor: "rgba(160,55,28,0.24)", fogOpacity: 0.6, particles: true, lightRays: false, starField: false },
  dungeon_ragnos_halls: { sky: ["#160a07", "#260f0a", "#3a1610"], ground: ["#200d06", "#0c0503"], accent: "rgba(255,90,48,0.55)", fogColor: "rgba(150,50,25,0.28)", fogOpacity: 0.7, particles: true, lightRays: false, starField: false },
  dungeon_ragnos_puzzle: { sky: ["#180b0c", "#2a1014", "#401820"], ground: ["#220e10", "#100608"], accent: "rgba(255,80,90,0.5)", fogColor: "rgba(160,45,55,0.26)", fogOpacity: 0.65, particles: true, lightRays: false, starField: false },
  dungeon_ragnos_guardian: { sky: ["#140807", "#240d0a", "#38130e"], ground: ["#1e0c06", "#0c0503"], accent: "rgba(255,120,60,0.6)", fogColor: "rgba(150,55,25,0.3)", fogOpacity: 0.7, particles: true, lightRays: false, starField: false },
  dungeon_ragnos_sanctum: { sky: ["#120606", "#200a0a", "#341010"], ground: ["#1a0906", "#0a0403"], accent: "rgba(255,70,55,0.65)", fogColor: "rgba(150,35,25,0.32)", fogOpacity: 0.8, particles: true, lightRays: false, starField: false },
  dungeon_ragnos_vault: { sky: ["#1c1008", "#321c0c", "#4e2e12"], ground: ["#281708", "#120a04"], accent: "rgba(255,190,90,0.6)", fogColor: "rgba(190,120,45,0.2)", fogOpacity: 0.45, particles: true, lightRays: true, starField: false },

  // Cathedral of Hunger (Malachor dungeon) — sickly void green sliding to
  // purple at the relic-heart; the Void itself is near-black starvation.
  dungeon_cathedral_entry: { sky: ["#0c120e", "#16221a", "#243628"], ground: ["#101610", "#070b08"], accent: "rgba(130,240,150,0.5)", fogColor: "rgba(60,130,70,0.28)", fogOpacity: 0.7, particles: true, lightRays: false, starField: false },
  dungeon_cathedral_nave: { sky: ["#0c0e16", "#161826", "#262540"], ground: ["#121018", "#08060c"], accent: "rgba(150,120,255,0.5)", fogColor: "rgba(90,70,160,0.26)", fogOpacity: 0.7, particles: true, lightRays: false, starField: false },
  dungeon_cathedral_puzzle: { sky: ["#100c1a", "#1e162e", "#2e2244"], ground: ["#160f22", "#0a0712"], accent: "rgba(180,110,240,0.5)", fogColor: "rgba(110,55,160,0.26)", fogOpacity: 0.7, particles: true, lightRays: false, starField: false },
  dungeon_cathedral_altar: { sky: ["#0a100c", "#142018", "#1e3022"], ground: ["#0e1410", "#060906"], accent: "rgba(110,230,130,0.55)", fogColor: "rgba(50,120,60,0.3)", fogOpacity: 0.8, particles: true, lightRays: false, starField: false },
  dungeon_cathedral_void: { sky: ["#06080a", "#0e1212", "#181e1c"], ground: ["#080a0a", "#040605"], accent: "rgba(120,250,200,0.5)", fogColor: "rgba(40,120,100,0.35)", fogOpacity: 0.9, particles: true, lightRays: false, starField: false },
  dungeon_cathedral_heart: { sky: ["#100814", "#1e0e26", "#301640"], ground: ["#160a1c", "#0a0510"], accent: "rgba(200,90,240,0.6)", fogColor: "rgba(120,40,150,0.28)", fogOpacity: 0.7, particles: true, lightRays: true, starField: false },

  // Player ship interior — cool console-blue bridge, dim amber cargo hold,
  // warm violet crew quarters.
  ship_bridge: { sky: ["#0c1018", "#162232", "#243a52"], ground: ["#141a24", "#0a0e14"], accent: "rgba(110,190,250,0.5)", fogColor: "rgba(60,110,170,0.14)", fogOpacity: 0.3, particles: false, lightRays: false, starField: true },
  ship_hold: { sky: ["#14110c", "#221c14", "#322820"], ground: ["#1a160e", "#0c0a06"], accent: "rgba(230,180,90,0.45)", fogColor: "rgba(120,95,55,0.16)", fogOpacity: 0.4, particles: true, lightRays: false, starField: false },
  ship_quarters: { sky: ["#161018", "#241828", "#382440"], ground: ["#1c151f", "#0e0a10"], accent: "rgba(200,150,230,0.45)", fogColor: "rgba(110,80,140,0.16)", fogOpacity: 0.35, particles: false, lightRays: false, starField: false },

  default: { sky: ["#121226", "#202044", "#303060"], ground: ["#1c1820", "#0e0c12"], accent: "rgba(130,130,230,0.4)", fogColor: "rgba(80,80,150,0.16)", fogOpacity: 0.4, particles: false, lightRays: false, starField: true },
};

/**
 * Public lookup so other systems (combat backdrop, map tinting) can match
 * the scene's mood without re-declaring colors.
 */
export function getScenePalette(sceneId: string | undefined): PlanetPalette {
  return PLANET_PALETTES[sceneId ?? ""] ?? PLANET_PALETTES["default"]!;
}

export type { PlanetPalette };

// ─── Ambient life ──────────────────────────────────────────────────
//
// A thin layer of slow-moving set dressing that makes the sky feel alive:
// distant traffic over cities, flyer flocks over jungles, embers rising
// in fire-lit interiors. Deliberately low-opacity and slow so it reads as
// atmosphere, never distraction. Fully disabled under reduced-motion.

function withAlpha(color: string, alpha: number): string {
  // Palette accents are "rgba(r,g,b,a)" — swap the trailing alpha.
  return color.replace(/[\d.]+\)$/, `${alpha})`);
}

function AmbientLife({
  h,
  palette,
  isCity,
  isNarShaddaa,
  isJungle,
  isInterior,
}: {
  h: number;
  palette: PlanetPalette;
  isCity: boolean;
  isNarShaddaa: boolean;
  isJungle: boolean;
  isInterior: boolean;
}) {
  const reducedMotion = useAccessibilityStore((s) => s.reducedMotion);
  if (reducedMotion) return null;

  const accent = palette.accent;
  const showShips = (isCity || isNarShaddaa) && !isInterior;
  const showFlock = isJungle && !isInterior;

  return (
    <SceneLayer depth={0.1}>
      {/* Distant traffic streaking across the skyline */}
      {showShips &&
        [0, 1, 2].map((i) => {
          const ltr = i % 2 === 0;
          return (
            <motion.div
              key={`ship-${i}`}
              className="absolute"
              style={{ top: `${12 + i * 7 + (h % 5)}%` }}
              initial={{ left: ltr ? "-10%" : "110%" }}
              animate={{ left: ltr ? "110%" : "-10%" }}
              transition={{
                duration: 24 + i * 9,
                repeat: Infinity,
                ease: "linear",
                delay: i * 5,
              }}
            >
              <div
                style={{
                  width: 22 + (h % 12),
                  height: 3,
                  borderRadius: 3,
                  background: `linear-gradient(90deg, transparent, ${withAlpha(accent, 0.55)}, transparent)`,
                  boxShadow: `0 0 8px ${withAlpha(accent, 0.4)}`,
                }}
              />
            </motion.div>
          );
        })}

      {/* Jungle flyers — a loose V of dark specks drifting over the canopy */}
      {showFlock &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={`fly-${i}`}
            className="absolute"
            style={{
              top: `${18 + (i % 2) * 4}%`,
              fontSize: 8 + (i % 2) * 3,
              color: withAlpha(accent, 0.5),
              textShadow: `0 0 4px ${withAlpha(accent, 0.3)}`,
            }}
            initial={{ left: "-6%" }}
            animate={{ left: "106%", top: `${22 + (i % 3) * 3}%` }}
            transition={{
              duration: 38 + i * 3,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.6,
            }}
          >
            ⌃
          </motion.div>
        ))}

      {/* Fire-lit interiors: a few embers rising and winking out */}
      {isInterior &&
        [10, 34, 58, 82].map((x, i) => (
          <div
            key={`ember-${i}`}
            className="absolute animate-ember"
            style={{
              bottom: "30%",
              left: `${x + (h % 6)}%`,
              width: 2,
              height: 2,
              borderRadius: 9999,
              background: withAlpha(accent, 0.8),
              boxShadow: `0 0 5px ${withAlpha(accent, 0.6)}`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${2.4 + (i % 3) * 0.6}s`,
            }}
          />
        ))}
    </SceneLayer>
  );
}

// ─── Procedural Scene ──────────────────────────────────────────────

function ProceduralScene({
  palette,
  sceneId,
}: {
  palette: PlanetPalette;
  sceneId: string;
}) {
  const h = hashScene(sceneId);
  const isInterior = sceneId.includes("interior") || sceneId.includes("tomb") ||
    sceneId.includes("cantina") || sceneId.includes("lab") ||
    sceneId.includes("sublevel") || sceneId.includes("cave") ||
    sceneId.includes("sanctum") || sceneId.includes("undercroft") ||
    sceneId.includes("mines");
  const isCity = sceneId.includes("city") || sceneId.includes("promenade") ||
    sceneId.includes("market") || sceneId.includes("exchange") ||
    sceneId.includes("palace") || sceneId.includes("citadel") ||
    sceneId.includes("spaceport");
  const isJungle = sceneId.includes("jungle") || sceneId.includes("dxun");
  const isMalachor = sceneId.includes("malachor");
  const isNarShaddaa = sceneId.includes("nar_shaddaa");
  const isKaas = sceneId.includes("dromund_kaas");
  const isKorriban = sceneId.includes("korriban");
  // Korriban gets bespoke set dressing per zone (statues, tiers, beams…)
  const isKorribanValley = sceneId === "korriban_valley";
  const isKorribanArena = sceneId === "korriban_arena";
  const isKorribanMines = sceneId === "korriban_mines";
  const isKorribanTomb = sceneId === "korriban_tomb";

  // Accent color variant for lighter use
  const accentLight = palette.accent.replace(/[\d.]+\)$/, "0.12)");
  const accentMid   = palette.accent.replace(/[\d.]+\)$/, "0.25)");

  return (
    <SceneRenderer parallax parallaxIntensity={1.4}>

      {/* L0: Sky — rich gradient + nebula washes + subtle star band */}
      <SceneLayer depth={0}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${palette.sky[0]} 0%, ${palette.sky[1]} 40%, ${palette.sky[2]} 100%)`,
          }}
        />
        {/* Three nebula washes */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 75% 55% at ${28 + (h % 44)}% 18%, ${palette.accent} 0%, transparent 58%),
              radial-gradient(ellipse 55% 42% at ${62 + (h % 28)}% ${12 + (h % 18)}%, ${accentMid} 0%, transparent 52%),
              radial-gradient(ellipse 40% 35% at ${80 + (h % 15)}% ${25 + (h % 20)}%, ${accentLight} 0%, transparent 48%)
            `,
          }}
        />
        {/* Horizon atmospheric haze */}
        <div
          className="absolute inset-x-0"
          style={{
            top: "48%", height: "18%",
            background: `linear-gradient(to bottom, transparent, ${palette.fogColor}, transparent)`,
            opacity: 0.45,
          }}
        />
        {/* Cloud bands for outdoor skies */}
        {!isInterior && (
          <div
            className="absolute inset-x-0 top-0 h-[55%]"
            style={{ backgroundImage: generateCloudBands(h, accentLight), opacity: 0.8 }}
          />
        )}
        {/* Storm worlds: periodic lightning strobe high in the sky */}
        {palette.lightning && (
          <StormFlash
            color={palette.accent.replace(/[\d.]+\)$/, "0.5)")}
            intervalSeconds={6 + (h % 5)}
          />
        )}
        {/* Malachor: energy fractures in sky */}
        {isMalachor && (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(${35 + (h % 20)}deg, transparent 48%, ${palette.accent} 49%, transparent 50%),
                linear-gradient(${-20 + (h % 15)}deg, transparent 52%, ${accentMid} 53%, transparent 54%)
              `,
            }}
          />
        )}
      </SceneLayer>

      {/* L1: Star field for outdoor scenes */}
      {palette.starField && !isInterior && (
        <SceneLayer depth={0.05}>
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: generateStarField(h) }} />
          {/* Second denser star layer */}
          <div className="absolute inset-0 opacity-25" style={{ backgroundImage: generateStarField(h + 9999) }} />
        </SceneLayer>
      )}

      {/* L1b: Celestial body — moon or sun for outdoor scenes */}
      {!isInterior && (
        <SceneLayer depth={0.08}>
          {/* Outer glow halo */}
          <div
            className="absolute rounded-full"
            style={{
              width: 80 + (h % 50), height: 80 + (h % 50),
              top: `${6 + (h % 14)}%`, left: `${14 + (h % 58)}%`,
              background: `radial-gradient(circle, ${palette.accent.replace(/[\d.]+\)$/, "0.55)")} 0%, ${accentLight} 45%, transparent 72%)`,
              filter: "blur(8px)",
            }}
          />
          {/* Core */}
          <div
            className="absolute rounded-full"
            style={{
              width: 20 + (h % 14), height: 20 + (h % 14),
              top: `${8 + (h % 14)}%`, left: `${16 + (h % 58)}%`,
              background: `radial-gradient(circle, rgba(255,255,255,0.35) 0%, ${palette.accent.replace(/[\d.]+\)$/, "0.25)")} 55%, transparent 100%)`,
              filter: "blur(2px)",
            }}
          />
          {/* Korriban's twin suns — the zone fiction calls them out */}
          {isKorriban && (
            <>
              <div
                className="absolute rounded-full"
                style={{
                  width: 54 + (h % 20), height: 54 + (h % 20),
                  top: `${14 + (h % 10)}%`, left: `${30 + (h % 40)}%`,
                  background: `radial-gradient(circle, ${palette.accent.replace(/[\d.]+\)$/, "0.5)")} 0%, ${accentLight} 50%, transparent 72%)`,
                  filter: "blur(7px)",
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 13 + (h % 8), height: 13 + (h % 8),
                  top: `${15.5 + (h % 10)}%`, left: `${31.5 + (h % 40)}%`,
                  background: "radial-gradient(circle, rgba(255,236,210,0.5) 0%, rgba(255,170,90,0.3) 55%, transparent 100%)",
                  filter: "blur(1.5px)",
                }}
              />
            </>
          )}
          {/* Nar Shaddaa neon skyline glow at horizon */}
          {isNarShaddaa && (
            <div
              className="absolute inset-x-0"
              style={{
                bottom: "42%", height: "8%",
                background: `linear-gradient(to top, ${palette.accent.replace(/[\d.]+\)$/, "0.40)")} 0%, transparent 100%)`,
                filter: "blur(2px)",
              }}
            />
          )}
        </SceneLayer>
      )}

      {/* L1c: Ambient life — drifting ships / flocks / embers for a living sky */}
      <AmbientLife
        h={h}
        palette={palette}
        isCity={isCity}
        isNarShaddaa={isNarShaddaa}
        isJungle={isJungle}
        isInterior={isInterior}
      />

      {/* L2: Far-distance background silhouettes */}
      <SceneLayer depth={0.12}>
        <div
          className="absolute inset-x-0 bottom-0 h-[58%] opacity-[0.42]"
          style={{
            background: `linear-gradient(to bottom, ${palette.sky[1]}, ${palette.sky[2]})`,
            clipPath: isCity
              ? generateCitySkyline(h + 200, 0)
              : isJungle
                ? generateJungleCanopy(h, 0)
                : generateMountainRange(h, 0),
          }}
        />
        {/* Rock strata lines for mountains */}
        {!isCity && !isJungle && (
          <div
            className="absolute inset-x-0"
            style={{
              bottom: "28%", height: "2px",
              background: `linear-gradient(90deg, transparent 5%, ${accentLight} 20%, transparent 40%, ${accentLight} 70%, transparent 90%)`,
              opacity: 0.3,
            }}
          />
        )}
      </SceneLayer>

      {/* L3: Mid-distance structures or mountains */}
      <SceneLayer depth={0.22}>
        {/* Rim light: an accent-lit sliver above the ridge sells the light
            source and separates the layers (aerial perspective). */}
        <div
          className="absolute inset-x-0 bottom-0 h-[50.8%] opacity-45"
          style={{
            background: `linear-gradient(to bottom, ${accentMid} 0%, transparent 22%)`,
            clipPath: isCity
              ? generateCitySkyline(h, 0)
              : isJungle
                ? generateJungleCanopy(h, 1)
                : generateMountainRange(h, 1),
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[50%] opacity-55"
          style={{
            background: `linear-gradient(to bottom, ${palette.sky[2]} 0%, ${palette.ground[0]} 100%)`,
            clipPath: isCity
              ? generateCitySkyline(h, 0)
              : isJungle
                ? generateJungleCanopy(h, 1)
                : generateMountainRange(h, 1),
          }}
        />
        {/* Illuminated windows on distant buildings (neon moons & storm capitals) */}
        {(isNarShaddaa || (isCity && isKaas)) && (
          <div
            className="absolute inset-x-0 bottom-0 h-[50%] opacity-30"
            style={{
              backgroundImage: generateCityWindows(
                h,
                isKaas ? "rgba(200,170,255,0.65)" : undefined,
              ),
            }}
          />
        )}
      </SceneLayer>

      {/* L3b: Korriban set dressing — bespoke landmarks per zone, so the
          Sith homeworld stops looking like generic procedural canyon. */}
      {isKorribanValley && (
        <SceneLayer depth={0.26}>
          {/* Colossal entombed lords flanking the valley */}
          {[{ left: 4, flip: false }, { left: 81, flip: true }].map((s, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                bottom: "36%", left: `${s.left}%`,
                width: 120 + (h % 24), height: 230 + (h % 36),
                transform: s.flip ? "scaleX(-1)" : undefined,
                opacity: 0.82,
              }}
            >
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to bottom, ${palette.sky[2]} 0%, ${palette.ground[1]} 72%)`,
                clipPath: COLOSSUS_CLIP,
              }} />
              {/* Sun-side rim light */}
              <div className="absolute inset-0" style={{
                background: `linear-gradient(105deg, ${accentMid} 0%, transparent 32%)`,
                clipPath: COLOSSUS_CLIP, opacity: 0.55,
              }} />
              {/* Ember eyes, still watching */}
              {[44, 54].map((x) => (
                <div key={x} className="absolute" style={{
                  top: "6.5%", left: `${x}%`, width: 5, height: 3, borderRadius: 2,
                  background: palette.accent, filter: "blur(1px)",
                }} />
              ))}
            </div>
          ))}
          {/* Tomb doorways cut into the far canyon wall */}
          {[26, 45, 63].map((x, i) => (
            <div key={i} className="absolute" style={{
              bottom: "42%", left: `${x + (h % 4)}%`,
              width: 26 + (i % 2) * 8, height: 38 + (i % 2) * 10,
              background: `linear-gradient(to bottom, ${palette.ground[1]}, #050202)`,
              clipPath: "polygon(18% 100%, 22% 18%, 50% 0%, 78% 18%, 82% 100%)",
              opacity: 0.75,
            }}>
              <div className="absolute inset-x-[44%] top-[16%] bottom-[8%]" style={{
                background: `linear-gradient(to bottom, ${palette.accent.replace(/[\d.]+\)$/, "0.4)")}, transparent)`,
                filter: "blur(1px)",
              }} />
            </div>
          ))}
        </SceneLayer>
      )}

      {isKorribanArena && (
        <SceneLayer depth={0.26}>
          {/* Tiered seating ring around the pit */}
          <div className="absolute inset-x-[2%]" style={{
            bottom: "38%", height: "17%",
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            background: `repeating-linear-gradient(to top, ${palette.ground[1]} 0 8px, ${palette.ground[0]} 8px 14px)`,
            opacity: 0.72,
          }} />
          {/* Sith banners over the stands */}
          {[10, 30, 50, 70, 88].map((x, i) => (
            <div key={i} className="absolute" style={{
              top: `${17 + (i % 2) * 4}%`, left: `${x}%`,
              width: 15, height: 50 + (i % 3) * 10,
              background: "linear-gradient(to bottom, #5a0e14, #8e1620 60%, #4a0a10)",
              clipPath: "polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)",
              opacity: 0.85,
              boxShadow: "0 0 12px rgba(140,20,30,0.35)",
            }}>
              <div className="absolute left-1/2 top-[30%] -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: "rgba(230,180,90,0.8)" }} />
            </div>
          ))}
          {/* Braziers burning at the ring's edge */}
          {[7, 93].map((x, i) => (
            <div key={i} className="absolute animate-pulse" style={{
              bottom: "47%", left: `${x}%`, width: 16, height: 26,
              background: "radial-gradient(ellipse 50% 65% at 50% 85%, rgba(255,150,60,0.85) 0%, rgba(200,60,30,0.4) 50%, transparent 75%)",
              filter: "blur(2px)", animationDuration: `${1.4 + i * 0.5}s`,
            }} />
          ))}
        </SceneLayer>
      )}

      {isKorribanMines && (
        <SceneLayer depth={0.3}>
          {/* Mine support frames with hanging work-lamps */}
          {[14, 40, 66, 88].map((x, i) => (
            <div key={i} className="absolute" style={{
              bottom: "12%", left: `${x}%`, width: "9%",
              height: `${42 + (i % 2) * 8}%`, opacity: 0.85,
            }}>
              <div className="absolute left-0 bottom-0 w-[16%] h-full"
                style={{ background: `linear-gradient(to right, #050201, ${palette.ground[0]})` }} />
              <div className="absolute right-0 bottom-0 w-[16%] h-full"
                style={{ background: `linear-gradient(to left, #050201, ${palette.ground[0]})` }} />
              <div className="absolute top-0 -inset-x-[6%] h-[9%]"
                style={{ background: `linear-gradient(to bottom, ${palette.ground[0]}, #050201)` }} />
              <div className="absolute left-1/2 top-[11%] -translate-x-1/2 w-2 h-2 rounded-full animate-pulse" style={{
                background: "rgba(255,190,110,0.9)",
                boxShadow: "0 0 14px 5px rgba(255,160,70,0.4)",
                animationDuration: `${2 + i * 0.4}s`,
              }} />
            </div>
          ))}
          {/* Raw ore glinting in the rock */}
          <div className="absolute inset-0 opacity-50"
            style={{ backgroundImage: generateOreGlints(h, palette.accent) }} />
        </SceneLayer>
      )}

      {isKorribanTomb && (
        <SceneLayer depth={0.28}>
          {/* Raised sarcophagus at the chamber's heart */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: "30%", width: 150, height: 64, opacity: 0.9 }}>
            <div className="absolute inset-x-[10%] top-0 h-[55%]" style={{
              background: `linear-gradient(to bottom, ${palette.ground[0]}, ${palette.ground[1]})`,
              clipPath: "polygon(8% 100%, 14% 0%, 86% 0%, 92% 100%)",
            }} />
            <div className="absolute inset-x-0 bottom-0 h-[45%]"
              style={{ background: `linear-gradient(to bottom, ${palette.ground[1]}, #040201)` }} />
            <div className="absolute top-[12%] inset-x-[28%] h-px"
              style={{ background: palette.accent, filter: "blur(1px)", opacity: 0.7 }} />
          </div>
          {/* Guardian effigies flanking the bier */}
          {[{ left: 22, flip: false }, { left: 66, flip: true }].map((s, i) => (
            <div key={i} className="absolute" style={{
              bottom: "30%", left: `${s.left}%`, width: 56, height: 110,
              transform: s.flip ? "scaleX(-1)" : undefined, opacity: 0.6,
            }}>
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to bottom, ${palette.ground[0]}, #040201 80%)`,
                clipPath: COLOSSUS_CLIP,
              }} />
            </div>
          ))}
        </SceneLayer>
      )}

      {/* L4: Near structures / foreground silhouettes */}
      <SceneLayer depth={0.32}>
        <div
          className="absolute inset-x-0 bottom-0 h-[44%] opacity-75"
          style={{
            background: `linear-gradient(to bottom, ${palette.ground[0]} 0%, ${palette.ground[1]} 100%)`,
            clipPath: isCity
              ? generateCitySkyline(h, 1)
              : isInterior
                ? generateInteriorWalls(h)
                : isJungle
                  ? generateJungleCanopy(h, 2)
                  : generateMountainRange(h, 2),
          }}
        />

        {/* Interior: ornate pillars with glow */}
        {isInterior && (
          <>
            {[12, 28, 44, 56, 72, 88].map((pct, i) => (
              <div key={i} className="absolute flex flex-col items-center" style={{ bottom: "38%", left: `${pct}%` }}>
                {/* Pillar */}
                <div
                  style={{
                    width: 10, height: 100 + (i % 3) * 20,
                    background: `linear-gradient(to right, ${palette.ground[1]}, ${palette.ground[0]} 40%, ${palette.ground[1]})`,
                    opacity: 0.6,
                  }}
                />
                {/* Torch/flame glow at top */}
                <div
                  style={{
                    width: 20, height: 20,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${palette.accent.replace(/[\d.]+\)$/, "0.6)")} 0%, transparent 70%)`,
                    filter: "blur(3px)",
                    marginTop: -20,
                    opacity: 0.7,
                  }}
                />
              </div>
            ))}
            {/* Arches between pillars */}
            {[20, 50, 80].map((cx, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  bottom: `${58 + (i % 2) * 4}%`,
                  left: `${cx - 8}%`,
                  width: "16%", height: "10%",
                  borderRadius: "50% 50% 0 0",
                  border: `2px solid ${palette.accent.replace(/[\d.]+\)$/, "0.2)")}`,
                  borderBottom: "none",
                  opacity: 0.4,
                }}
              />
            ))}
          </>
        )}

        {/* Korriban: weathered Sith monoliths flanking the mid-ground */}
        {isKorriban && !isInterior && (
          <>
            {[14, 82].map((pct, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  bottom: "40%",
                  left: `${pct + (h % 5)}%`,
                  width: 30 + i * 10,
                  height: 130 + (h % 30) - i * 24,
                  background: `linear-gradient(to right, ${palette.ground[1]}, ${palette.ground[0]} 45%, ${palette.ground[1]})`,
                  clipPath: "polygon(36% 0%, 64% 0%, 80% 7%, 72% 100%, 28% 100%, 20% 7%)",
                  opacity: 0.75,
                }}
              >
                {/* Glowing rune seam down the face */}
                <div
                  className="absolute"
                  style={{
                    top: "16%", bottom: "12%", left: "47%", width: 2,
                    background: `linear-gradient(to bottom, transparent, ${palette.accent.replace(/[\d.]+\)$/, "0.35)")} 40%, transparent)`,
                    filter: "blur(0.5px)",
                  }}
                />
              </div>
            ))}
          </>
        )}

        {/* City: near building details with neon ledges */}
        {isCity && (
          <>
            {[8, 22, 38, 58, 74, 90].map((pct, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  bottom: `${36 + (i % 3) * 4}%`,
                  left: `${pct}%`,
                  width: `${4 + (i % 3) * 2}%`, height: 2,
                  background: `linear-gradient(90deg, transparent, ${palette.accent.replace(/[\d.]+\)$/, "0.5)")}, transparent)`,
                  filter: "blur(1px)",
                }}
              />
            ))}
          </>
        )}
      </SceneLayer>

      {/* L5: Ground plane with material texture */}
      <SceneLayer depth={0.2}>
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background: `linear-gradient(to bottom, ${palette.ground[0]} 0%, ${palette.ground[1]} 100%)`,
          }}
        />
        {/* Surface texture: horizontal striations */}
        <div
          className="absolute inset-x-0 bottom-0 h-[40%] opacity-[0.14]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 10px, ${accentLight} 10px, transparent 11px)
            `,
          }}
        />
        {/* Scattered ground detail: rocks / tufts / debris */}
        <div
          className="absolute inset-x-0 bottom-0 h-[38%]"
          style={{ backgroundImage: generateGroundScatter(h, accentMid), opacity: 0.5 }}
        />
        {/* Worn path converging toward the horizon — anchors the walkable band */}
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            clipPath: `polygon(${46 + (h % 5)}% 0%, ${53 + (h % 5)}% 0%, 82% 100%, 18% 100%)`,
            background: `linear-gradient(to bottom, ${accentLight} 0%, rgba(255,255,255,0.045) 35%, transparent 95%)`,
            opacity: 0.55,
          }}
        />
        {/* Ground light pooling from the accent (bounce light) */}
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{
            background: `radial-gradient(ellipse 60% 55% at 50% 0%, ${accentLight} 0%, transparent 70%)`,
            opacity: 0.8,
          }}
        />
        {/* Malachor: glowing energy cracks in ground */}
        {isMalachor && (
          <div
            className="absolute inset-x-0 bottom-0 h-[40%] opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(${60 + (h % 30)}deg, transparent 46%, ${palette.accent.replace(/[\d.]+\)$/, "0.7)")} 48%, transparent 50%),
                linear-gradient(${-40 + (h % 25)}deg, transparent 52%, ${accentMid} 54%, transparent 56%)
              `,
            }}
          />
        )}
        {/* Jungle: ground vegetation hints */}
        {isJungle && (
          <div
            className="absolute inset-x-0 bottom-0 h-[20%]"
            style={{
              background: `linear-gradient(to top, ${palette.ground[0]}, transparent)`,
              clipPath: generateJungleGround(h),
              opacity: 0.7,
            }}
          />
        )}
        {/* Horizon glow line */}
        <div
          className="absolute inset-x-0 h-[3px]"
          style={{
            top: "60%",
            background: `linear-gradient(90deg, transparent 4%, ${palette.accent} 28%, ${palette.accent.replace(/[\d.]+\)$/, "0.55)")} 50%, ${palette.accent} 72%, transparent 96%)`,
            opacity: 0.55,
            filter: "blur(1px)",
          }}
        />
      </SceneLayer>

      {/* L6: Foreground detail objects */}
      <SceneLayer depth={0.5}>
        {/* Left foreground */}
        <div
          className="absolute opacity-[0.85]"
          style={{
            bottom: "8%", left: `${2 + (h % 8)}%`,
            width: 60 + (h % 40), height: 40 + (h % 28),
            background: `linear-gradient(135deg, ${palette.ground[0]}, ${palette.ground[1]})`,
            clipPath: isJungle ? generateTreeShape(h, 0) : generateRockShape(h, 0),
          }}
        />
        {/* Right foreground */}
        <div
          className="absolute opacity-[0.78]"
          style={{
            bottom: "6%", right: `${3 + ((h >> 5) % 10)}%`,
            width: 50 + ((h >> 3) % 30), height: 32 + ((h >> 3) % 20),
            background: `linear-gradient(225deg, ${palette.ground[0]}, ${palette.ground[1]})`,
            clipPath: isJungle ? generateTreeShape(h + 500, 1) : generateRockShape(h, 1),
          }}
        />
        {/* Center foreground prop for tombs/interiors */}
        {isInterior && (
          <div
            className="absolute opacity-60"
            style={{
              bottom: "8%", left: "46%",
              width: 50, height: 50,
              background: palette.ground[1],
              clipPath: "polygon(50% 0%, 15% 40%, 20% 100%, 80% 100%, 85% 40%)",
            }}
          />
        )}
        {/* Nar Shaddaa: street-level neon panel */}
        {isNarShaddaa && (
          <div
            className="absolute inset-x-0"
            style={{
              bottom: "8%", height: 4,
              background: `linear-gradient(90deg, transparent 5%, ${palette.accent.replace(/[\d.]+\)$/, "0.6)")} 15%, transparent 30%, ${palette.accent.replace(/[\d.]+\)$/, "0.5)")} 45%, transparent 55%, ${palette.accent.replace(/[\d.]+\)$/, "0.7)")} 70%, transparent 85%, ${palette.accent.replace(/[\d.]+\)$/, "0.4)")} 95%, transparent 100%)`,
              filter: "blur(1px)",
            }}
          />
        )}
      </SceneLayer>

      {/* L7: Atmospheric effects */}
      <SceneLayer depth={0.5}>
        {palette.particles && (
          <Particles
            preset={isInterior ? "dust" : isJungle ? "dust" : "embers"}
            count={isInterior ? 18 : 32}
          />
        )}
        {palette.rain && <Particles preset="rain" count={75} />}
      </SceneLayer>
      <SceneLayer depth={0.6}>
        {palette.lightRays && (
          <LightRays color={palette.accent} angle={-15 + (h % 30)} count={isInterior ? 2 : 4} />
        )}
      </SceneLayer>
      {/* Primary fog */}
      <SceneLayer depth={0.3}>
        <FogLayer color={palette.fogColor} speed={38 + palette.fogOpacity * 22} />
      </SceneLayer>
      {/* Counter fog for depth */}
      <SceneLayer depth={0.15}>
        <FogLayer color={palette.fogColor} speed={26 + palette.fogOpacity * 14} direction="left" />
      </SceneLayer>
      {/* Low ground mist — thin wisp only; thick mist flattened the scene */}
      <SceneLayer depth={0.05}>
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "9%",
            background: `linear-gradient(to top, ${palette.fogColor.replace(/[\d.]+\)$/, "0.22)")} 0%, transparent 100%)`,
          }}
        />
      </SceneLayer>

      {/* L8: Cinematic vignette + top darkening (kept light so colors read) */}
      <SceneLayer depth={0}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 50% 52%, transparent 55%, rgba(0,0,0,0.38) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)" }}
        />
      </SceneLayer>
    </SceneRenderer>
  );
}

// ─── Scene hash ──────────────────────────────────────────────────────

function hashScene(sceneId: string): number {
  let hash = 0;
  for (let i = 0; i < sceneId.length; i++) {
    hash = (hash << 5) - hash + sceneId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ─── Star field generator (dense, varied) ───────────────────────────

function generateStarField(h: number): string {
  const stars: string[] = [];
  for (let i = 0; i < 30; i++) {
    const x      = ((h * (i + 1) * 7)  % 97);
    const y      = ((h * (i + 1) * 13) % 42);
    const size   = 0.5 + ((h * (i + 1)) % 4) * 0.45;
    const bright = 0.25 + ((h * (i + 2)) % 6) * 0.13;
    const r = 255, g = 200 + ((h * i) % 56), b = 180 + ((h * (i + 3)) % 76);
    stars.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, rgba(${r},${g},${b},${bright.toFixed(2)}) 50%, transparent 50%)`
    );
  }
  return stars.join(",\n");
}

// ─── Terrain generators ──────────────────────────────────────────────

/** Rocky mountain range with jagged peaks and cliff notches */
function generateMountainRange(h: number, layer: number): string {
  const seed  = h + layer * 1337;
  const steps = 18;
  const points: string[] = ["0% 100%"];
  for (let i = 0; i <= steps; i++) {
    const x    = (i / steps) * 100;
    const base = 30 + layer * 9;
    // Three overlapping frequencies for natural fractal silhouette
    const y = base
      - Math.sin((seed + i * 0.9)  * 1.4) * (18 - layer * 3.5)
      - Math.sin((seed + i * 1.8)  * 0.8) * (10 - layer * 2)
      - Math.sin((seed + i * 3.1)  * 1.9) * (5  - layer)
      - Math.abs(Math.sin((seed + i * 0.4) * 0.5)) * (6 - layer * 1.2);
    points.push(`${x.toFixed(1)}% ${Math.max(4, y).toFixed(1)}%`);
  }
  points.push("100% 100%");
  return `polygon(${points.join(", ")})`;
}

/**
 * Dense city skyline with flat-topped towers, setbacks, antenna spires,
 * and narrower gap streets.
 */
function generateCitySkyline(h: number, layer: number): string {
  const seed      = h + layer * 613;
  const numBlocks = 14 + layer * 3;
  const points: string[] = ["0% 100%"];

  for (let i = 0; i < numBlocks; i++) {
    const xLeft  = (i / numBlocks) * 100;
    const xRight = ((i + 0.88) / numBlocks) * 100; // building occupies 88% of slot
    const base   = 42 + layer * 5;
    const ht     = base - 8 - ((seed * (i + 1) * 3) % 30); // varied height
    const top    = Math.max(8, ht);

    // Left edge of building
    points.push(`${xLeft.toFixed(1)}% 100%`);
    points.push(`${xLeft.toFixed(1)}% ${top.toFixed(1)}%`);

    // Antenna / spire on taller buildings
    if (((seed + i * 7) % 4) === 0) {
      const midX = ((xLeft + xRight) / 2).toFixed(1);
      points.push(`${midX}% ${(top - 6).toFixed(1)}%`);
    }

    // Setback terrace on wide buildings (layer 1)
    if (layer === 1 && ((seed + i * 3) % 3) === 0) {
      const midX  = ((xLeft + xRight) / 2).toFixed(1);
      const midXR = (((xLeft * 0.3) + xRight * 0.7)).toFixed(1);
      points.push(`${midX}% ${(top + 5).toFixed(1)}%`);
      points.push(`${midXR}% ${(top + 5).toFixed(1)}%`);
    }

    points.push(`${xRight.toFixed(1)}% ${top.toFixed(1)}%`);
    points.push(`${xRight.toFixed(1)}% 100%`);
  }

  points.push("100% 100%");
  return `polygon(${points.join(", ")})`;
}

/** Interior hall: arched ceiling with inset pillars */
function generateInteriorWalls(h: number): string {
  const pillarW   = 3;
  const numPillars = 4 + (h % 3);
  const points: string[] = ["0% 100%", "0% 15%"];

  for (let i = 0; i < numPillars; i++) {
    const cx = 10 + (i / (numPillars - 1)) * 80;

    // Pillar shaft
    points.push(`${(cx - pillarW).toFixed(1)}% 15%`);
    points.push(`${(cx - pillarW).toFixed(1)}% 42%`);

    // Arch curve (approximated with three points)
    points.push(`${(cx - pillarW * 0.5).toFixed(1)}% 48%`);
    points.push(`${cx.toFixed(1)}% 52%`);
    points.push(`${(cx + pillarW * 0.5).toFixed(1)}% 48%`);

    points.push(`${(cx + pillarW).toFixed(1)}% 42%`);
    points.push(`${(cx + pillarW).toFixed(1)}% 15%`);
  }

  points.push("100% 15%", "100% 100%");
  return `polygon(${points.join(", ")})`;
}

/** Jungle tree canopy — organic rounded tops */
function generateJungleCanopy(h: number, layer: number): string {
  const seed  = h + layer * 2222;
  const steps = 20;
  const points: string[] = ["0% 100%"];

  for (let i = 0; i <= steps; i++) {
    const x    = (i / steps) * 100;
    const base = 28 + layer * 10;
    // Large slow wave for canopy undulation + small fast ripple for leaves
    const y = base
      - Math.abs(Math.sin((seed + i * 0.6)  * 0.9)) * (20 - layer * 4)
      - Math.abs(Math.sin((seed + i * 1.4)  * 1.8)) * (8  - layer * 2)
      - Math.sin((seed + i * 2.8) * 3.2)            * (3  - layer * 0.5);
    points.push(`${x.toFixed(1)}% ${Math.max(5, y).toFixed(1)}%`);
  }

  points.push("100% 100%");
  return `polygon(${points.join(", ")})`;
}

/** Jungle ground undergrowth — low organic bumps */
function generateJungleGround(h: number): string {
  const points: string[] = ["0% 100%"];
  for (let i = 0; i <= 16; i++) {
    const x = (i / 16) * 100;
    const y = 40 + Math.abs(Math.sin((h + i * 0.9) * 1.3)) * 35
              + Math.abs(Math.sin((h + i * 2.1) * 2.5)) * 18;
    points.push(`${x.toFixed(1)}% ${Math.min(95, y).toFixed(1)}%`);
  }
  points.push("100% 100%");
  return `polygon(${points.join(", ")})`;
}

/** Irregular rock/debris shape */
function generateRockShape(h: number, idx: number): string {
  const s  = h + idx * 777;
  const p1 = 8  + (s        % 22);
  const p2 = 5  + ((s >> 3) % 18);
  const p3 = 12 + ((s >> 5) % 22);
  const p4 = 8  + ((s >> 7) % 14);
  return `polygon(
    0% 100%,
    ${p1}% ${p2}%,
    32% ${p3}%,
    58% ${10 + (s % 12)}%,
    78% ${p4}%,
    92% ${p2 + 6}%,
    100% 100%
  )`;
}

/** Simple tree/trunk silhouette for foreground jungle */
function generateTreeShape(h: number, idx: number): string {
  const s = h + idx * 1111;
  return `polygon(
    35% 100%, 38% 65%, 15% 55%, 30% 45%, 18% 35%,
    35% 38%, 28% 15%, 50% 25%, 72% 15%, 65% 38%,
    82% 35%, 70% 45%, 85% 55%, 62% 65%, 65% 100%
  )`;
  void s;
}

/** Soft horizontal cloud bands across the upper sky */
function generateCloudBands(h: number, color: string): string {
  const bands: string[] = [];
  for (let i = 0; i < 5; i++) {
    const x = ((h * (i + 3) * 17) % 80) + 10;
    const y = 6 + ((h * (i + 1) * 11) % 38);
    const wPct = 28 + ((h * (i + 2)) % 30);
    const hPct = 3 + ((h * (i + 5)) % 4);
    bands.push(
      `radial-gradient(ellipse ${wPct}% ${hPct}% at ${x}% ${y}%, ${color} 0%, transparent 70%)`
    );
  }
  return bands.join(",\n");
}

/** Small rocks / grass tufts / debris scattered over the ground plane */
function generateGroundScatter(h: number, color: string): string {
  const items: string[] = [];
  for (let i = 0; i < 18; i++) {
    const x = ((h * (i + 1) * 13) % 96) + 2;
    const y = 30 + ((h * (i + 2) * 7) % 65);
    const size = 1.5 + ((h * (i + 3)) % 5);
    items.push(
      `radial-gradient(${size}px ${size * 0.55}px at ${x}% ${y}%, ${color} 40%, transparent 60%)`
    );
  }
  return items.join(",\n");
}

/**
 * Seated Sith colossus silhouette — head, pauldrons, arm ledges, leg block.
 * Shared by the Valley of the Dark Lords and tomb guardian effigies.
 */
const COLOSSUS_CLIP =
  "polygon(30% 100%, 28% 62%, 18% 60%, 20% 50%, 30% 48%, 28% 34%, 22% 32%, 24% 24%, 36% 22%, 38% 14%, 33% 12%, 40% 2%, 60% 2%, 67% 12%, 62% 14%, 64% 22%, 76% 24%, 78% 32%, 72% 34%, 70% 48%, 80% 50%, 82% 60%, 72% 62%, 70% 100%)";

/** Glinting ore veins scattered across mine walls. */
function generateOreGlints(h: number, color: string): string {
  const pts: string[] = [];
  for (let i = 0; i < 14; i++) {
    const x = ((h * (i + 3) * 11) % 94) + 3;
    const y = 35 + ((h * (i + 1) * 7) % 55);
    const s = 1 + ((h * (i + 2)) % 3) * 0.6;
    pts.push(`radial-gradient(${s}px ${s}px at ${x}% ${y}%, ${color} 50%, transparent 50%)`);
  }
  return pts.join(",\n");
}

/** Simulated lit windows on distant city buildings */
function generateCityWindows(h: number, color = "rgba(255,200,80,0.7)"): string {
  const windows: string[] = [];
  for (let i = 0; i < 24; i++) {
    const x    = ((h * (i + 1) * 11) % 96) + 2;
    const y    = 5 + ((h * (i + 2) * 7)  % 38);
    const size = 1 + ((h * (i + 3)) % 3) * 0.5;
    windows.push(
      `radial-gradient(${size}px ${size}px at ${x}% ${y}%, ${color} 50%, transparent 50%)`
    );
  }
  return windows.join(",\n");
}
