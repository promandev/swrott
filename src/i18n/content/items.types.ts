/**
 * Typed shape for the items/affixes/item-sets translation dictionaries.
 * Every locale dictionary (items.en.ts, items.es.ts, items.fr.ts) must
 * implement these interfaces in full — TypeScript will flag missing keys
 * whenever a new item/affix/set is added to the game data.
 */

export interface ItemContentEntry {
  name: string;
  description: string;
}

export interface ItemsContent {
  training_saber: ItemContentEntry;
  acolyte_blade: ItemContentEntry;
  bloodforged_saber: ItemContentEntry;
  vibrosword_korriban: ItemContentEntry;
  crimson_fang: ItemContentEntry;
  slave_rags: ItemContentEntry;
  acolyte_robes: ItemContentEntry;
  warrior_plate: ItemContentEntry;
  duelist_garb: ItemContentEntry;
  darth_voren_mantle: ItemContentEntry;
  hood_of_shadows: ItemContentEntry;
  sith_mask_iron: ItemContentEntry;
  iron_gauntlets: ItemContentEntry;
  utility_belt: ItemContentEntry;
  sandwalker_boots: ItemContentEntry;
  medpack_basic: ItemContentEntry;
  medpack_advanced: ItemContentEntry;
  force_stim: ItemContentEntry;
  adrenal_strength: ItemContentEntry;
  antidote: ItemContentEntry;
  mat_scrap_metal: ItemContentEntry;
  mat_crystal_shard: ItemContentEntry;
  mat_dark_essence: ItemContentEntry;
  relic_broken_holocron: ItemContentEntry;
  relic_bone_talisman: ItemContentEntry;
  implant_reflex_chip: ItemContentEntry;
  quest_voren_amulet: ItemContentEntry;
  quest_tomb_key: ItemContentEntry;
  legend_hunger_of_nihilus: ItemContentEntry;
  legend_blackstar_saber: ItemContentEntry;
  legend_crimson_reaver: ItemContentEntry;
  legend_staff_of_nihilus: ItemContentEntry;
  legend_shadowfang: ItemContentEntry;
  legend_the_empty_saber: ItemContentEntry;
  legend_voidweaver_robes: ItemContentEntry;
  legend_mask_of_silent_death: ItemContentEntry;
  legend_mask_of_xerev: ItemContentEntry;
  legend_helm_of_endless_fury: ItemContentEntry;
  legend_trayas_codex: ItemContentEntry;
  legend_heart_of_malachor: ItemContentEntry;
  legend_fragment_of_sion: ItemContentEntry;
  legend_nihilus_bone_charm: ItemContentEntry;
  legend_trayas_eye: ItemContentEntry;
  kaas_stormblade: ItemContentEntry;
  imperial_vibropike: ItemContentEntry;
  imperial_officer_coat: ItemContentEntry;
  kaas_shock_gauntlets: ItemContentEntry;
  stormwalker_boots: ItemContentEntry;
  temple_ward_amulet: ItemContentEntry;
  stormcaller_relic: ItemContentEntry;
  kaas_field_ration: ItemContentEntry;
  exchange_blaster: ItemContentEntry;
  smuggler_vibroblade: ItemContentEntry;
  neon_saber: ItemContentEntry;
  bounty_hunter_jacket: ItemContentEntry;
  exchange_heavy_armor: ItemContentEntry;
  smuggler_ring: ItemContentEntry;
  credit_chip_implant: ItemContentEntry;
  nar_shaddaa_stim: ItemContentEntry;
  shaddaa_medpac: ItemContentEntry;
  onderon_guard_blade: ItemContentEntry;
  mandalorian_heavy_blaster: ItemContentEntry;
  dxun_beast_blade: ItemContentEntry;
  sith_tomb_saber: ItemContentEntry;
  mandalorian_armor: ItemContentEntry;
  beast_rider_leathers: ItemContentEntry;
  mandalore_sigil: ItemContentEntry;
  mando_combat_stim: ItemContentEntry;
  jedi_guardian_blade: ItemContentEntry;
  crystal_staff: ItemContentEntry;
  jedi_robes_remnant: ItemContentEntry;
  dantooine_crystal: ItemContentEntry;
  dantooine_healing_herb: ItemContentEntry;
  czerka_prototype_rifle: ItemContentEntry;
  rakata_blade: ItemContentEntry;
  telos_shield_suit: ItemContentEntry;
  rakata_mind_trap: ItemContentEntry;
  advanced_medpac_telos: ItemContentEntry;
  sion_lightsaber: ItemContentEntry;
  nihilus_mask_fragment: ItemContentEntry;
  traya_saber: ItemContentEntry;
  void_crystal: ItemContentEntry;
  trayus_robes: ItemContentEntry;
  storm_beast_hide: ItemContentEntry;
  void_elixir_item: ItemContentEntry;
  set_voidlord_hood: ItemContentEntry;
  set_voidlord_gloves: ItemContentEntry;
  set_voidlord_belt: ItemContentEntry;
  set_voidlord_boots: ItemContentEntry;
  set_bloodforged_chest: ItemContentEntry;
  set_bloodforged_gloves: ItemContentEntry;
  set_bloodforged_belt: ItemContentEntry;
  set_bloodforged_boots: ItemContentEntry;
  set_whisperveil_chest: ItemContentEntry;
  set_whisperveil_gloves: ItemContentEntry;
  set_whisperveil_belt: ItemContentEntry;
  set_whisperveil_boots: ItemContentEntry;
  crystal_red_synthetic: ItemContentEntry;
  crystal_red_bleeding: ItemContentEntry;
  crystal_purple_corrupted: ItemContentEntry;
  crystal_black_void: ItemContentEntry;
  crystal_ancient_sith: ItemContentEntry;
  crystal_lifedrinker: ItemContentEntry;
  wb_serration_blade: ItemContentEntry;
  wb_venom_sidearm: ItemContentEntry;
  wb_ember_scourge: ItemContentEntry;
  wb_tempest_pike: ItemContentEntry;
  wb_dread_saber: ItemContentEntry;
  wb_relic_warcore: ItemContentEntry;
  wb_relic_bulwark: ItemContentEntry;
  wb_implant_reflex: ItemContentEntry;
  wb_implant_furnace: ItemContentEntry;
  wb_set_helm: ItemContentEntry;
  wb_set_chest: ItemContentEntry;
  wb_set_gauntlets: ItemContentEntry;
  wb_set_greaves: ItemContentEntry;
  medpac_warfront: ItemContentEntry;
  medpac_advanced_warfront: ItemContentEntry;
  force_stim_potent: ItemContentEntry;
  combat_adrenal_surge: ItemContentEntry;
  antidote_kit: ItemContentEntry;
  wb_relic_stormheart: ItemContentEntry;
  wb_relic_unbroken: ItemContentEntry;
  wb_implant_predator: ItemContentEntry;
  ancient_shard: ItemContentEntry;
  corrupted_shard: ItemContentEntry;
  dark_holocron_fragment: ItemContentEntry;
}

export interface AffixContentEntry {
  name: string;
}

export interface AffixesContent {
  px_sharp: AffixContentEntry;
  px_keen: AffixContentEntry;
  px_brutal: AffixContentEntry;
  px_savage: AffixContentEntry;
  px_devastating: AffixContentEntry;
  px_crimson: AffixContentEntry;
  px_blazing: AffixContentEntry;
  px_voltaic: AffixContentEntry;
  px_venomous: AffixContentEntry;
  px_sturdy: AffixContentEntry;
  px_fortified: AffixContentEntry;
  px_warded: AffixContentEntry;
  px_impervious: AffixContentEntry;
  px_unbreakable: AffixContentEntry;
  px_attuned: AffixContentEntry;
  px_focused: AffixContentEntry;
  px_resonant: AffixContentEntry;
  px_ascendant: AffixContentEntry;
  px_swift: AffixContentEntry;
  px_silent: AffixContentEntry;
  px_phantom: AffixContentEntry;
  sx_of_the_warrior: AffixContentEntry;
  sx_of_the_reaver: AffixContentEntry;
  sx_of_butchery: AffixContentEntry;
  sx_of_slaughter: AffixContentEntry;
  sx_of_endurance: AffixContentEntry;
  sx_of_the_bulwark: AffixContentEntry;
  sx_of_immortality: AffixContentEntry;
  sx_of_dark_whispers: AffixContentEntry;
  sx_of_the_void: AffixContentEntry;
  sx_of_consumption: AffixContentEntry;
  sx_of_shadows: AffixContentEntry;
  sx_of_silent_death: AffixContentEntry;
  sx_of_authority: AffixContentEntry;
  sx_of_command: AffixContentEntry;
}

export interface ItemSetContentEntry {
  name: string;
  description: string;
  /** Aligned by index with the set's `tiers` array in sets.ts. */
  tiers: string[];
}

export interface ItemSetsContent {
  void_lord: ItemSetContentEntry;
  bloodforged: ItemSetContentEntry;
  whisperveil: ItemSetContentEntry;
  warbringer: ItemSetContentEntry;
  ancient_sith: ItemSetContentEntry;
}
