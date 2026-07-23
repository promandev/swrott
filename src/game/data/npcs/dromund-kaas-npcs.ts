import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";
import type { NpcDefinition } from "./korriban-npcs";

/**
 * Dromund Kaas NPCs — Sith Empire's seat of power.
 * Imperial Citadel, the Dark Temple, and surrounding jungle.
 * Source: Master Design Bible §13 "Personajes" (Dromund Kaas section).
 */

export const DROMUND_KAAS_NPCS: NpcDefinition[] = [
  {
    id: "npc_moff_kallus",
    name: "Moff Kallus",
    title: "Enlace Imperial",
    description: "Un pulido oficial imperial de fríos ojos grises. Representa el brazo militar del Imperio — y es abiertamente escéptico con los acólitos que se creen por encima del protocolo.",
    zoneId: "dromund_kaas_spaceport",
    conversationIds: ["conv_kallus_arrival"],
  },
  {
    id: "npc_darth_seris",
    name: "Darth Seris",
    title: "Emisaria del Consejo Oscuro",
    description: "Una Lord Sith del círculo exterior del Consejo Oscuro. Su interés en ti puede ser una oportunidad — o una sentencia de muerte vestida de seda.",
    zoneId: "dromund_kaas_citadel",
    conversationIds: ["conv_seris_summons", "conv_seris_report", "conv_seris_idle"],
    conversationRules: [
      { id: "conv_seris_report", requireFlag: "temple_voice_defeated", hideIfFlag: "seris_breach_reported" },
      { id: "conv_seris_idle", requireFlag: "seris_breach_reported" },
      { id: "conv_seris_summons", hideIfFlag: "seris_quest_offered" },
    ],
  },
  {
    id: "npc_informant_vex",
    name: "Vex",
    title: "Informante de la Espira",
    description: "Un twi'lek lleno de cicatrices que vende secretos en los niveles inferiores de la Ciudadela. Confía en él justo lo que puedas lanzar a un hutt.",
    zoneId: "dromund_kaas_citadel",
    conversationIds: ["conv_vex_secrets"],
  },
  {
    id: "npc_merchant_drayven",
    name: "Drayven",
    title: "Artífice Sith",
    description: "Un armero que trabaja con kyber y cortosis. Sus piezas son de calidad de reliquia. Sus precios lo reflejan.",
    zoneId: "dromund_kaas_spaceport",
    conversationIds: ["conv_drayven_shop"],
  },
  {
    id: "npc_acolyte_thirix",
    name: "Acólita Thirix",
    title: "Iniciada Atemorizada",
    description: "Una joven acólita Sith asignada al Templo Oscuro. Algo ha ocurrido allí abajo — y está aterrada de volver sola.",
    zoneId: "dromund_kaas_jungle",
    conversationIds: ["conv_thirix_temple", "conv_thirix_after", "conv_thirix_thanks"],
    conversationRules: [
      { id: "conv_thirix_after", requireFlag: "temple_voice_defeated", hideIfFlag: "thirix_avenged" },
      { id: "conv_thirix_thanks", requireFlag: "thirix_avenged" },
      { id: "conv_thirix_temple" },
    ],
  },
  {
    id: "npc_jorra_cantina",
    name: "Jorra",
    title: "Tabernera de la Espira Rota",
    description: "Una curtida mirialana que sirve a soldados, espías y Sith por igual. Lo oye todo y casi nada repite.",
    zoneId: "dromund_kaas_market",
    conversationIds: ["conv_jorra_intro", "conv_jorra_after"],
    conversationRules: [
      { id: "conv_jorra_after", requireFlag: "undercroft_horror_slain" },
      { id: "conv_jorra_intro" },
    ],
  },
  {
    id: "npc_agent_veyra",
    name: "Veyra",
    title: "Una Desconocida que Observa",
    description: "Lleva en esa mesa desde que entraste en el Bazar, y su café se ha quedado frío sin tocar. Sus ojos no dejan de moverse — salvo cuando se posan en ti.",
    zoneId: "dromund_kaas_market",
    conversationIds: ["conv_veyra_intro", "conv_veyra_choice"],
    conversationRules: [
      { id: "conv_veyra_choice", requireFlag: "kaas_dossier_taken", hideIfFlag: "council_side_chosen" },
      { id: "conv_veyra_intro", hideIfFlag: "veyra_met" },
    ],
  },
  {
    id: "npc_hunter_brakk",
    name: "Brakk",
    title: "Cazador Manco",
    description: "Un cazador trandoshano con un muñón cibernético y un libro de cuentas de rencores. La entrada más grande tiene cuatro brazos y vive en una hondonada al norte.",
    zoneId: "dromund_kaas_jungle",
    conversationIds: ["conv_brakk_intro", "conv_brakk_done"],
    conversationRules: [
      { id: "conv_brakk_done", requireFlag: "gundark_alpha_slain", hideIfFlag: "brakk_paid" },
      { id: "conv_brakk_intro", hideIfFlag: "brakk_paid" },
    ],
  },
  {
    // Was orphaned in planet-npcs.ts (its DROMUND_KAAS_NPCS export is shadowed
    // by this file's, so it never reached the registry); re-homed here so the
    // citadel hotspot resolves and the spy quest is actually offered.
    id: "npc_lord_malvek",
    name: "Lord Malvek",
    title: "Magistrado Sith",
    description: "Un esbelto Lord Sith de cabello plateado, uñas cuidadas y sonrisa de serpiente. Ostenta poder político en Ciudad Kaas y usará a cualquiera como peldaño.",
    zoneId: "dromund_kaas_citadel",
    conversationIds: ["conv_malvek_intro"],
  },
  {
    // Also orphaned in planet-npcs.ts; re-homed so the Dark Temple hotspot resolves.
    id: "npc_blind_seer_tavros",
    name: "Tavros el Invisible",
    title: "Vidente Ciego",
    description: "Una figura con túnica y los ojos vendados que se sienta junto al muro exterior del Templo Oscuro. Habla en fragmentos del futuro. La mayoría lo tacha de loco — esa gente suele lamentarlo.",
    zoneId: "dromund_kaas_temple",
    conversationIds: ["conv_tavros_prophecy"],
  },
  {
    // Also orphaned in planet-npcs.ts; re-homed so the Citadel hotspot resolves.
    id: "npc_captain_rhea",
    name: "Capitana Rhea Vayne",
    title: "Comandante Imperial",
    description: "La comandante de la guarnición del distrito sur de Dromund Kaas. Hace cumplir la ley imperial sin piedad, pero bajo la armadura hay alguien que resiente profundamente a los Sith que le dan órdenes.",
    zoneId: "dromund_kaas_citadel",
    conversationIds: ["conv_rhea_intro"],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Conversations
// ═══════════════════════════════════════════════════════════════════════

export const CONV_KALLUS_ARRIVAL: DialogueConversation = {
  id: "conv_kallus_arrival",
  startNodeId: "k1",
  nodes: {
    k1: {
      id: "k1",
      speaker: "Moff Kallus",
      text: "Otro acólito bajando de la lanzadera. Esta vez intenta no prenderle fuego a mi puerto espacial. La Ciudadela está al norte — Darth Seris te ha estado... esperando.",
      options: [
        {
          id: "k1_respect",
          text: "Entendido, Moff. Me presentaré ante ella de inmediato.",
          tone: "neutral",
          consequences: [{ type: "faction_rep", factionId: "sith_academy", value: 2 }],
          nextNodeId: "k_inform",
        },
        {
          id: "k1_dominance",
          text: "Cuida tu tono, soldado. Los Sith no rinden cuentas a burócratas de uniforme.",
          tone: "aggressive",
          consequences: [
            { type: "faction_rep", factionId: "sith_academy", value: -3 },
            { type: "corruption_change", value: 2 },
          ],
          nextNodeId: "k_resent",
        },
        {
          id: "k1_probe",
          text: "[Influencia 4] ¿Qué quiere el Consejo Oscuro de alguien como yo?",
          check: { type: "influence", value: 4 },
          checkLabel: "[Influencia 4]",
          tone: "deceptive",
          consequences: [{ type: "set_flag", key: "kaas_briefed", value: true }],
          nextNodeId: "k_brief",
        },
      ],
    },
    k_inform: {
      id: "k_inform",
      speaker: "Moff Kallus",
      text: "Rapidez y discreción, entonces. La Ciudadela te informará del resto.",
      options: [],
      autoNext: null,
    },
    k_resent: {
      id: "k_resent",
      speaker: "Moff Kallus",
      text: "Como digáis... mi señor. Intentad no sangrar sobre las alfombras.",
      options: [],
      autoNext: null,
    },
    k_brief: {
      id: "k_brief",
      speaker: "Moff Kallus",
      text: "¿Extraoficialmente? El Templo Oscuro está filtrando. Cosas antiguas despertando. El Consejo necesita una daga sin huellas — y los acólitos son muy desechables. Ten cuidado.",
      options: [
        {
          id: "k_brief_thanks",
          text: "Útil. No lo olvidaré.",
          tone: "neutral",
          consequences: [{ type: "faction_rep", factionId: "sith_academy", value: 3 }],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_SERIS_SUMMONS: DialogueConversation = {
  id: "conv_seris_summons",
  startNodeId: "s1",
  nodes: {
    s1: {
      id: "s1",
      speaker: "Darth Seris",
      text: "Así que. El acólito que sobrevivió a Korriban. La mascota de Voren... o su verdugo, según qué rumor prefieras. Tengo una tarea que solo lo desechable puede llevar a cabo.",
      options: [
        {
          id: "s1_accept",
          text: "Nombra la tarea, mi señora.",
          tone: "neutral",
          consequences: [
            { type: "set_flag", key: "seris_quest_offered", value: true },
            { type: "start_quest", questId: "quest_dark_temple_breach" },
          ],
          nextNodeId: "s_brief",
        },
        {
          id: "s1_bargain",
          text: "[Influencia 5] Los activos desechables cuestan más que los leales, mi señora.",
          check: { type: "influence", value: 5 },
          checkLabel: "[Influencia 5]",
          tone: "deceptive",
          consequences: [
            { type: "set_flag", key: "seris_bonus", value: true },
            { type: "add_credits", value: 500 },
            { type: "start_quest", questId: "quest_dark_temple_breach" },
          ],
          nextNodeId: "s_amused",
        },
        {
          id: "s1_refuse",
          text: "Sirvo a Darth Voren, no a ti.",
          tone: "dark",
          consequences: [
            { type: "faction_rep", factionId: "sith_academy", value: -8 },
            { type: "set_flag", key: "seris_enemy", value: true },
          ],
          nextNodeId: "s_threat",
        },
      ],
    },
    s_brief: {
      id: "s_brief",
      speaker: "Darth Seris",
      text: "El Templo Oscuro de la jungla. Algo ha despertado dentro. Halla qué — y acaba con ello. Sobrevive, y volveremos a hablar. Fracasa, y no pierdo nada.",
      options: [
        { id: "s_brief_go", text: "Así se hará.", tone: "aggressive", consequences: [], nextNodeId: null },
      ],
    },
    s_amused: {
      id: "s_amused",
      speaker: "Darth Seris",
      text: "Ja. Una negociadora. Quinientos créditos por adelantado, entonces. No me decepciones — de lo contrario, los querré de vuelta de tu cadáver.",
      options: [
        { id: "s_amused_go", text: "No decepcionaré.", tone: "deceptive", consequences: [], nextNodeId: null },
      ],
    },
    s_threat: {
      id: "s_threat",
      speaker: "Darth Seris",
      text: "Voren está a parsecs de distancia, acólito. Yo estoy aquí mismo. Recuerda cuál de los dos puede alcanzarte mientras duermes.",
      options: [],
      autoNext: null,
    },
  },
};

export const CONV_VEX_SECRETS: DialogueConversation = {
  id: "conv_vex_secrets",
  startNodeId: "v1",
  nodes: {
    v1: {
      id: "v1",
      speaker: "Vex",
      text: "Chsss. Cara nueva. Cara nueva significa créditos nuevos. Tengo información sobre la Ciudadela, el Templo, la amante del Moff... ¿de qué sabor la quieres?",
      options: [
        {
          id: "v1_temple",
          text: "Háblame del Templo Oscuro. (100 créditos)",
          tone: "neutral",
          consequences: [
            { type: "add_credits", value: -100 },
            { type: "set_flag", key: "knows_temple_secret", value: true },
          ],
          nextNodeId: "v_temple",
        },
        {
          id: "v1_seris",
          text: "Háblame de Darth Seris. (150 créditos)",
          tone: "deceptive",
          consequences: [
            { type: "add_credits", value: -150 },
            { type: "set_flag", key: "knows_seris_secret", value: true },
          ],
          nextNodeId: "v_seris",
        },
        {
          id: "v1_threat",
          text: "Dímelo todo — gratis.",
          tone: "aggressive",
          consequences: [{ type: "corruption_change", value: 3 }],
          nextNodeId: "v_threat",
        },
        { id: "v1_leave", text: "Hoy no.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    v_temple: {
      id: "v_temple",
      speaker: "Vex",
      text: "Hay una cámara sellada. Una reliquia. Antigua. Más antigua que el Imperio. ¿Los acólitos que envió Seris? Ninguno regresó. Usa la escalera del este, no la entrada principal.",
      options: [],
      autoNext: null,
    },
    v_seris: {
      id: "v_seris",
      speaker: "Vex",
      text: "Seris tiene una rival en el Consejo. Darth Mortis. No son amigos. Cualquier cosa que avergüence a Seris... es moneda para Mortis. Recuérdalo.",
      options: [],
      autoNext: null,
    },
    v_threat: {
      id: "v_threat",
      speaker: "Vex",
      text: "Hssss... ¿me pones una hoja en la garganta en mi propio mercado? Toma lo que viniste a buscar, entonces — pero al próximo acólito que vea haciendo preguntas, le hablo de *ti*.",
      options: [
        {
          id: "v_threat_accept",
          text: "Aceptable. Habla.",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "knows_temple_secret", value: true },
            { type: "set_flag", key: "knows_seris_secret", value: true },
            { type: "set_flag", key: "vex_hostile", value: true },
          ],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_DRAYVEN_SHOP: DialogueConversation = {
  id: "conv_drayven_shop",
  startNodeId: "d1",
  nodes: {
    d1: {
      id: "d1",
      speaker: "Drayven",
      text: "Acólito. Bienvenido a mi forja. Cristales kyber, trama de cortosis, placas ancestrales — trabajo con materiales que respetan a quien los porta. Mira si tienes los créditos.",
      options: [
        {
          id: "d1_browse",
          text: "Enséñame tu mercancía.",
          tone: "neutral",
          consequences: [{ type: "open_shop", shopId: "drayven" }],
          nextNodeId: null,
        },
        {
          id: "d1_question",
          text: "¿De dónde sale tu kyber?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "d_lore",
        },
        { id: "d1_leave", text: "En otro momento.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    d_lore: {
      id: "d_lore",
      speaker: "Drayven",
      text: "Tython. Ilum. Algunos no los nombro. Una hoja con un historial limpio es una hoja para turistas, acólito. Las mías tienen historias. Eso es lo que estás pagando.",
      options: [
        {
          id: "d_lore_shop",
          text: "Entonces enséñame lo que tienes.",
          tone: "neutral",
          consequences: [{ type: "open_shop", shopId: "drayven" }],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_THIRIX_TEMPLE: DialogueConversation = {
  id: "conv_thirix_temple",
  startNodeId: "t1",
  nodes: {
    t1: {
      id: "t1",
      speaker: "Acólita Thirix",
      text: "Por favor — tú también eres acólito, ¿verdad? Me enviaron al Templo. Algo mató a mis compañeros de escuadrón. Algo *habló*. No puedo volver sola, no puedo —",
      options: [
        {
          id: "t1_calm",
          text: "Respira. Cuéntame qué viste.",
          tone: "light",
          consequences: [
            { type: "set_flag", key: "thirix_befriended", value: true },
            { type: "faction_rep", factionId: "sith_academy", value: 1 },
          ],
          nextNodeId: "t_info",
        },
        {
          id: "t1_use",
          text: "Entonces ven conmigo. Te mantendré con vida — por un precio.",
          tone: "deceptive",
          consequences: [
            { type: "set_flag", key: "thirix_indebted", value: true },
            { type: "corruption_change", value: 1 },
          ],
          nextNodeId: "t_info",
        },
        {
          id: "t1_scorn",
          text: "Un Sith no gimotea. Apártate de mi vista.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 4 },
            { type: "set_flag", key: "thirix_broken", value: true },
          ],
          nextNodeId: null,
        },
      ],
    },
    t_info: {
      id: "t_info",
      speaker: "Acólita Thirix",
      text: "El salón principal — una figura con túnicas negras, pero no un Sith. Su voz era... incorrecta. Superpuesta. Dijo nuestros nombres antes de matarlos. Nunca le dijimos nuestros nombres.",
      options: [
        {
          id: "t_info_promise",
          text: "Lo encontraré. Espera aquí.",
          tone: "neutral",
          consequences: [{ type: "start_quest", questId: "quest_temple_voice" }],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_SERIS_REPORT: DialogueConversation = {
  id: "conv_seris_report",
  startNodeId: "sr1",
  nodes: {
    sr1: {
      id: "sr1",
      speaker: "Darth Seris",
      text: "Saliste caminando del Templo Oscuro. Solo eso te pone por encima de cada daga que he gastado en él. Dime — ¿qué despertaba ahí dentro?",
      options: [
        {
          id: "sr1_truth",
          text: "Un espíritu antiguo. Hablaba con muchas voces. Conocía nombres que no debería. Ahora está muerto.",
          tone: "neutral",
          consequences: [
            { type: "set_flag", key: "seris_breach_reported", value: true },
            { type: "faction_rep", factionId: "sith_academy", value: 10 },
          ],
          nextNodeId: "sr_pleased",
        },
        {
          id: "sr1_leverage",
          text: "[Influencia 6] La información tiene un precio, mi señora. Incluso para ti.",
          check: { type: "influence", value: 6 },
          checkLabel: "[Influencia 6]",
          tone: "deceptive",
          consequences: [
            { type: "set_flag", key: "seris_breach_reported", value: true },
            { type: "add_credits", value: 400 },
          ],
          nextNodeId: "sr_paid",
        },
        {
          id: "sr1_claim",
          text: "Fuera lo que fuera, su poder ahora es mío. Recuérdalo.",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "seris_breach_reported", value: true },
            { type: "corruption_change", value: 3 },
          ],
          nextNodeId: "sr_wary",
        },
      ],
    },
    sr_pleased: {
      id: "sr_pleased",
      speaker: "Darth Seris",
      text: "Entonces el Consejo te debe una deuda que jamás reconocerá. Hay más, acólito — bajo el templo yace un sanctasanctórum sellado. Con la Voz desaparecida, por fin puede abrirse. ¿Interesado?",
      options: [
        {
          id: "sr_pleased_yes",
          text: "Veré lo que el Templo guarda.",
          tone: "neutral",
          consequences: [{ type: "start_quest", questId: "quest_temple_sanctum" }],
          nextNodeId: null,
        },
        { id: "sr_pleased_no", text: "En otro momento, mi señora.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    sr_paid: {
      id: "sr_paid",
      speaker: "Darth Seris",
      text: "Ja. Aprendes rápido. Cuatrocientos, y un consejo gratis: el sanctasanctórum bajo el templo está abierto ahora. Lo que hay atado ahí vale más que créditos — para quien lo reclame primero.",
      options: [
        {
          id: "sr_paid_go",
          text: "Dalo por reclamado.",
          tone: "deceptive",
          consequences: [{ type: "start_quest", questId: "quest_temple_sanctum" }],
          nextNodeId: null,
        },
      ],
    },
    sr_wary: {
      id: "sr_wary",
      speaker: "Darth Seris",
      text: "...Así empieza con todos vosotros. Muy bien, acólito. Lleva tu trofeo al sanctasanctórum bajo el templo — a ver si lo que hay atado ahí te encuentra tan impresionante como tú te encuentras a ti mismo.",
      options: [
        {
          id: "sr_wary_go",
          text: "Lo hará.",
          tone: "dark",
          consequences: [{ type: "start_quest", questId: "quest_temple_sanctum" }],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_SERIS_IDLE: DialogueConversation = {
  id: "conv_seris_idle",
  startNodeId: "si1",
  nodes: {
    si1: {
      id: "si1",
      speaker: "Darth Seris",
      text: "Aún vivo, acólito. O eres muy bueno, o alguien en el Consejo te encuentra útil. Ambas cosas pueden ser ciertas.",
      options: [
        { id: "si1_leave", text: "Mi señora.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
  },
};

export const CONV_THIRIX_AFTER: DialogueConversation = {
  id: "conv_thirix_after",
  startNodeId: "ta1",
  nodes: {
    ta1: {
      id: "ta1",
      speaker: "Acólita Thirix",
      text: "Los susurros cesaron. Anoche toda la jungla quedó en silencio y lo supe — lo *supe*. Lo encontraste. La cosa que se los llevó.",
      options: [
        {
          id: "ta1_kind",
          text: "Está destruida. Tu escuadrón ha tenido respuesta.",
          tone: "light",
          consequences: [
            { type: "set_flag", key: "thirix_avenged", value: true },
            { type: "faction_rep", factionId: "sith_academy", value: 5 },
          ],
          nextNodeId: "ta_thanks",
        },
        {
          id: "ta1_cold",
          text: "Está muerta. Tu deuda conmigo sigue en pie, Thirix.",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "thirix_avenged", value: true },
            { type: "set_flag", key: "thirix_indebted", value: true },
            { type: "corruption_change", value: 1 },
          ],
          nextNodeId: "ta_debt",
        },
      ],
    },
    ta_thanks: {
      id: "ta_thanks",
      speaker: "Acólita Thirix",
      text: "Entonces pueden descansar. Y yo puedo dejar de soñar sus rostros. No lo olvidaré — sea lo que sea en lo que te conviertas ahí fuera, no lo olvidaré.",
      options: [],
      autoNext: null,
    },
    ta_debt: {
      id: "ta_debt",
      speaker: "Acólita Thirix",
      text: "...Sí. Por supuesto. Lo que necesites, cuando llames. Así es como funciona con los Sith, ¿no? Todo tiene un precio.",
      options: [],
      autoNext: null,
    },
  },
};

export const CONV_THIRIX_THANKS: DialogueConversation = {
  id: "conv_thirix_thanks",
  startNodeId: "tt1",
  nodes: {
    tt1: {
      id: "tt1",
      speaker: "Acólita Thirix",
      text: "Solicité un traslado — a cualquier parte sin templos. En su lugar me dieron servicio de vigía de tormentas. Resulta que ya no me molesta el trueno.",
      options: [
        { id: "tt1_leave", text: "Mantén los ojos abiertos, Thirix.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
  },
};

export const CONV_JORRA_INTRO: DialogueConversation = {
  id: "conv_jorra_intro",
  startNodeId: "j1",
  nodes: {
    j1: {
      id: "j1",
      speaker: "Jorra",
      text: "La primera ronda a precio completo, la segunda a mitad — reglas de la Espira Rota. Tienes pinta de alguien que resuelve problemas. Tenemos uno bajo nuestros pies, por si compras trabajo en vez de copas.",
      options: [
        {
          id: "j1_listen",
          text: "Háblame de tu problema.",
          tone: "neutral",
          consequences: [{ type: "set_flag", key: "jorra_met", value: true }],
          nextNodeId: "j_problem",
        },
        {
          id: "j1_drink",
          text: "Solo la copa.",
          tone: "neutral",
          consequences: [{ type: "set_flag", key: "jorra_met", value: true }],
          nextNodeId: "j_drink",
        },
      ],
    },
    j_problem: {
      id: "j_problem",
      speaker: "Jorra",
      text: "Las cuadrillas de mantenimiento siguen bajando a la Cripta y no vuelven a subir. El Ministerio dice que son fallos de droides. El único superviviente al que serví bebió hasta cegarse y repetía: 'aprende'. Los droides no hacen que un hombre beba así.",
      options: [
        {
          id: "j_problem_accept",
          text: "Bajaré a echar un vistazo.",
          tone: "neutral",
          consequences: [{ type: "start_quest", questId: "quest_undercroft" }],
          nextNodeId: "j_accept",
        },
        {
          id: "j_problem_price",
          text: "¿Cuánto vale para ti?",
          tone: "deceptive",
          consequences: [{ type: "start_quest", questId: "quest_undercroft" }],
          nextNodeId: "j_price",
        },
        { id: "j_problem_no", text: "No es mi problema.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    j_accept: {
      id: "j_accept",
      speaker: "Jorra",
      text: "El pozo de mantenimiento está al otro lado de la plaza. Lleva luz. Lleva más luz de la que crees necesitar.",
      options: [],
      autoNext: null,
    },
    j_price: {
      id: "j_price",
      speaker: "Jorra",
      text: "Vale los ahorros de una tabernera y que cada oficial de esta sala te deba un favor callado. El pozo está al otro lado de la plaza. No te mueras — es malo para mi cobro de cuentas.",
      options: [],
      autoNext: null,
    },
    j_drink: {
      id: "j_drink",
      speaker: "Jorra",
      text: "Listo. Problemas ahí abajo, política colina arriba — el centro del vaso es el único lugar seguro de este planeta.",
      options: [],
      autoNext: null,
    },
  },
};

export const CONV_JORRA_AFTER: DialogueConversation = {
  id: "conv_jorra_after",
  startNodeId: "ja1",
  nodes: {
    ja1: {
      id: "ja1",
      speaker: "Jorra",
      text: "Las cuadrillas subieron enteras ayer. Primera vez en un mes. Bajaste ahí, ¿verdad? Esta corre por mi cuenta. Y todas las que vengan después, también.",
      options: [
        {
          id: "ja1_accept",
          text: "Está muerta. Tus cuadrillas están a salvo.",
          tone: "light",
          consequences: [{ type: "set_flag", key: "jorra_friend", value: true }],
          nextNodeId: "ja_done",
        },
      ],
    },
    ja_done: {
      id: "ja_done",
      speaker: "Jorra",
      text: "Entonces la Espira Rota lo recuerda. Pregunta por aquí siempre que necesites saber de qué lado sopla el viento en Ciudad Kaas.",
      options: [],
      autoNext: null,
    },
  },
};

export const CONV_VEYRA_INTRO: DialogueConversation = {
  id: "conv_veyra_intro",
  startNodeId: "ve1",
  nodes: {
    ve1: {
      id: "ve1",
      speaker: "Veyra",
      text: "Siéntate. Llevas tres días en el mundo y Darth Seris ya te tiene haciendo recados en el Templo. Mi patrón lo encuentra... un desperdicio. Él paga mejor, y sus dagas viven más.",
      options: [
        {
          id: "ve1_who",
          text: "¿Tu patrón tiene nombre?",
          tone: "neutral",
          consequences: [{ type: "set_flag", key: "veyra_met", value: true }],
          nextNodeId: "ve_name",
        },
        {
          id: "ve1_threat",
          text: "Dame una razón para no entregarte a Seris ahora mismo.",
          tone: "aggressive",
          consequences: [{ type: "set_flag", key: "veyra_met", value: true }],
          nextNodeId: "ve_calm",
        },
      ],
    },
    ve_name: {
      id: "ve_name",
      speaker: "Veyra",
      text: "Darth Mortis, del Consejo Oscuro propiamente dicho — no de su antesala, donde se sienta Seris. Hay un casillero de entrega muerta junto a los puestos del este. Dentro: la prueba de lo que la ambición de Seris le ha costado al Imperio. Tráemela, y elige quién es dueño de tu futuro.",
      options: [
        {
          id: "ve_name_ok",
          text: "Echaré un vistazo a ese dosier. Luego ya veremos.",
          tone: "deceptive",
          consequences: [{ type: "start_quest", questId: "quest_web_of_council" }],
          nextNodeId: null,
        },
      ],
    },
    ve_calm: {
      id: "ve_calm",
      speaker: "Veyra",
      text: "Porque Seris te daría las gracias, me archivaría, y olvidaría tu nombre para la mañana. Darth Mortis recuerda nombres. Hay una entrega muerta junto a los puestos del este — lee lo que hay dentro antes de decidir qué gratitud vale más.",
      options: [
        {
          id: "ve_calm_ok",
          text: "Bien. Lo leeré.",
          tone: "neutral",
          consequences: [{ type: "start_quest", questId: "quest_web_of_council" }],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_VEYRA_CHOICE: DialogueConversation = {
  id: "conv_veyra_choice",
  startNodeId: "vc1",
  nodes: {
    vc1: {
      id: "vc1",
      speaker: "Veyra",
      text: "Lo has leído. Rituales fallidos. Acólitos muertos. Todo bajo el sello de Seris. Así que: llévaselo a Mortis y asciende con él — o corre a Seris y reza para que su gratitud pese más que su vergüenza. Elige.",
      options: [
        {
          id: "vc1_mortis",
          text: "Mortis puede quedarse su prueba. Y conmigo de paso.",
          tone: "dark",
          consequences: [
            { type: "set_flag", key: "council_side_chosen", value: true },
            { type: "set_flag", key: "sided_with_mortis", value: true },
            { type: "add_credits", value: 800 },
            { type: "corruption_change", value: 2 },
            { type: "start_combat", combatEncounterId: "council_retaliation_seris" },
          ],
          nextNodeId: null,
        },
        {
          id: "vc1_seris",
          text: "Sirvo a Seris. El dosier arde — y tú corres, pequeña espía.",
          tone: "aggressive",
          consequences: [
            { type: "set_flag", key: "council_side_chosen", value: true },
            { type: "set_flag", key: "sided_with_seris", value: true },
            { type: "faction_rep", factionId: "sith_academy", value: 15 },
            { type: "start_combat", combatEncounterId: "council_retaliation_mortis" },
          ],
          nextNodeId: null,
        },
        {
          id: "vc1_both",
          text: "[Influencia 7] O lo vendo dos veces — las copias son baratas, la lealtad es cara.",
          check: { type: "influence", value: 7 },
          checkLabel: "[Influencia 7]",
          tone: "deceptive",
          consequences: [
            { type: "set_flag", key: "council_side_chosen", value: true },
            { type: "set_flag", key: "played_both_lords", value: true },
            { type: "add_credits", value: 1200 },
            { type: "corruption_change", value: 3 },
            { type: "start_combat", combatEncounterId: "council_retaliation_seris" },
          ],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_BRAKK_INTRO: DialogueConversation = {
  id: "conv_brakk_intro",
  startNodeId: "b1",
  nodes: {
    b1: {
      id: "b1",
      speaker: "Brakk",
      text: "Chsss. Agáchate. Los gatos cazan por silueta. ...No eres una patrulla. Bien. Las patrullas espantan la caza y mueren a gritos. ¿Cazas? Esta jungla paga bien — y yo pago mejor por una bestia en particular.",
      options: [
        {
          id: "b1_job",
          text: "Habla de cifras, cazador.",
          tone: "neutral",
          consequences: [
            { type: "set_flag", key: "brakk_met", value: true },
            { type: "start_quest", questId: "quest_jungle_predators" },
          ],
          nextNodeId: "b_job",
        },
        {
          id: "b1_arm",
          text: "¿Qué le pasó a tu brazo?",
          tone: "neutral",
          consequences: [{ type: "set_flag", key: "brakk_met", value: true }],
          nextNodeId: "b_arm",
        },
        { id: "b1_leave", text: "Caza solo, trandoshano.", tone: "aggressive", consequences: [], nextNodeId: null },
      ],
    },
    b_arm: {
      id: "b_arm",
      speaker: "Brakk",
      text: "El gundark alfa. Hondonada del norte. Tenía su garganta en la mira y él tenía mi brazo en su puño. Hicimos un trueque. Pienso renegociar.",
      options: [
        {
          id: "b_arm_job",
          text: "Entonces renegociemos juntos.",
          tone: "neutral",
          consequences: [{ type: "start_quest", questId: "quest_jungle_predators" }],
          nextNodeId: "b_job",
        },
      ],
    },
    b_job: {
      id: "b_job",
      speaker: "Brakk",
      text: "Primero los gatos de las lianas — diezma la manada o te seguirán a la sombra hasta la hondonada y roerán tus huesos después de que el alfa los rompa. Luego el alfa. Mátalo, tráeme un colmillo, y la recompensa se reparte a medias.",
      options: [
        { id: "b_job_go", text: "Gatos muertos, alfa muerto. Espera aquí.", tone: "aggressive", consequences: [], nextNodeId: null },
      ],
    },
  },
};

export const CONV_BRAKK_DONE: DialogueConversation = {
  id: "conv_brakk_done",
  startNodeId: "bd1",
  nodes: {
    bd1: {
      id: "bd1",
      speaker: "Brakk",
      text: "...La jungla ha vuelto a sonar. Pájaros. Insectos. Las cosas pequeñas solo cantan cuando la grande está muerta. Enséñame el colmillo.",
      options: [
        {
          id: "bd1_pay",
          text: "Toma. Tu renegociación está completa.",
          tone: "neutral",
          consequences: [
            { type: "set_flag", key: "brakk_paid", value: true },
            { type: "add_credits", value: 150 },
          ],
          nextNodeId: "bd_done",
        },
      ],
    },
    bd_done: {
      id: "bd_done",
      speaker: "Brakk",
      text: "¡Ja! ¡JA! Míralo — más feo de lo que recordaba. Tu parte, como acordamos. La jungla es tuya ahora, pequeño Sith. Gástala con cabeza.",
      options: [],
      autoNext: null,
    },
  },
};

export const DROMUND_KAAS_CONVERSATIONS: Record<string, DialogueConversation> = {
  conv_kallus_arrival: CONV_KALLUS_ARRIVAL,
  conv_seris_summons: CONV_SERIS_SUMMONS,
  conv_seris_report: CONV_SERIS_REPORT,
  conv_seris_idle: CONV_SERIS_IDLE,
  conv_vex_secrets: CONV_VEX_SECRETS,
  conv_drayven_shop: CONV_DRAYVEN_SHOP,
  conv_thirix_temple: CONV_THIRIX_TEMPLE,
  conv_thirix_after: CONV_THIRIX_AFTER,
  conv_thirix_thanks: CONV_THIRIX_THANKS,
  conv_jorra_intro: CONV_JORRA_INTRO,
  conv_jorra_after: CONV_JORRA_AFTER,
  conv_veyra_intro: CONV_VEYRA_INTRO,
  conv_veyra_choice: CONV_VEYRA_CHOICE,
  conv_brakk_intro: CONV_BRAKK_INTRO,
  conv_brakk_done: CONV_BRAKK_DONE,
};
