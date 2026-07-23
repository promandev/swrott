/**
 * Momentum / combo points (Complementary Loop 2 / Idea CL2-C).
 *
 * Each combat the player accrues Momentum (0-100). Sources:
 *   - landing a hit       +5
 *   - critical hit        +10
 *   - kill                +25
 *   - using a chain       +20
 *   - taking damage       −10
 *   - missing             −5
 *
 * At 100, the next skill is auto-crit and refunds its FP cost; the
 * meter resets to 0. Some skills consume momentum (50-100) for bonus
 * effects.
 */

export const MOMENTUM_MAX = 100;
export const MOMENTUM_AUTOCRIT_THRESHOLD = 100;

export const MOMENTUM_DELTAS = {
  hit:        5,
  crit:      10,
  kill:      25,
  chain:     20,
  takenHit: -10,
  miss:      -5,
} as const;

export function applyMomentum(current: number, delta: number): number {
  return Math.max(0, Math.min(MOMENTUM_MAX, current + delta));
}

export interface MomentumConsumer {
  thresholdRequired: number;
  effectSummary: string;
}

/** Skills that can spend Momentum for bonus effects. */
export const MOMENTUM_CONSUMERS: Record<string, MomentumConsumer> = {
  execute:              { thresholdRequired:  50, effectSummary: "Daño +50% (consume 50)." },
  phantom_execution:    { thresholdRequired:  75, effectSummary: "Siempre crítico, área (consume 75)." },
  nihilus_hunger:       { thresholdRequired: 100, effectSummary: "Curación completa al matar (consume 100)." },
  voidstrike:           { thresholdRequired:  50, effectSummary: "Ignora la armadura (consume 50)." },
  rage_burst:           { thresholdRequired:  50, effectSummary: "Hiende a todos los enemigos (consume 50)." },
};

export function canSpendMomentum(current: number, skillId: string): boolean {
  const c = MOMENTUM_CONSUMERS[skillId];
  if (!c) return false;
  return current >= c.thresholdRequired;
}
