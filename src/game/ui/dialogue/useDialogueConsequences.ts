"use client";

import { useEffect, useRef } from "react";
import { useDialogueStore } from "@/game/engine/dialogue/dialogue-store";
import { useGameStore } from "@/game/store/game-store";
import { useCombatStore } from "@/game/engine/combat/combat-store";
import { getEnemyTemplate } from "@/game/engine/combat/enemy-registry";
import { getWeatherForZone } from "@/game/engine/combat/weather";
import { buildCombatPlayer } from "@/game/engine/combat/player-loadout";
import { buildPartyCombatants } from "@/game/engine/combat/companion-combat";
import { QUEST_BY_ID } from "@/game/data/quests/quest-registry";

/**
 * Applies dialogue consequences to the live game state.
 *
 * The dialogue store collects `pendingConsequences` as the player advances a
 * conversation; this hook drains the queue and routes each consequence to the
 * right store action (flags, XP, credits, items, faction rep, quests,
 * corruption, companion affinity, and dialogue-triggered combat).
 *
 * Mount once in the play page — without this, dialogue choices have no effect.
 */

/** Encounters that can be triggered from a dialogue `start_combat` consequence.
 * `victoryFlags` are set only if the player WINS the fight — quest objectives
 * like "Survive the Trial of Blood" must not complete on a loss or flee. */
export const DIALOGUE_ENCOUNTERS: Record<string, { enemies: string[]; victoryFlags?: string[] }> = {
  trial_of_blood: { enemies: ["sith_acolyte", "sith_acolyte"], victoryFlags: ["main_trial_blood"] },
  trial_of_blood_single: { enemies: ["sith_acolyte"], victoryFlags: ["main_trial_blood"] },
  duel_voren: { enemies: ["darth_voren"] },
  overseer_retribution: { enemies: ["mine_overseer", "sith_acolyte"] },
  thane_last_stand: { enemies: ["thane_deserter"] },
  daryth_grudge: { enemies: ["daryth_rival"] },
  smuggler_ambush: { enemies: ["smuggler_raider", "smuggler_raider"] },
  // Dromund Kaas — Web of the Council retaliation (whichever lord you spurn)
  council_retaliation_seris: { enemies: ["kaas_shadow_assassin", "imperial_guard"], victoryFlags: ["council_retaliation_survived"] },
  council_retaliation_mortis: { enemies: ["mortis_assassin", "mortis_assassin"], victoryFlags: ["council_retaliation_survived"] },
  // Were referenced by dialogue but never defined — start_combat fired nothing.
  enc_hidden_jedi: { enemies: ["sith_marauder_elite"] },
  enc_neth_guards: { enemies: ["exchange_enforcer", "exchange_enforcer"] },
  republic_guard: { enemies: ["mercenary", "mercenary"] },
  republic_guard_squad: { enemies: ["mercenary", "mercenary", "bounty_hunter"] },
  serana_boss: { enemies: ["sith_marauder_elite", "shadow_assassin"] },
};

export function useDialogueConsequences() {
  const pendingCount = useDialogueStore((s) => s.pendingConsequences.length);
  const combatPhase = useCombatStore((s) => s.phase);
  /** Flags to set if (and only if) the dialogue-triggered fight is won. */
  const pendingVictoryFlags = useRef<string[] | null>(null);

  useEffect(() => {
    if (combatPhase === "victory" && pendingVictoryFlags.current) {
      const gs = useGameStore.getState();
      for (const flag of pendingVictoryFlags.current) gs.setQuestFlag(flag, true);
      gs.showToast("Objective complete!", "success");
      pendingVictoryFlags.current = null;
    }
    if ((combatPhase === "defeat" || combatPhase === "fled") && pendingVictoryFlags.current) {
      pendingVictoryFlags.current = null;
    }
  }, [combatPhase]);

  useEffect(() => {
    if (pendingCount === 0) return;
    const consequences = useDialogueStore.getState().consumeConsequences();
    const gs = useGameStore.getState();

    // One-time rewards: re-opening a conversation re-walks its tree, so reward
    // consequences would fire again every visit. Each is tagged with a
    // `sourceId` (conversation:option); once granted we set a guard flag and
    // skip it forever after. Idempotent consequences (set_flag, start/complete
    // quest, open_shop, start_combat) are NOT gated — they're safe to re-apply.
    const ONE_TIME = new Set([
      "add_xp", "add_credits", "add_item", "remove_item",
      "faction_rep", "corruption_change", "companion_affinity",
    ]);
    const flags = gs.world?.questFlags ?? {};
    const guardKey = (sourceId: string) => `__dlg_reward_${sourceId}`;
    // Source ids already granted in a previous visit (skip their one-time rewards).
    const alreadyGranted = new Set<string>();
    // Source ids granting a one-time reward THIS drain (flag them after the loop,
    // so multiple rewards from the same option all apply on the first visit).
    const grantedNow = new Set<string>();
    for (const c of consequences) {
      if (ONE_TIME.has(c.type) && c.sourceId && flags[guardKey(c.sourceId)]) {
        alreadyGranted.add(c.sourceId);
      }
    }

    for (const c of consequences) {
      if (ONE_TIME.has(c.type) && c.sourceId) {
        if (alreadyGranted.has(c.sourceId)) continue; // already farmed — skip
        grantedNow.add(c.sourceId);
      }
      switch (c.type) {
        case "set_flag":
          if (c.key) gs.setQuestFlag(c.key, (c.value as boolean | number | string) ?? true);
          break;
        case "add_xp": {
          const amount = Number(c.value ?? 0);
          gs.addXp(amount);
          if (amount > 0) gs.showToast(`+${amount} XP`, "success");
          break;
        }
        case "add_credits": {
          const amount = Number(c.value ?? 0);
          gs.addCredits(amount);
          gs.showToast(amount >= 0 ? `+${amount} credits` : `${amount} credits`, amount >= 0 ? "success" : "info");
          break;
        }
        case "add_item":
          if (c.itemId) gs.addItems([{ itemId: c.itemId, qty: Number(c.value ?? 1) }]);
          break;
        case "remove_item":
          if (c.itemId) gs.removeItems([{ itemId: c.itemId, qty: Number(c.value ?? 1) }]);
          break;
        case "faction_rep":
          if (c.factionId) gs.adjustFactionRep(c.factionId, Number(c.value ?? 0));
          break;
        case "corruption_change": {
          const delta = Number(c.value ?? 0);
          gs.adjustCorruption(delta);
          if (delta > 0) gs.showToast(`The dark side grows within you (+${delta} corruption)`, "warning");
          break;
        }
        case "start_quest":
          if (c.questId) {
            gs.startQuest(c.questId);
            const quest = QUEST_BY_ID.get(c.questId);
            gs.showToast(`New quest: ${quest?.name ?? c.questId}`, "success");
          }
          break;
        case "complete_quest":
          // completeQuest grants the quest's rewards (XP/credits/items/rep)
          // and shows its own toast — no extra handling here.
          if (c.questId) gs.completeQuest(c.questId);
          break;
        case "open_shop": {
          if (c.shopId) {
            // Close the conversation, then open the merchant's wares.
            useDialogueStore.getState().endConversation();
            gs.openShop(c.shopId);
          }
          break;
        }
        case "companion_affinity": {
          const world = useGameStore.getState().world;
          if (world && c.companionId) {
            const updated = world.companions.map((comp) =>
              comp.id === c.companionId
                ? { ...comp, affinity: comp.affinity + Number(c.value ?? 0) }
                : comp,
            );
            gs.setWorldField("companions", updated);
          }
          break;
        }
        case "start_combat": {
          const character = useGameStore.getState().character;
          const encounter = c.combatEncounterId
            ? DIALOGUE_ENCOUNTERS[c.combatEncounterId]
            : undefined;
          if (!character || !encounter) break;
          const templates = encounter.enemies
            .map((id) => getEnemyTemplate(id))
            .filter((t): t is NonNullable<typeof t> => Boolean(t));
          if (templates.length === 0) break;
          // Close the dialogue before steel is drawn.
          useDialogueStore.getState().endConversation();
          gs.closePanel();
          gs.showToast("Combat!", "warning");
          pendingVictoryFlags.current = encounter.victoryFlags ?? null;
          useCombatStore.getState().startCombat(
            buildCombatPlayer(character),
            templates,
            `dlg_${c.combatEncounterId}_${Date.now()}`,
            getWeatherForZone(gs.world?.zoneId ?? ""),
            buildPartyCombatants(gs.world?.companions ?? [], character.level),
          );
          break;
        }
      }
    }

    // Seal the one-time rewards granted this visit so they can't be farmed again.
    for (const sourceId of grantedNow) {
      gs.setQuestFlag(guardKey(sourceId), true);
    }
  }, [pendingCount]);
}
