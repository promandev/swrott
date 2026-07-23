import { describe, it, expect } from "vitest";
import { resolveItemEffects } from "../item-effects";
import { buildCombatPlayer } from "../../combat/player-loadout";
import { createNewCharacter } from "../../progression/new-game";

/** Named legendary/crystal effects → real combat mechanics. */

describe("resolveItemEffects", () => {
  it("merges known effect ids and ignores unknown/undefined", () => {
    const fx = resolveItemEffects(["crimson_reaver_lifesteal", "hunger_of_nihilus_devour", undefined, "not_a_real_effect"]);
    expect(fx.onHitLifestealPct).toBe(8);
    expect(fx.onKillHealPct).toBeCloseTo(0.15);
    expect(fx.onKillFpPct).toBeCloseTo(0.10);
  });

  it("returns an all-zero spec for no effects", () => {
    const fx = resolveItemEffects([undefined, undefined]);
    expect(fx.onHitLifestealPct).toBe(0);
    expect(fx.onCritSplashPct).toBe(0);
  });

  it("maps passive regen and on-crit status effects", () => {
    const fx = resolveItemEffects(["voidweaver_fp_regen", "ancient_sith_crystal_burn"]);
    expect(fx.fpRegen).toBe(12);
    expect(fx.onCritStatus).toContain("burn");
  });
});

describe("item effects in the combat payload", () => {
  it("an on-hit lifesteal weapon raises lifesteal", () => {
    const c = createNewCharacter("Test", "marauder");
    c.equipment = { main_hand: "legend_crimson_reaver" };
    const p = buildCombatPlayer(c);
    expect(p.talentMods.lifestealPct).toBeGreaterThanOrEqual(8);
  });

  it("an on-kill devour weapon exposes its kill mechanics", () => {
    const c = createNewCharacter("Test", "marauder");
    c.equipment = { main_hand: "legend_hunger_of_nihilus" };
    const p = buildCombatPlayer(c);
    expect(p.itemEffects?.onKillHealPct ?? 0).toBeGreaterThan(0);
  });

  it("a plain loadout has no special item effects", () => {
    const p = buildCombatPlayer(createNewCharacter("Test", "marauder"));
    expect(p.itemEffects).toBeUndefined();
  });
});
