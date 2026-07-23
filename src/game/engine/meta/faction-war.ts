/**
 * Faction war meta-game (Independent Loop 5 / Idea IL5-A).
 *
 * A persistent territory-control layer on top of the galaxy map.
 * Factions own territories; the player can shift control by completing
 * actions. Each week (real-time or in-game cycle) factions push their
 * influence by a fixed amount; territories flip when their influence
 * exceeds a threshold.
 *
 *   Territory states: owned, contested, lost
 *   Player actions:
 *     - Complete faction quest         +10 influence for that faction
 *     - Win combat for faction         +1 influence
 *     - Defeat rival faction boss      +25
 *     - Sabotage territory             −15 to defender, +10 to attacker
 */

import type { FactionId } from "../../data/schemas";

export interface Territory {
  id: string;
  name: string;
  planet: string;
  ownerFactionId: FactionId;
  influence: Record<FactionId, number>;     // 0..100 per faction
  contested: boolean;
  /** Quest hooks unlocked when player controls this territory. */
  questHooks: string[];
}

export const TERRITORIES: Territory[] = [
  { id: "korriban_academy", name: "Academia Sith",     planet: "Korriban", ownerFactionId: "sith_academy",
    influence: { sith_academy: 80, hidden_jedi: 0, smuggler_guild: 5, mandalorian_houses: 0, cult_of_nihilus: 15 },
    contested: false, questHooks: ["quest_academy_initiation", "quest_academy_purge"] },
  { id: "korriban_tombs",   name: "Valle de los Lores Oscuros", planet: "Korriban", ownerFactionId: "cult_of_nihilus",
    influence: { sith_academy: 30, hidden_jedi: 0, smuggler_guild: 0, mandalorian_houses: 0, cult_of_nihilus: 65 },
    contested: true, questHooks: ["quest_tomb_pilgrim"] },
  { id: "dxun_camps",       name: "Campamentos Mandalorianos", planet: "Onderon", ownerFactionId: "mandalorian_houses",
    influence: { sith_academy: 5, hidden_jedi: 10, smuggler_guild: 15, mandalorian_houses: 70, cult_of_nihilus: 0 },
    contested: false, questHooks: ["quest_dxun_hunt"] },
  { id: "telos_polar",      name: "Ruinas de la Academia Polar", planet: "Telos", ownerFactionId: "hidden_jedi",
    influence: { sith_academy: 10, hidden_jedi: 70, smuggler_guild: 0, mandalorian_houses: 0, cult_of_nihilus: 20 },
    contested: false, questHooks: ["quest_hidden_council"] },
  { id: "nar_shaddaa_docks",name: "Muelles de Contrabandistas",     planet: "Nar Shaddaa", ownerFactionId: "smuggler_guild",
    influence: { sith_academy: 5, hidden_jedi: 0, smuggler_guild: 80, mandalorian_houses: 10, cult_of_nihilus: 5 },
    contested: false, questHooks: ["quest_smuggler_run"] },
];

export const FLIP_THRESHOLD = 60;
export const PASSIVE_WEEKLY_GAIN = 2;

export interface FactionAction {
  factionId: FactionId;
  territoryId: string;
  influenceDelta: number;
}

export function applyFactionAction(territories: Territory[], action: FactionAction): Territory[] {
  return territories.map((t) => {
    if (t.id !== action.territoryId) return t;
    const newInfluence = {
      ...t.influence,
      [action.factionId]: Math.max(0, Math.min(100, (t.influence[action.factionId] ?? 0) + action.influenceDelta)),
    };
    return resolveOwnership({ ...t, influence: newInfluence });
  });
}

function resolveOwnership(t: Territory): Territory {
  let maxFaction: FactionId = t.ownerFactionId;
  let maxValue = -1;
  for (const [f, v] of Object.entries(t.influence) as [FactionId, number][]) {
    if (v > maxValue) { maxValue = v; maxFaction = f; }
  }
  const contested = Object.values(t.influence).filter((v) => v >= 30).length >= 2;
  if (maxValue >= FLIP_THRESHOLD && maxFaction !== t.ownerFactionId) {
    return { ...t, ownerFactionId: maxFaction, contested };
  }
  return { ...t, contested };
}

/** Apply passive weekly drift — each faction gains a small amount in
 * territories it owns, and rivals decay slightly. */
export function tickFactionWar(territories: Territory[]): Territory[] {
  return territories.map((t) => {
    const newInfluence = { ...t.influence };
    for (const [f, v] of Object.entries(newInfluence) as [FactionId, number][]) {
      if (f === t.ownerFactionId) {
        newInfluence[f] = Math.min(100, v + PASSIVE_WEEKLY_GAIN);
      } else {
        newInfluence[f] = Math.max(0, v - 1);
      }
    }
    return resolveOwnership({ ...t, influence: newInfluence });
  });
}
