import type { ZoneDefinition, PlanetDefinition } from "../../engine/world/zone-types";
import { SHIP_ZONES } from "./player-ship";
import { DUNGEON_RAGNOS_ZONES, DUNGEON_CATHEDRAL_ZONES } from "./dungeons";

/**
 * All zones and planets in the game.
 *
 * CONTROLS (shown in-game):
 *   Click hotspot  → navigate / interact
 *   1-9            → quick-select hotspot by number
 *   Tab            → cycle through available hotspots
 *   M              → toggle galaxy map
 *   I              → inventory
 *   C              → character sheet
 *   J              → quest journal
 *   Esc            → game menu
 *   Space          → advance dialogue / confirm
 */

// ═══════════════════════════════════════════════════════════════════════
// KORRIBAN — Act I (Levels 1-10)
// ═══════════════════════════════════════════════════════════════════════

const KORRIBAN_ZONES: ZoneDefinition[] = [
  {
    id: "korriban_academy_exterior",
    name: "Exterior de la Academia",
    description: "La gran entrada a la Academia Sith. Dos soles arden sobre la antigua piedra arenisca.",
    planetId: "korriban",
    sceneId: "korriban_exterior",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_academy_door", label: "Entrar en la Academia", position: [50, 55], type: "exit", targetZoneId: "korriban_academy_interior", icon: "door" },
      { id: "hs_valley_path", label: "Valle de los Lores Oscuros", position: [15, 60], type: "exit", targetZoneId: "korriban_valley", icon: "door" },
      { id: "hs_mines_path", label: "Minas de Esclavos", position: [85, 65], type: "exit", targetZoneId: "korriban_mines", icon: "door" },
      { id: "hs_dreshdae_path", label: "Asentamiento de Dreshdae", position: [35, 72], type: "exit", targetZoneId: "korriban_dreshdae", icon: "door" },
      { id: "hs_obelisk", label: "Obelisco antiguo", position: [10, 45], type: "event", icon: "star", requireFlag: "main_met_voren" },
      { id: "hs_merchant_grot", label: "Puesto de Grot", position: [70, 70], type: "npc", npcId: "npc_merchant_grot", icon: "person" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "sith_acolyte", weight: 42 },
      { enemyId: "shyrack", weight: 22 },
      { enemyId: "tuk_ata", weight: 16 },
      { enemyId: "corrupted_pilgrim", weight: 12 },
      { enemyId: "dreshdae_smuggler", weight: 8 },
      { enemyId: "tomb_scavenger", weight: 10 },
    ],
    encounterChance: 0.15,
  },
  {
    id: "korriban_academy_interior",
    name: "Academia Sith",
    description: "Oscuros corredores flanqueados por holocrones y los susurros de antiguos Sith. Maestros y acólitos se vigilan con recelo.",
    planetId: "korriban",
    sceneId: "korriban_interior",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_exit_exterior", label: "Salir al exterior", position: [50, 85], type: "exit", targetZoneId: "korriban_academy_exterior", icon: "door" },
      { id: "hs_darth_voren", label: "Cámara de Darth Voren", position: [50, 25], type: "npc", npcId: "npc_darth_voren", icon: "person" },
      { id: "hs_archivist", label: "Archivo", position: [25, 40], type: "npc", npcId: "npc_archivist_kheln", icon: "person" },
      { id: "hs_arena", label: "Arena de Entrenamiento", position: [75, 40], type: "exit", targetZoneId: "korriban_arena", icon: "sword" },
      // ── Whispers in the Dark (q_whispers_dark) — one evolving marker on the
      //    west wall: find the wing → break the seal → confront the spirit. ──
      { id: "hs_whispers_search", label: "El origen de los susurros", position: [15, 30], type: "event", icon: "star", requireFlag: "main_met_voren", hideIfFlag: "whispers_entrance", eventFlag: "whispers_entrance", eventText: "Sigues las voces superpuestas hasta un arco tapiado en el ala más antigua. Tras él, algo sigue hablando." },
      { id: "hs_sealed_wing", label: "El ala sellada", position: [15, 30], type: "event", icon: "star", requireFlag: "whispers_entrance", hideIfFlag: "whispers_seal_broken", eventFlag: "whispers_seal_broken", eventText: "Los antiguos glifos de sellado resisten, y luego se hacen añicos ante tu voluntad. Del interior brotan aire frío y un odio aún más viejo." },
      { id: "hs_whispers_spirit", label: "El espíritu sith", position: [15, 30], type: "encounter", encounterEnemies: ["tomb_wraith"], icon: "sword", recommendedLevel: 3, requireFlag: "whispers_seal_broken", hideIfFlag: "whispers_spirit", victoryFlag: "whispers_spirit" },
      // ── The Power Within (q_power_within) — the east meditation cell opens
      //    only after the whispers are silenced. enter → vision → choice. ──
      { id: "hs_meditation", label: "Cámara de meditación", position: [85, 30], type: "event", icon: "star", requireFlag: "whispers_spirit", hideIfFlag: "power_entered", eventFlag: "power_entered", eventText: "Cruzas a la celda de meditación. La puerta se sella tras de ti por sí sola. No habrá salida hasta que esto termine." },
      { id: "hs_power_vision", label: "La visión interior", position: [85, 30], type: "event", icon: "star", requireFlag: "power_entered", hideIfFlag: "power_vision", eventFlag: "power_vision", eventText: "El lado oscuro te muestra un futuro en el que te arrodillaste — y otro en el que todos los que te hicieron arrodillarte son ceniza. Te pregunta cuál prefieres." },
      { id: "hs_power_choice", label: "La decisión final", position: [85, 30], type: "event", icon: "star", requireFlag: "power_vision", hideIfFlag: "power_choice", eventFlag: "power_choice", eventText: "Eliges. La visión te libera, cambiado — más frío, más lúcido y más difícil de quebrar que el acólito que entró." },
      // ── The Archivist's Request (q_the_archivist) — hand the recovered texts
      //    back to Kheln at the archive (texts are found out in the tombs). ──
      { id: "hs_archive_return", label: "Volver con el Archivista Kheln", position: [25, 47], type: "event", icon: "star", requireFlag: "archivist_texts_found", hideIfFlag: "archivist_texts_returned", eventFlag: "archivist_texts_returned", eventText: "A Kheln le tiemblan las manos mientras extiende los textos recuperados sobre su escritorio. 'Anteriores a la República. Intactos. No tienes ni idea de lo que me has traído.'" },
      { id: "hs_overseer", label: "Supervisor Raxis", position: [60, 55], type: "npc", npcId: "npc_overseer_raxis", icon: "person" },
      { id: "hs_daryth", label: "Daryth", position: [40, 55], type: "npc", npcId: "npc_daryth", icon: "person", hideIfFlag: "rival_daryth_defeated" },
      { id: "hs_koro", label: "Koro el Servidor", position: [18, 62], type: "npc", npcId: "npc_servitor_koro", icon: "person" },
      { id: "hs_rhen", label: "Rhen", position: [33, 72], type: "npc", npcId: "npc_acolyte_rhen", icon: "person" },
      { id: "hs_kaelis_reflection", label: "Consejero Kaelis", position: [25, 68], type: "event", icon: "person", requireFlag: "kaelis_recruited", hideIfFlag: "lk_talked", eventFlag: "lk_talked", eventText: "Kaelis te confía la duda que lo corroe: el Código le exige desechar la piedad, y no puede. Decide afrontar la prueba que una vez lo quebró — esta vez contigo a su lado." },
      { id: "hs_kaelis_trial", label: "La prueba de Kaelis", position: [72, 62], type: "encounter", encounterEnemies: ["acolyte_duelist", "sith_acolyte"], icon: "sword", recommendedLevel: 5, requireFlag: "lk_talked", hideIfFlag: "lk_trial_complete", victoryFlag: "lk_trial_complete" },
      { id: "hs_overseer_ledger", label: "El libro oculto del Supervisor", position: [88, 38], type: "loot", lootTableId: "loot_elite_sith", icon: "chest", requireFlag: "koro_ledger_known", hideIfFlag: "loot_done_hs_overseer_ledger" },
      { id: "hs_ritual_circle", label: "Duelo ritual — Darth Voren", position: [50, 40], type: "encounter", encounterEnemies: ["darth_voren"], icon: "sword", recommendedLevel: 7, requireFlag: "voren_duel_ready", victoryFlag: "main_voren_duel" },
    ],
  },
  {
    id: "korriban_valley",
    name: "Valle de los Lores Oscuros",
    description: "Antiguas tumbas de Lores Sith se extienden hacia el horizonte carmesí. El aire crepita con energía oscura residual.",
    planetId: "korriban",
    sceneId: "korriban_valley",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_back_academy", label: "Volver a la Academia", position: [85, 70], type: "exit", targetZoneId: "korriban_academy_exterior", icon: "door" },
      { id: "hs_tomb_ajunta", label: "Tumba de Ajunta Pall", position: [40, 35], type: "exit", targetZoneId: "korriban_tomb", icon: "door", requireFlag: "main_met_voren" },
      { id: "hs_tomb_tulak", label: "Tumba de Tulak Hord", position: [70, 28], type: "exit", targetZoneId: "korriban_tomb_tulak", icon: "door", requireFlag: "tulak_tomb_known" },
      { id: "hs_tukkata_den", label: "Guarida de tuk'ata", position: [20, 50], type: "encounter", encounterEnemies: ["tuk_ata", "tuk_ata"], icon: "sword", recommendedLevel: 3 },
      { id: "hs_tukkata_tracks", label: "Huellas extrañas", position: [12, 38], type: "event", icon: "star", hideIfFlag: "tukkata_tracked", eventFlag: "tukkata_tracked", eventText: "Enormes huellas de garras — el alfa caza hacia el noroeste." },
      { id: "hs_tukkata_alpha", label: "Coto de caza del alfa", position: [28, 30], type: "encounter", encounterEnemies: ["tukata_alpha", "tuk_ata"], icon: "sword", recommendedLevel: 4, requireFlag: "tukkata_tracked", victoryFlag: "tukkata_alpha_killed" },
      { id: "hs_smuggler_camp", label: "Campamento de contrabandistas", position: [55, 60], type: "encounter", encounterEnemies: ["smuggler_raider", "smuggler_raider", "smuggler_raider"], icon: "sword", recommendedLevel: 4, requireFlag: "raiders_trail", hideIfFlag: "raiders_confronted", victoryFlag: "raiders_confronted" },
      { id: "hs_smuggler_cache", label: "El alijo de los contrabandistas", position: [55, 60], type: "event", icon: "chest", requireFlag: "raiders_confronted", hideIfFlag: "raiders_artifacts", eventFlag: "raiders_artifacts", eventText: "Tras el campamento, la caja fuerte de los contrabandistas se abre de golpe — estatuaria sith saqueada, fragmentos de holocrón y una hoja ceremonial, todo marcado con sellos de la Academia. Recuperas los artefactos robados." },
      { id: "hs_ruins", label: "Ruinas desmoronadas", position: [60, 45], type: "loot", icon: "chest" },
      { id: "hs_rhen_route", label: "El sendero seguro de Rhen", position: [45, 40], type: "encounter", encounterEnemies: ["acolyte_duelist", "tomb_wraith"], icon: "sword", recommendedLevel: 5, requireFlag: "rhen_tomb_route", victoryFlag: "tomb_proof_taken" },
      // ── The Broken Holocron (q_the_broken_holocron) — one investigation that
      //    moves through the valley: trail → interrogate → ambush → decide. ──
      { id: "hs_holocron_trail", label: "El rastro del contrabandista", position: [48, 72], type: "event", icon: "star", requireFlag: "main_met_voren", hideIfFlag: "holocron_smuggler_found", eventFlag: "holocron_smuggler_found", eventText: "Huellas de botas recientes y una célula de energía caída se alejan del sendero de la tumba. Quienquiera que llevase el holocrón agrietado pasó por aquí, y hace poco." },
      { id: "hs_holocron_interrogate", label: "Acorralar al contrabandista", position: [48, 72], type: "encounter", encounterEnemies: ["smuggler_raider"], icon: "sword", recommendedLevel: 4, requireFlag: "holocron_smuggler_found", hideIfFlag: "holocron_origin_known", victoryFlag: "holocron_origin_known" },
      { id: "hs_holocron_ambush", label: "El punto de intercambio", position: [48, 72], type: "encounter", encounterEnemies: ["smuggler_raider", "smuggler_raider", "acolyte_duelist"], icon: "sword", recommendedLevel: 5, requireFlag: "holocron_origin_known", hideIfFlag: "holocron_ambush_survived", victoryFlag: "holocron_ambush_survived" },
      { id: "hs_holocron_choice", label: "El destino del holocrón", position: [48, 72], type: "event", icon: "star", requireFlag: "holocron_ambush_survived", hideIfFlag: "holocron_choice_made", eventFlag: "holocron_choice_made", eventText: "El holocrón agrietado palpita en tus manos, su maestro muerto susurrando ofertas. Quédatelo, destrúyelo o véndeselo a la Academia — la decisión, y en lo que te convierta, es tuya." },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "tuk_ata", weight: 32 },
      { enemyId: "shyrack", weight: 28 },
      { enemyId: "hssiss_drake", weight: 14 },
      { enemyId: "acolyte_duelist", weight: 10 },
      { enemyId: "tomb_wraith", weight: 10 },
      { enemyId: "sith_pureblood", weight: 6 },
    ],
    encounterChance: 0.25,
  },
  {
    id: "korriban_tomb",
    name: "Tumba de Ajunta Pall",
    description: "El lugar de descanso del primer Lord Oscuro. Trampas, droides y guardianes espectrales aguardan al incauto.",
    planetId: "korriban",
    sceneId: "korriban_tomb",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_tomb_exit", label: "Salir de la tumba", position: [50, 85], type: "exit", targetZoneId: "korriban_valley", icon: "door" },
      { id: "hs_tomb_entry_mark", label: "Umbral de Ajunta Pall", position: [50, 70], type: "event", icon: "star", hideIfFlag: "main_entered_tomb", eventFlag: "main_entered_tomb", eventText: "El lado oscuro presiona tu mente como un aliento contenido. Has entrado en la tumba del primer Lord Oscuro." },
      { id: "hs_tomb_guardian", label: "Sanctasanctórum interior", position: [50, 20], type: "encounter", encounterEnemies: ["tomb_guardian_boss"], icon: "sword", recommendedLevel: 5, victoryFlag: "main_guardian_defeated" },
      { id: "hs_tomb_loot_a", label: "Cofre antiguo", position: [25, 45], type: "loot", icon: "chest" },
      { id: "hs_tomb_droid", label: "Corredor de seguridad", position: [70, 50], type: "encounter", encounterEnemies: ["tomb_droid", "tomb_droid"], icon: "sword" },
      { id: "hs_tomb_wraith", label: "Cámara espectral", position: [30, 30], type: "encounter", encounterEnemies: ["tomb_wraith"], icon: "sword", recommendedLevel: 5 },
      // ── The Archivist's Request (q_the_archivist) — the lost Sith texts are
      //    scattered through the burial galleries. ──
      { id: "hs_archivist_texts", label: "Textos sith dispersos", position: [40, 55], type: "event", icon: "star", requireFlag: "main_entered_tomb", hideIfFlag: "archivist_texts_found", eventFlag: "archivist_texts_found", eventText: "Tres frágiles estuches de pergaminos yacen entre los huesos de acólitos olvidados. Los glifos se retuercen cuando no los miras directamente. Kheln querrá esto." },
      // ── The Ancient Weapon (q_ancient_weapon) — one deep-tomb vault that
      //    unlocks in stages once the Guardian is dead: clues → vault → claim. ──
      { id: "hs_weapon_clues", label: "Glifos de guerra sith", position: [50, 42], type: "event", icon: "star", requireFlag: "main_guardian_defeated", hideIfFlag: "weapon_clues_3", eventFlag: "weapon_clues_3", eventText: "Tres glifos de guerra, dispersos por los muros del sanctasanctórum, se resuelven en una sola instrucción: un nombre, una secuencia y una advertencia. Tienes la llave de la cámara." },
      { id: "hs_weapon_vault", label: "La cámara sellada", position: [50, 42], type: "event", icon: "star", requireFlag: "weapon_clues_3", hideIfFlag: "weapon_vault_open", eventFlag: "weapon_vault_open", eventText: "Pronuncias el nombre del Lord muerto en la antigua secuencia. La piedra rechina contra la piedra, y la cámara de los primeros Lores Sith se abre ante ti." },
      { id: "hs_weapon_claim", label: "Reclamar el arma", position: [50, 42], type: "encounter", encounterEnemies: ["tomb_droid", "tomb_droid"], icon: "sword", recommendedLevel: 6, requireFlag: "weapon_vault_open", hideIfFlag: "weapon_claimed", victoryFlag: "weapon_claimed" },
    ],
    randomEncounters: false,
  },
  {
    id: "korriban_arena",
    name: "Arena de Entrenamiento",
    description: "Donde los acólitos demuestran su valía con sangre. La arena está manchada de rojo para siempre.",
    planetId: "korriban",
    sceneId: "korriban_arena",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_arena_exit", label: "Volver a la Academia", position: [50, 85], type: "exit", targetZoneId: "korriban_academy_interior", icon: "door" },
      { id: "hs_arena_fight", label: "Desafiar a un acólito", position: [50, 40], type: "encounter", encounterEnemies: ["sith_acolyte"], icon: "sword" },
      { id: "hs_arena_daryth", label: "Batirse con Daryth", position: [50, 25], type: "encounter", encounterEnemies: ["daryth_rival"], icon: "sword", requireFlag: "rival_accepted", victoryFlag: "rival_daryth_defeated", recommendedLevel: 3 },
      { id: "hs_arena_pureblood", label: "Desafío del Campeón", position: [30, 30], type: "encounter", encounterEnemies: ["sith_pureblood"], icon: "sword", requireFlag: "rival_daryth_defeated", recommendedLevel: 5 },
      // ── Las Pruebas de la Arena (q_arena_trials / _express) — Dregg. ──
      { id: "hs_dregg", label: "Maestro de Arena Dregg", position: [78, 62], type: "npc", npcId: "npc_arena_master_dregg", icon: "person" },
      { id: "hs_arena_initiate", label: "Prueba: Iniciado", position: [85, 45], type: "encounter", encounterEnemies: ["sith_acolyte"], icon: "sword", recommendedLevel: 3, requireFlag: "arena_trials_active", hideIfFlag: "arena_initiate_won", victoryFlag: "arena_initiate_won" },
      { id: "hs_arena_warrior", label: "Prueba: Guerrero", position: [88, 32], type: "encounter", encounterEnemies: ["acolyte_duelist"], icon: "sword", recommendedLevel: 4, requireFlag: "arena_initiate_won", hideIfFlag: "arena_warrior_won", victoryFlag: "arena_warrior_won" },
      { id: "hs_arena_executioner", label: "Prueba: Verdugo", position: [72, 18], type: "encounter", encounterEnemies: ["sith_pureblood", "sith_acolyte"], icon: "sword", recommendedLevel: 5, requireFlag: "arena_warrior_won", hideIfFlag: "arena_executioner_won", victoryFlag: "arena_executioner_won" },
      { id: "hs_arena_gauntlet", label: "Las tres pruebas sin descanso", position: [18, 45], type: "encounter", encounterEnemies: ["sith_acolyte", "acolyte_duelist", "sith_pureblood"], icon: "sword", recommendedLevel: 5, requireFlag: "arena_express_active", hideIfFlag: "arena_express_won", victoryFlag: "arena_express_won" },
      // ── Chains of Korriban (main) — the Trial of Blood Darth Voren sends every
      //    new acolyte to survive. Two acolytes enter the sand; you must leave it. ──
      { id: "hs_trial_blood", label: "Prueba de Sangre", position: [70, 55], type: "encounter", encounterEnemies: ["sith_acolyte", "sith_acolyte"], icon: "sword", recommendedLevel: 1, requireFlag: "main_met_voren", hideIfFlag: "main_trial_blood", victoryFlag: "main_trial_blood" },
    ],
  },
  {
    id: "korriban_mines",
    name: "Minas de Esclavos",
    description: "Túneles oscuros donde los esclavos se afanan sin fin. Las babosas k'lor han hecho aquí sus nidos.",
    planetId: "korriban",
    sceneId: "korriban_mines",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_mines_exit", label: "Salir a la superficie", position: [50, 85], type: "exit", targetZoneId: "korriban_academy_exterior", icon: "door" },
      { id: "hs_kira", label: "Kira", position: [30, 50], type: "npc", npcId: "npc_kira_slave", icon: "person" },
      // ── q_silent_tomb — los restos de la cuadrilla de Joren en el pozo bajo. ──
      { id: "hs_joren_remains", label: "El pozo derrumbado", position: [72, 52], type: "event", icon: "star", requireFlag: "sera_met", hideIfFlag: "sera_truth_found", eventFlag: "sera_truth_found", eventText: "Bajo el derrumbe encuentras lo que los Overseers no buscaron: las vigas no cedieron, fueron cortadas — con un sable. Entre los huesos de la cuadrilla, un colgante con el sello de un acólito de alto rango. Joren no murió en una prueba. Lo asesinaron para silenciar algo que vio." },
      { id: "hs_slug_nest", label: "Nido de babosas k'lor", position: [60, 30], type: "encounter", encounterEnemies: ["klor_slug", "klor_slug", "klor_slug"], icon: "sword", victoryFlag: "pest_slugs_killed_5" },
      { id: "hs_slug_nest_core", label: "Quemar el nido", position: [70, 22], type: "event", icon: "star", requireFlag: "pest_slugs_killed_5", hideIfFlag: "pest_nest_destroyed", eventFlag: "pest_nest_destroyed", eventText: "Prendes fuego a los racimos de huevos que se retuercen. Algo enorme chilla en las profundidades." },
      { id: "hs_deep_tunnel", label: "Túneles profundos", position: [40, 20], type: "encounter", encounterEnemies: ["klor_slug", "klor_slug"], icon: "sword" },
      { id: "hs_queen_lair", label: "La guarida de la Reina", position: [25, 15], type: "encounter", encounterEnemies: ["klor_slug_queen"], icon: "sword", recommendedLevel: 4, requireFlag: "knows_deep_tunnel", victoryFlag: "pest_queen_killed" },
      { id: "hs_overseer_drex", label: "Supervisor Drex", position: [55, 60], type: "encounter", encounterEnemies: ["mine_overseer", "sith_acolyte"], icon: "sword", recommendedLevel: 4, requireFlag: "slave_uprising_aid", victoryFlag: "slave_resolved" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "klor_slug", weight: 60 },
      { enemyId: "shyrack", weight: 40 },
    ],
    encounterChance: 0.3,
  },
  {
    id: "korriban_dreshdae",
    name: "Asentamiento de Dreshdae",
    description: "El único puesto civil de Korriban. Contrabandistas, acólitos fracasados y hombres de Czerka beben codo con codo — todos fingiendo no vigilar la Academia en la cresta.",
    planetId: "korriban",
    sceneId: "korriban_exterior",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_dreshdae_back", label: "Camino a la Academia", position: [85, 70], type: "exit", targetZoneId: "korriban_academy_exterior", icon: "door" },
      { id: "hs_dreshdae_seyla", label: "La Cantina del Lado Borracho", position: [35, 50], type: "npc", npcId: "npc_seyla", icon: "person" },
      // ── Lo que Calló la Tumba (q_silent_tomb) — Sera, la sirvienta. ──
      { id: "hs_sera", label: "Sera Vant", position: [52, 40], type: "npc", npcId: "npc_sera_vant", icon: "person", hideIfFlag: "sera_resolved" },
      { id: "hs_dreshdae_czerka", label: "Oficina de Czerka", position: [65, 45], type: "npc", npcId: "npc_czerka_varn", icon: "person" },
      { id: "hs_dreshdae_thane", label: "Figura encapuchada", position: [18, 58], type: "npc", npcId: "npc_thane", icon: "person", hideIfFlag: "deserter_resolved" },
      { id: "hs_dreshdae_senna", label: "Una mujer desesperada", position: [28, 62], type: "npc", npcId: "npc_dreshdae_senna", icon: "person", hideIfFlag: "dreshdae_betrayed" },
      { id: "hs_dreshdae_crates", label: "Cajas abandonadas", position: [50, 70], type: "loot", icon: "chest", lootTableId: "loot_acolyte" },
      { id: "hs_dreshdae_brawl", label: "Contrabandistas borrachos", position: [75, 62], type: "encounter", encounterEnemies: ["smuggler_raider", "smuggler_raider"], icon: "sword", recommendedLevel: 3 },
    ],
  },
  {
    id: "korriban_tomb_tulak",
    name: "Tumba de Tulak Hord",
    description: "El lugar de descanso del mayor duelista de sable de luz de los antiguos Sith. Los muros están grabados con los nombres de diez mil Jedi caídos — y algo antiguo aún los custodia.",
    planetId: "korriban",
    sceneId: "korriban_tomb",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_tulak_exit", label: "Salir de la tumba", position: [50, 85], type: "exit", targetZoneId: "korriban_valley", icon: "door" },
      { id: "hs_tulak_hssiss", label: "Nido de hssiss", position: [30, 50], type: "encounter", encounterEnemies: ["hssiss", "hssiss"], icon: "sword", recommendedLevel: 6 },
      { id: "hs_tulak_droids", label: "Galería derrumbada", position: [70, 45], type: "encounter", encounterEnemies: ["tomb_droid", "tomb_droid", "tomb_droid"], icon: "sword", recommendedLevel: 5 },
      { id: "hs_tulak_altar", label: "Altar del Odio", position: [65, 25], type: "event", icon: "star", eventFlag: "tulak_altar_touched", eventText: "Susurros de diez mil muertes inundan tu mente. Tu odio se afila como una hoja." },
      { id: "hs_tulak_reliquary", label: "Relicario de Hord", position: [25, 28], type: "loot", icon: "chest", lootTableId: "loot_boss_guardian", requireFlag: "terentatek_slain" },
      { id: "hs_tulak_terentatek", label: "La bestia de las profundidades", position: [50, 15], type: "encounter", encounterEnemies: ["terentatek"], icon: "sword", recommendedLevel: 8, victoryFlag: "terentatek_slain" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "hssiss", weight: 40 },
      { enemyId: "shyrack", weight: 35 },
      { enemyId: "tomb_wraith", weight: 25 },
    ],
    encounterChance: 0.25,
  },
];

// ═══════════════════════════════════════════════════════════════════════
// DROMUND KAAS — Act I.5 (Levels 8-12)
// Bridge between Korriban and Nar Shaddaa: Sith Empire's heart.
// ═══════════════════════════════════════════════════════════════════════

const DROMUND_KAAS_ZONES: ZoneDefinition[] = [
  {
    id: "dromund_kaas_spaceport",
    name: "Puerto Espacial de Kaas City",
    description: "La lluvia cae sobre las plataformas de duracero. Los guardias imperiales vigilan cada llegada. El olor a ozono e incienso llega desde la ciudad.",
    planetId: "dromund_kaas",
    sceneId: "dromund_kaas_spaceport",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_kaas_to_citadel", label: "Camino a la Ciudadela", position: [50, 55], type: "exit", targetZoneId: "dromund_kaas_citadel", icon: "door" },
      { id: "hs_kaas_to_jungle", label: "Sendero de la jungla", position: [15, 65], type: "exit", targetZoneId: "dromund_kaas_jungle", icon: "door" },
      { id: "hs_kaas_to_market", label: "Bazar de Kaas City", position: [70, 48], type: "exit", targetZoneId: "dromund_kaas_market", icon: "door" },
      { id: "hs_kaas_kallus", label: "Moff Kallus", position: [78, 62], type: "npc", npcId: "npc_moff_kallus", icon: "person" },
      { id: "hs_kaas_drayven", label: "La Forja de Drayven", position: [30, 70], type: "npc", npcId: "npc_merchant_drayven", icon: "person" },
      { id: "hs_kaas_cargo", label: "Cajas de carga empapadas", position: [42, 72], type: "loot", icon: "chest", lootTableId: "loot_acolyte" },
      { id: "hs_kaas_stowaways", label: "Polizones de contrabando", position: [60, 70], type: "encounter", encounterEnemies: ["smuggler_raider", "smuggler_raider"], icon: "sword", recommendedLevel: 8 },
      { id: "hs_kaas_travel", label: "Mapa galáctico", position: [50, 85], type: "travel", icon: "ship" },
    ],
  },
  {
    id: "dromund_kaas_citadel",
    name: "Ciudadela Imperial",
    description: "Agujas negras perforan el cielo asolado por la tormenta. Los Lores Sith recorren los pasillos; los sirvientes se inclinan sin levantar la vista.",
    planetId: "dromund_kaas",
    sceneId: "dromund_kaas_citadel",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_kaas_to_spaceport", label: "Bajar al puerto espacial", position: [50, 85], type: "exit", targetZoneId: "dromund_kaas_spaceport", icon: "door" },
      { id: "hs_kaas_seris", label: "Darth Seris", position: [50, 25], type: "npc", npcId: "npc_darth_seris", icon: "person" },
      { id: "hs_kaas_vex", label: "El Rincón de Vex", position: [20, 55], type: "npc", npcId: "npc_informant_vex", icon: "person" },
      { id: "hs_kaas_archive", label: "Salón de los Registros", position: [35, 40], type: "event", icon: "star", eventFlag: "kaas_archives_read", hideIfFlag: "kaas_archives_read", eventText: "Registros de campaña censurados. Entre las tachaduras: el Templo Oscuro ha sido sellado y resellado cuatro veces en ocho siglos." },
      { id: "hs_kaas_guard", label: "Guardias imperiales", position: [75, 55], type: "encounter", encounterEnemies: ["imperial_guard", "imperial_guard"], icon: "sword", recommendedLevel: 9, requireFlag: "seris_enemy" },
      // ── El Topo del Templo Oscuro (q_kaas_malvek_spy) — Lord Malvek. ──
      { id: "hs_malvek", label: "Lord Malvek", position: [62, 40], type: "npc", npcId: "npc_lord_malvek", icon: "person" },
      { id: "hs_rhea", label: "Capitana Rhea Vayne", position: [88, 30], type: "npc", npcId: "npc_captain_rhea", icon: "person" },
      { id: "hs_malvek_leak", label: "Rastrear la filtración", position: [85, 30], type: "event", icon: "star", requireFlag: "malvek_quest_active", hideIfFlag: "malvek_spy_found", eventFlag: "malvek_spy_found", eventText: "Cruzas los registros de acceso del archivo con los turnos de la guardia y un nombre se repite donde no debería: un escriba menor de la corte de Malvek, con la costumbre de bajar al distrito del Templo Oscuro cuando cree que nadie cuenta sus pasos." },
      { id: "hs_malvek_evidence", label: "El punto de entrega", position: [22, 72], type: "event", icon: "chest", requireFlag: "malvek_spy_found", hideIfFlag: "malvek_evidence", eventFlag: "malvek_evidence", eventText: "En un nicho del distrito bajo encuentras el buzón muerto del topo: cilindros de datos con despliegues de flota, rotaciones de ritual y la frecuencia de contacto de la célula antiimperial. Pruebas más que suficientes para Malvek — y para colgar a un hombre." },
      { id: "hs_malvek_cell", label: "La célula antiimperial", position: [58, 70], type: "encounter", encounterEnemies: ["mercenary", "mercenary", "bounty_hunter"], icon: "sword", recommendedLevel: 10, requireFlag: "malvek_evidence", hideIfFlag: "malvek_spy_eliminated", victoryFlag: "malvek_spy_eliminated" },
    ],
  },
  {
    id: "dromund_kaas_market",
    name: "Bazar de Kaas City",
    description: "Un mercado cubierto a la sombra de la Ciudadela. Puestos iluminados con farolillos, colas de racionamiento y una cantina donde los oficiales fuera de servicio hablan de más.",
    planetId: "dromund_kaas",
    sceneId: "dromund_kaas_market",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_market_back", label: "Volver al puerto espacial", position: [85, 75], type: "exit", targetZoneId: "dromund_kaas_spaceport", icon: "door" },
      { id: "hs_market_jorra", label: "La Cantina de la Aguja Rota", position: [30, 52], type: "npc", npcId: "npc_jorra_cantina", icon: "person" },
      { id: "hs_market_veyra", label: "Un desconocido que observa", position: [62, 58], type: "npc", npcId: "npc_agent_veyra", icon: "person", hideIfFlag: "council_side_chosen" },
      { id: "hs_market_dossier", label: "Taquilla de buzón muerto", position: [75, 64], type: "event", icon: "star", requireFlag: "veyra_met", hideIfFlag: "kaas_dossier_taken", eventFlag: "kaas_dossier_taken", eventText: "Dentro de la taquilla: un dosier sellado. Rotaciones de tropas, registros de rituales fallidos — y la firma de Darth Seris en todos ellos." },
      // ── La Red del Consejo (quest_web_of_council) — el mecenas rechazado responde. ──
      { id: "hs_council_retaliation", label: "Represalia en el Bazar", position: [50, 68], type: "encounter", encounterEnemies: ["mortis_assassin", "imperial_guard", "imperial_guard"], icon: "sword", recommendedLevel: 10, requireFlag: "council_side_chosen", hideIfFlag: "council_retaliation_survived", victoryFlag: "council_retaliation_survived" },
      { id: "hs_market_to_undercroft", label: "Conducto de mantenimiento", position: [15, 68], type: "exit", targetZoneId: "dromund_kaas_undercroft", icon: "door" },
      { id: "hs_market_pickpockets", label: "Ladrones de raciones", position: [48, 66], type: "encounter", encounterEnemies: ["smuggler_raider", "smuggler_raider"], icon: "sword", recommendedLevel: 9 },
      { id: "hs_market_stall", label: "Puesto abandonado", position: [40, 70], type: "loot", icon: "chest", lootTableId: "loot_acolyte" },
    ],
  },
  {
    id: "dromund_kaas_jungle",
    name: "Jungla Tormentosa",
    description: "Árboles ahogados por las lianas y depredadores al acecho. El cielo se quiebra con relámpagos violetas. El Templo Oscuro se alza en la distancia.",
    planetId: "dromund_kaas",
    sceneId: "dromund_kaas_jungle",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_kaas_jungle_back", label: "Volver al puerto espacial", position: [85, 75], type: "exit", targetZoneId: "dromund_kaas_spaceport", icon: "door" },
      { id: "hs_kaas_jungle_mark", label: "Inicio del sendero azotado por la tormenta", position: [70, 68], type: "event", icon: "star", hideIfFlag: "kaas_jungle_entered", eventFlag: "kaas_jungle_entered", eventText: "Los relámpagos recortan el Templo Oscuro sobre el dosel de la selva. El sendero por delante está marcado con advertencias en sith antiguo — y con sangre más fresca." },
      { id: "hs_kaas_to_temple", label: "Acceso al Templo Oscuro", position: [50, 30], type: "exit", targetZoneId: "dromund_kaas_temple", icon: "door" },
      { id: "hs_kaas_thirix", label: "Acólito Thirix", position: [30, 55], type: "npc", npcId: "npc_acolyte_thirix", icon: "person" },
      // ── Carne para la Tormenta (q_storm_meat) — Korso y el círculo del culto. ──
      { id: "hs_korso", label: "Sargento Korso", position: [55, 64], type: "npc", npcId: "npc_sergeant_korso", icon: "person", hideIfFlag: "korso_resolved" },
      { id: "hs_korso_cult", label: "El claro del círculo", position: [82, 52], type: "encounter", encounterEnemies: ["kaas_dark_acolyte", "kaas_dark_acolyte", "kaas_shadow_assassin"], icon: "sword", recommendedLevel: 10, requireFlag: "korso_met", hideIfFlag: "korso_cult_killed", victoryFlag: "korso_cult_killed" },
      { id: "hs_kaas_brakk", label: "El puesto de caza de Brakk", position: [12, 60], type: "npc", npcId: "npc_hunter_brakk", icon: "person" },
      { id: "hs_kaas_sleen", label: "Manada de gatos de las lianas", position: [70, 50], type: "encounter", encounterEnemies: ["kaas_vine_cat", "kaas_vine_cat", "kaas_vine_cat"], icon: "sword", recommendedLevel: 9, victoryFlag: "kaas_cats_culled" },
      { id: "hs_kaas_gundark_den", label: "Guarida de gundark", position: [25, 38], type: "encounter", encounterEnemies: ["kaas_gundark", "kaas_gundark"], icon: "sword", recommendedLevel: 10 },
      { id: "hs_kaas_gundark_alpha", label: "La hondonada del alfa", position: [38, 42], type: "encounter", encounterEnemies: ["kaas_gundark_alpha", "kaas_gundark"], icon: "sword", recommendedLevel: 11, requireFlag: "kaas_cats_culled", victoryFlag: "gundark_alpha_slain" },
      { id: "hs_kaas_loot_relic", label: "Reliquia medio enterrada", position: [15, 45], type: "loot", icon: "chest" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "kaas_vine_cat", weight: 30 },
      { enemyId: "kaas_gundark", weight: 22 },
      { enemyId: "kaas_shadow_assassin", weight: 20 },
      { enemyId: "kaas_storm_beast", weight: 15 },
      { enemyId: "kaas_dark_acolyte", weight: 8 },
      { enemyId: "imperial_guard", weight: 12 },
    ],
    encounterChance: 0.2,
  },
  {
    id: "dromund_kaas_temple",
    name: "El Templo Oscuro",
    description: "Un antiguo zigurat sith medio engullido por la jungla. Susurros superpuestos llenan el aire. Las piedras recuerdan.",
    planetId: "dromund_kaas",
    sceneId: "dromund_kaas_temple",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_kaas_temple_back", label: "Volver a la jungla", position: [85, 80], type: "exit", targetZoneId: "dromund_kaas_jungle", icon: "door" },
      { id: "hs_tavros", label: "Tavros el Invisible", position: [15, 72], type: "npc", npcId: "npc_blind_seer_tavros", icon: "person" },
      { id: "hs_kaas_temple_mark", label: "Puertas destrozadas", position: [60, 72], type: "event", icon: "star", hideIfFlag: "kaas_temple_entered", eventFlag: "kaas_temple_entered", eventText: "Las puertas del Templo reventaron hacia fuera — desde dentro. Los susurros empiezan en el instante en que cruzas el umbral." },
      { id: "hs_kaas_temple_squad", label: "Acólitos caídos", position: [35, 62], type: "event", icon: "star", hideIfFlag: "thirix_squad_found", eventFlag: "thirix_squad_found", eventText: "El escuadrón de Thirix. Sus sables siguen en sus manos — ninguno logró un solo golpe. Cada rostro está congelado a media palabra, como si respondiera a su propio nombre." },
      { id: "hs_kaas_temple_sentinels", label: "Galería de los Centinelas", position: [70, 50], type: "encounter", encounterEnemies: ["temple_sentinel", "temple_sentinel"], icon: "sword", recommendedLevel: 10, victoryFlag: "temple_sentinels_destroyed" },
      { id: "hs_kaas_temple_voice", label: "La voz en la oscuridad", position: [50, 30], type: "encounter", encounterEnemies: ["kaas_temple_voice"], icon: "sword", recommendedLevel: 11, victoryFlag: "temple_voice_defeated" },
      { id: "hs_kaas_temple_loot", label: "Relicario sellado", position: [25, 55], type: "loot", icon: "chest", requireFlag: "knows_temple_secret" },
      { id: "hs_kaas_temple_event", label: "Altar susurrante", position: [75, 55], type: "event", icon: "star", eventFlag: "kaas_altar_touched", eventText: "El altar bebe la luz de la tormenta. Por un latido oyes todas las voces que ha engullido — y la tuya entre ellas." },
      { id: "hs_kaas_to_sanctum", label: "Escalera del sanctasanctórum", position: [42, 45], type: "exit", targetZoneId: "dromund_kaas_sanctum", icon: "door", requireFlag: "temple_voice_defeated" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "temple_sentinel", weight: 60 },
      { enemyId: "kaas_shadow_assassin", weight: 40 },
    ],
    encounterChance: 0.18,
  },
  {
    id: "dromund_kaas_sanctum",
    name: "Sanctasanctórum del Templo",
    description: "Bajo el zigurat, el aire es frío y seco, ajeno a la tormenta de arriba. Tres sellos de atadura arden en la oscuridad — más antiguos que el propio Imperio.",
    planetId: "dromund_kaas",
    sceneId: "dromund_kaas_sanctum",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_sanctum_exit", label: "Subir de vuelta al Templo", position: [50, 85], type: "exit", targetZoneId: "dromund_kaas_temple", icon: "door" },
      { id: "hs_sanctum_mark", label: "Umbral del sanctasanctórum", position: [50, 70], type: "event", icon: "star", hideIfFlag: "sanctum_entered", eventFlag: "sanctum_entered", eventText: "La escalera termina en una cripta abovedada. Tres sellos de relámpago congelado retienen algo en el corazón de la cámara." },
      { id: "hs_sanctum_wards", label: "Los sellos de atadura", position: [30, 50], type: "event", icon: "star", requireFlag: "sanctum_entered", hideIfFlag: "sanctum_wards_broken", eventFlag: "sanctum_wards_broken", eventText: "Uno a uno los sellos se rompen como el cristal. La cosa en el corazón de la cámara abre ojos de piedra." },
      { id: "hs_sanctum_keeper", label: "El Guardián del Sanctasanctórum", position: [50, 28], type: "encounter", encounterEnemies: ["sanctum_keeper"], icon: "sword", recommendedLevel: 12, requireFlag: "sanctum_wards_broken", victoryFlag: "sanctum_keeper_defeated" },
      { id: "hs_sanctum_relic", label: "La reliquia atada", position: [70, 40], type: "event", icon: "star", requireFlag: "sanctum_keeper_defeated", hideIfFlag: "sanctum_relic_taken", eventFlag: "sanctum_relic_taken", eventText: "La reliquia está caliente en tu mano, latiendo como un segundo corazón. El trueno retumba en la piedra de arriba como respuesta." },
      { id: "hs_sanctum_loot", label: "El tesoro del Guardián", position: [25, 32], type: "loot", icon: "chest", lootTableId: "loot_boss_guardian", requireFlag: "sanctum_keeper_defeated" },
    ],
  },
  {
    id: "dromund_kaas_undercroft",
    name: "La Cripta",
    description: "Los cimientos anegados de Kaas City. Las luces de mantenimiento parpadean sobre el agua negra. En algún lugar de la oscuridad, algo se alimenta.",
    planetId: "dromund_kaas",
    sceneId: "dromund_kaas_undercroft",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_uc_exit", label: "Escalera al Bazar", position: [50, 85], type: "exit", targetZoneId: "dromund_kaas_market", icon: "door" },
      { id: "hs_uc_mark", label: "Cruce inundado", position: [60, 70], type: "event", icon: "star", hideIfFlag: "undercroft_entered", eventFlag: "undercroft_entered", eventText: "Cascos de obreros flotan en el agua negra. Las marcas de arañazos en los muros van en una sola dirección: hacia abajo." },
      { id: "hs_uc_creepers", label: "Túneles de cría", position: [70, 48], type: "encounter", encounterEnemies: ["sludge_creeper", "sludge_creeper"], icon: "sword", recommendedLevel: 11 },
      { id: "hs_uc_evidence", label: "El campamento de los obreros", position: [30, 52], type: "event", icon: "star", requireFlag: "undercroft_entered", hideIfFlag: "undercroft_evidence_found", eventFlag: "undercroft_evidence_found", eventText: "Una alcoba atrincherada — abierta a la fuerza desde fuera. Una última entrada de registro se repite en bucle: 'Aprende. Cada vez que nos escondemos, aprende.'" },
      { id: "hs_uc_horror", label: "La oscuridad que se alimenta", position: [42, 28], type: "encounter", encounterEnemies: ["undercroft_horror", "sludge_creeper"], icon: "sword", recommendedLevel: 12, requireFlag: "undercroft_evidence_found", victoryFlag: "undercroft_horror_slain" },
      { id: "hs_uc_loot", label: "Alijo de suministros perdido", position: [20, 38], type: "loot", icon: "chest" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "sludge_creeper", weight: 70 },
      { enemyId: "kaas_shadow_assassin", weight: 30 },
    ],
    encounterChance: 0.25,
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ZIOST — Act I.7 (Levels 12-16)
// The frozen first throne of the Sith. Black stone under pale ice and aurora.
// ═══════════════════════════════════════════════════════════════════════

const ZIOST_ZONES: ZoneDefinition[] = [
  {
    id: "ziost_spaceport",
    name: "Plataforma de New Adasta",
    description: "Una plataforma de aterrizaje azotada por el viento se aferra al costado de una aguja helada. La nieve silba sobre el duracero negro; la aurora sangra cian sobre la muerta capital sith de abajo.",
    planetId: "ziost",
    sceneId: "ziost_spaceport",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_ziost_to_citadel", label: "Entrar en New Adasta", position: [45, 52], type: "exit", targetZoneId: "ziost_citadel", icon: "door" },
      { id: "hs_ziost_to_wastes", label: "Los Yermos Helados", position: [18, 64], type: "exit", targetZoneId: "ziost_wastes", icon: "door" },
      { id: "hs_ziost_keeper", label: "Puesto del Guardián Veth", position: [70, 66], type: "npc", npcId: "npc_ziost_keeper", icon: "person" },
      { id: "hs_ziost_archivist", label: "Archivista Sarn", position: [58, 60], type: "npc", npcId: "npc_ziost_archivist", icon: "person" },
      { id: "hs_ziost_crates", label: "Carga agrietada por la escarcha", position: [33, 70], type: "loot", icon: "chest", lootTableId: "loot_acolyte" },
      { id: "hs_ziost_travel", label: "Mapa galáctico", position: [50, 85], type: "travel", icon: "ship" },
    ],
  },
  {
    id: "ziost_citadel",
    name: "New Adasta",
    description: "La primera capital sith, sepultada en hielo durante milenios. Torres de obsidiana se inclinan bajo su propio peso congelado; algo en la piedra profunda aún recuerda haber sido adorado.",
    planetId: "ziost",
    sceneId: "ziost_citadel",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_ziost_cit_back", label: "Volver a la plataforma", position: [50, 85], type: "exit", targetZoneId: "ziost_spaceport", icon: "door" },
      { id: "hs_ziost_overseer", label: "Supervisora Maliss", position: [50, 30], type: "npc", npcId: "npc_ziost_overseer", icon: "person" },
      { id: "hs_ziost_cit_archive", label: "El archivo de cristal", position: [28, 44], type: "event", icon: "star", eventFlag: "ziost_archive_read", hideIfFlag: "ziost_archive_read", eventText: "Cristales de datos congelados recubren los muros, cada uno guardando una voz sith que murió gritando. Una palabra se repite en todos ellos: 'Coro'." },
      { id: "hs_ziost_cit_guard", label: "Centinelas congelados", position: [74, 52], type: "encounter", encounterEnemies: ["temple_sentinel", "temple_sentinel"], icon: "sword", recommendedLevel: 13 },
      { id: "hs_ziost_cit_wraith", label: "El salón de los lamentos", position: [38, 36], type: "encounter", encounterEnemies: ["tomb_wraith", "tomb_wraith", "hssiss"], icon: "sword", recommendedLevel: 14 },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "tomb_wraith", weight: 45 },
      { enemyId: "shadow_assassin", weight: 30 },
      { enemyId: "sith_pureblood", weight: 25 },
    ],
    encounterChance: 0.18,
  },
  {
    id: "ziost_wastes",
    name: "Los Yermos Helados",
    description: "Una llanura blanca de tumbas enterradas y piedras erguidas. El viento arrastra voces que no son el viento. A lo lejos, un sonido como diez mil gargantas sosteniendo una sola nota.",
    planetId: "ziost",
    sceneId: "ziost_wastes",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_ziost_wastes_back", label: "Volver a la plataforma", position: [85, 72], type: "exit", targetZoneId: "ziost_spaceport", icon: "door" },
      { id: "hs_ziost_to_tomb", label: "La Tumba Cantora", position: [35, 28], type: "exit", targetZoneId: "ziost_tomb", icon: "door", requireFlag: "ziost_choir_found" },
      { id: "hs_ziost_choir", label: "El Coro Congelado", position: [50, 42], type: "event", icon: "star", requireFlag: "ziost_choir_taken", hideIfFlag: "ziost_choir_found", eventFlag: "ziost_choir_found", eventText: "Cientos de sith permanecen congelados a media canción sobre el hielo, las bocas abiertas, los ojos encendidos. Llevan sosteniendo la misma nota cuatro mil años. La nota es una puerta — y está empezando a abrirse." },
      { id: "hs_ziost_wastes_pack", label: "Hssiss entre los ventisqueros", position: [22, 50], type: "encounter", encounterEnemies: ["hssiss", "hssiss"], icon: "sword", recommendedLevel: 13 },
      { id: "hs_ziost_wastes_revenant", label: "Una piedra erguida se agita", position: [66, 48], type: "encounter", encounterEnemies: ["void_wraith", "shadow_assassin"], icon: "sword", recommendedLevel: 15 },
      { id: "hs_ziost_wastes_loot", label: "Relicario medio enterrado", position: [12, 40], type: "loot", icon: "chest" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "hssiss", weight: 40 },
      { enemyId: "void_wraith", weight: 30 },
      { enemyId: "shadow_assassin", weight: 30 },
    ],
    encounterChance: 0.28,
  },
  {
    id: "ziost_tomb",
    name: "La Tumba Cantora",
    description: "Bajo el Coro, una escalera de cristal negro desciende hacia un aliento contenido. La nota es más fuerte aquí — y en el fondo, algo tan antiguo como para haber enseñado a los primeros Sith espera a que lo canten para liberarlo.",
    planetId: "ziost",
    sceneId: "ziost_tomb",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_ziost_tomb_exit", label: "Subir de vuelta a los Yermos", position: [50, 85], type: "exit", targetZoneId: "ziost_wastes", icon: "door" },
      { id: "hs_ziost_tomb_droids", label: "Galería de cristal", position: [70, 48], type: "encounter", encounterEnemies: ["sith_pureblood", "tomb_wraith"], icon: "sword", recommendedLevel: 15 },
      { id: "hs_ziost_tomb_heart", label: "El Director", position: [50, 22], type: "encounter", encounterEnemies: ["corrupted_guardian"], icon: "sword", recommendedLevel: 16, victoryFlag: "ziost_conductor_slain" },
      { id: "hs_ziost_tomb_loot", label: "El tesoro del Maestro de Coro", position: [25, 40], type: "loot", icon: "chest", lootTableId: "loot_boss_guardian", requireFlag: "ziost_conductor_slain" },
    ],
    randomEncounters: false,
  },
];

const NAR_SHADDAA_ZONES: ZoneDefinition[] = [
  {
    id: "nar_shaddaa_promenade",
    name: "El Paseo",
    description: "Las luces de neón se reflejan en las calles mojadas por la lluvia. La Luna de los Contrabandistas nunca duerme.",
    planetId: "nar_shaddaa",
    sceneId: "nar_shaddaa_promenade",
    musicTrackId: "nar_shaddaa_ambient",
    hotspots: [
      { id: "hs_cantina", label: "Cantina del Antro de Pazaak", position: [35, 50], type: "exit", targetZoneId: "nar_shaddaa_cantina", icon: "door" },
      { id: "hs_market", label: "Mercado negro", position: [65, 55], type: "exit", targetZoneId: "nar_shaddaa_market", icon: "door" },
      { id: "hs_lower_city", label: "Ciudad Baja", position: [50, 75], type: "exit", targetZoneId: "nar_shaddaa_lower", icon: "door" },
      { id: "hs_spaceport", label: "Puerto espacial", position: [85, 40], type: "travel", icon: "ship" },
      { id: "hs_bounty_board", label: "Tablón de recompensas", position: [20, 45], type: "event", icon: "star", hideIfFlag: "bounty_accepted", eventFlag: "bounty_accepted", eventText: "El tablón holográfico parpadea con contratos abiertos: un droide rebelde que despedaza estibadores en la Ciudad Baja, y un rakghoul alfa que ha vuelto intransitable el sector de cloacas. Buenos créditos para quien sepa cobrarlos." },
      { id: "hs_dockmaster_kull", label: "Oficina del capitán de puerto", position: [12, 60], type: "npc", npcId: "npc_dockmaster_kull", icon: "person" },
      { id: "hs_cyra", label: "Cyra Venn", position: [78, 62], type: "npc", npcId: "npc_cyra_venn", icon: "person" },
      // ── Shadows Over the Outer Rim (q_act2_shadows) — landing beat. ──
      { id: "hs_act2_arrival", label: "La Luna de los Contrabandistas", position: [55, 28], type: "event", icon: "star", requireFlag: "main_voren_duel", hideIfFlag: "act2_arrived_nar", eventFlag: "act2_arrived_nar", eventText: "Nar Shaddaa te engulle por completo — neón, humo y un millón de crímenes silenciosos. El alcance del Triunvirato empieza aquí, en las cloacas de la Luna de los Contrabandistas. Tu contacto espera en el Antro de Pazaak." },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "street_thug", weight: 40 },
      { enemyId: "bounty_hunter", weight: 30 },
      { enemyId: "exchange_enforcer", weight: 30 },
    ],
    encounterChance: 0.2,
  },
  {
    id: "nar_shaddaa_cantina",
    name: "Antro de Pazaak",
    description: "Una cantina llena de humo donde las fortunas cambian de manos entre cartas y tratos susurrados.",
    planetId: "nar_shaddaa",
    sceneId: "nar_shaddaa_cantina",
    musicTrackId: "nar_shaddaa_ambient",
    hotspots: [
      { id: "hs_cantina_exit", label: "Salir al Paseo", position: [50, 85], type: "exit", targetZoneId: "nar_shaddaa_promenade", icon: "door" },
      { id: "hs_informant", label: "Figura encapuchada", position: [30, 40], type: "npc", npcId: "npc_informant_zek", icon: "person" },
      { id: "hs_bartender", label: "Tabernero", position: [60, 35], type: "npc", npcId: "npc_bartender_mira", icon: "person" },
      // ── Contactos en los Bajos Fondos (q_underworld_connections). ──
      { id: "hs_uc_bartender", label: "Gánate a Mira", position: [72, 42], type: "event", icon: "star", hideIfFlag: "uc_bartender_friend", eventFlag: "uc_bartender_friend", eventText: "Unas rondas pagadas y un par de favores discretos después, Mira la tabernera te cuenta lo que oye — y en Nar Shaddaa todo pasa por su barra. 'Si buscas armas de verdad, habla con mi proveedor en el Mercado de las Sombras. Dile que vas de mi parte.'" },
      // ── Oziri Sath — corredor de reputaciones reactivo (reacciona a tus decisiones). ──
      { id: "hs_oziri", label: "Oziri Sath", position: [25, 60], type: "npc", npcId: "npc_oziri_sath", icon: "person", hideIfFlag: "oziri_done" },
      // ── q_act2_shadows — the informant names the Exchange as the Sith Lord's
      //    money-launderer; the trail leads down to the Lower City. ──
      { id: "hs_act2_informant", label: "El reservado de Zek", position: [45, 58], type: "event", icon: "star", requireFlag: "act2_arrived_nar", hideIfFlag: "act2_met_informant", eventFlag: "act2_met_informant", eventText: "Zek desliza un chip de datos por la mesa sin levantar la vista. 'Tu Lord Sith blanquea su botín de guerra a través del Intercambio. El Jefe lo dirige desde la Ciudad Baja. Tira de ese hilo — y no les digas que te envié yo.'" },
    ],
  },
  {
    id: "nar_shaddaa_market",
    name: "Mercado de las Sombras",
    description: "Mercancía ilegal, artefactos raros y gente peligrosa. Aquí los créditos hablan más alto que los sables de luz.",
    planetId: "nar_shaddaa",
    sceneId: "nar_shaddaa_market",
    musicTrackId: "nar_shaddaa_ambient",
    hotspots: [
      { id: "hs_market_exit", label: "Salir al Paseo", position: [50, 85], type: "exit", targetZoneId: "nar_shaddaa_promenade", icon: "door" },
      { id: "hs_arms_dealer", label: "Traficante de armas", position: [30, 45], type: "npc", npcId: "npc_arms_dealer", icon: "person" },
      // ── q_underworld_connections — el proveedor al que te envía Mira. ──
      { id: "hs_uc_arms", label: "Trato con el traficante", position: [40, 52], type: "event", icon: "star", requireFlag: "uc_bartender_friend", hideIfFlag: "uc_arms_deal", eventFlag: "uc_arms_deal", eventText: "El traficante de armas te estudia, oye el nombre de Mira y abre la trastienda. Cerráis un acuerdo: tú le traes clientes con discreción, él te surte de lo que el Intercambio no quiere que tengas. Otro hilo de la red, ahora en tu mano." },
      { id: "hs_alchemist", label: "Alquimista Sith", position: [70, 40], type: "npc", npcId: "npc_alchemist", icon: "person" },
      { id: "hs_collector_buyer", label: "El comprador del Coleccionista", position: [50, 60], type: "encounter", encounterEnemies: ["bounty_hunter", "exchange_enforcer"], icon: "sword", recommendedLevel: 15, requireFlag: "collector_trail_found", victoryFlag: "collector_agent_defeated" },
      { id: "hs_buyer_datapad", label: "El datapad del comprador", position: [55, 68], type: "event", icon: "star", requireFlag: "collector_agent_defeated", hideIfFlag: "collector_unmasked", eventFlag: "collector_unmasked", eventText: "El datapad del comprador contiene órdenes de compra de reliquias de seis mundos — y una orden de recompensa sin nombre, solo un perfil de firma en la Fuerza. El comprador de artefactos y el cazador de usuarios de la Fuerza son el mismo cliente. El Coleccionista sabe lo que eres. Y ahora tú sabes que existe." },
      { id: "hs_v3x_parts", label: "Núcleos de droide recuperados", position: [20, 62], type: "event", icon: "star", requireFlag: "v3x9_recruited", hideIfFlag: "lv_parts_found", eventFlag: "lv_parts_found", eventText: "Entre la chatarra del Mercado de las Sombras encuentras componentes de núcleo de memoria compatibles — suficientes para reconstruir lo que V3X-9 perdió. El droide se queda muy quieto mientras los recoges." },
      { id: "hs_v3x_core", label: "El núcleo de memoria de V3X-9", position: [78, 60], type: "event", icon: "star", requireFlag: "lv_parts_found", hideIfFlag: "lv_core_choice", eventFlag: "lv_core_choice", eventText: "Los fragmentos restaurados se resuelven en un rostro — el primer amo de V3X-9, ordenando una masacre que el droide ejecutó sin cuestionarla. Puedes dejar el recuerdo intacto como una cicatriz que deberá cargar, o borrarlo y dejar que el droide vuelva a empezar. En cualquier caso, V3X-9 recordará que fuiste tú quien eligió." },
    ],
  },
  {
    id: "nar_shaddaa_lower",
    name: "Ciudad Baja",
    description: "Bajo el neón yace la podredumbre. Territorio de bandas. Los desesperados depredan a los aún más desesperados.",
    planetId: "nar_shaddaa",
    sceneId: "nar_shaddaa_lower",
    musicTrackId: "nar_shaddaa_ambient",
    hotspots: [
      { id: "hs_lower_exit", label: "Volver al Paseo", position: [50, 15], type: "exit", targetZoneId: "nar_shaddaa_promenade", icon: "door" },
      // ── Carne de Empeño (q_pawn_flesh) — Tessa, el corredor Vross, y su jaula. ──
      { id: "hs_tessa", label: "Tessa Roan", position: [62, 28], type: "npc", npcId: "npc_tessa_roan", icon: "person", hideIfFlag: "tessa_resolved" },
      { id: "hs_vross", label: "El corredor Vross", position: [38, 30], type: "npc", npcId: "npc_slaver_vross", icon: "person", requireFlag: "tessa_met", hideIfFlag: "tessa_daughter_freed" },
      { id: "hs_tessa_pen", label: "La jaula de transporte", position: [50, 40], type: "encounter", encounterEnemies: ["exchange_enforcer", "exchange_enforcer", "street_thug"], icon: "sword", recommendedLevel: 14, requireFlag: "tessa_met", hideIfFlag: "tessa_daughter_freed", victoryFlag: "tessa_daughter_freed" },
      { id: "hs_exchange_hq", label: "Cuartel general del Intercambio", position: [40, 55], type: "exit", targetZoneId: "nar_shaddaa_exchange", icon: "door", recommendedLevel: 14 },
      { id: "hs_refugee_camp", label: "Sector de refugiados", position: [70, 60], type: "event", icon: "person", hideIfFlag: "rc_found_camp", eventFlag: "rc_found_camp", eventText: "Bajo una pasarela rota se hacina un campamento de refugiados de media docena de mundos, huidos del avance del Triunvirato. Tienen hambre, miedo y nada que ofrecer salvo gratitud — o, para quien sepa mirar, mano de obra desesperada y barata." },
      // ── Crisis de Refugiados (q_refugee_crisis) — ayúdalos o explótalos. ──
      { id: "hs_refugee_elder", label: "Portavoz de los Refugiados", position: [85, 62], type: "npc", npcId: "npc_refugee_elder", icon: "person", requireFlag: "rc_found_camp", hideIfFlag: "rc_choice_made" },
      // ── Tablón de Recompensas (q_bounty_board) — los blancos rondan aquí. ──
      { id: "hs_bounty_droid", label: "Recompensa: Droide Rebelde", position: [30, 68], type: "encounter", encounterEnemies: ["salvage_droid", "salvage_droid"], icon: "sword", recommendedLevel: 12, requireFlag: "bounty_accepted", hideIfFlag: "bounty_rogue_droid", victoryFlag: "bounty_rogue_droid" },
      { id: "hs_bounty_rakghoul", label: "Recompensa: Rakghoul Alfa", position: [50, 72], type: "encounter", encounterEnemies: ["rakghoul", "rakghoul", "rakghoul"], icon: "sword", recommendedLevel: 13, requireFlag: "bounty_accepted", hideIfFlag: "bounty_rakghoul_alpha", victoryFlag: "bounty_rakghoul_alpha" },
      { id: "hs_cyra_bounty", label: "El escondrijo de Vurl", position: [60, 48], type: "encounter", encounterEnemies: ["exchange_accountant", "street_thug", "street_thug"], icon: "sword", recommendedLevel: 12, requireFlag: "cyra_bounty_taken", victoryFlag: "cyra_bounty_done" },
      { id: "hs_dock9_raid", label: "Almacén del muelle 9", position: [22, 45], type: "encounter", encounterEnemies: ["exchange_enforcer", "exchange_enforcer", "street_thug"], icon: "sword", recommendedLevel: 13, requireFlag: "dock9_access", victoryFlag: "dock9_crates_seized" },
      { id: "hs_dock9_crates", label: "Las cajas que vibran", position: [15, 38], type: "event", icon: "star", requireFlag: "dock9_crates_seized", hideIfFlag: "collector_trail_found", eventFlag: "collector_trail_found", eventText: "Dentro de las cajas: artefactos de tumba, aún vibrando con el lado oscuro — sellados para sacarlos de la luna. El manifiesto no nombra a ningún comprador, solo un símbolo y una ruta. Alguien llamado 'el Coleccionista' compra reliquias sith al por mayor. El rastro lleva de vuelta al Mercado de las Sombras." },
      // ── q_act2_shadows — follow the laundered credits to the Exchange's
      //    front, confirming the Boss bankrolls the Sith Lord. ──
      { id: "hs_act2_investigate", label: "La tapadera del Intercambio", position: [78, 42], type: "event", icon: "star", requireFlag: "act2_met_informant", hideIfFlag: "act2_exchange_investigated", eventFlag: "act2_exchange_investigated", eventText: "Manifiestos falsificados, sellos de pago imperiales y un libro de cuentas de armas enviadas fuera del mundo — el Intercambio no solo blanquea para tu Lord Sith, está armando su campaña. El Jefe guarda la prueba, tras esas puertas blindadas." },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "street_thug", weight: 30 },
      { enemyId: "exchange_enforcer", weight: 40 },
      { enemyId: "rakghoul", weight: 30 },
    ],
    encounterChance: 0.3,
  },
  {
    id: "nar_shaddaa_exchange",
    name: "Cuartel General del Intercambio",
    description: "La fortaleza del criminal Intercambio. Seguridad férrea. El señor del crimen aguarda.",
    planetId: "nar_shaddaa",
    sceneId: "nar_shaddaa_exchange",
    musicTrackId: "nar_shaddaa_ambient",
    hotspots: [
      { id: "hs_exchange_exit", label: "Retirada", position: [50, 85], type: "exit", targetZoneId: "nar_shaddaa_lower", icon: "door" },
      { id: "hs_crime_lord", label: "El Jefe del Intercambio", position: [50, 30], type: "encounter", encounterEnemies: ["exchange_boss"], icon: "sword", recommendedLevel: 16, requireFlag: "act2_exchange_investigated", hideIfFlag: "act2_exchange_boss_defeated", victoryFlag: "act2_exchange_boss_defeated" },
      { id: "hs_neth", label: "Corredor Neth", position: [22, 58], type: "npc", npcId: "npc_broker_neth", icon: "person" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ONDERON — Act II (Levels 15-22)
// ═══════════════════════════════════════════════════════════════════════

const ONDERON_ZONES: ZoneDefinition[] = [
  {
    id: "onderon_city",
    name: "Ciudad Real de Iziz",
    description: "La capital amurallada de Onderon. La intriga política se filtra por los corredores dorados.",
    planetId: "onderon",
    sceneId: "onderon_city",
    musicTrackId: "onderon_ambient",
    hotspots: [
      { id: "hs_palace", label: "Palacio Real", position: [50, 25], type: "exit", targetZoneId: "onderon_palace", icon: "door" },
      { id: "hs_cantina_iz", label: "Cantina del Descanso del Soldado", position: [30, 55], type: "npc", npcId: "npc_general_vaklu", icon: "person" },
      // ── Intriga Política (q_political_intrigue) — la pugna Talia/Vaklu. ──
      { id: "hs_pi_vaklu", label: "Reunión con el General Vaklu", position: [40, 62], type: "event", icon: "star", hideIfFlag: "pi_met_vaklu", eventFlag: "pi_met_vaklu", eventText: "El General Vaklu te habla sin rodeos sobre vinos baratos: Onderon se asfixia bajo una reina que mira a la República mientras el pueblo pasa hambre. 'La corona pesa demasiado para Talia. Un empujón en el momento justo, y este mundo respira. ¿De qué lado respiras tú?'" },
      { id: "hs_pi_herald", label: "Heralda de la Corona", position: [52, 66], type: "npc", npcId: "npc_onderon_herald", icon: "person", requireFlag: "pi_met_vaklu", hideIfFlag: "pi_side_chosen" },
      { id: "hs_market_iz", label: "Barrio de los mercaderes", position: [70, 50], type: "npc", npcId: "npc_onderon_merchant", icon: "person" },
      // ── El Filo de la Nobleza (q_noble_edge) — Yvane, Sarn y su campeón. ──
      { id: "hs_yvane", label: "Dama Yvane Marr", position: [78, 58], type: "npc", npcId: "npc_dama_yvane", icon: "person", hideIfFlag: "yvane_resolved" },
      { id: "hs_sarn", label: "Lord Sarn Vael", position: [25, 38], type: "npc", npcId: "npc_lord_sarn", icon: "person", requireFlag: "yvane_met", hideIfFlag: "yvane_rival_dealt" },
      { id: "hs_sarn_duel", label: "El campeón de Vael", position: [25, 28], type: "encounter", encounterEnemies: ["sith_pureblood", "mandalorian_warrior"], icon: "sword", recommendedLevel: 16, requireFlag: "sarn_challenged", hideIfFlag: "yvane_rival_dealt", victoryFlag: "yvane_rival_dealt" },
      { id: "hs_voss", label: "General Voss Therrik", position: [82, 40], type: "npc", npcId: "npc_general_voss", icon: "person" },
      { id: "hs_talira", label: "Reina Talira Marath", position: [15, 45], type: "npc", npcId: "npc_queen_talira", icon: "person" },
      { id: "hs_spaceport_iz", label: "Puerto espacial", position: [85, 70], type: "travel", icon: "ship" },
      { id: "hs_undercity_iz", label: "Entrada a la Subciudad", position: [20, 65], type: "exit", targetZoneId: "onderon_undercity", icon: "door" },
      { id: "hs_voss_quarry", label: "La cantera oriental", position: [60, 38], type: "encounter", encounterEnemies: ["drexl_chieftain", "boma_beast", "boma_beast"], icon: "sword", recommendedLevel: 12, requireFlag: "voss_quarry_briefed", victoryFlag: "voss_quarry_cleared" },
      // ── q_act2_shadows — the Boss's ledger named Onderon: the Sith Lord is
      //    backing General Vaklu's coup against Queen Talia. ──
      { id: "hs_act2_onderon", label: "Las puertas de Iziz", position: [45, 78], type: "event", icon: "star", requireFlag: "act2_exchange_boss_defeated", hideIfFlag: "act2_arrived_onderon", eventFlag: "act2_arrived_onderon", eventText: "Onderon. Las últimas palabras del Jefe y su libro de cuentas apuntaban aquí — a una guerra civil que se gesta. Tu Lord Sith financia el golpe del General Vaklu. Hay que advertir a la Reina Talia, y ella tiene corte en el Palacio Real." },
    ],
    randomEncounters: false,
  },
  {
    id: "onderon_palace",
    name: "Palacio Real",
    description: "El asiento del poder en Onderon. La Reina Talia lucha contra la conspiración.",
    planetId: "onderon",
    sceneId: "onderon_palace",
    hotspots: [
      { id: "hs_palace_exit", label: "Salir del palacio", position: [50, 85], type: "exit", targetZoneId: "onderon_city", icon: "door" },
      { id: "hs_throne", label: "Sala del trono", position: [50, 25], type: "npc", npcId: "npc_queen_talia", icon: "person" },
      { id: "hs_castellan", label: "Estudio del Castellano", position: [72, 45], type: "npc", npcId: "npc_castellan_dree", icon: "person", requireFlag: "talia_traitor_hunt" },
      // ── q_ronar_spy_mission — sustrae inteligencia de la corte para Ronar. ──
      { id: "hs_ronar_access", label: "Registros de la corte", position: [78, 68], type: "event", icon: "star", requireFlag: "ronar_ally", hideIfFlag: "ronar_palace_accessed", eventFlag: "ronar_palace_accessed", eventText: "Tu rango en la corte abre puertas que para Ronar llevan años selladas. Mientras los cortesanos te suponen ocupado en intrigas mayores, te deslizas hasta la antesala de los registros reales — donde Iziz guarda lo que preferiría olvidar." },
      { id: "hs_ronar_intel", label: "El cilindro sellado", position: [25, 62], type: "event", icon: "chest", requireFlag: "ronar_palace_accessed", hideIfFlag: "ronar_intel_taken", eventFlag: "ronar_intel_taken", eventText: "Entre los archivos de la corona encuentras lo que Ronar buscaba: despliegues de la guardia, listas de simpatizantes de Vaklu, y la prueba de que el oro sith fluye hacia el golpe. Copias el cilindro y borras tu rastro. La clandestinidad sabrá qué hacer con esto." },
      // ── q_act2_shadows — warn the Queen, then lay the Exchange ledger before
      //    the court to expose Vaklu's Sith-funded conspiracy. ──
      { id: "hs_act2_queen", label: "Audiencia con la Reina Talia", position: [30, 42], type: "event", icon: "star", requireFlag: "act2_arrived_onderon", hideIfFlag: "act2_met_queen", eventFlag: "act2_met_queen", eventText: "La Reina Talia te escucha en frío silencio. 'Me traes pruebas de que mi propio general vende Onderon a un fantasma sith. Si logras que la corte lo crea, puede que acabes de salvar mi trono — y de empezar una guerra.'" },
      { id: "hs_act2_vaklu", label: "Desenmascarar al General Vaklu", position: [50, 60], type: "event", icon: "star", requireFlag: "act2_met_queen", hideIfFlag: "act2_vaklu_exposed", eventFlag: "act2_vaklu_exposed", eventText: "Depositas el libro de cuentas del Intercambio ante la corte reunida: armas, créditos y una firma sith tras cada línea. Los aliados de Vaklu palidecen. La conspiración queda destapada a plena luz — y la mano del Triunvirato en ella, por fin nombrada." },
    ],
  },
  {
    id: "onderon_undercity",
    name: "Subciudad de Onderon",
    description: "Bajo las murallas de la ciudad, bestias de la luna de Dxun merodean por túneles derruidos.",
    planetId: "onderon",
    sceneId: "onderon_undercity",
    hotspots: [
      { id: "hs_uc_exit", label: "Volver a la ciudad", position: [50, 15], type: "exit", targetZoneId: "onderon_city", icon: "door" },
      { id: "hs_dxun_portal", label: "Camino a Dxun", position: [30, 60], type: "exit", targetZoneId: "dxun_jungle", icon: "door" },
      // ── Ojos en el Palacio (q_ronar_spy_mission) — el Jedi oculto Ronar Sol. ──
      { id: "hs_ronar", label: "Ronar Sol", position: [70, 55], type: "npc", npcId: "npc_hidden_jedi_ronar", icon: "person" },
      { id: "hs_ronar_return", label: "Informar a Ronar", position: [58, 38], type: "event", icon: "star", requireFlag: "ronar_intel_taken", hideIfFlag: "ronar_intel_delivered", eventFlag: "ronar_intel_delivered", eventText: "Ronar recorre los datos que le traes con dedos temblorosos. 'Esto... esto cambia el mapa. Movimientos de tropas que Vaklu juró no tener, pagos que llevan la firma de tu Lord Sith. La clandestinidad de Onderon vivirá un mes más gracias a ti, Sith. Que la Fuerza te explique algún día por qué lo hiciste.'" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "boma_beast", weight: 40 },
      { enemyId: "drexl_larva", weight: 30 },
      { enemyId: "mandalorian_scout", weight: 30 },
    ],
    encounterChance: 0.25,
  },
];

// ═══════════════════════════════════════════════════════════════════════
// DXUN — Act III (Levels 18-28)
// ═══════════════════════════════════════════════════════════════════════

const DXUN_ZONES: ZoneDefinition[] = [
  {
    id: "dxun_jungle",
    name: "Jungla de Dxun",
    description: "La luna demoníaca de Onderon. Densa cubierta de jungla, antiguos campamentos mandalorianos y cosas peores en las sombras.",
    planetId: "dxun",
    sceneId: "dxun_jungle",
    musicTrackId: "dxun_ambient",
    hotspots: [
      { id: "hs_dxun_camp", label: "Campamento mandaloriano", position: [60, 45], type: "exit", targetZoneId: "dxun_mando_camp", icon: "door" },
      { id: "hs_dxun_tomb", label: "Entrada a la tumba sith", position: [30, 30], type: "exit", targetZoneId: "dxun_sith_tomb", icon: "door", recommendedLevel: 22 },
      { id: "hs_dxun_back", label: "Volver a Onderon", position: [80, 75], type: "exit", targetZoneId: "onderon_undercity", icon: "door" },
      // ── El Exiliado (q_exile) — la boma de la cicatriz en el barranco oriental. ──
      { id: "hs_dral_beast", label: "La boma de la cicatriz", position: [50, 78], type: "encounter", encounterEnemies: ["boma_beast", "boma_beast", "boma_beast"], icon: "sword", recommendedLevel: 20, requireFlag: "dral_met", hideIfFlag: "dral_beast_slain", victoryFlag: "dral_beast_slain" },
      { id: "hs_scout_kessa", label: "Campamento de exploradores destruido", position: [18, 55], type: "npc", npcId: "npc_scout_kessa", icon: "person" },
      { id: "hs_drexl_brood", label: "Nidos de cría del lecho del río", position: [42, 62], type: "encounter", encounterEnemies: ["drexl_larva", "drexl_larva", "boma_beast"], icon: "sword", recommendedLevel: 19, requireFlag: "dxun_nest_route", victoryFlag: "dxun_nest_culled" },
      { id: "hs_tomb_resonance", label: "La cresta de la tumba", position: [25, 40], type: "event", icon: "star", requireFlag: "dxun_nest_culled", hideIfFlag: "dxun_resonance_found", eventFlag: "dxun_resonance_found", eventText: "Pasados los nidos diezmados, la selva enmudece. Las piedras de la cresta vibran con un lento pulso del lado oscuro — la tumba sangra resonancia, y todas las bestias de Dxun pueden sentirlo. Esto es lo que las empuja contra la ciudad." },
      // ── El Hambre del Vacío (q_act3_hunger) — desembarco en Dxun. ──
      { id: "hs_act3_arrival", label: "Aterrizaje en Dxun", position: [50, 18], type: "event", icon: "star", requireFlag: "act2_vaklu_exposed", hideIfFlag: "act3_arrived_dxun", eventFlag: "act3_arrived_dxun", eventText: "La lanzadera se posa entre la maleza humeante de la luna demoníaca de Onderon. El hambre de Darth Nihilus ha dejado un rastro hasta aquí — y solo los mandalorianos que cazan en estas junglas saben adónde lleva." },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "boma_beast", weight: 30 },
      { enemyId: "cannok", weight: 30 },
      { enemyId: "drexl_larva", weight: 20 },
      { enemyId: "mandalorian_warrior", weight: 20 },
    ],
    encounterChance: 0.35,
  },
  {
    id: "dxun_mando_camp",
    name: "Campamento Mandaloriano",
    description: "Los restos del ejército de Mandalore se reagrupan aquí. El respeto se gana en combate.",
    planetId: "dxun",
    sceneId: "dxun_mando_camp",
    hotspots: [
      { id: "hs_mcamp_exit", label: "Volver a la jungla", position: [50, 85], type: "exit", targetZoneId: "dxun_jungle", icon: "door" },
      { id: "hs_mandalore", label: "Mandalore", position: [50, 35], type: "npc", npcId: "npc_mandalore", icon: "person" },
      { id: "hs_mando_armorer", label: "Armero", position: [70, 50], type: "npc", npcId: "npc_mando_armorer", icon: "person" },
      // ── El Exiliado (q_exile) — Dral Karr, el mandaloriano desterrado. ──
      { id: "hs_dral", label: "Dral Karr", position: [40, 68], type: "npc", npcId: "npc_dral_karr", icon: "person", hideIfFlag: "dral_resolved" },
      // ── Honor Mandaloriano (q_mandalorian_honor) — pruebas de combate. ──
      { id: "hs_mh_combat", label: "Prueba de combate", position: [25, 42], type: "encounter", encounterEnemies: ["mandalorian_warrior", "mandalorian_warrior"], icon: "sword", recommendedLevel: 20, hideIfFlag: "mh_combat_trial", victoryFlag: "mh_combat_trial" },
      { id: "hs_mh_hunt", label: "La cacería de la bestia", position: [72, 68], type: "encounter", encounterEnemies: ["boma_beast", "drexl_larva", "drexl_larva"], icon: "sword", recommendedLevel: 21, requireFlag: "mh_combat_trial", hideIfFlag: "mh_beast_hunt", victoryFlag: "mh_beast_hunt" },
      { id: "hs_torvak_target", label: "La cacería de Torvak", position: [30, 55], type: "event", icon: "star", requireFlag: "torvak_recruited", hideIfFlag: "lt_target_found", eventFlag: "lt_target_found", eventText: "Torvak nombra al traidor por fin: un hermano de clan que vendió las coordenadas de su campamento a los esclavistas que lo destruyeron. Camina libre en este mismo campamento, amparado por la tregua de Mandalore. Los nudillos de Torvak palidecen sobre su hoja." },
      { id: "hs_torvak_confront", label: "La tienda del traidor", position: [60, 62], type: "encounter", encounterEnemies: ["mandalorian_warrior", "mandalorian_warrior"], icon: "sword", recommendedLevel: 24, requireFlag: "lt_target_found", hideIfFlag: "lt_confrontation", victoryFlag: "lt_confrontation" },
      // ── q_act3_hunger — Mandalore señala la vieja tumba sith como el origen. ──
      { id: "hs_act3_mandalore", label: "Audiencia con Mandalore", position: [38, 50], type: "event", icon: "star", requireFlag: "act3_arrived_dxun", hideIfFlag: "act3_met_mandalore", eventFlag: "act3_met_mandalore", eventText: "Mandalore te mide en silencio antes de hablar. 'Mis cazadores no vuelven de la vieja tumba sith. Algo despierta ahí dentro y llama al vacío. Si quieres seguir el rastro de tu Señor del Hambre, empieza por esa cripta — y reza por salir.'" },
    ],
  },
  {
    id: "dxun_sith_tomb",
    name: "Tumba Sith (Dxun)",
    description: "Un antiguo Lord Sith fue sepultado aquí hace siglos. El lado oscuro es abrumador.",
    planetId: "dxun",
    sceneId: "dxun_sith_tomb",
    hotspots: [
      { id: "hs_dtomb_exit", label: "Salir de la tumba", position: [50, 85], type: "exit", targetZoneId: "dxun_jungle", icon: "door" },
      // ── q_act3_hunger — cruzar el umbral despierta lo que duerme dentro. ──
      { id: "hs_act3_tomb", label: "Umbral de la Tumba Sith", position: [50, 55], type: "event", icon: "star", requireFlag: "act3_met_mandalore", hideIfFlag: "act3_tomb_explored", eventFlag: "act3_tomb_explored", eventText: "El aire de la tumba es denso como agua negra. Las paredes laten con un hambre antigua que reconoce la tuya. Algo en lo más hondo lleva siglos esperando a que alguien con la Fuerza cruce este umbral." },
      { id: "hs_dtomb_boss", label: "Lord de la Tumba", position: [50, 20], type: "encounter", encounterEnemies: ["tomb_lord_dxun"], icon: "sword", recommendedLevel: 25, requireFlag: "act3_tomb_explored", hideIfFlag: "act3_tomb_lord_defeated", victoryFlag: "act3_tomb_lord_defeated" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// DANTOOINE — Act III-IV (Levels 20-30)
// ═══════════════════════════════════════════════════════════════════════

const DANTOOINE_ZONES: ZoneDefinition[] = [
  {
    id: "dantooine_enclave",
    name: "Ruinas del Enclave Jedi",
    description: "Los restos destrozados de la academia Jedi. La naturaleza reclama lo que la guerra destruyó.",
    planetId: "dantooine",
    sceneId: "dantooine_enclave",
    musicTrackId: "dantooine_ambient",
    hotspots: [
      { id: "hs_plains", label: "Llanuras de Cristal", position: [60, 60], type: "exit", targetZoneId: "dantooine_plains", icon: "door" },
      { id: "hs_sublevel", label: "Subnivel del Enclave", position: [40, 35], type: "exit", targetZoneId: "dantooine_sublevel", icon: "door" },
      { id: "hs_spaceport_dant", label: "Puerto espacial", position: [80, 75], type: "travel", icon: "ship" },
      { id: "hs_hidden_presence", label: "Una presencia en la Fuerza", position: [15, 32], type: "event", icon: "star", hideIfFlag: "found_hidden_jedi", eventFlag: "found_hidden_jedi", eventText: "Entre las ruinas del enclave, un hilo de la Fuerza viva se resiste a apagarse — disciplinado, oculto, vigilante. Sigues su rastro hasta una cámara sellada que no aparece en ningún plano. Alguien sobrevivió a la Purga aquí, y no quiere ser hallado." },
      { id: "hs_hidden_jedi", label: "Cámara oculta", position: [25, 25], type: "npc", npcId: "npc_jedi_master", icon: "person", requireFlag: "found_hidden_jedi" },
      { id: "hs_serana_clue", label: "El rastro de Serana", position: [35, 55], type: "event", icon: "star", requireFlag: "serana_recruited", hideIfFlag: "ls_clue_found", eventFlag: "ls_clue_found", eventText: "Entre los archivos quemados del enclave, Serana encuentra un registro: su maestra sobrevivió a la purga — y fue a un lugar al que juró no volver jamás. Le tiemblan las manos mientras lee." },
      { id: "hs_serana_truth", label: "La bóveda del archivo", position: [55, 42], type: "event", icon: "star", requireFlag: "ls_clue_found", hideIfFlag: "ls_truth_revealed", eventFlag: "ls_truth_revealed", eventText: "La verdad es peor que el abandono: su maestra no huyó del lado oscuro — lo abrazó, y dejó que Serana se creyera la única que había caído. La traición lo recontextualiza todo." },
      { id: "hs_serana_choice", label: "El ajuste de cuentas de Serana", position: [70, 50], type: "event", icon: "star", requireFlag: "ls_truth_revealed", hideIfFlag: "ls_choice_made", eventFlag: "ls_choice_made", eventText: "Serana está en la encrucijada a la que la ayudaste a llegar: dar caza a su maestra por venganza y consumar su caída, o dejar morir el pasado y redefinirse. Te mira — y elige." },
      // ── q_act3_hunger — el rastro de Nihilus lleva al enclave Jedi muerto. ──
      { id: "hs_act3_dantooine", label: "Llegada a Dantooine", position: [50, 72], type: "event", icon: "star", requireFlag: "act3_tomb_lord_defeated", hideIfFlag: "act3_arrived_dantooine", eventFlag: "act3_arrived_dantooine", eventText: "Lo que el Lord de la Tumba susurró al morir señalaba a Dantooine — a un enclave Jedi muerto donde el hambre de Nihilus dejó una herida en la Fuerza. La hierba crece sobre las ruinas, pero el silencio aquí no es paz." },
      { id: "hs_act3_enclave", label: "Registrar el Enclave", position: [50, 72], type: "event", icon: "star", requireFlag: "act3_arrived_dantooine", hideIfFlag: "act3_enclave_searched", eventFlag: "act3_enclave_searched", eventText: "Entre los archivos quemados encuentras el patrón: allá donde pasó Nihilus, la Fuerza misma quedó muerta, drenada hasta el hueso. El rastro de esa herida lleva a la cueva de cristal, donde los Jedi escuchaban antaño a la Fuerza viva." },
    ],
  },
  {
    id: "dantooine_plains",
    name: "Llanuras de Cristal",
    description: "Vastas praderas salpicadas de formaciones de cristal. Los sabuesos kath vagan en libertad.",
    planetId: "dantooine",
    sceneId: "dantooine_plains",
    hotspots: [
      { id: "hs_plains_back", label: "Volver al Enclave", position: [50, 85], type: "exit", targetZoneId: "dantooine_enclave", icon: "door" },
      { id: "hs_crystal_cave", label: "Cueva de Cristal", position: [35, 35], type: "exit", targetZoneId: "dantooine_crystal_cave", icon: "door" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "kath_hound", weight: 50 },
      { enemyId: "kinrath", weight: 30 },
      { enemyId: "mercenary", weight: 20 },
    ],
    encounterChance: 0.2,
  },
  {
    id: "dantooine_crystal_cave",
    name: "Cueva de Cristal",
    description: "Sagrada para los Jedi. Aquí crecen los cristales de sable de luz — pero también la oscuridad.",
    planetId: "dantooine",
    sceneId: "dantooine_crystal_cave",
    hotspots: [
      { id: "hs_cave_exit", label: "Salir de la cueva", position: [50, 85], type: "exit", targetZoneId: "dantooine_plains", icon: "door" },
      { id: "hs_crystal_heart", label: "Corazón de Cristal", position: [50, 25], type: "event", icon: "star", hideIfFlag: "ch_found_crystal", eventFlag: "ch_found_crystal", eventText: "En la cámara más honda, suspendido en una geoda del tamaño de una nave, late el Corazón de Cristal — un kyber tan puro que la Fuerza se curva a su alrededor. Y enroscado en torno a él, algo que lleva eones esperando a que alguien lo despierte." },
      // ── El Corazón de Cristal (q_crystal_heart) — sintoniza o corrompe. ──
      { id: "hs_ch_choice", label: "Comulgar con el Corazón de Cristal", position: [50, 42], type: "npc", npcId: "npc_crystal_heart", icon: "star", requireFlag: "ch_found_crystal", hideIfFlag: "ch_crystal_choice" },
      // ── q_act3_hunger — el cristal muerto entrega la visión del hambre de Nihilus. ──
      { id: "hs_act3_crystal", label: "El cristal silenciado", position: [32, 52], type: "event", icon: "star", requireFlag: "act3_enclave_searched", hideIfFlag: "act3_crystal_cave", eventFlag: "act3_crystal_cave", eventText: "Los cristales de la cueva, que deberían cantar con la Fuerza viva, cuelgan apagados y mudos. Donde Nihilus posó su atención, no quedó nada que cantar. En el corazón de ese silencio, algo te llama." },
      { id: "hs_act3_vision", label: "La visión del Hambre", position: [68, 48], type: "event", icon: "star", requireFlag: "act3_crystal_cave", hideIfFlag: "act3_nihilus_vision", eventFlag: "act3_nihilus_vision", eventText: "Tocas el cristal muerto y la Fuerza te arrastra a una visión: Darth Nihilus como una boca sin fin, devorando planetas enteros hasta dejarlos huecos, sin un solo eco. Comprendes por fin qué es — no un hombre, sino un hambre que solo la muerte de toda vida saciaría. Y ahora él sabe que lo has visto." },
    ],
  },
  {
    id: "dantooine_sublevel",
    name: "Subnivel del Enclave",
    description: "Los niveles inferiores secretos del Enclave Jedi. Archivos, cámaras de meditación y bóvedas selladas.",
    planetId: "dantooine",
    sceneId: "dantooine_sublevel",
    hotspots: [
      { id: "hs_sub_exit", label: "Volver al Enclave", position: [50, 85], type: "exit", targetZoneId: "dantooine_enclave", icon: "door" },
      // ── Secretos Jedi (q_jedi_secrets) — acceso → archivos (→ cámara opt.). ──
      { id: "hs_js_access", label: "Forzar el sello del subnivel", position: [50, 62], type: "event", icon: "star", hideIfFlag: "js_sublevel_access", eventFlag: "js_sublevel_access", eventText: "El sello de la esclusa del subnivel lleva siglos cerrado, grabado con una advertencia jedi: 'Lo que aquí guardamos, lo guardamos de nosotros mismos.' Cede bajo tu voluntad con un suspiro de aire rancio. Algunas puertas se cerraron por una razón." },
      { id: "hs_archives", label: "Archivos Jedi", position: [40, 40], type: "event", icon: "star", requireFlag: "js_sublevel_access", hideIfFlag: "js_archives_searched", eventFlag: "js_archives_searched", eventText: "Los archivos del Enclave, medio fundidos por la guerra, aún susurran. Entre datacrones rotos hallas lecciones que la Orden enterró: técnicas de la Fuerza demasiado cercanas al lado oscuro para enseñarse, y demasiado eficaces para destruirse." },
      { id: "hs_sealed_vault", label: "Cámara sellada", position: [60, 30], type: "encounter", encounterEnemies: ["corrupted_guardian"], icon: "sword", recommendedLevel: 26, requireFlag: "js_archives_searched", hideIfFlag: "js_vault_opened", victoryFlag: "js_vault_opened" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// TELOS — Act IV (Levels 28-38)
// ═══════════════════════════════════════════════════════════════════════

const TELOS_ZONES: ZoneDefinition[] = [
  {
    id: "telos_citadel",
    name: "Estación Ciudadela",
    description: "Una enorme estación orbital sobre la superficie en recuperación. Sede del Proyecto de Restauración de Telos.",
    planetId: "telos",
    sceneId: "telos_citadel",
    musicTrackId: "telos_ambient",
    hotspots: [
      { id: "hs_telos_surface", label: "Lanzadera de superficie", position: [50, 70], type: "exit", targetZoneId: "telos_surface", icon: "door" },
      { id: "hs_telos_port", label: "Hangar de atraque", position: [80, 40], type: "travel", icon: "ship" },
      // ── Tratos con Czerka (q_czerka_dealings) — contacto → misión → decisión. ──
      { id: "hs_cd_contact", label: "Representante de Czerka", position: [20, 42], type: "event", icon: "star", hideIfFlag: "cd_czerka_contact", eventFlag: "cd_czerka_contact", eventText: "El representante de Czerka en la estación no pierde el tiempo en cortesías. 'El Proyecto de Restauración es una fachada; nosotros hacemos el trabajo de verdad ahí abajo. Tengo un problema en la superficie que un agente discreto sabría resolver. Págase bien, y Czerka no olvida a sus amigos.'" },
      { id: "hs_cd_mission", label: "El trabajo sucio de Czerka", position: [70, 68], type: "encounter", encounterEnemies: ["mercenary", "czerka_merc", "salvage_droid"], icon: "sword", recommendedLevel: 29, requireFlag: "cd_czerka_contact", hideIfFlag: "cd_czerka_mission", victoryFlag: "cd_czerka_mission" },
      { id: "hs_czerka_rep", label: "Director Adjunto de Czerka", position: [50, 55], type: "npc", npcId: "npc_czerka_rep", icon: "person", requireFlag: "cd_czerka_mission", hideIfFlag: "cd_czerka_choice" },
      { id: "hs_telos_commander", label: "Comandante de la estación", position: [40, 35], type: "npc", npcId: "npc_telos_commander", icon: "person" },
      { id: "hs_dockhand_renn", label: "Estibador", position: [65, 55], type: "npc", npcId: "npc_dockhand_renn", icon: "person", requireFlag: "locke_smuggler_task" },
      { id: "hs_smuggler_cache", label: "Módulo 4 — Mamparo falso", position: [25, 60], type: "encounter", encounterEnemies: ["mercenary", "mercenary", "czerka_merc"], icon: "sword", recommendedLevel: 29, requireFlag: "telos_ring_lead", victoryFlag: "telos_ring_broken" },
      // ── El Trono Fracturado (q_act4_throne) — atraque y mando de la estación. ──
      { id: "hs_act4_arrival", label: "Atraque en la Estación Ciudadela", position: [60, 22], type: "event", icon: "star", requireFlag: "act3_nihilus_vision", hideIfFlag: "act4_arrived_telos", eventFlag: "act4_arrived_telos", eventText: "La Estación Ciudadela orbita una Telos que aún sangra ceniza del bombardeo sith. La visión de Dantooine te trajo aquí — el hambre de Nihilus y la fractura del trono de Sion convergen en este mundo a medio resucitar." },
      { id: "hs_act4_commander", label: "Reunión con el Comandante", position: [40, 50], type: "event", icon: "star", requireFlag: "act4_arrived_telos", hideIfFlag: "act4_met_commander", eventFlag: "act4_met_commander", eventText: "El Comandante de la estación te recibe con la fatiga de quien guarda un mundo con demasiado poca gente. 'Si buscas la verdad del Triunvirato, está bajo nosotros, en la superficie — en un laboratorio que los rakata dejaron antes de que existiera la República. Nadie que baja a por respuestas vuelve con ellas.'" },
    ],
  },
  {
    id: "telos_surface",
    name: "Superficie de Telos",
    description: "Un mundo que aún se cura del bombardeo sith. La vida lucha por volver entre las ruinas.",
    planetId: "telos",
    sceneId: "telos_surface",
    hotspots: [
      { id: "hs_surface_back", label: "Volver a la estación", position: [50, 15], type: "exit", targetZoneId: "telos_citadel", icon: "door" },
      // ── Veneno en la Tierra (q_land_poison) — Lira y el vertedero de Czerka. ──
      { id: "hs_lira", label: "Doctora Lira Venn", position: [80, 40], type: "npc", npcId: "npc_dr_lira", icon: "person", hideIfFlag: "lira_resolved" },
      { id: "hs_czerka_dump", label: "El vertedero junto al río muerto", position: [35, 72], type: "encounter", encounterEnemies: ["czerka_merc", "czerka_merc", "salvage_droid"], icon: "sword", recommendedLevel: 31, requireFlag: "lira_met", hideIfFlag: "lira_evidence", victoryFlag: "lira_evidence" },
      // ── q_act4_throne — descenso a las ruinas de la superficie. ──
      { id: "hs_act4_surface", label: "Descenso a la superficie", position: [62, 45], type: "event", icon: "star", requireFlag: "act4_met_commander", hideIfFlag: "act4_surface_descended", eventFlag: "act4_surface_descended", eventText: "La lanzadera desciende sobre las ruinas de la superficie. La Fuerza aquí está rala, como tela gastada — Telos también fue alimento del hambre, hace mucho. Entre los escombros parpadea la señal de una tecnología que no debería seguir despierta." },
      // ── Supervivientes de la Superficie (q_surface_survivors). ──
      { id: "hs_ss_settlement", label: "Asentamiento de supervivientes", position: [25, 38], type: "event", icon: "star", hideIfFlag: "ss_settlement_found", eventFlag: "ss_settlement_found", eventText: "Entre las ruinas de la superficie, una columna de humo delata a un puñado de colonos que se aferran a la vida donde no debería quedar ninguna. Cultivan ceniza, racionan agua reciclada y temen tanto a las bestias como a Czerka. No esperaban ver a nadie con un sable." },
      { id: "hs_survivor_leader", label: "Capataz de los Supervivientes", position: [70, 62], type: "npc", npcId: "npc_survivor_leader", icon: "person", requireFlag: "ss_settlement_found", hideIfFlag: "ss_choice_made" },
      { id: "hs_rakata_lab", label: "Laboratorio Rakata", position: [40, 55], type: "exit", targetZoneId: "telos_rakata_lab", icon: "door", recommendedLevel: 32, requireFlag: "act4_surface_descended" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "czerka_merc", weight: 40 },
      { enemyId: "salvage_droid", weight: 35 },
      { enemyId: "wild_beast", weight: 25 },
    ],
    encounterChance: 0.2,
  },
  {
    id: "telos_rakata_lab",
    name: "Laboratorio Rakata",
    description: "Tecnología antigua del Imperio Infinito. La realidad se dobla de formas que no deberían ser posibles.",
    planetId: "telos",
    sceneId: "telos_rakata_lab",
    hotspots: [
      { id: "hs_rlab_exit", label: "Salir del laboratorio", position: [50, 85], type: "exit", targetZoneId: "telos_surface", icon: "door" },
      // ── q_act4_throne — descubrir el lab → derrotar al constructo → la verdad. ──
      { id: "hs_act4_rakata", label: "Cámara del Imperio Infinito", position: [30, 55], type: "event", icon: "star", requireFlag: "act4_surface_descended", hideIfFlag: "act4_rakata_found", eventFlag: "act4_rakata_found", eventText: "Tras una compuerta de aleación imposible se abre el laboratorio rakata: geometría que duele a la vista, máquinas que llevan milenios pensando solas. Aquí el Imperio Infinito experimentó con la Fuerza misma — y algo de lo que aprendieron dio forma a lo que el Triunvirato llegaría a ser." },
      { id: "hs_rlab_core", label: "Núcleo Rakata", position: [50, 25], type: "encounter", encounterEnemies: ["rakata_construct"], icon: "sword", recommendedLevel: 35, requireFlag: "act4_rakata_found", hideIfFlag: "act4_construct_defeated", victoryFlag: "act4_construct_defeated" },
      { id: "hs_act4_truth", label: "La verdad del Triunvirato", position: [70, 50], type: "event", icon: "star", requireFlag: "act4_construct_defeated", hideIfFlag: "act4_truth_learned", eventFlag: "act4_truth_learned", eventText: "En el núcleo silenciado del constructo lees el registro rakata: ellos fueron los primeros en arrancar la Fuerza de los vivos y embotellarla. Nihilus, Sion y Traya no inventaron su hambre — la heredaron de una herida que el Imperio Infinito abrió hace veinte mil años. El Triunvirato es solo su eco más reciente, y el más hambriento." },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// MALACHOR V — Act V Final (Levels 35-50)
// ═══════════════════════════════════════════════════════════════════════

const MALACHOR_ZONES: ZoneDefinition[] = [
  {
    id: "malachor_surface",
    name: "Superficie de Malachor V",
    description: "Un mundo hecho pedazos. Anomalías gravitatorias, escombros flotantes y los ecos aullantes del Generador de Sombra Másica.",
    planetId: "malachor_v",
    sceneId: "malachor_surface",
    musicTrackId: "malachor_ambient",
    hotspots: [
      // ── La Elección Final (q_act5_final_choice) — llegada y travesía. ──
      { id: "hs_act5_arrival", label: "Llegada a Malachor V", position: [50, 18], type: "event", icon: "star", requireFlag: "act4_truth_learned", hideIfFlag: "act5_arrived_malachor", eventFlag: "act5_arrived_malachor", eventText: "Malachor V no es un mundo: es una herida. La nave atraviesa anillos de escombros que aún orbitan el día en que el Generador de Sombra Másica mató a dos flotas a la vez. Aquí terminó la Guerra Mandaloriana. Aquí terminará el Triunvirato — o tú." },
      { id: "hs_act5_navigate", label: "La superficie destrozada", position: [62, 66], type: "event", icon: "star", requireFlag: "act5_arrived_malachor", hideIfFlag: "act5_surface_navigated", eventFlag: "act5_surface_navigated", eventText: "La superficie se pliega bajo gravedades imposibles; el suelo se inclina como la cubierta de un barco que se hunde. El lado oscuro tira de cada paso como una resaca. Más adelante, una grieta desciende hacia las Profundidades de Trayus, de donde sube el frío." },
      { id: "hs_mal_depths", label: "Profundidades de Trayus", position: [40, 50], type: "exit", targetZoneId: "malachor_depths", icon: "door", requireFlag: "act5_surface_navigated" },
      { id: "hs_mal_ghost", label: "Pecio del crucero fantasma", position: [70, 40], type: "exit", targetZoneId: "malachor_ghost_ship", icon: "door", recommendedLevel: 40 },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "storm_beast", weight: 40 },
      { enemyId: "shadow_assassin", weight: 35 },
      { enemyId: "void_wraith", weight: 25 },
    ],
    encounterChance: 0.35,
  },
  {
    id: "malachor_depths",
    name: "Profundidades de Trayus",
    description: "El camino a la Academia de Trayus. Aquí el lado oscuro es una fuerza física que presiona tu mente.",
    planetId: "malachor_v",
    sceneId: "malachor_depths",
    hotspots: [
      { id: "hs_depths_back", label: "Volver a la superficie", position: [50, 85], type: "exit", targetZoneId: "malachor_surface", icon: "door" },
      // ── q_act5_final_choice — el descenso a Trayus. ──
      { id: "hs_act5_depths", label: "El descenso a Trayus", position: [50, 62], type: "event", icon: "star", requireFlag: "act5_surface_navigated", hideIfFlag: "act5_depths_descended", eventFlag: "act5_depths_descended", eventText: "Las Profundidades de Trayus respiran. Aquí el lado oscuro no se siente: se padece, prensando la mente como una mano que se cierra. Al final del descenso aguarda la Academia de Trayus, y en ella los tres que se repartieron el hambre del mundo." },
      { id: "hs_trayus_academy", label: "Academia de Trayus", position: [50, 25], type: "exit", targetZoneId: "malachor_trayus", icon: "door", recommendedLevel: 42, requireFlag: "act5_depths_descended" },
      { id: "hs_echo_artifact", label: "La piedra de atadura", position: [30, 45], type: "event", icon: "star", requireFlag: "echo_recruited", hideIfFlag: "le_artifact_found", eventFlag: "le_artifact_found", eventText: "Echo Shade te conduce hasta el artefacto que lo ancla al mundo de los vivos — una piedra de atadura sith partida de lado a lado. La voz del espíritu se deshilacha por los bordes. Pronto no quedará nada que atar, ni que liberar." },
      { id: "hs_echo_choice", label: "El destino de Echo", position: [70, 48], type: "event", icon: "star", requireFlag: "le_artifact_found", hideIfFlag: "le_choice_made", eventFlag: "le_choice_made", eventText: "Sostienes la piedra agrietada. Destrúyela y Echo Shade se disuelve en la Fuerza, por fin en paz — o vierte tu propio poder oscuro en la fractura y átalo con más fuerza, un sirviente sabio encadenado a tu voluntad durante siglos. El espíritu espera, y no suplica." },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "shadow_assassin", weight: 40 },
      { enemyId: "void_wraith", weight: 35 },
      { enemyId: "sith_marauder_elite", weight: 25 },
    ],
    encounterChance: 0.3,
  },
  {
    id: "malachor_ghost_ship",
    name: "Crucero Fantasma",
    description: "Una nave de guerra de la República congelada en un limbo gravitatorio. Los espíritus de la tripulación aún recorren los pasillos.",
    planetId: "malachor_v",
    sceneId: "malachor_ghost_ship",
    hotspots: [
      { id: "hs_ghost_exit", label: "Salir de la nave", position: [50, 85], type: "exit", targetZoneId: "malachor_surface", icon: "door" },
      // ── La Nave Fantasma (q_ghost_ship) — abordar → capitán → (historia opt.). ──
      { id: "hs_gs_board", label: "Aborda el crucero fantasma", position: [50, 58], type: "event", icon: "star", hideIfFlag: "gs_boarded", eventFlag: "gs_boarded", eventText: "Cruzas la esclusa del crucero congelado en el limbo gravitatorio de Malachor. Dentro, el tiempo no fluye: la tripulación repite sus últimos instantes en bucle, gritos sin sonido en pasillos sin aire. La nave murió aquí, y no lo ha aceptado." },
      { id: "hs_ghost_bridge", label: "Puente de mando", position: [50, 20], type: "encounter", encounterEnemies: ["ghost_captain"], icon: "sword", recommendedLevel: 42, requireFlag: "gs_boarded", hideIfFlag: "gs_captain_defeated", victoryFlag: "gs_captain_defeated" },
      { id: "hs_gs_history", label: "El registro del puente", position: [70, 55], type: "event", icon: "star", requireFlag: "gs_captain_defeated", hideIfFlag: "gs_history_learned", eventFlag: "gs_history_learned", eventText: "El registro del capitán, por fin en calma, cuenta el final: cuando el Generador de Sombra de Masa se activó sobre Malachor, mató por igual a mandalorianos y republicanos, y abrió en la Fuerza una herida que aún drena a los vivos. Esta nave es solo una de mil cicatrices." },
    ],
  },
  {
    id: "malachor_trayus",
    name: "Academia de Trayus",
    description: "El corazón del poder del Triunvirato Sith. Donde nacieron Traya, Nihilus y Sion — y donde terminarán.",
    planetId: "malachor_v",
    sceneId: "malachor_trayus",
    hotspots: [
      { id: "hs_trayus_back", label: "Retirada", position: [50, 85], type: "exit", targetZoneId: "malachor_depths", icon: "door" },
      // ── q_act5_final_choice — Sion → Nihilus → Núcleo → elección → Traya. ──
      { id: "hs_sion_arena", label: "La arena de Sion", position: [30, 40], type: "encounter", encounterEnemies: ["darth_sion"], icon: "sword", recommendedLevel: 45, requireFlag: "act5_depths_descended", hideIfFlag: "sion_defeated", victoryFlag: "sion_defeated" },
      { id: "hs_nihilus_void", label: "El Vacío de Nihilus", position: [70, 35], type: "encounter", encounterEnemies: ["darth_nihilus"], icon: "sword", recommendedLevel: 47, requireFlag: "sion_defeated", hideIfFlag: "nihilus_defeated", victoryFlag: "nihilus_defeated" },
      // ── La Senda del Dolor (q_sion_path) — entrar en la arena, sobrevivir a sus fases. ──
      { id: "hs_sp_enter", label: "Entra en la Arena de Sion", position: [25, 55], type: "event", icon: "star", requireFlag: "act5_depths_descended", hideIfFlag: "sp_arena_entered", eventFlag: "sp_arena_entered", eventText: "El umbral de la arena de Sion está sembrado de los huesos de quienes lo cruzaron antes. El Señor del Dolor no vence: simplemente se niega a caer, levantándose una y otra vez del odio que lo mantiene entero. Para superarlo tendrás que entender eso primero." },
      { id: "hs_sp_phases", label: "Has quebrado a Sion", position: [30, 62], type: "event", icon: "star", requireFlag: "sion_defeated", hideIfFlag: "sp_sion_phases", eventFlag: "sp_sion_phases", eventText: "Tres veces lo derribas; tres veces el dolor lo recompone. Solo cuando comprendes que es su propia voluntad de sufrir la que lo encadena a la vida, y le ofreces la única liberación que teme, Darth Sion deja por fin de levantarse." },
      // ── Hacia el Vacío (q_nihilus_void) — entrar y resistir el drenaje. ──
      { id: "hs_nv_enter", label: "Entra en el Vacío de Nihilus", position: [75, 50], type: "event", icon: "star", requireFlag: "sion_defeated", hideIfFlag: "nv_entered", eventFlag: "nv_entered", eventText: "Donde está Nihilus, la Fuerza simplemente deja de existir. Cruzar el umbral de su cámara es entrar en un hambre con forma de hombre: cada paso te arranca algo, calor, recuerdo, fuerza vital. Pocos llegan hasta él con algo que ofrecer salvo su propia muerte." },
      { id: "hs_nv_resist", label: "Has resistido el drenaje", position: [78, 60], type: "event", icon: "star", requireFlag: "nihilus_defeated", hideIfFlag: "nv_resisted", eventFlag: "nv_resisted", eventText: "El hambre de Nihilus se vuelca sobre ti para devorarte como devoró mundos — pero te aferras a tu propia llama y no te dejas tragar. Cuando su máscara cae, hueca, comprendes que bajo ella no quedaba nadie desde hacía mucho. Solo el apetito." },
      { id: "hs_act5_core", label: "El Núcleo de Trayus", position: [50, 52], type: "event", icon: "star", requireFlag: "nihilus_defeated", hideIfFlag: "act5_core_reached", eventFlag: "act5_core_reached", eventText: "Con Sion y Nihilus caídos, las puertas del Núcleo de Trayus se abren sin oponerse. Dentro espera Kreia — Darth Traya, la maestra de todos ellos y la tuya en todo menos en el nombre. No empuña sable. No le hace falta. Te ha estado esperando desde el principio." },
      { id: "hs_act5_choice", label: "La decisión final", position: [50, 68], type: "event", icon: "star", requireFlag: "act5_core_reached", hideIfFlag: "act5_final_choice_made", eventFlag: "act5_final_choice_made", eventText: "Traya te ofrece la última lección antes del último golpe: heredar el hambre y reinar sobre una galaxia de esclavos, o romper la rueda del lado oscuro y dejar que la Fuerza vuelva a respirar libre. Sea cual sea tu elección, solo queda una forma de sellarla." },
      { id: "hs_trayus_core", label: "Núcleo de Trayus", position: [50, 15], type: "encounter", encounterEnemies: ["darth_traya"], icon: "sword", recommendedLevel: 50, requireFlag: "act5_final_choice_made", hideIfFlag: "traya_defeated", victoryFlag: "traya_defeated" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// PLANETS
// ═══════════════════════════════════════════════════════════════════════

export const PLANETS: PlanetDefinition[] = [
  {
    id: "korriban",
    name: "Korriban",
    description: "Mundo natal de los Sith. Tumbas antiguas, la Academia y un desierto sin fin.",
    startingZoneId: "korriban_academy_exterior",
    zoneIds: KORRIBAN_ZONES.map((z) => z.id),
    levelRange: [1, 10],
    available: true,
  },
  {
    id: "nar_shaddaa",
    name: "Nar Shaddaa",
    description: "La Luna de los Contrabandistas. Crimen, comercio y corrupción bajo las luces de neón.",
    startingZoneId: "nar_shaddaa_promenade",
    zoneIds: NAR_SHADDAA_ZONES.map((z) => z.id),
    levelRange: [11, 18],
    available: false,
    unlockQuestId: "q_chains_of_korriban",
  },
  {
    id: "ziost",
    name: "Ziost",
    description: "El primer trono helado de los Sith. Una capital muerta bajo el hielo y la aurora, donde una canción antigua empieza a despertar.",
    startingZoneId: "ziost_spaceport",
    zoneIds: ZIOST_ZONES.map((z) => z.id),
    levelRange: [12, 16],
    available: true,
  },
  {
    id: "dromund_kaas",
    name: "Dromund Kaas",
    description: "Sede del Imperio Sith. Tormentas y ciudadelas arriba; ruinas del Templo Oscuro abajo.",
    startingZoneId: "dromund_kaas_spaceport",
    zoneIds: DROMUND_KAAS_ZONES.map((z) => z.id),
    levelRange: [8, 12],
    available: true,
  },
  {
    id: "onderon",
    name: "Onderon",
    description: "Un mundo de intriga política y guerreros que cabalgan bestias.",
    startingZoneId: "onderon_city",
    zoneIds: ONDERON_ZONES.map((z) => z.id),
    levelRange: [15, 22],
    available: false,
    unlockQuestId: "q_act2_shadows",
  },
  {
    id: "dxun",
    name: "Dxun",
    description: "La luna selvática de Onderon. Puestos mandalorianos y presencia sith antigua.",
    startingZoneId: "dxun_jungle",
    zoneIds: DXUN_ZONES.map((z) => z.id),
    levelRange: [18, 28],
    available: false,
    unlockQuestId: "q_act2_shadows",
  },
  {
    id: "dantooine",
    name: "Dantooine",
    description: "Apacibles praderas que ocultan ruinas Jedi y oscuros secretos.",
    startingZoneId: "dantooine_enclave",
    zoneIds: DANTOOINE_ZONES.map((z) => z.id),
    levelRange: [20, 30],
    available: false,
    unlockQuestId: "q_act3_hunger",
  },
  {
    id: "telos",
    name: "Telos IV",
    description: "Un mundo en recuperación con una estación orbital y tecnología rakata oculta.",
    startingZoneId: "telos_citadel",
    zoneIds: TELOS_ZONES.map((z) => z.id),
    levelRange: [28, 38],
    available: false,
    unlockQuestId: "q_act4_throne",
  },
  {
    id: "malachor_v",
    name: "Malachor V",
    description: "El mundo hecho pedazos. El final. Donde empezó el Triunvirato, y donde acaba.",
    startingZoneId: "malachor_surface",
    zoneIds: MALACHOR_ZONES.map((z) => z.id),
    levelRange: [35, 50],
    available: false,
    unlockQuestId: "q_act5_final_choice",
  },
];

export const ALL_ZONES: ZoneDefinition[] = [
  ...KORRIBAN_ZONES,
  ...DROMUND_KAAS_ZONES,
  ...ZIOST_ZONES,
  ...NAR_SHADDAA_ZONES,
  ...ONDERON_ZONES,
  ...DXUN_ZONES,
  ...DANTOOINE_ZONES,
  ...TELOS_ZONES,
  ...MALACHOR_ZONES,
  ...SHIP_ZONES,
  ...DUNGEON_RAGNOS_ZONES,
  ...DUNGEON_CATHEDRAL_ZONES,
];

export const ZONE_MAP = new Map(ALL_ZONES.map((z) => [z.id, z]));
export const PLANET_MAP = new Map(PLANETS.map((p) => [p.id, p]));
