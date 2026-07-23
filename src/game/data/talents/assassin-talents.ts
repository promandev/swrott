import type { TalentNode, TalentTreeMeta } from "./talent-types";

/**
 * Assassin talent trees — the Sith Assassin's path.
 *
 *   Shadowblade → stealth strikes, crit, melee burst
 *   Poisoner    → toxins, damage-over-time, AoE
 *   Specter     → evasion, cloak, mobility
 *
 * Baseline skills (shadow_strike, backstab) are always available.
 */

export const ASSASSIN_TREES: TalentTreeMeta[] = [
  { id: "shadowblade", name: "Hoja Sombría", classId: "assassin", description: "Golpes furtivos, crítico y ráfaga cuerpo a cuerpo." },
  { id: "poisoner", name: "Envenenador", classId: "assassin", description: "Toxinas, daño con el tiempo y área." },
  { id: "specter", name: "Espectro", classId: "assassin", description: "Evasión, ocultación y movilidad." },
];

// ── SHADOWBLADE — stealth / crit / melee burst ──────────────────────────
const SHADOWBLADE: TalentNode[] = [
  { id: "shb_blade_dance", name: "Danza de la Hoja", description: "+5% de daño. Desbloquea Golpe Doble.", classId: "assassin", tree: "shadowblade", tier: 1, prereqs: [], bonuses: { damagePercent: 5 }, unlocksSkill: "double_strike" },
  { id: "shb_quick_feet", name: "Pies Ligeros", description: "+2 de Agilidad. Desbloquea Carrera de Sombras.", classId: "assassin", tree: "shadowblade", tier: 1, prereqs: [], bonuses: { agility: 2 }, unlocksSkill: "shadow_dash" },
  { id: "shb_opportunist", name: "Oportunista", description: "+10% de daño a objetivos Marcados.", classId: "assassin", tree: "shadowblade", tier: 1, prereqs: [], bonuses: {}, passive: "+10% de daño a Marcados." },
  { id: "shb_twin_fangs", name: "Colmillos Gemelos", description: "Enfriamiento de Golpe Doble -1. +1 espacio de combate.", classId: "assassin", tree: "shadowblade", tier: 2, prereqs: ["shb_blade_dance"], bonuses: {}, passive: "Enfriamiento de Golpe Doble -1.", grantsLoadoutSlot: true },
  { id: "shb_ghost_step", name: "Paso Fantasmal", description: "+5% de esquiva.", classId: "assassin", tree: "shadowblade", tier: 2, prereqs: ["shb_quick_feet"], bonuses: { dodgeChance: 5 } },
  { id: "shb_assassinate", name: "Asesinar", description: "+30% de daño de golpe desde el sigilo. Desbloquea Paso de Sombra.", classId: "assassin", tree: "shadowblade", tier: 3, prereqs: ["shb_twin_fangs"], bonuses: {}, passive: "+30% de Golpe de las Sombras desde el sigilo.", unlocksSkill: "shadow_step" },
  { id: "shb_shadow_master", name: "Maestro de las Sombras", description: "+4 de Agilidad, +8% de crítico.", classId: "assassin", tree: "shadowblade", tier: 3, prereqs: ["shb_ghost_step"], bonuses: { agility: 4, critChance: 8 } },
  { id: "shb_death_from_shadows", name: "Muerte desde las Sombras", description: "+5 de Agilidad, +20% de daño crítico. Desbloquea Ejecución Fantasma.", classId: "assassin", tree: "shadowblade", tier: 4, prereqs: ["shb_assassinate", "shb_shadow_master"], bonuses: { agility: 5, critDamage: 20 }, unlocksSkill: "phantom_execution" },
  { id: "shb_phantom_blade", name: "Hoja Fantasma", description: "Desbloquea Hoja Fantasma — teletranspórtate tras un enemigo para un crítico garantizado.", classId: "assassin", tree: "shadowblade", tier: 5, prereqs: ["shb_death_from_shadows"], bonuses: {}, unlocksSkill: "phantom_blade" },
];

// ── POISONER — toxins / DoT / AoE ───────────────────────────────────────
const POISONER: TalentNode[] = [
  { id: "poi_toxic_coating", name: "Recubrimiento Tóxico", description: "Desbloquea Hoja Envenenada — emponzoña tus golpes.", classId: "assassin", tree: "poisoner", tier: 1, prereqs: [], bonuses: {}, passive: "10% de Veneno en los ataques.", unlocksSkill: "poison_blade" },
  { id: "poi_alchemist", name: "Alquimista", description: "+15% de daño. Desbloquea Emponzoñar.", classId: "assassin", tree: "poisoner", tier: 1, prereqs: [], bonuses: { damagePercent: 15 }, unlocksSkill: "envenom" },
  { id: "poi_numbing_venom", name: "Veneno Entumecedor", description: "Los objetivos envenenados tienen -10% de precisión.", classId: "assassin", tree: "poisoner", tier: 1, prereqs: [], bonuses: {}, passive: "El Veneno reduce la precisión." },
  { id: "poi_virulent", name: "Cepa Virulenta", description: "Duración de Veneno +2. +1 espacio de combate.", classId: "assassin", tree: "poisoner", tier: 2, prereqs: ["poi_toxic_coating"], bonuses: {}, passive: "Duración de Veneno +2.", grantsLoadoutSlot: true },
  { id: "poi_weakening", name: "Agente Debilitador", description: "Los objetivos envenenados reciben +10% de daño. Desbloquea Bomba de Humo.", classId: "assassin", tree: "poisoner", tier: 2, prereqs: ["poi_alchemist"], bonuses: {}, passive: "+10% a Envenenados.", unlocksSkill: "smoke_bomb" },
  { id: "poi_neurotoxin", name: "Neurotoxina", description: "Veneno tiene un 20% de probabilidad de Aturdir. Desbloquea Flor de la Muerte.", classId: "assassin", tree: "poisoner", tier: 3, prereqs: ["poi_virulent"], bonuses: {}, passive: "Veneno: 20% de Aturdir.", unlocksSkill: "death_blossom" },
  { id: "poi_corrosive", name: "Veneno Corrosivo", description: "Veneno reduce la armadura. +10% de perforación de armadura.", classId: "assassin", tree: "poisoner", tier: 3, prereqs: ["poi_weakening"], bonuses: { armorPiercePct: 10 }, passive: "El Veneno desgarra la armadura." },
  { id: "poi_plague_lord", name: "Señor de la Plaga", description: "+3 de Agilidad, +25% de daño con el tiempo.", classId: "assassin", tree: "poisoner", tier: 4, prereqs: ["poi_neurotoxin", "poi_corrosive"], bonuses: { agility: 3, damagePercent: 25 } },
  { id: "poi_toxic_nova", name: "Nova Tóxica", description: "Desbloquea Nova Tóxica — una explosión de veneno en área.", classId: "assassin", tree: "poisoner", tier: 5, prereqs: ["poi_plague_lord"], bonuses: {}, unlocksSkill: "toxic_nova" },
];

// ── SPECTER — evasion / cloak / mobility ────────────────────────────────
const SPECTER: TalentNode[] = [
  { id: "spc_shadow_walk", name: "Paso Sombrío", description: "Desbloquea Desvanecerse — desaparece; el próximo ataque es crítico automático.", classId: "assassin", tree: "specter", tier: 1, prereqs: [], bonuses: {}, passive: "Enfriamiento de Desvanecerse -1.", unlocksSkill: "vanish" },
  { id: "spc_ethereal", name: "Etéreo", description: "+3% de esquiva. Desbloquea Manto de la Fuerza.", classId: "assassin", tree: "specter", tier: 1, prereqs: [], bonuses: { dodgeChance: 3 }, unlocksSkill: "force_cloak" },
  { id: "spc_cunning", name: "Astucia", description: "+2 de Fuerza, +2 de Agilidad.", classId: "assassin", tree: "specter", tier: 1, prereqs: [], bonuses: { force: 2, agility: 2 } },
  { id: "spc_misdirection", name: "Distracción", description: "+30% de esquiva durante 1 turno tras Desvanecerse. +1 espacio de combate.", classId: "assassin", tree: "specter", tier: 2, prereqs: ["spc_shadow_walk"], bonuses: {}, passive: "+30% de esquiva tras Desvanecerse.", grantsLoadoutSlot: true },
  { id: "spc_phase_walk", name: "Paso Espectral", description: "+3 de Agilidad. Desbloquea Marca de Muerte — una detonación retardada.", classId: "assassin", tree: "specter", tier: 2, prereqs: ["spc_ethereal"], bonuses: { agility: 3 }, unlocksSkill: "death_mark" },
  { id: "spc_shade_form", name: "Forma de Sombra", description: "Regenera un 5% de PV por turno mientras estás oculto.", classId: "assassin", tree: "specter", tier: 3, prereqs: ["spc_misdirection"], bonuses: {}, passive: "Regenera 5% de PV mientras estás oculto." },
  { id: "spc_void_sight", name: "Visión del Vacío", description: "Ignora el 20% de la armadura enemiga.", classId: "assassin", tree: "specter", tier: 3, prereqs: ["spc_phase_walk"], bonuses: { armorPiercePct: 20 } },
  { id: "spc_wraith", name: "Aparición", description: "+5 de Agilidad, +10% de esquiva.", classId: "assassin", tree: "specter", tier: 4, prereqs: ["spc_shade_form", "spc_void_sight"], bonuses: { agility: 5, dodgeChance: 10 } },
  { id: "spc_death_incarnate", name: "Muerte Encarnada", description: "Desbloquea Golpe del Vacío — un único golpe que ignora todas las defensas.", classId: "assassin", tree: "specter", tier: 5, prereqs: ["spc_wraith"], bonuses: {}, passive: "Inmune mientras estás oculto.", unlocksSkill: "voidstrike" },
];

export const ASSASSIN_TALENTS: TalentNode[] = [...SHADOWBLADE, ...POISONER, ...SPECTER];

/** Assassin baseline skills — always available regardless of talents. */
export const ASSASSIN_BASELINE_SKILLS = ["shadow_strike", "backstab"];
