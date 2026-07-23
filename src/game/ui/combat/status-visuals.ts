import type { StatusEffect } from "@/game/data/schemas/common";

/**
 * Visual identity for combat status effects — turns the cryptic "Stu·2"
 * text codes into readable colored pips, and drives the persistent
 * on-combatant aura for the visceral damage-over-time effects.
 *
 * `aura` is intentionally only set for the effects that read well as a glow
 * around the figure (fire, poison, shock, bleed, corruption); control
 * effects (stun, fear, blind…) communicate through the pip alone.
 */
export interface StatusVisual {
  /** Full name, shown in the pip tooltip. */
  label: string;
  /** Compact glyph for the pip. */
  glyph: string;
  /** Tailwind text/border/background classes for the pip. */
  pill: string;
  /** Persistent aura tint (rgba) layered over the combatant while active. */
  aura?: string;
}

export const STATUS_VISUALS: Record<StatusEffect, StatusVisual> = {
  bleed:     { label: "Sangrado",     glyph: "🩸", pill: "text-blood-300 border-blood-600/50 bg-blood-950/50",      aura: "rgba(200,30,50,0.16)" },
  burn:      { label: "Quemadura",      glyph: "🔥", pill: "text-orange-300 border-orange-600/50 bg-orange-950/40",   aura: "rgba(255,110,40,0.20)" },
  shock:     { label: "Descarga",     glyph: "⚡", pill: "text-violet-300 border-violet-500/50 bg-violet-950/40",   aura: "rgba(150,110,255,0.20)" },
  poison:    { label: "Veneno",    glyph: "☣",  pill: "text-emerald-300 border-emerald-600/50 bg-emerald-950/40", aura: "rgba(60,200,110,0.18)" },
  corrupted: { label: "Corrompido", glyph: "🜏",  pill: "text-fuchsia-300 border-fuchsia-600/50 bg-fuchsia-950/40", aura: "rgba(200,60,220,0.18)" },
  fear:      { label: "Miedo",      glyph: "👁", pill: "text-indigo-300 border-indigo-500/50 bg-indigo-950/40" },
  stun:      { label: "Aturdimiento",      glyph: "💫", pill: "text-amber-300 border-amber-500/50 bg-amber-950/40" },
  blind:     { label: "Ceguera",     glyph: "🌑", pill: "text-ash-300 border-ash-500/50 bg-void-900/60" },
  silence:   { label: "Silencio",   glyph: "🔇", pill: "text-sky-300 border-sky-500/50 bg-sky-950/40" },
  cripple:   { label: "Lisiado",   glyph: "🦴", pill: "text-stone-300 border-stone-500/50 bg-stone-900/50" },
  marked:    { label: "Marcado",    glyph: "🎯", pill: "text-rose-300 border-rose-500/50 bg-rose-950/40" },
  rage:      { label: "Furia",      glyph: "🗯", pill: "text-red-300 border-red-600/50 bg-red-950/40" },
};

/** Pick the strongest aura tint among a combatant's active statuses, if any. */
export function dominantStatusAura(
  statuses: readonly { effect: StatusEffect }[],
): string | null {
  for (const s of statuses) {
    const aura = STATUS_VISUALS[s.effect]?.aura;
    if (aura) return aura;
  }
  return null;
}
