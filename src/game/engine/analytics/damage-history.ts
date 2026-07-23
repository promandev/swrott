/**
 * Damage history aggregation (Idea #21).
 *
 * Derives a per-turn damage summary from the combat log so the
 * post-combat screen can render a chart without modifying the live
 * combat store.
 */

import type { CombatLogEntry } from "../combat/combat-store";

export interface TurnDamageBucket {
  turn: number;
  dmgDealt: number;
  dmgTaken: number;
  crits: number;
  misses: number;
}

export function aggregateDamageByTurn(log: CombatLogEntry[], playerId: string): TurnDamageBucket[] {
  const map = new Map<number, TurnDamageBucket>();
  for (const e of log) {
    if (!e.result) continue;
    const bucket = map.get(e.turn) ?? { turn: e.turn, dmgDealt: 0, dmgTaken: 0, crits: 0, misses: 0 };
    const dmg = e.result.finalDamage ?? 0;
    if (e.actorId === playerId) {
      bucket.dmgDealt += dmg;
      if (e.result.isCrit) bucket.crits += 1;
      if (e.result.isMiss) bucket.misses += 1;
    } else if (e.targetId === playerId) {
      bucket.dmgTaken += dmg;
    }
    map.set(e.turn, bucket);
  }
  return [...map.values()].sort((a, b) => a.turn - b.turn);
}

export interface CombatSummaryStats {
  totalDmgDealt: number;
  totalDmgTaken: number;
  peakTurnDmg: number;
  critRate: number;
  missRate: number;
  durationTurns: number;
}

export function summarizeCombat(buckets: TurnDamageBucket[]): CombatSummaryStats {
  let totalDmgDealt = 0, totalDmgTaken = 0, peak = 0, crits = 0, misses = 0, attacks = 0;
  for (const b of buckets) {
    totalDmgDealt += b.dmgDealt;
    totalDmgTaken += b.dmgTaken;
    if (b.dmgDealt > peak) peak = b.dmgDealt;
    crits += b.crits;
    misses += b.misses;
    attacks += b.crits + b.misses + (b.dmgDealt > 0 ? 1 : 0);
  }
  return {
    totalDmgDealt,
    totalDmgTaken,
    peakTurnDmg: peak,
    critRate: attacks > 0 ? crits / attacks : 0,
    missRate: attacks > 0 ? misses / attacks : 0,
    durationTurns: buckets.length,
  };
}
