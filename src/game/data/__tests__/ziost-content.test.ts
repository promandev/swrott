import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ZONE_MAP, PLANET_MAP } from "@/game/data/zones/all-zones";
import { getNpc, getConversation } from "@/game/data/npcs/npc-registry";
import { getItem } from "@/game/data/items/item-registry";
import { getShop } from "@/game/data/shops/shops";
import { QUEST_BY_ID } from "@/game/data/quests/quest-registry";
import { getEnemyTemplate } from "@/game/engine/combat/enemy-registry";

/**
 * Integrity check for the Ziost planet content (zones, scenes, NPCs,
 * conversations, shop, branching quest). Data-driven content can't be caught
 * by `tsc` when an id references something that doesn't exist — this asserts
 * every cross-reference resolves.
 */

const ZIOST_ZONE_IDS = ["ziost_spaceport", "ziost_citadel", "ziost_wastes", "ziost_tomb"];

describe("Ziost planet wiring", () => {
  it("registers the planet and its zones", () => {
    const planet = PLANET_MAP.get("ziost");
    expect(planet).toBeDefined();
    expect(planet!.available).toBe(true);
    expect(ZONE_MAP.get(planet!.startingZoneId)).toBeDefined();
    for (const id of ZIOST_ZONE_IDS) expect(ZONE_MAP.get(id), id).toBeDefined();
  });

  it("every scene id has a palette in DynamicScene", () => {
    const src = readFileSync(
      path.resolve(__dirname, "../../scenes/DynamicScene.tsx"),
      "utf8",
    );
    for (const id of ZIOST_ZONE_IDS) {
      const sceneId = ZONE_MAP.get(id)!.sceneId;
      expect(src.includes(`${sceneId}:`), `palette for ${sceneId}`).toBe(true);
    }
  });

  it("every hotspot reference resolves (npc / target zone / enemies)", () => {
    for (const id of ZIOST_ZONE_IDS) {
      const zone = ZONE_MAP.get(id)!;
      for (const hs of zone.hotspots) {
        if (hs.type === "exit" && hs.targetZoneId) {
          expect(ZONE_MAP.get(hs.targetZoneId), `${hs.id} → ${hs.targetZoneId}`).toBeDefined();
        }
        if (hs.npcId) {
          expect(getNpc(hs.npcId), `${hs.id} npc ${hs.npcId}`).toBeDefined();
        }
        for (const enemyId of hs.encounterEnemies ?? []) {
          expect(getEnemyTemplate(enemyId), `${hs.id} enemy ${enemyId}`).toBeDefined();
        }
      }
      for (const e of zone.randomEncounterPool ?? []) {
        expect(getEnemyTemplate(e.enemyId), `${id} pool ${e.enemyId}`).toBeDefined();
      }
    }
  });

  it("every Ziost NPC conversation resolves", () => {
    for (const npcId of ["npc_ziost_keeper", "npc_ziost_archivist", "npc_ziost_overseer"]) {
      const npc = getNpc(npcId);
      expect(npc, npcId).toBeDefined();
      for (const convId of npc!.conversationIds) {
        expect(getConversation(convId), `${npcId} → ${convId}`).toBeDefined();
      }
    }
  });

  it("the merchant opens the registered shop", () => {
    expect(getShop("ziost_relics")).toBeDefined();
    const keeper = JSON.stringify(getConversation("conv_ziost_keeper"));
    expect(keeper).toContain("\"shopId\":\"ziost_relics\"");
  });

  it("The Frozen Choir quest is fully wired", () => {
    const quest = QUEST_BY_ID.get("quest_ziost_choir");
    expect(quest).toBeDefined();

    // Reward items exist
    for (const r of [...(quest!.rewards.items ?? []), ...(quest!.darkRewards?.items ?? [])]) {
      expect(getItem(r.itemId), `reward item ${r.itemId}`).toBeDefined();
    }

    // Each objective flag is actually set somewhere (conv consequence,
    // hotspot eventFlag, or hotspot victoryFlag).
    const convText = ["conv_sarn_intro", "conv_sarn_verdict", "conv_ziost_keeper"]
      .map((id) => JSON.stringify(getConversation(id)))
      .join(" ");
    const hotspotFlags = new Set<string>();
    for (const id of ZIOST_ZONE_IDS) {
      for (const hs of ZONE_MAP.get(id)!.hotspots) {
        if (hs.eventFlag) hotspotFlags.add(hs.eventFlag);
        if (hs.victoryFlag) hotspotFlags.add(hs.victoryFlag);
      }
    }
    for (const obj of quest!.objectives) {
      const setByConv = convText.includes(`"${obj.flagKey}"`);
      const setByHotspot = hotspotFlags.has(obj.flagKey);
      expect(setByConv || setByHotspot, `objective flag ${obj.flagKey} is never set`).toBe(true);
    }

    // The verdict offers a dark-path resolution.
    expect(JSON.stringify(getConversation("conv_sarn_verdict"))).toContain("ziost_choir_resolved");
  });
});
