/**
 * Combat positioning & flanking (Idea #2).
 *
 * Each combatant has a position on a small abstract grid:
 *   slots: -3 -2 -1  0  +1 +2 +3  (player at -1..-3, enemies at +1..+3)
 *   facing: "right" | "left"
 *
 * Attacking from BEHIND (target's facing is away from attacker) grants:
 *   - +25% crit chance
 *   - +20% damage
 * Attacking from FLANK (perpendicular) grants:
 *   - +10% crit chance
 *
 * Some skills (Shadow Step, Voidstrike) auto-teleport to a position behind
 * the target; others (defiant_roar) realign enemy facing.
 */

export type Facing = "left" | "right";

export interface CombatPosition {
  slot: number;        // grid index
  facing: Facing;
}

export interface PositionalAttack {
  attackerSlot: number;
  targetSlot: number;
  targetFacing: Facing;
}

export type AttackAngle = "front" | "flank" | "back";

export function classifyAngle(p: PositionalAttack): AttackAngle {
  // Attacker is to the "left" of target (slot < targetSlot) if attacking from left.
  const fromLeft = p.attackerSlot < p.targetSlot;
  if (p.targetFacing === "left" && fromLeft) return "front";
  if (p.targetFacing === "right" && !fromLeft) return "front";
  if (p.attackerSlot === p.targetSlot) return "flank"; // same column (rare)
  return "back";
}

export interface PositionalBonus {
  critBonus: number;
  damageMult: number;
  description: string;
}

export function positionalBonus(angle: AttackAngle): PositionalBonus {
  switch (angle) {
    case "back":  return { critBonus: 0.25, damageMult: 1.20, description: "Por la espalda" };
    case "flank": return { critBonus: 0.10, damageMult: 1.05, description: "Flanco" };
    default:      return { critBonus: 0,    damageMult: 1.0,  description: "Frontal" };
  }
}
