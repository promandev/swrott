import type { CompanionDefinition } from "../companions/companions";
import { COMPANIONS } from "../companions/companions";
import { getSkill, BASIC_ATTACK } from "../../data/schemas/skill-registry";
import { getItem } from "../../data/items/item-registry";
import { computeMaxHP, computeMaxForce } from "../progression/stats";
import type { Stance } from "./damage";

/** Aggregate a companion's assigned gear (slot → itemId) into combat bonuses. */
function summarizeCompanionGear(equipment?: Record<string, string>) {
  const g = { strength: 0, agility: 0, endurance: 0, force: 0, influence: 0, armor: 0, hp: 0, fp: 0, weaponDamage: 0 };
  if (!equipment) return g;
  for (const [slot, itemId] of Object.entries(equipment)) {
    const item = getItem(itemId);
    if (!item) continue;
    if (slot === "main_hand" && item.weapon) g.weaponDamage += item.weapon.damage;
    const b = item.bonuses;
    if (!b) continue;
    g.strength += b.strength ?? 0;
    g.agility += b.agility ?? 0;
    g.endurance += b.endurance ?? 0;
    g.force += b.force ?? 0;
    g.influence += b.influence ?? 0;
    g.armor += b.armor ?? 0;
    g.hp += b.hp ?? 0;
    g.fp += b.forcePoints ?? 0;
  }
  return g;
}

/**
 * Build a combat payload for a companion fighting alongside the player
 * (KOTOR-style party). Mirrors buildCombatPlayer but sources stats from the
 * companion definition, scaled to an effective level (it keeps pace with the
 * player so a low-level companion isn't dead weight in late fights).
 *
 * Kept pure + dependency-light so it's unit-testable and reusable by the
 * combat store when allies are wired into the turn loop.
 */

const COMPANION_BASE_ARMOR = 16;
const COMPANION_WEAPON_DAMAGE = 12;

export interface CompanionCombatPayload {
  id: string;
  name: string;
  level: number;
  primary: CompanionDefinition["primary"];
  hp: number;
  maxHp: number;
  fp: number;
  maxFp: number;
  armor: number;
  weaponDamage: number;
  skillIds: string[];
  stance: Stance;
  aiBehavior: CompanionDefinition["aiBehavior"];
  /** Player-set combat tactic (defaults to "auto"). */
  tactic: CompanionTactic;
}

export type CompanionTactic = "auto" | "aggressive" | "defensive" | "focus";

/** Extra abilities companions grow into as they keep pace with the player. */
const CLASS_GROWTH_SKILLS: Record<string, Array<{ level: number; skill: string }>> = {
  marauder: [{ level: 12, skill: "cleave" }, { level: 18, skill: "unstoppable" }],
  inquisitor: [{ level: 12, skill: "chain_lightning" }, { level: 18, skill: "force_storm" }],
  assassin: [{ level: 12, skill: "backstab" }, { level: 18, skill: "shadow_dash" }],
};

/** Resolve a companion's usable combat skills (valid ids + a basic attack +
 *  class-growth abilities unlocked by level), de-duplicated. */
export function companionCombatSkills(def: CompanionDefinition, level = def.baseLevel): string[] {
  const ids = new Set<string>();
  for (const id of def.skillIds) if (getSkill(id)) ids.add(id);
  for (const g of CLASS_GROWTH_SKILLS[def.classId] ?? []) {
    if (level >= g.level && getSkill(g.skill)) ids.add(g.skill);
  }
  return [BASIC_ATTACK.id, ...ids];
}

export function buildCompanionCombatant(
  def: CompanionDefinition,
  playerLevel: number,
  equipment?: Record<string, string>,
  tactic: CompanionTactic = "auto",
): CompanionCombatPayload {
  // Companions keep pace with the player (KOTOR-style), never dropping below
  // their own recruitment level, so early recruits stay viable all game.
  const level = Math.max(def.baseLevel, playerLevel);
  const gear = summarizeCompanionGear(equipment);
  const primary = {
    ...def.primary,
    strength: def.primary.strength + gear.strength,
    agility: def.primary.agility + gear.agility,
    endurance: def.primary.endurance + gear.endurance,
    force: def.primary.force + gear.force,
    influence: def.primary.influence + gear.influence,
  };
  const maxHp = computeMaxHP(primary.endurance, level) + gear.hp;
  const maxFp = primary.force > 0 ? computeMaxForce(primary.force, level) + gear.fp : 0;

  return {
    id: def.id,
    name: def.name,
    level,
    primary,
    hp: maxHp,
    maxHp,
    fp: maxFp,
    maxFp,
    armor: COMPANION_BASE_ARMOR + gear.armor,
    weaponDamage: gear.weaponDamage > 0 ? gear.weaponDamage : COMPANION_WEAPON_DAMAGE,
    skillIds: companionCombatSkills(def, level),
    stance: def.aiBehavior === "defensive" || def.aiBehavior === "support" ? "defensive" : "aggressive",
    aiBehavior: def.aiBehavior,
    tactic,
  };
}

/** Combat one-liners per companion — emitted occasionally for personality. */
export const COMPANION_BARKS: Record<string, string[]> = {
  kaelis: ["Face me with honor!", "A clean strike.", "This is how a duelist fights."],
  v3x9: ["Target neutralized.", "Calculating optimal lethality.", "Organic resistance: futile."],
  serana: ["Forgive me.", "The Force guides my hand.", "I will not hold back."],
  torvak: ["For Mandalore!", "Now THIS is a fight!", "Is that all you have?"],
  echo_shade: ["Your essence feeds the void.", "Ashes to ashes.", "Death is only a doorway."],
  default: ["For the Empire!", "Stand and fight!"],
};

/** Pick a bark line for a companion by id (or a generic fallback). */
export function companionBark(companionId: string, index: number): string {
  const lines = COMPANION_BARKS[companionId] ?? COMPANION_BARKS.default!;
  return lines[index % lines.length]!;
}

/**
 * Build combat payloads for the active party (companions flagged `inParty`),
 * ready to pass as the `allies` argument of startCombat.
 */
export function buildPartyCombatants(
  companions: Array<{ id: string; inParty: boolean; equipment?: Record<string, string>; tactic?: CompanionTactic }>,
  playerLevel: number,
): CompanionCombatPayload[] {
  return companions
    .filter((c) => c.inParty)
    .map((c) => {
      const def = COMPANIONS.find((d) => d.id === c.id);
      return def ? buildCompanionCombatant(def, playerLevel, c.equipment, c.tactic ?? "auto") : null;
    })
    .filter((p): p is CompanionCombatPayload => Boolean(p));
}
