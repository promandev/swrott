import type { Item } from "../../data/schemas/item";
import type { CharacterSnapshot, ItemInstanceState } from "../save/types";

/**
 * Item Identification (Loot Bible §13).
 *
 * Legendary, mythic and ancient_sith items drop UNIDENTIFIED. Until
 * identified the player sees only:
 *   - obscured name ("Hungry Whispering Saber")
 *   - rarity color
 *   - base weapon type / slot
 * Affixes, set membership, on-X effects are hidden.
 *
 * Identify methods:
 *   1) Spend an Identify Scroll (item: scroll_identify, 500 cr) — free of cost
 *   2) Sacrifice HP at a Sith altar — instant, hp_cost = item.itemLevel * 3
 *   3) Spend Dark Tokens — 1 token per item-level
 */

export function shouldDropUnidentified(item: Item): boolean {
  return ["legendary", "mythic", "ancient_sith"].includes(item.rarity);
}

/** Returns the masked display name shown for unidentified items. */
export function maskedName(item: Item): string {
  const prefixes = ["Hungry", "Whispering", "Cold", "Burning", "Black", "Forgotten"];
  const idx = (hashString(item.id) % prefixes.length + prefixes.length) % prefixes.length;
  const slotWord = item.slot ?? "Relic";
  const base = item.weapon ? "Saber" : titleCase(slotWord);
  return `${prefixes[idx]} ${base}`;
}

export function isIdentified(state: ItemInstanceState | undefined): boolean {
  return state?.identified ?? false;
}

export interface IdentifyCosts {
  scrollCost: number;        // credits if buying a scroll
  hpCost: number;            // HP sacrificed at altar
  darkTokenCost: number;     // dark tokens
  corruptionGain: number;    // corruption gained from altar method
}

export function identifyCosts(item: Item): IdentifyCosts {
  const lvl = item.itemLevel;
  return {
    scrollCost: 500,
    hpCost: lvl * 3,
    darkTokenCost: lvl,
    corruptionGain: ["mythic", "ancient_sith"].includes(item.rarity) ? 3 : 1,
  };
}

/**
 * Apply altar identification — mutates character snapshot. Returns true on
 * success.
 */
export function identifyAtAltar(
  character: CharacterSnapshot,
  instanceId: string,
  item: Item,
): { success: boolean; reason?: string } {
  const cost = identifyCosts(item);
  if (character.hp <= cost.hpCost) {
    return { success: false, reason: "Not enough HP to survive the ritual." };
  }
  const inst = character.itemInstances[instanceId];
  if (!inst) return { success: false, reason: "Item instance not found." };
  if (inst.identified) return { success: false, reason: "Already identified." };

  character.hp -= cost.hpCost;
  character.primary.corruption = Math.min(100, character.primary.corruption + cost.corruptionGain);
  inst.identified = true;
  return { success: true };
}

// ── helpers ──────────────────────────────────────────────────────────

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function titleCase(s: string): string {
  return s.split("_").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}
