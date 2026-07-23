import { describe, it, expect } from "vitest";
import { WARBRINGER_ITEMS } from "../warbringer-arsenal";
import { getItem, getItemsBySetId } from "../item-registry";
import { ITEM_SETS } from "../sets";
import { getConsumableEffect } from "../../../engine/items/equipment";
import { buildCombatPlayer } from "../../../engine/combat/player-loadout";
import { createNewCharacter } from "../../../engine/progression/new-game";
import { StatusEffectSchema } from "../../schemas/common";

describe("Warbringer Arsenal content pack", () => {
  it("registers every item in the global registry", () => {
    for (const raw of WARBRINGER_ITEMS) {
      expect(getItem(raw.id!), `missing ${raw.id}`).toBeTruthy();
    }
  });

  it("makes every consumable usable somewhere (out of combat or mid-fight)", () => {
    // Combat-only consumables (adrenal/antidote) have no out-of-combat effect
    // but are resolved by combat-store.useItem via these id substrings.
    const COMBAT_USABLE = /medpac|medpack|force_stim|adrenal|antidote/;
    const consumables = WARBRINGER_ITEMS.filter((i) => i.tags?.includes("consumable"));
    expect(consumables.length).toBeGreaterThan(0);
    for (const c of consumables) {
      const usable = Boolean(getConsumableEffect(c.id!)) || COMBAT_USABLE.test(c.id!);
      expect(usable, `unusable consumable ${c.id}`).toBe(true);
    }
  });

  it("only uses valid status effects on weapon procs", () => {
    const weapons = WARBRINGER_ITEMS.filter((i) => i.weapon && i.onHitStatus);
    expect(weapons.length).toBeGreaterThan(0);
    for (const w of weapons) {
      expect(() => StatusEffectSchema.parse(w.onHitStatus!.effect)).not.toThrow();
    }
  });

  it("threads an equipped weapon's on-hit status into the combat payload", () => {
    const char = createNewCharacter("Tester", "marauder");
    char.equipment.main_hand = "wb_serration_blade"; // bleed on hit
    const payload = buildCombatPlayer(char);
    expect(payload.weaponOnHit).toBeDefined();
    expect(payload.weaponOnHit?.effect).toBe("bleed");
    expect(payload.weaponDamage).toBe(18); // weapon damage flows through too
  });

  it("forms a complete 4-piece Warbringer set defined in ITEM_SETS", () => {
    expect(ITEM_SETS.warbringer).toBeDefined();
    expect(getItemsBySetId("warbringer")).toHaveLength(4);
  });
});
