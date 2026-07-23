/**
 * Leveling system — §3 "Progresión de Personaje".
 *
 * XP thresholds for levels 1-50.
 * Attribute points and talent points per level.
 * Level-up logic.
 */

/**
 * XP needed to reach each level (cumulative). Index = level.
 *
 * Rebalanced 2026-06: the old curve assumed quest XP that was never being
 * granted; thresholds are now ~15% lighter in Act I and ~35-40% lighter at
 * the top end so each planet's quests + encounters comfortably cover its
 * level band.
 */
export const XP_TABLE: readonly number[] = [
  // Act I: Korriban (1-10)
  0,        // Level 1 (start)
  100,      // Level 2
  250,      // Level 3
  500,      // Level 4
  850,      // Level 5
  1_300,    // Level 6
  1_900,    // Level 7
  2_650,    // Level 8
  3_550,    // Level 9
  4_600,    // Level 10
  // Act I.5/II: Dromund Kaas / Nar Shaddaa / Onderon (11-18)
  5_800,    // Level 11
  7_200,    // Level 12
  8_800,    // Level 13
  10_600,   // Level 14
  12_700,   // Level 15
  15_100,   // Level 16
  17_800,   // Level 17
  20_800,   // Level 18
  // Act III: Dxun / Dantooine (19-28)
  24_200,   // Level 19
  28_000,   // Level 20
  32_200,   // Level 21
  36_800,   // Level 22
  41_800,   // Level 23
  47_200,   // Level 24
  53_000,   // Level 25
  59_200,   // Level 26
  65_800,   // Level 27
  72_800,   // Level 28
  // Act IV: Telos (29-38)
  80_400,   // Level 29
  88_600,   // Level 30
  97_400,   // Level 31
  106_800,  // Level 32
  116_800,  // Level 33
  127_400,  // Level 34
  138_600,  // Level 35
  150_400,  // Level 36
  162_800,  // Level 37
  175_800,  // Level 38
  // Act V: Malachor V (39-50)
  189_600,  // Level 39
  204_200,  // Level 40
  219_600,  // Level 41
  235_800,  // Level 42
  252_800,  // Level 43
  270_600,  // Level 44
  289_200,  // Level 45
  308_600,  // Level 46
  328_800,  // Level 47
  349_800,  // Level 48
  371_600,  // Level 49
  394_200,  // Level 50
];

/** Attribute points awarded when reaching each level (index = level). */
export const ATTRIBUTE_POINTS_PER_LEVEL: readonly number[] = [
  0, // Level 1
  2, 2, 2, 3, 2, 2, 3, 2, 3,  // 2-10
  2, 2, 3, 2, 2, 3, 2, 2,     // 11-18
  3, 2, 2, 3, 2, 2, 3, 2, 2, 3, // 19-28 (bonus every 3rd)
  2, 3, 2, 2, 3, 2, 3, 2, 2, 3, // 29-38
  2, 3, 2, 3, 2, 3, 3, 2, 3, 3, 3, 4, // 39-50 (more generous endgame)
];

/** Talent points awarded when reaching each level (index = level). */
export const TALENT_POINTS_PER_LEVEL: readonly number[] = [
  0, // Level 1
  1, 1, 1, 1, 1, 1, 1, 1, 2,  // 2-10
  1, 1, 1, 1, 2, 1, 1, 1,     // 11-18
  1, 2, 1, 1, 1, 1, 2, 1, 1, 1, // 19-28
  2, 1, 1, 1, 2, 1, 2, 1, 1, 2, // 29-38
  1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 3, // 39-50
];

export const MAX_LEVEL = 50;

/** How much XP is needed to reach the given level (cumulative). */
export function xpForLevel(level: number): number {
  return XP_TABLE[Math.min(level, MAX_LEVEL)] ?? XP_TABLE[MAX_LEVEL]!;
}

/** Get XP needed to go from current level to next. */
export function xpToNextLevel(level: number, currentXp: number): number {
  if (level >= MAX_LEVEL) return 0;
  const needed = xpForLevel(level + 1);
  return Math.max(0, needed - currentXp);
}

/** XP progress fraction (0-1) toward next level. */
export function xpProgress(level: number, currentXp: number): number {
  if (level >= MAX_LEVEL) return 1;
  const prevThreshold = xpForLevel(level);
  const nextThreshold = xpForLevel(level + 1);
  const range = nextThreshold - prevThreshold;
  if (range <= 0) return 1;
  return Math.min(1, Math.max(0, (currentXp - prevThreshold) / range));
}

export interface LevelUpResult {
  newLevel: number;
  attributePointsGained: number;
  talentPointsGained: number;
  levelsGained: number;
}

/**
 * Check if player has leveled up and compute rewards.
 * May level up multiple times at once.
 */
export function checkLevelUp(
  currentLevel: number,
  currentXp: number,
): LevelUpResult | null {
  if (currentLevel >= MAX_LEVEL) return null;

  let newLevel = currentLevel;
  let attrPoints = 0;
  let talentPts = 0;

  while (newLevel < MAX_LEVEL && currentXp >= xpForLevel(newLevel + 1)) {
    newLevel++;
    attrPoints += ATTRIBUTE_POINTS_PER_LEVEL[newLevel] ?? 0;
    talentPts += TALENT_POINTS_PER_LEVEL[newLevel] ?? 0;
  }

  if (newLevel === currentLevel) return null;

  return {
    newLevel,
    attributePointsGained: attrPoints,
    talentPointsGained: talentPts,
    levelsGained: newLevel - currentLevel,
  };
}
