import type { ItemInput } from "../schemas/item";

/**
 * Set armor pieces — wearing multiple pieces with the same setId triggers
 * tiered bonuses (see sets.ts).
 *
 * Sets in this file:
 *  - void_lord (Inquisitor)
 *  - bloodforged (Marauder)
 *  - whisperveil (Assassin)
 */

export const SET_ITEMS: ItemInput[] = [
  // ── Void Lord set (Inquisitor) ────────────────────────────────────
  {
    id: "set_voidlord_hood",
    name: "Voidweaver Hood",
    description: "Tattered hood of the Cult of Nihilus.",
    rarity: "epic", slot: "head", value: 3000, itemLevel: 18, levelReq: 16,
    setId: "void_lord",
    bonuses: { force: 4, forcePoints: 15, armor: 10 },
    tags: ["set", "void_lord"],
  },
  {
    id: "set_voidlord_gloves",
    name: "Voidweaver Gloves",
    description: "Gloves stitched with shadow-thread.",
    rarity: "epic", slot: "gloves", value: 2500, itemLevel: 18, levelReq: 16,
    setId: "void_lord",
    bonuses: { force: 3, critBonus: 4, armor: 6 },
    tags: ["set", "void_lord"],
  },
  {
    id: "set_voidlord_belt",
    name: "Voidweaver Sash",
    description: "Bound with knots that hum with dark energy.",
    rarity: "epic", slot: "belt", value: 2200, itemLevel: 18, levelReq: 16,
    setId: "void_lord",
    bonuses: { force: 3, forcePoints: 10 },
    tags: ["set", "void_lord"],
  },
  {
    id: "set_voidlord_boots",
    name: "Voidweaver Boots",
    description: "Soft-soled boots that make no sound.",
    rarity: "epic", slot: "boots", value: 2400, itemLevel: 18, levelReq: 16,
    setId: "void_lord",
    bonuses: { agility: 3, force: 2, armor: 8 },
    tags: ["set", "void_lord"],
  },

  // ── Bloodforged set (Marauder) ────────────────────────────────────
  {
    id: "set_bloodforged_chest",
    name: "Bloodforged Cuirass",
    description: "Etched with the names of fallen enemies.",
    rarity: "epic", slot: "chest", value: 3800, itemLevel: 19, levelReq: 17,
    setId: "bloodforged",
    bonuses: { strength: 5, endurance: 4, armor: 22, hp: 50 },
    tags: ["set", "bloodforged"],
  },
  {
    id: "set_bloodforged_gloves",
    name: "Bloodforged Gauntlets",
    description: "Heavy gauntlets, the knuckles bone-spiked.",
    rarity: "epic", slot: "gloves", value: 2800, itemLevel: 19, levelReq: 17,
    setId: "bloodforged",
    bonuses: { strength: 4, critBonus: 5, armor: 12 },
    tags: ["set", "bloodforged"],
  },
  {
    id: "set_bloodforged_belt",
    name: "Bloodforged Cinch",
    description: "A heavy iron belt with rings for trophies.",
    rarity: "epic", slot: "belt", value: 2500, itemLevel: 19, levelReq: 17,
    setId: "bloodforged",
    bonuses: { strength: 3, hp: 40, armor: 8 },
    tags: ["set", "bloodforged"],
  },
  {
    id: "set_bloodforged_boots",
    name: "Bloodforged Sabatons",
    description: "Crushing weight. The wearer leaves footprints in stone.",
    rarity: "epic", slot: "boots", value: 2700, itemLevel: 19, levelReq: 17,
    setId: "bloodforged",
    bonuses: { strength: 2, endurance: 3, armor: 14 },
    tags: ["set", "bloodforged"],
  },

  // ── Whisperveil set (Assassin) ────────────────────────────────────
  {
    id: "set_whisperveil_chest",
    name: "Whisperveil Vest",
    description: "Cut to allow silent movement. Padded with shadow-silk.",
    rarity: "epic", slot: "chest", value: 3400, itemLevel: 18, levelReq: 16,
    setId: "whisperveil",
    bonuses: { agility: 6, critBonus: 4, armor: 14 },
    tags: ["set", "whisperveil"],
  },
  {
    id: "set_whisperveil_gloves",
    name: "Whisperveil Wraps",
    description: "Hand wraps soaked in numbing oils.",
    rarity: "epic", slot: "gloves", value: 2300, itemLevel: 18, levelReq: 16,
    setId: "whisperveil",
    bonuses: { agility: 4, critBonus: 6 },
    tags: ["set", "whisperveil"],
  },
  {
    id: "set_whisperveil_belt",
    name: "Whisperveil Cord",
    description: "A slender cord hiding a garrote.",
    rarity: "epic", slot: "belt", value: 2100, itemLevel: 18, levelReq: 16,
    setId: "whisperveil",
    bonuses: { agility: 3, critBonus: 3 },
    tags: ["set", "whisperveil"],
  },
  {
    id: "set_whisperveil_boots",
    name: "Whisperveil Slippers",
    description: "Soft-soled, oiled, silent on any surface.",
    rarity: "epic", slot: "boots", value: 2200, itemLevel: 18, levelReq: 16,
    setId: "whisperveil",
    bonuses: { agility: 5, armor: 6 },
    tags: ["set", "whisperveil"],
  },
];
