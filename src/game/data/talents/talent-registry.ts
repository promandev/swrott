import type { ClassId } from "../schemas/common";
import type { TalentNode, TalentTreeMeta } from "./talent-types";
import { TIER_LEVEL_REQ } from "./talent-types";
import { MARAUDER_TALENTS, MARAUDER_TREES, MARAUDER_BASELINE_SKILLS } from "./marauder-talents";
import { INQUISITOR_TALENTS, INQUISITOR_TREES, INQUISITOR_BASELINE_SKILLS } from "./inquisitor-talents";
import { ASSASSIN_TALENTS, ASSASSIN_TREES, ASSASSIN_BASELINE_SKILLS } from "./assassin-talents";

/**
 * Central talent registry. Mirrors the skill-registry pattern: a single
 * place to look up talents by id, by class, and by tree, plus the
 * unlock-eligibility rules used by the store and the talent UI.
 */

const TALENTS_BY_CLASS: Record<ClassId, TalentNode[]> = {
  marauder: MARAUDER_TALENTS,
  inquisitor: INQUISITOR_TALENTS,
  assassin: ASSASSIN_TALENTS,
};

const TREES_BY_CLASS: Record<ClassId, TalentTreeMeta[]> = {
  marauder: MARAUDER_TREES,
  inquisitor: INQUISITOR_TREES,
  assassin: ASSASSIN_TREES,
};

const BASELINE_BY_CLASS: Record<ClassId, string[]> = {
  marauder: MARAUDER_BASELINE_SKILLS,
  inquisitor: INQUISITOR_BASELINE_SKILLS,
  assassin: ASSASSIN_BASELINE_SKILLS,
};

export const ALL_TALENTS: TalentNode[] = [
  ...MARAUDER_TALENTS,
  ...INQUISITOR_TALENTS,
  ...ASSASSIN_TALENTS,
];

const TALENT_BY_ID: Map<string, TalentNode> = new Map(ALL_TALENTS.map((t) => [t.id, t]));

export function getTalent(id: string): TalentNode | undefined {
  return TALENT_BY_ID.get(id);
}

export function getClassTalents(classId: ClassId): TalentNode[] {
  return TALENTS_BY_CLASS[classId] ?? [];
}

export function getClassTrees(classId: ClassId): TalentTreeMeta[] {
  return TREES_BY_CLASS[classId] ?? [];
}

export function getTreeTalents(classId: ClassId, treeId: string): TalentNode[] {
  return getClassTalents(classId).filter((t) => t.tree === treeId);
}

export function getBaselineSkills(classId: ClassId): string[] {
  return BASELINE_BY_CLASS[classId] ?? [];
}

/** Why a talent can't be unlocked (or null if it can). */
export function talentLockReason(
  talentId: string,
  unlocked: ReadonlySet<string>,
  availablePoints: number,
  characterLevel: number,
): string | null {
  const talent = TALENT_BY_ID.get(talentId);
  if (!talent) return "Unknown talent.";
  if (unlocked.has(talentId)) return "Already learned.";
  const levelReq = TIER_LEVEL_REQ[talent.tier];
  if (characterLevel < levelReq) return `Requires level ${levelReq}.`;
  const missing = talent.prereqs.filter((p) => !unlocked.has(p));
  if (missing.length > 0) {
    const names = missing.map((p) => TALENT_BY_ID.get(p)?.name ?? p);
    return `Requires: ${names.join(", ")}.`;
  }
  if (availablePoints < 1) return "No talent points available.";
  return null;
}

export function canUnlockTalent(
  talentId: string,
  unlocked: ReadonlySet<string>,
  availablePoints: number,
  characterLevel: number,
): boolean {
  return talentLockReason(talentId, unlocked, availablePoints, characterLevel) === null;
}
