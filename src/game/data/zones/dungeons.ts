import type { ZoneDefinition } from "../../engine/world/zone-types";

/**
 * Dungeon definitions — §12 "Mazmorras".
 *
 * Dungeon Structure per Design Bible:
 *   Entry → Exploration → Puzzle → Mini Boss → Final Boss → Reward Room
 *
 * 4 major dungeons across the game:
 *   - Tomb of Ragnos (Korriban, Act I)
 *   - Rakata Lab (Telos, Act IV)
 *   - Ghost Cruiser (Malachor, Act V)
 *   - Cathedral of Hunger (Malachor, Act V)
 */

export interface DungeonDefinition {
  id: string;
  name: string;
  description: string;
  planetId: string;
  levelRange: [number, number];
  /** Ordered zone IDs forming the dungeon path. */
  zoneIds: string[];
  /** Final boss enemy ID. */
  finalBossId: string;
  /** Reward loot table. */
  rewardLootTableId: string;
}

export const DUNGEONS: DungeonDefinition[] = [
  {
    id: "dungeon_tomb_of_ragnos",
    name: "Tumba de Ragnos",
    description: "La tumba sellada de Marka Ragnos, uno de los Lores Sith más poderosos que jamás existieron. Trampas, guardianes y un poder inimaginable aguardan.",
    planetId: "korriban",
    levelRange: [7, 10],
    zoneIds: [
      "dungeon_ragnos_entry",
      "dungeon_ragnos_halls",
      "dungeon_ragnos_puzzle",
      "dungeon_ragnos_guardian",
      "dungeon_ragnos_sanctum",
      "dungeon_ragnos_vault",
    ],
    finalBossId: "ragnos_guardian",
    rewardLootTableId: "loot_dungeon_ragnos",
  },
  {
    id: "dungeon_rakata_lab",
    name: "Laboratorio Rakata",
    description: "Una antigua instalación de investigación del Imperio Infinito enterrada bajo Telos. La realidad se deforma en sus corredores.",
    planetId: "telos",
    levelRange: [30, 35],
    zoneIds: [
      "dungeon_rakata_entry",
      "dungeon_rakata_corridors",
      "dungeon_rakata_puzzle",
      "dungeon_rakata_security",
      "dungeon_rakata_core",
      "dungeon_rakata_vault",
    ],
    finalBossId: "rakata_construct",
    rewardLootTableId: "loot_dungeon_rakata",
  },
  {
    id: "dungeon_ghost_cruiser",
    name: "Crucero Fantasma",
    description: "Una nave de guerra de la República congelada en la anomalía gravitatoria de Malachor. Los espíritus de la tripulación aún recorren los pasillos, repitiendo sus últimos momentos.",
    planetId: "malachor_v",
    levelRange: [38, 42],
    zoneIds: [
      "dungeon_ghost_hangar",
      "dungeon_ghost_corridors",
      "dungeon_ghost_engine",
      "dungeon_ghost_armory",
      "dungeon_ghost_bridge",
      "dungeon_ghost_vault",
    ],
    finalBossId: "ghost_captain",
    rewardLootTableId: "loot_dungeon_ghost",
  },
  {
    id: "dungeon_cathedral_of_hunger",
    name: "Catedral del Hambre",
    description: "El sanctasanctórum más profundo de Malachor V. Donde Nihilus se convirtió por primera vez en el Vacío. Aquí el lado oscuro es una fuerza física.",
    planetId: "malachor_v",
    levelRange: [45, 50],
    zoneIds: [
      "dungeon_cathedral_entry",
      "dungeon_cathedral_nave",
      "dungeon_cathedral_puzzle",
      "dungeon_cathedral_altar",
      "dungeon_cathedral_void",
      "dungeon_cathedral_heart",
    ],
    finalBossId: "darth_nihilus",
    rewardLootTableId: "loot_dungeon_cathedral",
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Dungeon Zones — Tomb of Ragnos
// ═══════════════════════════════════════════════════════════════════════

export const DUNGEON_RAGNOS_ZONES: ZoneDefinition[] = [
  {
    id: "dungeon_ragnos_entry",
    name: "Tumba de Ragnos — Entrada",
    description: "Las enormes puertas de piedra se abren con un chirrido. Un aire frío sale a borbotones, cargado de susurros de poder antiguo.",
    planetId: "korriban",
    sceneId: "dungeon_ragnos_entry",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_ragnos_exit", label: "Salir de la tumba", position: [50, 85], type: "exit", targetZoneId: "korriban_valley", icon: "door" },
      { id: "hs_ragnos_deeper", label: "Descender", position: [50, 30], type: "exit", targetZoneId: "dungeon_ragnos_halls", icon: "door" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "tomb_droid", weight: 40 },
      { enemyId: "tomb_wraith", weight: 30 },
      { enemyId: "shyrack", weight: 30 },
    ],
    encounterChance: 0.25,
  },
  {
    id: "dungeon_ragnos_halls",
    name: "Tumba de Ragnos — Salas de los Muertos",
    description: "Corredores interminables flanqueados de sarcófagos. Algunos están abiertos. Algunos no deberían estarlo.",
    planetId: "korriban",
    sceneId: "dungeon_ragnos_halls",
    musicTrackId: "korriban_ambient",
    hotspots: [
      { id: "hs_ragnos_back1", label: "Volver a la entrada", position: [50, 85], type: "exit", targetZoneId: "dungeon_ragnos_entry", icon: "door" },
      { id: "hs_ragnos_loot1", label: "Sarcófago antiguo", position: [30, 45], type: "loot", icon: "chest" },
      { id: "hs_ragnos_puzzle_door", label: "Cámara sellada", position: [50, 25], type: "exit", targetZoneId: "dungeon_ragnos_puzzle", icon: "door" },
      { id: "hs_ragnos_ambush", label: "Alcoba oscura", position: [70, 40], type: "encounter", encounterEnemies: ["tomb_wraith", "tomb_wraith"], icon: "sword", recommendedLevel: 8 },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "tomb_wraith", weight: 50 },
      { enemyId: "tomb_droid", weight: 50 },
    ],
    encounterChance: 0.3,
  },
  {
    id: "dungeon_ragnos_puzzle",
    name: "Tumba de Ragnos — Prueba del Conocimiento",
    description: "Una cámara de glifos sith y muros cambiantes. La tumba pone a prueba tu mente antes que tu hoja.",
    planetId: "korriban",
    sceneId: "dungeon_ragnos_puzzle",
    hotspots: [
      { id: "hs_ragnos_back2", label: "Volver a las salas", position: [50, 85], type: "exit", targetZoneId: "dungeon_ragnos_halls", icon: "door" },
      { id: "hs_ragnos_glyph", label: "Glifos Sith", position: [50, 40], type: "event", icon: "star", hideIfFlag: "ragnos_puzzle_solved", eventFlag: "ragnos_puzzle_solved", eventText: "Descifras la secuencia de glifos en el orden correcto — fuerza, dominio, sacrificio. Los muros se desplazan con un gemido de piedra y la cámara del Guardián queda abierta." },
      { id: "hs_ragnos_guardian_door", label: "Cámara del Guardián", position: [50, 15], type: "exit", targetZoneId: "dungeon_ragnos_guardian", icon: "door", requireFlag: "ragnos_puzzle_solved" },
    ],
  },
  {
    id: "dungeon_ragnos_guardian",
    name: "Tumba de Ragnos — Cámara del Guardián",
    description: "Un enorme constructo de guerra se activa. El minijefe custodia la senda al sanctasanctórum.",
    planetId: "korriban",
    sceneId: "dungeon_ragnos_guardian",
    hotspots: [
      { id: "hs_ragnos_back3", label: "Retirada", position: [50, 85], type: "exit", targetZoneId: "dungeon_ragnos_puzzle", icon: "door" },
      { id: "hs_ragnos_mini_boss", label: "Guardián de la Tumba", position: [50, 35], type: "encounter", encounterEnemies: ["tomb_guardian_boss"], icon: "sword", recommendedLevel: 9, hideIfFlag: "ragnos_guardian_defeated", victoryFlag: "ragnos_guardian_defeated" },
      { id: "hs_ragnos_sanctum_door", label: "Sanctasanctórum interior", position: [50, 15], type: "exit", targetZoneId: "dungeon_ragnos_sanctum", icon: "door", requireFlag: "ragnos_guardian_defeated" },
    ],
  },
  {
    id: "dungeon_ragnos_sanctum",
    name: "Tumba de Ragnos — Sanctasanctórum",
    description: "El lugar de descanso del propio Marka Ragnos. Su espíritu se cierne sobre un trono de obsidiana.",
    planetId: "korriban",
    sceneId: "dungeon_ragnos_sanctum",
    hotspots: [
      { id: "hs_ragnos_back4", label: "Retirada", position: [50, 85], type: "exit", targetZoneId: "dungeon_ragnos_guardian", icon: "door" },
      { id: "hs_ragnos_spirit", label: "Espíritu de Ragnos", position: [50, 30], type: "encounter", encounterEnemies: ["ragnos_spirit"], icon: "sword", recommendedLevel: 10, hideIfFlag: "ragnos_spirit_defeated", victoryFlag: "ragnos_spirit_defeated" },
      { id: "hs_ragnos_vault_door", label: "Cámara del Tesoro", position: [50, 15], type: "exit", targetZoneId: "dungeon_ragnos_vault", icon: "chest", requireFlag: "ragnos_spirit_defeated" },
    ],
  },
  {
    id: "dungeon_ragnos_vault",
    name: "Tumba de Ragnos — Cámara del Tesoro",
    description: "La cámara del tesoro. Artefactos sith antiguos, armas y holocrones aguardan.",
    planetId: "korriban",
    sceneId: "dungeon_ragnos_vault",
    hotspots: [
      { id: "hs_ragnos_vault_exit", label: "Salir de la tumba", position: [50, 85], type: "exit", targetZoneId: "korriban_valley", icon: "door" },
      { id: "hs_ragnos_treasure1", label: "Panoplia de armas", position: [30, 40], type: "loot", icon: "chest" },
      { id: "hs_ragnos_treasure2", label: "Pedestal de holocrón", position: [50, 35], type: "loot", icon: "chest" },
      { id: "hs_ragnos_treasure3", label: "Vitrina de reliquias", position: [70, 40], type: "loot", icon: "chest" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════
// Dungeon Zones — Cathedral of Hunger
// ═══════════════════════════════════════════════════════════════════════

export const DUNGEON_CATHEDRAL_ZONES: ZoneDefinition[] = [
  {
    id: "dungeon_cathedral_entry",
    name: "Catedral del Hambre — Umbral",
    description: "La entrada palpita de hambre. Sientes que tu Fuerza se drena con solo permanecer aquí.",
    planetId: "malachor_v",
    sceneId: "dungeon_cathedral_entry",
    musicTrackId: "malachor_ambient",
    hotspots: [
      { id: "hs_cath_exit", label: "Retirada", position: [50, 85], type: "exit", targetZoneId: "malachor_depths", icon: "door" },
      { id: "hs_cath_deeper", label: "Entrar en la nave", position: [50, 30], type: "exit", targetZoneId: "dungeon_cathedral_nave", icon: "door" },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "void_wraith", weight: 50 },
      { enemyId: "shadow_assassin", weight: 50 },
    ],
    encounterChance: 0.35,
  },
  {
    id: "dungeon_cathedral_nave",
    name: "Catedral del Hambre — Nave",
    description: "Pilares de energía oscura cristalizada sostienen un techo perdido en la sombra. Hay voces que susurran desde todas las direcciones.",
    planetId: "malachor_v",
    sceneId: "dungeon_cathedral_nave",
    musicTrackId: "malachor_ambient",
    hotspots: [
      { id: "hs_cath_back1", label: "Volver al umbral", position: [50, 85], type: "exit", targetZoneId: "dungeon_cathedral_entry", icon: "door" },
      { id: "hs_cath_puzzle", label: "Círculo ritual", position: [50, 25], type: "exit", targetZoneId: "dungeon_cathedral_puzzle", icon: "door" },
      { id: "hs_cath_loot1", label: "Altar destrozado", position: [25, 50], type: "loot", icon: "chest" },
      { id: "hs_cath_ambush", label: "Pilar de sombra", position: [75, 45], type: "encounter", encounterEnemies: ["void_wraith", "void_wraith", "shadow_assassin"], icon: "sword", recommendedLevel: 46 },
    ],
    randomEncounters: true,
    randomEncounterPool: [
      { enemyId: "void_wraith", weight: 40 },
      { enemyId: "sith_marauder_elite", weight: 30 },
      { enemyId: "shadow_assassin", weight: 30 },
    ],
    encounterChance: 0.3,
  },
  {
    id: "dungeon_cathedral_puzzle",
    name: "Catedral del Hambre — Cámara del Ritual",
    description: "Hay que completar un antiguo ritual sith para avanzar. La elección equivocada significa la muerte.",
    planetId: "malachor_v",
    sceneId: "dungeon_cathedral_puzzle",
    hotspots: [
      { id: "hs_cath_back2", label: "Volver a la nave", position: [50, 85], type: "exit", targetZoneId: "dungeon_cathedral_nave", icon: "door" },
      { id: "hs_cath_ritual", label: "Ritual Sith", position: [50, 40], type: "event", icon: "star", hideIfFlag: "cathedral_ritual_complete", eventFlag: "cathedral_ritual_complete", eventText: "Completas el ritual en el orden que solo un corazón ya entregado al hambre comprendería. El círculo se apaga, saciado, y la senda al Altar del Vacío se abre ante ti." },
      { id: "hs_cath_altar_door", label: "Senda al Altar", position: [50, 15], type: "exit", targetZoneId: "dungeon_cathedral_altar", icon: "door", requireFlag: "cathedral_ritual_complete" },
    ],
  },
  {
    id: "dungeon_cathedral_altar",
    name: "Catedral del Hambre — Altar del Vacío",
    description: "Un enorme altar donde Nihilus consumió por primera vez un mundo. El minijefe aguarda.",
    planetId: "malachor_v",
    sceneId: "dungeon_cathedral_altar",
    hotspots: [
      { id: "hs_cath_back3", label: "Retirada", position: [50, 85], type: "exit", targetZoneId: "dungeon_cathedral_puzzle", icon: "door" },
      { id: "hs_cath_mini_boss", label: "Heraldo del Vacío", position: [50, 35], type: "encounter", encounterEnemies: ["void_wraith", "void_wraith"], icon: "sword", recommendedLevel: 48, hideIfFlag: "cathedral_heralds_defeated", victoryFlag: "cathedral_heralds_defeated" },
      { id: "hs_cath_void_door", label: "El Vacío", position: [50, 15], type: "exit", targetZoneId: "dungeon_cathedral_void", icon: "door", requireFlag: "cathedral_heralds_defeated" },
    ],
  },
  {
    id: "dungeon_cathedral_void",
    name: "Catedral del Hambre — El Vacío",
    description: "Nada. Y todo. El espacio entre los espacios. Nihilus espera en el centro del hambre absoluta.",
    planetId: "malachor_v",
    sceneId: "dungeon_cathedral_void",
    hotspots: [
      { id: "hs_cath_back4", label: "Retirada", position: [50, 85], type: "exit", targetZoneId: "dungeon_cathedral_altar", icon: "door" },
      { id: "hs_cath_nihilus", label: "Darth Nihilus", position: [50, 30], type: "encounter", encounterEnemies: ["darth_nihilus"], icon: "sword", recommendedLevel: 47 },
      { id: "hs_cath_heart_door", label: "Corazón del Hambre", position: [50, 15], type: "exit", targetZoneId: "dungeon_cathedral_heart", icon: "chest", requireFlag: "nihilus_defeated" },
    ],
  },
  {
    id: "dungeon_cathedral_heart",
    name: "Catedral del Hambre — Corazón",
    description: "El núcleo de la Catedral. Aquí reposan reliquias sith antiguas de un poder inimaginable.",
    planetId: "malachor_v",
    sceneId: "dungeon_cathedral_heart",
    hotspots: [
      { id: "hs_cath_heart_exit", label: "Salir de la Catedral", position: [50, 85], type: "exit", targetZoneId: "malachor_depths", icon: "door" },
      { id: "hs_cath_relic1", label: "Fragmento de Nihilus", position: [30, 40], type: "loot", icon: "chest" },
      { id: "hs_cath_relic2", label: "Cristal del Vacío", position: [50, 35], type: "loot", icon: "chest" },
      { id: "hs_cath_relic3", label: "Códice de Traya", position: [70, 40], type: "loot", icon: "chest" },
    ],
  },
];
