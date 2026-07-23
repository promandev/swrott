/**
 * Accessibility settings store (Complementary Loop 6 / Idea CL6-A).
 *
 * Persists in localStorage and exposes a small Zustand store. UI
 * components read these to scale fonts, disable animations, and apply
 * colorblind palettes.
 */

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ColorblindMode = "off" | "deuteranopia" | "protanopia" | "tritanopia";

export interface AccessibilityState {
  fontScale: number;            // 1.0 = 100%
  reducedMotion: boolean;
  highContrast: boolean;
  colorblindMode: ColorblindMode;
  damageNumbersEnabled: boolean;
  screenShakeEnabled: boolean;
  setFontScale: (v: number) => void;
  setReducedMotion: (v: boolean) => void;
  setHighContrast: (v: boolean) => void;
  setColorblindMode: (v: ColorblindMode) => void;
  setDamageNumbersEnabled: (v: boolean) => void;
  setScreenShakeEnabled: (v: boolean) => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      fontScale: 1.0,
      reducedMotion: false,
      highContrast: false,
      colorblindMode: "off",
      damageNumbersEnabled: true,
      screenShakeEnabled: true,
      setFontScale: (v) => set({ fontScale: Math.max(0.75, Math.min(1.5, v)) }),
      setReducedMotion: (v) => set({ reducedMotion: v }),
      setHighContrast: (v) => set({ highContrast: v }),
      setColorblindMode: (v) => set({ colorblindMode: v }),
      setDamageNumbersEnabled: (v) => set({ damageNumbersEnabled: v }),
      setScreenShakeEnabled: (v) => set({ screenShakeEnabled: v }),
    }),
    { name: "swrott-accessibility" },
  ),
);
