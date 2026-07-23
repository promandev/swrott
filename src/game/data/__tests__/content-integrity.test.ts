import { describe, it, expect } from "vitest";
import { ALL_ZONES } from "../zones/all-zones";
import { getEnemyTemplate } from "../../engine/combat/enemy-registry";
import { ALL_ENEMIES } from "../../engine/combat/enemy-registry";
import { getSkill } from "../schemas/skill-registry";
import { KORRIBAN_EXTRA_ENEMIES } from "../../engine/combat/planet-enemies";
import { ALL_NPCS, getNpc, getConversation, ALL_CONVERSATIONS } from "../npcs/npc-registry";
import { LOOT_TABLES } from "../../engine/combat/loot-tables";
import { ALL_QUESTS, QUEST_BY_ID } from "../quests/quest-registry";
import { getItem, getAllItems } from "../items/item-registry";
import { ITEM_SETS } from "../items/sets";
import { COMPANIONS } from "../../engine/companions/companions";
import { FactionIdSchema } from "../schemas/common";
import { itemsEn } from "../../../i18n/content/items.en";
import { getShop, SHOPS } from "../shops/shops";
import { CRAFTING_RECIPES, CRAFTING_MATERIALS } from "../../engine/crafting/crafting";
import { ALL_TALENTS } from "../talents/talent-registry";
import { DIALOGUE_ENCOUNTERS } from "../../ui/dialogue/useDialogueConsequences";

/**
 * Content-integrity guards. The most common content bug is a dangling id —
 * a zone pool / encounter referencing an enemy that doesn't exist, or an
 * enemy referencing a skill that doesn't exist. These sweep the whole graph.
 */

describe("new Korriban enemies", () => {
  it("are registered and reference real skills", () => {
    expect(KORRIBAN_EXTRA_ENEMIES.length).toBeGreaterThan(0);
    for (const e of KORRIBAN_EXTRA_ENEMIES) {
      expect(getEnemyTemplate(e.id), `unregistered ${e.id}`).toBeTruthy();
      for (const sk of e.skillIds) {
        expect(getSkill(sk), `${e.id} → missing skill ${sk}`).toBeTruthy();
      }
    }
  });
});

describe("enemy roster integrity", () => {
  it("every enemy's skills resolve in the registry", () => {
    const dangling: string[] = [];
    for (const e of ALL_ENEMIES) {
      for (const sk of e.skillIds) {
        if (!getSkill(sk)) dangling.push(`${e.id} → ${sk}`);
      }
    }
    expect(dangling, `enemies with missing skills:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("has no duplicate enemy ids (the registry Map would silently overwrite)", () => {
    const seen = new Map<string, number>();
    for (const e of ALL_ENEMIES) seen.set(e.id, (seen.get(e.id) ?? 0) + 1);
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([id, n]) => `${id} ×${n}`);
    expect(dupes, `duplicate enemy ids:\n${dupes.join("\n")}`).toEqual([]);
  });

  it("every enemy has sane stats (positive HP, ordered credit range)", () => {
    const bad: string[] = [];
    for (const e of ALL_ENEMIES) {
      if (!(e.baseHp > 0)) bad.push(`${e.id}: baseHp ${e.baseHp}`);
      if (e.creditReward[0] > e.creditReward[1]) bad.push(`${e.id}: credits ${e.creditReward[0]}>${e.creditReward[1]}`);
      if (e.xpReward < 0) bad.push(`${e.id}: xp ${e.xpReward}`);
    }
    expect(bad, `enemies with bad stats:\n${bad.join("\n")}`).toEqual([]);
  });

  it("every enemy's loot table is defined (else it silently drops nothing)", () => {
    const dangling: string[] = [];
    for (const e of ALL_ENEMIES) {
      if (e.lootTableId && !LOOT_TABLES[e.lootTableId]) dangling.push(`${e.id} → ${e.lootTableId}`);
    }
    expect(dangling, `enemies with undefined loot tables:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("no loot table is empty (would drop nothing)", () => {
    const empty: string[] = [];
    for (const table of Object.values(LOOT_TABLES)) {
      if (table.guaranteed.length === 0 && table.pool.length === 0) empty.push(table.id);
    }
    expect(empty, `empty loot tables:\n${empty.join("\n")}`).toEqual([]);
  });

  it("every loot-table drop is a real item", () => {
    const dangling = new Set<string>();
    for (const table of Object.values(LOOT_TABLES)) {
      for (const g of table.guaranteed) if (!getItem(g.itemId)) dangling.add(`${table.id} → ${g.itemId}`);
      for (const p of table.pool) if (!getItem(p.itemId)) dangling.add(`${table.id} → ${p.itemId}`);
    }
    expect([...dangling], `loot tables dropping phantom items:\n${[...dangling].join("\n")}`).toEqual([]);
  });
});

describe("companion integrity", () => {
  it("every companion's loyalty quest exists", () => {
    const dangling: string[] = [];
    for (const c of COMPANIONS) {
      if (c.loyaltyQuestId && !QUEST_BY_ID.get(c.loyaltyQuestId)) dangling.push(`${c.id} → ${c.loyaltyQuestId}`);
    }
    expect(dangling, `companions with missing loyalty quests:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every companion's combat skills resolve in the skill registry", () => {
    const dangling: string[] = [];
    for (const c of COMPANIONS) {
      for (const sk of c.skillIds) {
        if (!getSkill(sk)) dangling.push(`${c.id} → ${sk}`);
      }
    }
    expect(dangling, `companions with phantom skills:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("recruit flags are unique across companions", () => {
    const flags = COMPANIONS.map((c) => c.recruitFlag);
    expect(new Set(flags).size).toBe(flags.length);
  });
});

describe("zone encounter integrity", () => {
  it("every random-encounter pool entry resolves to a real enemy", () => {
    const dangling: string[] = [];
    for (const zone of ALL_ZONES) {
      for (const entry of zone.randomEncounterPool ?? []) {
        if (!getEnemyTemplate(entry.enemyId)) dangling.push(`${zone.id} → ${entry.enemyId}`);
      }
    }
    expect(dangling, `dangling pool refs:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every encounter hotspot references real enemies", () => {
    const dangling: string[] = [];
    for (const zone of ALL_ZONES) {
      for (const hs of zone.hotspots) {
        for (const id of hs.encounterEnemies ?? []) {
          if (!getEnemyTemplate(id)) dangling.push(`${zone.id}/${hs.id} → ${id}`);
        }
      }
    }
    expect(dangling, `dangling encounter refs:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every npc hotspot points to a registered NPC", () => {
    const dangling: string[] = [];
    for (const zone of ALL_ZONES) {
      for (const hs of zone.hotspots) {
        if (hs.type === "npc" && hs.npcId && !getNpc(hs.npcId)) {
          dangling.push(`${zone.id}/${hs.id} → ${hs.npcId}`);
        }
      }
    }
    expect(dangling, `dangling npc refs:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every zone has a way out (an exit or travel hotspot)", () => {
    const trapped: string[] = [];
    for (const zone of ALL_ZONES) {
      const hasWayOut = zone.hotspots.some((hs) => hs.type === "exit" || hs.type === "travel");
      if (!hasWayOut) trapped.push(zone.id);
    }
    expect(trapped, `dead-end zones (no exit/travel):\n${trapped.join("\n")}`).toEqual([]);
  });

  it("every exit leads to a real zone (no doors to nowhere)", () => {
    const zoneIds = new Set(ALL_ZONES.map((z) => z.id));
    const dangling: string[] = [];
    for (const zone of ALL_ZONES) {
      for (const hs of zone.hotspots) {
        if (hs.type === "exit" && hs.targetZoneId && !zoneIds.has(hs.targetZoneId)) {
          dangling.push(`${zone.id}/${hs.id} → ${hs.targetZoneId}`);
        }
      }
    }
    expect(dangling, `exits to non-existent zones:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every loot hotspot references a real loot table", () => {
    const dangling: string[] = [];
    for (const zone of ALL_ZONES) {
      for (const hs of zone.hotspots) {
        if (hs.type === "loot" && hs.lootTableId && !LOOT_TABLES[hs.lootTableId]) {
          dangling.push(`${zone.id}/${hs.id} → ${hs.lootTableId}`);
        }
      }
    }
    expect(dangling, `dangling loot-table refs:\n${dangling.join("\n")}`).toEqual([]);
  });
});

describe("npc dialogue integrity", () => {
  // All NPC conversations are now written — no known gaps. Any dangling ref is
  // a real bug; keep this empty so the suite catches it.
  const KNOWN_MISSING = new Set<string>([]);

  it("has no NEW dangling NPC conversation references", () => {
    const dangling: string[] = [];
    for (const npc of ALL_NPCS) {
      const ids = [
        ...(npc.conversationIds ?? []),
        ...(npc.conversationRules ?? []).map((r) => r.id),
      ];
      for (const id of ids) {
        if (!getConversation(id) && !KNOWN_MISSING.has(id)) dangling.push(`${npc.id} → ${id}`);
      }
    }
    expect(dangling, `NEW dangling conversation refs:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every NPC is anchored to a real zone", () => {
    const zoneIds = new Set(ALL_ZONES.map((z) => z.id));
    const dangling: string[] = [];
    for (const npc of ALL_NPCS) {
      if (npc.zoneId && !zoneIds.has(npc.zoneId)) dangling.push(`${npc.id} → ${npc.zoneId}`);
    }
    expect(dangling, `NPCs in non-existent zones:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every NPC is reachable via an npc hotspot (no orphaned NPCs)", () => {
    // An NPC with conversations but no hotspot anchoring it to a zone is dead
    // content — unreachable in-game. (This is exactly how Malvek/Ronar/Dregg/
    // Tavros/Rhea/Neth/Cyra/Talira/Voss/Rhen were orphaned.) Companions live in
    // a separate COMPANIONS array (not ALL_NPCS), so no exception is needed.
    const ALLOWED_NO_HOTSPOT = new Set<string>([]);
    const hotspotNpcIds = new Set<string>();
    for (const zone of ALL_ZONES) {
      for (const hs of zone.hotspots) {
        if (hs.type === "npc" && hs.npcId) hotspotNpcIds.add(hs.npcId);
      }
    }
    const orphaned: string[] = [];
    for (const npc of ALL_NPCS) {
      if (!hotspotNpcIds.has(npc.id) && !ALLOWED_NO_HOTSPOT.has(npc.id)) orphaned.push(npc.id);
    }
    expect(orphaned, `NPCs with no hotspot (unreachable dead content):\n${orphaned.join("\n")}`).toEqual([]);
  });

  it("the first (intro) conversation of every NPC exists", () => {
    // The intro is what getDefaultConversationForNpc falls back to — if it's
    // missing the NPC is mute. These must always resolve.
    const muted: string[] = [];
    for (const npc of ALL_NPCS) {
      const intro = npc.conversationIds?.[0];
      if (intro && !getConversation(intro) && !KNOWN_MISSING.has(intro)) muted.push(`${npc.id} → ${intro}`);
    }
    expect(muted, `NPCs with a missing intro:\n${muted.join("\n")}`).toEqual([]);
  });
});

describe("quest integrity", () => {
  it("every quest reward item resolves to a real item", () => {
    const dangling: string[] = [];
    for (const q of ALL_QUESTS) {
      const items = [...(q.rewards?.items ?? []), ...(q.darkRewards?.items ?? [])];
      for (const ri of items) {
        if (!getItem(ri.itemId)) dangling.push(`${q.id} → ${ri.itemId}`);
      }
    }
    expect(dangling, `dangling quest reward items:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every quest has at least one required objective with a flag", () => {
    const broken: string[] = [];
    for (const q of ALL_QUESTS) {
      const required = q.objectives.filter((o) => !o.optional);
      if (required.length === 0 || required.some((o) => !o.flagKey)) broken.push(q.id);
    }
    expect(broken, `quests with no required/flagged objective:\n${broken.join("\n")}`).toEqual([]);
  });

  it("every item's setId is a defined set (no orphan set pieces)", () => {
    const dangling: string[] = [];
    for (const item of getAllItems()) {
      if (item.setId && !ITEM_SETS[item.setId]) dangling.push(`${item.id} → ${item.setId}`);
    }
    expect(dangling, `items referencing undefined sets:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("quest objectives have non-empty, unique flag keys within each quest", () => {
    const bad: string[] = [];
    for (const q of ALL_QUESTS) {
      const keys = q.objectives.map((o) => o.flagKey);
      if (keys.some((k) => !k)) bad.push(`${q.id}: empty objective flag`);
      if (new Set(keys).size !== keys.length) bad.push(`${q.id}: duplicate objective flags`);
    }
    expect(bad, `quests with bad objectives:\n${bad.join("\n")}`).toEqual([]);
  });

  it("every quest reward faction is a valid faction id", () => {
    const valid = new Set(FactionIdSchema.options);
    const dangling: string[] = [];
    for (const q of ALL_QUESTS) {
      const reps = [...(q.rewards?.factionRep ?? []), ...(q.darkRewards?.factionRep ?? [])];
      for (const r of reps) if (!valid.has(r.factionId as never)) dangling.push(`${q.id} → ${r.factionId}`);
    }
    expect(dangling, `quests rewarding invalid factions:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every quest prerequisite is a real quest (else it's unstartable)", () => {
    const dangling: string[] = [];
    for (const q of ALL_QUESTS) {
      for (const pre of q.prereqs ?? []) {
        if (!QUEST_BY_ID.get(pre)) dangling.push(`${q.id} → ${pre}`);
      }
    }
    expect(dangling, `quests with missing prerequisites:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("no two quests share an objective flag (except known handoffs)", () => {
    // A flagKey used by objectives in two DIFFERENT quests means satisfying one
    // silently advances the other. Two cases are intentional: a boss both quests
    // credit, and a quest-to-quest handoff. Anything else is a copy-paste bug.
    const KNOWN_SHARED = new Set<string>([
      "temple_voice_defeated", // quest_dark_temple_breach + quest_temple_voice: same boss (the Voice)
      "collector_trail_found", // quest_dock9 → quest_collector_trail handoff (dock-9 manifest)
    ]);
    const byFlag = new Map<string, Set<string>>();
    for (const q of ALL_QUESTS) {
      for (const o of q.objectives) {
        if (!o.flagKey) continue;
        if (!byFlag.has(o.flagKey)) byFlag.set(o.flagKey, new Set());
        byFlag.get(o.flagKey)!.add(q.id);
      }
    }
    const collisions: string[] = [];
    for (const [flag, quests] of byFlag) {
      if (quests.size > 1 && !KNOWN_SHARED.has(flag)) {
        collisions.push(`${flag} ← ${[...quests].join(", ")}`);
      }
    }
    expect(collisions, `objective flags shared across quests (likely copy-paste bug):\n${collisions.join("\n")}`).toEqual([]);
  });

  it("every quest is anchored to a real zone", () => {
    const zoneIds = new Set(ALL_ZONES.map((z) => z.id));
    const dangling: string[] = [];
    for (const q of ALL_QUESTS) {
      if (q.zoneId && !zoneIds.has(q.zoneId)) dangling.push(`${q.id} → ${q.zoneId}`);
    }
    expect(dangling, `quests in non-existent zones:\n${dangling.join("\n")}`).toEqual([]);
  });
});

describe("talent integrity", () => {
  it("every talent's unlocksSkill is a real skill", () => {
    const dangling: string[] = [];
    for (const t of ALL_TALENTS) {
      const sk = (t as { unlocksSkill?: string }).unlocksSkill;
      if (sk && !getSkill(sk)) dangling.push(`${t.id} → ${sk}`);
    }
    expect(dangling, `talents unlocking non-existent skills:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every talent prerequisite is a real talent", () => {
    const ids = new Set(ALL_TALENTS.map((t) => t.id));
    const dangling: string[] = [];
    for (const t of ALL_TALENTS) {
      for (const pre of t.prereqs ?? []) {
        if (!ids.has(pre)) dangling.push(`${t.id} → ${pre}`);
      }
    }
    expect(dangling, `talents with missing prerequisites:\n${dangling.join("\n")}`).toEqual([]);
  });
});

describe("crafting integrity", () => {
  it("every recipe produces a real item (no phantom craft results)", () => {
    const dangling: string[] = [];
    for (const r of CRAFTING_RECIPES) {
      if (!getItem(r.resultItemId)) dangling.push(`${r.id} → ${r.resultItemId}`);
    }
    expect(dangling, `recipes producing non-existent items:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every recipe material is a defined crafting material", () => {
    const matIds = new Set(CRAFTING_MATERIALS.map((m) => m.id));
    const dangling: string[] = [];
    for (const r of CRAFTING_RECIPES) {
      for (const [matId] of r.materials) {
        if (!matIds.has(matId)) dangling.push(`${r.id} → ${matId}`);
      }
    }
    expect(dangling, `recipes needing undefined materials:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every crafting material's source zones are real zones", () => {
    const zoneIds = new Set(ALL_ZONES.map((z) => z.id));
    const dangling: string[] = [];
    for (const m of CRAFTING_MATERIALS) {
      for (const z of m.sourceZones ?? []) {
        if (!zoneIds.has(z)) dangling.push(`${m.id} → ${z}`);
      }
    }
    expect(dangling, `materials gathered in non-existent zones:\n${dangling.join("\n")}`).toEqual([]);
  });
});

describe("shop integrity", () => {
  it("every shop's stock predicate matches real items (no empty merchants)", () => {
    const items = getAllItems();
    const empty: string[] = [];
    for (const shop of SHOPS) {
      const n = items.filter((i) => shop.stocks(i)).length;
      if (n === 0) empty.push(`${shop.id} (0 items match its stock filter)`);
    }
    expect(empty, `shops that render empty:\n${empty.join("\n")}`).toEqual([]);
  });
});

describe("dialogue graph integrity", () => {
  it("every conversation's startNodeId and node links resolve (no dead dialogue)", () => {
    const broken: string[] = [];
    for (const [cid, convo] of Object.entries(ALL_CONVERSATIONS)) {
      const nodeIds = new Set(Object.keys(convo.nodes));
      if (!nodeIds.has(convo.startNodeId)) broken.push(`${cid}: startNodeId '${convo.startNodeId}' missing`);
      for (const [nid, node] of Object.entries(convo.nodes)) {
        if (node.autoNext != null && !nodeIds.has(node.autoNext)) {
          broken.push(`${cid}/${nid}: autoNext '${node.autoNext}' missing`);
        }
        for (const opt of node.options) {
          if (opt.nextNodeId != null && !nodeIds.has(opt.nextNodeId)) {
            broken.push(`${cid}/${nid}/${opt.id}: nextNodeId '${opt.nextNodeId}' missing`);
          }
        }
      }
    }
    expect(broken, `dialogue nodes linking to a non-existent node (dead dialogue):\n${broken.join("\n")}`).toEqual([]);
  });

  it("every dialogue consequence references a real item/quest/faction/companion", () => {
    const validFactions = new Set(FactionIdSchema.options);
    const companionIds = new Set(COMPANIONS.map((c) => c.id));
    const dangling: string[] = [];
    for (const [cid, convo] of Object.entries(ALL_CONVERSATIONS)) {
      for (const [nid, node] of Object.entries(convo.nodes)) {
        const consequences = [...(node.onEnter ?? []), ...node.options.flatMap((o) => o.consequences)];
        for (const c of consequences) {
          if ((c.type === "add_item" || c.type === "remove_item") && (!c.itemId || !getItem(c.itemId))) {
            dangling.push(`${cid}/${nid}: ${c.type} → ${c.itemId}`);
          }
          if ((c.type === "start_quest" || c.type === "complete_quest") && (!c.questId || !QUEST_BY_ID.get(c.questId))) {
            dangling.push(`${cid}/${nid}: ${c.type} → ${c.questId}`);
          }
          if (c.type === "faction_rep" && (!c.factionId || !validFactions.has(c.factionId as never))) {
            dangling.push(`${cid}/${nid}: faction_rep → ${c.factionId}`);
          }
          if (c.type === "companion_affinity" && (!c.companionId || !companionIds.has(c.companionId))) {
            dangling.push(`${cid}/${nid}: companion_affinity → ${c.companionId}`);
          }
          if (c.type === "open_shop" && (!c.shopId || !getShop(c.shopId))) {
            dangling.push(`${cid}/${nid}: open_shop → ${c.shopId}`);
          }
          if (c.type === "start_combat" && (!c.combatEncounterId || !DIALOGUE_ENCOUNTERS[c.combatEncounterId])) {
            dangling.push(`${cid}/${nid}: start_combat → ${c.combatEncounterId} (not in DIALOGUE_ENCOUNTERS)`);
          }
        }
      }
    }
    expect(dangling, `dialogue consequences with dangling refs:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every dialogue-triggerable encounter references real enemies", () => {
    const dangling: string[] = [];
    for (const [encId, enc] of Object.entries(DIALOGUE_ENCOUNTERS)) {
      for (const e of enc.enemies) {
        if (!getEnemyTemplate(e)) dangling.push(`${encId} → ${e}`);
      }
    }
    expect(dangling, `DIALOGUE_ENCOUNTERS referencing phantom enemies:\n${dangling.join("\n")}`).toEqual([]);
  });

  it("every dialogue option's skill check references a real item/faction", () => {
    const validFactions = new Set(FactionIdSchema.options);
    const dangling: string[] = [];
    for (const [cid, convo] of Object.entries(ALL_CONVERSATIONS)) {
      for (const [nid, node] of Object.entries(convo.nodes)) {
        for (const opt of node.options) {
          if (!opt.check) continue;
          if (opt.check.type === "item" && (!opt.check.itemId || !getItem(opt.check.itemId))) {
            dangling.push(`${cid}/${nid}/${opt.id}: item check → ${opt.check.itemId}`);
          }
          if (opt.check.type === "faction" && (!opt.check.factionId || !validFactions.has(opt.check.factionId as never))) {
            dangling.push(`${cid}/${nid}/${opt.id}: faction check → ${opt.check.factionId}`);
          }
        }
      }
    }
    expect(dangling, `dialogue checks with dangling refs:\n${dangling.join("\n")}`).toEqual([]);
  });
});

/**
 * Collect every quest flag the game can actually SET through static content:
 *   - a hotspot's victoryFlag (set on combat win) or eventFlag (set on fire)
 *   - a dialogue `set_flag` consequence, on a node's onEnter or on any option
 *     the player can pick.
 * There is no dynamic kill-counter system — kill objectives are modelled as
 * encounter victoryFlags — so this set is the complete universe of producible
 * flags. A required objective whose flagKey is in none of these can never be
 * satisfied and the quest soft-locks (exactly the Tomb Raiders bug: the
 * "raiders_artifacts" objective had no producer at all).
 */
function collectFlagProducers(): Set<string> {
  const produced = new Set<string>();
  for (const zone of ALL_ZONES) {
    for (const hs of zone.hotspots) {
      if (hs.victoryFlag) produced.add(hs.victoryFlag);
      if (hs.eventFlag) produced.add(hs.eventFlag);
      // Looting a `loot` hotspot stamps `loot_done_<hotspotId>` (see the loot
      // handler in the zone view), which quests can gate an objective on.
      if (hs.type === "loot") produced.add(`loot_done_${hs.id}`);
    }
  }
  for (const convo of Object.values(ALL_CONVERSATIONS)) {
    for (const node of Object.values(convo.nodes)) {
      for (const c of node.onEnter ?? []) {
        if (c.type === "set_flag" && c.key) produced.add(c.key);
      }
      for (const opt of node.options) {
        for (const c of opt.consequences) {
          if (c.type === "set_flag" && c.key) produced.add(c.key);
        }
      }
    }
  }
  return produced;
}

/**
 * Known content debt: required objectives on the later-act planets (Acts III-V
 * and their side quests) whose zones aren't wired with flag-producing hotspots
 * yet, so those quests currently soft-lock. Korriban (Act I) and the Act II
 * Nar Shaddaa/Onderon spine ARE fully wired. This allowlist keeps the suite
 * green while documenting exactly which quests still need zone authoring — and,
 * crucially, any NEW unreachable objective (a fresh authoring bug) still fails
 * because it won't be in here. Whittle this down as planets get wired; never
 * add to it to silence a real regression.
 */
// EMPTY. Every required quest objective in the game is now reachable — the
// whole main-story spine (Acts I-V) AND every side quest are wired with
// flag-producing hotspots/dialogue. This started at 73 unreachable objectives
// across 25 quests; it is now zero. Keep it empty: a non-empty entry here means
// a real soft-lock is being silenced. Wire the quest instead.
const KNOWN_UNWIRED = new Set<string>([]);

describe("quest objective reachability", () => {
  it("every required objective flag is produced somewhere (no soft-locks)", () => {
    const produced = collectFlagProducers();
    const unreachable: string[] = [];
    for (const q of ALL_QUESTS) {
      for (const obj of q.objectives) {
        if (obj.optional) continue;
        if (obj.flagKey && !produced.has(obj.flagKey) && !KNOWN_UNWIRED.has(obj.flagKey)) {
          unreachable.push(`${q.id}/${obj.id} → ${obj.flagKey}`);
        }
      }
    }
    expect(
      unreachable,
      `required objectives whose flag is never set (the quest soft-locks):\n${unreachable.join("\n")}`,
    ).toEqual([]);
  });

  it("every hotspot requireFlag is producible (no permanently-hidden hotspots)", () => {
    const produced = collectFlagProducers();
    // Flags set by game systems rather than static content (rank progression,
    // companion recruitment, etc.). A hotspot gated on one of these is fine.
    const SYSTEM_FLAGS = new Set<string>([
      ...COMPANIONS.map((c) => c.recruitFlag).filter(Boolean) as string[],
    ]);
    // Ship-upgrade flags are set by the ship-upgrade system (player-ship.ts),
    // not by zone/dialogue content.
    const isSystemFlag = (f: string) => SYSTEM_FLAGS.has(f) || /^sith_rank_/.test(f) || /_installed$/.test(f);
    const dead: string[] = [];
    for (const zone of ALL_ZONES) {
      for (const hs of zone.hotspots) {
        if (hs.requireFlag && !produced.has(hs.requireFlag) && !isSystemFlag(hs.requireFlag)) {
          dead.push(`${zone.id}/${hs.id} → requireFlag '${hs.requireFlag}'`);
        }
      }
    }
    expect(dead, `hotspots gated on a flag nothing produces (permanently hidden):\n${dead.join("\n")}`).toEqual([]);
  });

  it("the KNOWN_UNWIRED debt list has no stale entries (all are still real gaps)", () => {
    // If a flag here is now produced (the quest got wired) it must be removed
    // from the allowlist, or it silently masks future regressions on that key.
    const produced = collectFlagProducers();
    const stale = [...KNOWN_UNWIRED].filter((f) => produced.has(f));
    expect(stale, `KNOWN_UNWIRED entries that are now wired — delete them:\n${stale.join("\n")}`).toEqual([]);
  });
});

describe("i18n content coverage", () => {
  // Every item authored in src/game/data/items/* must have a matching entry
  // in src/i18n/content/items.*.ts, or it silently falls back to the source
  // text in every locale. New items added without a translation key are
  // caught here instead of shipping untranslated.
  it("every item has a content.items translation key", () => {
    const known = new Set(Object.keys(itemsEn));
    const missing: string[] = [];
    for (const item of getAllItems()) {
      if (!known.has(item.id)) missing.push(item.id);
    }
    expect(missing, `items missing from src/i18n/content/items.*.ts:\n${missing.join("\n")}`).toEqual([]);
  });
});
