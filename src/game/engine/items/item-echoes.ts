/**
 * Item Echoes (Idea #10).
 *
 * Killing certain enemies while a particular legendary item is equipped
 * accrues "echoes" to that item instance. Each echo grants a small permanent
 * boost to the item's bonuses, up to 10 stacks.
 *
 * Bonus per stack depends on the slot:
 *   weapon:   +1% damage
 *   chest:    +1% armor
 *   relic:    +1 force OR +1 to primary corruption
 *   head:     +0.5% crit chance
 *
 * Only legendary, mythic and ancient_sith items can accrue echoes.
 */

import type { Item } from "../../data/schemas/item";

const ECHO_ELIGIBLE_RARITIES = new Set<Item["rarity"]>(["legendary", "mythic", "ancient_sith"]);

export function isEchoEligible(item: Item): boolean {
  return ECHO_ELIGIBLE_RARITIES.has(item.rarity);
}

export interface EchoBonus {
  damageMult?: number;
  armorMult?: number;
  forceBonus?: number;
  critBonus?: number;
}

/** Compute the cumulative bonus from echoStacks for a given item. */
export function echoBonusFor(item: Item, echoStacks: number): EchoBonus {
  if (!isEchoEligible(item) || echoStacks <= 0) return {};
  const stacks = Math.min(10, echoStacks);
  if (item.weapon)              return { damageMult: stacks * 0.01 };
  if (item.slot === "chest")    return { armorMult:  stacks * 0.01 };
  if (item.slot === "head")     return { critBonus:  stacks * 0.005 };
  if (item.slot?.startsWith("relic")) return { forceBonus: stacks };
  return { damageMult: stacks * 0.005 };
}

/** Should this kill grant an echo to this item? Hard cap and rarity filter. */
export function shouldAccrueEcho(item: Item, currentEchoes: number, killWasMiniboss: boolean): boolean {
  if (!isEchoEligible(item)) return false;
  if (currentEchoes >= 10) return false;
  // Minibosses always grant; trash mobs grant only 10% chance
  return killWasMiniboss ? true : Math.random() < 0.10;
}
