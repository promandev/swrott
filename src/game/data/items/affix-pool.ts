import type { AffixInput } from "../schemas/affix";

/**
 * Affix pool — prefixes (start of name) and suffixes (end of name).
 *
 * Example combined name:
 *   [Crimson] [Bloodforged Saber] [of the Reaver]
 *     prefix       base item        suffix
 *
 * Each affix has a tier (1=worst → 5=best). When rolled, the RNG picks an
 * affix matching item level, then rolls a numeric value within bounds.
 */

export const PREFIXES: AffixInput[] = [
  // ── Offense prefixes ──────────────────────────────────────────────
  { id: "px_sharp",       name: "Sharp",        type: "prefix", tier: 1, tag: "offense",
    effect: { damageBonus: 3 } },
  { id: "px_keen",        name: "Keen",         type: "prefix", tier: 2, tag: "offense",
    effect: { damageBonus: 6, critBonus: 3 } },
  { id: "px_brutal",      name: "Brutal",       type: "prefix", tier: 3, tag: "offense",
    effect: { damageBonus: 10, critDamageBonus: 0.15 } },
  { id: "px_savage",      name: "Savage",       type: "prefix", tier: 4, tag: "offense",
    effect: { damageMultiplier: 0.15, critBonus: 5 } },
  { id: "px_devastating", name: "Devastating",  type: "prefix", tier: 5, tag: "offense",
    effect: { damageMultiplier: 0.25, critDamageBonus: 0.30 } },
  { id: "px_crimson",     name: "Crimson",      type: "prefix", tier: 3, tag: "offense",
    effect: { damageBonus: 7, onHitStatus: { effect: "bleed", chance: 0.25, duration: 3 } } },
  { id: "px_blazing",     name: "Blazing",      type: "prefix", tier: 3, tag: "offense",
    effect: { damageBonus: 5, onHitStatus: { effect: "burn", chance: 0.25, duration: 3 } } },
  { id: "px_voltaic",     name: "Voltaic",      type: "prefix", tier: 3, tag: "offense",
    effect: { damageBonus: 5, onHitStatus: { effect: "shock", chance: 0.25, duration: 2 } } },
  { id: "px_venomous",    name: "Venomous",     type: "prefix", tier: 2, tag: "offense",
    effect: { damageBonus: 3, onHitStatus: { effect: "poison", chance: 0.30, duration: 3 } } },

  // ── Defense prefixes ──────────────────────────────────────────────
  { id: "px_sturdy",      name: "Sturdy",       type: "prefix", tier: 1, tag: "defense",
    effect: { armor: 4 } },
  { id: "px_fortified",   name: "Fortified",    type: "prefix", tier: 2, tag: "defense",
    effect: { armor: 8, hp: 15 } },
  { id: "px_warded",      name: "Warded",       type: "prefix", tier: 3, tag: "defense",
    effect: { armor: 12, resistance: { force: 0.10 } } },
  { id: "px_impervious",  name: "Impervious",   type: "prefix", tier: 4, tag: "defense",
    effect: { armor: 18, hp: 40, resistance: { energy: 0.15 } } },
  { id: "px_unbreakable", name: "Unbreakable",  type: "prefix", tier: 5, tag: "defense",
    effect: { armor: 25, hp: 80, thorns: 0.10 } },

  // ── Force prefixes ────────────────────────────────────────────────
  { id: "px_attuned",     name: "Attuned",      type: "prefix", tier: 2, tag: "force",
    effect: { force: 2 } },
  { id: "px_focused",     name: "Focused",      type: "prefix", tier: 3, tag: "force",
    effect: { force: 4, forcePoints: 15 } },
  { id: "px_resonant",    name: "Resonant",     type: "prefix", tier: 4, tag: "force",
    effect: { force: 6, fpRegen: 3 } },
  { id: "px_ascendant",   name: "Ascendant",    type: "prefix", tier: 5, tag: "force",
    effect: { force: 9, forcePoints: 30, fpCostReduction: 0.10 } },

  // ── Agility / Utility prefixes ───────────────────────────────────
  { id: "px_swift",       name: "Swift",        type: "prefix", tier: 2, tag: "utility",
    effect: { agility: 2 } },
  { id: "px_silent",      name: "Silent",       type: "prefix", tier: 3, tag: "utility",
    effect: { agility: 4, dodgeBonus: 0.05 } },
  { id: "px_phantom",     name: "Phantom",      type: "prefix", tier: 5, tag: "utility",
    effect: { agility: 7, dodgeBonus: 0.12, critBonus: 8 } },
];

export const SUFFIXES: AffixInput[] = [
  // ── Generic stat suffixes ─────────────────────────────────────────
  { id: "sx_of_the_warrior",   name: "of the Warrior",   type: "suffix", tier: 2, tag: "offense",
    effect: { strength: 3 } },
  { id: "sx_of_the_reaver",    name: "of the Reaver",    type: "suffix", tier: 4, tag: "offense",
    effect: { strength: 6, lifesteal: 0.05 } },
  { id: "sx_of_butchery",      name: "of Butchery",      type: "suffix", tier: 3, tag: "offense",
    effect: { critDamageBonus: 0.20 } },
  { id: "sx_of_slaughter",     name: "of Slaughter",     type: "suffix", tier: 5, tag: "offense",
    effect: { damageMultiplier: 0.20, lifesteal: 0.08 } },

  // ── Defense suffixes ──────────────────────────────────────────────
  { id: "sx_of_endurance",     name: "of Endurance",     type: "suffix", tier: 2, tag: "defense",
    effect: { endurance: 3, hp: 25 } },
  { id: "sx_of_the_bulwark",   name: "of the Bulwark",   type: "suffix", tier: 4, tag: "defense",
    effect: { armor: 15, hp: 50 } },
  { id: "sx_of_immortality",   name: "of Immortality",   type: "suffix", tier: 5, tag: "defense",
    effect: { hp: 120, hpRegen: 4 } },

  // ── Force suffixes ────────────────────────────────────────────────
  { id: "sx_of_dark_whispers", name: "of Dark Whispers", type: "suffix", tier: 3, tag: "force",
    effect: { force: 3, corruption: 1 } as { force: number } },
  { id: "sx_of_the_void",      name: "of the Void",      type: "suffix", tier: 4, tag: "force",
    effect: { force: 5, damageOfType: { force: 0.20 } } },
  { id: "sx_of_consumption",   name: "of Consumption",   type: "suffix", tier: 5, tag: "force",
    effect: { force: 8, forcesteal: 0.10 } },

  // ── Agility suffixes ──────────────────────────────────────────────
  { id: "sx_of_shadows",       name: "of Shadows",       type: "suffix", tier: 3, tag: "utility",
    effect: { agility: 4, dodgeBonus: 0.06 } },
  { id: "sx_of_silent_death",  name: "of Silent Death",  type: "suffix", tier: 5, tag: "utility",
    effect: { agility: 6, critDamageBonus: 0.35, dodgeBonus: 0.08 } },

  // ── Social / Influence ────────────────────────────────────────────
  { id: "sx_of_authority",     name: "of Authority",     type: "suffix", tier: 3, tag: "social",
    effect: { influence: 3 } },
  { id: "sx_of_command",       name: "of Command",       type: "suffix", tier: 5, tag: "social",
    effect: { influence: 6, accuracyBonus: 0.08 } },
];

export const ALL_AFFIXES = [...PREFIXES, ...SUFFIXES];
export const AFFIX_BY_ID = new Map(ALL_AFFIXES.map((a) => [a.id, a]));
