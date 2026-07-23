/**
 * Companion affinity (Complementary Loop 5 / Idea CL5-A).
 *
 * Tracks per-companion relationship score (-100..+100). Affects:
 *   - dialogue branches available
 *   - companion-only quests
 *   - combat passive bonus (max +15% damage at +100, −15% at −100)
 *   - betrayal trigger at −80 (companion may attack the player)
 */

export interface CompanionAffinity {
  companionId: string;
  affinity: number;          // -100..+100
  unlockedQuests: string[];
  romanceLocked?: boolean;
}

export const AFFINITY_MIN = -100;
export const AFFINITY_MAX = +100;
export const BETRAYAL_THRESHOLD = -80;
export const ROMANCE_UNLOCK_THRESHOLD = 75;
export const COMPANION_QUEST_THRESHOLDS = [25, 50, 75, 100] as const;

export function adjustAffinity(current: number, delta: number): number {
  return Math.max(AFFINITY_MIN, Math.min(AFFINITY_MAX, current + delta));
}

export function combatAffinityBonus(affinity: number): number {
  // Linear: −100 → −0.15, 0 → 0, +100 → +0.15
  return (affinity / 100) * 0.15;
}

export function checkBetrayal(affinity: number): boolean {
  return affinity <= BETRAYAL_THRESHOLD;
}

export function questUnlocked(affinity: number, questThreshold: number): boolean {
  return affinity >= questThreshold;
}
