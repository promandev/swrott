"use client";

import { useCallback, useEffect } from "react";
import { audioManager } from "./audio-manager";
import type { MusicTrackId } from "./types";

/**
 * React hook that exposes typed audio actions.
 * Handles AudioContext resume on first user interaction.
 *
 * Usage:
 *   const audio = useAudio();
 *   <button onClick={() => { audio.click(); doSomething(); }}>
 */
export function useAudio() {
  // Unlock AudioContext on mount via first interaction events
  useEffect(() => {
    const unlock = () => audioManager.resume();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return {
    // UI
    click: useCallback(() => audioManager.click(), []),
    hover: useCallback(() => audioManager.hover(), []),
    openPanel: useCallback(() => audioManager.openPanel(), []),
    closePanel: useCallback(() => audioManager.closePanel(), []),
    dialogueAdvance: useCallback(() => audioManager.dialogueAdvance(), []),

    // Combat
    hitLight: useCallback(() => audioManager.combatHitLight(), []),
    hitHeavy: useCallback(() => audioManager.combatHitHeavy(), []),
    crit: useCallback(() => audioManager.combatCrit(), []),
    miss: useCallback(() => audioManager.combatMiss(), []),
    dodge: useCallback(() => audioManager.combatDodge(), []),
    saberSwing: useCallback(() => audioManager.saberSwing(), []),
    forceLightning: useCallback(() => audioManager.forceLightning(), []),

    // Progression
    levelUp: useCallback(() => audioManager.levelUp(), []),
    itemPickup: useCallback(() => audioManager.itemPickup(), []),
    questComplete: useCallback(() => audioManager.questComplete(), []),

    // Music
    playMusic: useCallback(
      (trackId: MusicTrackId, fadeMs?: number) =>
        void audioManager.playMusic(trackId, fadeMs),
      [],
    ),
    stopMusic: useCallback((fadeMs?: number) => audioManager.stopMusic(fadeMs), []),

    // Drone (cinematic)
    startDrone: useCallback(() => audioManager.startDrone(), []),
    stopDrone: useCallback((fadeMs?: number) => audioManager.stopDrone(fadeMs), []),
  };
}
