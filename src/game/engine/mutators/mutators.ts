/**
 * Mutators (Idea #25).
 *
 * Optional run modifiers selected at character creation (or via the
 * Sacrifice Altar mid-run). Each mutator stacks — combine for absurd builds.
 *
 *   IRON_WILL          −30% healing taken, +25% XP gain
 *   GLASS_CANNON       +50% damage dealt, −50% max HP
 *   NO_MERCY           cannot flee, +30% credits dropped
 *   PERMADEATH         one life; on death the save is deleted
 *   ECHO_HUNTER        echo stacks accrue 2× faster, but legendaries
 *                      drop 50% less often
 *   PURE_FORCE         force skills cost 25% less, melee damage −30%
 *   PURE_BLADE         melee damage +30%, force skills cost 50% more
 *   CHAOS_LOOT         loot is fully randomized, ignoring class weighting,
 *                      but rarity floor +1
 *   ETERNAL_WINTER     constant Frozen Winds weather effect, +20%
 *                      shock damage
 *   DARK_OMEN          enemies are always corrupted, +1 corruption per
 *                      combat, but +5 dark tokens per boss kill
 */

export interface MutatorEffect {
  id: string;
  name: string;
  description: string;
  /** Multiplier applied to incoming healing (1.0 = no change). */
  healMult?: number;
  xpMult?: number;
  dmgDealtMult?: number;
  maxHpMult?: number;
  creditDropMult?: number;
  legendaryDropMult?: number;
  echoStackMult?: number;
  forceCostMult?: number;
  meleeDmgMult?: number;
  cannotFlee?: boolean;
  permadeath?: boolean;
  rarityFloorShift?: number;       // +1 = floor moves up one tier
  chaosLoot?: boolean;
  forceWeatherId?: string;
  shockDmgMult?: number;
  enemyAlwaysCorrupted?: boolean;
  corruptionPerCombat?: number;
  darkTokensPerBoss?: number;
}

export const MUTATORS: MutatorEffect[] = [
  { id: "iron_will",     name: "Voluntad de Hierro",       description: "−30% healing taken, +25% XP gain.",
    healMult: 0.7, xpMult: 1.25 },
  { id: "glass_cannon",  name: "Cañón de Cristal",    description: "+50% damage dealt, −50% max HP.",
    dmgDealtMult: 1.5, maxHpMult: 0.5 },
  { id: "no_mercy",      name: "Sin Piedad",        description: "No puedes huir, +30% de créditos soltados.",
    cannotFlee: true, creditDropMult: 1.3 },
  { id: "permadeath",    name: "Muerte Permanente",      description: "Una vida. Al morir, la partida se borra.",
    permadeath: true },
  { id: "echo_hunter",   name: "Cazador de Ecos",     description: "Las acumulaciones de eco se ganan 2× más rápido, los legendarios caen un 50% menos.",
    echoStackMult: 2, legendaryDropMult: 0.5 },
  { id: "pure_force",    name: "Fuerza Pura",      description: "Las habilidades de Fuerza cuestan un 25% menos, daño cuerpo a cuerpo −30%.",
    forceCostMult: 0.75, meleeDmgMult: 0.7 },
  { id: "pure_blade",    name: "Hoja Pura",      description: "Daño cuerpo a cuerpo +30%, las habilidades de Fuerza cuestan un 50% más.",
    forceCostMult: 1.5, meleeDmgMult: 1.3 },
  { id: "chaos_loot",    name: "Botín Caótico",      description: "El botín ignora la ponderación de clase; suelo de rareza +1.",
    chaosLoot: true, rarityFloorShift: 1 },
  { id: "eternal_winter",name: "Invierno Eterno",  description: "Vientos Helados constantes. +20% de daño de descarga.",
    forceWeatherId: "frozen_winds", shockDmgMult: 1.2 },
  { id: "dark_omen",     name: "Augurio Oscuro",       description: "Los enemigos siempre corruptos. +1 de corrupción por combate, +5 fichas oscuras por jefe abatido.",
    enemyAlwaysCorrupted: true, corruptionPerCombat: 1, darkTokensPerBoss: 5 },
];

export function getMutator(id: string): MutatorEffect | undefined {
  return MUTATORS.find((m) => m.id === id);
}

/**
 * Aggregate active mutator effects into a single composite. Multiplicative
 * fields compose by multiplication; additive fields sum; flags are OR'd.
 */
export interface MutatorAggregate {
  healMult: number;
  xpMult: number;
  dmgDealtMult: number;
  maxHpMult: number;
  creditDropMult: number;
  legendaryDropMult: number;
  echoStackMult: number;
  forceCostMult: number;
  meleeDmgMult: number;
  shockDmgMult: number;
  rarityFloorShift: number;
  corruptionPerCombat: number;
  darkTokensPerBoss: number;
  cannotFlee: boolean;
  permadeath: boolean;
  chaosLoot: boolean;
  enemyAlwaysCorrupted: boolean;
  forcedWeatherId?: string;
}

export function aggregateMutators(ids: readonly string[]): MutatorAggregate {
  const agg: MutatorAggregate = {
    healMult: 1, xpMult: 1, dmgDealtMult: 1, maxHpMult: 1, creditDropMult: 1,
    legendaryDropMult: 1, echoStackMult: 1, forceCostMult: 1, meleeDmgMult: 1,
    shockDmgMult: 1, rarityFloorShift: 0, corruptionPerCombat: 0, darkTokensPerBoss: 0,
    cannotFlee: false, permadeath: false, chaosLoot: false, enemyAlwaysCorrupted: false,
  };
  for (const id of ids) {
    const m = getMutator(id);
    if (!m) continue;
    if (m.healMult !== undefined) agg.healMult *= m.healMult;
    if (m.xpMult !== undefined) agg.xpMult *= m.xpMult;
    if (m.dmgDealtMult !== undefined) agg.dmgDealtMult *= m.dmgDealtMult;
    if (m.maxHpMult !== undefined) agg.maxHpMult *= m.maxHpMult;
    if (m.creditDropMult !== undefined) agg.creditDropMult *= m.creditDropMult;
    if (m.legendaryDropMult !== undefined) agg.legendaryDropMult *= m.legendaryDropMult;
    if (m.echoStackMult !== undefined) agg.echoStackMult *= m.echoStackMult;
    if (m.forceCostMult !== undefined) agg.forceCostMult *= m.forceCostMult;
    if (m.meleeDmgMult !== undefined) agg.meleeDmgMult *= m.meleeDmgMult;
    if (m.shockDmgMult !== undefined) agg.shockDmgMult *= m.shockDmgMult;
    if (m.rarityFloorShift !== undefined) agg.rarityFloorShift += m.rarityFloorShift;
    if (m.corruptionPerCombat !== undefined) agg.corruptionPerCombat += m.corruptionPerCombat;
    if (m.darkTokensPerBoss !== undefined) agg.darkTokensPerBoss += m.darkTokensPerBoss;
    if (m.cannotFlee) agg.cannotFlee = true;
    if (m.permadeath) agg.permadeath = true;
    if (m.chaosLoot) agg.chaosLoot = true;
    if (m.enemyAlwaysCorrupted) agg.enemyAlwaysCorrupted = true;
    if (m.forceWeatherId) agg.forcedWeatherId = m.forceWeatherId;
  }
  return agg;
}
