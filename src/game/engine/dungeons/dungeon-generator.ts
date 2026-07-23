/**
 * Procedural dungeon layouts (Independent Loop 4 / Idea IL4-A).
 *
 * Generates a graph of rooms for a randomized dungeon expedition. Each
 * room has a kind that determines what happens when entered:
 *
 *   combat       a normal encounter
 *   elite        rarer, harder encounter w/ guaranteed rare drop
 *   treasure     deterministic loot room
 *   trap         skill check or take damage
 *   altar        sacrifice altar mini-version
 *   shrine       heal & save
 *   merchant     wandering vendor
 *   shard        memory shard pedestal
 *   boss         end-of-dungeon boss
 *
 * The generator builds a directed acyclic graph with exactly one boss
 * room at the end and exactly one entrance.
 */

import type { RNG } from "../rng/rng";

export type DungeonRoomKind =
  | "entrance" | "combat" | "elite" | "treasure" | "trap"
  | "altar" | "shrine" | "merchant" | "shard" | "boss";

export interface DungeonRoom {
  id: string;
  kind: DungeonRoomKind;
  depth: number;             // 0 at entrance, max at boss
  connectionIds: string[];   // children
  /** Specific to room kind. */
  payload?: {
    enemyTemplateIds?: string[];
    lootTableId?: string;
    shardId?: string;
    trapDc?: number;
    trapDamage?: number;
  };
}

export interface DungeonLayout {
  rooms: DungeonRoom[];
  entranceId: string;
  bossId: string;
  depth: number;
}

export interface GenerateDungeonOpts {
  rng: RNG;
  depth: number;             // # of layers (default 5)
  width: number;             // max rooms per layer (default 3)
  enemyPool: string[];
  elitePool: string[];
  bossId: string;
  shardPool: string[];
}

export function generateDungeon(opts: GenerateDungeonOpts): DungeonLayout {
  const { rng, depth, width, enemyPool, elitePool, bossId, shardPool } = opts;
  const rooms: DungeonRoom[] = [];
  let counter = 0;
  const mkId = () => `room_${++counter}`;

  // Build layers
  const layers: DungeonRoom[][] = [];
  for (let d = 0; d <= depth; d++) {
    const layer: DungeonRoom[] = [];
    if (d === 0) {
      layer.push({ id: mkId(), kind: "entrance", depth: d, connectionIds: [] });
    } else if (d === depth) {
      layer.push({
        id: mkId(), kind: "boss", depth: d, connectionIds: [],
        payload: { enemyTemplateIds: [bossId] },
      });
    } else {
      const w = Math.max(1, rng.int(2, width));
      for (let i = 0; i < w; i++) {
        const kind = rollRoomKind(rng, d, depth);
        const room: DungeonRoom = { id: mkId(), kind, depth: d, connectionIds: [] };
        switch (kind) {
          case "combat":
            room.payload = { enemyTemplateIds: rollEncounter(rng, enemyPool, 1 + Math.floor(d / 2)) };
            break;
          case "elite":
            room.payload = { enemyTemplateIds: [rng.pick(elitePool) ?? elitePool[0] ?? "enemy_elite"] };
            break;
          case "treasure":
            room.payload = { lootTableId: `treasure_depth_${d}` };
            break;
          case "trap":
            room.payload = { trapDc: 10 + d * 2, trapDamage: 10 + d * 5 };
            break;
          case "shard":
            room.payload = { shardId: rng.pick(shardPool) };
            break;
          default:
            break;
        }
        layer.push(room);
      }
    }
    layers.push(layer);
    rooms.push(...layer);
  }

  // Wire connections — each room connects to 1-2 random rooms in the next layer
  for (let d = 0; d < depth; d++) {
    const layer = layers[d];
    const next = layers[d + 1];
    if (!layer || !next) continue;
    for (const room of layer) {
      const conns = Math.max(1, Math.min(next.length, rng.int(1, 2)));
      const targets = new Set<string>();
      while (targets.size < conns) {
        const t = rng.pick(next);
        if (t) targets.add(t.id);
      }
      room.connectionIds = [...targets];
    }
    // Ensure every next-layer room is reachable from at least one parent
    for (const child of next) {
      const isReachable = layer.some((r) => r.connectionIds.includes(child.id));
      if (!isReachable) {
        const parent = rng.pick(layer);
        if (parent) parent.connectionIds.push(child.id);
      }
    }
  }

  const entrance = layers[0]?.[0];
  const boss = layers[depth]?.[0];
  return {
    rooms,
    entranceId: entrance?.id ?? "room_1",
    bossId: boss?.id ?? "room_boss",
    depth,
  };
}

function rollRoomKind(rng: RNG, depth: number, maxDepth: number): DungeonRoomKind {
  const isLate = depth >= maxDepth - 1;
  const table: Array<{ kind: DungeonRoomKind; weight: number }> = [
    { kind: "combat",   weight: 50 },
    { kind: "elite",    weight: isLate ? 25 : 10 },
    { kind: "treasure", weight: 12 },
    { kind: "trap",     weight: 10 },
    { kind: "altar",    weight: 4 },
    { kind: "shrine",   weight: 6 },
    { kind: "merchant", weight: 4 },
    { kind: "shard",    weight: 4 },
  ];
  const total = table.reduce((acc, t) => acc + t.weight, 0);
  let roll = rng.float(0, total);
  for (const t of table) {
    if (roll < t.weight) return t.kind;
    roll -= t.weight;
  }
  return "combat";
}

function rollEncounter(rng: RNG, pool: string[], maxSize: number): string[] {
  const size = Math.max(1, rng.int(1, maxSize));
  const enemies: string[] = [];
  for (let i = 0; i < size; i++) {
    const e = rng.pick(pool);
    if (e) enemies.push(e);
  }
  return enemies;
}
