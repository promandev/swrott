/**
 * Achievement checker (Idea #23).
 *
 * Idempotent helpers — given a snapshot of player + counters, returns
 * the set of achievement ids that are NOW satisfied but not yet in the
 * `unlockedAchievements` set.
 */

import type { CharacterSnapshot } from "../save/types";
import { ACHIEVEMENTS } from "../../data/achievements/achievements";

export interface AchievementCheckContext {
  character: CharacterSnapshot;
  unlocked: ReadonlySet<string>;
  /** Counter snapshots (passed in by combat-store / game-store). */
  totals?: {
    enemiesKilled?: number;
    legendariesOwned?: number;
    questsCompleted?: number;
    critsInLastCombat?: number;
    tookDamageInLastCombat?: boolean;
    chainsUsed?: ReadonlySet<string>;
    specsUnlocked?: number;
    specsTotal?: number;
    zonesClearedKorriban?: boolean;
    cameFromCorruptionAbove60?: boolean;
  };
}

export function checkAchievements(ctx: AchievementCheckContext): string[] {
  const { character, unlocked, totals = {} } = ctx;
  const newlyUnlocked: string[] = [];
  const add = (id: string) => { if (!unlocked.has(id)) newlyUnlocked.push(id); };

  // Tier 1
  if ((totals.enemiesKilled ?? 0) >= 1) add("first_blood");
  if (character.level >= 5) add("level_5");
  if ((totals.legendariesOwned ?? 0) >= 1) add("first_legendary");
  if ((totals.questsCompleted ?? 0) >= 1) add("first_quest");
  if (totals.zonesClearedKorriban) add("korriban_cleared");

  // Tier 2
  if (totals.tookDamageInLastCombat === false) add("no_damage_win");
  if ((totals.critsInLastCombat ?? 0) >= 10) add("ten_crits_one_fight");
  if (totals.chainsUsed && totals.chainsUsed.size >= 5) add("use_all_chains");
  if ((totals.legendariesOwned ?? 0) >= 10) add("ten_legendaries");
  if (character.primary.corruption >= 100) add("max_corruption");
  if (totals.cameFromCorruptionAbove60 && character.primary.corruption === 0) add("min_corruption");
  if (character.level >= 25) add("level_25");
  if (
    totals.specsUnlocked && totals.specsTotal &&
    totals.specsUnlocked >= totals.specsTotal
  ) add("all_specs");

  // Tier 3
  if (character.prestige >= 1) add("first_prestige");
  if (character.ngPlus >= 5) add("ng_plus_5");
  if (character.memoryShards.length >= 20) add("all_shards");

  // Meta — Inevitable: every *other* achievement unlocked
  const otherIds = ACHIEVEMENTS.filter((a) => a.id !== "all_achievements").map((a) => a.id);
  const futureSet = new Set<string>([...unlocked, ...newlyUnlocked]);
  if (otherIds.every((id) => futureSet.has(id))) add("all_achievements");

  return newlyUnlocked;
}
