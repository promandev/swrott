/**
 * Faction reputation modifiers (Complementary Loop 5 / Idea CL5-B).
 *
 * Reputation tiers shape vendor prices, quest availability, and patrol
 * hostility. Each faction has reputation in [-100..+100].
 */

import type { FactionId } from "../../data/schemas";

export const REPUTATION_MIN = -100;
export const REPUTATION_MAX = +100;

export type ReputationTier = "hated" | "hostile" | "neutral" | "friendly" | "allied" | "exalted";

export function tierFromReputation(rep: number): ReputationTier {
  if (rep <= -75) return "hated";
  if (rep <= -25) return "hostile";
  if (rep <   25) return "neutral";
  if (rep <   60) return "friendly";
  if (rep <   90) return "allied";
  return "exalted";
}

/** Vendor price multiplier — friendly factions sell cheaper, hostile gouge or refuse. */
export function priceMultiplier(rep: number): number {
  const tier = tierFromReputation(rep);
  switch (tier) {
    case "hated":    return Number.POSITIVE_INFINITY; // refuse
    case "hostile":  return 2.0;
    case "neutral":  return 1.0;
    case "friendly": return 0.9;
    case "allied":   return 0.8;
    case "exalted":  return 0.7;
  }
}

/** Whether a faction will engage the player on sight. */
export function isHostileToPlayer(rep: number): boolean {
  return tierFromReputation(rep) === "hated" || tierFromReputation(rep) === "hostile";
}

/**
 * How many factions are actively hunting the player, weighted — a "hated"
 * faction counts double a merely "hostile" one. Drives ambush frequency and
 * the HUD's "Hunted" indicator: anger the galaxy and it hits back.
 */
export function huntedLevel(reps: Record<string, number>): number {
  let n = 0;
  for (const rep of Object.values(reps)) {
    const tier = tierFromReputation(rep);
    if (tier === "hated") n += 2;
    else if (tier === "hostile") n += 1;
  }
  return n;
}

/** Multiplier applied to a zone's random-encounter chance based on hunted level. */
export function encounterDangerMultiplier(reps: Record<string, number>): number {
  return Math.min(2.0, 1 + huntedLevel(reps) * 0.2);
}

export interface FactionReward {
  factionId: FactionId;
  amount: number;
}

/** Apply a faction reward, also applying opposing-faction penalty. */
const OPPOSING_FACTIONS: Partial<Record<FactionId, FactionId>> = {
  sith_academy:        "hidden_jedi",
  hidden_jedi:         "sith_academy",
  cult_of_nihilus:     "hidden_jedi",
  mandalorian_houses:  "smuggler_guild",
};

export function applyFactionReward(
  reputations: Record<FactionId, number>,
  reward: FactionReward,
): Record<FactionId, number> {
  const next = { ...reputations };
  next[reward.factionId] = Math.max(REPUTATION_MIN, Math.min(REPUTATION_MAX, (next[reward.factionId] ?? 0) + reward.amount));
  const opp = OPPOSING_FACTIONS[reward.factionId];
  if (opp) {
    const penalty = Math.floor(reward.amount * 0.5);
    next[opp] = Math.max(REPUTATION_MIN, Math.min(REPUTATION_MAX, (next[opp] ?? 0) - penalty));
  }
  return next;
}
