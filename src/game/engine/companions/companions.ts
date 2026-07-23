/**
 * Companion system — §4 "Compañeros".
 *
 * 5 companions with affinity, loyalty quests, and combat AI.
 */

export interface CompanionDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  classId: "marauder" | "inquisitor" | "assassin";
  /** Planet where recruited. */
  recruitPlanetId: string;
  /** Quest flag that triggers recruitment. */
  recruitFlag: string;
  /** Base stats at recruitment level. */
  baseLevel: number;
  primary: {
    strength: number;
    agility: number;
    endurance: number;
    force: number;
    influence: number;
    corruption: number;
  };
  skillIds: string[];
  /** Combat AI personality. */
  aiBehavior: "aggressive" | "defensive" | "balanced" | "support";
  /** Loyalty quest chain. */
  loyaltyQuestId: string;
  /** Affinity thresholds for conversation triggers. */
  affinityThresholds: number[];
  /** What actions increase/decrease affinity. */
  likes: string[];
  dislikes: string[];
}

export const COMPANIONS: CompanionDefinition[] = [
  {
    id: "kaelis",
    name: "Kaelis Dren",
    title: "El Rival Reforjado",
    description:
      "Un compañero acólito Sith que puede convertirse en tu mayor aliado o en tu enemigo más acérrimo. Hábil duelista con un código de honor inusual para un Sith.",
    classId: "marauder",
    recruitPlanetId: "korriban",
    recruitFlag: "kaelis_recruited",
    baseLevel: 3,
    primary: { strength: 8, agility: 7, endurance: 6, force: 5, influence: 4, corruption: 3 },
    skillIds: ["heavy_slash", "sundering_strike", "force_push"],
    aiBehavior: "balanced",
    loyaltyQuestId: "q_loyalty_kaelis",
    affinityThresholds: [10, 25, 50, 75, 100],
    likes: ["honor", "strength", "mercy_to_warriors"],
    dislikes: ["cowardice", "cruelty_to_innocents", "betrayal"],
  },
  {
    id: "v3x9",
    name: "V3X-9",
    title: "El Droide Rebelde",
    description:
      "Un antiguo droide asesino con los bancos de memoria corruptos y un humor seco. Eficiente en combate, de ética cuestionable.",
    classId: "assassin",
    recruitPlanetId: "korriban",
    recruitFlag: "v3x9_recruited",
    baseLevel: 4,
    primary: { strength: 6, agility: 9, endurance: 7, force: 0, influence: 2, corruption: 0 },
    skillIds: ["shadow_strike", "double_strike", "backstab"],
    aiBehavior: "aggressive",
    loyaltyQuestId: "q_loyalty_v3x9",
    affinityThresholds: [10, 25, 50, 75, 100],
    likes: ["efficiency", "violence", "logic"],
    dislikes: ["mercy", "sentimentality", "organic_weakness"],
  },
  {
    id: "serana",
    name: "Serana Voss",
    title: "La Jedi Caída",
    description:
      "Una antigua Padawan Jedi que perdió a su maestra a manos de los Sith. Se debate entre la luz y la oscuridad. Poderosa usuaria de la Fuerza.",
    classId: "inquisitor",
    recruitPlanetId: "nar_shaddaa",
    recruitFlag: "serana_recruited",
    baseLevel: 12,
    primary: { strength: 4, agility: 6, endurance: 5, force: 10, influence: 7, corruption: 2 },
    skillIds: ["lightning_bolt", "dark_heal", "drain_life"],
    aiBehavior: "support",
    loyaltyQuestId: "q_loyalty_serana",
    affinityThresholds: [10, 25, 50, 75, 100],
    likes: ["compassion", "knowledge", "redemption"],
    dislikes: ["unnecessary_cruelty", "dark_side_extremism", "ignorance"],
  },
  {
    id: "torvak",
    name: "Torvak",
    title: "El Mandaloriano",
    description:
      "Un guerrero mandaloriano curtido en batalla que busca rivales dignos. Respeta la fuerza y desprecia el engaño.",
    classId: "marauder",
    recruitPlanetId: "dxun",
    recruitFlag: "torvak_recruited",
    baseLevel: 20,
    primary: { strength: 12, agility: 10, endurance: 11, force: 0, influence: 6, corruption: 1 },
    skillIds: ["power_attack", "cleave", "saber_throw"],
    aiBehavior: "aggressive",
    loyaltyQuestId: "q_loyalty_torvak",
    affinityThresholds: [10, 25, 50, 75, 100],
    likes: ["combat", "honor", "directness"],
    dislikes: ["deception", "cowardice", "politics"],
  },
  {
    id: "echo_shade",
    name: "Echo Shade",
    title: "El Fantasma de la Fuerza",
    description:
      "Una entidad espectral atada a un antiguo artefacto sith. Ni del todo viva ni muerta. Vasto conocimiento del lado oscuro.",
    classId: "inquisitor",
    recruitPlanetId: "dantooine",
    recruitFlag: "echo_recruited",
    baseLevel: 25,
    primary: { strength: 3, agility: 8, endurance: 4, force: 15, influence: 10, corruption: 12 },
    skillIds: ["force_storm", "mind_crush", "corruption_aura"],
    aiBehavior: "support",
    loyaltyQuestId: "q_loyalty_echo",
    affinityThresholds: [10, 25, 50, 75, 100],
    likes: ["knowledge", "dark_side_mastery", "ancient_artifacts"],
    dislikes: ["ignorance", "wasted_potential", "light_side_devotion"],
  },
];

/** Max party size (including player). */
export const MAX_PARTY_SIZE = 3;

/** Affinity change amounts. */
export const AFFINITY_GAIN = 5;
export const AFFINITY_LOSS = -5;
export const AFFINITY_BIG_GAIN = 15;
export const AFFINITY_BIG_LOSS = -15;
export const AFFINITY_MAX = 100;
export const AFFINITY_MIN = -100;
