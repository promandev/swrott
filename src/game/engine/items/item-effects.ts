/**
 * Named item effects (onHit/onKill/onCrit/onEquip EffectId on items) resolved
 * into concrete combat mechanics. These ids were referenced by the handcrafted
 * legendaries/crystals but nothing consumed them — so the game's best weapons
 * had flavour-only specials. This maps the impactful ones to real mechanics;
 * exotic passives (cheat-death, foresight, regen auras) remain unmodelled.
 */

export interface ItemEffectSpec {
  /** % of damage dealt healed back (folds into the lifesteal mechanic). */
  onHitLifestealPct: number;
  /** Passive armor penetration %, added to talent armor-pierce. */
  armorPiercePct: number;
  /** % of max HP healed when the wielder lands a kill. */
  onKillHealPct: number;
  /** % of max FP restored when the wielder lands a kill. */
  onKillFpPct: number;
  /** % of a critical hit's damage splashed to every other living enemy. */
  onCritSplashPct: number;
  /** Status effects applied to the target on a critical hit. */
  onCritStatus: string[];
  /** Flat HP regenerated at the start of each of the wielder's rounds. */
  hpRegen: number;
  /** Flat Force regenerated at the start of each of the wielder's rounds. */
  fpRegen: number;
}

const EMPTY: ItemEffectSpec = {
  onHitLifestealPct: 0, armorPiercePct: 0, onKillHealPct: 0, onKillFpPct: 0, onCritSplashPct: 0, onCritStatus: [], hpRegen: 0, fpRegen: 0,
};

/** Per-effect-id contributions (only the mechanics we model). */
const EFFECTS: Record<string, Partial<ItemEffectSpec>> = {
  // ── Status on crit ──────────────────────────────────────────────────
  ancient_sith_crystal_burn: { onCritStatus: ["burn"] },
  shadowfang_marked_prey: { onCritStatus: ["marked"] },
  // ── Lifesteal / drain (on hit) ──────────────────────────────────────
  crimson_reaver_lifesteal: { onHitLifestealPct: 8 },
  lifedrinker_crystal_lifesteal: { onHitLifestealPct: 6 },
  heart_of_malachor_drain: { onHitLifestealPct: 5 },
  nihilus_charm_drain: { onHitLifestealPct: 4 },
  // ── Armor pierce (passive) ──────────────────────────────────────────
  void_crystal_armor_pierce: { armorPiercePct: 25 },
  // ── Devour on kill (heal / Force) ───────────────────────────────────
  hunger_of_nihilus_devour: { onKillHealPct: 0.15, onKillFpPct: 0.10 },
  staff_of_nihilus_drain: { onKillFpPct: 0.25 },
  empty_saber_feeds: { onKillHealPct: 0.12 },
  xerev_devour_soul: { onKillHealPct: 0.12, onKillFpPct: 0.12 },
  // ── Critical detonations (splash) ───────────────────────────────────
  blackstar_void_implosion: { onCritSplashPct: 0.40 },
  silent_death_execute: { onCritSplashPct: 0.25 },
  // ── Passive regeneration (on equip) ─────────────────────────────────
  voidweaver_fp_regen: { fpRegen: 12 },
  heart_of_malachor_aura: { hpRegen: 8 },
  trayas_codex_insight: { fpRegen: 6 },
  endless_fury_rage_regen: { hpRegen: 6 },
};

/** Human-readable summary per effect id, for item tooltips. */
const EFFECT_LABELS: Record<string, string> = {
  crimson_reaver_lifesteal: "Cura el 8% del daño infligido",
  lifedrinker_crystal_lifesteal: "Cura el 6% del daño infligido",
  heart_of_malachor_drain: "Cura el 5% del daño infligido",
  nihilus_charm_drain: "Cura el 4% del daño infligido",
  void_crystal_armor_pierce: "Ignora el 25% de la armadura enemiga",
  hunger_of_nihilus_devour: "Al matar: +15% de PV, +10% de Fuerza",
  staff_of_nihilus_drain: "Al matar: +25% de Fuerza",
  empty_saber_feeds: "Al matar: +12% de PV",
  xerev_devour_soul: "Al matar: +12% de PV y Fuerza",
  blackstar_void_implosion: "Los críticos salpican un 40% de daño a todos los enemigos",
  silent_death_execute: "Los críticos salpican un 25% de daño a todos los enemigos",
  ancient_sith_crystal_burn: "Los críticos prenden fuego al objetivo",
  shadowfang_marked_prey: "Los críticos marcan al objetivo",
  voidweaver_fp_regen: "Regenera 12 de Fuerza cada turno",
  heart_of_malachor_aura: "Regenera 8 de PV cada turno",
  trayas_codex_insight: "Regenera 6 de Fuerza cada turno",
  endless_fury_rage_regen: "Regenera 6 de PV cada turno",
};

/** Readable mechanic lines for an item's named effects (for the detail panel). */
export function describeItemEffects(item: {
  onHitEffectId?: string; onKillEffectId?: string; onCritEffectId?: string; onEquipEffectId?: string;
}): string[] {
  const ids = [item.onHitEffectId, item.onKillEffectId, item.onCritEffectId, item.onEquipEffectId];
  const lines: string[] = [];
  for (const id of ids) {
    if (id && EFFECT_LABELS[id] && !lines.includes(EFFECT_LABELS[id])) lines.push(EFFECT_LABELS[id]);
  }
  return lines;
}

/** Merge the effects of a set of effect ids into one spec. */
export function resolveItemEffects(effectIds: Array<string | undefined>): ItemEffectSpec {
  // Fresh onCritStatus array — spreading EMPTY would share its reference and
  // leak statuses across calls (a nasty global-state bug).
  const spec: ItemEffectSpec = { ...EMPTY, onCritStatus: [] };
  for (const id of effectIds) {
    if (!id) continue;
    const e = EFFECTS[id];
    if (!e) continue;
    spec.onHitLifestealPct += e.onHitLifestealPct ?? 0;
    spec.armorPiercePct += e.armorPiercePct ?? 0;
    spec.onKillHealPct += e.onKillHealPct ?? 0;
    spec.onKillFpPct += e.onKillFpPct ?? 0;
    spec.onCritSplashPct += e.onCritSplashPct ?? 0;
    if (e.onCritStatus) spec.onCritStatus.push(...e.onCritStatus);
    spec.hpRegen += e.hpRegen ?? 0;
    spec.fpRegen += e.fpRegen ?? 0;
  }
  return spec;
}
