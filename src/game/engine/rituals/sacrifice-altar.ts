/**
 * Sith Sacrifice Altar (Idea #11).
 *
 * The player can interact with altars scattered through the world. Each
 * altar offers irreversible exchanges:
 *
 *  1. Burn a legendary item → +1 tier to a chosen affix on another item.
 *  2. Burn 5 epic items → +1 attribute point.
 *  3. Sacrifice 10% max HP permanently → +25 Force Points permanent.
 *  4. Sacrifice an ally companion's affinity (drop 30) → +1 talent point.
 *  5. Sacrifice 20 corruption → reset all skill cooldowns instantly + heal.
 *
 * Every interaction increases corruption and faction enmity with Jedi/light.
 */

import type { CharacterSnapshot } from "../save/types";

export type AltarOfferingId =
  | "burn_legendary_for_affix"
  | "burn_5_epics_for_attr"
  | "permanent_hp_for_fp"
  | "ally_affinity_for_talent"
  | "purge_corruption_for_reset";

export interface AltarOffering {
  id: AltarOfferingId;
  name: string;
  description: string;
  corruptionGain: number;
  factionRepDelta?: { factionId: string; delta: number };
}

export const ALTAR_OFFERINGS: AltarOffering[] = [
  {
    id: "burn_legendary_for_affix",
    name: "Pacto de las Brasas",
    description: "Consume un objeto legendario. Mejora un afijo de otro objeto en un nivel.",
    corruptionGain: 5,
  },
  {
    id: "burn_5_epics_for_attr",
    name: "Tesoro del Lord Hambriento",
    description: "Consume 5 objetos épicos. Obtén 1 punto de atributo.",
    corruptionGain: 3,
  },
  {
    id: "permanent_hp_for_fp",
    name: "Sangre por Poder",
    description: "Sacrifica permanentemente el 10% de tus PV máximos. Obtén +25 de Puntos de Fuerza máximos.",
    corruptionGain: 7,
  },
  {
    id: "ally_affinity_for_talent",
    name: "Pacto de Traición",
    description: "Pierde 30 de afinidad con un compañero elegido. Obtén 1 punto de talento.",
    corruptionGain: 6,
    factionRepDelta: { factionId: "republic", delta: -5 },
  },
  {
    id: "purge_corruption_for_reset",
    name: "Sangrar el Cristal",
    description: "Gasta 20 de corrupción. Reinicia todos los enfriamientos de habilidad y cura el 50% de los PV máximos.",
    corruptionGain: -20,
  },
];

export function canAffordAltar(
  offering: AltarOffering,
  character: CharacterSnapshot,
): { ok: boolean; reason?: string } {
  switch (offering.id) {
    case "burn_legendary_for_affix": {
      const hasLegendary = false; // checked at UI level once item-instance link is built
      return { ok: hasLegendary || true };
    }
    case "burn_5_epics_for_attr":
      return { ok: true };
    case "permanent_hp_for_fp":
      return character.hp > 50
        ? { ok: true }
        : { ok: false, reason: "Necesitas >50 PV para sobrevivir al ritual." };
    case "ally_affinity_for_talent":
      return { ok: true };
    case "purge_corruption_for_reset":
      return character.primary.corruption >= 20
        ? { ok: true }
        : { ok: false, reason: "Corrupción insuficiente para sangrar (necesitas 20)." };
  }
}
