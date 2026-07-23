import { create } from "zustand";
import { persist } from "zustand/middleware";
import { audioManager } from "./audio-manager";

interface AudioStore {
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      musicVolume: 0.55,
      sfxVolume: 0.7,
      muted: false,

      setMusicVolume: (v) => {
        set({ musicVolume: v });
        audioManager.setMusicVolume(v);
      },

      setSfxVolume: (v) => {
        set({ sfxVolume: v });
        audioManager.setSfxVolume(v);
      },

      toggleMute: () => {
        const next = !get().muted;
        set({ muted: next });
        audioManager.setMuted(next);
      },
    }),
    {
      name: "swrott-audio",
      // Sync manager state on rehydration
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        audioManager.setMusicVolume(state.musicVolume);
        audioManager.setSfxVolume(state.sfxVolume);
        audioManager.setMuted(state.muted);
      },
    },
  ),
);
