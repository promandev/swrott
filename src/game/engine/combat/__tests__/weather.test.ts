import { describe, expect, it } from "vitest";
import { getWeatherForZone, WEATHER_EFFECTS } from "@/game/engine/combat/weather";

describe("weather", () => {
  it("infers themed weather from real zone ids", () => {
    expect(getWeatherForZone("malachor_surface")).toBe("malachor_wound");
    expect(getWeatherForZone("dromund_kaas_jungle")).toBe("kaas_mist");
    expect(getWeatherForZone("dxun_sith_tomb")).toBe("sith_eclipse");
    expect(getWeatherForZone("ziost_glacier")).toBe("frozen_winds");
    expect(getWeatherForZone("hs_arena_fight")).toBe("blood_moon");
  });

  it("defaults to clear for ordinary zones", () => {
    expect(getWeatherForZone("dromund_kaas_market")).not.toBe("clear"); // kaas → mist
    expect(getWeatherForZone("dantooine_plains")).toBe("clear");
    expect(getWeatherForZone("")).toBe("clear");
  });

  it("every weather has a label and description", () => {
    for (const w of Object.values(WEATHER_EFFECTS)) {
      expect(w.label.length).toBeGreaterThan(0);
      expect(w.description.length).toBeGreaterThan(0);
    }
  });
});
