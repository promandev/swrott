/**
 * Enemy AI tactic profiles (Complementary Loop 2 / Idea CL2-D).
 *
 * Pluggable tactic profiles for the existing aiBehavior tags. Each
 * profile returns a scored choice of {targetId, skillId, stance}. The
 * combat-store invokes whichever profile matches the enemy's behavior.
 */

import type { Combatant } from "./combat-store";

export interface AiContext {
  self: Combatant;
  allies: Combatant[];
  enemies: Combatant[];   // includes the player
  turnNumber: number;
}

export interface AiDecision {
  targetId: string;
  skillId: string | null;     // null = basic attack
  /** Optional stance change request. */
  switchStance?: Combatant["stance"];
  /** Diagnostic for tooling. */
  reasonTag: string;
}

function pickLowestHp(targets: Combatant[]): Combatant | undefined {
  return [...targets].sort((a, b) => a.hp - b.hp)[0];
}

function pickHighestThreat(targets: Combatant[]): Combatant | undefined {
  // Highest force or strength player
  return [...targets].sort((a, b) =>
    (b.primary.force + b.primary.strength) - (a.primary.force + a.primary.strength),
  )[0];
}

export const AI_PROFILES = {
  aggressive(ctx: AiContext): AiDecision {
    const target = pickLowestHp(ctx.enemies.filter((e) => e.isAlive));
    return {
      targetId: target?.id ?? ctx.enemies[0]?.id ?? "",
      skillId: ctx.self.skillIds[0] ?? null,
      reasonTag: "aggressive.lowest_hp",
    };
  },
  defensive(ctx: AiContext): AiDecision {
    // Prefer a defensive skill if HP < 30%, else attack highest threat
    const selfLow = ctx.self.hp / ctx.self.maxHp < 0.3;
    if (selfLow) {
      const heal = ctx.self.skillIds.find((s) => s.includes("heal") || s.includes("guard"));
      if (heal) return { targetId: ctx.self.id, skillId: heal, reasonTag: "defensive.heal" };
    }
    const target = pickHighestThreat(ctx.enemies.filter((e) => e.isAlive));
    return {
      targetId: target?.id ?? ctx.enemies[0]?.id ?? "",
      skillId: ctx.self.skillIds[0] ?? null,
      reasonTag: "defensive.threat",
    };
  },
  smart(ctx: AiContext): AiDecision {
    // Smart AI: focus stunned/silenced targets, use AoE if ≥2 enemies clustered
    const stunned = ctx.enemies.find((e) => e.isAlive && e.statusEffects.some((s) => s.effect === "stun"));
    if (stunned) {
      return { targetId: stunned.id, skillId: ctx.self.skillIds[0] ?? null, reasonTag: "smart.focus_stunned" };
    }
    if (ctx.enemies.filter((e) => e.isAlive).length >= 2) {
      const aoe = ctx.self.skillIds.find((s) => s.includes("storm") || s.includes("cleave") || s.includes("nova"));
      if (aoe) return { targetId: ctx.enemies[0]?.id ?? "", skillId: aoe, reasonTag: "smart.aoe" };
    }
    const target = pickLowestHp(ctx.enemies.filter((e) => e.isAlive));
    return {
      targetId: target?.id ?? ctx.enemies[0]?.id ?? "",
      skillId: ctx.self.skillIds[Math.min(1, ctx.self.skillIds.length - 1)] ?? null,
      reasonTag: "smart.lowest_hp_strong_skill",
    };
  },
  random(ctx: AiContext): AiDecision {
    const alive = ctx.enemies.filter((e) => e.isAlive);
    const i = Math.floor(Math.random() * alive.length);
    const s = Math.floor(Math.random() * Math.max(1, ctx.self.skillIds.length));
    return {
      targetId: alive[i]?.id ?? ctx.enemies[0]?.id ?? "",
      skillId: ctx.self.skillIds[s] ?? null,
      reasonTag: "random",
    };
  },
} as const;

export type AiBehavior = keyof typeof AI_PROFILES;
