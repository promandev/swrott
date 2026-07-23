import type { RNG } from "../rng/rng";

/**
 * Turn order resolver.
 *
 * Source: Master Design Bible §4 → "Turnos".
 *   Initiative = Agility + Gear + Buffs + Roll(1..10)
 *
 * Higher initiative acts first. Ties broken by RNG.
 */

export interface CombatantInitiativeInput {
  id: string;
  agility: number;
  gearInitiative: number;
  buffInitiative: number;
}

export interface TurnEntry {
  id: string;
  initiative: number;
}

export function rollInitiative(
  combatants: readonly CombatantInitiativeInput[],
  rng: RNG,
): TurnEntry[] {
  return combatants
    .map((c) => ({
      id: c.id,
      initiative:
        c.agility + c.gearInitiative + c.buffInitiative + rng.int(1, 10),
      tiebreaker: rng.next(),
    }))
    .sort((a, b) => {
      if (b.initiative !== a.initiative) return b.initiative - a.initiative;
      return b.tiebreaker - a.tiebreaker;
    })
    .map(({ id, initiative }) => ({ id, initiative }));
}
