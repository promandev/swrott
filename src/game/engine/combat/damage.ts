import type { RNG } from "../rng/rng";
import { computeArmorReduction } from "../progression/stats";

/**
 * Damage pipeline — KOTOR-style d20 resolution.
 *
 * Source: Master Design Bible §4 "Sistema de Combate Extenso", revised to
 * mirror the d20 system used by Knights of the Old Republic:
 *
 *   Attack roll = d20 + Attack Bonus  vs  Defense (10 + dodge + stance)
 *   Natural 1   = always miss
 *   Natural 20  = always hit + critical threat
 *   Crit threat = top of the d20 range, widened by crit chance (keen)
 *
 * Damage (on hit):
 *   Raw       = SkillBase + WeaponDmg + StrengthScaling
 *   Mitigated = Raw * (1 - ArmorReduction) * (1 - Resistance)
 *   Variance  = ±10%
 *   Crit      = x(1.5 + CritDamageBonus)
 */

export type DamageType =
  | "physical"
  | "energy"
  | "mental"
  | "force"
  | "poison"
  | "fire"
  | "shock";

export type Stance = "aggressive" | "defensive" | "precision" | "frenzy" | "riposte";

export interface AttackInput {
  skillBase: number;
  weaponDamage: number;
  strengthScaling: number; // strength * coefficient already applied by caller
  type: DamageType;
  attackerStance: Stance;
  attackerCritChance: number; // 0..1 — widens the crit threat range
  attackerCritDamageBonus: number; // additive, e.g. 0.5 -> x2.0 crit
  attackerAccuracy: number; // 0..1 — converted to a d20 attack bonus
  /** Flat multiplier on outgoing damage (talents/buffs). Default 1. */
  damageMultiplier?: number;
  /** Fraction of target armor ignored (0..1). Default 0. */
  armorPiercePct?: number;
}

export interface DefenseInput {
  armor: number;
  resistances: Partial<Record<DamageType, number>>; // 0..1 (0 = none)
  defenderStance: Stance;
  dodgeChance: number; // 0..1 — converted into Defense
}

/** The visible d20 roll — KOTOR-style combat feedback for the log. */
export interface AttackRoll {
  roll: number;        // natural d20 (1-20)
  attackBonus: number; // derived from accuracy
  defense: number;     // 10 + dodge + stance modifier
  isNat20: boolean;
  isNat1: boolean;
}

export interface DamageResult {
  finalDamage: number; // floored, ≥0
  rawDamage: number;
  isCrit: boolean;
  isMiss: boolean;
  isDodged: boolean;
  type: DamageType;
  /** d20 detail for combat-log display. Absent for auto-resolved attacks. */
  d20?: AttackRoll;
}

const STANCE_DAMAGE_MOD: Record<Stance, number> = {
  aggressive: 1.2,
  defensive: 0.9,
  precision: 1.0,
  frenzy: 1.0,
  riposte: 0.8,           // less direct damage…
};

const STANCE_ARMOR_MOD: Record<Stance, number> = {
  aggressive: 0.85,
  defensive: 1.25,
  precision: 1.0,
  frenzy: 1.0,
  riposte: 0.95,          // …but mostly relies on counter-thorns
};

const STANCE_ACCURACY_MOD: Record<Stance, number> = {
  aggressive: 1.0,
  defensive: 1.0,
  precision: 1.15,
  frenzy: 0.95,
  riposte: 1.05,
};

const STANCE_CRIT_MOD: Record<Stance, number> = {
  aggressive: 1.0,
  defensive: 1.0,
  precision: 1.1,
  frenzy: 1.0,
  riposte: 1.0,
};

/** Defender stance shifts Defense like KOTOR's stances shift AC. */
const STANCE_DEFENSE_BONUS: Record<Stance, number> = {
  aggressive: -2,
  defensive: 2,
  precision: 0,
  frenzy: -1,
  riposte: 1,
};

export function resolveAttack(
  attack: AttackInput,
  defense: DefenseInput,
  rng: RNG,
): DamageResult {
  const accuracy = Math.min(
    1,
    Math.max(0, attack.attackerAccuracy * STANCE_ACCURACY_MOD[attack.attackerStance]),
  );

  // Degenerate case: zero accuracy can never connect.
  if (accuracy <= 0) {
    return {
      finalDamage: 0,
      rawDamage: 0,
      isCrit: false,
      isMiss: true,
      isDodged: false,
      type: attack.type,
    };
  }

  // ── d20 attack roll ──────────────────────────────────────────────
  // accuracy 0.85 → +7 attack bonus; dodge 0.15 → Defense 13.
  const attackBonus = Math.round(accuracy * 20) - 10;
  const baseDefense = 10 + STANCE_DEFENSE_BONUS[defense.defenderStance];
  const totalDefense =
    baseDefense + Math.round(Math.min(0.95, Math.max(0, defense.dodgeChance)) * 20);

  const roll = rng.int(1, 20);
  const isNat20 = roll === 20;
  const isNat1 = roll === 1;
  const hits = !isNat1 && (isNat20 || roll + attackBonus >= totalDefense);

  const d20: AttackRoll = {
    roll,
    attackBonus,
    defense: totalDefense,
    isNat20,
    isNat1,
  };

  if (!hits) {
    // Distinguish "you swung wide" (miss) from "they slipped aside" (dodge):
    // the attack would have landed against base Defense but dodge saved them.
    const beatBaseDefense = !isNat1 && roll + attackBonus >= baseDefense;
    return {
      finalDamage: 0,
      rawDamage: 0,
      isCrit: false,
      isMiss: !beatBaseDefense,
      isDodged: beatBaseDefense,
      type: attack.type,
      d20,
    };
  }

  const raw =
    (attack.skillBase + attack.weaponDamage + attack.strengthScaling) *
    STANCE_DAMAGE_MOD[attack.attackerStance] *
    (attack.damageMultiplier ?? 1);

  const piercedArmor =
    defense.armor * Math.max(0, 1 - Math.min(0.95, attack.armorPiercePct ?? 0));
  const effectiveArmor = piercedArmor * STANCE_ARMOR_MOD[defense.defenderStance];
  const armorReduction = computeArmorReduction(effectiveArmor);
  const resistance = Math.min(0.85, defense.resistances[attack.type] ?? 0);

  let dmg = raw * (1 - armorReduction) * (1 - resistance);

  // ±10% variance
  dmg *= rng.float(0.9, 1.1);

  // ── Critical threat (keen range) ─────────────────────────────────
  // critChance 0.10 → threat on 19-20. Natural 20 always threatens.
  const critChance = Math.min(
    1,
    attack.attackerCritChance * STANCE_CRIT_MOD[attack.attackerStance],
  );
  const threatSize = Math.max(1, Math.round(critChance * 20));
  const isCrit = isNat20 || roll >= 21 - threatSize;
  if (isCrit) {
    dmg *= 1.5 + attack.attackerCritDamageBonus;
  }

  return {
    finalDamage: Math.max(0, Math.floor(dmg)),
    rawDamage: raw,
    isCrit,
    isMiss: false,
    isDodged: false,
    type: attack.type,
    d20,
  };
}

// ─── Combat-UI previews (no RNG — deterministic estimates) ────────────
//
// These mirror resolveAttack's math exactly so the tactical readout the
// player sees before committing matches what the engine will roll. They
// share the same stance tables above, so there is no formula to drift.

/** Probability 0..1 that this attack connects, under resolveAttack's d20 model. */
export function hitProbability(attack: AttackInput, defense: DefenseInput): number {
  const accuracy = Math.min(
    1,
    Math.max(0, attack.attackerAccuracy * STANCE_ACCURACY_MOD[attack.attackerStance]),
  );
  if (accuracy <= 0) return 0;

  const attackBonus = Math.round(accuracy * 20) - 10;
  const baseDefense = 10 + STANCE_DEFENSE_BONUS[defense.defenderStance];
  const totalDefense =
    baseDefense + Math.round(Math.min(0.95, Math.max(0, defense.dodgeChance)) * 20);

  // Enumerate the 20 faces: nat-1 always misses, nat-20 always hits.
  let hits = 0;
  for (let roll = 1; roll <= 20; roll++) {
    if (roll === 1) continue;
    if (roll === 20 || roll + attackBonus >= totalDefense) hits++;
  }
  return hits / 20;
}

/** Expected damage band (on a hit) after armor + resistance, plus the crit ceiling. */
export function estimateDamageBand(
  attack: AttackInput,
  defense: DefenseInput,
): { min: number; max: number; crit: number } {
  const raw =
    (attack.skillBase + attack.weaponDamage + attack.strengthScaling) *
    STANCE_DAMAGE_MOD[attack.attackerStance] *
    (attack.damageMultiplier ?? 1);

  const piercedArmor =
    defense.armor * Math.max(0, 1 - Math.min(0.95, attack.armorPiercePct ?? 0));
  const effectiveArmor = piercedArmor * STANCE_ARMOR_MOD[defense.defenderStance];
  const armorReduction = computeArmorReduction(effectiveArmor);
  const resistance = Math.min(0.85, defense.resistances[attack.type] ?? 0);

  const base = raw * (1 - armorReduction) * (1 - resistance);
  const max = base * 1.1;
  return {
    min: Math.max(0, Math.floor(base * 0.9)),
    max: Math.max(0, Math.floor(max)),
    crit: Math.max(0, Math.floor(max * (1.5 + attack.attackerCritDamageBonus))),
  };
}
