import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "../game-store";
import { createNewCharacter } from "../../engine/progression/new-game";
import type { WorldSnapshot } from "../../engine/save/types";

function world(companions: WorldSnapshot["companions"]): WorldSnapshot {
  return {
    zoneId: "z", factionRep: {} as WorldSnapshot["factionRep"], questFlags: {},
    completedQuests: [], activeQuests: [], discoveredZones: [], companions,
  } as unknown as WorldSnapshot;
}

describe("bondPartyAfterVictory", () => {
  beforeEach(() => {
    useGameStore.setState({
      character: createNewCharacter("T", "marauder"),
      world: world([
        { id: "kaelis", affinity: 10, inParty: true, loyaltyComplete: false },
        { id: "v3x9", affinity: 10, inParty: false, loyaltyComplete: false },
        { id: "serana", affinity: 49, inParty: true, loyaltyComplete: false },
      ]),
    });
  });

  it("bumps only in-party companions, and caps the combat bond at 50", () => {
    useGameStore.getState().bondPartyAfterVictory();
    const comps = useGameStore.getState().world!.companions;
    expect(comps.find((c) => c.id === "kaelis")!.affinity).toBe(11); // in party → +1
    expect(comps.find((c) => c.id === "v3x9")!.affinity).toBe(10);   // benched → unchanged
    expect(comps.find((c) => c.id === "serana")!.affinity).toBe(50); // capped at 50
  });

  it("never pushes affinity past the combat cap", () => {
    useGameStore.setState({ world: world([{ id: "kaelis", affinity: 50, inParty: true, loyaltyComplete: false }]) });
    useGameStore.getState().bondPartyAfterVictory();
    expect(useGameStore.getState().world!.companions[0]!.affinity).toBe(50);
  });
});
