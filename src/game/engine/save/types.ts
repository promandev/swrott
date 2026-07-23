import type { ClassId, FactionId, Slot } from "../../data/schemas";

/**
 * The complete serializable game state. Stored in IndexedDB.
 * Versioning lives at the DB level (Dexie versions).
 */

export interface SaveSlotMeta {
  id: string;
  slotIndex: number; // 0..4 manual, -1 autosave, -2 ironman
  name: string;
  characterName: string;
  classId: ClassId;
  level: number;
  zoneId: string;
  playtimeSeconds: number;
  createdAt: number;
  updatedAt: number;
  ironman: boolean;
}

export interface CharacterSnapshot {
  name: string;
  classId: ClassId;
  /** Optional sub-class / specialization id chosen at lvl 10. */
  specId?: string;
  /** Optional secondary class (multiclass unlock at lvl 20). */
  multiclassId?: ClassId;
  level: number;
  xp: number;
  attributePoints: number;
  talentPoints: number;
  primary: {
    strength: number;
    agility: number;
    endurance: number;
    force: number;
    influence: number;
    corruption: number;
  };
  hp: number;
  forcePoints: number;
  credits: number;
  darkTokens: number;
  ancientShards: number;
  /** New currencies (Loot Bible §11). */
  arenaMarks: number;
  ancientTokens: number;
  corruptedShards: number;
  equipment: Partial<Record<Slot, string>>; // slot -> item instance id
  inventory: Array<{ instanceId: string; itemId: string; qty: number }>;
  /** Per-instance state — identified, echoes accrued, socketed crystal, etc. */
  itemInstances: Record<string, ItemInstanceState>;
  talents: string[]; // talent ids unlocked
  /** Favorite skill ids in display order (for quick-bar). */
  favoriteSkills: string[];
  /** Achievement ids unlocked. */
  achievements: string[];
  /** Title currently displayed under the character name. */
  activeTitle?: string;
  /** Memory shards collected; each shard id grants a passive (see holocron-shards.ts). */
  memoryShards: string[];
  /** Active mutators (run modifiers chosen at game start). */
  mutators: string[];
  /** NG+ tier (0 = first playthrough). */
  ngPlus: number;
  /** Prestige tier (after respec resets). */
  prestige: number;
  /** Bounty contracts accepted (active). */
  activeBounties: Array<{ id: string; enemyTemplateId: string; modifiers: string[]; reward: number; xp: number }>;
}

/** Per-item-instance dynamic state. */
export interface ItemInstanceState {
  /** Has the item been identified (legendaries drop unidentified). */
  identified: boolean;
  /** Number of kills with this item equipped (drives Item Echoes). */
  echoStacks: number;
  /** Crystal item id socketed in this weapon (if any). */
  socketedCrystalId?: string;
  /** Pre-rolled affix ids (refer to AFFIX_BY_ID). */
  affixIds: string[];
}

export interface WorldSnapshot {
  zoneId: string;
  questFlags: Record<string, boolean | number | string>;
  factionRep: Record<FactionId, number>;
  completedQuests: string[];
  activeQuests: string[];
  discoveredZones: string[];
  companions: Array<{
    id: string;
    affinity: number;
    inParty: boolean;
    loyaltyComplete: boolean;
    /** Gear assigned to this companion (slot → itemId, consumed from inventory). */
    equipment?: Record<string, string>;
    /** Combat tactic the player has set — shapes the companion's AI. */
    tactic?: "auto" | "aggressive" | "defensive" | "focus";
  }>;
}

export interface GameSave {
  meta: SaveSlotMeta;
  character: CharacterSnapshot;
  world: WorldSnapshot;
  rngSeed: string;
}
