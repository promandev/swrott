import { describe, expect, it } from "vitest";
import {
  resolveAttack,
  hitProbability,
  estimateDamageBand,
  type AttackInput,
  type DefenseInput,
} from "@/game/engine/combat/damage";
import { RNG } from "@/game/engine/rng/rng";

describe("damage pipeline", () => {
  it("is deterministic for a given seed", () => {
    const make = () =>
      resolveAttack(
        {
          skillBase: 30,
          weaponDamage: 20,
          strengthScaling: 16,
          type: "physical",
          attackerStance: "aggressive",
          attackerCritChance: 0.25,
          attackerCritDamageBonus: 0.5,
          attackerAccuracy: 0.95,
        },
        {
          armor: 200,
          resistances: { physical: 0.1 },
          defenderStance: "defensive",
          dodgeChance: 0.05,
        },
        new RNG("seed-a"),
      );
    const a = make();
    const b = make();
    expect(a).toEqual(b);
  });

  it("respects misses when accuracy is 0", () => {
    const r = resolveAttack(
      {
        skillBase: 100,
        weaponDamage: 0,
        strengthScaling: 0,
        type: "physical",
        attackerStance: "precision",
        attackerCritChance: 0,
        attackerCritDamageBonus: 0,
        attackerAccuracy: 0,
      },
      {
        armor: 0,
        resistances: {},
        defenderStance: "aggressive",
        dodgeChance: 0,
      },
      new RNG("x"),
    );
    expect(r.isMiss).toBe(true);
    expect(r.finalDamage).toBe(0);
  });

  it("exposes the KOTOR-style d20 roll on resolved attacks", () => {
    const r = resolveAttack(
      {
        skillBase: 10,
        weaponDamage: 5,
        strengthScaling: 5,
        type: "physical",
        attackerStance: "precision",
        attackerCritChance: 0.1,
        attackerCritDamageBonus: 0.5,
        attackerAccuracy: 0.85,
      },
      {
        armor: 20,
        resistances: {},
        defenderStance: "defensive",
        dodgeChance: 0.1,
      },
      new RNG("d20-seed"),
    );
    expect(r.d20).toBeDefined();
    expect(r.d20!.roll).toBeGreaterThanOrEqual(1);
    expect(r.d20!.roll).toBeLessThanOrEqual(20);
    // Defense = 10 (base) + 2 (defensive stance) + 2 (10% dodge → +2)
    expect(r.d20!.defense).toBe(14);
    // Hit/miss must agree with the roll vs defense (nat 1/20 override)
    const total = r.d20!.roll + r.d20!.attackBonus;
    const landed = !r.isMiss && !r.isDodged;
    if (r.d20!.isNat1) expect(landed).toBe(false);
    else if (r.d20!.isNat20) expect(landed).toBe(true);
    else expect(landed).toBe(total >= r.d20!.defense);
  });

  it("natural 20 always crits", () => {
    // Scan seeds until a natural 20 appears, then assert it both hits and crits.
    for (let i = 0; i < 200; i++) {
      const r = resolveAttack(
        {
          skillBase: 10,
          weaponDamage: 5,
          strengthScaling: 0,
          type: "physical",
          attackerStance: "precision",
          attackerCritChance: 0,
          attackerCritDamageBonus: 0,
          attackerAccuracy: 0.5,
        },
        { armor: 0, resistances: {}, defenderStance: "defensive", dodgeChance: 0.3 },
        new RNG(`nat20-${i}`),
      );
      if (r.d20?.isNat20) {
        expect(r.isMiss).toBe(false);
        expect(r.isDodged).toBe(false);
        expect(r.isCrit).toBe(true);
        return;
      }
    }
    throw new Error("no natural 20 found in 200 seeds — RNG suspicious");
  });

  it("never deals negative damage and floors output", () => {
    const r = resolveAttack(
      {
        skillBase: 10,
        weaponDamage: 5,
        strengthScaling: 5,
        type: "fire",
        attackerStance: "defensive",
        attackerCritChance: 0,
        attackerCritDamageBonus: 0,
        attackerAccuracy: 1,
      },
      {
        armor: 9999,
        resistances: { fire: 0.85 },
        defenderStance: "defensive",
        dodgeChance: 0,
      },
      new RNG("y"),
    );
    expect(r.finalDamage).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(r.finalDamage)).toBe(true);
  });
});

describe("combat-UI previews", () => {
  const attack: AttackInput = {
    skillBase: 30,
    weaponDamage: 20,
    strengthScaling: 16,
    type: "physical",
    attackerStance: "precision",
    attackerCritChance: 0.1,
    attackerCritDamageBonus: 0.5,
    attackerAccuracy: 0.85,
  };
  const defense: DefenseInput = {
    armor: 120,
    resistances: {},
    defenderStance: "defensive",
    dodgeChance: 0.1,
  };

  it("hitProbability matches resolveAttack's empirical hit rate", () => {
    const p = hitProbability(attack, defense);
    let landed = 0;
    const N = 4000;
    for (let i = 0; i < N; i++) {
      const r = resolveAttack(attack, defense, new RNG(`hp-${i}`));
      if (!r.isMiss && !r.isDodged) landed++;
    }
    const empirical = landed / N;
    expect(Math.abs(empirical - p)).toBeLessThan(0.04);
  });

  it("zero accuracy is a guaranteed miss", () => {
    expect(hitProbability({ ...attack, attackerAccuracy: 0 }, defense)).toBe(0);
  });

  it("negative resistance amplifies damage as a vulnerability", () => {
    const base: AttackInput = {
      skillBase: 40, weaponDamage: 0, strengthScaling: 0, type: "force",
      attackerStance: "precision", attackerCritChance: 0, attackerCritDamageBonus: 0,
      attackerAccuracy: 1,
    };
    const neutral = estimateDamageBand(base, {
      armor: 0, resistances: {}, defenderStance: "precision", dodgeChance: 0,
    });
    const vulnerable = estimateDamageBand(base, {
      armor: 0, resistances: { force: -0.3 }, defenderStance: "precision", dodgeChance: 0,
    });
    // -0.3 resistance => (1 - (-0.3)) = 1.3x damage.
    expect(vulnerable.max).toBeGreaterThan(neutral.max);
  });

  it("estimateDamageBand brackets non-crit hits and bounds crits above max", () => {
    const band = estimateDamageBand(attack, defense);
    expect(band.min).toBeLessThanOrEqual(band.max);
    expect(band.crit).toBeGreaterThanOrEqual(band.max);
    for (let i = 0; i < 1500; i++) {
      const r = resolveAttack(attack, defense, new RNG(`band-${i}`));
      if (r.isMiss || r.isDodged || r.finalDamage === 0) continue;
      if (!r.isCrit) {
        // Allow a 1-point rounding slack on each edge of the variance band.
        expect(r.finalDamage).toBeGreaterThanOrEqual(band.min - 1);
        expect(r.finalDamage).toBeLessThanOrEqual(band.max + 1);
      } else {
        expect(r.finalDamage).toBeLessThanOrEqual(band.crit + 1);
      }
    }
  });
});
