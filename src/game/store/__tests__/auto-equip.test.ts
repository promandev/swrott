import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "../game-store";
import { createNewCharacter } from "../../engine/progression/new-game";

/** autoEquipBest equips the highest-power valid item in each slot. */

describe("autoEquipBest", () => {
  beforeEach(() => {
    const c = createNewCharacter("Test", "marauder");
    c.level = 20; // clear level requirements
    c.inventory = [
      { instanceId: "w_weak", itemId: "wb_serration_blade", qty: 1 },   // dmg 18
      { instanceId: "w_strong", itemId: "wb_ember_scourge", qty: 1 },   // dmg 28
    ];
    c.equipment = {};
    useGameStore.setState({ character: c });
  });

  it("equips the strongest weapon available in the slot", () => {
    useGameStore.getState().autoEquipBest();
    expect(useGameStore.getState().character!.equipment.main_hand).toBe("w_strong");
  });

  it("is idempotent — re-running keeps the best equipped", () => {
    useGameStore.getState().autoEquipBest();
    useGameStore.getState().autoEquipBest();
    expect(useGameStore.getState().character!.equipment.main_hand).toBe("w_strong");
  });
});
