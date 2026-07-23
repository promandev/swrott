/**
 * Quest system — state machine for mission tracking.
 * Source: Master Design Bible §12 "Misiones".
 */

export type QuestStatus = "available" | "active" | "completed" | "failed";

export interface QuestObjective {
  id: string;
  description: string;
  /** Flag key that marks this objective as complete when truthy. */
  flagKey: string;
  /** Whether this is optional. */
  optional: boolean;
}

export interface QuestReward {
  xp?: number;
  credits?: number;
  items?: Array<{ itemId: string; qty: number }>;
  factionRep?: Array<{ factionId: string; amount: number }>;
  corruption?: number;
}

export interface QuestDefinition {
  id: string;
  name: string;
  description: string;
  category: "main" | "secondary" | "companion" | "faction";
  /** Zone where quest is available. */
  zoneId: string;
  /** Level recommendation. */
  recommendedLevel: number;
  /** Quest IDs that must be completed before this one becomes available. */
  prereqs: string[];
  objectives: QuestObjective[];
  rewards: QuestReward;
  /** Dark side variant rewards (if player chose dark options). */
  darkRewards?: QuestReward;
}

/** Check if all required objectives are complete. */
export function isQuestComplete(
  quest: QuestDefinition,
  flags: Record<string, boolean | number | string>,
): boolean {
  return quest.objectives
    .filter((o) => !o.optional)
    .every((o) => !!flags[o.flagKey]);
}

/** Check if quest prerequisites are met. */
export function isQuestAvailable(
  quest: QuestDefinition,
  completedQuests: ReadonlySet<string>,
): boolean {
  return quest.prereqs.every((p) => completedQuests.has(p));
}
