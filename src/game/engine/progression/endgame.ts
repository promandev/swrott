/**
 * Endgame modes — §17 "Endgame".
 *
 * Post-completion game modes:
 * - New Game+
 * - Endless Arena
 * - Weekly Bosses
 * - Nightmare Mode
 * - Ironman (enforced)
 * - Procedural Tombs
 */

export type EndgameMode =
  | "new_game_plus"
  | "endless_arena"
  | "weekly_boss"
  | "nightmare"
  | "ironman"
  | "procedural_tombs";

export interface EndgameModeDefinition {
  id: EndgameMode;
  name: string;
  description: string;
  /** Minimum level to access. */
  minLevel: number;
  /** Requires completing the main story? */
  requiresCompletion: boolean;
  /** Modifiers applied in this mode. */
  modifiers: EndgameModifier[];
}

export interface EndgameModifier {
  type: "damage_mult" | "hp_mult" | "xp_mult" | "loot_mult" | "permadeath" | "scaling_enemies" | "random_layout";
  value: number;
  description: string;
}

export const ENDGAME_MODES: EndgameModeDefinition[] = [
  {
    id: "new_game_plus",
    name: "Nueva Partida+",
    description: "Reinicia la historia con tu nivel, equipo y talentos actuales. Los enemigos se escalan a tu nivel. Nuevas opciones de diálogo.",
    minLevel: 1,
    requiresCompletion: true,
    modifiers: [
      { type: "scaling_enemies", value: 1, description: "Todos los enemigos se escalan al nivel del jugador." },
      { type: "loot_mult", value: 1.5, description: "50% increased loot quality." },
      { type: "xp_mult", value: 0.5, description: "50% reduced XP gain." },
    ],
  },
  {
    id: "endless_arena",
    name: "Arena Sin Fin",
    description: "Enfréntate a oleadas interminables de enemigos cada vez más difíciles. ¿Hasta dónde llegarás?",
    minLevel: 20,
    requiresCompletion: false,
    modifiers: [
      { type: "scaling_enemies", value: 1, description: "La dificultad de los enemigos aumenta cada oleada." },
      { type: "loot_mult", value: 2.0, description: "Botín doble." },
    ],
  },
  {
    id: "weekly_boss",
    name: "Desafío Semanal de Jefe",
    description: "Un encuentro de jefe rotatorio con mecánicas únicas y recompensas exclusivas. Se reinicia cada semana.",
    minLevel: 30,
    requiresCompletion: false,
    modifiers: [
      { type: "hp_mult", value: 3.0, description: "El jefe tiene 3× de PV." },
      { type: "damage_mult", value: 1.5, description: "El jefe inflige un 50% más de daño." },
      { type: "loot_mult", value: 3.0, description: "Triple calidad de botín." },
    ],
  },
  {
    id: "nightmare",
    name: "Modo Pesadilla",
    description: "El desafío definitivo. Todos los enemigos potenciados. Sin resurrección. Cada combate es a vida o muerte.",
    minLevel: 1,
    requiresCompletion: true,
    modifiers: [
      { type: "damage_mult", value: 2.0, description: "Los enemigos infligen el doble de daño." },
      { type: "hp_mult", value: 2.0, description: "Los enemigos tienen el doble de PV." },
      { type: "xp_mult", value: 2.0, description: "Recompensas de XP dobles." },
      { type: "loot_mult", value: 2.0, description: "Doble calidad de botín." },
    ],
  },
  {
    id: "ironman",
    name: "Modo Ironman",
    description: "Una vida. Una partida guardada. Muerte permanente. Tus decisiones son realmente permanentes.",
    minLevel: 1,
    requiresCompletion: false,
    modifiers: [
      { type: "permadeath", value: 1, description: "La muerte es permanente. La partida se borra al morir." },
      { type: "xp_mult", value: 1.25, description: "25% bonus XP." },
    ],
  },
  {
    id: "procedural_tombs",
    name: "Tumbas Procedurales",
    description: "Tumbas sith generadas aleatoriamente con enemigos, botín y jefes aleatorios. No hay dos partidas iguales.",
    minLevel: 25,
    requiresCompletion: false,
    modifiers: [
      { type: "random_layout", value: 1, description: "Disposición de mazmorra aleatoria en cada partida." },
      { type: "scaling_enemies", value: 1, description: "Los enemigos se escalan al nivel del jugador." },
      { type: "loot_mult", value: 1.75, description: "75% increased loot quality." },
    ],
  },
];

/** Possible story endings — §10 "Estructura Narrativa". */
export type StoryEnding =
  | "sith_emperor"
  | "new_triumvirate"
  | "eternal_hunger"
  | "redemption"
  | "hidden_tyrant";

export interface EndingDefinition {
  id: StoryEnding;
  name: string;
  description: string;
  /** Flags required to unlock this ending. */
  requiredFlags: string[];
}

export const STORY_ENDINGS: EndingDefinition[] = [
  {
    id: "sith_emperor",
    name: "Emperador Sith",
    description: "Destruyes al Triunvirato y reclamas el trono. La galaxia se inclina ante un nuevo Lord Oscuro.",
    requiredFlags: ["sion_defeated", "nihilus_defeated", "traya_defeated", "corruption_high"],
  },
  {
    id: "new_triumvirate",
    name: "Nuevo Triunvirato",
    description: "Reformas el Triunvirato con nuevos miembros, buscando el equilibrio mediante el poder repartido entre tres.",
    requiredFlags: ["sion_defeated", "nihilus_defeated", "traya_defeated", "companions_loyal"],
  },
  {
    id: "eternal_hunger",
    name: "Hambre Eterna",
    description: "Abrazas el vacío. Como Nihilus antes que tú, te conviertes en una herida en la Fuerza, consumiéndolo todo.",
    requiredFlags: ["nihilus_defeated", "void_corruption_100", "consumed_force"],
  },
  {
    id: "redemption",
    name: "Redención",
    description: "Rechazas el lado oscuro y buscas la redención. La senda del Jedi te llama una vez más.",
    requiredFlags: ["traya_defeated", "corruption_low", "jedi_remnant_honored"],
  },
  {
    id: "hidden_tyrant",
    name: "Tirano Oculto",
    description: "Manipulas a todas las facciones desde las sombras. Nadie conoce al verdadero gobernante de la galaxia.",
    requiredFlags: ["traya_defeated", "all_factions_exalted", "influence_high"],
  },
];
