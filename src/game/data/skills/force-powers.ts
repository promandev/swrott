import type { SkillInput } from "../schemas/skill";

/**
 * Universal Force Powers — §4 "Poderes de la Fuerza".
 *
 * Available to all classes. Unlocked by level, corruption, or quest progression.
 * Organized into Basic, Advanced, and Legendary tiers.
 */

// ═══════════════════════════════════════════════════════════════════════
// BASIC FORCE POWERS (unlocked Lv 1-10)
// ═══════════════════════════════════════════════════════════════════════

export const BASIC_FORCE_POWERS: SkillInput[] = [
  {
    id: "force_push",
    name: "Empujón de la Fuerza",
    description: "Empuja a un objetivo hacia atrás con una onda de energía de la Fuerza. Probabilidad de aturdir.",
    classId: "marauder", // universal — classId used for schema, available to all
    tier: 1,
    cost: { forcePoints: 8, cooldown: 1 },
    damage: { base: 10, strengthScaling: 0, forceScaling: 1.0, type: "force" },
    statusEffects: [{ effect: "stun", chance: 0.25, duration: 1 }],
    targeting: "single",
  },
  {
    id: "force_fear",
    name: "Miedo de la Fuerza",
    description: "Proyecta terror en la mente de un objetivo. Los objetivos atemorizados pueden perder su turno.",
    classId: "inquisitor",
    tier: 2,
    cost: { forcePoints: 12, cooldown: 2 },
    damage: { base: 6, strengthScaling: 0, forceScaling: 0.8, type: "mental" },
    statusEffects: [{ effect: "fear", chance: 0.6, duration: 2 }],
    targeting: "single",
  },
  {
    id: "force_speed",
    name: "Velocidad de la Fuerza",
    description: "Potencia tus reflejos con la Fuerza. Aumenta la precisión y la esquiva durante 3 turnos.",
    classId: "assassin",
    tier: 2,
    cost: { forcePoints: 10, cooldown: 3 },
    statusEffects: [],
    targeting: "self",
  },
  {
    id: "force_stasis",
    name: "Estasis de la Fuerza",
    description: "Congela a un objetivo en una presa telequinética. La clásica incapacitación de KOTOR — los objetivos retenidos pierden su próxima acción.",
    classId: "inquisitor",
    tier: 2,
    cost: { forcePoints: 14, cooldown: 3 },
    damage: { base: 4, strengthScaling: 0, forceScaling: 0.4, type: "force" },
    statusEffects: [{ effect: "stun", chance: 0.65, duration: 1 }],
    targeting: "single",
  },
  {
    id: "force_heal",
    name: "Curación de la Fuerza",
    description: "Hasta los Sith curan sus heridas cuando nadie mira. Restaura salud en función de tu valor de Fuerza.",
    classId: "inquisitor",
    tier: 2,
    cost: { forcePoints: 16, cooldown: 3 },
    damage: { base: 20, strengthScaling: 0, forceScaling: 2.0, type: "force" },
    statusEffects: [],
    targeting: "self",
  },
  {
    id: "drain_minor",
    name: "Drenaje Menor",
    description: "Drena una pequeña cantidad de fuerza vital de un objetivo. Te cura el daño infligido.",
    classId: "inquisitor",
    tier: 1,
    cost: { forcePoints: 6, cooldown: 1 },
    damage: { base: 8, strengthScaling: 0, forceScaling: 0.6, type: "force" },
    statusEffects: [],
    targeting: "single",
  },
];

// ═══════════════════════════════════════════════════════════════════════
// ADVANCED FORCE POWERS (unlocked Lv 11-25)
// ═══════════════════════════════════════════════════════════════════════

export const ADVANCED_FORCE_POWERS: SkillInput[] = [
  {
    id: "force_lightning_universal",
    name: "Rayos de la Fuerza",
    description: "Canaliza el lado oscuro en rayos devastadores. Electrocuta y daña a un solo objetivo.",
    classId: "inquisitor",
    tier: 4,
    cost: { forcePoints: 20, cooldown: 2 },
    damage: { base: 24, strengthScaling: 0, forceScaling: 1.8, type: "shock" },
    statusEffects: [{ effect: "shock", chance: 0.4, duration: 2 }],
    targeting: "single",
  },
  {
    id: "force_choke",
    name: "Presa de la Fuerza",
    description: "Levanta y constriñe a un objetivo con la Fuerza. Inflige daño con el tiempo y silencia.",
    classId: "marauder",
    tier: 4,
    cost: { forcePoints: 22, cooldown: 3 },
    damage: { base: 18, strengthScaling: 0, forceScaling: 1.4, type: "force" },
    statusEffects: [
      { effect: "silence", chance: 0.7, duration: 2 },
      { effect: "cripple", chance: 0.4, duration: 2 },
    ],
    targeting: "single",
  },
  {
    id: "force_frenzy",
    name: "Frenesí de la Fuerza",
    description: "Canaliza el lado oscuro en agresión pura. Ganas Furia y daño aumentado durante 3 turnos.",
    classId: "marauder",
    tier: 5,
    cost: { forcePoints: 25, cooldown: 5 },
    statusEffects: [{ effect: "rage", chance: 1.0, duration: 3 }],
    targeting: "self",
  },
  {
    id: "force_wave",
    name: "Onda de la Fuerza",
    description: "Un anillo concusivo de energía de la Fuerza que arroja hacia atrás a todos los enemigos. Probabilidad de derribar a cada uno.",
    classId: "inquisitor",
    tier: 5,
    cost: { forcePoints: 28, cooldown: 4 },
    damage: { base: 18, strengthScaling: 0, forceScaling: 1.2, type: "force" },
    statusEffects: [{ effect: "stun", chance: 0.4, duration: 1 }],
    targeting: "aoe",
  },
  {
    id: "drain_life",
    name: "Drenar Vida",
    description: "Una cinta de vitalidad robada se arquea del objetivo hacia ti. Fuerte daño de la Fuerza; el lado oscuro te alimenta a cambio.",
    classId: "inquisitor",
    tier: 4,
    cost: { forcePoints: 20, cooldown: 3 },
    damage: { base: 22, strengthScaling: 0, forceScaling: 1.6, type: "force" },
    statusEffects: [{ effect: "cripple", chance: 0.3, duration: 2 }],
    targeting: "single",
  },
  {
    id: "force_mind_control",
    name: "Control Mental",
    description: "Domina a un objetivo de mente débil, obligándolo a atacar a sus aliados durante 1 turno.",
    classId: "inquisitor",
    tier: 6,
    cost: { forcePoints: 35, cooldown: 6 },
    damage: { base: 0, strengthScaling: 0, forceScaling: 0, type: "mental" },
    statusEffects: [{ effect: "fear", chance: 0.8, duration: 1 }],
    targeting: "single",
  },
];

// ═══════════════════════════════════════════════════════════════════════
// LEGENDARY FORCE POWERS (unlocked Lv 30+ or corruption thresholds)
// ═══════════════════════════════════════════════════════════════════════

export const LEGENDARY_FORCE_POWERS: SkillInput[] = [
  {
    id: "force_storm_legendary",
    name: "Tormenta de la Fuerza",
    description: "Desata una tormenta catastrófica de rayos del lado oscuro que devasta a todos los enemigos. El aire crepita de poder.",
    classId: "inquisitor",
    tier: 8,
    cost: { forcePoints: 50, cooldown: 7 },
    damage: { base: 40, strengthScaling: 0, forceScaling: 2.5, type: "shock" },
    statusEffects: [
      { effect: "shock", chance: 0.6, duration: 3 },
      { effect: "burn", chance: 0.3, duration: 2 },
    ],
    targeting: "aoe",
  },
  {
    id: "soul_consumption",
    name: "Consunción de Almas",
    description: "Devora la esencia de un enemigo derrotado, absorbiendo su fuerza vital y energía de la Fuerza restantes. Solo utilizable en objetivos por debajo del 20% de PV.",
    classId: "inquisitor",
    tier: 9,
    cost: { forcePoints: 40, cooldown: 8 },
    damage: { base: 60, strengthScaling: 0, forceScaling: 3.0, type: "force" },
    statusEffects: [{ effect: "corrupted", chance: 1.0, duration: 1 }],
    targeting: "single",
  },
  {
    id: "void_step",
    name: "Paso del Vacío",
    description: "Atraviesa el vacío entre dimensiones. Vuélvete imposible de fijar durante 1 turno, luego reaparece tras un objetivo para un golpe devastador.",
    classId: "assassin",
    tier: 9,
    cost: { forcePoints: 45, cooldown: 8 },
    damage: { base: 55, strengthScaling: 1.2, forceScaling: 2.0, type: "force" },
    statusEffects: [{ effect: "marked", chance: 1.0, duration: 2 }],
    targeting: "single",
  },
  {
    id: "echo_of_malachor",
    name: "Eco de Malachor",
    description: "Canaliza el eco del Generador de Sombra Másica. Todos los enemigos reciben daño masivo de la Fuerza y quedan aturdidos. Cuesta salud lanzarla.",
    classId: "inquisitor",
    tier: 10,
    cost: { forcePoints: 60, cooldown: 10 },
    damage: { base: 80, strengthScaling: 0, forceScaling: 3.5, type: "force" },
    statusEffects: [
      { effect: "stun", chance: 0.7, duration: 2 },
      { effect: "corrupted", chance: 0.5, duration: 3 },
    ],
    targeting: "aoe",
  },
];

/** All universal Force powers combined. */
export const ALL_FORCE_POWERS: SkillInput[] = [
  ...BASIC_FORCE_POWERS,
  ...ADVANCED_FORCE_POWERS,
  ...LEGENDARY_FORCE_POWERS,
];
