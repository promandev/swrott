"use client";

import { useCombatStore } from "@/game/engine/combat/combat-store";
import { useGameStore } from "@/game/store/game-store";
import { useAudio } from "@/game/audio/use-audio";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { getSkill, BASIC_ATTACK } from "@/game/data/schemas/skill-registry";
import { getItem } from "@/game/data/items/item-registry";
import type { SkillInput } from "@/game/data/schemas/skill";
import { getClassStateImage, getEnemyStateImage, type CharacterState } from "@/game/utils/character-images";
import { COMPANIONS } from "@/game/engine/companions/companions";
import { getScenePalette } from "@/game/scenes/DynamicScene";
import { ZONE_MAP } from "@/game/data/zones/all-zones";
import { detectChainProgress } from "@/game/engine/combat/skill-chains";
import { WEATHER_EFFECTS } from "@/game/engine/combat/weather";
import { useAccessibilityStore } from "@/game/store/accessibility-store";
import type { AttackInput, DefenseInput } from "@/game/engine/combat/damage";
import { hitProbability, estimateDamageBand } from "@/game/engine/combat/damage";
import { ImpactEffect, SelfAura, FloatingNumber, DeathBurst, D20Chip, StatusAura, WoundedAura, WeatherOverlay } from "./CombatEffects";
import { STATUS_VISUALS, dominantStatusAura } from "./status-visuals";
import { DAMAGE_TYPE_VISUALS } from "./damage-type-visuals";
import { useHotkeysStore, actionForKey, type HotkeyAction } from "@/game/store/hotkeys-store";
import { Fragment } from "react";

type Combatant = import("@/game/engine/combat/combat-store").Combatant;

/**
 * Returns basic attack + the player's chosen combat loadout (4–6 skills,
 * curated by talents + the Loadout panel). The skillIds are already the
 * resolved loadout from buildCombatPlayer, so we just map them to data.
 */
function getPlayerCombatSkills(skillIds: string[]): SkillInput[] {
  const loadout = skillIds
    .map((id) => getSkill(id))
    .filter((s): s is SkillInput => Boolean(s))
    .slice(0, 6);
  return [BASIC_ATTACK, ...loadout];
}

const TARGETING_LABEL: Record<string, string> = {
  single: "single target",
  cone: "hits up to 3",
  aoe: "hits all enemies",
  self: "self",
};

/** Compact stance identity for the combatant cards (tactical read-out). */
const STANCE_VISUALS: Record<string, { glyph: string; label: string; cls: string }> = {
  aggressive: { glyph: "⚔", label: "Aggressive", cls: "text-blood-300 border-blood-700/50" },
  defensive:  { glyph: "🛡", label: "Defensive",  cls: "text-force-300 border-force-700/50" },
  precision:  { glyph: "🎯", label: "Precision",  cls: "text-gilt-300 border-gilt-600/50" },
  frenzy:     { glyph: "🌀", label: "Frenzy",     cls: "text-orange-300 border-orange-700/50" },
  riposte:    { glyph: "↺", label: "Riposte",    cls: "text-emerald-300 border-emerald-700/50" },
};

const STANCE_HINT: Record<string, string> = {
  aggressive: "+20% damage dealt, but your armor is 15% less effective.",
  defensive: "-10% damage dealt, +25% armor effectiveness, +2 Defense.",
  precision: "+15% accuracy and a wider critical range.",
  frenzy: "Wild swings — slightly less accurate, fills the limit gauge faster.",
};

/**
 * Build the player's AttackInput for a skill the same way
 * combat-store.executePlayerAction does, so the pre-commit preview matches
 * the d20 the engine will actually roll. Keep these coefficients in sync
 * with that function's resolve block. `mult` is the multi-target falloff
 * applied to the damage components (1 for single / the primary target).
 */
function buildPlayerAttack(skill: SkillInput, player: Combatant, mult = 1): AttackInput {
  const dmg = skill.damage;
  const skillBase = dmg?.base ?? 8;
  const strContrib = player.primary.strength * (dmg?.strengthScaling ?? 0);
  const forceContrib = player.primary.force * (dmg?.forceScaling ?? 0);
  const tm = player.talentMods;
  return {
    skillBase: skillBase * mult,
    weaponDamage: (player.weaponDamage ?? 10) * mult,
    strengthScaling: (strContrib + forceContrib) * mult,
    type: (dmg?.type ?? "physical") as AttackInput["type"],
    attackerStance: player.stance,
    attackerCritChance: 0.1 + player.primary.agility * 0.005 + (tm?.critChance ?? 0) / 100,
    attackerCritDamageBonus: 0.5 + (tm?.critDamage ?? 0) / 100,
    attackerAccuracy: 0.85 + player.primary.agility * 0.01,
    damageMultiplier: 1 + (tm?.damagePercent ?? 0) / 100,
    armorPiercePct: (tm?.armorPiercePct ?? 0) / 100,
  };
}

/** Multi-target falloff used by the engine for cone/aoe (index 0 = full hit). */
const FORECAST_FALLOFF = [1.0, 0.7, 0.5, 0.35, 0.25];

/**
 * Forecast each enemy's incoming damage for the selected skill, mirroring how
 * combat-store.executePlayerAction picks targets: `single` hits only the
 * selected foe; `cone`/`aoe` hit the first living foes (3 / all) with falloff.
 * Returns enemyId → average forecast damage.
 */
function forecastDamageByEnemy(
  skill: SkillInput,
  player: Combatant,
  enemies: Combatant[],
  selectedTargetId: string | null,
): Map<string, number> {
  const map = new Map<string, number>();
  if (!skill.damage || skill.targeting === "self") return map;
  const living = enemies.filter((e) => e.isAlive);
  const targets =
    skill.targeting === "single"
      ? living.filter((e) => e.id === selectedTargetId)
      : living.slice(0, skill.targeting === "aoe" ? living.length : 3);
  targets.forEach((tgt, idx) => {
    const mult = skill.targeting === "single" ? 1 : FORECAST_FALLOFF[idx] ?? 0.2;
    const band = estimateDamageBand(buildPlayerAttack(skill, player, mult), buildEnemyDefense(tgt));
    map.set(tgt.id, Math.round((band.min + band.max) / 2));
  });
  return map;
}

function buildEnemyDefense(target: Combatant): DefenseInput {
  return {
    armor: target.armor,
    resistances: target.resistances ?? {},
    defenderStance: target.stance,
    dodgeChance: target.primary.agility * 0.01,
  };
}

type Effectiveness = "immune" | "resist" | "weak" | null;

interface SkillPreview {
  /** Damage band on a hit, e.g. "42–51". */
  dmg: string | null;
  /** Hit chance 0..100 vs the selected target, or null when no target. */
  hit: number | null;
  /** Crit chance 0..100 (threat range). */
  critPct: number | null;
  /** Crit ceiling damage, for the tooltip. */
  crit: number | null;
  /** How the target resists this skill's damage type. */
  effectiveness: Effectiveness;
}

function effectivenessFor(resistance: number): Effectiveness {
  if (resistance >= 1) return "immune";
  if (resistance >= 0.2) return "resist";
  if (resistance < 0) return "weak";
  return null;
}

/** Tactical readout for the skill info bar: damage band + d20 hit chance + element matchup. */
function previewSkill(
  skill: SkillInput,
  player: Combatant,
  target: Combatant | null,
): SkillPreview {
  if (!skill.damage || skill.targeting === "self") {
    return { dmg: null, hit: null, critPct: null, crit: null, effectiveness: null };
  }
  const attack = buildPlayerAttack(skill, player);
  const defense = target
    ? buildEnemyDefense(target)
    // Notional unarmored foe so the bar still shows a number pre-target.
    : { armor: 0, resistances: {}, defenderStance: "precision" as const, dodgeChance: 0 };
  const band = estimateDamageBand(attack, defense);
  const dtype = skill.damage.type;
  const resistance = target ? target.resistances?.[dtype] ?? 0 : 0;
  return {
    dmg: `${band.min}–${band.max}`,
    hit: target ? Math.round(hitProbability(attack, defense) * 100) : null,
    critPct: Math.round(Math.min(1, attack.attackerCritChance) * 100),
    crit: band.crit,
    effectiveness: target ? effectivenessFor(resistance) : null,
  };
}

const EFFECTIVENESS_VISUALS: Record<"immune" | "resist" | "weak", { label: string; cls: string }> = {
  immune: { label: "IMMUNE", cls: "text-ash-400 border-ash-600/50" },
  resist: { label: "resists", cls: "text-sky-300 border-sky-700/50" },
  weak:   { label: "WEAK!",  cls: "text-orange-300 border-orange-600/60" },
};

/** Color the hit-chance number by how reliable the swing is. */
function hitChanceColor(pct: number): string {
  if (pct >= 80) return "text-emerald-300";
  if (pct >= 55) return "text-gilt-300";
  if (pct >= 30) return "text-amber-400";
  return "text-blood-400";
}

// ─── CombatUI ─────────────────────────────────────────────────────────

export function CombatUI() {
  const phase = useCombatStore((s) => s.phase);
  const player = useCombatStore((s) => s.player);
  const allies = useCombatStore((s) => s.allies);
  const enemies = useCombatStore((s) => s.enemies);
  const log = useCombatStore((s) => s.log);
  const selectedSkill = useCombatStore((s) => s.selectedSkill);
  const selectedTarget = useCombatStore((s) => s.selectedTarget);
  const turnNumber = useCombatStore((s) => s.turnNumber);
  const xpReward = useCombatStore((s) => s.xpReward);
  const creditReward = useCombatStore((s) => s.creditReward);
  const pendingLoot = useCombatStore((s) => s.pendingLoot);
  const damageEvents = useCombatStore((s) => s.damageEvents);
  const attackEvents = useCombatStore((s) => s.attackEvents);
  const clearAttackEvent = useCombatStore((s) => s.clearAttackEvent);
  const staggeredEnemies = useCombatStore((s) => s.staggeredEnemies);
  const comboCount = useCombatStore((s) => s.comboCount);
  const limitBreak = useCombatStore((s) => s.limitBreak);
  const screenFlash = useCombatStore((s) => s.screenFlash);
  const clearScreenFlash = useCombatStore((s) => s.clearScreenFlash);
  const unleashLimitBreak = useCombatStore((s) => s.unleashLimitBreak);
  const combatSeed = useCombatStore((s) => s.combatSeed);
  const skillHistory = useCombatStore((s) => s.skillHistory);
  const weather = useCombatStore((s) => s.weather);

  const selectSkill = useCombatStore((s) => s.selectSkill);
  const selectTarget = useCombatStore((s) => s.selectTarget);
  const executePlayerAction = useCombatStore((s) => s.executePlayerAction);
  const executeEnemyTurns = useCombatStore((s) => s.executeEnemyTurns);
  const executeAllyTurns = useCombatStore((s) => s.executeAllyTurns);
  const setAllyTactic = useCombatStore((s) => s.setAllyTactic);
  const advanceTurn = useCombatStore((s) => s.advanceTurn);
  const endCombat = useCombatStore((s) => s.endCombat);
  const setStance = useCombatStore((s) => s.setStance);
  const guard = useCombatStore((s) => s.guard);
  const fleeAttempt = useCombatStore((s) => s.fleeAttempt);
  const collectLoot = useCombatStore((s) => s.collectLoot);
  const clearDamageEvent = useCombatStore((s) => s.clearDamageEvent);
  const useItem = useCombatStore((s) => s.useItem);

  const showToast = useGameStore((s) => s.showToast);
  const removeItems = useGameStore((s) => s.removeItems);
  const setVitals = useGameStore((s) => s.setVitals);
  const bondPartyAfterVictory = useGameStore((s) => s.bondPartyAfterVictory);
  const inventory = useGameStore((s) => s.character?.inventory ?? []);
  const addXp = useGameStore((s) => s.addXp);
  const addCredits = useGameStore((s) => s.addCredits);
  const addItems = useGameStore((s) => s.addItems);
  const playerClassId = useGameStore((s) => s.character?.classId ?? "marauder");
  const zoneId = useGameStore((s) => s.world?.zoneId);
  const screenShakeEnabled = useAccessibilityStore((s) => s.screenShakeEnabled);
  const damageNumbersEnabled = useAccessibilityStore((s) => s.damageNumbersEnabled);
  const reducedMotion = useAccessibilityStore((s) => s.reducedMotion);
  const audio = useAudio();
  // useAudio() returns a fresh object each render; keep a ref so combat-event
  // effects can fire SFX without listing `audio` as a dep (which would replay
  // sounds on every render).
  const audioRef = useRef(audio);
  audioRef.current = audio;

  // Location-themed battlefield: the zone scene stays mounted underneath, so
  // the backdrop only darkens it and tints the arena with the zone palette.
  const scenePalette = getScenePalette(zoneId ? ZONE_MAP.get(zoneId)?.sceneId : undefined);
  const arenaAccent = scenePalette.accent;
  const arenaAccentSoft = arenaAccent.replace(/[\d.]+\)$/, "0.18)");

  // Local state for UI effects
  const [showHelp, setShowHelp] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);
  const [enemyShake, setEnemyShake] = useState<string | null>(null);
  // Arena-wide camera shake on heavy hits (crits / kills).
  const [arenaShake, setArenaShake] = useState(false);
  // Recently fallen enemies, so the death burst plays exactly once each.
  const [deathBursts, setDeathBursts] = useState<string[]>([]);
  const aliveRef = useRef<Record<string, boolean>>({});
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log.length]);

  // Shake player on hit (heals don't shake)
  useEffect(() => {
    const playerHit = damageEvents.find(
      (e) => e.targetId === "player" && !e.isMiss && !e.isDodged && !e.isHeal,
    );
    if (playerHit) {
      setPlayerShake(true);
      setTimeout(() => setPlayerShake(false), 400);
    }
  }, [damageEvents]);

  // Auto-clear attack animation events after they play out
  useEffect(() => {
    if (attackEvents.length === 0) return;
    const timer = setTimeout(() => {
      attackEvents.forEach((e) => clearAttackEvent(e.id));
    }, 900);
    return () => clearTimeout(timer);
  }, [attackEvents, clearAttackEvent]);

  // Shake enemy on hit
  useEffect(() => {
    const enemyHit = damageEvents.find((e) => e.targetId !== "player" && !e.isMiss && !e.isDodged);
    if (enemyHit) {
      setEnemyShake(enemyHit.targetId);
      setTimeout(() => setEnemyShake(null), 350);
    }
  }, [damageEvents]);

  // Arena camera shake on crits (gated by the accessibility setting)
  useEffect(() => {
    if (!screenShakeEnabled) return;
    const heavy = damageEvents.some((e) => e.isCrit && !e.isHeal);
    if (heavy) {
      setArenaShake(true);
      const t = setTimeout(() => setArenaShake(false), 380);
      return () => clearTimeout(t);
    }
  }, [damageEvents, screenShakeEnabled]);

  // Detect enemy deaths → play a one-shot death burst (also shakes the arena)
  useEffect(() => {
    const fallen: string[] = [];
    for (const e of enemies) {
      const wasAlive = aliveRef.current[e.id];
      if (wasAlive && !e.isAlive) fallen.push(e.id);
      aliveRef.current[e.id] = e.isAlive;
    }
    if (fallen.length > 0) {
      setDeathBursts((prev) => [...prev, ...fallen]);
      if (screenShakeEnabled) {
        setArenaShake(true);
        setTimeout(() => setArenaShake(false), 380);
      }
      const t = setTimeout(() => {
        setDeathBursts((prev) => prev.filter((id) => !fallen.includes(id)));
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [enemies, screenShakeEnabled]);

  // Auto-clear floating damage events after 1.2s
  useEffect(() => {
    if (damageEvents.length === 0) return;
    const timer = setTimeout(() => {
      damageEvents.forEach((e) => clearDamageEvent(e.id));
    }, 1400);
    return () => clearTimeout(timer);
  }, [damageEvents, clearDamageEvent]);

  // Auto-clear the screen flash
  useEffect(() => {
    if (!screenFlash) return;
    const t = setTimeout(() => clearScreenFlash(), 280);
    return () => clearTimeout(t);
  }, [screenFlash, clearScreenFlash]);

  // Impact SFX — one representative synth sound per batch of damage events,
  // so AoE hits don't turn into a wall of noise. (These synths already exist
  // in audio-manager; CombatUI just wasn't triggering them.)
  useEffect(() => {
    if (damageEvents.length === 0) return;
    const real = damageEvents.filter((e) => !e.isHeal);
    if (real.length === 0) return;
    const sfx = audioRef.current;
    if (real.some((e) => e.isCrit && !e.isMiss && !e.isDodged)) {
      sfx.crit?.();
      return;
    }
    const hit = real.find((e) => !e.isMiss && !e.isDodged);
    if (hit) {
      (hit.amount >= 60 ? sfx.hitHeavy : sfx.hitLight)?.();
      return;
    }
    if (real.some((e) => e.isDodged)) sfx.dodge?.();
    else if (real.some((e) => e.isMiss)) sfx.miss?.();
  }, [damageEvents]);

  // Attack wind-up SFX — saber swing / force crackle as the strike animates,
  // keyed off the first offensive attack event in a batch.
  useEffect(() => {
    if (attackEvents.length === 0) return;
    const swing = attackEvents.find((e) => e.attackerId !== e.targetId);
    if (!swing) return;
    const sfx = audioRef.current;
    if (swing.kind === "lightning" || swing.kind === "force") sfx.forceLightning?.();
    else if (swing.kind === "melee") sfx.saberSwing?.();
  }, [attackEvents]);

  // Enemy turn automation. executeEnemyTurns ends in "animating", and the
  // animating effect below is the ONLY place that advances the round —
  // a second (uncleared) advanceTurn timer here used to double-advance and
  // skip the player's turn entirely.
  useEffect(() => {
    if (phase === "enemyTurn") {
      const t = setTimeout(() => executeEnemyTurns(), 800);
      return () => clearTimeout(t);
    }
  }, [phase, executeEnemyTurns]);

  // Companions act (AI) on the player's side, after the player commits.
  useEffect(() => {
    if (phase === "allyTurn") {
      const t = setTimeout(() => executeAllyTurns(), 650);
      return () => clearTimeout(t);
    }
  }, [phase, executeAllyTurns]);

  // Animating → advance to the next side of the round
  useEffect(() => {
    if (phase === "animating") {
      const t = setTimeout(() => advanceTurn(), 700);
      return () => clearTimeout(t);
    }
  }, [phase, advanceTurn]);

  // Close the items popover whenever it's not the player's turn.
  useEffect(() => {
    if (phase !== "playerTurn") setShowItems(false);
  }, [phase]);

  // Announce the moment the ultimate finishes charging — a one-shot cue so the
  // player notices the gauge is ready without a permanent on-screen label.
  const prevLimitRef = useRef(limitBreak);
  useEffect(() => {
    if (prevLimitRef.current < 100 && limitBreak >= 100) {
      showToast("⚡ Ultimate ready — unleash your Limit Break!", "success");
      audioRef.current.crit?.();
    }
    prevLimitRef.current = limitBreak;
  }, [limitBreak, showToast]);

  // Auto-select sensible defaults at the start of the player's turn:
  // basic attack + first living enemy, KOTOR style — one click to fight.
  useEffect(() => {
    if (phase !== "playerTurn") return;
    if (!selectedSkill) selectSkill(BASIC_ATTACK.id);
    const targetAlive = enemies.some((e) => e.id === selectedTarget && e.isAlive);
    if (!targetAlive) {
      const first = enemies.find((e) => e.isAlive);
      if (first) selectTarget(first.id);
    }
  }, [phase, selectedSkill, selectedTarget, enemies, selectSkill, selectTarget]);

  // ── Handlers ────────────────────────────────────────────────────────

  const handleExecute = useCallback(() => {
    if (!selectedSkill) return;
    const skill = getSkill(selectedSkill) ?? BASIC_ATTACK;
    if (skill.targeting !== "self" && !selectedTarget) return;
    executePlayerAction();
    // Combat SFX now fire from the wind-up / impact effects below.
  }, [selectedSkill, selectedTarget, executePlayerAction]);

  // Persist the combat survivor's HP/FP back to the character so wounds carry
  // over between fights (a level-up later restores to full).
  const persistVitals = useCallback(() => {
    const p = useCombatStore.getState().player;
    if (p) setVitals(p.hp, p.fp);
  }, [setVitals]);

  const handleVictoryClose = useCallback(() => {
    persistVitals();
    bondPartyAfterVictory();
    // Toast first, then grant XP — addXp raises its own level-up toast and
    // a level-up should win over the generic victory message.
    showToast(`Victory! +${xpReward} XP, +${creditReward} credits`, "success");
    addCredits(creditReward);
    addXp(xpReward);
    endCombat();
  }, [xpReward, creditReward, addXp, addCredits, showToast, endCombat, persistVitals, bondPartyAfterVictory]);

  const handleDefeatClose = useCallback(() => {
    // Respawn at full vitals — defeat is its own penalty (no rewards).
    setVitals(Infinity, Infinity);
    showToast("You have fallen in battle.", "danger");
    endCombat();
  }, [showToast, endCombat, setVitals]);

  const handleFledClose = useCallback(() => {
    persistVitals();
    showToast("You escaped from combat.", "info");
    endCombat();
  }, [showToast, endCombat, persistVitals]);

  const handleCollectLoot = useCallback(() => {
    addItems(pendingLoot);
    collectLoot();
  }, [pendingLoot, addItems, collectLoot]);

  // Combat-usable consumables (medpacs, stims, adrenals, antidotes…), grouped
  // by item id with summed quantities — drawn from the persistent inventory.
  const combatItems = useMemo(() => {
    const map = new Map<string, { itemId: string; name: string; qty: number }>();
    for (const inv of inventory) {
      const item = getItem(inv.itemId);
      if (!item || !item.tags.includes("consumable")) continue;
      const existing = map.get(inv.itemId);
      if (existing) existing.qty += inv.qty;
      else map.set(inv.itemId, { itemId: inv.itemId, name: item.name, qty: inv.qty });
    }
    return [...map.values()];
  }, [inventory]);

  // Using an item applies its in-combat effect AND spends the turn (like Guard),
  // then removes one from the inventory so it persists after the fight.
  const handleUseItem = useCallback((itemId: string) => {
    useItem(itemId);
    removeItems([{ itemId, qty: 1 }]);
    setShowItems(false);
  }, [useItem, removeItems]);

  // ── Keyboard controls (KOTOR-fast play) ─────────────────────────────
  // Honors the player's rebindable hotkeys: 1-5 select abilities, Q/W/E/R
  // switch stance, Space commits the attack, Esc flees. Tab cycles target.
  const hotkeyBindings = useHotkeysStore((s) => s.bindings);
  useEffect(() => {
    if (phase !== "playerTurn" || !player) return;
    const loadout = getPlayerCombatSkills(player.skillIds);
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "Tab") {
        e.preventDefault();
        const alive = enemies.filter((en) => en.isAlive);
        if (alive.length === 0) return;
        const idx = alive.findIndex((en) => en.id === selectedTarget);
        const next = alive[(idx + 1) % alive.length] ?? alive[0];
        if (next) selectTarget(next.id);
        return;
      }

      const action = actionForKey(hotkeyBindings, e.key);
      if (!action) return;

      const skillMatch = /^skill_(\d)$/.exec(action);
      if (skillMatch) {
        const sk = loadout[Number(skillMatch[1]) - 1];
        if (sk && (player.cooldowns[sk.id] ?? 0) === 0 && player.fp >= (sk.cost.forcePoints ?? 0)) {
          e.preventDefault();
          selectSkill(sk.id);
        }
        return;
      }
      switch (action) {
        case "end_turn":          e.preventDefault(); handleExecute(); break;
        case "flee":              e.preventDefault(); fleeAttempt(); break;
        case "stance_aggressive": setStance("aggressive"); break;
        case "stance_defensive":  setStance("defensive"); break;
        case "stance_precision":  setStance("precision"); break;
        case "stance_frenzy":     setStance("frenzy"); break;
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    phase, player, enemies, selectedTarget, hotkeyBindings,
    selectSkill, selectTarget, handleExecute, fleeAttempt, setStance,
  ]);

  if (phase === "idle") return null;

  const skills = player ? getPlayerCombatSkills(player.skillIds) : [];
  const selectedSkillObj = selectedSkill ? (getSkill(selectedSkill) ?? BASIC_ATTACK) : null;
  const isPlayerTurn = phase === "playerTurn";

  // Tactical readout for the selected skill vs the currently selected enemy.
  const targetObj = selectedTarget
    ? enemies.find((e) => e.id === selectedTarget && e.isAlive) ?? null
    : null;
  const skillPreview =
    selectedSkillObj && player
      ? previewSkill(selectedSkillObj, player, targetObj)
      : null;

  // Forecast damage per enemy for the selected skill — drives the chip-damage
  // overlay on each hit foe's HP bar (base estimate; excludes situational
  // combo/synergy/chain). Covers cone/aoe spread, not just the primary target.
  const forecasts =
    isPlayerTurn && selectedSkillObj && player
      ? forecastDamageByEnemy(selectedSkillObj, player, enemies, selectedTarget)
      : new Map<string, number>();
  const selectedForecast = selectedTarget ? forecasts.get(selectedTarget) ?? null : null;

  // Ritual encounters (Trial of Blood) get a blood-rite arena treatment.
  const isRitual = combatSeed.includes("trial_of_blood");

  // ── Skill-chain rotation tracker ────────────────────────────────────
  // In progress: the chain matching the tail of the skill history.
  const chainState = detectChainProgress(skillHistory);
  const activeChain =
    chainState && chainState.progress < chainState.chain.sequence.length
      ? chainState
      : null;
  const nextChainSkillId = activeChain
    ? activeChain.chain.sequence[activeChain.progress] ?? null
    : null;
  const chainSkillName = (id: string) => getSkill(id)?.name ?? id;

  // ── Attack animation state ──────────────────────────────────────────
  const playerMeleeLunge = attackEvents.some(
    (e) => e.attackerId === "player" && e.targetId !== "player" && e.kind === "melee",
  );
  const playerCasting = attackEvents.some(
    (e) => e.attackerId === "player" && e.targetId !== "player" && e.kind !== "melee",
  );
  const playerSelfEvent = attackEvents.find(
    (e) => e.attackerId === "player" && e.targetId === "player",
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Battlefield backdrop — darkens the live zone scene underneath */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,1,6,0.78) 0%, rgba(4,2,10,0.55) 38%, rgba(3,2,8,0.62) 100%)",
        }}
      />
      {/* Arena glow tinted by the zone palette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 90% 50% at 50% 58%, ${arenaAccentSoft} 0%, transparent 65%)`,
      }} />
      {/* Ground plane: subtle perspective grid + arena ring */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{
        top: "62%",
        background: `linear-gradient(to bottom, ${scenePalette.ground[0]}cc 0%, ${scenePalette.ground[1]}e6 100%)`,
        opacity: 0.55,
      }} />
      <div className="absolute pointer-events-none" style={{
        left: "50%", top: "60%",
        width: "78%", height: "34%",
        transform: "translateX(-50%)",
        borderRadius: "50%",
        border: `1px solid ${arenaAccent.replace(/[\d.]+\)$/, "0.22)")}`,
        background: `radial-gradient(ellipse at 50% 50%, ${arenaAccentSoft} 0%, transparent 70%)`,
        filter: "blur(0.5px)",
      }} />
      {/* Floor line */}
      <div className="absolute inset-x-0" style={{
        top: "62%",
        background: `linear-gradient(90deg, transparent 0%, ${arenaAccent.replace(/[\d.]+\)$/, "0.35)")} 30%, ${arenaAccent.replace(/[\d.]+\)$/, "0.35)")} 70%, transparent 100%)`,
        height: "1px",
      }} />

      {/* Weather atmosphere matching the encounter */}
      <WeatherOverlay weather={weather} reducedMotion={reducedMotion} />

      {/* ── Ritual arena dressing (Trial of Blood) ──────────────────── */}
      {isRitual && (
        <>
          {/* Blood-red pall over the pit */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 80% 55% at 50% 62%, rgba(160,10,30,0.20) 0%, transparent 70%)",
          }} />
          {/* Inner rune ring */}
          <div className="absolute pointer-events-none" style={{
            left: "50%", top: "63%",
            width: "56%", height: "24%",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            border: "1px dashed rgba(220,40,70,0.45)",
            boxShadow: "0 0 24px rgba(180,20,50,0.25) inset",
          }} />
          {/* Brazier flames around the ring */}
          {[12, 36, 64, 88].map((x, i) => (
            <div key={i} className="absolute pointer-events-none animate-pulse" style={{
              left: `${x}%`, top: i % 2 === 0 ? "58%" : "74%",
              width: 22, height: 30,
              background: "radial-gradient(ellipse 50% 65% at 50% 80%, rgba(255,120,50,0.75) 0%, rgba(200,30,40,0.4) 45%, transparent 75%)",
              filter: "blur(2px)",
              animationDuration: `${1.6 + i * 0.4}s`,
            }} />
          ))}
        </>
      )}

      {/* Help / legend toggle (top-right) */}
      <button
        type="button"
        onClick={() => setShowHelp((v) => !v)}
        title="Combat legend — keys, status effects, damage types"
        className="absolute top-3 right-3 z-30 h-7 w-7 rounded-full border border-gilt-600/40 bg-void-950/80 text-gilt-300 text-sm font-display hover:bg-gilt-900/30 transition"
      >
        ?
      </button>
      {showHelp && <CombatLegend bindings={hotkeyBindings} onClose={() => setShowHelp(false)} />}

      {/* ── Turn banner ─────────────────────────────────────────────── */}
      <div className="relative z-10 pt-3 px-4 text-center flex-none">
        <div className="inline-flex items-center gap-3 rounded-sm border border-gilt-600/20 bg-void-950/80 px-5 py-1.5 backdrop-blur-sm">
          <span className="font-display text-xs text-ash-500 uppercase tracking-[0.3em]">Turn {turnNumber}</span>
          <span className="text-ash-700">·</span>
          <PhaseTag phase={phase} />
        </div>
        {isRitual && (
          <div className="mt-1.5">
            <span className="inline-block rounded-sm border border-blood-600/40 bg-blood-950/60 px-4 py-0.5 font-display text-[10px] uppercase tracking-[0.4em] text-blood-300">
              ⚝ Trial of Blood — the failed feed the worthy
            </span>
          </div>
        )}
        {weather !== "clear" && (
          <div className="mt-1.5">
            <span
              title={WEATHER_EFFECTS[weather].description}
              className="inline-flex items-center gap-1.5 rounded-sm border border-force-700/40 bg-void-950/70 px-3 py-0.5 font-display text-[10px] uppercase tracking-[0.3em] text-force-300"
            >
              ☁ {WEATHER_EFFECTS[weather].label}
            </span>
          </div>
        )}
      </div>

      {/* ── Screen flash overlay (crit / kill / limit / damage) ────── */}
      <AnimatePresence>
        {screenFlash && (
          <motion.div
            key={screenFlash}
            className={clsx(
              "pointer-events-none absolute inset-0 z-30 mix-blend-screen",
              screenFlash === "crit"   && "bg-gilt-500/30",
              screenFlash === "kill"   && "bg-blood-600/35",
              screenFlash === "limit"  && "bg-force-400/40",
              screenFlash === "damage" && "bg-blood-900/40",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      {/* ── Turn banner sweep (KOTOR round announce) ─────────────────── */}
      <TurnBanner phase={phase} turnNumber={turnNumber} />

      {/* ── Combo / Limit Break HUD (top-right) ──────────────────────── */}
      {player && (
        <div className="relative z-20 mt-2 px-6 h-12 pointer-events-none">
          {/* Combo counter — absolutely pinned left so it can never shove the
              ultimate gauge sideways (the old shared flex row made the gauge
              jump between left and right as combos came and went). */}
          <AnimatePresence>
            {comboCount > 0 && (
              <motion.div
                key={comboCount}
                initial={{ scale: 0.6, opacity: 0, x: -20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-6 top-1 flex items-baseline gap-2"
              >
                <span className="font-display text-4xl font-black text-gilt-300 drop-shadow-[0_0_8px_rgba(217,168,90,0.6)]">
                  {comboCount}
                </span>
                <span className="font-display text-xs uppercase tracking-[0.3em] text-gilt-500">
                  COMBO {comboCount >= 3 && `×${1 + Math.floor(comboCount / 3) * 20}%`}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ultimate / Limit Break gauge — ALWAYS centered & fixed-width, so it
              stays put regardless of combos. Becomes a glowing UNLEASH button
              when fully charged. */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-80 max-w-[80vw] pointer-events-auto">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] mb-1">
              <span className={clsx("font-display", limitBreak >= 100 ? "text-gilt-300" : "text-force-400")}>
                ⚡ Ultimate
              </span>
              <span className={limitBreak >= 100 ? "text-gilt-300" : "text-ash-500"}>
                {limitBreak >= 100 ? "READY" : `${limitBreak}%`}
              </span>
            </div>
            <button
              type="button"
              disabled={limitBreak < 100 || !isPlayerTurn}
              onClick={() => unleashLimitBreak()}
              title={limitBreak >= 100
                ? "Unleash your ultimate — a guaranteed-crit Force detonation hitting every enemy."
                : "Charges as you land hits, crits and chains. Fires at 100%."}
              className={clsx(
                "h-5 w-full rounded-sm border overflow-hidden transition relative",
                limitBreak >= 100 && isPlayerTurn
                  ? "border-gilt-400/90 shadow-[0_0_22px_rgba(217,168,90,0.7)] cursor-pointer hover:shadow-[0_0_30px_rgba(217,168,90,0.9)] animate-pulse"
                  : "border-force-700/50 cursor-default",
              )}
            >
              <div
                className={clsx(
                  "h-full transition-all duration-500",
                  limitBreak >= 100
                    ? "bg-gradient-to-r from-blood-600 via-gilt-400 to-force-400"
                    : "bg-gradient-to-r from-force-800 via-force-600 to-force-400",
                )}
                style={{ width: `${limitBreak}%` }}
              />
              <span className={clsx(
                "absolute inset-0 flex items-center justify-center font-display tracking-[0.25em] font-black",
                limitBreak >= 100
                  ? "text-[11px] text-void-950"
                  : "text-[9px] text-force-200/70",
              )}>
                {limitBreak >= 100 ? "⚡ UNLEASH ⚡" : "LIMIT BREAK"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ── Battlefield ──────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex-1 flex items-end justify-center gap-8 sm:gap-16 px-6 pb-2 overflow-hidden"
        animate={arenaShake ? { x: [0, -9, 8, -6, 5, -2, 0], y: [0, 4, -3, 3, -2, 1, 0] } : { x: 0, y: 0 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      >

        {/* Player */}
        {player && (
          <motion.div
            className="flex flex-col items-center gap-2 relative"
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              style={{ height: 160 }}
              className={clsx("relative", playerShake && "hit-flash")}
              animate={
                playerShake ? { x: [-6, 6, -4, 4, 0], scale: 1 }
                : playerMeleeLunge ? { x: [0, 95, 0], scale: 1 }
                : playerCasting ? { x: 0, scale: [1, 1.07, 1] }
                : { x: 0, scale: 1 }
              }
              transition={{
                duration: playerMeleeLunge ? 0.55 : 0.35,
                type: "tween",
                ease: "easeInOut",
              }}
            >
              {(() => {
                const aura = dominantStatusAura(player.statusEffects);
                return aura ? <StatusAura color={aura} /> : null;
              })()}
              {player.hp / player.maxHp < 0.3 && <WoundedAura />}
              <CombatPlayerSilhouette
                classId={playerClassId}
                breathing={!reducedMotion}
                state={playerShake ? "hurt" : playerMeleeLunge || playerCasting ? "attack" : "idle"}
              />
              {/* Incoming attack impact effects */}
              {attackEvents
                .filter((e) => e.targetId === "player" && e.attackerId !== "player")
                .map((ev) => (
                  <ImpactEffect key={ev.id} kind={ev.kind} />
                ))}
              {/* Self buff / heal aura */}
              {playerSelfEvent && <SelfAura key={playerSelfEvent.id} kind={playerSelfEvent.kind} />}
              {/* Player damage events */}
              {damageNumbersEnabled && damageEvents.filter((e) => e.targetId === "player").map((ev) => (
                <Fragment key={ev.id}>
                  <FloatingNumber event={ev} side="left" />
                  {ev.d20 && <D20Chip d20={ev.d20} />}
                </Fragment>
              ))}
            </motion.div>
            <CombatantCard combatant={player} />
          </motion.div>
        )}

        {/* Allies (companions fighting on your side) */}
        {allies.length > 0 && (
          <div className="flex items-end gap-3 sm:gap-4">
            {allies.map((ally, idx) => {
              const allyLunging = attackEvents.some(
                (e) => e.attackerId === ally.id && e.targetId !== ally.id && e.kind === "melee",
              );
              const allyCasting = attackEvents.some(
                (e) => e.attackerId === ally.id && e.targetId !== ally.id && e.kind !== "melee",
              );
              const allyHit = damageEvents.some(
                (e) => e.targetId === ally.id && !e.isMiss && !e.isDodged && !e.isHeal,
              );
              return (
                <motion.div
                  key={ally.id}
                  className="flex flex-col items-center gap-2 relative"
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: ally.isAlive ? 1 : 0.3 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                >
                  <motion.div
                    style={{ height: 124 }}
                    className={clsx("relative", allyHit && "hit-flash", !ally.isAlive && "grayscale")}
                    animate={
                      !ally.isAlive ? { y: 10, rotate: -10 }
                      : allyHit ? { x: [-4, 4, -3, 3, 0] }
                      : allyLunging ? { x: [0, 60, 0] }
                      : allyCasting ? { scale: [1, 1.05, 1] }
                      : { x: 0, scale: 1 }
                    }
                    transition={{ duration: allyLunging ? 0.5 : 0.3, ease: "easeInOut" }}
                  >
                    {(() => {
                      const aura = dominantStatusAura(ally.statusEffects);
                      return ally.isAlive && aura ? <StatusAura color={aura} /> : null;
                    })()}
                    {ally.isAlive && ally.hp / ally.maxHp < 0.3 && <WoundedAura />}
                    <CombatAllySilhouette
                      companionId={ally.id.replace(/^ally_/, "")}
                      isAlive={ally.isAlive}
                      breathing={!reducedMotion && ally.isAlive}
                      state={!ally.isAlive ? "down" : allyHit ? "hurt" : allyLunging || allyCasting ? "attack" : "idle"}
                    />
                    {attackEvents
                      .filter((e) => e.targetId === ally.id && e.attackerId !== ally.id)
                      .map((ev) => (<ImpactEffect key={ev.id} kind={ev.kind} />))}
                    {damageNumbersEnabled && damageEvents.filter((e) => e.targetId === ally.id).map((ev) => (
                      <Fragment key={ev.id}>
                        <FloatingNumber event={ev} side="left" />
                        {ev.d20 && <D20Chip d20={ev.d20} />}
                      </Fragment>
                    ))}
                  </motion.div>
                  <CombatantCard combatant={ally} compact />
                  {isPlayerTurn && ally.isAlive && <AllyTacticChip ally={ally} onSet={setAllyTactic} />}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* VS */}
        <div className="flex flex-col items-center gap-1 mb-24 select-none">
          <span className="font-display text-blood-600/30 text-sm tracking-[0.4em]">VS</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-blood-600/20 to-transparent" />
        </div>

        {/* Enemies — staggered formation so groups don't pile into one blob */}
        <div className="flex gap-5 sm:gap-9 items-end">
          {enemies.map((enemy, idx) => {
            const enemyLunging = attackEvents.some(
              (e) => e.attackerId === enemy.id && e.targetId === "player" && e.kind === "melee",
            );
            const enemyCasting = attackEvents.some(
              (e) => e.attackerId === enemy.id && e.targetId === "player" && e.kind !== "melee",
            );
            const enemySelfEvent = attackEvents.find(
              (e) => e.attackerId === enemy.id && e.targetId === enemy.id,
            );
            return (
            <motion.div
              key={enemy.id}
              className="flex flex-col items-center gap-2 relative"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: enemy.isAlive ? 1 : 0.25 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              style={{ marginBottom: (idx % 2) * 18, zIndex: 20 - idx }}
            >
              <motion.button
                disabled={!enemy.isAlive || !isPlayerTurn}
                onClick={() => isPlayerTurn && enemy.isAlive && selectTarget(enemy.id)}
                animate={
                  !enemy.isAlive ? { x: 0, y: 12, rotate: 14 }
                  : enemyShake === enemy.id ? { x: [-5, 5, -3, 3, 0], y: 0, rotate: 0 }
                  : enemyLunging ? { x: [0, -75, 0], y: 0, rotate: 0 }
                  : enemyCasting ? { x: 0, y: 0, rotate: 0, scale: [1, 1.06, 1] }
                  : { x: 0, y: 0, rotate: 0 }
                }
                transition={{
                  duration: !enemy.isAlive ? 0.7 : enemyLunging ? 0.55 : 0.3,
                  type: "tween",
                  ease: "easeInOut",
                }}
                className={clsx(
                  "relative flex flex-col items-center p-2 rounded transition",
                  enemy.isAlive && isPlayerTurn && "cursor-pointer hover:bg-blood-900/20",
                  selectedTarget === enemy.id && "ring-1 ring-blood-400/70 bg-blood-900/15",
                  staggeredEnemies.includes(enemy.id) && "ring-1 ring-gilt-500/50",
                  enemyShake === enemy.id && "hit-flash",
                  !enemy.isAlive && "grayscale",
                )}
                style={{ height: 130 + (enemy.maxHp > 900 ? 25 : 0) }}
                title={enemy.name}
              >
                <CombatEnemySilhouette
                  isBoss={enemy.maxHp > 900}
                  isAlive={enemy.isAlive}
                  enemyId={enemy.id}
                  breathing={!reducedMotion && enemy.isAlive}
                  phase={idx}
                  state={
                    !enemy.isAlive
                      ? "down"
                      : enemyShake === enemy.id
                        ? "hurt"
                        : enemyLunging || enemyCasting
                          ? "attack"
                          : "idle"
                  }
                />
                {/* Persistent status aura (burn / poison / shock / bleed / corruption) */}
                {enemy.isAlive && (() => {
                  const aura = dominantStatusAura(enemy.statusEffects);
                  return aura ? <StatusAura color={aura} /> : null;
                })()}
                {/* Heartbeat vignette when the foe is near death */}
                {enemy.isAlive && enemy.hp / enemy.maxHp < 0.3 && <WoundedAura />}
                {/* Targeting bracket on the selected foe */}
                {selectedTarget === enemy.id && enemy.isAlive && isPlayerTurn && <TargetReticle />}
                {/* Incoming attack impact effects */}
                {attackEvents
                  .filter((e) => e.targetId === enemy.id && e.attackerId !== enemy.id)
                  .map((ev) => (
                    <ImpactEffect key={ev.id} kind={ev.kind} />
                  ))}
                {/* Self buff / heal aura */}
                {enemySelfEvent && <SelfAura key={enemySelfEvent.id} kind={enemySelfEvent.kind} />}
                {/* One-shot death dissolve */}
                {deathBursts.includes(enemy.id) && <DeathBurst />}
                {staggeredEnemies.includes(enemy.id) && (
                  <div className="absolute -top-1 left-0 right-0 text-center text-[8px] text-gilt-400 font-display uppercase tracking-widest">
                    Staggered
                  </div>
                )}
              </motion.button>
              {/* Enemy damage events */}
              {damageNumbersEnabled && damageEvents.filter((e) => e.targetId === enemy.id).map((ev) => (
                <Fragment key={ev.id}>
                  <FloatingNumber event={ev} side="right" />
                  {ev.d20 && <D20Chip d20={ev.d20} />}
                </Fragment>
              ))}
              <CombatantCard
                combatant={enemy}
                compact
                pendingDamage={enemy.isAlive ? forecasts.get(enemy.id) : undefined}
              />
            </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Controls ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-none flex flex-col items-center gap-2 px-4 pb-4 pt-2">

        {/* Step-by-step prompt + selected skill info */}
        {isPlayerTurn && player && (
          <div className="w-full max-w-3xl flex items-stretch gap-2">
            <div className="flex-1 rounded-sm border border-ash-700/30 bg-void-950/70 px-3 py-1.5 flex items-center gap-3">
              {selectedSkillObj ? (
                <>
                  <span className="font-display text-xs uppercase tracking-wider text-gilt-300 whitespace-nowrap inline-flex items-center gap-1.5">
                    {selectedSkillObj.damage?.type && (
                      <span
                        title={DAMAGE_TYPE_VISUALS[selectedSkillObj.damage.type].label}
                        className={clsx("text-[11px]", DAMAGE_TYPE_VISUALS[selectedSkillObj.damage.type].text)}
                      >
                        {DAMAGE_TYPE_VISUALS[selectedSkillObj.damage.type].glyph}
                      </span>
                    )}
                    {selectedSkillObj.name}
                  </span>
                  <span className="text-[11px] text-ash-400 leading-tight truncate flex-1 hidden sm:block">
                    {selectedSkillObj.description}
                  </span>
                  <div className="flex gap-2.5 text-[10px] whitespace-nowrap items-center">
                    {skillPreview?.dmg && (
                      <span
                        className={clsx(
                          selectedSkillObj.damage?.type
                            ? DAMAGE_TYPE_VISUALS[selectedSkillObj.damage.type].text
                            : "text-blood-300",
                        )}
                        title={skillPreview.crit ? `Crit up to ${skillPreview.crit}` : undefined}
                      >
                        ~{skillPreview.dmg} dmg
                      </span>
                    )}
                    {skillPreview?.hit != null && (
                      <span className={clsx("font-semibold tabular-nums", hitChanceColor(skillPreview.hit))}>
                        {skillPreview.hit}% hit
                      </span>
                    )}
                    {skillPreview?.critPct != null && skillPreview.critPct > 0 && (
                      <span className="text-gilt-400 tabular-nums" title="Critical chance">
                        {skillPreview.critPct}% crit
                      </span>
                    )}
                    {skillPreview?.effectiveness && (
                      <span className={clsx(
                        "uppercase tracking-wider border px-1 rounded font-bold",
                        EFFECTIVENESS_VISUALS[skillPreview.effectiveness].cls,
                      )}>
                        {EFFECTIVENESS_VISUALS[skillPreview.effectiveness].label}
                      </span>
                    )}
                    {selectedForecast != null && targetObj && selectedForecast >= targetObj.hp && (
                      <span
                        className="uppercase tracking-wider border border-blood-500/70 text-blood-200 bg-blood-900/40 px-1 rounded font-bold animate-pulse"
                        title="This strike is forecast to defeat the target."
                      >
                        ☠ Lethal
                      </span>
                    )}
                    <span className="text-ash-500">
                      {targetObj && selectedSkillObj.targeting === "aoe"
                        ? `hits all (${enemies.filter((e) => e.isAlive).length})`
                        : selectedSkillObj.targeting === "cone"
                          ? `hits up to ${Math.min(3, enemies.filter((e) => e.isAlive).length)}`
                          : TARGETING_LABEL[selectedSkillObj.targeting ?? "single"]}
                    </span>
                    {(selectedSkillObj.cost.forcePoints ?? 0) > 0 && (
                      <span className="text-force-400">{selectedSkillObj.cost.forcePoints} FP</span>
                    )}
                    {(selectedSkillObj.statusEffects ?? []).map((se, i) => {
                      const v = STATUS_VISUALS[se.effect];
                      return (
                        <span
                          key={i}
                          title={`${v?.label ?? se.effect}: ${Math.round(se.chance * 100)}% for ${se.duration} turn${se.duration === 1 ? "" : "s"}`}
                          className={clsx("inline-flex items-center gap-0.5", v?.pill ?? "text-ash-300", "border px-1 rounded")}
                        >
                          <span aria-hidden>{v?.glyph ?? "•"}</span>
                          {Math.round(se.chance * 100)}%
                        </span>
                      );
                    })}
                  </div>
                </>
              ) : (
                <span className="text-[11px] text-ash-500 italic">Choose an ability below.</span>
              )}
            </div>
          </div>
        )}

        {/* Skill-chain tracker — only while a chain is actually in progress, so
            it doesn't add a permanent text box during normal play. */}
        {isPlayerTurn && player && activeChain && (
          <div className="w-full max-w-3xl">
            {(
              <div className="flex items-center gap-2 rounded-sm border border-force-500/40 bg-force-950/40 px-3 py-1 text-[10px]">
                <span className="font-display uppercase tracking-widest text-force-300">
                  ⛓ {activeChain.chain.name}
                </span>
                <span className="flex items-center gap-1 text-ash-400">
                  {activeChain.chain.sequence.map((id, i) => (
                    <span key={id} className="flex items-center gap-1">
                      {i > 0 && <span className="text-ash-600">→</span>}
                      <span className={clsx(
                        i < activeChain.progress && "text-gilt-300 line-through decoration-gilt-500/60",
                        i === activeChain.progress && "text-force-200 font-bold animate-pulse",
                        i > activeChain.progress && "text-ash-500",
                      )}>
                        {chainSkillName(id)}
                      </span>
                    </span>
                  ))}
                </span>
                <span className="ml-auto text-gilt-400 whitespace-nowrap">
                  finish: +{Math.round((activeChain.chain.finalDamageMult - 1) * 100)}% dmg
                </span>
              </div>
            )}
          </div>
        )}

        {/* Abilities row */}
        {isPlayerTurn && player && (
          <div className="w-full max-w-3xl flex items-end gap-2">
            <div className="flex-1">
              <div className="text-[9px] uppercase tracking-[0.3em] text-ash-600 mb-1 font-display">
                Abilities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((sk, i) => {
                  const cd = player.cooldowns[sk.id] ?? 0;
                  const fpCost = sk.cost.forcePoints ?? 0;
                  const cdCost = sk.cost.cooldown ?? 0;
                  const insufficientFp = player.fp < fpCost;
                  const isDisabled = cd > 0 || insufficientFp;
                  const isSelected = selectedSkill === sk.id;
                  const isChainNext = !isDisabled && sk.id === nextChainSkillId;
                  const hotkey = i < 5 ? hotkeyBindings[`skill_${i + 1}` as HotkeyAction] : null;
                  return (
                    <button
                      key={sk.id}
                      onClick={() => !isDisabled && selectSkill(sk.id)}
                      disabled={isDisabled}
                      title={sk.description}
                      className={clsx(
                        "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-sm border transition min-w-[84px]",
                        isSelected
                          ? "border-gilt-400/60 bg-gilt-900/25 shadow-[0_0_10px_rgba(217,168,90,0.2)]"
                          : "border-ash-700/30 bg-void-950/60 hover:border-blood-600/50 hover:bg-blood-950/25",
                        isChainNext && !isSelected &&
                          "border-force-400/70 shadow-[0_0_10px_rgba(124,58,237,0.35)]",
                        isDisabled && "opacity-35 cursor-not-allowed hover:border-ash-700/30 hover:bg-void-950/60",
                      )}
                    >
                      {hotkey && (
                        <span className="absolute top-0.5 right-0.5 text-[8px] leading-none text-ash-600 font-mono uppercase">
                          {hotkey === " " ? "␣" : hotkey}
                        </span>
                      )}
                      <span className={clsx(
                        "text-[10px] uppercase tracking-wider font-display leading-none inline-flex items-center gap-1",
                        isSelected ? "text-gilt-300" : "text-ash-200",
                      )}>
                        {sk.damage?.type && (
                          <span
                            className={clsx("h-1.5 w-1.5 rounded-full shrink-0", DAMAGE_TYPE_VISUALS[sk.damage.type].dot)}
                            title={DAMAGE_TYPE_VISUALS[sk.damage.type].label}
                          />
                        )}
                        {sk.name}
                      </span>
                      <div className="flex gap-1.5 items-center text-[9px]">
                        {fpCost > 0 && (
                          <span className={insufficientFp ? "text-blood-400" : "text-force-400"}>
                            {fpCost}fp
                          </span>
                        )}
                        {cdCost > 0 && cd === 0 && (
                          <span className="text-ash-600">cd{cdCost}</span>
                        )}
                        {cd > 0 && (
                          <span className="text-blood-400 font-bold">{cd}t</span>
                        )}
                        {fpCost === 0 && cd === 0 && cdCost === 0 && (
                          <span className="text-ash-600">free</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Big attack button — pulses when ready */}
            <button
              onClick={handleExecute}
              disabled={
                !selectedSkill ||
                (selectedSkillObj?.targeting !== "self" && !selectedTarget)
              }
              className={clsx(
                "flex flex-col items-center justify-center px-6 py-3 rounded-sm border-2 transition min-w-[120px] self-stretch",
                selectedSkill && (selectedSkillObj?.targeting === "self" || selectedTarget)
                  ? "border-blood-400/80 bg-blood-900/50 hover:bg-blood-700/60 text-gilt-200 shadow-[0_0_16px_rgba(220,40,80,0.4)] animate-pulse"
                  : "border-ash-700/20 bg-void-950/40 text-ash-600 cursor-not-allowed",
              )}
            >
              <span className="text-sm font-display uppercase tracking-widest font-bold">
                ⚔ Attack
              </span>
              <span className="text-[9px] text-ash-400">
                {!selectedSkill
                  ? "choose ability"
                  : selectedSkillObj?.targeting !== "self" && !selectedTarget
                    ? "click an enemy"
                    : selectedSkillObj?.targeting === "self"
                      ? "use on self"
                      : "strike now"}
              </span>
            </button>
          </div>
        )}

        {/* Tactics row */}
        {isPlayerTurn && player && (
          <div className="w-full max-w-3xl flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.3em] text-ash-600 font-display">
              Tactics
            </span>
            {(["aggressive", "defensive", "precision", "frenzy"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStance(st)}
                title={STANCE_HINT[st]}
                className={clsx(
                  "text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm border transition",
                  player.stance === st
                    ? "border-gilt-500/60 bg-gilt-900/30 text-gilt-300"
                    : "border-ash-700/30 text-ash-500 hover:text-ash-300 hover:border-ash-500/40",
                )}
              >
                {st}
              </button>
            ))}
            <div className="flex-1" />
            {/* Use a consumable — opens a small popover of carried items */}
            <div className="relative">
              {/* Click-away catcher so the popover dismisses when clicking elsewhere */}
              {showItems && (
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowItems(false)}
                  aria-hidden
                />
              )}
              <button
                onClick={() => setShowItems((v) => !v)}
                title="Use a consumable (medpac, stim, adrenal…). Spends your turn."
                className={clsx(
                  "text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm border transition",
                  showItems
                    ? "border-gilt-500/60 bg-gilt-900/30 text-gilt-300"
                    : "border-emerald-700/40 text-emerald-300 hover:bg-emerald-900/20",
                )}
              >
                ✚ Items{combatItems.length > 0 && <span className="ml-1 text-ash-500">({combatItems.length})</span>}
              </button>
              <AnimatePresence>
                {showItems && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full right-0 mb-1.5 w-52 rounded-sm border border-ash-700/40 bg-void-950/95 backdrop-blur-sm p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] z-30"
                  >
                    {combatItems.length === 0 ? (
                      <p className="text-[10px] text-ash-500 italic px-1.5 py-1">No consumables carried.</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {combatItems.map((it) => (
                          <button
                            key={it.itemId}
                            onClick={() => handleUseItem(it.itemId)}
                            className="flex items-center justify-between gap-2 px-2 py-1 rounded-sm border border-ash-700/30 hover:border-emerald-600/50 hover:bg-emerald-950/30 transition text-left"
                          >
                            <span className="text-[11px] text-ash-200 truncate flex items-center gap-1.5">
                              <span className="text-emerald-400">✚</span>{it.name}
                            </span>
                            <span className="text-[10px] text-ash-500 tabular-nums shrink-0">×{it.qty}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => guard()}
              title="Spend your turn bracing: +50% armor and shake off fear, stun, cripple, and blind."
              className="text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-force-700/40 text-force-400 hover:bg-force-900/20 transition"
            >
              🛡 Guard
            </button>
            <button
              onClick={() => fleeAttempt()}
              title="Try to escape the fight (agility-based). Failing gives the enemy a free round!"
              className="text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm border border-ash-600/30 text-ash-400 hover:text-blood-400 hover:border-blood-700/40 transition"
            >
              🏃 Flee
            </button>
          </div>
        )}

        {/* Enemy turn indicator */}
        {phase === "enemyTurn" && (
          <div className="flex items-center gap-2 text-blood-400 text-xs font-display uppercase tracking-widest animate-pulse">
            <span>Enemy acting</span>
            <span>···</span>
          </div>
        )}

        {/* Combat log */}
        <div className="w-full max-w-2xl h-24 overflow-y-auto panel px-3 py-2 text-[11px] leading-relaxed scrollbar-thin">
          <AnimatePresence initial={false}>
            {log.slice(-8).map((entry, i) => {
              const isAlly = entry.actorId.startsWith("ally_");
              const isPlayerActor = entry.actorId === "player";
              const isFriendly = isPlayerActor || isAlly;
              return (
              <motion.div
                key={`${entry.turn}-${entry.actorId}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={clsx(
                  "py-px pl-2 border-l-2 flex items-baseline gap-1.5",
                  isAlly ? "border-force-600/40" : isPlayerActor ? "border-gilt-600/40" : "border-blood-700/40",
                  entry.result?.isCrit && "text-gilt-400 font-semibold",
                  entry.result?.isMiss && "text-ash-500 italic",
                  entry.result?.isDodged && "text-force-300 italic",
                  !entry.result?.isCrit && !entry.result?.isMiss && !entry.result?.isDodged && (
                    isAlly ? "text-force-200" : isPlayerActor ? "text-ash-200" : "text-blood-300"
                  ),
                )}
              >
                <span aria-hidden className={clsx("text-[9px] shrink-0", isAlly ? "text-force-400" : isPlayerActor ? "text-gilt-500" : "text-blood-500")}>
                  {isFriendly ? "⚔" : "✦"}
                </span>
                <span>{entry.text}</span>
              </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={logEndRef} />
        </div>
      </div>

      {/* ── Loot phase overlay ────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "loot" && (
          <LootScreen
            pendingLoot={pendingLoot}
            xpReward={xpReward}
            creditReward={creditReward}
            onCollect={handleCollectLoot}
          />
        )}
      </AnimatePresence>

      {/* ── Victory / Defeat / Fled overlays ─────────────────────────── */}
      <AnimatePresence>
        {phase === "victory" && (
          <EndScreen
            title="Victory"
            titleColor="text-gilt-400"
            xp={xpReward}
            credits={creditReward}
            loot={[]}
            action={{ label: "Continue", onClick: handleVictoryClose }}
          />
        )}
        {phase === "defeat" && (
          <EndScreen
            title="Defeat"
            titleColor="text-blood-400"
            subtitle="The dark side claimed another aspirant."
            action={{ label: "Respawn", onClick: handleDefeatClose }}
          />
        )}
        {phase === "fled" && (
          <EndScreen
            title="Escaped"
            titleColor="text-force-400"
            subtitle="You fled the battlefield."
            action={{ label: "Continue", onClick: handleFledClose }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Phase tag ────────────────────────────────────────────────────────

function PhaseTag({ phase }: { phase: string }) {
  const map: Record<string, [string, string]> = {
    playerTurn: ["Your Turn", "text-gilt-300"],
    allyTurn:   ["Allies Act", "text-force-300"],
    enemyTurn:  ["Enemy Turn", "text-blood-400"],
    animating:  ["···", "text-ash-500"],
    start:      ["Battle begins!", "text-ash-200"],
    victory:    ["Victory!", "text-gilt-400"],
    defeat:     ["Defeat", "text-blood-500"],
    fled:       ["Escaped", "text-force-400"],
    loot:       ["Collecting loot", "text-gilt-300"],
  };
  const [label, cls] = map[phase] ?? ["···", "text-ash-500"];
  return <span className={clsx("text-xs font-display uppercase tracking-widest", cls)}>{label}</span>;
}

// ─── Combat legend / help ─────────────────────────────────────────────

function CombatLegend({
  bindings,
  onClose,
}: {
  bindings: Record<HotkeyAction, string>;
  onClose: () => void;
}) {
  const keyLabel = (k: string) => (k === " " ? "Space" : k);
  const controls: [string, string][] = [
    ["Abilities", `${keyLabel(bindings.skill_1)}–${keyLabel(bindings.skill_5)}`],
    ["Attack", keyLabel(bindings.end_turn)],
    ["Cycle target", "Tab"],
    ["Flee", keyLabel(bindings.flee)],
    ["Stances", `${keyLabel(bindings.stance_aggressive)} ${keyLabel(bindings.stance_defensive)} ${keyLabel(bindings.stance_precision)} ${keyLabel(bindings.stance_frenzy)}`],
  ];
  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto rounded-sm border border-gilt-600/30 bg-void-950/95 p-5 scrollbar-thin"
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="font-display text-gilt-400 tracking-wide">Combat Legend</div>
          <button onClick={onClose} className="text-ash-400 hover:text-ash-100 text-lg leading-none">×</button>
        </div>

        <LegendSection title="Controls">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
            {controls.map(([label, key]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-ash-400">{label}</span>
                <span className="font-mono text-gilt-300">{key}</span>
              </div>
            ))}
          </div>
        </LegendSection>

        <LegendSection title="Damage types">
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(DAMAGE_TYPE_VISUALS) as [string, { label: string; glyph: string; text: string }][]).map(([t, v]) => (
              <span key={t} className={clsx("inline-flex items-center gap-1 text-[10px] border border-ash-700/40 rounded px-1.5 py-0.5", v.text)}>
                <span aria-hidden>{v.glyph}</span>{v.label}
              </span>
            ))}
          </div>
        </LegendSection>

        <LegendSection title="Status effects">
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(STATUS_VISUALS) as [string, { label: string; glyph: string; pill: string }][]).map(([t, v]) => (
              <span key={t} className={clsx("inline-flex items-center gap-1 text-[10px] border rounded px-1.5 py-0.5", v.pill)}>
                <span aria-hidden>{v.glyph}</span>{v.label}
              </span>
            ))}
          </div>
        </LegendSection>

        <LegendSection title="Stances">
          <div className="flex flex-col gap-1 text-[11px]">
            {(["aggressive", "defensive", "precision", "frenzy"] as const).map((st) => (
              <div key={st} className="flex items-center gap-2">
                <span className={clsx("inline-flex items-center justify-center w-5 border rounded", STANCE_VISUALS[st]!.cls)}>
                  {STANCE_VISUALS[st]!.glyph}
                </span>
                <span className="text-ash-400">{STANCE_HINT[st]}</span>
              </div>
            ))}
          </div>
        </LegendSection>

        <LegendSection title="Enemy resistances">
          <p className="text-[11px] text-ash-400 leading-relaxed">
            On enemy cards: <span className="text-sky-300">▼ type</span> = resists that damage (less),{" "}
            <span className="text-orange-300">▲ type</span> = weak to it (more),{" "}
            <span className="text-ash-300">✕</span> = immune. Match your skill's element to a foe's weakness.
          </p>
        </LegendSection>
      </motion.div>
    </motion.div>
  );
}

function LegendSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[10px] uppercase tracking-[0.3em] text-ash-600 font-display mb-1.5">{title}</div>
      {children}
    </div>
  );
}

// ─── Ally tactic chip (live party command) ────────────────────────────

const ALLY_TACTICS = ["auto", "aggressive", "defensive", "focus"] as const;
const TACTIC_LABEL: Record<string, string> = {
  auto: "⚙ Auto", aggressive: "⚔ Aggro", defensive: "🛡 Def", focus: "🎯 Focus",
};

function AllyTacticChip({
  ally,
  onSet,
}: {
  ally: Combatant;
  onSet: (id: string, t: "auto" | "aggressive" | "defensive" | "focus") => void;
}) {
  const cur = ally.tactic ?? "auto";
  const next = ALLY_TACTICS[((ALLY_TACTICS as readonly string[]).indexOf(cur) + 1) % ALLY_TACTICS.length]!;
  return (
    <button
      onClick={() => onSet(ally.id, next)}
      title="Click to change this companion's tactic for their next turn"
      className="mt-1 text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-force-700/50 bg-force-950/40 text-force-300 hover:bg-force-900/50 transition"
    >
      {TACTIC_LABEL[cur]}
    </button>
  );
}

// ─── Combatant info card ──────────────────────────────────────────────

function CombatantCard({ combatant, compact, pendingDamage }: { combatant: import("@/game/engine/combat/combat-store").Combatant; compact?: boolean; pendingDamage?: number }) {
  return (
    <div className={clsx(
      "rounded-sm border border-ash-700/30 bg-void-950/80 backdrop-blur-sm shadow-[0_2px_18px_rgba(0,0,0,0.5)]",
      compact ? "w-40 px-2.5 py-2" : "w-56 px-3.5 py-2.5",
    )}>
      <div className={clsx(
        "font-display truncate text-gilt-400 mb-1.5 flex items-center justify-center gap-1.5",
        compact ? "text-xs" : "text-sm tracking-wide",
      )}>
        <span className="truncate">{combatant.name}</span>
        {combatant.isAlive && STANCE_VISUALS[combatant.stance] && (
          <span
            title={`${STANCE_VISUALS[combatant.stance]!.label} stance`}
            className={clsx(
              "shrink-0 inline-flex items-center text-[9px] border rounded px-1 leading-tight",
              STANCE_VISUALS[combatant.stance]!.cls,
            )}
          >
            {STANCE_VISUALS[combatant.stance]!.glyph}
          </span>
        )}
      </div>
      <CombatBar value={combatant.hp} max={combatant.maxHp} tone="blood" label="HP" big={!compact} pendingDamage={pendingDamage} />
      {combatant.maxFp > 0 && (
        <CombatBar value={combatant.fp} max={combatant.maxFp} tone="force" label="FP" big={!compact} />
      )}
      {combatant.statusEffects.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {combatant.statusEffects.slice(0, 6).map((se, i) => {
            const v = STATUS_VISUALS[se.effect];
            return (
              <span
                key={i}
                title={`${v?.label ?? se.effect} — ${se.duration} turn${se.duration === 1 ? "" : "s"}`}
                className={clsx(
                  "inline-flex items-center gap-0.5 text-[9px] border px-1 py-px rounded tracking-wide tabular-nums",
                  v?.pill ?? "text-ash-300 border-ash-600/40",
                )}
              >
                <span aria-hidden>{v?.glyph ?? "•"}</span>
                <span className="font-bold">{se.duration}</span>
              </span>
            );
          })}
        </div>
      )}
      {/* Notable resistances / vulnerabilities (enemies) — pick the strongest few */}
      {!combatant.isPlayer && combatant.isAlive && combatant.resistances && (() => {
        const notable = (Object.entries(combatant.resistances) as [import("@/game/engine/combat/damage").DamageType, number][])
          .filter(([, r]) => Math.abs(r) >= 0.2)
          .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
          .slice(0, 4);
        if (notable.length === 0) return null;
        return (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {notable.map(([type, r]) => {
              const v = DAMAGE_TYPE_VISUALS[type];
              const weak = r < 0;
              const immune = r >= 1;
              return (
                <span
                  key={type}
                  title={`${v.label}: ${immune ? "immune" : weak ? `+${Math.round(-r * 100)}% taken` : `-${Math.round(r * 100)}% taken`}`}
                  className={clsx(
                    "inline-flex items-center gap-0.5 text-[9px] border px-1 rounded",
                    weak ? "text-orange-300 border-orange-600/50" : "text-sky-300 border-sky-700/50",
                  )}
                >
                  <span aria-hidden>{v.glyph}</span>
                  {immune ? "✕" : weak ? "▲" : "▼"}
                </span>
              );
            })}
          </div>
        );
      })()}
      {!combatant.isPlayer && !combatant.isAlive && (
        <div className="text-[10px] text-blood-400 text-center mt-1 font-display uppercase tracking-widest">
          Defeated
        </div>
      )}
    </div>
  );
}

// ─── HP/FP bar ────────────────────────────────────────────────────────

function CombatBar({ value, max, tone, label, big, pendingDamage }: { value: number; max: number; tone: "blood" | "force"; label: string; big?: boolean; pendingDamage?: number }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const low = pct < 0.3;
  // Predicted-damage segment: the slice of the current bar that the selected
  // attack is forecast to remove, hatched at the leading edge of the HP fill.
  const pending = Math.max(0, Math.min(value, pendingDamage ?? 0));
  const remainPct = Math.max(0, Math.min(1, (value - pending) / max));
  return (
    <div className="w-full mb-1">
      {label && (
        <div className={clsx(
          "flex justify-between uppercase tracking-widest font-display",
          big ? "text-[11px] text-ash-300" : "text-[10px] text-ash-500",
        )}>
          <span>{label}</span>
          <span className={clsx(
            "tabular-nums font-bold",
            low && tone === "blood" && "text-blood-300 animate-pulse",
          )}>
            {value}<span className="text-ash-600">/{max}</span>
            {pending > 0 && (
              <span className="text-blood-300 ml-1">−{pending}</span>
            )}
          </span>
        </div>
      )}
      <div className={clsx(
        "bg-void-900 border border-ash-700/40 rounded-sm overflow-hidden relative",
        big ? "h-4" : "h-2.5",
      )}>
        <div
          className={clsx(
            "h-full transition-all duration-500 relative",
            tone === "blood" && (low ? "bg-gradient-to-r from-blood-500 to-blood-300" : "bg-gradient-to-r from-blood-800 via-blood-600 to-blood-400"),
            tone === "force" && "bg-gradient-to-r from-force-700 via-force-500 to-force-300",
          )}
          style={{ width: `${pct * 100}%` }}
        >
          {/* Inner sheen for "battle feel" */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent" />
        </div>
        {/* Forecast damage overlay (sits over the slice that would be lost) */}
        {pending > 0 && (
          <div
            className="absolute inset-y-0 bg-blood-200/45 animate-pulse"
            style={{
              left: `${remainPct * 100}%`,
              width: `${(pct - remainPct) * 100}%`,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 2px, transparent 2px, transparent 5px)",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Turn banner ──────────────────────────────────────────────────────

function TurnBanner({ phase, turnNumber }: { phase: string; turnNumber: number }) {
  const show = phase === "playerTurn" || phase === "enemyTurn";
  if (!show) return null;
  const isPlayer = phase === "playerTurn";
  return (
    <motion.div
      key={`${phase}-${turnNumber}`}
      className="pointer-events-none absolute inset-x-0 top-[30%] z-30 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.3, times: [0, 0.15, 0.6, 1] }}
    >
      <motion.div
        initial={{ x: -60, scaleX: 0.7 }}
        animate={{ x: 0, scaleX: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={clsx(
          "px-8 py-1.5 border-y font-display uppercase tracking-[0.5em] text-lg select-none",
          isPlayer
            ? "border-gilt-500/40 text-gilt-300 bg-gradient-to-r from-transparent via-gilt-900/30 to-transparent"
            : "border-blood-600/40 text-blood-300 bg-gradient-to-r from-transparent via-blood-950/40 to-transparent",
        )}
      >
        {isPlayer ? "Your Turn" : "Enemy Turn"}
      </motion.div>
    </motion.div>
  );
}

// ─── Loot screen ──────────────────────────────────────────────────────

function LootScreen({
  pendingLoot, xpReward, creditReward, onCollect,
}: {
  pendingLoot: { itemId: string; qty: number }[];
  xpReward: number;
  creditReward: number;
  onCollect: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md mx-4 rounded-sm border border-gilt-600/30 bg-void-950/90 p-6 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="text-center mb-4">
          <div className="font-display text-xl text-gilt-400 tracking-wide">Spoils of War</div>
          <div className="h-px w-24 mx-auto mt-2 bg-gilt-600/30" />
        </div>

        {/* Rewards row */}
        <div className="flex justify-center gap-6 mb-4 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-ash-500 uppercase tracking-widest">XP</span>
            <span className="font-display text-gilt-300 text-lg">+{xpReward}</span>
          </div>
          {creditReward > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-ash-500 uppercase tracking-widest">Credits</span>
              <span className="font-display text-gilt-300 text-lg">+{creditReward}</span>
            </div>
          )}
        </div>

        {/* Loot items */}
        {pendingLoot.length > 0 && (
          <div className="mb-5 space-y-1">
            <div className="text-[10px] text-ash-500 uppercase tracking-widest mb-2">Items</div>
            {pendingLoot.map((drop, i) => (
              <motion.div
                key={drop.itemId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between px-3 py-1.5 rounded-sm border border-ash-700/20 bg-void-900/50"
              >
                <span className="text-ash-200 text-sm">{drop.itemId.replace(/_/g, " ")}</span>
                <span className="text-ash-400 text-xs">×{drop.qty}</span>
              </motion.div>
            ))}
          </div>
        )}
        {pendingLoot.length === 0 && (
          <p className="text-ash-500 text-sm italic text-center mb-5">No items dropped.</p>
        )}

        <button
          onClick={onCollect}
          className="w-full py-2 rounded-sm border border-gilt-500/50 bg-gilt-900/20 text-gilt-300 font-display uppercase tracking-widest text-sm hover:bg-gilt-900/35 transition"
        >
          Take All
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Victory / Defeat / Fled screen ──────────────────────────────────

function EndScreen({
  title, titleColor, subtitle, xp, credits, loot, action,
}: {
  title: string;
  titleColor: string;
  subtitle?: string;
  xp?: number;
  credits?: number;
  loot?: { itemId: string; qty: number }[];
  action: { label: string; onClick: () => void };
}) {
  return (
    <motion.div
      className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center max-w-sm mx-4 px-6 py-8 rounded-sm border border-gilt-600/20 bg-void-950/90"
        initial={{ scale: 0.85, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 18 }}
      >
        <div className={clsx("font-display text-3xl tracking-wide mb-1", titleColor)}>{title}</div>
        {subtitle && <p className="text-ash-400 text-sm mb-4">{subtitle}</p>}
        {(xp != null || credits != null) && (
          <div className="flex justify-center gap-6 text-sm mb-5">
            {xp != null && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-ash-500 uppercase tracking-widest">XP</span>
                <span className="font-display text-gilt-300 text-lg">+{xp}</span>
              </div>
            )}
            {credits != null && credits > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-ash-500 uppercase tracking-widest">Credits</span>
                <span className="font-display text-gilt-300 text-lg">+{credits}</span>
              </div>
            )}
          </div>
        )}
        <button
          onClick={action.onClick}
          className="w-full py-2 rounded-sm border border-gilt-500/50 bg-gilt-900/20 text-gilt-300 font-display uppercase tracking-widest text-sm hover:bg-gilt-900/30 transition"
        >
          {action.label}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Combat silhouettes ───────────────────────────────────────────────

/**
 * Subtle idle "breathing": a slow vertical bob + vertical squash anchored at
 * the feet, so static portraits read as living combatants between actions.
 * `phase` desyncs grouped enemies so they don't pulse in lockstep. Disabled
 * under the reduced-motion accessibility setting.
 */
function BreathingWrap({
  breathing,
  phase = 0,
  className,
  style,
  children,
}: {
  breathing?: boolean;
  phase?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (!breathing) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      className={className}
      style={{ ...style, transformOrigin: "bottom center" }}
      animate={{ y: [0, -3, 0], scaleY: [1, 1.015, 1] }}
      transition={{
        duration: 3 + (phase % 3) * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: (phase % 4) * 0.3,
      }}
    >
      {children}
    </motion.div>
  );
}

/** KOTOR-style targeting bracket drawn over the currently selected enemy. */
function TargetReticle() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 57 }}>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blood-400/60"
        style={{ width: 70, height: 70 }}
        initial={{ scale: 1, opacity: 0.7 }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.7, 0.25, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((corner, i) => (
        <span key={i} className={clsx("absolute h-3 w-3 border-blood-400/80", corner)} />
      ))}
    </div>
  );
}

function CombatPlayerSilhouette({ classId, breathing, state = "idle" }: { classId: string; breathing?: boolean; state?: CharacterState }) {
  const imgSrc = getClassStateImage(classId, state);
  if (imgSrc) {
    return (
      <BreathingWrap breathing={breathing} className="relative flex items-end justify-center h-full">
        <div
          className="absolute inset-x-0 bottom-0 h-6 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 70%)" }}
        />
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="h-full w-auto object-contain object-bottom select-none pointer-events-none"
          style={{ filter: "drop-shadow(0 0 14px rgba(220,30,60,0.5))" }}
        />
      </BreathingWrap>
    );
  }

  return (
    <svg viewBox="0 0 80 160" overflow="visible" style={{ width: "auto", height: "100%" }} aria-hidden="true">
      <defs>
        <filter id="c-saber" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="c-soft" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
        </filter>
      </defs>
      <ellipse cx="40" cy="158" rx="30" ry="5" fill="rgba(0,0,0,0.4)" />
      <g fill="#0a0a16" stroke="#18182e" strokeWidth="0.5">
        <path d="M26,132 L22,150 L36,152 L38,134 Z" />
        <path d="M52,132 L54,150 L68,152 L64,134 Z" />
        <path d="M20,148 L38,148 L40,156 L18,156 Z" />
        <path d="M50,148 L70,148 L72,156 L48,156 Z" />
        <rect x="24" y="128" width="42" height="8" rx="2" fill="#10102a" />
        <path d="M20,58 L70,58 L66,130 L24,130 Z" />
        <path d="M28,64 L62,64 L58,120 L32,120 Z" fill="#0e0e24" />
        <path d="M20,58 L6,54 L2,72 L20,76" fill="#0e0e24" />
        <path d="M70,58 L84,54 L88,72 L70,76" fill="#0e0e24" />
        <rect x="36" y="50" width="18" height="8" rx="3" fill="#10102a" />
        <ellipse cx="45" cy="34" rx="14" ry="16" fill="#0c0c20" />
        <path d="M35,20 L45,14 L55,20 L52,26 L38,26 Z" fill="#0e0e24" />
        <rect x="34" y="30" width="22" height="5" rx="2.5" fill="#08081a" />
      </g>
      <rect x="35" y="31" width="20" height="3" rx="1.5" fill="#ff4466" opacity="0.8" />
      <rect x="35" y="31" width="20" height="3" rx="1.5" fill="rgba(220,30,60,0.4)" filter="url(#c-soft)" />
      {/* Raised saber arm */}
      <path d="M70,62 L82,36 L88,40 L76,66 Z" fill="#0a0a16" stroke="#18182e" strokeWidth="0.5" />
      <circle cx="85" cy="38" r="4" fill="#0a0a16" />
      <rect x="82" y="24" width="7" height="18" rx="2" fill="#2a2a42" transform="rotate(-35,85,33)" />
      <line x1="85" y1="38" x2="100" y2="-30" stroke="rgba(220,30,60,0.5)" strokeWidth="10" strokeLinecap="round" filter="url(#c-soft)" opacity="0.7" />
      <line x1="85" y1="38" x2="100" y2="-30" stroke="#ff4466" strokeWidth="3" strokeLinecap="round" />
      <line x1="85" y1="38" x2="100" y2="-30" stroke="#fff4f0" strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />
      {/* Off arm */}
      <path d="M16,62 L4,96 L12,100 L22,66 Z" fill="#0a0a16" stroke="#18182e" strokeWidth="0.5" />
    </svg>
  );
}

/** A companion fighting at your side — the class silhouette, hue-shifted to a
 *  friendly Force-blue so allies read distinctly from the player and enemies. */
function CombatAllySilhouette({ companionId, isAlive, breathing, state = "idle" }: { companionId: string; isAlive: boolean; breathing?: boolean; state?: CharacterState }) {
  const def = COMPANIONS.find((c) => c.id === companionId);
  const classId = def?.classId ?? "marauder";
  return (
    <div className="relative h-full flex items-end justify-center" style={{ opacity: isAlive ? 1 : 0.3 }}>
      <div
        className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(80,140,255,0.28) 0%, transparent 70%)" }}
      />
      <div className="h-full" style={{ filter: "hue-rotate(200deg) saturate(0.85)" }}>
        <CombatPlayerSilhouette classId={classId} breathing={breathing} state={state} />
      </div>
    </div>
  );
}

function CombatEnemySilhouette({ isBoss, isAlive, enemyId, breathing, phase, state = "idle" }: { isBoss: boolean; isAlive: boolean; enemyId: string; breathing?: boolean; phase?: number; state?: CharacterState }) {
  const imgSrc = getEnemyStateImage(enemyId, state);
  if (imgSrc) {
    return (
      <BreathingWrap
        breathing={breathing}
        phase={phase}
        className="relative flex items-end justify-center h-full"
        style={{ opacity: isAlive ? 1 : 0.2 }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-5 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(0,0,0,0.45) 0%, transparent 70%)" }}
        />
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className={clsx(
            "h-full w-auto object-contain object-bottom select-none pointer-events-none",
            isBoss && "scale-[1.12]",
          )}
          style={{ filter: `drop-shadow(0 0 10px ${isBoss ? "rgba(255,136,0,0.45)" : "rgba(200,20,40,0.35)"})` }}
        />
      </BreathingWrap>
    );
  }

  return (
    <svg
      viewBox="0 0 60 120"
      overflow="visible"
      style={{ width: "auto", height: "100%", opacity: isAlive ? 1 : 0.2 }}
      aria-hidden="true"
    >
      <defs>
        <filter id="e-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>
      <g transform={`scale(${isBoss ? 1.15 : 1})`}>
        <ellipse cx="30" cy="118" rx="22" ry="4" fill="rgba(0,0,0,0.3)" />
        <g fill="#0f0a12" stroke="#1e1020" strokeWidth="0.4">
          <path d="M18,68 L14,108 L24,110 L26,70 Z" />
          <path d="M34,68 L38,108 L48,110 L42,70 Z" />
          <path d="M12,105 L26,105 L28,114 L10,114 Z" />
          <path d="M34,105 L50,105 L52,114 L32,114 Z" />
          <rect x="16" y="64" width="28" height="7" rx="2" fill="#12101a" />
          <path d="M14,28 L46,28 L44,66 L16,66 Z" />
          <path d="M18,32 L42,32 L40,60 L20,60 Z" fill="#110e1a" />
          <path d="M14,28 L4,26 L2,38 L14,40" fill="#110e1a" />
          <path d="M46,28 L56,26 L58,38 L46,40" fill="#110e1a" />
          <rect x="26" y="22" width="8" height="6" rx="2" />
          <ellipse cx="30" cy="14" rx="10" ry="12" fill="#0c0a14" />
          <path d="M22,6 L30,2 L38,6 L36,16 L24,16 Z" fill="#100e1a" />
        </g>
        {/* Menacing eyes */}
        <rect x="22" y="12" width="5" height="2" rx="1" fill={isBoss ? "#ff8800" : "#cc2244"} opacity="0.9" />
        <rect x="33" y="12" width="5" height="2" rx="1" fill={isBoss ? "#ff8800" : "#cc2244"} opacity="0.9" />
        <rect x="22" y="12" width="16" height="2" rx="1" fill={isBoss ? "rgba(255,136,0,0.4)" : "rgba(200,20,40,0.4)"} filter="url(#e-glow)" />
        {/* Weapon */}
        {isBoss ? (
          <>
            <line x1="4" y1="24" x2="-6" y2="-10" stroke="rgba(255,136,0,0.5)" strokeWidth="10" strokeLinecap="round" filter="url(#e-glow)" opacity="0.6" />
            <line x1="4" y1="24" x2="-6" y2="-10" stroke="#ff8844" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="4" y1="24" x2="-6" y2="-10" stroke="#fff8f0" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
          </>
        ) : (
          <>
            <line x1="4" y1="30" x2="-2" y2="6" stroke="rgba(180,30,50,0.45)" strokeWidth="7" strokeLinecap="round" filter="url(#e-glow)" opacity="0.6" />
            <line x1="4" y1="30" x2="-2" y2="6" stroke="#cc3344" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}
