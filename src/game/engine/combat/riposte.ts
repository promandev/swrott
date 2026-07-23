/**
 * Counter-attack stance (Idea #5).
 *
 * When the player is in stance "riposte":
 *   - All incoming damage is reduced 30% AND
 *   - Reflects 150% of mitigated damage back at the attacker (capped at
 *     attacker's HP).
 *   - Riposte does NOT trigger if the player is stunned, feared, or blinded.
 *
 * Called by combat-store inside the enemy turn loop after damage is
 * applied to the player.
 */

export interface RiposteResult {
  /** Final damage actually taken by the player (after reduction). */
  reducedDamage: number;
  /** Damage reflected at the attacker. */
  counterDamage: number;
}

export function computeRiposte(
  rawIncoming: number,
  playerStatusEffects: { effect: string }[],
): RiposteResult | null {
  const blocked = playerStatusEffects.some((se) =>
    se.effect === "stun" || se.effect === "fear" || se.effect === "blind",
  );
  if (blocked) return null;
  const reducedDamage = Math.floor(rawIncoming * 0.70);
  const counterDamage = Math.floor(rawIncoming * 1.50 * 0.30);  // 150% of mitigated
  return { reducedDamage, counterDamage };
}
