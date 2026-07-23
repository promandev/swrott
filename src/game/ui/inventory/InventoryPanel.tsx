"use client";

import { useGameStore } from "@/game/store/game-store";
import { getItem } from "@/game/data/items/item-registry";
import { resolveEquipped, canEquip, getConsumableEffect } from "@/game/engine/items/equipment";
import { describeItemEffects } from "@/game/engine/items/item-effects";
import { getItemSetDisplay } from "@/game/data/items/sets";
import { useAudio } from "@/game/audio/use-audio";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useState, useMemo } from "react";
import type { Slot } from "@/game/data/schemas";
import type { Item } from "@/game/data/schemas/item";

const EQUIP_SLOTS: { slot: Slot; label: string }[] = [
  { slot: "main_hand", label: "Main Hand" },
  { slot: "off_hand", label: "Off Hand" },
  { slot: "head", label: "Head" },
  { slot: "chest", label: "Chest" },
  { slot: "gloves", label: "Gloves" },
  { slot: "belt", label: "Belt" },
  { slot: "boots", label: "Boots" },
  { slot: "implant_a", label: "Implant A" },
  { slot: "implant_b", label: "Implant B" },
  { slot: "relic_a", label: "Relic A" },
  { slot: "relic_b", label: "Relic B" },
];

const RARITY_COLORS: Record<string, string> = {
  common: "text-ash-300",
  uncommon: "text-green-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-gilt-400",
  mythic: "text-blood-400",
  ancient_sith: "text-blood-300",
};

const RARITY_RANK: Record<string, number> = {
  common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5, ancient_sith: 6,
};

const RARITY_BORDERS: Record<string, string> = {
  common: "border-ash-700/40",
  uncommon: "border-green-600/50",
  rare: "border-blue-500/50",
  epic: "border-purple-500/50",
  legendary: "border-gilt-500/60",
  mythic: "border-blood-500/60",
  ancient_sith: "border-blood-400/60",
};

/** Glyph per item family — readable at grid size without art assets. */
function itemGlyph(item: Item): string {
  if (item.weapon) {
    if (item.weapon.weaponType.startsWith("saber") || item.weapon.weaponType === "double_blade" || item.weapon.weaponType === "curved_saber") return "⚔";
    if (item.weapon.weaponType === "sidearm") return "⌖";
    return "🗡";
  }
  if (item.tags.includes("armor")) {
    if (item.slot === "head") return "⛑";
    if (item.slot === "boots") return "🥾";
    if (item.slot === "gloves") return "✊";
    return "🛡";
  }
  if (item.tags.includes("consumable")) {
    if (item.tags.includes("healing") || item.tags.includes("heal")) return "✚";
    if (item.tags.includes("force")) return "✦";
    return "🜂";
  }
  if (item.tags.includes("crystal") || item.slot === "off_hand") return "◆";
  if (item.tags.includes("implant") || item.slot?.startsWith("implant")) return "⌬";
  if (item.tags.includes("accessory") || item.slot?.startsWith("relic")) return "❂";
  if (item.tags.includes("material")) return "⛏";
  return "▣";
}

export function InventoryPanel() {
  const character = useGameStore((s) => s.character);
  const equipItem = useGameStore((s) => s.equipItem);
  const autoEquipBest = useGameStore((s) => s.autoEquipBest);
  const unequipItem = useGameStore((s) => s.unequipItem);
  const useConsumable = useGameStore((s) => s.useConsumable);
  const audio = useAudio();
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "weapon" | "armor" | "consumable" | "material">("all");
  const [sortBy, setSortBy] = useState<"rarity" | "name">("rarity");
  const [query, setQuery] = useState("");
  const [upgradesOnly, setUpgradesOnly] = useState(false);

  const equippedInstanceIds = useMemo(() => {
    if (!character) return new Set<string>();
    return new Set(Object.values(character.equipment).filter(Boolean) as string[]);
  }, [character]);

  const filteredInventory = useMemo(() => {
    if (!character) return [];
    const q = query.trim().toLowerCase();
    return character.inventory
      .filter((inv) => {
        const item = getItem(inv.itemId);
        // Text search across name + tags (an unknown item can't match a query).
        if (q) {
          if (!item) return false;
          if (!`${item.name} ${item.tags.join(" ")}`.toLowerCase().includes(q)) return false;
        }
        if (!item) return true;
        if (selectedTab === "all") return true;
        if (selectedTab === "weapon") return item.tags.includes("weapon");
        if (selectedTab === "armor") return item.tags.includes("armor") || item.tags.includes("accessory") || item.tags.includes("implant");
        if (selectedTab === "consumable") return item.tags.includes("consumable");
        if (selectedTab === "material") return item.tags.includes("material");
        return true;
      })
      .filter((inv) => {
        if (!upgradesOnly) return true;
        const item = getItem(inv.itemId);
        if (!item?.slot) return false;
        const equipped = resolveEquipped(character, item.slot)?.item ?? null;
        // Show empty-slot gear and strict upgrades.
        return !equipped || powerScore(item) > powerScore(equipped);
      })
      .sort((a, b) => {
        const ia = getItem(a.itemId), ib = getItem(b.itemId);
        if (!ia || !ib) return 0;
        if (sortBy === "rarity") {
          const r = (RARITY_RANK[ib.rarity] ?? 0) - (RARITY_RANK[ia.rarity] ?? 0);
          if (r !== 0) return r;
        }
        return ia.name.localeCompare(ib.name);
      });
  }, [character, selectedTab, sortBy, query, upgradesOnly]);

  if (!character) return null;

  const selectedInv = selectedInstance
    ? character.inventory.find((i) => i.instanceId === selectedInstance) ?? null
    : null;
  const selectedItem = selectedInv ? getItem(selectedInv.itemId) ?? null : null;

  return (
    <div className="flex gap-4 h-full max-h-[70vh]">
      {/* Equipment slots — left side */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="heading-display text-xs">Equipment</h3>
          <button
            onClick={() => { autoEquipBest(); audio.click(); }}
            title="Equip the best item you own in every slot"
            className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-sm border border-gilt-600/50 text-gilt-300 hover:bg-gilt-900/30 transition"
          >
            ⚡ Optimize
          </button>
        </div>
        {EQUIP_SLOTS.map(({ slot, label }) => {
          const equipped = resolveEquipped(character, slot);
          return (
            <button
              key={slot}
              className={clsx(
                "w-44 h-10 panel flex items-center gap-2 px-2 text-xs text-left transition",
                equipped
                  ? clsx(RARITY_BORDERS[equipped.item.rarity], "hover:bg-blood-900/20")
                  : "border-ash-700/20",
              )}
              onClick={() => {
                if (!equipped) return;
                unequipItem(slot);
                audio.click();
              }}
              onMouseEnter={() => audio.hover()}
              title={equipped ? "Click to unequip" : undefined}
            >
              <span className="text-[9px] text-ash-500 uppercase tracking-widest w-14 shrink-0 truncate">
                {label}
              </span>
              {equipped ? (
                <span className={clsx("truncate", RARITY_COLORS[equipped.item.rarity])}>
                  {itemGlyph(equipped.item)} {equipped.item.name}
                </span>
              ) : (
                <span className="text-ash-600 italic">Empty</span>
              )}
            </button>
          );
        })}
        <p className="text-[9px] text-ash-600 mt-1 w-44 leading-relaxed">
          Click an equipped slot to unequip. Select an item to equip or use it.
        </p>
      </div>

      {/* Inventory grid — middle */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-2">
          {(["all", "weapon", "armor", "consumable", "material"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setSelectedTab(tab); audio.click(); }}
              className={clsx(
                "text-[10px] uppercase tracking-widest px-2 py-1 rounded transition",
                selectedTab === tab
                  ? "bg-blood-800/40 text-gilt-400 border border-gilt-700/30"
                  : "text-ash-400 hover:text-ash-200",
              )}
            >
              {tab}
            </button>
          ))}
          <div className="flex-1" />
          {/* Search across item names + tags */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-28 focus:w-36 transition-all bg-void-900/70 border border-ash-700/40 focus:border-gilt-600/50 rounded px-2 py-1 text-[11px] text-ash-200 placeholder:text-ash-600 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                title="Clear search"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-ash-500 hover:text-ash-200 text-xs leading-none"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={() => { setUpgradesOnly((v) => !v); audio.click(); }}
            title="Show only items that upgrade your current gear"
            className={clsx(
              "text-[10px] uppercase tracking-widest px-2 py-1 rounded border transition",
              upgradesOnly
                ? "border-green-600/60 bg-green-900/20 text-green-300"
                : "text-ash-400 hover:text-gilt-300 border-ash-700/40",
            )}
          >
            ▲ Upgrades
          </button>
          <button
            onClick={() => { setSortBy((s) => (s === "rarity" ? "name" : "rarity")); audio.click(); }}
            title="Toggle sort order"
            className="text-[10px] uppercase tracking-widest px-2 py-1 rounded text-ash-400 hover:text-gilt-300 border border-ash-700/40 transition"
          >
            ⇅ {sortBy}
          </button>
        </div>

        {/* Grid — auto-fill keeps cells a sane size at any panel width */}
        <div
          className="flex-1 overflow-y-auto grid gap-1.5 content-start"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(3.75rem, 1fr))" }}
        >
          {filteredInventory.map((inv) => {
            const item = getItem(inv.itemId);
            if (!item) return null;
            const isEquipped = equippedInstanceIds.has(inv.instanceId);
            const equippedForSlot = item.slot && !isEquipped ? resolveEquipped(character, item.slot)?.item ?? null : null;
            const isUpgrade = !!(equippedForSlot && powerScore(item) > powerScore(equippedForSlot));
            return (
              <button
                key={inv.instanceId}
                className={clsx(
                  "w-full aspect-square panel border flex flex-col items-center justify-center gap-0.5 transition relative",
                  RARITY_BORDERS[item.rarity],
                  "hover:bg-blood-900/20",
                  selectedInstance === inv.instanceId && "ring-1 ring-gilt-500/60 bg-blood-900/20",
                )}
                onClick={() => {
                  setSelectedInstance(inv.instanceId === selectedInstance ? null : inv.instanceId);
                  audio.click();
                }}
                onMouseEnter={() => audio.hover()}
              >
                <span className={clsx("text-lg leading-none", RARITY_COLORS[item.rarity])}>
                  {itemGlyph(item)}
                </span>
                <span className="text-[7px] text-ash-400 px-0.5 truncate w-full text-center">
                  {item.name}
                </span>
                {inv.qty > 1 && (
                  <span className="absolute bottom-0.5 right-1 text-[8px] text-ash-300 bg-void-900/80 px-0.5 rounded">
                    x{inv.qty}
                  </span>
                )}
                {isEquipped && (
                  <span className="absolute top-0.5 left-1 text-[8px] text-gilt-400" title="Equipped">
                    ●
                  </span>
                )}
                {isUpgrade && (
                  <span className="absolute top-0.5 right-1 text-[9px] text-green-400" title="Upgrade over equipped">
                    ▲
                  </span>
                )}
              </button>
            );
          })}
          {filteredInventory.length === 0 && (
            <div className="col-span-full text-center text-ash-500 text-xs py-8">
              {query ? `No items match “${query}”` : "No items"}
            </div>
          )}
        </div>

        {/* Currencies */}
        <div className="mt-2 flex gap-4 text-xs text-ash-300">
          <span>Credits: <span className="text-gilt-400">{character.credits}</span></span>
          <span>Dark Tokens: <span className="text-blood-400">{character.darkTokens}</span></span>
        </div>
      </div>

      {/* Detail panel — right side */}
      <div className="w-60 shrink-0">
        <AnimatePresence mode="wait">
          {selectedItem && selectedInv ? (
            <ItemDetail
              key={selectedInv.instanceId}
              item={selectedItem}
              qty={selectedInv.qty}
              isEquipped={equippedInstanceIds.has(selectedInv.instanceId)}
              compareTo={
                selectedItem.slot && !equippedInstanceIds.has(selectedInv.instanceId)
                  ? resolveEquipped(character, selectedItem.slot)?.item ?? null
                  : null
              }
              canEquipResult={canEquip(character, selectedItem)}
              onEquip={() => {
                equipItem(selectedInv.instanceId);
                audio.click();
              }}
              onUnequip={() => {
                if (selectedItem.slot) unequipItem(selectedItem.slot);
                audio.click();
              }}
              onUse={
                getConsumableEffect(selectedItem.id)
                  ? () => {
                      useConsumable(selectedInv.instanceId);
                      audio.click();
                    }
                  : undefined
              }
            />
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="panel p-3 h-full flex items-center justify-center text-ash-600 text-xs text-center"
            >
              Select an item to inspect, equip, or use it.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Rough power score for at-a-glance upgrade hints. */
function powerScore(item: Item): number {
  let s = item.weapon?.damage ?? 0;
  for (const v of Object.values((item.bonuses ?? {}) as Record<string, number | undefined>)) s += v ?? 0;
  return s;
}

/** Stat deltas between a candidate item and the one currently equipped. */
function comparisonRows(a: Item, b: Item): { label: string; delta: number }[] {
  const rows: { label: string; delta: number }[] = [];
  if (a.weapon || b.weapon) {
    rows.push({ label: "Damage", delta: (a.weapon?.damage ?? 0) - (b.weapon?.damage ?? 0) });
  }
  const ab = (a.bonuses ?? {}) as Record<string, number | undefined>;
  const bb = (b.bonuses ?? {}) as Record<string, number | undefined>;
  for (const k of new Set([...Object.keys(ab), ...Object.keys(bb)])) {
    const delta = (ab[k] ?? 0) - (bb[k] ?? 0);
    if (delta !== 0) rows.push({ label: k.replace(/([A-Z])/g, " $1").trim(), delta });
  }
  return rows;
}

function ItemDetail({
  item,
  qty,
  isEquipped,
  compareTo,
  canEquipResult,
  onEquip,
  onUnequip,
  onUse,
}: {
  item: Item;
  qty: number;
  isEquipped: boolean;
  /** Currently-equipped item in this slot, for stat-delta comparison. */
  compareTo?: Item | null;
  canEquipResult: { ok: boolean; reason?: string };
  onEquip: () => void;
  onUnequip: () => void;
  onUse?: () => void;
}) {
  const equippable = !!item.slot;
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className={clsx("panel border p-3 flex flex-col gap-2", RARITY_BORDERS[item.rarity])}
    >
      <div>
        <div className={clsx("font-display text-sm", RARITY_COLORS[item.rarity])}>
          {itemGlyph(item)} {item.name}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-ash-400">
          {item.rarity}
          {item.slot ? ` · ${item.slot.replace("_", " ")}` : ""}
          {qty > 1 ? ` · x${qty}` : ""}
        </div>
      </div>

      <p className="text-xs text-ash-300 leading-relaxed">{item.description}</p>

      {item.weapon && (
        <div className="text-xs text-ash-200">
          Damage: <span className="text-blood-400">{item.weapon.damage}</span>
          <span className="text-ash-500 ml-1">({item.weapon.damageType})</span>
        </div>
      )}

      {item.bonuses && (
        <div className="flex flex-col gap-0.5 text-[11px]">
          {Object.entries(item.bonuses)
            .filter(([, v]) => v !== undefined && v !== 0)
            .map(([key, val]) => (
              <div key={key} className="text-green-400">
                +{val} {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
            ))}
        </div>
      )}

      {/* Named special effects (legendaries / crystals) — now live in combat */}
      {(() => {
        const fx = describeItemEffects(item);
        if (fx.length === 0) return null;
        return (
          <div className="flex flex-col gap-0.5 text-[11px] border-t border-gilt-800/30 pt-1.5">
            {fx.map((line) => (
              <div key={line} className="text-gilt-300 flex items-baseline gap-1">
                <span className="text-gilt-500">◆</span>{line}
              </div>
            ))}
          </div>
        );
      })()}

      {/* Set membership + its tiered bonuses */}
      {item.setId && getItemSetDisplay(item.setId) && (() => {
        const set = getItemSetDisplay(item.setId)!;
        return (
          <div className="border-t border-gilt-800/30 pt-1.5">
            <div className="text-[10px] uppercase tracking-widest text-gilt-400 mb-0.5">{set.name} Set</div>
            <div className="flex flex-col gap-0.5 text-[10px] text-ash-400">
              {set.tiers.map((t) => (
                <div key={t.pieces}>
                  <span className="text-ash-500">({t.pieces})</span> {t.description}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Comparison vs the item currently equipped in this slot */}
      {compareTo && compareTo.id !== item.id && (() => {
        const rows = comparisonRows(item, compareTo);
        if (rows.length === 0) return null;
        return (
          <div className="mt-1 border-t border-ash-800/40 pt-1.5">
            <div className="text-[9px] uppercase tracking-widest text-ash-500 mb-1">
              vs equipped · {compareTo.name}
            </div>
            <div className="flex flex-col gap-0.5 text-[11px]">
              {rows.map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-ash-400 capitalize">{row.label}</span>
                  <span className={clsx(
                    "tabular-nums font-semibold",
                    row.delta > 0 ? "text-green-400" : row.delta < 0 ? "text-blood-400" : "text-ash-500",
                  )}>
                    {row.delta > 0 ? "▲ +" : row.delta < 0 ? "▼ " : ""}{row.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {item.levelReq > 1 && (
        <div className="text-[10px] text-ash-500">Requires level {item.levelReq}</div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-1 mt-1">
        {equippable && !isEquipped && (
          <button
            onClick={onEquip}
            disabled={!canEquipResult.ok}
            className={clsx(
              "text-xs px-2 py-1.5 rounded border transition uppercase tracking-widest",
              canEquipResult.ok
                ? "border-gilt-600/50 text-gilt-300 hover:bg-gilt-900/30"
                : "border-ash-800/40 text-ash-600 cursor-not-allowed",
            )}
          >
            {canEquipResult.ok ? "Equip" : canEquipResult.reason}
          </button>
        )}
        {equippable && isEquipped && (
          <button
            onClick={onUnequip}
            className="text-xs px-2 py-1.5 rounded border border-ash-600/50 text-ash-300 hover:bg-void-800 transition uppercase tracking-widest"
          >
            Unequip
          </button>
        )}
        {onUse && (
          <button
            onClick={onUse}
            className="text-xs px-2 py-1.5 rounded border border-green-700/50 text-green-300 hover:bg-green-900/20 transition uppercase tracking-widest"
          >
            Use
          </button>
        )}
      </div>

      {item.value > 0 && (
        <div className="text-[10px] text-ash-500">Value: {item.value} credits</div>
      )}
    </motion.div>
  );
}
