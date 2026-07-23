/**
 * Multiclass system (Idea #11).
 *
 * At level 20 the player can choose a SECONDARY class. They gain access to
 * the first 3 tiers of the secondary class's skill list (tiers 1, 2, 3
 * only). Choosing multiclass costs:
 *
 *   - 5,000 credits
 *   - +10 corruption
 *   - 1 alignment shift toward dark (independent of corruption)
 *
 * Multiclass cannot be changed once chosen (use prestige to reset).
 */

import type { ClassId } from "../../data/schemas";
import type { CharacterSnapshot } from "../save/types";
import { getClassSkills } from "../../data/schemas/skill-registry";

export const MULTICLASS_MIN_LEVEL = 20;
export const MULTICLASS_CREDIT_COST = 5000;
export const MULTICLASS_CORRUPTION_COST = 10;
export const MULTICLASS_MAX_TIER = 3;

export interface MulticlassChoice {
  classId: ClassId;
  availableSkillIds: string[];
}

export function getMulticlassOptions(currentClass: ClassId): MulticlassChoice[] {
  const classes: ClassId[] = ["marauder", "inquisitor", "assassin"];
  return classes
    .filter((c) => c !== currentClass)
    .map((c) => ({
      classId: c,
      availableSkillIds: getClassSkills(c)
        .filter((s) => s.tier <= MULTICLASS_MAX_TIER)
        .map((s) => s.id),
    }));
}

export function canMulticlass(character: CharacterSnapshot): { ok: boolean; reason?: string } {
  if (character.multiclassId) return { ok: false, reason: "Ya tienes multiclase (usa Prestigio para reiniciar)." };
  if (character.level < MULTICLASS_MIN_LEVEL) return { ok: false, reason: `Need level ${MULTICLASS_MIN_LEVEL}.` };
  if (character.credits < MULTICLASS_CREDIT_COST) return { ok: false, reason: `Costs ${MULTICLASS_CREDIT_COST} credits.` };
  return { ok: true };
}

export function applyMulticlass(character: CharacterSnapshot, classId: ClassId): boolean {
  if (!canMulticlass(character).ok) return false;
  character.credits -= MULTICLASS_CREDIT_COST;
  character.primary.corruption = Math.min(100, character.primary.corruption + MULTICLASS_CORRUPTION_COST);
  character.multiclassId = classId;
  return true;
}
