"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/game/store/game-store";
import { ZONE_MAP } from "@/game/data/zones/all-zones";
import type { ZoneHotspot } from "@/game/engine/world/zone-types";
import { useCombatStore } from "@/game/engine/combat/combat-store";
import { useDialogueStore } from "@/game/engine/dialogue/dialogue-store";
import { getEnemyTemplate } from "@/game/engine/combat/enemy-registry";
import { getWeatherForZone } from "@/game/engine/combat/weather";
import { encounterDangerMultiplier } from "@/game/engine/factions/reputation";
import { buildCombatPlayer } from "@/game/engine/combat/player-loadout";
import { buildPartyCombatants } from "@/game/engine/combat/companion-combat";
import { getConversationForNpc, getNpcQuestState, type NpcQuestState } from "@/game/data/npcs/npc-registry";
import { getItem } from "@/game/data/items/item-registry";
import { LOOT_TABLES, rollLootTable } from "@/game/engine/combat/loot-tables";
import { RNG } from "@/game/engine/rng/rng";
import { projectToGround, depthZIndex } from "@/game/scenes/scene-projection";
import { entityVisualHeight } from "@/game/scenes/SceneEntities";

/** Action verb per hotspot type — shown on the active label so the player
 *  always knows what a marker does (esp. the cryptic "event" lore points). */
const HOTSPOT_VERB: Record<string, string> = {
  exit: "Travel ·", npc: "Talk ·", encounter: "Fight ·", loot: "Search ·", event: "Investigate ·", travel: "Map ·",
};

/** Highest enemy category in an encounter group — drives the elite/boss marker badge. */
function encounterTier(enemyIds: string[]): "minion" | "elite" | "boss" {
  let tier: "minion" | "elite" | "boss" = "minion";
  for (const id of enemyIds) {
    const tpl = getEnemyTemplate(id);
    if (tpl?.category === "boss") return "boss";
    if (tpl?.category === "elite") tier = "elite";
  }
  return tier;
}

/**
 * ZoneView — renders interactive hotspots on the current zone's scene.
 *
 * Controls:
 *   Click hotspot → navigate / interact
 *   1-9           → quick-select hotspot by number
 *   Tab           → cycle through available hotspots
 *   M             → galaxy map
 *   Space         → confirm selection
 */
export function ZoneView() {
  const world = useGameStore((s) => s.world);
  const character = useGameStore((s) => s.character);
  const setWorldField = useGameStore((s) => s.setWorldField);
  const showToast = useGameStore((s) => s.showToast);
  const openPanel = useGameStore((s) => s.openPanel);
  const addItems = useGameStore((s) => s.addItems);
  const setQuestFlag = useGameStore((s) => s.setQuestFlag);
  const combatPhase = useCombatStore((s) => s.phase);
  const startCombat = useCombatStore((s) => s.startCombat);
  const dialogueActive = useDialogueStore((s) => s.active);
  const startConversation = useDialogueStore((s) => s.startConversation);

  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  // Zone-entry announcement: shows on zone change, then fades. The HUD keeps
  // the persistent location, so this never duplicates it on screen for long.
  const [showBanner, setShowBanner] = useState(true);
  /** Flags to set if (and only if) the player wins the current encounter. */
  const pendingVictoryFlags = useRef<string[] | null>(null);

  // Apply victory flags when an encounter started from a hotspot is won.
  useEffect(() => {
    if (combatPhase === "victory" && pendingVictoryFlags.current) {
      for (const flag of pendingVictoryFlags.current) setQuestFlag(flag, true);
      pendingVictoryFlags.current = null;
    }
    if ((combatPhase === "defeat" || combatPhase === "fled") && pendingVictoryFlags.current) {
      pendingVictoryFlags.current = null;
    }
  }, [combatPhase, setQuestFlag]);

  const zone = useMemo(() => {
    if (!world?.zoneId) return null;
    return ZONE_MAP.get(world.zoneId) ?? null;
  }, [world?.zoneId]);

  // Re-announce on every zone change, then fade out after a beat.
  useEffect(() => {
    if (!zone) return;
    setShowBanner(true);
    const t = setTimeout(() => setShowBanner(false), 4500);
    return () => clearTimeout(t);
  }, [zone]);

  // Filter hotspots based on flags
  const visibleHotspots = useMemo(() => {
    if (!zone || !world) return [];
    return zone.hotspots.filter((hs) => {
      if (hs.hideIfFlag && world.questFlags[hs.hideIfFlag]) return false;
      if (hs.requireFlag && !world.questFlags[hs.requireFlag]) return false;
      // Auto-hide consumed encounters/loot
      if (hs.type === "encounter" && world.questFlags[`encounter_done_${hs.id}`]) return false;
      if (hs.type === "loot" && world.questFlags[`loot_done_${hs.id}`]) return false;
      return true;
    });
  }, [zone, world]);

  const handleHotspot = useCallback(
    async (hs: ZoneHotspot) => {
      if (!world || !character || transitioning) return;
      if (combatPhase !== "idle" || dialogueActive) return;

      // Walk character to hotspot position (Monkey Island style)
      const walkTo = (window as unknown as Record<string, unknown>).__playerWalkTo as
        | ((x: number, y: number) => Promise<void>)
        | undefined;
      if (walkTo) {
        // Walk to the hotspot's ground-projected point (slightly below the marker)
        const ground = projectToGround(hs.position);
        await walkTo(ground.x, Math.min(ground.y + 4, 83));
      }

      switch (hs.type) {
        case "exit": {
          if (!hs.targetZoneId) break;
          setTransitioning(true);

          // Check random encounter on zone transition
          const targetZone = ZONE_MAP.get(hs.targetZoneId);
          const currentZone = zone;

          // Discover zone
          if (!world.discoveredZones.includes(hs.targetZoneId)) {
            setWorldField("discoveredZones", [
              ...world.discoveredZones,
              hs.targetZoneId,
            ]);
          }

          // Random encounter check — actually start combat. Factions you've
          // angered raise the ambush chance (capped so travel never becomes a
          // guaranteed fight).
          let randomEncounter: string | null = null;
          const danger = world ? encounterDangerMultiplier(world.factionRep) : 1;
          const encounterChance = Math.min(0.6, (currentZone?.encounterChance ?? 0.2) * danger);
          if (
            currentZone?.randomEncounters &&
            currentZone.randomEncounterPool?.length &&
            Math.random() < encounterChance
          ) {
            const pool = currentZone.randomEncounterPool;
            const totalWeight = pool.reduce((s, e) => s + e.weight, 0);
            let roll = Math.random() * totalWeight;
            for (const entry of pool) {
              roll -= entry.weight;
              if (roll <= 0) {
                randomEncounter = entry.enemyId;
                break;
              }
            }
          }

          setTimeout(() => {
            setWorldField("zoneId", hs.targetZoneId!);
            setTransitioning(false);
            setSelectedIdx(-1);

            // Start combat after transition if random encounter triggered
            if (randomEncounter) {
              const tpl = getEnemyTemplate(randomEncounter);
              if (tpl && character) {
                showToast(`Ambush! ${tpl.name} attacks!`, "warning");
                startCombat(buildCombatPlayer(character), [tpl], `enc_${Date.now()}`, getWeatherForZone(world?.zoneId ?? ""), buildPartyCombatants(world?.companions ?? [], character.level));
              }
            }
          }, 800);
          break;
        }
        case "npc": {
          if (!hs.npcId || !character || !world) break;
          const conv = getConversationForNpc(hs.npcId, world.questFlags);
          if (!conv) {
            showToast(`${hs.label} has nothing to say.`, "info");
            break;
          }
          startConversation(conv, {
            playerLevel: character.level,
            playerClassId: character.classId,
            primary: character.primary,
            factionRep: world.factionRep,
            questFlags: world.questFlags,
            inventory: character.inventory.map((i) => ({ itemId: i.itemId, qty: i.qty })),
          });
          openPanel("dialogue");
          break;
        }
        case "encounter": {
          if (!hs.encounterEnemies?.length || !character) break;
          const templates = hs.encounterEnemies
            .map((id) => getEnemyTemplate(id))
            .filter((t): t is NonNullable<typeof t> => Boolean(t));
          if (!templates.length) {
            showToast(`No enemies found for ${hs.label}.`, "danger");
            break;
          }
          showToast(`Combat: ${hs.label}!`, "warning");
          startCombat(buildCombatPlayer(character), templates, `enc_${hs.id}_${Date.now()}`, getWeatherForZone(world?.zoneId ?? ""), buildPartyCombatants(world?.companions ?? [], character.level));
          // Consume the encounter (and set quest flags) only if the player WINS.
          pendingVictoryFlags.current = [
            `encounter_done_${hs.id}`,
            ...(hs.victoryFlag ? [hs.victoryFlag] : []),
          ];
          break;
        }
        case "loot": {
          const tableId = hs.lootTableId ?? "loot_acolyte";
          const table = LOOT_TABLES[tableId];
          if (!table) {
            showToast(`The container is empty.`, "info");
            break;
          }
          const rng = new RNG(`loot_${hs.id}_${Date.now()}`);
          const drops = rollLootTable(table, rng);
          if (drops.length === 0) {
            showToast(`Nothing of value at ${hs.label}.`, "info");
          } else {
            addItems(drops);
            const summary = drops
              .map((d) => `${d.qty}× ${getItem(d.itemId)?.name ?? d.itemId.replace(/_/g, " ")}`)
              .join(", ");
            showToast(`Looted ${hs.label}: ${summary}`, "success");
          }
          // Mark looted so it disappears
          setQuestFlag(`loot_done_${hs.id}`, true);
          break;
        }
        case "event": {
          showToast(hs.eventText ?? `Event: ${hs.label}`, "info");
          setQuestFlag(`event_${hs.id}`, true);
          if (hs.eventFlag) setQuestFlag(hs.eventFlag, true);
          break;
        }
        case "travel": {
          openPanel("map");
          break;
        }
      }
    },
    [
      world,
      character,
      transitioning,
      combatPhase,
      dialogueActive,
      zone,
      setWorldField,
      showToast,
      openPanel,
      addItems,
      setQuestFlag,
      startCombat,
      startConversation,
    ],
  );

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (combatPhase !== "idle" || dialogueActive) return;
      const panels = ["inventory", "character", "journal", "map"] as const;
      const panelKeys: Record<string, (typeof panels)[number]> = {
        i: "inventory",
        c: "character",
        j: "journal",
        m: "map",
      };

      if (panelKeys[e.key.toLowerCase()]) {
        e.preventDefault();
        openPanel(panelKeys[e.key.toLowerCase()]!);
        return;
      }

      // Number keys 1-9 to select hotspot
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9 && num <= visibleHotspots.length) {
        e.preventDefault();
        const hs = visibleHotspots[num - 1]!;
        handleHotspot(hs);
        return;
      }

      // Tab to cycle
      if (e.key === "Tab") {
        e.preventDefault();
        setSelectedIdx((prev) =>
          prev >= visibleHotspots.length - 1 ? 0 : prev + 1,
        );
        return;
      }

      // Space/Enter to confirm
      if ((e.key === " " || e.key === "Enter") && selectedIdx >= 0) {
        e.preventDefault();
        const hs = visibleHotspots[selectedIdx];
        if (hs) handleHotspot(hs);
        return;
      }

      // Escape → menu
      if (e.key === "Escape") {
        e.preventDefault();
        openPanel("menu");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    combatPhase,
    dialogueActive,
    visibleHotspots,
    selectedIdx,
    handleHotspot,
    openPanel,
  ]);

  if (!zone || !world) return null;

  return (
    <>
      {/* Zone transition overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 bg-void-950"
          />
        )}
      </AnimatePresence>

      {/* Zone-entry announcement — fades out; the HUD keeps the location */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6 }}
            className="absolute left-1/2 top-4 z-30 -translate-x-1/2 pointer-events-none"
          >
            <div className="rounded-sm border border-gilt-600/30 bg-void-950/80 px-6 py-2 backdrop-blur-sm">
              <h2 className="heading-display text-sm tracking-widest text-gilt-400 text-center">
                {zone.name}
              </h2>
              <p className="mt-0.5 text-center text-xs text-ash-500 max-w-md">
                {zone.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hotspots */}
      <div className="absolute inset-0 z-20">
        {visibleHotspots.map((hs, idx) => (
          <HotspotButton
            key={hs.id}
            hotspot={hs}
            index={idx}
            selected={selectedIdx === idx}
            hovered={hoveredId === hs.id}
            onHover={(v) => setHoveredId(v ? hs.id : null)}
            onClick={() => handleHotspot(hs)}
            questState={hs.type === "npc" && hs.npcId ? getNpcQuestState(hs.npcId, world) : "none"}
            eliteTier={hs.type === "encounter" && hs.encounterEnemies?.length ? encounterTier(hs.encounterEnemies) : "minion"}
          />
        ))}
      </div>

      {/* Controls hint (bottom-right, clear of the HUD nav bar) */}
      <div className="absolute bottom-4 right-4 z-30 hidden lg:block">
        <div className="flex gap-3 rounded-sm bg-void-950/70 px-4 py-1.5 text-xs text-ash-500 backdrop-blur-sm">
          <span>
            <kbd className="rounded bg-void-800 px-1 text-ash-300">1-9</kbd>{" "}
            Select
          </span>
          <span>
            <kbd className="rounded bg-void-800 px-1 text-ash-300">Tab</kbd>{" "}
            Cycle
          </span>
          <span>
            <kbd className="rounded bg-void-800 px-1 text-ash-300">Space</kbd>{" "}
            Confirm
          </span>
          <span>
            <kbd className="rounded bg-void-800 px-1 text-ash-300">M</kbd> Map
          </span>
        </div>
      </div>
    </>
  );
}

// ─── Hotspot Button ──────────────────────────────────────────────────

const ICON_MAP: Record<string, string> = {
  door: "🚪",
  person: "👤",
  sword: "⚔️",
  chest: "📦",
  star: "✦",
  ship: "🚀",
};

/** Quest-state badge glyph + styling — "!" new offer, "?" gold ready to turn in, "?" grey in progress. */
const QUEST_BADGE: Record<NpcQuestState, { glyph: string; classes: string; pulse: boolean } | null> = {
  none: null,
  available: { glyph: "!", classes: "border-amber-300 bg-amber-500 text-void-950", pulse: true },
  ready: { glyph: "?", classes: "border-amber-300 bg-amber-500 text-void-950", pulse: true },
  active: { glyph: "?", classes: "border-ash-400 bg-ash-700 text-ash-200", pulse: false },
};

/** Elite/boss badge glyph + ring tint — lets players size up a fight before clicking it. */
const ELITE_BADGE: Record<"minion" | "elite" | "boss", { glyph: string; classes: string; ring: string } | null> = {
  minion: null,
  elite: { glyph: "★", classes: "border-amber-400 bg-amber-900 text-amber-200", ring: "ring-2 ring-amber-400/70 shadow-[0_0_10px_rgba(251,191,36,0.55)]" },
  boss: { glyph: "💀", classes: "border-blood-400 bg-blood-900 text-blood-200", ring: "ring-2 ring-blood-500/80 shadow-[0_0_12px_rgba(239,68,68,0.65)]" },
};

function HotspotButton({
  hotspot,
  index,
  selected,
  hovered,
  onHover,
  onClick,
  questState,
  eliteTier,
}: {
  hotspot: ZoneHotspot;
  index: number;
  selected: boolean;
  hovered: boolean;
  onHover: (v: boolean) => void;
  onClick: () => void;
  questState: NpcQuestState;
  eliteTier: "minion" | "elite" | "boss";
}) {
  const isActive = selected || hovered;
  const questBadge = QUEST_BADGE[questState];
  const eliteBadge = ELITE_BADGE[eliteTier];

  const typeColorMap: Record<string, string> = {
    exit: "border-gilt-500/50 bg-gilt-900/40 text-gilt-400",
    npc: "border-force-500/50 bg-force-900/40 text-force-400",
    encounter: "border-blood-500/50 bg-blood-900/40 text-blood-400",
    loot: "border-amber-500/50 bg-amber-900/40 text-amber-400",
    event: "border-sky-500/50 bg-sky-900/40 text-sky-400",
    travel: "border-emerald-500/50 bg-emerald-900/40 text-emerald-400",
  };

  const activeTypeColorMap: Record<string, string> = {
    exit: "border-gilt-400 bg-gilt-800/60 text-gilt-300 shadow-sith-glow",
    npc: "border-force-400 bg-force-800/60 text-force-300 shadow-force-glow",
    encounter: "border-blood-400 bg-blood-800/60 text-blood-300",
    loot: "border-amber-400 bg-amber-800/60 text-amber-300",
    event: "border-sky-400 bg-sky-800/60 text-sky-300",
    travel: "border-emerald-400 bg-emerald-800/60 text-emerald-300",
  };

  const colors = isActive
    ? activeTypeColorMap[hotspot.type] ?? "border-ash-400 bg-ash-800/60 text-ash-300"
    : typeColorMap[hotspot.type] ?? "border-ash-600/50 bg-ash-900/40 text-ash-400";

  const icon = ICON_MAP[hotspot.icon ?? "star"] ?? "✦";
  const ground = projectToGround(hotspot.position);
  // SceneEntities draws the NPC/enemy/chest sprite anchored at this same
  // ground point — float the marker above its head so it never covers it.
  const spriteLift = entityVisualHeight(hotspot);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{
        left: `${ground.x}%`,
        top: spriteLift > 0 ? `calc(${ground.y}% - ${Math.round(spriteLift) + 6}px)` : `${ground.y}%`,
        transform: "translate(-50%, -100%)",
        zIndex: depthZIndex(ground.depth) + (isActive ? 100 : 0),
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      title={hotspot.label}
    >
      {/* Label chip — only when hovered/selected so markers don't pile up */}
      <span
        className={`mb-1 flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm transition-opacity duration-150 ${colors} ${
          isActive ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <span className="opacity-60 normal-case tracking-normal mr-0.5">{HOTSPOT_VERB[hotspot.type] ?? ""}</span>
        {hotspot.label}
        {hotspot.recommendedLevel && (
          <span className="text-[10px] opacity-70">Lv.{hotspot.recommendedLevel}</span>
        )}
        {eliteTier !== "minion" && (
          <span className={`text-[10px] font-bold tracking-wide ${eliteTier === "boss" ? "text-blood-300" : "text-amber-300"}`}>
            {eliteTier === "boss" ? "BOSS" : "ELITE"}
          </span>
        )}
      </span>

      {/* Marker node */}
      <span className="relative">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm backdrop-blur-sm transition-all duration-200 ${colors} ${eliteBadge?.ring ?? ""} ${
            isActive ? "scale-110" : "group-hover:scale-110"
          }`}
        >
          {icon}
        </span>
        {/* Quest-state corner badge — at-a-glance: new offer vs in-progress vs ready to turn in. */}
        {questBadge && (
          <span
            className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border text-[10px] font-bold leading-none ${questBadge.classes} ${
              questBadge.pulse ? "animate-pulse" : ""
            }`}
          >
            {questBadge.glyph}
          </span>
        )}
        {/* Elite/boss corner badge — visible before you ever click into the fight. */}
        {eliteBadge && (
          <span
            className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border text-[9px] leading-none ${eliteBadge.classes}`}
          >
            {eliteBadge.glyph}
          </span>
        )}
      </span>
      {/* Hotkey badge */}
      <span className="pointer-events-none -mt-1.5 rounded-full border border-void-900 bg-void-950/90 px-1 text-[9px] leading-3 text-ash-400">
        {index + 1}
      </span>

      {/* Ground ring — anchors the marker to the floor. */}
      {spriteLift === 0 && (
        <span
          className="pointer-events-none mt-0.5 block rounded-[50%] border"
          style={{
            width: 26 + ground.depth * 14,
            height: 7 + ground.depth * 3,
            borderColor: "rgba(255,255,255,0.18)",
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, rgba(255,255,255,0.06) 60%, transparent 75%)",
          }}
        />
      )}

      {/* When the marker floats above a sprite, tether it to the true ground
          point with a thin stem + ring so it never reads as hovering in air. */}
      {spriteLift > 0 && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 flex flex-col items-center"
          style={{ height: spriteLift + 6 }}
        >
          <span className="w-px flex-1 bg-gradient-to-b from-white/25 to-white/5" />
          <span
            className="block rounded-[50%] border"
            style={{
              width: 24 + ground.depth * 14,
              height: 6 + ground.depth * 3,
              borderColor: "rgba(255,255,255,0.16)",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 72%)",
            }}
          />
        </span>
      )}
    </motion.button>
  );
}
