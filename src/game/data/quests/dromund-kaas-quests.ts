import type { QuestDefinition } from "../../engine/quests/quest-types";

/**
 * Dromund Kaas — Act I.5 quest chains (Levels 8-12).
 *
 * Three interlocking arcs:
 *  1. The Dark Temple arc (Darth Seris → the Temple → the Sanctum)
 *  2. The Council intrigue arc (Vex → Agent Veyra → choosing a patron)
 *  3. Side work: jungle hunts and the Undercroft disappearances.
 */

export const DROMUND_KAAS_QUESTS: QuestDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════
  // ARC 1 — THE DARK TEMPLE
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "quest_dark_temple_breach",
    name: "La Brecha del Templo Oscuro",
    description:
      "Darth Seris quiere una daga sin huellas. Algo ha despertado dentro del Templo Oscuro — se enviaron acólitos, y ninguno regresó. Halla lo que se agita en el antiguo zigurat y acaba con ello.",
    category: "main",
    zoneId: "dromund_kaas_citadel",
    recommendedLevel: 9,
    prereqs: [],
    objectives: [
      { id: "obj_kaas_jungle", description: "Cruza la jungla tormentosa hacia el Templo", flagKey: "kaas_jungle_entered", optional: false },
      { id: "obj_kaas_temple", description: "Entra en el Templo Oscuro", flagKey: "kaas_temple_entered", optional: false },
      { id: "obj_kaas_sentinels", description: "Destruye a los centinelas del templo", flagKey: "temple_sentinels_destroyed", optional: true },
      { id: "obj_kaas_voice", description: "Silencia la Voz en la Oscuridad", flagKey: "temple_voice_defeated", optional: false },
      { id: "obj_kaas_report", description: "Informa a Darth Seris", flagKey: "seris_breach_reported", optional: false },
    ],
    rewards: {
      xp: 1100,
      credits: 600,
      items: [{ itemId: "kaas_stormblade", qty: 1 }],
      factionRep: [{ factionId: "sith_academy", amount: 30 }],
    },
    darkRewards: {
      xp: 1300,
      credits: 450,
      corruption: 4,
      items: [{ itemId: "kaas_stormblade", qty: 1 }],
      factionRep: [{ factionId: "sith_academy", amount: 45 }],
    },
  },
  {
    id: "quest_temple_voice",
    name: "La Voz Sabía Sus Nombres",
    description:
      "El escuadrón de la acólita Thirix fue masacrado en el Templo Oscuro por algo que hablaba con voces superpuestas — y conocía sus nombres antes de matarlos. Ella quiere una venganza que tiene demasiado miedo de tomar por sí misma.",
    category: "secondary",
    zoneId: "dromund_kaas_jungle",
    recommendedLevel: 10,
    prereqs: [],
    objectives: [
      { id: "obj_voice_squad", description: "Encuentra los restos del escuadrón de Thirix", flagKey: "thirix_squad_found", optional: false },
      { id: "obj_voice_kill", description: "Destruye la Voz en la Oscuridad", flagKey: "temple_voice_defeated", optional: false },
      { id: "obj_voice_return", description: "Dile a Thirix que está hecho", flagKey: "thirix_avenged", optional: false },
    ],
    rewards: {
      xp: 600,
      credits: 250,
      items: [{ itemId: "temple_ward_amulet", qty: 1 }],
    },
  },
  {
    id: "quest_temple_sanctum",
    name: "Lo Que el Templo Guarda",
    description:
      "Con la Voz silenciada, el sanctasanctórum sellado bajo el Templo Oscuro puede ser violado. Sea lo que sea lo que los antiguos Sith encerraron ahí abajo, el Consejo lo quiere — o lo quiere destruido. Ambas opciones pagan.",
    category: "secondary",
    zoneId: "dromund_kaas_temple",
    recommendedLevel: 11,
    prereqs: ["quest_dark_temple_breach"],
    objectives: [
      { id: "obj_sanctum_enter", description: "Desciende al Sanctasanctórum del Templo", flagKey: "sanctum_entered", optional: false },
      { id: "obj_sanctum_wards", description: "Rompe los tres sellos vinculantes", flagKey: "sanctum_wards_broken", optional: false },
      { id: "obj_sanctum_keeper", description: "Derrota al Guardián del Sanctasanctórum", flagKey: "sanctum_keeper_defeated", optional: false },
      { id: "obj_sanctum_relic", description: "Reclama la reliquia vinculada", flagKey: "sanctum_relic_taken", optional: true },
    ],
    rewards: {
      xp: 900,
      credits: 400,
      items: [{ itemId: "stormcaller_relic", qty: 1 }],
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // ARC 2 — WEB OF THE COUNCIL
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "quest_web_of_council",
    name: "La Red del Consejo",
    description:
      "Darth Seris tiene un rival: Darth Mortis. Su agente, Veyra, ofrece créditos y favores a cambio de pruebas de los fracasos de Seris. Seris pagaría más por saber quién pregunta. Dos mecenas, un espía, y tú en medio.",
    category: "secondary",
    zoneId: "dromund_kaas_market",
    recommendedLevel: 10,
    prereqs: [],
    objectives: [
      { id: "obj_web_veyra", description: "Reúnete con la agente que te vigila en el Bazar", flagKey: "veyra_met", optional: false },
      { id: "obj_web_dossier", description: "Consigue el dosier de inteligencia", flagKey: "kaas_dossier_taken", optional: false },
      { id: "obj_web_choice", description: "Elige un mecenas: Seris o Mortis", flagKey: "council_side_chosen", optional: false },
      { id: "obj_web_retaliation", description: "Sobrevive a las represalias del perdedor", flagKey: "council_retaliation_survived", optional: false },
    ],
    rewards: {
      xp: 800,
      credits: 700,
      factionRep: [{ factionId: "sith_academy", amount: 15 }],
    },
    darkRewards: {
      xp: 950,
      credits: 1000,
      corruption: 3,
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // ARC 3 — SIDE WORK
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "quest_jungle_predators",
    name: "Depredadores de la Jungla Tormentosa",
    description:
      "Brakk, un cazador trandoshano manco, tiene un contrato permanente sobre los gatos de las lianas de la jungla — y una cuenta personal con el gundark alfa que le arrancó el brazo. Repartirá la recompensa con quien esté lo bastante loco para ayudarle.",
    category: "secondary",
    zoneId: "dromund_kaas_jungle",
    recommendedLevel: 9,
    prereqs: [],
    objectives: [
      { id: "obj_pred_cats", description: "Diezma la manada de gatos de las lianas", flagKey: "kaas_cats_culled", optional: false },
      { id: "obj_pred_alpha", description: "Da muerte al gundark alfa", flagKey: "gundark_alpha_slain", optional: false },
      { id: "obj_pred_return", description: "Cobra tu parte de Brakk", flagKey: "brakk_paid", optional: false },
    ],
    rewards: {
      xp: 550,
      credits: 400,
      items: [{ itemId: "kaas_field_ration", qty: 3 }],
    },
  },
  {
    id: "quest_undercroft",
    name: "Susurros en la Cripta",
    description:
      "Los obreros desaparecen sin cesar en los túneles de mantenimiento de Ciudad Kaas. El Ministerio culpa a droides defectuosos. Jorra, el cantinero, ha escuchado a los supervivientes — y lo que describen no es ningún droide.",
    category: "secondary",
    zoneId: "dromund_kaas_market",
    recommendedLevel: 11,
    prereqs: [],
    objectives: [
      { id: "obj_uc_descend", description: "Desciende a la Cripta", flagKey: "undercroft_entered", optional: false },
      { id: "obj_uc_evidence", description: "Encuentra lo que queda de los obreros desaparecidos", flagKey: "undercroft_evidence_found", optional: false },
      { id: "obj_uc_horror", description: "Destruye la cosa en la oscuridad", flagKey: "undercroft_horror_slain", optional: false },
    ],
    rewards: {
      xp: 750,
      credits: 350,
      items: [{ itemId: "imperial_officer_coat", qty: 1 }],
    },
  },

  // ── Lord Malvek — the spy hunt ─────────────────────────────────────
  {
    id: "q_kaas_malvek_spy",
    name: "El Topo del Templo Oscuro",
    description: "Lord Malvek sospecha que alguien filtra secretos imperiales a una célula antiimperial que opera desde el distrito del Templo Oscuro. Quiere un nombre, pruebas, y la eliminación silenciosa del traidor.",
    category: "secondary",
    zoneId: "dromund_kaas_citadel",
    recommendedLevel: 10,
    prereqs: [],
    objectives: [
      { id: "obj_find_leak", description: "Rastrea la filtración hasta su fuente", flagKey: "malvek_spy_found", optional: false },
      { id: "obj_get_evidence", description: "Consigue pruebas del contacto con la célula", flagKey: "malvek_evidence", optional: false },
      { id: "obj_eliminate", description: "Elimina al topo y a su célula", flagKey: "malvek_spy_eliminated", optional: false },
    ],
    rewards: {
      xp: 900,
      credits: 600,
      factionRep: [{ factionId: "sith_academy", amount: 20 }],
    },
    darkRewards: {
      xp: 900,
      credits: 900,
      corruption: 4,
      factionRep: [{ factionId: "sith_academy", amount: 30 }],
    },
  },

  // ── Sergeant Korso — the bait squad's avenger ──────────────────────
  {
    id: "q_storm_meat",
    name: "Carne para la Tormenta",
    description: "El sargento Brel Korso, único superviviente de una escuadra imperial usada como cebo ritual por un Sith, caza al círculo del culto que llevó a sus hombres al matadero. Ayúdalo a vengarlos — y decide qué queda de él después.",
    category: "secondary",
    zoneId: "dromund_kaas_jungle",
    recommendedLevel: 9,
    prereqs: [],
    objectives: [
      { id: "obj_meet", description: "Habla con el sargento Korso", flagKey: "korso_met", optional: false },
      { id: "obj_hunt", description: "Destruye el círculo del culto en el claro oriental", flagKey: "korso_cult_killed", optional: false },
      { id: "obj_fate", description: "Decide el destino de Korso", flagKey: "korso_resolved", optional: false },
    ],
    rewards: { xp: 400, credits: 200, factionRep: [{ factionId: "smuggler_guild", amount: 5 }] },
    darkRewards: {
      xp: 450,
      credits: 500,
      corruption: 5,
      factionRep: [{ factionId: "sith_academy", amount: 10 }],
    },
  },
];
