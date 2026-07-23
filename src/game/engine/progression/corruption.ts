/**
 * Corruption system — §15 "Sistema de Corrupción".
 *
 * Dark side thresholds that affect appearance, dialogue, and abilities.
 * Higher corruption unlocks Void Powers but closes Light-side options.
 */

export interface CorruptionThreshold {
  level: number;
  name: string;
  description: string;
  visualEffect: string;
  /** Skill IDs unlocked at this corruption level. */
  unlockedSkills: string[];
  /** Dialogue tone modifiers at this corruption level. */
  dialogueModifier: string;
}

export const CORRUPTION_THRESHOLDS: CorruptionThreshold[] = [
  {
    level: 0,
    name: "Sin corromper",
    description: "Sin signos visibles del lado oscuro.",
    visualEffect: "none",
    unlockedSkills: [],
    dialogueModifier: "normal",
  },
  {
    level: 25,
    name: "Tocado por la Oscuridad",
    description: "Tus ojos brillan con un tono amarillo antinatural. Los NPC perciben que algo va mal.",
    visualEffect: "yellow_eyes",
    unlockedSkills: ["force_fear", "drain_minor"],
    dialogueModifier: "npcs_uneasy",
  },
  {
    level: 50,
    name: "Corrupción Oscura",
    description: "Venas oscuras se extienden por tu piel. Tu presencia irradia amenaza.",
    visualEffect: "skin_corruption",
    unlockedSkills: ["force_choke", "force_frenzy"],
    dialogueModifier: "npcs_afraid",
  },
  {
    level: 75,
    name: "Voz del Vacío",
    description: "Tu voz arrastra una distorsión de otro mundo. El lado oscuro habla a través de ti.",
    visualEffect: "voice_distortion",
    unlockedSkills: ["soul_consumption", "force_storm_legendary"],
    dialogueModifier: "npcs_terrified",
  },
  {
    level: 100,
    name: "Recipiente del Hambre",
    description: "Apenas eres humano. El lado oscuro ha consumido tu forma. Los Poderes del Vacío están completamente desbloqueados.",
    visualEffect: "void_form",
    unlockedSkills: ["void_step", "echo_of_malachor"],
    dialogueModifier: "npcs_flee_or_worship",
  },
];

/** Get the current corruption tier for a given corruption value. */
export function getCorruptionTier(corruption: number): CorruptionThreshold {
  const sorted = [...CORRUPTION_THRESHOLDS].sort((a, b) => b.level - a.level);
  for (const tier of sorted) {
    if (corruption >= tier.level) return tier;
  }
  return CORRUPTION_THRESHOLDS[0]!;
}

/** Get all skills unlocked up to the current corruption level. */
export function getCorruptionSkills(corruption: number): string[] {
  return CORRUPTION_THRESHOLDS
    .filter((t) => corruption >= t.level)
    .flatMap((t) => t.unlockedSkills);
}

/** Check if corruption level triggers NPC fear reactions. */
export function isCorruptionFearful(corruption: number): boolean {
  return corruption >= 50;
}

/** Check if corruption has reached the point of no return. */
export function isVoidCorruption(corruption: number): boolean {
  return corruption >= 100;
}
