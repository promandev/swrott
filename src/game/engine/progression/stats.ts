/**
 * Core character stat formulas.
 *
 * Source: Master Design Bible §2 "Sistemas Base del Personaje".
 * These are pure functions — no side effects, easy to unit test.
 */

export interface PrimaryStats {
  strength: number;
  agility: number;
  endurance: number;
  force: number;
  influence: number;
  corruption: number;
}

export interface DerivedStats {
  hp: number;
  forcePoints: number;
  armorReduction: number; // 0..1
  critChance: number; // 0..1
  accuracy: number; // 0..1+
}

export function computeMaxHP(endurance: number, level: number): number {
  return 100 + endurance * 15 + level * 20;
}

export function computeMaxForce(force: number, level: number): number {
  return 50 + force * 12 + level * 8;
}

/**
 * Diminishing-returns armor reduction.
 * 250 armor ≈ 50% reduction; 750 armor ≈ 75%.
 */
export function computeArmorReduction(armor: number): number {
  if (armor <= 0) return 0;
  return armor / (armor + 250);
}

export function computeCritChance(agility: number, gearBonus = 0): number {
  return Math.min(1, (agility * 0.4 + gearBonus) / 100);
}

export function computeAccuracy(agility: number): number {
  return (85 + agility * 0.25) / 100;
}

export function deriveStats(
  primary: PrimaryStats,
  level: number,
  gearBonuses: { armor?: number; critBonus?: number } = {},
): DerivedStats {
  return {
    hp: computeMaxHP(primary.endurance, level),
    forcePoints: computeMaxForce(primary.force, level),
    armorReduction: computeArmorReduction(gearBonuses.armor ?? 0),
    critChance: computeCritChance(primary.agility, gearBonuses.critBonus ?? 0),
    accuracy: computeAccuracy(primary.agility),
  };
}

// ═══════════════════════════════════════════════════════════════════════
// Enemy Scaling Formulas
// Source: Advanced Implementation Proposals §1 "Enemy Scaling System"
// ═══════════════════════════════════════════════════════════════════════

/**
 * Scale enemy base HP to a specific zone level.
 *   scaledHP = baseHP + (zoneLevel * 12)
 */
export function scaleEnemyHP(baseHp: number, zoneLevel: number): number {
  return Math.floor(baseHp + zoneLevel * 12);
}

/**
 * Scale enemy base damage to a specific zone level.
 *   scaledDamage = baseDamage + (zoneLevel * 1.5)
 */
export function scaleEnemyDamage(baseDamage: number, zoneLevel: number): number {
  return Math.floor(baseDamage + zoneLevel * 1.5);
}

/**
 * Apply Elite modifier to an enemy's stats.
 * Elites have +30% HP and +20% effective damage.
 */
export function applyEliteScaling(baseHp: number, baseDamage: number) {
  return {
    hp: Math.floor(baseHp * 1.3),
    damage: Math.floor(baseDamage * 1.2),
  };
}

/**
 * Apply Corrupted modifier to an enemy.
 * Corrupted enemies deal +15% damage and have resistance to mental/force.
 */
export function applyCorruptedModifier(baseHp: number, baseDamage: number) {
  return {
    hp: Math.floor(baseHp * 1.1),
    damage: Math.floor(baseDamage * 1.15),
    bonusResistances: { mental: 0.2, force: 0.15 } as Partial<Record<string, number>>,
  };
}
