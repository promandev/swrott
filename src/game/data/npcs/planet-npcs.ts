import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";
import type { NpcDefinition } from "./korriban-npcs";

/**
 * NPCs for Dromund Kaas and the broader galaxy (non-Korriban planets).
 * Source: Advanced Implementation Proposals §3 "NPCs y Diálogos".
 */

// ═══════════════════════════════════════════════════════════════════════
// Dromund Kaas NPCs
// ═══════════════════════════════════════════════════════════════════════

export const DROMUND_KAAS_NPCS: NpcDefinition[] = [
  {
    id: "npc_lord_malvek",
    name: "Lord Malvek",
    title: "Magistrado Sith",
    description: "Un esbelto Lord Sith de cabello plateado, uñas cuidadas y sonrisa de serpiente. Ostenta poder político en Ciudad Kaas y usará a cualquiera como peldaño.",
    zoneId: "dromund_kaas_citadel",
    conversationIds: ["conv_malvek_intro", "conv_malvek_mission"],
  },
  {
    id: "npc_blind_seer_tavros",
    name: "Tavros el Invisible",
    title: "Vidente Ciego",
    description: "Una figura con túnica y los ojos vendados que se sienta junto al muro exterior del Templo Oscuro. Habla en fragmentos del futuro. La mayoría lo tacha de loco — esa gente suele lamentarlo.",
    zoneId: "dromund_kaas_temple",
    conversationIds: ["conv_tavros_prophecy", "conv_tavros_questions"],
  },
  {
    id: "npc_captain_rhea",
    name: "Capitana Rhea Vayne",
    title: "Comandante Imperial",
    description: "La comandante de la guarnición del distrito sur de Dromund Kaas. Hace cumplir la ley imperial sin piedad, pero bajo la armadura hay alguien que resiente profundamente a los Sith que le dan órdenes.",
    zoneId: "dromund_kaas_citadel",
    conversationIds: ["conv_rhea_intro", "conv_rhea_secret"],
  },
  {
    id: "npc_darth_seris",
    name: "Darth Seris",
    title: "Representante del Consejo Oscuro",
    description: "Una mujer alta cuya presencia roba el calor de una sala. Habla de ti en tercera persona aunque estés presente. Un contacto del Consejo Oscuro — si eso te ayuda o te condena no está claro.",
    zoneId: "dromund_kaas_citadel",
    conversationIds: ["conv_seris_audience", "conv_seris_deal"],
  },
  {
    id: "npc_moff_kallus",
    name: "Moff Kallus",
    title: "Moff Imperial",
    description: "Un burócrata obeso de palmas sudorosas y un talento para la supervivencia política. Venderá a cualquiera con tal de conservar su cómodo despacho.",
    zoneId: "dromund_kaas_spaceport",
    conversationIds: ["conv_kallus_bribe"],
  },
  {
    id: "npc_acolyte_thirix",
    name: "Acólito Thirix",
    title: "Acólito Perdido",
    description: "Un joven zabrak enviado a estudiar al Templo Oscuro. Se arrepiente por completo y está desesperado por salir con vida.",
    zoneId: "dromund_kaas_jungle",
    conversationIds: ["conv_thirix_plea"],
  },
  {
    id: "npc_merchant_drayven",
    name: "Drayven",
    title: "Armero Imperial",
    description: "Un mercader de armas afín a los Sith con acceso a equipo de grado imperial. Precios justos si tienes credenciales imperiales — desorbitados si no.",
    zoneId: "dromund_kaas_spaceport",
    conversationIds: ["conv_drayven_shop"],
  },
  {
    id: "npc_informant_vex",
    name: "Vex",
    title: "Corredor de Inteligencia",
    description: "Un tratante de información twi'lek que conoce los secretos de todos. Posiblemente empleado por tres facciones distintas a la vez.",
    zoneId: "dromund_kaas_citadel",
    conversationIds: ["conv_vex_info"],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Nar Shaddaa NPCs
// ═══════════════════════════════════════════════════════════════════════

export const NAR_SHADDAA_NPCS: NpcDefinition[] = [
  {
    id: "npc_broker_neth",
    name: "Corredor Neth",
    title: "Señor del Crimen del Intercambio",
    description: "El jefe supremo de la operación del Intercambio en Nar Shaddaa. Cuatro guardaespaldas, un despacho blindado a medida, y una memoria muy larga para quienes lo han agraviado.",
    zoneId: "nar_shaddaa_exchange",
    conversationIds: ["conv_neth_intro", "conv_neth_deal"],
    conversationRules: [
      { id: "conv_neth_deal", requireFlag: "neth_passage_bought" },
      { id: "conv_neth_intro" },
    ],
  },
  {
    id: "npc_cyra_venn",
    name: "Cyra Venn",
    title: "Cazarrecompensas",
    description: "Una letal cazadora mirialana de calmado talante profesional. Tiene contratos permanentes con tres facciones distintas. Posiblemente cuatro.",
    zoneId: "nar_shaddaa_promenade",
    conversationIds: ["conv_cyra_intro", "conv_cyra_job"],
    conversationRules: [
      { id: "conv_cyra_job", requireFlag: "cyra_job_available" },
      { id: "conv_cyra_intro" },
    ],
  },
  {
    id: "npc_dockmaster_kull",
    name: "Jefe de Muelle Kull",
    title: "Coordinador de Contrabando",
    description: "Un gamorreano enorme que, pese a las apariencias, dirige la red de atraque ilegal más eficiente de la luna. Sorprendentemente filosófico.",
    zoneId: "nar_shaddaa_promenade",
    conversationIds: ["conv_kull_docks"],
  },
  {
    id: "npc_informant_zek",
    name: "Zek",
    title: "Informante Clandestino",
    description: "Un duros nervioso que comercia con susurros. Sabe demasiado sobre demasiada gente y se siente profundamente incómodo con su propia existencia.",
    zoneId: "nar_shaddaa_cantina",
    conversationIds: ["conv_zek_rumor"],
  },
  {
    id: "npc_bartender_mira",
    name: "Mira",
    title: "Camarera de Cantina",
    description: "Una humana de lengua afilada que lleva veinte años tras esta barra. Sabe lo que la gente quiere de verdad antes de que lo pidan.",
    zoneId: "nar_shaddaa_cantina",
    conversationIds: ["conv_mira_bar"],
  },
  {
    id: "npc_arms_dealer",
    name: "Saka",
    title: "Traficante de Armas del Mercado Negro",
    description: "Un weequay con un brazo derecho mecánico y una filosofía sobre la 'neutralidad moral de las armas'.",
    zoneId: "nar_shaddaa_market",
    conversationIds: ["conv_saka_shop"],
  },
  {
    id: "npc_alchemist",
    name: "Ossian",
    title: "Alquimista Sith Renegado",
    description: "Un Sith caído que ahora vende soluciones alquímicas a cualquiera que pueda pagarlas. Su laboratorio huele a cosas que probablemente sean ilegales.",
    zoneId: "nar_shaddaa_market",
    conversationIds: ["conv_ossian_shop"],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Onderon NPCs
// ═══════════════════════════════════════════════════════════════════════

export const ONDERON_NPCS: NpcDefinition[] = [
  {
    id: "npc_queen_talira",
    name: "Reina Talira Marath",
    title: "Reina de Onderon",
    description: "La monarca reinante de Onderon. Ferozmente independiente y políticamente brillante. Sospecha que los Sith manipulan su corte y necesita a alguien que opere fuera de los canales oficiales.",
    zoneId: "onderon_city",
    conversationIds: ["conv_talira_audience", "conv_talira_secret_mission"],
    conversationRules: [
      { id: "conv_talira_secret_mission", requireFlag: "talira_mission_available" },
      { id: "conv_talira_audience" },
    ],
  },
  {
    id: "npc_general_voss",
    name: "General Voss Therrik",
    title: "Estratega Militar",
    description: "Un general veterano y curtido que ha defendido Onderon durante treinta años. Respeta la fuerza y desconfía de los usuarios de la Fuerza — pero trabajará con cualquiera que ayude a su pueblo.",
    zoneId: "onderon_city",
    conversationIds: ["conv_voss_intro", "conv_voss_mission"],
    conversationRules: [
      { id: "conv_voss_mission", requireFlag: "voss_task_available" },
      { id: "conv_voss_intro" },
    ],
  },
  {
    id: "npc_hidden_jedi_ronar",
    name: "Ronar Sol",
    title: "Jedi Oculto",
    description: "Un Jedi que sobrevivió a las purgas infiltrándose a fondo en la resistencia clandestina de Onderon. No empuña un sable de luz desde hace años. Conocerte lo obliga a tomar una decisión.",
    zoneId: "onderon_undercity",
    conversationIds: ["conv_ronar_first", "conv_ronar_revelation", "conv_ronar_choice"],
    conversationRules: [
      { id: "conv_ronar_choice", requireFlag: "ronar_revelation_seen" },
      { id: "conv_ronar_revelation", requireFlag: "ronar_ally" },
      { id: "conv_ronar_first" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Additional Korriban NPCs
// ═══════════════════════════════════════════════════════════════════════

export const EXTRA_KORRIBAN_NPCS: NpcDefinition[] = [
  {
    id: "npc_arena_master_dregg",
    name: "Dregg",
    title: "Maestro de la Arena",
    description: "Un zabrak de anchas espaldas que gestiona los combates de la arena de entrenamiento. Tiene ojo para el talento y un negocio paralelo en las apuestas de combate.",
    zoneId: "korriban_arena",
    conversationIds: ["conv_dregg_challenge", "conv_dregg_bets"],
  },
  {
    id: "npc_acolyte_rhen",
    name: "Rhen",
    title: "Acólito Cobarde",
    description: "Un acólito menudo y de voz suave que se paraliza en los duelos de práctica y que claramente no encaja aquí. Vino a la Academia a buscar poder; encontró sobre todo pavor.",
    zoneId: "korriban_academy_interior",
    conversationIds: ["conv_rhen_help", "conv_rhen_secret"],
    conversationRules: [
      { id: "conv_rhen_secret", requireFlag: "rhen_helped" },
      { id: "conv_rhen_help" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// All Planet NPCs combined
// ═══════════════════════════════════════════════════════════════════════

export const ALL_PLANET_NPCS = [
  ...DROMUND_KAAS_NPCS,
  ...NAR_SHADDAA_NPCS,
  ...ONDERON_NPCS,
  ...EXTRA_KORRIBAN_NPCS,
];

export const PLANET_NPC_MAP = new Map(ALL_PLANET_NPCS.map((n) => [n.id, n]));

// ═══════════════════════════════════════════════════════════════════════
// Sample Conversations
// ═══════════════════════════════════════════════════════════════════════

export const CONV_MALVEK_INTRO: DialogueConversation = {
  id: "conv_malvek_intro",
  startNodeId: "m1",
  nodes: {
    m1: {
      id: "m1",
      speaker: "Lord Malvek",
      text: "Ah. Un graduado de la Academia. Siempre lo noto — esa mezcla particular de ambición y violencia apenas contenida. Encantador, a su manera. ¿Qué te trae a Dromund Kaas?",
      options: [
        {
          id: "m1a",
          text: "Busco poder. Información. Aliados.",
          consequences: [],
          nextNodeId: "m2_ambition",
        },
        {
          id: "m1b",
          text: "Eso es asunto mío, Lord Malvek.",
          check: { type: "influence", value: 5 },
          consequences: [],
          nextNodeId: "m2_deflect",
        },
        {
          id: "m1c",
          text: "Me enviaron aquí. Alguien quiere que repares en mí.",
          nextNodeId: "m2_mysterious",
          consequences: [{ type: "set_flag", key: "malvek_curious", value: true }],
        },
      ],
    },
    m2_ambition: {
      id: "m2_ambition",
      speaker: "Lord Malvek",
      text: "Refrescantemente sincero. La mayoría llega fingiendo motivos más nobles. Tengo una tarea que podría interesar a un graduado de la Academia con apetitos amplios. Paga bien. Se requiere discreción.",
      options: [
        {
          id: "m2a_yes",
          text: "Háblame de esa tarea.",
          nextNodeId: "m3_offer",
          consequences: [{ type: "set_flag", key: "malvek_quest_offered", value: true }],
        },
        {
          id: "m2a_no",
          text: "No me interesa hacer recados para burócratas.",
          consequences: [],
          nextNodeId: "m2_insult",
        },
      ],
    },
    m2_deflect: {
      id: "m2_deflect",
      speaker: "Lord Malvek",
      text: "Una persona reservada. Buen instinto. Dromund Kaas recompensa a quienes guardan sus propios secretos. Vuelve cuando hayas conseguido lo que buscabas — quizás tengamos intereses en común.",
      options: [{ id: "m2d_leave", text: "Hasta entonces.", consequences: [], nextNodeId: null }],
    },
    m2_mysterious: {
      id: "m2_mysterious",
      speaker: "Lord Malvek",
      text: "Vaya. Alguien se tomó la molestia de orquestar nuestro encuentro. O un regalo, o una trampa. En cualquier caso, mi curiosidad basta para continuar.",
      options: [{ id: "m2m_continue", text: "Continúa, entonces.", consequences: [], nextNodeId: "m3_offer" }],
    },
    m2_insult: {
      id: "m2_insult",
      speaker: "Lord Malvek",
      text: "Qué gracioso. La mayoría es más cuidadosa con sus palabras. Veremos si eres igual de valiente tras una semana en Dromund Kaas.",
      options: [
        { id: "m2i_leave", text: "Irse.", consequences: [{ type: "faction_rep", factionId: "sith_academy", value: -10 }], nextNodeId: null },
      ],
    },
    m3_offer: {
      id: "m3_offer",
      speaker: "Lord Malvek",
      text: "Alguien está filtrando información a una célula antiimperial que opera desde el distrito del Templo Oscuro. Quiero un nombre. Pruebas. Y quiero que te encargues de la eliminación con discreción. Tráeme evidencias en tres días.",
      options: [
        {
          id: "m3a_accept",
          text: "Dalo por hecho.",
          nextNodeId: null,
          consequences: [
            { type: "start_quest", questId: "q_kaas_malvek_spy" },
            { type: "set_flag", key: "malvek_quest_active", value: true },
          ],
        },
        {
          id: "m3a_decline",
          text: "Busca a otro para tu trabajo sucio.",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_TAVROS_PROPHECY: DialogueConversation = {
  id: "conv_tavros_prophecy",
  startNodeId: "t1",
  nodes: {
    t1: {
      id: "t1",
      speaker: "Tavros el Invisible",
      text: "Ya caminas por el borde de las Fauces. El Hambre aguarda. El Dolor perdura. La Traidora llora y cuenta sus pecados. ¿Qué muerte llevas contigo, criatura?",
      options: [
        {
          id: "t1a",
          text: "[Silencio. Espera a que continúe.]",
          consequences: [],
          nextNodeId: "t2_listen",
        },
        {
          id: "t1b",
          text: "No creo en las profecías.",
          consequences: [],
          nextNodeId: "t2_doubt",
        },
        {
          id: "t1c",
          text: "¿Cómo sabes lo que soy?",
          consequences: [],
          nextNodeId: "t2_question",
        },
        {
          id: "t1d",
          text: "[Sentir la Fuerza] Puedo sentir tu honestidad. ¿Qué ves?",
          check: { type: "force", value: 6 },
          consequences: [{ type: "set_flag", key: "tavros_opened", value: true }],
          nextNodeId: "t2_force",
        },
      ],
    },
    t2_listen: {
      id: "t2_listen",
      speaker: "Tavros el Invisible",
      text: "Los astutos escuchan. La Fuerza me muestra tres hebras desde tu espina: roja, negra, y una que aún no tiene color. La del medio intentará cortar las otras. No se lo permitas.",
      options: [{ id: "t2l_ask", text: "¿Qué significa eso?", consequences: [], nextNodeId: "t3_clarify" }],
    },
    t2_doubt: {
      id: "t2_doubt",
      speaker: "Tavros el Invisible",
      text: "Entonces aprenderás mediante el dolor en lugar de la advertencia. Llega al mismo lugar. Una lástima — el camino es más corto cuando lo ves.",
      options: [{ id: "t2d_leave", text: "Irse.", consequences: [], nextNodeId: null }],
    },
    t2_question: {
      id: "t2_question",
      speaker: "Tavros el Invisible",
      text: "El Templo no tiene puertas para la luz. Llegaste hasta aquí — así es como. La Fuerza acarrea el olor de las decisiones aún no tomadas.",
      options: [{ id: "t2q_continue", text: "Continúa.", consequences: [], nextNodeId: "t3_clarify" }],
    },
    t2_force: {
      id: "t2_force",
      speaker: "Tavros el Invisible",
      text: "Veo el fin del Triunvirato. Veo la mano que le pone fin. No puedo ver el rostro — está envuelto en posibilidad. Pero sé dónde estarás cuando estalle la tormenta: en el centro.",
      options: [{ id: "t2f_continue", text: "Sigue.", consequences: [{ type: "add_xp", value: 100 }], nextNodeId: "t3_clarify" }],
    },
    t3_clarify: {
      id: "t3_clarify",
      speaker: "Tavros el Invisible",
      text: "Tres mundos se quebrarán antes de que alcances el final. Cada uno te ofrecerá un don que parece una herida. Tómalos los tres, o no tomes ninguno. El camino incompleto solo conduce a la ceniza.",
      options: [{ id: "t3_leave", text: "Irse, pensando con intensidad.", consequences: [{ type: "set_flag", key: "tavros_prophecy_heard", value: true }], nextNodeId: null }],
    },
  },
};

export const CONV_RHEA_INTRO: DialogueConversation = {
  id: "conv_rhea_intro",
  startNodeId: "r1",
  nodes: {
    r1: {
      id: "r1",
      speaker: "Capitana Rhea Vayne",
      text: "Distintivo de la Academia. Estás lejos de casa. Declara tu asunto en el distrito de la ciudadela — y no me hagas perder el tiempo con medias respuestas.",
      options: [
        {
          id: "r1a",
          text: "Trabajo en una investigación para Lord Malvek.",
          nextNodeId: "r2_malvek",
          check: { type: "flag", flagKey: "malvek_quest_active" },
          consequences: [],
        },
        {
          id: "r1b",
          text: "Asuntos personales. Nada que concierna a la guarnición.",
          consequences: [],
          nextNodeId: "r2_private",
        },
        {
          id: "r1c",
          text: "Busco información sobre la resistencia que opera cerca del Templo Oscuro.",
          consequences: [{ type: "set_flag", key: "rhea_knows_player_suspicious", value: true }],
          nextNodeId: "r2_resistance",
        },
      ],
    },
    r2_malvek: {
      id: "r2_malvek",
      speaker: "Capitana Rhea Vayne",
      text: "Malvek. Cómo no. Ha tenido tres 'investigadores' aquí este mes. Dos no volvieron. Pisa con cuidado — el distrito del Templo no es seguro y a Malvek no le importa tu vida.",
      options: [
        { id: "r2m_thanks", text: "Agradezco la advertencia.", consequences: [], nextNodeId: "r3_offer" },
        { id: "r2m_brush", text: "Sé cuidarme solo.", consequences: [], nextNodeId: "r3_curt" },
      ],
    },
    r2_private: {
      id: "r2_private",
      speaker: "Capitana Rhea Vayne",
      text: "Tu prerrogativa. Mantente fuera de los sectores restringidos y no causes problemas que yo tenga que limpiar.",
      options: [{ id: "r2p_ok", text: "Entendido.", consequences: [], nextNodeId: null }],
    },
    r2_resistance: {
      id: "r2_resistance",
      speaker: "Capitana Rhea Vayne",
      text: "Sabes de eso. Interesante. La mayoría no — o finge que no. ¿Por qué preguntas?",
      options: [
        { id: "r2r_truth", text: "Quiero acabar con ellos.", consequences: [], nextNodeId: "r3_curt" },
        {
          id: "r2r_ally",
          text: "[Influencia] Quizás no sea tan leal al Imperio como parece.",
          check: { type: "influence", value: 7 },
          consequences: [
            { type: "set_flag", key: "rhea_secret_unlocked", value: true },
            { type: "add_xp", value: 75 },
          ],
          nextNodeId: "r3_offer",
        },
      ],
    },
    r3_offer: {
      id: "r3_offer",
      speaker: "Capitana Rhea Vayne",
      text: "Hay un convoy de suministros que va a un campamento de la resistencia cerca de la vieja estación de relé. Lo sé. He decidido no reportarlo — hay civiles en ese campamento. Si quieres la verdad sobre lo que Malvek hace realmente con sus 'investigaciones', búscame al caer la noche.",
      options: [{ id: "r3o_agree", text: "Al caer la noche, entonces.", nextNodeId: null, consequences: [{ type: "set_flag", key: "rhea_ally", value: true }] }],
    },
    r3_curt: {
      id: "r3_curt",
      speaker: "Capitana Rhea Vayne",
      text: "Bien. Haz tu trabajo, mantente fuera de mi sector, e intenta que no te maten. Retírate.",
      options: [{ id: "r3c_leave", text: "Irse.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_DREGG_CHALLENGE: DialogueConversation = {
  id: "conv_dregg_challenge",
  startNodeId: "d1",
  nodes: {
    d1: {
      id: "d1",
      speaker: "Dregg",
      text: "Tienes pinta de saber lanzar un puñetazo. Yo dirijo las pruebas de combate legítimas de esta arena. Tres niveles — Iniciado, Guerrero, Verdugo. Gana los tres, y obtienes el reconocimiento de la Academia. ¿Quieres entrar?",
      options: [
        {
          id: "d1a",
          text: "Apúntame al grupo de Iniciado.",
          nextNodeId: "d2_accept",
          consequences: [{ type: "start_quest", questId: "q_arena_trials" }, { type: "set_flag", key: "arena_trials_active", value: true }],
        },
        {
          id: "d1b",
          text: "¿Cuál es el premio en cada nivel?",
          consequences: [],
          nextNodeId: "d2_prizes",
        },
        {
          id: "d1c",
          text: "Quiero pelear los tres de una sola vez.",
          check: { type: "strength", value: 8 },
          consequences: [],
          nextNodeId: "d2_challenge",
        },
      ],
    },
    d2_accept: {
      id: "d2_accept",
      speaker: "Dregg",
      text: "Bien. La ronda empieza cuando estés listo. Entra al ring cuando te hayas preparado.",
      options: [{ id: "d2a_go", text: "Listo.", consequences: [], nextNodeId: null }],
    },
    d2_prizes: {
      id: "d2_prizes",
      speaker: "Dregg",
      text: "Iniciado: créditos y un estimulante de combate. Guerrero: una vibrohoja forjada a mano y reconocimiento oficial. Verdugo: eso queda entre tú y la Academia. Digamos 'recompensa significativa'.",
      options: [
        { id: "d2p_enter", text: "Entrar en el grupo de Iniciado.", nextNodeId: "d2_accept", consequences: [{ type: "start_quest", questId: "q_arena_trials" }, { type: "set_flag", key: "arena_trials_active", value: true }] },
        { id: "d2p_leave", text: "Me lo pensaré.", consequences: [], nextNodeId: null },
      ],
    },
    d2_challenge: {
      id: "d2_challenge",
      speaker: "Dregg",
      text: "...[Dregg te observa largamente. Luego sonríe.] Bien. Pero si caes, pierdes todo el reconocimiento. Tres combates, sin descanso. Veamos qué fabricó la Academia.",
      options: [
        { id: "d2c_go", text: "Comienza.", consequences: [{ type: "start_quest", questId: "q_arena_trials_express" }, { type: "set_flag", key: "arena_express_active", value: true }, { type: "add_xp", value: 50 }], nextNodeId: null },
      ],
    },
  },
};

export const CONV_RHEN_HELP: DialogueConversation = {
  id: "conv_rhen_help",
  startNodeId: "rh1",
  nodes: {
    rh1: {
      id: "rh1",
      speaker: "Rhen",
      text: "Oh — perdona, no te vi. Solo estaba... la cámara de meditación está vacía ahora mismo y me gusta cuando hay silencio. No vas a denunciarme, ¿verdad?",
      options: [
        { id: "rh1a", text: "¿Por qué iba a denunciarte?", consequences: [], nextNodeId: "rh2_explain" },
        {
          id: "rh1b",
          text: "Depende. ¿Qué estás haciendo?",
          consequences: [],
          nextNodeId: "rh2_explain",
        },
        {
          id: "rh1c",
          text: "[Intimidar] Dame una razón para no hacerlo.",
          consequences: [{ type: "corruption_change", value: 2 }],
          nextNodeId: "rh2_fear",
        },
      ],
    },
    rh2_explain: {
      id: "rh2_explain",
      speaker: "Rhen",
      text: "Me estoy escondiendo, sinceramente. Hay una prueba mañana y la Supervisora Raxis dice que quien no aguante una postura de combate diez segundos va a las minas. Yo aguanto seis. Los he contado.",
      options: [
        {
          id: "rh2a_help",
          text: "Puedo enseñarte la técnica. Es cuestión de distribución del peso, no de fuerza.",
          nextNodeId: "rh3_help",
          consequences: [{ type: "set_flag", key: "rhen_helped", value: true }, { type: "add_xp", value: 80 }],
        },
        {
          id: "rh2a_ignore",
          text: "Ese es tu problema, no el mío. Buena suerte.",
          consequences: [],
          nextNodeId: null,
        },
        {
          id: "rh2a_dark",
          text: "Entonces probablemente merezcas las minas. Este lugar es para los fuertes.",
          consequences: [{ type: "corruption_change", value: 3 }],
          nextNodeId: "rh3_dark",
        },
      ],
    },
    rh2_fear: {
      id: "rh2_fear",
      speaker: "Rhen",
      text: "[Rhen palidece.] Por favor — no he hecho nada malo. Solo necesitaba silencio. Me voy. Ya me voy.",
      options: [{ id: "rh2f_let", text: "Vete, entonces.", consequences: [], nextNodeId: null }],
    },
    rh3_help: {
      id: "rh3_help",
      speaker: "Rhen",
      text: "¿De verdad... me ayudarías? [Pausa.] La mayoría me empuja en el pasillo y me quita los créditos. Gracias. Lo recordaré.",
      options: [{ id: "rh3h_done", text: "No me lo agradezcas. Solo aprueba la prueba.", consequences: [], nextNodeId: null }],
    },
    rh3_dark: {
      id: "rh3_dark",
      speaker: "Rhen",
      text: "[Rhen no dice nada. Solo te mira con la expresión de alguien a quien le dan la razón sobre algo que esperaba que fuera falso.]",
      options: [{ id: "rh3d_leave", text: "Marcharse.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_RHEN_SECRET: DialogueConversation = {
  id: "conv_rhen_secret",
  startNodeId: "rs1",
  nodes: {
    rs1: {
      id: "rs1",
      speaker: "Rhen",
      text: "{rank} — aprobé. Seis segundos se volvieron doce. La Supervisora hasta pareció molesta. [Baja la voz.] Te debo una, así que pagaré con la única moneda que tengo: cosas que oigo por casualidad. Creen que un cobarde no escucha.",
      options: [
        { id: "rs1a", text: "¿Qué has oído?", tone: "neutral", nextNodeId: "rs2", consequences: [] },
        { id: "rs1b", text: "Guárdate tus secretos. Solo no desperdicies mi técnica.", tone: "neutral", nextNodeId: null, consequences: [] },
      ],
    },
    rs2: {
      id: "rs2",
      speaker: "Rhen",
      text: "Dos acólitos murieron en las tumbas la semana pasada y los Supervisores enterraron los nombres. Susurran que algo responde ahí abajo ahora — y que quien traiga pruebas saltará en el escalafón. Esbocé la senda segura más allá de los primeros sellos. Tómala. Considera saldada nuestra deuda.",
      options: [
        {
          id: "rs2_take",
          text: "Esto podría valer más de lo que crees.",
          tone: "neutral",
          nextNodeId: null,
          consequences: [
            { type: "add_xp", value: 120 },
            { type: "add_credits", value: 120 },
            { type: "set_flag", key: "rhen_tomb_route", value: true },
          ],
        },
      ],
    },
  },
};

export const CONV_NETH_INTRO: DialogueConversation = {
  id: "conv_neth_intro",
  startNodeId: "n1",
  nodes: {
    n1: {
      id: "n1",
      speaker: "Corredor Neth",
      text: "Entrenado en la Academia. Bien. Eso significa que o estás aquí para amenazarme, para cobrar en nombre de otro, o quieres algo que solo yo puedo proveer. ¿Cuál es?",
      options: [
        {
          id: "n1a",
          text: "Busco a alguien. Usa un nombre falso, opera en los niveles inferiores.",
          consequences: [],
          nextNodeId: "n2_search",
        },
        {
          id: "n1b",
          text: "Quiero pasaje a Onderon. Sin preguntas, sin registros.",
          consequences: [{ type: "set_flag", key: "neth_travel_option", value: true }],
          nextNodeId: "n2_passage",
        },
        {
          id: "n1c",
          text: "[Intimidación con la Fuerza] Me dirás lo que necesito saber.",
          check: { type: "force", value: 7 },
          consequences: [{ type: "corruption_change", value: 5 }],
          nextNodeId: "n2_force",
        },
      ],
    },
    n2_search: {
      id: "n2_search",
      speaker: "Corredor Neth",
      text: "La información cuesta. Tres mil créditos te dan un nombre. Diez mil y te diré dónde estar de pie a medianoche. ¿Cuál es tu presupuesto?",
      options: [
        {
          id: "n2s_buy",
          text: "Diez mil.",
          nextNodeId: "n3_deal",
          consequences: [{ type: "add_credits", value: -10000 }, { type: "set_flag", key: "neth_paid", value: true }],
        },
        {
          id: "n2s_low",
          text: "Tres mil.",
          nextNodeId: "n3_partial",
          consequences: [{ type: "add_credits", value: -3000 }],
        },
      ],
    },
    n2_passage: {
      id: "n2_passage",
      speaker: "Corredor Neth",
      text: "Transporte limpio fuera de Nar Shaddaa sin escrutinio imperial. Cinco mil. Pagados ahora. La nave parte en seis horas.",
      options: [
        {
          id: "n2p_pay",
          text: "Hecho.",
          nextNodeId: null,
          consequences: [{ type: "add_credits", value: -5000 }, { type: "set_flag", key: "neth_passage_bought", value: true }],
        },
        {
          id: "n2p_decline",
          text: "Demasiado caro. Buscaré otra forma.",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
    n2_force: {
      id: "n2_force",
      speaker: "Corredor Neth",
      text: "[Los guardaespaldas de Neth desenfundan. Neth no se inmuta.] ¿Quieres pelea, o quieres lo que viniste a buscar? Sé cosas que importan. No me asustas ni la mitad que mis clientes.",
      options: [
        { id: "n2f_back", text: "[Baja la guardia.] Bien. Negociemos.", consequences: [], nextNodeId: "n2_search" },
        { id: "n2f_fight", text: "[Lucha contra los guardias.]", consequences: [{ type: "start_combat", combatEncounterId: "enc_neth_guards" }], nextNodeId: null },
      ],
    },
    n3_deal: {
      id: "n3_deal",
      speaker: "Corredor Neth",
      text: "Listo. Medianoche en el viejo relé de energía, subnivel cuatro. Tu objetivo estará allí para una reunión. Esto no lo oíste de mí.",
      options: [{ id: "n3d_go", text: "Entendido.", consequences: [], nextNodeId: null }],
    },
    n3_partial: {
      id: "n3_partial",
      speaker: "Corredor Neth",
      text: "Opción económica: el nombre es Verrick. Zabrak, tatuajes faciales, camina cojeando. Eso es lo que te compran tres mil.",
      options: [{ id: "n3p_ok", text: "Servirá.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_RONAR_FIRST: DialogueConversation = {
  id: "conv_ronar_first",
  startNodeId: "ro1",
  nodes: {
    ro1: {
      id: "ro1",
      speaker: "Ronar Sol",
      text: "[Lo encuentras en las ruinas, desarmado, atizando una pequeña hoguera. Ve tu arma antes de ver tu rostro. Sus ojos se abren de par en par — luego se aquietan.] No voy a huir. Haz lo que viniste a hacer.",
      options: [
        { id: "ro1a", text: "No me enviaron a matarte. No sabía que estabas aquí.", consequences: [], nextNodeId: "ro2_surprise" },
        { id: "ro1b", text: "¿Qué eres? ¿Un Jedi?", consequences: [], nextNodeId: "ro2_jedi" },
        {
          id: "ro1c",
          text: "[Atacar]",
          nextNodeId: null,
          consequences: [{ type: "start_combat", combatEncounterId: "enc_hidden_jedi" }, { type: "corruption_change", value: 8 }],
        },
      ],
    },
    ro2_surprise: {
      id: "ro2_surprise",
      speaker: "Ronar Sol",
      text: "[Exhala despacio.] Entonces, después de todo, hay suerte en la galaxia. Llevo tres años escondido en estas ruinas. La Reina no sabe que estoy vivo. Nadie lo sabe.",
      options: [
        { id: "ro2a_help", text: "¿Quieres mi ayuda?", consequences: [], nextNodeId: "ro3_offer" },
        { id: "ro2a_leave", text: "Guardaré tu secreto.", consequences: [{ type: "set_flag", key: "ronar_found", value: true }], nextNodeId: null },
      ],
    },
    ro2_jedi: {
      id: "ro2_jedi",
      speaker: "Ronar Sol",
      text: "Lo era. Ya no estoy seguro de qué soy. Tres años de ocultamiento cambian la definición. Conservé la túnica y perdí la certeza.",
      options: [{ id: "ro2j_continue", text: "¿Qué pasó?", consequences: [], nextNodeId: "ro3_history" }],
    },
    ro3_offer: {
      id: "ro3_offer",
      speaker: "Ronar Sol",
      text: "Estás con los Sith. ¿Por qué ibas a ayudarme? A menos que— [Lee tu rostro.] Tu camino es más complicado que tus lealtades. De acuerdo. Necesito información de dentro del palacio. Algo a lo que no puedo acceder desde las ruinas.",
      options: [
        {
          id: "ro3a_accept",
          text: "La conseguiré. ¿Qué buscamos?",
          nextNodeId: null,
          consequences: [{ type: "start_quest", questId: "q_ronar_spy_mission" }, { type: "set_flag", key: "ronar_ally", value: true }],
        },
        { id: "ro3a_decline", text: "No puedo permitirme esa complicación.", consequences: [], nextNodeId: null },
      ],
    },
    ro3_history: {
      id: "ro3_history",
      speaker: "Ronar Sol",
      text: "La Purga. Yo estaba fuera del mundo cuando empezó. Para cuando volví no quedaba nada a lo que volver. He estado vigilando — asegurándome de que la clandestinidad de Onderon siga funcionando. Es trabajo menor para un Jedi. Pero es lo que tengo.",
      options: [
        { id: "ro3h_offer", text: "Quizás pueda ser más. Puedo ayudar.", consequences: [], nextNodeId: "ro3_offer" },
        { id: "ro3h_leave", text: "Has sobrevivido. Eso significa algo.", consequences: [{ type: "set_flag", key: "ronar_found", value: true }], nextNodeId: null },
      ],
    },
  },
};

// ─── Cyra Venn — bounty hunter (Nar Shaddaa) ───────────────────────────
export const CONV_CYRA_INTRO: DialogueConversation = {
  id: "conv_cyra_intro",
  startNodeId: "cy1",
  nodes: {
    cy1: {
      id: "cy1",
      speaker: "Cyra Venn",
      text: "[La mirialana no levanta la vista mientras limpia su rifle.] Caminas como alguien acostumbrado a que la gente se aparte. Yo no me aparto. Así que o eres un contrato, un cliente, o un cadáver al que aún no se lo han dicho. Elige uno.",
      options: [
        { id: "cy1a", text: "Un cliente. Dicen que eres la mejor cazadora de la luna.", tone: "neutral", nextNodeId: "cy2_client", consequences: [{ type: "set_flag", key: "cyra_met", value: true }] },
        { id: "cy1b", text: "¿Estoy en uno de tus contratos?", tone: "neutral", nextNodeId: "cy2_contract", consequences: [{ type: "set_flag", key: "cyra_met", value: true }] },
        { id: "cy1c", text: "Cuidado a quién amenazas, cazadora.", tone: "dark", nextNodeId: "cy2_threat", consequences: [{ type: "set_flag", key: "cyra_met", value: true }] },
      ],
    },
    cy2_client: {
      id: "cy2_client",
      speaker: "Cyra Venn",
      text: "Mejor es una palabra que usan los aficionados. Yo soy la que remata. Vuelve cuando tengas un nombre y una cifra — no trabajo con halagos. Aunque... tengo un trabajo que no puedo aceptar yo misma. Conflicto de contratos. ¿Interesado?",
      options: [
        { id: "cy2c_yes", text: "Háblame de ello.", tone: "neutral", nextNodeId: null, consequences: [{ type: "set_flag", key: "cyra_job_available", value: true }] },
        { id: "cy2c_no", text: "En otro momento.", tone: "neutral", nextNodeId: null, consequences: [] },
      ],
    },
    cy2_contract: {
      id: "cy2_contract",
      speaker: "Cyra Venn",
      text: "[Una leve sonrisa.] Si lo estuvieras, no estaríamos hablando. Estarías en una cápsula de estasis camino de quien pague. Relájate, Sith. Tu recompensa es demasiado política para mi gusto. Sith cazando Sith — esa la dejé caducar.",
      options: [{ id: "cy2ct_ok", text: "Lista. Mantente al margen.", tone: "neutral", nextNodeId: null, consequences: [{ type: "set_flag", key: "cyra_job_available", value: true }] }],
    },
    cy2_threat: {
      id: "cy2_threat",
      speaker: "Cyra Venn",
      text: "[Por fin levanta la vista. Su mano nunca dejó el rifle.] He enterrado a tres personas que empezaron con una amenaza. Tú tienes la Fuerza, yo tengo la posición alta y un detonador térmico bajo esta mesa. ¿Quieres ver de quién son más rápidos los reflejos?",
      options: [
        { id: "cy2t_back", text: "...Hemos terminado aquí.", tone: "neutral", nextNodeId: null, consequences: [] },
        { id: "cy2t_respect", text: "[Reír] Me caes bien. No nos matemos hoy.", tone: "neutral", nextNodeId: null, consequences: [{ type: "faction_rep", factionId: "smuggler_guild", value: 5 }, { type: "set_flag", key: "cyra_job_available", value: true }] },
      ],
    },
  },
};

export const CONV_CYRA_JOB: DialogueConversation = {
  id: "conv_cyra_job",
  startNodeId: "cj1",
  nodes: {
    cj1: {
      id: "cj1",
      speaker: "Cyra Venn",
      text: "El trabajo: un contable del Intercambio desplumó al jefe equivocado y huyó a los niveles inferiores. Estoy contratada por dos partes que lo quieren — aceptarlo significa quemar a un cliente. Tú no tienes ese problema. Tráelo, repartimos la recompensa. Créditos limpios.",
      options: [
        { id: "cj1a", text: "Lo traeré. ¿Vivo?", tone: "neutral", nextNodeId: null, consequences: [{ type: "add_credits", value: 200 }, { type: "set_flag", key: "cyra_bounty_taken", value: true }] },
        { id: "cj1b", text: "Cazar tus sobras no es mi trabajo.", tone: "dark", nextNodeId: null, consequences: [] },
      ],
    },
  },
};

// ─── General Voss Therrik — Onderon military ───────────────────────────
export const CONV_VOSS_INTRO: DialogueConversation = {
  id: "conv_voss_intro",
  startNodeId: "vo1",
  nodes: {
    vo1: {
      id: "vo1",
      speaker: "General Voss",
      text: "[El viejo general no saluda. Te estudia como estudiaría un frente de tormenta.] Un Sith, en mi ciudad. He enterrado a hombres mejores que tú por menos. Pero la Reina dice que eres útil, y he aprendido a fiarme de su juicio más que de mi propio desagrado. Declara tu asunto.",
      options: [
        { id: "vo1a", text: "Vengo a ayudar a Onderon. Te guste o no.", tone: "neutral", nextNodeId: "vo2_help", consequences: [{ type: "set_flag", key: "voss_met", value: true }] },
        { id: "vo1b", text: "Desconfías de la Fuerza. ¿Por qué?", tone: "neutral", nextNodeId: "vo2_distrust", consequences: [{ type: "set_flag", key: "voss_met", value: true }] },
        { id: "vo1c", text: "Cuida tu tono, soldado. Podría acabar contigo con un gesto.", tone: "dark", nextNodeId: "vo2_threat", consequences: [{ type: "set_flag", key: "voss_met", value: true }, { type: "corruption_change", value: 2 }] },
      ],
    },
    vo2_help: {
      id: "vo2_help",
      speaker: "General Voss",
      text: "Ayudar. [Gruñe.] Cada forastero que ha 'ayudado' a Onderon la dejó más pobre. Pero soy un pragmático. Hay una banda de saqueadores jinetes de bestias desangrando mis patrullas del este. Ocúpate de ella y revisaré mi opinión sobre los de tu clase. Ligeramente.",
      options: [
        { id: "vo2h_accept", text: "Dalo por hecho.", tone: "neutral", nextNodeId: null, consequences: [{ type: "set_flag", key: "voss_task_available", value: true }] },
        { id: "vo2h_later", text: "Me lo pensaré.", tone: "neutral", nextNodeId: null, consequences: [] },
      ],
    },
    vo2_distrust: {
      id: "vo2_distrust",
      speaker: "General Voss",
      text: "Hace treinta años un 'consejero' Jedi convenció a mi rey de una guerra que mató a cuarenta mil onderonianos, y luego se marchó cuando se torció. Los usuarios de la Fuerza ven los ejércitos como piezas. Yo los veo como los hijos de gente con la que bebo. Esa es la diferencia entre nosotros.",
      options: [{ id: "vo2d_ok", text: "Entonces déjame demostrar que no soy él.", tone: "neutral", nextNodeId: "vo2_help", consequences: [] }],
    },
    vo2_threat: {
      id: "vo2_threat",
      speaker: "General Voss",
      text: "[No se inmuta.] Pues hazlo. Pero que sepas que en el momento en que deje de respirar, los cañones de la ciudad apuntarán a cada Sith de aquí al puerto espacial, y tu 'utilidad' para la Reina muere conmigo. El poder es fácil, Sith. La contención es la parte difícil. Demuéstrame que tienes algo de ella.",
      options: [{ id: "vo2t_back", text: "[Baja la mano.] Eres más útil vivo. Por ahora.", tone: "neutral", nextNodeId: "vo2_help", consequences: [] }],
    },
  },
};

export const CONV_VOSS_MISSION: DialogueConversation = {
  id: "conv_voss_mission",
  startNodeId: "vm1",
  nodes: {
    vm1: {
      id: "vm1",
      speaker: "General Voss",
      text: "La banda anida en la vieja cantera al norte de la muralla. Su cabecilla monta un drexl domado — mátalo y los demás se dispersan. Mis exploradores son buenos soldados con familias. Tráelos a casa y habrás hecho más por Onderon que cualquier Jedi en treinta años.",
      options: [
        { id: "vm1a", text: "El drexl muere. Y el cabecilla también.", tone: "neutral", nextNodeId: null, consequences: [{ type: "add_xp", value: 100 }, { type: "set_flag", key: "voss_quarry_briefed", value: true }] },
      ],
    },
  },
};

// ─── Queen Talira Marath — Onderon throne ──────────────────────────────
export const CONV_TALIRA_AUDIENCE: DialogueConversation = {
  id: "conv_talira_audience",
  startNodeId: "ta1",
  nodes: {
    ta1: {
      id: "ta1",
      speaker: "Reina Talira",
      text: "[La Reina despide a sus guardias con un gesto de dos dedos — una calculada demostración de confianza o de intrepidez.] Te pedí a ti específicamente, Sith. No porque admire tu Orden. Porque necesito a alguien cuyas manos ya estén sucias, y que no responda ante nadie de mi corte.",
      options: [
        { id: "ta1a", text: "Sospechas traición en tu propia corte.", tone: "neutral", nextNodeId: "ta2_treason", consequences: [{ type: "set_flag", key: "talira_met", value: true }] },
        { id: "ta1b", text: "¿Qué quiere una reina de los Sith?", tone: "neutral", nextNodeId: "ta2_want", consequences: [{ type: "set_flag", key: "talira_met", value: true }] },
        { id: "ta1c", text: "Halagos. Tienes miedo. ¿De qué?", tone: "dark", nextNodeId: "ta2_treason", consequences: [{ type: "set_flag", key: "talira_met", value: true }] },
      ],
    },
    ta2_treason: {
      id: "ta2_treason",
      speaker: "Reina Talira",
      text: "Alguien de mi círculo íntimo filtra los planes de defensa de Onderon al Imperio Sith — tu Imperio. No puedo actuar abiertamente; una acusación sin pruebas hace estallar el consejo e invita a la mismísima invasión que intento prevenir. Necesito que se encuentre al traidor. Con discreción. Permanentemente.",
      options: [
        { id: "ta2t_accept", text: "Encontraré a tu traidor.", tone: "neutral", nextNodeId: null, consequences: [{ type: "set_flag", key: "talira_mission_available", value: true }] },
        { id: "ta2t_price", text: "¿Y mi precio?", tone: "neutral", nextNodeId: "ta3_price", consequences: [] },
      ],
    },
    ta2_want: {
      id: "ta2_want",
      speaker: "Reina Talira",
      text: "Quiero lo que quiere todo gobernante — seguir gobernando el año que viene. Hay un cuchillo en mi corte y lleva un rostro amable. Tú cazas cuchillos. Encuéntralo antes de que encuentre mi espalda.",
      options: [{ id: "ta2w_ok", text: "Dime dónde buscar.", tone: "neutral", nextNodeId: "ta2_treason", consequences: [] }],
    },
    ta3_price: {
      id: "ta3_price",
      speaker: "Reina Talira",
      text: "La independencia de Onderon vale más para tu Imperio como un favor adeudado que como un mundo conquistado. Haz esto, y la corona recuerda sus deudas. Traiciónamela, y aprenderás por qué he sobrevivido a cuatro hombres que lo intentaron.",
      options: [{ id: "ta3p_ok", text: "Entonces nos entendemos.", tone: "neutral", nextNodeId: null, consequences: [{ type: "set_flag", key: "talira_mission_available", value: true }] }],
    },
  },
};

export const CONV_TALIRA_SECRET_MISSION: DialogueConversation = {
  id: "conv_talira_secret_mission",
  startNodeId: "ts1",
  nodes: {
    ts1: {
      id: "ts1",
      speaker: "Reina Talira",
      text: "Tres tienen acceso a los planes de defensa sellados: mi maestra de espías, mi tesorero, y el general que ya has conocido. A Voss le confiaría mi vida — pero la confianza es justo el punto ciego que un traidor astuto explota. Vigílalos. Tráeme pruebas, no sospechas.",
      options: [
        { id: "ts1a", text: "Tendrás tus pruebas.", tone: "neutral", nextNodeId: null, consequences: [{ type: "add_xp", value: 120 }, { type: "set_flag", key: "talia_traitor_hunt", value: true }] },
      ],
    },
  },
};

// ─── Broker Neth — the deal (Nar Shaddaa Exchange) ─────────────────────
export const CONV_NETH_DEAL: DialogueConversation = {
  id: "conv_neth_deal",
  startNodeId: "nd1",
  nodes: {
    nd1: {
      id: "nd1",
      speaker: "Corredor Neth",
      text: "Ya de vuelta. Bien — respeto la clientela que repite. Tengo una propuesta que necesita a alguien con tu particular... falta de papeleo. Un cargamento de cargas mineras de Czerka 'se cayó' de un carguero. Necesito moverlo antes de que los hutts noten que está en mi almacén. Trabajo discreto, créditos limpios.",
      options: [
        { id: "nd1a", text: "Muevo tus cajas, me debes un favor. Trato hecho.", tone: "neutral", nextNodeId: "nd2_yes", consequences: [{ type: "add_credits", value: 300 }, { type: "set_flag", key: "neth_deal_struck", value: true }] },
        { id: "nd1b", text: "Cargas tan potentes no son para minería. ¿Quién es el comprador real?", tone: "neutral", nextNodeId: "nd2_truth", consequences: [] },
        { id: "nd1c", text: "No hago recados para señores del crimen.", tone: "dark", nextNodeId: null, consequences: [{ type: "faction_rep", factionId: "smuggler_guild", value: -5 }] },
      ],
    },
    nd2_yes: {
      id: "nd2_yes",
      speaker: "Corredor Neth",
      text: "Un Sith con olfato para los negocios. Raro. Las cajas están en la bahía nueve. No las abras, no hagas preguntas, y los dos fingiremos que esta conversación nunca existió.",
      options: [{ id: "nd2y_ok", text: "Un placer hacer negocios.", tone: "neutral", nextNodeId: null, consequences: [] }],
    },
    nd2_truth: {
      id: "nd2_truth",
      speaker: "Corredor Neth",
      text: "[Una larga pausa. Decide que la honestidad es más barata que la alternativa.] Una célula separatista en Onderon. Pagan el triple y no preguntan nada. A dónde vayan esas cargas tras salir de mi almacén no es asunto mío — y no debería serlo tuyo, si eres listo.",
      options: [
        { id: "nd2t_take", text: "El triple, dijiste. Las moveré — y recordaré al comprador.", tone: "dark", nextNodeId: null, consequences: [{ type: "add_credits", value: 300 }, { type: "set_flag", key: "neth_deal_struck", value: true }, { type: "set_flag", key: "onderon_charges_known", value: true }] },
        { id: "nd2t_walk", text: "Armar separatistas es una guerra que no empezaré. Busca otro correo.", tone: "light", nextNodeId: null, consequences: [] },
      ],
    },
  },
};

// ─── Dregg — arena betting (Korriban) ──────────────────────────────────
export const CONV_DREGG_BETS: DialogueConversation = {
  id: "conv_dregg_bets",
  startNodeId: "db1",
  nodes: {
    db1: {
      id: "db1",
      speaker: "Dregg",
      text: "[El zabrak sonríe, colmillos y todo.] Peleaste lo bastante bien como para que la casa ahora mueva cuota sobre ti. Esto es lo de la arena que nadie cuenta a los acólitos: el verdadero deporte de sangre son las apuestas. ¿Te apuntas? Pon créditos en un combate. Gana a lo grande, o financia mi jubilación. De cualquier modo, estoy contento.",
      options: [
        { id: "db1a", text: "Pon 100 al próximo favorito.", tone: "neutral", nextNodeId: "db2_safe", consequences: [{ type: "add_credits", value: -100 }] },
        { id: "db1b", text: "100 al desfavorecido. Me gustan las cuotas largas.", tone: "neutral", nextNodeId: "db2_risk", consequences: [{ type: "add_credits", value: -100 }] },
        { id: "db1c", text: "Apostar es para quienes no pueden ganar por sí mismos.", tone: "dark", nextNodeId: null, consequences: [] },
      ],
    },
    db2_safe: {
      id: "db2_safe",
      speaker: "Dregg",
      text: "El favorito se lo lleva, limpio. Poco retorno, pero una victoria es una victoria. [Te cuenta los créditos con sorprendente delicadeza para unas manos tan grandes.] Dinero inteligente. Aburrido, pero inteligente.",
      options: [{ id: "db2s_ok", text: "Lo aburrido paga las facturas.", tone: "neutral", nextNodeId: null, consequences: [{ type: "add_credits", value: 140 }, { type: "set_flag", key: "dregg_bet_placed", value: true }] }],
    },
    db2_risk: {
      id: "db2_risk",
      speaker: "Dregg",
      text: "El desfavorecido le engancha las tripas al favorito en el segundo intercambio — nadie lo vio venir, salvo, al parecer, tú. [Suelta un grueso fajo de créditos, riendo.] Es lo más divertido que me he echado perdiendo dinero en todo el mes. Vuelve. Trae más.",
      options: [{ id: "db2r_ok", text: "Tengo ojo para un asesino.", tone: "neutral", nextNodeId: null, consequences: [{ type: "add_credits", value: 350 }, { type: "set_flag", key: "dregg_bet_placed", value: true }] }],
    },
  },
};

// ─── Ronar Sol — the deeper arc (Onderon ruins) ────────────────────────
export const CONV_RONAR_REVELATION: DialogueConversation = {
  id: "conv_ronar_revelation",
  startNodeId: "rr1",
  nodes: {
    rr1: {
      id: "rr1",
      speaker: "Ronar Sol",
      text: "[Te está esperando, y hay algo nuevo en sus ojos — miedo, o esperanza, difícil de decir.] La información que sacaste del palacio... no eran solo planes de defensa. Había un nombre en ella. El nombre de mi antigua Maestra. Está viva, {rank}. Está trabajando CON el Imperio. La mujer que me enseñó el Código está vendiendo Onderon a tus amos.",
      options: [
        { id: "rr1a", text: "Entonces es una hipócrita, como todos los Jedi. Aprovéchalo.", tone: "dark", nextNodeId: "rr2_dark", consequences: [] },
        { id: "rr1b", text: "La gente cambia en tres años. Quizás tuviera razones.", tone: "light", nextNodeId: "rr2_light", consequences: [] },
        { id: "rr1c", text: "¿Qué quieres hacer al respecto?", tone: "neutral", nextNodeId: "rr2_choice", consequences: [] },
      ],
    },
    rr2_dark: {
      id: "rr2_dark",
      speaker: "Ronar Sol",
      text: "[Algo se endurece en él.] Suenas como aquello de lo que llevo tres años escondiéndome. Y lo peor es — que no te equivocas. Ella traicionó todo. Quizás el Código siempre fue una mentira que nos contábamos para dormir.",
      options: [{ id: "rr2d_ok", text: "Ahora aprendes. Encuéntrala conmigo.", tone: "dark", nextNodeId: null, consequences: [{ type: "corruption_change", value: 4 }, { type: "set_flag", key: "ronar_revelation_seen", value: true }] }],
    },
    rr2_light: {
      id: "rr2_light",
      speaker: "Ronar Sol",
      text: "[Te mira como si no esperara misericordia de un Sith.] Razones. Quizás. Necesito oírlas de ella antes de decidir qué es. Gracias — por no hacer esto simple. Lo simple es como nos habría matado a ambos.",
      options: [{ id: "rr2l_ok", text: "Encuéntrala. Escúchala. Luego decide.", tone: "light", nextNodeId: null, consequences: [{ type: "set_flag", key: "ronar_revelation_seen", value: true }] }],
    },
    rr2_choice: {
      id: "rr2_choice",
      speaker: "Ronar Sol",
      text: "Quiero enfrentarme a ella. Necesito saber si queda algo de la mujer a la que seguí — o si debería enterrar ese recuerdo para siempre. Ven conmigo. Sea lo que sea ahora, no debería afrontarlo solo.",
      options: [{ id: "rr2c_ok", text: "Allí estaré. Terminamos esto juntos.", tone: "neutral", nextNodeId: null, consequences: [{ type: "set_flag", key: "ronar_revelation_seen", value: true }] }],
    },
  },
};

export const CONV_RONAR_CHOICE: DialogueConversation = {
  id: "conv_ronar_choice",
  startNodeId: "rc1",
  nodes: {
    rc1: {
      id: "rc1",
      speaker: "Ronar Sol",
      text: "[La confrontación ha terminado. Su Maestra yace destrozada entre vosotros, su confesión aún flotando en el aire — vendió Onderon para comprar su propia supervivencia. Las manos de Ronar tiemblan.] Está hecho. Ella está acabada. No... no sé qué soy ya. El último Jedi que conocía acaba de morir a mis pies, y no estoy seguro de ser mejor.",
      options: [
        { id: "rc1a", text: "Ahora eres libre del pasado. Recorre la senda oscura conmigo — te haré más fuerte que cualquier Jedi.", tone: "dark", nextNodeId: "rc2_fall", consequences: [{ type: "corruption_change", value: 6 }] },
        { id: "rc1b", text: "Eres mejor que ella. Dudaste. Eso no es debilidad — es lo último de la luz. Consérvalo.", tone: "light", nextNodeId: "rc2_redeem", consequences: [] },
        { id: "rc1c", text: "Lo que eres es tu elección. Siempre lo fue.", tone: "neutral", nextNodeId: "rc2_neutral", consequences: [] },
      ],
    },
    rc2_fall: {
      id: "rc2_fall",
      speaker: "Ronar Sol",
      text: "[Recoge el sable caído de ella. La hoja se enciende — y sangra del azul a un rojo enfermizo y crepitante mientras su pena se cuaja.] Entonces no queda nada que proteger. Muéstrame. Muéstrame en qué debería haberme convertido.",
      options: [{ id: "rc2f_ok", text: "Bienvenido a la oscuridad, aprendiz.", tone: "dark", nextNodeId: null, consequences: [{ type: "set_flag", key: "ronar_fallen", value: true }, { type: "add_xp", value: 200 }] }],
    },
    rc2_redeem: {
      id: "rc2_redeem",
      speaker: "Ronar Sol",
      text: "[Desactiva su sable y, despacio, lo cuelga de su cinturón en vez de desenvainarlo.] Quizás eso sea lo único que nos separa de ellos. Gracias — un Sith, precisamente, me apartó del abismo. La galaxia tiene un sentido del humor cruel. La clandestinidad de Onderon recordará lo que hiciste aquí.",
      options: [{ id: "rc2r_ok", text: "Vive, Jedi. Alguien debería.", tone: "light", nextNodeId: null, consequences: [{ type: "set_flag", key: "ronar_redeemed", value: true }, { type: "add_xp", value: 200 }, { type: "faction_rep", factionId: "hidden_jedi", value: 15 }] }],
    },
    rc2_neutral: {
      id: "rc2_neutral",
      speaker: "Ronar Sol",
      text: "[Permanece callado un largo instante.] Mi elección. Casi había olvidado que tenía una. Me la llevaré conmigo, donde quiera que vaya. Adiós, {rank}. Intenta no convertirte en lo que ella fue.",
      options: [{ id: "rc2n_ok", text: "Vete. Antes de que me replantee dejarte.", tone: "neutral", nextNodeId: null, consequences: [{ type: "set_flag", key: "ronar_departed", value: true }, { type: "add_xp", value: 200 }] }],
    },
  },
};
