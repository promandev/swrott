import type { ItemInput } from "../schemas/item";

/**
 * Saber crystals — socket into compatible weapons (acceptsCrystal=true).
 * Source: Ultimate Loot Bible §5 "Cristales y Personalización".
 */

export const CRYSTAL_ITEMS: ItemInput[] = [
  {
    id: "crystal_red_synthetic",
    name: "Red Synthetic Crystal",
    description: "Forged through pain and hate. +damage, blade glows blood-red.",
    rarity: "uncommon",
    value: 600,
    itemLevel: 5,
    bonuses: { strength: 2, critBonus: 3 },
    tags: ["crystal", "saber"],
  },
  {
    id: "crystal_red_bleeding",
    name: "Bleeding Red Crystal",
    description: "A cracked synthetic crystal. Strikes inflict deep bleeds.",
    rarity: "rare",
    value: 1800,
    itemLevel: 12,
    bonuses: { strength: 4, critBonus: 6 },
    onHitStatus: { effect: "bleed", chance: 0.30, duration: 3 },
    tags: ["crystal", "saber"],
  },
  {
    id: "crystal_purple_corrupted",
    name: "Corrupted Purple Crystal",
    description: "Once a Jedi's crystal, now warped by dark side meditation.",
    rarity: "rare",
    value: 2200,
    itemLevel: 14,
    bonuses: { force: 4, corruption: 2 },
    tags: ["crystal", "saber"],
  },
  {
    id: "crystal_black_void",
    name: "Black Void Crystal",
    description: "Light bends and dies near it. Strikes deal force damage that ignores armor.",
    rarity: "epic",
    value: 5500,
    itemLevel: 20,
    bonuses: { force: 6, critBonus: 8 },
    onHitEffectId: "void_crystal_armor_pierce",
    tags: ["crystal", "saber"],
  },
  {
    id: "crystal_ancient_sith",
    name: "Ancient Sith Crystal",
    description:
      "Mined before the Republic. Pulses with the screams of the dead. Burns the wielder slightly.",
    rarity: "legendary",
    value: 14000,
    itemLevel: 26,
    bonuses: { strength: 5, force: 5, critBonus: 12, corruption: 8 },
    onCritEffectId: "ancient_sith_crystal_burn",
    tags: ["crystal", "saber", "unique"],
  },
  {
    id: "crystal_lifedrinker",
    name: "Lifedrinker Crystal",
    description: "Found embedded in the heart of a Sith assassin. Strikes drink life.",
    rarity: "epic",
    value: 6500,
    itemLevel: 22,
    bonuses: { strength: 3, force: 3 },
    onHitEffectId: "lifedrinker_crystal_lifesteal",
    tags: ["crystal", "saber"],
  },
];
