import type { TalentNode, TalentTreeMeta } from "./talent-types";

/**
 * Inquisitor talent trees — the Sith Sorcerer's path.
 *
 *   Sorcerer  → Force lightning, burst, channelled power
 *   Corruptor → corruption, drains, damage-over-time
 *   Dominator → fear, mind control, mental damage
 *
 * Baseline skills (lightning_bolt, drain_life) are always available.
 */

export const INQUISITOR_TREES: TalentTreeMeta[] = [
  { id: "sorcerer", name: "Hechicero", classId: "inquisitor", description: "Rayos de la Fuerza y ráfaga canalizada." },
  { id: "corruptor", name: "Corruptor", classId: "inquisitor", description: "Corrupción, drenajes de vida y plagas." },
  { id: "dominator", name: "Dominador", classId: "inquisitor", description: "Miedo, control mental y daño mental." },
];

// ── SORCERER — lightning / burst ────────────────────────────────────────
const SORCERER: TalentNode[] = [
  { id: "sor_dark_knowledge", name: "Conocimiento Oscuro", description: "+2 de Fuerza.", classId: "inquisitor", tree: "sorcerer", tier: 1, prereqs: [], bonuses: { force: 2 } },
  { id: "sor_lightning_mastery", name: "Maestría del Rayo", description: "+10% de daño. Desbloquea Rayo en Cadena.", classId: "inquisitor", tree: "sorcerer", tier: 1, prereqs: [], bonuses: { damagePercent: 10 }, unlocksSkill: "chain_lightning" },
  { id: "sor_arcane_barrier", name: "Barrera Arcana", description: "+20 de PF máx., +10 de Armadura. Desbloquea Armadura Espectral.", classId: "inquisitor", tree: "sorcerer", tier: 1, prereqs: [], bonuses: { maxFp: 20, armor: 10 }, unlocksSkill: "spectral_armor" },
  { id: "sor_chain_lightning", name: "Invocador de Tormentas", description: "+2 de Fuerza. Desbloquea Tormenta de la Fuerza — rayos sobre todos los enemigos.", classId: "inquisitor", tree: "sorcerer", tier: 2, prereqs: ["sor_lightning_mastery"], bonuses: { force: 2 }, unlocksSkill: "force_storm" },
  { id: "sor_force_well", name: "Pozo de la Fuerza", description: "+3 de Fuerza, +30 de PF máx.", classId: "inquisitor", tree: "sorcerer", tier: 2, prereqs: ["sor_dark_knowledge"], bonuses: { force: 3, maxFp: 30 } },
  { id: "sor_overcharge", name: "Sobrecarga", description: "+15% de probabilidad de crítico. +1 espacio de combate.", classId: "inquisitor", tree: "sorcerer", tier: 3, prereqs: ["sor_chain_lightning"], bonuses: { critChance: 15 }, grantsLoadoutSlot: true },
  { id: "sor_void_channel", name: "Canal del Vacío", description: "+4 de Fuerza, +10% de robo de vida con daño de la Fuerza.", classId: "inquisitor", tree: "sorcerer", tier: 3, prereqs: ["sor_force_well"], bonuses: { force: 4, lifestealPct: 10 } },
  { id: "sor_dark_avatar", name: "Avatar Oscuro", description: "+5 de Fuerza, todo el daño +20%.", classId: "inquisitor", tree: "sorcerer", tier: 4, prereqs: ["sor_overcharge", "sor_void_channel"], bonuses: { force: 5, damagePercent: 20 } },
  { id: "sor_unlimited_power", name: "Poder Ilimitado", description: "+30% de daño. Desbloquea El Hambre de Nihilus — devora toda la vida.", classId: "inquisitor", tree: "sorcerer", tier: 5, prereqs: ["sor_dark_avatar"], bonuses: { damagePercent: 30 }, unlocksSkill: "nihilus_hunger" },
];

// ── CORRUPTOR — corruption / DoT / drain ────────────────────────────────
const CORRUPTOR: TalentNode[] = [
  { id: "cor_plague_touch", name: "Toque de Plaga", description: "Los ataques tienen un 15% de probabilidad de Envenenar.", classId: "inquisitor", tree: "corruptor", tier: 1, prereqs: [], bonuses: {}, passive: "15% de Veneno en los ataques." },
  { id: "cor_withering", name: "Marchitamiento", description: "+1 de Fuerza. Desbloquea Drenaje de Alma — canaliza vida y Fuerza.", classId: "inquisitor", tree: "corruptor", tier: 1, prereqs: [], bonuses: { force: 1 }, unlocksSkill: "soul_drain" },
  { id: "cor_dark_mending", name: "Remiendo Oscuro", description: "Desbloquea Curación Oscura — restaura vitalidad y purga.", classId: "inquisitor", tree: "corruptor", tier: 1, prereqs: [], bonuses: {}, passive: "Curación Oscura purga 1 penalización.", unlocksSkill: "dark_heal" },
  { id: "cor_spreading_plague", name: "Plaga Propagante", description: "Cuando un objetivo envenenado muere, el veneno se propaga. +1 espacio de combate.", classId: "inquisitor", tree: "corruptor", tier: 2, prereqs: ["cor_plague_touch"], bonuses: {}, passive: "El Veneno se propaga al matar.", grantsLoadoutSlot: true },
  { id: "cor_siphon_strength", name: "Drenar Fuerza", description: "+5% de robo de vida con daño de la Fuerza.", classId: "inquisitor", tree: "corruptor", tier: 2, prereqs: ["cor_withering"], bonuses: { lifestealPct: 5 } },
  { id: "cor_pandemic", name: "Pandemia", description: "+25% de daño con el tiempo. Desbloquea Aura de Corrupción.", classId: "inquisitor", tree: "corruptor", tier: 3, prereqs: ["cor_spreading_plague"], bonuses: { damagePercent: 25 }, unlocksSkill: "corruption_aura" },
  { id: "cor_entropy", name: "Entropía", description: "Los objetivos Corrompidos reciben +15% de daño. Desbloquea Locura.", classId: "inquisitor", tree: "corruptor", tier: 3, prereqs: ["cor_siphon_strength"], bonuses: {}, passive: "+15% de daño a Corrompidos.", unlocksSkill: "madness" },
  { id: "cor_blight_lord", name: "Señor de la Pestilencia", description: "+4 de Fuerza. Aura de Corrupción también aplica Veneno.", classId: "inquisitor", tree: "corruptor", tier: 4, prereqs: ["cor_pandemic", "cor_entropy"], bonuses: { force: 4 }, passive: "Aura de Corrupción aplica Veneno." },
  { id: "cor_death_field", name: "Campo de Muerte", description: "Desbloquea Campo de Muerte — drena vida de TODOS los enemigos.", classId: "inquisitor", tree: "corruptor", tier: 5, prereqs: ["cor_blight_lord"], bonuses: {}, unlocksSkill: "death_field" },
];

// ── DOMINATOR — fear / mind control / mental ────────────────────────────
const DOMINATOR: TalentNode[] = [
  { id: "dom_commanding", name: "Presencia Imponente", description: "+2 de Influencia.", classId: "inquisitor", tree: "dominator", tier: 1, prereqs: [], bonuses: { influence: 2 } },
  { id: "dom_fear_tactics", name: "Tácticas de Miedo", description: "+15% de probabilidad de Miedo. Desbloquea Presa de la Fuerza.", classId: "inquisitor", tree: "dominator", tier: 1, prereqs: [], bonuses: {}, passive: "+15% de probabilidad de Miedo.", unlocksSkill: "force_choke" },
  { id: "dom_mental_fort", name: "Fortaleza Mental", description: "+25% de resistencia mental.", classId: "inquisitor", tree: "dominator", tier: 1, prereqs: [], bonuses: {}, passive: "25% de probabilidad de resistir efectos mentales." },
  { id: "dom_terrify", name: "Aterrorizar", description: "Los efectos mentales duran más. +1 espacio de combate.", classId: "inquisitor", tree: "dominator", tier: 2, prereqs: ["dom_fear_tactics"], bonuses: {}, passive: "Duración de Miedo/Aturdimiento +1.", grantsLoadoutSlot: true },
  { id: "dom_will_breaker", name: "Quebrantador de Voluntad", description: "+15% de daño. Desbloquea Aplastamiento Mental — una descarga mental que ignora la armadura.", classId: "inquisitor", tree: "dominator", tier: 2, prereqs: ["dom_commanding"], bonuses: { damagePercent: 15 }, unlocksSkill: "mind_crush" },
  { id: "dom_psychic_scream", name: "Grito Psíquico", description: "Desbloquea Onda de Terror — atemoriza a todos los enemigos.", classId: "inquisitor", tree: "dominator", tier: 3, prereqs: ["dom_terrify"], bonuses: {}, unlocksSkill: "terror_wave" },
  { id: "dom_puppet_master", name: "Titiritero", description: "Los enemigos aturdidos reciben +25% de daño.", classId: "inquisitor", tree: "dominator", tier: 3, prereqs: ["dom_will_breaker"], bonuses: {}, passive: "+25% de daño a Aturdidos." },
  { id: "dom_absolute_authority", name: "Autoridad Absoluta", description: "+5 de Fuerza, +3 de Influencia.", classId: "inquisitor", tree: "dominator", tier: 4, prereqs: ["dom_psychic_scream", "dom_puppet_master"], bonuses: { force: 5, influence: 3 } },
  { id: "dom_force_subjugate", name: "Subyugación de la Fuerza", description: "Desbloquea Subyugación de la Fuerza — domina a un enemigo para que luche por ti.", classId: "inquisitor", tree: "dominator", tier: 5, prereqs: ["dom_absolute_authority"], bonuses: {}, unlocksSkill: "force_subjugate" },
];

export const INQUISITOR_TALENTS: TalentNode[] = [...SORCERER, ...CORRUPTOR, ...DOMINATOR];

/** Inquisitor baseline skills — always available regardless of talents. */
export const INQUISITOR_BASELINE_SKILLS = ["lightning_bolt", "drain_life"];
