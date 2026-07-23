import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";

/**
 * Dynamic dialogues — NPC Dialogue Bible §9-16.
 *
 * Includes:
 * - Combat dialogue (boss taunts)
 * - Execution scenes (defeated enemies)
 * - Political dialogues (senator)
 * - Existential dialogues
 * - Extreme corruption dialogues
 * - Republic Guard encounter
 * - Companion intervention hooks
 * - Dynamic NPC reactions based on corruption/reputation/relics
 */

// ═══════════════════════════════════════════════════════════════════════
// COMBAT DIALOGUES — Boss taunts (§10)
// ═══════════════════════════════════════════════════════════════════════

export const COMBAT_TAUNTS: Record<string, string[]> = {
  darth_sion: [
    "El dolor me mantiene con vida.",
    "No se me puede matar. Soy el dolor mismo.",
    "Cada herida me hace más fuerte.",
    "Te quebrarás antes que yo.",
  ],
  serana: [
    "No eres el único que aprendió a odiar.",
    "Me enseñé a mí misma a odiar todo lo que solía amar.",
    "Esto es personal.",
  ],
  darth_nihilus: [
    "...",
    "...hhhhh...",
    // No speech. Only whispers and distorted subtitles.
  ],
  darth_traya: [
    "He previsto cada desenlace. No puedes sorprenderme.",
    "La Fuerza ata todas las cosas. Yo la desataré.",
    "Eres el arma que forjé. Ahora debo quebrarte.",
  ],
  darth_voren: [
    "Yo te creé. Yo puedo deshacerte.",
    "Nunca estuviste destinado a superarme.",
    "Las cadenas más fuertes son las que elegiste llevar.",
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// EXECUTION SCENES — Defeated enemy options (§11)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_EXECUTION: DialogueConversation = {
  id: "conv_execution",
  startNodeId: "exec1",
  nodes: {
    exec1: {
      id: "exec1",
      speaker: null,
      text: "Tu enemigo yace derrotado a tus pies, jadeando por aire.",
      options: [],
      autoNext: "exec2",
    },
    exec2: {
      id: "exec2",
      speaker: "Enemigo Derrotado",
      text: "Espera... por favor...",
      options: [
        {
          id: "exec_kill",
          text: "Patético.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 3 },
            { type: "add_xp", value: 25 },
          ],
          nextNodeId: "exec3_kill",
        },
        {
          id: "exec_spare",
          text: "Sírveme y vive.",
          tone: "deceptive",
          consequences: [
            { type: "corruption_change", value: 1 },
          ],
          nextNodeId: "exec3_spare",
        },
        {
          id: "exec_release",
          text: "Corre.",
          tone: "light",
          consequences: [],
          nextNodeId: "exec3_release",
        },
      ],
    },
    exec3_kill: {
      id: "exec3_kill",
      speaker: null,
      text: "Acabas con él. El lado oscuro zumba de satisfacción.",
      options: [],
      autoNext: null,
    },
    exec3_spare: {
      id: "exec3_spare",
      speaker: "Enemigo Derrotado",
      text: "Sí... sí, serviré. Soy tuyo.",
      options: [],
      onEnter: [
        { type: "set_flag", key: "enemy_enslaved", value: true },
      ],
      autoNext: null,
    },
    exec3_release: {
      id: "exec3_release",
      speaker: null,
      text: "Se incorpora a trompicones y huye. ¿Misericordia — o contención calculada?",
      options: [],
      autoNext: null,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// REPUBLIC GUARD — Generic encounter (§8)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_REPUBLIC_GUARD: DialogueConversation = {
  id: "conv_republic_guard",
  startNodeId: "rg1",
  nodes: {
    rg1: {
      id: "rg1",
      speaker: "Guardia de la República",
      text: "Identificación. Ahora.",
      options: [
        {
          id: "rg1_authority",
          text: "No tienes autoridad sobre mí.",
          tone: "aggressive",
          consequences: [],
          nextNodeId: "rg2_authority",
        },
        {
          id: "rg1_calm",
          text: "Relájate.",
          tone: "neutral",
          consequences: [],
          nextNodeId: "rg2_calm",
        },
        {
          id: "rg1_bribe",
          text: "Quizás esto ayude.",
          tone: "deceptive",
          consequences: [
            { type: "add_credits", value: -100 },
          ],
          nextNodeId: "rg2_bribe",
        },
        {
          id: "rg1_force",
          text: "[Fuerza 8] No viste nada.",
          check: { type: "force", value: 8 },
          checkLabel: "[Fuerza 8]",
          tone: "deceptive",
          consequences: [
            { type: "corruption_change", value: 1 },
          ],
          nextNodeId: "rg2_force",
        },
        {
          id: "rg1_attack",
          text: "[Atacar]",
          tone: "aggressive",
          consequences: [
            { type: "corruption_change", value: 5 },
            { type: "start_combat", combatEncounterId: "republic_guard" },
          ],
          nextNodeId: null,
        },
      ],
    },
    rg2_authority: {
      id: "rg2_authority",
      speaker: "Guardia de la República",
      text: "¿Eso es una amenaza? Porque tengo veinte hombres detrás de mí y tú tienes un sable de luz y mala actitud.",
      options: [
        {
          id: "rg2a_back_down",
          text: "Bien. Aquí tienes mi identificación.",
          tone: "neutral",
          consequences: [],
          nextNodeId: null,
        },
        {
          id: "rg2a_escalate",
          text: "Entonces es una pelea injusta. Para ellos.",
          tone: "aggressive",
          consequences: [
            { type: "start_combat", combatEncounterId: "republic_guard_squad" },
          ],
          nextNodeId: null,
        },
      ],
    },
    rg2_calm: {
      id: "rg2_calm",
      speaker: "Guardia de la República",
      text: "Fácil decirlo para ti. Mira, solo enséñame tus papeles y sigue tu camino.",
      options: [],
      autoNext: null,
    },
    rg2_bribe: {
      id: "rg2_bribe",
      speaker: "Guardia de la República",
      text: "...Los créditos hablan. Sigue tu camino. No vi nada.",
      options: [],
      onEnter: [{ type: "set_flag", key: "guard_bribed", value: true }],
      autoNext: null,
    },
    rg2_force: {
      id: "rg2_force",
      speaker: "Guardia de la República",
      text: "Yo... no vi nada. Continúa.",
      options: [],
      autoNext: null,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// POLITICAL DIALOGUES — Senator (§12)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_SENATOR: DialogueConversation = {
  id: "conv_senator",
  startNodeId: "sen1",
  nodes: {
    sen1: {
      id: "sen1",
      speaker: "Senador",
      text: "La República agoniza.",
      options: [
        {
          id: "sen1_fall",
          text: "Entonces merece caer.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 2 },
          ],
          nextNodeId: "sen2_fall",
        },
        {
          id: "sen1_chaos",
          text: "El caos beneficia a muchos.",
          tone: "deceptive",
          consequences: [],
          nextNodeId: "sen2_chaos",
        },
        {
          id: "sen1_stabilize",
          text: "Puedo estabilizarla.",
          tone: "light",
          consequences: [
            { type: "faction_rep", factionId: "hidden_jedi", value: 5 },
          ],
          nextNodeId: "sen2_stabilize",
        },
      ],
    },
    sen2_fall: {
      id: "sen2_fall",
      speaker: "Senador",
      text: "Quizás. Pero lo que se alza de las cenizas nunca es lo que esperas. Ten cuidado con lo que deseas, Sith.",
      options: [],
      autoNext: null,
    },
    sen2_chaos: {
      id: "sen2_chaos",
      speaker: "Senador",
      text: "Suenas como cada señor del crimen de Nar Shaddaa. Al menos ellos son honestos sobre su ambición.",
      options: [],
      autoNext: null,
    },
    sen2_stabilize: {
      id: "sen2_stabilize",
      speaker: "Senador",
      text: "¿Un Sith ofreciendo estabilidad? Es lo más sincero o lo más peligroso que he oído jamás.",
      options: [],
      autoNext: null,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// EXISTENTIAL DIALOGUES (§13)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_EXISTENTIAL: DialogueConversation = {
  id: "conv_existential",
  startNodeId: "ex1",
  nodes: {
    ex1: {
      id: "ex1",
      speaker: "Holocrón Antiguo",
      text: "¿Y si la propia Fuerza es el verdadero tirano?",
      options: [
        {
          id: "ex1_destroy",
          text: "Entonces la destruiré.",
          tone: "aggressive",
          consequences: [
            { type: "corruption_change", value: 5 },
            { type: "set_flag", key: "wants_to_destroy_force", value: true },
          ],
          nextNodeId: "ex2_destroy",
        },
        {
          id: "ex1_accept",
          text: "Sin ella no somos nada.",
          tone: "neutral",
          consequences: [],
          nextNodeId: "ex2_accept",
        },
        {
          id: "ex1_use",
          text: "La usaré antes de destruirla.",
          tone: "deceptive",
          consequences: [
            { type: "corruption_change", value: 3 },
          ],
          nextNodeId: "ex2_use",
        },
      ],
    },
    ex2_destroy: {
      id: "ex2_destroy",
      speaker: "Holocrón Antiguo",
      text: "Entonces recorres el mismo camino que Nihilus. Él buscó devorar la Fuerza. Al final, ella lo devoró a él. ¿Serás tú distinto?",
      options: [],
      autoNext: null,
    },
    ex2_accept: {
      id: "ex2_accept",
      speaker: "Holocrón Antiguo",
      text: "Quizás. Pero el esclavo que ama sus cadenas no es menos esclavo. Considéralo.",
      options: [],
      autoNext: null,
    },
    ex2_use: {
      id: "ex2_use",
      speaker: "Holocrón Antiguo",
      text: "La respuesta del pragmático. Traya dijo lo mismo. Fracasó. Pero entonces... ella eligió fracasar.",
      options: [],
      autoNext: null,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// EXTREME CORRUPTION DIALOGUES (§14)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_EXTREME_CORRUPTION: DialogueConversation = {
  id: "conv_extreme_corruption",
  startNodeId: "ec1",
  nodes: {
    ec1: {
      id: "ec1",
      speaker: "PNJ",
      text: "Ya no eres humano...",
      options: [
        {
          id: "ec1_correct",
          text: "Correcto.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 1 },
          ],
          nextNodeId: "ec2_correct",
        },
        {
          id: "ec1_never",
          text: "Nunca lo fui.",
          tone: "dark",
          consequences: [],
          nextNodeId: "ec2_never",
        },
        {
          id: "ec1_fear",
          text: "Y sin embargo me temes.",
          tone: "aggressive",
          consequences: [
            { type: "corruption_change", value: 2 },
          ],
          nextNodeId: "ec2_fear",
        },
      ],
    },
    ec2_correct: {
      id: "ec2_correct",
      speaker: null,
      text: "El PNJ retrocede despacio, incapaz de sostenerte la mirada. El lado oscuro irradia de ti como el calor de una estrella.",
      options: [],
      autoNext: null,
    },
    ec2_never: {
      id: "ec2_never",
      speaker: null,
      text: "Algo antiguo y hambriento se agita tras tus ojos. El PNJ siente cómo su fuerza vital es arrastrada hacia ti.",
      options: [],
      autoNext: null,
    },
    ec2_fear: {
      id: "ec2_fear",
      speaker: "PNJ",
      text: "Sí... sí, te temo. Por favor... solo vete.",
      options: [],
      autoNext: null,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// DYNAMIC DIALOGUE CONDITIONS (§9)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Dynamic NPC reactions based on player state.
 * Used to modify NPC greetings and available dialogue options.
 */
export interface DynamicDialogueCondition {
  id: string;
  /** Condition to check. */
  check: {
    type: "corruption" | "reputation" | "companion" | "relic" | "quest" | "planet";
    minValue?: number;
    factionId?: string;
    companionId?: string;
    itemId?: string;
    flagKey?: string;
    planetId?: string;
  };
  /** Replacement greeting text when condition is met. */
  greeting: string;
  /** Additional dialogue option added when condition is met. */
  extraOption?: {
    text: string;
    tone: "neutral" | "dark" | "light" | "aggressive" | "deceptive";
  };
}

export const DYNAMIC_CONDITIONS: DynamicDialogueCondition[] = [
  {
    id: "dc_corruption_high",
    check: { type: "corruption", minValue: 70 },
    greeting: "Por favor... aléjate de mí.",
    extraOption: {
      text: "[Corrupción] Te arrodillarás o morirás.",
      tone: "dark",
    },
  },
  {
    id: "dc_corruption_max",
    check: { type: "corruption", minValue: 100 },
    greeting: "El PNJ cae de rodillas, abrumado por el vacío que emana de ti.",
  },
  {
    id: "dc_sith_mask",
    check: { type: "relic", itemId: "nihilus_mask_fragment" },
    greeting: "Esa reliquia... creía que había sido destruida.",
    extraOption: {
      text: "Dime lo que sabes sobre esta máscara.",
      tone: "neutral",
    },
  },
  {
    id: "dc_crimson_fang",
    check: { type: "relic", itemId: "crimson_fang" },
    greeting: "Esa hoja... ha probado mucha sangre.",
  },
  {
    id: "dc_kaelis_present",
    check: { type: "companion", companionId: "kaelis" },
    greeting: "¿Un Sith viajando con un Jedi caído? Compañía inusual.",
  },
  {
    id: "dc_v3x9_present",
    check: { type: "companion", companionId: "v3x9" },
    greeting: "¿Eso es... un droide asesino? Mantenlo lejos de mí.",
  },
  {
    id: "dc_serana_present",
    check: { type: "companion", companionId: "serana" },
    greeting: "Tu acompañante me observa como un depredador observa a su presa.",
  },
  {
    id: "dc_sith_exalted",
    check: { type: "reputation", factionId: "sith_empire", minValue: 100 },
    greeting: "Darth... perdóname. No te reconocí.",
  },
  {
    id: "dc_jedi_honored",
    check: { type: "reputation", factionId: "jedi_remnant", minValue: 50 },
    greeting: "Los Jedi hablan bien de ti. Eso es... inusual para alguien de tu clase.",
  },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPANION INTERVENTIONS (§15)
// ═══════════════════════════════════════════════════════════════════════

/**
 * When a companion is in the party, they may interject during NPC dialogues.
 * These are keyed by companion ID and trigger context.
 */
export interface CompanionInterjection {
  companionId: string;
  /** Trigger condition (e.g., when NPC says something specific). */
  trigger: string;
  /** The companion's interjection text. */
  text: string;
}

export const COMPANION_INTERJECTIONS: CompanionInterjection[] = [
  // When an NPC says they don't trust Sith
  { companionId: "kaelis", trigger: "npc_distrust_sith", text: "Por una vez... estoy de acuerdo." },
  { companionId: "serana", trigger: "npc_distrust_sith", text: "Entonces muere desconfiando." },
  { companionId: "v3x9", trigger: "npc_distrust_sith", text: "Observación: la confianza es irrelevante. La supervivencia no." },
  { companionId: "torvak", trigger: "npc_distrust_sith", text: "Listo. Pero no estamos aquí para que confíen en nosotros." },
  { companionId: "echo_shade", trigger: "npc_distrust_sith", text: "Los muertos tampoco confían. Y sin embargo aquí estoy." },

  // When the player is being merciful
  { companionId: "kaelis", trigger: "player_mercy", text: "Una visión rara en esta galaxia. Aférrate a eso." },
  { companionId: "v3x9", trigger: "player_mercy", text: "Consulta: ¿fue eso misericordia o un error de cálculo?" },
  { companionId: "serana", trigger: "player_mercy", text: "Misericordia. Qué... decepcionante." },
  { companionId: "torvak", trigger: "player_mercy", text: "La misericordia es para los fuertes. Los débiles no pueden permitírsela." },

  // When the player is being cruel
  { companionId: "kaelis", trigger: "player_cruelty", text: "¿Era eso necesario?" },
  { companionId: "v3x9", trigger: "player_cruelty", text: "Evaluación: eficiente. Índice de aprobación incrementado." },
  { companionId: "serana", trigger: "player_cruelty", text: "Ahora aprendes." },
  { companionId: "torvak", trigger: "player_cruelty", text: "Hmm. Eso fue... frío. Incluso para mí." },
  { companionId: "echo_shade", trigger: "player_cruelty", text: "El lado oscuro crece dentro de ti. Bien." },
];

// ═══════════════════════════════════════════════════════════════════════
// Export all dynamic dialogues
// ═══════════════════════════════════════════════════════════════════════

export const DYNAMIC_CONVERSATIONS: Record<string, DialogueConversation> = {
  conv_execution: CONV_EXECUTION,
  conv_republic_guard: CONV_REPUBLIC_GUARD,
  conv_senator: CONV_SENATOR,
  conv_existential: CONV_EXISTENTIAL,
  conv_extreme_corruption: CONV_EXTREME_CORRUPTION,
};
