/**
 * Crafting system — §9 "Fabricación y Oficios".
 *
 * 4 professions, 6 material tiers, recipes.
 */

export type CraftingProfession = "artifice" | "biochem" | "cybernetics" | "archaeology";

export interface MaterialTier {
  tier: number;
  name: string;
  levelRange: [number, number];
}

export const MATERIAL_TIERS: MaterialTier[] = [
  { tier: 1, name: "Tosco", levelRange: [1, 10] },
  { tier: 2, name: "Estándar", levelRange: [11, 18] },
  { tier: 3, name: "Refinado", levelRange: [19, 28] },
  { tier: 4, name: "Superior", levelRange: [29, 38] },
  { tier: 5, name: "Obra Maestra", levelRange: [39, 46] },
  { tier: 6, name: "Legendario", levelRange: [47, 50] },
];

export interface CraftingRecipe {
  id: string;
  name: string;
  profession: CraftingProfession;
  tier: number;
  /** Materials needed: [materialId, quantity]. */
  materials: [string, number][];
  /** Credits cost. */
  creditCost: number;
  /** Result item ID. */
  resultItemId: string;
  /** Skill level required. */
  skillRequired: number;
  /** XP gained from crafting. */
  craftXp: number;
}

export interface CraftingMaterial {
  id: string;
  name: string;
  description: string;
  tier: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  /** Which zones drop this material. */
  sourceZones: string[];
}

// ─── Materials ─────────────────────────────────────────────────────────

export const CRAFTING_MATERIALS: CraftingMaterial[] = [
  // Tier 1 — Korriban
  { id: "mat_rough_crystal", name: "Cristal en Bruto", description: "Un fragmento de cristal en bruto de las cuevas de Korriban.", tier: 1, rarity: "common", sourceZones: ["korriban_tomb", "korriban_valley"] },
  { id: "mat_sith_dust", name: "Polvo Sith", description: "Polvo impregnado del lado oscuro, raspado de los muros de las tumbas.", tier: 1, rarity: "common", sourceZones: ["korriban_tomb", "korriban_valley"] },
  { id: "mat_beast_hide", name: "Piel de Bestia", description: "Piel resistente de las criaturas de Korriban.", tier: 1, rarity: "common", sourceZones: ["korriban_mines", "korriban_academy_exterior"] },
  { id: "mat_corroded_circuit", name: "Circuito Corroído", description: "Rescatado de antiguos droides de tumba.", tier: 1, rarity: "uncommon", sourceZones: ["korriban_tomb"] },

  // Tier 2 — Nar Shaddaa
  { id: "mat_synth_compound", name: "Compuesto Sintético", description: "Compuesto químico de los laboratorios de Nar Shaddaa.", tier: 2, rarity: "common", sourceZones: ["nar_shaddaa_lower", "nar_shaddaa_market"] },
  { id: "mat_durasteel_scrap", name: "Chatarra de Duracero", description: "Duracero rescatado de la Ciudad Baja.", tier: 2, rarity: "common", sourceZones: ["nar_shaddaa_lower", "nar_shaddaa_exchange"] },
  { id: "mat_exotic_toxin", name: "Toxina Exótica", description: "Veneno raro extraído por alquimistas de los bajos fondos.", tier: 2, rarity: "uncommon", sourceZones: ["nar_shaddaa_market"] },

  // Tier 3 — Dxun / Onderon
  { id: "mat_mandalorian_iron", name: "Hierro Mandaloriano", description: "Metal casi indestructible de los campamentos mandalorianos.", tier: 3, rarity: "uncommon", sourceZones: ["dxun_mando_camp", "dxun_jungle"] },
  { id: "mat_jungle_sap", name: "Savia de la Jungla", description: "Savia bioluminiscente con propiedades curativas.", tier: 3, rarity: "common", sourceZones: ["dxun_jungle"] },
  { id: "mat_dark_relic", name: "Fragmento de Reliquia Oscura", description: "Un fragmento de artefactos sith de la tumba de Dxun.", tier: 3, rarity: "rare", sourceZones: ["dxun_sith_tomb"] },

  // Tier 4 — Dantooine
  { id: "mat_crystal_shard", name: "Esquirla de Cristal", description: "Fragmento de cristal puro de sable de luz de las cuevas de Dantooine.", tier: 4, rarity: "uncommon", sourceZones: ["dantooine_crystal_cave"] },
  { id: "mat_jedi_alloy", name: "Aleación Jedi", description: "Metal refinado de las ruinas del Enclave Jedi.", tier: 4, rarity: "rare", sourceZones: ["dantooine_sublevel", "dantooine_enclave"] },

  // Tier 5 — Telos
  { id: "mat_rakata_component", name: "Componente Rakata", description: "Antigua tecnología del Imperio Infinito.", tier: 5, rarity: "rare", sourceZones: ["telos_rakata_lab"] },
  { id: "mat_restoration_gel", name: "Gel de Restauración", description: "Biogel avanzado del proyecto de restauración de Telos.", tier: 5, rarity: "uncommon", sourceZones: ["telos_surface", "telos_citadel"] },

  // Tier 6 — Malachor V
  { id: "mat_void_essence", name: "Esencia del Vacío", description: "Energía pura del lado oscuro cristalizada en las profundidades de Malachor V.", tier: 6, rarity: "epic", sourceZones: ["malachor_depths", "malachor_trayus"] },
  { id: "mat_mass_shadow_shard", name: "Esquirla de Sombra Másica", description: "Un fragmento del Generador de Sombra Másica. La realidad se curva a su alrededor.", tier: 6, rarity: "legendary", sourceZones: ["malachor_surface"] },
];

// ─── Recipes ───────────────────────────────────────────────────────────

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  // Artifice — lightsaber crystals, hilts, mods
  { id: "rec_rough_focus_lens", name: "Lente de Enfoque Tosca", profession: "artifice", tier: 1, materials: [["mat_rough_crystal", 3], ["mat_sith_dust", 2]], creditCost: 50, resultItemId: "crystal_red_synthetic", skillRequired: 1, craftXp: 20 },
  { id: "rec_sith_crystal", name: "Cristal Sith", profession: "artifice", tier: 2, materials: [["mat_rough_crystal", 5], ["mat_synth_compound", 3]], creditCost: 200, resultItemId: "crystal_red_bleeding", skillRequired: 10, craftXp: 50 },
  { id: "rec_advanced_hilt", name: "Empuñadura Avanzada", profession: "artifice", tier: 3, materials: [["mat_mandalorian_iron", 4], ["mat_dark_relic", 2]], creditCost: 500, resultItemId: "crystal_ancient_sith", skillRequired: 20, craftXp: 100 },
  { id: "rec_masterwork_crystal", name: "Cristal de Obra Maestra", profession: "artifice", tier: 5, materials: [["mat_crystal_shard", 5], ["mat_rakata_component", 3]], creditCost: 2000, resultItemId: "crystal_lifedrinker", skillRequired: 40, craftXp: 250 },

  // Biochem — stims, medpacs, poisons
  { id: "rec_basic_medpac", name: "Medpac Básico", profession: "biochem", tier: 1, materials: [["mat_beast_hide", 2]], creditCost: 20, resultItemId: "medpac_warfront", skillRequired: 1, craftXp: 10 },
  { id: "rec_combat_stim", name: "Estimulante de Combate", profession: "biochem", tier: 2, materials: [["mat_synth_compound", 3], ["mat_exotic_toxin", 1]], creditCost: 150, resultItemId: "combat_adrenal_surge", skillRequired: 12, craftXp: 40 },
  { id: "rec_advanced_medpac", name: "Medpac Avanzado", profession: "biochem", tier: 3, materials: [["mat_jungle_sap", 4], ["mat_synth_compound", 2]], creditCost: 400, resultItemId: "medpac_advanced_warfront", skillRequired: 22, craftXp: 80 },
  { id: "rec_void_elixir", name: "Elixir del Vacío", profession: "biochem", tier: 6, materials: [["mat_void_essence", 3], ["mat_restoration_gel", 5]], creditCost: 5000, resultItemId: "force_stim_potent", skillRequired: 45, craftXp: 400 },

  // Cybernetics — implants, droid parts
  { id: "rec_basic_implant", name: "Implante Neural Básico", profession: "cybernetics", tier: 1, materials: [["mat_corroded_circuit", 3]], creditCost: 100, resultItemId: "wb_implant_reflex", skillRequired: 1, craftXp: 25 },
  { id: "rec_durasteel_plating", name: "Placa de Duracero", profession: "cybernetics", tier: 2, materials: [["mat_durasteel_scrap", 5]], creditCost: 250, resultItemId: "wb_set_chest", skillRequired: 14, craftXp: 55 },
  { id: "rec_rakata_implant", name: "Interfaz Neural Rakata", profession: "cybernetics", tier: 5, materials: [["mat_rakata_component", 4], ["mat_jedi_alloy", 2]], creditCost: 3000, resultItemId: "rakata_mind_trap", skillRequired: 38, craftXp: 300 },

  // Archaeology — relics, artifacts, enchantments
  { id: "rec_sith_talisman", name: "Talismán Sith", profession: "archaeology", tier: 1, materials: [["mat_sith_dust", 5]], creditCost: 75, resultItemId: "temple_ward_amulet", skillRequired: 1, craftXp: 20 },
  { id: "rec_dark_holocron", name: "Fragmento de Holocrón Oscuro", profession: "archaeology", tier: 3, materials: [["mat_dark_relic", 3], ["mat_rough_crystal", 5]], creditCost: 600, resultItemId: "dark_holocron_fragment", skillRequired: 25, craftXp: 120 },
  { id: "rec_mass_shadow_artifact", name: "Artefacto de Sombra Másica", profession: "archaeology", tier: 6, materials: [["mat_mass_shadow_shard", 1], ["mat_void_essence", 5]], creditCost: 10000, resultItemId: "stormcaller_relic", skillRequired: 48, craftXp: 500 },
];

/** Crafting skill levels per profession (stored in world snapshot). */
export interface CraftingSkills {
  artifice: number;
  biochem: number;
  cybernetics: number;
  archaeology: number;
}

export const INITIAL_CRAFTING_SKILLS: CraftingSkills = {
  artifice: 0,
  biochem: 0,
  cybernetics: 0,
  archaeology: 0,
};

/** Check if a recipe can be crafted. */
export function canCraft(
  recipe: CraftingRecipe,
  craftingSkills: CraftingSkills,
  credits: number,
  inventory: Map<string, number>,
): { canCraft: boolean; reason?: string } {
  if (craftingSkills[recipe.profession] < recipe.skillRequired) {
    return { canCraft: false, reason: `Need ${recipe.profession} skill ${recipe.skillRequired} (have ${craftingSkills[recipe.profession]}).` };
  }
  if (credits < recipe.creditCost) {
    return { canCraft: false, reason: `Need ${recipe.creditCost} credits.` };
  }
  for (const [matId, qty] of recipe.materials) {
    const have = inventory.get(matId) ?? 0;
    if (have < qty) {
      return { canCraft: false, reason: `Need ${qty}x ${matId} (have ${have}).` };
    }
  }
  return { canCraft: true };
}
