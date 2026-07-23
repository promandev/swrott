/**
 * Item lineage (Complementary Loop 1 / Idea CL1-C).
 *
 * Mythic and ancient_sith items track a chain of previous wielders.
 * When dropped from a major boss, the lineage entry of that boss is
 * appended. Each lineage entry grants a tiny passive while equipped
 * (Diablo-style "annointed" items).
 *
 *   bossId       passive
 *   ─────────────────────────────────────────────
 *   marka_ragnos  +5% dmg vs corrupted enemies
 *   ludo_kressh   +3% armor
 *   naga_sadow    +5% burn damage
 *   exar_kun      +5% AoE damage
 *   freedon_nadd  +5 max HP per level
 *   ajunta_pall   +5% bleed damage
 *   tulak_hord    +5% crit dmg
 */

export interface LineageEntry {
  bossId: string;
  bossName: string;
  passiveSummary: string;
  /** Effect dispatch key — resolved by the buff engine. */
  effectId: string;
}

export const LINEAGE_REGISTRY: Record<string, LineageEntry> = {
  marka_ragnos: {  bossId: "marka_ragnos", bossName: "Marka Ragnos",
    passiveSummary: "+5% damage vs corrupted enemies.",       effectId: "lineage_vs_corrupted_5" },
  ludo_kressh:  {  bossId: "ludo_kressh",  bossName: "Ludo Kressh",
    passiveSummary: "+3% armor.",                              effectId: "lineage_armor_3" },
  naga_sadow:   {  bossId: "naga_sadow",   bossName: "Naga Sadow",
    passiveSummary: "+5% burn damage.",                        effectId: "lineage_burn_5" },
  exar_kun:     {  bossId: "exar_kun",     bossName: "Exar Kun",
    passiveSummary: "+5% AoE damage.",                         effectId: "lineage_aoe_5" },
  freedon_nadd: {  bossId: "freedon_nadd", bossName: "Freedon Nadd",
    passiveSummary: "+5 max HP per level.",                    effectId: "lineage_hp_per_level_5" },
  ajunta_pall:  {  bossId: "ajunta_pall",  bossName: "Ajunta Pall",
    passiveSummary: "+5% bleed damage.",                       effectId: "lineage_bleed_5" },
  tulak_hord:   {  bossId: "tulak_hord",   bossName: "Tulak Hord",
    passiveSummary: "+5% crit damage.",                        effectId: "lineage_crit_dmg_5" },
};

export function lineageEntry(bossId: string): LineageEntry | undefined {
  return LINEAGE_REGISTRY[bossId];
}
