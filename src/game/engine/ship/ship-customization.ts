/**
 * Ship customization (Independent Loop 2 / Idea IL2-A).
 *
 * The player's ship serves as a mobile hub between zones. Upgrades
 * unlock cosmetics, passive boons, and access to higher-tier crafting.
 *
 * Slots:
 *   ENGINE    travel speed / fuel efficiency
 *   HULL      durability / repair cost
 *   WEAPONS   space combat (future feature, scaffolded here)
 *   SHIELDS   damage absorption in space combat
 *   QUARTERS  out-of-combat passives (rest bonus, etc.)
 *   WORKSHOP  crafting workbench tier
 *   COMM      faction comm reach (more bounties / quests available)
 *   ARCHIVE   codex / shard storage capacity
 */

export type ShipSlot = "engine" | "hull" | "weapons" | "shields" | "quarters" | "workshop" | "comm" | "archive";

export interface ShipModule {
  id: string;
  slot: ShipSlot;
  name: string;
  description: string;
  tier: 1 | 2 | 3 | 4 | 5;
  cost: number;       // credits
  /** Multipliers / flags this module grants. */
  effects: Partial<{
    travelSpeedMult: number;
    fuelMult: number;
    repairCostMult: number;
    spaceDamageMult: number;
    spaceArmorMult: number;
    restHpRestorePct: number;
    restFpRestorePct: number;
    workbenchTier: 1 | 2 | 3;
    commBountySlots: number;
    archiveShardCap: number;
  }>;
}

export const SHIP_MODULES: ShipModule[] = [
  // engines
  { id: "engine_t1", slot: "engine", name: "Surplus Drive",        description: "Basic hyperspace drive.",
    tier: 1, cost: 0,     effects: { travelSpeedMult: 1.0, fuelMult: 1.0 } },
  { id: "engine_t2", slot: "engine", name: "Republic Surplus II",  description: "Faster, slightly thirstier.",
    tier: 2, cost: 5000,  effects: { travelSpeedMult: 1.25, fuelMult: 1.1 } },
  { id: "engine_t3", slot: "engine", name: "Sith Hyperdrive",      description: "Stolen Imperial tech.",
    tier: 3, cost: 15000, effects: { travelSpeedMult: 1.5, fuelMult: 0.9 } },

  // hulls
  { id: "hull_t1", slot: "hull", name: "Scrap Hull",         description: "Tape and prayer.",
    tier: 1, cost: 0,     effects: { repairCostMult: 1.5 } },
  { id: "hull_t2", slot: "hull", name: "Mandalorian Plating",description: "Veterans swear by it.",
    tier: 3, cost: 12000, effects: { repairCostMult: 0.7, spaceArmorMult: 1.5 } },

  // quarters
  { id: "quarters_t1", slot: "quarters", name: "Cot in a Closet", description: "Restores 30% HP/FP on rest.",
    tier: 1, cost: 0,    effects: { restHpRestorePct: 0.3, restFpRestorePct: 0.3 } },
  { id: "quarters_t2", slot: "quarters", name: "Sith Lord Chambers", description: "Restores 70% HP/FP on rest.",
    tier: 2, cost: 6000, effects: { restHpRestorePct: 0.7, restFpRestorePct: 0.7 } },
  { id: "quarters_t3", slot: "quarters", name: "Meditation Sanctum", description: "Full restore on rest.",
    tier: 3, cost: 18000, effects: { restHpRestorePct: 1.0, restFpRestorePct: 1.0 } },

  // workshops
  { id: "workshop_t1", slot: "workshop", name: "Basic Workbench",    description: "Tier 1 recipes only.",
    tier: 1, cost: 0,     effects: { workbenchTier: 1 } },
  { id: "workshop_t2", slot: "workshop", name: "Refined Workshop",   description: "Tier 2 recipes.",
    tier: 2, cost: 8000,  effects: { workbenchTier: 2 } },
  { id: "workshop_t3", slot: "workshop", name: "Ancient Sith Forge", description: "Tier 3 recipes including Voidforged.",
    tier: 4, cost: 30000, effects: { workbenchTier: 3 } },

  // comm
  { id: "comm_t1", slot: "comm", name: "Basic Comm Array", description: "3 bounty slots.",
    tier: 1, cost: 0,    effects: { commBountySlots: 3 } },
  { id: "comm_t2", slot: "comm", name: "Encrypted Network", description: "5 bounty slots.",
    tier: 2, cost: 4000, effects: { commBountySlots: 5 } },
  { id: "comm_t3", slot: "comm", name: "Galactic Underground Relay", description: "8 bounty slots, includes chain bounties.",
    tier: 3, cost: 14000,effects: { commBountySlots: 8 } },

  // archive
  { id: "archive_t1", slot: "archive", name: "Datapad Shelf",  description: "Holds 10 memory shards.",
    tier: 1, cost: 0, effects: { archiveShardCap: 10 } },
  { id: "archive_t2", slot: "archive", name: "Holocron Cabinet", description: "Holds 20 memory shards.",
    tier: 2, cost: 6000, effects: { archiveShardCap: 20 } },
  { id: "archive_t3", slot: "archive", name: "Sith Vault",       description: "Unlimited shard storage.",
    tier: 3, cost: 25000, effects: { archiveShardCap: 999 } },
];

export interface ShipConfiguration {
  modules: Partial<Record<ShipSlot, string>>;     // slot → moduleId
}

export function activeModule(config: ShipConfiguration, slot: ShipSlot): ShipModule | undefined {
  const id = config.modules[slot];
  if (!id) return undefined;
  return SHIP_MODULES.find((m) => m.id === id);
}

/** Aggregate effects across all installed modules. */
export function aggregateShipEffects(config: ShipConfiguration): NonNullable<ShipModule["effects"]> {
  const slots: ShipSlot[] = ["engine", "hull", "weapons", "shields", "quarters", "workshop", "comm", "archive"];
  const acc: NonNullable<ShipModule["effects"]> = {};
  for (const slot of slots) {
    const m = activeModule(config, slot);
    if (!m) continue;
    for (const [k, v] of Object.entries(m.effects)) {
      if (typeof v === "number") {
        const key = k as keyof ShipModule["effects"];
        if (k.endsWith("Mult")) {
          acc[key] = (((acc[key] as number) ?? 1) * v) as never;
        } else {
          acc[key] = (((acc[key] as number) ?? 0) + v) as never;
        }
      } else {
        (acc as Record<string, unknown>)[k] = v;
      }
    }
  }
  return acc;
}
