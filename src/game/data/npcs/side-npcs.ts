import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";
import type { NpcDefinition } from "./korriban-npcs";

/**
 * Side-quest NPCs — characters that pay off the open threads seeded by the
 * galaxy NPCs (Talia's traitor hunt, Vaklu's jungle task, Locke's smuggler
 * ring, Zek's dock 9 rumor) and feed the side-quest chains in
 * data/quests/side-quests.ts.
 *
 * Same pattern as galaxy-npcs.ts: one-time intro guarded by a `<npc>_met`
 * flag, short repeatable follow-up, and report conversations on the original
 * quest givers unlocked via conversationRules.
 */

export const SIDE_NPCS: NpcDefinition[] = [
  {
    id: "npc_refugee_elder",
    name: "Vethra Oan",
    title: "Portavoz de los Refugiados",
    description: "Una anciana twi'lek que sacó a tres familias del avance del Triunvirato y las trajo a la única roca donde nadie las perseguiría: el fondo de Nar Shaddaa. Ahora descubre que aquí los depredadores solo cambian de cara.",
    zoneId: "nar_shaddaa_lower",
    conversationIds: ["conv_refugee_plea"],
    conversationRules: [
      { id: "conv_refugee_plea", requireFlag: "rc_found_camp", hideIfFlag: "rc_choice_made" },
    ],
  },
  {
    id: "npc_survivor_leader",
    name: "Garrek Sool",
    title: "Capataz de los Supervivientes",
    description: "Antiguo técnico del Proyecto de Restauración que se quedó cuando los créditos se acabaron y las cuadrillas se fueron. Mantiene vivo a un puñado de colonos a base de chatarra, terquedad y un rifle con más remiendos que cañón.",
    zoneId: "telos_surface",
    conversationIds: ["conv_survivor_choice"],
    conversationRules: [
      { id: "conv_survivor_choice", requireFlag: "ss_settlement_found", hideIfFlag: "ss_choice_made" },
    ],
  },
  {
    id: "npc_czerka_rep",
    name: "Director Adjunto Halex",
    title: "Czerka — Adquisiciones de Telos",
    description: "Sonrisa de catálogo, ojos de auditoría. Gestiona los intereses 'no oficiales' de Czerka bajo el Proyecto de Restauración, y sabe exactamente cuánto cuesta cada conciencia que ha comprado.",
    zoneId: "telos_citadel",
    conversationIds: ["conv_czerka_choice"],
    conversationRules: [
      { id: "conv_czerka_choice", requireFlag: "cd_czerka_mission", hideIfFlag: "cd_czerka_choice" },
    ],
  },
  {
    id: "npc_onderon_herald",
    name: "Heralda Ysane",
    title: "Voz de la Corona de Iziz",
    description: "La heralda de la Reina Talia, enviada a tomarte la medida después de que el General Vaklu te tantease. En Onderon, ningún forastero con poder pasa mucho tiempo sin que ambos bandos sepan exactamente dónde pisa.",
    zoneId: "onderon_city",
    conversationIds: ["conv_political_choice"],
    conversationRules: [
      { id: "conv_political_choice", requireFlag: "pi_met_vaklu", hideIfFlag: "pi_side_chosen" },
    ],
  },
  {
    id: "npc_oziri_sath",
    name: "Oziri Sath",
    title: "Corredor de Reputaciones",
    description: "Un agente de información al servicio de los Hutt que comercia con lo único que no se devalúa en Nar Shaddaa: lo que la galaxia sabe de ti. Ha oído de tus hazañas — todas — y cada una tiene un precio.",
    zoneId: "nar_shaddaa_cantina",
    conversationIds: ["conv_oziri"],
    conversationRules: [
      { id: "conv_oziri", hideIfFlag: "oziri_done" },
    ],
  },
  {
    id: "npc_dral_karr",
    name: "Dral Karr",
    title: "El Mandaloriano Exiliado",
    description: "Un mandaloriano que huyó cuando una gran bestia boma destrozó a sus hermanos de caza, y fue desterrado por su clan por cobardía. Vive solo en los márgenes del campamento de Dxun, buscando una forma de morir con honor — o de recuperarlo.",
    zoneId: "dxun_mando_camp",
    conversationIds: ["conv_dral_intro", "conv_dral_after"],
    conversationRules: [
      { id: "conv_dral_after", requireFlag: "dral_beast_slain", hideIfFlag: "dral_resolved" },
      { id: "conv_dral_intro", hideIfFlag: "dral_beast_slain" },
    ],
  },
  {
    id: "npc_dr_lira",
    name: "Doctora Lira Venn",
    title: "Ecóloga del Proyecto de Restauración",
    description: "Una científica del Proyecto de Restauración de Telos que documentó cómo Czerka envenena en secreto un valle recuperado para declararlo inviable y arrasarlo en busca de mineral. Los ejecutores de la corporación la cazan por lo que sabe.",
    zoneId: "telos_surface",
    conversationIds: ["conv_lira_plea", "conv_lira_after"],
    conversationRules: [
      { id: "conv_lira_after", requireFlag: "lira_evidence", hideIfFlag: "lira_resolved" },
      { id: "conv_lira_plea", hideIfFlag: "lira_evidence" },
    ],
  },
  {
    id: "npc_dama_yvane",
    name: "Dama Yvane Marr",
    title: "Matriarca de una Casa Humillada",
    description: "La anciana cabeza de la Casa Marr, antaño poderosa en la corte de Iziz, hoy hazmerreír tras ser deshonrada en pleno Salón del Trono por un rival. Tiene oro de sobra y orgullo de menos, y busca un Sith sin escrúpulos heredados.",
    zoneId: "onderon_city",
    conversationIds: ["conv_yvane_plea", "conv_yvane_after"],
    conversationRules: [
      { id: "conv_yvane_after", requireFlag: "yvane_rival_dealt", hideIfFlag: "yvane_resolved" },
      { id: "conv_yvane_plea", hideIfFlag: "yvane_rival_dealt" },
    ],
  },
  {
    id: "npc_lord_sarn",
    name: "Lord Sarn Vael",
    title: "El Rival Arrogante",
    description: "El noble que humilló a la Casa Marr ante toda la corte y compró un campeón mandaloriano con el botín. Desprecia a los Sith — hasta que uno con rango suficiente, o corrupción suficiente, le recuerda lo que es el verdadero poder.",
    zoneId: "onderon_city",
    conversationIds: ["conv_sarn_vael"],
    conversationRules: [
      { id: "conv_sarn_vael", requireFlag: "yvane_met", hideIfFlag: "yvane_rival_dealt" },
    ],
  },
  {
    id: "npc_tessa_roan",
    name: "Tessa Roan",
    title: "Madre Endeudada",
    description: "Una estibadora de los muelles bajos de Nar Shaddaa cuya hija de nueve años fue tomada por el Intercambio como aval de una deuda imposible. Al amanecer la subirán a un carguero de esclavos rumbo al Borde Exterior.",
    zoneId: "nar_shaddaa_lower",
    conversationIds: ["conv_tessa_plea", "conv_tessa_after"],
    conversationRules: [
      { id: "conv_tessa_after", requireFlag: "tessa_daughter_freed", hideIfFlag: "tessa_resolved" },
      { id: "conv_tessa_plea", hideIfFlag: "tessa_daughter_freed" },
    ],
  },
  {
    id: "npc_slaver_vross",
    name: "Vross",
    title: "Corredor del Intercambio",
    description: "Un weequay de sonrisa torcida y un datapad lleno de vidas ajenas. Compra y vende deudas — y a la gente que no puede pagarlas. Tiene a la niña Roan en una jaula de transporte.",
    zoneId: "nar_shaddaa_lower",
    conversationIds: ["conv_slaver_vross"],
    conversationRules: [
      { id: "conv_slaver_vross", requireFlag: "tessa_met", hideIfFlag: "tessa_daughter_freed" },
    ],
  },
  {
    id: "npc_sergeant_korso",
    name: "Sargento Brel Korso",
    title: "Desertor del 4º de Fusileros de Kaas",
    description: "Único superviviente de una escuadra imperial enviada a la selva del Templo Oscuro como cebo para un ritual sith. Caza al círculo del culto que llevó a sus hombres al matadero, con un rifle viejo y nada que perder.",
    zoneId: "dromund_kaas_jungle",
    conversationIds: ["conv_korso_intro", "conv_korso_after"],
    conversationRules: [
      { id: "conv_korso_after", requireFlag: "korso_cult_killed", hideIfFlag: "korso_resolved" },
      { id: "conv_korso_intro", hideIfFlag: "korso_cult_killed" },
    ],
  },
  {
    id: "npc_sera_vant",
    name: "Sera Vant",
    title: "Hermana de un Acólito Caído",
    description: "Una joven de ojos secos de tanto llorar que limpia mesas en Dreshdae para pagarse el pasaje fuera de Korriban. Su hermano Joren entró en la Academia hace un año. Le devolvieron una urna y una mentira.",
    zoneId: "korriban_dreshdae",
    conversationIds: ["conv_sera_plea", "conv_sera_after"],
    conversationRules: [
      { id: "conv_sera_after", requireFlag: "sera_truth_found", hideIfFlag: "sera_resolved" },
      { id: "conv_sera_plea", hideIfFlag: "sera_truth_found" },
    ],
  },
  {
    id: "npc_crystal_heart",
    name: "El Corazón de Cristal",
    title: "Presencia en la Fuerza",
    description: "No es una persona, sino una voluntad: el inmenso kyber que late en la cámara más honda de la cueva, lo bastante puro como para curvar la Fuerza — y lo bastante despierto como para devolverte la mirada.",
    zoneId: "dantooine_crystal_cave",
    conversationIds: ["conv_crystal_choice"],
    conversationRules: [
      { id: "conv_crystal_choice", requireFlag: "ch_found_crystal", hideIfFlag: "ch_crystal_choice" },
    ],
  },
  {
    id: "npc_castellan_dree",
    name: "Castellano Maron Dree",
    title: "Guardián de la Casa Real",
    description: "El senescal de cabello gris del palacio. Ha sobrevivido a cuatro monarcas fijándose en todo y diciendo casi nada.",
    zoneId: "onderon_palace",
    conversationIds: ["conv_dree_suspects", "conv_dree_followup"],
    conversationRules: [
      { id: "conv_dree_suspects", requireFlag: "talia_traitor_hunt", hideIfFlag: "talia_traitor_named" },
      { id: "conv_dree_followup", requireFlag: "talia_traitor_named" },
    ],
  },
  {
    id: "npc_scout_kessa",
    name: "Sargento Kessa",
    title: "Última Exploradora de la Tercera Patrulla",
    description: "Una exploradora onderoniana con el brazo entablillado y una mirada perdida en el infinito. Su campamento está destrozado; su escuadrón no va a volver.",
    zoneId: "dxun_jungle",
    conversationIds: ["conv_kessa_survivor", "conv_kessa_followup"],
    conversationRules: [
      { id: "conv_kessa_survivor", hideIfFlag: "kessa_met" },
      { id: "conv_kessa_followup", requireFlag: "kessa_met" },
    ],
  },
  {
    id: "npc_dockhand_renn",
    name: "Renn",
    title: "Estibador, Módulo 4",
    description: "Un estibador enjuto cuyos ojos no dejan de saltar a las cámaras de seguridad. Suda incluso bajo el control climático de la estación.",
    zoneId: "telos_citadel",
    conversationIds: ["conv_renn_nervous", "conv_renn_followup"],
    conversationRules: [
      { id: "conv_renn_nervous", requireFlag: "locke_smuggler_task", hideIfFlag: "telos_ring_lead" },
      { id: "conv_renn_followup", requireFlag: "telos_ring_lead" },
    ],
  },
  {
    id: "npc_dockmaster_kull",
    name: "Kull",
    title: "Jefe de Muelle Filósofo",
    description: "Un jefe de muelle gamorreano que cita meditaciones entre manifiestos de carga. Mira dice que sus consejos han salvado más vidas que cualquier médico de la luna.",
    zoneId: "nar_shaddaa_promenade",
    conversationIds: ["conv_kull_docks", "conv_kull_followup"],
    conversationRules: [
      { id: "conv_kull_docks", hideIfFlag: "kull_met" },
      { id: "conv_kull_followup", requireFlag: "kull_met" },
    ],
  },
  {
    id: "npc_dreshdae_senna",
    name: "Senna Vael",
    title: "Acólita Fracasada",
    description: "Falló las pruebas de la Academia y fue arrojada a Dreshdae sin nada. Ahora un préstamo de Czerka que pidió para sobrevivir ha vencido — con un interés que solo la sangre puede pagar.",
    zoneId: "korriban_dreshdae",
    conversationIds: ["conv_senna_plea", "conv_senna_after"],
    conversationRules: [
      { id: "conv_senna_plea", hideIfFlag: "dreshdae_debt_resolved" },
      { id: "conv_senna_after", requireFlag: "dreshdae_debt_resolved" },
    ],
  },
  {
    id: "npc_servitor_koro",
    name: "Koro",
    title: "Sirviente de la Academia",
    description: "Un sirviente twi'lek que ha fregado sangre de las ranuras de la Academia desde antes de que la actual Supervisora respirara. Sobrevive leyendo a los poderosos e inclinándose primero.",
    zoneId: "korriban_academy_interior",
    conversationIds: ["conv_koro_intro", "conv_koro_lord"],
    conversationRules: [
      { id: "conv_koro_lord", requireFlag: "sith_rank_3" },
      { id: "conv_koro_intro" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Onderon — the traitor hunt (quest_onderon_knife)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_DREE_SUSPECTS: DialogueConversation = {
  id: "conv_dree_suspects",
  startNodeId: "d1",
  nodes: {
    d1: {
      id: "d1",
      speaker: "Castellano Dree",
      text: "Así que Su Majestad ha contratado una hoja de fuera. Bien — el servicio de la casa chismorrea como ruiseñores y todos los ministros poseen ruiseñores. Tres nombres tenían acceso a las rutas de patrulla filtradas: el ministro Sevro de Comercio, la ministra Halla del Granero, y el viejo mariscal Tovik. Pregúntame lo que quieras. Me fijo en todo. Es mi único talento y toda mi personalidad.",
      options: [
        { id: "d1a", text: "¿Quién se beneficia si fallan las patrullas de Onderon?", consequences: [], nextNodeId: "d2_profit" },
        { id: "d1b", text: "[Fuerza 8] Quédate quieto. La Fuerza recuerda el miedo mejor que los rostros.", check: { type: "force", value: 8 }, checkLabel: "[Fuerza 8]", consequences: [{ type: "add_xp", value: 80 }], nextNodeId: "d2_force" },
        { id: "d1c", text: "[Influencia 8] Ya sabes quién es, Castellano. Dilo.", check: { type: "influence", value: 8 }, checkLabel: "[Influencia 8]", consequences: [{ type: "add_xp", value: 80 }], nextNodeId: "d2_knows" },
      ],
    },
    d2_profit: {
      id: "d2_profit",
      speaker: "Castellano Dree",
      text: "Los graneros de Halla alimentan al ejército — la guerra la enriquece de un modo u otro. Tovik comandó las rutas durante veinte años; filtrarlas mancharía su propio legado. Pero Sevro... los libros de comercio de Sevro muestran tres envíos a Dxun pagados por una compañía que no existe. Lo comprobé. Dos veces. Siempre compruebo dos veces.",
      options: [
        { id: "d2p_name", text: "Compañías fantasma, lealtad fantasma. Es Sevro.", consequences: [{ type: "set_flag", key: "talia_traitor_named", value: true }, { type: "add_xp", value: 120 }], nextNodeId: "d3_named" },
        { id: "d2p_more", text: "Los libros se pueden falsificar. Sigue escarbando, Castellano.", consequences: [], nextNodeId: "d2_force" },
      ],
    },
    d2_force: {
      id: "d2_force",
      speaker: "Castellano Dree",
      text: "*Dejas que el lado oscuro flote por la sala como aire frío. El pulso de Dree no se altera — pero en su memoria lo saboreas: el ministro Sevro, sudando en un pasillo, entregando a un mensajero un cilindro-ruta sellado con la marca real rota.* ...Te has quedado muy callado, Sith. Has visto algo. Resulta que no quiero saber cómo.",
      options: [
        { id: "d2f_name", text: "Sevro. Lo vi como si hubiera estado a su lado.", consequences: [{ type: "set_flag", key: "talia_traitor_named", value: true }, { type: "add_xp", value: 150 }], nextNodeId: "d3_named" },
      ],
    },
    d2_knows: {
      id: "d2_knows",
      speaker: "Castellano Dree",
      text: "*Una larga pausa. Limpia sus lentes.* Cuarenta años de servicio me han enseñado que el conocimiento dicho demasiado pronto hace que cuelguen a los castellanos. Pero sí. Sevro. Las deudas del ministro de Comercio se esfumaron la misma semana en que nuestras patrullas empezaron a morir. Nunca pude probarlo. Tú, sospecho, no cargas con la necesidad de pruebas.",
      options: [
        { id: "d2k_name", text: "La prueba es problema de la Reina. El nombre basta.", consequences: [{ type: "set_flag", key: "talia_traitor_named", value: true }, { type: "add_xp", value: 120 }], nextNodeId: "d3_named" },
      ],
    },
    d3_named: {
      id: "d3_named",
      speaker: "Castellano Dree",
      text: "Entonces está hecho, y permíteme declarar formalmente que no te dije nada, no te enseñé nada, y estaba en otra parte en ese momento. Su Majestad aguarda tu informe en la sala del trono. Yo me las apañaré para estar puliendo la cubertería en el extremo opuesto del palacio.",
      options: [{ id: "d3_end", text: "Sabio como siempre, Castellano.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_DREE_FOLLOWUP: DialogueConversation = {
  id: "conv_dree_followup",
  startNodeId: "df1",
  nodes: {
    df1: {
      id: "df1",
      speaker: "Castellano Dree",
      text: "El palacio respira más tranquilo, Sith — aunque oficialmente, por supuesto, nunca pasó nada y nadie fue jamás un traidor. Oficialmente todos somos muy leales y siempre lo hemos sido. ¿Más té?",
      options: [{ id: "df1a", text: "Sigue fijándote en todo, Dree.", consequences: [], nextNodeId: null }],
    },
  },
};

/** Verdict scene on Queen Talia — wired into her conversationRules in galaxy-npcs.ts. */
export const CONV_TALIA_VERDICT: DialogueConversation = {
  id: "conv_talia_verdict",
  startNodeId: "tv1",
  nodes: {
    tv1: {
      id: "tv1",
      speaker: "Reina Talia",
      text: "Tienes el aspecto de quien carga con un nombre. Pronúncialo, Sith, y pronúncialo en voz baja — las paredes de esta sala tienen oídos, y al parecer algunos de ellos están en mi nómina.",
      options: [
        { id: "tv1a", text: "El ministro Sevro. Compañías fantasma, sellos de ruta rotos, deudas esfumadas.", consequences: [], nextNodeId: "tv2" },
      ],
    },
    tv2: {
      id: "tv2",
      speaker: "Reina Talia",
      text: "*Su rostro no cambia. Las reinas lo aprenden pronto.* Sevro cenó en mi mesa anoche. Brindó por los caídos en las patrullas. ...Muy bien. La cuestión pasa a ser cómo debería ser la justicia de Onderon — y cuánta de ella puedo permitirme dejar que tú impartas.",
      options: [
        { id: "tv2_law", text: "Arréstalo en público. Que Onderon vea que su ley aún funciona.", consequences: [{ type: "set_flag", key: "talia_traitor_resolved", value: true }, { type: "faction_rep", factionId: "smuggler_guild", value: -3 }, { type: "add_xp", value: 150 }], nextNodeId: "tv3_law", tone: "light" },
        { id: "tv2_dark", text: "A los ministros les ocurren accidentes. Permíteme organizar uno.", consequences: [{ type: "set_flag", key: "talia_traitor_resolved", value: true }, { type: "corruption_change", value: 2 }, { type: "add_xp", value: 150 }], nextNodeId: "tv3_dark", tone: "dark" },
        { id: "tv2_lever", text: "[Influencia 9] No lo elimines. Adueñate de él. Un traidor con correa es un arma.", check: { type: "influence", value: 9 }, checkLabel: "[Influencia 9]", consequences: [{ type: "set_flag", key: "talia_traitor_resolved", value: true }, { type: "set_flag", key: "talia_leashed_sevro", value: true }, { type: "add_xp", value: 200 }], nextNodeId: "tv3_lever", tone: "deceptive" },
      ],
    },
    tv3_law: {
      id: "tv3_law",
      speaker: "Reina Talia",
      text: "Sí. Un juicio, a plena vista, con las pruebas leídas en voz alta — que quienquiera que compró a Sevro vea arder su inversión a la luz del día. Podrías haberme ofrecido un cuchillo, Sith, y en su lugar me ofreciste un tribunal. No olvidaré cuál.",
      options: [{ id: "tv3l_end", text: "La justicia es solo estrategia con mejor iluminación, Majestad.", consequences: [], nextNodeId: null }],
    },
    tv3_dark: {
      id: "tv3_dark",
      speaker: "Reina Talia",
      text: "...Una caída desde las pasarelas del granero, quizás. Los ministros inspeccionan graneros. Las pasarelas fallan. *Se mira las manos un instante.* Arte de gobernar, otra vez. Hazlo limpio, y la corona de Onderon recordará su deuda con un Sith — en monedas, y en silencio.",
      options: [{ id: "tv3d_end", text: "Inspeccionará su último granero esta semana.", consequences: [], nextNodeId: null, tone: "dark" }],
    },
    tv3_lever: {
      id: "tv3_lever",
      speaker: "Reina Talia",
      text: "*Por primera vez desde que la conociste, la Reina sonríe como una Sith.* Aliméntalo con rutas falsas. Rastrea su cadena de mensajeros. Encuentra quién sostiene su correa y sostén la suya. ...Habrías sido una ministra aterradora, ¿sabes? El puesto aún podría quedar vacante — la agenda de Sevro está a punto de llenarse considerablemente.",
      options: [{ id: "tv3v_end", text: "Prefiero el trabajo autónomo, Majestad. Pero aceptaré el anticipo.", consequences: [{ type: "add_credits", value: 200 }], nextNodeId: null }],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Dxun — what stirs the nests (quest_dxun_nests)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_KESSA_SURVIVOR: DialogueConversation = {
  id: "conv_kessa_survivor",
  startNodeId: "k1",
  nodes: {
    k1: {
      id: "k1",
      speaker: "Sargento Kessa",
      text: "*Una exploradora se sienta apoyada en un deslizador destrozado, la hoja sobre las rodillas, el brazo en una férula de campaña.* Mantén las manos donde pueda verlas. ...Sith. Cómo no. La semana no podía empeorar, así que se volvió más extraña. La Tercera Patrulla ya no está — los drexl se los llevaron en la oscuridad. No cazando. Arreando. Algo detrás de los nidos los empuja hacia la ciudad y soy la única que queda que ha visto el patrón.",
      options: [
        { id: "k1a", text: "Vaklu me envía. Muéstrame el patrón.", consequences: [], nextNodeId: "k2_pattern" },
        { id: "k1b", text: "[Agilidad 8] ¿Arreando? Las bestias no arrean. Guíame por las huellas.", check: { type: "agility", value: 8 }, checkLabel: "[Agilidad 8]", consequences: [{ type: "add_xp", value: 60 }], nextNodeId: "k2_tracks" },
        { id: "k1c", text: "La única superviviente. Qué conveniente para ti.", consequences: [{ type: "corruption_change", value: 1 }], nextNodeId: "k2_accused", tone: "dark" },
      ],
    },
    k2_pattern: {
      id: "k2_pattern",
      speaker: "Sargento Kessa",
      text: "Cada vector de ataque se remonta a los nidos de la cría junto al viejo cauce — y más allá, hacia la cresta de la tumba. Los drexl no anidan tan cerca de la tumba. Jamás. Los están expulsando de su propio terreno y nosotros somos aquello hacia lo que los exprimen. Diezma la cría en el cauce y verás a qué me refiero. El mapa está marcado.",
      onEnter: [{ type: "set_flag", key: "kessa_met", value: true }, { type: "set_flag", key: "dxun_nest_route", value: true }, { type: "add_xp", value: 80 }],
      options: [
        { id: "k2p_go", text: "Cauce. Cría. Diezmar. Entendido.", consequences: [], nextNodeId: "k3_warning" },
      ],
    },
    k2_tracks: {
      id: "k2_tracks",
      speaker: "Sargento Kessa",
      text: "*Te observa leer el suelo revuelto y sus hombros bajan medio centímetro — la primera confianza que muestra hacia nada en días.* Tú también lo ves. Huellas de huida solapando huellas de carga, todas apuntando en la misma dirección, como agua buscando un desagüe. El desagüe es Iziz. El origen es la cresta de la tumba. Diezma la cría del cauce y se abrirá la senda hacia lo que sea que hace esto. El mapa está marcado, Sith.",
      onEnter: [{ type: "set_flag", key: "kessa_met", value: true }, { type: "set_flag", key: "dxun_nest_route", value: true }, { type: "add_xp", value: 100 }],
      options: [
        { id: "k2t_go", text: "Mantente con vida hasta que vuelva, Sargento.", consequences: [], nextNodeId: "k3_warning" },
      ],
    },
    k2_accused: {
      id: "k2_accused",
      speaker: "Sargento Kessa",
      text: "*No se inmuta. Solo se baja el cuello: cuatro cicatrices paralelas, recientes, del hombro a las costillas.* Conveniente. Claro. Me arrastré de debajo del cuerpo del cabo Venn y su sangre mantuvo a las larvas lejos de mi olor. ¿Quieres el patrón o quieres seguir insultando al único mapa que tienes?",
      onEnter: [{ type: "set_flag", key: "kessa_met", value: true }, { type: "set_flag", key: "dxun_nest_route", value: true }, { type: "add_xp", value: 60 }],
      options: [
        { id: "k2a_go", text: "...El patrón. Habla.", consequences: [], nextNodeId: "k2_pattern_repeat" },
      ],
    },
    k2_pattern_repeat: {
      id: "k2_pattern_repeat",
      speaker: "Sargento Kessa",
      text: "Nidos de cría en el viejo cauce. Tras ellos, la cresta de la tumba. A los drexl los expulsan de su terreno hacia Iziz. Diezma la cría, sigue lo que quede, halla el origen. Esa es la misión por la que tu General te paga.",
      options: [{ id: "k2r_go", text: "Entonces tengo bestias que matar.", consequences: [], nextNodeId: null }],
    },
    k3_warning: {
      id: "k3_warning",
      speaker: "Sargento Kessa",
      text: "Una cosa más. Cuando te acerques a la cresta — si la jungla queda en silencio, *sal del descampado.* Así empezó para nosotros. El silencio es lo último de lo que Venn se quejó. Llévate los estimulantes de mi escuadrón; ya no los necesitan.",
      onEnter: [{ type: "add_item", itemId: "mando_combat_stim", value: 1 }],
      options: [{ id: "k3_end", text: "Haré que el silencio lo lamente.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_KESSA_FOLLOWUP: DialogueConversation = {
  id: "conv_kessa_followup",
  startNodeId: "kf1",
  nodes: {
    kf1: {
      id: "kf1",
      speaker: "Sargento Kessa",
      text: "¿Sigues respirando, Sith? Bien. La jungla está más tranquila desde que pasaste por el cauce — del mal tipo de silencio o del bueno, sinceramente ya no sé distinguirlo. Repórtate ante Vaklu cuando tengas el cuadro completo. Ese paga sus deudas.",
      options: [{ id: "kf1a", text: "Mantén esta posición, Sargento.", consequences: [], nextNodeId: null }],
    },
  },
};

/** Report scene on General Vaklu — wired into his conversationRules in galaxy-npcs.ts. */
export const CONV_VAKLU_REPORT: DialogueConversation = {
  id: "conv_vaklu_report",
  startNodeId: "vk1",
  nodes: {
    vk1: {
      id: "vk1",
      speaker: "General Vaklu",
      text: "Has vuelto, y las incursiones de drexl cayeron a cero en dos días. O eres muy bueno o muy afortunado, y a mí nunca jamás me ha salvado la suerte. Informa, Sith. ¿Qué hay ahí fuera?",
      options: [
        { id: "vk1a", text: "Algo en la cresta de la tumba está sangrando resonancia del lado oscuro. Expulsaba a las bestias de su terreno — directas hacia tus murallas.", consequences: [], nextNodeId: "vk2" },
      ],
    },
    vk2: {
      id: "vk2",
      speaker: "General Vaklu",
      text: "La tumba de un Sith muerto asustando a bestias vivas hacia mi ciudad. Treinta años en estas murallas y la galaxia aún encuentra formas nuevas de ser insultante. *Abre el arcón de la armería tras él.* Tú hiciste el trabajo, te llevas la tarifa. Y Sith — cuando lo que sea que hay en esa cresta acabe arrastrándose afuera, Onderon recordará quién caminó hacia ello mientras mis exploradores huían.",
      onEnter: [{ type: "set_flag", key: "vaklu_jungle_done", value: true }, { type: "add_xp", value: 150 }],
      options: [
        { id: "vk2_end", text: "Mantén las murallas en pie, General. Yo me ocupo de la cresta.", consequences: [], nextNodeId: null },
        { id: "vk2_dark", text: "Recuérdalo en créditos. El sentimentalismo no se gasta.", consequences: [{ type: "add_credits", value: 150 }, { type: "corruption_change", value: 1 }], nextNodeId: null, tone: "dark" },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Telos — quiet cargo (quest_telos_quiet_cargo)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_RENN_NERVOUS: DialogueConversation = {
  id: "conv_renn_nervous",
  startNodeId: "r1",
  nodes: {
    r1: {
      id: "r1",
      speaker: "Renn",
      text: "*El estibador casi deja caer su tableta de manifiestos cuando tu sombra la cruza.* Yo— estamos cerrados. Quiero decir, el muelle está abierto, los muelles no cierran, pero yo personalmente estoy cerrado. ¿Había... carga? Tienes pinta de alguien con carga. O de alguien que convierte a la gente EN carga. Voy a dejar de hablar ahora.",
      options: [
        { id: "r1a", text: "[Influencia 7] Respira, Renn. Solo quiero la red que estás encubriendo.", check: { type: "influence", value: 7 }, checkLabel: "[Influencia 7]", consequences: [{ type: "add_xp", value: 80 }], nextNodeId: "r2_soft" },
        { id: "r1b", text: "Las armas que se mueven por el módulo residencial. ¿Dónde está el alijo?", consequences: [], nextNodeId: "r2_direct" },
        { id: "r1c", text: "Agárralo por el cuello. (Intimidar)", consequences: [{ type: "corruption_change", value: 1 }], nextNodeId: "r2_fear", tone: "aggressive" },
      ],
    },
    r2_soft: {
      id: "r2_soft",
      speaker: "Renn",
      text: "*Sus hombros se hunden con algo parecido al alivio.* Dijeron que espaciarían a mi hermano si hablaba. Pero tú no eres seguridad de la estación, ¿verdad? — eres aquello con lo que la seguridad de la estación tiene pesadillas. Almacén del subnivel, módulo residencial cuatro, tras un mamparo de kolto falso. El código de turno es el cumpleaños de mi hermano. 4-4-1-2. Por favor... cuando entres ahí, haz que parezca que nunca estuve involucrado.",
      onEnter: [{ type: "set_flag", key: "telos_ring_lead", value: true }, { type: "add_xp", value: 80 }],
      options: [{ id: "r2s_end", text: "Nunca estuviste aquí. Yo tampoco.", consequences: [], nextNodeId: null }],
    },
    r2_direct: {
      id: "r2_direct",
      speaker: "Renn",
      text: "¿Alijo? ¿Qué alijo? No hay nin— *Tu mirada continúa. Su resistencia dura cuatro segundos enteros.* ...Subnivel del módulo cuatro, mamparo de kolto falso, código 4-4-1-2. Quiero que conste que aguanté más que nadie.",
      onEnter: [{ type: "set_flag", key: "telos_ring_lead", value: true }, { type: "add_xp", value: 60 }],
      options: [{ id: "r2d_end", text: "Debidamente anotado. Cuatro segundos enteros.", consequences: [], nextNodeId: null }],
    },
    r2_fear: {
      id: "r2_fear",
      speaker: "Renn",
      text: "¡SUBNIVEL DEL MÓDULO CUATRO MAMPARO DE KOLTO FALSO CÓDIGO 4-4-1-2! *jadeo* Me pagan cincuenta créditos por turno por mirar a otro lado, eso es todo, ¡ese es todo mi crimen, cincuenta créditos y ansiedad crónica!",
      onEnter: [{ type: "set_flag", key: "telos_ring_lead", value: true }, { type: "add_xp", value: 50 }],
      options: [{ id: "r2f_end", text: "Suéltalo. Tienes un mamparo que visitar.", consequences: [], nextNodeId: null, tone: "dark" }],
    },
  },
};

export const CONV_RENN_FOLLOWUP: DialogueConversation = {
  id: "conv_renn_followup",
  startNodeId: "rf1",
  nodes: {
    rf1: {
      id: "rf1",
      speaker: "Renn",
      text: "*Renn finge con todas sus fuerzas estar leyendo su tableta de manifiestos del revés.* No te conozco. No me conoces. Esta es la relación más sana que tengo en esta estación.",
      options: [{ id: "rf1a", text: "Que siga así, Renn.", consequences: [], nextNodeId: null }],
    },
  },
};

/** Report scene on Commander Locke — wired into her conversationRules in galaxy-npcs.ts. */
export const CONV_LOCKE_REPORT: DialogueConversation = {
  id: "conv_locke_report",
  startNodeId: "lr1",
  nodes: {
    lr1: {
      id: "lr1",
      speaker: "Comandante Locke",
      text: "Mis sensores registraron disparos en el módulo residencial cuatro, seguidos de — y cito a mi oficial de guardia — 'toda la tripulación vossk solicitando arresto para su propia protección'. Eso tiene tus huellas, Sith. Informa.",
      options: [
        { id: "lr1a", text: "La red está rota. Alijo incautado, matones persuadidos, mamparo redecorado.", consequences: [], nextNodeId: "lr2" },
      ],
    },
    lr2: {
      id: "lr2",
      speaker: "Comandante Locke",
      text: "Cuarenta mil civiles duermen mejor esta noche y exactamente uno de ellos sabe por qué. *Desliza un vale de créditos por el escritorio.* El fondo discrecional, como prometí — y la amnesia de la estación sobre tu expediente es ahora total y permanente. Diría 'no me hagas lamentar esto', pero ¿sinceramente? El mejor contratista que he tenido. No se lo digas a los contratistas.",
      onEnter: [{ type: "set_flag", key: "locke_ring_reported", value: true }, { type: "add_xp", value: 150 }],
      options: [
        { id: "lr2_end", text: "Un placer hacer negocios con la ley, Comandante.", consequences: [], nextNodeId: null },
        { id: "lr2_light", text: "Usa los créditos sobrantes del alijo en el módulo de refugiados. Llámalo blanqueo.", consequences: [{ type: "faction_rep", factionId: "hidden_jedi", value: 5 }, { type: "add_xp", value: 50 }], nextNodeId: null, tone: "light" },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Nar Shaddaa — the humming crates & the Collector (quest_dock9, quest_collector_trail)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_KULL_DOCKS: DialogueConversation = {
  id: "conv_kull_docks",
  startNodeId: "ku1",
  nodes: {
    ku1: {
      id: "ku1",
      speaker: "Kull",
      text: "*El jefe de muelle gamorreano sella un manifiesto sin levantar la vista.* Hmpf. Pasos pesados, conciencia ligera — un tenebroso. Siéntate. Kull lleva cuarenta años cargando carga y ha aprendido una cosa: todo en la galaxia es flete. Rencores, secretos, destinos. La única pregunta es quién paga el transporte. ¿Qué flete cargas tú, Sith?",
      options: [
        { id: "ku1a", text: "Mira, en la cantina, dice que tus consejos salvan vidas.", consequences: [], nextNodeId: "ku2_mira" },
        { id: "ku1b", text: "[Bandera] He oído que el muelle 9 tiene cajas que zumban de noche.", check: { type: "flag", flagKey: "rumor_dock9" }, checkLabel: "[Rumor: Muelle 9]", consequences: [], nextNodeId: "ku2_dock9" },
        { id: "ku1c", text: "Filosofía de un gamorreano. La luna está llena de sorpresas.", consequences: [], nextNodeId: "ku2_phil" },
      ],
    },
    ku2_mira: {
      id: "ku2_mira",
      speaker: "Kull",
      text: "Mira exagera. Kull solo le dice a la gente en qué naves no embarcar. Las naves te lo dicen ellas mismas, si escuchas — una tripulación que no te mira a los ojos es un manifiesto lleno de mentiras. *Por fin levanta la vista.* Tus ojos se cruzan con todo. Eso es más raro de lo que crees, y más peligroso.",
      onEnter: [{ type: "set_flag", key: "kull_met", value: true }, { type: "add_xp", value: 60 }],
      options: [
        { id: "ku2m_dock", text: "Entonces escucha esto: muelle 9. Cajas que zumban. ¿Qué sabes?", check: { type: "flag", flagKey: "rumor_dock9" }, checkLabel: "[Rumor: Muelle 9]", consequences: [], nextNodeId: "ku2_dock9" },
        { id: "ku2m_end", text: "Sigue escuchando a las naves, jefe de muelle.", consequences: [], nextNodeId: null },
      ],
    },
    ku2_phil: {
      id: "ku2_phil",
      speaker: "Kull",
      text: "Todos se sorprenden. A los gamorreanos se les contrata por la fuerza bruta, así que fuerza bruta es lo único que cualquiera ve. Hace cuarenta años Kull decidió ser contratado por la fuerza y COBRAR por fijarse. *se da golpecitos en el cráneo* Dos salarios, un trabajo. Ahora — ¿querías algo, o solo la novedad?",
      onEnter: [{ type: "set_flag", key: "kull_met", value: true }, { type: "add_xp", value: 40 }],
      options: [
        { id: "ku2p_dock", text: "Muelle 9. Las cajas que zumban. Quiero entrar.", check: { type: "flag", flagKey: "rumor_dock9" }, checkLabel: "[Rumor: Muelle 9]", consequences: [], nextNodeId: "ku2_dock9" },
        { id: "ku2p_end", text: "Solo la novedad. Continúa, Kull.", consequences: [], nextNodeId: null },
      ],
    },
    ku2_dock9: {
      id: "ku2_dock9",
      speaker: "Kull",
      text: "*El sello se detiene en el aire.* Así que tú también lo oíste. Kull ha movido flete toda su vida. Las piezas de motor no zumban, no susurran, y no hacen que los droides de carga rodeen su propio almacén. Los matones del Intercambio lo custodian de noche — demasiados matones para piezas de motor. *Desliza un pase de muelle por el escritorio.* Puerta 9, acceso de mantenimiento. Kull no vio nada. Kull selló manifiestos toda la noche.",
      onEnter: [{ type: "set_flag", key: "kull_met", value: true }, { type: "set_flag", key: "dock9_access", value: true }, { type: "add_xp", value: 100 }],
      options: [
        { id: "ku2d_end", text: "Sellaste de maravilla, jefe de muelle.", consequences: [], nextNodeId: null },
        { id: "ku2d_why", text: "¿Por qué ayudar a un Sith, Kull?", consequences: [], nextNodeId: "ku3_why" },
      ],
    },
    ku3_why: {
      id: "ku3_why",
      speaker: "Kull",
      text: "Porque lo que sea que zumba en esas cajas fue desenterrado de alguna tumba, y las tumbas envían su flete con la tarifa aún pendiente. Kull prefiere que la factura llegue a TU puerta antes que a sus muelles. Filosofía, Sith: siempre sabe a nombre de quién está la factura.",
      options: [{ id: "ku3_end", text: "La factura es mía ahora. Con gusto.", consequences: [], nextNodeId: null, tone: "dark" }],
    },
  },
};

export const CONV_KULL_FOLLOWUP: DialogueConversation = {
  id: "conv_kull_followup",
  startNodeId: "kuf1",
  nodes: {
    kuf1: {
      id: "kuf1",
      speaker: "Kull",
      text: "*sello* El Sith regresa. *sello* Los muelles están más tranquilos desde lo del muelle 9 — flete más callado, rumores más ruidosos. *sello* Kull encuentra este intercambio aceptable.",
      options: [{ id: "kuf1a", text: "Sigue sellando, filósofo.", consequences: [], nextNodeId: null }],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Korriban — A Matter of Debt (quest_dreshdae_debt)
// A self-contained moral choice in Dreshdae: mercy, profit, or empowerment.
// ═══════════════════════════════════════════════════════════════════════

export const CONV_SENNA_PLEA: DialogueConversation = {
  id: "conv_senna_plea",
  startNodeId: "se1",
  nodes: {
    se1: {
      id: "se1",
      speaker: "Senna Vael",
      text: "Llevas la marca de la Academia. Yo también la llevé, por un tiempo. Luego fallé la tercera prueba y me arrojaron a Dreshdae como carne podrida. Pedí un préstamo a Czerka para comer. Ahora su cobrador llega al anochecer, y el interés se paga en dedos. Por favor — eres el primer Sith que siquiera me ha mirado.",
      options: [
        { id: "se1a", text: "Dime exactamente cuánto debes.", tone: "neutral", consequences: [], nextNodeId: "se2_offer" },
        { id: "se1b", text: "Los mendigos eligieron el arroyo. No es mi problema.", tone: "dark", consequences: [], nextNodeId: null },
      ],
    },
    se2_offer: {
      id: "se2_offer",
      speaker: "Senna Vael",
      text: "Cuatrocientos créditos y olvidarán mi nombre. No tengo cuatro. No tengo uno. Sé lo que estoy pidiendo — no tengo nada que ofrecer salvo ser consciente de ello. Decidas lo que decidas, decídelo antes del anochecer.",
      onEnter: [{ type: "set_flag", key: "dreshdae_debt_taken", value: true }],
      options: [
        {
          id: "se2_pay",
          text: "Toma. Cuatrocientos créditos. Págalos y desaparece.",
          tone: "light",
          consequences: [
            { type: "add_credits", value: -400 },
            { type: "faction_rep", factionId: "smuggler_guild", value: 8 },
            { type: "set_flag", key: "dreshdae_paid", value: true },
            { type: "set_flag", key: "dreshdae_debt_resolved", value: true },
          ],
          nextNodeId: "se_paid",
        },
        {
          id: "se2_betray",
          text: "[Oscuro] Hay una recompensa por los morosos. La cobraré yo mismo.",
          tone: "dark",
          consequences: [
            { type: "add_credits", value: 500 },
            { type: "corruption_change", value: 6 },
            { type: "faction_rep", factionId: "sith_academy", value: 4 },
            { type: "set_flag", key: "dreshdae_betrayed", value: true },
            { type: "set_flag", key: "dreshdae_debt_resolved", value: true },
          ],
          nextNodeId: "se_betray",
        },
        {
          id: "se2_teach",
          text: "[Fuerza 6] Los créditos se acaban. El poder no. Levántate — te enseñaré a hacer que te teman.",
          check: { type: "force", value: 6 },
          checkLabel: "[Fuerza 6]",
          tone: "neutral",
          consequences: [
            { type: "add_xp", value: 150 },
            { type: "faction_rep", factionId: "smuggler_guild", value: 4 },
            { type: "set_flag", key: "dreshdae_taught", value: true },
            { type: "set_flag", key: "dreshdae_debt_resolved", value: true },
          ],
          nextNodeId: "se_taught",
        },
        { id: "se2_leave", text: "Me lo pensaré. (Decidir más tarde)", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    se_paid: {
      id: "se_paid",
      speaker: "Senna Vael",
      text: "[Mira los créditos como si fueran a morderle.] No lo olvidaré. Hay una clínica en el puerto espacial que me debe un favor — toma esto, me mantuvieron con vida más de una vez. Si alguna vez vuelvo a levantarme de algo, será por lo de esta noche.",
      options: [{ id: "se_paid_end", text: "Gástalo en un billete de nave, no en otro préstamo.", consequences: [], nextNodeId: null }],
    },
    se_betray: {
      id: "se_betray",
      speaker: "Senna Vael",
      text: "[Los hombres del cobrador ya están en la puerta. No grita. Solo te mira como los fracasados siempre miran a los elegidos — como si no esperara otra cosa.] ...Claro. Claro que eres tú.",
      options: [{ id: "se_betray_end", text: "Korriban no tiene piedad. Solo deudas.", tone: "dark", consequences: [], nextNodeId: null }],
    },
    se_taught: {
      id: "se_taught",
      speaker: "Senna Vael",
      text: "[Cierra la mano en torno a la chispa que le mostraste, y por primera vez el miedo en sus ojos tiene a dónde ir.] Cuando el cobrador llegue al anochecer... seré yo quien lo espere. Gracias. No por la bondad. Por los dientes.",
      options: [{ id: "se_taught_end", text: "Sobrevive primero. Agradécemelo después.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_SENNA_AFTER: DialogueConversation = {
  id: "conv_senna_after",
  startNodeId: "sa1",
  nodes: {
    sa1: {
      id: "sa1",
      speaker: "Senna Vael",
      text: "Aún respirando, gracias a ti. Dreshdae es un lugar distinto cuando no cuentas las horas hasta el anochecer. Si alguna vez necesitas a alguien que sepa cuáles de las sonrisas de este pueblo son de verdad — sabes dónde bebo.",
      options: [{ id: "sa1_end", text: "Mantente con vida, Senna.", consequences: [], nextNodeId: null }],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Aggregate
// ═══════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════
// Korriban — Koro the Servitor (rank-reactive flavour + the Overseer's ledger)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_KORO_INTRO: DialogueConversation = {
  id: "conv_koro_intro",
  startNodeId: "k1",
  nodes: {
    k1: {
      id: "k1",
      speaker: "Koro",
      text: "{rank}. Perdona los ojos de un viejo sirviente — aprendí hace mucho a medir la fuerza de quienes recorren estos pasillos. Estás ascendiendo; puedo oler la oscuridad en ti como ceniza. ¿En qué puede servir Koro?",
      options: [
        {
          id: "k_lore",
          text: "Dime lo que susurran los maestros.",
          tone: "neutral",
          nextNodeId: "k_lore",
          consequences: [{ type: "add_xp", value: 40 }],
        },
        {
          id: "k_demand",
          text: "Arrodíllate y dame tus secretos.",
          tone: "dark",
          check: { type: "rank", value: 3 },
          checkLabel: "[Lord Sith]",
          nextNodeId: "k_demand",
          consequences: [{ type: "add_credits", value: 250 }, { type: "corruption_change", value: 3 }],
        },
        { id: "k_leave", text: "Apártate de mi camino, sirviente.", tone: "neutral", nextNodeId: null, consequences: [] },
      ],
    },
    k_lore: {
      id: "k_lore",
      speaker: "Koro",
      text: "Los Supervisores temen un nombre de las tumbas profundas — Marka Ragnos se agita donde el hielo nunca se derrite. Los fuertes bajan a demostrar su valía y no vuelven igual. El conocimiento es una hoja, {rank}. Cuida de qué lado la sostienes.",
      options: [{ id: "k_lore_ok", text: "Útil. Recuerda tu lugar, y quizás aún vivas.", tone: "neutral", nextNodeId: null, consequences: [] }],
    },
    k_demand: {
      id: "k_demand",
      speaker: "Koro",
      text: "¡S-sí! Por supuesto. La Supervisora Raxis guarda un libro privado — deudas, debilidades, el precio de la lealtad de cada acólito — oculto tras la cámara de meditación. Tómalo, mi Lord, y perdona a un viejo que solo barría los suelos.",
      options: [{ id: "k_demand_ok", text: "Fuiste sabio al doblegarte.", tone: "dark", nextNodeId: null, consequences: [{ type: "set_flag", key: "koro_ledger_known", value: true }] }],
    },
  },
};

export const CONV_KORO_LORD: DialogueConversation = {
  id: "conv_koro_lord",
  startNodeId: "kl1",
  nodes: {
    kl1: {
      id: "kl1",
      speaker: "Koro",
      text: "[Koro hinca una rodilla en cuanto te ve.] Mi Lord. Toda la Academia pronuncia tu nombre ahora — los Supervisores bajan la voz cuando pasas. Koro siempre lo supo. Koro se inclinó primero. ¿Hay algo que un leal sirviente pueda hacer por quien ha ascendido tan alto?",
      options: [
        {
          id: "kl_reward",
          text: "La lealtad se recuerda. Toma — por tu discreción.",
          tone: "neutral",
          nextNodeId: "kl_thanks",
          consequences: [{ type: "add_credits", value: -50 }],
        },
        {
          id: "kl_info",
          text: "Dime quién aún conspira contra mí.",
          tone: "dark",
          nextNodeId: "kl_info",
          consequences: [{ type: "add_xp", value: 90 }],
        },
        { id: "kl_dismiss", text: "Sigue siendo útil y seguirás respirando.", tone: "dark", nextNodeId: null, consequences: [] },
      ],
    },
    kl_thanks: {
      id: "kl_thanks",
      speaker: "Koro",
      text: "[Aprieta los créditos como una reliquia.] No lo lamentarás, mi Lord. Los oídos de Koro son tuyos.",
      options: [{ id: "kl_t_ok", text: "Procura que así sea.", tone: "neutral", nextNodeId: null, consequences: [] }],
    },
    kl_info: {
      id: "kl_info",
      speaker: "Koro",
      text: "Dos aprendices envidian tu ascenso y susurran sobre un 'accidente' en las tumbas. Y la Supervisora Raxis — te sonríe, pero mantiene ese libro cerca y una hoja más cerca. Vigila a los que sonríen, mi Lord. Son los que más se inclinan antes del cuchillo.",
      options: [{ id: "kl_i_ok", text: "Que lo intenten.", tone: "dark", nextNodeId: null, consequences: [{ type: "set_flag", key: "koro_warned_lord", value: true }] }],
    },
  },
};

/** Refugee Crisis (q_refugee_crisis) — an ACTIVE light/dark choice: the dark
 *  path grants credits + corruption now and dark quest rewards at completion;
 *  the light path costs credits and earns hidden-Jedi favour. Both set
 *  rc_choice_made so the quest resolves either way. */
export const CONV_REFUGEE_PLEA: DialogueConversation = {
  id: "conv_refugee_plea",
  startNodeId: "rp1",
  nodes: {
    rp1: {
      id: "rp1",
      speaker: "Vethra Oan",
      text: "No te pediré compasión; en Nar Shaddaa se vende a peso. Solo te diré lo que somos: setenta y tres almas que huyeron del Triunvirato y ya no tienen adónde huir. Comemos lo reciclado, bebemos lo filtrado y rezamos por no llamar la atención. Y aquí estás tú, con un sable y una mirada que ya ha decidido algo. ¿Qué va a ser?",
      options: [
        {
          id: "rp1_help",
          text: "Toma créditos y suministros. Borraré vuestro registro de las listas del Intercambio.",
          tone: "light",
          consequences: [
            { type: "add_credits", value: -250 },
            { type: "faction_rep", factionId: "hidden_jedi", value: 6 },
            { type: "set_flag", key: "rc_helped", value: true },
            { type: "set_flag", key: "rc_choice_made", value: true },
          ],
          nextNodeId: "rp_helped",
        },
        {
          id: "rp1_exploit",
          text: "[Oscuro] El capataz del Intercambio paga por cuerpos para sus muelles. Setenta y tres es un buen número.",
          tone: "dark",
          consequences: [
            { type: "add_credits", value: 450 },
            { type: "corruption_change", value: 5 },
            { type: "faction_rep", factionId: "smuggler_guild", value: 5 },
            { type: "set_flag", key: "rc_exploited", value: true },
            { type: "set_flag", key: "rc_choice_made", value: true },
          ],
          nextNodeId: "rp_exploited",
        },
        { id: "rp1_leave", text: "Aún no lo he decidido. (Volver más tarde)", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    rp_helped: {
      id: "rp_helped",
      speaker: "Vethra Oan",
      text: "No sé qué clase de Sith hace esto. Quizá una que aún recuerda haber tenido frío y hambre. Tus créditos nos compran un pasaje; tu nombre, borrado de las listas, nos compra el mañana. No lo olvidaremos — y en los bajos fondos, la memoria de los olvidados es una moneda que algún día querrás cobrar.",
      options: [],
      autoNext: null,
    },
    rp_exploited: {
      id: "rp_exploited",
      speaker: "Vethra Oan",
      text: "Lo supe en el momento en que decidiste, antes incluso de que hablaras. Los muelles del Intercambio se tragarán a los nuestros y tú te marcharás más rico. Recuérdalo cuando seas tú quien huya, Sith: la galaxia lleva las cuentas, aunque tú no.",
      options: [],
      onEnter: [{ type: "faction_rep", factionId: "hidden_jedi", value: -6 }],
      autoNext: null,
    },
  },
};

/** Surface Survivors (q_surface_survivors) — active light/dark choice on Telos:
 *  shelter the colonists, or sell them to Czerka as illegal squatters. */
export const CONV_SURVIVOR_CHOICE: DialogueConversation = {
  id: "conv_survivor_choice",
  startNodeId: "sv1",
  nodes: {
    sv1: {
      id: "sv1",
      speaker: "Garrek Sool",
      text: "No bajes el sable por mí; ya he visto esa cara antes. Czerka manda agentes cada pocas semanas a 'revisar el permiso de ocupación' que nunca tuvimos. Somos dieciocho, contando a los críos, y lo único que pedimos es que Telos nos deje cicatrizar con ella. Pero tú no has venido a pedir permiso a nadie, ¿verdad?",
      options: [
        {
          id: "sv1_help",
          text: "Quedaos. Os dejo suministros y aviso a la estación de que estáis bajo mi protección.",
          tone: "light",
          consequences: [
            { type: "add_credits", value: -200 },
            { type: "add_xp", value: 120 },
            { type: "set_flag", key: "ss_helped", value: true },
            { type: "set_flag", key: "ss_choice_made", value: true },
          ],
          nextNodeId: "sv_helped",
        },
        {
          id: "sv1_purge",
          text: "[Oscuro] Czerka paga por despejar ocupantes ilegales. Considéralo despejado.",
          tone: "dark",
          consequences: [
            { type: "add_credits", value: 350 },
            { type: "corruption_change", value: 4 },
            { type: "faction_rep", factionId: "smuggler_guild", value: 4 },
            { type: "set_flag", key: "ss_eliminated", value: true },
            { type: "set_flag", key: "ss_choice_made", value: true },
          ],
          nextNodeId: "sv_purged",
        },
        { id: "sv1_leave", text: "Todavía no he decidido. (Volver más tarde)", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    sv_helped: {
      id: "sv_helped",
      speaker: "Garrek Sool",
      text: "Un Sith que reparte suministros en vez de sentencias. El universo no deja de sorprenderme. Marcaré tu nombre en la única lista que importa aquí abajo: la de los que no nos dieron la espalda. Si algún día Telos vuelve a ser un mundo, recordará quién lo dejó respirar.",
      options: [],
      autoNext: null,
    },
    sv_purged: {
      id: "sv_purged",
      speaker: "Garrek Sool",
      text: "Claro. Por supuesto. Dieciocho nombres por un puñado de créditos de Czerka. *Suelta el rifle remendado, sin rabia, solo cansancio.* No supliques cuando te toque a ti. Nosotros tampoco lo hicimos.",
      options: [],
      autoNext: null,
    },
  },
};

/** Czerka Dealings (q_czerka_dealings) — active choice: pocket Czerka's bonus
 *  and bury the evidence (dark), or leak it and sink their Telos operation. */
export const CONV_CZERKA_CHOICE: DialogueConversation = {
  id: "conv_czerka_choice",
  startNodeId: "cz1",
  nodes: {
    cz1: {
      id: "cz1",
      speaker: "Director Adjunto Halex",
      text: "Trabajo limpio. Bueno, limpio para lo que era. *Desliza una tarjeta de crédito sobre la mesa con un dedo.* Czerka recompensa la discreción tanto como la eficacia. El informe que tienes en la mano podría enterrarse aquí mismo, con una bonificación generosa... o podría salir de esta estación y costarnos Telos entero. Tú decides qué clase de socio vas a ser.",
      options: [
        {
          id: "cz1_serve",
          text: "Entierra el informe. Cobro la bonificación.",
          tone: "dark",
          consequences: [
            { type: "add_credits", value: 400 },
            { type: "corruption_change", value: 3 },
            { type: "faction_rep", factionId: "smuggler_guild", value: 6 },
            { type: "set_flag", key: "cd_served", value: true },
            { type: "set_flag", key: "cd_czerka_choice", value: true },
          ],
          nextNodeId: "cz_served",
        },
        {
          id: "cz1_betray",
          text: "El informe sale de aquí. Tu operación en Telos se acabó.",
          tone: "light",
          consequences: [
            { type: "add_xp", value: 150 },
            { type: "faction_rep", factionId: "hidden_jedi", value: 5 },
            { type: "faction_rep", factionId: "smuggler_guild", value: -4 },
            { type: "set_flag", key: "cd_betrayed", value: true },
            { type: "set_flag", key: "cd_czerka_choice", value: true },
          ],
          nextNodeId: "cz_betrayed",
        },
        { id: "cz1_leave", text: "Déjame pensarlo. (Volver más tarde)", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    cz_served: {
      id: "cz_served",
      speaker: "Director Adjunto Halex",
      text: "Sabia inversión. La tuya y la nuestra. *La sonrisa no le llega a los ojos.* Czerka tiene una memoria larga y una nómina más larga aún. Volveremos a llamarte, socio — siempre hay otro informe que enterrar.",
      options: [],
      autoNext: null,
    },
    cz_betrayed: {
      id: "cz_betrayed",
      speaker: "Director Adjunto Halex",
      text: "*La sonrisa se evapora.* Entiendes que acabas de convertir a una corporación con presupuesto militar en tu enemiga personal por... ¿qué, un principio? Telos no te lo agradecerá. Telos no agradece nada. Pero adelante, mártir. Veremos cuánto te dura la integridad.",
      options: [],
      autoNext: null,
    },
  },
};

/** Political Intrigue (q_political_intrigue) — active allegiance choice on
 *  Onderon: stand with Queen Talia's crown, or back General Vaklu's Sith-funded
 *  coup (the dark, corruption-bearing path). */
export const CONV_POLITICAL_CHOICE: DialogueConversation = {
  id: "conv_political_choice",
  startNodeId: "po1",
  nodes: {
    po1: {
      id: "po1",
      speaker: "Heralda Ysane",
      text: "Sé que Vaklu te ha hablado; en Iziz las paredes tienen lengua. Así que seré directa, como lo fue él: Onderon se parte en dos, y un forastero con un sable cuenta como medio ejército. La Reina Talia te pregunta lo que el General ya te preguntó. ¿Con la corona, o con el cuchillo que busca su garganta?",
      options: [
        {
          id: "po1_talia",
          text: "Con la corona. El golpe de Vaklu muere antes de empezar.",
          tone: "light",
          consequences: [
            { type: "add_xp", value: 160 },
            { type: "faction_rep", factionId: "hidden_jedi", value: 5 },
            { type: "set_flag", key: "pi_backed_talia", value: true },
            { type: "set_flag", key: "pi_side_chosen", value: true },
          ],
          nextNodeId: "po_talia",
        },
        {
          id: "po1_vaklu",
          text: "[Oscuro] Con Vaklu. Una reina débil es un trono desperdiciado.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 4 },
            { type: "faction_rep", factionId: "sith_academy", value: 12 },
            { type: "set_flag", key: "pi_backed_vaklu", value: true },
            { type: "set_flag", key: "pi_side_chosen", value: true },
          ],
          nextNodeId: "po_vaklu",
        },
        { id: "po1_leave", text: "Onderon esperará mi respuesta. (Volver más tarde)", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    po_talia: {
      id: "po_talia",
      speaker: "Heralda Ysane",
      text: "La Reina recordará esto cuando el polvo se asiente y los traidores cuelguen de las murallas. Has elegido el lado que aún puede llamarse Onderon. Ve con la bendición de la corona — y con su deuda.",
      options: [],
      autoNext: null,
    },
    po_vaklu: {
      id: "po_vaklu",
      speaker: "Heralda Ysane",
      text: "*Su rostro se cierra como una puerta de bóveda.* Entonces le dirás a Talia tú mismo a quién serviste, cuando Vaklu te entregue su cabeza como pago. Recuerda este momento, forastero. Recuerda que se te ofreció el lado limpio, y escupiste sobre él.",
      options: [],
      autoNext: null,
    },
  },
};

/** Crystal Heart (q_crystal_heart) — a solitary Force choice rendered as a
 *  narrator dialogue: attune the kyber (light) or corrupt it (dark, +corruption
 *  and a bleeding crystal via the quest's darkRewards). */
export const CONV_CRYSTAL_CHOICE: DialogueConversation = {
  id: "conv_crystal_choice",
  startNodeId: "cr1",
  nodes: {
    cr1: {
      id: "cr1",
      speaker: null,
      text: "Posas las manos sobre el Corazón de Cristal y su canto te inunda — una nota que existía antes que los Jedi y seguirá cuando se les olvide. Puedes acompañarla, dejar que afine tu sable y tu mente... o puedes ahogarla en tu propio odio hasta que sangre, y forjar con ella un arma que muerda como muerdes tú.",
      options: [
        {
          id: "cr1_attune",
          text: "Acompañar el canto. Sintonizar el cristal.",
          tone: "light",
          consequences: [
            { type: "add_xp", value: 200 },
            { type: "set_flag", key: "ch_attuned", value: true },
            { type: "set_flag", key: "ch_crystal_choice", value: true },
          ],
          nextNodeId: "cr_attune",
        },
        {
          id: "cr1_corrupt",
          text: "[Oscuro] Ahogar el canto. Corromper el cristal hasta que sea mío.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 5 },
            { type: "set_flag", key: "ch_corrupted", value: true },
            { type: "set_flag", key: "ch_crystal_choice", value: true },
          ],
          nextNodeId: "cr_corrupt",
        },
        { id: "cr1_leave", text: "Aún no estoy listo. (Apartar las manos)", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    cr_attune: {
      id: "cr_attune",
      speaker: null,
      text: "El canto se acompasa a tu pulso y, por un instante, el fragor de tu odio calla. El cristal sale de la geoda limpio y vivo, latiendo con una luz serena. Lo que empuñes con él recordará esta quietud, aunque tú la olvides.",
      options: [],
      autoNext: null,
    },
    cr_corrupt: {
      id: "cr_corrupt",
      speaker: null,
      text: "El canto resiste, y tú aprietas más fuerte, vertiendo en la piedra cada agravio que has cargado. La nota se quiebra en un alarido, y luego en silencio. El cristal sale ennegrecido, sangrando una luz enferma — más afilado que cualquier kyber puro, y mucho más hambriento.",
      options: [],
      autoNext: null,
    },
  },
};

/** What the Tomb Kept Silent (q_silent_tomb, Korriban/Dreshdae) — a murdered
 *  acolyte's sister. Active light/dark resolution: merciful lie (light), arm her
 *  for vengeance (dark, +corruption), or sell the killer her silence (darkest). */
export const CONV_SERA_PLEA: DialogueConversation = {
  id: "conv_sera_plea",
  startNodeId: "sp1",
  nodes: {
    sp1: {
      id: "sp1",
      speaker: "Sera Vant",
      text: "Llevas la túnica de los que se llevaron a mi hermano. Joren. Diecisiete años, sensible a la Fuerza, lleno de fe en este lugar. Hace tres meses me entregaron sus cenizas y una palabra: 'prueba'. Murió en una prueba, dijeron. Pero Joren me escribía cada semana, y en su última carta tenía miedo de alguien. De un nombre. ¿Podrías averiguar qué le pasó de verdad? No tengo con qué pagarte salvo la verdad que encuentres.",
      options: [
        { id: "sp1_accept", text: "Lo averiguaré. ¿Dónde murió?", tone: "neutral", consequences: [{ type: "set_flag", key: "sera_met", value: true }, { type: "start_quest", questId: "q_silent_tomb" }], nextNodeId: "sp2" },
        { id: "sp1_cold", text: "Los débiles mueren aquí. Tu hermano era débil.", tone: "dark", consequences: [{ type: "set_flag", key: "sera_met", value: true }, { type: "start_quest", questId: "q_silent_tomb" }, { type: "corruption_change", value: 1 }], nextNodeId: "sp2_cold" },
        { id: "sp1_leave", text: "No es mi problema.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    sp2: {
      id: "sp2",
      speaker: "Sera Vant",
      text: "En las minas de esclavos, en el pozo bajo. Su cuadrilla 'colapsó'. Si queda algo de él ahí abajo... gracias. Que la Fuerza, o lo que sea que escuchéis los Sith, te lo devuelva.",
      options: [{ id: "sp2_go", text: "Volveré con lo que encuentre.", consequences: [], nextNodeId: null }],
    },
    sp2_cold: {
      id: "sp2_cold",
      speaker: "Sera Vant",
      text: "Quizá lo fuera. Pero los débiles a veces saben cosas que los fuertes ignoran. Joren tenía miedo de un nombre. Búscalo en las minas, donde 'colapsó' su cuadrilla. Te lo ruego igual, por mucho desprecio que me devuelvas.",
      options: [{ id: "sp2c_go", text: "Veré qué hay en el pozo.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_SERA_AFTER: DialogueConversation = {
  id: "conv_sera_after",
  startNodeId: "sa1",
  nodes: {
    sa1: {
      id: "sa1",
      speaker: "Sera Vant",
      text: "Lo veo en tu cara. Encontraste algo. Dímelo. Sea lo que sea, dímelo — llevo tres meses muriendo un poco cada día sin saberlo.",
      options: [
        { id: "sa1_truth", text: "Lo asesinaron. Las vigas estaban cortadas con un sable. Tengo el sello de quién lo hizo.", tone: "neutral", consequences: [], nextNodeId: "sa2_truth" },
        { id: "sa1_lie", text: "Murió como un Sith, en una prueba justa. Descansa en paz.", tone: "light", consequences: [{ type: "set_flag", key: "sera_lied", value: true }, { type: "set_flag", key: "sera_resolved", value: true }, { type: "add_xp", value: 120 }], nextNodeId: "sa2_lie" },
      ],
    },
    sa2_truth: {
      id: "sa2_truth",
      speaker: "Sera Vant",
      text: "Un nombre. Dame un nombre y haré lo que tenga que hacer, aunque me cueste la vida. O... vende lo que sabes al que lo hizo, y vete con tus créditos. Sé lo que sois los Sith. Pero mírame a los ojos cuando lo elijas.",
      options: [
        { id: "sa2_avenge", text: "[Oscuro] El nombre es tuyo, y un arma con él. Que pague.", tone: "dark", consequences: [{ type: "set_flag", key: "sera_avenged", value: true }, { type: "set_flag", key: "sera_resolved", value: true }, { type: "corruption_change", value: 3 }, { type: "add_xp", value: 200 }], nextNodeId: "sa3_avenge" },
        { id: "sa2_betray", text: "[Oscuro] Tu hermano ya está muerto. Su asesino paga bien por el silencio.", tone: "dark", consequences: [{ type: "set_flag", key: "sera_betrayed", value: true }, { type: "set_flag", key: "sera_resolved", value: true }, { type: "corruption_change", value: 5 }, { type: "add_credits", value: 600 }, { type: "faction_rep", factionId: "sith_academy", value: 5 }], nextNodeId: "sa3_betray" },
      ],
    },
    sa2_lie: {
      id: "sa2_lie",
      speaker: "Sera Vant",
      text: "...Gracias. No sé por qué un Sith me daría esto, pero lo guardaré como lo único limpio que me llevo de este mundo. Adiós, acólito. Que tu senda sea más amable que la suya.",
      options: [],
      autoNext: null,
    },
    sa3_avenge: {
      id: "sa3_avenge",
      speaker: "Sera Vant",
      text: "Que la oscuridad que tanto cultiváis me preste fuerza esta noche. No volverás a verme. De un modo u otro, esto termina hoy.",
      options: [],
      autoNext: null,
    },
    sa3_betray: {
      id: "sa3_betray",
      speaker: "Sera Vant",
      text: "...Claro. Por supuesto. *No grita. Solo deja la bayeta sobre la mesa y se marcha sin mirar atrás.* Espero que valgan mucho, esos créditos.",
      options: [],
      autoNext: null,
    },
  },
};

/** Meat for the Storm (q_storm_meat, Dromund Kaas) — a deserter trooper hunting
 *  the cult that got his squad killed as ritual bait. Combat objective + an
 *  active aftermath choice: free him (light), break him with the truth, or
 *  conscript him (dark). */
export const CONV_KORSO_INTRO: DialogueConversation = {
  id: "conv_korso_intro",
  startNodeId: "ki1",
  nodes: {
    ki1: {
      id: "ki1",
      speaker: "Sargento Korso",
      text: "Baja la voz y el sable, acólito. Lo último que necesito es que un cazatalentos Sith me huela. Sargento Brel Korso, antes del 4º de Fusileros de Kaas. 'Antes', porque mi escuadra ya no existe. Nos metieron en esta selva con órdenes de asegurar un 'perímetro ritual'. No éramos un perímetro. Éramos el cebo. Un Darth necesitaba miedo fresco para alimentar algo en el Templo, y doce hombres míos murieron gritando para dárselo. Yo me arrastré fuera. Ahora cazo a los suyos — el círculo del culto que nos llevó al matadero.",
      options: [
        { id: "ki1_accept", text: "Enséñame dónde se reúne ese círculo.", tone: "neutral", consequences: [{ type: "set_flag", key: "korso_met", value: true }, { type: "start_quest", questId: "q_storm_meat" }], nextNodeId: "ki2" },
        { id: "ki1_honor", text: "Doce hombres merecen una respuesta. Te ayudaré.", tone: "light", consequences: [{ type: "set_flag", key: "korso_met", value: true }, { type: "start_quest", questId: "q_storm_meat" }, { type: "add_xp", value: 40 }], nextNodeId: "ki2" },
        { id: "ki1_cold", text: "El Imperio te usó como ganado. Quizá lo merecías.", tone: "dark", consequences: [{ type: "set_flag", key: "korso_met", value: true }, { type: "start_quest", questId: "q_storm_meat" }, { type: "corruption_change", value: 1 }], nextNodeId: "ki2_cold" },
        { id: "ki1_leave", text: "No me meto en duelos entre el Imperio y los Sith.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    ki2: {
      id: "ki2",
      speaker: "Sargento Korso",
      text: "El círculo se reúne en un claro al este, donde la sangre de mis hombres aún tiñe el barro. Mátalos a todos. Yo cubriré tu retirada si la cosa se tuerce. No por ti — por ellos.",
      options: [{ id: "ki2_go", text: "Volveré cuando el claro esté en silencio.", consequences: [], nextNodeId: null }],
    },
    ki2_cold: {
      id: "ki2_cold",
      speaker: "Sargento Korso",
      text: "...Puede. Pero hasta el ganado cornea antes de caer. El círculo está al este. Si los matas, no preguntaré por qué lo hiciste.",
      options: [{ id: "ki2c_go", text: "Iré al claro.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_KORSO_AFTER: DialogueConversation = {
  id: "conv_korso_after",
  startNodeId: "ka1",
  nodes: {
    ka1: {
      id: "ka1",
      speaker: "Sargento Korso",
      text: "Están muertos. Los oí dejar de cantar. *Se pasa una mano por la cara.* Pensé que sentiría algo. Justicia, paz, no sé. Solo siento el peso de doce ataúdes vacíos. ¿Y ahora qué, acólito? ¿Qué hace alguien como tú con alguien como yo, ahora que ya no le sirvo?",
      options: [
        { id: "ka1_free", text: "Te saco de Dromund Kaas. Hay naves de carga que no hacen preguntas. Vive.", tone: "light", consequences: [{ type: "set_flag", key: "korso_freed", value: true }, { type: "set_flag", key: "korso_resolved", value: true }, { type: "add_xp", value: 250 }, { type: "faction_rep", factionId: "smuggler_guild", value: 6 }], nextNodeId: "ka2_free" },
        { id: "ka1_truth", text: "[Oscuro] Antes de irte, sábelo: no fue un Darth cualquiera. Tu propio Moff firmó la orden.", tone: "dark", consequences: [{ type: "set_flag", key: "korso_broken", value: true }, { type: "set_flag", key: "korso_resolved", value: true }, { type: "corruption_change", value: 3 }, { type: "add_xp", value: 180 }], nextNodeId: "ka2_broken" },
        { id: "ka1_use", text: "[Oscuro] Un soldado sin bando es un arma sin dueño. Ahora eres mía. Sirve, o reúnete con tus hombres.", tone: "dark", consequences: [{ type: "set_flag", key: "korso_conscripted", value: true }, { type: "set_flag", key: "korso_resolved", value: true }, { type: "corruption_change", value: 5 }, { type: "faction_rep", factionId: "sith_academy", value: 5 }, { type: "add_credits", value: 200 }], nextNodeId: "ka2_use" },
      ],
    },
    ka2_free: {
      id: "ka2_free",
      speaker: "Sargento Korso",
      text: "...No esperaba esto de un Sith. Quizá no todos seáis el Darth que mató a mis hombres. Me iré esta noche. Si la galaxia tiene algo de justicia, nunca volverás a saber de mí — y eso será lo mejor que pueda desearte. Gracias.",
      options: [],
      autoNext: null,
    },
    ka2_broken: {
      id: "ka2_broken",
      speaker: "Sargento Korso",
      text: "*Algo se apaga en sus ojos.* Mi propio Moff. Claro. Claro que sí. *Ríe, hueco.* Gracias por la verdad, Sith. Es lo único que nadie tuvo la decencia de darme. Ahora sé exactamente a quién visitar antes de morir.",
      options: [],
      autoNext: null,
    },
    ka2_use: {
      id: "ka2_use",
      speaker: "Sargento Korso",
      text: "*Aprieta la mandíbula. Mira el rifle, mira tu sable. Calcula, y pierde la cuenta.* ...Sí, señor. Un arma sin dueño. Eso soy. Dime a quién apuntar.",
      options: [],
      autoNext: null,
    },
  },
};

/** Pawn Flesh (q_pawn_flesh, Nar Shaddaa) — a mother's daughter held by the
 *  Exchange. Multiple routes at the broker: pay, [Influence] intimidate, fight
 *  (separate encounter hotspot), or [dark] buy the girl for yourself (resolves
 *  the quest darkly without the reunion). */
export const CONV_TESSA_PLEA: DialogueConversation = {
  id: "conv_tessa_plea",
  startNodeId: "tp1",
  nodes: {
    tp1: {
      id: "tp1",
      speaker: "Tessa Roan",
      text: "Por favor — pareces de los que pueden entrar donde yo no. Mi hija, Lyra. Nueve años. El Intercambio se la llevó como aval de una deuda que jamás podré pagar, y al amanecer la suben a un carguero rumbo a los mercados de esclavos del Borde. El corredor que la retiene está en el pozo de abajo. No tengo créditos, ni Fuerza, ni nada... solo a ti, parado delante de mí. Te lo suplico.",
      options: [
        { id: "tp1_accept", text: "¿Dónde retienen a tu hija?", tone: "neutral", consequences: [{ type: "set_flag", key: "tessa_met", value: true }, { type: "start_quest", questId: "q_pawn_flesh" }], nextNodeId: "tp2" },
        { id: "tp1_vow", text: "Encontraré la forma de soltarla. Lo prometo.", tone: "light", consequences: [{ type: "set_flag", key: "tessa_met", value: true }, { type: "start_quest", questId: "q_pawn_flesh" }], nextNodeId: "tp2" },
        { id: "tp1_cold", text: "Una niña esclava no es asunto mío. Pero háblame del corredor.", tone: "dark", consequences: [{ type: "set_flag", key: "tessa_met", value: true }, { type: "start_quest", questId: "q_pawn_flesh" }, { type: "corruption_change", value: 1 }], nextNodeId: "tp2_cold" },
        { id: "tp1_leave", text: "Nar Shaddaa se traga a todos. No puedo salvar a nadie.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    tp2: {
      id: "tp2",
      speaker: "Tessa Roan",
      text: "El corredor se llama Vross. Un weequay con un datapad y demasiados matones, junto a los muelles del módulo bajo. Tiene a Lyra en una jaula de transporte. Cómpralo, asústalo o entra por la fuerza — me da igual cómo, con tal de que respire al amanecer.",
      options: [{ id: "tp2_go", text: "Iré a por Vross.", consequences: [], nextNodeId: null }],
    },
    tp2_cold: {
      id: "tp2_cold",
      speaker: "Tessa Roan",
      text: "...Lo que sea. Sé lo que sois. El corredor es Vross, un weequay, en el pozo junto a los muelles. Si tu frío corazón sith encuentra una razón para soltarla — créditos, capricho, lo que sea — la tomaré.",
      options: [{ id: "tp2c_go", text: "Veré a ese tal Vross.", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_SLAVER_VROSS: DialogueConversation = {
  id: "conv_slaver_vross",
  startNodeId: "vr1",
  nodes: {
    vr1: {
      id: "vr1",
      speaker: "Vross",
      text: "¿Buscas mercancía? No — tú tienes pinta de problema con sable. La cría Roan no está en venta a tu precio; ya tiene comprador en el Borde. Así que o traes créditos, o traes una razón muy buena para que no llame a mis chicos.",
      options: [
        { id: "vr1_pay", text: "Quinientos. Por la niña. Ahora.", tone: "light", consequences: [{ type: "add_credits", value: -500 }, { type: "set_flag", key: "tessa_paid", value: true }, { type: "set_flag", key: "tessa_daughter_freed", value: true }], nextNodeId: "vr2_pay" },
        { id: "vr1_cow", text: "[Influencia 7] Mírame bien, weequay. ¿Cuánto vale tu cuello comparado con una deuda ajena?", check: { type: "influence", value: 7 }, checkLabel: "[Influencia 7]", tone: "deceptive", consequences: [{ type: "set_flag", key: "tessa_cowed", value: true }, { type: "set_flag", key: "tessa_daughter_freed", value: true }, { type: "add_xp", value: 120 }], nextNodeId: "vr2_cow" },
        { id: "vr1_buy", text: "[Oscuro] No la sueltes. Véndemela a mí. Tengo usos para una cría sensible a la Fuerza.", tone: "dark", consequences: [{ type: "add_credits", value: -300 }, { type: "set_flag", key: "tessa_bought", value: true }, { type: "set_flag", key: "tessa_daughter_freed", value: true }, { type: "set_flag", key: "tessa_resolved", value: true }, { type: "corruption_change", value: 6 }], nextNodeId: "vr2_buy" },
        { id: "vr1_leave", text: "Volveré.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    vr2_pay: { id: "vr2_pay", speaker: "Vross", text: "Hecho. Llévatela y que no vuelva a ver tu cara. Negocios son negocios.", options: [], autoNext: null },
    vr2_cow: { id: "vr2_cow", speaker: "Vross", text: "*Traga saliva y mira a sus matones, que de pronto estudian sus botas.* ...Quédatela. La deuda la cubro yo. No vale mi cuello. Vete.", options: [], autoNext: null },
    vr2_buy: { id: "vr2_buy", speaker: "Vross", text: "Jeh. Un sith con visión de futuro. Es tuya. Lo que le hagas no es asunto mío — y la madre tampoco lo será ya.", options: [], autoNext: null },
  },
};

export const CONV_TESSA_AFTER: DialogueConversation = {
  id: "conv_tessa_after",
  startNodeId: "ta1",
  nodes: {
    ta1: {
      id: "ta1",
      speaker: "Tessa Roan",
      text: "¡Lyra! *La niña corre a sus brazos. Tessa te mira por encima de su pelo, llorando sin vergüenza.* No sé qué clase de Sith hace esto. No sé si quiero saberlo. Pero mientras a esa cría le quede aliento, tu nombre será una oración en su boca antes de dormir.",
      options: [
        { id: "ta1_grace", text: "Sácala de Nar Shaddaa esta noche. Y no vuelvas a deber a nadie.", tone: "light", consequences: [{ type: "set_flag", key: "tessa_resolved", value: true }, { type: "add_xp", value: 220 }, { type: "faction_rep", factionId: "smuggler_guild", value: 6 }], nextNodeId: "ta2_grace" },
        { id: "ta1_debt", text: "Recuérdalo si algún día puedes pagarlo.", tone: "neutral", consequences: [{ type: "set_flag", key: "tessa_resolved", value: true }, { type: "add_xp", value: 160 }], nextNodeId: "ta2_debt" },
        { id: "ta1_cruel", text: "El cariño no paga deudas. La próxima vez no habrá un Sith de humor caritativo.", tone: "dark", consequences: [{ type: "set_flag", key: "tessa_resolved", value: true }, { type: "corruption_change", value: 1 }, { type: "add_xp", value: 160 }], nextNodeId: "ta2_cruel" },
      ],
    },
    ta2_grace: { id: "ta2_grace", speaker: "Tessa Roan", text: "Esta noche. Lo juro por ella. Que la Fuerza te trate mejor de lo que tratas tú a esta galaxia, acólito — porque hoy, conmigo, fuiste su único punto de luz.", options: [], autoNext: null },
    ta2_debt: { id: "ta2_debt", speaker: "Tessa Roan", text: "Lo recordaré. En los muelles, la memoria es la única moneda que no se devalúa. Algún día te encontraré para saldarla.", options: [], autoNext: null },
    ta2_cruel: { id: "ta2_cruel", speaker: "Tessa Roan", text: "*Abraza más fuerte a la niña y baja la mirada.* Sí. Claro. Gracias de todos modos. Que es más de lo que merecía esperar de los de tu túnica.", options: [], autoNext: null },
  },
};

/** The Edge of Nobility (q_noble_edge, Onderon) — showcases RANK and CORRUPTION
 *  reactivity: a high Sith rank lets you COMMAND the rival into yielding without
 *  a fight; high corruption lets you SEIZE his house for yourself. Otherwise you
 *  must win the duel. The player's Acolyte→Darth evolution opens new paths. */
export const CONV_YVANE_PLEA: DialogueConversation = {
  id: "conv_yvane_plea",
  startNodeId: "yp1",
  nodes: {
    yp1: {
      id: "yp1",
      speaker: "Dama Yvane Marr",
      text: "Te he hecho llamar porque eres lo que Onderon finge no necesitar: un Sith sin escrúpulos heredados. La Casa Marr, mi casa, fue humillada en pleno Salón del Trono por Lord Sarn Vael — me llamó reliquia, subastó las deudas de mi familia ante la corte y rió. Tengo oro, pero no acero. Tráeme su rendición, su sangre o su casa. No me importa cuál.",
      options: [
        { id: "yp1_accept", text: "¿Dónde encuentro a ese Lord Vael?", tone: "neutral", consequences: [{ type: "set_flag", key: "yvane_met", value: true }, { type: "start_quest", questId: "q_noble_edge" }], nextNodeId: "yp2" },
        { id: "yp1_dark", text: "[Corrupción 40] Caerán tres casas antes de que esto acabe, no una.", check: { type: "corruption", value: 40 }, checkLabel: "[Corrupción 40]", tone: "dark", consequences: [{ type: "set_flag", key: "yvane_met", value: true }, { type: "start_quest", questId: "q_noble_edge" }, { type: "corruption_change", value: 1 }], nextNodeId: "yp2_dark" },
        { id: "yp1_leave", text: "Las riñas de la nobleza no son mi guerra.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    yp2: { id: "yp2", speaker: "Dama Yvane Marr", text: "En su finca del barrio noble, rodeado de aduladores y un campeón mandaloriano que compró con mi humillación. Cobarde hasta para sus propios duelos.", options: [{ id: "yp2_go", text: "Le haré una visita.", consequences: [], nextNodeId: null }] },
    yp2_dark: { id: "yp2_dark", speaker: "Dama Yvane Marr", text: "...Veo que entiendes el juego. Sí. Empieza por Vael. Lo que construyas sobre sus ruinas es cosa tuya — siempre que la Casa Marr quede en pie sobre las demás.", options: [{ id: "yp2d_go", text: "Empezaré por Vael.", consequences: [], nextNodeId: null }] },
  },
};

export const CONV_SARN_VAEL: DialogueConversation = {
  id: "conv_sarn_vael",
  startNodeId: "sv1",
  nodes: {
    sv1: {
      id: "sv1",
      speaker: "Lord Sarn Vael",
      text: "¿Y tú eres? Ah — el perro que la vieja Marr ha desenterrado. Adorable. Tengo un campeón que desayuna acólitos sith. Da media vuelta antes de que le entre hambre.",
      options: [
        { id: "sv1_command", text: "[Rango Sith] Arrodíllate. O haré de tu finca una pira con tu nombre grabado en la ceniza.", check: { type: "rank", value: 2 }, checkLabel: "[Rango Sith]", tone: "dark", consequences: [{ type: "set_flag", key: "sarn_cowed", value: true }, { type: "set_flag", key: "yvane_rival_dealt", value: true }, { type: "add_xp", value: 220 }], nextNodeId: "sv2_cow" },
        { id: "sv1_seize", text: "[Corrupción 40] No le debes nada a los Marr. Júrame TU casa a MÍ, y vivirás para servir.", check: { type: "corruption", value: 40 }, checkLabel: "[Corrupción 40]", tone: "dark", consequences: [{ type: "set_flag", key: "vael_house_seized", value: true }, { type: "set_flag", key: "yvane_rival_dealt", value: true }, { type: "corruption_change", value: 4 }, { type: "faction_rep", factionId: "sith_academy", value: 5 }], nextNodeId: "sv2_seize" },
        { id: "sv1_duel", text: "Los Marr exigen satisfacción. Saca a tu campeón.", tone: "aggressive", consequences: [{ type: "set_flag", key: "sarn_challenged", value: true }], nextNodeId: "sv2_duel" },
        { id: "sv1_leave", text: "Volveré cuando convenga.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    sv2_cow: { id: "sv2_cow", speaker: "Lord Sarn Vael", text: "*El color huye de su cara.* Yo— sí. Sí, mi señor. Cualquier cosa. Diré ante la corte que los Marr siempre fueron honorables. Que nunca dudé de ellos. Por favor.", options: [], autoNext: null },
    sv2_seize: { id: "sv2_seize", speaker: "Lord Sarn Vael", text: "*Tiembla, y asiente despacio.* Mi casa es tuya. Mis votos, mis deudas, mis hombres. Que los Marr se pudran preguntándose qué pasó con su venganza.", options: [], autoNext: null },
    sv2_duel: { id: "sv2_duel", speaker: "Lord Sarn Vael", text: "¡Campeón! Hay un acólito que necesita una lección de modales. ...Veremos cuánto duras, perro de los Marr.", options: [], autoNext: null },
  },
};

export const CONV_YVANE_AFTER: DialogueConversation = {
  id: "conv_yvane_after",
  startNodeId: "ya1",
  nodes: {
    ya1: {
      id: "ya1",
      speaker: "Dama Yvane Marr",
      text: "Dicen que Vael ya no levanta la cabeza en la corte. Algunos susurran que ni siquiera tiene corte ya. *Te estudia con ojos viejos y astutos.* Hiciste más de lo que pedí, ¿verdad? La Casa Marr paga sus deudas. Dime cómo quieres cobrar.",
      options: [
        { id: "ya1_honor", text: "Tu casa está vengada. Lo demás no es asunto mío.", tone: "light", consequences: [{ type: "set_flag", key: "yvane_resolved", value: true }, { type: "add_xp", value: 220 }, { type: "add_credits", value: 300 }], nextNodeId: "ya2_honor" },
        { id: "ya1_pay", text: "El acero cobra. En créditos, no en gratitud.", tone: "neutral", consequences: [{ type: "set_flag", key: "yvane_resolved", value: true }, { type: "add_credits", value: 600 }], nextNodeId: "ya2_pay" },
        { id: "ya1_crush", text: "[Corrupción 50] Vael cayó. Y la Casa Marr jurará servirme también, o seguirá su camino.", check: { type: "corruption", value: 50 }, checkLabel: "[Corrupción 50]", tone: "dark", consequences: [{ type: "set_flag", key: "yvane_resolved", value: true }, { type: "set_flag", key: "marr_seized", value: true }, { type: "corruption_change", value: 4 }, { type: "faction_rep", factionId: "sith_academy", value: 8 }], nextNodeId: "ya2_crush" },
      ],
    },
    ya2_honor: { id: "ya2_honor", speaker: "Dama Yvane Marr", text: "Un Sith con palabra. La galaxia es más rara de lo que creía. La Casa Marr te recordará como amiga — y en Onderon, los amigos viejos abren puertas que el oro no puede.", options: [], autoNext: null },
    ya2_pay: { id: "ya2_pay", speaker: "Dama Yvane Marr", text: "Limpio y sin ataduras. Lo prefiero así. Aquí tienes; gástalo en sangre o en seda, no es asunto mío.", options: [], autoNext: null },
    ya2_crush: { id: "ya2_crush", speaker: "Dama Yvane Marr", text: "*Por un instante el orgullo se enciende en sus ojos — y luego se rinde, como todo lo demás hoy.* ...La Casa Marr es tuya. Vengué mi honor solo para entregárselo a algo peor que Vael. Que la corte tiemble, entonces. Ahora tiembla por ti.", options: [], autoNext: null },
  },
};

/** Poison in the Land (q_land_poison, Telos) — expose Czerka poisoning a
 *  restored valley. Combat to seize the evidence, then routes: hand it to the
 *  Republic (light), leak it via the underworld ([smuggler-guild reputation]
 *  check), sell it back to Czerka (dark), or keep it to blackmail them (dark). */
export const CONV_LIRA_PLEA: DialogueConversation = {
  id: "conv_lira_plea",
  startNodeId: "lp1",
  nodes: {
    lp1: {
      id: "lp1",
      speaker: "Doctora Lira Venn",
      text: "No te muevas — no, no eres de Czerka, lo veo en el sable. Doctora Lira Venn, del Proyecto de Restauración. O lo era, hasta que documenté lo que Czerka vierte en el valle de Sek. Llevan meses envenenando la tierra que juramos sanar — matando la fauna que reintroducimos, enfermando a los colonos — para que el terreno quede 'inviable', reclamarlo y arrasarlo en busca de mineral. Tengo las muestras en su vertedero, pero sus ejecutores me cazan. Si un Sith las recupera, ni se atreverán a interponerse. ¿Me ayudas, o me entregas?",
      options: [
        { id: "lp1_accept", text: "Recuperaré tus muestras. ¿Dónde está el vertedero?", tone: "neutral", consequences: [{ type: "set_flag", key: "lira_met", value: true }, { type: "start_quest", questId: "q_land_poison" }], nextNodeId: "lp2" },
        { id: "lp1_light", text: "Envenenar lo que se intenta sanar es obsceno hasta para un Sith. Lo haré.", tone: "light", consequences: [{ type: "set_flag", key: "lira_met", value: true }, { type: "start_quest", questId: "q_land_poison" }], nextNodeId: "lp2" },
        { id: "lp1_dark", text: "Czerka paga mejor que la conciencia. Pero primero veré qué tienes.", tone: "dark", consequences: [{ type: "set_flag", key: "lira_met", value: true }, { type: "start_quest", questId: "q_land_poison" }, { type: "corruption_change", value: 1 }], nextNodeId: "lp2_cold" },
        { id: "lp1_leave", text: "El moribundo Telos no es mi jardín.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    lp2: { id: "lp2", speaker: "Doctora Lira Venn", text: "Al norte, donde el río muerto se encuentra con la valla de Czerka. Los bidones están marcados con su sello, y custodiados. Trae una muestra sellada — con eso basta para hundirlos.", options: [{ id: "lp2_go", text: "Volveré con la prueba.", consequences: [], nextNodeId: null }] },
    lp2_cold: { id: "lp2_cold", speaker: "Doctora Lira Venn", text: "...Al norte, el río muerto, la valla de Czerka. Trae una muestra. Lo que hagas con ella después dirá quién eres mejor que cualquier rango.", options: [{ id: "lp2c_go", text: "Iré al vertedero.", consequences: [], nextNodeId: null }] },
  },
};

export const CONV_LIRA_AFTER: DialogueConversation = {
  id: "conv_lira_after",
  startNodeId: "la1",
  nodes: {
    la1: {
      id: "la1",
      speaker: "Doctora Lira Venn",
      text: "Lo conseguiste. *Mira el bidón sellado como quien mira una bomba.* Esto puede acabar con la operación de Czerka en Telos... o hacerte muy rico si decides que la verdad es mercancía. Tú tienes el sable, y ahora la prueba. Yo solo tengo la esperanza de haberte juzgado mal.",
      options: [
        { id: "la1_light", text: "Irá a la autoridad del Proyecto. Que Telos vea lo que Czerka le hace.", tone: "light", consequences: [{ type: "set_flag", key: "lira_resolved", value: true }, { type: "add_xp", value: 450 }, { type: "add_credits", value: 200 }], nextNodeId: "la2_light" },
        { id: "la1_underworld", text: "[Reputación contrabandistas 10] Conozco a gente que difunde secretos más rápido que cualquier burócrata. Czerka despertará arruinada.", check: { type: "faction", value: 10, factionId: "smuggler_guild" }, checkLabel: "[Contrabandistas 10]", tone: "deceptive", consequences: [{ type: "set_flag", key: "lira_resolved", value: true }, { type: "set_flag", key: "lira_underworld", value: true }, { type: "add_xp", value: 380 }, { type: "faction_rep", factionId: "smuggler_guild", value: 8 }], nextNodeId: "la2_under" },
        { id: "la1_sell", text: "[Oscuro] Czerka pagará una fortuna por enterrar esto. Tu valle es el precio.", tone: "dark", consequences: [{ type: "set_flag", key: "lira_resolved", value: true }, { type: "set_flag", key: "lira_betrayed", value: true }, { type: "corruption_change", value: 5 }, { type: "add_credits", value: 800 }], nextNodeId: "la2_sell" },
        { id: "la1_black", text: "[Oscuro] Ni la entrego ni la vendo. La uso. Czerka me servirá ahora.", tone: "dark", consequences: [{ type: "set_flag", key: "lira_resolved", value: true }, { type: "set_flag", key: "czerka_leashed", value: true }, { type: "corruption_change", value: 4 }, { type: "add_credits", value: 400 }, { type: "faction_rep", factionId: "sith_academy", value: 5 }], nextNodeId: "la2_black" },
      ],
    },
    la2_light: { id: "la2_light", speaker: "Doctora Lira Venn", text: "Entonces me equivoqué contigo, y nunca me alegré tanto de equivocarme. El valle de Sek vivirá. Si algún día el lado oscuro te pesa demasiado, recuerda que una vez elegiste la vida. Gracias.", options: [], autoNext: null },
    la2_under: { id: "la2_under", speaker: "Doctora Lira Venn", text: "Sucio, rápido y efectivo. No es como yo lo habría hecho... pero mañana Czerka será el hazmerreír de tres sistemas y el valle quedará libre. Supongo que en Nar Shaddaa aprendiste algo útil después de todo.", options: [], autoNext: null },
    la2_sell: { id: "la2_sell", speaker: "Doctora Lira Venn", text: "*Da un paso atrás, blanca como la ceniza del valle.* Lo sabía. Sabía que no debía confiar en un sable. Que la tierra que matarás te sobreviva para recordarlo, Sith. Es la única maldición que me queda.", options: [], autoNext: null },
    la2_black: { id: "la2_black", speaker: "Doctora Lira Venn", text: "Así que ni los salvas ni los vendes. Los posees a todos — Czerka, el valle, a mí. *Ríe sin ganas.* Felicidades. Acabas de aprender a ser un Darth de verdad. Espero no estar viva para ver en qué lo gastas.", options: [], autoNext: null },
  },
};

/** The Exile (q_exile, Dxun) — a disgraced Mandalorian seeking to reclaim his
 *  honor against the beast that shamed him. COMPANION-AWARE: if Torvak is in your
 *  party (flag check torvak_recruited), a unique resolution opens where Torvak
 *  vouches for Dral before the clan. */
export const CONV_DRAL_INTRO: DialogueConversation = {
  id: "conv_dral_intro",
  startNodeId: "di1",
  nodes: {
    di1: {
      id: "di1",
      speaker: "Dral Karr",
      text: "No gastes tu lástima, Sith; no me queda dónde guardarla. Soy Dral Karr, o lo era cuando tenía clan. Hace una estación cazábamos a una boma vieja y enorme en el barranco oriental. Cuando abrió en canal a mi hermano de sangre, yo... corrí. Los míos me marcaron como cobarde y me arrojaron aquí, a pudrirme entre la maleza. La bestia sigue ahí. Voy a volver a por ella. Solo. Y o la mato, o muero como debí morir entonces. ¿Por qué te lo cuento? Porque un sable tuyo podría inclinar la balanza — y porque ya no me queda orgullo que me impida pedirlo.",
      options: [
        { id: "di1_accept", text: "Te cubriré las espaldas contra esa bestia. Vamos.", tone: "neutral", consequences: [{ type: "set_flag", key: "dral_met", value: true }, { type: "start_quest", questId: "q_exile" }], nextNodeId: "di2" },
        { id: "di1_honor", text: "Ningún guerrero debería morir solo. Cazaremos juntos.", tone: "light", consequences: [{ type: "set_flag", key: "dral_met", value: true }, { type: "start_quest", questId: "q_exile" }, { type: "add_xp", value: 40 }], nextNodeId: "di2" },
        { id: "di1_scorn", text: "Los cobardes alimentan a las bestias. Pero quiero ver esa boma muerta.", tone: "dark", consequences: [{ type: "set_flag", key: "dral_met", value: true }, { type: "start_quest", questId: "q_exile" }, { type: "corruption_change", value: 1 }], nextNodeId: "di2_scorn" },
        { id: "di1_leave", text: "Tu honor mandaloriano no es mi carga.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    di2: { id: "di2", speaker: "Dral Karr", text: "El barranco oriental, donde el río se hunde bajo la roca. La reconocerás: una cicatriz le cruza el ojo, regalo de mi hermano antes de morir. Que esta vez la cicatriz sea lo último que vea.", options: [{ id: "di2_go", text: "Nos vemos en el barranco.", consequences: [], nextNodeId: null }] },
    di2_scorn: { id: "di2_scorn", speaker: "Dral Karr", text: "*Aprieta la mandíbula, pero asiente.* Desprecio justo. Lo he ganado. El barranco oriental, la boma de la cicatriz en el ojo. Ven o no vengas, pero yo bajaré igual.", options: [{ id: "di2s_go", text: "Bajaré al barranco.", consequences: [], nextNodeId: null }] },
  },
};

export const CONV_DRAL_AFTER: DialogueConversation = {
  id: "conv_dral_after",
  startNodeId: "da1",
  nodes: {
    da1: {
      id: "da1",
      speaker: "Dral Karr",
      text: "Está muerta. *Se arrodilla junto a la cabeza de la bestia, jadeando, cubierto de su sangre y de la propia.* La maté. Después de todo este tiempo, la maté. Pero un cobarde con una bestia muerta a los pies sigue siendo un cobarde para mi clan. No me readmitirán por esto. Quizá no debería pedirlo. ¿Qué ves tú, Sith, cuando me miras?",
      options: [
        { id: "da1_torvak", text: "[Compañero] Torvak hablará por ti ante Mandalore. Su palabra de guerrero pesa más que tu vergüenza.", check: { type: "flag", flagKey: "torvak_recruited" }, checkLabel: "[Compañero: Torvak]", tone: "light", consequences: [{ type: "set_flag", key: "dral_reinstated", value: true }, { type: "set_flag", key: "dral_resolved", value: true }, { type: "faction_rep", factionId: "mandalorian_houses", value: 20 }, { type: "companion_affinity", companionId: "torvak", value: 8 }, { type: "add_xp", value: 350 }], nextNodeId: "da2_torvak" },
        { id: "da1_honor", text: "Veo a un guerrero que volvió. Eso es más de lo que hacen la mayoría. Preséntate ante tu clan con la cabeza alta.", tone: "light", consequences: [{ type: "set_flag", key: "dral_resolved", value: true }, { type: "faction_rep", factionId: "mandalorian_houses", value: 10 }, { type: "add_xp", value: 250 }], nextNodeId: "da2_honor" },
        { id: "da1_take", text: "[Oscuro] Veo beskar desperdiciado en un muerto que aún respira. Dámelo y arrástrate de vuelta a tu exilio.", tone: "dark", consequences: [{ type: "set_flag", key: "dral_resolved", value: true }, { type: "set_flag", key: "dral_stripped", value: true }, { type: "corruption_change", value: 4 }, { type: "add_credits", value: 500 }], nextNodeId: "da2_take" },
      ],
    },
    da2_torvak: { id: "da2_torvak", speaker: "Dral Karr", text: "*Levanta la vista, incrédulo.* ¿Torvak? ¿El Torvak hablaría por... ? *Se le quiebra la voz.* Con un padrino así, ni el más duro de los Alor podrá negarme la armadura. Tienes un hermano de sangre en mí desde hoy, Sith, lo quieras o no. Y tu compañero tiene mi deuda.", options: [], autoNext: null },
    da2_honor: { id: "da2_honor", speaker: "Dral Karr", text: "La cabeza alta. *Lo prueba, como un músculo que olvidó usar.* Sí. Volveré, y que digan lo que quieran. Maté lo que me rompió. Gracias, Sith — has hecho por mí lo que mi propia sangre no quiso.", options: [], autoNext: null },
    da2_take: { id: "da2_take", speaker: "Dral Karr", text: "*Se desabrocha la coraza con manos temblorosas y la deja caer ante ti.* Tómala. Es lo único que me quedaba, y resulta que tampoco era mío conservarlo. Vete con tu sable y tu carroña, acólito. Al menos la bestia tuvo la decencia de matar de frente.", options: [], autoNext: null },
  },
};

/** Oziri Sath — a REACTIVE information broker whose lines change with the
 *  player's past choices across the new side quests (flag checks on tessa_bought,
 *  sera_betrayed, korso_freed, tessa_paid…). Delivers "the galaxy remembers what
 *  you did." One-time reputation deal (guarded by oziri_done). */
export const CONV_OZIRI: DialogueConversation = {
  id: "conv_oziri",
  startNodeId: "oz1",
  nodes: {
    oz1: {
      id: "oz1",
      speaker: "Oziri Sath",
      text: "Siéntate, siéntate. Oziri Sath, comerciante de lo único que no se devalúa en Nar Shaddaa: lo que la gente sabe de ti. Y sé bastante, acólito — cada moneda que mueve la galaxia roza mi mesa tarde o temprano. Dime, ¿qué eres tú en realidad? Porque los rumores no se ponen de acuerdo.",
      options: [
        { id: "oz1_bought", text: "Compré a una niña sensible a la Fuerza a un weequay. Negocio es negocio.", check: { type: "flag", flagKey: "tessa_bought" }, checkLabel: "[Rumor]", tone: "dark", consequences: [], nextNodeId: "oz_react_dark" },
        { id: "oz1_sera", text: "Vendí la verdad de un hermano muerto por unos créditos en Korriban.", check: { type: "flag", flagKey: "sera_betrayed" }, checkLabel: "[Rumor]", tone: "dark", consequences: [], nextNodeId: "oz_react_dark" },
        { id: "oz1_korso", text: "Saqué a un desertor imperial de Dromund Kaas. Lo dejé vivir.", check: { type: "flag", flagKey: "korso_freed" }, checkLabel: "[Rumor]", tone: "light", consequences: [], nextNodeId: "oz_react_light" },
        { id: "oz1_paid", text: "Pagué la deuda de una madre. Devolví a su hija libre.", check: { type: "flag", flagKey: "tessa_paid" }, checkLabel: "[Rumor]", tone: "light", consequences: [], nextNodeId: "oz_react_light" },
        { id: "oz1_direct", text: "Guárdate los rumores. ¿Qué ofreces?", tone: "neutral", consequences: [], nextNodeId: "oz_offer" },
      ],
    },
    oz_react_dark: {
      id: "oz_react_dark",
      speaker: "Oziri Sath",
      text: "Frío. Me gusta el frío — se vende solo. La galaxia ya susurra tu nombre, y los que susurran pagan por no estar en tu lista. Hay provecho en el miedo que dejas atrás, si sabes quién lo embotella por ti.",
      options: [],
      autoNext: "oz_offer",
    },
    oz_react_light: {
      id: "oz_react_light",
      speaker: "Oziri Sath",
      text: "Curioso. Un Sith con grietas de luz. Eso también se cotiza — hay quien pagaría por un acólito con conciencia, y quien pagaría más por saber dónde clavarla. La piedad es un lujo que otros financiarán por ti.",
      options: [],
      autoNext: "oz_offer",
    },
    oz_offer: {
      id: "oz_offer",
      speaker: "Oziri Sath",
      text: "Al grano, pues. Tu reputación es mercancía, y yo soy el mercado. Elige cómo la vendo: a gritos, para que tu nombre llegue antes que tú... o en susurros, discretos y rentables.",
      options: [
        { id: "oz_legend", text: "A gritos. Que el terror haga la mitad de mi trabajo.", tone: "dark", consequences: [{ type: "set_flag", key: "oziri_done", value: true }, { type: "set_flag", key: "oziri_legend", value: true }, { type: "corruption_change", value: 2 }, { type: "faction_rep", factionId: "sith_academy", value: 10 }], nextNodeId: "oz_end_dark" },
        { id: "oz_silent", text: "En susurros. Y reparte conmigo lo que saques.", tone: "neutral", consequences: [{ type: "set_flag", key: "oziri_done", value: true }, { type: "add_credits", value: 450 }], nextNodeId: "oz_end_silent" },
        { id: "oz_no", text: "Mi reputación no está en venta.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    oz_end_dark: { id: "oz_end_dark", speaker: "Oziri Sath", text: "Hecho. Para mañana, tres sistemas sabrán que cruzarte es una forma elaborada de suicidio. El miedo es la única moneda que se imprime sola — y tú acabas de abrir la ceca. Un placer hacer negocios, mi señor.", options: [], autoNext: null },
    oz_end_silent: { id: "oz_end_silent", speaker: "Oziri Sath", text: "Discreción. La virtud favorita de los que llegan lejos. Aquí tienes tu parte por adelantado; considéralo una inversión en lo que llegarás a ser. Vuelve cuando tengas más historia que vender.", options: [], autoNext: null },
  },
};

export const SIDE_CONVERSATIONS: Record<string, DialogueConversation> = {
  conv_oziri: CONV_OZIRI,
  conv_dral_intro: CONV_DRAL_INTRO,
  conv_dral_after: CONV_DRAL_AFTER,
  conv_lira_plea: CONV_LIRA_PLEA,
  conv_lira_after: CONV_LIRA_AFTER,
  conv_yvane_plea: CONV_YVANE_PLEA,
  conv_sarn_vael: CONV_SARN_VAEL,
  conv_yvane_after: CONV_YVANE_AFTER,
  conv_tessa_plea: CONV_TESSA_PLEA,
  conv_slaver_vross: CONV_SLAVER_VROSS,
  conv_tessa_after: CONV_TESSA_AFTER,
  conv_korso_intro: CONV_KORSO_INTRO,
  conv_korso_after: CONV_KORSO_AFTER,
  conv_sera_plea: CONV_SERA_PLEA,
  conv_sera_after: CONV_SERA_AFTER,
  conv_refugee_plea: CONV_REFUGEE_PLEA,
  conv_survivor_choice: CONV_SURVIVOR_CHOICE,
  conv_czerka_choice: CONV_CZERKA_CHOICE,
  conv_political_choice: CONV_POLITICAL_CHOICE,
  conv_crystal_choice: CONV_CRYSTAL_CHOICE,
  conv_koro_intro: CONV_KORO_INTRO,
  conv_koro_lord: CONV_KORO_LORD,
  conv_dree_suspects: CONV_DREE_SUSPECTS,
  conv_dree_followup: CONV_DREE_FOLLOWUP,
  conv_talia_verdict: CONV_TALIA_VERDICT,
  conv_kessa_survivor: CONV_KESSA_SURVIVOR,
  conv_kessa_followup: CONV_KESSA_FOLLOWUP,
  conv_vaklu_report: CONV_VAKLU_REPORT,
  conv_renn_nervous: CONV_RENN_NERVOUS,
  conv_renn_followup: CONV_RENN_FOLLOWUP,
  conv_locke_report: CONV_LOCKE_REPORT,
  conv_kull_docks: CONV_KULL_DOCKS,
  conv_kull_followup: CONV_KULL_FOLLOWUP,
  conv_senna_plea: CONV_SENNA_PLEA,
  conv_senna_after: CONV_SENNA_AFTER,
};
