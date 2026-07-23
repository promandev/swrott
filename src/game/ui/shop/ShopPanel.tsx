"use client";

/**
 * Merchant shop panel. Two columns: the vendor's wares (buy) and your own
 * inventory (sell). Opened from a merchant's dialogue via the `open_shop`
 * consequence. Pricing comes from engine/shops/pricing.ts; equipped items
 * can't be sold.
 */

import { useMemo } from "react";
import { clsx } from "clsx";
import { useGameStore } from "@/game/store/game-store";
import { useAudio } from "@/game/audio/use-audio";
import { getItem } from "@/game/data/items/item-registry";
import { getShop } from "@/game/data/shops/shops";
import { buyPrice, sellPrice, resolveShopStock } from "@/game/engine/shops/pricing";
import { resolveEquipped } from "@/game/engine/items/equipment";
import { tierFromReputation, type ReputationTier } from "@/game/engine/factions/reputation";
import { FACTIONS } from "@/game/engine/factions/factions";
import type { Item } from "@/game/data/schemas/item";

const TIER_PRICE_LABEL: Record<ReputationTier, string> = {
  hated: "Barred", hostile: "Gouged", neutral: "Fair prices", friendly: "Discount", allied: "Favored", exalted: "Honored",
};
const TIER_PRICE_CLS: Record<ReputationTier, string> = {
  hated: "text-blood-400 border-blood-700/50",
  hostile: "text-orange-400 border-orange-700/50",
  neutral: "text-ash-400 border-ash-700/40",
  friendly: "text-green-400 border-green-700/50",
  allied: "text-sky-300 border-sky-700/50",
  exalted: "text-gilt-300 border-gilt-600/50",
};

/** Rough power score for upgrade hints: weapon damage + sum of stat bonuses. */
function powerScore(item: Item): number {
  let s = item.weapon?.damage ?? 0;
  for (const v of Object.values((item.bonuses ?? {}) as Record<string, number | undefined>)) {
    s += v ?? 0;
  }
  return s;
}

const RARITY_COLORS: Record<string, string> = {
  common: "text-ash-300", uncommon: "text-green-400", rare: "text-blue-400",
  epic: "text-purple-400", legendary: "text-gilt-400", mythic: "text-blood-400",
  ancient_sith: "text-blood-300",
};
const RARITY_BORDERS: Record<string, string> = {
  common: "border-ash-700/40", uncommon: "border-green-600/50", rare: "border-blue-500/50",
  epic: "border-purple-500/50", legendary: "border-gilt-500/60", mythic: "border-blood-500/60",
  ancient_sith: "border-blood-400/60",
};

function glyph(item: Item): string {
  if (item.weapon) return "⚔";
  if (item.tags.includes("armor")) return "🛡";
  if (item.tags.includes("consumable")) return "✚";
  if (item.tags.includes("crystal")) return "◆";
  if (item.tags.includes("material")) return "⛏";
  return "▣";
}

export function ShopPanel() {
  const character = useGameStore((s) => s.character);
  const shopId = useGameStore((s) => s.ui.activeShopId);
  const factionRep = useGameStore((s) => s.world?.factionRep);
  const buy = useGameStore((s) => s.buyItem);
  const sell = useGameStore((s) => s.sellItem);
  const audio = useAudio();

  const shop = shopId ? getShop(shopId) : undefined;
  const stock = useMemo(() => (shop ? resolveShopStock(shop) : []), [shop]);

  // Standing with the vendor's faction shifts every price here.
  const rep = shop?.factionId ? (factionRep?.[shop.factionId] ?? 0) : 0;
  const tier = tierFromReputation(rep);
  const factionName = shop?.factionId ? FACTIONS.find((f) => f.id === shop.factionId)?.name ?? null : null;

  const equippedIds = useMemo(
    () => new Set(Object.values(character?.equipment ?? {}).filter(Boolean) as string[]),
    [character],
  );

  if (!character || !shop) return null;
  const credits = character.credits;

  const sellable = character.inventory.filter((inv) => !equippedIds.has(inv.instanceId));

  return (
    <div className="flex flex-col gap-3 max-h-[72vh]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-ash-400 italic max-w-md leading-snug">“{shop.greeting}”</p>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="text-sm whitespace-nowrap">
            <span className="text-[10px] uppercase tracking-widest text-ash-500 mr-1">Credits</span>
            <span className="font-display text-gilt-400">{credits.toLocaleString()}</span>
          </div>
          {factionName && (
            <span
              title={`Your standing with ${factionName} (${rep > 0 ? "+" : ""}${rep}) shifts this vendor's prices.`}
              className={clsx(
                "text-[9px] uppercase tracking-widest border rounded px-1.5 py-0.5",
                TIER_PRICE_CLS[tier],
              )}
            >
              {factionName}: {TIER_PRICE_LABEL[tier]}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-0">
        {/* ── Buy column ─────────────────────────────────────────── */}
        <section className="flex flex-col min-h-0">
          <h3 className="heading-display text-xs mb-2 text-gilt-300">Buy · {shop.name}</h3>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 max-h-[58vh]">
            {stock.map((item) => {
              const price = buyPrice(item, shop, rep);
              const afford = credits >= price;
              const equipped = item.slot ? resolveEquipped(character, item.slot)?.item ?? null : null;
              const isUpgrade = !!(item.slot && equipped && powerScore(item) > powerScore(equipped));
              const isNewGear = !!(item.slot && !equipped);
              return (
                <div
                  key={item.id}
                  className={clsx("panel border flex items-center gap-2 px-2 py-1.5", RARITY_BORDERS[item.rarity])}
                  title={item.description}
                >
                  <span className={clsx("text-base leading-none", RARITY_COLORS[item.rarity])}>{glyph(item)}</span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={clsx("text-xs truncate flex items-center gap-1.5", RARITY_COLORS[item.rarity])}>
                      {item.name}
                      {isUpgrade && (
                        <span className="text-[8px] text-green-400 border border-green-600/50 rounded px-1 leading-tight" title="Upgrade over equipped">▲ UP</span>
                      )}
                      {isNewGear && (
                        <span className="text-[8px] text-sky-300 border border-sky-700/50 rounded px-1 leading-tight" title="Empty slot">NEW</span>
                      )}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-ash-500">
                      {item.rarity}{item.levelReq > 1 ? ` · Lv ${item.levelReq}` : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => { buy(shop.id, item.id); audio.click(); }}
                    disabled={!afford}
                    className={clsx(
                      "text-[11px] px-2 py-1 rounded-sm border whitespace-nowrap transition",
                      afford
                        ? "border-gilt-600/50 text-gilt-300 hover:bg-gilt-900/30"
                        : "border-ash-800/40 text-ash-600 cursor-not-allowed",
                    )}
                  >
                    {price.toLocaleString()} cr
                  </button>
                </div>
              );
            })}
            {stock.length === 0 && (
              <p className="text-xs text-ash-500 italic">Nothing in stock.</p>
            )}
          </div>
        </section>

        {/* ── Sell column ────────────────────────────────────────── */}
        <section className="flex flex-col min-h-0">
          <h3 className="heading-display text-xs mb-2 text-ash-200">Sell</h3>
          <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 max-h-[58vh]">
            {sellable.map((inv) => {
              const item = getItem(inv.itemId);
              if (!item) return null;
              const price = sellPrice(item, shop, rep);
              return (
                <div
                  key={inv.instanceId}
                  className={clsx("panel border flex items-center gap-2 px-2 py-1.5", RARITY_BORDERS[item.rarity])}
                  title={item.description}
                >
                  <span className={clsx("text-base leading-none", RARITY_COLORS[item.rarity])}>{glyph(item)}</span>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={clsx("text-xs truncate", RARITY_COLORS[item.rarity])}>
                      {item.name}{inv.qty > 1 ? ` ×${inv.qty}` : ""}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-ash-500">{item.rarity}</span>
                  </div>
                  <button
                    onClick={() => { sell(inv.instanceId); audio.click(); }}
                    className="text-[11px] px-2 py-1 rounded-sm border border-green-700/50 text-green-300 hover:bg-green-900/20 whitespace-nowrap transition"
                  >
                    +{price.toLocaleString()} cr
                  </button>
                </div>
              );
            })}
            {sellable.length === 0 && (
              <p className="text-xs text-ash-500 italic">Nothing to sell. Equipped items can't be sold.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
