"use client";

import { useState } from "react";
import { useGameStore } from "@/game/store/game-store";
import { deriveStats } from "@/game/engine/progression/stats";
import { xpProgress, xpToNextLevel, MAX_LEVEL } from "@/game/engine/progression/leveling";
import { useAudio } from "@/game/audio/use-audio";
import { clsx } from "clsx";
import { getClassImage } from "@/game/utils/character-images";
import { TalentTreePanel } from "./TalentTreePanel";
import { FavoriteSkillsPanel } from "./FavoriteSkillsPanel";
import { FACTIONS } from "@/game/engine/factions/factions";
import { tierFromReputation, type ReputationTier } from "@/game/engine/factions/reputation";
import { COMPANIONS, MAX_PARTY_SIZE } from "@/game/engine/companions/companions";
import { getSithRank, rankColor } from "@/game/engine/progression/rank";
import { getItem } from "@/game/data/items/item-registry";
import { BETRAYAL_THRESHOLD, ROMANCE_UNLOCK_THRESHOLD } from "@/game/engine/companions/affinity";

type Tab = "stats" | "talents" | "loadout" | "factions" | "companions";

const TIER_COLOR: Record<ReputationTier, string> = {
  hated: "text-blood-400",
  hostile: "text-orange-400",
  neutral: "text-ash-300",
  friendly: "text-green-400",
  allied: "text-sky-300",
  exalted: "text-gilt-300",
};

const STAT_LABELS: Array<{ key: string; label: string; color: string }> = [
  { key: "strength", label: "STR", color: "text-blood-400" },
  { key: "agility", label: "AGI", color: "text-gilt-400" },
  { key: "endurance", label: "END", color: "text-green-400" },
  { key: "force", label: "FRC", color: "text-force-400" },
  { key: "influence", label: "INF", color: "text-blue-400" },
  { key: "corruption", label: "COR", color: "text-purple-400" },
];

export function CharacterSheet() {
  const character = useGameStore((s) => s.character);
  const audio = useAudio();
  const [tab, setTab] = useState<Tab>("stats");

  if (!character) return null;

  const derived = deriveStats(character.primary, character.level, {});
  const xpProg = xpProgress(character.level, character.xp);
  const xpNeeded = xpToNextLevel(character.level, character.xp);
  const isMaxLevel = character.level >= MAX_LEVEL;

  const tabs: Array<{ id: Tab; label: string; badge?: number }> = [
    { id: "stats", label: "Stats" },
    { id: "talents", label: "Talents", badge: character.talentPoints || undefined },
    { id: "loadout", label: "Loadout" },
    { id: "factions", label: "Factions" },
    { id: "companions", label: "Allies" },
  ];

  return (
    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
      {/* Tab bar */}
      <div className="flex gap-1 sticky top-0 z-10 bg-void-950/95 pb-1 -mt-1 pt-1">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => { setTab(tb.id); audio.hover(); }}
            className={clsx(
              "flex-1 px-2 py-1.5 rounded-sm border text-[11px] font-display uppercase tracking-wider transition flex items-center justify-center gap-1.5",
              tab === tb.id
                ? "border-gilt-500/60 bg-gilt-900/30 text-gilt-300"
                : "border-ash-700/30 text-ash-400 hover:text-ash-200 hover:border-ash-500/40",
            )}
          >
            {tb.label}
            {tb.badge != null && (
              <span className="px-1.5 rounded-full bg-gilt-500 text-void-950 text-[9px] font-bold">{tb.badge}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "talents" && <TalentTreePanel />}
      {tab === "loadout" && <FavoriteSkillsPanel />}
      {tab === "factions" && <FactionReputationView />}
      {tab === "companions" && <CompanionRoster />}
      {tab !== "stats" ? null : (
      <>
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 panel overflow-hidden shadow-sith-glow relative bg-void-950">
          <img
            src={getClassImage(character.classId)}
            alt={character.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        </div>
        <div>
          <h2 className="heading-display text-lg">{character.name}</h2>
          {(() => {
            const r = getSithRank(character.classId, character.level, character.primary.corruption);
            return (
              <p className="text-xs uppercase tracking-widest">
                <span className={rankColor(r.tier)}>{r.title}</span>
                <span className="text-ash-500"> · {character.classId} · Lv {character.level}</span>
              </p>
            );
          })()}
        </div>
      </div>

      {/* XP Bar */}
      <div>
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-ash-400 mb-1">
          <span>Experience</span>
          <span>
            {isMaxLevel ? "MAX LEVEL" : `${character.xp} / ${character.xp + xpNeeded} (${Math.round(xpProg * 100)}%)`}
          </span>
        </div>
        <div className="h-2 bg-void-900 border border-ash-600/20 rounded-sm overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gilt-600 to-gilt-400 transition-all duration-500"
            style={{ width: `${xpProg * 100}%` }}
          />
        </div>
      </div>

      {/* Primary Stats */}
      <div>
        <h3 className="heading-display text-xs mb-2">Primary Attributes</h3>
        <div className="grid grid-cols-3 gap-2">
          {STAT_LABELS.map(({ key, label, color }) => {
            const val = character.primary[key as keyof typeof character.primary];
            return (
              <div
                key={key}
                className="panel p-2 flex items-center justify-between"
                onMouseEnter={() => audio.hover()}
              >
                <span className={clsx("font-display text-xs", color)}>{label}</span>
                <span className="text-ash-100 font-display text-sm">{val}</span>
              </div>
            );
          })}
        </div>
        {character.attributePoints > 0 && (
          <div className="mt-2 text-xs text-gilt-400">
            {character.attributePoints} unspent attribute point{character.attributePoints > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Derived Stats */}
      <div>
        <h3 className="heading-display text-xs mb-2">Derived Stats</h3>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <StatRow label="Max HP" value={derived.hp} />
          <StatRow label="Max Force" value={derived.forcePoints} />
          <StatRow label="Armor" value={`${Math.round(derived.armorReduction * 100)}% reduction`} />
          <StatRow label="Crit Chance" value={`${Math.round(derived.critChance * 100)}%`} />
          <StatRow label="Accuracy" value={`${Math.round(derived.accuracy * 100)}%`} />
        </div>
      </div>

      {/* Dark Side standing — corruption as a Sith axis, with the next milestone */}
      <DarkSideStanding corruption={character.primary.corruption} />

      {/* Talents / Loadout quick access */}
      <div className="flex items-center justify-between panel px-3 py-2">
        <div className="text-xs text-ash-300">
          {character.talents.length} talent{character.talents.length !== 1 ? "s" : ""} learned
          {character.talentPoints > 0 && (
            <span className="text-gilt-400 ml-2">
              ({character.talentPoints} point{character.talentPoints > 1 ? "s" : ""} to spend)
            </span>
          )}
        </div>
        <button
          onClick={() => { setTab("talents"); audio.hover(); }}
          className="text-[10px] uppercase tracking-widest text-force-300 hover:text-force-200 border border-force-700/40 hover:border-force-500/60 rounded-sm px-2 py-1 transition"
        >
          Open tree →
        </button>
      </div>
      </>
      )}
    </div>
  );
}

/** Corruption as the Sith's dark-side axis, with the next earned milestone. */
function DarkSideStanding({ corruption }: { corruption: number }) {
  const MILESTONES: Array<{ at: number; label: string }> = [
    { at: 35, label: "Ruthless (epithet earned)" },
    { at: 50, label: "Dark-path quest rewards unlock" },
    { at: 60, label: "Cruel (epithet)" },
    { at: 85, label: "Merciless (epithet)" },
  ];
  const tier =
    corruption >= 85 ? { text: "Consumed", cls: "text-blood-300" }
    : corruption >= 50 ? { text: "Fallen", cls: "text-blood-400" }
    : corruption >= 25 ? { text: "Tempted", cls: "text-purple-400" }
    : { text: "Tethered", cls: "text-ash-300" };
  const next = MILESTONES.find((m) => corruption < m.at);
  return (
    <div>
      <h3 className="heading-display text-xs mb-2">Dark Side</h3>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className={clsx("uppercase tracking-widest font-display", tier.cls)}>{tier.text}</span>
        <span className="text-ash-400 tabular-nums">{corruption}/100 corruption</span>
      </div>
      <div className="relative h-2 rounded-sm bg-void-900 border border-ash-700/40 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-700 via-blood-600 to-blood-400"
          style={{ width: `${Math.max(0, Math.min(100, corruption))}%` }}
        />
      </div>
      {next && (
        <p className="text-[9px] text-ash-500 mt-1">Next: {next.label} at {next.at}.</p>
      )}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-1 px-2 text-ash-300">
      <span className="text-ash-500">{label}</span>
      <span className="text-ash-200">{value}</span>
    </div>
  );
}

// ─── Faction reputation ───────────────────────────────────────────────

function FactionReputationView() {
  const factionRep = useGameStore((s) => s.world?.factionRep);
  const entries = factionRep ? Object.entries(factionRep) : [];

  if (entries.length === 0) {
    return <p className="text-ash-500 italic text-sm py-2">No faction standing earned yet.</p>;
  }

  return (
    <div className="space-y-3 py-1">
      {entries.map(([id, rep]) => {
        const def = FACTIONS.find((f) => f.id === id);
        const name = def?.name ?? id.replace(/_/g, " ");
        const tier = tierFromReputation(rep);
        return (
          <div key={id}>
            <div className="flex justify-between items-baseline text-[11px] mb-0.5">
              <span className="text-ash-200 capitalize font-display tracking-wide">{name}</span>
              <span className={clsx("uppercase tracking-widest text-[10px]", TIER_COLOR[tier])}>
                {tier} ({rep > 0 ? "+" : ""}{rep})
              </span>
            </div>
            {/* Center-origin bar: green right of neutral, red left of it. */}
            <div className="relative h-2 rounded-sm bg-void-900 border border-ash-700/40 overflow-hidden">
              <div className="absolute inset-y-0 left-1/2 w-px bg-ash-600/60" />
              {rep >= 0 ? (
                <div className="absolute top-0 bottom-0 bg-green-600/70" style={{ left: "50%", width: `${rep / 2}%` }} />
              ) : (
                <div className="absolute top-0 bottom-0 bg-blood-700/70" style={{ right: "50%", width: `${-rep / 2}%` }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Companion roster ─────────────────────────────────────────────────

function affinityLabel(aff: number): { text: string; cls: string } {
  if (aff <= BETRAYAL_THRESHOLD) return { text: "Betrayal", cls: "text-blood-400" };
  if (aff < 0) return { text: "Wary", cls: "text-orange-400" };
  if (aff < 25) return { text: "Neutral", cls: "text-ash-300" };
  if (aff < ROMANCE_UNLOCK_THRESHOLD) return { text: "Trusted", cls: "text-green-400" };
  return { text: "Devoted", cls: "text-gilt-300" };
}

function CompanionRoster() {
  const companions = useGameStore((s) => s.world?.companions);
  const toggleParty = useGameStore((s) => s.toggleCompanionParty);
  const autoEquipCompanion = useGameStore((s) => s.autoEquipCompanion);
  const unequipCompanionItem = useGameStore((s) => s.unequipCompanionItem);
  const setCompanionTactic = useGameStore((s) => s.setCompanionTactic);
  const audio = useAudio();
  const recruited = companions ?? [];

  if (recruited.length === 0) {
    return (
      <p className="text-ash-500 italic text-sm py-2">
        No companions recruited yet. Seek out allies in your travels — they fight at your side.
      </p>
    );
  }

  const partyCount = recruited.filter((c) => c.inParty).length;

  return (
    <div className="space-y-3 py-1">
      <p className="text-[10px] uppercase tracking-widest text-ash-500">
        Active party · {partyCount}/{MAX_PARTY_SIZE - 1} companions
      </p>
      {recruited.map((c) => {
        const def = COMPANIONS.find((d) => d.id === c.id);
        const name = def?.name ?? c.id;
        const aff = c.affinity;
        const label = affinityLabel(aff);
        return (
          <div key={c.id} className="panel px-3 py-2">
            <div className="flex justify-between items-baseline mb-1">
              <div className="flex flex-col">
                <span className="font-display text-sm text-gilt-300">{name}</span>
                {def && (
                  <span className="text-[9px] uppercase tracking-widest text-ash-500">
                    {def.title} · Lv {def.baseLevel} {def.classId}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest">
                {c.loyaltyComplete && <span className="text-gilt-400 border border-gilt-600/40 rounded px-1">Loyal</span>}
                <span className={label.cls}>{label.text}</span>
              </div>
            </div>
            <div className="relative h-2 rounded-sm bg-void-900 border border-ash-700/40 overflow-hidden mb-2">
              <div className="absolute inset-y-0 left-1/2 w-px bg-ash-600/60" />
              {aff >= 0 ? (
                <div className="absolute top-0 bottom-0 bg-green-600/70" style={{ left: "50%", width: `${aff / 2}%` }} />
              ) : (
                <div className="absolute top-0 bottom-0 bg-blood-700/70" style={{ right: "50%", width: `${-aff / 2}%` }} />
              )}
            </div>
            <button
              onClick={() => { toggleParty(c.id); audio.click(); }}
              className={clsx(
                "w-full text-[10px] uppercase tracking-widest py-1 rounded-sm border transition",
                c.inParty
                  ? "border-force-500/60 bg-force-900/30 text-force-300 hover:bg-force-900/50"
                  : "border-ash-700/40 text-ash-300 hover:border-gilt-600/50 hover:text-gilt-300",
              )}
            >
              {c.inParty ? "✓ In party — bench" : "+ Add to party"}
            </button>

            {/* Combat tactic — directs how this companion fights. */}
            <div className="mt-2 flex items-center gap-1">
              <span className="text-[9px] uppercase tracking-widest text-ash-500 mr-0.5">Tactic</span>
              {(["auto", "aggressive", "defensive", "focus"] as const).map((tac) => (
                <button
                  key={tac}
                  onClick={() => { setCompanionTactic(c.id, tac); audio.hover(); }}
                  title={
                    tac === "auto" ? "Balanced — adapts each turn"
                    : tac === "aggressive" ? "Always the strongest skill, on your target"
                    : tac === "defensive" ? "Conserve Force — basic attacks, finish the weakest"
                    : "Focus fire — always strikes your last target"
                  }
                  className={clsx(
                    "text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border transition",
                    (c.tactic ?? "auto") === tac
                      ? "border-gilt-500/60 bg-gilt-900/30 text-gilt-300"
                      : "border-ash-700/40 text-ash-400 hover:text-ash-200",
                  )}
                >
                  {tac}
                </button>
              ))}
            </div>

            {/* Gear management — companions wear their own assigned equipment. */}
            <div className="mt-2 border-t border-ash-800/40 pt-1.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] uppercase tracking-widest text-ash-500">Gear</span>
                <button
                  onClick={() => { autoEquipCompanion(c.id); audio.click(); }}
                  title="Assign the best available gear from your inventory"
                  className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-gilt-600/50 text-gilt-300 hover:bg-gilt-900/30 transition"
                >
                  ⚡ Equip best
                </button>
              </div>
              {(() => {
                const equipped = Object.entries(c.equipment ?? {});
                if (equipped.length === 0) {
                  return <p className="text-[9px] text-ash-600 italic">No gear assigned. Equip best to arm them.</p>;
                }
                return (
                  <div className="flex flex-col gap-0.5">
                    {equipped.map(([slot, itemId]) => {
                      const item = getItem(itemId);
                      return (
                        <div key={slot} className="flex items-center justify-between text-[10px]">
                          <span className="text-ash-300 truncate">
                            <span className="text-ash-600">{slot.replace(/_/g, " ")}: </span>
                            {item?.name ?? itemId}
                          </span>
                          <button
                            onClick={() => { unequipCompanionItem(c.id, slot); audio.click(); }}
                            title="Return to inventory"
                            className="text-ash-500 hover:text-blood-400 ml-1 shrink-0"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
