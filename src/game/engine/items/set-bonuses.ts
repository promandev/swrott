/**
 * Set bonuses (Complementary Loop 1 / Idea CL1-D).
 *
 * Wearing N pieces of the same set grants escalating bonuses. Sets exist
 * across rarities — common low-tier "training" sets up to ancient_sith
 * apocalyptic sets.
 */

export interface SetBonusTier {
  pieces: number;
  description: string;
  effectId: string;
}

export interface ItemSet {
  id: string;
  name: string;
  /** Item IDs that count toward this set. */
  pieceItemIds: string[];
  tiers: SetBonusTier[];
}

export const ITEM_SETS: ItemSet[] = [
  {
    id: "set_acolyte_training",
    name: "Acolyte Training Garb",
    pieceItemIds: ["armor_acolyte_robe", "armor_acolyte_gloves", "armor_acolyte_boots"],
    tiers: [
      { pieces: 2, description: "+5% XP gain.",                  effectId: "set_xp_5" },
      { pieces: 3, description: "+10% XP, +1 talent point.",     effectId: "set_xp_10_tp_1" },
    ],
  },
  {
    id: "set_marauder_carnage",
    name: "Carnage Plate",
    pieceItemIds: ["armor_carnage_helm", "armor_carnage_chest", "armor_carnage_gauntlets", "armor_carnage_greaves", "armor_carnage_pauldrons"],
    tiers: [
      { pieces: 2, description: "+10% melee damage.",                              effectId: "set_melee_10" },
      { pieces: 3, description: "+15% bleed damage.",                              effectId: "set_bleed_15" },
      { pieces: 4, description: "Critical hits grant +5% damage for 3 turns.",     effectId: "set_crit_buff" },
      { pieces: 5, description: "On kill: +20% damage next attack.",               effectId: "set_kill_damage" },
    ],
  },
  {
    id: "set_inquisitor_madness",
    name: "Madness Vestments",
    pieceItemIds: ["robe_madness_hood", "robe_madness_chest", "robe_madness_sash", "robe_madness_sleeves", "robe_madness_ringlet"],
    tiers: [
      { pieces: 2, description: "Force skills cost -10%.",                         effectId: "set_force_cost_10" },
      { pieces: 3, description: "+20% corrupted damage.",                          effectId: "set_corrupt_20" },
      { pieces: 4, description: "Stuns and fears last +1 turn.",                   effectId: "set_cc_plus_1" },
      { pieces: 5, description: "Nihilus Hunger heals you for 50% of damage.",     effectId: "set_nihilus_lifesteal" },
    ],
  },
  {
    id: "set_assassin_shadowblade",
    name: "Shadowblade Garments",
    pieceItemIds: ["shadow_mask", "shadow_chestguard", "shadow_blades", "shadow_boots", "shadow_belt"],
    tiers: [
      { pieces: 2, description: "+10% dodge.",                                     effectId: "set_dodge_10" },
      { pieces: 3, description: "Backstab damage +30%.",                           effectId: "set_backstab_30" },
      { pieces: 4, description: "First strike each combat is a guaranteed crit.",  effectId: "set_first_crit" },
      { pieces: 5, description: "Vanish refreshes on kill.",                       effectId: "set_vanish_reset" },
    ],
  },
  {
    id: "set_dread_lord",
    name: "Vestments of the Dread Lord",
    pieceItemIds: ["dread_crown", "dread_robe", "dread_sigil", "dread_gauntlets", "dread_boots", "dread_mantle"],
    tiers: [
      { pieces: 2, description: "+10% damage to all.",                             effectId: "set_dmg_10" },
      { pieces: 3, description: "+15% all damage, +5% crit chance.",               effectId: "set_dread_15_5" },
      { pieces: 4, description: "Fear an enemy on combat start.",                  effectId: "set_open_fear" },
      { pieces: 5, description: "+25% all damage when below 50% HP.",              effectId: "set_low_hp_25" },
      { pieces: 6, description: "Resurrect once per dungeon at 50% HP.",           effectId: "set_resurrect" },
    ],
  },
];

export function findSetByPieceId(itemId: string): ItemSet | undefined {
  return ITEM_SETS.find((s) => s.pieceItemIds.includes(itemId));
}

/** Given a list of equipped itemIds, return active set tiers. */
export function activeSetBonuses(equippedItemIds: readonly string[]): Array<{ set: ItemSet; tier: SetBonusTier }> {
  const result: Array<{ set: ItemSet; tier: SetBonusTier }> = [];
  for (const set of ITEM_SETS) {
    const count = equippedItemIds.filter((id) => set.pieceItemIds.includes(id)).length;
    for (const tier of set.tiers) {
      if (count >= tier.pieces) result.push({ set, tier });
    }
  }
  return result;
}
