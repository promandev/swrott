import { describe, it, expect } from "vitest";
import { huntedLevel, encounterDangerMultiplier, isHostileToPlayer } from "../reputation";

/**
 * Hunted level weights angered factions (hated counts double hostile) and
 * drives the ambush-frequency multiplier, capped so travel never becomes a
 * guaranteed fight.
 */

describe("huntedLevel", () => {
  it("ignores neutral and liked factions", () => {
    expect(huntedLevel({ a: 0, b: 50, c: 100 })).toBe(0);
  });

  it("counts hostile once and hated twice", () => {
    expect(huntedLevel({ a: -30 })).toBe(1);      // hostile
    expect(huntedLevel({ a: -80 })).toBe(2);      // hated
    expect(huntedLevel({ a: -80, b: -30, c: 10 })).toBe(3);
  });
});

describe("encounterDangerMultiplier", () => {
  it("is 1.0 with no enemies", () => {
    expect(encounterDangerMultiplier({})).toBe(1);
  });

  it("rises with hunted level but is capped at 2.0", () => {
    expect(encounterDangerMultiplier({ a: -30 })).toBeCloseTo(1.2);
    expect(encounterDangerMultiplier({ a: -80, b: -80, c: -80, d: -80 })).toBe(2.0);
  });
});

describe("isHostileToPlayer", () => {
  it("is true only at hostile or worse", () => {
    expect(isHostileToPlayer(0)).toBe(false);
    expect(isHostileToPlayer(-30)).toBe(true);
    expect(isHostileToPlayer(-90)).toBe(true);
  });
});
