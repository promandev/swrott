"use client";

import { useEffect } from "react";
import { useAccessibilityStore } from "@/game/store/accessibility-store";

/**
 * Applies the persisted accessibility settings to the document root.
 * Previously the settings store existed but nothing consumed it.
 *
 *  · fontScale     → root font-size (scales all rem-based text/UI)
 *  · highContrast  → `.high-contrast` class (globals.css)
 *  · reducedMotion → `.reduced-motion` class (globals.css kills CSS anims)
 *  · colorblindMode→ `data-colorblind` attribute (reserved for palettes)
 */
export function AccessibilitySync() {
  const fontScale = useAccessibilityStore((s) => s.fontScale);
  const highContrast = useAccessibilityStore((s) => s.highContrast);
  const reducedMotion = useAccessibilityStore((s) => s.reducedMotion);
  const colorblindMode = useAccessibilityStore((s) => s.colorblindMode);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${Math.round(fontScale * 100)}%`;
    root.classList.toggle("high-contrast", highContrast);
    root.classList.toggle("reduced-motion", reducedMotion);
    root.setAttribute("data-colorblind", colorblindMode);
  }, [fontScale, highContrast, reducedMotion, colorblindMode]);

  return null;
}
