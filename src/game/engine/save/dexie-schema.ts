import Dexie, { type Table } from "dexie";
import type { GameSave, SaveSlotMeta } from "./types";

/**
 * Dexie schema. Each version represents a migration boundary.
 * When changing the persisted shape, bump the version and add an upgrader.
 */
class SwrottDB extends Dexie {
  saves!: Table<GameSave, string>;
  meta!: Table<SaveSlotMeta, string>;

  constructor() {
    super("swrott");
    this.version(1).stores({
      // Primary key + indexes
      saves: "meta.id, meta.slotIndex, meta.updatedAt",
      meta: "id, slotIndex, updatedAt",
    });
  }
}

let _db: SwrottDB | null = null;
export function getDB(): SwrottDB {
  if (typeof window === "undefined") {
    throw new Error("Dexie can only be accessed in the browser.");
  }
  if (!_db) _db = new SwrottDB();
  return _db;
}

export async function listSaves(): Promise<SaveSlotMeta[]> {
  const db = getDB();
  return db.meta.orderBy("updatedAt").reverse().toArray();
}

export async function loadSave(id: string): Promise<GameSave | undefined> {
  const db = getDB();
  return db.saves.get(id);
}

export async function writeSave(save: GameSave): Promise<void> {
  const db = getDB();
  save.meta.updatedAt = Date.now();
  await db.transaction("rw", db.saves, db.meta, async () => {
    await db.saves.put(save);
    await db.meta.put(save.meta);
  });
}

export async function deleteSave(id: string): Promise<void> {
  const db = getDB();
  await db.transaction("rw", db.saves, db.meta, async () => {
    await db.saves.delete(id);
    await db.meta.delete(id);
  });
}
