import type { RNG } from "../rng/rng";

/**
 * Loot table system — §10 "Tablas de Loot".
 *
 * Supports weighted random drops with guaranteed and chance-based entries.
 */

export interface LootEntry {
  itemId: string;
  weight: number;
  /** Min quantity. */
  minQty: number;
  /** Max quantity. */
  maxQty: number;
  /** Drop chance (0-1). Applied after weight selection. 1 = guaranteed if selected. */
  chance: number;
}

export interface LootTable {
  id: string;
  /** Guaranteed drops — always included. */
  guaranteed: Array<{ itemId: string; minQty: number; maxQty: number }>;
  /** Number of random rolls. */
  rolls: number;
  /** Pool of weighted entries. */
  pool: LootEntry[];
}

export interface LootDrop {
  itemId: string;
  qty: number;
}

/** Roll a loot table and return the resulting drops. */
export function rollLootTable(table: LootTable, rng: RNG): LootDrop[] {
  const drops: LootDrop[] = [];

  // Guaranteed drops
  for (const g of table.guaranteed) {
    drops.push({
      itemId: g.itemId,
      qty: rng.int(g.minQty, g.maxQty),
    });
  }

  // Random rolls
  const totalWeight = table.pool.reduce((sum, e) => sum + e.weight, 0);
  if (totalWeight <= 0) return drops;

  for (let r = 0; r < table.rolls; r++) {
    let roll = rng.float(0, totalWeight);
    for (const entry of table.pool) {
      roll -= entry.weight;
      if (roll <= 0) {
        if (rng.chance(entry.chance)) {
          const existing = drops.find((d) => d.itemId === entry.itemId);
          const qty = rng.int(entry.minQty, entry.maxQty);
          if (existing) {
            existing.qty += qty;
          } else {
            drops.push({ itemId: entry.itemId, qty });
          }
        }
        break;
      }
    }
  }

  return drops;
}

// ═══════════════════════════════════════════════════════════════════════
// Korriban Loot Tables
// ═══════════════════════════════════════════════════════════════════════

export const LOOT_TABLES: Record<string, LootTable> = {
  loot_acolyte: {
    id: "loot_acolyte",
    guaranteed: [],
    rolls: 2,
    pool: [
      { itemId: "medpack_basic", weight: 30, minQty: 1, maxQty: 1, chance: 0.5 },
      { itemId: "mat_scrap_metal", weight: 40, minQty: 1, maxQty: 3, chance: 0.7 },
      { itemId: "training_saber", weight: 15, minQty: 1, maxQty: 1, chance: 0.2 },
      { itemId: "acolyte_blade", weight: 8, minQty: 1, maxQty: 1, chance: 0.1 },
      { itemId: "iron_gauntlets", weight: 7, minQty: 1, maxQty: 1, chance: 0.15 },
    ],
  },

  loot_beast: {
    id: "loot_beast",
    guaranteed: [],
    rolls: 1,
    pool: [
      { itemId: "mat_scrap_metal", weight: 20, minQty: 1, maxQty: 2, chance: 0.4 },
      { itemId: "medpack_basic", weight: 40, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "antidote", weight: 25, minQty: 1, maxQty: 1, chance: 0.25 },
      { itemId: "mat_crystal_shard", weight: 15, minQty: 1, maxQty: 1, chance: 0.05 },
    ],
  },

  loot_droid: {
    id: "loot_droid",
    guaranteed: [
      { itemId: "mat_scrap_metal", minQty: 2, maxQty: 5 },
    ],
    rolls: 2,
    pool: [
      { itemId: "mat_scrap_metal", weight: 30, minQty: 1, maxQty: 3, chance: 0.6 },
      { itemId: "implant_reflex_chip", weight: 5, minQty: 1, maxQty: 1, chance: 0.05 },
      { itemId: "medpack_advanced", weight: 15, minQty: 1, maxQty: 1, chance: 0.2 },
      { itemId: "force_stim", weight: 10, minQty: 1, maxQty: 1, chance: 0.15 },
    ],
  },

  loot_elite_sith: {
    id: "loot_elite_sith",
    guaranteed: [
      { itemId: "medpack_basic", minQty: 1, maxQty: 2 },
    ],
    rolls: 3,
    pool: [
      { itemId: "acolyte_blade", weight: 20, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "bloodforged_saber", weight: 5, minQty: 1, maxQty: 1, chance: 0.08 },
      { itemId: "warrior_plate", weight: 8, minQty: 1, maxQty: 1, chance: 0.12 },
      { itemId: "hood_of_shadows", weight: 10, minQty: 1, maxQty: 1, chance: 0.15 },
      { itemId: "adrenal_strength", weight: 15, minQty: 1, maxQty: 1, chance: 0.25 },
      { itemId: "mat_dark_essence", weight: 8, minQty: 1, maxQty: 1, chance: 0.1 },
      { itemId: "mat_crystal_shard", weight: 20, minQty: 1, maxQty: 2, chance: 0.35 },
      { itemId: "relic_broken_holocron", weight: 4, minQty: 1, maxQty: 1, chance: 0.05 },
    ],
  },

  loot_wraith: {
    id: "loot_wraith",
    guaranteed: [
      { itemId: "mat_dark_essence", minQty: 1, maxQty: 2 },
    ],
    rolls: 2,
    pool: [
      { itemId: "relic_broken_holocron", weight: 15, minQty: 1, maxQty: 1, chance: 0.2 },
      { itemId: "relic_bone_talisman", weight: 8, minQty: 1, maxQty: 1, chance: 0.1 },
      { itemId: "force_stim", weight: 25, minQty: 1, maxQty: 2, chance: 0.4 },
      { itemId: "mat_crystal_shard", weight: 20, minQty: 1, maxQty: 2, chance: 0.35 },
    ],
  },

  loot_boss_guardian: {
    id: "loot_boss_guardian",
    guaranteed: [
      { itemId: "mat_scrap_metal", minQty: 5, maxQty: 10 },
      { itemId: "medpack_advanced", minQty: 2, maxQty: 3 },
      { itemId: "quest_tomb_key", minQty: 1, maxQty: 1 },
    ],
    rolls: 3,
    pool: [
      { itemId: "sith_mask_iron", weight: 20, minQty: 1, maxQty: 1, chance: 0.4 },
      { itemId: "warrior_plate", weight: 15, minQty: 1, maxQty: 1, chance: 0.35 },
      { itemId: "duelist_garb", weight: 10, minQty: 1, maxQty: 1, chance: 0.2 },
      { itemId: "bloodforged_saber", weight: 12, minQty: 1, maxQty: 1, chance: 0.25 },
      { itemId: "implant_reflex_chip", weight: 8, minQty: 1, maxQty: 1, chance: 0.15 },
      { itemId: "mat_dark_essence", weight: 15, minQty: 1, maxQty: 3, chance: 0.5 },
    ],
  },

  loot_boss_voren: {
    id: "loot_boss_voren",
    guaranteed: [
      { itemId: "darth_voren_mantle", minQty: 1, maxQty: 1 },
      { itemId: "quest_voren_amulet", minQty: 1, maxQty: 1 },
      { itemId: "medpack_advanced", minQty: 3, maxQty: 5 },
    ],
    rolls: 4,
    pool: [
      { itemId: "crimson_fang", weight: 5, minQty: 1, maxQty: 1, chance: 0.15 },
      { itemId: "bloodforged_saber", weight: 15, minQty: 1, maxQty: 1, chance: 0.4 },
      { itemId: "duelist_garb", weight: 12, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "sith_mask_iron", weight: 10, minQty: 1, maxQty: 1, chance: 0.25 },
      { itemId: "relic_bone_talisman", weight: 10, minQty: 1, maxQty: 1, chance: 0.2 },
      { itemId: "mat_dark_essence", weight: 20, minQty: 2, maxQty: 5, chance: 0.6 },
      { itemId: "mat_crystal_shard", weight: 18, minQty: 2, maxQty: 4, chance: 0.5 },
      { itemId: "force_stim", weight: 15, minQty: 2, maxQty: 3, chance: 0.45 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // Previously-undefined tables — enemies referencing these silently
  // dropped nothing. Built from confirmed items (Warbringer pack + lore
  // shards) so no new dangling item refs are introduced.
  // ═══════════════════════════════════════════════════════════════════
  loot_thug: {
    id: "loot_thug", guaranteed: [], rolls: 2,
    pool: [
      { itemId: "medpac_warfront", weight: 35, minQty: 1, maxQty: 2, chance: 0.5 },
      { itemId: "combat_adrenal_surge", weight: 15, minQty: 1, maxQty: 1, chance: 0.2 },
      { itemId: "wb_serration_blade", weight: 8, minQty: 1, maxQty: 1, chance: 0.1 },
      { itemId: "antidote_kit", weight: 20, minQty: 1, maxQty: 1, chance: 0.3 },
    ],
  },
  loot_enforcer: {
    id: "loot_enforcer", guaranteed: [{ itemId: "medpac_warfront", minQty: 1, maxQty: 1 }], rolls: 2,
    pool: [
      { itemId: "force_stim_potent", weight: 18, minQty: 1, maxQty: 1, chance: 0.25 },
      { itemId: "wb_venom_sidearm", weight: 8, minQty: 1, maxQty: 1, chance: 0.1 },
      { itemId: "wb_implant_furnace", weight: 6, minQty: 1, maxQty: 1, chance: 0.08 },
      { itemId: "combat_adrenal_surge", weight: 20, minQty: 1, maxQty: 2, chance: 0.3 },
    ],
  },
  loot_hunter: {
    id: "loot_hunter", guaranteed: [{ itemId: "medpac_advanced_warfront", minQty: 1, maxQty: 1 }], rolls: 2,
    pool: [
      { itemId: "wb_implant_predator", weight: 7, minQty: 1, maxQty: 1, chance: 0.1 },
      { itemId: "wb_implant_reflex", weight: 12, minQty: 1, maxQty: 1, chance: 0.18 },
      { itemId: "force_stim_potent", weight: 20, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "combat_adrenal_surge", weight: 20, minQty: 1, maxQty: 2, chance: 0.35 },
    ],
  },
  loot_mando: {
    id: "loot_mando", guaranteed: [], rolls: 2,
    pool: [
      { itemId: "wb_relic_unbroken", weight: 4, minQty: 1, maxQty: 1, chance: 0.06 },
      { itemId: "wb_tempest_pike", weight: 7, minQty: 1, maxQty: 1, chance: 0.1 },
      { itemId: "medpac_advanced_warfront", weight: 25, minQty: 1, maxQty: 2, chance: 0.4 },
      { itemId: "wb_implant_predator", weight: 8, minQty: 1, maxQty: 1, chance: 0.12 },
    ],
  },
  loot_boss_nihilus: {
    id: "loot_boss_nihilus",
    guaranteed: [{ itemId: "dark_holocron_fragment", minQty: 1, maxQty: 2 }, { itemId: "medpac_advanced_warfront", minQty: 2, maxQty: 3 }],
    rolls: 3,
    pool: [
      { itemId: "wb_dread_saber", weight: 12, minQty: 1, maxQty: 1, chance: 0.35 },
      { itemId: "wb_relic_stormheart", weight: 8, minQty: 1, maxQty: 1, chance: 0.2 },
      { itemId: "corrupted_shard", weight: 18, minQty: 1, maxQty: 2, chance: 0.5 },
      { itemId: "force_stim_potent", weight: 20, minQty: 2, maxQty: 3, chance: 0.5 },
    ],
  },
  loot_boss_sion: {
    id: "loot_boss_sion",
    guaranteed: [{ itemId: "wb_relic_unbroken", minQty: 1, maxQty: 1 }, { itemId: "medpac_advanced_warfront", minQty: 2, maxQty: 3 }],
    rolls: 3,
    pool: [
      { itemId: "wb_set_chest", weight: 12, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "ancient_shard", weight: 18, minQty: 1, maxQty: 2, chance: 0.5 },
      { itemId: "combat_adrenal_surge", weight: 20, minQty: 2, maxQty: 3, chance: 0.5 },
    ],
  },
  loot_boss_traya: {
    id: "loot_boss_traya",
    guaranteed: [{ itemId: "dark_holocron_fragment", minQty: 1, maxQty: 2 }, { itemId: "corrupted_shard", minQty: 1, maxQty: 1 }],
    rolls: 3,
    pool: [
      { itemId: "wb_relic_stormheart", weight: 10, minQty: 1, maxQty: 1, chance: 0.25 },
      { itemId: "wb_relic_warcore", weight: 12, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "force_stim_potent", weight: 20, minQty: 2, maxQty: 3, chance: 0.5 },
    ],
  },
  loot_boss_exchange: {
    id: "loot_boss_exchange",
    guaranteed: [{ itemId: "medpac_advanced_warfront", minQty: 2, maxQty: 3 }],
    rolls: 3,
    pool: [
      { itemId: "wb_implant_predator", weight: 10, minQty: 1, maxQty: 1, chance: 0.25 },
      { itemId: "wb_venom_sidearm", weight: 12, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "combat_adrenal_surge", weight: 22, minQty: 2, maxQty: 4, chance: 0.5 },
    ],
  },
  loot_boss_ghost: {
    id: "loot_boss_ghost",
    guaranteed: [{ itemId: "corrupted_shard", minQty: 1, maxQty: 1 }],
    rolls: 3,
    pool: [
      { itemId: "wb_relic_stormheart", weight: 8, minQty: 1, maxQty: 1, chance: 0.2 },
      { itemId: "dark_holocron_fragment", weight: 14, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "force_stim_potent", weight: 20, minQty: 1, maxQty: 3, chance: 0.45 },
    ],
  },
  loot_boss_rakata: {
    id: "loot_boss_rakata",
    guaranteed: [{ itemId: "ancient_shard", minQty: 1, maxQty: 2 }, { itemId: "medpac_advanced_warfront", minQty: 2, maxQty: 3 }],
    rolls: 3,
    pool: [
      { itemId: "wb_implant_predator", weight: 12, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "wb_relic_warcore", weight: 10, minQty: 1, maxQty: 1, chance: 0.25 },
      { itemId: "ancient_shard", weight: 18, minQty: 1, maxQty: 2, chance: 0.45 },
    ],
  },
  loot_boss_tomb_lord: {
    id: "loot_boss_tomb_lord",
    guaranteed: [{ itemId: "ancient_shard", minQty: 1, maxQty: 2 }, { itemId: "medpac_advanced_warfront", minQty: 2, maxQty: 3 }],
    rolls: 3,
    pool: [
      { itemId: "wb_dread_saber", weight: 10, minQty: 1, maxQty: 1, chance: 0.28 },
      { itemId: "wb_set_helm", weight: 12, minQty: 1, maxQty: 1, chance: 0.3 },
      { itemId: "dark_holocron_fragment", weight: 16, minQty: 1, maxQty: 1, chance: 0.4 },
    ],
  },
};
