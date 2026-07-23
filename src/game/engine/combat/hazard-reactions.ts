/**
 * Hazard reactions (Complementary Loop 2 / Idea CL2-B).
 *
 * When two terrain hazards intersect (or a status effect intersects with
 * terrain), a reaction triggers. Examples:
 *
 *   oil + fire        → explosion (40 fire dmg AoE)
 *   shock + water     → chain shock (15 shock to all in cluster)
 *   bleed + force     → blood storm (10 dmg/turn AoE for 3 turns)
 *   corruption + force_focus → void breach (force damage doubled this turn)
 *
 * Reactions are deterministic — combat code calls `findHazardReaction()`
 * when applying an effect to a tile already containing another.
 */

export type HazardTag =
  | "fire" | "oil" | "shock" | "water" | "bleed" | "force" | "corruption"
  | "ice" | "smoke" | "force_focus";

export interface HazardReaction {
  id: string;
  triggers: [HazardTag, HazardTag];
  resultEffectId: string;
  aoeDamage?: number;
  aoeRadius?: number;
  durationTurns?: number;
}

export const HAZARD_REACTIONS: HazardReaction[] = [
  { id: "explosion",       triggers: ["oil", "fire"],            resultEffectId: "burn_aoe",     aoeDamage: 40, aoeRadius: 2 },
  { id: "chain_shock",     triggers: ["shock", "water"],         resultEffectId: "shock_chain",  aoeDamage: 15, aoeRadius: 3 },
  { id: "blood_storm",     triggers: ["bleed", "force"],         resultEffectId: "blood_storm",  aoeDamage: 10, aoeRadius: 2, durationTurns: 3 },
  { id: "void_breach",     triggers: ["corruption", "force_focus"], resultEffectId: "void_breach", aoeDamage: 0, aoeRadius: 0 },
  { id: "steam_blind",     triggers: ["fire", "water"],          resultEffectId: "steam_blind",  aoeRadius: 2, durationTurns: 2 },
  { id: "shatter",         triggers: ["ice", "shock"],           resultEffectId: "shatter",      aoeDamage: 25, aoeRadius: 2 },
  { id: "vapor_cloud",     triggers: ["smoke", "fire"],          resultEffectId: "vapor_burn",   aoeDamage: 20, aoeRadius: 3, durationTurns: 2 },
];

export function findHazardReaction(a: HazardTag, b: HazardTag): HazardReaction | undefined {
  return HAZARD_REACTIONS.find((r) =>
    (r.triggers[0] === a && r.triggers[1] === b) ||
    (r.triggers[0] === b && r.triggers[1] === a),
  );
}
