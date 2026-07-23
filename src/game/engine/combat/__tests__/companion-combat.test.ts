import { describe, it, expect } from "vitest";
import { buildCompanionCombatant, companionCombatSkills } from "../companion-combat";
import { COMPANIONS } from "../../companions/companions";
import { getSkill, BASIC_ATTACK } from "../../../data/schemas/skill-registry";

const kaelis = COMPANIONS.find((c) => c.id === "kaelis")!;

describe("buildCompanionCombatant", () => {
  it("gives the companion full vitals and a basic attack", () => {
    const c = buildCompanionCombatant(kaelis, 5);
    expect(c.hp).toBe(c.maxHp);
    expect(c.maxHp).toBeGreaterThan(0);
    expect(c.skillIds[0]).toBe(BASIC_ATTACK.id);
    expect(c.skillIds.length).toBeGreaterThan(1);
  });

  it("keeps pace with the player but never drops below its own base", () => {
    const low = buildCompanionCombatant(kaelis, 1);
    expect(low.level).toBe(kaelis.baseLevel); // floor at base when player is lower
    const high = buildCompanionCombatant(kaelis, 25);
    expect(high.level).toBe(25); // matches the player
  });

  it("every companion's declared skills resolve in the registry", () => {
    // Integrity guard — catches dangling skill ids in the COMPANIONS data.
    for (const def of COMPANIONS) {
      for (const id of def.skillIds) {
        expect(getSkill(id), `${def.id} → missing skill ${id}`).toBeTruthy();
      }
    }
  });

  it("companionCombatSkills prepends the basic attack and keeps valid skills", () => {
    const skills = companionCombatSkills(kaelis);
    expect(skills[0]).toBe(BASIC_ATTACK.id);
    // All non-basic entries must be real registry skills.
    for (const id of skills.slice(1)) {
      expect(getSkill(id), `${id}`).toBeTruthy();
    }
  });

  it("companions grow extra abilities as they level up", () => {
    const early = companionCombatSkills(kaelis, 3);
    const veteran = companionCombatSkills(kaelis, 20);
    expect(veteran.length).toBeGreaterThan(early.length);
    // The growth skills are real and de-duplicated (a Set under the hood).
    expect(new Set(veteran).size).toBe(veteran.length);
    for (const id of veteran.slice(1)) expect(getSkill(id), id).toBeTruthy();
  });
});
