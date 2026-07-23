/**
 * Skill chains / combos (Idea #15).
 *
 * Casting skills in specific sequences triggers a CHAIN BONUS. The chain
 * resets if the player uses any other skill, takes damage, or 2 turns pass.
 *
 * Chain bonuses:
 *   - +X% damage on the final skill in the chain
 *   - chain-specific status effect on the final hit
 *   - some chains heal or grant a buff
 *
 * Each chain has a minimum class requirement (some are class-locked).
 */

export interface SkillChain {
  id: string;
  name: string;
  sequence: string[];     // ordered skill ids
  classId?: "marauder" | "inquisitor" | "assassin";
  finalDamageMult: number;
  description: string;
  /** Optional status effect applied on chain completion. */
  bonusStatus?: { effect: string; duration: number; chance: number };
}

export const SKILL_CHAINS: SkillChain[] = [
  // ── Tier-1 starter chains — give every class a real rotation from level 1
  {
    id: "chain_relentless_onslaught",
    name: "Embate Implacable",
    classId: "marauder",
    sequence: ["flurry", "power_attack", "heavy_slash"],
    finalDamageMult: 1.5,
    description: "Desgástalos, rompe la guardia y luego hiende. La apertura que todo Merodeador aprende primero.",
    bonusStatus: { effect: "bleed", duration: 2, chance: 1.0 },
  },
  {
    id: "chain_venomous_shadow",
    name: "Sombra Venenosa",
    classId: "assassin",
    sequence: ["poison_blade", "shadow_strike"],
    finalDamageMult: 1.5,
    description: "Envenena la sangre y luego golpea desde la oscuridad mientras arde.",
  },
  {
    id: "chain_storm_siphon",
    name: "Sifón de Tormenta",
    classId: "inquisitor",
    sequence: ["lightning_bolt", "drain_life"],
    finalDamageMult: 1.5,
    description: "Abre el cuerpo con una descarga y luego bebe lo que se derrama.",
    bonusStatus: { effect: "shock", duration: 2, chance: 1.0 },
  },

  {
    id: "chain_shadow_execution",
    name: "Ejecución de las Sombras",
    classId: "assassin",
    sequence: ["shadow_step", "backstab", "voidstrike"],
    finalDamageMult: 2.0,
    description: "Teletranspórtate detrás, apuñala por la espalda y luego golpea desde el vacío. El triple garantiza la muerte.",
    bonusStatus: { effect: "bleed", duration: 4, chance: 1.0 },
  },
  {
    id: "chain_burning_blood",
    name: "Sangre Ardiente",
    classId: "marauder",
    sequence: ["sundering_strike", "rage_burst", "execute"],
    finalDamageMult: 1.75,
    description: "Desgarra la armadura, atraviésala con furia, remata. Quema y sangra durante 4 turnos.",
    bonusStatus: { effect: "burn", duration: 4, chance: 1.0 },
  },
  {
    id: "chain_storm_caller",
    name: "Invocador de Tormentas",
    classId: "inquisitor",
    sequence: ["lightning_bolt", "chain_lightning", "force_storm"],
    finalDamageMult: 1.85,
    description: "Acumula la carga y luego desata la tormenta. La descarga de área se propaga.",
    bonusStatus: { effect: "shock", duration: 3, chance: 1.0 },
  },
  {
    id: "chain_devourer",
    name: "Hambre del Devorador",
    classId: "inquisitor",
    sequence: ["drain_life", "soul_drain", "nihilus_hunger"],
    finalDamageMult: 2.25,
    description: "Bebe vida, luego bebe almas, luego bébelo todo. Cura un 50% en el golpe final.",
  },
  {
    id: "chain_phantom_dance",
    name: "Danza Fantasma",
    classId: "assassin",
    sequence: ["vanish", "double_strike", "phantom_execution"],
    finalDamageMult: 2.0,
    description: "Desaparece, asesta un golpe doble desde la nada y luego desata la hoja fantasma.",
  },
];

/**
 * Returns the chain that the given recent-skill-history completes (if any),
 * else null.
 */
export function detectCompletedChain(history: string[]): SkillChain | null {
  for (const chain of SKILL_CHAINS) {
    if (history.length < chain.sequence.length) continue;
    const tail = history.slice(-chain.sequence.length);
    if (tail.every((s, i) => s === chain.sequence[i])) return chain;
  }
  return null;
}

/** Returns whether the partial sequence matches the prefix of any known chain. */
export function isOnChainPath(history: string[]): SkillChain | null {
  for (const chain of SKILL_CHAINS) {
    const partial = chain.sequence.slice(0, history.length);
    if (history.length === 0) continue;
    if (history.length >= chain.sequence.length) continue;
    if (partial.every((s, i) => s === history[i])) return chain;
  }
  return null;
}

/**
 * Finds the chain whose prefix matches the longest SUFFIX of the history
 * (the history may contain unrelated skills before the chain started).
 * Returns the best in-progress or just-completed chain, or null.
 */
export function detectChainProgress(
  history: string[],
): { chain: SkillChain; progress: number } | null {
  let best: { chain: SkillChain; progress: number } | null = null;
  for (const chain of SKILL_CHAINS) {
    const maxK = Math.min(history.length, chain.sequence.length);
    for (let k = maxK; k > 0; k--) {
      const tail = history.slice(-k);
      if (tail.every((s, i) => s === chain.sequence[i])) {
        if (!best || k > best.progress) best = { chain, progress: k };
        break;
      }
    }
  }
  return best;
}
