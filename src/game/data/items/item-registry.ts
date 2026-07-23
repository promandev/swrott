import { ItemSchema, type Item } from "../schemas/item";
import { KORRIBAN_ITEMS } from "./korriban-items";
import { PLANET_ITEM_MAP } from "./planet-items";
import { LEGENDARY_ITEMS } from "./legendary-items";
import { SET_ITEMS } from "./set-items";
import { CRYSTAL_ITEMS } from "./crystals";
import { WARBRINGER_ITEMS } from "./warbringer-arsenal";
import { useI18n } from "@/i18n";

/**
 * Global item registry — single source of truth for ALL items.
 *
 * Lookup:
 *   import { getItem } from "@/game/data/items/item-registry";
 *   const sword = getItem("legend_blackstar_saber");
 */

const ALL_INPUT = [
  ...KORRIBAN_ITEMS,
  ...LEGENDARY_ITEMS,
  ...SET_ITEMS,
  ...CRYSTAL_ITEMS,
  ...WARBRINGER_ITEMS,
];

const PARSED: Item[] = ALL_INPUT.map((raw) => ItemSchema.parse(raw));

export const ITEM_REGISTRY: Map<string, Item> = new Map();
for (const it of PARSED) ITEM_REGISTRY.set(it.id, it);
// Also include planet items (already parsed).
for (const [id, it] of Object.entries(PLANET_ITEM_MAP)) {
  if (!ITEM_REGISTRY.has(id)) ITEM_REGISTRY.set(id, it);
}

/** Overlays the current locale's name/description onto an item, falling back to the source-language data. */
function localize(item: Item): Item {
  const items = useI18n.getState().t.content.items as unknown as Record<string, { name: string; description: string }>;
  const entry = items[item.id];
  if (!entry) return item;
  return { ...item, name: entry.name, description: entry.description };
}

export function getItem(id: string): Item | undefined {
  const item = ITEM_REGISTRY.get(id);
  return item && localize(item);
}

export function getAllItems(): Item[] {
  return Array.from(ITEM_REGISTRY.values()).map(localize);
}

export function getItemsByRarity(rarity: Item["rarity"]): Item[] {
  return getAllItems().filter((i) => i.rarity === rarity);
}

export function getItemsBySetId(setId: string): Item[] {
  return getAllItems().filter((i) => i.setId === setId);
}
