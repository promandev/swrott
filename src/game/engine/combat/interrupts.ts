/**
 * Interrupt windows (Idea #3).
 *
 * Some enemy skills have a "wind-up" phase: when the AI picks one, it
 * announces it and resolves on the NEXT turn. During the wind-up turn the
 * player can use any damaging skill on that enemy to INTERRUPT — the
 * enemy's spell fizzles and they're stunned for 1 turn.
 *
 * Skills with a wind-up are flagged on the registry side via `cost.windup`.
 *
 * Combat-store integration:
 *   - enemy.pendingSkillId: string | null
 *   - tickWindup() decrements; if untouched at zero, fires
 *   - player attack while pendingSkillId !== null sets enemy stun and clears
 */

export interface InterruptState {
  /** Skill id the enemy is winding up. */
  pendingSkillId: string | null;
  /** Turns left until it fires. */
  windupRemaining: number;
}

export const INTERRUPTIBLE_SKILLS = new Set<string>([
  "force_storm",
  "nihilus_hunger",
  "corruption_aura",
  "berserkers_trance",
  "phantom_execution",
  "annihilation",
]);

export function isInterruptible(skillId: string): boolean {
  return INTERRUPTIBLE_SKILLS.has(skillId);
}
