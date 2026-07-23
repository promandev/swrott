import { z } from "zod";
import { DamageTypeSchema, StatusEffectSchema, ClassIdSchema } from "./common";

/**
 * Item affix system — randomized prefix/suffix modifiers.
 *
 * Items can have up to 2 prefixes and 2 suffixes. Each affix:
 *  - has a tier (1-5)
 *  - rolls a value range (min/max)
 *  - is class-agnostic OR class-restricted
 *  - tagged by what it boosts (offense / defense / utility)
 */

export const AffixTagSchema = z.enum(["offense", "defense", "utility", "force", "social"]);
export type AffixTag = z.infer<typeof AffixTagSchema>;

export const AffixEffectSchema = z.object({
  // Primary stat bonuses
  strength: z.number().optional(),
  agility: z.number().optional(),
  endurance: z.number().optional(),
  force: z.number().optional(),
  influence: z.number().optional(),
  // Combat modifiers
  armor: z.number().optional(),
  critBonus: z.number().optional(),
  critDamageBonus: z.number().optional(),
  accuracyBonus: z.number().optional(),
  dodgeBonus: z.number().optional(),
  // Resources
  hp: z.number().optional(),
  forcePoints: z.number().optional(),
  hpRegen: z.number().optional(),
  fpRegen: z.number().optional(),
  // Damage modifiers
  damageBonus: z.number().optional(),                       // flat damage
  damageMultiplier: z.number().optional(),                  // % boost (e.g. 0.1 = +10%)
  damageVsType: z.record(z.string(), z.number()).optional(),// "beast", "humanoid", etc.
  damageOfType: z.record(z.string(), z.number()).optional(),// boost specific damage types
  // Defense
  resistance: z.record(DamageTypeSchema, z.number()).optional(),
  thorns: z.number().optional(),                            // reflect % of damage taken
  // Special
  lifesteal: z.number().optional(),                         // 0..1 of damage dealt → HP
  forcesteal: z.number().optional(),                        // 0..1 of damage dealt → FP
  cooldownReduction: z.number().optional(),                 // 0..1
  fpCostReduction: z.number().optional(),                   // 0..1
  // On-hit chances
  onHitStatus: z.object({
    effect: StatusEffectSchema,
    chance: z.number(),
    duration: z.number(),
  }).optional(),
});

export const AffixSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["prefix", "suffix"]),
  tier: z.number().int().min(1).max(5),
  tag: AffixTagSchema,
  /** Effect rolled when applied to an item (min..max for numeric values). */
  effect: AffixEffectSchema,
  /** Optional class restriction. */
  classRestriction: ClassIdSchema.optional(),
  /** Min item level this affix can roll on. */
  minItemLevel: z.number().int().default(1),
});

export type Affix = z.infer<typeof AffixSchema>;
export type AffixInput = z.input<typeof AffixSchema>;
export type AffixEffect = z.infer<typeof AffixEffectSchema>;
