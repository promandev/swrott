import { beforeEach, describe, expect, it } from "vitest";
import { useCombatStore } from "@/game/engine/combat/combat-store";
import { getEnemyTemplate } from "@/game/engine/combat/enemy-registry";

/**
 * Regression tests for the round loop.
 *
 * Bug history: a duplicated advanceTurn timer used to double-advance the
 * turn order, skipping the player's turn forever; and a stray advanceTurn
 * after endCombat resurrected an empty "ghost" combat that blocked the
 * defeat screen's Respawn button.
 */

const PLAYER = {
  name: "Test Acolyte",
  primary: { strength: 8, agility: 6, endurance: 6, force: 4, influence: 2, corruption: 0 },
  hp: 500,
  maxHp: 500,
  fp: 50,
  maxFp: 50,
  armor: 20,
  skillIds: [],
  stance: "aggressive" as const,
};

function state() {
  return useCombatStore.getState();
}

/** Run the enemy side exactly as the UI does: executeEnemyTurns → advanceTurn. */
function runEnemySide() {
  state().executeEnemyTurns();
  expect(["animating", "defeat"]).toContain(state().phase);
  state().advanceTurn();
}

describe("combat round loop", () => {
  beforeEach(() => {
    state().endCombat();
  });

  it("always returns the turn to the player after the enemies act", () => {
    const tpl = getEnemyTemplate("sith_acolyte")!;
    state().startCombat(PLAYER, [tpl, tpl], "loop-seed");

    // If the enemy won initiative, their side resolves first.
    if (state().phase === "enemyTurn") runEnemySide();
    expect(state().phase).toBe("playerTurn");

    // Play three full rounds — the player must get a turn in every one.
    for (let round = 0; round < 3; round++) {
      const s = state();
      const target = s.enemies.find((e) => e.isAlive)!;
      s.selectSkill("basic_attack");
      s.selectTarget(target.id);
      s.executePlayerAction();

      if (state().phase === "victory" || state().phase === "loot") return;
      expect(state().phase).toBe("animating");

      state().advanceTurn();
      expect(state().phase).toBe("enemyTurn");

      runEnemySide();
      expect(state().phase).toBe("playerTurn");
    }
  });

  it("stray advanceTurn calls can never resurrect an ended combat", () => {
    const tpl = getEnemyTemplate("sith_acolyte")!;
    state().startCombat(PLAYER, [tpl], "ghost-seed");
    state().endCombat();
    expect(state().phase).toBe("idle");

    // Simulates the leftover setTimeout firing after combat closed.
    state().advanceTurn();
    state().advanceTurn();
    expect(state().phase).toBe("idle");
    expect(state().player).toBeNull();
  });

  it("advanceTurn outside the animating phase is a no-op", () => {
    const tpl = getEnemyTemplate("sith_acolyte")!;
    state().startCombat(PLAYER, [tpl], "noop-seed");
    if (state().phase === "enemyTurn") runEnemySide();
    expect(state().phase).toBe("playerTurn");

    // A stray timer firing during the player's turn must not steal it.
    state().advanceTurn();
    expect(state().phase).toBe("playerTurn");
  });
});
