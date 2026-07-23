/**
 * Crafting recipes (Independent Loop 1 / Idea IL1-A).
 *
 * Recipes consume Salvage shards + reagents to produce items, attune
 * crystals, or apply temporary buffs. Recipes have a "discovered" flag —
 * players unlock them by finding scrolls, completing quests, or
 * experimenting at the workbench.
 */

import type { Item } from "../../data/schemas/item";

export interface RecipeIngredient {
  itemId: string;
  qty: number;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  description: string;
  resultItemId: string;
  resultQty: number;
  resultRarityHint: Item["rarity"];
  ingredients: RecipeIngredient[];
  /** Minimum crafting station tier. */
  workbenchTier: 1 | 2 | 3;
  /** Whether discovery is required to use this recipe. */
  requiresDiscovery: boolean;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  { id: "recipe_minor_healing",  name: "Minor Healing Stim",
    description: "Restores 30 HP in combat.",
    resultItemId: "potion_healing_minor",  resultQty: 1, resultRarityHint: "common",
    ingredients: [{ itemId: "reagent_kolto", qty: 1 }, { itemId: "shard_rough", qty: 1 }],
    workbenchTier: 1, requiresDiscovery: false },

  { id: "recipe_major_healing",  name: "Major Healing Stim",
    description: "Restores 80 HP in combat.",
    resultItemId: "potion_healing_major",  resultQty: 1, resultRarityHint: "uncommon",
    ingredients: [{ itemId: "reagent_kolto", qty: 3 }, { itemId: "shard_polished", qty: 1 }],
    workbenchTier: 1, requiresDiscovery: false },

  { id: "recipe_force_stim",     name: "Force Stim",
    description: "Restores 25 FP.",
    resultItemId: "potion_force",          resultQty: 1, resultRarityHint: "uncommon",
    ingredients: [{ itemId: "reagent_kyber_dust", qty: 1 }, { itemId: "shard_polished", qty: 1 }],
    workbenchTier: 1, requiresDiscovery: false },

  { id: "recipe_red_synth_crystal", name: "Synthetic Red Kyber Crystal",
    description: "+5% damage when socketed.",
    resultItemId: "crystal_red_synthetic",resultQty: 1, resultRarityHint: "rare",
    ingredients: [{ itemId: "reagent_kyber_dust", qty: 5 }, { itemId: "reagent_blood_essence", qty: 1 }],
    workbenchTier: 2, requiresDiscovery: true },

  { id: "recipe_void_crystal",   name: "Void-Touched Crystal",
    description: "Force damage +10% when socketed.",
    resultItemId: "crystal_void",          resultQty: 1, resultRarityHint: "epic",
    ingredients: [{ itemId: "reagent_kyber_dust", qty: 10 }, { itemId: "shard_perfect", qty: 2 }, { itemId: "corruptedShards", qty: 1 }],
    workbenchTier: 2, requiresDiscovery: true },

  { id: "recipe_scroll_identify",name: "Scroll of Identification",
    description: "Reveals a single unidentified item.",
    resultItemId: "scroll_identify",       resultQty: 1, resultRarityHint: "uncommon",
    ingredients: [{ itemId: "reagent_kyber_dust", qty: 2 }, { itemId: "reagent_silk_thread", qty: 1 }],
    workbenchTier: 1, requiresDiscovery: false },

  { id: "recipe_voidforged_blade", name: "Voidforged Blade",
    description: "Endgame craftable saber. Requires Voidforged Shard.",
    resultItemId: "weapon_voidforged_saber",resultQty: 1, resultRarityHint: "legendary",
    ingredients: [
      { itemId: "shard_voidforged", qty: 1 },
      { itemId: "shard_perfect", qty: 5 },
      { itemId: "reagent_kyber_dust", qty: 20 },
      { itemId: "reagent_ancient_metal", qty: 3 },
    ],
    workbenchTier: 3, requiresDiscovery: true },
];

export function findRecipe(id: string): CraftingRecipe | undefined {
  return CRAFTING_RECIPES.find((r) => r.id === id);
}

/** Check whether the player has all ingredients in the inventory. */
export function canCraftRecipe(
  recipe: CraftingRecipe,
  inventory: ReadonlyArray<{ itemId: string; qty: number }>,
): boolean {
  for (const ing of recipe.ingredients) {
    const have = inventory.filter((i) => i.itemId === ing.itemId).reduce((acc, i) => acc + i.qty, 0);
    if (have < ing.qty) return false;
  }
  return true;
}
