/**
 * Set definitions — multiple pieces from the same setId grant tiered bonuses.
 * Source: Ultimate Loot Bible §7.
 */

import type { AffixEffect } from "../schemas/affix";
import { useI18n } from "@/i18n";

export interface SetTierBonus {
  pieces: number;
  /** Stat/combat modifiers granted at this tier. */
  effect: AffixEffect;
  /** Optional named effect id (e.g. "force_storm_discount"). */
  effectId?: string;
  description: string;
}

export interface ItemSet {
  id: string;
  name: string;
  description: string;
  /** Class affinity (for smart loot weighting). */
  classAffinity?: "marauder" | "inquisitor" | "assassin";
  tiers: SetTierBonus[];
}

export const ITEM_SETS: Record<string, ItemSet> = {
  // ── Void Lord (Inquisitor) ────────────────────────────────────────
  void_lord: {
    id: "void_lord",
    name: "Void Lord",
    description: "Robes worn by the architects of the Cult of Nihilus.",
    classAffinity: "inquisitor",
    tiers: [
      { pieces: 2, description: "+10% Force damage",
        effect: { damageOfType: { force: 0.10 } } },
      { pieces: 4, description: "Shock spreads to nearby enemies on hit",
        effect: { damageOfType: { shock: 0.20 } },
        effectId: "void_lord_shock_spread" },
      { pieces: 6, description: "Force Storm costs 50% less Force Points",
        effect: { fpCostReduction: 0.50 },
        effectId: "void_lord_storm_discount" },
    ],
  },

  // ── Bloodforged Warlord (Marauder) ────────────────────────────────
  bloodforged: {
    id: "bloodforged",
    name: "Bloodforged Warlord",
    description: "Armor of the elite Sith warlords — drenched in countless rituals.",
    classAffinity: "marauder",
    tiers: [
      { pieces: 2, description: "+8% physical damage",
        effect: { damageOfType: { physical: 0.08 } } },
      { pieces: 4, description: "Bleed lasts +2 turns; +5% lifesteal",
        effect: { lifesteal: 0.05 },
        effectId: "bloodforged_bleed_extend" },
      { pieces: 6, description: "Killing an enemy restores 20% HP and triggers Rage",
        effect: { strength: 5 },
        effectId: "bloodforged_killer_instinct" },
    ],
  },

  // ── Whisperveil (Assassin) ───────────────────────────────────────
  whisperveil: {
    id: "whisperveil",
    name: "Whisperveil",
    description: "Vestments of the shadow assassins of Dromund Kaas.",
    classAffinity: "assassin",
    tiers: [
      { pieces: 2, description: "+8% dodge chance",
        effect: { dodgeBonus: 0.08 } },
      { pieces: 4, description: "Critical hits ignore 25% armor",
        effect: { critBonus: 8 },
        effectId: "whisperveil_armor_pierce" },
      { pieces: 6, description: "First attack each combat is a guaranteed critical",
        effect: { agility: 6 },
        effectId: "whisperveil_first_strike" },
    ],
  },

  // ── Warbringer (tank / shock-trooper) ─────────────────────────────
  warbringer: {
    id: "warbringer",
    name: "Warbringer",
    description: "Siege-plate of the Sith shock-troopers — built to walk through a barrage.",
    classAffinity: "marauder",
    tiers: [
      { pieces: 2, description: "+60 max HP",
        effect: { hp: 60 } },
      { pieces: 4, description: "+6 Strength and 5% lifesteal",
        effect: { strength: 6, lifesteal: 0.05 },
        effectId: "warbringer_unbreakable" },
    ],
  },

  // ── Ancient Sith Lord (universal, very rare) ──────────────────────
  ancient_sith: {
    id: "ancient_sith",
    name: "Ancient Sith Lord",
    description: "Vestiges from before the Republic. The corruption is total.",
    tiers: [
      { pieces: 2, description: "+15 Force, +15 Corruption",
        effect: { force: 15, corruption: 15 } as AffixEffect },
      { pieces: 4, description: "All damage types boosted by 15%",
        effect: { damageMultiplier: 0.15 } },
      { pieces: 6, description: "Once per combat: cheat death with 1 HP",
        effect: { hp: 100 },
        effectId: "ancient_sith_cheat_death" },
    ],
  },
};

/** Localized set name/description/tier text for display, falling back to the source-language data. */
export function getItemSetDisplay(setId: string): { name: string; description: string; tiers: (SetTierBonus & { description: string })[] } | undefined {
  const def = ITEM_SETS[setId];
  if (!def) return undefined;
  const localized = useI18n.getState().t.content.itemSets as unknown as Record<
    string,
    { name: string; description: string; tiers: string[] }
  >;
  const entry = localized[setId];
  if (!entry) return { name: def.name, description: def.description, tiers: def.tiers };
  return {
    name: entry.name,
    description: entry.description,
    tiers: def.tiers.map((tier, i) => ({ ...tier, description: entry.tiers[i] ?? tier.description })),
  };
}

/** Calculate active set bonuses for an equipped loadout. */
export function getActiveSetBonuses(equippedSetIds: string[]): SetTierBonus[] {
  const counts: Record<string, number> = {};
  for (const sid of equippedSetIds) {
    if (!sid) continue;
    counts[sid] = (counts[sid] ?? 0) + 1;
  }
  const active: SetTierBonus[] = [];
  for (const [setId, count] of Object.entries(counts)) {
    const def = ITEM_SETS[setId];
    if (!def) continue;
    for (const tier of def.tiers) {
      if (count >= tier.pieces) active.push(tier);
    }
  }
  return active;
}
