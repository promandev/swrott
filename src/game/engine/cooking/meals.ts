/**
 * Cooking / consumable recipes (Independent Loop 3 / Idea IL3-A).
 *
 * Out-of-combat meals that grant short-lived buffs. Stack with each
 * other but only one per "category" can be active. Categories: combat,
 * stealth, force, social, survival.
 */

export type MealCategory = "combat" | "stealth" | "force" | "social" | "survival";

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  description: string;
  ingredients: Array<{ itemId: string; qty: number }>;
  /** Duration in combats (each combat decrements by 1). */
  durationCombats: number;
  /** Stat buffs while active. */
  buffs: Partial<{
    dmgDealtMult: number;
    dmgTakenMult: number;
    critChanceAdd: number;
    dodgeAdd: number;
    forceCostMult: number;
    xpGainMult: number;
    creditGainMult: number;
    influenceAdd: number;
    hpRegenPerTurn: number;
    fpRegenPerTurn: number;
  }>;
}

export const MEALS: Meal[] = [
  // combat
  { id: "meal_dewback_steak", name: "Filete de Dewback",
    category: "combat", description: "Carne contundente. La fuerza de lo salvaje.",
    ingredients: [{ itemId: "ing_dewback_meat", qty: 1 }, { itemId: "ing_korriban_spice", qty: 1 }],
    durationCombats: 3, buffs: { dmgDealtMult: 1.10, dmgTakenMult: 1.05 } },

  { id: "meal_warrior_stew",  name: "Estofado del Guerrero",
    category: "combat", description: "+15% de probabilidad de crítico.",
    ingredients: [{ itemId: "ing_dewback_meat", qty: 1 }, { itemId: "ing_kyber_salt", qty: 1 }],
    durationCombats: 2, buffs: { critChanceAdd: 0.15 } },

  // stealth
  { id: "meal_shadow_bread",  name: "Pan de Sombra",
    category: "stealth", description: "+15% de esquiva.",
    ingredients: [{ itemId: "ing_dark_grain", qty: 2 }, { itemId: "ing_silent_root", qty: 1 }],
    durationCombats: 3, buffs: { dodgeAdd: 0.15 } },

  // force
  { id: "meal_meditation_tea",name: "Té de Meditación",
    category: "force", description: "Coste de Fuerza −20%, +2 PF/turno.",
    ingredients: [{ itemId: "ing_kyber_salt", qty: 1 }, { itemId: "ing_void_leaf", qty: 2 }],
    durationCombats: 3, buffs: { forceCostMult: 0.8, fpRegenPerTurn: 2 } },

  // social
  { id: "meal_diplomats_feast",name: "Festín del Diplomático",
    category: "social", description: "+5 de Influencia, +25% de créditos.",
    ingredients: [{ itemId: "ing_rare_wine", qty: 1 }, { itemId: "ing_corellian_cheese", qty: 1 }],
    durationCombats: 0, buffs: { influenceAdd: 5, creditGainMult: 1.25 } },

  // survival
  { id: "meal_hardtack",      name: "Galleta Mandaloriana",
    category: "survival", description: "+2 PV/turno.",
    ingredients: [{ itemId: "ing_dark_grain", qty: 3 }, { itemId: "ing_dried_meat", qty: 1 }],
    durationCombats: 4, buffs: { hpRegenPerTurn: 2 } },

  { id: "meal_xp_brew",       name: "Brebaje del Erudito",
    category: "survival", description: "+30% de XP obtenida.",
    ingredients: [{ itemId: "ing_rare_wine", qty: 2 }, { itemId: "ing_kyber_salt", qty: 1 }],
    durationCombats: 5, buffs: { xpGainMult: 1.3 } },
];

export interface ActiveMeal {
  mealId: string;
  combatsRemaining: number;
}

/** Apply a meal — replaces existing meal in same category. */
export function consumeMeal(active: ReadonlyArray<ActiveMeal>, mealId: string): ActiveMeal[] {
  const meal = MEALS.find((m) => m.id === mealId);
  if (!meal) return [...active];
  const filtered = active.filter((a) => {
    const existing = MEALS.find((m) => m.id === a.mealId);
    return existing?.category !== meal.category;
  });
  return [...filtered, { mealId, combatsRemaining: meal.durationCombats }];
}

/** Decrement durations after a combat. Returns surviving meals. */
export function tickMealsAfterCombat(active: ReadonlyArray<ActiveMeal>): ActiveMeal[] {
  return active
    .map((a) => ({ ...a, combatsRemaining: a.combatsRemaining - 1 }))
    .filter((a) => a.combatsRemaining > 0);
}
