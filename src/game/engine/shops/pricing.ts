import type { Item } from "../../data/schemas/item";
import type { MerchantShop } from "../../data/shops/shops";
import { getAllItems } from "../../data/items/item-registry";
import { priceMultiplier } from "../factions/reputation";

/**
 * Reputation → buy multiplier for a vendor. No faction (or unknown rep) leaves
 * prices unchanged. Clamped so even hated vendors quote a finite (steep) price
 * rather than the engine's "refuse" Infinity, which the UI can't render.
 */
function repBuyFactor(shop: MerchantShop, rep: number): number {
  if (!shop.factionId) return 1;
  return Math.min(3, priceMultiplier(rep));
}

/** Liked factions pay MORE for your goods; disliked ones lowball. */
function repSellFactor(shop: MerchantShop, rep: number): number {
  if (!shop.factionId) return 1;
  const mult = priceMultiplier(rep);
  return mult === Number.POSITIVE_INFINITY ? 0.25 : Math.min(3, Math.max(0.25, 1 / mult));
}

/**
 * Shop pricing. `value` on an item is the canonical base price; when it's 0
 * (most generated/static items) we fall back to a rarity floor so nothing is
 * ever free. Weapons carry a premium.
 */

const RARITY_BASE: Record<Item["rarity"], number> = {
  common: 40,
  uncommon: 120,
  rare: 350,
  epic: 900,
  legendary: 2500,
  mythic: 6000,
  ancient_sith: 10000,
};

/** Canonical base price before any vendor markup/cut. */
export function basePrice(item: Item): number {
  let base = item.value > 0 ? item.value : RARITY_BASE[item.rarity];
  if (item.weapon) base *= 1.5;
  return Math.max(1, Math.round(base));
}

/** What the player pays to buy from this vendor (rep shifts the markup). */
export function buyPrice(item: Item, shop: MerchantShop, rep = 0): number {
  return Math.max(1, Math.round(basePrice(item) * shop.buyMarkup * repBuyFactor(shop, rep)));
}

/** What the vendor pays the player to buy this item back (rep shifts the rate). */
export function sellPrice(item: Item, shop: MerchantShop, rep = 0): number {
  return Math.max(1, Math.round(basePrice(item) * shop.sellRate * repSellFactor(shop, rep)));
}

/** Resolve the vendor's for-sale list, cheapest first, capped. */
export function resolveShopStock(shop: MerchantShop): Item[] {
  return getAllItems()
    .filter((i) => !i.cosmetic && shop.stocks(i))
    .sort((a, b) => basePrice(a) - basePrice(b))
    .slice(0, shop.cap);
}
