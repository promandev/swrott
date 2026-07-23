import type { Item } from "../schemas/item";
import type { FactionId } from "../schemas/common";

/**
 * Merchant shops. Each shop sells a slice of the item registry (chosen by a
 * `stocks` predicate so stock stays valid as the item DB grows) and buys back
 * anything the player offers. Pricing lives in engine/shops/pricing.ts.
 *
 * Shops are opened from a merchant's dialogue via the `open_shop` consequence.
 */

export interface MerchantShop {
  id: string;
  /** Vendor display name. */
  name: string;
  title?: string;
  /** One-liner shown atop the shop panel. */
  greeting: string;
  /** Multiplier applied to base price when the player BUYS (markup). */
  buyMarkup: number;
  /** Fraction of base price the vendor pays when the player SELLS. */
  sellRate: number;
  /** Max number of items listed for sale. */
  cap: number;
  /**
   * Faction this vendor answers to. When set, the player's standing with it
   * shifts prices (liked → cheaper buys / better sells; disliked → gouged).
   * Pricing uses engine/factions/reputation.priceMultiplier.
   */
  factionId?: FactionId;
  /** Whether this item appears in the vendor's stock. */
  stocks: (item: Item) => boolean;
}

// ── Item-family helpers (tolerant of items that lean on slot/weapon
//    instead of tags) ────────────────────────────────────────────────────
const ARMOR_SLOTS = new Set(["head", "chest", "gloves", "belt", "boots"]);
const ACCESSORY_SLOTS = new Set(["implant_a", "implant_b", "relic_a", "relic_b"]);
const isWeapon = (i: Item) => Boolean(i.weapon) || i.tags.includes("weapon");
const isArmor = (i: Item) => i.tags.includes("armor") || ARMOR_SLOTS.has(i.slot ?? "");
const isConsumable = (i: Item) => i.tags.includes("consumable");
const isCrystal = (i: Item) => i.tags.includes("crystal");
const isMaterial = (i: Item) => i.tags.includes("material");
const isAccessory = (i: Item) =>
  i.tags.includes("accessory") || i.tags.includes("implant") || i.tags.includes("relic") || ACCESSORY_SLOTS.has(i.slot ?? "");
const rarityAtMost = (i: Item, tiers: Item["rarity"][]) => tiers.includes(i.rarity);

export const SHOPS: MerchantShop[] = [
  {
    id: "grot",
    name: "Grot",
    title: "Intendente de la Academia",
    greeting: "Material reglamentario. No te hará Darth, pero te mantendrá respirando.",
    buyMarkup: 1.0,
    sellRate: 0.35,
    cap: 16,
    factionId: "sith_academy",
    stocks: (i) =>
      rarityAtMost(i, ["common", "uncommon"]) &&
      (isWeapon(i) || isArmor(i) || isConsumable(i)),
  },
  {
    id: "drayven",
    name: "Drayven",
    title: "Armero Imperial",
    greeting: "Kyber, tejido de cortosis, placa ancestral. Materiales que respetan a quien los lleva.",
    buyMarkup: 1.15,
    sellRate: 0.4,
    cap: 18,
    factionId: "sith_academy",
    stocks: (i) =>
      rarityAtMost(i, ["common", "uncommon", "rare", "epic"]) &&
      (isWeapon(i) || isArmor(i) || isCrystal(i) || isAccessory(i)),
  },
  {
    id: "saka",
    name: "Saka",
    title: "Traficante de Armas del Mercado Negro",
    greeting: "Herramientas para problemas. Moralmente neutrales, a precios competitivos.",
    buyMarkup: 1.1,
    sellRate: 0.5,
    cap: 16,
    factionId: "smuggler_guild",
    stocks: (i) =>
      rarityAtMost(i, ["common", "uncommon", "rare"]) &&
      (isWeapon(i) || isMaterial(i)),
  },
  {
    id: "ossian",
    name: "Ossian",
    title: "Alquimista Sith Renegado",
    greeting: "Estimulantes por los que el intendente lloraría. Antídotos para todo lo que muerde en Dxun.",
    buyMarkup: 1.0,
    sellRate: 0.55,
    cap: 16,
    stocks: (i) => isConsumable(i) || (isCrystal(i) && rarityAtMost(i, ["common", "uncommon", "rare"])),
  },
  {
    id: "ziost_relics",
    name: "Keeper Veth",
    title: "Relicario de New Adasta",
    greeting: "Lo que el hielo entregó. Cristales que los viejos Lores murieron aferrando, placa de guerras más cálidas — paga al frío lo que le debes.",
    buyMarkup: 1.2,
    sellRate: 0.5,
    cap: 18,
    stocks: (i) =>
      rarityAtMost(i, ["uncommon", "rare", "epic"]) &&
      (isCrystal(i) || isArmor(i) || isConsumable(i) || isWeapon(i)),
  },
];

const SHOP_BY_ID = new Map(SHOPS.map((s) => [s.id, s]));

export function getShop(id: string): MerchantShop | undefined {
  return SHOP_BY_ID.get(id);
}
