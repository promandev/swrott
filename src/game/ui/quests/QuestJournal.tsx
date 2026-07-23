"use client";

import { useGameStore } from "@/game/store/game-store";
import { QUEST_BY_ID } from "@/game/data/quests/quest-registry";
import { getItem } from "@/game/data/items/item-registry";
import { useAudio } from "@/game/audio/use-audio";
import { clsx } from "clsx";
import { useState, useMemo } from "react";
import type { QuestReward } from "@/game/engine/quests/quest-types";

/** Human-readable item name, falling back to a de-slugged id. */
function itemName(itemId: string): string {
  return getItem(itemId)?.name ?? itemId.replace(/_/g, " ");
}

/** Compact reward line used for both the default and dark-path variants. */
function RewardLine({ rewards }: { rewards: QuestReward }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ash-300">
      {rewards.xp ? <span>+{rewards.xp} XP</span> : null}
      {rewards.credits ? <span>+{rewards.credits} credits</span> : null}
      {rewards.corruption ? (
        <span className="text-purple-400">+{rewards.corruption} corruption</span>
      ) : null}
      {rewards.items?.map((ri) => (
        <span key={ri.itemId} className="text-gilt-400">
          {itemName(ri.itemId)}{ri.qty > 1 ? ` ×${ri.qty}` : ""}
        </span>
      ))}
      {rewards.factionRep?.map((fr) => (
        <span key={fr.factionId} className={fr.amount >= 0 ? "text-blue-400" : "text-blood-400"}>
          {fr.amount >= 0 ? "+" : ""}{fr.amount} {fr.factionId.replace(/_/g, " ")}
        </span>
      ))}
    </div>
  );
}

export function QuestJournal() {
  const world = useGameStore((s) => s.world);
  const corruption = useGameStore((s) => s.character?.primary.corruption ?? 0);
  const playerLevel = useGameStore((s) => s.character?.level ?? 1);
  const audio = useAudio();
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [tab, setTab] = useState<"active" | "completed">("active");

  const activeQuests = useMemo(() => {
    if (!world) return [];
    return world.activeQuests
      .map((id) => QUEST_BY_ID.get(id))
      .filter(Boolean);
  }, [world]);

  const completedQuests = useMemo(() => {
    if (!world) return [];
    return world.completedQuests
      .map((id) => QUEST_BY_ID.get(id))
      .filter(Boolean);
  }, [world]);

  const displayedQuests = tab === "active" ? activeQuests : completedQuests;
  // Fall back to the first quest in the current tab so the detail pane is never
  // blank, and so switching tabs doesn't strand a selection from the other tab.
  const effectiveSelectedId =
    selectedQuestId && displayedQuests.some((q) => q?.id === selectedQuestId)
      ? selectedQuestId
      : displayedQuests[0]?.id ?? null;
  const selectedQuest = effectiveSelectedId ? QUEST_BY_ID.get(effectiveSelectedId) : null;

  if (!world) return null;

  /** Required-objective progress for the compact list badge. */
  const questProgress = (quest: NonNullable<ReturnType<typeof QUEST_BY_ID.get>>) => {
    const required = quest.objectives.filter((o) => !o.optional);
    const done = required.filter((o) => !!world.questFlags[o.flagKey]).length;
    return { done, total: required.length };
  };

  return (
    <div className="flex gap-4 h-full max-h-[70vh]">
      {/* Quest list */}
      <div className="w-48 flex flex-col shrink-0">
        {/* Tabs */}
        <div className="flex gap-1 mb-3">
          {(["active", "completed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); audio.click(); }}
              className={clsx(
                "text-[10px] uppercase tracking-widest px-2 py-1 rounded transition",
                tab === t
                  ? "bg-blood-800/40 text-gilt-400 border border-gilt-700/30"
                  : "text-ash-400 hover:text-ash-200",
              )}
            >
              {t} ({t === "active" ? activeQuests.length : completedQuests.length})
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-1">
          {displayedQuests.map((quest) => {
            if (!quest) return null;
            const { done, total } = questProgress(quest);
            const complete = tab === "completed" || (total > 0 && done >= total);
            return (
              <button
                key={quest.id}
                onClick={() => { setSelectedQuestId(quest.id); audio.click(); }}
                onMouseEnter={() => audio.hover()}
                className={clsx(
                  "text-left px-2 py-1.5 rounded text-xs transition flex items-start justify-between gap-1.5",
                  "hover:bg-blood-900/20",
                  effectiveSelectedId === quest.id && "bg-blood-900/30 border border-gilt-700/30",
                  quest.category === "main" && "text-gilt-400",
                  quest.category === "secondary" && "text-ash-200",
                  quest.category === "companion" && "text-force-300",
                )}
              >
                <span className="min-w-0">
                  {quest.category === "main" && "★ "}
                  {quest.category === "companion" && "♥ "}
                  {quest.name}
                </span>
                {/* Progress badge — at-a-glance objective completion */}
                {tab === "active" && total > 0 && (
                  <span className={clsx(
                    "shrink-0 tabular-nums text-[9px] px-1 rounded-sm border leading-tight mt-px",
                    complete
                      ? "text-green-400 border-green-700/40"
                      : "text-ash-400 border-ash-700/40",
                  )}>
                    {complete ? "✓" : `${done}/${total}`}
                  </span>
                )}
              </button>
            );
          })}
          {displayedQuests.length === 0 && (
            <div className="text-center text-ash-500 text-xs py-8">
              No {tab} quests
            </div>
          )}
        </div>
      </div>

      {/* Quest details */}
      <div className="flex-1 min-w-0">
        {selectedQuest ? (
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="heading-display text-base mb-1">{selectedQuest.name}</h3>
              <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-widest text-ash-400">
                <span className={clsx(
                  selectedQuest.category === "main" && "text-gilt-400",
                  selectedQuest.category === "companion" && "text-force-300",
                )}>
                  {selectedQuest.category === "companion" ? "♥ companion" : selectedQuest.category}
                </span>
                <span className={playerLevel < selectedQuest.recommendedLevel ? "text-blood-400" : ""}>
                  Lv {selectedQuest.recommendedLevel}
                </span>
                <span>{selectedQuest.zoneId.replace(/_/g, " ")}</span>
              </div>
            </div>

            <p className="text-xs text-ash-300 leading-relaxed">
              {selectedQuest.description}
            </p>

            {/* Objectives */}
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-gilt-500 mb-2">
                Objectives
                {(() => {
                  const required = selectedQuest.objectives.filter((o) => !o.optional);
                  const done = required.filter((o) => !!world.questFlags[o.flagKey]).length;
                  return required.length > 0 ? (
                    <span className="text-ash-500 ml-2 normal-case tracking-normal">{done}/{required.length}</span>
                  ) : null;
                })()}
              </h4>
              <div className="flex flex-col gap-1">
                {selectedQuest.objectives.map((obj) => {
                  const done = !!world.questFlags[obj.flagKey];
                  return (
                    <div
                      key={obj.id}
                      className={clsx(
                        "flex items-start gap-2 text-xs",
                        done ? "text-ash-500 line-through" : "text-ash-200",
                      )}
                    >
                      <span className={done ? "text-green-500" : "text-ash-500"}>
                        {done ? "✓" : "○"}
                      </span>
                      <span>
                        {obj.description}
                        {obj.optional && (
                          <span className="text-ash-500 ml-1">(Optional)</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rewards */}
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-gilt-500 mb-1">
                Rewards
              </h4>
              {selectedQuest.darkRewards ? (
                <div className="flex flex-col gap-2">
                  <div className={clsx(
                    "rounded-sm border px-2 py-1.5",
                    corruption < 50 ? "border-gilt-700/40 bg-gilt-900/10" : "border-ash-800/40",
                  )}>
                    <div className="text-[9px] uppercase tracking-widest text-ash-500 mb-1">
                      Restraint {corruption < 50 && <span className="text-gilt-400">· you</span>}
                    </div>
                    <RewardLine rewards={selectedQuest.rewards} />
                  </div>
                  <div className={clsx(
                    "rounded-sm border px-2 py-1.5",
                    corruption >= 50 ? "border-blood-600/50 bg-blood-950/20" : "border-ash-800/40",
                  )}>
                    <div className="text-[9px] uppercase tracking-widest text-ash-500 mb-1">
                      Dark Path {corruption >= 50 && <span className="text-blood-400">· you</span>}
                    </div>
                    <RewardLine rewards={selectedQuest.darkRewards} />
                  </div>
                  <p className="text-[9px] text-ash-600 italic">
                    The dark path reward is granted while your corruption is 50 or higher.
                  </p>
                </div>
              ) : (
                <RewardLine rewards={selectedQuest.rewards} />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-ash-500 text-xs">
            Select a quest to view details
          </div>
        )}
      </div>
    </div>
  );
}
