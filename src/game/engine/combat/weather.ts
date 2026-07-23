/**
 * Weather / zone-environmental combat effects (Idea #6).
 *
 * Each zone declares an active weather kind. Combat reads it on start and
 * applies passive modifiers to both sides for the duration of the encounter.
 */

import type { DamageType, StatusEffect } from "../../data/schemas/common";

export type Weather =
  | "clear"
  | "korriban_storm"           // ash storms — +shock dmg, -accuracy
  | "kaas_mist"                // Dromund Kaas mist — random blind chance
  | "malachor_wound"           // Malachor void — +force dmg, +corruption
  | "frozen_winds"             // ice planets — slow, -agility
  | "blood_moon"               // bonus crit on both sides
  | "sith_eclipse"             // ancient — +dark damage, drains 1 HP/turn
  ;

export interface WeatherEffect {
  weather: Weather;
  label: string;
  description: string;
  damageBonusByType?: Partial<Record<DamageType, number>>; // +mult
  accuracyDelta?: number;       // applied to attacker accuracy
  agilityDelta?: number;        // primary stat shift during combat
  perTurnHpDelta?: { side: "all" | "player" | "enemy"; amount: number };
  perTurnStatusChance?: { effect: StatusEffect; chance: number; duration: number; side: "all" | "player" | "enemy" };
  critBonus?: number;
}

export const WEATHER_EFFECTS: Record<Weather, WeatherEffect> = {
  clear: { weather: "clear", label: "Despejado", description: "Sin efectos ambientales." },

  korriban_storm: {
    weather: "korriban_storm",
    label: "Tormenta de Ceniza",
    description: "Arena negra llena el aire. Daño de descarga +15%, precisión -8%.",
    damageBonusByType: { shock: 0.15 },
    accuracyDelta: -0.08,
  },

  kaas_mist: {
    weather: "kaas_mist",
    label: "Niebla de Dromund Kaas",
    description: "Niebla espesa. Probabilidad de ceguera aleatoria cada turno.",
    perTurnStatusChance: { effect: "blind", chance: 0.10, duration: 1, side: "all" },
  },

  malachor_wound: {
    weather: "malachor_wound",
    label: "Herida de Malachor",
    description: "La herida en la Fuerza está abierta. +25% de daño de la Fuerza, +1 de corrupción por turno.",
    damageBonusByType: { force: 0.25 },
    perTurnHpDelta: { side: "all", amount: 0 }, // hooked for corruption in store
  },

  frozen_winds: {
    weather: "frozen_winds",
    label: "Vientos Helados",
    description: "Frío glacial. -2 de agilidad en este combate.",
    agilityDelta: -2,
  },

  blood_moon: {
    weather: "blood_moon",
    label: "Luna de Sangre",
    description: "Los críticos se disparan. +15% de probabilidad de crítico para TODOS los combatientes.",
    critBonus: 0.15,
  },

  sith_eclipse: {
    weather: "sith_eclipse",
    label: "Eclipse Sith",
    description: "La oscuridad te rodea. +daño de la Fuerza, drena 2 PV por turno.",
    damageBonusByType: { force: 0.20 },
    perTurnHpDelta: { side: "all", amount: -2 },
  },
};

/** Map zoneId → default weather. */
export const ZONE_WEATHER: Record<string, Weather> = {
  korriban_academy_exterior: "clear",
  korriban_valley_dark_lords: "korriban_storm",
  korriban_tomb_voren: "sith_eclipse",
  dromund_kaas_jungle: "kaas_mist",
  dromund_kaas_citadel: "clear",
  malachor_v: "malachor_wound",
  hoth_outpost: "frozen_winds",
  arena_dueling_pit: "blood_moon",
};

export function getWeatherForZone(zoneId: string): Weather {
  // Explicit per-zone overrides win.
  const explicit = ZONE_WEATHER[zoneId];
  if (explicit) return explicit;

  // Otherwise infer from the planet/zone theme so weather shows across the
  // real content without enumerating every zone id.
  const z = zoneId.toLowerCase();
  if (z.includes("arena")) return "blood_moon";
  if (z.includes("malachor")) return "malachor_wound";
  if (z.includes("ziost") || z.includes("hoth") || z.includes("frozen") || z.includes("ice")) return "frozen_winds";
  if (z.includes("tomb") || z.includes("ragnos") || z.includes("cathedral")) return "sith_eclipse";
  if (z.includes("dromund_kaas") || z.includes("kaas")) return "kaas_mist";
  if (z.includes("korriban") && (z.includes("valley") || z.includes("dune") || z.includes("exterior"))) return "korriban_storm";
  return "clear";
}
