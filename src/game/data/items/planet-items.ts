import type { ItemInput } from "../schemas/item";
import { ItemSchema } from "../schemas/item";
import type { Item } from "../schemas/item";

/**
 * Items for all planets beyond Korriban.
 * Organized by planet, scaling with level ranges.
 */

// ═══════════════════════════════════════════════════════════════════════
// DROMUND KAAS (Levels 8-12)
// ═══════════════════════════════════════════════════════════════════════

const DROMUND_KAAS_ITEMS: ItemInput[] = [
  // Weapons
  { id: "kaas_stormblade", name: "Kaas Stormblade", description: "A saber forged in the Citadel's lightning-fed furnaces. Static crawls along the blade.", rarity: "rare", slot: "main_hand", value: 650, levelReq: 8, weapon: { damage: 30, damageType: "energy", weaponType: "saber_single" }, bonuses: { strength: 2, force: 2 }, tags: ["weapon", "saber"] },
  { id: "imperial_vibropike", name: "Imperial Guard Vibropike", description: "Standard issue for the Citadel honor guard. Long reach, brutal edge.", rarity: "uncommon", slot: "main_hand", value: 420, levelReq: 8, weapon: { damage: 26, damageType: "physical", weaponType: "pike" }, bonuses: { strength: 3 }, tags: ["weapon", "melee"] },

  // Armor
  { id: "imperial_officer_coat", name: "Imperial Officer's Coat", description: "Rain-proof, blade-resistant, and unmistakably authoritative.", rarity: "rare", slot: "chest", value: 700, levelReq: 9, bonuses: { endurance: 3, influence: 2, armor: 55 }, tags: ["armor"] },
  { id: "kaas_shock_gauntlets", name: "Shock-Weave Gauntlets", description: "Gauntlets threaded with capacitor coils that bite back when you strike.", rarity: "uncommon", slot: "gloves", value: 380, levelReq: 8, bonuses: { strength: 2, critBonus: 3, armor: 20 }, tags: ["armor"] },
  { id: "stormwalker_boots", name: "Stormwalker Boots", description: "Insulated boots favored by jungle patrols. Grounded in every sense.", rarity: "uncommon", slot: "boots", value: 350, levelReq: 8, bonuses: { agility: 2, endurance: 1, armor: 25 }, tags: ["armor"] },

  // Accessories
  { id: "temple_ward_amulet", name: "Temple Ward Amulet", description: "A talisman carved from Dark Temple stone. The whispers pass around its bearer.", rarity: "rare", slot: "relic_a", value: 600, levelReq: 9, bonuses: { force: 3, endurance: 2 }, tags: ["accessory"] },
  { id: "stormcaller_relic", name: "Stormcaller Relic", description: "The bound relic of the Temple Sanctum. Thunder answers when it wakes.", rarity: "epic", slot: "relic_b", value: 1400, levelReq: 10, bonuses: { force: 4, critBonus: 5, armor: 10 }, tags: ["accessory"] },

  // Consumables
  { id: "kaas_field_ration", name: "Imperial Field Ration", description: "Dense, bitter, and restorative. Restores 150 HP and 20 Force.", rarity: "common", value: 60, stackable: true, maxStack: 20, tags: ["consumable", "heal"] },
];

// ═══════════════════════════════════════════════════════════════════════
// NAR SHADDAA (Levels 11-18)
// ═══════════════════════════════════════════════════════════════════════

const NAR_SHADDAA_ITEMS: ItemInput[] = [
  // Weapons
  { id: "exchange_blaster", name: "Exchange Blaster Pistol", description: "Modified heavy blaster favored by Exchange enforcers.", rarity: "uncommon", slot: "main_hand", value: 350, weapon: { damage: 28, damageType: "energy", weaponType: "sidearm" }, bonuses: { agility: 2 }, tags: ["weapon", "blaster"] },
  { id: "smuggler_vibroblade", name: "Smuggler's Vibroblade", description: "A concealed vibroblade for close encounters.", rarity: "uncommon", slot: "main_hand", value: 300, weapon: { damage: 25, damageType: "physical", weaponType: "vibrosword" }, bonuses: { agility: 1, critBonus: 3 }, tags: ["weapon", "melee"] },
  { id: "neon_saber", name: "Neon-Edge Saber", description: "A lightsaber with a modified crystal that pulses with neon light.", rarity: "rare", slot: "main_hand", value: 800, weapon: { damage: 35, damageType: "energy", weaponType: "saber_single" }, bonuses: { strength: 3, force: 2 }, tags: ["weapon", "saber"] },

  // Armor
  { id: "bounty_hunter_jacket", name: "Bounty Hunter Jacket", description: "Armored jacket with hidden weapon holsters.", rarity: "uncommon", slot: "chest", value: 500, bonuses: { agility: 2, endurance: 1, armor: 45 }, tags: ["armor"] },
  { id: "exchange_heavy_armor", name: "Exchange Heavy Armor", description: "Thick durasteel plating worn by Exchange heavies.", rarity: "rare", slot: "chest", value: 900, bonuses: { endurance: 4, armor: 65 }, tags: ["armor"] },

  // Accessories
  { id: "smuggler_ring", name: "Smuggler's Lucky Ring", description: "Said to bring fortune. At minimum, it helps you cheat at pazaak.", rarity: "uncommon", slot: "relic_a", value: 250, bonuses: { influence: 2, critBonus: 2 }, tags: ["accessory"] },
  { id: "credit_chip_implant", name: "Credit Chip Implant", description: "A subdermal implant that broadcasts Exchange authority.", rarity: "rare", slot: "implant_a", value: 600, bonuses: { influence: 3, endurance: 1 }, tags: ["accessory", "implant"] },

  // Consumables
  { id: "nar_shaddaa_stim", name: "Black Market Stim", description: "Illegal combat enhancer. +20% damage for 3 turns.", rarity: "uncommon", value: 150, stackable: true, maxStack: 10, tags: ["consumable", "stim"] },
  { id: "shaddaa_medpac", name: "Shaddaa Street Medpac", description: "Questionable quality but effective. Restores 200 HP.", rarity: "common", value: 80, stackable: true, maxStack: 20, tags: ["consumable", "heal"] },
];

// ═══════════════════════════════════════════════════════════════════════
// ONDERON / DXUN (Levels 15-28)
// ═══════════════════════════════════════════════════════════════════════

const ONDERON_DXUN_ITEMS: ItemInput[] = [
  // Weapons
  { id: "onderon_guard_blade", name: "Onderon Royal Guard Blade", description: "Standard issue for Iziz's elite guard.", rarity: "uncommon", slot: "main_hand", value: 600, weapon: { damage: 32, damageType: "physical", weaponType: "vibrosword" }, bonuses: { strength: 3 }, tags: ["weapon", "melee"] },
  { id: "mandalorian_heavy_blaster", name: "Mandalorian Heavy Blaster", description: "Powerful blaster used by Mandalorian warriors.", rarity: "rare", slot: "main_hand", value: 1200, weapon: { damage: 42, damageType: "energy", weaponType: "sidearm" }, bonuses: { agility: 4, strength: 2 }, tags: ["weapon", "blaster"] },
  { id: "dxun_beast_blade", name: "Drexl Bone Blade", description: "Carved from drexl bone. Unnaturally sharp.", rarity: "rare", slot: "main_hand", value: 1000, weapon: { damage: 38, damageType: "physical", weaponType: "vibrosword" }, bonuses: { strength: 4, critBonus: 5 }, tags: ["weapon", "melee"] },
  { id: "sith_tomb_saber", name: "Tomb Lord's Saber", description: "An ancient Sith lightsaber recovered from the Dxun tomb. Radiates malice.", rarity: "epic", slot: "main_hand", value: 2500, weapon: { damage: 50, damageType: "energy", weaponType: "saber_single" }, bonuses: { strength: 5, force: 4 }, tags: ["weapon", "saber"] },

  // Armor
  { id: "mandalorian_armor", name: "Mandalorian Battle Armor", description: "Forged from Mandalorian iron. Tested in countless battles.", rarity: "epic", slot: "chest", value: 2200, bonuses: { endurance: 5, strength: 3, armor: 85 }, tags: ["armor"] },
  { id: "beast_rider_leathers", name: "Beast Rider Leathers", description: "Flexible armor worn by Onderon's beast riders.", rarity: "uncommon", slot: "chest", value: 500, bonuses: { agility: 3, armor: 40 }, tags: ["armor"] },

  // Accessories
  { id: "mandalore_sigil", name: "Sigil of Mandalore", description: "A token of Mandalore's respect. Grants authority among the clans.", rarity: "epic", slot: "relic_a", value: 1800, bonuses: { strength: 4, endurance: 3 }, tags: ["accessory"] },

  // Consumables
  { id: "mando_combat_stim", name: "Mandalorian War Stim", description: "Military-grade combat enhancer. +15% all damage, +10 armor for 4 turns.", rarity: "rare", value: 300, stackable: true, maxStack: 10, tags: ["consumable", "stim"] },
];

// ═══════════════════════════════════════════════════════════════════════
// DANTOOINE (Levels 20-30)
// ═══════════════════════════════════════════════════════════════════════

const DANTOOINE_ITEMS: ItemInput[] = [
  // Weapons
  { id: "jedi_guardian_blade", name: "Guardian's Lightsaber", description: "A lightsaber from the fallen Jedi Enclave. The crystal glows with inner light.", rarity: "epic", slot: "main_hand", value: 3000, weapon: { damage: 55, damageType: "energy", weaponType: "saber_single" }, bonuses: { force: 6, strength: 3 }, tags: ["weapon", "saber"] },
  { id: "crystal_staff", name: "Crystal Staff", description: "A staff embedded with Dantooine crystals. Channels the Force.", rarity: "rare", slot: "main_hand", value: 1800, weapon: { damage: 40, damageType: "force", weaponType: "pike" }, bonuses: { force: 5 }, tags: ["weapon", "staff"] },

  // Armor
  { id: "jedi_robes_remnant", name: "Remnant Jedi Robes", description: "Robes from the destroyed Enclave. Still imbued with the light side.", rarity: "rare", slot: "chest", value: 1500, bonuses: { force: 4, endurance: 2, armor: 35 }, tags: ["armor"] },

  // Accessories
  { id: "dantooine_crystal", name: "Pure Crystal", description: "A perfectly formed lightsaber crystal from the Crystal Cave.", rarity: "epic", slot: "off_hand", value: 2000, bonuses: { force: 5, critBonus: 8 }, tags: ["accessory", "crystal"] },

  // Consumables
  { id: "dantooine_healing_herb", name: "Dantooine Healing Herb", description: "Natural remedy from the plains. Restores 500 HP.", rarity: "uncommon", value: 100, stackable: true, maxStack: 20, tags: ["consumable", "heal"] },
];

// ═══════════════════════════════════════════════════════════════════════
// TELOS (Levels 28-38)
// ═══════════════════════════════════════════════════════════════════════

const TELOS_ITEMS: ItemInput[] = [
  // Weapons
  { id: "czerka_prototype_rifle", name: "Czerka Prototype Rifle", description: "Experimental energy weapon. Unstable but devastating.", rarity: "epic", slot: "main_hand", value: 4000, weapon: { damage: 62, damageType: "energy", weaponType: "sidearm" }, bonuses: { agility: 5, critBonus: 8 }, tags: ["weapon", "blaster"] },
  { id: "rakata_blade", name: "Rakata Force Blade", description: "An ancient Rakata weapon that channels the Force through its edge.", rarity: "legendary", slot: "main_hand", value: 8000, weapon: { damage: 75, damageType: "force", weaponType: "saber_single" }, bonuses: { force: 8, strength: 5, critBonus: 10 }, tags: ["weapon", "saber"] },

  // Armor
  { id: "telos_shield_suit", name: "Telos Shield Suit", description: "Advanced personal shield integrated into armor plating.", rarity: "epic", slot: "chest", value: 5000, bonuses: { endurance: 6, force: 3, armor: 100 }, tags: ["armor"] },

  // Accessories
  { id: "rakata_mind_trap", name: "Rakata Mind Trap", description: "Ancient Rakata device. Enhances mental abilities at a cost.", rarity: "legendary", slot: "implant_a", value: 6000, bonuses: { force: 7 }, tags: ["accessory", "implant"] },

  // Consumables
  { id: "advanced_medpac_telos", name: "Advanced Kolto Medpac", description: "Top-grade kolto treatment. Restores 800 HP.", rarity: "rare", value: 300, stackable: true, maxStack: 15, tags: ["consumable", "heal"] },
];

// ═══════════════════════════════════════════════════════════════════════
// MALACHOR V (Levels 35-50)
// ═══════════════════════════════════════════════════════════════════════

const MALACHOR_ITEMS: ItemInput[] = [
  // Weapons
  { id: "sion_lightsaber", name: "Sion's Cracked Saber", description: "The lightsaber of the Lord of Pain. Broken but impossibly powerful.", rarity: "legendary", slot: "main_hand", value: 15000, weapon: { damage: 90, damageType: "energy", weaponType: "saber_single" }, bonuses: { strength: 10, endurance: 5 }, tags: ["weapon", "saber", "boss_loot"] },
  { id: "nihilus_mask_fragment", name: "Nihilus Mask Fragment", description: "A shard of the Lord of Hunger's mask. Whispers constantly.", rarity: "legendary", slot: "head", value: 12000, bonuses: { force: 12 }, tags: ["armor", "boss_loot"] },
  { id: "traya_saber", name: "Traya's Lightsaber", description: "One of three lightsabers wielded by Darth Traya through the Force alone.", rarity: "legendary", slot: "main_hand", value: 20000, weapon: { damage: 100, damageType: "energy", weaponType: "saber_single" }, bonuses: { force: 10, strength: 8, critBonus: 15 }, tags: ["weapon", "saber", "boss_loot"] },
  { id: "void_crystal", name: "Void Crystal", description: "A crystal formed from pure dark side energy. Absorbs light.", rarity: "legendary", slot: "off_hand", value: 10000, bonuses: { force: 10, critBonus: 12 }, tags: ["accessory", "crystal"] },

  // Armor
  { id: "trayus_robes", name: "Trayus Academy Robes", description: "Robes woven with dark side energy. Worn by the masters of the Trayus Academy.", rarity: "legendary", slot: "chest", value: 18000, bonuses: { force: 10, endurance: 5, armor: 60 }, tags: ["armor"] },
  { id: "storm_beast_hide", name: "Storm Beast Hide", description: "Armor made from a Malachor storm beast. Nearly indestructible.", rarity: "epic", slot: "chest", value: 8000, bonuses: { endurance: 8, strength: 4, armor: 120 }, tags: ["armor"] },

  // Consumables
  { id: "void_elixir_item", name: "Void Elixir", description: "A dark potion that temporarily grants immense power. Full HP + Force restore.", rarity: "legendary", value: 2000, stackable: true, maxStack: 3, tags: ["consumable", "heal"] },
];

// ═══════════════════════════════════════════════════════════════════════
// Combined exports
// ═══════════════════════════════════════════════════════════════════════

const ALL_PLANET_ITEMS_RAW: ItemInput[] = [
  ...DROMUND_KAAS_ITEMS,
  ...NAR_SHADDAA_ITEMS,
  ...ONDERON_DXUN_ITEMS,
  ...DANTOOINE_ITEMS,
  ...TELOS_ITEMS,
  ...MALACHOR_ITEMS,
];

/** Parsed items with defaults applied. */
export const PLANET_ITEM_MAP: Record<string, Item> = Object.fromEntries(
  ALL_PLANET_ITEMS_RAW.map((raw) => {
    const parsed = ItemSchema.parse(raw);
    return [parsed.id, parsed];
  }),
);
