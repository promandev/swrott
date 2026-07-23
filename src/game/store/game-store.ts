import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { CharacterSnapshot, GameSave, WorldSnapshot } from "../engine/save/types";
import { writeSave } from "../engine/save/dexie-schema";
import { checkLevelUp } from "../engine/progression/leveling";
import { computeMaxHP, computeMaxForce } from "../engine/progression/stats";
import { getItem } from "../data/items/item-registry";
import { canEquip, getConsumableEffect, summarizeGear } from "../engine/items/equipment";
import { QUEST_BY_ID, questsTouchingFlag } from "../data/quests/quest-registry";
import { isQuestComplete, isQuestAvailable, type QuestDefinition, type QuestReward } from "../engine/quests/quest-types";
import type { Slot } from "../data/schemas";
import { canUnlockTalent, getTalent } from "../data/talents/talent-registry";
import { computeTalentModifiers, availableSkillIds } from "../engine/progression/talent-effects";
import { getSithRank } from "../engine/progression/rank";
import { COMPANIONS, MAX_PARTY_SIZE } from "../engine/companions/companions";
import { getShop } from "../data/shops/shops";
import { buyPrice, sellPrice } from "../engine/shops/pricing";

/**
 * Root game store. Slices:
 *  - character: player snapshot (stats, inventory, talents)
 *  - world:     zone, quests, factions, companions
 *  - ui:        which panels are open, transient overlays
 *  - meta:      save slot metadata, playtime ticker, rng seed
 *
 * Combat state lives in a separate ephemeral store (encounters are scoped).
 */

export interface UIState {
  activePanel:
    | null
    | "inventory"
    | "character"
    | "journal"
    | "map"
    | "menu"
    | "dialogue"
    | "shop";
  /** When the shop panel is open, which merchant's wares to show. */
  activeShopId: string | null;
  combatActive: boolean;
  toast: { id: number; text: string; tone: "info" | "warn" | "danger" | "success" | "warning" } | null;
  /** Set to the new level when the character levels up; drives the celebration overlay. */
  levelUpFlash: number | null;
  /** Zone where the player last meditated — gates rest to once per zone visit. */
  restedZoneId: string | null;
}

export interface MetaState {
  saveId: string | null;
  slotIndex: number;
  characterName: string;
  ironman: boolean;
  playtimeSeconds: number;
  rngSeed: string;
  createdAt: number;
}

interface GameStore {
  character: CharacterSnapshot | null;
  world: WorldSnapshot | null;
  ui: UIState;
  meta: MetaState | null;

  // Lifecycle
  hydrateFromSave: (save: GameSave) => void;
  reset: () => void;

  // World mutation
  setWorldField: <K extends keyof WorldSnapshot>(key: K, value: WorldSnapshot[K]) => void;

  // Character mutation
  addItems: (drops: Array<{ itemId: string; qty: number }>) => void;
  removeItems: (drops: Array<{ itemId: string; qty: number }>) => void;
  addCredits: (amount: number) => void;
  addArenaMarks: (amount: number) => void;
  addAncientTokens: (amount: number) => void;
  addCorruptedShards: (amount: number) => void;
  addDarkTokens: (amount: number) => void;
  addXp: (amount: number) => void;
  applyDamage: (amount: number) => void;
  healCharacter: (hpAmount: number, fpAmount?: number) => void;
  /**
   * Persist post-combat vitals back onto the character, clamped to the true
   * max (gear + talents). Pass Infinity to restore to full (e.g. on respawn).
   */
  setVitals: (hp: number, fp: number) => void;
  /**
   * Out-of-combat recovery (Sith meditation). Restores a chunk of HP and most
   * Force, once per zone visit, so persisted wounds have a recovery valve
   * without trivializing consumables. No-op if already rested here.
   */
  meditate: () => void;
  /**
   * Toggle a recruited companion in/out of the active party (KOTOR-style).
   * Enforces the party cap (player + up to MAX_PARTY_SIZE-1 companions).
   * No-op if the companion isn't recruited or the party is full.
   */
  toggleCompanionParty: (companionId: string) => void;
  /** Assign the best available inventory gear to a companion (consumes items). */
  autoEquipCompanion: (companionId: string) => void;
  /** Return a companion's equipped item in a slot to the shared inventory. */
  unequipCompanionItem: (companionId: string, slot: string) => void;
  /** Set a companion's combat tactic (how their AI behaves in battle). */
  setCompanionTactic: (companionId: string, tactic: "auto" | "aggressive" | "defensive" | "focus") => void;
  /** Shared victories bond the active party (+1 affinity, capped — deeper
   *  bonds still require real choices in dialogue/loyalty quests). */
  bondPartyAfterVictory: () => void;
  adjustCorruption: (delta: number) => void;
  adjustFactionRep: (factionId: keyof WorldSnapshot["factionRep"], delta: number) => void;
  setQuestFlag: (key: string, value: boolean | number | string) => void;
  startQuest: (questId: string) => void;
  completeQuest: (questId: string) => void;
  /** Mark an item instance as identified. */
  identifyItem: (instanceId: string) => void;
  /** Increment Item Echo stacks for an instance. */
  bumpItemEcho: (instanceId: string, amount?: number) => void;
  /** Unlock an achievement; toast if newly unlocked. */
  unlockAchievement: (id: string, label?: string) => void;
  /** Add memory shard (passive). */
  collectMemoryShard: (shardId: string) => void;
  /** Set active title. */
  setActiveTitle: (title: string | undefined) => void;
  /** Add a favorite skill (no duplicates). */
  toggleFavoriteSkill: (skillId: string) => void;
  /** Reorder favorite skill list. */
  reorderFavoriteSkills: (skillIds: string[]) => void;
  /** Spend a talent point to unlock a talent node. */
  unlockTalent: (talentId: string) => void;
  /** Replace the combat loadout (validated against unlocks + slot cap). */
  setLoadout: (skillIds: string[]) => void;
  /** Equip an inventory item by instance id into its slot. */
  equipItem: (instanceId: string) => void;
  /** Equip the highest-power valid item in every slot (QoL one-click optimize). */
  autoEquipBest: () => void;
  /** Clear an equipment slot. */
  unequipItem: (slot: Slot) => void;
  /** Consume a usable item (medpack, stim…) out of combat. */
  useConsumable: (instanceId: string) => void;

  // UI
  openPanel: (p: UIState["activePanel"]) => void;
  closePanel: () => void;
  showToast: (text: string, tone?: "info" | "warn" | "danger" | "success" | "warning") => void;
  /** Clear the level-up celebration flash (consumed by the overlay). */
  clearLevelUpFlash: () => void;

  // Merchants
  /** Open a merchant's shop panel. */
  openShop: (shopId: string) => void;
  /** Buy one unit of an item from the given shop. */
  buyItem: (shopId: string, itemId: string) => void;
  /** Sell one unit of an inventory instance to the active shop. */
  sellItem: (instanceId: string) => void;

  // Persistence
  buildSnapshot: () => GameSave | null;
  saveCurrent: () => Promise<void>;
}

const initialUI: UIState = {
  activePanel: null,
  activeShopId: null,
  combatActive: false,
  toast: null,
  levelUpFlash: null,
  restedZoneId: null,
};

let toastCounter = 0;

// ─── Draft helpers (shared by several actions) ─────────────────────────
// These mutate the immer draft directly so XP, level-ups and quest rewards
// behave identically whether they come from combat, dialogue, or auto-tracking.

interface StoreDraft {
  character: CharacterSnapshot | null;
  world: WorldSnapshot | null;
  ui: UIState;
}

function toastDraft(s: StoreDraft, text: string, tone: NonNullable<UIState["toast"]>["tone"]): void {
  s.ui.toast = { id: ++toastCounter, text, tone };
}

/** Add XP and apply any pending level-ups (points, max HP/FP, full heal). */
function grantXpDraft(s: StoreDraft, amount: number): void {
  const c = s.character;
  if (!c || amount === 0) return;
  c.xp = Math.max(0, c.xp + amount);
  const result = checkLevelUp(c.level, c.xp);
  if (!result) return;
  const prevRank = getSithRank(c.classId, c.level, c.primary.corruption);
  c.level = result.newLevel;
  c.attributePoints += result.attributePointsGained;
  c.talentPoints += result.talentPointsGained;
  // Leveling restores body and spirit — heal to the TRUE max (gear + talents),
  // matching the combat engine so a level-up always tops the bar right off.
  const gear = summarizeGear(c);
  const m = computeTalentModifiers(c);
  c.hp = computeMaxHP(c.primary.endurance + gear.stats.endurance + m.endurance, c.level) + gear.hpBonus + m.maxHp;
  c.forcePoints = computeMaxForce(c.primary.force + gear.stats.force + m.force, c.level) + gear.fpBonus + m.maxFp;
  s.ui.levelUpFlash = result.newLevel;
  toastDraft(
    s,
    `Level up! You are now level ${result.newLevel} (+${result.attributePointsGained} attribute, +${result.talentPointsGained} talent points)`,
    "success",
  );
  // Crossing a Sith rank threshold is a story beat — call it out and record a
  // flag so NPCs and quests can react to your standing.
  const newRank = getSithRank(c.classId, c.level, c.primary.corruption);
  if (newRank.tier > prevRank.tier) {
    toastDraft(s, `The Force bends to you — you have risen to ${newRank.rank}.`, "success");
    if (s.world) {
      for (let t = 1; t <= newRank.tier; t++) s.world.questFlags[`sith_rank_${t}`] = true;
    }
  }
}

/** Corruption at or above this grants a quest's dark-path reward variant. */
const DARK_REWARD_CORRUPTION = 50;

/** Pick the reward set: dark variant for corrupted characters, else default. */
function pickQuestRewards(quest: QuestDefinition, s: StoreDraft): { rewards: QuestReward; isDark: boolean } {
  const corrupted = (s.character?.primary.corruption ?? 0) >= DARK_REWARD_CORRUPTION;
  if (quest.darkRewards && corrupted) return { rewards: quest.darkRewards, isDark: true };
  return { rewards: quest.rewards, isDark: false };
}

/** Complete a quest and grant its rewards exactly once. */
function completeQuestDraft(s: StoreDraft, quest: QuestDefinition): void {
  if (!s.world) return;
  if (s.world.completedQuests.includes(quest.id)) return;
  s.world.activeQuests = s.world.activeQuests.filter((q) => q !== quest.id);
  s.world.completedQuests.push(quest.id);

  const { rewards: r, isDark } = pickQuestRewards(quest, s);
  if (s.character) {
    if (r.credits) s.character.credits = Math.max(0, s.character.credits + r.credits);
    if (r.items) {
      for (const drop of r.items) {
        const existing = s.character.inventory.find((i) => i.itemId === drop.itemId);
        if (existing) existing.qty += drop.qty;
        else
          s.character.inventory.push({
            instanceId: `${drop.itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            itemId: drop.itemId,
            qty: drop.qty,
          });
      }
    }
    if (r.corruption) {
      s.character.primary.corruption = Math.max(0, Math.min(100, s.character.primary.corruption + r.corruption));
    }
  }
  if (r.factionRep && s.world) {
    for (const rep of r.factionRep) {
      const key = rep.factionId as keyof WorldSnapshot["factionRep"];
      const cur = s.world.factionRep[key] ?? 0;
      s.world.factionRep[key] = Math.max(-100, Math.min(100, cur + rep.amount));
    }
  }
  // Completing a companion's loyalty quest cements the bond — marks them loyal
  // and grants a big affinity boost (beyond the combat-bond cap of 50).
  const loyal = COMPANIONS.find((cp) => cp.loyaltyQuestId === quest.id);
  if (loyal) {
    const comp = s.world.companions.find((c) => c.id === loyal.id);
    if (comp && !comp.loyaltyComplete) {
      comp.loyaltyComplete = true;
      comp.affinity = Math.min(100, comp.affinity + 20);
      toastDraft(s, `${loyal.name} is now loyal to you.`, "success");
    }
  }

  const parts = [`Quest complete: ${quest.name}${isDark ? " (dark path)" : ""}`];
  if (r.xp) parts.push(`+${r.xp} XP`);
  if (r.credits) parts.push(`+${r.credits} credits`);
  toastDraft(s, parts.join(" — "), "success");
  // XP last: its level-up toast (if any) is the more exciting one to keep.
  if (r.xp) grantXpDraft(s, r.xp);
}

/**
 * Flag-driven quest tracking: when a flag flips, auto-start any quest whose
 * objectives reference it (prereqs permitting) and auto-complete active
 * quests whose required objectives are now all done.
 */
function runQuestTrackingDraft(s: StoreDraft, flagKey: string): void {
  if (!s.world) return;
  const completed = new Set(s.world.completedQuests);

  for (const quest of questsTouchingFlag(flagKey)) {
    if (completed.has(quest.id)) continue;
    if (!s.world.activeQuests.includes(quest.id)) {
      if (!isQuestAvailable(quest, completed)) continue;
      s.world.activeQuests.push(quest.id);
      toastDraft(s, `New quest: ${quest.name}`, "info");
    }
    if (isQuestComplete(quest, s.world.questFlags)) {
      completeQuestDraft(s, quest);
    }
  }
}

/**
 * Recruit a companion when its recruit flag flips truthy. Dialogues set flags
 * like `kaelis_recruited` but nothing converted them into roster members — so
 * companions never actually joined. This bridges that gap.
 */
function recruitCompanionDraft(s: StoreDraft, flagKey: string): void {
  if (!s.world) return;
  const def = COMPANIONS.find((c) => c.recruitFlag === flagKey);
  if (!def) return;
  if (s.world.companions.some((c) => c.id === def.id)) return;
  s.world.companions.push({ id: def.id, affinity: 0, inParty: false, loyaltyComplete: false });
  toastDraft(s, `${def.name} has joined you.`, "success");
}

export const useGameStore = create<GameStore>()(
  devtools(
    immer((set, get) => ({
      character: null,
      world: null,
      ui: initialUI,
      meta: null,

      hydrateFromSave: (save) =>
        set((s) => {
          s.character = save.character;
          s.world = save.world;
          s.meta = {
            saveId: save.meta.id,
            slotIndex: save.meta.slotIndex,
            characterName: save.meta.characterName,
            ironman: save.meta.ironman,
            playtimeSeconds: save.meta.playtimeSeconds,
            rngSeed: save.rngSeed,
            createdAt: save.meta.createdAt,
          };
          s.ui = initialUI;
        }),

      reset: () =>
        set((s) => {
          s.character = null;
          s.world = null;
          s.meta = null;
          s.ui = initialUI;
        }),

      openPanel: (p) =>
        set((s) => {
          s.ui.activePanel = p;
        }),

      setWorldField: (key, value) =>
        set((s) => {
          if (s.world) {
            // Leaving a zone refreshes the rest opportunity for the next one.
            if (key === "zoneId" && s.world.zoneId !== value) {
              s.ui.restedZoneId = null;
            }
            (s.world as Record<string, unknown>)[key] = value;
          }
        }),

      addItems: (drops) =>
        set((s) => {
          if (!s.character) return;
          for (const d of drops) {
            const existing = s.character.inventory.find((i) => i.itemId === d.itemId);
            if (existing) {
              existing.qty += d.qty;
            } else {
              s.character.inventory.push({
                instanceId: `${d.itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                itemId: d.itemId,
                qty: d.qty,
              });
            }
          }
        }),

      removeItems: (drops) =>
        set((s) => {
          if (!s.character) return;
          for (const d of drops) {
            const existing = s.character.inventory.find((i) => i.itemId === d.itemId);
            if (!existing) continue;
            existing.qty -= d.qty;
            if (existing.qty <= 0) {
              s.character.inventory = s.character.inventory.filter(
                (i) => i.itemId !== d.itemId || i.qty > 0,
              );
            }
          }
        }),

      addCredits: (amount) =>
        set((s) => {
          if (!s.character) return;
          s.character.credits = Math.max(0, s.character.credits + amount);
        }),

      addArenaMarks: (amount) =>
        set((s) => {
          if (!s.character) return;
          s.character.arenaMarks = Math.max(0, s.character.arenaMarks + amount);
        }),

      addAncientTokens: (amount) =>
        set((s) => {
          if (!s.character) return;
          s.character.ancientTokens = Math.max(0, s.character.ancientTokens + amount);
        }),

      addCorruptedShards: (amount) =>
        set((s) => {
          if (!s.character) return;
          s.character.corruptedShards = Math.max(0, s.character.corruptedShards + amount);
        }),

      addDarkTokens: (amount) =>
        set((s) => {
          if (!s.character) return;
          s.character.darkTokens = Math.max(0, s.character.darkTokens + amount);
        }),

      identifyItem: (instanceId) =>
        set((s) => {
          if (!s.character) return;
          const inst = s.character.itemInstances[instanceId] ?? {
            identified: false, echoStacks: 0, affixIds: [],
          };
          inst.identified = true;
          s.character.itemInstances[instanceId] = inst;
        }),

      bumpItemEcho: (instanceId, amount = 1) =>
        set((s) => {
          if (!s.character) return;
          const inst = s.character.itemInstances[instanceId] ?? {
            identified: true, echoStacks: 0, affixIds: [],
          };
          inst.echoStacks = Math.min(10, inst.echoStacks + amount);
          s.character.itemInstances[instanceId] = inst;
        }),

      unlockAchievement: (id, label) =>
        set((s) => {
          if (!s.character) return;
          if (s.character.achievements.includes(id)) return;
          s.character.achievements.push(id);
          s.ui.toast = { id: ++toastCounter, text: `Achievement: ${label ?? id}`, tone: "success" };
        }),

      collectMemoryShard: (shardId) =>
        set((s) => {
          if (!s.character) return;
          if (s.character.memoryShards.includes(shardId)) return;
          s.character.memoryShards.push(shardId);
        }),

      setActiveTitle: (title) =>
        set((s) => {
          if (!s.character) return;
          s.character.activeTitle = title;
        }),

      toggleFavoriteSkill: (skillId) =>
        set((s) => {
          const c = s.character;
          if (!c) return;
          const idx = c.favoriteSkills.indexOf(skillId);
          if (idx >= 0) {
            c.favoriteSkills.splice(idx, 1);
            return;
          }
          const available = new Set(availableSkillIds(c));
          if (!available.has(skillId)) {
            toastDraft(s, "Unlock this skill in the talent tree first.", "warn");
            return;
          }
          const slots = computeTalentModifiers(c).loadoutSlots;
          if (c.favoriteSkills.length >= slots) {
            toastDraft(s, `Combat loadout full (${slots} slots).`, "warn");
            return;
          }
          c.favoriteSkills.push(skillId);
        }),

      reorderFavoriteSkills: (skillIds) =>
        set((s) => {
          if (!s.character) return;
          s.character.favoriteSkills = [...skillIds];
        }),

      unlockTalent: (talentId) =>
        set((s) => {
          const c = s.character;
          if (!c) return;
          const unlocked = new Set(c.talents);
          if (!canUnlockTalent(talentId, unlocked, c.talentPoints, c.level)) return;

          // Capture the HP/FP ceiling BEFORE the talent applies. A talent that
          // raises max HP/FP (directly, or via +endurance/+force) must raise the
          // current pools by the same delta — otherwise the next fight starts at
          // the old value instead of with the bar topped up.
          const maxPools = () => {
            const gear = summarizeGear(c);
            const m = computeTalentModifiers(c);
            return {
              hp: computeMaxHP(c.primary.endurance + gear.stats.endurance + m.endurance, c.level) + gear.hpBonus + m.maxHp,
              fp: computeMaxForce(c.primary.force + gear.stats.force + m.force, c.level) + gear.fpBonus + m.maxFp,
            };
          };
          const before = maxPools();

          c.talents.push(talentId);
          c.talentPoints = Math.max(0, c.talentPoints - 1);

          const after = maxPools();
          if (after.hp > before.hp) c.hp = Math.min(after.hp, c.hp + (after.hp - before.hp));
          if (after.fp > before.fp) c.forcePoints = Math.min(after.fp, c.forcePoints + (after.fp - before.fp));

          const node = getTalent(talentId);
          toastDraft(s, `Talent learned: ${node?.name ?? talentId}`, "success");
        }),

      setLoadout: (skillIds) =>
        set((s) => {
          const c = s.character;
          if (!c) return;
          const available = new Set(availableSkillIds(c));
          const slots = computeTalentModifiers(c).loadoutSlots;
          c.favoriteSkills = skillIds.filter((id) => available.has(id)).slice(0, slots);
        }),

      addXp: (amount) =>
        set((s) => {
          if (!s.character) return;
          grantXpDraft(s, amount);
        }),

      autoEquipBest: () =>
        set((s) => {
          const c = s.character;
          if (!c) return;
          const power = (item: ReturnType<typeof getItem>): number => {
            if (!item) return -1;
            let p = item.weapon?.damage ?? 0;
            for (const v of Object.values((item.bonuses ?? {}) as Record<string, number | undefined>)) p += v ?? 0;
            return p;
          };
          let changed = 0;
          const slots: Slot[] = ["main_hand", "off_hand", "head", "chest", "gloves", "belt", "boots", "implant_a", "implant_b", "relic_a", "relic_b"];
          for (const slot of slots) {
            const candidates = c.inventory.filter((inv) => {
              const item = getItem(inv.itemId);
              return item?.slot === slot && canEquip(c, item).ok;
            });
            if (candidates.length === 0) continue;
            const best = candidates.reduce((a, b) => (power(getItem(b.itemId)) > power(getItem(a.itemId)) ? b : a));
            const equippedId = c.equipment[slot];
            const equippedItem = equippedId
              ? getItem(c.inventory.find((i) => i.instanceId === equippedId)?.itemId ?? equippedId)
              : null;
            if (!equippedItem || power(getItem(best.itemId)) > power(equippedItem)) {
              c.equipment[slot] = best.instanceId;
              changed++;
            }
          }
          toastDraft(s, changed > 0 ? `Optimized ${changed} slot${changed > 1 ? "s" : ""}.` : "Already optimally equipped.", changed > 0 ? "success" : "info");
        }),

      equipItem: (instanceId) =>
        set((s) => {
          if (!s.character) return;
          const inv = s.character.inventory.find((i) => i.instanceId === instanceId);
          if (!inv) return;
          const item = getItem(inv.itemId);
          if (!item?.slot) return;
          const check = canEquip(s.character, item);
          if (!check.ok) {
            toastDraft(s, check.reason ?? "Cannot equip this item.", "warn");
            return;
          }
          s.character.equipment[item.slot] = instanceId;
          toastDraft(s, `Equipped ${item.name}`, "info");
        }),

      unequipItem: (slot) =>
        set((s) => {
          if (!s.character) return;
          delete s.character.equipment[slot];
        }),

      useConsumable: (instanceId) =>
        set((s) => {
          const c = s.character;
          if (!c) return;
          const inv = c.inventory.find((i) => i.instanceId === instanceId);
          if (!inv) return;
          const effect = getConsumableEffect(inv.itemId);
          const item = getItem(inv.itemId);
          if (!effect || !item) {
            toastDraft(s, "This item cannot be used right now.", "warn");
            return;
          }
          const gear = summarizeGear(c);
          const tmods = computeTalentModifiers(c);
          const maxHp = computeMaxHP(c.primary.endurance + gear.stats.endurance + tmods.endurance, c.level) + gear.hpBonus + tmods.maxHp;
          const maxFp = computeMaxForce(c.primary.force + gear.stats.force + tmods.force, c.level) + gear.fpBonus + tmods.maxFp;
          if (effect.full) {
            c.hp = maxHp;
            c.forcePoints = maxFp;
          } else {
            if (effect.hp) c.hp = Math.min(maxHp, c.hp + effect.hp);
            if (effect.fp) c.forcePoints = Math.min(maxFp, c.forcePoints + effect.fp);
          }
          inv.qty -= 1;
          if (inv.qty <= 0) {
            c.inventory = c.inventory.filter((i) => i.instanceId !== instanceId);
          }
          toastDraft(s, `Used ${item.name}`, "success");
        }),

      applyDamage: (amount) =>
        set((s) => {
          if (!s.character) return;
          s.character.hp = Math.max(0, s.character.hp - amount);
        }),

      healCharacter: (hpAmount, fpAmount = 0) =>
        set((s) => {
          if (!s.character) return;
          // Without max stats here, just bump values — clamp happens elsewhere on read
          s.character.hp = s.character.hp + hpAmount;
          s.character.forcePoints = s.character.forcePoints + fpAmount;
        }),

      setVitals: (hp, fp) =>
        set((s) => {
          const c = s.character;
          if (!c) return;
          const gear = summarizeGear(c);
          const m = computeTalentModifiers(c);
          const maxHp = computeMaxHP(c.primary.endurance + gear.stats.endurance + m.endurance, c.level) + gear.hpBonus + m.maxHp;
          const maxFp = computeMaxForce(c.primary.force + gear.stats.force + m.force, c.level) + gear.fpBonus + m.maxFp;
          c.hp = Math.max(0, Math.min(maxHp, Math.round(hp)));
          c.forcePoints = Math.max(0, Math.min(maxFp, Math.round(fp)));
        }),

      meditate: () =>
        set((s) => {
          const c = s.character;
          if (!c || !s.world) return;
          const zoneId = s.world.zoneId;
          if (s.ui.restedZoneId === zoneId) {
            toastDraft(s, "You have already meditated here.", "info");
            return;
          }
          const gear = summarizeGear(c);
          const m = computeTalentModifiers(c);
          const maxHp = computeMaxHP(c.primary.endurance + gear.stats.endurance + m.endurance, c.level) + gear.hpBonus + m.maxHp;
          const maxFp = computeMaxForce(c.primary.force + gear.stats.force + m.force, c.level) + gear.fpBonus + m.maxFp;
          if (c.hp >= maxHp && c.forcePoints >= maxFp) {
            toastDraft(s, "Body and spirit are already whole.", "info");
            return;
          }
          // Restore 35% of max HP and 60% of max Force — Force recovers more
          // readily through meditation than the body's wounds.
          c.hp = Math.min(maxHp, c.hp + Math.round(maxHp * 0.35));
          c.forcePoints = Math.min(maxFp, c.forcePoints + Math.round(maxFp * 0.6));
          s.ui.restedZoneId = zoneId;
          toastDraft(s, "You center yourself in the dark side — wounds knit, the Force returns.", "success");
        }),

      adjustCorruption: (delta) =>
        set((s) => {
          if (!s.character) return;
          s.character.primary.corruption = Math.max(0, Math.min(100, s.character.primary.corruption + delta));
        }),

      adjustFactionRep: (factionId, delta) =>
        set((s) => {
          if (!s.world) return;
          const cur = s.world.factionRep[factionId] ?? 0;
          s.world.factionRep[factionId] = Math.max(-100, Math.min(100, cur + delta));
        }),

      setQuestFlag: (key, value) =>
        set((s) => {
          if (!s.world) return;
          s.world.questFlags[key] = value;
          if (value) {
            runQuestTrackingDraft(s, key);
            recruitCompanionDraft(s, key);
          }
        }),

      toggleCompanionParty: (companionId) =>
        set((s) => {
          if (!s.world) return;
          const comp = s.world.companions.find((c) => c.id === companionId);
          if (!comp) return;
          if (comp.inParty) {
            comp.inParty = false;
            return;
          }
          // Player counts as one party member; cap the rest.
          const inPartyCount = s.world.companions.filter((c) => c.inParty).length;
          if (inPartyCount >= MAX_PARTY_SIZE - 1) {
            toastDraft(s, `Your party is full (max ${MAX_PARTY_SIZE - 1} companions).`, "warn");
            return;
          }
          comp.inParty = true;
        }),

      autoEquipCompanion: (companionId) =>
        set((s) => {
          const c = s.character;
          const comp = s.world?.companions.find((x) => x.id === companionId);
          const def = COMPANIONS.find((d) => d.id === companionId);
          if (!c || !comp || !def) return;
          comp.equipment = comp.equipment ?? {};
          const compLevel = Math.max(def.baseLevel, c.level);
          const power = (item: ReturnType<typeof getItem>): number => {
            if (!item) return -1;
            let p = item.weapon?.damage ?? 0;
            for (const v of Object.values((item.bonuses ?? {}) as Record<string, number | undefined>)) p += v ?? 0;
            return p;
          };
          const returnToInv = (itemId: string) => {
            const it = getItem(itemId);
            const ex = it?.stackable ? c.inventory.find((i) => i.itemId === itemId) : undefined;
            if (ex) ex.qty += 1;
            else c.inventory.push({ instanceId: `${itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, itemId, qty: 1 });
          };
          const playerEquipped = new Set(Object.values(c.equipment).filter(Boolean) as string[]);
          const slots = ["main_hand", "head", "chest", "gloves", "belt", "boots", "implant_a", "implant_b", "relic_a", "relic_b"];
          let changed = 0;
          for (const slot of slots) {
            const candidates = c.inventory.filter((inv) => {
              if (playerEquipped.has(inv.instanceId)) return false;
              const item = getItem(inv.itemId);
              if (!item || item.slot !== slot) return false;
              if (item.classRestriction && item.classRestriction !== def.classId) return false;
              return item.levelReq <= compLevel;
            });
            if (candidates.length === 0) continue;
            const best = candidates.reduce((a, b) => (power(getItem(b.itemId)) > power(getItem(a.itemId)) ? b : a));
            const currentItemId = comp.equipment[slot];
            const currentItem = currentItemId ? getItem(currentItemId) : null;
            if (currentItem && power(getItem(best.itemId)) <= power(currentItem)) continue;
            if (currentItemId) returnToInv(currentItemId);
            best.qty -= 1;
            if (best.qty <= 0) c.inventory = c.inventory.filter((i) => i.instanceId !== best.instanceId);
            comp.equipment[slot] = best.itemId;
            changed++;
          }
          toastDraft(s, changed > 0 ? `Equipped ${changed} slot${changed > 1 ? "s" : ""} on ${def.name}.` : `${def.name} has no better gear available.`, changed > 0 ? "success" : "info");
        }),

      setCompanionTactic: (companionId, tactic) =>
        set((s) => {
          const comp = s.world?.companions.find((x) => x.id === companionId);
          if (comp) comp.tactic = tactic;
        }),

      bondPartyAfterVictory: () =>
        set((s) => {
          if (!s.world) return;
          for (const c of s.world.companions) {
            if (c.inParty && c.affinity < 50) c.affinity = Math.min(50, c.affinity + 1);
          }
        }),

      unequipCompanionItem: (companionId, slot) =>
        set((s) => {
          const c = s.character;
          const comp = s.world?.companions.find((x) => x.id === companionId);
          if (!c || !comp?.equipment) return;
          const itemId = comp.equipment[slot];
          if (!itemId) return;
          const item = getItem(itemId);
          const ex = item?.stackable ? c.inventory.find((i) => i.itemId === itemId) : undefined;
          if (ex) ex.qty += 1;
          else c.inventory.push({ instanceId: `${itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, itemId, qty: 1 });
          delete comp.equipment[slot];
        }),

      startQuest: (questId) =>
        set((s) => {
          if (!s.world) return;
          if (!s.world.activeQuests.includes(questId) && !s.world.completedQuests.includes(questId)) {
            s.world.activeQuests.push(questId);
          }
        }),

      completeQuest: (questId) =>
        set((s) => {
          if (!s.world) return;
          const quest = QUEST_BY_ID.get(questId);
          if (quest) {
            completeQuestDraft(s, quest);
          } else {
            // Unknown quest id — still record it so flags stay consistent.
            s.world.activeQuests = s.world.activeQuests.filter((q) => q !== questId);
            if (!s.world.completedQuests.includes(questId)) {
              s.world.completedQuests.push(questId);
            }
          }
        }),

      closePanel: () =>
        set((s) => {
          s.ui.activePanel = null;
          s.ui.activeShopId = null;
        }),

      showToast: (text, tone = "info") =>
        set((s) => {
          s.ui.toast = { id: ++toastCounter, text, tone };
        }),

      clearLevelUpFlash: () =>
        set((s) => {
          s.ui.levelUpFlash = null;
        }),

      openShop: (shopId) =>
        set((s) => {
          if (!getShop(shopId)) return;
          s.ui.activeShopId = shopId;
          s.ui.activePanel = "shop";
        }),

      buyItem: (shopId, itemId) =>
        set((s) => {
          const c = s.character;
          if (!c) return;
          const shop = getShop(shopId);
          const item = getItem(itemId);
          if (!shop || !item) return;
          const rep = shop.factionId ? (s.world?.factionRep[shop.factionId] ?? 0) : 0;
          const price = buyPrice(item, shop, rep);
          if (c.credits < price) {
            toastDraft(s, "Not enough credits.", "warn");
            return;
          }
          c.credits -= price;
          const existing = c.inventory.find((i) => i.itemId === itemId);
          if (existing && item.stackable) {
            existing.qty += 1;
          } else {
            c.inventory.push({
              instanceId: `${itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
              itemId,
              qty: 1,
            });
          }
          toastDraft(s, `Bought ${item.name} (−${price} cr)`, "success");
        }),

      sellItem: (instanceId) =>
        set((s) => {
          const c = s.character;
          if (!c) return;
          const shopId = s.ui.activeShopId;
          const shop = shopId ? getShop(shopId) : undefined;
          if (!shop) return;
          const inv = c.inventory.find((i) => i.instanceId === instanceId);
          if (!inv) return;
          const equippedIds = new Set(Object.values(c.equipment).filter(Boolean) as string[]);
          if (equippedIds.has(instanceId)) {
            toastDraft(s, "Unequip it before selling.", "warn");
            return;
          }
          const item = getItem(inv.itemId);
          if (!item) return;
          const rep = shop.factionId ? (s.world?.factionRep[shop.factionId] ?? 0) : 0;
          const price = sellPrice(item, shop, rep);
          c.credits += price;
          inv.qty -= 1;
          if (inv.qty <= 0) {
            c.inventory = c.inventory.filter((i) => i.instanceId !== instanceId);
          }
          toastDraft(s, `Sold ${item.name} (+${price} cr)`, "success");
        }),

      buildSnapshot: () => {
        const { character, world, meta } = get();
        if (!character || !world || !meta || !meta.saveId) return null;
        const save: GameSave = {
          meta: {
            id: meta.saveId,
            slotIndex: meta.slotIndex,
            name: `${meta.characterName} — Lv ${character.level}`,
            characterName: meta.characterName,
            classId: character.classId,
            level: character.level,
            zoneId: world.zoneId,
            playtimeSeconds: meta.playtimeSeconds,
            createdAt: meta.createdAt,
            updatedAt: Date.now(),
            ironman: meta.ironman,
          },
          character,
          world,
          rngSeed: meta.rngSeed,
        };
        return save;
      },

      saveCurrent: async () => {
        const snapshot = get().buildSnapshot();
        if (!snapshot) return;
        await writeSave(snapshot);
      },
    })),
    { name: "swrott-game" },
  ),
);
