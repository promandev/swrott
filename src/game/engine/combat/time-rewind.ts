/**
 * Time Rewind (Idea #4).
 *
 * Relics from the ancient_sith set grant 1 charge per combat. Activating
 * rewinds the LAST player turn — restoring HP, FP, cooldowns, status effects
 * and the enemy state from a snapshot taken at the start of the player's
 * previous action.
 *
 * The snapshot is taken automatically by the combat-store before each
 * player action, kept as a single slot (last action only).
 */

import type { Combatant, CombatLogEntry, PendingLootDrop } from "./combat-store";

export interface TimeSnapshot {
  turnNumber: number;
  player: Combatant;
  enemies: Combatant[];
  log: CombatLogEntry[];
  pendingLoot: PendingLootDrop[];
  xpReward: number;
  creditReward: number;
}

export function snapshotCombat(state: {
  turnNumber: number;
  player: Combatant | null;
  enemies: Combatant[];
  log: CombatLogEntry[];
  pendingLoot: PendingLootDrop[];
  xpReward: number;
  creditReward: number;
}): TimeSnapshot | null {
  if (!state.player) return null;
  return {
    turnNumber: state.turnNumber,
    player: deepCloneCombatant(state.player),
    enemies: state.enemies.map(deepCloneCombatant),
    log: state.log.slice(),
    pendingLoot: state.pendingLoot.map((l) => ({ ...l })),
    xpReward: state.xpReward,
    creditReward: state.creditReward,
  };
}

function deepCloneCombatant(c: Combatant): Combatant {
  return {
    ...c,
    primary: { ...c.primary },
    statusEffects: c.statusEffects.map((se) => ({ ...se })),
    skillIds: c.skillIds.slice(),
    cooldowns: { ...c.cooldowns },
  };
}
