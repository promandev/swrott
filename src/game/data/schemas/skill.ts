import { z } from "zod";
import { ClassIdSchema, DamageTypeSchema, StatusEffectSchema } from "./common";

export const SkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  classId: ClassIdSchema,
  tier: z.number().int().min(1).max(10),
  cost: z.object({
    forcePoints: z.number().int().nonnegative().default(0),
    cooldown: z.number().int().nonnegative().default(0),
  }),
  damage: z
    .object({
      base: z.number().nonnegative(),
      strengthScaling: z.number().nonnegative().default(0),
      forceScaling: z.number().nonnegative().default(0),
      type: DamageTypeSchema,
    })
    .optional(),
  statusEffects: z
    .array(
      z.object({
        effect: StatusEffectSchema,
        chance: z.number().min(0).max(1),
        duration: z.number().int().positive(),
      }),
    )
    .default([]),
  targeting: z.enum(["self", "single", "cone", "aoe"]).default("single"),
  icon: z.string().optional(),
});

export type Skill = z.infer<typeof SkillSchema>;
export type SkillInput = z.input<typeof SkillSchema>;
