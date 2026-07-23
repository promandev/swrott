import type { QuestDefinition } from "../../engine/quests/quest-types";

/**
 * Galaxy side quests — chains that pay off the threads opened by the
 * galaxy/side NPC dialogues (see data/npcs/galaxy-npcs.ts and side-npcs.ts).
 *
 * Every objective flag is set either by a dialogue consequence or a zone
 * hotspot (eventFlag/victoryFlag), so the auto-tracker in game-store
 * starts and completes these without any extra wiring.
 */

export const SIDE_QUESTS: QuestDefinition[] = [
  // ── Ziost — The Frozen Choir (branching, 3 endings) ──────────────────
  {
    id: "quest_ziost_choir",
    name: "El Coro Congelado",
    description:
      "Bajo los páramos de Ziost, cientos de Sith antiguos permanecen congelados a media canción, manteniendo cerrada una puerta más vieja que el Código. El frío que la mantenía dormida está fallando. Alcanza al Director antes de la última nota — y luego decide si la canción debe ser quebrada, reclamada o encadenada.",
    category: "secondary",
    zoneId: "ziost_spaceport",
    recommendedLevel: 14,
    prereqs: [],
    objectives: [
      { id: "obj_choir_taken", description: "Acepta el encargo del archivista Sarn", flagKey: "ziost_choir_taken", optional: false },
      { id: "obj_choir_found", description: "Presencia el Coro Congelado en los páramos", flagKey: "ziost_choir_found", optional: false },
      { id: "obj_choir_conductor", description: "Silencia al Director bajo el Coro", flagKey: "ziost_conductor_slain", optional: false },
      { id: "obj_choir_verdict", description: "Decide el destino de la Canción", flagKey: "ziost_choir_resolved", optional: false },
    ],
    rewards: {
      xp: 1400,
      credits: 700,
      items: [{ itemId: "medpack_advanced", qty: 2 }],
      factionRep: [{ factionId: "sith_academy", amount: 6 }],
    },
    darkRewards: {
      xp: 1600,
      credits: 1100,
      corruption: 3,
      items: [{ itemId: "force_stim", qty: 2 }],
    },
  },

  // ── Korriban — A Matter of Debt (Dreshdae moral choice) ──────────────
  {
    id: "quest_dreshdae_debt",
    name: "Una Cuestión de Deuda",
    description:
      "Senna Vael, una acólita fracasada, debe un préstamo de Czerka que no puede pagar — y el cobrador llega al anochecer. Salda su deuda, véndela por la recompensa, o enséñale a hacer que sus acreedores la teman. Korriban observa cuál eliges.",
    category: "secondary",
    zoneId: "korriban_dreshdae",
    recommendedLevel: 2,
    prereqs: [],
    objectives: [
      { id: "obj_debt_taken", description: "Escucha la súplica de Senna", flagKey: "dreshdae_debt_taken", optional: false },
      { id: "obj_debt_resolved", description: "Salda la deuda — de un modo u otro", flagKey: "dreshdae_debt_resolved", optional: false },
    ],
    rewards: {
      xp: 350,
      credits: 150,
      items: [{ itemId: "medpack_basic", qty: 2 }],
      factionRep: [{ factionId: "smuggler_guild", amount: 5 }],
    },
    darkRewards: {
      xp: 400,
      credits: 400,
      corruption: 2,
      items: [{ itemId: "medpack_basic", qty: 1 }],
    },
  },

  // ── Korriban — Rhen's gambit (pays off the spared-acolyte thread) ─────
  {
    id: "quest_rhen_ascent",
    name: "La Jugada del Cobarde",
    description:
      "Rhen, un acólito fracasado al que perdonaste de las minas, paga la deuda con algo más escaso que la gratitud — un secreto. Oyó la ruta hacia una tumba que los Supervisores sepultaron, y lo que aguarda al final podría catapultar tu posición por encima de cada rival que alguna vez se rió de él.",
    category: "secondary",
    zoneId: "korriban_academy_interior",
    recommendedLevel: 4,
    prereqs: [],
    objectives: [
      { id: "obj_rhen_helped", description: "Enseña a Rhen la postura para sobrevivir a su prueba", flagKey: "rhen_helped", optional: false },
      { id: "obj_rhen_route", description: "Vuelve con Rhen a por lo que oyó", flagKey: "rhen_tomb_route", optional: false },
      { id: "obj_rhen_proof", description: "Reclama la prueba por la senda segura de Rhen", flagKey: "tomb_proof_taken", optional: false },
    ],
    rewards: {
      xp: 600,
      credits: 250,
      items: [{ itemId: "medpac_warfront", qty: 2 }],
      factionRep: [{ factionId: "sith_academy", amount: 5 }],
    },
  },

  // ── Korriban — the Overseer's ledger (pays off Koro's tip) ───────────
  {
    id: "quest_overseer_ledger",
    name: "El Libro del Supervisor",
    description:
      "Koro, el servil sirviente de la Academia, intercambia secretos por supervivencia. Jura que la Supervisora Raxis guarda un libro privado con la deuda y la debilidad de cada acólito tras la cámara de meditación. Hazte con él, y te harás con los hilos de la Academia misma.",
    category: "secondary",
    zoneId: "korriban_academy_interior",
    recommendedLevel: 10,
    prereqs: [],
    objectives: [
      { id: "obj_koro_tip", description: "Intimida a Koro para que hable (requiere rango de Lord Sith)", flagKey: "koro_ledger_known", optional: false },
      { id: "obj_koro_ledger", description: "Apodérate del libro oculto de la Supervisora", flagKey: "loot_done_hs_overseer_ledger", optional: false },
    ],
    rewards: {
      xp: 900,
      credits: 500,
      items: [{ itemId: "force_stim_potent", qty: 1 }],
      factionRep: [{ factionId: "sith_academy", amount: 8 }],
    },
  },

  // ── Nar Shaddaa — Cyra's bounty (pays off the hunter's contract thread) ──
  {
    id: "quest_cyra_bounty",
    name: "Cortesía Profesional",
    description:
      "Cyra Venn, la cazadora más letal de Nar Shaddaa, no puede aceptar un contrato que tiene duplicado — así que te lo cede. Un malversador del Intercambio llamado Vurl desplumó al señor del crimen equivocado y huyó a la Ciudad Baja. Sácalo de su madriguera y reparte la recompensa.",
    category: "secondary",
    zoneId: "nar_shaddaa_promenade",
    recommendedLevel: 12,
    prereqs: [],
    objectives: [
      { id: "obj_cyra_job", description: "Acepta el contrato de Cyra", flagKey: "cyra_bounty_taken", optional: false },
      { id: "obj_cyra_collar", description: "Captura al malversador Vurl en la Ciudad Baja", flagKey: "cyra_bounty_done", optional: false },
    ],
    rewards: {
      xp: 1000,
      credits: 900,
      items: [{ itemId: "combat_adrenal_surge", qty: 2 }],
      factionRep: [{ factionId: "smuggler_guild", amount: 8 }],
    },
  },

  // ── Onderon — Voss's quarry (pays off the general's distrust thread) ──
  {
    id: "quest_voss_quarry",
    name: "Sangre en la Muralla Oriental",
    description:
      "El General Voss desconfía de la Fuerza y de todo aquel que la maneja — pero una banda de saqueadores jinetes de bestias está desangrando sus patrullas, y el orgullo es un lujo que un soldado no puede permitirse. Quiebra la banda en la cantera oriental y cambiarás la opinión de un viejo sobre los de tu clase. Quizás más de uno.",
    category: "secondary",
    zoneId: "onderon_city",
    recommendedLevel: 12,
    prereqs: [],
    objectives: [
      { id: "obj_voss_met", description: "Gánate una audiencia con el General Voss", flagKey: "voss_met", optional: false },
      { id: "obj_voss_briefed", description: "Recibe el informe del general sobre la banda", flagKey: "voss_quarry_briefed", optional: false },
      { id: "obj_voss_cleared", description: "Da muerte al Cabecilla Jinete de Drexl en la cantera", flagKey: "voss_quarry_cleared", optional: false },
    ],
    rewards: {
      xp: 1100,
      credits: 600,
      items: [{ itemId: "medpac_advanced_warfront", qty: 2 }],
      factionRep: [{ factionId: "sith_academy", amount: 5 }],
    },
  },

  // ── Onderon — the traitor in the court ───────────────────────────────
  {
    id: "quest_onderon_knife",
    name: "El Cuchillo Interior",
    description:
      "Las rutas de patrulla de la Reina Talira se están filtrando a sus enemigos. Tres ministros tenían acceso; uno de ellos vendió a Onderon. Encuentra al traidor con discreción — la corona paga por adelantado, y la corona espera resultados.",
    category: "secondary",
    zoneId: "onderon_palace",
    recommendedLevel: 16,
    prereqs: [],
    objectives: [
      { id: "obj_knife_hunt", description: "Acepta el encargo de la Reina Talira", flagKey: "talia_traitor_hunt", optional: false },
      { id: "obj_knife_name", description: "Identifica al traidor entre los tres ministros", flagKey: "talia_traitor_named", optional: false },
      { id: "obj_knife_verdict", description: "Entrega tu veredicto a la Reina", flagKey: "talia_traitor_resolved", optional: false },
    ],
    rewards: {
      xp: 900,
      credits: 500,
      items: [{ itemId: "beast_rider_leathers", qty: 1 }],
    },
    darkRewards: {
      xp: 1000,
      credits: 650,
      corruption: 2,
      items: [{ itemId: "beast_rider_leathers", qty: 1 }],
    },
  },

  // ── Dxun — what stirs the nests ──────────────────────────────────────
  {
    id: "quest_dxun_nests",
    name: "Lo Que Agita los Nidos",
    description:
      "Las incursiones de drexl sobre Iziz se han triplicado y los exploradores del General Vaklu no regresan. Algo en Dxun está expulsando a las bestias de su propio terreno — halla el origen antes de que las murallas de la ciudad lleguen a su límite.",
    category: "secondary",
    zoneId: "dxun_jungle",
    recommendedLevel: 19,
    prereqs: [],
    objectives: [
      { id: "obj_nests_task", description: "Acepta el encargo de la jungla del General Vaklu", flagKey: "vaklu_jungle_task", optional: false },
      { id: "obj_nests_scout", description: "Encuentra lo que queda de la Tercera Patrulla", flagKey: "kessa_met", optional: false },
      { id: "obj_nests_cull", description: "Diezma los nidos de la cría en el viejo cauce", flagKey: "dxun_nest_culled", optional: false },
      { id: "obj_nests_source", description: "Descubre qué expulsa a las bestias desde la cresta de la tumba", flagKey: "dxun_resonance_found", optional: false },
      { id: "obj_nests_report", description: "Informa de tus hallazgos al General Vaklu", flagKey: "vaklu_jungle_done", optional: false },
    ],
    rewards: {
      xp: 1300,
      credits: 650,
      items: [{ itemId: "mando_combat_stim", qty: 2 }],
    },
  },

  // ── Telos — the smuggling ring ───────────────────────────────────────
  {
    id: "quest_telos_quiet_cargo",
    name: "Carga Silenciosa",
    description:
      "La fuerza de seguridad del Comandante Locke está demasiado mermada para tocar la red de armas que mueve carga por el módulo residencial de la Estación Ciudadela. Un contratista Sith, en cambio, no responde ante nadie.",
    category: "secondary",
    zoneId: "telos_citadel",
    recommendedLevel: 29,
    prereqs: [],
    objectives: [
      { id: "obj_cargo_task", description: "Acepta el contrato del Comandante Locke", flagKey: "locke_smuggler_task", optional: false },
      { id: "obj_cargo_lead", description: "Encuentra al hombre de los contrabandistas en los muelles", flagKey: "telos_ring_lead", optional: false },
      { id: "obj_cargo_raid", description: "Revienta el alijo tras el mamparo falso", flagKey: "telos_ring_broken", optional: false },
      { id: "obj_cargo_report", description: "Informa al Comandante Locke", flagKey: "locke_ring_reported", optional: false },
    ],
    rewards: {
      xp: 2100,
      credits: 1200,
      items: [{ itemId: "advanced_medpac_telos", qty: 3 }],
    },
  },

  // ── Nar Shaddaa — dock 9 ─────────────────────────────────────────────
  {
    id: "quest_dock9",
    name: "Las Cajas que Zumban",
    description:
      "El rumor de Zek era concreto: cajas del Intercambio en el muelle 9, marcadas como piezas de motor, que zumban de noche. Las piezas de motor no zumban. El jefe de muelle quizá conozca una forma de entrar.",
    category: "secondary",
    zoneId: "nar_shaddaa_lower",
    recommendedLevel: 13,
    prereqs: [],
    objectives: [
      { id: "obj_dock9_rumor", description: "Escucha el rumor sobre el muelle 9", flagKey: "rumor_dock9", optional: false },
      { id: "obj_dock9_access", description: "Consigue acceso al muelle del Jefe de Muelle Kull", flagKey: "dock9_access", optional: false },
      { id: "obj_dock9_raid", description: "Apodérate del cargamento del Intercambio en el muelle 9", flagKey: "dock9_crates_seized", optional: false },
      { id: "obj_dock9_manifest", description: "Averigua hacia dónde se dirigían los artefactos", flagKey: "collector_trail_found", optional: false },
    ],
    rewards: {
      xp: 850,
      credits: 400,
      items: [{ itemId: "smuggler_ring", qty: 1 }],
      factionRep: [{ factionId: "smuggler_guild", amount: 10 }],
    },
  },

  // ── Nar Shaddaa — the Collector ──────────────────────────────────────
  {
    id: "quest_collector_trail",
    name: "El Coleccionista",
    description:
      "Alguien está comprando reliquias sith al por mayor y dando caza a usuarios de la Fuerza de forma clandestina — en silencio, en efectivo, a través de capas de intermediarios. El rastro del muelle 9 conduce a un comprador en el Mercado de las Sombras. Tira del hilo.",
    category: "secondary",
    zoneId: "nar_shaddaa_market",
    recommendedLevel: 15,
    prereqs: [],
    objectives: [
      { id: "obj_coll_trail", description: "Sigue el manifiesto del muelle 9", flagKey: "collector_trail_found", optional: false },
      { id: "obj_coll_rumor_artifacts", description: "Entérate del comprador de artefactos", flagKey: "rumor_artifact_buyer", optional: true },
      { id: "obj_coll_rumor_bounty", description: "Entérate de la recompensa anónima", flagKey: "rumor_force_bounty", optional: true },
      { id: "obj_coll_buyer", description: "Enfréntate al comprador del Coleccionista", flagKey: "collector_agent_defeated", optional: false },
      { id: "obj_coll_unmask", description: "Registra el datapad del comprador", flagKey: "collector_unmasked", optional: false },
    ],
    rewards: {
      xp: 1100,
      credits: 550,
      items: [{ itemId: "credit_chip_implant", qty: 1 }],
    },
  },

  // ── Ronar Sol — the hidden Jedi's palace mission ───────────────────
  {
    id: "q_ronar_spy_mission",
    name: "Ojos en el Palacio",
    description: "Ronar Sol, un Jedi superviviente de la Purga oculto en la subciudad de Onderon, necesita información del interior del palacio de Iziz a la que no puede llegar desde las ruinas. Tu acceso a la corte es su única vía.",
    category: "secondary",
    zoneId: "onderon_undercity",
    recommendedLevel: 17,
    prereqs: [],
    objectives: [
      { id: "obj_palace_access", description: "Accede a los registros del palacio", flagKey: "ronar_palace_accessed", optional: false },
      { id: "obj_retrieve_intel", description: "Recupera la información que Ronar busca", flagKey: "ronar_intel_taken", optional: false },
      { id: "obj_deliver", description: "Lleva la información a Ronar", flagKey: "ronar_intel_delivered", optional: false },
    ],
    rewards: {
      xp: 700,
      credits: 300,
      factionRep: [{ factionId: "hidden_jedi", amount: 25 }],
    },
  },

  // ── Tessa Roan — the pawned daughter (Nar Shaddaa) ─────────────────
  {
    id: "q_pawn_flesh",
    name: "Carne de Empeño",
    description: "El Intercambio retiene a Lyra, la hija de nueve años de Tessa Roan, como aval de una deuda imposible; al amanecer la venden como esclava. Cómprala, intimida al corredor, libérala por la fuerza — o quédatela para ti.",
    category: "secondary",
    zoneId: "nar_shaddaa_lower",
    recommendedLevel: 14,
    prereqs: [],
    objectives: [
      { id: "obj_hear", description: "Escucha la súplica de Tessa Roan", flagKey: "tessa_met", optional: false },
      { id: "obj_free", description: "Saca a Lyra de las manos del corredor Vross", flagKey: "tessa_daughter_freed", optional: false },
      { id: "obj_resolve", description: "Cierra el asunto con Tessa", flagKey: "tessa_resolved", optional: false },
    ],
    rewards: { xp: 450, credits: 150, factionRep: [{ factionId: "smuggler_guild", amount: 8 }] },
    darkRewards: {
      xp: 500,
      credits: 600,
      corruption: 6,
      factionRep: [{ factionId: "smuggler_guild", amount: -10 }],
    },
  },

  // ── Dama Yvane Marr — rank/corruption-reactive court intrigue (Onderon) ──
  {
    id: "q_noble_edge",
    name: "El Filo de la Nobleza",
    description: "La Dama Yvane Marr, matriarca de una casa humillada en la corte de Iziz, quiere que doblegues a su rival Lord Sarn Vael. Cómo lo hagas depende de lo que seas: un Sith de rango puede ordenar su rendición; uno corrupto puede apoderarse de su casa; los demás deben ganar el duelo.",
    category: "secondary",
    zoneId: "onderon_city",
    recommendedLevel: 16,
    prereqs: [],
    objectives: [
      { id: "obj_audience", description: "Atiende a la Dama Yvane Marr", flagKey: "yvane_met", optional: false },
      { id: "obj_rival", description: "Doblega a Lord Sarn Vael (rango, corrupción o duelo)", flagKey: "yvane_rival_dealt", optional: false },
      { id: "obj_resolve", description: "Cobra tu pago de la Casa Marr", flagKey: "yvane_resolved", optional: false },
    ],
    rewards: { xp: 600, credits: 350 },
    darkRewards: {
      xp: 700,
      credits: 250,
      corruption: 5,
      factionRep: [{ factionId: "sith_academy", amount: 15 }],
    },
  },

  // ── Dr. Lira Venn — Czerka poisoning the restoration (Telos) ───────
  {
    id: "q_land_poison",
    name: "Veneno en la Tierra",
    description: "La Doctora Lira Venn ha probado que Czerka envenena en secreto un valle recuperado de Telos para reclamarlo y arrasarlo. Recupera las muestras del vertedero y decide su destino: la verdad, los bajos fondos, o tu propio bolsillo.",
    category: "secondary",
    zoneId: "telos_surface",
    recommendedLevel: 30,
    prereqs: [],
    objectives: [
      { id: "obj_meet", description: "Escucha a la Doctora Lira Venn", flagKey: "lira_met", optional: false },
      { id: "obj_evidence", description: "Recupera una muestra sellada del vertedero de Czerka", flagKey: "lira_evidence", optional: false },
      { id: "obj_resolve", description: "Decide qué hacer con la prueba", flagKey: "lira_resolved", optional: false },
    ],
    rewards: { xp: 800, credits: 400 },
    darkRewards: {
      xp: 850,
      credits: 1000,
      corruption: 5,
      factionRep: [{ factionId: "sith_academy", amount: 10 }],
    },
  },

  // ── Dral Karr — the exiled Mandalorian (Dxun) ──────────────────────
  {
    id: "q_exile",
    name: "El Exiliado",
    description: "Dral Karr, un mandaloriano desterrado por huir de la bestia que mató a sus hermanos de caza, quiere enfrentarse de nuevo a ella en el barranco oriental. Ayúdalo a matarla — y decide qué queda de su honor después.",
    category: "secondary",
    zoneId: "dxun_mando_camp",
    recommendedLevel: 20,
    prereqs: [],
    objectives: [
      { id: "obj_meet", description: "Habla con Dral Karr", flagKey: "dral_met", optional: false },
      { id: "obj_hunt", description: "Mata la boma de la cicatriz en el barranco oriental", flagKey: "dral_beast_slain", optional: false },
      { id: "obj_resolve", description: "Decide el destino de Dral", flagKey: "dral_resolved", optional: false },
    ],
    rewards: { xp: 500, credits: 200, factionRep: [{ factionId: "mandalorian_houses", amount: 10 }] },
    darkRewards: {
      xp: 520,
      credits: 600,
      corruption: 4,
    },
  },
];
