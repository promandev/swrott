/**
 * Affix reroll altar (Complementary Loop 1 / Idea CL1-B).
 *
 * At the Sacrifice Altar (or any equivalent), the player may reroll
 * affixes on an item. Costs scale with rarity and number of locked
 * affixes. Allows partial locking (lock 1-N affixes; the rest are
 * rerolled). Each reroll grants +1 corruption.
 *
 *   common      free first reroll, then 100 cr
 *   uncommon    250 cr
 *   rare        750 cr
 *   epic        2,000 cr + 1 dark token
 *   legendary   5,000 cr + 3 dark tokens
 *   mythic      10,000 cr + 5 dark tokens + 1 corrupted shard
 *   ancient_sith  altar-only; 1 ancient token + 5 corrupted shards
 *
 * Each locked affix doubles the cost (locks compound).
 */

import type { Item } from "../../data/schemas/item";

export interface RerollCost {
  credits: number;
  darkTokens: number;
  corruptedShards: number;
  ancientTokens: number;
}

const BASE_COSTS: Record<Item["rarity"], RerollCost> = {
  common:       { credits:   100, darkTokens: 0, corruptedShards: 0, ancientTokens: 0 },
  uncommon:     { credits:   250, darkTokens: 0, corruptedShards: 0, ancientTokens: 0 },
  rare:         { credits:   750, darkTokens: 0, corruptedShards: 0, ancientTokens: 0 },
  epic:         { credits: 2000,  darkTokens: 1, corruptedShards: 0, ancientTokens: 0 },
  legendary:    { credits: 5000,  darkTokens: 3, corruptedShards: 0, ancientTokens: 0 },
  mythic:       { credits: 10000, darkTokens: 5, corruptedShards: 1, ancientTokens: 0 },
  ancient_sith: { credits:     0, darkTokens: 0, corruptedShards: 5, ancientTokens: 1 },
};

export function rerollCost(rarity: Item["rarity"], lockedAffixCount: number): RerollCost {
  const base = BASE_COSTS[rarity];
  const factor = Math.pow(2, Math.max(0, lockedAffixCount));
  return {
    credits: Math.floor(base.credits * factor),
    darkTokens: base.darkTokens * factor,
    corruptedShards: base.corruptedShards * factor,
    ancientTokens: base.ancientTokens * factor,
  };
}

export function corruptionCostForReroll(rarity: Item["rarity"]): number {
  switch (rarity) {
    case "common":       return 0;
    case "uncommon":     return 0;
    case "rare":         return 1;
    case "epic":         return 2;
    case "legendary":    return 3;
    case "mythic":       return 5;
    case "ancient_sith": return 7;
  }
}
