/**
 * Summoned allies (Idea #14).
 *
 * Class-locked summon skills create temporary allies for the duration of
 * combat. Each summon:
 *   - has its own HP / damage profile
 *   - cannot be targeted by the player but acts on its own turn slot
 *   - dispels at the end of combat
 *
 *   Marauder    → Massassi Berserker (melee tank, bleeds enemies)
 *   Inquisitor  → Spectral Apprentice (force caster, drains)
 *   Assassin    → Shadow Clone (mirror of the player, half damage)
 */

import type { Combatant } from "../combat/combat-store";
import type { Stance } from "../combat/damage";

export interface SummonTemplate {
  id: string;
  name: string;
  classId: "marauder" | "inquisitor" | "assassin";
  hp: number;
  fp: number;
  armor: number;
  stance: Stance;
  skillIds: string[];
  duration: number;          // turns alive
  primary: Combatant["primary"];
}

export const SUMMON_TEMPLATES: Record<string, SummonTemplate> = {
  massassi_berserker: {
    id: "massassi_berserker", name: "Massassi Berserker", classId: "marauder",
    hp: 120, fp: 0, armor: 18, stance: "aggressive",
    skillIds: ["heavy_slash", "cleave"], duration: 5,
    primary: { strength: 12, agility: 5, endurance: 8, force: 0, influence: 0, corruption: 5 },
  },
  spectral_apprentice: {
    id: "spectral_apprentice", name: "Spectral Apprentice", classId: "inquisitor",
    hp: 80, fp: 60, armor: 6, stance: "precision",
    skillIds: ["lightning_bolt", "drain_life"], duration: 4,
    primary: { strength: 2, agility: 4, endurance: 4, force: 12, influence: 4, corruption: 6 },
  },
  shadow_clone: {
    id: "shadow_clone", name: "Shadow Clone", classId: "assassin",
    hp: 70, fp: 40, armor: 8, stance: "frenzy",
    skillIds: ["shadow_strike", "double_strike"], duration: 4,
    primary: { strength: 7, agility: 12, endurance: 5, force: 4, influence: 0, corruption: 0 },
  },
};

export function createSummonCombatant(templateId: string, idx: number): Combatant | null {
  const t = SUMMON_TEMPLATES[templateId];
  if (!t) return null;
  return {
    id: `summon_${t.id}_${idx}`,
    name: t.name,
    isPlayer: false,
    hp: t.hp,
    maxHp: t.hp,
    fp: t.fp,
    maxFp: t.fp,
    armor: t.armor,
    primary: { ...t.primary },
    stance: t.stance,
    statusEffects: [],
    skillIds: [...t.skillIds],
    cooldowns: {},
    isAlive: true,
  };
}
