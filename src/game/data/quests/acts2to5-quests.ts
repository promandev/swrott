import type { QuestDefinition } from "../../engine/quests/quest-types";

/**
 * Acts II-V quest definitions.
 * Act II: Shadows Across the Rim (Nar Shaddaa / Onderon)
 * Act III: Hunger of the Void (Dxun / Dantooine)
 * Act IV: Fractured Throne (Telos)
 * Act V: The Final Choice (Malachor V)
 */

// ═══════════════════════════════════════════════════════════════════════
// ACT II: SHADOWS ACROSS THE RIM (Levels 11-22)
// ═══════════════════════════════════════════════════════════════════════

export const ACT2_QUESTS: QuestDefinition[] = [
  // Main quest
  {
    id: "q_act2_shadows",
    name: "Sombras Sobre el Borde Exterior",
    description: "La influencia del Triunvirato se extiende. Sigue el rastro de un Lord Sith desde los bajos fondos de Nar Shaddaa hasta la intriga política de Onderon.",
    category: "main",
    zoneId: "nar_shaddaa_promenade",
    recommendedLevel: 11,
    prereqs: ["q_chains_of_korriban"],
    objectives: [
      { id: "obj_arrive_nar", description: "Llega a Nar Shaddaa", flagKey: "act2_arrived_nar", optional: false },
      { id: "obj_contact_informant", description: "Encuentra al informante en el Antro de Pazaak", flagKey: "act2_met_informant", optional: false },
      { id: "obj_investigate_exchange", description: "Investiga la conexión con el Intercambio", flagKey: "act2_exchange_investigated", optional: false },
      { id: "obj_confront_exchange_boss", description: "Enfréntate al Jefe del Intercambio", flagKey: "act2_exchange_boss_defeated", optional: false },
      { id: "obj_travel_onderon", description: "Sigue el rastro hasta Onderon", flagKey: "act2_arrived_onderon", optional: false },
      { id: "obj_meet_queen", description: "Audiencia con la Reina Talia", flagKey: "act2_met_queen", optional: false },
      { id: "obj_uncover_conspiracy", description: "Destapa la conspiración del General Vaklu", flagKey: "act2_vaklu_exposed", optional: false },
    ],
    rewards: { xp: 1500, credits: 800, factionRep: [{ factionId: "smuggler_guild", amount: -25 }] },
    darkRewards: { xp: 1800, credits: 1200, corruption: 5, factionRep: [{ factionId: "smuggler_guild", amount: 25 }] },
  },
  // Secondary
  {
    id: "q_bounty_board",
    name: "Tablón de Recompensas",
    description: "Acepta las recompensas publicadas en Nar Shaddaa. Objetivos peligrosos, buenos créditos.",
    category: "secondary",
    zoneId: "nar_shaddaa_promenade",
    recommendedLevel: 12,
    prereqs: [],
    objectives: [
      { id: "obj_bounty_1", description: "Completa la recompensa: Droide Rebelde", flagKey: "bounty_rogue_droid", optional: false },
      { id: "obj_bounty_2", description: "Completa la recompensa: Rakghoul Alfa", flagKey: "bounty_rakghoul_alpha", optional: false },
      { id: "obj_bounty_3", description: "Completa la recompensa: Traidor del Intercambio", flagKey: "bounty_exchange_traitor", optional: true },
    ],
    rewards: { xp: 400, credits: 600 },
  },
  {
    id: "q_underworld_connections",
    name: "Contactos en los Bajos Fondos",
    description: "Forja relaciones en los bajos fondos de Nar Shaddaa. Cada contacto es un arma.",
    category: "faction",
    zoneId: "nar_shaddaa_cantina",
    recommendedLevel: 13,
    prereqs: [],
    objectives: [
      { id: "obj_befriend_bartender", description: "Gánate al tabernero", flagKey: "uc_bartender_friend", optional: false },
      { id: "obj_deal_arms_dealer", description: "Cierra un trato con el traficante de armas", flagKey: "uc_arms_deal", optional: false },
    ],
    rewards: { xp: 300, credits: 400, factionRep: [{ factionId: "smuggler_guild", amount: 15 }] },
  },
  {
    id: "q_refugee_crisis",
    name: "Crisis de Refugiados",
    description: "Los refugiados de la Ciudad Baja necesitan ayuda — o ser explotados. Tú decides.",
    category: "secondary",
    zoneId: "nar_shaddaa_lower",
    recommendedLevel: 14,
    prereqs: [],
    objectives: [
      { id: "obj_find_refugees", description: "Encuentra el campamento de refugiados", flagKey: "rc_found_camp", optional: false },
      { id: "obj_help_or_exploit", description: "Ayuda a los refugiados o explótalos", flagKey: "rc_choice_made", optional: false },
    ],
    rewards: { xp: 250, credits: 200 },
    darkRewards: { xp: 250, credits: 500, corruption: 3 },
  },
  {
    id: "q_political_intrigue",
    name: "Intriga Política",
    description: "La política de Onderon es profunda. Elige un bando en la lucha por el poder.",
    category: "secondary",
    zoneId: "onderon_city",
    recommendedLevel: 16,
    prereqs: ["q_act2_shadows"],
    objectives: [
      { id: "obj_meet_vaklu", description: "Reúnete con el General Vaklu", flagKey: "pi_met_vaklu", optional: false },
      { id: "obj_choose_side", description: "Elige: apoya a Talia o a Vaklu", flagKey: "pi_side_chosen", optional: false },
    ],
    rewards: { xp: 500, credits: 300, factionRep: [{ factionId: "hidden_jedi", amount: 5 }] },
    darkRewards: { xp: 500, credits: 700, corruption: 4, factionRep: [{ factionId: "sith_academy", amount: 15 }] },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ACT III: HUNGER OF THE VOID (Levels 18-30)
// ═══════════════════════════════════════════════════════════════════════

export const ACT3_QUESTS: QuestDefinition[] = [
  {
    id: "q_act3_hunger",
    name: "El Hambre del Vacío",
    description: "La sombra de Darth Nihilus se cierne sobre la galaxia. Halla la fuente de su poder antes de que lo devore todo.",
    category: "main",
    zoneId: "dxun_jungle",
    recommendedLevel: 18,
    prereqs: ["q_act2_shadows"],
    objectives: [
      { id: "obj_arrive_dxun", description: "Llega a Dxun", flagKey: "act3_arrived_dxun", optional: false },
      { id: "obj_find_mandalore", description: "Busca la ayuda de Mandalore", flagKey: "act3_met_mandalore", optional: false },
      { id: "obj_sith_tomb_dxun", description: "Explora la Tumba Sith de Dxun", flagKey: "act3_tomb_explored", optional: false },
      { id: "obj_defeat_tomb_lord", description: "Derrota al Lord de la Tumba", flagKey: "act3_tomb_lord_defeated", optional: false },
      { id: "obj_travel_dantooine", description: "Sigue la pista hasta Dantooine", flagKey: "act3_arrived_dantooine", optional: false },
      { id: "obj_jedi_enclave", description: "Registra las ruinas del Enclave Jedi", flagKey: "act3_enclave_searched", optional: false },
      { id: "obj_crystal_cave", description: "Entra en la Cueva de Cristal", flagKey: "act3_crystal_cave", optional: false },
      { id: "obj_nihilus_vision", description: "Presencia el hambre de Nihilus en una visión de la Fuerza", flagKey: "act3_nihilus_vision", optional: false },
    ],
    rewards: { xp: 3000, credits: 1500 },
    darkRewards: { xp: 3500, credits: 1000, corruption: 8, items: [{ itemId: "dark_holocron_fragment", qty: 1 }] },
  },
  {
    id: "q_mandalorian_honor",
    name: "Honor Mandaloriano",
    description: "Demuestra tu valía a los mandalorianos mediante pruebas de combate.",
    category: "faction",
    zoneId: "dxun_mando_camp",
    recommendedLevel: 20,
    prereqs: [],
    objectives: [
      { id: "obj_trial_combat", description: "Gana la prueba de combate", flagKey: "mh_combat_trial", optional: false },
      { id: "obj_trial_hunt", description: "Completa la cacería de la bestia", flagKey: "mh_beast_hunt", optional: false },
      { id: "obj_trial_honor", description: "Supera la prueba del honor", flagKey: "mh_honor_trial", optional: true },
    ],
    rewards: { xp: 600, credits: 300, factionRep: [{ factionId: "mandalorian_houses", amount: 30 }] },
  },
  {
    id: "q_crystal_heart",
    name: "El Corazón de Cristal",
    description: "En las profundidades de la Cueva de Cristal de Dantooine yace un cristal de inmenso poder. Pero ¿qué duerme junto a él?",
    category: "secondary",
    zoneId: "dantooine_crystal_cave",
    recommendedLevel: 24,
    prereqs: [],
    objectives: [
      { id: "obj_find_crystal", description: "Encuentra el Corazón de Cristal", flagKey: "ch_found_crystal", optional: false },
      { id: "obj_crystal_choice", description: "Sintoniza o corrompe el cristal", flagKey: "ch_crystal_choice", optional: false },
    ],
    rewards: { xp: 500, items: [{ itemId: "dantooine_crystal", qty: 1 }] },
    darkRewards: { xp: 550, credits: 300, corruption: 5, items: [{ itemId: "dantooine_crystal", qty: 1 }, { itemId: "corrupted_shard", qty: 1 }] },
  },
  {
    id: "q_jedi_secrets",
    name: "Secretos Jedi",
    description: "El subnivel del Enclave guarda secretos Jedi. Algunos fueron sellados por buenas razones.",
    category: "secondary",
    zoneId: "dantooine_sublevel",
    recommendedLevel: 25,
    prereqs: [],
    objectives: [
      { id: "obj_access_sublevel", description: "Accede al Subnivel del Enclave", flagKey: "js_sublevel_access", optional: false },
      { id: "obj_jedi_archives", description: "Registra los Archivos Jedi", flagKey: "js_archives_searched", optional: false },
      { id: "obj_sealed_vault", description: "Abre la Cámara Sellada", flagKey: "js_vault_opened", optional: true },
    ],
    rewards: { xp: 700, factionRep: [{ factionId: "hidden_jedi", amount: 20 }] },
    darkRewards: { xp: 800, corruption: 4, items: [{ itemId: "dark_holocron_fragment", qty: 1 }], factionRep: [{ factionId: "sith_academy", amount: 15 }] },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ACT IV: FRACTURED THRONE (Levels 28-38)
// ═══════════════════════════════════════════════════════════════════════

export const ACT4_QUESTS: QuestDefinition[] = [
  {
    id: "q_act4_throne",
    name: "El Trono Fracturado",
    description: "Darth Sion consolida su poder. El Imperio Sith se fractura. Solo a través de Telos podrás alcanzar la verdad.",
    category: "main",
    zoneId: "telos_citadel",
    recommendedLevel: 28,
    prereqs: ["q_act3_hunger"],
    objectives: [
      { id: "obj_arrive_telos", description: "Llega a la Estación Ciudadela", flagKey: "act4_arrived_telos", optional: false },
      { id: "obj_station_commander", description: "Reúnete con el Comandante de la Estación", flagKey: "act4_met_commander", optional: false },
      { id: "obj_surface_mission", description: "Desciende a la superficie de Telos", flagKey: "act4_surface_descended", optional: false },
      { id: "obj_rakata_lab", description: "Descubre el Laboratorio Rakata", flagKey: "act4_rakata_found", optional: false },
      { id: "obj_rakata_construct", description: "Derrota al Constructo Rakata", flagKey: "act4_construct_defeated", optional: false },
      { id: "obj_learn_truth", description: "Descubre la verdad sobre los orígenes del Triunvirato", flagKey: "act4_truth_learned", optional: false },
    ],
    rewards: { xp: 5000, credits: 2500, items: [{ itemId: "rakata_blade", qty: 1 }] },
    darkRewards: { xp: 6000, credits: 2000, corruption: 10, items: [{ itemId: "rakata_mind_trap", qty: 1 }] },
  },
  {
    id: "q_czerka_dealings",
    name: "Tratos con Czerka",
    description: "La Corporación Czerka tiene intereses en Telos. Trabaja con ellos o contra ellos.",
    category: "faction",
    zoneId: "telos_citadel",
    recommendedLevel: 29,
    prereqs: [],
    objectives: [
      { id: "obj_czerka_contact", description: "Contacta con el representante de Czerka", flagKey: "cd_czerka_contact", optional: false },
      { id: "obj_czerka_mission", description: "Completa la misión de Czerka", flagKey: "cd_czerka_mission", optional: false },
      { id: "obj_czerka_betray", description: "Traiciona o ayuda a Czerka", flagKey: "cd_czerka_choice", optional: false },
    ],
    rewards: { xp: 800, credits: 1000, factionRep: [{ factionId: "smuggler_guild", amount: 25 }] },
    darkRewards: { xp: 800, credits: 1800, corruption: 4, factionRep: [{ factionId: "smuggler_guild", amount: 10 }] },
  },
  {
    id: "q_surface_survivors",
    name: "Supervivientes de la Superficie",
    description: "Hay gente que sobrevive en la devastada superficie de Telos. Necesitan suministros — o ser eliminados.",
    category: "secondary",
    zoneId: "telos_surface",
    recommendedLevel: 30,
    prereqs: [],
    objectives: [
      { id: "obj_find_survivors", description: "Encuentra el asentamiento de la superficie", flagKey: "ss_settlement_found", optional: false },
      { id: "obj_survivor_choice", description: "Ayuda o elimina a los supervivientes", flagKey: "ss_choice_made", optional: false },
    ],
    rewards: { xp: 600, credits: 400 },
    darkRewards: { xp: 600, credits: 800, corruption: 4 },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ACT V: THE FINAL CHOICE (Levels 35-50)
// ═══════════════════════════════════════════════════════════════════════

export const ACT5_QUESTS: QuestDefinition[] = [
  {
    id: "q_act5_final_choice",
    name: "La Elección Final",
    description: "Malachor V aguarda. El Triunvirato debe caer — pero ¿quién se alzará para ocupar su lugar?",
    category: "main",
    zoneId: "malachor_surface",
    recommendedLevel: 35,
    prereqs: ["q_act4_throne"],
    objectives: [
      { id: "obj_arrive_malachor", description: "Llega a Malachor V", flagKey: "act5_arrived_malachor", optional: false },
      { id: "obj_navigate_surface", description: "Atraviesa la superficie destrozada", flagKey: "act5_surface_navigated", optional: false },
      { id: "obj_trayus_depths", description: "Desciende a las Profundidades de Trayus", flagKey: "act5_depths_descended", optional: false },
      { id: "obj_defeat_sion", description: "Derrota a Darth Sion", flagKey: "sion_defeated", optional: false },
      { id: "obj_defeat_nihilus", description: "Derrota a Darth Nihilus", flagKey: "nihilus_defeated", optional: false },
      { id: "obj_reach_core", description: "Alcanza el Núcleo de Trayus", flagKey: "act5_core_reached", optional: false },
      { id: "obj_final_choice", description: "Toma tu decisión final", flagKey: "act5_final_choice_made", optional: false },
      { id: "obj_defeat_traya", description: "Derrota a Darth Traya", flagKey: "traya_defeated", optional: false },
    ],
    rewards: { xp: 10000, credits: 5000 },
    darkRewards: { xp: 12000, credits: 3000, corruption: 15 },
  },
  {
    id: "q_ghost_ship",
    name: "La Nave Fantasma",
    description: "Un crucero de la República congelado en la gravedad de Malachor. Los últimos momentos de la tripulación se conservan — y se repiten.",
    category: "secondary",
    zoneId: "malachor_ghost_ship",
    recommendedLevel: 40,
    prereqs: [],
    objectives: [
      { id: "obj_board_ship", description: "Aborda el crucero fantasma", flagKey: "gs_boarded", optional: false },
      { id: "obj_ghost_captain", description: "Enfréntate al Capitán Fantasma", flagKey: "gs_captain_defeated", optional: false },
      { id: "obj_learn_history", description: "Descubre la verdad sobre el Generador de Sombra de Masa", flagKey: "gs_history_learned", optional: true },
    ],
    rewards: { xp: 2000, credits: 1000 },
  },
  {
    id: "q_sion_path",
    name: "La Senda del Dolor",
    description: "Sion aguarda en su arena. Para derrotarlo, debes comprender que el dolor es su fuerza — y su debilidad.",
    category: "secondary",
    zoneId: "malachor_trayus",
    recommendedLevel: 45,
    prereqs: [],
    objectives: [
      { id: "obj_enter_arena", description: "Entra en la Arena de Sion", flagKey: "sp_arena_entered", optional: false },
      { id: "obj_sion_rounds", description: "Sobrevive a la regeneración de Sion (3 fases)", flagKey: "sp_sion_phases", optional: false },
    ],
    rewards: { xp: 3000, items: [{ itemId: "sion_lightsaber", qty: 1 }] },
  },
  {
    id: "q_nihilus_void",
    name: "Hacia el Vacío",
    description: "El hambre de Nihilus no tiene fondo. Solo cortando su conexión con la Fuerza podrá ser destruido.",
    category: "secondary",
    zoneId: "malachor_trayus",
    recommendedLevel: 47,
    prereqs: ["q_sion_path"],
    objectives: [
      { id: "obj_enter_void", description: "Entra en el Vacío de Nihilus", flagKey: "nv_entered", optional: false },
      { id: "obj_resist_drain", description: "Resiste el drenaje de Nihilus", flagKey: "nv_resisted", optional: false },
    ],
    rewards: { xp: 4000, items: [{ itemId: "nihilus_mask_fragment", qty: 1 }] },
  },
];

// ═══════════════════════════════════════════════════════════════════════
// COMPANION LOYALTY QUESTS
// ═══════════════════════════════════════════════════════════════════════

export const COMPANION_QUESTS: QuestDefinition[] = [
  {
    id: "q_loyalty_kaelis",
    name: "Honor Entre Sith",
    description: "Kaelis lucha con el código Sith. Ayúdale a encontrar su propio camino — o destruye sus dudas.",
    category: "companion",
    zoneId: "korriban_academy_interior",
    recommendedLevel: 5,
    prereqs: [],
    objectives: [
      { id: "obj_kaelis_talk", description: "Habla con Kaelis sobre su pasado", flagKey: "lk_talked", optional: false },
      { id: "obj_kaelis_trial", description: "Afronta su prueba junto a él", flagKey: "lk_trial_complete", optional: false },
    ],
    rewards: { xp: 200 },
  },
  {
    id: "q_loyalty_v3x9",
    name: "Núcleo de Memoria",
    description: "Los bancos de memoria de V3X-9 guardan registros fragmentados de su amo original. Ayúdale a restaurarlos — o a borrarlos.",
    category: "companion",
    zoneId: "nar_shaddaa_market",
    recommendedLevel: 14,
    prereqs: [],
    objectives: [
      { id: "obj_v3x_parts", description: "Encuentra piezas de repuesto para el núcleo de memoria", flagKey: "lv_parts_found", optional: false },
      { id: "obj_v3x_restore", description: "Restaura o borra el núcleo de memoria", flagKey: "lv_core_choice", optional: false },
    ],
    rewards: { xp: 400 },
  },
  {
    id: "q_loyalty_serana",
    name: "Entre la Luz y la Oscuridad",
    description: "El maestro Jedi de Serana podría seguir con vida. Hallar la verdad podría redimirla — o consumar su caída.",
    category: "companion",
    zoneId: "dantooine_enclave",
    recommendedLevel: 22,
    prereqs: [],
    objectives: [
      { id: "obj_serana_clue", description: "Encuentra pistas sobre el maestro de Serana", flagKey: "ls_clue_found", optional: false },
      { id: "obj_serana_truth", description: "Descubre la verdad", flagKey: "ls_truth_revealed", optional: false },
      { id: "obj_serana_choice", description: "Guía la decisión de Serana", flagKey: "ls_choice_made", optional: false },
    ],
    rewards: { xp: 700 },
  },
  {
    id: "q_loyalty_torvak",
    name: "El Camino Mandaloriano",
    description: "El clan de Torvak fue destruido. Busca venganza. ¿Es justicia u obsesión?",
    category: "companion",
    zoneId: "dxun_mando_camp",
    recommendedLevel: 24,
    prereqs: [],
    objectives: [
      { id: "obj_torvak_target", description: "Ayuda a Torvak a encontrar su objetivo", flagKey: "lt_target_found", optional: false },
      { id: "obj_torvak_confrontation", description: "Enfréntate al traidor", flagKey: "lt_confrontation", optional: false },
    ],
    rewards: { xp: 600, factionRep: [{ factionId: "mandalorian_houses", amount: 20 }] },
  },
  {
    id: "q_loyalty_echo",
    name: "Ecos del Pasado",
    description: "El artefacto que vincula a Sombra del Eco se está deteriorando. Libéralo — o vincúlalo con más fuerza.",
    category: "companion",
    zoneId: "malachor_depths",
    recommendedLevel: 38,
    prereqs: [],
    objectives: [
      { id: "obj_echo_artifact", description: "Encuentra el núcleo del artefacto vinculante", flagKey: "le_artifact_found", optional: false },
      { id: "obj_echo_choice", description: "Libera o revincula a Sombra del Eco", flagKey: "le_choice_made", optional: false },
    ],
    rewards: { xp: 1500 },
  },
];
