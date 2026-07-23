import type { RNG } from "../rng/rng";

/**
 * Encounter Generation System.
 *
 * Dynamically generates enemy groups for a zone encounter based on
 * zone level, encounter pools, and elite/boss chances.
 *
 * Source: Advanced Implementation Proposals §1 "Enemy Scaling System".
 */

export interface EncounterPool {
  enemyId: string;
  /** Relative weight for selection. */
  weight: number;
  /** Minimum quantity in this encounter. */
  minCount: number;
  /** Maximum quantity in this encounter. */
  maxCount: number;
}

export interface EncounterDefinition {
  id: string;
  zoneId: string;
  /** Zone recommended level range [min, max]. */
  levelRange: [number, number];
  /** Base encounter pool of regular enemies. */
  pool: EncounterPool[];
  /** Minimum number of enemies in a group. */
  minGroupSize: number;
  /** Maximum number of enemies in a group. */
  maxGroupSize: number;
  /** Chance (0-1) that one enemy in the group will be Elite. */
  eliteChance: number;
  /** Chance (0-1) that the encounter spawns a Boss instead of regular group. */
  bossChance: number;
  /** Boss enemy IDs that can spawn. */
  bossPool?: string[];
  /** Chance (0-1) that enemies have corruption modifiers applied. */
  corruptionChance: number;
}

export interface GeneratedEncounter {
  enemies: Array<{
    enemyId: string;
    isElite: boolean;
    isBoss: boolean;
    isCorrupted: boolean;
  }>;
  isBossEncounter: boolean;
}

/** Generate an encounter group for a zone. */
export function generateEncounter(
  def: EncounterDefinition,
  rng: RNG,
): GeneratedEncounter {
  // Boss check
  if (def.bossPool && def.bossPool.length > 0 && rng.chance(def.bossChance)) {
    const bossId = def.bossPool[rng.int(0, def.bossPool.length - 1)] as string;
    const isCorrupted = rng.chance(def.corruptionChance);
    return {
      enemies: [{ enemyId: bossId, isElite: false, isBoss: true, isCorrupted }],
      isBossEncounter: true,
    };
  }

  const groupSize = rng.int(def.minGroupSize, def.maxGroupSize);
  const enemies: GeneratedEncounter["enemies"] = [];
  const totalWeight = def.pool.reduce((s, e) => s + e.weight, 0);

  for (let i = 0; i < groupSize; i++) {
    let roll = rng.float(0, totalWeight);
    let chosen = def.pool[def.pool.length - 1];
    for (const entry of def.pool) {
      roll -= entry.weight;
      if (roll <= 0) {
        chosen = entry;
        break;
      }
    }

    const isElite = i === 0 && rng.chance(def.eliteChance);
    const isCorrupted = rng.chance(def.corruptionChance);
    enemies.push({ enemyId: chosen!.enemyId, isElite, isBoss: false, isCorrupted });
  }

  return { enemies, isBossEncounter: false };
}

// ═══════════════════════════════════════════════════════════════════════
// Encounter Definitions per Zone
// ═══════════════════════════════════════════════════════════════════════

export const ENCOUNTER_DEFINITIONS: EncounterDefinition[] = [
  // ─── Korriban ────────────────────────────────────────────────────────
  {
    id: "enc_korriban_exterior",
    zoneId: "korriban_academy_exterior",
    levelRange: [1, 5],
    pool: [
      { enemyId: "sith_acolyte", weight: 50, minCount: 1, maxCount: 2 },
      { enemyId: "shyrack", weight: 30, minCount: 1, maxCount: 3 },
      { enemyId: "tuk_ata", weight: 20, minCount: 1, maxCount: 2 },
    ],
    minGroupSize: 1,
    maxGroupSize: 3,
    eliteChance: 0.1,
    bossChance: 0,
    corruptionChance: 0.05,
  },
  {
    id: "enc_korriban_valley",
    zoneId: "korriban_valley",
    levelRange: [2, 6],
    pool: [
      { enemyId: "tuk_ata", weight: 40, minCount: 1, maxCount: 2 },
      { enemyId: "shyrack", weight: 35, minCount: 2, maxCount: 4 },
      { enemyId: "tomb_wraith", weight: 15, minCount: 1, maxCount: 1 },
      { enemyId: "sith_pureblood", weight: 10, minCount: 1, maxCount: 1 },
    ],
    minGroupSize: 1,
    maxGroupSize: 3,
    eliteChance: 0.15,
    bossChance: 0.03,
    bossPool: ["tomb_guardian_boss"],
    corruptionChance: 0.1,
  },
  {
    id: "enc_korriban_mines",
    zoneId: "korriban_mines",
    levelRange: [1, 4],
    pool: [
      { enemyId: "klor_slug", weight: 60, minCount: 2, maxCount: 4 },
      { enemyId: "shyrack", weight: 40, minCount: 1, maxCount: 3 },
    ],
    minGroupSize: 2,
    maxGroupSize: 4,
    eliteChance: 0.08,
    bossChance: 0,
    corruptionChance: 0.02,
  },

  // ─── Nar Shaddaa ─────────────────────────────────────────────────────
  {
    id: "enc_nar_promenade",
    zoneId: "nar_shaddaa_promenade",
    levelRange: [11, 15],
    pool: [
      { enemyId: "street_thug", weight: 40, minCount: 1, maxCount: 2 },
      { enemyId: "bounty_hunter", weight: 30, minCount: 1, maxCount: 1 },
      { enemyId: "exchange_enforcer", weight: 30, minCount: 1, maxCount: 2 },
    ],
    minGroupSize: 1,
    maxGroupSize: 3,
    eliteChance: 0.12,
    bossChance: 0,
    corruptionChance: 0.08,
  },
  {
    id: "enc_nar_lower",
    zoneId: "nar_shaddaa_lower",
    levelRange: [12, 16],
    pool: [
      { enemyId: "street_thug", weight: 30, minCount: 1, maxCount: 2 },
      { enemyId: "exchange_enforcer", weight: 40, minCount: 1, maxCount: 2 },
      { enemyId: "rakghoul", weight: 30, minCount: 1, maxCount: 2 },
    ],
    minGroupSize: 2,
    maxGroupSize: 4,
    eliteChance: 0.18,
    bossChance: 0.05,
    bossPool: ["exchange_boss"],
    corruptionChance: 0.12,
  },

  // ─── Dxun ─────────────────────────────────────────────────────────────
  {
    id: "enc_dxun_jungle",
    zoneId: "dxun_jungle",
    levelRange: [18, 25],
    pool: [
      { enemyId: "boma_beast", weight: 30, minCount: 1, maxCount: 2 },
      { enemyId: "cannok", weight: 30, minCount: 2, maxCount: 4 },
      { enemyId: "drexl_larva", weight: 20, minCount: 1, maxCount: 1 },
      { enemyId: "mandalorian_scout", weight: 20, minCount: 1, maxCount: 2 },
    ],
    minGroupSize: 2,
    maxGroupSize: 4,
    eliteChance: 0.15,
    bossChance: 0.04,
    bossPool: ["tomb_lord_dxun"],
    corruptionChance: 0.1,
  },

  // ─── Dantooine ─────────────────────────────────────────────────────────
  {
    id: "enc_dantooine_plains",
    zoneId: "dantooine_plains",
    levelRange: [20, 28],
    pool: [
      { enemyId: "kath_hound", weight: 50, minCount: 1, maxCount: 3 },
      { enemyId: "kinrath", weight: 30, minCount: 1, maxCount: 2 },
      { enemyId: "mercenary", weight: 20, minCount: 1, maxCount: 2 },
    ],
    minGroupSize: 1,
    maxGroupSize: 3,
    eliteChance: 0.12,
    bossChance: 0,
    corruptionChance: 0.06,
  },

  // ─── Telos ─────────────────────────────────────────────────────────────
  {
    id: "enc_telos_surface",
    zoneId: "telos_surface",
    levelRange: [28, 35],
    pool: [
      { enemyId: "czerka_merc", weight: 40, minCount: 1, maxCount: 2 },
      { enemyId: "salvage_droid", weight: 35, minCount: 1, maxCount: 2 },
      { enemyId: "wild_beast", weight: 25, minCount: 1, maxCount: 2 },
    ],
    minGroupSize: 1,
    maxGroupSize: 3,
    eliteChance: 0.15,
    bossChance: 0.04,
    bossPool: ["rakata_construct"],
    corruptionChance: 0.08,
  },

  // ─── Malachor V ─────────────────────────────────────────────────────────
  {
    id: "enc_malachor_surface",
    zoneId: "malachor_surface",
    levelRange: [35, 45],
    pool: [
      { enemyId: "storm_beast", weight: 40, minCount: 1, maxCount: 2 },
      { enemyId: "shadow_assassin", weight: 35, minCount: 1, maxCount: 2 },
      { enemyId: "void_wraith", weight: 25, minCount: 1, maxCount: 1 },
    ],
    minGroupSize: 1,
    maxGroupSize: 3,
    eliteChance: 0.2,
    bossChance: 0.05,
    bossPool: ["darth_sion"],
    corruptionChance: 0.2,
  },
  {
    id: "enc_malachor_depths",
    zoneId: "malachor_depths",
    levelRange: [38, 48],
    pool: [
      { enemyId: "shadow_assassin", weight: 40, minCount: 1, maxCount: 2 },
      { enemyId: "void_wraith", weight: 35, minCount: 1, maxCount: 2 },
      { enemyId: "sith_marauder_elite", weight: 25, minCount: 1, maxCount: 1 },
    ],
    minGroupSize: 1,
    maxGroupSize: 2,
    eliteChance: 0.25,
    bossChance: 0.08,
    bossPool: ["darth_nihilus", "darth_traya"],
    corruptionChance: 0.3,
  },
];

export const ENCOUNTER_MAP = new Map(
  ENCOUNTER_DEFINITIONS.map((e) => [e.zoneId, e]),
);
