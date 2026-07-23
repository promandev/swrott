import type { ClassId, FactionId } from "../../data/schemas";
import { getSithRank } from "../progression/rank";

/**
 * Dialogue system — §19 "Sistema de Diálogos".
 *
 * Node-graph based. Each conversation is a tree of nodes with
 * player choices (options) that link to other nodes. Options can
 * have skill checks, flag requirements, and consequences.
 */

// ─── Types ─────────────────────────────────────────────────────────────

export interface DialogueCheck {
  type: "influence" | "corruption" | "force" | "strength" | "agility" | "faction" | "flag" | "item" | "class" | "rank";
  /** For stat checks: minimum value needed. For `rank`: minimum Sith tier (0-4). */
  value?: number;
  /** For faction checks: faction ID. */
  factionId?: FactionId;
  /** For flag checks: flag key. */
  flagKey?: string;
  /** For item checks: item ID the player must have. */
  itemId?: string;
  /** For class checks: required class. */
  classId?: ClassId;
}

export interface DialogueConsequence {
  type: "set_flag" | "add_xp" | "add_credits" | "add_item" | "remove_item" | "faction_rep" | "start_quest" | "complete_quest" | "start_combat" | "corruption_change" | "companion_affinity" | "open_shop";
  key?: string;
  value?: number | string | boolean;
  factionId?: FactionId;
  itemId?: string;
  questId?: string;
  companionId?: string;
  combatEncounterId?: string;
  /** For open_shop: which merchant shop to open. */
  shopId?: string;
  /**
   * Stamped by the dialogue runtime: `${conversationId}:${optionId}` (or
   * `${conversationId}:enter:${nodeId}` for onEnter consequences). Lets the
   * consequence applier grant one-time rewards only once, so re-opening a
   * conversation can't farm the same XP / items / credits repeatedly.
   */
  sourceId?: string;
}

export interface DialogueOption {
  id: string;
  text: string;
  /** If present, option only shows when check passes. */
  check?: DialogueCheck;
  /** Label shown when check exists, e.g. "[Force 6]" */
  checkLabel?: string;
  /** Consequences triggered when this option is chosen. */
  consequences: DialogueConsequence[];
  /** Next node ID to navigate to. null = end conversation. */
  nextNodeId: string | null;
  /** Dark side / light side alignment hint for UI coloring. */
  tone?: "neutral" | "dark" | "light" | "aggressive" | "deceptive";
}

export interface DialogueNode {
  id: string;
  /** NPC speaker name. null for narrator. */
  speaker: string | null;
  /** Main dialogue text. */
  text: string;
  /** Player response options. Empty = auto-advance or end. */
  options: DialogueOption[];
  /** Consequences triggered when reaching this node (before player chooses). */
  onEnter?: DialogueConsequence[];
  /** Next node ID if no options (auto-advance). null = end. */
  autoNext?: string | null;
}

export interface DialogueConversation {
  id: string;
  /** Starting node ID. */
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

// ─── Runtime ───────────────────────────────────────────────────────────

export interface DialogueContext {
  playerLevel: number;
  playerClassId: ClassId;
  primary: {
    strength: number;
    agility: number;
    endurance: number;
    force: number;
    influence: number;
    corruption: number;
  };
  factionRep: Record<FactionId, number>;
  questFlags: Record<string, boolean | number | string>;
  inventory: Array<{ itemId: string; qty: number }>;
}

/** Check if a dialogue check passes given the player context. */
export function checkPasses(check: DialogueCheck, ctx: DialogueContext): boolean {
  const val = check.value ?? 0;
  switch (check.type) {
    case "influence":
      return ctx.primary.influence >= val;
    case "corruption":
      return ctx.primary.corruption >= val;
    case "force":
      return ctx.primary.force >= val;
    case "strength":
      return ctx.primary.strength >= val;
    case "agility":
      return ctx.primary.agility >= val;
    case "faction":
      if (!check.factionId) return false;
      return (ctx.factionRep[check.factionId] ?? 0) >= val;
    case "flag":
      if (!check.flagKey) return false;
      return !!ctx.questFlags[check.flagKey];
    case "item":
      if (!check.itemId) return false;
      return ctx.inventory.some((i) => i.itemId === check.itemId && i.qty > 0);
    case "class":
      return ctx.playerClassId === check.classId;
    case "rank":
      return getSithRank(ctx.playerClassId, ctx.playerLevel, ctx.primary.corruption).tier >= val;
    default:
      return false;
  }
}

/** Filter options to only those whose checks pass (or have no check). */
export function getAvailableOptions(
  node: DialogueNode,
  ctx: DialogueContext,
): DialogueOption[] {
  return node.options.filter(
    (opt) => !opt.check || checkPasses(opt.check, ctx),
  );
}
