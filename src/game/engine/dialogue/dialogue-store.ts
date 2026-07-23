import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { DialogueConversation, DialogueNode, DialogueOption, DialogueContext, DialogueConsequence } from "./dialogue-types";
import { getAvailableOptions } from "./dialogue-types";

/** Tag consequences with their origin so one-time rewards can be deduped. */
function stamp(consequences: DialogueConsequence[], sourceId: string): DialogueConsequence[] {
  return consequences.map((c) => ({ ...c, sourceId }));
}

/**
 * Dialogue runtime store — manages active conversation state.
 */

interface DialogueState {
  active: boolean;
  conversation: DialogueConversation | null;
  currentNodeId: string | null;
  currentNode: DialogueNode | null;
  availableOptions: DialogueOption[];
  history: Array<{ nodeId: string; optionId?: string }>;
  /** Pending consequences to apply after dialogue advances. */
  pendingConsequences: DialogueConsequence[];
}

interface DialogueActions {
  startConversation: (conversation: DialogueConversation, ctx: DialogueContext) => void;
  selectOption: (optionId: string, ctx: DialogueContext) => void;
  advanceAutoNode: (ctx: DialogueContext) => void;
  endConversation: () => void;
  consumeConsequences: () => DialogueConsequence[];
}

export const useDialogueStore = create<DialogueState & DialogueActions>()(
  immer((set, get) => ({
    active: false,
    conversation: null,
    currentNodeId: null,
    currentNode: null,
    availableOptions: [],
    history: [],
    pendingConsequences: [],

    startConversation: (conversation, ctx) => {
      const startNode = conversation.nodes[conversation.startNodeId];
      if (!startNode) return;

      set((s) => {
        s.active = true;
        s.conversation = conversation;
        s.currentNodeId = conversation.startNodeId;
        s.currentNode = startNode;
        s.availableOptions = getAvailableOptions(startNode, ctx);
        s.history = [{ nodeId: conversation.startNodeId }];
        s.pendingConsequences = startNode.onEnter
          ? stamp(startNode.onEnter, `${conversation.id}:enter:${conversation.startNodeId}`)
          : [];
      });
    },

    selectOption: (optionId, ctx) => {
      const state = get();
      if (!state.conversation || !state.currentNode) return;

      const option = state.currentNode.options.find((o) => o.id === optionId);
      if (!option) return;

      // Collect consequences from the chosen option, tagged with their origin.
      const consequences = stamp(option.consequences, `${state.conversation.id}:${optionId}`);

      if (option.nextNodeId === null) {
        // End of conversation
        set((s) => {
          s.history.push({ nodeId: s.currentNodeId!, optionId });
          s.pendingConsequences.push(...consequences);
          s.active = false;
          s.currentNode = null;
          s.currentNodeId = null;
          s.availableOptions = [];
        });
        return;
      }

      const nextNode = state.conversation.nodes[option.nextNodeId];
      if (!nextNode) {
        set((s) => {
          s.active = false;
        });
        return;
      }

      set((s) => {
        s.history.push({ nodeId: s.currentNodeId!, optionId });
        s.currentNodeId = option.nextNodeId;
        s.currentNode = nextNode;
        s.availableOptions = getAvailableOptions(nextNode, ctx);
        s.pendingConsequences.push(...consequences);
        if (nextNode.onEnter) {
          s.pendingConsequences.push(...stamp(nextNode.onEnter, `${state.conversation!.id}:enter:${option.nextNodeId}`));
        }
      });
    },

    advanceAutoNode: (ctx) => {
      const state = get();
      if (!state.conversation || !state.currentNode) return;

      const autoNext = state.currentNode.autoNext;
      if (autoNext === undefined) return;

      if (autoNext === null) {
        set((s) => {
          s.active = false;
          s.currentNode = null;
          s.currentNodeId = null;
          s.availableOptions = [];
        });
        return;
      }

      const nextNode = state.conversation.nodes[autoNext];
      if (!nextNode) {
        set((s) => { s.active = false; });
        return;
      }

      set((s) => {
        s.history.push({ nodeId: s.currentNodeId! });
        s.currentNodeId = autoNext;
        s.currentNode = nextNode;
        s.availableOptions = getAvailableOptions(nextNode, ctx);
        if (nextNode.onEnter) {
          s.pendingConsequences.push(...stamp(nextNode.onEnter, `${state.conversation!.id}:enter:${autoNext}`));
        }
      });
    },

    endConversation: () =>
      set((s) => {
        s.active = false;
        s.conversation = null;
        s.currentNode = null;
        s.currentNodeId = null;
        s.availableOptions = [];
        s.history = [];
      }),

    consumeConsequences: () => {
      const consequences = [...get().pendingConsequences];
      set((s) => {
        s.pendingConsequences = [];
      });
      return consequences;
    },
  })),
);
