/**
 * Procedural Bounty Board (Idea #19).
 *
 * Refreshes daily (real-time) or on a "rest at cantina" action. Generates
 * 3-5 contracts. Each contract targets a randomized enemy with a
 * pool of MODIFIERS applied. Modifiers stack and affect both reward and
 * difficulty.
 *
 *   RABID            +30% damage, takes 10% extra dmg
 *   VAMPIRIC         heals 30% of dmg dealt
 *   ARMORED          +50% armor, -10% damage
 *   CORRUPTED        applies corrupted on every hit
 *   SHIELDED         immune to crits
 *   ECHOED           summons a weaker copy at 50% HP
 *   ANCIENT          force damage type, +force +5
 *   SWIFT            extra turn every 3rd round
 *   POISONOUS        applies poison
 *   STAGGERING       crits stun for 2 turns
 */

import type { EnemyTemplate } from "../combat/enemies";
import type { RNG } from "../rng/rng";

export interface BountyModifier {
  id: string;
  name: string;
  description: string;
  rewardMult: number;
  dangerWeight: number;        // sum of weights drives reward formula
  apply: (e: EnemyTemplate) => EnemyTemplate;
}

export const BOUNTY_MODIFIERS: BountyModifier[] = [
  { id: "rabid", name: "Rabid", description: "+30% damage, takes 10% extra dmg.",
    rewardMult: 1.25, dangerWeight: 2,
    apply: (e) => ({ ...e, primary: { ...e.primary, strength: Math.floor(e.primary.strength * 1.3) } }) },
  { id: "vampiric", name: "Vampiric", description: "Heals 30% of dmg dealt.",
    rewardMult: 1.4, dangerWeight: 3, apply: (e) => e },
  { id: "armored", name: "Armored", description: "+50% armor.",
    rewardMult: 1.3, dangerWeight: 2,
    apply: (e) => ({ ...e, armor: Math.floor(e.armor * 1.5) }) },
  { id: "corrupted", name: "Corrupted", description: "Applies Corrupted on hit.",
    rewardMult: 1.2, dangerWeight: 2, apply: (e) => e },
  { id: "shielded", name: "Shielded", description: "Immune to critical hits.",
    rewardMult: 1.35, dangerWeight: 3, apply: (e) => e },
  { id: "echoed", name: "Echoed", description: "Summons a copy at 50% HP.",
    rewardMult: 1.6, dangerWeight: 4, apply: (e) => e },
  { id: "ancient", name: "Ancient", description: "Deals Force damage, +5 force.",
    rewardMult: 1.5, dangerWeight: 3,
    apply: (e) => ({ ...e, primary: { ...e.primary, force: e.primary.force + 5 } }) },
  { id: "swift", name: "Swift", description: "Extra turn every 3rd round.",
    rewardMult: 1.4, dangerWeight: 3,
    apply: (e) => ({ ...e, primary: { ...e.primary, agility: e.primary.agility + 4 } }) },
  { id: "poisonous", name: "Poisonous", description: "Applies Poison on hit.",
    rewardMult: 1.2, dangerWeight: 2, apply: (e) => e },
  { id: "staggering", name: "Staggering", description: "Crits stun for 2 turns.",
    rewardMult: 1.3, dangerWeight: 3, apply: (e) => e },
];

export interface BountyContract {
  id: string;
  title: string;
  enemyTemplateId: string;
  modifierIds: string[];
  rewardCredits: number;
  rewardXp: number;
  /** Currency rewards (rare). */
  bonusCurrency?: { kind: "arenaMarks" | "ancientTokens" | "corruptedShards" | "darkTokens"; amount: number };
  zoneHint: string;
}

interface GenerateContext {
  rng: RNG;
  templates: EnemyTemplate[];
  playerLevel: number;
  count?: number;
}

export function generateBountyContracts(ctx: GenerateContext): BountyContract[] {
  const count = ctx.count ?? 4;
  const contracts: BountyContract[] = [];
  for (let i = 0; i < count; i++) {
    const tpl = ctx.rng.pick(ctx.templates);
    if (!tpl) break;

    // 1..3 modifiers based on player level
    const modCount = ctx.playerLevel >= 15 ? 3 : ctx.playerLevel >= 8 ? 2 : 1;
    const pool = [...BOUNTY_MODIFIERS];
    const mods: BountyModifier[] = [];
    for (let m = 0; m < modCount; m++) {
      const picked = ctx.rng.pick(pool);
      if (!picked) continue;
      mods.push(picked);
      pool.splice(pool.indexOf(picked), 1);
    }

    const baseCredits = (tpl.creditReward[0] + tpl.creditReward[1]) / 2;
    const danger = mods.reduce((acc, m) => acc + m.dangerWeight, 0);
    const rewardMult = mods.reduce((acc, m) => acc * m.rewardMult, 1);

    const contract: BountyContract = {
      id: `bounty_${Date.now()}_${i}_${ctx.rng.int(0, 9999)}`,
      title: `${mods[0]?.name ?? "Wanted"} ${tpl.name}`,
      enemyTemplateId: tpl.id,
      modifierIds: mods.map((m) => m.id),
      rewardCredits: Math.floor(baseCredits * rewardMult * 5),
      rewardXp: Math.floor(tpl.xpReward * rewardMult * 1.5),
      zoneHint: tpl.category === "boss" ? "Last reported in Korriban Tombs" : "Reported across Korriban patrols",
    };
    // Occasional special currency rewards
    if (danger >= 5 && ctx.rng.chance(0.4)) {
      contract.bonusCurrency = ctx.rng.pick([
        { kind: "arenaMarks" as const, amount: 2 },
        { kind: "darkTokens" as const, amount: 3 },
        { kind: "corruptedShards" as const, amount: 1 },
      ]);
    }
    contracts.push(contract);
  }
  return contracts;
}
