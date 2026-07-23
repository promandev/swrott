import type { SkillInput } from "./skill";
import { MARAUDER_SKILLS } from "../skills/marauder";
import { INQUISITOR_SKILLS } from "../skills/inquisitor";
import { ASSASSIN_SKILLS } from "../skills/assassin";
import { ALL_FORCE_POWERS } from "../skills/force-powers";
import { ENEMY_SKILLS } from "../skills/enemy-skills";
import type { ClassId } from "./common";

/**
 * Centralized registry mapping skill IDs → SkillInput data.
 * Use `getSkill(id)` from anywhere (combat, UI, talents).
 */
const ALL_SKILLS: SkillInput[] = [
  ...MARAUDER_SKILLS,
  ...INQUISITOR_SKILLS,
  ...ASSASSIN_SKILLS,
  ...ALL_FORCE_POWERS,
  ...ENEMY_SKILLS,
];

const SKILL_BY_ID: Record<string, SkillInput> = Object.fromEntries(
  ALL_SKILLS.map((s) => [s.id, s]),
);

export function getSkill(id: string): SkillInput | undefined {
  return SKILL_BY_ID[id];
}

export function getClassSkills(classId: ClassId): SkillInput[] {
  if (classId === "marauder") return MARAUDER_SKILLS;
  if (classId === "inquisitor") return INQUISITOR_SKILLS;
  if (classId === "assassin") return ASSASSIN_SKILLS;
  return [];
}

/** Synthetic basic attack — always available, free, no cooldown. */
export const BASIC_ATTACK: SkillInput = {
  id: "basic_attack",
  name: "Basic Attack",
  description: "Un golpe cuerpo a cuerpo estándar con tu arma.",
  classId: "marauder", // placeholder — not class-restricted
  tier: 0,
  cost: { forcePoints: 0, cooldown: 0 },
  damage: { base: 8, strengthScaling: 1.0, forceScaling: 0, type: "physical" },
  statusEffects: [],
  targeting: "single",
};
