import type { CharacterSnapshot, GameSave, WorldSnapshot } from "../save/types";
import type { ClassId, FactionId } from "../../data/schemas";
import { computeMaxForce, computeMaxHP } from "./stats";

const STARTING_PRIMARY: Record<
  ClassId,
  CharacterSnapshot["primary"]
> = {
  marauder: { strength: 8, agility: 5, endurance: 7, force: 4, influence: 4, corruption: 2 },
  inquisitor: { strength: 4, agility: 5, endurance: 5, force: 9, influence: 6, corruption: 3 },
  assassin: { strength: 5, agility: 9, endurance: 5, force: 5, influence: 5, corruption: 2 },
};

export { STARTING_PRIMARY };
export { computeMaxHP, computeMaxForce };

const FACTION_REP_INIT: Record<FactionId, number> = {
  sith_academy: 0,
  hidden_jedi: -10,
  smuggler_guild: 0,
  mandalorian_houses: 0,
  cult_of_nihilus: 0,
};

export function createNewCharacter(
  name: string,
  classId: ClassId,
): CharacterSnapshot {
  const primary = { ...STARTING_PRIMARY[classId] };
  return {
    name,
    classId,
    level: 1,
    xp: 0,
    attributePoints: 0,
    // Start with a few talent points so the tree (and skill unlocks) is
    // immediately meaningful. Baseline skills cover combat until then.
    talentPoints: 3,
    primary,
    hp: computeMaxHP(primary.endurance, 1),
    forcePoints: computeMaxForce(primary.force, 1),
    credits: 250,
    darkTokens: 0,
    ancientShards: 0,
    arenaMarks: 0,
    ancientTokens: 0,
    corruptedShards: 0,
    equipment: {},
    inventory: [],
    itemInstances: {},
    talents: [],
    favoriteSkills: [],
    achievements: [],
    memoryShards: [],
    mutators: [],
    ngPlus: 0,
    prestige: 0,
    activeBounties: [],
  };
}

export function createInitialWorld(): WorldSnapshot {
  return {
    zoneId: "korriban_academy_exterior",
    questFlags: {},
    factionRep: { ...FACTION_REP_INIT },
    completedQuests: [],
    activeQuests: ["q_chains_of_korriban"],
    discoveredZones: ["korriban_academy_exterior"],
    companions: [],
  };
}

export function createNewSave(
  characterName: string,
  classId: ClassId,
  ironman = false,
  slotIndex = 0,
): GameSave {
  const id = crypto.randomUUID();
  const now = Date.now();
  const character = createNewCharacter(characterName, classId);
  const world = createInitialWorld();
  return {
    meta: {
      id,
      slotIndex,
      name: `${characterName} — Lv 1`,
      characterName,
      classId,
      level: 1,
      zoneId: world.zoneId,
      playtimeSeconds: 0,
      createdAt: now,
      updatedAt: now,
      ironman,
    },
    character,
    world,
    rngSeed: id,
  };
}
