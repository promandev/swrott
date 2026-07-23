/**
 * Prestige system (Idea #12).
 *
 * After level 30, the player can prestige: reset to level 1, lose all
 * talents/spec/multiclass, KEEP legendary items, mythic items, ancient_sith
 * items, and memory shards. Each prestige tier grants:
 *
 *   +1 permanent talent point
 *   +5% XP gain (compounding)
 *   +5% credit drops (compounding)
 *   Cosmetic title "Reborn N" → "Twice-Reborn" → "Eternal"
 *
 * Hard cap: 9 prestige tiers (then unlocks the secret "Ascended" challenge).
 */

import type { CharacterSnapshot } from "../save/types";
import { STARTING_PRIMARY, computeMaxHP, computeMaxForce } from "./new-game";

export const PRESTIGE_MIN_LEVEL = 30;
export const PRESTIGE_MAX_TIER = 9;

export interface PrestigeBonus {
  bonusTalentPoints: number;
  xpMultiplier: number;
  creditMultiplier: number;
  title: string;
}

export function bonusForPrestige(tier: number): PrestigeBonus {
  const t = Math.max(0, Math.min(PRESTIGE_MAX_TIER, tier));
  const titles = [
    "", "Reborn", "Twice-Reborn", "Thrice-Reborn", "Fourth Crown",
    "Fifth Crown", "Sixth Crown", "Seventh Crown", "Eighth Crown", "Eternal",
  ];
  return {
    bonusTalentPoints: t,
    xpMultiplier: Math.pow(1.05, t),
    creditMultiplier: Math.pow(1.05, t),
    title: titles[t] ?? "Eternal",
  };
}

export function canPrestige(character: CharacterSnapshot): { ok: boolean; reason?: string } {
  if (character.level < PRESTIGE_MIN_LEVEL) return { ok: false, reason: `Need level ${PRESTIGE_MIN_LEVEL}.` };
  if (character.prestige >= PRESTIGE_MAX_TIER) return { ok: false, reason: "Prestigio máximo alcanzado." };
  return { ok: true };
}

/** Returns the set of item ids to KEEP through prestige. */
export function keptItemsAfterPrestige(character: CharacterSnapshot): string[] {
  return character.inventory
    .filter((it) => {
      // Keep all instances of rare-tier legendaries/mythic — UI looks up rarity from registry
      return it.itemId.startsWith("legend_") || it.itemId.includes("mythic") || it.itemId.includes("ancient");
    })
    .map((it) => it.itemId);
}

/** Apply prestige in place; returns the new character snapshot. */
export function applyPrestige(character: CharacterSnapshot): CharacterSnapshot {
  if (!canPrestige(character).ok) return character;

  const newPrestige = character.prestige + 1;
  const bonus = bonusForPrestige(newPrestige);
  const keepItems = keptItemsAfterPrestige(character);

  // Reset numeric stats
  const primary = { ...STARTING_PRIMARY[character.classId] };
  return {
    ...character,
    level: 1,
    xp: 0,
    attributePoints: 0,
    talentPoints: bonus.bonusTalentPoints,
    primary: { ...primary, corruption: character.primary.corruption }, // keep corruption
    hp: computeMaxHP(primary.endurance, 1),
    forcePoints: computeMaxForce(primary.force, 1),
    specId: undefined,
    multiclassId: undefined,
    talents: [],
    equipment: {},
    inventory: keepItems.map((id, i) => ({
      instanceId: `prestige_${Date.now()}_${i}`,
      itemId: id,
      qty: 1,
    })),
    // Keep memory shards, achievements, titles, mutators, ngPlus
    prestige: newPrestige,
    activeTitle: bonus.title,
    favoriteSkills: [],
  };
}
