/**
 * Bounty chains (Complementary Loop 4 / Idea CL4-B).
 *
 * Multi-step bounties. Each chain has 3 contracts that must be completed
 * in order. Completing the final step grants a guaranteed legendary plus
 * arena marks bonus.
 */

export interface BountyChainStep {
  bountyTemplateId: string;
  enemyTemplateId: string;
  modifierIds: string[];
  rewardCredits: number;
  rewardXp: number;
}

export interface BountyChain {
  id: string;
  title: string;
  narrativeHook: string;
  steps: BountyChainStep[];
  finalLegendaryId: string;
  finalArenaMarks: number;
}

export const BOUNTY_CHAINS: BountyChain[] = [
  {
    id: "chain_three_brothers",
    title: "The Three Brothers of Korriban",
    narrativeHook: "Tres hermanos sith traicionaron la Academia. Encuéntralos, uno a uno. Cada uno es más fuerte que el anterior.",
    steps: [
      { bountyTemplateId: "step_eldest", enemyTemplateId: "enemy_sith_warrior",   modifierIds: ["armored"],     rewardCredits: 1500, rewardXp: 400 },
      { bountyTemplateId: "step_middle", enemyTemplateId: "enemy_sith_inquisitor",modifierIds: ["corrupted","swift"], rewardCredits: 3000, rewardXp: 800 },
      { bountyTemplateId: "step_youngest",enemyTemplateId: "enemy_sith_assassin",  modifierIds: ["vampiric","staggering","echoed"], rewardCredits: 6000, rewardXp: 1500 },
    ],
    finalLegendaryId: "legend_brothers_blade",
    finalArenaMarks: 10,
  },
  {
    id: "chain_ancient_hunt",
    title: "Whispers of Ancient Blood",
    narrativeHook: "Da caza a los restos de un antiguo lord sith — cada fragmento lleva a un eco más fuerte.",
    steps: [
      { bountyTemplateId: "step_echo_1", enemyTemplateId: "enemy_corrupted_spirit",modifierIds: ["ancient"],     rewardCredits: 2000, rewardXp: 600 },
      { bountyTemplateId: "step_echo_2", enemyTemplateId: "enemy_void_remnant",    modifierIds: ["ancient","echoed"], rewardCredits: 4500, rewardXp: 1200 },
      { bountyTemplateId: "step_echo_3", enemyTemplateId: "enemy_ancient_dread_lord", modifierIds: ["ancient","vampiric","shielded"], rewardCredits: 10000, rewardXp: 2500 },
    ],
    finalLegendaryId: "legend_voice_of_ancients",
    finalArenaMarks: 15,
  },
  {
    id: "chain_mirror_war",
    title: "Mirror War",
    narrativeHook: "Un eco de ti mismo recorre la galaxia. Dale caza — él te da caza a ti.",
    steps: [
      { bountyTemplateId: "step_mirror_apprentice", enemyTemplateId: "enemy_shadow_stalker", modifierIds: ["swift","staggering"], rewardCredits: 2500, rewardXp: 700 },
      { bountyTemplateId: "step_mirror_journeyer",  enemyTemplateId: "enemy_phantom_lord",   modifierIds: ["echoed","shielded"],  rewardCredits: 5500, rewardXp: 1400 },
      { bountyTemplateId: "step_mirror_self",       enemyTemplateId: "enemy_void_sovereign", modifierIds: ["ancient","vampiric","staggering","echoed"], rewardCredits: 12000, rewardXp: 3000 },
    ],
    finalLegendaryId: "legend_mask_of_self",
    finalArenaMarks: 20,
  },
];

export function findBountyChain(id: string): BountyChain | undefined {
  return BOUNTY_CHAINS.find((c) => c.id === id);
}
