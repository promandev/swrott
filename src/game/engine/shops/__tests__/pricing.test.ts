import { describe, it, expect } from "vitest";
import { getShop } from "../../../data/shops/shops";
import { buyPrice, sellPrice, resolveShopStock } from "../pricing";

/**
 * Faction standing shifts a vendor's prices via priceMultiplier: liked
 * factions sell cheaper and buy your goods back for more; disliked ones gouge.
 * Vendors with no faction ignore reputation entirely.
 */

const grot = getShop("grot")!;     // factionId: sith_academy
const ossian = getShop("ossian")!; // no factionId
// Use the priciest stocked item so multiplier differences survive rounding.
const grotStock = resolveShopStock(grot);
const item = grotStock[grotStock.length - 1]!;

describe("faction-rep shop pricing", () => {
  it("buy price falls as standing improves", () => {
    const neutral = buyPrice(item, grot, 0);
    const friendly = buyPrice(item, grot, 40);
    const exalted = buyPrice(item, grot, 100);
    expect(friendly).toBeLessThan(neutral);
    expect(exalted).toBeLessThan(friendly);
  });

  it("hostile standing inflates buy prices", () => {
    expect(buyPrice(item, grot, -50)).toBeGreaterThan(buyPrice(item, grot, 0));
  });

  it("liked factions pay more on sell-back", () => {
    expect(sellPrice(item, grot, 100)).toBeGreaterThan(sellPrice(item, grot, 0));
  });

  it("a factionless vendor ignores reputation", () => {
    expect(buyPrice(item, ossian, 100)).toBe(buyPrice(item, ossian, -100));
    expect(sellPrice(item, ossian, 100)).toBe(sellPrice(item, ossian, -100));
  });
});
