import type { ItemInput } from "../schemas/item";

/**
 * Warbringer Arsenal — a content pack of war-forged gear spanning the early-to
 * mid game, bridging the gap between Korriban starter loot and the high-end
 * legendaries. Weapons here lean on the now-live `onHitStatus` proc (a saber
 * that bleeds, a pike that shocks). All `bonuses` feed combat through
 * summarizeGear; the Warbringer set pieces carry strong standalone stats.
 */

export const WARBRINGER_ITEMS: ItemInput[] = [
  // ── Weapons (on-hit status is now applied in combat) ────────────────
  {
    id: "wb_serration_blade",
    name: "Serration Blade",
    description: "A vibrosword milled with reverse teeth — wounds it opens refuse to close.",
    rarity: "rare", slot: "main_hand", value: 1400, itemLevel: 6, levelReq: 5,
    weapon: { damage: 18, damageType: "physical", weaponType: "vibrosword", acceptsCrystal: false },
    bonuses: { strength: 2, critBonus: 3 },
    onHitStatus: { effect: "bleed", chance: 0.4, duration: 3 },
    tags: ["weapon", "vibrosword"],
  },
  {
    id: "wb_venom_sidearm",
    name: "Venomtongue Sidearm",
    description: "A hold-out blaster loaded with neurotoxin slugs. Favoured by guild assassins.",
    rarity: "rare", slot: "main_hand", value: 1600, itemLevel: 7, levelReq: 6,
    weapon: { damage: 16, damageType: "energy", weaponType: "sidearm", acceptsCrystal: false },
    bonuses: { agility: 3 },
    onHitStatus: { effect: "poison", chance: 0.5, duration: 3 },
    tags: ["weapon", "sidearm"],
  },
  {
    id: "wb_ember_scourge",
    name: "Ember Scourge",
    description: "A curved saber whose plasma weeps molten droplets that cling and burn.",
    rarity: "epic", slot: "main_hand", value: 4800, itemLevel: 12, levelReq: 11,
    weapon: { damage: 28, damageType: "fire", weaponType: "curved_saber", acceptsCrystal: true },
    bonuses: { strength: 4, critBonus: 4 },
    onHitStatus: { effect: "burn", chance: 0.4, duration: 3 },
    tags: ["weapon", "saber"],
  },
  {
    id: "wb_tempest_pike",
    name: "Tempest Pike",
    description: "A war-pike crowned with an arc-emitter. Each strike earths a storm through armor.",
    rarity: "epic", slot: "main_hand", value: 5200, itemLevel: 14, levelReq: 13,
    weapon: { damage: 30, damageType: "shock", weaponType: "pike", acceptsCrystal: true },
    bonuses: { force: 4, agility: 2 },
    onHitStatus: { effect: "shock", chance: 0.45, duration: 2 },
    tags: ["weapon", "pike"],
  },
  {
    id: "wb_dread_saber",
    name: "Saber of Dread",
    description: "Tempered in a terror-ritual; the blade hums at a pitch that unmakes courage.",
    rarity: "legendary", slot: "main_hand", value: 9000, itemLevel: 16, levelReq: 15,
    weapon: { damage: 34, damageType: "force", weaponType: "saber_single", acceptsCrystal: true },
    bonuses: { force: 5, strength: 3, critBonus: 5 },
    onHitStatus: { effect: "fear", chance: 0.25, duration: 2 },
    tags: ["unique", "saber"],
  },

  // ── Accessories (relics / implants — bonuses feed summarizeGear) ─────
  {
    id: "wb_relic_warcore",
    name: "Warpulse Core",
    description: "A salvaged droid reactor that overclocks the wielder's Force conduits.",
    rarity: "epic", slot: "relic_a", value: 4200, itemLevel: 13, levelReq: 12,
    bonuses: { force: 5, forcePoints: 25, critBonus: 4 },
    tags: ["accessory", "relic"],
  },
  {
    id: "wb_relic_bulwark",
    name: "Bulwark Talisman",
    description: "An ancient ward-stone that thickens the skin against any blow.",
    rarity: "epic", slot: "relic_b", value: 4000, itemLevel: 13, levelReq: 12,
    bonuses: { endurance: 4, hp: 60, armor: 18 },
    tags: ["accessory", "relic"],
  },
  {
    id: "wb_implant_reflex",
    name: "Reflex Accelerant Implant",
    description: "A spinal implant that shaves milliseconds off every parry and lunge.",
    rarity: "rare", slot: "implant_a", value: 2200, itemLevel: 10, levelReq: 9,
    bonuses: { agility: 4, critBonus: 3 },
    tags: ["accessory", "implant"],
  },
  {
    id: "wb_implant_furnace",
    name: "Adrenal Furnace Implant",
    description: "Floods the muscles with combat stimulants on demand. The body pays later.",
    rarity: "rare", slot: "implant_b", value: 2300, itemLevel: 10, levelReq: 9,
    bonuses: { strength: 4, hp: 40 },
    tags: ["accessory", "implant"],
  },

  // ── Warbringer set (tank) — strong standalone bonuses, setId "warbringer" ──
  {
    id: "wb_set_helm",
    name: "Warbringer Helm",
    description: "A faceless war-helm of beskar-weave. The mark of a Sith shock-trooper.",
    rarity: "epic", slot: "head", value: 3000, itemLevel: 15, levelReq: 13,
    setId: "warbringer",
    bonuses: { endurance: 4, armor: 16, hp: 40 },
    tags: ["set", "warbringer", "armor"],
  },
  {
    id: "wb_set_chest",
    name: "Warbringer Cuirass",
    description: "Layered plate built to walk a wearer through a barrage unbroken.",
    rarity: "epic", slot: "chest", value: 4200, itemLevel: 15, levelReq: 13,
    setId: "warbringer",
    bonuses: { strength: 4, endurance: 5, armor: 26, hp: 70 },
    tags: ["set", "warbringer", "armor"],
  },
  {
    id: "wb_set_gauntlets",
    name: "Warbringer Gauntlets",
    description: "Crushing gauntlets with reinforced knuckle-plate.",
    rarity: "epic", slot: "gloves", value: 2600, itemLevel: 15, levelReq: 13,
    setId: "warbringer",
    bonuses: { strength: 4, armor: 12, critBonus: 3 },
    tags: ["set", "warbringer", "armor"],
  },
  {
    id: "wb_set_greaves",
    name: "Warbringer Greaves",
    description: "Heavy boots that anchor the wearer like a siege-piling.",
    rarity: "epic", slot: "boots", value: 2700, itemLevel: 15, levelReq: 13,
    setId: "warbringer",
    bonuses: { endurance: 3, armor: 14, hp: 30 },
    tags: ["set", "warbringer", "armor"],
  },

  // ── Consumables (work in combat via the Items popover + out of combat) ──
  {
    id: "medpac_warfront",
    name: "Warfront Medpac",
    description: "Standard battlefield trauma kit. Seals wounds fast and ugly.",
    rarity: "uncommon", value: 120, itemLevel: 8, levelReq: 1,
    stackable: true, maxStack: 20,
    tags: ["consumable", "healing"],
  },
  {
    id: "medpac_advanced_warfront",
    name: "Advanced Warfront Medpac",
    description: "Military-grade kolto with a bacta booster. Pulls you back from the brink.",
    rarity: "rare", value: 320, itemLevel: 14, levelReq: 1,
    stackable: true, maxStack: 20,
    tags: ["consumable", "healing"],
  },
  {
    id: "force_stim_potent",
    name: "Potent Force Stim",
    description: "A concentrated tisarian spice draught that floods the body with the Force.",
    rarity: "rare", value: 280, itemLevel: 12, levelReq: 1,
    stackable: true, maxStack: 20,
    tags: ["consumable", "force"],
  },
  {
    id: "combat_adrenal_surge",
    name: "Adrenal Surge",
    description: "A battle stim that triggers a berserk rage — used mid-fight for a burst of fury.",
    rarity: "uncommon", value: 160, itemLevel: 10, levelReq: 1,
    stackable: true, maxStack: 10,
    tags: ["consumable", "combat"],
  },
  {
    id: "antidote_kit",
    name: "Antidote Kit",
    description: "Field antitoxins that purge poison from the bloodstream.",
    rarity: "common", value: 60, itemLevel: 4, levelReq: 1,
    stackable: true, maxStack: 10,
    tags: ["consumable"],
  },

  // ── Tomb-relic accessories (higher tier; flow into Drayven's stock) ──
  {
    id: "wb_relic_stormheart",
    name: "Stormheart Shard",
    description: "A crystallised lightning-bolt torn from a Dromund Kaas storm. It hums against the palm.",
    rarity: "legendary", slot: "relic_a", value: 8800, itemLevel: 18, levelReq: 17,
    bonuses: { force: 7, agility: 4, critBonus: 6, forcePoints: 20 },
    tags: ["accessory", "relic"],
  },
  {
    id: "wb_relic_unbroken",
    name: "Oath of the Unbroken",
    description: "A war-vow sealed in beskar. Its bearer does not fall while others still stand.",
    rarity: "legendary", slot: "relic_b", value: 8600, itemLevel: 18, levelReq: 17,
    bonuses: { endurance: 6, strength: 4, hp: 120, armor: 24 },
    tags: ["accessory", "relic"],
  },
  {
    id: "wb_implant_predator",
    name: "Predator Optics Implant",
    description: "Targeting optics scavenged from a Mandalorian visor. Nothing escapes the wearer's aim.",
    rarity: "epic", slot: "implant_a", value: 5200, itemLevel: 16, levelReq: 15,
    bonuses: { agility: 6, critBonus: 7 },
    tags: ["accessory", "implant"],
  },

  // ── Lore fragments (quest reward materials — were referenced but never
  //    defined, leaving those quests handing out phantom items) ──────────
  {
    id: "ancient_shard",
    name: "Ancient Sith Shard",
    description: "A splinter of a shattered holocron, humming with pre-Republic malice.",
    rarity: "rare", value: 400, itemLevel: 10, levelReq: 1,
    stackable: true, maxStack: 50, tags: ["material", "lore"],
  },
  {
    id: "corrupted_shard",
    name: "Corrupted Shard",
    description: "A holocron fragment warped by the dark side until its lessons turned to screaming.",
    rarity: "epic", value: 800, itemLevel: 14, levelReq: 1,
    stackable: true, maxStack: 50, tags: ["material", "lore"],
  },
  {
    id: "dark_holocron_fragment",
    name: "Dark Holocron Fragment",
    description: "Part of a Sith holocron. Assemble enough and the dead may yet teach you what they died refusing to forget.",
    rarity: "epic", value: 900, itemLevel: 16, levelReq: 1,
    stackable: true, maxStack: 50, tags: ["material", "lore"],
  },
];
