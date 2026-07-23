/**
 * New Game Plus (Idea #13).
 *
 * Completing the main story unlocks NG+. The player keeps everything but
 * restarts the campaign in zone "korriban_academy_exterior". Enemies scale:
 *
 *   each NG+ tier:
 *     enemy HP    ×1.5^tier
 *     enemy dmg   ×1.3^tier
 *     enemy armor ×1.2^tier
 *     loot rarity floor shifts upward (common → uncommon at NG+1, etc.)
 *     mythic / ancient_sith drop rates ×1.5^tier
 *
 * Hard cap: NG+5.
 */

import type { EnemyTemplate } from "../combat/enemies";
import type { Item } from "../../data/schemas/item";

export const NG_PLUS_MAX = 5;

export interface NgPlusScaling {
  hpMult: number;
  dmgMult: number;
  armorMult: number;
  rarityFloorIndex: number;
  rareDropMult: number;
}

export function scalingForTier(tier: number): NgPlusScaling {
  const t = Math.max(0, Math.min(NG_PLUS_MAX, tier));
  return {
    hpMult: Math.pow(1.5, t),
    dmgMult: Math.pow(1.3, t),
    armorMult: Math.pow(1.2, t),
    rarityFloorIndex: t,
    rareDropMult: Math.pow(1.5, t),
  };
}

/** Apply NG+ scaling to an enemy template. Returns a NEW object. */
export function scaleEnemyTemplate(template: EnemyTemplate, tier: number): EnemyTemplate {
  const s = scalingForTier(tier);
  return {
    ...template,
    baseHp: Math.floor(template.baseHp * s.hpMult),
    armor: Math.floor(template.armor * s.armorMult),
    primary: {
      ...template.primary,
      strength: Math.floor(template.primary.strength * s.dmgMult),
      force: Math.floor(template.primary.force * s.dmgMult),
    },
    xpReward: Math.floor(template.xpReward * (1 + tier * 0.5)),
    creditReward: [
      Math.floor(template.creditReward[0] * (1 + tier * 0.6)),
      Math.floor(template.creditReward[1] * (1 + tier * 0.6)),
    ] as [number, number],
  };
}

const RARITY_ORDER: Item["rarity"][] = [
  "common", "uncommon", "rare", "epic", "legendary", "mythic", "ancient_sith",
];

/**
 * Pick the floor rarity for a NG+ tier. Used by loot rolls — anything below
 * floor gets upgraded to floor.
 */
export function rarityFloor(tier: number): Item["rarity"] {
  const idx = Math.min(RARITY_ORDER.length - 1, Math.max(0, Math.min(NG_PLUS_MAX, tier)));
  return RARITY_ORDER[idx] ?? "common";
}
