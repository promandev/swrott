"use client";

/**
 * Combat Loadout panel.
 *
 * The talent tree decides *which* skills exist; this panel decides which of
 * them you carry into battle. Slots are talent-driven (4 base, up to 6).
 * Only unlocked skills can be slotted; baseline skills are always available.
 * Drag to reorder the bar.
 */

import { Reorder } from "framer-motion";
import { clsx } from "clsx";
import { useGameStore } from "@/game/store/game-store";
import { getSkill } from "@/game/data/schemas/skill-registry";
import { resolveCombatLoadout } from "@/game/engine/combat/player-loadout";
import { getBaselineSkills, getClassTalents } from "@/game/data/talents/talent-registry";

export function FavoriteSkillsPanel() {
  const character = useGameStore((s) => s.character);
  const toggle = useGameStore((s) => s.toggleFavoriteSkill);
  const reorder = useGameStore((s) => s.reorderFavoriteSkills);

  if (!character) return null;

  const { available, slots } = resolveCombatLoadout(character);
  const chosen = character.favoriteSkills.filter((id) => available.includes(id));
  const baseline = new Set(getBaselineSkills(character.classId));

  // Map each unlocked skill → the talent name that granted it (for labels).
  const unlockSource = new Map<string, string>();
  for (const node of getClassTalents(character.classId)) {
    if (node.unlocksSkill) unlockSource.set(node.unlocksSkill, node.name);
  }

  const sourceLabel = (id: string) =>
    baseline.has(id) ? "Baseline" : unlockSource.get(id) ?? "Unlocked";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="heading-display text-sm text-gilt-300">Combat Loadout</h3>
        <span className="text-xs text-ash-400">{chosen.length}/{slots} slots</span>
      </div>
      <p className="text-[11px] text-ash-500 leading-snug">
        Pick the abilities you carry into combat. Basic Attack is always present.
        Earn more slots and unlock new abilities in the talent tree.
      </p>

      {/* Equipped bar */}
      {chosen.length === 0 ? (
        <p className="text-xs text-ash-500 italic panel px-3 py-2">
          No abilities slotted — combat will auto-fill defaults. Star skills below to build your bar.
        </p>
      ) : (
        <Reorder.Group axis="y" values={chosen} onReorder={reorder} className="flex flex-col gap-1">
          {chosen.map((id, i) => {
            const skill = getSkill(id);
            if (!skill) return null;
            return (
              <Reorder.Item
                key={id}
                value={id}
                className="panel px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing bg-void-800/60"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ash-600 font-display w-4">{i + 1}</span>
                  <div className="flex flex-col">
                    <span className="text-sm text-ash-100">{skill.name}</span>
                    <span className="text-[10px] uppercase tracking-widest text-ash-500">
                      {sourceLabel(id)} · {skill.cost?.forcePoints ?? 0} FP
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="text-gilt-400 hover:text-gilt-200 text-lg"
                  aria-label="Remove from loadout"
                >
                  ★
                </button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      {/* Available pool */}
      <div className="border-t border-ash-800/60 pt-3">
        <h4 className="text-xs uppercase tracking-widest text-ash-400 mb-2">Available abilities</h4>
        <div className="grid grid-cols-2 gap-1">
          {available.map((id) => {
            const skill = getSkill(id);
            if (!skill) return null;
            const isOn = chosen.includes(id);
            const full = !isOn && chosen.length >= slots;
            return (
              <button
                key={id}
                type="button"
                disabled={full}
                onClick={() => toggle(id)}
                title={skill.description}
                className={clsx(
                  "panel px-2 py-1.5 text-left text-xs transition flex items-center gap-1",
                  isOn ? "bg-gilt-900/30 text-gilt-200" : "bg-void-900/40 text-ash-300 hover:bg-void-800/60",
                  full && "opacity-40 cursor-not-allowed",
                )}
              >
                <span>{isOn ? "★" : "☆"}</span>
                <span className="flex-1 truncate">{skill.name}</span>
                {baseline.has(id) && <span className="text-[8px] text-ash-600 uppercase">base</span>}
              </button>
            );
          })}
        </div>
        {available.length === 0 && (
          <p className="text-[11px] text-ash-500 italic">Unlock abilities in the talent tree.</p>
        )}
      </div>
    </div>
  );
}
