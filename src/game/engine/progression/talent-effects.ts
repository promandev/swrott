import type { CharacterSnapshot } from "../save/types";
import { getTalent, getBaselineSkills } from "../../data/talents/talent-registry";
import { BASE_LOADOUT_SLOTS, MAX_LOADOUT_SLOTS } from "../../data/talents/talent-types";

/**
 * Resolves a character's unlocked talents into concrete modifiers.
 *
 * This is the bridge that makes the talent tree *matter*: it aggregates
 * every unlocked node's stat bonuses, collects the skills the tree makes
 * available for the combat loadout, and computes how many loadout slots
 * the build has earned (4 base, +1 per slot-granting node, capped at 6).
 */

/** Combat-relevant subset, threaded into the combat engine. */
export interface CombatTalentMods {
  /** +% to all outgoing damage (e.g. 30 → +30%). */
  damagePercent: number;
  /** Extra crit chance in percentage points (8 → +0.08). */
  critChance: number;
  /** Extra crit damage in percentage points (20 → +0.20). */
  critDamage: number;
  /** % of target armor ignored (0..100). */
  armorPiercePct: number;
  /** % of damage dealt returned as HP (0..100). */
  lifestealPct: number;
  /** Extra dodge chance in percentage points. */
  dodgeChance: number;
  /** +% armor effectiveness. */
  armorPercent: number;
}

export interface TalentModifiers extends CombatTalentMods {
  // Flat primary-stat additions
  strength: number;
  agility: number;
  endurance: number;
  force: number;
  influence: number;
  // Flat derived additions
  armor: number;
  maxHp: number;
  maxFp: number;
  /** Skills made available for the combat loadout by talents. */
  unlockedSkillIds: string[];
  /** Combat loadout slots earned (4..6). */
  loadoutSlots: number;
  /** Unlocked talent ids (for keyword/passive combat hooks). */
  unlockedIds: Set<string>;
}

export function computeTalentModifiers(character: CharacterSnapshot): TalentModifiers {
  const mods: TalentModifiers = {
    damagePercent: 0, critChance: 0, critDamage: 0, armorPiercePct: 0,
    lifestealPct: 0, dodgeChance: 0, armorPercent: 0,
    strength: 0, agility: 0, endurance: 0, force: 0, influence: 0,
    armor: 0, maxHp: 0, maxFp: 0,
    unlockedSkillIds: [],
    loadoutSlots: BASE_LOADOUT_SLOTS,
    unlockedIds: new Set(),
  };

  let slotGrants = 0;
  for (const talentId of character.talents) {
    const node = getTalent(talentId);
    if (!node || node.classId !== character.classId) continue;
    mods.unlockedIds.add(talentId);

    const b = node.bonuses;
    mods.strength += b.strength ?? 0;
    mods.agility += b.agility ?? 0;
    mods.endurance += b.endurance ?? 0;
    mods.force += b.force ?? 0;
    mods.influence += b.influence ?? 0;
    mods.armor += b.armor ?? 0;
    mods.maxHp += b.maxHp ?? 0;
    mods.maxFp += b.maxFp ?? 0;
    mods.critChance += b.critChance ?? 0;
    mods.critDamage += b.critDamage ?? 0;
    mods.damagePercent += b.damagePercent ?? 0;
    mods.armorPercent += b.armorPercent ?? 0;
    mods.dodgeChance += b.dodgeChance ?? 0;
    mods.armorPiercePct += b.armorPiercePct ?? 0;
    mods.lifestealPct += b.lifestealPct ?? 0;

    if (node.unlocksSkill) mods.unlockedSkillIds.push(node.unlocksSkill);
    if (node.grantsLoadoutSlot) slotGrants += 1;
  }

  mods.loadoutSlots = Math.min(MAX_LOADOUT_SLOTS, BASE_LOADOUT_SLOTS + slotGrants);
  return mods;
}

/** Just the combat-relevant slice, for the combat engine. */
export function toCombatMods(mods: TalentModifiers): CombatTalentMods {
  return {
    damagePercent: mods.damagePercent,
    critChance: mods.critChance,
    critDamage: mods.critDamage,
    armorPiercePct: mods.armorPiercePct,
    lifestealPct: mods.lifestealPct,
    dodgeChance: mods.dodgeChance,
    armorPercent: mods.armorPercent,
  };
}

/**
 * The full pool of skills the character may slot into combat:
 * always-available baseline skills + everything talents have unlocked.
 */
export function availableSkillIds(character: CharacterSnapshot): string[] {
  const baseline = getBaselineSkills(character.classId);
  const mods = computeTalentModifiers(character);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of [...baseline, ...mods.unlockedSkillIds]) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}
