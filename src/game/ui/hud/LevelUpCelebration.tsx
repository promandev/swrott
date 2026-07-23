"use client";

import { useGameStore } from "@/game/store/game-store";
import { useAccessibilityStore } from "@/game/store/accessibility-store";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

/**
 * Center-screen celebration when the character levels up. Reads the
 * `levelUpFlash` flag the store sets in grantXpDraft, plays a gold burst
 * with the new level, then clears itself. Honors reduced-motion.
 */
export function LevelUpCelebration() {
  const level = useGameStore((s) => s.ui.levelUpFlash);
  const clear = useGameStore((s) => s.clearLevelUpFlash);
  const reducedMotion = useAccessibilityStore((s) => s.reducedMotion);

  useEffect(() => {
    if (level == null) return;
    const t = setTimeout(() => clear(), reducedMotion ? 1600 : 2600);
    return () => clearTimeout(t);
  }, [level, clear, reducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center">
      <AnimatePresence>
        {level != null && (
          <motion.div
            key={level}
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ type: "spring", damping: 14, stiffness: 200 }}
          >
            {/* Golden burst halo */}
            {!reducedMotion && (
              <motion.div
                className="absolute -inset-24 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(217,168,90,0.28) 0%, transparent 65%)" }}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.3, 1.1], opacity: [0, 1, 0.6] }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              />
            )}
            {/* Radiant rays */}
            {!reducedMotion &&
              [...Array(12)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-24 w-px origin-bottom"
                  style={{
                    background: "linear-gradient(to top, transparent, rgba(224,197,133,0.7))",
                    rotate: i * 30,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: [0, 1.2, 0.9], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 1.0, delay: 0.1, ease: "easeOut" }}
                />
              ))}

            <motion.div
              className="font-display uppercase tracking-[0.5em] text-gilt-300 text-2xl drop-shadow-[0_0_12px_rgba(217,168,90,0.7)]"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
            >
              Level Up
            </motion.div>
            <div className="mt-1 font-display text-6xl font-black text-gilt-200 drop-shadow-[0_0_18px_rgba(217,168,90,0.8)]">
              {level}
            </div>
            <div className="mt-1 h-px w-32 bg-gradient-to-r from-transparent via-gilt-500/60 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
