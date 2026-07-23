import { z } from "zod";

/** Master enums shared across schemas. */

export const RaritySchema = z.enum([
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "ancient_sith",
]);
export type Rarity = z.infer<typeof RaritySchema>;

export const DamageTypeSchema = z.enum([
  "physical",
  "energy",
  "mental",
  "force",
  "poison",
  "fire",
  "shock",
]);
export type DamageType = z.infer<typeof DamageTypeSchema>;

export const ClassIdSchema = z.enum(["marauder", "inquisitor", "assassin"]);
export type ClassId = z.infer<typeof ClassIdSchema>;

export const FactionIdSchema = z.enum([
  "sith_academy",
  "hidden_jedi",
  "smuggler_guild",
  "mandalorian_houses",
  "cult_of_nihilus",
]);
export type FactionId = z.infer<typeof FactionIdSchema>;

export const StatusEffectSchema = z.enum([
  "bleed",
  "burn",
  "shock",
  "fear",
  "stun",
  "blind",
  "poison",
  "silence",
  "cripple",
  "marked",
  "rage",
  "corrupted",
]);
export type StatusEffect = z.infer<typeof StatusEffectSchema>;

export const SlotSchema = z.enum([
  "main_hand",
  "off_hand",
  "head",
  "chest",
  "gloves",
  "belt",
  "boots",
  "implant_a",
  "implant_b",
  "relic_a",
  "relic_b",
]);
export type Slot = z.infer<typeof SlotSchema>;
