import type { DamageType } from "@/game/engine/combat/damage";

/**
 * Elemental identity for the seven damage types — drives the colored type
 * dot on ability buttons and the tint of the damage preview, so a player
 * reads their kit's elements at a glance (KOTOR-style elemental kits).
 */
export interface DamageTypeVisual {
  label: string;
  glyph: string;
  /** Tailwind text color for numbers/labels. */
  text: string;
  /** Tailwind background for the small type dot. */
  dot: string;
}

export const DAMAGE_TYPE_VISUALS: Record<DamageType, DamageTypeVisual> = {
  physical: { label: "Físico", glyph: "⚔", text: "text-ash-200",     dot: "bg-ash-300" },
  energy:   { label: "Energía",   glyph: "✸", text: "text-cyan-200",    dot: "bg-cyan-300" },
  mental:   { label: "Mental",   glyph: "◉", text: "text-indigo-200",  dot: "bg-indigo-300" },
  force:    { label: "Fuerza",    glyph: "✦", text: "text-force-400",   dot: "bg-force-500" },
  poison:   { label: "Veneno",   glyph: "☣", text: "text-emerald-300", dot: "bg-emerald-400" },
  fire:     { label: "Fuego",     glyph: "🔥", text: "text-orange-300",  dot: "bg-orange-400" },
  shock:    { label: "Descarga",    glyph: "⚡", text: "text-violet-300",  dot: "bg-violet-400" },
};
