import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "../game-store";
import { createNewCharacter } from "../../engine/progression/new-game";
import { buildCombatPlayer } from "../../engine/combat/player-loadout";
import type { WorldSnapshot } from "../../engine/save/types";

/**
 * setVitals persists post-combat HP/FP back onto the character, clamped to the
 * TRUE max (base + gear + talents) so it matches what the combat engine used.
 * Passing Infinity restores to full (respawn / level-up).
 */

describe("setVitals — post-combat HP/FP persistence", () => {
  beforeEach(() => {
    useGameStore.setState({ character: createNewCharacter("Test", "marauder") });
  });

  it("clamps a wounded value through unchanged when below max", () => {
    useGameStore.getState().setVitals(1, 1);
    const c = useGameStore.getState().character!;
    expect(c.hp).toBe(1);
    expect(c.forcePoints).toBe(1);
  });

  it("restores to the true gear+talent max when given Infinity", () => {
    const payload = buildCombatPlayer(useGameStore.getState().character!);
    useGameStore.getState().setVitals(Infinity, Infinity);
    const c = useGameStore.getState().character!;
    expect(c.hp).toBe(payload.maxHp);
    expect(c.forcePoints).toBe(payload.maxFp);
  });

  it("never persists a negative pool", () => {
    useGameStore.getState().setVitals(-50, -50);
    const c = useGameStore.getState().character!;
    expect(c.hp).toBe(0);
    expect(c.forcePoints).toBe(0);
  });
});

describe("meditate — once-per-zone out-of-combat recovery", () => {
  beforeEach(() => {
    useGameStore.setState((s) => ({
      character: createNewCharacter("Test", "marauder"),
      world: { zoneId: "zone_a" } as unknown as WorldSnapshot,
      ui: { ...s.ui, restedZoneId: null },
    }));
    useGameStore.getState().setVitals(1, 1); // wound the character
  });

  it("restores some HP/FP and marks the zone as rested", () => {
    const gs = useGameStore.getState();
    gs.meditate();
    const c = useGameStore.getState().character!;
    expect(c.hp).toBeGreaterThan(1);
    expect(c.forcePoints).toBeGreaterThan(1);
    expect(useGameStore.getState().ui.restedZoneId).toBe("zone_a");
  });

  it("won't heal twice in the same zone", () => {
    useGameStore.getState().meditate();
    const afterFirst = useGameStore.getState().character!.hp;
    useGameStore.getState().meditate();
    expect(useGameStore.getState().character!.hp).toBe(afterFirst);
  });

  it("becomes available again after travelling to a new zone", () => {
    useGameStore.getState().meditate();
    const afterFirst = useGameStore.getState().character!.hp;
    useGameStore.getState().setWorldField("zoneId", "zone_b");
    expect(useGameStore.getState().ui.restedZoneId).toBeNull();
    useGameStore.getState().meditate();
    expect(useGameStore.getState().character!.hp).toBeGreaterThan(afterFirst);
  });
});
