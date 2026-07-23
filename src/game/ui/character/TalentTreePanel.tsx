"use client";

/**
 * Talent Tree panel — the heart of build identity.
 *
 * Three trees per class, five tiers deep. Spending a point unlocks a node
 * (granting stat bonuses, a combat skill, or an extra loadout slot). Nodes
 * are gated by prerequisites and character level. Skills unlocked here are
 * what the player can slot into the combat bar (see Combat Loadout).
 */

import { useState } from "react";
import { clsx } from "clsx";
import { useGameStore } from "@/game/store/game-store";
import { useAudio } from "@/game/audio/use-audio";
import {
  getClassTrees,
  getTreeTalents,
  talentLockReason,
} from "@/game/data/talents/talent-registry";
import { TIER_LEVEL_REQ } from "@/game/data/talents/talent-types";
import type { TalentNode, TalentBonuses } from "@/game/data/talents/talent-types";

const TIERS = [1, 2, 3, 4, 5] as const;

const BONUS_LABELS: Record<keyof TalentBonuses, string> = {
  strength: "STR", agility: "AGI", endurance: "END", force: "FRC", influence: "INF",
  armor: "Armor", critChance: "Crit%", critDamage: "CritDmg%", maxHp: "HP", maxFp: "FP",
  damagePercent: "Dmg%", armorPercent: "ArmorEff%", dodgeChance: "Dodge%",
  armorPiercePct: "Pierce%", lifestealPct: "Lifesteal%",
};

function bonusSummary(b: TalentBonuses): string {
  const parts: string[] = [];
  (Object.keys(b) as (keyof TalentBonuses)[]).forEach((k) => {
    const v = b[k];
    if (v) parts.push(`+${v} ${BONUS_LABELS[k]}`);
  });
  return parts.join(" · ");
}

export function TalentTreePanel() {
  const character = useGameStore((s) => s.character);
  const unlockTalent = useGameStore((s) => s.unlockTalent);
  const audio = useAudio();
  const trees = character ? getClassTrees(character.classId) : [];
  const [activeTree, setActiveTree] = useState(trees[0]?.id ?? "");

  if (!character) return null;
  const unlocked = new Set(character.talents);

  return (
    <div className="flex flex-col gap-3">
      {/* Header: points + tree selector */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-ash-300">
          <span className="text-gilt-400 font-display">{character.talentPoints}</span> talent point
          {character.talentPoints !== 1 ? "s" : ""} available
        </div>
        <div className="text-[10px] uppercase tracking-widest text-ash-500">
          {character.talents.length} learned
        </div>
      </div>

      <div className="flex gap-1">
        {trees.map((tree) => (
          <button
            key={tree.id}
            onClick={() => { setActiveTree(tree.id); audio.hover(); }}
            className={clsx(
              "flex-1 px-2 py-1.5 rounded-sm border text-[11px] font-display uppercase tracking-wider transition",
              activeTree === tree.id
                ? "border-gilt-500/60 bg-gilt-900/30 text-gilt-300"
                : "border-ash-700/30 text-ash-400 hover:text-ash-200 hover:border-ash-500/40",
            )}
            title={tree.description}
          >
            {tree.name}
          </button>
        ))}
      </div>

      {/* Active tree — tiers top to bottom */}
      <div className="flex flex-col gap-2">
        {TIERS.map((tier) => {
          const nodes = getTreeTalents(character.classId, activeTree).filter((n) => n.tier === tier);
          if (nodes.length === 0) return null;
          const levelReq = TIER_LEVEL_REQ[tier];
          const tierLocked = character.level < levelReq;
          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-ash-600 font-display">
                  Tier {tier}
                </span>
                {tierLocked && (
                  <span className="text-[9px] text-blood-400/80">requires Lv {levelReq}</span>
                )}
                <div className="flex-1 h-px bg-ash-800/50" />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {nodes.map((node) => (
                  <TalentNodeButton
                    key={node.id}
                    node={node}
                    owned={unlocked.has(node.id)}
                    reason={talentLockReason(node.id, unlocked, character.talentPoints, character.level)}
                    onUnlock={() => { unlockTalent(node.id); audio.hitLight?.(); }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TalentNodeButton({
  node, owned, reason, onUnlock,
}: {
  node: TalentNode;
  owned: boolean;
  reason: string | null;
  onUnlock: () => void;
}) {
  const canUnlock = !owned && reason === null;
  const summary = bonusSummary(node.bonuses);
  const tip = [
    node.description,
    summary && `Bonuses: ${summary}`,
    node.passive && `Passive: ${node.passive}`,
    !owned && reason ? `🔒 ${reason}` : null,
  ].filter(Boolean).join("\n");

  return (
    <button
      type="button"
      disabled={!canUnlock}
      onClick={onUnlock}
      title={tip}
      className={clsx(
        "flex flex-col items-start gap-0.5 p-2 rounded-sm border text-left transition min-h-[58px]",
        owned
          ? "border-gilt-500/60 bg-gilt-900/25 shadow-[0_0_8px_rgba(217,168,90,0.15)]"
          : canUnlock
            ? "border-force-500/50 bg-force-950/30 hover:bg-force-900/40 hover:border-force-400/70 cursor-pointer"
            : "border-ash-800/40 bg-void-950/50 opacity-55 cursor-not-allowed",
      )}
    >
      <div className="flex items-center gap-1 w-full">
        <span className={clsx(
          "text-[10px] font-display uppercase tracking-wide leading-tight flex-1",
          owned ? "text-gilt-300" : canUnlock ? "text-force-200" : "text-ash-400",
        )}>
          {node.name}
        </span>
        {owned && <span className="text-gilt-400 text-[10px]">✓</span>}
        {!owned && canUnlock && <span className="text-force-300 text-[10px]">＋</span>}
      </div>
      {node.unlocksSkill && (
        <span className="text-[8px] uppercase tracking-wider text-blood-300/90">◈ unlocks skill</span>
      )}
      {node.grantsLoadoutSlot && (
        <span className="text-[8px] uppercase tracking-wider text-force-300/90">＋ combat slot</span>
      )}
      {summary && (
        <span className="text-[8px] text-ash-500 leading-tight line-clamp-1">{summary}</span>
      )}
    </button>
  );
}
