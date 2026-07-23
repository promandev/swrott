import type { QuestDefinition } from "../../engine/quests/quest-types";

/**
 * Act I: "Chains of Korriban" — all 10 missions.
 * 1 main quest + 9 secondary quests.
 *
 * Source: Master Design Bible §12.
 */

export const ACT1_QUESTS: QuestDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════
  // MAIN QUEST
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "q_chains_of_korriban",
    name: "Cadenas de Korriban",
    description: "Sobrevive a la Academia Sith. Demuestra tu valía ante tu maestro. Rompe tus cadenas — o fórjalas aún más fuertes.",
    category: "main",
    zoneId: "korriban_academy_interior",
    recommendedLevel: 1,
    prereqs: [],
    objectives: [
      { id: "obj_arrive_academy", description: "Llega a la Academia Sith", flagKey: "main_arrived_academy", optional: false },
      { id: "obj_meet_voren", description: "Reúnete con Darth Voren", flagKey: "main_met_voren", optional: false },
      { id: "obj_survive_trial", description: "Sobrevive a la Prueba de Sangre", flagKey: "main_trial_blood", optional: false },
      { id: "obj_explore_tomb", description: "Explora la Tumba de Ajunta Pall", flagKey: "main_entered_tomb", optional: false },
      { id: "obj_defeat_guardian", description: "Derrota al Guardián de la Tumba", flagKey: "main_guardian_defeated", optional: false },
      { id: "obj_ritual_duel", description: "Duelo Ritual contra Darth Voren", flagKey: "main_voren_duel", optional: false },
    ],
    rewards: {
      xp: 500,
      credits: 300,
      items: [{ itemId: "crimson_fang", qty: 1 }],
      factionRep: [{ factionId: "sith_academy", amount: 50 }],
    },
    darkRewards: {
      xp: 600,
      credits: 200,
      corruption: 3,
      factionRep: [{ factionId: "sith_academy", amount: 75 }],
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECONDARY QUESTS
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "q_pest_control",
    name: "Control de Plagas",
    description: "Los túneles inferiores están infestados de babosas k'lor. Extermínalas antes de que alcancen los campos de entrenamiento.",
    category: "secondary",
    zoneId: "korriban_mines",
    recommendedLevel: 1,
    prereqs: [],
    objectives: [
      { id: "obj_kill_slugs", description: "Mata 5 babosas k'lor", flagKey: "pest_slugs_killed_5", optional: false },
      { id: "obj_destroy_nest", description: "Destruye el nido", flagKey: "pest_nest_destroyed", optional: false },
      { id: "obj_queen_slug", description: "Derrota a la Babosa k'lor Reina", flagKey: "pest_queen_killed", optional: true },
    ],
    rewards: { xp: 80, credits: 50 },
  },
  {
    id: "q_the_archivist",
    name: "La Petición del Archivista",
    description: "El archivista Kheln necesita recuperar textos antiguos de las tumbas exteriores. El conocimiento que guardan podría cambiarlo todo.",
    category: "secondary",
    zoneId: "korriban_academy_interior",
    recommendedLevel: 2,
    prereqs: ["q_pest_control"],
    objectives: [
      { id: "obj_find_texts", description: "Recupera 3 textos sith antiguos", flagKey: "archivist_texts_found", optional: false },
      { id: "obj_return_texts", description: "Devuelve los textos a Kheln", flagKey: "archivist_texts_returned", optional: false },
      { id: "obj_decipher", description: "Ayuda a Kheln a descifrar el pasaje prohibido", flagKey: "archivist_deciphered", optional: true },
    ],
    rewards: {
      xp: 120,
      credits: 80,
      items: [{ itemId: "relic_broken_holocron", qty: 1 }],
    },
  },
  {
    id: "q_rivals_edge",
    name: "La Ventaja del Rival",
    description: "Otro acólito, Daryth, te desafía abiertamente. Derrótalo o humíllalo en la arena de entrenamiento.",
    category: "secondary",
    zoneId: "korriban_arena",
    recommendedLevel: 2,
    prereqs: [],
    objectives: [
      { id: "obj_accept_duel", description: "Acepta el desafío de Daryth", flagKey: "rival_accepted", optional: false },
      { id: "obj_defeat_daryth", description: "Derrota a Daryth en la arena", flagKey: "rival_daryth_defeated", optional: false },
    ],
    rewards: { xp: 100, credits: 40, factionRep: [{ factionId: "sith_academy", amount: 10 }] },
  },
  {
    id: "q_whispers_dark",
    name: "Susurros en la Oscuridad",
    description: "Voces extrañas resuenan desde el ala sellada de la Academia. Investiga su origen.",
    category: "secondary",
    zoneId: "korriban_academy_interior",
    recommendedLevel: 3,
    prereqs: [],
    objectives: [
      { id: "obj_find_sealed", description: "Encuentra la entrada del ala sellada", flagKey: "whispers_entrance", optional: false },
      { id: "obj_unseal", description: "Rompe el sello antiguo", flagKey: "whispers_seal_broken", optional: false },
      { id: "obj_confront_spirit", description: "Enfréntate al espíritu sith del interior", flagKey: "whispers_spirit", optional: false },
    ],
    rewards: { xp: 150, credits: 60, items: [{ itemId: "mat_dark_essence", qty: 2 }] },
  },
  {
    id: "q_tuk_ata_hunt",
    name: "La Caza del Tuk'ata",
    description: "Las manadas de tuk'ata del Valle se vuelven más osadas. Un supervisor quiere eliminado al alfa.",
    category: "secondary",
    zoneId: "korriban_valley",
    recommendedLevel: 3,
    prereqs: [],
    objectives: [
      { id: "obj_track_alpha", description: "Rastrea al tuk'ata alfa", flagKey: "tukkata_tracked", optional: false },
      { id: "obj_kill_alpha", description: "Mata al tuk'ata alfa", flagKey: "tukkata_alpha_killed", optional: false },
      { id: "obj_tame", description: "Intenta domar a un cachorro (Fuerza 7)", flagKey: "tukkata_pup_tamed", optional: true },
    ],
    rewards: { xp: 130, credits: 70 },
  },
  {
    id: "q_slave_uprising",
    name: "Alzamiento de Esclavos",
    description: "Los esclavos de la mina traman una rebelión. Ayúdalos — o aplástalos y gánate el favor de tu maestro.",
    category: "secondary",
    zoneId: "korriban_mines",
    recommendedLevel: 4,
    prereqs: [],
    objectives: [
      { id: "obj_discover_plot", description: "Descubre el plan de los esclavos", flagKey: "slave_plot_discovered", optional: false },
      { id: "obj_choose_side", description: "Elige: ayuda o traiciona a los esclavos", flagKey: "slave_choice_made", optional: false },
      { id: "obj_resolve", description: "Resuelve el alzamiento", flagKey: "slave_resolved", optional: false },
    ],
    rewards: { xp: 200, credits: 100 },
    darkRewards: {
      xp: 200,
      credits: 150,
      corruption: 2,
      factionRep: [{ factionId: "sith_academy", amount: 20 }],
    },
  },
  {
    id: "q_tomb_raiders",
    name: "Saqueadores de Tumbas",
    description: "Unos contrabandistas han estado saqueando artefactos sith de las tumbas exteriores. Dales caza.",
    category: "secondary",
    zoneId: "korriban_valley",
    recommendedLevel: 4,
    prereqs: ["q_the_archivist"],
    objectives: [
      { id: "obj_find_trail", description: "Encuentra el rastro de los contrabandistas", flagKey: "raiders_trail", optional: false },
      { id: "obj_confront_smugglers", description: "Enfréntate a los contrabandistas", flagKey: "raiders_confronted", optional: false },
      { id: "obj_recover_artifacts", description: "Recupera los artefactos robados", flagKey: "raiders_artifacts", optional: false },
    ],
    rewards: { xp: 180, credits: 120, factionRep: [{ factionId: "smuggler_guild", amount: -15 }] },
  },
  {
    id: "q_power_within",
    name: "El Poder Interior",
    description: "Una cámara de meditación en las profundidades de la Academia alberga una prueba de voluntad. Pocos sobreviven. Ninguno sale igual.",
    category: "secondary",
    zoneId: "korriban_academy_interior",
    recommendedLevel: 5,
    prereqs: ["q_whispers_dark"],
    objectives: [
      { id: "obj_enter_chamber", description: "Entra en la cámara de meditación", flagKey: "power_entered", optional: false },
      { id: "obj_face_vision", description: "Enfréntate a tu visión interior", flagKey: "power_vision", optional: false },
      { id: "obj_make_choice", description: "Toma la decisión final", flagKey: "power_choice", optional: false },
    ],
    rewards: { xp: 250, credits: 50, corruption: 1 },
  },
  {
    id: "q_ancient_weapon",
    name: "El Arma Antigua",
    description: "Las leyendas hablan de un arma forjada por los primeros Lores Sith, oculta bajo la Academia. Encuéntrala.",
    category: "secondary",
    zoneId: "korriban_tomb",
    recommendedLevel: 6,
    prereqs: ["q_tomb_raiders", "q_power_within"],
    objectives: [
      { id: "obj_find_clues", description: "Reúne los 3 fragmentos de pista", flagKey: "weapon_clues_3", optional: false },
      { id: "obj_open_vault", description: "Abre la cámara antigua", flagKey: "weapon_vault_open", optional: false },
      { id: "obj_claim_weapon", description: "Reclama el arma", flagKey: "weapon_claimed", optional: false },
    ],
    rewards: {
      xp: 300,
      credits: 200,
      items: [{ itemId: "crimson_fang", qty: 1 }],
    },
  },

  // ── SECONDARY: The Deserter ────────────────────────────────────────
  {
    id: "q_the_deserter",
    name: "El Desertor",
    description: "Un acólito fracasado llamado Thane se oculta en Dreshdae, marcado y perseguido. La Academia paga bien por los desertores — pero cada decisión en Korriban es un espejo.",
    category: "secondary",
    zoneId: "korriban_dreshdae",
    recommendedLevel: 2,
    prereqs: [],
    objectives: [
      { id: "obj_find_deserter", description: "Encuentra al desertor oculto en Dreshdae", flagKey: "deserter_found", optional: false },
      { id: "obj_decide_fate", description: "Decide el destino de Thane", flagKey: "deserter_resolved", optional: false },
    ],
    rewards: { xp: 150, credits: 50 },
    darkRewards: {
      xp: 150,
      credits: 250,
      corruption: 4,
      factionRep: [{ factionId: "sith_academy", amount: 15 }],
    },
  },

  // ── SECONDARY: Hunt of the Lord of Hate ────────────────────────────
  {
    id: "q_tulak_hord",
    name: "La Bestia de Tulak Hord",
    description: "Algo antiguo anida en la tumba del mayor duelista sith que jamás existió — un terentatek, alimentado durante siglos con sangre sensible a la Fuerza. Matarlo grabaría tu nombre en la leyenda de la Academia.",
    category: "secondary",
    zoneId: "korriban_tomb_tulak",
    recommendedLevel: 7,
    prereqs: [],
    objectives: [
      { id: "obj_learn_tomb", description: "Averigua la ubicación de la tumba de Tulak Hord", flagKey: "tulak_tomb_known", optional: false },
      { id: "obj_touch_altar", description: "Comulga con el Altar del Odio", flagKey: "tulak_altar_touched", optional: true },
      { id: "obj_slay_terentatek", description: "Da muerte al terentatek", flagKey: "terentatek_slain", optional: false },
    ],
    rewards: {
      xp: 500,
      credits: 150,
      items: [{ itemId: "mat_dark_essence", qty: 3 }],
      factionRep: [{ factionId: "sith_academy", amount: 25 }],
    },
  },

  // ── SECONDARY: The Broken Holocron ─────────────────────────────────
  {
    id: "q_the_broken_holocron",
    name: "El Holocrón Roto",
    description: "Se ha avistado un holocrón sith agrietado en manos de contrabandistas. Su contenido podría rehacer la estructura de poder de la Academia — o ser destruido antes de que alguien haga mal uso de él.",
    category: "secondary",
    zoneId: "korriban_valley",
    recommendedLevel: 4,
    prereqs: ["q_chains_of_korriban"],
    objectives: [
      {
        id: "obj_holocron_trail",
        description: "Localiza al contrabandista que tiene el holocrón",
        flagKey: "holocron_smuggler_found",
        optional: false,
      },
      {
        id: "obj_holocron_interrogate",
        description: "Interroga al contrabandista para descubrir el origen del holocrón",
        flagKey: "holocron_origin_known",
        optional: false,
      },
      {
        id: "obj_holocron_ambush",
        description: "Sobrevive a la emboscada en el punto de intercambio",
        flagKey: "holocron_ambush_survived",
        optional: false,
      },
      {
        id: "obj_holocron_choice",
        description: "Decide el destino del holocrón",
        flagKey: "holocron_choice_made",
        optional: false,
      },
      {
        id: "obj_holocron_decode",
        description: "Descifra el mensaje oculto del holocrón (opcional)",
        flagKey: "holocron_decoded",
        optional: true,
      },
    ],
    rewards: {
      xp: 350,
      credits: 250,
      items: [{ itemId: "ancient_shard", qty: 2 }],
    },
    darkRewards: {
      xp: 400,
      credits: 100,
      corruption: 4,
      items: [{ itemId: "corrupted_shard", qty: 1 }],
      factionRep: [{ factionId: "sith_academy", amount: 30 }],
    },
  },

  // ── SECONDARY: The Arena Trials (Dregg) ────────────────────────────
  {
    id: "q_arena_trials",
    name: "Las Pruebas de la Arena",
    description: "El maestro de arena Dregg dirige las pruebas de combate legítimas de Korriban: Iniciado, Guerrero, Verdugo. Gánalas las tres y la Academia tomará nota de tu nombre.",
    category: "secondary",
    zoneId: "korriban_arena",
    recommendedLevel: 3,
    prereqs: [],
    objectives: [
      { id: "obj_initiate", description: "Gana la prueba de Iniciado", flagKey: "arena_initiate_won", optional: false },
      { id: "obj_warrior", description: "Gana la prueba de Guerrero", flagKey: "arena_warrior_won", optional: false },
      { id: "obj_executioner", description: "Gana la prueba de Verdugo", flagKey: "arena_executioner_won", optional: false },
    ],
    rewards: {
      xp: 220,
      credits: 150,
      items: [{ itemId: "wb_serration_blade", qty: 1 }, { itemId: "combat_adrenal_surge", qty: 2 }],
      factionRep: [{ factionId: "sith_academy", amount: 15 }],
    },
  },
  {
    id: "q_arena_trials_express",
    name: "Las Pruebas de la Arena: Sin Descanso",
    description: "Has retado a Dregg a enfrentarte a las tres pruebas de una sola vez, sin pausa entre ellas. Si caes, pierdes todo el reconocimiento — y parte del orgullo.",
    category: "secondary",
    zoneId: "korriban_arena",
    recommendedLevel: 5,
    prereqs: [],
    objectives: [
      { id: "obj_gauntlet", description: "Sobrevive a las tres pruebas seguidas", flagKey: "arena_express_won", optional: false },
    ],
    rewards: {
      xp: 400,
      credits: 250,
      items: [{ itemId: "wb_serration_blade", qty: 1 }],
      factionRep: [{ factionId: "sith_academy", amount: 25 }],
    },
  },

  // ── SECONDARY: What the Tomb Kept Silent (Sera Vant) ───────────────
  {
    id: "q_silent_tomb",
    name: "Lo que Calló la Tumba",
    description: "Sera Vant, una sirvienta de Dreshdae, cree que su hermano Joren no murió en una prueba de la Academia, sino asesinado. Le debes la verdad — y la decisión de qué hacer con ella.",
    category: "secondary",
    zoneId: "korriban_dreshdae",
    recommendedLevel: 3,
    prereqs: [],
    objectives: [
      { id: "obj_hear", description: "Escucha la súplica de Sera Vant", flagKey: "sera_met", optional: false },
      { id: "obj_truth", description: "Halla cómo murió Joren en las minas", flagKey: "sera_truth_found", optional: false },
      { id: "obj_resolve", description: "Decide qué hacer con la verdad", flagKey: "sera_resolved", optional: false },
    ],
    rewards: { xp: 180, credits: 80 },
    darkRewards: {
      xp: 220,
      credits: 400,
      corruption: 4,
      factionRep: [{ factionId: "sith_academy", amount: 10 }],
    },
  },
];

/** Quick quest lookup. */
export const QUEST_MAP = new Map(ACT1_QUESTS.map((q) => [q.id, q]));
