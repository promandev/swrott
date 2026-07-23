import type { ClassId } from "../../data/schemas";

/**
 * Sith rank — the visible thread of the player's ascent through the Order.
 * Derived from level (raw power) with a corruption-driven epithet, so the
 * character demonstrably evolves Acolyte → Apprentice → Lord → Darth as the
 * main arc progresses. Pure + dependency-light so the HUD, sheet and dialogue
 * can all read the same source of truth.
 */

export interface SithRank {
  /** Tier index 0..4 — drives gating/colours. */
  tier: number;
  /** Base rank, e.g. "Acolyte", "Darth". */
  rank: string;
  /** Optional dark-side epithet earned through corruption, e.g. "the Cruel". */
  epithet: string | null;
  /** Full display title, e.g. "Darth, the Merciless". */
  title: string;
}

const CLASS_RANK: Record<ClassId, string> = {
  marauder: "Sith Warrior",
  inquisitor: "Sith Inquisitor",
  assassin: "Sith Assassin",
};

/** Tier thresholds by level. */
function tierForLevel(level: number): number {
  if (level >= 23) return 4; // Darth
  if (level >= 16) return 3; // Sith Lord
  if (level >= 10) return 2; // full class rank
  if (level >= 5) return 1;  // Apprentice
  return 0;                  // Acolyte
}

/** Corruption-earned epithet (only once the player is deep enough in darkness). */
function epithetForCorruption(corruption: number): string | null {
  if (corruption >= 85) return "the Merciless";
  if (corruption >= 60) return "the Cruel";
  if (corruption >= 35) return "the Ruthless";
  return null;
}

export function getSithRank(
  classId: ClassId,
  level: number,
  corruption: number,
): SithRank {
  const tier = tierForLevel(level);
  const rank =
    tier === 4 ? "Darth"
    : tier === 3 ? "Sith Lord"
    : tier === 2 ? CLASS_RANK[classId]
    : tier === 1 ? "Sith Apprentice"
    : "Sith Acolyte";
  const epithet = tier >= 2 ? epithetForCorruption(corruption) : null;
  const title = epithet ? `${rank}, ${epithet}` : rank;
  return { tier, rank, epithet, title };
}

const TIER_COLORS = ["text-ash-300", "text-ash-200", "text-gilt-400", "text-gilt-300", "text-blood-300"];
export function rankColor(tier: number): string {
  return TIER_COLORS[Math.max(0, Math.min(TIER_COLORS.length - 1, tier))]!;
}
