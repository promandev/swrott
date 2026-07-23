/**
 * Sith Trials — wave-based arenas (Idea #20).
 *
 * Players enter an arena and fight pre-defined waves of enemies. Each
 * arena rewards arenaMarks scaling with the wave count plus a guaranteed
 * legendary at completion. Mid-trial healing only between waves (10% HP
 * + 1 charge of a restoration relic).
 *
 *   trial_blood        Marauder-themed, 5 waves
 *   trial_madness      Inquisitor-themed, 7 waves
 *   trial_void         Assassin-themed, 10 waves
 *   trial_eternal      End-game, 20 waves, unlocks at level 30 + NG+1
 */

export interface ArenaWave {
  enemyTemplateIds: string[];
  /** Optional special modifier (e.g. "no_heals", "double_speed"). */
  ruleId?: string;
}

export interface ArenaTrial {
  id: string;
  name: string;
  description: string;
  minLevel: number;
  themeClass?: "marauder" | "inquisitor" | "assassin";
  waves: ArenaWave[];
  rewardArenaMarks: number;
  rewardLegendaryId?: string;
  bossWaveIndex?: number;
}

export const SITH_TRIALS: ArenaTrial[] = [
  {
    id: "trial_blood",
    name: "Prueba de Sangre",
    description: "Cinco oleadas de berserkers. La muerte es honor.",
    minLevel: 8,
    themeClass: "marauder",
    rewardArenaMarks: 5,
    rewardLegendaryId: "legend_blade_of_marka",
    bossWaveIndex: 4,
    waves: [
      { enemyTemplateIds: ["enemy_acolyte_brawler", "enemy_acolyte_brawler"] },
      { enemyTemplateIds: ["enemy_acolyte_brawler", "enemy_tukata_pup", "enemy_tukata_pup"] },
      { enemyTemplateIds: ["enemy_sith_warrior", "enemy_acolyte_brawler"], ruleId: "no_heals" },
      { enemyTemplateIds: ["enemy_sith_warrior", "enemy_sith_warrior"] },
      { enemyTemplateIds: ["enemy_blood_champion"] },
    ],
  },
  {
    id: "trial_madness",
    name: "Prueba de la Locura",
    description: "Primero se quiebra la mente. Tus enemigos después.",
    minLevel: 12,
    themeClass: "inquisitor",
    rewardArenaMarks: 8,
    rewardLegendaryId: "legend_madness_eye_relic",
    bossWaveIndex: 6,
    waves: [
      { enemyTemplateIds: ["enemy_haunted_acolyte"] },
      { enemyTemplateIds: ["enemy_haunted_acolyte", "enemy_corrupted_spirit"] },
      { enemyTemplateIds: ["enemy_corrupted_spirit", "enemy_corrupted_spirit"] },
      { enemyTemplateIds: ["enemy_sith_inquisitor", "enemy_haunted_acolyte"], ruleId: "silenced_skills" },
      { enemyTemplateIds: ["enemy_sith_inquisitor", "enemy_sith_inquisitor"] },
      { enemyTemplateIds: ["enemy_madness_avatar"], ruleId: "double_force_cost" },
      { enemyTemplateIds: ["enemy_madness_avatar", "enemy_corrupted_spirit", "enemy_corrupted_spirit"] },
    ],
  },
  {
    id: "trial_void",
    name: "Prueba del Vacío",
    description: "Diez oleadas. Sin piedad. La oscuridad observa.",
    minLevel: 16,
    themeClass: "assassin",
    rewardArenaMarks: 12,
    rewardLegendaryId: "legend_void_fang_dagger",
    bossWaveIndex: 9,
    waves: [
      { enemyTemplateIds: ["enemy_shadow_stalker"] },
      { enemyTemplateIds: ["enemy_shadow_stalker", "enemy_shadow_stalker"] },
      { enemyTemplateIds: ["enemy_shadow_stalker", "enemy_void_remnant"] },
      { enemyTemplateIds: ["enemy_void_remnant", "enemy_void_remnant"], ruleId: "shadow_field" },
      { enemyTemplateIds: ["enemy_sith_assassin", "enemy_shadow_stalker"] },
      { enemyTemplateIds: ["enemy_sith_assassin", "enemy_sith_assassin"] },
      { enemyTemplateIds: ["enemy_sith_assassin", "enemy_void_remnant", "enemy_void_remnant"] },
      { enemyTemplateIds: ["enemy_phantom_lord"], ruleId: "no_heals" },
      { enemyTemplateIds: ["enemy_phantom_lord", "enemy_shadow_stalker", "enemy_shadow_stalker"] },
      { enemyTemplateIds: ["enemy_void_sovereign"], ruleId: "double_force_cost" },
    ],
  },
  {
    id: "trial_eternal",
    name: "Prueba Eterna",
    description: "Veinte oleadas. Sin respiro. La propia galaxia toma nota.",
    minLevel: 30,
    rewardArenaMarks: 30,
    rewardLegendaryId: "legend_eternal_crown",
    bossWaveIndex: 19,
    waves: Array.from({ length: 20 }, (_, i) => ({
      enemyTemplateIds:
        i === 19 ? ["enemy_ancient_dread_lord"] :
        i % 5 === 4 ? ["enemy_sith_warrior", "enemy_sith_inquisitor", "enemy_sith_assassin"] :
        ["enemy_acolyte_brawler", "enemy_haunted_acolyte"],
      ...(i % 7 === 6 ? { ruleId: "no_heals" } : {}),
    })),
  },
];

export function getTrial(id: string): ArenaTrial | undefined {
  return SITH_TRIALS.find((t) => t.id === id);
}

/** Compute the marks reward for completing N waves (partial credit). */
export function partialMarksReward(trial: ArenaTrial, wavesCleared: number): number {
  const ratio = Math.min(1, wavesCleared / trial.waves.length);
  return Math.floor(trial.rewardArenaMarks * ratio);
}
