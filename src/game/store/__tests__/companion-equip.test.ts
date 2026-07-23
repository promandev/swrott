import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "../game-store";
import { createNewCharacter } from "../../engine/progression/new-game";
import { buildPartyCombatants } from "../../engine/combat/companion-combat";
import type { WorldSnapshot } from "../../engine/save/types";

/**
 * Phase 4: companions carry their own gear (assigned from the shared
 * inventory), and that gear feeds their combat stats.
 */

function freshWorld(): WorldSnapshot {
  return {
    zoneId: "korriban_academy_exterior",
    factionRep: {} as WorldSnapshot["factionRep"],
    questFlags: {},
    completedQuests: [],
    activeQuests: [],
    discoveredZones: [],
    companions: [{ id: "kaelis", affinity: 0, inParty: true, loyaltyComplete: false }],
  } as unknown as WorldSnapshot;
}

describe("companion equipment", () => {
  beforeEach(() => {
    const c = createNewCharacter("Test", "marauder");
    c.level = 20;
    c.inventory = [
      { instanceId: "w1", itemId: "wb_ember_scourge", qty: 1 }, // weapon dmg 28
      { instanceId: "a1", itemId: "wb_set_chest", qty: 1 },     // +armor/+hp/+str
    ];
    c.equipment = {};
    useGameStore.setState({ character: c, world: freshWorld() });
  });

  it("auto-equips gear and removes it from the shared inventory", () => {
    useGameStore.getState().autoEquipCompanion("kaelis");
    const comp = useGameStore.getState().world!.companions.find((x) => x.id === "kaelis")!;
    expect(comp.equipment?.main_hand).toBe("wb_ember_scourge");
    expect(comp.equipment?.chest).toBe("wb_set_chest");
    // Consumed from inventory.
    expect(useGameStore.getState().character!.inventory).toHaveLength(0);
  });

  it("the equipped weapon raises the companion's combat damage", () => {
    const before = buildPartyCombatants(useGameStore.getState().world!.companions, 20)[0]!;
    useGameStore.getState().autoEquipCompanion("kaelis");
    const after = buildPartyCombatants(useGameStore.getState().world!.companions, 20)[0]!;
    expect(after.weaponDamage).toBe(28);
    expect(after.weaponDamage).toBeGreaterThan(before.weaponDamage);
    expect(after.maxHp).toBeGreaterThan(before.maxHp); // chest grants +hp/+endurance
  });

  it("unequipping returns the item to the inventory", () => {
    useGameStore.getState().autoEquipCompanion("kaelis");
    useGameStore.getState().unequipCompanionItem("kaelis", "main_hand");
    const comp = useGameStore.getState().world!.companions.find((x) => x.id === "kaelis")!;
    expect(comp.equipment?.main_hand).toBeUndefined();
    expect(useGameStore.getState().character!.inventory.some((i) => i.itemId === "wb_ember_scourge")).toBe(true);
  });
});
