/**
 * Ground projection for scene markers and entities.
 *
 * Zone hotspot data stores free-form [x%, y%] positions; many of them sit in
 * the sky band of the painted backgrounds. Scenes place their horizon at
 * ~60% height, so everything interactive must stand on the ground band below
 * it. This module projects the raw data position onto that band (preserving
 * relative order as depth) so markers, NPC sprites and the player's walk
 * target all agree on where "the floor" is — a fixed-camera fake-3D look.
 */

/** Vertical band of the screen that reads as walkable ground.
 * GROUND_BOTTOM stays above the HUD's bottom nav bar so hotspot markers
 * (and their labels/rings) are never covered by UI buttons. */
const GROUND_TOP = 62;
const GROUND_BOTTOM = 79;

export interface GroundPoint {
  /** Screen x in % (unchanged from data). */
  x: number;
  /** Screen y in %, projected into the ground band. */
  y: number;
  /** 0 = far (near horizon) … 1 = near (bottom edge). */
  depth: number;
}

export function projectToGround(position: [number, number]): GroundPoint {
  const depth = Math.min(1, Math.max(0, position[1] / 100));
  return {
    x: position[0],
    y: GROUND_TOP + depth * (GROUND_BOTTOM - GROUND_TOP),
    depth,
  };
}

/** Perspective scale for sprites standing at the given depth. */
export function depthScale(depth: number): number {
  return 0.7 + depth * 0.45;
}

/** z-index so nearer entities draw over farther ones. */
export function depthZIndex(depth: number): number {
  return Math.round(depth * 100);
}
