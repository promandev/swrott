import type { CharacterSnapshot } from "../save/types";
import { getSkill } from "../../data/schemas/skill-registry";
import { getBaselineSkills } from "../../data/talents/talent-registry";
import { summarizeGear, resolveEquipped, getEquippedItems } from "../items/equipment";
import { getActiveSetBonuses } from "../../data/items/sets";
import { resolveItemEffects } from "../items/item-effects";
import { computeMaxHP, computeMaxForce } from "../progression/stats";
import { computeTalentModifiers, toCombatMods, type CombatTalentMods } from "../progression/talent-effects";
import type { Stance } from "./damage";
import type { StatusEffect } from "../../data/schemas";

/**
 * Build the player payload for `useCombatStore.startCombat` from the
 * persistent character snapshot.
 *
 * Skills: the talent tree is the gate. The available pool is the class's
 * baseline skills plus everything talents have unlocked. The combat bar is
 * the player's chosen loadout (`favoriteSkills`) intersected with that pool,
 * capped at the talent-derived slot count (4–6). With no explicit loadout we
 * auto-fill sensible defaults so combat always works.
 *
 * Gear + talents both contribute armor, stats, HP/FP and combat modifiers.
 */

const BASE_ARMOR = 20;
const UNARMED_DAMAGE = 10;

export interface CombatPlayerPayload {
  name: string;
  primary: CharacterSnapshot["primary"];
  hp: number;
  maxHp: number;
  fp: number;
  maxFp: number;
  armor: number;
  weaponDamage: number;
  /** Status the equipped weapon inflicts on a successful hit (if any). */
  weaponOnHit?: { effect: StatusEffect; chance: number; duration: number };
  /** Per-damage-type bonus from set effects (e.g. void_lord +10% force). */
  damageOfType?: Record<string, number>;
  /** Flat dodge-chance bonus (0..1) from set effects (e.g. whisperveil). */
  dodgeBonus?: number;
  /** Force-cost reduction (0..1) from set effects (e.g. void_lord 6pc). */
  fpCostReduction?: number;
  /** Named weapon/crystal effects: heal/Force on kill, splash + status on crit, per-turn regen. */
  itemEffects?: { onKillHealPct: number; onKillFpPct: number; onCritSplashPct: number; onCritStatus: string[]; hpRegen: number; fpRegen: number };
  skillIds: string[];
  stance: Stance;
  talentMods: CombatTalentMods;
}

/**
 * Resolve which skills appear on the combat bar.
 * Exported so the loadout UI can preview the exact same result.
 */
export function resolveCombatLoadout(character: CharacterSnapshot): {
  available: string[];
  slots: number;
  skillIds: string[];
} {
  const mods = computeTalentModifiers(character);
  const baseline = getBaselineSkills(character.classId);

  const available: string[] = [];
  const seen = new Set<string>();
  for (const id of [...baseline, ...mods.unlockedSkillIds]) {
    if (getSkill(id) && !seen.has(id)) {
      seen.add(id);
      available.push(id);
    }
  }
  const availableSet = new Set(available);
  const slots = mods.loadoutSlots;

  const chosen = character.favoriteSkills.filter((id) => availableSet.has(id));

  let skillIds: string[];
  if (chosen.length > 0) {
    // Respect the player's explicit picks (capped to slots).
    skillIds = chosen.slice(0, slots);
  } else {
    // No loadout set yet → auto-fill defaults: baseline first, then unlocks.
    skillIds = available.slice(0, slots);
  }

  return { available, slots, skillIds };
}

export function buildCombatPlayer(character: CharacterSnapshot): CombatPlayerPayload {
  const level = Math.max(1, character.level);
  const mods = computeTalentModifiers(character);
  const { skillIds } = resolveCombatLoadout(character);

  const gear = summarizeGear(character);

  // Set bonuses — wearing multiple pieces of the same set grants tiered
  // effects (see data/items/sets.ts). Previously authored but never applied;
  // here we fold the stat/combat effects into the combat payload (type-specific
  // damage, dodge and fp-cost effects aren't modelled in the player attack yet).
  const sb = { strength: 0, agility: 0, endurance: 0, force: 0, influence: 0, armor: 0, hp: 0, fp: 0, critChance: 0, critDamage: 0, damagePercent: 0, lifestealPct: 0, dodgeBonus: 0, fpCostReduction: 0 };
  const sbDamageOfType: Record<string, number> = {};
  const equippedItems = getEquippedItems(character);
  const setIds = equippedItems.map((e) => e.item.setId).filter((s): s is string => Boolean(s));
  // Named item effects (onHit/onKill/onCrit/onEquip) → concrete mechanics.
  const itemFx = resolveItemEffects(
    equippedItems.flatMap((e) => [e.item.onHitEffectId, e.item.onKillEffectId, e.item.onCritEffectId, e.item.onEquipEffectId]),
  );
  for (const tier of getActiveSetBonuses(setIds)) {
    const e = tier.effect;
    sb.strength += e.strength ?? 0;
    sb.agility += e.agility ?? 0;
    sb.endurance += e.endurance ?? 0;
    sb.force += e.force ?? 0;
    sb.influence += e.influence ?? 0;
    sb.armor += e.armor ?? 0;
    sb.hp += e.hp ?? 0;
    sb.fp += e.forcePoints ?? 0;
    sb.critChance += e.critBonus ?? 0;
    sb.critDamage += (e.critDamageBonus ?? 0) * 100;
    sb.damagePercent += (e.damageMultiplier ?? 0) * 100;
    sb.lifestealPct += (e.lifesteal ?? 0) * 100;
    sb.dodgeBonus += e.dodgeBonus ?? 0;
    sb.fpCostReduction += e.fpCostReduction ?? 0;
    for (const [t, v] of Object.entries(e.damageOfType ?? {})) sbDamageOfType[t] = (sbDamageOfType[t] ?? 0) + (v ?? 0);
  }

  const primary = {
    ...character.primary,
    strength: character.primary.strength + gear.stats.strength + mods.strength + sb.strength,
    agility: character.primary.agility + gear.stats.agility + mods.agility + sb.agility,
    endurance: character.primary.endurance + gear.stats.endurance + mods.endurance + sb.endurance,
    force: character.primary.force + gear.stats.force + mods.force + sb.force,
    influence: character.primary.influence + gear.stats.influence + mods.influence + sb.influence,
  };

  const maxHp = computeMaxHP(primary.endurance, level) + gear.hpBonus + mods.maxHp + sb.hp;
  const maxFp = computeMaxForce(primary.force, level) + gear.fpBonus + mods.maxFp + sb.fp;

  // The equipped main-hand weapon may inflict a status on hit (e.g. a saber
  // crystal that causes bleed). This was previously inert data.
  const mainHand = resolveEquipped(character, "main_hand")?.item;
  const weaponOnHit = mainHand?.onHitStatus
    ? {
        effect: mainHand.onHitStatus.effect,
        chance: mainHand.onHitStatus.chance,
        duration: mainHand.onHitStatus.duration,
      }
    : undefined;

  const baseMods = toCombatMods(mods);
  const talentMods = {
    ...baseMods,
    critChance: baseMods.critChance + sb.critChance,
    critDamage: baseMods.critDamage + sb.critDamage,
    damagePercent: baseMods.damagePercent + sb.damagePercent,
    // onHit lifesteal + armor-pierce reuse the existing combat mechanics.
    lifestealPct: baseMods.lifestealPct + sb.lifestealPct + itemFx.onHitLifestealPct,
    armorPiercePct: baseMods.armorPiercePct + itemFx.armorPiercePct,
  };
  const itemEffects =
    itemFx.onKillHealPct > 0 || itemFx.onKillFpPct > 0 || itemFx.onCritSplashPct > 0 || itemFx.onCritStatus.length > 0 || itemFx.hpRegen > 0 || itemFx.fpRegen > 0
      ? { onKillHealPct: itemFx.onKillHealPct, onKillFpPct: itemFx.onKillFpPct, onCritSplashPct: itemFx.onCritSplashPct, onCritStatus: itemFx.onCritStatus, hpRegen: itemFx.hpRegen, fpRegen: itemFx.fpRegen }
      : undefined;

  return {
    name: character.name,
    primary,
    hp: Math.min(Math.max(1, character.hp), maxHp),
    maxHp,
    fp: Math.min(character.forcePoints, maxFp),
    maxFp,
    armor: BASE_ARMOR + gear.armor + mods.armor + sb.armor,
    weaponDamage: gear.weaponDamage > 0 ? gear.weaponDamage : UNARMED_DAMAGE,
    weaponOnHit,
    damageOfType: Object.keys(sbDamageOfType).length > 0 ? sbDamageOfType : undefined,
    dodgeBonus: sb.dodgeBonus > 0 ? sb.dodgeBonus : undefined,
    fpCostReduction: sb.fpCostReduction > 0 ? sb.fpCostReduction : undefined,
    itemEffects,
    skillIds,
    stance: "aggressive",
    talentMods,
  };
}
