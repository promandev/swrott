/**
 * Weapon mastery (Complementary Loop 1 / Idea CL1-A).
 *
 * Tracks kills per weapon archetype. At mastery thresholds, the player
 * permanently gains a bonus when wielding any weapon of that archetype.
 *
 *   ARCHETYPES: saber_single, saber_double, saber_curved, blaster, dagger,
 *               staff, sith_sword, lightwhip, force_focus (relic)
 *
 *   THRESHOLDS (kills): 50, 200, 500, 1000
 *
 *   Bonuses scale linearly per archetype with a small unique twist at
 *   each tier (e.g. single sabers get +crit, doubles get +cleave chance).
 */

export type WeaponArchetype =
  | "saber_single" | "saber_double" | "saber_curved" | "blaster"
  | "dagger" | "staff" | "sith_sword" | "lightwhip" | "force_focus";

export interface WeaponMasteryTier {
  killsRequired: number;
  bonusSummary: string;
  /** Multipliers / flat bonuses keyed by stat. */
  bonuses: Partial<{
    critChanceAdd: number;
    critDmgMult: number;
    cleaveChance: number;
    armorPiercePct: number;
    accuracyAdd: number;
    fpCostMult: number;
    bleedDmgMult: number;
    shockDmgMult: number;
    burnDmgMult: number;
  }>;
}

export const WEAPON_MASTERY_TIERS: Record<WeaponArchetype, WeaponMasteryTier[]> = {
  saber_single: [
    { killsRequired:   50, bonusSummary: "+3% crit chance",                 bonuses: { critChanceAdd: 0.03 } },
    { killsRequired:  200, bonusSummary: "+10% crit damage",                bonuses: { critDmgMult: 1.10 } },
    { killsRequired:  500, bonusSummary: "+5% crit chance, +10% acc",       bonuses: { critChanceAdd: 0.05, accuracyAdd: 0.10 } },
    { killsRequired: 1000, bonusSummary: "+25% crit damage",                bonuses: { critDmgMult: 1.25 } },
  ],
  saber_double: [
    { killsRequired:   50, bonusSummary: "+5% cleave chance",               bonuses: { cleaveChance: 0.05 } },
    { killsRequired:  200, bonusSummary: "+10% cleave",                     bonuses: { cleaveChance: 0.10 } },
    { killsRequired:  500, bonusSummary: "+15% cleave, +5% crit",           bonuses: { cleaveChance: 0.15, critChanceAdd: 0.05 } },
    { killsRequired: 1000, bonusSummary: "+25% cleave damage scaling",      bonuses: { cleaveChance: 0.25 } },
  ],
  saber_curved: [
    { killsRequired:   50, bonusSummary: "+5% armor pierce",                bonuses: { armorPiercePct: 0.05 } },
    { killsRequired:  200, bonusSummary: "+10% bleed damage",               bonuses: { bleedDmgMult: 1.10 } },
    { killsRequired:  500, bonusSummary: "+15% pierce, +15% bleed",         bonuses: { armorPiercePct: 0.15, bleedDmgMult: 1.15 } },
    { killsRequired: 1000, bonusSummary: "+25% bleed, +10% pierce",         bonuses: { bleedDmgMult: 1.25, armorPiercePct: 0.10 } },
  ],
  blaster: [
    { killsRequired:   50, bonusSummary: "+5% accuracy",                    bonuses: { accuracyAdd: 0.05 } },
    { killsRequired:  200, bonusSummary: "+10% accuracy",                   bonuses: { accuracyAdd: 0.10 } },
    { killsRequired:  500, bonusSummary: "+15% acc, +5% crit",              bonuses: { accuracyAdd: 0.15, critChanceAdd: 0.05 } },
    { killsRequired: 1000, bonusSummary: "+25% crit damage",                bonuses: { critDmgMult: 1.25 } },
  ],
  dagger: [
    { killsRequired:   50, bonusSummary: "+5% crit chance",                 bonuses: { critChanceAdd: 0.05 } },
    { killsRequired:  200, bonusSummary: "+10% bleed",                      bonuses: { bleedDmgMult: 1.10 } },
    { killsRequired:  500, bonusSummary: "+10% crit chance, +20% bleed",    bonuses: { critChanceAdd: 0.10, bleedDmgMult: 1.20 } },
    { killsRequired: 1000, bonusSummary: "+30% crit dmg from behind",       bonuses: { critDmgMult: 1.30 } },
  ],
  staff: [
    { killsRequired:   50, bonusSummary: "−5% FP cost",                     bonuses: { fpCostMult: 0.95 } },
    { killsRequired:  200, bonusSummary: "−10% FP cost",                    bonuses: { fpCostMult: 0.90 } },
    { killsRequired:  500, bonusSummary: "−15% FP cost, +5% crit",          bonuses: { fpCostMult: 0.85, critChanceAdd: 0.05 } },
    { killsRequired: 1000, bonusSummary: "−25% FP cost",                    bonuses: { fpCostMult: 0.75 } },
  ],
  sith_sword: [
    { killsRequired:   50, bonusSummary: "+5% crit damage",                 bonuses: { critDmgMult: 1.05 } },
    { killsRequired:  200, bonusSummary: "+10% armor pierce",               bonuses: { armorPiercePct: 0.10 } },
    { killsRequired:  500, bonusSummary: "+20% crit damage",                bonuses: { critDmgMult: 1.20 } },
    { killsRequired: 1000, bonusSummary: "+30% pierce, +10% crit damage",   bonuses: { armorPiercePct: 0.30, critDmgMult: 1.10 } },
  ],
  lightwhip: [
    { killsRequired:   50, bonusSummary: "+5% burn damage",                 bonuses: { burnDmgMult: 1.05 } },
    { killsRequired:  200, bonusSummary: "+10% shock damage",               bonuses: { shockDmgMult: 1.10 } },
    { killsRequired:  500, bonusSummary: "+20% burn, +10% shock",           bonuses: { burnDmgMult: 1.20, shockDmgMult: 1.10 } },
    { killsRequired: 1000, bonusSummary: "+30% burn, +30% shock",           bonuses: { burnDmgMult: 1.30, shockDmgMult: 1.30 } },
  ],
  force_focus: [
    { killsRequired:   50, bonusSummary: "−5% FP cost",                     bonuses: { fpCostMult: 0.95 } },
    { killsRequired:  200, bonusSummary: "−10% FP cost",                    bonuses: { fpCostMult: 0.90 } },
    { killsRequired:  500, bonusSummary: "−15% FP cost, +5% crit",          bonuses: { fpCostMult: 0.85, critChanceAdd: 0.05 } },
    { killsRequired: 1000, bonusSummary: "−25% FP cost, +10% crit damage",  bonuses: { fpCostMult: 0.75, critDmgMult: 1.10 } },
  ],
};

export function masteryTierForKills(archetype: WeaponArchetype, kills: number): number {
  const tiers = WEAPON_MASTERY_TIERS[archetype];
  let best = -1;
  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    if (tier && kills >= tier.killsRequired) best = i;
  }
  return best;
}

/** Aggregate the current bonuses for a given (archetype, kills) state. */
export function bonusesForMastery(archetype: WeaponArchetype, kills: number): WeaponMasteryTier["bonuses"] {
  const tierIdx = masteryTierForKills(archetype, kills);
  if (tierIdx < 0) return {};
  const tiers = WEAPON_MASTERY_TIERS[archetype];
  const acc: WeaponMasteryTier["bonuses"] = {};
  for (let i = 0; i <= tierIdx; i++) {
    const t = tiers[i];
    if (!t) continue;
    for (const k of Object.keys(t.bonuses) as Array<keyof WeaponMasteryTier["bonuses"]>) {
      const v = t.bonuses[k];
      if (v === undefined) continue;
      if (k.endsWith("Mult")) {
        acc[k] = ((acc[k] ?? 1) as number) * v;
      } else {
        acc[k] = ((acc[k] ?? 0) as number) + v;
      }
    }
  }
  return acc;
}
