import type { EnemyTemplate } from "./enemies";
import { KORRIBAN_ENEMIES } from "./enemies";
import { ALL_PLANET_ENEMIES } from "./planet-enemies";

/** Unified enemy registry across all planets. */
export const ALL_ENEMIES: EnemyTemplate[] = [
  ...KORRIBAN_ENEMIES,
  ...ALL_PLANET_ENEMIES,
];

const BY_ID = new Map(ALL_ENEMIES.map((e) => [e.id, e]));

export function getEnemyTemplate(id: string): EnemyTemplate | undefined {
  return BY_ID.get(id);
}
