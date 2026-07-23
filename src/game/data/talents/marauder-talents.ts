import type { TalentNode, TalentTreeMeta } from "./talent-types";

/**
 * Marauder talent trees — the Sith Warrior's path.
 *
 *   Juggernaut → survivability, armor, control
 *   Berserker  → raw damage, rage, AoE
 *   Duelist    → crit, precision, single-target mastery
 *
 * Nodes gate the Marauder's combat skills via `unlocksSkill`. Baseline
 * skills (heavy_slash, flurry) are always available — see player-loadout.ts.
 */

export const MARAUDER_TREES: TalentTreeMeta[] = [
  { id: "juggernaut", name: "Coloso", classId: "marauder", description: "Supervivencia, armadura y control de masas." },
  { id: "berserker", name: "Berserker", classId: "marauder", description: "Daño bruto, furia y golpes de área." },
  { id: "duelist", name: "Duelista", classId: "marauder", description: "Golpes críticos y precisión sobre un objetivo." },
];

// ═══════════════════════════════════════════════════════════════════════
// JUGGERNAUT — Survivability, armor, control
// ═══════════════════════════════════════════════════════════════════════
const JUGGERNAUT: TalentNode[] = [
  { id: "jug_thick_skin", name: "Piel Dura", description: "+15 de Armadura.", classId: "marauder", tree: "juggernaut", tier: 1, prereqs: [], bonuses: { armor: 15 } },
  { id: "jug_enduring", name: "Resistente", description: "+20 de PV máx.", classId: "marauder", tree: "juggernaut", tier: 1, prereqs: [], bonuses: { maxHp: 20 } },
  { id: "jug_heavy_stance", name: "Forma Quebrantadora", description: "+5% de Armadura. Desbloquea Golpe Quebrantador — destroza la armadura enemiga.", classId: "marauder", tree: "juggernaut", tier: 1, prereqs: [], bonuses: { armorPercent: 5 }, unlocksSkill: "sundering_strike" },
  { id: "jug_unbreakable", name: "Inquebrantable", description: "+2 de Aguante.", classId: "marauder", tree: "juggernaut", tier: 2, prereqs: ["jug_thick_skin"], bonuses: { endurance: 2 } },
  { id: "jug_bloodletting", name: "Sangría", description: "Cura como PV el 5% del daño infligido.", classId: "marauder", tree: "juggernaut", tier: 2, prereqs: ["jug_enduring"], bonuses: { lifestealPct: 5 } },
  { id: "jug_iron_will", name: "Garra de Hierro", description: "15% de probabilidad de resistir Aturdimiento y Miedo. Desbloquea Azote de Presa de la Fuerza.", classId: "marauder", tree: "juggernaut", tier: 2, prereqs: ["jug_heavy_stance"], bonuses: {}, passive: "15% de probabilidad de resistir Aturdimiento y Miedo.", unlocksSkill: "force_choke_slam" },
  { id: "jug_fortified", name: "Fortificado", description: "+30 de PV máx., +10 de Armadura. Desbloquea Rugido Desafiante — atemoriza a todos los enemigos.", classId: "marauder", tree: "juggernaut", tier: 3, prereqs: ["jug_unbreakable"], bonuses: { maxHp: 30, armor: 10 }, unlocksSkill: "defiant_roar" },
  { id: "jug_second_wind", name: "Segundo Aliento", description: "Cuando los PV bajan del 20%, cura el 15% de los PV máx. una vez por combate. +1 espacio de combate.", classId: "marauder", tree: "juggernaut", tier: 3, prereqs: ["jug_bloodletting"], bonuses: {}, passive: "Autocuración del 15% de PV por debajo del 20% (una vez por combate).", grantsLoadoutSlot: true },
  { id: "jug_retribution", name: "Represalia", description: "Refleja al atacante el 10% del daño cuerpo a cuerpo recibido.", classId: "marauder", tree: "juggernaut", tier: 3, prereqs: ["jug_iron_will"], bonuses: {}, passive: "Refleja el 10% del daño cuerpo a cuerpo." },
  { id: "jug_guardian", name: "Guardián", description: "+3 de Aguante, +20 de Armadura, +40 de PV máx.", classId: "marauder", tree: "juggernaut", tier: 4, prereqs: ["jug_fortified", "jug_second_wind"], bonuses: { endurance: 3, armor: 20, maxHp: 40 } },
  { id: "jug_rallying_cry", name: "Grito de Reunión", description: "Desbloquea Grito de Reunión — endurécete: +armadura y te sacudes el control.", classId: "marauder", tree: "juggernaut", tier: 4, prereqs: ["jug_retribution"], bonuses: {}, unlocksSkill: "rallying_cry" },
  { id: "jug_immortal", name: "Inmortal", description: "+50 de PV máx., burla a la muerte una vez por combate. Desbloquea Imparable.", classId: "marauder", tree: "juggernaut", tier: 5, prereqs: ["jug_guardian"], bonuses: { maxHp: 50 }, passive: "Burla a la muerte una vez por combate.", unlocksSkill: "unstoppable" },
];

// ═══════════════════════════════════════════════════════════════════════
// BERSERKER — Raw damage, Rage mechanic, AoE
// ═══════════════════════════════════════════════════════════════════════
const BERSERKER: TalentNode[] = [
  { id: "ber_savage_strikes", name: "Golpes Salvajes", description: "+5% de daño. Desbloquea Ataque Poderoso.", classId: "marauder", tree: "berserker", tier: 1, prereqs: [], bonuses: { damagePercent: 5 }, unlocksSkill: "power_attack" },
  { id: "ber_fury", name: "Furia", description: "+2 de Fuerza.", classId: "marauder", tree: "berserker", tier: 1, prereqs: [], bonuses: { strength: 2 } },
  { id: "ber_blood_rage", name: "Sed de Sangre", description: "Ganas Furia durante 1 turno tras una muerte. Desbloquea Hendidura.", classId: "marauder", tree: "berserker", tier: 1, prereqs: [], bonuses: {}, passive: "Al matar: ganas Furia durante 1 turno.", unlocksSkill: "cleave" },
  { id: "ber_cleaving_arc", name: "Arco Hendidor", description: "Hendidura golpea a un objetivo adicional. +1 espacio de combate.", classId: "marauder", tree: "berserker", tier: 2, prereqs: ["ber_savage_strikes"], bonuses: {}, passive: "Objetivos de Hendidura +1.", grantsLoadoutSlot: true },
  { id: "ber_relentless", name: "Implacable", description: "+3 de Fuerza.", classId: "marauder", tree: "berserker", tier: 2, prereqs: ["ber_fury"], bonuses: { strength: 3 } },
  { id: "ber_feeding_frenzy", name: "Frenesí Voraz", description: "+10% de daño mientras Furia está activa. Desbloquea Estallido de Furia.", classId: "marauder", tree: "berserker", tier: 2, prereqs: ["ber_blood_rage"], bonuses: {}, passive: "+10% de daño mientras Furia está activa.", unlocksSkill: "rage_burst" },
  { id: "ber_rampage", name: "Embestida", description: "+10% de daño.", classId: "marauder", tree: "berserker", tier: 3, prereqs: ["ber_cleaving_arc"], bonuses: { damagePercent: 10 } },
  { id: "ber_dark_power", name: "Poder Oscuro", description: "+3 de Fuerza.", classId: "marauder", tree: "berserker", tier: 3, prereqs: ["ber_relentless"], bonuses: { force: 3 } },
  { id: "ber_bloodbath", name: "Baño de Sangre", description: "Los Sangrados que aplicas infligen un 25% más de daño. Desbloquea Furia Sangrienta.", classId: "marauder", tree: "berserker", tier: 3, prereqs: ["ber_feeding_frenzy"], bonuses: {}, passive: "+25% de daño de Sangrado.", unlocksSkill: "blood_rage" },
  { id: "ber_warlord", name: "Señor de la Guerra", description: "+4 de Fuerza, +15% de daño. Desbloquea Trance del Berserker.", classId: "marauder", tree: "berserker", tier: 4, prereqs: ["ber_rampage", "ber_dark_power"], bonuses: { strength: 4, damagePercent: 15 }, unlocksSkill: "berserkers_trance" },
  { id: "ber_unstoppable_force", name: "Fuerza Imparable", description: "Furia también otorga +15% de daño.", classId: "marauder", tree: "berserker", tier: 4, prereqs: ["ber_bloodbath"], bonuses: {}, passive: "Furia otorga +15% de daño." },
  { id: "ber_annihilation", name: "Aniquilación", description: "+5 de Fuerza. Desbloquea Aniquilación — la ráfaga definitiva.", classId: "marauder", tree: "berserker", tier: 5, prereqs: ["ber_warlord"], bonuses: { strength: 5 }, unlocksSkill: "annihilation" },
];

// ═══════════════════════════════════════════════════════════════════════
// DUELIST — Crit, precision, single-target mastery
// ═══════════════════════════════════════════════════════════════════════
const DUELIST: TalentNode[] = [
  { id: "due_keen_edge", name: "Filo Afilado", description: "+3% de probabilidad de crítico. Desbloquea Golpe Crítico.", classId: "marauder", tree: "duelist", tier: 1, prereqs: [], bonuses: { critChance: 3 }, unlocksSkill: "critical_strike" },
  { id: "due_footwork", name: "Juego de Pies", description: "+2 de Agilidad.", classId: "marauder", tree: "duelist", tier: 1, prereqs: [], bonuses: { agility: 2 } },
  { id: "due_exploit_weakness", name: "Explotar Debilidad", description: "+10% de daño a objetivos Marcados. Desbloquea Lanzamiento de Sable.", classId: "marauder", tree: "duelist", tier: 1, prereqs: [], bonuses: {}, passive: "+10% de daño a objetivos Marcados.", unlocksSkill: "saber_throw" },
  { id: "due_lethal_precision", name: "Precisión Letal", description: "+5% de probabilidad de crítico, +10% de daño crítico. +1 espacio de combate.", classId: "marauder", tree: "duelist", tier: 2, prereqs: ["due_keen_edge"], bonuses: { critChance: 5, critDamage: 10 }, grantsLoadoutSlot: true },
  { id: "due_evasion", name: "Evasión", description: "+5% de probabilidad de esquiva.", classId: "marauder", tree: "duelist", tier: 2, prereqs: ["due_footwork"], bonuses: { dodgeChance: 5 } },
  { id: "due_riposte", name: "Estocada de Respuesta", description: "25% de probabilidad de contraatacar al esquivar. Desbloquea Lanzamiento Feroz.", classId: "marauder", tree: "duelist", tier: 2, prereqs: ["due_exploit_weakness"], bonuses: {}, passive: "25% de contraataque al esquivar.", unlocksSkill: "vicious_throw" },
  { id: "due_surgical_strike", name: "Golpe Quirúrgico", description: "+3 de Agilidad, los críticos aplican Sangrado. Desbloquea Ejecutar.", classId: "marauder", tree: "duelist", tier: 3, prereqs: ["due_lethal_precision"], bonuses: { agility: 3 }, passive: "Los críticos aplican Sangrado (2 turnos).", unlocksSkill: "execute" },
  { id: "due_shadow_step", name: "Reflejos Relámpago", description: "+5% de esquiva; el próximo ataque tras esquivar inflige +20% de daño.", classId: "marauder", tree: "duelist", tier: 3, prereqs: ["due_evasion"], bonuses: { dodgeChance: 5 }, passive: "+20% de daño en el próximo ataque tras esquivar." },
  { id: "due_vital_points", name: "Puntos Vitales", description: "+15% de daño crítico.", classId: "marauder", tree: "duelist", tier: 3, prereqs: ["due_riposte"], bonuses: { critDamage: 15 } },
  { id: "due_blade_master", name: "Maestro de la Hoja", description: "+5 de Agilidad, +8% de probabilidad de crítico.", classId: "marauder", tree: "duelist", tier: 4, prereqs: ["due_surgical_strike", "due_shadow_step"], bonuses: { agility: 5, critChance: 8 } },
  { id: "due_marked_for_death", name: "Marcado para Morir", description: "Lanzamiento de Sable garantiza Marcar. +15% de daño a Marcados.", classId: "marauder", tree: "duelist", tier: 4, prereqs: ["due_vital_points"], bonuses: {}, passive: "Lanzamiento de Sable garantiza Marcar. +15% de daño a Marcados." },
  { id: "due_death_blossom", name: "Maestro Duelista", description: "+5% de probabilidad de crítico, +20% de daño crítico, +5% de perforación de armadura.", classId: "marauder", tree: "duelist", tier: 5, prereqs: ["due_blade_master"], bonuses: { critChance: 5, critDamage: 20, armorPiercePct: 5 } },
];

export const MARAUDER_TALENTS: TalentNode[] = [...JUGGERNAUT, ...BERSERKER, ...DUELIST];

/** Marauder baseline skills — always available regardless of talents. */
export const MARAUDER_BASELINE_SKILLS = ["heavy_slash", "flurry"];
