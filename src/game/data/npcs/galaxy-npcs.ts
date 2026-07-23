import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";
import type { NpcDefinition } from "./korriban-npcs";

/**
 * Galaxy NPCs — definitions and conversations for hotspot NPCs that
 * previously had no dialogue content (Nar Shaddaa, Onderon, Dxun,
 * Dantooine, Telos).
 *
 * Pattern: each NPC has a one-time intro (sets a `<npc>_met` flag and pays
 * out its reward) and a short repeatable follow-up selected via
 * conversationRules, so first meetings feel meaningful and rewards can't
 * be farmed.
 */

// ═══════════════════════════════════════════════════════════════════════
// Definitions for hotspot NPCs that had none
// ═══════════════════════════════════════════════════════════════════════

export const GALAXY_NPCS: NpcDefinition[] = [
  // ── Nar Shaddaa overrides ────────────────────────────────────────────
  // Base definitions live in planet-npcs.ts; these add the intro/follow-up
  // rules now that the conversations exist (registry order lets these win).
  {
    id: "npc_informant_zek",
    name: "Zek",
    title: "Informante Clandestino",
    description: "Un duros nervioso que comercia con susurros. Sabe demasiado sobre demasiada gente y se siente profundamente incómodo con su propia existencia.",
    zoneId: "nar_shaddaa_cantina",
    conversationIds: ["conv_zek_rumor", "conv_zek_followup"],
    conversationRules: [
      { id: "conv_zek_rumor", hideIfFlag: "zek_met" },
      { id: "conv_zek_followup", requireFlag: "zek_met" },
    ],
  },
  {
    id: "npc_bartender_mira",
    name: "Mira",
    title: "Camarera de Cantina",
    description: "Una humana de lengua afilada que lleva veinte años tras esta barra. Sabe lo que la gente quiere de verdad antes de que lo pidan.",
    zoneId: "nar_shaddaa_cantina",
    conversationIds: ["conv_mira_bar", "conv_mira_followup"],
    conversationRules: [
      { id: "conv_mira_bar", hideIfFlag: "mira_met" },
      { id: "conv_mira_followup", requireFlag: "mira_met" },
    ],
  },
  {
    id: "npc_arms_dealer",
    name: "Saka",
    title: "Traficante de Armas del Mercado Negro",
    description: "Un weequay con un brazo derecho mecánico y una filosofía sobre la 'neutralidad moral de las armas'.",
    zoneId: "nar_shaddaa_market",
    conversationIds: ["conv_saka_shop", "conv_saka_followup"],
    conversationRules: [
      { id: "conv_saka_shop", hideIfFlag: "saka_met" },
      { id: "conv_saka_followup", requireFlag: "saka_met" },
    ],
  },
  {
    id: "npc_alchemist",
    name: "Ossian",
    title: "Alquimista Sith Renegado",
    description: "Un Sith caído que ahora vende soluciones alquímicas a cualquiera que pueda pagarlas. Su laboratorio huele a cosas que probablemente sean ilegales.",
    zoneId: "nar_shaddaa_market",
    conversationIds: ["conv_ossian_shop", "conv_ossian_followup"],
    conversationRules: [
      { id: "conv_ossian_shop", hideIfFlag: "ossian_met" },
      { id: "conv_ossian_followup", requireFlag: "ossian_met" },
    ],
  },

  // ── Onderon ──────────────────────────────────────────────────────────
  {
    id: "npc_queen_talia",
    name: "Reina Talia Marath",
    title: "Reina de Onderon",
    description: "La monarca reinante de Onderon. Ferozmente independiente y políticamente brillante — y convencida de que alguien de su corte responde ante los Sith.",
    zoneId: "onderon_palace",
    conversationIds: ["conv_talia_audience", "conv_talia_verdict", "conv_talia_followup"],
    conversationRules: [
      { id: "conv_talia_verdict", requireFlag: "talia_traitor_named", hideIfFlag: "talia_traitor_resolved" },
      { id: "conv_talia_audience", hideIfFlag: "talia_met" },
      { id: "conv_talia_followup", requireFlag: "talia_met" },
    ],
  },
  {
    id: "npc_general_vaklu",
    name: "General Vaklu Therrik",
    title: "Comandante Militar de Onderon",
    description: "Un veterano curtido que ha defendido las murallas de Onderon durante treinta años. Desconfía de los usuarios de la Fuerza por principio y respeta la fuerza por instinto.",
    zoneId: "onderon_city",
    conversationIds: ["conv_vaklu_intro", "conv_vaklu_report", "conv_vaklu_followup"],
    conversationRules: [
      { id: "conv_vaklu_report", requireFlag: "dxun_resonance_found", hideIfFlag: "vaklu_jungle_done" },
      { id: "conv_vaklu_intro", hideIfFlag: "vaklu_met" },
      { id: "conv_vaklu_followup", requireFlag: "vaklu_met" },
    ],
  },
  {
    id: "npc_onderon_merchant",
    name: "Berga",
    title: "Tratante del Mercado de Bestias",
    description: "Una bulliciosa onderoniana que comercia con cuero de drexl, reliquias de la jungla y cualquier otra cosa que las murallas dejen fuera. Su puesto huele a piel engrasada y especia.",
    zoneId: "onderon_city",
    conversationIds: ["conv_berga_trade", "conv_berga_followup"],
    conversationRules: [
      { id: "conv_berga_trade", hideIfFlag: "berga_met" },
      { id: "conv_berga_followup", requireFlag: "berga_met" },
    ],
  },

  // ── Dxun ─────────────────────────────────────────────────────────────
  {
    id: "npc_mandalore",
    name: "Mandalore",
    title: "Líder de los Clanes Mandalorianos",
    description: "El señor de la guerra enmascarado que reconstruye los clanes desde la jungla de Dxun. Cada palabra que pronuncia la sopesa como munición.",
    zoneId: "dxun_mando_camp",
    conversationIds: ["conv_mandalore_audience", "conv_mandalore_followup"],
    conversationRules: [
      { id: "conv_mandalore_audience", hideIfFlag: "mandalore_met" },
      { id: "conv_mandalore_followup", requireFlag: "mandalore_met" },
    ],
  },
  {
    id: "npc_mando_armorer",
    name: "Vrenn Ordo",
    title: "Armera del Clan",
    description: "Una herrera mandaloriana cuya forja nunca se enfría. Juzga a los visitantes por el desgaste de sus armas, no por las palabras de su boca.",
    zoneId: "dxun_mando_camp",
    conversationIds: ["conv_vrenn_forge", "conv_vrenn_followup"],
    conversationRules: [
      { id: "conv_vrenn_forge", hideIfFlag: "vrenn_met" },
      { id: "conv_vrenn_followup", requireFlag: "vrenn_met" },
    ],
  },

  // ── Dantooine ────────────────────────────────────────────────────────
  {
    id: "npc_jedi_master",
    name: "Maestra Senka Vell",
    title: "Jedi en la Clandestinidad",
    description: "Una serena miraluka que cuida las ruinas del viejo enclave. Sobrevivió a la purga convirtiéndose en parte del paisaje — paciente, callada, vigilante.",
    zoneId: "dantooine_enclave",
    conversationIds: ["conv_senka_meeting", "conv_senka_followup"],
    conversationRules: [
      { id: "conv_senka_meeting", hideIfFlag: "senka_met" },
      { id: "conv_senka_followup", requireFlag: "senka_met" },
    ],
  },

  // ── Telos ────────────────────────────────────────────────────────────
  {
    id: "npc_telos_commander",
    name: "Comandante Issa Locke",
    title: "Jefa de Seguridad de la Estación Ciudadela",
    description: "La oficial que mantiene unida la Estación Ciudadela con muy poca gente y muy poco sueño. Paga bien por problemas que desaparecen sin ruido.",
    zoneId: "telos_citadel",
    conversationIds: ["conv_locke_briefing", "conv_locke_report", "conv_locke_followup"],
    conversationRules: [
      { id: "conv_locke_report", requireFlag: "telos_ring_broken", hideIfFlag: "locke_ring_reported" },
      { id: "conv_locke_briefing", hideIfFlag: "locke_met" },
      { id: "conv_locke_followup", requireFlag: "locke_met" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Nar Shaddaa conversations (NPCs defined in planet-npcs.ts)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_ZEK_RUMOR: DialogueConversation = {
  id: "conv_zek_rumor",
  startNodeId: "z1",
  nodes: {
    z1: {
      id: "z1",
      speaker: "Zek",
      text: "No— no te acerques tanto. La gente ve quién habla conmigo. Eres Sith, ¿verdad? Las túnicas. El andar. Todos aquí lo notan. Vale. Vale. ¿Qué quieres? ¿Rumores? Tengo rumores. Algunos hasta son ciertos.",
      options: [
        { id: "z1a", text: "Dime algo que valga mi tiempo.", consequences: [], nextNodeId: "z2_info" },
        { id: "z1b", text: "[Influencia 6] Cálmate. Respira. Luego habla.", check: { type: "influence", value: 6 }, checkLabel: "[Influencia 6]", consequences: [], nextNodeId: "z2_calm", tone: "light" },
        { id: "z1c", text: "Si algo es falso, volveré a por ti.", consequences: [{ type: "corruption_change", value: 1 }], nextNodeId: "z2_scared", tone: "dark" },
      ],
    },
    z2_info: {
      id: "z2_info",
      speaker: "Zek",
      text: "El Intercambio está moviendo algo grande por el muelle 9 — cajas marcadas como piezas de motor que zumban de noche. Y un agente de la República ha estado preguntando por un Sith que coincide con... bueno. Que coincide contigo.",
      options: [
        { id: "z2i_pay", text: "Útil. Toma, por las molestias. (Dar 50 créditos)", consequences: [{ type: "add_credits", value: -50 }, { type: "set_flag", key: "zek_met", value: true }, { type: "set_flag", key: "rumor_dock9", value: true }, { type: "add_xp", value: 60 }, { type: "faction_rep", factionId: "smuggler_guild", value: 5 }], nextNodeId: "z3_thanks" },
        { id: "z2i_free", text: "Hablas porque te dejo vivir.", consequences: [{ type: "set_flag", key: "zek_met", value: true }, { type: "set_flag", key: "rumor_dock9", value: true }, { type: "add_xp", value: 40 }, { type: "corruption_change", value: 1 }, { type: "faction_rep", factionId: "smuggler_guild", value: -5 }], nextNodeId: "z3_cowed", tone: "dark" },
      ],
    },
    z2_calm: {
      id: "z2_calm",
      speaker: "Zek",
      text: "...Nadie me decía eso desde hace años. Vale. El de verdad, entonces, el que no vendo: circula una orden de recompensa sin nombre y sin rostro — solo un perfil de firma en la Fuerza. Alguien muy rico está cazando usuarios de la Fuerza de forma clandestina. Vigila los muelles superiores.",
      options: [
        { id: "z2c_thanks", text: "Eso conviene saberlo. Toma esto. (Dar 50 créditos)", consequences: [{ type: "add_credits", value: -50 }, { type: "set_flag", key: "zek_met", value: true }, { type: "set_flag", key: "rumor_force_bounty", value: true }, { type: "add_xp", value: 80 }, { type: "faction_rep", factionId: "smuggler_guild", value: 8 }], nextNodeId: "z3_thanks" },
        { id: "z2c_nod", text: "Mantente invisible, Zek.", consequences: [{ type: "set_flag", key: "zek_met", value: true }, { type: "set_flag", key: "rumor_force_bounty", value: true }, { type: "add_xp", value: 60 }], nextNodeId: null },
      ],
    },
    z2_scared: {
      id: "z2_scared",
      speaker: "Zek",
      text: "¡Cierto! Todo cierto, lo juro por— por lo que sea que juren los duros, lo olvido, estoy nervioso. Muelle 9. Cajas que zumban. El Intercambio. Por favor, apunta esa cara a otra parte.",
      options: [
        { id: "z2s_take", text: "Tomo nota.", consequences: [{ type: "set_flag", key: "zek_met", value: true }, { type: "set_flag", key: "rumor_dock9", value: true }, { type: "add_xp", value: 40 }], nextNodeId: null },
      ],
    },
    z3_thanks: {
      id: "z3_thanks",
      speaker: "Zek",
      text: "Créditos. Créditos de verdad. Eres mi tenebroso aterrador favorito de toda la semana. Toma — quédate esto. Se cayó de un transporte médico. No quiero que me lo rastreen.",
      onEnter: [{ type: "add_item", itemId: "shaddaa_medpac", value: 1 }],
      options: [{ id: "z3t_end", text: "Hasta la próxima.", consequences: [], nextNodeId: null }],
    },
    z3_cowed: {
      id: "z3_cowed",
      speaker: "Zek",
      text: "Bien. Sí. Vivir. Me gusta vivir. La información es buena. Solo... ¿vete?",
      options: [{ id: "z3c_end", text: "Dejarlo temblando.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_ZEK_FOLLOWUP: DialogueConversation = {
  id: "conv_zek_followup",
  startNodeId: "zf1",
  nodes: {
    zf1: {
      id: "zf1",
      speaker: "Zek",
      text: "Otra vez tú. Nada nuevo aún — los susurros tardan en madurar. Vuelve cuando algo explote. Siempre explota algo.",
      options: [{ id: "zf1a", text: "Mantén las orejas abiertas.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_MIRA_BAR: DialogueConversation = {
  id: "conv_mira_bar",
  startNodeId: "mb1",
  nodes: {
    mb1: {
      id: "mb1",
      speaker: "Mira",
      text: "Veinte años tras esta barra y leo a cualquiera que entre. ¿Tú? Tú eres problema vestido de paciencia. Zumo de juma, cerveza correliana, o respuestas — esos son los platos del menú. La primera corre por la casa para caras nuevas.",
      options: [
        { id: "mb1a", text: "Respuestas. ¿Qué debería saber un recién llegado sobre esta luna?", consequences: [], nextNodeId: "mb2_advice" },
        { id: "mb1b", text: "La cerveza. Y los chismes que vengan gratis con ella.", consequences: [], nextNodeId: "mb2_gossip" },
        { id: "mb1c", text: "[Corrupción 5] Bebo solo. Mantén a los lugareños lejos de mí.", check: { type: "corruption", value: 5 }, checkLabel: "[Corrupción 5]", consequences: [{ type: "corruption_change", value: 1 }], nextNodeId: "mb2_alone", tone: "dark" },
      ],
    },
    mb2_advice: {
      id: "mb2_advice",
      speaker: "Mira",
      text: "Tres reglas. No le debas nada al Intercambio. No preguntes qué llevan las brochetas de carne de los niveles inferiores. Y si un jefe de muelle gamorreano te ofrece filosofía, escucha — Kull ha salvado más vidas con consejos que cualquier médico de esta roca. Toma, llévate un botiquín. Política de la casa para quien parece que va a necesitarlo.",
      onEnter: [{ type: "set_flag", key: "mira_met", value: true }, { type: "add_item", itemId: "shaddaa_medpac", value: 1 }, { type: "add_xp", value: 50 }],
      options: [{ id: "mb2a_end", text: "Buenas reglas. Gracias, Mira.", consequences: [{ type: "faction_rep", factionId: "smuggler_guild", value: 5 }], nextNodeId: null }],
    },
    mb2_gossip: {
      id: "mb2_gossip",
      speaker: "Mira",
      text: "Chisme gratis, calidad premium: a Saka, en el mercado, le llegó un cargamento de 'equipo agrícola' que requiere dos manos y disciplina de gatillo. Y alguien está comprando cada artefacto sensible a la Fuerza de la luna. En silencio. En efectivo.",
      onEnter: [{ type: "set_flag", key: "mira_met", value: true }, { type: "set_flag", key: "rumor_artifact_buyer", value: true }, { type: "add_xp", value: 50 }],
      options: [{ id: "mb2g_end", text: "Buena cerveza. Mejor información.", consequences: [], nextNodeId: null }],
    },
    mb2_alone: {
      id: "mb2_alone",
      speaker: "Mira",
      text: "La mesa del rincón es tuya. Les diré que muerdes. ...Muerdes, ¿verdad? Eso pensaba.",
      onEnter: [{ type: "set_flag", key: "mira_met", value: true }, { type: "add_xp", value: 30 }],
      options: [{ id: "mb2l_end", text: "Beber en silencio.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_MIRA_FOLLOWUP: DialogueConversation = {
  id: "conv_mira_followup",
  startNodeId: "mf1",
  nodes: {
    mf1: {
      id: "mf1",
      speaker: "Mira",
      text: "De vuelta otra vez. ¿Lo de siempre? El bar está tranquilo esta noche — lo que en Nar Shaddaa significa que alguien trama algo ruidoso.",
      options: [{ id: "mf1a", text: "Sirve. Estoy atenta a la parte ruidosa.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_SAKA_SHOP: DialogueConversation = {
  id: "conv_saka_shop",
  startNodeId: "sk1",
  nodes: {
    sk1: {
      id: "sk1",
      speaker: "Saka",
      text: "Bienvenido, bienvenido. Saka vende herramientas. Una hidrollave arregla una nave; un bláster arregla una negociación. Moralmente idénticas, te lo aseguro. ¿Qué requiere tu problema en particular?",
      options: [
        { id: "sk1a", text: "Enséñame los blásteres. (Comprar bláster del Intercambio — 200 créditos)", consequences: [{ type: "add_credits", value: -200 }, { type: "add_item", itemId: "exchange_blaster", value: 1 }, { type: "set_flag", key: "saka_met", value: true }], nextNodeId: "sk2_sold" },
        { id: "sk1_shop", text: "Enséñame todo tu inventario.", consequences: [{ type: "set_flag", key: "saka_met", value: true }, { type: "open_shop", shopId: "saka" }], nextNodeId: null },
        { id: "sk1b", text: "Chatarra y componentes. Fabrico mis propias soluciones.", consequences: [{ type: "set_flag", key: "saka_met", value: true }, { type: "add_item", itemId: "mat_scrap_metal", value: 3 }], nextNodeId: "sk2_scrap" },
        { id: "sk1c", text: "[Fuerza 7] ¿Qué le venderías a alguien que no necesita armas?", check: { type: "strength", value: 7 }, checkLabel: "[Fuerza 7]", consequences: [{ type: "set_flag", key: "saka_met", value: true }], nextNodeId: "sk2_respect" },
        { id: "sk1d", text: "Solo estoy mirando.", consequences: [{ type: "set_flag", key: "saka_met", value: true }], nextNodeId: null },
      ],
    },
    sk2_sold: {
      id: "sk2_sold",
      speaker: "Saka",
      text: "Excedente del Intercambio — se cayó de un convoy que se cayó por un acantilado al que alguien empujó. Números de serie limpios, historial sucio. No se encasquillará y no se podrá rastrear. Un placer hacer negocios moralmente neutros.",
      options: [{ id: "sk2s_end", text: "Si se encasquilla, vuelvo.", consequences: [], nextNodeId: null }],
    },
    sk2_scrap: {
      id: "sk2_scrap",
      speaker: "Saka",
      text: "¡Un artesano! Especie rara. Llévate estos recortes — gratis. Los clientes que fabrican su propio equipo siempre vuelven por las piezas que no saben hacer. Saka juega a largo plazo.",
      options: [{ id: "sk2c_end", text: "Negocio inteligente.", consequences: [{ type: "add_xp", value: 40 }], nextNodeId: null }],
    },
    sk2_respect: {
      id: "sk2_respect",
      speaker: "Saka",
      text: "¡Ja! ¿A alguien con la complexión de una grúa de carga? Información. La única arma con munición infinita. Aquí tienes una ronda gratis: el alquimista Ossian, dos puestos más allá, paga el triple por reliquias del lado oscuro y no hace ninguna pregunta. El triple, amigo.",
      options: [{ id: "sk2r_end", text: "Munición infinita, en efecto.", consequences: [{ type: "set_flag", key: "rumor_ossian_buyer", value: true }, { type: "add_xp", value: 60 }], nextNodeId: null }],
    },
  },
};

export const CONV_SAKA_FOLLOWUP: DialogueConversation = {
  id: "conv_saka_followup",
  startNodeId: "skf1",
  nodes: {
    skf1: {
      id: "skf1",
      speaker: "Saka",
      text: "¡El cliente aterrador regresa! El inventario rota cada semana — la violencia nunca pasa de temporada. ¿Algo te llama la atención?",
      options: [
        { id: "skf1a", text: "Otro bláster del Intercambio. (200 créditos)", consequences: [{ type: "add_credits", value: -200 }, { type: "add_item", itemId: "exchange_blaster", value: 1 }], nextNodeId: null },
        { id: "skf1b", text: "Hoy no.", consequences: [], nextNodeId: null },
      ],
    },
  },
};

export const CONV_OSSIAN_SHOP: DialogueConversation = {
  id: "conv_ossian_shop",
  startNodeId: "os1",
  nodes: {
    os1: {
      id: "os1",
      speaker: "Ossian",
      text: "Ah. El olor de la Academia aún se te pega — incienso, ozono, ambición. Yo dejé los tres atrás. Ahora destilo lo que los Sith atesoran y se lo vendo a quien pague. Vergonzoso, dicen. Rentable, respondo yo.",
      options: [
        { id: "os1a", text: "Un Sith caído vendiendo estimulantes. Patético.", consequences: [{ type: "corruption_change", value: 1 }], nextNodeId: "os2_defiant", tone: "dark" },
        { id: "os1b", text: "¿Qué puedes destilar para mí?", consequences: [], nextNodeId: "os2_wares" },
        { id: "os1_shop", text: "Enséñame el catálogo completo.", consequences: [{ type: "set_flag", key: "ossian_met", value: true }, { type: "open_shop", shopId: "ossian" }], nextNodeId: null },
        { id: "os1c", text: "[Fuerza 7] Tu conexión con la Fuerza... sigue ahí. Enterrada.", check: { type: "force", value: 7 }, checkLabel: "[Fuerza 7]", consequences: [], nextNodeId: "os2_seen" },
      ],
    },
    os2_defiant: {
      id: "os2_defiant",
      speaker: "Ossian",
      text: "Patético es morir a los treinta en una tumba de Korriban para que un Darth ponga a prueba una teoría. Yo elegí el arroyo y elegí a mi propio maestro: yo. Compra algo o vete a despreciar a otra parte.",
      onEnter: [{ type: "set_flag", key: "ossian_met", value: true }],
      options: [
        { id: "os2d_buy", text: "Bien. Un antídoto. (Comprar — 80 créditos)", consequences: [{ type: "add_credits", value: -80 }, { type: "add_item", itemId: "antidote", value: 1 }], nextNodeId: null },
        { id: "os2d_leave", text: "Disfruta del arroyo.", consequences: [], nextNodeId: null, tone: "dark" },
      ],
    },
    os2_wares: {
      id: "os2_wares",
      speaker: "Ossian",
      text: "Estimulantes de combate que harían llorar a un intendente de la Academia. Antídotos para todo lo que Dxun pueda inyectarte. Y para clientes exigentes — una muestra. La primera prueba es gratis; no es generosidad, es mercadotecnia.",
      onEnter: [{ type: "set_flag", key: "ossian_met", value: true }, { type: "add_item", itemId: "force_stim", value: 1 }, { type: "add_xp", value: 50 }],
      options: [
        { id: "os2w_buy", text: "Me llevaré también un antídoto. (Comprar — 80 créditos)", consequences: [{ type: "add_credits", value: -80 }, { type: "add_item", itemId: "antidote", value: 1 }], nextNodeId: null },
        { id: "os2w_end", text: "La muestra bastará. Por ahora.", consequences: [], nextNodeId: null },
      ],
    },
    os2_seen: {
      id: "os2_seen",
      speaker: "Ossian",
      text: "...La mayoría ya no la percibe. La mantengo pequeña. Atizada, como una brasa. El día que la necesite, estará ahí — y el día que alguien venga a arrastrarme de vuelta, aprenderá lo que veinte años de alquimia le hacen a un vínculo con la Fuerza. Ves con claridad. Toma esto; lo destilé el año en que escapé. Nunca pude venderlo.",
      onEnter: [{ type: "set_flag", key: "ossian_met", value: true }, { type: "add_item", itemId: "adrenal_strength", value: 1 }, { type: "add_xp", value: 80 }],
      options: [{ id: "os2s_end", text: "Tu secreto está a salvo, alquimista.", consequences: [{ type: "faction_rep", factionId: "smuggler_guild", value: 5 }], nextNodeId: null }],
    },
  },
};

export const CONV_OSSIAN_FOLLOWUP: DialogueConversation = {
  id: "conv_ossian_followup",
  startNodeId: "osf1",
  nodes: {
    osf1: {
      id: "osf1",
      speaker: "Ossian",
      text: "¿Vuelves por más? El laboratorio ha sido productivo — y solo un pequeño incendio esta semana. Estimulantes, antídotos, el catálogo de siempre.",
      options: [
        { id: "osf1a", text: "Un antídoto. (Comprar — 80 créditos)", consequences: [{ type: "add_credits", value: -80 }, { type: "add_item", itemId: "antidote", value: 1 }], nextNodeId: null },
        { id: "osf1b", text: "Un estimulante de fuerza. (Comprar — 120 créditos)", consequences: [{ type: "add_credits", value: -120 }, { type: "add_item", itemId: "force_stim", value: 1 }], nextNodeId: null },
        { id: "osf1c", text: "Solo estoy de paso.", consequences: [], nextNodeId: null },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Onderon conversations
// ═══════════════════════════════════════════════════════════════════════

export const CONV_TALIA_AUDIENCE: DialogueConversation = {
  id: "conv_talia_audience",
  startNodeId: "t1",
  nodes: {
    t1: {
      id: "t1",
      speaker: "Reina Talia",
      text: "Entras en mi sala del trono vistiendo el lado oscuro como una capa, y las manos de mis guardias buscan sus hojas. Y aun así concedí esta audiencia. ¿Sabes por qué? Porque el cuchillo que ya está dentro de las murallas me asusta más que el que llama a la puerta.",
      options: [
        { id: "t1a", text: "Un traidor en tu corte. Nombra a tus sospechosos.", consequences: [], nextNodeId: "t2_task" },
        { id: "t1b", text: "[Influencia 8] Necesitas una hoja que nadie en la corte pueda predecir. Te escucho.", check: { type: "influence", value: 8 }, checkLabel: "[Influencia 8]", consequences: [{ type: "add_xp", value: 60 }], nextNodeId: "t2_task" },
        { id: "t1c", text: "¿Por qué ayudaría un Sith a la reina de Onderon?", consequences: [], nextNodeId: "t2_why" },
      ],
    },
    t2_why: {
      id: "t2_why",
      speaker: "Reina Talia",
      text: "Porque quienes susurran al oído de mis ministros sirven a un poder que devora a Sith y a reinas por igual. Sea lo que seas, no eres de ellos. En Onderon, eso te convierte en lo más parecido a terreno neutral que tengo.",
      options: [{ id: "t2w_go", text: "Continúa.", consequences: [], nextNodeId: "t2_task" }],
    },
    t2_task: {
      id: "t2_task",
      speaker: "Reina Talia",
      text: "Tres ministros tenían acceso a las rutas de patrulla que se filtraron. Averigua cuál de ellos nos vendió — con discreción. La corona paga por adelantado, porque la corona espera resultados.",
      onEnter: [{ type: "set_flag", key: "talia_met", value: true }, { type: "set_flag", key: "talia_traitor_hunt", value: true }, { type: "add_credits", value: 300 }, { type: "add_xp", value: 100 }],
      options: [
        { id: "t2t_accept", text: "Dalo por hecho, Majestad.", consequences: [], nextNodeId: null },
        { id: "t2t_dark", text: "Y si los encuentro... ¿qué tan intactos los necesitas?", consequences: [{ type: "corruption_change", value: 1 }], nextNodeId: "t3_dark", tone: "dark" },
      ],
    },
    t3_dark: {
      id: "t3_dark",
      speaker: "Reina Talia",
      text: "...Respirando. El resto lo dejo a tu discreción. Resulta que duermo mejor sin conocer los detalles. Eso, Sith, es lo que llaman arte de gobernar.",
      options: [{ id: "t3d_end", text: "Como desees.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_TALIA_FOLLOWUP: DialogueConversation = {
  id: "conv_talia_followup",
  startNodeId: "tf1",
  nodes: {
    tf1: {
      id: "tf1",
      speaker: "Reina Talia",
      text: "Mis ministros aún me sonríen al otro lado de la mesa del consejo, y una de esas sonrisas es una mentira. Tráeme el nombre cuando lo tengas.",
      options: [{ id: "tf1a", text: "La caza continúa.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_VAKLU_INTRO: DialogueConversation = {
  id: "conv_vaklu_intro",
  startNodeId: "v1",
  nodes: {
    v1: {
      id: "v1",
      speaker: "General Vaklu",
      text: "Treinta años he defendido estas murallas. Jinetes de bestias, mercenarios, dos guerras civiles. Ahora un Sith cruza mi puerta como si la ciudad ya estuviera ganada. Dame una razón para no hacer que te escolten de vuelta a tu nave.",
      options: [
        { id: "v1a", text: "[Fuerza 8] Porque tu escolta necesitaría un médico. Todos ellos.", check: { type: "strength", value: 8 }, checkLabel: "[Fuerza 8]", consequences: [], nextNodeId: "v2_respect", tone: "aggressive" },
        { id: "v1b", text: "Porque a las cosas que se reúnen tras tus murallas no les importa de qué bando soy.", consequences: [], nextNodeId: "v2_pragmatic" },
        { id: "v1c", text: "No me explico ante soldados.", consequences: [{ type: "faction_rep", factionId: "sith_academy", value: 2 }, { type: "corruption_change", value: 1 }], nextNodeId: "v2_cold", tone: "dark" },
      ],
    },
    v2_respect: {
      id: "v2_respect",
      speaker: "General Vaklu",
      text: "¡Ja! Arrogancia honesta. Con la arrogancia honesta puedo trabajar — es la educada la que esconde dagas. Escucha, Sith: las incursiones de drexl se han triplicado y algo en la jungla los empuja hacia la ciudad. Mis exploradores no regresan. Los tuyos quizá sí.",
      onEnter: [{ type: "set_flag", key: "vaklu_met", value: true }, { type: "add_xp", value: 80 }],
      options: [
        { id: "v2r_accept", text: "Investigaré tu problema de la jungla.", consequences: [{ type: "set_flag", key: "vaklu_jungle_task", value: true }, { type: "add_item", itemId: "onderon_guard_blade", value: 1 }], nextNodeId: "v3_blade" },
        { id: "v2r_decline", text: "Tus bestias son tu problema, General.", consequences: [], nextNodeId: null },
      ],
    },
    v2_pragmatic: {
      id: "v2_pragmatic",
      speaker: "General Vaklu",
      text: "...Eso es lo primero sensato que un usuario de la Fuerza me dice en una década. Bien. Tregua. Algo agita los nidos de drexl y mis hombres mueren por averiguar qué. Ayuda, y la armería de Onderon recuerda a sus amigos.",
      onEnter: [{ type: "set_flag", key: "vaklu_met", value: true }, { type: "add_xp", value: 60 }],
      options: [
        { id: "v2p_accept", text: "Señálame la jungla.", consequences: [{ type: "set_flag", key: "vaklu_jungle_task", value: true }, { type: "add_item", itemId: "onderon_guard_blade", value: 1 }], nextNodeId: "v3_blade" },
        { id: "v2p_later", text: "Me lo pensaré.", consequences: [], nextNodeId: null },
      ],
    },
    v2_cold: {
      id: "v2_cold",
      speaker: "General Vaklu",
      text: "No. Vosotros nunca lo hacéis. Hasta el día en que necesitáis que se sostenga una muralla o se cubra un flanco — entonces, de repente, vale la pena hablar con los soldados. Fuera de mi puesto de mando.",
      onEnter: [{ type: "set_flag", key: "vaklu_met", value: true }],
      options: [{ id: "v2c_end", text: "Irse.", consequences: [], nextNodeId: null }],
    },
    v3_blade: {
      id: "v3_blade",
      speaker: "General Vaklu",
      text: "Toma esto — de la guardia, probado contra drexl. Si vas a sangrar por Onderon, bien puedes blandir acero de Onderon. Repórtate ante mí cuando sepas qué hay ahí fuera.",
      options: [{ id: "v3b_end", text: "Acero de Onderon, pues.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_VAKLU_FOLLOWUP: DialogueConversation = {
  id: "conv_vaklu_followup",
  startNodeId: "vf1",
  nodes: {
    vf1: {
      id: "vf1",
      speaker: "General Vaklu",
      text: "¿Sigues en pie, Sith? Bien. La jungla sigue ahí fuera y no se ha vuelto más amable. Mi oferta se mantiene.",
      options: [{ id: "vf1a", text: "Mantén las murallas, General.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_BERGA_TRADE: DialogueConversation = {
  id: "conv_berga_trade",
  startNodeId: "b1",
  nodes: {
    b1: {
      id: "b1",
      speaker: "Berga",
      text: "¡Cuero fresco de drexl! ¡Reliquias de la jungla! ¡Tallas de colmillo de boma que CASI con toda seguridad no están malditas! Ah — ahora tienes pinta de alguien con créditos y aficiones cuestionables. El tipo de cliente favorito de Berga. ¡Mira, mira!",
      options: [
        { id: "b1a", text: "Una hoja de bestia. La de verdad, no chatarra de turistas. (Comprar — 250 créditos)", consequences: [{ type: "add_credits", value: -250 }, { type: "add_item", itemId: "dxun_beast_blade", value: 1 }, { type: "set_flag", key: "berga_met", value: true }], nextNodeId: "b2_sold" },
        { id: "b1b", text: "¿Qué sabes de la luna selvática, Dxun?", consequences: [{ type: "set_flag", key: "berga_met", value: true }], nextNodeId: "b2_dxun" },
        { id: "b1c", text: "[Influencia 6] ¿'Casi con toda seguridad no maldita'? Háblame de la maldita.", check: { type: "influence", value: 6 }, checkLabel: "[Influencia 6]", consequences: [{ type: "set_flag", key: "berga_met", value: true }], nextNodeId: "b2_cursed" },
      ],
    },
    b2_sold: {
      id: "b2_sold",
      speaker: "Berga",
      text: "Tallada de un colmillo de drexl por un cazador que definitivamente existió y que definitivamente no era yo con una hidrosierra. Cortará, amigo. Esa parte está garantizada.",
      options: [{ id: "b2s_end", text: "Más le vale.", consequences: [], nextNodeId: null }],
    },
    b2_dxun: {
      id: "b2_dxun",
      speaker: "Berga",
      text: "¿Dxun? Los mandalorianos volvieron a ella — reconstruyen su campamento en la jungla. Compran cuero, pagan a tiempo, y regatean como si asaltaran una fortaleza. Si vas, menciona a Berga. Te cobrarán de más igual, pero se sentirán mal por ello.",
      onEnter: [{ type: "add_xp", value: 40 }, { type: "set_flag", key: "rumor_mando_camp", value: true }],
      options: [{ id: "b2d_end", text: "Útil. Gracias.", consequences: [], nextNodeId: null }],
    },
    b2_cursed: {
      id: "b2_cursed",
      speaker: "Berga",
      text: "¡Shhh! ...Una caja. Del viejo lado de las tumbas de Dxun. Todo el que la ha tenido ha tenido una suerte espectacular — espectacularmente mala. Berga no puede venderla. Berga no puede deshacerse de ella. ¿Pero a un profesional del lado oscuro? Gratis. Por favor. Llévatela. Zumba cuando llueve.",
      onEnter: [{ type: "add_item", itemId: "relic_bone_talisman", value: 1 }, { type: "add_xp", value: 60 }],
      options: [{ id: "b2c_end", text: "Colecciono la mala suerte. Hecho.", consequences: [], nextNodeId: null, tone: "dark" }],
    },
  },
};

export const CONV_BERGA_FOLLOWUP: DialogueConversation = {
  id: "conv_berga_followup",
  startNodeId: "bf1",
  nodes: {
    bf1: {
      id: "bf1",
      speaker: "Berga",
      text: "¡Mi cliente siniestro favorito regresa! La nueva mercancía llega con la próxima caravana — suponiendo que no se la coman. Logística de jungla, ¿eh?",
      options: [
        { id: "bf1a", text: "Otra hoja de bestia. (Comprar — 250 créditos)", consequences: [{ type: "add_credits", value: -250 }, { type: "add_item", itemId: "dxun_beast_blade", value: 1 }], nextNodeId: null },
        { id: "bf1b", text: "Solo pasaba por el puesto.", consequences: [], nextNodeId: null },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Dxun conversations
// ═══════════════════════════════════════════════════════════════════════

export const CONV_MANDALORE_AUDIENCE: DialogueConversation = {
  id: "conv_mandalore_audience",
  startNodeId: "md1",
  nodes: {
    md1: {
      id: "md1",
      speaker: "Mandalore",
      text: "Un Sith entra solo en mi campamento. O eres valiente, o eres estúpido, o sabes exactamente lo que vale esa máscara de confianza. Los clanes observan. Yo también. Habla.",
      options: [
        { id: "md1a", text: "Vine a ver a los guerreros de los que los Sith aún cuentan historias.", consequences: [], nextNodeId: "md2_stories" },
        { id: "md1b", text: "[Fuerza 9] Vine a ponerme a prueba contra el mejor. Ese eres tú.", check: { type: "strength", value: 9 }, checkLabel: "[Fuerza 9]", consequences: [], nextNodeId: "md2_test", tone: "aggressive" },
        { id: "md1c", text: "Tus clanes lucharon contra el mío una vez. Quizás aún luchemos juntos.", consequences: [], nextNodeId: "md2_alliance" },
      ],
    },
    md2_stories: {
      id: "md2_stories",
      speaker: "Mandalore",
      text: "Historias. Hmpf. Las historias son lo que queda cuando los guerreros se han ido — Malachor se encargó de eso. Reconstruimos aquí en la jungla porque la jungla no se apiada de nosotros. Tú tampoco deberías. Pero cruzaste Dxun solo para presentarte aquí, y eso vale algo.",
      onEnter: [{ type: "set_flag", key: "mandalore_met", value: true }, { type: "add_xp", value: 80 }, { type: "faction_rep", factionId: "mandalorian_houses", value: 8 }],
      options: [{ id: "md2s_end", text: "La fuerza recuerda a la fuerza, Mandalore.", consequences: [], nextNodeId: null }],
    },
    md2_test: {
      id: "md2_test",
      speaker: "Mandalore",
      text: "¡JA! Eso SÍ es entrar en un campamento mandaloriano. Hoy no, Sith — cuando te rete a duelo, será ante todos los clanes, con todos los honores, y uno de los dos cojeando un mes. Hasta entonces: entrena con mis guerreros siempre que pises Dxun. Gánatelo.",
      onEnter: [{ type: "set_flag", key: "mandalore_met", value: true }, { type: "set_flag", key: "mandalore_sparring_rights", value: true }, { type: "add_xp", value: 120 }, { type: "faction_rep", factionId: "mandalorian_houses", value: 12 }],
      options: [{ id: "md2t_end", text: "Te tomaré la palabra con ese duelo.", consequences: [], nextNodeId: null }],
    },
    md2_alliance: {
      id: "md2_alliance",
      speaker: "Mandalore",
      text: "Alianzas. Las alianzas Sith duran exactamente lo que dura la conveniencia Sith. Pero la galaxia se mueve, y los clanes no se quedarán fuera de la próxima guerra. Demuestra que tu palabra es de hierro — a mi armera, a mis centinelas, a la jungla — y hablaremos de 'juntos'.",
      onEnter: [{ type: "set_flag", key: "mandalore_met", value: true }, { type: "add_xp", value: 80 }, { type: "faction_rep", factionId: "mandalorian_houses", value: 5 }],
      options: [{ id: "md2a_end", text: "De hierro, pues.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_MANDALORE_FOLLOWUP: DialogueConversation = {
  id: "conv_mandalore_followup",
  startNodeId: "mdf1",
  nodes: {
    mdf1: {
      id: "mdf1",
      speaker: "Mandalore",
      text: "Sigues vivo, Sith. Dxun te aprueba — se come a los descuidados. Los clanes ahora recuerdan tu nombre. Asegúrate de que siga mereciendo ser recordado.",
      options: [{ id: "mdf1a", text: "Lo hará, Mandalore.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_VRENN_FORGE: DialogueConversation = {
  id: "conv_vrenn_forge",
  startNodeId: "vr1",
  nodes: {
    vr1: {
      id: "vr1",
      speaker: "Vrenn Ordo",
      text: "*La armera no levanta la vista de la forja.* La empuñadura de tu sable — lado izquierdo, cerca del emisor. El patrón de desgaste dice que agarras alto bajo tensión. Descuidado. Siéntate. Vrenn arregla lo descuidado, incluso en equipo Sith.",
      options: [
        { id: "vr1a", text: "Adelante. Impresióname, mandaloriana.", consequences: [], nextNodeId: "vr2_work" },
        { id: "vr1b", text: "¿Cuál es la mejor pieza que has forjado?", consequences: [], nextNodeId: "vr2_pride" },
        { id: "vr1c", text: "Un bláster pesado. De factura mandaloriana. (Comprar — 350 créditos)", consequences: [{ type: "add_credits", value: -350 }, { type: "add_item", itemId: "mandalorian_heavy_blaster", value: 1 }, { type: "set_flag", key: "vrenn_met", value: true }], nextNodeId: "vr2_sold" },
      ],
    },
    vr2_work: {
      id: "vr2_work",
      speaker: "Vrenn Ordo",
      text: "*Veinte minutos de silencio, chispas y gruñidos de desaprobación.* Listo. Equilibrio corregido, placa de contacto reasentada. Ahora golpeará más certero. Sin cargo — un mal trabajo paseándose por la galaxia me ofende más que los Sith.",
      onEnter: [{ type: "set_flag", key: "vrenn_met", value: true }, { type: "add_xp", value: 60 }, { type: "add_item", itemId: "mat_scrap_metal", value: 2 }],
      options: [{ id: "vr2w_end", text: "Trabajo sólido, armera.", consequences: [{ type: "faction_rep", factionId: "mandalorian_houses", value: 5 }], nextNodeId: null }],
    },
    vr2_pride: {
      id: "vr2_pride",
      speaker: "Vrenn Ordo",
      text: "*Por fin levanta la vista.* Un peto para la primera cacería de mi hija. Le quedó pequeño en un año y lo superó en combate en dos. La mejor pieza que he hecho, y la jungla se la llevó de todos modos. Forjamos contra la oscuridad, Sith. No siempre ganamos. Ahora — ¿qué necesitas?",
      onEnter: [{ type: "set_flag", key: "vrenn_met", value: true }, { type: "add_xp", value: 80 }],
      options: [
        { id: "vr2p_blaster", text: "Un bláster pesado, forjado como Dios manda. (Comprar — 350 créditos)", consequences: [{ type: "add_credits", value: -350 }, { type: "add_item", itemId: "mandalorian_heavy_blaster", value: 1 }], nextNodeId: "vr2_sold" },
        { id: "vr2p_end", text: "Nada hoy. Gracias por la historia.", consequences: [{ type: "faction_rep", factionId: "mandalorian_houses", value: 8 }], nextNodeId: null, tone: "light" },
      ],
    },
    vr2_sold: {
      id: "vr2_sold",
      speaker: "Vrenn Ordo",
      text: "Lo forjé durante la estación de lluvias — en Dxun no hay otra cosa que hacer salvo construir y cavilar. Atravesará el pellejo de un boma a cincuenta metros. Trátalo mejor de lo que tratas tu empuñadura.",
      options: [{ id: "vr2s_end", text: "Nada prometo.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_VRENN_FOLLOWUP: DialogueConversation = {
  id: "conv_vrenn_followup",
  startNodeId: "vrf1",
  nodes: {
    vrf1: {
      id: "vrf1",
      speaker: "Vrenn Ordo",
      text: "*Gruñido.* De vuelta otra vez. La forja está caliente, los precios son justos, la charla cuesta extra.",
      options: [
        { id: "vrf1a", text: "Bláster pesado. (Comprar — 350 créditos)", consequences: [{ type: "add_credits", value: -350 }, { type: "add_item", itemId: "mandalorian_heavy_blaster", value: 1 }], nextNodeId: null },
        { id: "vrf1b", text: "Solo me caliento las manos.", consequences: [], nextNodeId: null },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Dantooine conversation
// ═══════════════════════════════════════════════════════════════════════

export const CONV_SENKA_MEETING: DialogueConversation = {
  id: "conv_senka_meeting",
  startNodeId: "sn1",
  nodes: {
    sn1: {
      id: "sn1",
      speaker: "Maestra Senka Vell",
      text: "*La mujer con los ojos vendados que cuida el jardín no se da la vuelta.* Te sentí cruzar el puente. Como una piedra caída en agua quieta — las ondas llegaron antes que tú. La última vez que alguien con tu... peso... vino a estas ruinas, vino a quemar lo que quedaba. ¿Y tú?",
      options: [
        { id: "sn1a", text: "Vine a ver lo que fueron los Jedi, antes de que mis amos los borraran.", consequences: [], nextNodeId: "sn2_curious" },
        { id: "sn1b", text: "Quizás aún no lo he decidido.", consequences: [], nextNodeId: "sn2_honest" },
        { id: "sn1c", text: "Quemarlo terminaría el trabajo como es debido.", consequences: [{ type: "corruption_change", value: 2 }], nextNodeId: "sn2_dark", tone: "dark" },
      ],
    },
    sn2_curious: {
      id: "sn2_curious",
      speaker: "Maestra Senka Vell",
      text: "Entonces mira. Piedra rota, archivos quemados, un jardín que se niega a morir. La Orden era imperfecta — orgullosa, lenta, ciega de formas en que yo no lo soy. Pero intentó ser un refugio en la tormenta, y los refugios importan más después de caer. Toma este fragmento. El archivo al que pertenecía es ceniza; quizás su pregunta sobreviva a nuestras dos órdenes: '¿A qué sirves, cuando nadie te observa?'",
      onEnter: [{ type: "set_flag", key: "senka_met", value: true }, { type: "add_item", itemId: "relic_broken_holocron", value: 1 }, { type: "add_xp", value: 120 }, { type: "faction_rep", factionId: "hidden_jedi", value: 10 }],
      options: [{ id: "sn2c_end", text: "...Consideraré la pregunta.", consequences: [], nextNodeId: null, tone: "light" }],
    },
    sn2_honest: {
      id: "sn2_honest",
      speaker: "Maestra Senka Vell",
      text: "Un Sith honesto. La galaxia aún depara sorpresas. La indecisión no es debilidad, criatura — es el único estado desde el que es posible una elección verdadera. Los que me asustan decidieron hace mucho y dejaron de mirar. Vuelve cuando la balanza se incline. En cualquier caso, me encontrarás aquí, quitando malas hierbas.",
      onEnter: [{ type: "set_flag", key: "senka_met", value: true }, { type: "add_xp", value: 100 }, { type: "faction_rep", factionId: "hidden_jedi", value: 6 }],
      options: [{ id: "sn2h_end", text: "Quitando malas hierbas. Después de todo — malas hierbas.", consequences: [], nextNodeId: "sn3_garden" }],
    },
    sn2_dark: {
      id: "sn2_dark",
      speaker: "Maestra Senka Vell",
      text: "*Por fin se vuelve. La venda no oculta que te está mirando directamente.* Otros lo han dicho, de pie donde tú estás. El jardín volvió a crecer. Ellos no. No lucharé contra ti, Sith — pero Dantooine misma recuerda, y estás muy lejos de tu nave. Elige con suavidad.",
      onEnter: [{ type: "set_flag", key: "senka_met", value: true }, { type: "add_xp", value: 60 }],
      options: [
        { id: "sn2d_back", text: "...Otro día, Jedi.", consequences: [], nextNodeId: null },
        { id: "sn2d_respect", text: "Hm. Habrías sido una Sith decente.", consequences: [{ type: "faction_rep", factionId: "hidden_jedi", value: 2 }], nextNodeId: null, tone: "dark" },
      ],
    },
    sn3_garden: {
      id: "sn3_garden",
      speaker: "Maestra Senka Vell",
      text: "La galaxia acaba rompiéndolo todo tarde o temprano, criatura. Imperios, órdenes, personas. Cuidar algo que vuelve a crecer es el único argumento contra la desesperación que jamás he encontrado convincente. Toma — fruta blba. Es mejor respuesta de lo que parece.",
      onEnter: [{ type: "add_item", itemId: "medpack_basic", value: 2 }],
      options: [{ id: "sn3g_end", text: "Tomar la fruta e irse.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_SENKA_FOLLOWUP: DialogueConversation = {
  id: "conv_senka_followup",
  startNodeId: "snf1",
  nodes: {
    snf1: {
      id: "snf1",
      speaker: "Maestra Senka Vell",
      text: "De vuelta otra vez. El jardín lo notó — caminas más suave que antes. Siéntate, si quieres. Las malas hierbas son interminables y la compañía es más escasa que antes.",
      options: [{ id: "snf1a", text: "Solo paso por las ruinas.", consequences: [], nextNodeId: null }],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Telos conversation
// ═══════════════════════════════════════════════════════════════════════

export const CONV_LOCKE_BRIEFING: DialogueConversation = {
  id: "conv_locke_briefing",
  startNodeId: "lk1",
  nodes: {
    lk1: {
      id: "lk1",
      speaker: "Comandante Locke",
      text: "Estación Ciudadela: cuarenta mil civiles, un proyecto de restauración pendiendo de un hilo, y una fuerza de seguridad que cabría en un montacargas. Y ahora mis sensores señalan a un Sith caminando por mis cubiertas. Dime, ¿estoy a punto de tener una semana muy mala?",
      options: [
        { id: "lk1a", text: "Por mí no — si nos mantenemos fuera del camino del otro.", consequences: [], nextNodeId: "lk2_truce" },
        { id: "lk1b", text: "[Influencia 7] Estás falta de personal y desbordada. Yo resuelvo problemas. Por una tarifa.", check: { type: "influence", value: 7 }, checkLabel: "[Influencia 7]", consequences: [], nextNodeId: "lk2_deal" },
        { id: "lk1c", text: "Eso depende enteramente de ti, Comandante.", consequences: [{ type: "corruption_change", value: 1 }], nextNodeId: "lk2_tense", tone: "dark" },
      ],
    },
    lk2_truce: {
      id: "lk2_truce",
      speaker: "Comandante Locke",
      text: "Fuera del camino del otro. Con eso puedo trabajar — bien sabe el cielo que no tengo gente para nada más. Aviso: Czerka lleva tiempo socavando los contratos de restauración y el Intercambio huele sangre. Si la estación se precipita al caos, 'fuera del camino' deja de ser una opción para nadie.",
      onEnter: [{ type: "set_flag", key: "locke_met", value: true }, { type: "add_xp", value: 60 }],
      options: [{ id: "lk2t_end", text: "Tomo nota, Comandante.", consequences: [], nextNodeId: null }],
    },
    lk2_deal: {
      id: "lk2_deal",
      speaker: "Comandante Locke",
      text: "...Un contratista Sith. Mi carrera ha llegado de verdad a esto. Bien. Hay una red de contrabando moviendo armas por el módulo residencial — mi gente es demasiado conocida para acercarse. Reviéntala y el fondo discrecional de la estación desarrollará una súbita amnesia sobre tu expediente. Adelanto adjunto.",
      onEnter: [{ type: "set_flag", key: "locke_met", value: true }, { type: "set_flag", key: "locke_smuggler_task", value: true }, { type: "add_credits", value: 250 }, { type: "add_xp", value: 100 }],
      options: [{ id: "lk2d_end", text: "Un placer hacer negocios con la ley.", consequences: [], nextNodeId: null }],
    },
    lk2_tense: {
      id: "lk2_tense",
      speaker: "Comandante Locke",
      text: "Respuesta equivocada. Tengo torretas automáticas, dos escuadras de milicia, y absolutamente nada que perder — ponme a prueba. ...Pero no viniste aquí a morir por un umbral, ¿verdad? Camina con cuidado, Sith. Esta estación ha enterrado a suficiente gente.",
      onEnter: [{ type: "set_flag", key: "locke_met", value: true }],
      options: [{ id: "lk2x_end", text: "Marcharse.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_LOCKE_FOLLOWUP: DialogueConversation = {
  id: "conv_locke_followup",
  startNodeId: "lkf1",
  nodes: {
    lkf1: {
      id: "lkf1",
      speaker: "Comandante Locke",
      text: "Aún en mi estación, Sith. Aún sin incendios, sin disturbios, sin incidentes diplomáticos. Mantén la racha y los dos fingiremos que este arreglo es normal.",
      options: [{ id: "lkf1a", text: "Lo normal me viene bien, Comandante.", consequences: [], nextNodeId: null }],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Aggregate
// ═══════════════════════════════════════════════════════════════════════

export const GALAXY_CONVERSATIONS: Record<string, DialogueConversation> = {
  conv_zek_rumor: CONV_ZEK_RUMOR,
  conv_zek_followup: CONV_ZEK_FOLLOWUP,
  conv_mira_bar: CONV_MIRA_BAR,
  conv_mira_followup: CONV_MIRA_FOLLOWUP,
  conv_saka_shop: CONV_SAKA_SHOP,
  conv_saka_followup: CONV_SAKA_FOLLOWUP,
  conv_ossian_shop: CONV_OSSIAN_SHOP,
  conv_ossian_followup: CONV_OSSIAN_FOLLOWUP,
  conv_talia_audience: CONV_TALIA_AUDIENCE,
  conv_talia_followup: CONV_TALIA_FOLLOWUP,
  conv_vaklu_intro: CONV_VAKLU_INTRO,
  conv_vaklu_followup: CONV_VAKLU_FOLLOWUP,
  conv_berga_trade: CONV_BERGA_TRADE,
  conv_berga_followup: CONV_BERGA_FOLLOWUP,
  conv_mandalore_audience: CONV_MANDALORE_AUDIENCE,
  conv_mandalore_followup: CONV_MANDALORE_FOLLOWUP,
  conv_vrenn_forge: CONV_VRENN_FORGE,
  conv_vrenn_followup: CONV_VRENN_FOLLOWUP,
  conv_senka_meeting: CONV_SENKA_MEETING,
  conv_senka_followup: CONV_SENKA_FOLLOWUP,
  conv_locke_briefing: CONV_LOCKE_BRIEFING,
  conv_locke_followup: CONV_LOCKE_FOLLOWUP,
};
