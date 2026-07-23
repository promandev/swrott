import type { Item } from "../../data/schemas/item";
import type { ClassId, Slot } from "../../data/schemas";
import type { CharacterSnapshot } from "../save/types";
import type { RNG } from "../rng/rng";
import { getAllItems } from "../../data/items/item-registry";

/**
 * Smart-loot weighting.
 *
 * Rather than rolling drops from a flat table, this weights item candidates
 * by:
 *   - Class affinity (class-restricted items skew toward player's class)
 *   - Item level vs player level (penalize very over/under-leveled items)
 *   - Slot need (player has empty / weaker item in slot)
 *   - Rarity curve (per-encounter cap)
 *
 * Used by encounter loot rolls to upgrade dumb tables into a "feels-good" drop
 * stream.
 */

interface LootContext {
  character: CharacterSnapshot;
  rng: RNG;
  /** Rarity baseline for this drop (common…ancient_sith). */
  baseRarity?: Item["rarity"];
  /** Minimum item level filter. */
  minLevel?: number;
  /** Maximum item level filter. */
  maxLevel?: number;
  /** Restrict to a particular slot, if needed. */
  slotFilter?: Slot;
}

const RARITY_ORDER: Item["rarity"][] = [
  "common", "uncommon", "rare", "epic", "legendary", "mythic", "ancient_sith",
];

function rarityScore(r: Item["rarity"]): number {
  return RARITY_ORDER.indexOf(r);
}

function classWeight(item: Item, classId: ClassId): number {
  if (!item.classRestriction) return 1;          // universal
  if (item.classRestriction === classId) return 3;
  return 0;                                       // hard filter — wrong class
}

function levelWeight(item: Item, playerLevel: number): number {
  const diff = Math.abs(item.itemLevel - playerLevel);
  if (diff <= 2) return 1.0;
  if (diff <= 5) return 0.6;
  if (diff <= 8) return 0.3;
  return 0.05;
}

function slotNeedWeight(item: Item, character: CharacterSnapshot): number {
  if (!item.slot) return 1;
  const currentInstance = character.equipment[item.slot];
  if (!currentInstance) return 2.5;     // empty slot — strong preference
  // Heuristic: items with higher value are likely upgrades
  return 1.2;
}

function rarityCurveWeight(item: Item, baseRarity: Item["rarity"]): number {
  const base = rarityScore(baseRarity);
  const cur  = rarityScore(item.rarity);
  if (cur === base)      return 1.0;
  if (cur === base + 1)  return 0.30;  // chance to upgrade
  if (cur === base + 2)  return 0.05;  // rare upgrade two tiers
  if (cur < base)        return 0.40;  // downgrade fallback
  return 0;
}

/**
 * Choose a single item id from the global registry weighted by context.
 * Returns null if no candidates pass filters.
 */
export function pickSmartLootItem(ctx: LootContext): string | null {
  const baseRarity = ctx.baseRarity ?? "common";
  const candidates: Array<{ id: string; weight: number }> = [];

  for (const item of getAllItems()) {
    if (item.tags.includes("quest")) continue;
    if (ctx.slotFilter && item.slot !== ctx.slotFilter) continue;
    if (ctx.minLevel && item.itemLevel < ctx.minLevel) continue;
    if (ctx.maxLevel && item.itemLevel > ctx.maxLevel) continue;

    const wClass  = classWeight(item, ctx.character.classId);
    if (wClass === 0) continue;

    const wLevel  = levelWeight(item, ctx.character.level);
    const wSlot   = slotNeedWeight(item, ctx.character);
    const wRarity = rarityCurveWeight(item, baseRarity);

    const weight = wClass * wLevel * wSlot * wRarity;
    if (weight <= 0) continue;
    candidates.push({ id: item.id, weight });
  }

  if (candidates.length === 0) return null;
  const total = candidates.reduce((acc, c) => acc + c.weight, 0);
  let roll = ctx.rng.float(0, total);
  for (const c of candidates) {
    roll -= c.weight;
    if (roll <= 0) return c.id;
  }
  return candidates[candidates.length - 1]?.id ?? null;
}
