import { describe, it, expect } from "vitest";
import { buildCombatPlayer } from "../player-loadout";
import { createNewCharacter } from "../../progression/new-game";
import type { CharacterSnapshot } from "../../save/types";

/**
 * Set bonuses (data/items/sets.ts) were authored but never applied in combat.
 * buildCombatPlayer now folds their stat/combat effects into the payload.
 * The Warbringer set (4 pieces): 2pc +60 HP, 4pc +6 STR & 5% lifesteal.
 */

function charWith(equipment: Record<string, string>): CharacterSnapshot {
  const c = createNewCharacter("Test", "marauder");
  c.level = 15;
  c.equipment = equipment;
  // Equip references are resolvable as bare itemIds.
  return c;
}

describe("set bonuses in combat", () => {
  it("a full Warbringer set grants its tiered combat bonuses", () => {
    const bare = buildCombatPlayer(charWith({}));
    const set = buildCombatPlayer(charWith({
      head: "wb_set_helm", chest: "wb_set_chest", gloves: "wb_set_gauntlets", boots: "wb_set_greaves",
    }));

    // 4-piece tier → +6 STR (on top of the per-piece bonuses) and 5% lifesteal.
    expect(set.talentMods.lifestealPct).toBeGreaterThanOrEqual(5);
    expect(set.primary.strength).toBeGreaterThan(bare.primary.strength);
    // 2-piece tier grants +60 max HP beyond the per-piece HP bonuses.
    expect(set.maxHp).toBeGreaterThan(bare.maxHp);
  });

  it("partial sets grant no set-tier lifesteal", () => {
    const partial = buildCombatPlayer(charWith({ head: "wb_set_helm" })); // 1 piece only
    expect(partial.talentMods.lifestealPct).toBe(0);
  });

  it("wires the void_lord set's type-damage and force-cost effects", () => {
    // 4 void_lord pieces → 2pc force dmg, 4pc shock dmg (the 6pc fp-discount
    // needs 6 pieces; this set only has 4 in the data, so check what's active).
    const inq = createNewCharacter("Tester", "inquisitor");
    inq.level = 18;
    inq.equipment = {
      head: "set_voidlord_hood", gloves: "set_voidlord_gloves",
      belt: "set_voidlord_belt", boots: "set_voidlord_boots",
    };
    const p = buildCombatPlayer(inq);
    // 2pc → +10% force damage, 4pc → +20% shock damage.
    expect(p.damageOfType?.force ?? 0).toBeGreaterThan(0);
    expect(p.damageOfType?.shock ?? 0).toBeGreaterThan(0);
  });

  it("wires the whisperveil set's dodge bonus", () => {
    const asn = createNewCharacter("Tester", "assassin");
    asn.level = 18;
    asn.equipment = {
      chest: "set_whisperveil_chest", gloves: "set_whisperveil_gloves",
      belt: "set_whisperveil_belt", boots: "set_whisperveil_boots",
    };
    const p = buildCombatPlayer(asn);
    // whisperveil 2pc → +8% dodge.
    expect(p.dodgeBonus ?? 0).toBeGreaterThan(0);
  });
});
