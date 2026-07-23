import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";
import { ALL_QUESTS } from "../quests/quest-registry";
import { isQuestAvailable, isQuestComplete } from "../../engine/quests/quest-types";
import {
  KORRIBAN_NPCS,
  KORRIBAN_CONVERSATIONS,
  type NpcDefinition,
} from "./korriban-npcs";
import {
  DROMUND_KAAS_NPCS,
  DROMUND_KAAS_CONVERSATIONS,
} from "./dromund-kaas-npcs";
import {
  NAR_SHADDAA_NPCS,
  ONDERON_NPCS,
  EXTRA_KORRIBAN_NPCS,
  CONV_MALVEK_INTRO,
  CONV_TAVROS_PROPHECY,
  CONV_RHEA_INTRO,
  CONV_DREGG_CHALLENGE,
  CONV_RHEN_HELP,
  CONV_RHEN_SECRET,
  CONV_NETH_INTRO,
  CONV_RONAR_FIRST,
  CONV_CYRA_INTRO,
  CONV_CYRA_JOB,
  CONV_VOSS_INTRO,
  CONV_VOSS_MISSION,
  CONV_TALIRA_AUDIENCE,
  CONV_TALIRA_SECRET_MISSION,
  CONV_NETH_DEAL,
  CONV_DREGG_BETS,
  CONV_RONAR_REVELATION,
  CONV_RONAR_CHOICE,
} from "./planet-npcs";
import { GALAXY_NPCS, GALAXY_CONVERSATIONS } from "./galaxy-npcs";
import { SIDE_NPCS, SIDE_CONVERSATIONS } from "./side-npcs";
import { ZIOST_NPCS, ZIOST_CONVERSATIONS } from "./ziost-npcs";
import { COMPANION_CONVERSATIONS } from "./companion-dialogues";
import { DYNAMIC_CONVERSATIONS } from "./dynamic-dialogues";

/**
 * Centralized NPC + conversation registry.
 *
 * Aggregates all planet NPC files. Use `getNpc(id)` to fetch metadata
 * and `getConversation(id)` to fetch a dialogue tree. `getDefaultConversationForNpc`
 * returns the first conversation id declared on an NPC (typically their intro).
 *
 * Order matters: later entries override earlier ones in NPC_BY_ID, so
 * GALAXY_NPCS can refine definitions from planet-npcs.ts (adding
 * conversationRules once the dialogue content exists).
 */

export const ALL_NPCS: NpcDefinition[] = [
  ...KORRIBAN_NPCS,
  ...DROMUND_KAAS_NPCS,
  ...NAR_SHADDAA_NPCS,
  ...ONDERON_NPCS,
  ...EXTRA_KORRIBAN_NPCS,
  ...GALAXY_NPCS,
  ...SIDE_NPCS,
  ...ZIOST_NPCS,
];

export const ALL_CONVERSATIONS: Record<string, DialogueConversation> = {
  ...KORRIBAN_CONVERSATIONS,
  ...DROMUND_KAAS_CONVERSATIONS,
  conv_malvek_intro: CONV_MALVEK_INTRO,
  conv_tavros_prophecy: CONV_TAVROS_PROPHECY,
  conv_rhea_intro: CONV_RHEA_INTRO,
  conv_dregg_challenge: CONV_DREGG_CHALLENGE,
  conv_rhen_help: CONV_RHEN_HELP,
  conv_rhen_secret: CONV_RHEN_SECRET,
  conv_neth_intro: CONV_NETH_INTRO,
  conv_ronar_first: CONV_RONAR_FIRST,
  conv_cyra_intro: CONV_CYRA_INTRO,
  conv_cyra_job: CONV_CYRA_JOB,
  conv_voss_intro: CONV_VOSS_INTRO,
  conv_voss_mission: CONV_VOSS_MISSION,
  conv_talira_audience: CONV_TALIRA_AUDIENCE,
  conv_talira_secret_mission: CONV_TALIRA_SECRET_MISSION,
  conv_neth_deal: CONV_NETH_DEAL,
  conv_dregg_bets: CONV_DREGG_BETS,
  conv_ronar_revelation: CONV_RONAR_REVELATION,
  conv_ronar_choice: CONV_RONAR_CHOICE,
  ...GALAXY_CONVERSATIONS,
  ...SIDE_CONVERSATIONS,
  ...ZIOST_CONVERSATIONS,
  ...COMPANION_CONVERSATIONS,
  ...DYNAMIC_CONVERSATIONS,
};

const NPC_BY_ID = new Map(ALL_NPCS.map((n) => [n.id, n]));

export function getNpc(id: string): NpcDefinition | undefined {
  return NPC_BY_ID.get(id);
}

export function getConversation(id: string): DialogueConversation | undefined {
  return ALL_CONVERSATIONS[id];
}

export function getDefaultConversationForNpc(npcId: string): DialogueConversation | undefined {
  const npc = NPC_BY_ID.get(npcId);
  if (!npc) return undefined;
  const firstConvId = npc.conversationIds[0];
  if (!firstConvId) return undefined;
  return ALL_CONVERSATIONS[firstConvId];
}

/**
 * Flag-aware conversation selection. NPCs with `conversationRules` progress
 * through their dialogue arc (intro once, then trial/lore/etc. as flags
 * unlock); NPCs without rules fall back to their first conversation.
 */
export function getConversationForNpc(
  npcId: string,
  questFlags: Record<string, boolean | number | string>,
): DialogueConversation | undefined {
  const npc = NPC_BY_ID.get(npcId);
  if (!npc) return undefined;

  if (npc.conversationRules?.length) {
    for (const rule of npc.conversationRules) {
      if (rule.requireFlag && !questFlags[rule.requireFlag]) continue;
      if (rule.hideIfFlag && questFlags[rule.hideIfFlag]) continue;
      const conv = ALL_CONVERSATIONS[rule.id];
      if (conv) return conv;
    }
  }
  return getDefaultConversationForNpc(npcId);
}

/** Visual quest-state for an NPC's zone marker — see HotspotButton in ZoneView. */
export type NpcQuestState = "none" | "available" | "active" | "ready";

const QUEST_STATE_RANK: Record<NpcQuestState, number> = {
  none: 0,
  active: 1,
  available: 2,
  ready: 3,
};

/**
 * Derives whether an NPC currently has a quest to offer, in progress, or
 * ready to turn in — with NO manual per-NPC linkage. A quest is associated
 * with an NPC when they share a zoneId AND the NPC's conversationRules gate
 * on one of the quest's objective flags (the same flags dialogue
 * consequences set to drive auto-tracking in game-store). This means any
 * new quest+NPC pair authored with the existing flag-driven pattern (see
 * quest_dreshdae_debt / npc_dreshdae_senna) gets a marker for free.
 */
export function getNpcQuestState(
  npcId: string,
  world: {
    questFlags: Record<string, boolean | number | string>;
    activeQuests: string[];
    completedQuests: string[];
  },
): NpcQuestState {
  const npc = NPC_BY_ID.get(npcId);
  if (!npc?.conversationRules?.length) return "none";

  const npcFlags = new Set<string>();
  for (const rule of npc.conversationRules) {
    if (rule.requireFlag) npcFlags.add(rule.requireFlag);
    if (rule.hideIfFlag) npcFlags.add(rule.hideIfFlag);
  }

  const completedSet = new Set(world.completedQuests);
  let best: NpcQuestState = "none";
  for (const quest of ALL_QUESTS) {
    if (quest.zoneId !== npc.zoneId) continue;
    if (completedSet.has(quest.id)) continue;
    if (!quest.objectives.some((o) => npcFlags.has(o.flagKey))) continue;

    let state: NpcQuestState = "none";
    if (world.activeQuests.includes(quest.id)) {
      state = isQuestComplete(quest, world.questFlags) ? "ready" : "active";
    } else if (isQuestAvailable(quest, completedSet)) {
      state = "available";
    }
    if (QUEST_STATE_RANK[state] > QUEST_STATE_RANK[best]) best = state;
  }
  return best;
}
