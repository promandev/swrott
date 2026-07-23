import type { ClassId } from "../schemas/common";

/**
 * Shared talent types. The talent tree is the spine of build identity:
 * nodes unlock combat skills (`unlocksSkill`), grant passive stat bonuses
 * (`bonuses`), and a few grant an extra combat loadout slot
 * (`grantsLoadoutSlot`). Effects are resolved in
 * `engine/progression/talent-effects.ts`.
 */

export interface TalentBonuses {
  strength?: number;
  agility?: number;
  endurance?: number;
  force?: number;
  influence?: number;
  armor?: number;
  critChance?: number;
  critDamage?: number;
  maxHp?: number;
  maxFp?: number;
  /** Flat % added to all outgoing damage. */
  damagePercent?: number;
  /** Flat % added to armor effectiveness. */
  armorPercent?: number;
  dodgeChance?: number;
  /** % of target armor ignored on hit. */
  armorPiercePct?: number;
  /** % of damage dealt returned as HP. */
  lifestealPct?: number;
}

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  classId: ClassId;
  /** Tree id (unique across all classes). */
  tree: string;
  tier: 1 | 2 | 3 | 4 | 5;
  /** Talent IDs that must be unlocked first. */
  prereqs: string[];
  /** Stat / combat modifiers when unlocked. */
  bonuses: TalentBonuses;
  /** Passive effect description (for non-stat passives). */
  passive?: string;
  /** Skill ID this node makes available for the combat loadout. */
  unlocksSkill?: string;
  /** Grants +1 combat loadout slot (base 4, capped at 6). */
  grantsLoadoutSlot?: boolean;
}

export interface TalentTreeMeta {
  id: string;
  name: string;
  classId: ClassId;
  description: string;
}

/** Character level required to unlock each talent tier. */
export const TIER_LEVEL_REQ: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 1,
  2: 4,
  3: 8,
  4: 12,
  5: 16,
};

/** Base combat loadout slots before talent bonuses; hard cap with bonuses. */
export const BASE_LOADOUT_SLOTS = 4;
export const MAX_LOADOUT_SLOTS = 6;
