import type { DialogueConversation } from "../../engine/dialogue/dialogue-types";

/**
 * Companion dialogues — from NPC Dialogue Bible.
 *
 * Includes first encounters, romance scenes, betrayal scenes,
 * and companion-specific conversations.
 */

// ═══════════════════════════════════════════════════════════════════════
// KAELIS DREN — Fallen Jedi / Rival Acolyte
// ═══════════════════════════════════════════════════════════════════════

export const CONV_KAELIS_FIRST: DialogueConversation = {
  id: "conv_kaelis_first",
  startNodeId: "kae1",
  nodes: {
    kae1: {
      id: "kae1",
      speaker: "Kaelis",
      text: "Si has venido a matarme, hazlo rápido.",
      options: [
        {
          id: "kae1_cruel",
          text: "Quizás prefiera verte sufrir.",
          tone: "dark",
          consequences: [
            { type: "companion_affinity", companionId: "kaelis", value: -10 },
            { type: "corruption_change", value: 2 },
          ],
          nextNodeId: "kae2_cruel",
        },
        {
          id: "kae1_curious",
          text: "¿Por qué estás encarcelado?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "kae2_curious",
        },
        {
          id: "kae1_help",
          text: "Puedo ayudarte.",
          tone: "light",
          consequences: [
            { type: "companion_affinity", companionId: "kaelis", value: 10 },
          ],
          nextNodeId: "kae2_help",
        },
        {
          id: "kae1_force",
          text: "[Fuerza 5] Mírame.",
          check: { type: "force", value: 5 },
          checkLabel: "[Fuerza 5]",
          tone: "aggressive",
          consequences: [],
          nextNodeId: "kae2_force",
        },
      ],
    },
    kae2_cruel: {
      id: "kae2_cruel",
      speaker: "Kaelis",
      text: "Entonces no eres distinto de los demás. Solo otro monstruo vistiendo piel humana.",
      options: [],
      autoNext: "kae3",
    },
    kae2_curious: {
      id: "kae2_curious",
      speaker: "Kaelis",
      text: "Desafié a la Supervisora Raxis. Perdí. Me dejó aquí como ejemplo. Las cadenas son para aparentar — mi espíritu es lo que de verdad quieren quebrar.",
      options: [],
      autoNext: "kae3",
    },
    kae2_help: {
      id: "kae2_help",
      speaker: "Kaelis",
      text: "¿Ayudar? En este lugar, la ayuda siempre tiene un precio. Pero... no la rechazaré.",
      options: [],
      autoNext: "kae3",
    },
    kae2_force: {
      id: "kae2_force",
      speaker: "Kaelis",
      text: "Tus pensamientos... están llenos de rabia. Pero bajo ella... algo más. Propósito, quizás. O desesperación.",
      options: [],
      autoNext: "kae3",
    },
    kae3: {
      id: "kae3",
      speaker: "Kaelis",
      text: "Yo fui Jedi. Bueno — un estudiante. Antes de que este lugar me moliera hasta convertirme en lo que soy ahora. Si me liberas, lucharé a tu lado. Mi hoja por tu causa.",
      options: [
        {
          id: "kae3_recruit",
          text: "Tenemos un trato.",
          tone: "neutral",
          consequences: [
            { type: "set_flag", key: "kaelis_recruited", value: true },
            { type: "companion_affinity", companionId: "kaelis", value: 15 },
          ],
          nextNodeId: null,
        },
        {
          id: "kae3_refuse",
          text: "Trabajo solo.",
          tone: "neutral",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_KAELIS_ROMANCE: DialogueConversation = {
  id: "conv_kaelis_romance",
  startNodeId: "kr1",
  nodes: {
    kr1: {
      id: "kr1",
      speaker: "Kaelis",
      text: "Aún queda algo humano dentro de ti.",
      options: [
        {
          id: "kr1_deny",
          text: "No debería.",
          tone: "dark",
          consequences: [
            { type: "corruption_change", value: 1 },
          ],
          nextNodeId: "kr2_deny",
        },
        {
          id: "kr1_accept",
          text: "Quizás tú lo haces aflorar.",
          tone: "light",
          consequences: [
            { type: "companion_affinity", companionId: "kaelis", value: 15 },
            { type: "set_flag", key: "romance_kaelis", value: true },
          ],
          nextNodeId: "kr2_accept",
        },
        {
          id: "kr1_reject",
          text: "La humanidad es debilidad.",
          tone: "aggressive",
          consequences: [
            { type: "companion_affinity", companionId: "kaelis", value: -10 },
            { type: "corruption_change", value: 2 },
          ],
          nextNodeId: "kr2_reject",
        },
      ],
    },
    kr2_deny: {
      id: "kr2_deny",
      speaker: "Kaelis",
      text: "Y sin embargo aquí estás. Hablando conmigo en vez de entrenar. Eso dice más que tus palabras.",
      options: [],
      autoNext: null,
    },
    kr2_accept: {
      id: "kr2_accept",
      speaker: "Kaelis",
      text: "No digas cosas así. Aquí no. No donde puedan usarlo contra nosotros. Pero... gracias.",
      options: [],
      autoNext: null,
    },
    kr2_reject: {
      id: "kr2_reject",
      speaker: "Kaelis",
      text: "Entonces ya has perdido la batalla más importante. La que llevas dentro.",
      options: [],
      autoNext: null,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// V3X-9 — Assassin Droid
// ═══════════════════════════════════════════════════════════════════════

export const CONV_V3X9_FIRST: DialogueConversation = {
  id: "conv_v3x9_first",
  startNodeId: "vx1",
  nodes: {
    vx1: {
      id: "vx1",
      speaker: "V3X-9",
      text: "Declaración: tus probabilidades de supervivencia en Korriban son del 12,4%.",
      options: [
        {
          id: "vx1_optimistic",
          text: "Optimista.",
          tone: "neutral",
          consequences: [
            { type: "companion_affinity", companionId: "v3x9", value: 5 },
          ],
          nextNodeId: "vx2_response",
        },
        {
          id: "vx1_dismantle",
          text: "Podría desmantelarte.",
          tone: "aggressive",
          consequences: [],
          nextNodeId: "vx2_threat",
        },
        {
          id: "vx1_hire",
          text: "Necesito un asesino.",
          tone: "dark",
          consequences: [
            { type: "companion_affinity", companionId: "v3x9", value: 10 },
          ],
          nextNodeId: "vx2_hire",
        },
      ],
    },
    vx2_response: {
      id: "vx2_response",
      speaker: "V3X-9",
      text: "Aclaración: eso no fue optimismo. Fue un redondeo generoso. Tus probabilidades reales son del 11,7%.",
      options: [],
      autoNext: "vx3",
    },
    vx2_threat: {
      id: "vx2_threat",
      speaker: "V3X-9",
      text: "Corrección: 13,1%. La disposición a destruir equipo útil eleva las probabilidades de supervivencia marginalmente.",
      options: [],
      autoNext: "vx3",
    },
    vx2_hire: {
      id: "vx2_hire",
      speaker: "V3X-9",
      text: "Satisfacción: por fin, un empleador razonable. Mi anterior amo cometió el error de pedirme que... negociara.",
      options: [],
      autoNext: "vx3",
    },
    vx3: {
      id: "vx3",
      speaker: "V3X-9",
      text: "Propuesta: he estado desactivado en esta bodega de almacenamiento durante 327 años estándar. Mis protocolos de combate son plenamente funcionales. Mis protocolos sociales son... menos.",
      options: [
        {
          id: "vx3_recruit",
          text: "Estás contratado. Vámonos.",
          consequences: [
            { type: "set_flag", key: "v3x9_recruited", value: true },
            { type: "companion_affinity", companionId: "v3x9", value: 10 },
          ],
          nextNodeId: null,
        },
        {
          id: "vx3_leave",
          text: "Paso del droide asesino.",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_V3X9_HUMOR: DialogueConversation = {
  id: "conv_v3x9_humor",
  startNodeId: "vh1",
  nodes: {
    vh1: {
      id: "vh1",
      speaker: null,
      text: "V3X-9 limpia su bláster con precisión mecánica.",
      options: [
        {
          id: "vh1_ask",
          text: "¿Disfrutas matando?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "vh2",
        },
      ],
    },
    vh2: {
      id: "vh2",
      speaker: "V3X-9",
      text: "Respuesta: el 'disfrute' implica emoción. Sin embargo... eliminar objetivos orgánicos es estadísticamente relajante. Mi temperatura interna desciende 0,3 grados por baja confirmada.",
      options: [
        {
          id: "vh2_laugh",
          text: "Eso es... perturbador.",
          tone: "neutral",
          consequences: [],
          nextNodeId: "vh3",
        },
        {
          id: "vh2_approve",
          text: "Eso lo puedo respetar.",
          tone: "dark",
          consequences: [
            { type: "companion_affinity", companionId: "v3x9", value: 5 },
          ],
          nextNodeId: "vh3",
        },
      ],
    },
    vh3: {
      id: "vh3",
      speaker: "V3X-9",
      text: "Observación: tu incomodidad eleva tus niveles de cortisol. Declaración: yo encuentro eso también... estadísticamente relajante.",
      options: [],
      autoNext: null,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// SERANA VOSS — Sith Rival (recruited on Nar Shaddaa)
// ═══════════════════════════════════════════════════════════════════════

export const CONV_SERANA_FIRST: DialogueConversation = {
  id: "conv_serana_first",
  startNodeId: "ser1",
  nodes: {
    ser1: {
      id: "ser1",
      speaker: "Serana",
      text: "Otro esclavo fingiendo ser Sith.",
      options: [
        {
          id: "ser1_retort",
          text: "Y otra noble escondiéndose tras el maquillaje.",
          tone: "aggressive",
          consequences: [
            { type: "companion_affinity", companionId: "serana", value: 5 },
          ],
          nextNodeId: "ser2_retort",
        },
        {
          id: "ser1_move",
          text: "Apártate.",
          tone: "aggressive",
          consequences: [],
          nextNodeId: "ser2_move",
        },
        {
          id: "ser1_dismiss",
          text: "¿Siempre hablas tanto?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "ser2_dismiss",
        },
        {
          id: "ser1_flirt",
          text: "Esperaba algo más impresionante.",
          tone: "deceptive",
          consequences: [
            { type: "companion_affinity", companionId: "serana", value: 10 },
          ],
          nextNodeId: "ser2_flirt",
        },
      ],
    },
    ser2_retort: {
      id: "ser2_retort",
      speaker: "Serana",
      text: "Ja. Al menos tienes lengua. La mayoría de los esclavos pierden la suya junto con su dignidad. Quizás haya algo en ti, después de todo.",
      options: [],
      autoNext: "ser3",
    },
    ser2_move: {
      id: "ser2_move",
      speaker: "Serana",
      text: "Autoritario. Eso me gusta. Pero necesitarás más que actitud para sobrevivir a lo que viene.",
      options: [],
      autoNext: "ser3",
    },
    ser2_dismiss: {
      id: "ser2_dismiss",
      speaker: "Serana",
      text: "Solo cuando alguien merece el aliento. Aún te estoy evaluando.",
      options: [],
      autoNext: "ser3",
    },
    ser2_flirt: {
      id: "ser2_flirt",
      speaker: "Serana",
      text: "Cuidado. Podrías empezar a gustarme. Y eso sería muy, muy peligroso para los dos.",
      options: [],
      onEnter: [{ type: "set_flag", key: "serana_flirted", value: true }],
      autoNext: "ser3",
    },
    ser3: {
      id: "ser3",
      speaker: "Serana",
      text: "Volveremos a vernos. Cuando lo hagamos, te sugiero que decidas de qué lado estás. Del mío... o del equivocado.",
      options: [
        {
          id: "ser3_end",
          text: "Lo espero con ganas.",
          consequences: [
            { type: "set_flag", key: "serana_met", value: true },
          ],
          nextNodeId: null,
        },
      ],
    },
  },
};

export const CONV_SERANA_BETRAYAL: DialogueConversation = {
  id: "conv_serana_betrayal",
  startNodeId: "sb1",
  nodes: {
    sb1: {
      id: "sb1",
      speaker: "Serana",
      text: "Nunca fuiste más que una herramienta.",
      options: [
        {
          id: "sb1_threat",
          text: "Entonces aprende lo que ocurre cuando las herramientas se rompen.",
          tone: "aggressive",
          consequences: [
            { type: "corruption_change", value: 5 },
            { type: "companion_affinity", companionId: "serana", value: -15 },
          ],
          nextNodeId: "sb2_threat",
        },
        {
          id: "sb1_offer",
          text: "Te habría dado el Imperio.",
          tone: "light",
          consequences: [],
          nextNodeId: "sb2_offer",
        },
        {
          id: "sb1_expected",
          text: "Sabía que me traicionarías.",
          tone: "deceptive",
          consequences: [
            { type: "set_flag", key: "serana_betrayal_expected", value: true },
          ],
          nextNodeId: "sb2_expected",
        },
      ],
    },
    sb2_threat: {
      id: "sb2_threat",
      speaker: "Serana",
      text: "Entonces rómpete. Disfrutaré viéndolo.",
      options: [],
      onEnter: [
        { type: "set_flag", key: "serana_betrayed", value: true },
        { type: "start_combat", combatEncounterId: "serana_boss" },
      ],
      autoNext: null,
    },
    sb2_offer: {
      id: "sb2_offer",
      speaker: "Serana",
      text: "¿El Imperio? Ni siquiera te tienes a ti mismo. Adiós.",
      options: [],
      onEnter: [
        { type: "set_flag", key: "serana_betrayed", value: true },
        { type: "start_combat", combatEncounterId: "serana_boss" },
      ],
      autoNext: null,
    },
    sb2_expected: {
      id: "sb2_expected",
      speaker: "Serana",
      text: "Entonces eres más listo de lo que creía. No es que vaya a salvarte.",
      options: [],
      onEnter: [
        { type: "set_flag", key: "serana_betrayed", value: true },
        { type: "start_combat", combatEncounterId: "serana_boss" },
      ],
      autoNext: null,
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// TORVAK — Mandalorian
// ═══════════════════════════════════════════════════════════════════════

export const CONV_TORVAK_FIRST: DialogueConversation = {
  id: "conv_torvak_first",
  startNodeId: "tor1",
  nodes: {
    tor1: {
      id: "tor1",
      speaker: "Torvak",
      text: "Llevas un sable de luz pero te mueves como un soldado. Eso te gana un momento de mi tiempo.",
      options: [
        {
          id: "tor1_warrior",
          text: "He matado cosas más grandes que tú.",
          tone: "aggressive",
          consequences: [
            { type: "companion_affinity", companionId: "torvak", value: 10 },
          ],
          nextNodeId: "tor2_respect",
        },
        {
          id: "tor1_diplomatic",
          text: "Busco aliados, no enemigos.",
          tone: "neutral",
          consequences: [],
          nextNodeId: "tor2_cautious",
        },
        {
          id: "tor1_duel",
          text: "Demuestra tu valía. Lucha contra mí.",
          tone: "aggressive",
          consequences: [
            { type: "companion_affinity", companionId: "torvak", value: 15 },
          ],
          nextNodeId: "tor2_duel",
        },
      ],
    },
    tor2_respect: {
      id: "tor2_respect",
      speaker: "Torvak",
      text: "Bien. Entonces entiendes que la palabra no significa nada sin la acción. Mandalore quiere conocerte.",
      options: [],
      autoNext: "tor3",
    },
    tor2_cautious: {
      id: "tor2_cautious",
      speaker: "Torvak",
      text: "Los aliados se forjan en la batalla, no en la conversación. Pero te escucharé.",
      options: [],
      autoNext: "tor3",
    },
    tor2_duel: {
      id: "tor2_duel",
      speaker: "Torvak",
      text: "Eso sí es una respuesta mandaloriana. A primera sangre — sin trucos de la Fuerza.",
      options: [],
      onEnter: [{ type: "set_flag", key: "torvak_duel_accepted", value: true }],
      autoNext: "tor3",
    },
    tor3: {
      id: "tor3",
      speaker: "Torvak",
      text: "Únete a mí o no. Pero que sepas esto: cuando empiece la pelea, yo estaré al frente. Ahí es donde se forjan las leyendas.",
      options: [
        {
          id: "tor3_recruit",
          text: "Tienes un compañero.",
          consequences: [
            { type: "set_flag", key: "torvak_recruited", value: true },
            { type: "companion_affinity", companionId: "torvak", value: 10 },
          ],
          nextNodeId: null,
        },
        {
          id: "tor3_refuse",
          text: "No me interesa.",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// ECHO SHADE — Force Ghost
// ═══════════════════════════════════════════════════════════════════════

export const CONV_ECHO_FIRST: DialogueConversation = {
  id: "conv_echo_first",
  startNodeId: "echo1",
  nodes: {
    echo1: {
      id: "echo1",
      speaker: "Echo Shade",
      text: "Me oyes. Pocos seres vivos pueden. La Fuerza nos une a través del umbral de la muerte.",
      options: [
        {
          id: "echo1_accept",
          text: "¿Qué eres?",
          tone: "neutral",
          consequences: [],
          nextNodeId: "echo2",
        },
        {
          id: "echo1_dark",
          text: "¿Un fantasma? Me vendría bien un fantasma.",
          tone: "dark",
          consequences: [
            { type: "companion_affinity", companionId: "echo_shade", value: 5 },
          ],
          nextNodeId: "echo2_dark",
        },
        {
          id: "echo1_cautious",
          text: "Los espíritus mienten. ¿Por qué debería confiar en ti?",
          tone: "aggressive",
          consequences: [],
          nextNodeId: "echo2_cautious",
        },
      ],
    },
    echo2: {
      id: "echo2",
      speaker: "Echo Shade",
      text: "Soy lo que queda cuando el cuerpo muere pero la Fuerza no libera la mente. Fui un Lord Sith, una vez. Ahora soy... conocimiento sin forma.",
      options: [],
      autoNext: "echo3",
    },
    echo2_dark: {
      id: "echo2_dark",
      speaker: "Echo Shade",
      text: "Práctico. Los vivos siempre quieren usar a los muertos. Muy bien — tengo mis propias razones para ayudarte. El Triunvirato amenaza incluso a quienes están más allá de la muerte.",
      options: [],
      autoNext: "echo3",
    },
    echo2_cautious: {
      id: "echo2_cautious",
      speaker: "Echo Shade",
      text: "Hay sabiduría en la sospecha. Pero ofrezco conocimiento perdido durante milenios. Eso vale más que la confianza.",
      options: [],
      autoNext: "echo3",
    },
    echo3: {
      id: "echo3",
      speaker: "Echo Shade",
      text: "Te enseñaré lo que los vivos han olvidado. A cambio, llevarás mi propósito hacia adelante. ¿Tenemos un acuerdo?",
      options: [
        {
          id: "echo3_yes",
          text: "Enséñame.",
          consequences: [
            { type: "set_flag", key: "echo_recruited", value: true },
            { type: "companion_affinity", companionId: "echo_shade", value: 15 },
            { type: "add_xp", value: 200 },
          ],
          nextNodeId: null,
        },
        {
          id: "echo3_no",
          text: "No negocio con los muertos.",
          consequences: [],
          nextNodeId: null,
        },
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
// Export all companion dialogues
// ═══════════════════════════════════════════════════════════════════════

export const COMPANION_CONVERSATIONS: Record<string, DialogueConversation> = {
  conv_kaelis_first: CONV_KAELIS_FIRST,
  conv_kaelis_romance: CONV_KAELIS_ROMANCE,
  conv_v3x9_first: CONV_V3X9_FIRST,
  conv_v3x9_humor: CONV_V3X9_HUMOR,
  conv_serana_first: CONV_SERANA_FIRST,
  conv_serana_betrayal: CONV_SERANA_BETRAYAL,
  conv_torvak_first: CONV_TORVAK_FIRST,
  conv_echo_first: CONV_ECHO_FIRST,
};
