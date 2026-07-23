/**
 * Sub-class specialization trees (Idea #16).
 *
 * At level 10 the player picks ONE of three specs per class:
 *
 *   Marauder      → Carnage / Annihilation / Rage
 *   Inquisitor    → Sorcerer / Madness / Lightning
 *   Assassin      → Shadowblade / Poisoner / Specter
 *
 * Each spec is a tree of 9 nodes (3 tiers × 3 nodes). Each node costs 1
 * talent point. Tiers unlock at character level 10, 14, 18.
 */

import type { ClassId } from "../../data/schemas";

export interface SpecNode {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  /** Stat / combat effect (resolved by talent-effects.ts). */
  effectId: string;
  /** Prerequisite node ids in same tree. */
  prereqs?: string[];
}

export interface SpecTree {
  id: string;
  name: string;
  classId: ClassId;
  description: string;
  nodes: SpecNode[];
}

export const SPEC_TREES: SpecTree[] = [
  // ── Marauder ────────────────────────────────────────────────
  {
    id: "marauder_carnage", name: "Carnicería", classId: "marauder",
    description: "Golpes sangrantes y furia sin fin.",
    nodes: [
      { id: "carnage_bleed_dmg",     name: "Heridas Abiertas",        tier: 1, effectId: "bleed_dmg_25",   description: "Los sangrados infligen +25% de daño." },
      { id: "carnage_crit_bleed",    name: "Crítico Hendidor",      tier: 1, effectId: "crit_apply_bleed", description: "Los críticos garantizan Sangrado." },
      { id: "carnage_dual_strike",   name: "Colmillo Gemelo",          tier: 1, effectId: "dual_strike_chance", description: "20% chance to strike twice on basic attacks." },
      { id: "carnage_armor_pierce",  name: "Quebrantamiento",          tier: 2, effectId: "ignore_armor_15", description: "Ignora el 15% de la armadura del objetivo." },
      { id: "carnage_fury_charge",   name: "Carga de Furia",        tier: 2, effectId: "lb_gain_25",     description: "La Ruptura de Límite se llena un 25% más rápido." },
      { id: "carnage_bleed_spread", name: "Heridas en Cascada",   tier: 2, effectId: "bleed_spread",   description: "Matar a un objetivo con Sangrado propaga el Sangrado a todos los enemigos.", prereqs: ["carnage_bleed_dmg"] },
      { id: "carnage_unstoppable",   name: "Fuerza Imparable",  tier: 3, effectId: "ignore_cc",      description: "Inmune a aturdimiento, miedo y lisiar." },
      { id: "carnage_savage_combo",  name: "Combo Salvaje",       tier: 3, effectId: "combo_mult_50",  description: "Cada paso del combo otorga +50% de daño en lugar de +20%." },
      { id: "carnage_overkill",      name: "Exceso Mortal",           tier: 3, effectId: "overkill_aoe",   description: "El daño sobrante al matar golpea a un enemigo aleatorio.", prereqs: ["carnage_bleed_spread"] },
    ],
  },
  // ── Inquisitor ──────────────────────────────────────────────
  {
    id: "inquisitor_madness", name: "Locura", classId: "inquisitor",
    description: "Propaga corrupción y desesperación hasta que las mentes se quiebren.",
    nodes: [
      { id: "madness_corrupt_dmg",    name: "Perdición Susurrada",     tier: 1, effectId: "corrupted_dmg_30", description: "Los objetivos corruptos reciben +30% de daño de todas las fuentes." },
      { id: "madness_silent_strike",  name: "Golpe Silencioso",      tier: 1, effectId: "silence_on_hit", description: "20% chance to silence on any hit." },
      { id: "madness_dark_pact",      name: "Pacto Oscuro",          tier: 1, effectId: "hp_for_fp",      description: "Gasta el 10% de PV para restaurar 30 PF." },
      { id: "madness_drain_buff",     name: "Drenaje Eterno",      tier: 2, effectId: "lifesteal_10",   description: "+10% lifesteal on Force damage." },
      { id: "madness_fear_chain",     name: "Miedo en Cascada",     tier: 2, effectId: "fear_spread",    description: "El Miedo se propaga a un enemigo cercano al aplicarse." },
      { id: "madness_mind_break",     name: "Quiebra Mental",         tier: 2, effectId: "stun_on_low",    description: "Los objetivos por debajo del 25% de PV tienen un 30% de probabilidad de quedar aturdidos al recibir un golpe de la Fuerza." },
      { id: "madness_hunger",         name: "El Alcance de Nihilus",    tier: 3, effectId: "nihilus_buff",   description: "El Hambre de Nihilus ignora la mitad de la armadura.", prereqs: ["madness_drain_buff"] },
      { id: "madness_aoe_corrupt",    name: "Plaga de Locura",  tier: 3, effectId: "aoe_corrupt",    description: "Tormenta de la Fuerza corrompe a todos los objetivos que golpea." },
      { id: "madness_immortal",       name: "Devorador",           tier: 3, effectId: "kill_heal_30",   description: "Matar a objetivos corruptos te cura el 30% de los PV máximos.", prereqs: ["madness_corrupt_dmg"] },
    ],
  },
  // ── Assassin ────────────────────────────────────────────────
  {
    id: "assassin_shadowblade", name: "Hoja Sombría", classId: "assassin",
    description: "El primer golpe. El último golpe. Las sombras ocultan todo lo de en medio.",
    nodes: [
      { id: "shadow_first_strike",   name: "Primera Sangre",        tier: 1, effectId: "first_strike_crit", description: "El primer ataque de cada combate es un crítico garantizado." },
      { id: "shadow_dodge",          name: "Fase",              tier: 1, effectId: "dodge_10",        description: "+10% base dodge chance." },
      { id: "shadow_backstab_buff",  name: "Punción Espinal",         tier: 1, effectId: "backstab_dmg_50", description: "Las puñaladas por la espalda infligen +50% de daño." },
      { id: "shadow_vanish_buff",    name: "Desvanecimiento Eterno",     tier: 2, effectId: "vanish_buff",     description: "Desvanecerse dura 2 turnos. Los próximos 2 ataques son críticos automáticos." },
      { id: "shadow_poison_dmg",     name: "Toxina Velada",       tier: 2, effectId: "poison_dmg_25",   description: "Los pulsos de Veneno infligen +25% de daño." },
      { id: "shadow_assassinate",    name: "Marcado para Morir",   tier: 2, effectId: "execute_50",      description: "Umbral de Ejecutar elevado al 50% de PV." },
      { id: "shadow_chain_kills",    name: "Asesino en Cadena",       tier: 3, effectId: "kill_reset_cd",   description: "Matar a un objetivo marcado reinicia todos los enfriamientos.", prereqs: ["shadow_first_strike"] },
      { id: "shadow_phantom",        name: "Fantasma",            tier: 3, effectId: "ghost_25",        description: "25% chance to ignore any hit completely.", prereqs: ["shadow_dodge"] },
      { id: "shadow_void_strike",    name: "Asesino del Vacío",      tier: 3, effectId: "voidstrike_buff", description: "Voidstrike deals double damage to targets below 50% HP." },
    ],
  },
];

export function specsForClass(classId: ClassId): SpecTree[] {
  return SPEC_TREES.filter((t) => t.classId === classId);
}

export function getSpecTree(id: string): SpecTree | undefined {
  return SPEC_TREES.find((t) => t.id === id);
}

export function isNodeUnlockable(node: SpecNode, playerLevel: number, unlockedIds: string[]): boolean {
  const requiredLevel = node.tier === 1 ? 10 : node.tier === 2 ? 14 : 18;
  if (playerLevel < requiredLevel) return false;
  if (!node.prereqs) return true;
  return node.prereqs.every((p) => unlockedIds.includes(p));
}
