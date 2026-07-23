/**
 * Holocron memory shards (Idea #18).
 *
 * 20 collectible shards spread through the world. Each grants:
 *   - a passive stat or combat modifier (permanent)
 *   - a short flashback dialogue / cutscene
 *
 * Collecting all 20 grants the achievement "Loremaster" and the title
 * "Voice of the Past".
 */

export interface MemoryShard {
  id: string;
  name: string;
  zoneHint: string;             // hint shown if shard not found
  flashbackSnippet: string;     // 1-2 lines shown when collected
  passiveDescription: string;
  effectId: string;             // resolved by talent-effects.ts
}

export const MEMORY_SHARDS: MemoryShard[] = [
  { id: "shard_marka_ragnos",    name: "Eco de Marka Ragnos",    zoneHint: "Korriban — Valle de los Lores Oscuros",
    flashbackSnippet: "\"El trono se forja de huesos. Siempre.\"",
    passiveDescription: "+5 PV máx. por nivel.", effectId: "passive_hp_per_level" },
  { id: "shard_revan",           name: "Eco de Revan",           zoneHint: "Dantooine — Ruinas del Viejo Enclave",
    flashbackSnippet: "\"He recorrido ambos caminos. Ninguno era la paz.\"",
    passiveDescription: "+1 a todos los atributos primarios.", effectId: "passive_primary_all_1" },
  { id: "shard_traya",           name: "Eco de Traya",           zoneHint: "Malachor V — La Herida",
    flashbackSnippet: "\"Para enseñar la verdad, primero debes mostrar la mentira.\"",
    passiveDescription: "+10% de XP obtenida.", effectId: "passive_xp_10" },
  { id: "shard_nihilus",         name: "Eco de Nihilus",         zoneHint: "Telos — Ruinas de la Ciudadela",
    flashbackSnippet: "\"El hambre nunca termina.\"",
    passiveDescription: "+5% de robo de vida con todo el daño.", effectId: "passive_lifesteal_5" },
  { id: "shard_sion",            name: "Eco de Sion",            zoneHint: "Korriban — Tumba de Ludo Kressh",
    flashbackSnippet: "\"La muerte no puede liberar a quien ha elegido permanecer.\"",
    passiveDescription: "Una vez por combate: sobrevive a un golpe mortal con 1 PV.", effectId: "passive_cheat_death" },
  { id: "shard_kreia",           name: "Susurro de Kreia",        zoneHint: "Onderon — Jungla de Dxun",
    flashbackSnippet: "\"Cada elección tiene un precio. Págalo a sabiendas.\"",
    passiveDescription: "+10% de influencia en diálogos.", effectId: "passive_influence_10" },
  { id: "shard_atris",           name: "Pesar de Atris",         zoneHint: "Telos — Academia Polar",
    flashbackSnippet: "\"Yo sostenía los holocrones. Ellos me sostenían a mí.\"",
    passiveDescription: "+20 de Puntos de Fuerza máx.", effectId: "passive_max_fp_20" },
  { id: "shard_visas",           name: "Vínculo de Visas",           zoneHint: "Dromund Kaas — Jardín de la Ciudadela",
    flashbackSnippet: "\"Me miraste, y supe que el universo no estaba vacío.\"",
    passiveDescription: "Los aliados se curan un +25%.", effectId: "passive_ally_heal_25" },
  { id: "shard_bao_dur",         name: "Voto de Bao-Dur",          zoneHint: "Malachor V — Lugar del Accidente",
    flashbackSnippet: "\"Lo que una vez fue mío, lo desharé.\"",
    passiveDescription: "+15% de daño crítico.", effectId: "passive_crit_dmg_15" },
  { id: "shard_marka_dark",      name: "Máscara de Marka Ragnos",    zoneHint: "Korriban — Tumba Secreta",
    flashbackSnippet: "\"La eternidad es una promesa hecha por hombres pequeños.\"",
    passiveDescription: "+20% de daño de la Fuerza.", effectId: "passive_force_dmg_20" },
  { id: "shard_naga_sadow",      name: "Trono de Naga Sadow",    zoneHint: "Yavin IV — Templo Massassi",
    flashbackSnippet: "\"Hasta los dioses se inclinan ante el fuego.\"",
    passiveDescription: "+50% de daño de quemadura.", effectId: "passive_burn_50" },
  { id: "shard_freedon_nadd",    name: "Ataúd de Freedon Nadd",  zoneHint: "Onderon — Cripta Real",
    flashbackSnippet: "\"La muerte es una puerta que ya he cruzado.\"",
    passiveDescription: "Matar a un enemigo otorga 5 PF.", effectId: "passive_kill_fp_5" },
  { id: "shard_exar_kun",        name: "Corona de Exar Kun",       zoneHint: "Yavin IV — Cúspide de la Pirámide",
    flashbackSnippet: "\"Todos los templos son míos con el tiempo.\"",
    passiveDescription: "Las habilidades de área golpean a un objetivo adicional.", effectId: "passive_aoe_plus_one" },
  { id: "shard_palpatine",       name: "Susurros del Senado",  zoneHint: "Coruscant — Niveles Inferiores",
    flashbackSnippet: "\"La democracia es el camino más lento hacia el poder absoluto.\"",
    passiveDescription: "+5 de Influencia.", effectId: "passive_influence_flat_5" },
  { id: "shard_vader",           name: "Máscara del Traje",        zoneHint: "Mustafar — Castillo",
    flashbackSnippet: "\"Lo que sobrevive es lo que siempre estuvo destinado a sobrevivir.\"",
    passiveDescription: "+15% de eficacia de armadura.", effectId: "passive_armor_15" },
  { id: "shard_jaina",           name: "Reflejo",              zoneHint: "Fragmento del futuro — Jakku",
    flashbackSnippet: "\"Mi nombre es una deuda que le debo a mi madre.\"",
    passiveDescription: "La primera habilidad de cada combate es gratis.", effectId: "passive_first_skill_free" },
  { id: "shard_anakin",          name: "La Promesa del Padawan",       zoneHint: "Tatooine — Mos Espa",
    flashbackSnippet: "\"Voy a pilotar la nave más rápida de la galaxia.\"",
    passiveDescription: "+2 de Agilidad.", effectId: "passive_agi_2" },
  { id: "shard_yoda",            name: "Piedra en el Pantano",      zoneHint: "Dagobah — Cueva Oculta",
    flashbackSnippet: "\"No lo intentes. Hazlo. O no lo hagas. No existe el intentar.\"",
    passiveDescription: "8% de reducción de coste de PF.", effectId: "passive_fp_cost_8" },
  { id: "shard_luke",            name: "Sable en el Banco",      zoneHint: "Ahch-To — Escalones Jedi",
    flashbackSnippet: "\"Es hora de que los Jedi lleguen a su fin.\"",
    passiveDescription: "+2 de regeneración de Fuerza por turno.", effectId: "passive_fp_regen_2" },
  { id: "shard_unmade",          name: "Eco Deshecho",             zoneHint: "Malachor V — Ojo de la Herida",
    flashbackSnippet: "\"No hay eco. Nunca lo hubo.\"",
    passiveDescription: "Único: todas las demás bonificaciones de shards +10%.", effectId: "passive_shard_amplifier" },
];

export function findShard(id: string): MemoryShard | undefined {
  return MEMORY_SHARDS.find((s) => s.id === id);
}
