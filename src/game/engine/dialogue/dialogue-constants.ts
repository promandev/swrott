/**
 * Dialogue tone color constants.
 *
 * Used by the DialogueUI to color option text based on the speaker's
 * intent and the emotional register of the choice.
 *
 * Source: Advanced Implementation Proposals §3 "Sistema de Diálogos Avanzados".
 */

export type DialogueTone =
  | "neutral"     // Standard conversation
  | "aggressive"  // Threats, intimidation, violence
  | "force"       // Force-powered options (Choke, Persuade, Read)
  | "deceptive"   // Lies, manipulation, bluffing
  | "persuasion"  // Charm, negotiation, influence
  | "light"       // Compassion, mercy, Jedi-aligned choices
  | "dark"        // Cruelty, dominance, Sith-aligned choices
  | "companion"   // Companion-specific interjections
  | "lore"        // Lore checks (knowledge-based options)
  | "greedy";     // Money, credits, mercenary motivations

/** Tailwind CSS class names for each tone. */
export const TONE_CLASSES: Record<DialogueTone, string> = {
  neutral:    "text-slate-200",
  aggressive: "text-red-400",
  force:      "text-purple-400",
  deceptive:  "text-blue-300",
  persuasion: "text-sky-400",
  light:      "text-yellow-300",
  dark:       "text-red-700",
  companion:  "text-emerald-400",
  lore:       "text-amber-300",
  greedy:     "text-yellow-500",
};

/** Hex color values for non-Tailwind contexts (canvas, tooltips, logs). */
export const TONE_HEX: Record<DialogueTone, string> = {
  neutral:    "#e2e8f0",
  aggressive: "#f87171",
  force:      "#c084fc",
  deceptive:  "#93c5fd",
  persuasion: "#38bdf8",
  light:      "#fde047",
  dark:       "#b91c1c",
  companion:  "#34d399",
  lore:       "#fbbf24",
  greedy:     "#eab308",
};

/** Icon (emoji or symbol) shown before toned dialogue options. */
export const TONE_ICON: Record<DialogueTone, string> = {
  neutral:    "",
  aggressive: "⚔",
  force:      "◈",
  deceptive:  "◎",
  persuasion: "◇",
  light:      "✦",
  dark:       "✸",
  companion:  "♦",
  lore:       "⬡",
  greedy:     "₵",
};

/**
 * Given the text of a dialogue option, heuristically infer its tone.
 * This is a fallback — explicit `tone` fields on options take precedence.
 */
export function inferTone(optionText: string): DialogueTone {
  const t = optionText.toLowerCase();
  if (t.startsWith("[force") || t.startsWith("[use the force")) return "force";
  if (t.startsWith("[attack") || t.startsWith("[kill") || t.startsWith("[threaten")) return "aggressive";
  if (t.startsWith("[lie") || t.startsWith("[bluff") || t.startsWith("[deceive")) return "deceptive";
  if (t.startsWith("[persuade") || t.startsWith("[charm") || t.startsWith("[influence")) return "persuasion";
  if (t.startsWith("[mercy") || t.startsWith("[forgive") || t.startsWith("[spare")) return "light";
  if (t.startsWith("[intimidate") || t.startsWith("[dominate") || t.startsWith("[crush")) return "dark";
  if (t.startsWith("[bribe") || t.startsWith("[pay") || t.startsWith("[credits")) return "greedy";
  return "neutral";
}
