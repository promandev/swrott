/**
 * Mass disenchant / salvage (Complementary Loop 1 / Idea CL1-E).
 *
 * Convert unwanted items into shards / crystals based on rarity. The
 * salvage table is conservative — to make rare materials feel rare.
 */

import type { Item } from "../../data/schemas/item";

export interface SalvageYield {
  credits: number;
  /** Crafting shards by rarity. */
  shards: { tier: "rough" | "polished" | "perfect" | "voidforged"; count: number }[];
  /** Special drops only from rarer items. */
  darkTokens: number;
  corruptedShards: number;
  ancientTokens: number;
}

export function salvageItem(rarity: Item["rarity"]): SalvageYield {
  switch (rarity) {
    case "common":       return { credits: 5,   shards: [{ tier: "rough",      count: 1 }], darkTokens: 0, corruptedShards: 0, ancientTokens: 0 };
    case "uncommon":     return { credits: 15,  shards: [{ tier: "rough",      count: 3 }], darkTokens: 0, corruptedShards: 0, ancientTokens: 0 };
    case "rare":         return { credits: 50,  shards: [{ tier: "polished",   count: 1 }], darkTokens: 0, corruptedShards: 0, ancientTokens: 0 };
    case "epic":         return { credits: 200, shards: [{ tier: "polished",   count: 3 }], darkTokens: 1, corruptedShards: 0, ancientTokens: 0 };
    case "legendary":    return { credits: 750, shards: [{ tier: "perfect",    count: 1 }], darkTokens: 2, corruptedShards: 1, ancientTokens: 0 };
    case "mythic":       return { credits: 2500,shards: [{ tier: "perfect",    count: 3 }], darkTokens: 5, corruptedShards: 3, ancientTokens: 0 };
    case "ancient_sith": return { credits: 8000,shards: [{ tier: "voidforged", count: 1 }], darkTokens: 10, corruptedShards: 5, ancientTokens: 1 };
  }
}

/** Salvage a batch and aggregate the yields. */
export function massSalvage(items: ReadonlyArray<{ rarity: Item["rarity"]; qty: number }>): SalvageYield {
  const out: SalvageYield = { credits: 0, shards: [], darkTokens: 0, corruptedShards: 0, ancientTokens: 0 };
  const shardAcc = new Map<SalvageYield["shards"][number]["tier"], number>();
  for (const it of items) {
    const y = salvageItem(it.rarity);
    out.credits += y.credits * it.qty;
    out.darkTokens += y.darkTokens * it.qty;
    out.corruptedShards += y.corruptedShards * it.qty;
    out.ancientTokens += y.ancientTokens * it.qty;
    for (const s of y.shards) shardAcc.set(s.tier, (shardAcc.get(s.tier) ?? 0) + s.count * it.qty);
  }
  for (const [tier, count] of shardAcc) out.shards.push({ tier, count });
  return out;
}
