/**
 * Boss Phase System.
 *
 * Multi-phase boss encounters where the boss changes behavior, gains new
 * abilities, and may restore HP at phase transitions.
 *
 * Source: Advanced Implementation Proposals §1 "Boss Design Philosophy".
 */

export type BossPhaseTransitionTrigger =
  | { type: "hp_percent"; value: number }  // trigger when HP falls below %
  | { type: "turn_count"; value: number }  // trigger after N turns
  | { type: "flag"; flagKey: string };     // trigger when a quest flag is set

export interface BossPhase {
  phaseNumber: number;
  name: string;
  description: string;
  /** HP restore on entering this phase (flat amount, 0 = none). */
  hpRestoreOnEnter: number;
  /** Multipliers applied to boss stats during this phase. */
  statModifiers: {
    damageMult?: number;
    armorMult?: number;
    speedMult?: number;
  };
  /** Additional skill IDs unlocked during this phase. */
  additionalSkills: string[];
  /** Status effects applied to the boss on entering phase. */
  onEnterEffects: string[];
  /** Environmental/battlefield modifier active during this phase. */
  battlefieldModifier?: string;
  /** Trigger condition to leave this phase and advance to next. */
  transition?: BossPhaseTransitionTrigger;
}

export interface BossDefinition {
  enemyId: string;
  name: string;
  /** Intro dialogue node ID shown at combat start. */
  introDialogue?: string;
  /** Ordered phases. Phase 1 starts at combat begin. */
  phases: BossPhase[];
}

// ═══════════════════════════════════════════════════════════════════════
// Boss Phase Definitions
// ═══════════════════════════════════════════════════════════════════════

export const BOSS_PHASES: BossDefinition[] = [
  // ─── Darth Voren ─────────────────────────────────────────────────────
  {
    enemyId: "darth_voren",
    name: "Darth Voren",
    introDialogue: "conv_voren_trial",
    phases: [
      {
        phaseNumber: 1,
        name: "La Prueba",
        description: "Voren lucha con método — pone a prueba tu estilo, tantea tus debilidades.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 1.0 },
        additionalSkills: ["enemy_saber_combo", "enemy_rage"],
        onEnterEffects: [],
        transition: { type: "hp_percent", value: 60 },
      },
      {
        phaseNumber: 2,
        name: "Arena de Rayos de la Fuerza",
        description: "Voren abandona los juegos de sable. Los rayos crepitan por el suelo de la arena.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 1.3, speedMult: 1.1 },
        additionalSkills: ["enemy_force_lightning", "enemy_force_choke"],
        onEnterEffects: ["battlefield_charged_floor"],
        battlefieldModifier: "charged_floor",
        transition: { type: "hp_percent", value: 25 },
      },
      {
        phaseNumber: 3,
        name: "Maestro Enfurecido",
        description: "Voren abandona la contención. Furia sith en bruto. Más rápido, más duro, implacable.",
        hpRestoreOnEnter: 150,
        statModifiers: { damageMult: 1.6, armorMult: 0.8, speedMult: 1.3 },
        additionalSkills: ["enemy_dark_heal", "enemy_rage", "enemy_saber_combo"],
        onEnterEffects: ["rage"],
        transition: undefined,
      },
    ],
  },

  // ─── Darth Sion ───────────────────────────────────────────────────────
  {
    enemyId: "darth_sion",
    name: "Darth Sion, Señor del Dolor",
    introDialogue: undefined,
    phases: [
      {
        phaseNumber: 1,
        name: "Roto pero Inquebrantable",
        description: "Sion absorbe el daño y se levanta. Los ataques directos son inútiles hasta quebrar su voluntad.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 1.0, armorMult: 1.5 },
        additionalSkills: ["enemy_saber_combo", "enemy_undying"],
        onEnterEffects: [],
        transition: { type: "hp_percent", value: 50 },
      },
      {
        phaseNumber: 2,
        name: "Dolor Hecho Carne",
        description: "Sion deja de regenerarse y ataca con pura agresión arrolladora.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 1.5, armorMult: 1.0, speedMult: 1.2 },
        additionalSkills: ["enemy_rage", "enemy_force_scream", "enemy_pain_embrace"],
        onEnterEffects: ["rage"],
        transition: { type: "hp_percent", value: 10 },
      },
      {
        phaseNumber: 3,
        name: "Voluntad Final",
        description: "Al borde de la muerte, Sion elige soltarse. Su cuerpo empieza a fallar. La victoria está en hacerle rendir su voluntad de vivir.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 0.7 },
        additionalSkills: [],
        onEnterEffects: [],
        transition: undefined,
      },
    ],
  },

  // ─── Darth Nihilus ────────────────────────────────────────────────────
  {
    enemyId: "darth_nihilus",
    name: "Darth Nihilus, Señor del Hambre",
    introDialogue: undefined,
    phases: [
      {
        phaseNumber: 1,
        name: "El Vacío Despierta",
        description: "Nihilus drena Fuerza de forma pasiva. Cada acción que realizas lo alimenta. Minimiza el uso de la Fuerza.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 1.0 },
        additionalSkills: ["enemy_force_drain", "enemy_void_blast"],
        onEnterEffects: [],
        battlefieldModifier: "force_drain_aura",
        transition: { type: "hp_percent", value: 50 },
      },
      {
        phaseNumber: 2,
        name: "Hambre Desatada",
        description: "Nihilus se fortalece con lo que ha consumido. Sus ataques pueden matar de un golpe a los combatientes desprevenidos.",
        hpRestoreOnEnter: 500,
        statModifiers: { damageMult: 1.8, speedMult: 1.2 },
        additionalSkills: ["enemy_consume", "enemy_force_storm", "enemy_mass_drain"],
        onEnterEffects: [],
        battlefieldModifier: "force_drain_aura",
        transition: { type: "hp_percent", value: 15 },
      },
      {
        phaseNumber: 3,
        name: "El Vacío Habla",
        description: "Nihilus abandona toda defensa. Pura ofensiva. Puro hambre.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 2.5, armorMult: 0.5 },
        additionalSkills: ["enemy_mass_drain"],
        onEnterEffects: [],
        transition: undefined,
      },
    ],
  },

  // ─── Darth Traya ──────────────────────────────────────────────────────
  {
    enemyId: "darth_traya",
    name: "Darth Traya, Señora de la Traición",
    introDialogue: undefined,
    phases: [
      {
        phaseNumber: 1,
        name: "Tres Sables",
        description: "Tres sables de luz orbitan a Traya, atacando cada uno por su cuenta. Interrumpirlos es la clave.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 1.0 },
        additionalSkills: ["enemy_saber_combo", "enemy_force_push"],
        onEnterEffects: [],
        battlefieldModifier: "three_sabers",
        transition: { type: "hp_percent", value: 66 },
      },
      {
        phaseNumber: 2,
        name: "El Filo de la Traición",
        description: "Traya vuelve su conocimiento de tus técnicas contra ti. Contrarresta tus ataques más fuertes.",
        hpRestoreOnEnter: 200,
        statModifiers: { damageMult: 1.4 },
        additionalSkills: ["enemy_force_lightning", "enemy_dark_heal", "enemy_force_choke"],
        onEnterEffects: [],
        battlefieldModifier: "three_sabers",
        transition: { type: "hp_percent", value: 25 },
      },
      {
        phaseNumber: 3,
        name: "La Lección Final",
        description: "Traya revela la verdad que ha guardado. La lección final del modo más doloroso.",
        hpRestoreOnEnter: 0,
        statModifiers: { damageMult: 2.0, speedMult: 1.4 },
        additionalSkills: ["enemy_force_storm", "enemy_void_blast", "enemy_drain_life"],
        onEnterEffects: [],
        transition: undefined,
      },
    ],
  },
];

export const BOSS_MAP = new Map(BOSS_PHASES.map((b) => [b.enemyId, b]));

/** Get the current phase for a boss given its HP percentage. */
export function getCurrentBossPhase(
  bossId: string,
  hpPercent: number,
  currentPhase: number,
): BossPhase | undefined {
  const boss = BOSS_MAP.get(bossId);
  if (!boss) return undefined;

  const phase = boss.phases[currentPhase - 1];
  if (!phase) return boss.phases[0];

  const trigger = phase.transition;
  if (trigger?.type === "hp_percent" && hpPercent <= trigger.value) {
    return boss.phases[currentPhase] ?? phase; // advance to next
  }

  return phase;
}
