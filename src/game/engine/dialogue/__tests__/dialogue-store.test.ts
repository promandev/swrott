import { describe, it, expect, beforeEach } from "vitest";
import { useDialogueStore } from "../dialogue-store";
import type { DialogueConversation, DialogueContext } from "../dialogue-types";

/**
 * The dialogue runtime stamps every queued consequence with a `sourceId`
 * (`conversation:option` or `conversation:enter:node`). The consequence
 * applier relies on that tag to grant one-time rewards only once, so
 * re-walking a conversation can't farm the same XP / items repeatedly.
 */

const CTX: DialogueContext = {
  playerLevel: 1,
  playerClassId: "marauder",
  primary: { strength: 1, agility: 1, endurance: 1, force: 1, influence: 1, corruption: 0 },
  factionRep: {} as DialogueContext["factionRep"],
  questFlags: {},
  inventory: [],
};

const CONV: DialogueConversation = {
  id: "test_conv",
  startNodeId: "start",
  nodes: {
    start: {
      id: "start",
      speaker: "Tester",
      text: "Pick one.",
      onEnter: [{ type: "set_flag", key: "entered_start" }],
      options: [
        {
          id: "reward",
          text: "Take the reward",
          consequences: [{ type: "add_xp", value: 50 }],
          nextNodeId: null,
        },
      ],
    },
  },
};

describe("dialogue-store consequence stamping", () => {
  beforeEach(() => {
    useDialogueStore.getState().endConversation();
  });

  it("stamps onEnter consequences with the entry source id", () => {
    useDialogueStore.getState().startConversation(CONV, CTX);
    const queued = useDialogueStore.getState().pendingConsequences;
    expect(queued).toHaveLength(1);
    expect(queued[0]?.sourceId).toBe("test_conv:enter:start");
  });

  it("stamps chosen-option consequences with conversation:option", () => {
    useDialogueStore.getState().startConversation(CONV, CTX);
    useDialogueStore.getState().consumeConsequences(); // drain the onEnter
    useDialogueStore.getState().selectOption("reward", CTX);
    const queued = useDialogueStore.getState().pendingConsequences;
    const reward = queued.find((c) => c.type === "add_xp");
    expect(reward?.sourceId).toBe("test_conv:reward");
  });
});
