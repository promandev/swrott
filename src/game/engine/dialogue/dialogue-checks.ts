/**
 * Dialogue skill checks (Complementary Loop 5 / Idea CL5-C).
 *
 * Dialogue options gated by primary stats / influence / corruption /
 * faction reputation. Provides a deterministic check helper.
 */

import type { CharacterSnapshot } from "../save/types";
import type { FactionId } from "../../data/schemas";

export interface DialogueCheck {
  /** At least one of these must pass; missing means always pass. */
  any?: DialogueRequirement[];
  /** All of these must pass. */
  all?: DialogueRequirement[];
}

export type DialogueRequirement =
  | { kind: "influence"; min: number }
  | { kind: "corruption"; min?: number; max?: number }
  | { kind: "primary"; stat: keyof CharacterSnapshot["primary"]; min: number }
  | { kind: "level"; min: number }
  | { kind: "faction"; factionId: FactionId; min: number }
  | { kind: "questFlag"; flag: string; mustBeSet: boolean }
  | { kind: "hasItem"; itemId: string };

export interface DialogueCheckContext {
  character: CharacterSnapshot;
  questFlags: ReadonlySet<string>;
  factionRep: Record<FactionId, number>;
}

function checkRequirement(req: DialogueRequirement, ctx: DialogueCheckContext): boolean {
  switch (req.kind) {
    case "influence": return ctx.character.primary.influence >= req.min;
    case "corruption": {
      const c = ctx.character.primary.corruption;
      if (req.min !== undefined && c < req.min) return false;
      if (req.max !== undefined && c > req.max) return false;
      return true;
    }
    case "primary": return (ctx.character.primary[req.stat] ?? 0) >= req.min;
    case "level": return ctx.character.level >= req.min;
    case "faction": return (ctx.factionRep[req.factionId] ?? 0) >= req.min;
    case "questFlag": return ctx.questFlags.has(req.flag) === req.mustBeSet;
    case "hasItem": return ctx.character.inventory.some((i) => i.itemId === req.itemId);
  }
}

export function passesDialogueCheck(check: DialogueCheck, ctx: DialogueCheckContext): boolean {
  if (check.all && !check.all.every((r) => checkRequirement(r, ctx))) return false;
  if (check.any && !check.any.some((r) => checkRequirement(r, ctx))) return false;
  return true;
}

/** Describe requirements for UI display (hover tooltips). */
export function describeRequirement(req: DialogueRequirement): string {
  switch (req.kind) {
    case "influence": return `Requires Influence ${req.min}+`;
    case "corruption": {
      const parts: string[] = [];
      if (req.min !== undefined) parts.push(`Corruption ≥ ${req.min}`);
      if (req.max !== undefined) parts.push(`Corruption ≤ ${req.max}`);
      return parts.join(", ");
    }
    case "primary": return `Requires ${req.stat.toUpperCase()} ${req.min}+`;
    case "level": return `Requires Level ${req.min}+`;
    case "faction": return `Requires ${req.factionId} reputation ${req.min}+`;
    case "questFlag": return req.mustBeSet ? `Requires flag: ${req.flag}` : `Requires flag NOT set: ${req.flag}`;
    case "hasItem": return `Requires item: ${req.itemId}`;
  }
}
