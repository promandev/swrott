"use client";

import { useEffect } from "react";
import { useGameStore } from "@/game/store/game-store";
import { useCombatStore } from "@/game/engine/combat/combat-store";
import { useHotkeysStore, actionForKey } from "@/game/store/hotkeys-store";

/**
 * Global keyboard shortcuts for the exploration HUD. The hotkeys-store has
 * defined panel bindings since forever, but nothing outside combat listened.
 * This toggles panels (I/C/J/M…) and closes them with Esc.
 *
 * Inert during combat (CombatUI owns the keyboard then) and while a dialogue
 * is open, and ignores keystrokes typed into form fields or with modifiers.
 */
const PANEL_FOR_ACTION: Record<string, "inventory" | "character" | "journal" | "map"> = {
  toggle_inventory: "inventory",
  toggle_character: "character",
  toggle_quest_log: "journal",
  toggle_journal: "journal",
  toggle_map: "map",
};

export function GlobalHotkeys() {
  const bindings = useHotkeysStore((s) => s.bindings);
  const openPanel = useGameStore((s) => s.openPanel);
  const closePanel = useGameStore((s) => s.closePanel);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      // Combat owns the keyboard; never steal panel keys mid-fight.
      if (useCombatStore.getState().phase !== "idle") return;

      const { activePanel } = useGameStore.getState().ui;
      // Don't hijack keys while a dialogue is on screen.
      if (activePanel === "dialogue") return;

      if (e.key === "Escape") {
        if (activePanel) {
          e.preventDefault();
          closePanel();
        }
        return;
      }

      const action = actionForKey(bindings, e.key);
      const panel = action ? PANEL_FOR_ACTION[action] : undefined;
      if (!panel) return;
      e.preventDefault();
      if (activePanel === panel) closePanel();
      else openPanel(panel);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bindings, openPanel, closePanel]);

  return null;
}
