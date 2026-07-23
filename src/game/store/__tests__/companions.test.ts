import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "../game-store";
import { createNewCharacter } from "../../engine/progression/new-game";
import { COMPANIONS } from "../../engine/companions/companions";
import type { WorldSnapshot } from "../../engine/save/types";

/**
 * Companion recruitment bridge: dialogues set `<id>_recruited` flags, and
 * setQuestFlag must convert that into a real roster member. Without this the
 * companion never appears in the Allies tab or the party.
 */

function freshWorld(): WorldSnapshot {
  return {
    zoneId: "korriban_academy_exterior",
    factionRep: {} as WorldSnapshot["factionRep"],
    questFlags: {},
    completedQuests: [],
    activeQuests: [],
    discoveredZones: [],
    companions: [],
  } as unknown as WorldSnapshot;
}

describe("companion recruitment via flag", () => {
  beforeEach(() => {
    useGameStore.setState({
      character: createNewCharacter("Test", "marauder"),
      world: freshWorld(),
    });
  });

  it("adds the matching companion to the roster when its recruit flag is set", () => {
    const kaelis = COMPANIONS.find((c) => c.id === "kaelis")!;
    useGameStore.getState().setQuestFlag(kaelis.recruitFlag, true);
    const roster = useGameStore.getState().world!.companions;
    expect(roster.map((c) => c.id)).toContain("kaelis");
    const entry = roster.find((c) => c.id === "kaelis")!;
    expect(entry.affinity).toBe(0);
    expect(entry.inParty).toBe(false);
  });

  it("does not double-recruit the same companion", () => {
    const flag = COMPANIONS[0]!.recruitFlag;
    useGameStore.getState().setQuestFlag(flag, true);
    useGameStore.getState().setQuestFlag(flag, true);
    const count = useGameStore.getState().world!.companions.filter((c) => c.id === COMPANIONS[0]!.id).length;
    expect(count).toBe(1);
  });

  it("ignores unrelated flags", () => {
    useGameStore.getState().setQuestFlag("some_random_flag", true);
    expect(useGameStore.getState().world!.companions).toHaveLength(0);
  });

  it("completing a loyalty quest marks the companion loyal + boosts affinity", () => {
    const gs = useGameStore.getState();
    gs.setQuestFlag("kaelis_recruited", true);       // recruit
    gs.setQuestFlag("lk_talked", true);              // starts q_loyalty_kaelis
    gs.setQuestFlag("lk_trial_complete", true);      // completes it
    const kaelis = useGameStore.getState().world!.companions.find((c) => c.id === "kaelis")!;
    expect(kaelis.loyaltyComplete).toBe(true);
    expect(kaelis.affinity).toBeGreaterThanOrEqual(20);
  });
});
