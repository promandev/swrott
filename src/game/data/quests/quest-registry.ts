import type { QuestDefinition } from "../../engine/quests/quest-types";
import { ACT1_QUESTS } from "./act1-quests";
import {
  ACT2_QUESTS,
  ACT3_QUESTS,
  ACT4_QUESTS,
  ACT5_QUESTS,
  COMPANION_QUESTS,
} from "./acts2to5-quests";
import { DROMUND_KAAS_QUESTS } from "./dromund-kaas-quests";
import { SIDE_QUESTS } from "./side-quests";

/**
 * Global quest registry — single source of truth for ALL quests across
 * every act and planet. The journal, dialogue consequences, and the
 * auto-tracking in game-store all resolve quests through this map.
 */

export const ALL_QUESTS: QuestDefinition[] = [
  ...ACT1_QUESTS,
  ...DROMUND_KAAS_QUESTS,
  ...ACT2_QUESTS,
  ...ACT3_QUESTS,
  ...ACT4_QUESTS,
  ...ACT5_QUESTS,
  ...COMPANION_QUESTS,
  ...SIDE_QUESTS,
];

export const QUEST_BY_ID: Map<string, QuestDefinition> = new Map(
  ALL_QUESTS.map((q) => [q.id, q]),
);

/** flagKey → quests that reference it as an objective. */
const QUESTS_BY_FLAG: Map<string, QuestDefinition[]> = new Map();
for (const q of ALL_QUESTS) {
  for (const obj of q.objectives) {
    const list = QUESTS_BY_FLAG.get(obj.flagKey);
    if (list) list.push(q);
    else QUESTS_BY_FLAG.set(obj.flagKey, [q]);
  }
}

/** Quests that have `flagKey` among their objectives (for auto start/complete). */
export function questsTouchingFlag(flagKey: string): QuestDefinition[] {
  return QUESTS_BY_FLAG.get(flagKey) ?? [];
}

export function getQuest(id: string): QuestDefinition | undefined {
  return QUEST_BY_ID.get(id);
}
