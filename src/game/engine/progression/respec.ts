/**
 * Respec scrolls (Complementary Loop 3 / Idea CL3-B).
 *
 * Lets the player redistribute talent points / attribute points / specs
 * mid-run without prestiging. Comes in three flavors:
 *
 *   scroll_respec_talents     refunds talent points
 *   scroll_respec_attributes  refunds attribute points
 *   scroll_respec_spec        refunds spec choice
 *   scroll_respec_full        refunds everything (rare, vendor: 50k)
 *
 * Each scroll has a base cost + escalating cost on repeated use within the
 * same level bracket.
 */

import type { CharacterSnapshot } from "../save/types";

export type RespecKind = "talents" | "attributes" | "spec" | "full";

export interface RespecCost {
  credits: number;
  darkTokens: number;
  corruptionGain: number;
}

const BASE_COSTS: Record<RespecKind, RespecCost> = {
  talents:    { credits: 1500,  darkTokens: 0, corruptionGain: 1 },
  attributes: { credits: 3000,  darkTokens: 1, corruptionGain: 2 },
  spec:       { credits: 7500,  darkTokens: 3, corruptionGain: 4 },
  full:       { credits: 20000, darkTokens: 7, corruptionGain: 8 },
};

export function respecCost(kind: RespecKind, character: CharacterSnapshot): RespecCost {
  const base = BASE_COSTS[kind];
  const levelScale = 1 + Math.max(0, character.level - 10) * 0.05;
  return {
    credits: Math.floor(base.credits * levelScale),
    darkTokens: base.darkTokens,
    corruptionGain: base.corruptionGain,
  };
}

export interface RespecResult {
  refundedTalentPoints: number;
  refundedAttributePoints: number;
  refundedSpec: boolean;
}

/** Apply a respec in place. Returns what was refunded. */
export function applyRespec(character: CharacterSnapshot, kind: RespecKind): RespecResult {
  const result: RespecResult = { refundedTalentPoints: 0, refundedAttributePoints: 0, refundedSpec: false };
  if (kind === "talents" || kind === "full") {
    result.refundedTalentPoints = character.talents.length;
    character.talents = [];
    character.talentPoints += result.refundedTalentPoints;
  }
  if (kind === "attributes" || kind === "full") {
    // Hard to know exactly how many points were spent — refund based on level
    const spent = Math.max(0, character.level - 1) * 2;
    result.refundedAttributePoints = spent;
    character.attributePoints += spent;
  }
  if (kind === "spec" || kind === "full") {
    if (character.specId) {
      character.specId = undefined;
      result.refundedSpec = true;
    }
  }
  return result;
}
