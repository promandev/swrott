/**
 * Trial leaderboard scoring (Complementary Loop 4 / Idea CL4-A).
 *
 * Computes a deterministic score for a completed trial run. Used for
 * weekly leaderboards and personal-best tracking.
 *
 *   base = wavesCleared * 1000
 *   timeBonus = max(0, 600 - turnsTaken) * 10
 *   noDeathBonus = noDeath ? 5000 : 0
 *   modifierBonus = activeRuleIds.length * 500
 *   damageRatio = totalDmgDealt / max(1, totalDmgTaken)  (capped at 10)
 *   masteryBonus = floor(damageRatio * 200)
 *   total = base + timeBonus + noDeathBonus + modifierBonus + masteryBonus
 */

export interface TrialRunStats {
  trialId: string;
  wavesCleared: number;
  totalWaves: number;
  turnsTaken: number;
  totalDmgDealt: number;
  totalDmgTaken: number;
  noDeath: boolean;
  activeRuleIds: string[];
  mutatorIds: string[];
}

export interface TrialScore {
  total: number;
  base: number;
  timeBonus: number;
  noDeathBonus: number;
  modifierBonus: number;
  masteryBonus: number;
  rank: "S" | "A" | "B" | "C" | "D";
}

export function scoreTrialRun(stats: TrialRunStats): TrialScore {
  const base = stats.wavesCleared * 1000;
  const timeBonus = Math.max(0, 600 - stats.turnsTaken) * 10;
  const noDeathBonus = stats.noDeath ? 5000 : 0;
  const modifierBonus = stats.activeRuleIds.length * 500 + stats.mutatorIds.length * 800;
  const ratio = Math.min(10, stats.totalDmgDealt / Math.max(1, stats.totalDmgTaken));
  const masteryBonus = Math.floor(ratio * 200);
  const total = base + timeBonus + noDeathBonus + modifierBonus + masteryBonus;

  let rank: TrialScore["rank"] = "D";
  if (total >= 25000) rank = "S";
  else if (total >= 15000) rank = "A";
  else if (total >= 8000) rank = "B";
  else if (total >= 3000) rank = "C";

  return { total, base, timeBonus, noDeathBonus, modifierBonus, masteryBonus, rank };
}
