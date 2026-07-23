import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";
import type { NpcDefinition } from "./korriban-npcs";

/**
 * Ziost NPCs — the frozen first throne of the Sith.
 *
 * Keeper Veth runs a relic stall (open_shop → ziost_relics). Archivist Sarn
 * gives the branching quest "The Frozen Choir" (quest_ziost_choir). Overseer
 * Maliss provides lore. Flags are set by dialogue consequences and zone
 * hotspots; the game-store auto-tracker handles the quest.
 */

export const ZIOST_NPCS: NpcDefinition[] = [
  {
    id: "npc_ziost_keeper",
    name: "Guardiana Veth",
    title: "Guardiana del Relicario",
    description: "Una anciana quemada por la escarcha y envuelta en capas de hilo de cortosis. Lleva cuarenta años rebuscando en las ruinas de Nueva Adasta y vende lo que el hielo entrega — a un precio que el hielo aprobaría.",
    zoneId: "ziost_spaceport",
    conversationIds: ["conv_ziost_keeper"],
  },
  {
    id: "npc_ziost_archivist",
    name: "Archivista Sarn",
    title: "Guardián del Archivo de Cristal",
    description: "Un erudito pálido y de voz suave enviado por el Archivo Sith para catalogar a los muertos de Ziost. No ha dormido en días. Sea lo que sea lo que hay en los páramos, lo oye en los dientes.",
    zoneId: "ziost_spaceport",
    conversationIds: ["conv_sarn_intro", "conv_sarn_progress", "conv_sarn_verdict"],
    conversationRules: [
      { id: "conv_sarn_verdict", requireFlag: "ziost_conductor_slain", hideIfFlag: "ziost_choir_resolved" },
      { id: "conv_sarn_progress", requireFlag: "ziost_choir_taken", hideIfFlag: "ziost_conductor_slain" },
      { id: "conv_sarn_intro", hideIfFlag: "ziost_choir_taken" },
    ],
  },
  {
    id: "npc_ziost_overseer",
    name: "Supervisora Maliss",
    title: "Custodia de Nueva Adasta",
    description: "La Sith dejada para custodiar las ruinas de Ziost. Siglos de frío la han vuelto paciente y extraña. Habla de la ciudad congelada como si pudiera oírla — porque, insiste, puede.",
    zoneId: "ziost_citadel",
    conversationIds: ["conv_maliss_lore"],
  },
];

// ── Keeper Veth — relic merchant ────────────────────────────────────────
export const CONV_ZIOST_KEEPER: DialogueConversation = {
  id: "conv_ziost_keeper",
  startNodeId: "k1",
  nodes: {
    k1: {
      id: "k1",
      speaker: "Guardiana Veth",
      text: "Cuidado con el frío, acólito — muerde más hondo que cualquier sable. Vendo lo que Nueva Adasta escupe de vuelta: estimulantes que no se congelan, cristales que los viejos Lores murieron sosteniendo, placas que recuerdan guerras más cálidas. Los créditos mantienen la lámpara encendida.",
      options: [
        { id: "k1_shop", text: "Enséñame lo que el hielo entregó.", tone: "neutral", consequences: [{ type: "open_shop", shopId: "ziost_relics" }], nextNodeId: null },
        { id: "k1_lore", text: "Cuarenta años aquí. ¿Por qué quedarse?", tone: "neutral", consequences: [], nextNodeId: "k_lore" },
        { id: "k1_leave", text: "En otro momento.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    k_lore: {
      id: "k_lore",
      speaker: "Guardiana Veth",
      text: "¿A dónde iría? La galaxia olvidó que Ziost fue el primer trono. Yo no. Alguien tiene que contar a los muertos, y los muertos de aquí — [se da golpecitos en la sien] — son mejor compañía que los vivos. Últimamente cantan. Lo oirás. Todos lo oyen ahora.",
      options: [
        { id: "k_lore_shop", text: "Enséñame tu mercancía, entonces.", tone: "neutral", consequences: [{ type: "open_shop", shopId: "ziost_relics" }], nextNodeId: null },
        { id: "k_lore_end", text: "Mantente caliente, Guardiana.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
  },
};

// ── Archivist Sarn — "The Frozen Choir" quest giver ─────────────────────
export const CONV_SARN_INTRO: DialogueConversation = {
  id: "conv_sarn_intro",
  startNodeId: "si1",
  nodes: {
    si1: {
      id: "si1",
      speaker: "Archivista Sarn",
      text: "Eres de la Academia. Bien. El Archivo me envió a catalogar las tumbas de Ziost y he catalogado exactamente una cosa: un sonido. En los páramos, cientos de Sith antiguos permanecen congelados a media canción. Han sostenido una nota durante cuatro mil años — y la nota está terminando. Cuando lo haga, algo responde. Necesito a alguien que pueda salir ahí fuera y sobrevivir.",
      options: [
        { id: "si1a", text: "¿Qué ocurre cuando la canción termina?", tone: "neutral", consequences: [], nextNodeId: "si2_explain" },
        { id: "si1b", text: "Iré al Coro. Muéstrame el camino.", tone: "neutral", consequences: [{ type: "set_flag", key: "ziost_choir_taken", value: true }], nextNodeId: "si3_accept" },
        { id: "si1c", text: "Cataloga tus propios fantasmas.", tone: "dark", consequences: [], nextNodeId: null },
      ],
    },
    si2_explain: {
      id: "si2_explain",
      speaker: "Archivista Sarn",
      text: "Una puerta se abre. El Coro no cantaba para llorar — cantaban algo para mantenerlo cerrado. Un Director, lo llaman los registros. Más antiguo que el Código, más antiguo que el primer Lord. El frío lo mantenía dormido. El frío está fallando. Alcanza al Director antes de la última nota, y la decisión de qué hacer con él recae en ti, no en él.",
      options: [
        { id: "si2_accept", text: "Entonces lo alcanzaré primero.", tone: "neutral", consequences: [{ type: "set_flag", key: "ziost_choir_taken", value: true }], nextNodeId: "si3_accept" },
        { id: "si2_no", text: "Algunas puertas deberían quedar cerradas. Incluido este recado.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    si3_accept: {
      id: "si3_accept",
      speaker: "Archivista Sarn",
      text: "A través de los páramos, pasadas las piedras erguidas. Verás el Coro — no podrás pasarlo por alto. Bajo ellos, una tumba de cristal negro. Sea lo que sea lo que encuentres en el fondo... vuelve y dímelo. O vuelve cambiado. Ambas cosas son datos.",
      options: [{ id: "si3_go", text: "Te traeré tu respuesta.", tone: "neutral", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_SARN_PROGRESS: DialogueConversation = {
  id: "conv_sarn_progress",
  startNodeId: "sp1",
  nodes: {
    sp1: {
      id: "sp1",
      speaker: "Archivista Sarn",
      text: "Sigues aquí, sigues escuchando. La nota asciende — ya la siento detrás de los ojos. El Coro está en los páramos; el Director está debajo. Por favor. Antes del último aliento de esa canción.",
      options: [{ id: "sp1_go", text: "Voy de camino.", tone: "neutral", consequences: [], nextNodeId: null }],
    },
  },
};

export const CONV_SARN_VERDICT: DialogueConversation = {
  id: "conv_sarn_verdict",
  startNodeId: "sv1",
  nodes: {
    sv1: {
      id: "sv1",
      speaker: "Archivista Sarn",
      text: "[Lo ve en ti antes de que hables.] Lo alcanzaste. El Director está en silencio — y la canción es tuya ahora, ¿verdad? Puedo oír que se detuvo. Lo que hagas con lo que estaba conteniendo... esa es la parte que el Archivo no puede decidir por ti. ¿Qué hiciste ahí abajo?",
      options: [
        {
          id: "sv_silence",
          text: "Lo destrocé. Cierto poder no es más que una herida que la galaxia aún no ha sentido.",
          tone: "light",
          consequences: [
            { type: "add_xp", value: 600 },
            { type: "faction_rep", factionId: "hidden_jedi", value: 8 },
            { type: "set_flag", key: "ziost_choir_silenced", value: true },
            { type: "set_flag", key: "ziost_choir_resolved", value: true },
          ],
          nextNodeId: "sv_silenced",
        },
        {
          id: "sv_claim",
          text: "[Oscuro] Lo absorbí en mí. La canción me responde a mí ahora.",
          tone: "dark",
          consequences: [
            { type: "add_credits", value: 800 },
            { type: "corruption_change", value: 10 },
            { type: "faction_rep", factionId: "sith_academy", value: 6 },
            { type: "set_flag", key: "ziost_choir_claimed", value: true },
            { type: "set_flag", key: "ziost_choir_resolved", value: true },
          ],
          nextNodeId: "sv_claimed",
        },
        {
          id: "sv_archive",
          text: "Está atado, no roto. Catalógalo. Que el Archivo cargue con el peso.",
          tone: "neutral",
          consequences: [
            { type: "add_xp", value: 450 },
            { type: "faction_rep", factionId: "sith_academy", value: 8 },
            { type: "set_flag", key: "ziost_choir_archived", value: true },
            { type: "set_flag", key: "ziost_choir_resolved", value: true },
          ],
          nextNodeId: "sv_archived",
        },
      ],
    },
    sv_silenced: {
      id: "sv_silenced",
      speaker: "Archivista Sarn",
      text: "[Exhala como un hombre que deja en el suelo una carga tras un largo trecho.] Cuatro mil años de canción, terminados por un acólito testarudo. El Archivo lo llamará una pérdida. Yo lo llamaré una misericordia. Ziost ya puede terminar de morir en paz. Gracias.",
      options: [{ id: "sv_sil_end", text: "Que descanse.", consequences: [], nextNodeId: null }],
    },
    sv_claimed: {
      id: "sv_claimed",
      speaker: "Archivista Sarn",
      text: "[Da un paso atrás. La escarcha de las paredes ha dejado de derretirse a tu alrededor — se extiende hacia ti.] ...Cómo no. El frío te aprecia ahora. Escribirán sobre esto en Korriban, ¿sabes? Justo antes de venir a averiguar cómo lo hiciste.",
      options: [{ id: "sv_cl_end", text: "Que vengan cantando.", tone: "dark", consequences: [], nextNodeId: null }],
    },
    sv_archived: {
      id: "sv_archived",
      speaker: "Archivista Sarn",
      text: "Atado y etiquetado. El poder con correa sigue siendo poder, y ahora es la correa del Imperio. El Consejo Oscuro recordará quién se lo entregó. Yo también. Hiciste lo prudente — más raro que lo valiente, aquí fuera.",
      options: [{ id: "sv_ar_end", text: "Catalógalo bien.", consequences: [], nextNodeId: null }],
    },
  },
};

// ── Overseer Maliss — lore ──────────────────────────────────────────────
export const CONV_MALISS_LORE: DialogueConversation = {
  id: "conv_maliss_lore",
  startNodeId: "ml1",
  nodes: {
    ml1: {
      id: "ml1",
      speaker: "Supervisora Maliss",
      text: "Bienvenido al primer trono, pequeña brasa. Antes de Korriban, antes de la Academia, los Sith se arrodillaron aquí — en Ziost, bajo este hielo. La galaxia cree que el frío mató este lugar. El frío es la única razón de que aún duerma. Baja la voz. Nueva Adasta despierta con facilidad, y sueña con que vuelvan a adorarla.",
      options: [
        { id: "ml1a", text: "¿Por qué se abandonó la capital por Korriban?", tone: "neutral", consequences: [], nextNodeId: "ml2_history" },
        { id: "ml1b", text: "Hablas de la ciudad como si estuviera viva.", tone: "neutral", consequences: [], nextNodeId: "ml2_alive" },
        { id: "ml1c", text: "Tengo asuntos abajo, no historias.", tone: "neutral", consequences: [], nextNodeId: null },
      ],
    },
    ml2_history: {
      id: "ml2_history",
      speaker: "Supervisora Maliss",
      text: "Los Lores tuvieron hambre de calor — del mundo vivo, del desierto, de los gritos. Ziost no daba más que silencio y paciencia, y los Sith nunca han tenido paciencia. Así que me lo dejaron a mí y a los muertos. Los muertos se quedaron. Los muertos siempre se quedan.",
      options: [{ id: "ml2h_end", text: "La paciencia es su propio poder.", consequences: [], nextNodeId: null }],
    },
    ml2_alive: {
      id: "ml2_alive",
      speaker: "Supervisora Maliss",
      text: "¿No está vivo quien duerme? Pon la mano sobre la piedra negra alguna noche. Estará caliente — lo único caliente de Ziost — y se alegrará de que vinieras. Ese es el momento en que más deberías temer, brasa. Cuando el trono se alegra.",
      options: [{ id: "ml2a_end", text: "Me guardaré las manos.", consequences: [], nextNodeId: null }],
    },
  },
};

export const ZIOST_CONVERSATIONS: Record<string, DialogueConversation> = {
  conv_ziost_keeper: CONV_ZIOST_KEEPER,
  conv_sarn_intro: CONV_SARN_INTRO,
  conv_sarn_progress: CONV_SARN_PROGRESS,
  conv_sarn_verdict: CONV_SARN_VERDICT,
  conv_maliss_lore: CONV_MALISS_LORE,
};
