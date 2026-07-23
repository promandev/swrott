import type { CharacterSnapshot } from "../save/types";
import type { Item, StatBonus } from "../../data/schemas/item";
import type { Slot } from "../../data/schemas";
import { getItem } from "../../data/items/item-registry";

/**
 * Equipment helpers — resolving equipped items and aggregating their
 * combat-relevant bonuses.
 *
 * `character.equipment` maps slot → inventory **instanceId** (preferred) or a
 * bare itemId (legacy saves). Both forms resolve here.
 */

export interface EquippedEntry {
  slot: Slot;
  /** instanceId when resolvable, otherwise the raw stored id. */
  instanceId: string;
  item: Item;
}

/** Resolve whatever id is stored in an equipment slot to its Item. */
export function resolveEquipped(
  character: Pick<CharacterSnapshot, "equipment" | "inventory">,
  slot: Slot,
): EquippedEntry | null {
  const storedId = character.equipment[slot];
  if (!storedId) return null;
  const invEntry = character.inventory.find((i) => i.instanceId === storedId);
  const itemId = invEntry?.itemId ?? storedId;
  const item = getItem(itemId);
  if (!item) return null;
  return { slot, instanceId: storedId, item };
}

export function getEquippedItems(
  character: Pick<CharacterSnapshot, "equipment" | "inventory">,
): EquippedEntry[] {
  return (Object.keys(character.equipment) as Slot[])
    .map((slot) => resolveEquipped(character, slot))
    .filter((e): e is EquippedEntry => e != null);
}

export interface GearSummary {
  /** Flat armor from all pieces. */
  armor: number;
  /** Weapon damage of the equipped main-hand (0 when unarmed). */
  weaponDamage: number;
  /** Primary stat bonuses (strength, agility, …). */
  stats: Required<Pick<StatBonus, "strength" | "agility" | "endurance" | "force" | "influence">>;
  critBonus: number;
  hpBonus: number;
  fpBonus: number;
}

/** Aggregate every equipped item's bonuses into one combat-ready summary. */
export function summarizeGear(
  character: Pick<CharacterSnapshot, "equipment" | "inventory">,
): GearSummary {
  const summary: GearSummary = {
    armor: 0,
    weaponDamage: 0,
    stats: { strength: 0, agility: 0, endurance: 0, force: 0, influence: 0 },
    critBonus: 0,
    hpBonus: 0,
    fpBonus: 0,
  };
  for (const { slot, item } of getEquippedItems(character)) {
    if (slot === "main_hand" && item.weapon) summary.weaponDamage += item.weapon.damage;
    const b = item.bonuses;
    if (!b) continue;
    summary.armor += b.armor ?? 0;
    summary.critBonus += b.critBonus ?? 0;
    summary.hpBonus += b.hp ?? 0;
    summary.fpBonus += b.forcePoints ?? 0;
    summary.stats.strength += b.strength ?? 0;
    summary.stats.agility += b.agility ?? 0;
    summary.stats.endurance += b.endurance ?? 0;
    summary.stats.force += b.force ?? 0;
    summary.stats.influence += b.influence ?? 0;
  }
  return summary;
}

/** Can this character equip the item? Returns a human-readable reason if not. */
export function canEquip(
  character: Pick<CharacterSnapshot, "level" | "classId">,
  item: Item,
): { ok: boolean; reason?: string } {
  if (!item.slot) return { ok: false, reason: "Not equippable" };
  if (item.levelReq > character.level) {
    return { ok: false, reason: `Requires level ${item.levelReq}` };
  }
  if (item.classRestriction && item.classRestriction !== character.classId) {
    return { ok: false, reason: `${item.classRestriction} only` };
  }
  return { ok: true };
}

// ─── Consumables ─────────────────────────────────────────────────────
// Items only describe their effect in prose; this table is the mechanical
// source of truth for out-of-combat consumption.

export interface ConsumableEffect {
  hp?: number;
  fp?: number;
  /** Restore to full (overrides hp/fp amounts). */
  full?: boolean;
}

export const CONSUMABLE_EFFECTS: Record<string, ConsumableEffect> = {
  medpack_basic: { hp: 50 },
  medpack_advanced: { hp: 120 },
  force_stim: { fp: 40 },
  shaddaa_medpac: { hp: 200 },
  dantooine_healing_herb: { hp: 500 },
  advanced_medpac_telos: { hp: 800 },
  kaas_field_ration: { hp: 150, fp: 20 },
  void_elixir_item: { full: true },
  // Warbringer Arsenal consumables (also usable mid-combat via the Items popover).
  medpac_warfront: { hp: 90 },
  medpac_advanced_warfront: { hp: 260 },
  force_stim_potent: { fp: 70 },
};

export function getConsumableEffect(itemId: string): ConsumableEffect | null {
  return CONSUMABLE_EFFECTS[itemId] ?? null;
}
