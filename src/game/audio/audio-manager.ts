/**
 * AudioManager — singleton that drives all game audio.
 *
 * Architecture:
 *   • SFX: generated with Web Audio API (no asset files required — works immediately).
 *   • Music: streamed via Howler.js from /public/audio/music/<id>.ogg
 *             Fails silently if the file is missing.
 *
 * Music files to add (OGG preferred, MP3 fallback):
 *   public/audio/music/
 *     theme_main.ogg          — landing / main menu (dark orchestral)
 *     korriban_ambient.ogg    — Korriban exploration (eerie, low brass)
 *     nar_shaddaa_ambient.ogg — Nar Shaddaa (neon jazz / synth)
 *     onderon_ambient.ogg
 *     dxun_ambient.ogg
 *     malachor_ambient.ogg    — endgame (void, ominous)
 *     combat_normal.ogg       — standard combat (intense percussion)
 *     combat_boss.ogg         — boss encounters (full orchestra)
 *
 * Free/CC0 music sources: freemusicarchive.org, incompetech.com, soundsnap.com
 * AI generation: Suno.ai (orchestral dark fantasy preset)
 */

import type { MusicTrackId } from "./types";
import type { Howl as HowlType } from "howler";

// ─── Internal helpers ────────────────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== "undefined";
}

interface ActiveDrone {
  osc: OscillatorNode;
  lfo: OscillatorNode;
  gain: GainNode;
}

// ─── AudioManager class ───────────────────────────────────────────────────────

class AudioManager {
  private _ctx: AudioContext | null = null;
  private _musicVolume = 0.55;
  private _sfxVolume = 0.7;
  private _muted = false;
  private _currentTrack: MusicTrackId | null = null;
  private _currentHowl: HowlType | null = null;
  private _drone: ActiveDrone | null = null;
  private _resumed = false;

  // ── Context lifecycle ──────────────────────────────────────────────────────

  private get ctx(): AudioContext | null {
    if (!isClient()) return null;
    if (!this._ctx) {
      try {
        this._ctx = new AudioContext();
      } catch {
        return null;
      }
    }
    return this._ctx;
  }

  /** Call this from ANY user interaction to unlock AudioContext (browser policy). */
  resume(): void {
    const ctx = this.ctx;
    if (!ctx || this._resumed) return;
    if (ctx.state === "suspended") {
      void ctx.resume().then(() => {
        this._resumed = true;
      });
    } else {
      this._resumed = true;
    }
  }

  // ── Volume / mute ─────────────────────────────────────────────────────────

  setMusicVolume(v: number): void {
    this._musicVolume = Math.max(0, Math.min(1, v));
    if (this._currentHowl) {
      this._currentHowl.volume(this._muted ? 0 : this._musicVolume);
    }
  }

  setSfxVolume(v: number): void {
    this._sfxVolume = Math.max(0, Math.min(1, v));
  }

  setMuted(m: boolean): void {
    this._muted = m;
    if (this._currentHowl) {
      this._currentHowl.volume(m ? 0 : this._musicVolume);
    }
    if (this._drone) {
      this._drone.gain.gain.setTargetAtTime(m ? 0 : 0.1, this.ctx!.currentTime, 0.3);
    }
  }

  getMusicVolume(): number { return this._musicVolume; }
  getSfxVolume(): number { return this._sfxVolume; }
  getMuted(): boolean { return this._muted; }

  // ── Low-level tone generators ─────────────────────────────────────────────

  private _tone(
    freq: number,
    endFreq: number,
    dur: number,
    peak: number,
    type: OscillatorType = "sine",
    delay = 0,
  ): void {
    const ctx = this.ctx;
    if (!ctx || this._muted) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      const t = ctx.currentTime + delay;
      osc.frequency.setValueAtTime(freq, t);
      if (endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(1, endFreq),
          t + dur * 0.85,
        );
      }
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(peak * this._sfxVolume, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch { /* ignore */ }
  }

  private _noise(
    dur: number,
    peak: number,
    filterFreq = 2000,
    filterQ = 0.8,
    delay = 0,
  ): void {
    const ctx = this.ctx;
    if (!ctx || this._muted) return;
    try {
      const sr = ctx.sampleRate;
      const len = Math.ceil(sr * dur);
      const buf = ctx.createBuffer(1, len, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filt = ctx.createBiquadFilter();
      filt.type = "bandpass";
      filt.frequency.value = filterFreq;
      filt.Q.value = filterQ;
      const gain = ctx.createGain();
      src.connect(filt);
      filt.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(peak * this._sfxVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.start(t);
      src.stop(t + dur + 0.02);
    } catch { /* ignore */ }
  }

  // ── UI SFX ────────────────────────────────────────────────────────────────

  click(): void {
    this._tone(900, 300, 0.07, 0.22, "sine");
    this._noise(0.04, 0.04, 3500);
  }

  hover(): void {
    this._tone(700, 750, 0.05, 0.07, "sine");
  }

  openPanel(): void {
    this._tone(380, 560, 0.14, 0.16, "sine");
    this._tone(560, 740, 0.12, 0.1, "sine", 0.06);
    this._noise(0.06, 0.04, 4000);
  }

  closePanel(): void {
    this._tone(560, 340, 0.11, 0.14, "sine");
  }

  dialogueAdvance(): void {
    this._tone(520, 620, 0.06, 0.1, "sine");
  }

  // ── Combat SFX ────────────────────────────────────────────────────────────

  combatHitLight(): void {
    this._noise(0.13, 0.28, 2200, 0.9);
    this._tone(180, 70, 0.14, 0.18, "sawtooth");
  }

  combatHitHeavy(): void {
    this._noise(0.22, 0.5, 900, 0.7);
    this._tone(110, 45, 0.26, 0.32, "sawtooth");
    this._noise(0.08, 0.2, 4000, 1.5, 0.02);
  }

  combatCrit(): void {
    this._noise(0.07, 0.6, 4500, 1.2);
    this._tone(280, 560, 0.18, 0.28, "square");
    this._tone(560, 1120, 0.22, 0.2, "sine", 0.06);
    this._noise(0.15, 0.25, 1200, 0.6, 0.04);
  }

  combatMiss(): void {
    this._noise(0.16, 0.1, 600, 0.4);
    this._tone(280, 180, 0.13, 0.07, "sine");
  }

  combatDodge(): void {
    this._tone(860, 380, 0.13, 0.14, "sine");
    this._noise(0.09, 0.07, 1600, 0.6);
  }

  saberSwing(): void {
    this._noise(0.32, 0.38, 1300, 0.5);
    this._tone(160, 75, 0.38, 0.22, "sawtooth");
    this._noise(0.12, 0.15, 4000, 1.2, 0.05);
  }

  forceLightning(): void {
    for (let i = 0; i < 6; i++) {
      this._noise(0.06, 0.35, 3000 + i * 400, 1.8, i * 0.04);
    }
    this._tone(240, 600, 0.35, 0.2, "sawtooth");
  }

  // ── Progression SFX ──────────────────────────────────────────────────────

  levelUp(): void {
    // Ascending minor-to-major arpeggio for a "power awakening" feel
    const notes = [196, 247, 294, 392, 523, 659, 784, 1047];
    notes.forEach((f, i) => {
      this._tone(f, f, 0.28, 0.16, "sine", i * 0.08);
    });
    this._noise(0.12, 0.2, 2000, 0.5, 0.15);
  }

  itemPickup(): void {
    this._tone(880, 1100, 0.15, 0.17, "sine");
    this._tone(1100, 1320, 0.1, 0.1, "sine", 0.13);
  }

  questComplete(): void {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => {
      this._tone(f, f, 0.32, 0.15, "sine", i * 0.14);
    });
    this._noise(0.1, 0.12, 2500, 0.5, 0.2);
  }

  // ── Atmospheric drone (cinematic / ambience) ───────────────────────────────

  /**
   * Starts a continuous low drone with LFO tremolo — used for the intro cinematic.
   * Safe to call multiple times (idempotent).
   */
  startDrone(): void {
    const ctx = this.ctx;
    if (!ctx || this._drone || this._muted) return;
    try {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      lfo.frequency.value = 0.25;
      lfoGain.gain.value = 12;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.type = "sawtooth";
      osc.frequency.value = 62;

      filter.type = "lowpass";
      filter.frequency.value = 240;
      filter.Q.value = 1.2;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09 * this._sfxVolume, ctx.currentTime + 3.5);

      osc.start();
      lfo.start();

      this._drone = { osc, lfo, gain };
    } catch { /* ignore */ }
  }

  stopDrone(fadeMs = 2200): void {
    const ctx = this.ctx;
    if (!ctx || !this._drone) return;
    const { osc, lfo, gain } = this._drone;
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(0, t + fadeMs / 1000);
    setTimeout(() => {
      try { osc.stop(); } catch { /* ignore */ }
      try { lfo.stop(); } catch { /* ignore */ }
    }, fadeMs + 100);
    this._drone = null;
  }

  // ── Music (Howler, file-based) ─────────────────────────────────────────────

  async playMusic(trackId: MusicTrackId, fadeInMs = 2500): Promise<void> {
    if (!isClient()) return;
    if (this._currentTrack === trackId) return;
    this._stopCurrentMusic(1200);
    this._currentTrack = trackId;
    try {
      const { Howl } = await import("howler");
      const howl = new Howl({
        src: [
          `/audio/music/${trackId}.ogg`,
          `/audio/music/${trackId}.mp3`,
        ],
        loop: true,
        volume: 0,
        html5: true,
        onloaderror: () => {
          // File not yet present — silent, no crash.
          // Add the files to public/audio/music/ to activate music.
          this._currentTrack = null;
        },
      });
      howl.play();
      if (!this._muted) howl.fade(0, this._musicVolume, fadeInMs);
      this._currentHowl = howl;
    } catch { /* ignore */ }
  }

  stopMusic(fadeMs = 1600): void {
    this._stopCurrentMusic(fadeMs);
    this._currentTrack = null;
  }

  private _stopCurrentMusic(fadeMs: number): void {
    const h = this._currentHowl;
    if (!h) return;
    if (fadeMs > 0) {
      h.fade(h.volume() as number, 0, fadeMs);
      setTimeout(() => {
        try { h.unload(); } catch { /* ignore */ }
      }, fadeMs + 150);
    } else {
      try { h.unload(); } catch { /* ignore */ }
    }
    this._currentHowl = null;
  }
}

/** Global singleton. Import this wherever audio is needed. */
export const audioManager = new AudioManager();
