import { z } from "zod";
import { DamageTypeSchema, RaritySchema, SlotSchema, ClassIdSchema, StatusEffectSchema } from "./common";
import { AffixEffectSchema } from "./affix";

/**
 * Item schema (weapons, armor, consumables, materials, relics, crystals).
 * Source: Master Design Bible §8 "Equipo y Objetos" + §9 "Objetos Únicos"
 *         + Ultimate Loot Bible §1-20.
 */

export const StatBonusSchema = z.object({
  strength: z.number().optional(),
  agility: z.number().optional(),
  endurance: z.number().optional(),
  force: z.number().optional(),
  influence: z.number().optional(),
  corruption: z.number().optional(),
  armor: z.number().optional(),
  critBonus: z.number().optional(),
  hp: z.number().optional(),
  forcePoints: z.number().optional(),
});

export const WeaponDataSchema = z.object({
  damage: z.number().int().nonnegative(),
  damageType: DamageTypeSchema,
  weaponType: z.enum([
    "saber_single",
    "saber_dual",
    "double_blade",
    "curved_saber",
    "vibrosword",
    "pike",
    "sidearm",
  ]),
  /** Whether this weapon accepts a crystal modifier. */
  acceptsCrystal: z.boolean().default(false),
});

/**
 * On-equip/trigger effect IDs. Resolved at runtime in combat-store.
 * Examples: "lifesteal_kill", "force_storm_discount", "explode_on_crit",
 * "fear_aura", "instant_kill_chance".
 */
export const ItemEffectIdSchema = z.string();

export const ItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  rarity: RaritySchema,
  slot: SlotSchema.optional(),
  stackable: z.boolean().default(false),
  maxStack: z.number().int().positive().default(1),
  value: z.number().int().nonnegative().default(0),
  icon: z.string().optional(),
  weapon: WeaponDataSchema.optional(),
  bonuses: StatBonusSchema.optional(),
  /** Free-form tags. */
  tags: z.array(z.string()).default([]),

  // ── Extended (Ultimate Loot Bible) ────────────────────────────────
  /** Item level — drives smart loot weighting and affix tiers. */
  itemLevel: z.number().int().min(1).default(1),
  /** Min character level to equip. */
  levelReq: z.number().int().min(1).default(1),
  /** Restrict to one class (undefined = any class). */
  classRestriction: ClassIdSchema.optional(),
  /** Set membership — items with same setId contribute to set bonuses. */
  setId: z.string().optional(),
  /** Pre-rolled affixes (for generated items: passed in by RNG; for static: leave empty). */
  affixes: z.array(AffixEffectSchema).default([]),
  /** Named on-equip effect (resolved by registry, e.g. lifesteal_kill). */
  onEquipEffectId: ItemEffectIdSchema.optional(),
  /** Named on-hit effect — triggered each successful attack. */
  onHitEffectId: ItemEffectIdSchema.optional(),
  /** Named on-kill effect. */
  onKillEffectId: ItemEffectIdSchema.optional(),
  /** Named on-crit effect (e.g. explosion). */
  onCritEffectId: ItemEffectIdSchema.optional(),
  /** For weapons: socketed crystal item ID. */
  socketedCrystalId: z.string().optional(),
  /** Status effect this item applies on hit (built-in, no script needed). */
  onHitStatus: z.object({
    effect: StatusEffectSchema,
    chance: z.number(),
    duration: z.number(),
  }).optional(),
  /** Cosmetic-only? */
  cosmetic: z.boolean().default(false),
});

export type Item = z.infer<typeof ItemSchema>;
export type ItemInput = z.input<typeof ItemSchema>;
export type StatBonus = z.infer<typeof StatBonusSchema>;
