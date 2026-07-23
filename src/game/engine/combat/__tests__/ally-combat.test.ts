import { beforeEach, describe, expect, it } from "vitest";
import { useCombatStore } from "@/game/engine/combat/combat-store";
import { getEnemyTemplate } from "@/game/engine/combat/enemy-registry";
import { buildCompanionCombatant } from "@/game/engine/combat/companion-combat";
import { COMPANIONS } from "@/game/engine/companions/companions";

/** Phase 2: companions fight on the player's side. Player → allies → enemies. */

const PLAYER = {
  name: "Test Sith",
  primary: { strength: 8, agility: 6, endurance: 6, force: 4, influence: 2, corruption: 0 },
  hp: 500, maxHp: 500, fp: 50, maxFp: 50, armor: 20,
  skillIds: [], stance: "aggressive" as const,
};

const kaelis = COMPANIONS.find((c) => c.id === "kaelis")!;

function state() {
  return useCombatStore.getState();
}

describe("ally combat flow", () => {
  beforeEach(() => state().endCombat());

  it("inserts an ally turn between the player and the enemies", () => {
    const tpl = getEnemyTemplate("sith_acolyte")!;
    state().startCombat(PLAYER, [tpl], "ally-seed", "clear", [buildCompanionCombatant(kaelis, 5)]);
    expect(state().allies).toHaveLength(1);
    expect(state().allies[0]!.isAlive).toBe(true);

    if (state().phase === "enemyTurn") {
      state().executeEnemyTurns();
      state().advanceTurn();
    }
    // Player acts.
    const s = state();
    const target = s.enemies.find((e) => e.isAlive)!;
    s.selectSkill("basic_attack");
    s.selectTarget(target.id);
    s.executePlayerAction();
    if (state().phase === "victory" || state().phase === "loot") return;
    expect(state().phase).toBe("animating");

    // → allies act next (companion is alive).
    state().advanceTurn();
    expect(state().phase).toBe("allyTurn");

    const enemyHpBefore = state().enemies[0]!.hp;
    state().executeAllyTurns();
    expect(["animating", "victory", "loot"]).toContain(state().phase);
    // The companion either damaged the foe or finished it.
    expect(state().enemies[0]!.hp).toBeLessThanOrEqual(enemyHpBefore);
    // A log line attributed to the ally exists.
    expect(state().log.some((l) => l.actorId === "ally_kaelis")).toBe(true);
  });

  function driveToAllyTurn(tactic: "defensive" | "aggressive") {
    const tpl = getEnemyTemplate("ragnos_spirit")!; // 820 HP — survives the round
    state().startCombat(PLAYER, [tpl], `tac-${tactic}`, "clear", [buildCompanionCombatant(kaelis, 15, undefined, tactic)]);
    if (state().phase === "enemyTurn") { state().executeEnemyTurns(); state().advanceTurn(); }
    const s = state();
    s.selectSkill("basic_attack");
    s.selectTarget(s.enemies[0]!.id);
    s.executePlayerAction();
    state().advanceTurn();
    state().executeAllyTurns();
    return state().log.find((l) => l.actorId === "ally_kaelis" && l.action !== "bark")?.action;
  }

  it("defensive tactic makes the companion basic-attack only", () => {
    expect(driveToAllyTurn("defensive")).toBe("basic_attack");
  });

  it("aggressive tactic makes the companion use a real skill", () => {
    expect(driveToAllyTurn("aggressive")).not.toBe("basic_attack");
  });

  it("a support companion heals the badly wounded player", () => {
    const serana = COMPANIONS.find((c) => c.id === "serana")!; // has dark_heal
    const wounded = { ...PLAYER, hp: 80, maxHp: 500 };
    state().startCombat(wounded, [getEnemyTemplate("ragnos_spirit")!], "heal-seed", "clear", [buildCompanionCombatant(serana, 15)]);
    if (state().phase === "enemyTurn") { state().executeEnemyTurns(); state().advanceTurn(); }
    const s = state();
    s.selectSkill("basic_attack");
    s.selectTarget(s.enemies[0]!.id);
    s.executePlayerAction();
    state().advanceTurn();
    expect(state().phase).toBe("allyTurn");
    state().executeAllyTurns();
    expect(state().log.some((l) => l.actorId === "ally_serana" && /restores/.test(l.text))).toBe(true);
  });

  it("with no allies the flow is unchanged (player → enemies)", () => {
    const tpl = getEnemyTemplate("sith_acolyte")!;
    state().startCombat(PLAYER, [tpl], "noally-seed");
    if (state().phase === "enemyTurn") {
      state().executeEnemyTurns();
      state().advanceTurn();
    }
    const s = state();
    s.selectSkill("basic_attack");
    s.selectTarget(s.enemies[0]!.id);
    s.executePlayerAction();
    if (state().phase === "victory" || state().phase === "loot") return;
    state().advanceTurn();
    expect(state().phase).toBe("enemyTurn"); // no allyTurn inserted
  });
});
