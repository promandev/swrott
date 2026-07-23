import { describe, it, expect } from "vitest";
import { getSithRank } from "../rank";

describe("getSithRank", () => {
  it("climbs the ranks with level", () => {
    expect(getSithRank("marauder", 1, 0).rank).toBe("Sith Acolyte");
    expect(getSithRank("marauder", 6, 0).rank).toBe("Sith Apprentice");
    expect(getSithRank("marauder", 12, 0).rank).toBe("Sith Warrior");
    expect(getSithRank("inquisitor", 12, 0).rank).toBe("Sith Inquisitor");
    expect(getSithRank("marauder", 18, 0).rank).toBe("Sith Lord");
    expect(getSithRank("marauder", 25, 0).rank).toBe("Darth");
  });

  it("earns a dark epithet through corruption (once established)", () => {
    expect(getSithRank("marauder", 12, 70).epithet).toBe("the Cruel");
    expect(getSithRank("marauder", 25, 90).title).toBe("Darth, the Merciless");
    // Low-tier acolytes don't carry epithets yet.
    expect(getSithRank("marauder", 3, 90).epithet).toBeNull();
  });
});
