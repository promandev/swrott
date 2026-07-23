import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";

/**
 * NPC definitions and their first-encounter dialogues.
 * Source: Master Design Bible §13 "Personajes".
 */

/** Flag-gated conversation selection — first matching rule wins. */
export interface NpcConversationRule {
  id: string;
  /** Only eligible when this quest flag is truthy. */
  requireFlag?: string;
  /** Skipped when this quest flag is truthy. */
  hideIfFlag?: string;
}

export interface NpcDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  zoneId: string;
  /** Conversation IDs this NPC can trigger. */
  conversationIds: string[];
  /**
   * Ordered selection rules. NPCs progress through their dialogue arcs:
   * intros hide themselves once seen, later conversations unlock via flags.
   * When absent, the first conversationId is always used.
   */
  conversationRules?: NpcConversationRule[];
}

export const KORRIBAN_NPCS: NpcDefinition[] = [
  {
    id: "npc_darth_voren",
    name: "Darth Voren",
    title: "Tu Maestro",
    description: "Un imponente Lord Sith con ojos como brasas ardientes. Te considera como uno consideraría una herramienta — útil hasta que se rompe.",
    zoneId: "korriban_academy_interior",
    conversationIds: ["conv_voren_intro", "conv_voren_trial", "conv_voren_duel"],
    conversationRules: [
      { id: "conv_voren_duel", requireFlag: "main_guardian_defeated", hideIfFlag: "main_voren_duel" },
      { id: "conv_voren_intro", hideIfFlag: "main_met_voren" },
      { id: "conv_voren_trial", requireFlag: "main_met_voren" },
    ],
  },
  {
    id: "npc_archivist_kheln",
    name: "Archivista Kheln",
    title: "Guardián de los Textos Prohibidos",
    description: "Un antiguo Sith de sangre pura que habla en acertijos. Su conocimiento de las viejas costumbres no tiene rival.",
    zoneId: "korriban_academy_interior",
    conversationIds: ["conv_kheln_intro", "conv_kheln_quest"],
    conversationRules: [
      { id: "conv_kheln_intro", hideIfFlag: "kheln_met" },
      { id: "conv_kheln_quest", requireFlag: "kheln_met" },
    ],
  },
  {
    id: "npc_overseer_raxis",
    name: "Supervisora Raxis",
    title: "Supervisora de Entrenamiento",
    description: "Una veterana llena de cicatrices que adiestra a los acólitos con brutal eficacia. No tiene paciencia para la debilidad.",
    zoneId: "korriban_academy_interior",
    conversationIds: ["conv_raxis_intro", "conv_raxis_trial"],
    conversationRules: [
      { id: "conv_raxis_trial", requireFlag: "raxis_accepted", hideIfFlag: "main_trial_blood" },
      { id: "conv_raxis_intro", hideIfFlag: "raxis_accepted" },
    ],
  },
  {
    id: "npc_daryth",
    name: "Daryth",
    title: "Acólito Rival",
    description: "Un acólito humano con una sonrisa cruel y un resentimiento a cuestas. Te ve como un obstáculo que eliminar.",
    zoneId: "korriban_academy_interior",
    conversationIds: ["conv_daryth_challenge", "conv_daryth_defeated"],
    conversationRules: [
      { id: "conv_daryth_defeated", requireFlag: "rival_daryth_defeated" },
      { id: "conv_daryth_challenge", hideIfFlag: "rival_accepted" },
    ],
  },
  {
    id: "npc_kira_slave",
    name: "Kira",
    title: "Esclava Trabajadora",
    description: "Una joven esclava twi'lek que trabaja las minas. Ojos desafiantes pese a sus cadenas.",
    zoneId: "korriban_mines",
    conversationIds: ["conv_kira_plea", "conv_kira_uprising"],
    conversationRules: [
      { id: "conv_kira_uprising", requireFlag: "helped_kira", hideIfFlag: "slave_choice_made" },
      { id: "conv_kira_plea", hideIfFlag: "helped_kira" },
    ],
  },
  {
    id: "npc_merchant_grot",
    name: "Grot",
    title: "Traficante del Mercado Negro",
    description: "Un rodiano que, de algún modo, mantiene un puesto de comercio en los niveles inferiores de la Academia. No preguntes de dónde sale su mercancía.",
    zoneId: "korriban_academy_interior",
    conversationIds: ["conv_grot_shop"],
  },

  // ── Dreshdae Settlement ───────────────────────────────────────────
  {
    id: "npc_seyla",
    name: "Seyla",
    title: "Cantinera",
    description: "Una curtida mujer humana que ha sobrevivido a tres administraciones de Czerka y a más acólitos de los que puede contar. Lo oye todo.",
    zoneId: "korriban_dreshdae",
    conversationIds: ["conv_seyla_intro"],
  },
  {
    id: "npc_czerka_varn",
    name: "Varn Dassik",
    title: "Representante de Czerka",
    description: "Un hombre de empresa con un traje impecable, sudando bajo el calor de Korriban y fingiendo que no. En él, todo está en venta.",
    zoneId: "korriban_dreshdae",
    conversationIds: ["conv_varn_intro"],
  },
  {
    id: "npc_thane",
    name: "Thane",
    title: "Figura Encapuchada",
    description: "Un joven apretado contra un rincón en sombras, la capucha calada, las manos temblando. El hedor del miedo lo envuelve como humo.",
    zoneId: "korriban_dreshdae",
    conversationIds: ["conv_thane_deserter"],
  },
];

export const NPC_MAP = new Map(KORRIBAN_NPCS.map((n) => [n.id, n]));

// ═══════════════════════════════════════════════════════════════════════
// Sample Dialogues
// ═══════════════════════════════════════════════════════════════════════

export const CONV_VOREN_INTRO: DialogueConversation = {
  id: "conv_voren_intro",
  startNodeId: "v1",
  nodes: {
    v1: {
      id: "v1",
      speaker: "Darth Voren",
      text: "Mírate. Cadenas al cuello. Sangre en las manos. Y aún así... la Fuerza grita dentro de ti.",
      options: [
        {
          id: "v1_defiant",
          text: "No necesito tus palabras.",
          tone: "aggressive",
          consequences: [
            { type: "faction_rep", factionId: "sith_academy", value: 5 },
          ],
          nextNodeId: "v2_defiant",
        },
        {
          id: "v1_question",
          text: "¿Por qué me trajiste aquí?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "v2_question",
        },
        {
          id: "v1_demand",
          text: "Libérame.",
          tone: "aggressive",
          consequences: [],
          nextNodeId: "v2_demand",
        },
        {
          id: "v1_cunning",
          text: "[Influencia 3] Podría serte útil.",
          check: { type: "influence", value: 3 },
          checkLabel: "[Influencia 3]",
          tone: "deceptive",
          consequences: [
            { type: "faction_rep", factionId: "sith_academy", value: 10 },
          ],
          nextNodeId: "v2_cunning",
        },
        {
          id: "v1_attack",
          text: "[Atacar]",
          tone: "aggressive",
          consequences: [
            { type: "corruption_change", value: 2 },
          ],
          nextNodeId: "v2_attack",
        },
      ],
    },
    v2_defiant: {
      id: "v2_defiant",
      speaker: "Darth Voren",
      text: "¡Ja! Audaz. Las palabras audaces abundan en esta Academia. Los actos audaces... menos. Veremos si tu espina dorsal está a la altura de tu lengua.",
      options: [],
      autoNext: "v3",
    },
    v2_question: {
      id: "v2_question",
      speaker: "Darth Voren",
      text: "Los Jedi piden libertad. Los Sith toman el poder. Te traje aquí porque la Fuerza lo quiere — y porque necesito un arma que no sepa que es un arma.",
      options: [],
      autoNext: "v3",
    },
    v2_demand: {
      id: "v2_demand",
      speaker: "Darth Voren",
      text: "Los Jedi piden libertad. Los Sith toman el poder. Cuando seas capaz de arrebatarme tu libertad, la tendrás. Hasta entonces, eres mío.",
      options: [],
      autoNext: "v3",
    },
    v2_cunning: {
      id: "v2_cunning",
      speaker: "Darth Voren",
      text: "Ambición. Quizás sobrevivas. La mayoría de los gusanos con ambición arden con fuerza y brevedad. Pero algunos... algunos se convierten en armas que puedo usar.",
      options: [],
      autoNext: "v3",
    },
    v2_attack: {
      id: "v2_attack",
      speaker: null,
      text: "Te abalanzas sobre Darth Voren. Antes de dar un segundo paso, una fuerza invisible te oprime la garganta. Tus pies se despegan del suelo.",
      options: [],
      autoNext: "v2_attack_response",
    },
    v2_attack_response: {
      id: "v2_attack_response",
      speaker: "Darth Voren",
      text: "Nunca vuelvas a alzar la mano contra mí. La próxima vez no seré tan misericordioso.",
      options: [],
      onEnter: [
        { type: "set_flag", key: "voren_attacked", value: true },
      ],
      autoNext: "v3",
    },
    v3: {
      id: "v3",
      speaker: "Darth Voren",
      text: "Tu primera tarea es simple. Sobrevive. La Academia te pondrá a prueba. Si caes, no merecías nada más. Preséntate ante la Supervisora Raxis para tu prueba inicial.",
      options: [
        {
          id: "v3_accept",
          text: "Así se hará.",
          consequences: [
            { type: "set_flag", key: "main_met_voren", value: true },
            { type: "start_quest", questId: "q_chains_of_korriban" },
          ],
          nextNodeId: null,
        },
      ],
      onEnter: [
        { type: "set_flag", key: "main_arrived_academy", value: true },
      ],
    },
  },
};

/** Darth Voren — Philosophical conversation (after first meeting). */
export const CONV_VOREN_PHILOSOPHY: DialogueConversation = {
  id: "conv_voren_trial",
  startNodeId: "vp1",
  nodes: {
    vp1: {
      id: "vp1",
      speaker: null,
      text: "Encuentras a Darth Voren meditando en su cámara. La energía oscura crepita a su alrededor.",
      options: [
        {
          id: "vp1_ask",
          text: "¿Qué es la Fuerza?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "vp2",
        },
        {
          id: "vp1_leave",
          text: "Volveré más tarde.",
          tone: "neutral",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
    vp2: {
      id: "vp2",
      speaker: "Darth Voren",
      text: "Los Jedi creen que la Fuerza es equilibrio. Necios. La Fuerza es voluntad. El universo pertenece a quien sea capaz de doblegarlo.",
      options: [
        {
          id: "vp2_dominate",
          text: "Entonces dominaré la galaxia.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 3 },
            { type: "faction_rep", factionId: "sith_academy", value: 5 },
          ],
          nextNodeId: "vp3_dark",
        },
        {
          id: "vp2_war",
          text: "Eso solo crea una guerra sin fin.",
          tone: "light",
          consequences: [
            { type: "companion_affinity", companionId: "kaelis", value: 5 },
          ],
          nextNodeId: "vp3_light",
        },
        {
          id: "vp2_pragmatic",
          text: "La Fuerza debería servirnos.",
          tone: "neutral",
          consequences: [],
          nextNodeId: "vp3_neutral",
        },
      ],
    },
    vp3_dark: {
      id: "vp3_dark",
      speaker: "Darth Voren",
      text: "Bien. La galaxia es un cadáver que espera ser reclamado. El fuerte devora al débil. Esa es la única ley.",
      options: [],
      onEnter: [{ type: "set_flag", key: "voren_philosophy_dark", value: true }],
      autoNext: null,
    },
    vp3_light: {
      id: "vp3_light",
      speaker: "Darth Voren",
      text: "La guerra es el crisol en el que se forja la grandeza. Sin conflicto, hay estancamiento. Sin estancamiento... los Jedi.",
      options: [],
      onEnter: [{ type: "set_flag", key: "voren_philosophy_light", value: true }],
      autoNext: null,
    },
    vp3_neutral: {
      id: "vp3_neutral",
      speaker: "Darth Voren",
      text: "Un pragmático. Algo raro. La mayoría ve la Fuerza como una religión. Tú la ves como una herramienta. Eso quizás te mantenga vivo más que a la mayoría.",
      options: [],
      onEnter: [{ type: "set_flag", key: "voren_philosophy_neutral", value: true }],
      autoNext: null,
    },
  },
};

export const CONV_KHELN_INTRO: DialogueConversation = {
  id: "conv_kheln_intro",
  startNodeId: "k1",
  nodes: {
    k1: {
      id: "k1",
      speaker: "Archivista Kheln",
      text: "¿Otro acólito buscando poder en páginas polvorientas? O quizás tú seas distinto. Los textos recuerdan a quienes se acercan con sed genuina.",
      options: [
        {
          id: "k1_curious",
          text: "¿Qué clase de conocimiento guardas aquí?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "k2",
        },
        {
          id: "k1_force",
          text: "[Fuerza 6] Siento el lado oscuro resonando desde esas estanterías.",
          check: { type: "force", value: 6 },
          checkLabel: "[Fuerza 6]",
          tone: "neutral",
          consequences: [
            { type: "set_flag", key: "kheln_impressed", value: true },
          ],
          nextNodeId: "k2_impressed",
        },
        {
          id: "k1_dismiss",
          text: "No tengo tiempo para libros viejos.",
          tone: "aggressive",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
    k2: {
      id: "k2",
      speaker: "Archivista Kheln",
      text: "Las historias del Imperio Sith. Rituales perdidos en el tiempo. La ubicación de tumbas que los Supervisores fingen que no existen. El conocimiento es la única arma que se afila con la edad.",
      options: [
        {
          id: "k2_quest",
          text: "¿Hay algo en lo que pueda ayudarte?",
          consequences: [{ type: "set_flag", key: "kheln_met", value: true }],
          nextNodeId: null,
        },
      ],
    },
    k2_impressed: {
      id: "k2_impressed",
      speaker: "Archivista Kheln",
      text: "Lo sientes. Sí. Estos textos están vivos, en cierto modo — saturados con la Fuerza de sus autores. Tienes potencial, acólito. Quizás tenga una tarea para ti, si estás dispuesto.",
      options: [
        {
          id: "k2i_accept",
          text: "Me interesa.",
          consequences: [
            { type: "set_flag", key: "kheln_met", value: true },
            { type: "start_quest", questId: "q_the_archivist" },
          ],
          nextNodeId: null,
        },
        {
          id: "k2i_later",
          text: "Quizás más tarde.",
          consequences: [{ type: "set_flag", key: "kheln_met", value: true }],
          nextNodeId: null,
        },
      ],
    },
  },
};

/** Archivist Kheln — deeper lore conversation (requires kheln_met). */
export const CONV_KHELN_LORE: DialogueConversation = {
  id: "conv_kheln_quest",
  startNodeId: "kl1",
  nodes: {
    kl1: {
      id: "kl1",
      speaker: "Archivista Kheln",
      text: "Los Sith modernos son niños jugando con un fuego antiguo.",
      options: [
        {
          id: "kl1_teach",
          text: "Enséñame.",
          tone: "neutral",
          consequences: [
            { type: "add_xp", value: 50 },
          ],
          nextNodeId: "kl2_teach",
        },
        {
          id: "kl1_dismiss",
          text: "El pasado está muerto.",
          tone: "aggressive",
          consequences: [],
          nextNodeId: "kl2_dismiss",
        },
        {
          id: "kl1_heir",
          text: "[Influencia 5] Necesitas un heredero.",
          check: { type: "influence", value: 5 },
          checkLabel: "[Influencia 5]",
          tone: "deceptive",
          consequences: [
            { type: "faction_rep", factionId: "sith_academy", value: 10 },
            { type: "set_flag", key: "kheln_heir_offered", value: true },
          ],
          nextNodeId: "kl2_heir",
        },
      ],
    },
    kl2_teach: {
      id: "kl2_teach",
      speaker: "Archivista Kheln",
      text: "Los antiguos Sith comprendían que el poder no es simplemente fuerza. Es conocimiento. Patrón. Ritual. Los lores modernos blanden sus sables y se llaman maestros. No saben nada de las viejas costumbres.",
      options: [
        {
          id: "kl2t_continue",
          text: "¿Qué viejas costumbres?",
          consequences: [],
          nextNodeId: "kl3_lore",
        },
      ],
    },
    kl2_dismiss: {
      id: "kl2_dismiss",
      speaker: "Archivista Kheln",
      text: "Eso es lo que decían los Jedi. Antes de que los Sith los destruyeran. Una y otra vez. El pasado devora a quienes lo ignoran.",
      options: [],
      autoNext: null,
    },
    kl2_heir: {
      id: "kl2_heir",
      speaker: "Archivista Kheln",
      text: "Quizás. Mi conocimiento muere conmigo si nadie lo lleva adelante. Pero un heredero debe demostrar que es digno. Recupera un texto de la Tumba de Ragnos. Si sobrevives, te enseñaré.",
      options: [
        {
          id: "kl2h_accept",
          text: "Lo encontraré.",
          consequences: [
            { type: "start_quest", questId: "q_the_archivist" },
          ],
          nextNodeId: null,
        },
      ],
    },
    kl3_lore: {
      id: "kl3_lore",
      speaker: "Archivista Kheln",
      text: "Alquimia. Bombas de Pensamiento. La creación de holocrones. Rituales capaces de atar espíritus, destrozar mundos u otorgar la vida eterna. Todo perdido por la arrogancia de quienes creían que un sable de luz bastaba.",
      options: [
        {
          id: "kl3_end",
          text: "Quiero aprender estas cosas.",
          consequences: [
            { type: "set_flag", key: "kheln_lore_complete", value: true },
            { type: "add_xp", value: 100 },
          ],
          nextNodeId: null,
        },
        {
          id: "kl3_tulak",
          text: "[Fuerza 5] Un nombre resuena en estas estanterías más alto que el resto. Tulak Hord.",
          check: { type: "force", value: 5 },
          checkLabel: "[Fuerza 5]",
          tone: "neutral",
          consequences: [],
          nextNodeId: "kl4_tulak",
        },
      ],
    },
    kl4_tulak: {
      id: "kl4_tulak",
      speaker: "Archivista Kheln",
      text: "*Sus ojos se entrecierran con algo parecido al respeto.* El Señor del Odio. Maestro de la Oscuridad Reunida. El mayor duelista que los Sith jamás engendraron — diez mil Jedi cayeron ante su hoja. Su tumba yace en los acantilados orientales del Valle. Los Supervisores prohíben la entrada. No para proteger la tumba, acólito. Para protegerte a *ti*. Algo anida en sus profundidades que se alimenta de sangre sensible a la Fuerza.",
      options: [
        {
          id: "kl4_go",
          text: "Entonces aprenderá lo que cuesta mi sangre.",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "tulak_tomb_known", value: true },
            { type: "add_xp", value: 50 },
          ],
          nextNodeId: null,
        },
        {
          id: "kl4_noted",
          text: "Mantendré las distancias. Por ahora.",
          tone: "neutral",
          consequences: [{ type: "set_flag", key: "tulak_tomb_known", value: true }],
          nextNodeId: null,
        },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Shorter conversations for remaining Korriban NPCs
// ═══════════════════════════════════════════════════════════════════════

export const CONV_RAXIS_INTRO: DialogueConversation = {
  id: "conv_raxis_intro",
  startNodeId: "r1",
  nodes: {
    r1: {
      id: "r1",
      speaker: "Supervisora Raxis",
      text: "Tú. Acólito. El foso de la arena necesita sangre hoy. No me hagas arrastrarte hasta allí yo misma.",
      options: [
        {
          id: "r1_accept",
          text: "Lucharé. Envíame un oponente digno.",
          tone: "aggressive",
          consequences: [{ type: "set_flag", key: "raxis_accepted", value: true }],
          nextNodeId: "r_end",
        },
        {
          id: "r1_refuse",
          text: "Tengo otros asuntos que atender.",
          tone: "deceptive",
          consequences: [{ type: "faction_rep", factionId: "sith_academy", value: -5 }],
          nextNodeId: "r_refuse",
        },
        {
          id: "r1_probe",
          text: "[Influencia 3] ¿Por qué sirves aquí, Supervisora?",
          check: { type: "influence", value: 3 },
          checkLabel: "[Influencia 3]",
          tone: "neutral",
          consequences: [],
          nextNodeId: "r_lore",
        },
      ],
    },
    r_end: {
      id: "r_end",
      speaker: "Supervisora Raxis",
      text: "Bien. La arena está al este. No me decepciones — ni a mi sable.",
      options: [],
      autoNext: null,
    },
    r_refuse: {
      id: "r_refuse",
      speaker: "Supervisora Raxis",
      text: "Cobardía. Lo recordaré, acólito.",
      options: [],
      autoNext: null,
    },
    r_lore: {
      id: "r_lore",
      speaker: "Supervisora Raxis",
      text: "Sirvo porque el fuerte moldea al débil. Algún día quizás lo entiendas. Hasta entonces — entrena.",
      options: [],
      autoNext: null,
    },
  },
};

export const CONV_DARYTH_CHALLENGE: DialogueConversation = {
  id: "conv_daryth_challenge",
  startNodeId: "d1",
  nodes: {
    d1: {
      id: "d1",
      speaker: "Daryth",
      text: "Mira quién se arrastró por fin hasta la Academia. Te doy una semana antes de que las tumbas te traguen entero.",
      options: [
        {
          id: "d1_threat",
          text: "Habla otra vez y te arrancaré la lengua.",
          tone: "aggressive",
          consequences: [
            { type: "set_flag", key: "daryth_hostile", value: true },
            { type: "set_flag", key: "rival_accepted", value: true },
            { type: "start_quest", questId: "q_rivals_edge" },
          ],
          nextNodeId: "d_threat",
        },
        {
          id: "d1_mock",
          text: "¿Una semana? Entonces veremos quién entierra a quién.",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "daryth_rivalry", value: true },
            { type: "set_flag", key: "rival_accepted", value: true },
            { type: "start_quest", questId: "q_rivals_edge" },
          ],
          nextNodeId: "d_rival",
        },
        {
          id: "d1_probe",
          text: "[Influencia 4] Tienes miedo. Puedo olerlo bajo toda esa bravuconería.",
          check: { type: "influence", value: 4 },
          checkLabel: "[Influencia 4]",
          tone: "deceptive",
          consequences: [],
          nextNodeId: "d_afraid",
        },
        {
          id: "d1_leave",
          text: "No mereces mi tiempo.",
          tone: "neutral",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
    d_threat: {
      id: "d_threat",
      speaker: "Daryth",
      text: "Palabras audaces. La arena lo resolverá pronto. Estaré esperando en el foso — si tienes el valor de presentarte.",
      options: [],
      autoNext: null,
    },
    d_rival: {
      id: "d_rival",
      speaker: "Daryth",
      text: "Entonces está decidido. La arena. Uno de nosotros sale vivo de la Academia. Solo uno.",
      options: [],
      autoNext: null,
    },
    d_afraid: {
      id: "d_afraid",
      speaker: "Daryth",
      text: "...Mi maestro me dio un mes para demostrar mi valía. Eso fue hace cinco semanas. Cada acólito que entierro me compra otro día. ¿Lo entiendes? No es nada personal.",
      options: [
        {
          id: "da_pity",
          text: "Entonces lucha contra mí, y compra tu día.",
          tone: "neutral",
          consequences: [
            { type: "set_flag", key: "rival_accepted", value: true },
            { type: "set_flag", key: "daryth_sympathy", value: true },
            { type: "start_quest", questId: "q_rivals_edge" },
          ],
          nextNodeId: "d_rival",
        },
        {
          id: "da_exploit",
          text: "La desesperación te vuelve predecible. Voy a disfrutar esto.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 1 },
            { type: "set_flag", key: "rival_accepted", value: true },
            { type: "start_quest", questId: "q_rivals_edge" },
          ],
          nextNodeId: "d_rival",
        },
      ],
    },
  },
};

/** Daryth — after the arena duel. He survived. Barely. */
export const CONV_DARYTH_DEFEATED: DialogueConversation = {
  id: "conv_daryth_defeated",
  startNodeId: "dd1",
  nodes: {
    dd1: {
      id: "dd1",
      speaker: "Daryth",
      text: "*Se encoge cuando te acercas, el brazo en una férula médica.* ¿Vienes a rematarlo? Adelante, pues. Mi maestro ya sabe que perdí. Estoy muerto de todos modos.",
      options: [
        {
          id: "dd1_spare",
          text: "Luchaste bien. Dile a tu maestro que lo dije.",
          tone: "light",
          consequences: [
            { type: "set_flag", key: "daryth_spared", value: true },
            { type: "add_xp", value: 50 },
          ],
          nextNodeId: "dd_spare",
        },
        {
          id: "dd1_recruit",
          text: "[Influencia 5] Sírveme a mí en su lugar. Un maestro muerto se reemplaza fácil.",
          check: { type: "influence", value: 5 },
          checkLabel: "[Influencia 5]",
          tone: "deceptive",
          consequences: [
            { type: "set_flag", key: "daryth_recruited", value: true },
            { type: "faction_rep", factionId: "sith_academy", value: 10 },
            { type: "add_xp", value: 75 },
          ],
          nextNodeId: "dd_recruit",
        },
        {
          id: "dd1_kill",
          text: "Sí. Así es.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 5 },
            { type: "set_flag", key: "daryth_dead", value: true },
            { type: "faction_rep", factionId: "sith_academy", value: 5 },
          ],
          nextNodeId: "dd_kill",
        },
      ],
    },
    dd_spare: {
      id: "dd_spare",
      speaker: "Daryth",
      text: "Misericordia. De un Sith. *Ríe — un sonido roto.* Eres o el acólito más peligroso de esta Academia, o el más condenado. ...Gracias. No lo olvidaré.",
      options: [],
      autoNext: null,
    },
    dd_recruit: {
      id: "dd_recruit",
      speaker: "Daryth",
      text: "*Te mira fijamente durante un largo instante, luego inclina la cabeza.* El fuerte moldea al débil. ¿No es eso lo que nos enseñan? Muy bien. Mi hoja es tuya — hasta que te debilites.",
      options: [],
      autoNext: null,
    },
    dd_kill: {
      id: "dd_kill",
      speaker: null,
      text: "Termina rápido. Los guardias de la Academia rodean el cuerpo sin alterar el paso. Para la noche, alguien ya ha reclamado su litera.",
      options: [],
      autoNext: null,
    },
  },
};

export const CONV_KIRA_PLEA: DialogueConversation = {
  id: "conv_kira_plea",
  startNodeId: "k1",
  nodes: {
    k1: {
      id: "k1",
      speaker: "Kira",
      text: "Por favor... no he comido en tres días. Los supervisores se llevaron mi cartilla de raciones. No aguantaré la semana aquí abajo.",
      options: [
        {
          id: "k1_help",
          text: "Toma estos créditos. Escóndelos bien.",
          tone: "light",
          consequences: [
            { type: "add_credits", value: -50 },
            { type: "faction_rep", factionId: "sith_academy", value: -3 },
            { type: "set_flag", key: "helped_kira", value: true },
          ],
          nextNodeId: "k_thanks",
        },
        {
          id: "k1_use",
          text: "Dime lo que sabes de las minas, y lo consideraré.",
          tone: "deceptive",
          consequences: [{ type: "set_flag", key: "kira_informant", value: true }],
          nextNodeId: "k_info",
        },
        {
          id: "k1_cruel",
          text: "Tu debilidad me repugna. Muere en silencio.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 5 },
            { type: "faction_rep", factionId: "sith_academy", value: 5 },
          ],
          nextNodeId: null,
        },
      ],
    },
    k_thanks: {
      id: "k_thanks",
      speaker: "Kira",
      text: "Que las estrellas recuerden tu bondad, incluso aquí. Gracias.",
      options: [],
      autoNext: null,
    },
    k_info: {
      id: "k_info",
      speaker: "Kira",
      text: "Hay un túnel profundo que los supervisores evitan. Sonidos extraños. Dicen que una criatura habita allí — vieja, y furiosa.",
      options: [
        {
          id: "k_info_pay",
          text: "Útil. Toma — por las molestias.",
          tone: "neutral",
          consequences: [{ type: "add_credits", value: -25 }, { type: "set_flag", key: "knows_deep_tunnel", value: true }],
          nextNodeId: null,
        },
        {
          id: "k_info_leave",
          text: "Entonces hemos terminado.",
          tone: "deceptive",
          consequences: [{ type: "set_flag", key: "knows_deep_tunnel", value: true }],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_GROT_SHOP: DialogueConversation = {
  id: "conv_grot_shop",
  startNodeId: "g1",
  nodes: {
    g1: {
      id: "g1",
      speaker: "Grot",
      text: "Hssss... ¡Sangre Sith, recién salida de la academia! Grot tiene mercancía — implantes, vendas, cosas que no puedes comprar arriba. ¿Sí?",
      options: [
        {
          id: "g1_browse",
          text: "Enséñame lo que tienes.",
          tone: "neutral",
          consequences: [{ type: "open_shop", shopId: "grot" }],
          nextNodeId: null,
        },
        {
          id: "g1_intimidate",
          text: "[Influencia 4] Tus precios más vale que sean... razonables.",
          check: { type: "influence", value: 4 },
          checkLabel: "[Influencia 4]",
          tone: "aggressive",
          consequences: [{ type: "set_flag", key: "grot_discount", value: true }],
          nextNodeId: "g_yield",
        },
        {
          id: "g1_leave",
          text: "No me interesa.",
          tone: "neutral",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
    g_yield: {
      id: "g_yield",
      speaker: "Grot",
      text: "¡Sí-sí! Para ti, precios especiales. Siempre para ti. Grot recuerda a los clientes leales.",
      options: [
        {
          id: "g_yield_shop",
          text: "Enséñame la mercancía.",
          tone: "neutral",
          consequences: [{ type: "open_shop", shopId: "grot" }],
          nextNodeId: null,
        },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Story conversations — Voren's duel, the Trial of Blood, the uprising
// ═══════════════════════════════════════════════════════════════════════

/** Darth Voren — the ritual duel (after the Tomb Guardian falls). */
export const CONV_VOREN_DUEL: DialogueConversation = {
  id: "conv_voren_duel",
  startNodeId: "vd1",
  nodes: {
    vd1: {
      id: "vd1",
      speaker: "Darth Voren",
      text: "Regresas vivo de la tumba de Ajunta Pall. Interesante. El Guardián ha dado muerte a cada acólito que he enviado a ese foso durante nueve años. Lo que significa que ya no eres una herramienta, pequeño. Eres una amenaza.",
      options: [
        {
          id: "vd1_embrace",
          text: "Entonces sabes cómo termina esto, Voren.",
          tone: "dark",
          consequences: [{ type: "corruption_change", value: 2 }],
          nextNodeId: "vd2",
        },
        {
          id: "vd1_deny",
          text: "Nunca he sido otra cosa que leal.",
          tone: "deceptive",
          consequences: [],
          nextNodeId: "vd2_deny",
        },
        {
          id: "vd1_alliance",
          text: "[Influencia 6] Una amenaza — o un heredero. El Triunvirato teme a las parejas fuertes.",
          check: { type: "influence", value: 6 },
          checkLabel: "[Influencia 6]",
          tone: "deceptive",
          consequences: [
            { type: "faction_rep", factionId: "sith_academy", value: 15 },
            { type: "set_flag", key: "voren_alliance_offered", value: true },
          ],
          nextNodeId: "vd2_alliance",
        },
      ],
    },
    vd2: {
      id: "vd2",
      speaker: "Darth Voren",
      text: "Bien. Sin súplicas, sin fingimientos. Existe un viejo rito para esto — más antiguo que la propia Academia. El círculo ritual, al amanecer. Maestro contra aprendiz, ante los ojos de cada acólito. Ven armado. Ven dispuesto. O huye, y sé cazado.",
      options: [
        {
          id: "vd2_accept",
          text: "Al amanecer, entonces.",
          consequences: [{ type: "set_flag", key: "voren_duel_ready", value: true }],
          nextNodeId: null,
        },
      ],
    },
    vd2_deny: {
      id: "vd2_deny",
      speaker: "Darth Voren",
      text: "Leal. *Casi sonríe.* Yo también fui leal, una vez. Mi maestro alababa mi lealtad en el preciso instante en que le clavé el sable en el corazón. La lealtad es la mentira que el fuerte cuenta al paciente. El círculo ritual. El amanecer. Acabemos con esto a la vieja usanza.",
      options: [
        {
          id: "vd2d_accept",
          text: "Que así sea.",
          consequences: [{ type: "set_flag", key: "voren_duel_ready", value: true }],
          nextNodeId: null,
        },
      ],
    },
    vd2_alliance: {
      id: "vd2_alliance",
      speaker: "Darth Voren",
      text: "*Un largo silencio. Las brasas de sus ojos menguan.* Astuto. De verdad. Y en otra época quizás habría aceptado. Pero el rito ya está pronunciado, y la Academia observa. Si te dejo vivir sin demostrarte, enviarán a tres Lores a matarnos a ambos. Gana el círculo, y quizás hablemos de herencia sobre mi cadáver — o el tuyo.",
      options: [
        {
          id: "vd2a_accept",
          text: "Entonces lo haré rápido.",
          consequences: [{ type: "set_flag", key: "voren_duel_ready", value: true }],
          nextNodeId: null,
        },
      ],
    },
  },
};

/** Overseer Raxis — the Trial of Blood. */
export const CONV_RAXIS_TRIAL: DialogueConversation = {
  id: "conv_raxis_trial",
  startNodeId: "rt1",
  nodes: {
    rt1: {
      id: "rt1",
      speaker: "Supervisora Raxis",
      text: "Ahí estás. Dos acólitos fallaron sus pruebas esta mañana. La ley de la Academia es clara: los fracasados alimentan a los dignos. Te esperan en el foso — armados, desesperados, y muy conscientes de que matarte es su última oportunidad de redención. Esta es tu Prueba de Sangre.",
      options: [
        {
          id: "rt1_fight",
          text: "Abre el foso.",
          tone: "aggressive",
          // main_trial_blood is set on VICTORY (see useDialogueConsequences),
          // so the objective can't complete by losing or fleeing.
          consequences: [
            { type: "start_combat", combatEncounterId: "trial_of_blood" },
          ],
          nextNodeId: null,
        },
        {
          id: "rt1_cunning",
          text: "[Influencia 4] Dos hombres desesperados, una redención. Diles que solo el superviviente podrá enfrentarse a mí.",
          check: { type: "influence", value: 4 },
          checkLabel: "[Influencia 4]",
          tone: "deceptive",
          consequences: [
            { type: "corruption_change", value: 2 },
            { type: "add_xp", value: 60 },
          ],
          nextNodeId: "rt2_cunning",
        },
        {
          id: "rt1_refuse",
          text: "No mato bajo órdenes.",
          tone: "light",
          consequences: [{ type: "faction_rep", factionId: "sith_academy", value: -10 }],
          nextNodeId: "rt2_refuse",
        },
      ],
    },
    rt2_cunning: {
      id: "rt2_cunning",
      speaker: "Supervisora Raxis",
      text: "*Por primera vez, Raxis ríe.* Pensamiento Sith. Ya me caes mejor. *Abajo, los sonidos de una pelea breve y fea.* Queda uno. Termina tu prueba.",
      options: [
        {
          id: "rt2c_fight",
          text: "Con gusto.",
          consequences: [
            { type: "start_combat", combatEncounterId: "trial_of_blood_single" },
          ],
          nextNodeId: null,
        },
      ],
    },
    rt2_refuse: {
      id: "rt2_refuse",
      speaker: "Supervisora Raxis",
      text: "No vas a— *Se acerca mucho.* Acólito. Esto es Korriban. O entras en ese foso, o escribo tu nombre en la lista de fracasados de mañana y alguien entra en un foso a por TI. Elige.",
      options: [
        {
          id: "rt2r_relent",
          text: "...Abre el foso.",
          consequences: [
            { type: "start_combat", combatEncounterId: "trial_of_blood" },
          ],
          nextNodeId: null,
        },
        {
          id: "rt2r_walk",
          text: "Pon mi nombre en la lista, entonces. Te reto.",
          tone: "aggressive",
          consequences: [
            { type: "set_flag", key: "raxis_defied", value: true },
            { type: "faction_rep", factionId: "sith_academy", value: -10 },
          ],
          nextNodeId: null,
        },
      ],
    },
  },
};

/** Kira — the slave uprising (after the player helped her). */
export const CONV_KIRA_UPRISING: DialogueConversation = {
  id: "conv_kira_uprising",
  startNodeId: "ku1",
  nodes: {
    ku1: {
      id: "ku1",
      speaker: "Kira",
      text: "*Mira de reojo a los supervisores, luego se inclina, la voz apenas un aliento.* Me mantuviste con vida. Así que te confiaré el resto. Dentro de tres noches, las cuadrillas de la mina se alzarán. Hemos escondido herramientas, mapeado las patrullas. Solo necesitamos una cosa — el Supervisor Drex muerto antes de que pueda sellar los túneles.",
      onEnter: [
        { type: "set_flag", key: "slave_plot_discovered", value: true },
        { type: "start_quest", questId: "q_slave_uprising" },
      ],
      options: [
        {
          id: "ku1_aid",
          text: "Drex muere esta noche. Estad listos.",
          tone: "light",
          consequences: [
            { type: "set_flag", key: "slave_choice_made", value: true },
            { type: "set_flag", key: "slave_uprising_aid", value: true },
          ],
          nextNodeId: "ku2_aid",
        },
        {
          id: "ku1_betray",
          text: "(Mentir) Cuenta conmigo. *Memorizas cada nombre que te da.*",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "slave_choice_made", value: true },
            { type: "set_flag", key: "slave_betrayed", value: true },
            { type: "set_flag", key: "slave_resolved", value: true },
            { type: "corruption_change", value: 4 },
            { type: "faction_rep", factionId: "sith_academy", value: 20 },
            { type: "add_credits", value: 150 },
          ],
          nextNodeId: "ku2_betray",
        },
        {
          id: "ku1_warn",
          text: "Esto es un suicidio. La Academia vitrificará estos túneles con todos vosotros dentro.",
          tone: "neutral",
          consequences: [],
          nextNodeId: "ku2_warn",
        },
      ],
    },
    ku2_aid: {
      id: "ku2_aid",
      speaker: "Kira",
      text: "*Sus ojos brillan — la esperanza parece extraña en un rostro que la había olvidado.* Drex guarda el pozo este con su acólito mascota. Mátalo, y trescientas personas vuelven a ver el cielo. Que las estrellas te protejan, Sith. Palabras que nunca pensé que diría.",
      options: [],
      autoNext: null,
    },
    ku2_betray: {
      id: "ku2_betray",
      speaker: null,
      text: "Al amanecer, los cabecillas cuelgan de la puerta de la mina como lección. La Academia premia tu vigilancia. Kira no está entre los cuerpos — pero la forma en que te miró cuando llegaron los guardias te perseguirá más que cualquier fantasma de este mundo.",
      options: [],
      autoNext: null,
    },
    ku2_warn: {
      id: "ku2_warn",
      speaker: "Kira",
      text: "Entonces moriremos a campo abierto en vez de en la oscuridad. *Se yergue, las cadenas tintineando.* Has visto las tumbas, Sith. Dime que morir aquí abajo lentamente es mejor. No puedes. Ayúdanos, traiciónanos, o hazte a un lado — pero no nos pidas que nos arrodillemos.",
      options: [
        {
          id: "ku2w_aid",
          text: "...Estad listos. Drex muere esta noche.",
          tone: "light",
          consequences: [
            { type: "set_flag", key: "slave_choice_made", value: true },
            { type: "set_flag", key: "slave_uprising_aid", value: true },
          ],
          nextNodeId: "ku2_aid",
        },
        {
          id: "ku2w_aside",
          text: "Me hago a un lado. No vi nada.",
          tone: "neutral",
          consequences: [
            { type: "set_flag", key: "slave_choice_made", value: true },
            { type: "set_flag", key: "slave_neutral", value: true },
          ],
          nextNodeId: null,
        },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Dreshdae Settlement
// ═══════════════════════════════════════════════════════════════════════

/** Seyla — cantina keeper. The rumor hub of Korriban. */
export const CONV_SEYLA_INTRO: DialogueConversation = {
  id: "conv_seyla_intro",
  startNodeId: "s1",
  nodes: {
    s1: {
      id: "s1",
      speaker: "Seyla",
      text: "*No levanta la vista del vaso que está puliendo.* Túnicas de la Academia, cicatrices recientes, esa mirada hambrienta. Siéntate, acólito. La primera copa va aguada, igual que las demás. ¿Qué será — la copa o la charla? La charla cuesta más.",
      options: [
        {
          id: "s1_rumors",
          text: "¿Qué se oye en Dreshdae estos días?",
          tone: "neutral",
          consequences: [{ type: "set_flag", key: "seyla_met", value: true }],
          nextNodeId: "s2_rumors",
        },
        {
          id: "s1_drink",
          text: "Solo la copa. (10 créditos)",
          tone: "neutral",
          consequences: [
            { type: "add_credits", value: -10 },
            { type: "set_flag", key: "seyla_met", value: true },
          ],
          nextNodeId: "s2_drink",
        },
        {
          id: "s1_intimidate",
          text: "Me dirás lo que quiero saber. Por las buenas.",
          tone: "aggressive",
          consequences: [{ type: "set_flag", key: "seyla_met", value: true }],
          nextNodeId: "s2_intimidate",
        },
      ],
    },
    s2_rumors: {
      id: "s2_rumors",
      speaker: "Seyla",
      text: "Mucho. *Deja el vaso.* Los esclavos de la mina susurran sobre un túnel que los supervisores no pisan. El hombre de Czerka, Varn, paga el doble por artefactos de tumba sin hacer preguntas. Y hay un chico en mi rincón del fondo que se sobresalta cada vez que se abre la puerta. Tú eliges.",
      options: [
        {
          id: "s2r_tunnel",
          text: "Háblame del túnel.",
          consequences: [{ type: "set_flag", key: "knows_deep_tunnel", value: true }],
          nextNodeId: "s3_tunnel",
        },
        {
          id: "s2r_tombs",
          text: "[Influencia 3] ¿Y qué dicen los veteranos de las tumbas orientales?",
          check: { type: "influence", value: 3 },
          checkLabel: "[Influencia 3]",
          consequences: [{ type: "set_flag", key: "tulak_tomb_known", value: true }],
          nextNodeId: "s3_tombs",
        },
        {
          id: "s2r_boy",
          text: "El chico del rincón. ¿Cuál es su historia?",
          consequences: [{ type: "set_flag", key: "deserter_known", value: true }],
          nextNodeId: "s3_boy",
        },
        {
          id: "s2r_done",
          text: "Suficiente charla.",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
    s3_tunnel: {
      id: "s3_tunnel",
      speaker: "Seyla",
      text: "Pozo profundo del este, pasados los nidos de babosas. Los esclavos dicen que algo allá abajo les canta a través de la roca — y que los supervisores perdieron seis guardias antes de dejar de enviar patrullas. Lo que sea que anida ahí ha comido bien. *Se encoge de hombros.* A los de tu clase os gusta ese tipo de cosas, ¿no?",
      options: [
        { id: "s3t_back", text: "¿Qué más?", consequences: [], nextNodeId: "s2_rumors" },
        { id: "s3t_end", text: "Útil. Mantén las orejas abiertas.", consequences: [], nextNodeId: null },
      ],
    },
    s3_tombs: {
      id: "s3_tombs",
      speaker: "Seyla",
      text: "*Baja la voz.* La tumba de Tulak Hord. Acantilados orientales del Valle. Cada pocos años algún acólito ambicioso encuentra la entrada, y cada pocos años un equipo de recuperación de Czerka trae de vuelta los pedazos. Dicen que el Señor del Odio dejó un guardián. De los que ni los Lores Sith nombran tras el anochecer. No lo oíste de mí.",
      options: [
        { id: "s3to_back", text: "¿Qué más?", consequences: [], nextNodeId: "s2_rumors" },
        { id: "s3to_end", text: "Nunca lo hago.", consequences: [], nextNodeId: null },
      ],
    },
    s3_boy: {
      id: "s3_boy",
      speaker: "Seyla",
      text: "Llegó hace cuatro noches. Paga con vales de ración de la Academia, duerme sentado, vigila la puerta. *Te mira a los ojos por primera vez.* Llevo treinta años en esta cantina, acólito. Sé reconocer a un desertor cuando lo cobijo. Lo que pasa después es la parte a la que nunca me acostumbro.",
      options: [
        { id: "s3b_back", text: "¿Qué más se oye?", consequences: [], nextNodeId: "s2_rumors" },
        { id: "s3b_end", text: "Yo me encargo. De un modo u otro.", consequences: [], nextNodeId: null },
      ],
    },
    s2_drink: {
      id: "s2_drink",
      speaker: "Seyla",
      text: "*El vaso que te desliza está más limpio de lo esperado, el licor más fuerte.* En Korriban, eso pasa por hospitalidad. No te mueras ahí fuera. Los clientes muertos son malos para el negocio.",
      options: [],
      autoNext: null,
    },
    s2_intimidate: {
      id: "s2_intimidate",
      speaker: "Seyla",
      text: "*Apoya ambas manos sobre la barra, sin inmutarse.* Chico, llevo nueve años sirviéndole el café a Darth Voren. He visto sacar del Valle a acólitos más temibles que tú en cubos. ¿Quieres lo que sé? Lo pides con educación, o bebes en otra parte. NO hay otra parte.",
      options: [
        {
          id: "s2i_relent",
          text: "...¿Qué se oye en Dreshdae estos días?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "s2_rumors",
        },
        {
          id: "s2i_leave",
          text: "Suerte para ti que tengo más sed que rabia.",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
  },
};

/** Varn Dassik — Czerka representative. Everything is for sale. */
export const CONV_VARN_INTRO: DialogueConversation = {
  id: "conv_varn_intro",
  startNodeId: "cv1",
  nodes: {
    cv1: {
      id: "cv1",
      speaker: "Varn Dassik",
      text: "¡Ah! Un representante de nuestros estimados anfitriones. Varn Dassik, Corporación Czerka, Adquisiciones de Korriban. *Su apretón de manos es un pelín demasiado rápido.* Seré directo, porque la franqueza es gratis: pago tarifas premium por artefactos de tumba, y tengo un... problema de personal que podrías encontrar rentable.",
      options: [
        {
          id: "cv1_problem",
          text: "¿Qué clase de problema de personal?",
          tone: "neutral",
          consequences: [{ type: "set_flag", key: "varn_met", value: true }],
          nextNodeId: "cv2_problem",
        },
        {
          id: "cv1_artifacts",
          text: "¿Tarifas premium? Sigue hablando.",
          tone: "neutral",
          consequences: [{ type: "set_flag", key: "varn_met", value: true }],
          nextNodeId: "cv2_artifacts",
        },
        {
          id: "cv1_threaten",
          text: "¿Czerka expolia tumbas Sith y espera conservar las manos?",
          tone: "dark",
          consequences: [{ type: "set_flag", key: "varn_met", value: true }],
          nextNodeId: "cv2_threaten",
        },
      ],
    },
    cv2_problem: {
      id: "cv2_problem",
      speaker: "Varn Dassik",
      text: "Especialistas autónomos en recuperación. Estaban bajo contrato exclusivo — MI contrato — hasta que decidieron vender directamente a compradores de otros mundos. Están acampados en el Valle, sentados sobre una caja de artefactos que ya he vendido dos veces. Haz que mi problema desaparezca y la comisión de hallazgo es tuya. La Academia no tiene por qué facturarse a sí misma.",
      options: [
        {
          id: "cv2p_accept",
          text: "Dalos por desaparecidos.",
          consequences: [
            { type: "set_flag", key: "raiders_trail", value: true },
            { type: "start_quest", questId: "q_tomb_raiders" },
          ],
          nextNodeId: "cv3_deal",
        },
        {
          id: "cv2p_advance",
          text: "[Influencia 4] La mitad ahora. Los contrabandistas muertos no confirman recibos.",
          check: { type: "influence", value: 4 },
          checkLabel: "[Influencia 4]",
          tone: "deceptive",
          consequences: [
            { type: "add_credits", value: 75 },
            { type: "set_flag", key: "raiders_trail", value: true },
            { type: "start_quest", questId: "q_tomb_raiders" },
          ],
          nextNodeId: "cv3_advance",
        },
        {
          id: "cv2p_decline",
          text: "No soy la hoja de Czerka.",
          consequences: [],
          nextNodeId: "cv3_decline",
        },
      ],
    },
    cv2_artifacts: {
      id: "cv2_artifacts",
      speaker: "Varn Dassik",
      text: "Estatuaria, fragmentos de holocrón, hojas ceremoniales — cualquier cosa pre-República se mueve con un margen del cuatrocientos por ciento fuera del mundo. Tráeme lo que... liberes... de tu trabajo de campo, y superaré el precio de cualquier intendente de la Academia. Efectivo, sin registros, sin preguntas. Las tres garantías de Czerka.",
      options: [
        {
          id: "cv2a_noted",
          text: "Lo tendré en cuenta.",
          consequences: [{ type: "set_flag", key: "varn_fence_known", value: true }],
          nextNodeId: "cv2_problem_pivot",
        },
      ],
    },
    cv2_problem_pivot: {
      id: "cv2_problem_pivot",
      speaker: "Varn Dassik",
      text: "Hazlo. Y ya que lo tienes en cuenta — mencioné un problema de personal. ¿Interesado?",
      options: [
        { id: "cv2pp_yes", text: "Continúa.", consequences: [], nextNodeId: "cv2_problem" },
        { id: "cv2pp_no", text: "En otro momento.", consequences: [], nextNodeId: null },
      ],
    },
    cv2_threaten: {
      id: "cv2_threaten",
      speaker: "Varn Dassik",
      text: "*La sonrisa no flaquea, pero el sudor sí.* Czerka opera bajo licencia de la propia Academia, amigo mío — el sello de Darth Voren, notariado por triplicado. ¿Expoliar las tumbas? Las PRESERVAMOS. Para clientes que pagan. *Se seca la frente.* Bien. ¿Hablamos mejor de cómo puedo serte útil?",
      options: [
        { id: "cv2t_listen", text: "Tienes un minuto.", consequences: [], nextNodeId: "cv2_problem" },
        {
          id: "cv2t_extort",
          text: "[Corrupción 3] Puedes ser útil pagando tu 'impuesto de preservación'. A mí.",
          check: { type: "corruption", value: 3 },
          checkLabel: "[Corrupción 3]",
          tone: "dark",
          consequences: [
            { type: "add_credits", value: 100 },
            { type: "corruption_change", value: 2 },
            { type: "set_flag", key: "varn_extorted", value: true },
          ],
          nextNodeId: "cv3_extorted",
        },
      ],
    },
    cv3_deal: {
      id: "cv3_deal",
      speaker: "Varn Dassik",
      text: "¡Excelente! Su campamento está en el Valle central, pasadas las guaridas de tuk'ata. Recupera la caja si puedes — pero el personal es la prioridad. *Resplandece.* Un placer hacer negocios con lo mejor de la Academia.",
      options: [],
      autoNext: null,
    },
    cv3_advance: {
      id: "cv3_advance",
      speaker: "Varn Dassik",
      text: "*Cuenta los créditos con la resignada eficiencia de un hombre que ya ha perdido esta negociación antes.* La mitad ahora. Habrías sido un magnífico gestor de cuentas, ¿sabes? Aterrador. El campamento está en el Valle central, pasadas las guaridas de tuk'ata.",
      options: [],
      autoNext: null,
    },
    cv3_decline: {
      id: "cv3_decline",
      speaker: "Varn Dassik",
      text: "No no, claro, del todo comprensible. La oferta sigue en pie — Czerka es, ante todo, paciente. *Hace aparecer un vale comercial de la nada.* Para cuando las circunstancias cambien. Siempre lo hacen, en Korriban.",
      options: [],
      autoNext: null,
    },
    cv3_extorted: {
      id: "cv3_extorted",
      speaker: "Varn Dassik",
      text: "*Transfiere los créditos con la frágil alegría de un hombre que archiva esto bajo 'gastos de operación'.* Un... impuesto de preservación. Sí. Lo anotaré en el libro como relaciones con la comunidad. Siempre es un placer apoyar a nuestros socios de la Academia.",
      options: [],
      autoNext: null,
    },
  },
};

/** Thane — the deserter hiding in Dreshdae. */
export const CONV_THANE_DESERTER: DialogueConversation = {
  id: "conv_thane_deserter",
  startNodeId: "t1",
  nodes: {
    t1: {
      id: "t1",
      speaker: null,
      text: "La figura encapuchada se encoge cuando te acercas — luego se queda paralizada al ver tus túnicas. De cerca es apenas más que un niño, con la marca a medio terminar de un acólito de la Academia en la muñeca. Un desertor. La pena es la muerte; la recompensa, considerable.",
      onEnter: [
        { type: "set_flag", key: "deserter_found", value: true },
        { type: "start_quest", questId: "q_the_deserter" },
      ],
      options: [
        { id: "t1_talk", text: "Tranquilo. No vengo a arrastrarte de vuelta.", tone: "neutral", consequences: [], nextNodeId: "t2" },
        { id: "t1_bounty", text: "Vales quinientos créditos, desertor.", tone: "dark", consequences: [], nextNodeId: "t2_bounty" },
      ],
    },
    t2: {
      id: "t2",
      speaker: "Thane",
      text: "*Su voz tiembla, pero sus ojos no dejan los tuyos.* Entonces eres el primero. Me llamo Thane. Me metieron en el foso contra mi mejor amigo y me dijeron que solo uno comía. Gané. Yo— gané, y no pude hacerlo otra vez, así que huí. Adelante, ríete. La Academia ya decidió lo que soy.",
      options: [
        {
          id: "t2_help",
          text: "La Academia se equivoca en muchas cosas. Te pagaré pasaje fuera del mundo. (100 créditos)",
          tone: "light",
          consequences: [
            { type: "add_credits", value: -100 },
            { type: "set_flag", key: "deserter_resolved", value: true },
            { type: "set_flag", key: "deserter_helped", value: true },
            { type: "add_xp", value: 100 },
            { type: "faction_rep", factionId: "sith_academy", value: -5 },
          ],
          nextNodeId: "t3_help",
        },
        {
          id: "t2_grot",
          text: "[Influencia 4] Conozco a un rodiano que contrabandea más que especia. Me deberás una, Thane. Para siempre.",
          check: { type: "influence", value: 4 },
          checkLabel: "[Influencia 4]",
          tone: "deceptive",
          consequences: [
            { type: "set_flag", key: "deserter_resolved", value: true },
            { type: "set_flag", key: "deserter_indebted", value: true },
            { type: "add_xp", value: 120 },
          ],
          nextNodeId: "t3_grot",
        },
        {
          id: "t2_betray",
          text: "La debilidad es una deuda, Thane. La Academia cobra.",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "deserter_resolved", value: true },
            { type: "set_flag", key: "deserter_betrayed", value: true },
            { type: "add_credits", value: 250 },
            { type: "corruption_change", value: 4 },
            { type: "faction_rep", factionId: "sith_academy", value: 15 },
          ],
          nextNodeId: "t3_betray",
        },
        {
          id: "t2_kill",
          text: "El foso no ha terminado contigo. *Enciende tu hoja.*",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "deserter_resolved", value: true },
            { type: "corruption_change", value: 5 },
            { type: "start_combat", combatEncounterId: "thane_last_stand" },
          ],
          nextNodeId: null,
        },
      ],
    },
    t2_bounty: {
      id: "t2_bounty",
      speaker: "Thane",
      text: "*Algo se endurece en él — el último jirón acorralado del orgullo de un acólito.* Quinientos. A mi amigo lo tasaron en trescientos. *Una vibrohoja aparece en su mano temblorosa.* No vuelvo al foso. Así que o te marchas... o te ganas tu recompensa.",
      options: [
        { id: "t2b_fight", text: "Gánatela, entonces.", tone: "dark",
          consequences: [
            { type: "set_flag", key: "deserter_resolved", value: true },
            { type: "corruption_change", value: 3 },
            { type: "start_combat", combatEncounterId: "thane_last_stand" },
          ],
          nextNodeId: null },
        { id: "t2b_stand_down", text: "...Guárdala, chico. Hablemos mejor.", tone: "neutral", consequences: [], nextNodeId: "t2" },
      ],
    },
    t3_help: {
      id: "t3_help",
      speaker: "Thane",
      text: "*Mira el vale de créditos como si fuera a morderle.* ¿Por qué? Eres uno de ELLOS. *Cierra el puño en torno a él antes de que respondas.* ...No. No me lo digas. Si supiera que los Sith pueden ser decentes, tendría que llorar por los demás. Hay un carguero que sale del puerto de Dreshdae al amanecer. No lo olvidaré.",
      options: [],
      autoNext: null,
    },
    t3_grot: {
      id: "t3_grot",
      speaker: "Thane",
      text: "Para siempre. *Dice la palabra despacio, comprendiendo la forma de la cadena que acabas de forjar.* El favor de un Sith. Leí sobre ellos en el archivo — se acumulan peor que el interés Hutt. ...Hecho. Mejor una deuda que pueda cargar que una marca de la que no pueda huir. Dile a tu rodiano que estoy listo.",
      options: [],
      autoNext: null,
    },
    t3_betray: {
      id: "t3_betray",
      speaker: null,
      text: "El equipo de recuperación de la Academia llega en menos de una hora — mantienen uno apostado en Dreshdae para exactamente esto. Thane no corre. Solo te mira todo el rato mientras lo atan, como si memorizara la lección. La recompensa se cobra antes del ocaso.",
      options: [],
      autoNext: null,
    },
  },
};

export const KORRIBAN_CONVERSATIONS: Record<string, DialogueConversation> = {
  conv_voren_intro: CONV_VOREN_INTRO,
  conv_voren_trial: CONV_VOREN_PHILOSOPHY,
  conv_voren_duel: CONV_VOREN_DUEL,
  conv_kheln_intro: CONV_KHELN_INTRO,
  conv_kheln_quest: CONV_KHELN_LORE,
  conv_raxis_intro: CONV_RAXIS_INTRO,
  conv_raxis_trial: CONV_RAXIS_TRIAL,
  conv_daryth_challenge: CONV_DARYTH_CHALLENGE,
  conv_daryth_defeated: CONV_DARYTH_DEFEATED,
  conv_kira_plea: CONV_KIRA_PLEA,
  conv_kira_uprising: CONV_KIRA_UPRISING,
  conv_grot_shop: CONV_GROT_SHOP,
  conv_seyla_intro: CONV_SEYLA_INTRO,
  conv_varn_intro: CONV_VARN_INTRO,
  conv_thane_deserter: CONV_THANE_DESERTER,
};
