import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RNG } from "../rng/rng";
import { resolveAttack } from "./damage";
import { rollInitiative } from "./turn-manager";
import { rollLootTable, LOOT_TABLES } from "./loot-tables";
import type { AttackInput, DefenseInput, DamageResult, AttackRoll, DamageType, Stance } from "./damage";
import type { EnemyTemplate } from "./enemies";
import type { StatusEffect } from "../../data/schemas";
import { getSkill, BASIC_ATTACK } from "../../data/schemas/skill-registry";
import { detectChainProgress } from "./skill-chains";
import { WEATHER_EFFECTS, type Weather } from "./weather";
import type { CombatTalentMods } from "../progression/talent-effects";
import type { CompanionCombatPayload, CompanionTactic } from "./companion-combat";
import { companionBark } from "./companion-combat";

/**
 * Combat state machine — ephemeral store for a single encounter.
 *
 * The RNG lives **outside** Immer to avoid WritableDraft proxy conflicts.
 * Any mutation to _combatRng (advancing the seed) happens in normal JS,
 * not through Immer's proxy.
 *
 * Phase flow (round-based, KOTOR style):
 *   idle → start → playerTurn → animating → enemyTurn → animating → playerTurn …
 *                                                      ↘ loot → victory
 *                                                      ↘ defeat
 *                                                      ↘ fled   (flee success)
 *
 * One round = the player acts, then ALL living enemies act, then a new round
 * begins (cooldowns tick, damage-over-time effects apply). `lastActedSide`
 * tells advanceTurn whose action just resolved, so stray timers can never
 * skip the player's turn.
 */

// ── Module-level RNG — NOT inside Zustand/Immer ──────────────────────
let _combatRng: RNG | null = null;

// ── Types ─────────────────────────────────────────────────────────────

export interface StatusInstance {
  effect: StatusEffect;
  duration: number;
  sourceId: string;
}

export interface Combatant {
  id: string;
  name: string;
  isPlayer: boolean;
  hp: number;
  maxHp: number;
  fp: number;
  maxFp: number;
  armor: number;
  primary: {
    strength: number;
    agility: number;
    endurance: number;
    force: number;
    influence: number;
    corruption: number;
  };
  stance: Stance;
  statusEffects: StatusInstance[];
  skillIds: string[];
  cooldowns: Record<string, number>;
  isAlive: boolean;
  /** Equipped weapon damage (player only — enemies bake it into skills). */
  weaponDamage?: number;
  /** Status the equipped weapon inflicts on a successful hit (player only). */
  weaponOnHit?: { effect: StatusEffect; chance: number; duration: number };
  /** Per-damage-type % bonus from set effects (player only). */
  damageOfType?: Record<string, number>;
  /** Flat dodge-chance bonus 0..1 from set effects (player only). */
  dodgeBonus?: number;
  /** Force-cost reduction 0..1 from set effects (player only). */
  fpCostReduction?: number;
  /** Named weapon effects (player only): heal/Force on kill, splash + status on crit, per-turn regen. */
  itemEffects?: { onKillHealPct: number; onKillFpPct: number; onCritSplashPct: number; onCritStatus: string[]; hpRegen: number; fpRegen: number };
  /** Talent-derived combat modifiers (player only). */
  talentMods?: CombatTalentMods;
  /** Enemy tactic tag (enemies only) — shapes skill selection in pickEnemySkill. */
  aiBehavior?: "aggressive" | "defensive" | "random" | "smart";
  /** Player-set companion tactic (allies only) — shapes executeAllyTurns. */
  tactic?: CompanionTactic;
  /** Damage-type resistances (0..1 reduces, negative = vulnerability). Enemies copy from template. */
  resistances?: Partial<Record<DamageType, number>>;
}

export interface CombatLogEntry {
  turn: number;
  actorId: string;
  action: string;
  targetId?: string;
  result?: DamageResult;
  text: string;
}

export interface DamageEvent {
  id: string;
  targetId: string;
  amount: number;
  isCrit: boolean;
  isMiss: boolean;
  isDodged: boolean;
  /** True when this event is a heal (rendered green, no shake). */
  isHeal?: boolean;
  /** KOTOR d20 detail for the floating roll chip (offensive hits/misses only). */
  d20?: AttackRoll;
  createdAt: number;
}

/** Visual attack kinds — drive the battle animations in CombatUI. */
export type AttackKind = "melee" | "ranged" | "force" | "lightning" | "buff" | "heal";

export interface AttackEvent {
  id: string;
  attackerId: string;
  targetId: string;
  kind: AttackKind;
  createdAt: number;
}

/** Map a skill's damage type / targeting to a visual attack kind. */
function attackKindForSkill(skill: { targeting?: string; damage?: { type?: string } ; id: string }): AttackKind {
  if (skill.targeting === "self") {
    return /heal|repair|undying|mend/.test(skill.id) ? "heal" : "buff";
  }
  switch (skill.damage?.type) {
    case "shock": return "lightning";
    case "force":
    case "mental": return "force";
    case "energy": return skill.id.includes("blaster") || skill.id.includes("beam") ? "ranged" : "melee";
    case "fire": return "ranged";
    default: return "melee";
  }
}

/** KOTOR-style d20 log fragment, e.g. " [d20: 14+7=21 vs DEF 13]". */
function d20Tag(result: DamageResult): string {
  const d = result.d20;
  if (!d) return "";
  const total = d.roll + d.attackBonus;
  const nat = d.isNat20 ? " NAT20!" : d.isNat1 ? " NAT1" : "";
  return ` [d20: ${d.roll}${d.attackBonus >= 0 ? "+" : ""}${d.attackBonus}=${total} vs DEF ${d.defense}${nat}]`;
}

export interface PendingLootDrop {
  itemId: string;
  qty: number;
}

export type CombatPhase =
  | "idle"
  | "start"
  | "playerTurn"
  | "allyTurn"   // recruited companions act (AI) on the player's side
  | "enemyTurn"
  | "animating"
  | "loot"      // show loot drops between enemies dying and victory screen
  | "victory"
  | "defeat"
  | "fled";     // successful escape

interface CombatState {
  phase: CombatPhase;
  turnNumber: number;
  turnOrder: string[];
  currentTurnIndex: number;
  /** Whose action just resolved — drives round-based turn advancement. */
  lastActedSide: "player" | "ally" | "enemy";
  player: Combatant | null;
  /** Companions fighting alongside the player (KOTOR-style party). */
  allies: Combatant[];
  enemies: Combatant[];
  /** Original templates — needed for XP/credits/loot on kill. */
  enemyTemplates: EnemyTemplate[];
  log: CombatLogEntry[];
  /** Floating damage events consumed by CombatUI. */
  damageEvents: DamageEvent[];
  /** Attack animation events consumed by CombatUI (lunges, slashes, lightning). */
  attackEvents: AttackEvent[];
  selectedSkill: string | null;
  selectedTarget: string | null;
  /** The enemy the player last struck — companions focus-fire it. */
  lastPlayerTarget: string | null;
  xpReward: number;
  creditReward: number;
  /** Loot accumulated from killed enemies during this encounter. */
  pendingLoot: PendingLootDrop[];
  /** Enemy IDs that lost their next action due to a crit-stagger. */
  staggeredEnemies: string[];
  /** Consecutive successful hits without taking damage. */
  comboCount: number;
  /** Highest combo reached this combat (for end screen). */
  maxCombo: number;
  /** Limit break charge 0..100; at 100 player can unleash class ultimate. */
  limitBreak: number;
  /** True while a screen-flash is active (consumed by UI). */
  screenFlash: null | "crit" | "kill" | "limit" | "damage";
  /** Stack count per enemy for super-stagger (3 stagger = stun). */
  staggerStacks: Record<string, number>;
  /** Encounter seed/id — lets the UI theme special encounters (e.g. rituals). */
  combatSeed: string;
  /** Active environmental weather for this encounter (modifies damage/accuracy/crit). */
  weather: Weather;
  /** Player skills used this combat, in order (drives skill-chain combos). */
  skillHistory: string[];
}

interface CombatActions {
  startCombat: (
    playerData: {
      name: string;
      primary: Combatant["primary"];
      hp: number;
      maxHp: number;
      fp: number;
      maxFp: number;
      armor: number;
      weaponDamage?: number;
      weaponOnHit?: { effect: StatusEffect; chance: number; duration: number };
      damageOfType?: Record<string, number>;
      dodgeBonus?: number;
      fpCostReduction?: number;
      itemEffects?: { onKillHealPct: number; onKillFpPct: number; onCritSplashPct: number; onCritStatus: string[]; hpRegen: number; fpRegen: number };
      skillIds: string[];
      stance: Stance;
      talentMods?: CombatTalentMods;
    },
    enemies: EnemyTemplate[],
    seed: string,
    weather?: Weather,
    allies?: CompanionCombatPayload[],
  ) => void;
  selectSkill: (skillId: string) => void;
  selectTarget: (targetId: string) => void;
  executePlayerAction: () => void;
  executeEnemyTurns: () => void;
  /** Resolve all living companions' AI actions on the player's side. */
  executeAllyTurns: () => void;
  /** Change a companion's combat tactic mid-fight (live party command). */
  setAllyTactic: (allyId: string, tactic: CompanionTactic) => void;
  setStance: (stance: Stance) => void;
  guard: () => void;
  useItem: (itemId: string) => void;
  advanceTurn: () => void;
  tickStatusEffects: (combatantId: string) => void;
  /** Attempt to flee — agility-based chance. */
  fleeAttempt: () => void;
  /** Confirm loot collection and proceed to victory. */
  collectLoot: () => void;
  endCombat: () => void;
  addLog: (entry: Omit<CombatLogEntry, "turn">) => void;
  clearDamageEvent: (id: string) => void;
  clearAttackEvent: (id: string) => void;
  /** Spend full limit break gauge to fire the player's ultimate. */
  unleashLimitBreak: () => void;
  /** Clear the active screen flash (consumed by CombatUI). */
  clearScreenFlash: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────

function createEnemy(template: EnemyTemplate, index: number): Combatant {
  const suffix = index > 0 ? ` ${String.fromCharCode(65 + index)}` : "";
  return {
    id: `enemy_${template.id}_${index}`,
    name: `${template.name}${suffix}`,
    isPlayer: false,
    hp: template.baseHp,
    maxHp: template.baseHp,
    fp: template.baseFp,
    maxFp: template.baseFp,
    armor: template.armor,
    primary: { ...template.primary },
    stance: template.aiBehavior === "defensive" ? "defensive" : "aggressive",
    statusEffects: [],
    skillIds: [...template.skillIds],
    cooldowns: {},
    isAlive: true,
    aiBehavior: template.aiBehavior,
    resistances: { ...template.resistances } as Partial<Record<DamageType, number>>,
  };
}

/** Build an allied companion combatant from its combat payload. */
function createAlly(payload: CompanionCombatPayload): Combatant {
  return {
    id: `ally_${payload.id}`,
    name: payload.name,
    isPlayer: false,
    hp: payload.hp,
    maxHp: payload.maxHp,
    fp: payload.fp,
    maxFp: payload.maxFp,
    armor: payload.armor,
    primary: { ...payload.primary },
    stance: payload.stance,
    statusEffects: [],
    skillIds: [...payload.skillIds],
    cooldowns: {},
    isAlive: true,
    weaponDamage: payload.weaponDamage,
    aiBehavior:
      payload.aiBehavior === "support" || payload.aiBehavior === "defensive"
        ? "defensive"
        : payload.aiBehavior === "balanced"
          ? "smart"
          : "aggressive",
    tactic: payload.tactic,
  };
}

const CONTROL_EFFECTS = new Set(["stun", "fear", "silence", "cripple", "blind"]);

/**
 * Pick a skill for an AI enemy, shaped by its `aiBehavior` tag and the
 * player's current state:
 *   · aggressive — favors the biggest hitter.
 *   · defensive  — heals/guards when hurt, otherwise plays it safe.
 *   · smart      — finishes a low player, locks them down with control while
 *                  they're free, and otherwise opens with its strongest skill.
 *   · random     — unpredictable.
 */
function pickEnemySkill(enemy: Combatant, rng: RNG, player?: Combatant): typeof BASIC_ATTACK {
  const isHealSkill = (id: string) => /heal|repair|undying|mend/.test(id);
  const available = enemy.skillIds
    .map((id) => getSkill(id))
    .filter((sk): sk is NonNullable<typeof sk> =>
      sk != null &&
      (enemy.cooldowns[sk.id] ?? 0) === 0 &&
      enemy.fp >= (sk.cost.forcePoints ?? 0),
    )
    .filter((sk) => {
      if (sk.targeting !== "self") return true;
      // Self-heals only matter when wounded; buffs are an occasional opener.
      if (isHealSkill(sk.id)) return enemy.hp / enemy.maxHp < 0.55;
      return enemy.statusEffects.every((se) => se.effect !== "rage");
    });

  // Wounded enemies with a heal available strongly prefer it (all behaviors).
  const heal = available.find((sk) => sk.targeting === "self" && isHealSkill(sk.id));
  const healUrgency = enemy.hp / enemy.maxHp < 0.3 ? 0.85 : 0.6;
  if (heal && rng.chance(healUrgency)) return heal;

  const damaging = available.filter(
    (sk) => sk.targeting !== "self" && sk.damage && (sk.damage.base ?? 0) > 0,
  );
  const pool = damaging.length > 0 ? damaging : available;
  if (pool.length === 0) return BASIC_ATTACK;

  const strongest = () =>
    pool.reduce((a, b) => ((b.damage?.base ?? 0) > (a.damage?.base ?? 0) ? b : a));
  const behavior = enemy.aiBehavior ?? "aggressive";

  if (behavior === "random") {
    return rng.pick(pool) ?? BASIC_ATTACK;
  }

  if (behavior === "smart") {
    const playerLow = player ? player.hp / player.maxHp < 0.3 : false;
    // Finish a reeling player with the heaviest blow available.
    if (playerLow) return strongest();
    // Lock down a player who isn't already controlled.
    const playerControlled =
      player?.statusEffects.some((se) => CONTROL_EFFECTS.has(se.effect)) ?? false;
    if (!playerControlled) {
      const control = pool.filter((sk) =>
        (sk.statusEffects ?? []).some((se) => CONTROL_EFFECTS.has(se.effect)),
      );
      if (control.length > 0 && rng.chance(0.55)) return rng.pick(control) ?? strongest();
    }
    // Otherwise open with the strongest skill most of the time.
    return rng.chance(0.75) ? strongest() : (rng.pick(pool) ?? BASIC_ATTACK);
  }

  // aggressive / defensive: lean on the strongest skill, with some variety.
  const bestBias = behavior === "aggressive" ? 0.7 : 0.55;
  return rng.chance(bestBias) ? strongest() : (rng.pick(pool) ?? BASIC_ATTACK);
}

function rollCredits(range: [number, number], rng: RNG): number {
  return rng.int(range[0], range[1]);
}

/** Grant XP/credits/loot for a kill — usable inside Immer drafts. */
function grantKillRewards(
  s: Pick<CombatState, "enemyTemplates" | "xpReward" | "creditReward" | "pendingLoot">,
  enemyId: string,
): void {
  const template = s.enemyTemplates.find((t) => enemyId.startsWith(`enemy_${t.id}_`));
  if (!template) {
    s.xpReward += 25;
    s.creditReward += 10;
    return;
  }
  s.xpReward += template.xpReward;
  s.creditReward += Math.floor((template.creditReward[0] + template.creditReward[1]) / 2);
  const table = LOOT_TABLES[template.lootTableId];
  if (table) {
    const lootRng = new RNG(`loot_${enemyId}_${Date.now()}`);
    for (const drop of rollLootTable(table, lootRng)) {
      const existing = s.pendingLoot.find((l) => l.itemId === drop.itemId);
      if (existing) existing.qty += drop.qty;
      else s.pendingLoot.push({ itemId: drop.itemId, qty: drop.qty });
    }
  }
}

/** Per-turn damage from status effects (deterministic — safe inside Immer). */
function computeDotDamage(c: Combatant): number {
  let dot = 0;
  for (const st of c.statusEffects) {
    switch (st.effect) {
      case "bleed":  dot += Math.floor(c.maxHp * 0.03); break;
      case "burn":   dot += Math.floor(c.maxHp * 0.05); break;
      case "poison": dot += Math.floor(c.maxHp * 0.04); break;
      case "shock":  dot += Math.floor(c.maxHp * 0.02); c.fp = Math.max(0, c.fp - 5); break;
    }
  }
  return dot;
}

/** Decrement durations and drop expired status effects. */
function tickStatusDurations(c: Combatant): void {
  c.statusEffects = c.statusEffects
    .map((se) => ({ ...se, duration: se.duration - 1 }))
    .filter((se) => se.duration > 0);
}

// ── Store ─────────────────────────────────────────────────────────────

export const useCombatStore = create<CombatState & CombatActions>()(
  immer((set, get) => ({
    phase: "idle",
    turnNumber: 0,
    turnOrder: [],
    currentTurnIndex: 0,
    lastActedSide: "enemy",
    player: null,
    allies: [],
    enemies: [],
    enemyTemplates: [],
    log: [],
    damageEvents: [],
    attackEvents: [],
    selectedSkill: null,
    selectedTarget: null,
    lastPlayerTarget: null,
    xpReward: 0,
    creditReward: 0,
    pendingLoot: [],
    staggeredEnemies: [],
    comboCount: 0,
    maxCombo: 0,
    limitBreak: 0,
    screenFlash: null,
    staggerStacks: {},
    combatSeed: "",
    weather: "clear",
    skillHistory: [],

    startCombat: (playerData, enemyTemplates, seed, weather = "clear", allies = []) => {
      _combatRng = new RNG(seed);
      const wx = WEATHER_EFFECTS[weather];
      const allyCombatants = allies.map(createAlly);

      const player: Combatant = {
        id: "player",
        name: playerData.name,
        isPlayer: true,
        hp: playerData.hp,
        maxHp: playerData.maxHp,
        fp: playerData.fp,
        maxFp: playerData.maxFp,
        armor: playerData.armor,
        primary: { ...playerData.primary },
        stance: playerData.stance,
        statusEffects: [],
        skillIds: [...playerData.skillIds],
        cooldowns: {},
        isAlive: true,
        weaponDamage: playerData.weaponDamage ?? 10,
        weaponOnHit: playerData.weaponOnHit,
        damageOfType: playerData.damageOfType,
        dodgeBonus: playerData.dodgeBonus,
        fpCostReduction: playerData.fpCostReduction,
        itemEffects: playerData.itemEffects,
        talentMods: playerData.talentMods,
      };

      const enemies = enemyTemplates.map((t, i) => createEnemy(t, i));

      // Frozen winds & similar: shift everyone's agility for the encounter.
      if (wx.agilityDelta) {
        player.primary.agility = Math.max(1, player.primary.agility + wx.agilityDelta);
        for (const e of enemies) e.primary.agility = Math.max(1, e.primary.agility + wx.agilityDelta);
        for (const a of allyCombatants) a.primary.agility = Math.max(1, a.primary.agility + wx.agilityDelta);
      }

      const allCombatants = [player, ...enemies];
      const turnOrder = rollInitiative(
        allCombatants.map((c) => ({
          id: c.id,
          agility: c.primary.agility,
          gearInitiative: 0,
          buffInitiative: 0,
        })),
        _combatRng,
      );

      set((s) => {
        s.phase = "start";
        s.turnNumber = 1;
        s.turnOrder = turnOrder.map((t) => t.id);
        s.currentTurnIndex = 0;
        s.lastActedSide = "enemy";
        s.player = player;
        s.allies = allyCombatants;
        s.enemies = enemies;
        s.enemyTemplates = enemyTemplates;
        s.weather = weather;
        s.log = [];
        s.damageEvents = [];
        s.attackEvents = [];
        s.selectedSkill = null;
        s.selectedTarget = null;
        s.lastPlayerTarget = null;
        s.xpReward = 0;
        s.creditReward = 0;
        s.pendingLoot = [];
        s.staggeredEnemies = [];
        s.comboCount = 0;
        s.maxCombo = 0;
        s.limitBreak = 0;
        s.screenFlash = null;
        s.staggerStacks = {};
        s.combatSeed = seed;
        s.skillHistory = [];
      });

      const firstId = turnOrder[0]?.id;
      set((s) => {
        s.phase = firstId === "player" ? "playerTurn" : "enemyTurn";
        s.log.push({
          turn: 1,
          actorId: "system",
          action: "initiative",
          text: firstId === "player"
            ? `${player.name} seizes the initiative!`
            : `The enemy strikes first!`,
        });
      });
    },

    selectSkill: (skillId) => set((s) => { s.selectedSkill = skillId; }),
    selectTarget: (targetId) => set((s) => { s.selectedTarget = targetId; }),
    setStance: (stance) => set((s) => { if (s.player) s.player.stance = stance; }),

    // ── Player action ─────────────────────────────────────────────────

    executePlayerAction: () => {
      const state = get();
      if (state.phase !== "playerTurn" || !state.player || !_combatRng) return;
      if (!state.selectedSkill) return;

      const rng = _combatRng;
      const skill = getSkill(state.selectedSkill) ?? BASIC_ATTACK;
      // Set effects can discount Force costs (e.g. void_lord 6pc).
      const skillFpCost = Math.round((skill.cost.forcePoints ?? 0) * (1 - (state.player.fpCostReduction ?? 0)));
      const skillCooldown = skill.cost.cooldown ?? 0;

      // Validation checks
      if (state.player.fp < skillFpCost) {
        set((s) => {
          s.log.push({ turn: s.turnNumber, actorId: "player", action: skill.id,
            text: `Not enough Force Points for ${skill.name}.` });
        });
        return;
      }
      if ((state.player.cooldowns[skill.id] ?? 0) > 0) {
        set((s) => {
          s.log.push({ turn: s.turnNumber, actorId: "player", action: skill.id,
            text: `${skill.name} is on cooldown (${state.player!.cooldowns[skill.id]} turns).` });
        });
        return;
      }

      // ── Self-target (buffs, heals) ────────────────────────────────
      if (skill.targeting === "self") {
        // Roll status effects outside Immer
        const seRolls = (skill.statusEffects ?? []).map((se) => rng.chance(se.chance));
        const selfKind = attackKindForSkill(skill);

        set((s) => {
          if (!s.player) return;
          s.player.fp = Math.max(0, s.player.fp - skillFpCost);
          if (skillCooldown > 0) s.player.cooldowns[skill.id] = skillCooldown + 1;

          s.attackEvents.push({
            id: `atk_p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            attackerId: "player", targetId: "player", kind: selfKind, createdAt: Date.now(),
          });

          if (skill.damage && skill.id.toLowerCase().includes("heal")) {
            const heal = Math.floor(
              (skill.damage.base ?? 0) + s.player.primary.force * (skill.damage.forceScaling ?? 1),
            );
            s.player.hp = Math.min(s.player.maxHp, s.player.hp + heal);
            s.damageEvents.push({
              id: `dmg_h_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              targetId: "player", amount: heal,
              isCrit: false, isMiss: false, isDodged: false, isHeal: true,
              createdAt: Date.now(),
            });
            s.log.push({ turn: s.turnNumber, actorId: "player", action: skill.id,
              text: `${s.player.name} uses ${skill.name} — restores ${heal} HP.` });
          } else {
            s.log.push({ turn: s.turnNumber, actorId: "player", action: skill.id,
              text: `${s.player.name} activates ${skill.name}.` });
          }

          (skill.statusEffects ?? []).forEach((se, i) => {
            if (seRolls[i]) {
              s.player!.statusEffects.push({ effect: se.effect, duration: se.duration, sourceId: "player" });
            }
          });

          // Self-cast skills count toward skill chains (e.g. Poison Blade)
          s.skillHistory = [...s.skillHistory, skill.id].slice(-5);

          s.selectedSkill = null;
          s.selectedTarget = null;
          s.lastActedSide = "player";
          s.phase = "animating";
        });
        return;
      }

      // ── Targeted skills (single / cone / aoe) ────────────────────
      if (!state.selectedTarget) return;
      const mainTarget = state.enemies.find((e) => e.id === state.selectedTarget);
      if (!mainTarget || !mainTarget.isAlive) return;

      const targets =
        skill.targeting === "single"
          ? [mainTarget]
          : state.enemies.filter((e) => e.isAlive).slice(0, skill.targeting === "aoe" ? 999 : 3);

      const dmg = skill.damage;
      const skillBase = dmg?.base ?? 8;
      const strContrib = state.player.primary.strength * (dmg?.strengthScaling ?? 0);
      const forceContrib = state.player.primary.force * (dmg?.forceScaling ?? 0);
      const falloff = [1.0, 0.7, 0.5, 0.35, 0.25];

      // ── Skill chain: does this cast complete a combo sequence? ───
      const chainInfo = detectChainProgress([...state.skillHistory, skill.id]);
      const completedChain =
        chainInfo && chainInfo.progress === chainInfo.chain.sequence.length
          ? chainInfo.chain
          : null;
      const chainMult = completedChain?.finalDamageMult ?? 1;
      const chainStatusRoll = completedChain?.bonusStatus
        ? rng.chance(completedChain.bonusStatus.chance)
        : false;

      // ── Resolve ALL randomness outside Immer ──────────────────────
      type PreResolvedHit = {
        enemyId: string;
        result: DamageResult;
        isExecute: boolean;
        seRolls: boolean[];
        /** Did the weapon's on-hit status proc against this target? */
        weaponRoll: boolean;
      };

      const wx = WEATHER_EFFECTS[state.weather];
      const dmgType = (dmg?.type ?? "physical") as AttackInput["type"];
      const weatherDmgMult = 1 + (wx.damageBonusByType?.[dmgType] ?? 0);
      // Set effects can boost specific damage types (e.g. void_lord +force/shock).
      const setTypeMult = 1 + (state.player.damageOfType?.[dmgType] ?? 0);

      const preResolved: PreResolvedHit[] = targets.map((tgt, idx) => {
        const mult = falloff[idx] ?? 0.2;
        const isExecute = skill.id === "execute" && tgt.hp / tgt.maxHp < 0.3;
        const execBonus = isExecute ? skillBase + strContrib : 0;
        // Critical Strike: greatly widened threat range (KOTOR feat).
        const critBonus = skill.id === "critical_strike" ? 0.15 : 0;

        const tm = state.player!.talentMods;
        const attack: AttackInput = {
          skillBase: skillBase * mult,
          weaponDamage: (state.player!.weaponDamage ?? 10) * mult,
          strengthScaling: (strContrib + forceContrib + execBonus) * mult,
          type: dmgType,
          attackerStance: state.player!.stance,
          attackerCritChance:
            0.1 + critBonus + (wx.critBonus ?? 0) + state.player!.primary.agility * 0.005 + (tm?.critChance ?? 0) / 100,
          attackerCritDamageBonus: 0.5 + (tm?.critDamage ?? 0) / 100,
          attackerAccuracy: 0.85 + (wx.accuracyDelta ?? 0) + state.player!.primary.agility * 0.01,
          damageMultiplier: (1 + (tm?.damagePercent ?? 0) / 100) * weatherDmgMult * setTypeMult,
          armorPiercePct: (tm?.armorPiercePct ?? 0) / 100,
        };
        const defense: DefenseInput = {
          armor: tgt.armor,
          resistances: tgt.resistances ?? {},
          defenderStance: tgt.stance,
          dodgeChance: tgt.primary.agility * 0.01,
        };

        return {
          enemyId: tgt.id,
          result: resolveAttack(attack, defense, rng),
          isExecute,
          seRolls: (skill.statusEffects ?? []).map((se) => rng.chance(se.chance)),
          weaponRoll: state.player!.weaponOnHit ? rng.chance(state.player!.weaponOnHit.chance) : false,
        };
      });

      // ── Apply inside Immer (no RNG calls here) ────────────────────
      set((s) => {
        if (!s.player) return;

        s.player.fp = Math.max(0, s.player.fp - skillFpCost);
        if (skillCooldown > 0) s.player.cooldowns[skill.id] = skillCooldown + 1;

        const playerAtkKind = attackKindForSkill(skill);
        preResolved.forEach(({ enemyId, result, isExecute, seRolls, weaponRoll }) => {
          const enemy = s.enemies.find((e) => e.id === enemyId);
          if (!enemy || !enemy.isAlive) return;

          s.attackEvents.push({
            id: `atk_p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            attackerId: "player", targetId: enemyId, kind: playerAtkKind, createdAt: Date.now(),
          });

          // ── Status synergy: bleed + burn = +50% dmg this hit ───
          const hasBleed = enemy.statusEffects.some((se) => se.effect === "bleed");
          const hasBurn  = enemy.statusEffects.some((se) => se.effect === "burn");
          const hasShock = enemy.statusEffects.some((se) => se.effect === "shock");
          let synergyMult = 1;
          if (hasBleed && hasBurn)  synergyMult *= 1.5;   // RUPTURE
          if (hasShock && hasBurn)  synergyMult *= 1.3;   // OVERLOAD
          // ── Combo bonus: every 3 hits +20% damage ─────────────
          const comboTier = Math.floor(s.comboCount / 3);
          const comboMult = 1 + comboTier * 0.20;
          const synergyDamage = Math.floor(result.finalDamage * synergyMult * comboMult * chainMult);

          // Find matching template for reward calc
          const template = s.enemyTemplates.find((t) =>
            enemyId === `enemy_${t.id}_0` || enemyId.startsWith(`enemy_${t.id}_`),
          );

          enemy.hp = Math.max(0, enemy.hp - synergyDamage);

          // ── Talent lifesteal: heal a share of damage dealt ────
          const lifesteal = s.player!.talentMods?.lifestealPct ?? 0;
          if (lifesteal > 0 && synergyDamage > 0) {
            const healed = Math.floor((synergyDamage * lifesteal) / 100);
            if (healed > 0) {
              s.player!.hp = Math.min(s.player!.maxHp, s.player!.hp + healed);
            }
          }

          // Crit → stagger + screen flash
          if (result.isCrit) {
            if (!s.staggeredEnemies.includes(enemyId)) s.staggeredEnemies.push(enemyId);
            s.staggerStacks[enemyId] = (s.staggerStacks[enemyId] ?? 0) + 1;
            // 3 stacks → STUN
            if (s.staggerStacks[enemyId] >= 3) {
              enemy.statusEffects.push({ effect: "stun", duration: 1, sourceId: "player" });
              s.staggerStacks[enemyId] = 0;
            }
            s.screenFlash = "crit";
            // ── Item effect: weapon/crystal inflicts a status on crit ───
            for (const st of s.player!.itemEffects?.onCritStatus ?? []) {
              enemy.statusEffects.push({ effect: st as StatusEffect, duration: 3, sourceId: "player" });
            }
          }

          // ── Item effect: critical detonation splashes to other foes ───
          const splashPct = s.player!.itemEffects?.onCritSplashPct ?? 0;
          if (result.isCrit && splashPct > 0 && synergyDamage > 0) {
            const splash = Math.floor(synergyDamage * splashPct);
            if (splash > 0) {
              for (const other of s.enemies) {
                if (other.id === enemyId || !other.isAlive) continue;
                other.hp = Math.max(0, other.hp - splash);
                s.damageEvents.push({
                  id: `dmg_splash_${other.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                  targetId: other.id, amount: splash,
                  isCrit: false, isMiss: false, isDodged: false, createdAt: Date.now(),
                });
                if (other.hp <= 0) { other.isAlive = false; grantKillRewards(s, other.id); }
              }
              s.log.push({ turn: s.turnNumber, actorId: "player", action: "splash",
                text: `⚡ Critical detonation splashes ${splash} to every other foe!` });
            }
          }

          // Combo / Limit Break gauge
          if (!result.isMiss && !result.isDodged && synergyDamage > 0) {
            s.comboCount += 1;
            if (s.comboCount > s.maxCombo) s.maxCombo = s.comboCount;
            // limit gauge fills faster on crits and synergies
            const lbGain = (result.isCrit ? 12 : 6) + (synergyMult > 1 ? 4 : 0);
            s.limitBreak = Math.min(100, s.limitBreak + lbGain);
          } else if (result.isMiss || result.isDodged) {
            s.comboCount = 0;
          }

          // Floating damage event (use synergy-adjusted)
          s.damageEvents.push({
            id: `dmg_p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            targetId: enemyId,
            amount: synergyDamage,
            isCrit: result.isCrit,
            isMiss: result.isMiss,
            isDodged: result.isDodged,
            d20: result.d20,
            createdAt: Date.now(),
          });

          // Kill
          if (enemy.hp <= 0) {
            enemy.isAlive = false;
            s.screenFlash = "kill";
            // ── Item effect: devour on kill (heal / restore Force) ──
            const fx = s.player!.itemEffects;
            if (fx) {
              if (fx.onKillHealPct > 0) s.player!.hp = Math.min(s.player!.maxHp, s.player!.hp + Math.floor(s.player!.maxHp * fx.onKillHealPct));
              if (fx.onKillFpPct > 0) s.player!.fp = Math.min(s.player!.maxFp, s.player!.fp + Math.floor(s.player!.maxFp * fx.onKillFpPct));
            }
            // killing fills limit gauge significantly
            s.limitBreak = Math.min(100, s.limitBreak + 15);
            if (template) {
              s.xpReward += template.xpReward;
              // Use a simple credit calc (mid-range of the template reward)
              const credits = Math.floor((template.creditReward[0] + template.creditReward[1]) / 2);
              s.creditReward += credits;
              // Roll loot
              const table = LOOT_TABLES[template.lootTableId];
              if (table) {
                // We can't call rng here (inside Immer), so we use a deterministic sub-seed
                const lootRng = new RNG(`loot_${enemyId}_${Date.now()}`);
                const drops = rollLootTable(table, lootRng);
                for (const drop of drops) {
                  const existing = s.pendingLoot.find((l) => l.itemId === drop.itemId);
                  if (existing) existing.qty += drop.qty;
                  else s.pendingLoot.push({ itemId: drop.itemId, qty: drop.qty });
                }
              }
            } else {
              s.xpReward += 25;
              s.creditReward += 10;
            }
          }

          // Status effects
          if (!result.isMiss && !result.isDodged) {
            (skill.statusEffects ?? []).forEach((se, i) => {
              if (seRolls[i]) {
                enemy.statusEffects.push({ effect: se.effect, duration: se.duration, sourceId: "player" });
              }
            });
            // Weapon's on-hit status (e.g. a bleed crystal) — applies to a foe
            // still standing after the blow.
            const woh = s.player!.weaponOnHit;
            if (woh && weaponRoll && enemy.isAlive) {
              enemy.statusEffects.push({ effect: woh.effect, duration: woh.duration, sourceId: "player" });
            }
            // Chain completion bonus status
            if (completedChain?.bonusStatus && chainStatusRoll && enemy.isAlive) {
              enemy.statusEffects.push({
                effect: completedChain.bonusStatus.effect as StatusEffect,
                duration: completedChain.bonusStatus.duration,
                sourceId: "player",
              });
            }
          }

          // Log entry — KOTOR-style with the d20 roll visible
          let text: string;
          if (result.isMiss) {
            text = `${s.player!.name} → ${skill.name} — MISS${d20Tag(result)}`;
          } else if (result.isDodged) {
            text = `${enemy.name} dodges ${skill.name}!${d20Tag(result)}`;
          } else {
            const critTag = result.isCrit ? " ★CRIT" : "";
            const execTag = isExecute ? " [EXECUTE +100%]" : "";
            const staggerTag = result.isCrit ? " [STAGGERED]" : "";
            text = `${s.player!.name} → ${skill.name} → ${enemy.name}: ${result.finalDamage}${critTag}${execTag}${staggerTag}${d20Tag(result)}`;
            if (enemy.hp <= 0) text += ` ⚔ ${enemy.name} DEFEATED`;
          }
          s.log.push({ turn: s.turnNumber, actorId: "player", action: skill.id, targetId: enemyId, result, text });
        });

        // Chain completion: announce, flash, and reward gauge
        if (completedChain) {
          s.log.push({
            turn: s.turnNumber, actorId: "player", action: "chain",
            text: `⛓ CHAIN — ${completedChain.name}! +${Math.round((completedChain.finalDamageMult - 1) * 100)}% damage`,
          });
          s.screenFlash = "limit";
          s.limitBreak = Math.min(100, s.limitBreak + 10);
        }
        s.skillHistory = completedChain ? [] : [...s.skillHistory, skill.id].slice(-5);

        s.lastPlayerTarget = mainTarget.id; // companions focus-fire this foe
        s.selectedSkill = null;
        s.selectedTarget = null;
        s.lastActedSide = "player";

        const allDead = s.enemies.every((e) => !e.isAlive);
        s.phase = allDead
          ? s.pendingLoot.length > 0 ? "loot" : "victory"
          : "animating";
      });
    },

    // ── Enemy turns ───────────────────────────────────────────────────

    executeEnemyTurns: () => {
      const state = get();
      if (!state.player || !_combatRng) return;
      const rng = _combatRng;

      // Pre-resolve all attacks outside Immer
      // Living player-side targets (player + companions) the enemy can strike.
      const playerSideTargets: Combatant[] = [state.player, ...state.allies.filter((a) => a.isAlive)];

      type EnemyAction = {
        enemyId: string;
        enemyName: string;
        skillId: string;
        skillName: string;
        result: DamageResult;
        fpCost: number;
        cdSet: number;
        wasStaggered: boolean;
        seRolls: boolean[];
        kind: AttackKind;
        /** Self-cast (heal or buff) — does not target the player. */
        isSelf: boolean;
        selfHeal: number;
        /** Combatant id this attack lands on (player or an ally). */
        targetId: string;
      };

      const actions: EnemyAction[] = state.enemies
        .filter((e) => e.isAlive)
        .map((enemy) => {
          const wasStaggered = state.staggeredEnemies.includes(enemy.id);
          if (wasStaggered) {
            return {
              enemyId: enemy.id, enemyName: enemy.name,
              skillId: "stagger", skillName: "Staggered",
              result: { finalDamage: 0, rawDamage: 0, isCrit: false, isMiss: true, isDodged: false, type: "physical" as const },
              fpCost: 0, cdSet: 0, wasStaggered: true, seRolls: [],
              kind: "melee" as const, isSelf: false, selfHeal: 0, targetId: "player",
            };
          }

          const skill = pickEnemySkill(enemy, rng, state.player ?? undefined);
          const fpCost = skill.cost.forcePoints ?? 0;
          const cd = skill.cost.cooldown ?? 0;
          const kind = attackKindForSkill(skill);

          // Self-cast: heals and buffs never roll against the player.
          if (skill.targeting === "self") {
            const selfHeal = kind === "heal"
              ? Math.floor((skill.damage?.base ?? 0) + enemy.primary.force * (skill.damage?.forceScaling ?? 0.5))
              : 0;
            return {
              enemyId: enemy.id, enemyName: enemy.name,
              skillId: skill.id, skillName: skill.name,
              result: { finalDamage: 0, rawDamage: 0, isCrit: false, isMiss: false, isDodged: false, type: "force" as const },
              fpCost, cdSet: cd > 0 ? cd + 1 : 0, wasStaggered: false,
              seRolls: (skill.statusEffects ?? []).map((se) => rng.chance(se.chance)),
              kind, isSelf: true, selfHeal, targetId: enemy.id,
            };
          }

          // Choose a target: usually the player, sometimes a companion.
          const target =
            playerSideTargets.length > 1 && rng.chance(0.42)
              ? rng.pick(playerSideTargets.slice(1)) ?? state.player!
              : state.player!;

          const ewx = WEATHER_EFFECTS[state.weather];
          const eType = (skill.damage?.type ?? "physical") as AttackInput["type"];
          const attack: AttackInput = {
            skillBase: skill.damage?.base ?? 10,
            weaponDamage: 8,
            strengthScaling: enemy.primary.strength * (skill.damage?.strengthScaling ?? 1.0),
            type: eType,
            attackerStance: enemy.stance,
            attackerCritChance: 0.06 + (ewx.critBonus ?? 0) + enemy.primary.agility * 0.004,
            attackerCritDamageBonus: 0.3,
            attackerAccuracy: 0.78 + (ewx.accuracyDelta ?? 0) + enemy.primary.agility * 0.012,
            damageMultiplier: 1 + (ewx.damageBonusByType?.[eType] ?? 0),
          };
          const defense: DefenseInput = {
            armor: target.armor,
            resistances: target.resistances ?? {},
            defenderStance: target.stance,
            dodgeChance: target.primary.agility * 0.015 + (target.dodgeBonus ?? 0),
          };

          return {
            enemyId: enemy.id, enemyName: enemy.name,
            skillId: skill.id, skillName: skill.name,
            result: resolveAttack(attack, defense, rng),
            fpCost, cdSet: cd > 0 ? cd + 1 : 0, wasStaggered: false,
            seRolls: (skill.statusEffects ?? []).map((se) => rng.chance(se.chance)),
            kind, isSelf: false, selfHeal: 0, targetId: target.id,
          };
        });

      set((s) => {
        if (!s.player) return;

        // ── Damage-over-time on enemies at the start of their side ────
        for (const enemy of s.enemies) {
          if (!enemy.isAlive) continue;
          const dot = computeDotDamage(enemy);
          if (dot <= 0) continue;
          enemy.hp = Math.max(0, enemy.hp - dot);
          s.damageEvents.push({
            id: `dmg_dot_${enemy.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            targetId: enemy.id, amount: dot,
            isCrit: false, isMiss: false, isDodged: false,
            createdAt: Date.now(),
          });
          s.log.push({ turn: s.turnNumber, actorId: enemy.id, action: "dot",
            text: `${enemy.name} suffers ${dot} from lingering wounds.` });
          if (enemy.hp <= 0) {
            enemy.isAlive = false;
            grantKillRewards(s, enemy.id);
            s.log.push({ turn: s.turnNumber, actorId: enemy.id, action: "dot",
              text: `⚔ ${enemy.name} succumbs to their wounds!` });
          }
        }

        for (const action of actions) {
          if (!s.player.isAlive) break;

          const enemy = s.enemies.find((e) => e.id === action.enemyId);
          if (!enemy || !enemy.isAlive) continue;

          // Stunned enemies lose their action (status effect, not crit-stagger).
          if (enemy.statusEffects.some((se) => se.effect === "stun")) {
            s.log.push({ turn: s.turnNumber, actorId: enemy.id, action: "stunned",
              text: `${enemy.name} is stunned — cannot act!` });
            continue;
          }

          if (action.wasStaggered) {
            s.log.push({ turn: s.turnNumber, actorId: action.enemyId, action: "stagger",
              text: `${action.enemyName} is staggered — loses their action!` });
            continue;
          }

          enemy.fp = Math.max(0, enemy.fp - action.fpCost);
          if (action.cdSet > 0) enemy.cooldowns[action.skillId] = action.cdSet;

          // ── Self-cast: heal or buff the enemy, never the player ───
          if (action.isSelf) {
            s.attackEvents.push({
              id: `atk_e_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              attackerId: action.enemyId, targetId: action.enemyId,
              kind: action.kind, createdAt: Date.now(),
            });
            if (action.selfHeal > 0) {
              enemy.hp = Math.min(enemy.maxHp, enemy.hp + action.selfHeal);
              s.damageEvents.push({
                id: `dmg_eh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                targetId: action.enemyId, amount: action.selfHeal,
                isCrit: false, isMiss: false, isDodged: false, isHeal: true,
                createdAt: Date.now(),
              });
              s.log.push({ turn: s.turnNumber, actorId: action.enemyId, action: action.skillId,
                text: `${action.enemyName} uses ${action.skillName} — recovers ${action.selfHeal} HP.` });
            } else {
              s.log.push({ turn: s.turnNumber, actorId: action.enemyId, action: action.skillId,
                text: `${action.enemyName} channels ${action.skillName}.` });
            }
            const skill = getSkill(action.skillId);
            (skill?.statusEffects ?? []).forEach((se, i) => {
              if (action.seRolls[i]) {
                enemy.statusEffects.push({ effect: se.effect, duration: se.duration, sourceId: action.enemyId });
              }
            });
            continue;
          }

          // Resolve the struck combatant — player or a living companion.
          // Fall back to the player if the chosen ally has already fallen.
          const struck =
            action.targetId === "player"
              ? s.player
              : (s.allies.find((a) => a.id === action.targetId && a.isAlive) ?? s.player);
          const struckIsPlayer = struck === s.player;

          s.attackEvents.push({
            id: `atk_e_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            attackerId: action.enemyId, targetId: struck.id,
            kind: action.kind, createdAt: Date.now(),
          });

          struck.hp = Math.max(0, struck.hp - action.result.finalDamage);

          // ── Combo break + limit gain only when the PLAYER takes the hit ──
          if (struckIsPlayer && !action.result.isMiss && !action.result.isDodged && action.result.finalDamage > 0) {
            s.comboCount = 0;
            s.limitBreak = Math.min(100, s.limitBreak + 8);
            if (action.result.isCrit) s.screenFlash = "damage";
          }

          s.damageEvents.push({
            id: `dmg_e_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            targetId: struck.id,
            amount: action.result.finalDamage,
            isCrit: action.result.isCrit,
            isMiss: action.result.isMiss,
            isDodged: action.result.isDodged,
            d20: action.result.d20,
            createdAt: Date.now(),
          });

          if (struck.hp <= 0) struck.isAlive = false;

          // Apply status effects to the struck combatant
          if (!action.result.isMiss && !action.result.isDodged) {
            const skill = getSkill(action.skillId);
            (skill?.statusEffects ?? []).forEach((se, i) => {
              if (action.seRolls[i] && struck.isAlive) {
                struck.statusEffects.push({ effect: se.effect, duration: se.duration, sourceId: action.enemyId });
              }
            });
          }

          let text: string;
          if (action.result.isMiss) {
            text = `${action.enemyName} → ${action.skillName} — MISS!${d20Tag(action.result)}`;
          } else if (action.result.isDodged) {
            text = `${struck.name} DODGES ${action.enemyName}'s ${action.skillName}!${d20Tag(action.result)}`;
          } else {
            const critTag = action.result.isCrit ? " ★CRIT" : "";
            const downTag = !struck.isAlive && !struckIsPlayer ? ` ✖ ${struck.name} is down!` : "";
            text = `${action.enemyName} → ${action.skillName} → ${struck.name}: ${action.result.finalDamage}${critTag}${downTag}${d20Tag(action.result)}`;
          }
          s.log.push({ turn: s.turnNumber, actorId: action.enemyId, action: action.skillId,
            targetId: struck.id, result: action.result, text });

          if (struckIsPlayer && !s.player.isAlive) {
            s.phase = "defeat";
            break;
          }
        }

        // Clear stagger flags after this round of enemy turns
        s.staggeredEnemies = [];
        // Status durations on enemies wind down after their side acts
        for (const enemy of s.enemies) {
          if (enemy.isAlive) tickStatusDurations(enemy);
        }
        s.lastActedSide = "enemy";

        if (s.phase !== "defeat") {
          const allDead = s.enemies.every((e) => !e.isAlive);
          s.phase = allDead
            ? s.pendingLoot.length > 0 ? "loot" : "victory"
            : "animating";
        }
      });
    },

    setAllyTactic: (allyId, tactic) => set((s) => {
      const ally = s.allies.find((a) => a.id === allyId);
      if (ally) ally.tactic = tactic;
    }),

    // ── Ally (companion) turns ────────────────────────────────────────

    executeAllyTurns: () => {
      const state = get();
      if (!state.player || !_combatRng) return;
      const rng = _combatRng;

      const livingAllies = state.allies.filter((a) => a.isAlive);
      const livingEnemies = state.enemies.filter((e) => e.isAlive);
      if (livingAllies.length === 0 || livingEnemies.length === 0) {
        set((s) => { s.lastActedSide = "ally"; s.phase = "animating"; });
        return;
      }

      type AllyAction = {
        allyId: string;
        allyName: string;
        targetId: string;
        skillId: string;
        skillName: string;
        result: DamageResult;
        fpCost: number;
        cdSet: number;
        kind: AttackKind;
        seRolls: boolean[];
        stunned: boolean;
        bark: string | null;
        /** Support cast: heal the player instead of attacking. */
        healAmount: number;
      };

      const actions: AllyAction[] = livingAllies.map((ally) => {
        if (ally.statusEffects.some((se) => se.effect === "stun")) {
          return {
            allyId: ally.id, allyName: ally.name, targetId: "",
            skillId: "stunned", skillName: "Stunned",
            result: { finalDamage: 0, rawDamage: 0, isCrit: false, isMiss: true, isDodged: false, type: "physical" as const },
            fpCost: 0, cdSet: 0, kind: "melee" as const, seRolls: [], stunned: true, bark: null, healAmount: 0,
          };
        }
        const bark = rng.chance(0.28)
          ? companionBark(ally.id.replace(/^ally_/, ""), rng.int(0, 99))
          : null;

        const tactic = ally.tactic ?? "auto";

        // Support cast: a companion with a heal skill mends the player when the
        // player is badly hurt (unless told to play aggressively / focus-fire).
        if (tactic !== "aggressive" && tactic !== "focus" && state.player!.hp / state.player!.maxHp < 0.5) {
          const healSk = ally.skillIds
            .map((id) => getSkill(id))
            .find((sk) => sk && /heal|mend/.test(sk.id) && (ally.cooldowns[sk.id] ?? 0) === 0 && ally.fp >= (sk.cost.forcePoints ?? 0));
          if (healSk) {
            const amount = Math.floor((healSk.damage?.base ?? 25) + ally.primary.force * (healSk.damage?.forceScaling ?? 0.6));
            const cd = healSk.cost.cooldown ?? 0;
            return {
              allyId: ally.id, allyName: ally.name, targetId: "player",
              skillId: healSk.id, skillName: healSk.name,
              result: { finalDamage: 0, rawDamage: 0, isCrit: false, isMiss: false, isDodged: false, type: "force" as const },
              fpCost: healSk.cost.forcePoints ?? 0, cdSet: cd > 0 ? cd + 1 : 0,
              kind: "heal" as const, seRolls: [], stunned: false, bark, healAmount: Math.max(1, amount),
            };
          }
        }

        // Skill selection shaped by the player-set tactic:
        //   aggressive → always the strongest skill
        //   defensive  → conserve Force, just basic-attack
        //   focus/auto → strongest most of the time, with variety
        const offensive = ally.skillIds
          .map((id) => getSkill(id))
          .filter((sk): sk is NonNullable<typeof sk> =>
            !!sk && sk.targeting !== "self" && !!sk.damage &&
            (ally.cooldowns[sk.id] ?? 0) === 0 && ally.fp >= (sk.cost.forcePoints ?? 0));
        const strongest = () =>
          offensive.reduce((a, b) => ((b.damage?.base ?? 0) > (a.damage?.base ?? 0) ? b : a));
        let skill: typeof BASIC_ATTACK;
        if (tactic === "defensive" || offensive.length === 0) {
          skill = BASIC_ATTACK;
        } else if (tactic === "aggressive") {
          skill = strongest();
        } else {
          skill = rng.chance(0.6) ? strongest() : (rng.pick(offensive) ?? BASIC_ATTACK);
        }

        // Targeting: focus/aggressive lock the player's last target; defensive
        // and auto pick the lowest-HP living enemy to secure kills.
        const focusTarget = state.lastPlayerTarget
          ? livingEnemies.find((e) => e.id === state.lastPlayerTarget)
          : undefined;
        const lowest = [...livingEnemies].sort((a, b) => a.hp - b.hp)[0]!;
        const target = (tactic === "focus" || tactic === "aggressive") ? (focusTarget ?? lowest) : lowest;
        const dmg = skill.damage;
        const attack: AttackInput = {
          skillBase: dmg?.base ?? 8,
          weaponDamage: ally.weaponDamage ?? 10,
          strengthScaling:
            ally.primary.strength * (dmg?.strengthScaling ?? 1.0) +
            ally.primary.force * (dmg?.forceScaling ?? 0),
          type: (dmg?.type ?? "physical") as AttackInput["type"],
          attackerStance: ally.stance,
          attackerCritChance: 0.08 + ally.primary.agility * 0.005,
          attackerCritDamageBonus: 0.4,
          attackerAccuracy: 0.82 + ally.primary.agility * 0.01,
        };
        const defense: DefenseInput = {
          armor: target.armor,
          resistances: target.resistances ?? {},
          defenderStance: target.stance,
          dodgeChance: target.primary.agility * 0.01,
        };
        const cd = skill.cost.cooldown ?? 0;
        return {
          allyId: ally.id, allyName: ally.name, targetId: target.id,
          skillId: skill.id, skillName: skill.name,
          result: resolveAttack(attack, defense, rng),
          fpCost: skill.cost.forcePoints ?? 0,
          cdSet: cd > 0 ? cd + 1 : 0,
          kind: attackKindForSkill(skill),
          seRolls: (skill.statusEffects ?? []).map((se) => rng.chance(se.chance)),
          stunned: false,
          bark,
          healAmount: 0,
        };
      });

      set((s) => {
        for (const action of actions) {
          const ally = s.allies.find((a) => a.id === action.allyId);
          if (!ally || !ally.isAlive) continue;
          if (action.stunned) {
            s.log.push({ turn: s.turnNumber, actorId: ally.id, action: "stunned",
              text: `${ally.name} is stunned — cannot act!` });
            continue;
          }
          // ── Support cast: heal the player ─────────────────────────────
          if (action.healAmount > 0) {
            ally.fp = Math.max(0, ally.fp - action.fpCost);
            if (action.cdSet > 0) ally.cooldowns[action.skillId] = action.cdSet;
            s.player!.hp = Math.min(s.player!.maxHp, s.player!.hp + action.healAmount);
            s.attackEvents.push({
              id: `atk_a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              attackerId: ally.id, targetId: "player", kind: "heal", createdAt: Date.now(),
            });
            s.damageEvents.push({
              id: `dmg_ah_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              targetId: "player", amount: action.healAmount,
              isCrit: false, isMiss: false, isDodged: false, isHeal: true, createdAt: Date.now(),
            });
            s.log.push({ turn: s.turnNumber, actorId: ally.id, action: action.skillId,
              text: `${ally.name} → ${action.skillName} — restores ${action.healAmount} HP to ${s.player!.name}.` });
            if (action.bark) s.log.push({ turn: s.turnNumber, actorId: ally.id, action: "bark", text: `${ally.name}: “${action.bark}”` });
            continue;
          }
          // Original target may have died earlier this batch — retarget.
          const target =
            s.enemies.find((e) => e.id === action.targetId && e.isAlive) ??
            s.enemies.find((e) => e.isAlive);
          if (!target) break;

          ally.fp = Math.max(0, ally.fp - action.fpCost);
          if (action.cdSet > 0) ally.cooldowns[action.skillId] = action.cdSet;

          s.attackEvents.push({
            id: `atk_a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            attackerId: ally.id, targetId: target.id, kind: action.kind, createdAt: Date.now(),
          });

          target.hp = Math.max(0, target.hp - action.result.finalDamage);
          s.damageEvents.push({
            id: `dmg_a_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            targetId: target.id, amount: action.result.finalDamage,
            isCrit: action.result.isCrit, isMiss: action.result.isMiss, isDodged: action.result.isDodged,
            d20: action.result.d20, createdAt: Date.now(),
          });

          if (!action.result.isMiss && !action.result.isDodged) {
            const sk = getSkill(action.skillId);
            (sk?.statusEffects ?? []).forEach((se, i) => {
              if (action.seRolls[i] && target.isAlive) {
                target.statusEffects.push({ effect: se.effect, duration: se.duration, sourceId: ally.id });
              }
            });
          }

          let text: string;
          if (action.result.isMiss) {
            text = `${ally.name} → ${action.skillName} — MISS${d20Tag(action.result)}`;
          } else if (action.result.isDodged) {
            text = `${target.name} dodges ${ally.name}'s ${action.skillName}!${d20Tag(action.result)}`;
          } else {
            const critTag = action.result.isCrit ? " ★CRIT" : "";
            text = `${ally.name} → ${action.skillName} → ${target.name}: ${action.result.finalDamage}${critTag}${d20Tag(action.result)}`;
          }
          if (target.hp <= 0) {
            target.isAlive = false;
            grantKillRewards(s, target.id);
            text += ` ⚔ ${target.name} DEFEATED`;
          }
          s.log.push({ turn: s.turnNumber, actorId: ally.id, action: action.skillId, targetId: target.id, result: action.result, text });
          if (action.bark) {
            s.log.push({ turn: s.turnNumber, actorId: ally.id, action: "bark", text: `${ally.name}: “${action.bark}”` });
          }
        }

        s.lastActedSide = "ally";
        const allDead = s.enemies.every((e) => !e.isAlive);
        s.phase = allDead ? (s.pendingLoot.length > 0 ? "loot" : "victory") : "animating";
      });
    },

    advanceTurn: () => set((s) => {
      // Only advance from the animating phase — stray timers (effect cleanup
      // races, post-endCombat callbacks) must never resurrect a combat.
      if (s.phase !== "animating" || !s.player) return;

      if (!s.player.isAlive) {
        s.phase = "defeat";
        return;
      }
      if (s.enemies.every((e) => !e.isAlive)) {
        s.phase = s.pendingLoot.length > 0 ? "loot" : "victory";
        return;
      }

      // Player just acted → companions act, then the enemies' side.
      if (s.lastActedSide === "player") {
        const livingAllies = s.allies.some((a) => a.isAlive);
        s.phase = livingAllies ? "allyTurn" : "enemyTurn";
        return;
      }
      // Companions just acted → the enemies' side of the round.
      if (s.lastActedSide === "ally") {
        s.phase = "enemyTurn";
        return;
      }

      // Enemies just acted → a new round begins
      s.turnNumber++;
      for (const key of Object.keys(s.player.cooldowns)) {
        s.player.cooldowns[key] = Math.max(0, (s.player.cooldowns[key] ?? 0) - 1);
      }

      // ── Item passive regen (e.g. Voidweaver Force regen) ──────────────
      const regen = s.player.itemEffects;
      if (regen) {
        if (regen.hpRegen > 0 && s.player.hp > 0) s.player.hp = Math.min(s.player.maxHp, s.player.hp + regen.hpRegen);
        if (regen.fpRegen > 0) s.player.fp = Math.min(s.player.maxFp, s.player.fp + regen.fpRegen);
      }
      for (const enemy of s.enemies) {
        for (const key of Object.keys(enemy.cooldowns)) {
          enemy.cooldowns[key] = Math.max(0, (enemy.cooldowns[key] ?? 0) - 1);
        }
      }
      for (const ally of s.allies) {
        for (const key of Object.keys(ally.cooldowns)) {
          ally.cooldowns[key] = Math.max(0, (ally.cooldowns[key] ?? 0) - 1);
        }
        // Damage-over-time + status wind-down on companions too.
        if (ally.isAlive) {
          const adot = computeDotDamage(ally);
          if (adot > 0) {
            ally.hp = Math.max(0, ally.hp - adot);
            if (ally.hp <= 0) {
              ally.isAlive = false;
              s.log.push({ turn: s.turnNumber, actorId: ally.id, action: "dot",
                text: `${ally.name} succumbs to their wounds!` });
            }
          }
          tickStatusDurations(ally);
        }
      }

      // Environmental weather tick — clamped to ≥1 HP so it pressures the
      // fight but never lands the actual kill (avoids reward-less deaths).
      const wxTick = WEATHER_EFFECTS[s.weather];
      if (wxTick.perTurnHpDelta && wxTick.perTurnHpDelta.amount !== 0) {
        const { side, amount } = wxTick.perTurnHpDelta;
        if (side === "all" || side === "player") {
          s.player.hp = Math.max(1, Math.min(s.player.maxHp, s.player.hp + amount));
          for (const a of s.allies) {
            if (a.isAlive) a.hp = Math.max(1, Math.min(a.maxHp, a.hp + amount));
          }
        }
        if (side === "all" || side === "enemy") {
          for (const e of s.enemies) {
            if (e.isAlive) e.hp = Math.max(1, Math.min(e.maxHp, e.hp + amount));
          }
        }
        if (amount < 0) {
          s.log.push({ turn: s.turnNumber, actorId: "player", action: "weather",
            text: `${wxTick.label} saps the living.` });
        }
      }

      // Damage-over-time on the player at the start of their side
      const dot = computeDotDamage(s.player);
      if (dot > 0) {
        s.player.hp = Math.max(0, s.player.hp - dot);
        s.damageEvents.push({
          id: `dmg_dot_p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          targetId: "player", amount: dot,
          isCrit: false, isMiss: false, isDodged: false,
          createdAt: Date.now(),
        });
        s.log.push({ turn: s.turnNumber, actorId: "player", action: "dot",
          text: `${s.player.name} suffers ${dot} from lingering wounds.` });
        if (s.player.hp <= 0) {
          s.player.isAlive = false;
          s.phase = "defeat";
          return;
        }
      }
      tickStatusDurations(s.player);

      // A stunned player loses the round — the enemies act again
      if (s.player.statusEffects.some((se) => se.effect === "stun")) {
        s.log.push({ turn: s.turnNumber, actorId: "player", action: "stunned",
          text: `${s.player.name} is stunned — the enemy presses the advantage!` });
        s.lastActedSide = "player";
        s.phase = "enemyTurn";
        return;
      }

      s.phase = "playerTurn";
    }),

    tickStatusEffects: (combatantId) => set((s) => {
      const c = combatantId === "player"
        ? s.player
        : s.enemies.find((e) => e.id === combatantId);
      if (!c) return;

      for (const status of c.statusEffects) {
        switch (status.effect) {
          case "bleed":  c.hp = Math.max(0, c.hp - Math.floor(c.maxHp * 0.03)); break;
          case "burn":   c.hp = Math.max(0, c.hp - Math.floor(c.maxHp * 0.05)); break;
          case "poison": c.hp = Math.max(0, c.hp - Math.floor(c.maxHp * 0.04)); break;
          case "shock":  c.hp = Math.max(0, c.hp - Math.floor(c.maxHp * 0.02));
                         c.fp = Math.max(0, c.fp - 5); break;
        }
      }

      c.statusEffects = c.statusEffects
        .map((se) => ({ ...se, duration: se.duration - 1 }))
        .filter((se) => se.duration > 0);

      if (c.hp <= 0) {
        c.isAlive = false;
        if (c.isPlayer) {
          s.phase = "defeat";
        } else if (s.enemies.every((e) => !e.isAlive)) {
          s.phase = s.pendingLoot.length > 0 ? "loot" : "victory";
        }
      }
    }),

    // ── Special player actions ────────────────────────────────────────

    guard: () => {
      const state = get();
      if (state.phase !== "playerTurn" || !state.player) return;
      set((s) => {
        if (!s.player) return;
        const boost = Math.floor(s.player.armor * 0.5);
        s.attackEvents.push({
          id: `atk_g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          attackerId: "player", targetId: "player", kind: "buff", createdAt: Date.now(),
        });
        s.player.armor += boost;
        s.player.statusEffects = s.player.statusEffects.filter(
          (se) => !["fear", "stun", "cripple", "blind"].includes(se.effect),
        );
        s.log.push({ turn: s.turnNumber, actorId: "player", action: "guard",
          text: `${s.player.name} braces — armor +${boost} until next turn.` });
        s.selectedSkill = null;
        s.selectedTarget = null;
        s.lastActedSide = "player";
        s.phase = "animating";
      });
    },

    fleeAttempt: () => {
      const state = get();
      if (state.phase !== "playerTurn" || !state.player || !_combatRng) return;
      const rng = _combatRng;
      const playerAgi = state.player.primary.agility;
      const livingEnemies = state.enemies.filter((e) => e.isAlive);
      const avgEnemyAgi = livingEnemies.reduce((acc, e) => acc + e.primary.agility, 0)
        / Math.max(1, livingEnemies.length);
      const fleeChance = Math.min(0.85, Math.max(0.1, 0.35 + (playerAgi - avgEnemyAgi) * 0.05));
      const success = rng.chance(fleeChance);

      set((s) => {
        if (success) {
          s.log.push({ turn: s.turnNumber, actorId: "player", action: "flee",
            text: `${s.player!.name} breaks from combat and escapes!` });
          s.phase = "fled";
        } else {
          s.log.push({ turn: s.turnNumber, actorId: "player", action: "flee",
            text: `${s.player!.name} fails to escape — the enemy closes in!` });
          s.selectedSkill = null;
          s.selectedTarget = null;
          s.lastActedSide = "player";
          s.phase = "animating"; // enemy gets a punishing free round
        }
      });
    },

    collectLoot: () => set((s) => { s.phase = "victory"; }),

    clearScreenFlash: () => set((s) => { s.screenFlash = null; }),

    unleashLimitBreak: () => {
      const state = get();
      if (state.phase !== "playerTurn" || !state.player || !_combatRng) return;
      if (state.limitBreak < 100) return;
      const rng = _combatRng;
      const livingEnemies = state.enemies.filter((e) => e.isAlive);
      if (livingEnemies.length === 0) return;

      // Massive AoE: 6x base + huge force scaling, guaranteed crit
      const baseHit = 40 + state.player.primary.strength * 1.5 + state.player.primary.force * 2.0;
      const attack: AttackInput = {
        skillBase: baseHit,
        weaponDamage: Math.max(25, state.player.weaponDamage ?? 0),
        strengthScaling: 0,
        type: "force",
        attackerStance: state.player.stance,
        attackerCritChance: 1.0,  // guaranteed crit
        attackerCritDamageBonus: 1.5,
        attackerAccuracy: 1.0,
      };
      const results = livingEnemies.map((tgt) => ({
        enemyId: tgt.id,
        result: resolveAttack(
          attack,
          { armor: Math.floor(tgt.armor * 0.4), resistances: tgt.resistances ?? {}, defenderStance: tgt.stance, dodgeChance: 0 },
          rng,
        ),
      }));

      set((s) => {
        if (!s.player) return;
        s.limitBreak = 0;
        s.screenFlash = "limit";
        s.log.push({ turn: s.turnNumber, actorId: "player", action: "limit_break",
          text: `${s.player.name} unleashes LIMIT BREAK!` });

        for (const { enemyId, result } of results) {
          const enemy = s.enemies.find((e) => e.id === enemyId);
          if (!enemy || !enemy.isAlive) continue;
          s.attackEvents.push({
            id: `atk_lb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            attackerId: "player", targetId: enemyId, kind: "lightning", createdAt: Date.now(),
          });
          enemy.hp = Math.max(0, enemy.hp - result.finalDamage);
          s.damageEvents.push({
            id: `dmg_lb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            targetId: enemyId,
            amount: result.finalDamage,
            isCrit: true,
            isMiss: false,
            isDodged: false,
            createdAt: Date.now(),
          });
          if (enemy.hp <= 0) {
            enemy.isAlive = false;
            const template = s.enemyTemplates.find((t) =>
              enemyId === `enemy_${t.id}_0` || enemyId.startsWith(`enemy_${t.id}_`),
            );
            if (template) {
              s.xpReward += template.xpReward;
              s.creditReward += Math.floor((template.creditReward[0] + template.creditReward[1]) / 2);
              const tbl = LOOT_TABLES[template.lootTableId];
              if (tbl) {
                const lootRng = new RNG(`loot_lb_${enemyId}_${Date.now()}`);
                for (const drop of rollLootTable(tbl, lootRng)) {
                  const ex = s.pendingLoot.find((l) => l.itemId === drop.itemId);
                  if (ex) ex.qty += drop.qty;
                  else s.pendingLoot.push({ itemId: drop.itemId, qty: drop.qty });
                }
              }
            }
          }
        }

        s.selectedSkill = null;
        s.selectedTarget = null;
        s.lastActedSide = "player";
        const allDead = s.enemies.every((e) => !e.isAlive);
        s.phase = allDead ? (s.pendingLoot.length > 0 ? "loot" : "victory") : "animating";
      });
    },

    useItem: (itemId: string) => {
      const state = get();
      if (state.phase !== "playerTurn" || !state.player) return;
      set((s) => {
        if (!s.player) return;
        let text = "";
        if (itemId.includes("medpack") || itemId.includes("medpac")) {
          const heal = itemId.includes("advanced")
            ? Math.floor(s.player.maxHp * 0.5)
            : Math.floor(s.player.maxHp * 0.25);
          s.player.hp = Math.min(s.player.maxHp, s.player.hp + heal);
          text = `${s.player.name} uses medpac — +${heal} HP`;
        } else if (itemId.includes("force_stim")) {
          const fp = Math.floor(s.player.maxFp * 0.3);
          s.player.fp = Math.min(s.player.maxFp, s.player.fp + fp);
          text = `${s.player.name} uses Force stim — +${fp} FP`;
        } else if (itemId.includes("adrenal")) {
          s.player.statusEffects.push({ effect: "rage", duration: 3, sourceId: "item" });
          text = `${s.player.name} injects adrenal — RAGE active`;
        } else if (itemId.includes("antidote")) {
          s.player.statusEffects = s.player.statusEffects.filter((se) => se.effect !== "poison");
          text = `${s.player.name} uses antidote — poison cured`;
        } else {
          text = `${s.player.name} uses ${itemId}`;
        }
        s.log.push({ turn: s.turnNumber, actorId: "player", action: "use_item", text });
        s.selectedSkill = null;
        s.selectedTarget = null;
        s.lastActedSide = "player";
        s.phase = "animating";
      });
    },

    addLog: (entry) => set((s) => {
      s.log.push({ ...entry, turn: s.turnNumber });
    }),

    clearDamageEvent: (id) => set((s) => {
      s.damageEvents = s.damageEvents.filter((e) => e.id !== id);
    }),

    clearAttackEvent: (id) => set((s) => {
      s.attackEvents = s.attackEvents.filter((e) => e.id !== id);
    }),

    endCombat: () => {
      _combatRng = null;
      set((s) => {
        s.phase = "idle";
        s.player = null;
        s.allies = [];
        s.enemies = [];
        s.enemyTemplates = [];
        s.log = [];
        s.damageEvents = [];
        s.attackEvents = [];
        s.turnOrder = [];
        s.currentTurnIndex = 0;
        s.turnNumber = 0;
        s.lastActedSide = "enemy";
        s.selectedSkill = null;
        s.selectedTarget = null;
        s.lastPlayerTarget = null;
        s.xpReward = 0;
        s.creditReward = 0;
        s.pendingLoot = [];
        s.staggeredEnemies = [];
        s.comboCount = 0;
        s.maxCombo = 0;
        s.limitBreak = 0;
        s.screenFlash = null;
        s.staggerStacks = {};
        s.combatSeed = "";
        s.skillHistory = [];
      });
    },
  })),
);
