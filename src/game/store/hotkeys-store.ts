/**
 * Hotkey bindings (Complementary Loop 6 / Idea CL6-C).
 *
 * Centralized keybinding registry. Defaults are provided but the player
 * can override via the settings UI. Persisted in localStorage.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HotkeyAction =
  | "toggle_inventory"
  | "toggle_character"
  | "toggle_quest_log"
  | "toggle_map"
  | "toggle_journal"
  | "skill_1"
  | "skill_2"
  | "skill_3"
  | "skill_4"
  | "skill_5"
  | "favorite_1"
  | "favorite_2"
  | "favorite_3"
  | "favorite_4"
  | "favorite_5"
  | "end_turn"
  | "flee"
  | "stance_aggressive"
  | "stance_defensive"
  | "stance_precision"
  | "stance_frenzy"
  | "stance_riposte"
  | "use_potion"
  | "quick_save"
  | "quick_load";

export const DEFAULT_BINDINGS: Record<HotkeyAction, string> = {
  toggle_inventory: "i",
  toggle_character: "c",
  toggle_quest_log: "j",
  toggle_map:       "m",
  toggle_journal:   "n",
  skill_1: "1",
  skill_2: "2",
  skill_3: "3",
  skill_4: "4",
  skill_5: "5",
  favorite_1: "F1",
  favorite_2: "F2",
  favorite_3: "F3",
  favorite_4: "F4",
  favorite_5: "F5",
  end_turn: " ",
  flee: "Escape",
  stance_aggressive: "q",
  stance_defensive:  "w",
  stance_precision:  "e",
  stance_frenzy:     "r",
  stance_riposte:    "t",
  use_potion: "h",
  quick_save: "F9",
  quick_load: "F12",
};

interface HotkeysState {
  bindings: Record<HotkeyAction, string>;
  setBinding: (action: HotkeyAction, key: string) => void;
  resetAll: () => void;
}

export const useHotkeysStore = create<HotkeysState>()(
  persist(
    (set) => ({
      bindings: { ...DEFAULT_BINDINGS },
      setBinding: (action, key) =>
        set((s) => ({ bindings: { ...s.bindings, [action]: key } })),
      resetAll: () => set({ bindings: { ...DEFAULT_BINDINGS } }),
    }),
    { name: "swrott-hotkeys" },
  ),
);

/** Find which action a key triggers (or null). */
export function actionForKey(bindings: Record<HotkeyAction, string>, key: string): HotkeyAction | null {
  for (const [action, k] of Object.entries(bindings) as [HotkeyAction, string][]) {
    if (k.toLowerCase() === key.toLowerCase()) return action;
  }
  return null;
}
