/**
 * Zone system — navigable locations within the game world.
 *
 * Movement model: Point-and-click on hotspots within illustrated 2D scenes.
 * Each zone has exits to other zones and points-of-interest (PoIs) that
 * trigger encounters, NPCs, loot, or events.
 *
 * Controls:
 *   - Click a hotspot → navigate / interact
 *   - Number keys 1-9 → quick-select hotspot
 *   - Tab → cycle hotspots
 *   - M → toggle map
 *   - I → inventory, C → character, J → journal, Esc → menu
 */

export interface ZoneHotspot {
  id: string;
  label: string;
  /** Position on screen as percentage [x%, y%]. */
  position: [number, number];
  type: "exit" | "npc" | "encounter" | "loot" | "event" | "travel";
  /** For exits: target zone ID. */
  targetZoneId?: string;
  /** For NPCs: NPC ID. */
  npcId?: string;
  /** For encounters: enemy group IDs. */
  encounterEnemies?: string[];
  /** For encounters: quest flag set when the player WINS the fight. */
  victoryFlag?: string;
  /** For loot hotspots: which loot table to roll. */
  lootTableId?: string;
  /** For events: quest flag set when the event fires. */
  eventFlag?: string;
  /** For events: short narration shown as a toast when triggered. */
  eventText?: string;
  /** Flag key that must be truthy for this hotspot to appear. */
  requireFlag?: string;
  /** Flag key that hides this hotspot when truthy. */
  hideIfFlag?: string;
  /** Minimum level recommendation (for encounters). */
  recommendedLevel?: number;
  /** Icon hint for the UI. */
  icon?: "door" | "person" | "sword" | "chest" | "star" | "ship";
}

export interface ZoneDefinition {
  id: string;
  name: string;
  description: string;
  planetId: string;
  /** Scene component identifier — maps to the React scene component. */
  sceneId: string;
  /** Ambient music track. */
  musicTrackId?: string;
  /** Hotspots in this zone. */
  hotspots: ZoneHotspot[];
  /** Whether random encounters can trigger in this zone. */
  randomEncounters?: boolean;
  /** Enemy IDs for random encounters, with weights. */
  randomEncounterPool?: Array<{ enemyId: string; weight: number }>;
  /** Encounter chance per navigation (0-1). */
  encounterChance?: number;
}

export interface PlanetDefinition {
  id: string;
  name: string;
  description: string;
  /** Starting zone when arriving at this planet. */
  startingZoneId: string;
  /** All zone IDs on this planet. */
  zoneIds: string[];
  /** Level range recommendation. */
  levelRange: [number, number];
  /** Whether this planet is available from the start. */
  available: boolean;
  /** Quest ID that unlocks this planet. */
  unlockQuestId?: string;
}
