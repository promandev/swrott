/**
 * Destructible terrain in combat (Idea #1).
 *
 * Each battlefield can have terrain features (columns, statues, holocron
 * pedestals, lava vents, kyber crystal clusters). Each has HP and a
 * "broken" effect that fires when destroyed.
 *
 * The player can target terrain instead of an enemy; the active skill's
 * damage breaks it. Some skills (Force Storm, Cleave, Death Blossom) can
 * incidentally damage adjacent terrain.
 */

import type { StatusEffect, DamageType } from "../../data/schemas/common";

export type TerrainKind =
  | "column"
  | "pedestal"
  | "lava_vent"
  | "kyber_cluster"
  | "statue_of_marka_ragnos"
  | "barricade";

export interface TerrainObject {
  id: string;
  kind: TerrainKind;
  name: string;
  hp: number;
  maxHp: number;
  /** Side of the field this object stands on. */
  side: "neutral" | "player" | "enemy";
  destroyed: boolean;
  /** Description shown on hover. */
  description: string;
}

/**
 * Returned by the engine when terrain breaks — combat-store applies it.
 */
export interface TerrainBreakEffect {
  /** Damage dealt to a side or a specific target. */
  damage?: { side: "player" | "enemy" | "all"; amount: number; type: DamageType };
  /** Status effect applied to a side. */
  status?: { side: "player" | "enemy" | "all"; effect: StatusEffect; duration: number };
  /** Crystal item drop (gives the player a crystal item id). */
  crystalDrop?: string;
  log: string;
}

export function makeTerrain(kind: TerrainKind, side: TerrainObject["side"], idx = 0): TerrainObject {
  const id = `terrain_${kind}_${idx}`;
  switch (kind) {
    case "column":
      return { id, kind, side, destroyed: false, name: "Columna de Piedra", hp: 60, maxHp: 60,
        description: "Mármol desmoronándose. Cae al destruirse, aturdiendo a quien esté cerca." };
    case "pedestal":
      return { id, kind, side, destroyed: false, name: "Pedestal de Holocrón", hp: 35, maxHp: 35,
        description: "Si lo destrozas, el holocrón de su interior podría revelar conocimiento prohibido." };
    case "lava_vent":
      return { id, kind, side, destroyed: false, name: "Respiradero de Lava", hp: 25, maxHp: 25,
        description: "Ábrelo de golpe y la ruptura quema al bando enemigo." };
    case "kyber_cluster":
      return { id, kind, side, destroyed: false, name: "Racimo de Kyber", hp: 45, maxHp: 45,
        description: "Un racimo de cristales corruptos. Suelta un cristal utilizable al romperse." };
    case "statue_of_marka_ragnos":
      return { id, kind, side, destroyed: false, name: "Estatua de Marka Ragnos", hp: 120, maxHp: 120,
        description: "La efigie del Lord Oscuro. Derribarla infunde miedo a todo Sith cercano." };
    case "barricade":
      return { id, kind, side, destroyed: false, name: "Barricada de Madera", hp: 40, maxHp: 40,
        description: "Barata e inflamable. Arde con facilidad." };
  }
}

export function breakEffect(t: TerrainObject): TerrainBreakEffect {
  switch (t.kind) {
    case "column":
      return { status: { side: t.side === "enemy" ? "enemy" : "all", effect: "stun", duration: 1 },
        log: `${t.name} collapses — anyone beneath is stunned!` };
    case "pedestal":
      return { log: `The pedestal shatters; a holocron memory shard is revealed.` };
    case "lava_vent":
      return { damage: { side: t.side === "enemy" ? "enemy" : "all", amount: 30, type: "fire" },
        status: { side: t.side === "enemy" ? "enemy" : "all", effect: "burn", duration: 3 },
        log: `Lava erupts from the vent!` };
    case "kyber_cluster":
      return { crystalDrop: "crystal_red_synthetic",
        log: `The kyber cluster shatters — a usable crystal pops free.` };
    case "statue_of_marka_ragnos":
      return { status: { side: "enemy", effect: "fear", duration: 2 },
        log: `Marka Ragnos's statue topples — enemies recoil in fear of the omen.` };
    case "barricade":
      return { status: { side: t.side === "enemy" ? "enemy" : "all", effect: "burn", duration: 2 },
        log: `The barricade ignites!` };
  }
}
