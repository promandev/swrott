"use client";

import { useGameStore } from "@/game/store/game-store";
import { useAudioStore } from "@/game/audio/audio-store";
import { useAccessibilityStore } from "@/game/store/accessibility-store";
import { useHotkeysStore, type HotkeyAction } from "@/game/store/hotkeys-store";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n, LOCALES, LOCALE_LABELS } from "@/i18n";
import type { Locale } from "@/i18n/types";
import { CharacterSheet } from "@/game/ui/character/CharacterSheet";
import { InventoryPanel } from "@/game/ui/inventory/InventoryPanel";
import { QuestJournal } from "@/game/ui/quests/QuestJournal";
import { GalaxyMap } from "@/game/ui/world/GalaxyMap";
import { ShopPanel } from "@/game/ui/shop/ShopPanel";
import { getShop } from "@/game/data/shops/shops";

/**
 * Modal panels for HUD navigation. Foundation placeholders — each will be
 * fleshed out in later phases.
 */
export function PanelLayer() {
  const activePanel = useGameStore((s) => s.ui.activePanel);
  const activeShopId = useGameStore((s) => s.ui.activeShopId);
  const closePanel = useGameStore((s) => s.closePanel);
  const saveCurrent = useGameStore((s) => s.saveCurrent);
  const showToast = useGameStore((s) => s.showToast);
  const t = useI18n((s) => s.t);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  return (
    <AnimatePresence>
      {activePanel === "map" && <GalaxyMap key="galaxy-map" />}
      {/* "dialogue" is owned by DialogueUI (rendered separately); never show the
          generic panel/placeholder for it, or an "under construction" modal
          pops up behind every conversation. */}
      {activePanel && activePanel !== "map" && activePanel !== "dialogue" && (
        <motion.div
          key="panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-void-950/70 backdrop-blur-sm p-4"
          onClick={closePanel}
        >
          {/* Inventory/shop lay out three columns side by side — they need
              real width on desktop or their item lists cram together. */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`panel w-full max-h-[80vh] overflow-y-auto p-6 ${
              activePanel === "inventory" || activePanel === "shop"
                ? "max-w-5xl"
                : "max-w-3xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-gilt-700/20 pb-3 mb-4">
              <h2 className="heading-display text-lg">
                {activePanel === "shop"
                  ? (() => {
                      const shop = activeShopId ? getShop(activeShopId) : undefined;
                      return shop ? `${shop.name}${shop.title ? ` — ${shop.title}` : ""}` : "Merchant";
                    })()
                  : titleFor(activePanel, t)}
              </h2>
              <button onClick={closePanel} className="btn-ghost !py-1 !px-3 text-xs">
                {t.panels.closeEsc}
              </button>
            </header>

            <div className="text-ash-200 text-sm leading-relaxed space-y-3">
              {activePanel === "menu" ? (
                <MenuPanel
                  onSave={async () => {
                    await saveCurrent();
                    showToast(t.panels.gameSaved, "info");
                    closePanel();
                  }}
                />
              ) : activePanel === "character" ? (
                <CharacterSheet />
              ) : activePanel === "inventory" ? (
                <InventoryPanel />
              ) : activePanel === "journal" ? (
                <QuestJournal />
              ) : activePanel === "shop" ? (
                <ShopPanel />
              ) : (
                <Placeholder panel={activePanel} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function titleFor(p: string, t: ReturnType<typeof useI18n.getState>["t"]) {
  switch (p) {
    case "character":
      return t.panels.characterSheet;
    case "inventory":
      return t.panels.inventoryTitle;
    case "journal":
      return t.panels.questJournal;
    case "map":
      return t.panels.galaxyMap;
    case "menu":
      return t.panels.gameMenu;
    case "dialogue":
      return t.panels.dialogue;
    default:
      return p;
  }
}

function Placeholder({ panel }: { panel: string }) {
  const t = useI18n((s) => s.t);
  return (
    <div className="text-ash-300">
      <p className="italic mb-3">
        {t.panels.underConstruction.replace("{panel}", panel)}
      </p>
      <p>
        {t.panels.underConstructionDesc}
      </p>
    </div>
  );
}

function MenuPanel({ onSave }: { onSave: () => Promise<void> }) {
  const { musicVolume, sfxVolume, muted, setMusicVolume, setSfxVolume, toggleMute } =
    useAudioStore();
  const t = useI18n((s) => s.t);
  const locale = useI18n((s) => s.locale);
  const setLocale = useI18n((s) => s.setLocale);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button className="btn-sith" onClick={onSave}>
          {t.panels.saveGame}
        </button>
        <Link href="/" className="btn-ghost text-center">
          {t.panels.returnToTitle}
        </Link>
      </div>

      {/* Audio controls */}
      <div className="space-y-5">
        <div className="heading-display text-xs">{t.panels.audio}</div>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-ash-300">
            {t.panels.musicVolume}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={musicVolume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
            className="w-full accent-blood-500"
          />
          <span className="text-[10px] text-ash-500">{Math.round(musicVolume * 100)}%</span>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-ash-300">
            {t.panels.sfxVolume}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={sfxVolume}
            onChange={(e) => setSfxVolume(Number(e.target.value))}
            className="w-full accent-blood-500"
          />
          <span className="text-[10px] text-ash-500">{Math.round(sfxVolume * 100)}%</span>
        </label>

        <button onClick={toggleMute} className="btn-ghost !py-1.5 !px-4 text-xs w-full">
          {muted ? t.panels.unmuteAll : t.panels.muteAll}
        </button>
      </div>

      {/* Language selector */}
      <div className="space-y-3 sm:col-span-2">
        <div className="heading-display text-xs">{t.panels.language}</div>
        <div className="flex gap-2">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={`btn-ghost !py-1.5 !px-4 text-xs ${
                locale === l ? "ring-2 ring-blood-500 text-gilt-400" : ""
              }`}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility */}
      <AccessibilitySettings />

      {/* Key bindings */}
      <HotkeySettings />
    </div>
  );
}

const REBINDABLE: { action: HotkeyAction; label: string }[] = [
  { action: "toggle_inventory", label: "Inventory" },
  { action: "toggle_character", label: "Character" },
  { action: "toggle_quest_log", label: "Quest log" },
  { action: "toggle_map", label: "Galaxy map" },
  { action: "skill_1", label: "Ability 1" },
  { action: "skill_2", label: "Ability 2" },
  { action: "skill_3", label: "Ability 3" },
  { action: "skill_4", label: "Ability 4" },
  { action: "skill_5", label: "Ability 5" },
  { action: "end_turn", label: "Attack / end turn" },
  { action: "flee", label: "Flee" },
  { action: "stance_aggressive", label: "Stance: Aggressive" },
  { action: "stance_defensive", label: "Stance: Defensive" },
  { action: "stance_precision", label: "Stance: Precision" },
  { action: "stance_frenzy", label: "Stance: Frenzy" },
];

const prettyKey = (k: string) => (k === " " ? "Space" : k.length === 1 ? k.toUpperCase() : k);

function HotkeySettings() {
  const bindings = useHotkeysStore((s) => s.bindings);
  const setBinding = useHotkeysStore((s) => s.setBinding);
  const resetAll = useHotkeysStore((s) => s.resetAll);
  const [listening, setListening] = useState<HotkeyAction | null>(null);

  // Capture the next key for the action being rebound.
  useEffect(() => {
    if (!listening) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key !== "Escape") setBinding(listening, e.key);
      setListening(null);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [listening, setBinding]);

  return (
    <div className="space-y-3 sm:col-span-2 border-t border-gilt-700/15 pt-4">
      <div className="flex items-center justify-between">
        <div className="heading-display text-xs">Key Bindings</div>
        <button onClick={resetAll} className="btn-ghost !py-1 !px-3 text-[10px]">
          Reset defaults
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {REBINDABLE.map(({ action, label }) => (
          <div key={action} className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-ash-300 truncate">{label}</span>
            <button
              onClick={() => setListening(action)}
              className={`min-w-[3.5rem] text-center font-mono text-[11px] px-2 py-0.5 rounded border transition ${
                listening === action
                  ? "border-blood-500 text-blood-300 animate-pulse"
                  : "border-ash-700/40 text-gilt-300 hover:border-gilt-600/50"
              }`}
            >
              {listening === action ? "press…" : prettyKey(bindings[action])}
            </button>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-ash-500">Click a key, then press the new one. Esc cancels.</p>
    </div>
  );
}

function AccessibilitySettings() {
  const fontScale = useAccessibilityStore((s) => s.fontScale);
  const reducedMotion = useAccessibilityStore((s) => s.reducedMotion);
  const highContrast = useAccessibilityStore((s) => s.highContrast);
  const screenShake = useAccessibilityStore((s) => s.screenShakeEnabled);
  const damageNumbers = useAccessibilityStore((s) => s.damageNumbersEnabled);
  const setFontScale = useAccessibilityStore((s) => s.setFontScale);
  const setReducedMotion = useAccessibilityStore((s) => s.setReducedMotion);
  const setHighContrast = useAccessibilityStore((s) => s.setHighContrast);
  const setScreenShake = useAccessibilityStore((s) => s.setScreenShakeEnabled);
  const setDamageNumbers = useAccessibilityStore((s) => s.setDamageNumbersEnabled);

  const toggles: [string, boolean, (v: boolean) => void][] = [
    ["Reduced motion", reducedMotion, setReducedMotion],
    ["High contrast", highContrast, setHighContrast],
    ["Screen shake", screenShake, setScreenShake],
    ["Damage numbers", damageNumbers, setDamageNumbers],
  ];

  return (
    <div className="space-y-4 sm:col-span-2 border-t border-gilt-700/15 pt-4">
      <div className="heading-display text-xs">Accessibility</div>

      <label className="flex flex-col gap-1.5 max-w-xs">
        <span className="text-[10px] uppercase tracking-widest text-ash-300">
          Text size — {Math.round(fontScale * 100)}%
        </span>
        <input
          type="range"
          min={0.75}
          max={1.5}
          step={0.05}
          value={fontScale}
          onChange={(e) => setFontScale(Number(e.target.value))}
          className="w-full accent-blood-500"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {toggles.map(([label, value, set]) => (
          <button
            key={label}
            onClick={() => set(!value)}
            aria-pressed={value}
            className={`btn-ghost !py-1.5 !px-4 text-xs ${
              value ? "ring-2 ring-blood-500 text-gilt-400" : "text-ash-400"
            }`}
          >
            {value ? "☑" : "☐"} {label}
          </button>
        ))}
      </div>
    </div>
  );
}

