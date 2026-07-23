/**
 * Stance transitions (Complementary Loop 2 / Idea CL2-A).
 *
 * Switching stance mid-combat costs Force Points and applies a short
 * "Reposition" debuff (−10% damage for 1 turn). Some transitions are
 * synergistic: aggressive→frenzy is cheap; defensive→aggressive is
 * expensive.
 *
 * Returns the {fpCost, repositionPenalty} for the requested swap.
 */

import type { Stance } from "../combat/damage";

const FP_COST_MATRIX: Record<Stance, Record<Stance, number>> = {
  aggressive: { aggressive: 0, defensive: 8, precision: 5, frenzy: 3, riposte: 6 },
  defensive:  { aggressive: 8, defensive: 0, precision: 5, frenzy: 10, riposte: 3 },
  precision:  { aggressive: 4, defensive: 4, precision: 0, frenzy: 6, riposte: 4 },
  frenzy:     { aggressive: 2, defensive: 10, precision: 6, frenzy: 0, riposte: 8 },
  riposte:    { aggressive: 5, defensive: 3, precision: 4, frenzy: 8, riposte: 0 },
};

const SYNERGY_DISCOUNT: Record<string, number> = {
  "aggressive->frenzy":  0.5,
  "defensive->riposte":  0.5,
  "frenzy->aggressive":  0.5,
  "riposte->defensive":  0.5,
};

export interface StanceTransitionCost {
  fpCost: number;
  /** −10% damage for 1 turn, applied on transition. */
  repositionPenalty: boolean;
}

export function stanceTransitionCost(from: Stance, to: Stance): StanceTransitionCost {
  if (from === to) return { fpCost: 0, repositionPenalty: false };
  const base = FP_COST_MATRIX[from][to];
  const discount = SYNERGY_DISCOUNT[`${from}->${to}`] ?? 1;
  return {
    fpCost: Math.ceil(base * discount),
    repositionPenalty: true,
  };
}
