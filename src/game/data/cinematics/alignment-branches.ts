/**
 * Alignment cinematic branches (Idea #17).
 *
 * Defines key story beats where the cinematic shown depends on the player's
 * current corruption level. Each branch has three variants:
 *
 *   light    (corruption <  20)
 *   neutral  (20 <= corruption <= 60)
 *   dark     (corruption >  60)
 *   extreme  (corruption >= 90) — rare super-dark variant for top moments
 *
 * Used by cinematic dispatcher when a "branched" scene id is requested.
 */

export type AlignmentTier = "light" | "neutral" | "dark" | "extreme";

export function tierFromCorruption(corruption: number): AlignmentTier {
  if (corruption >= 90) return "extreme";
  if (corruption >  60) return "dark";
  if (corruption >= 20) return "neutral";
  return "light";
}

export interface CinematicBranch {
  id: string;                       // branched scene id
  variants: Partial<Record<AlignmentTier, string>>; // tier → concrete scene id
}

export const CINEMATIC_BRANCHES: CinematicBranch[] = [
  {
    id: "korriban_first_blood",
    variants: {
      light:    "cine_korriban_spare",
      neutral:  "cine_korriban_hesitate",
      dark:     "cine_korriban_execute",
      extreme:  "cine_korriban_devour",
    },
  },
  {
    id: "voren_confrontation",
    variants: {
      light:    "cine_voren_offer_mercy",
      neutral:  "cine_voren_bargain",
      dark:     "cine_voren_betray",
      extreme:  "cine_voren_consume_master",
    },
  },
  {
    id: "trayas_codex_discovery",
    variants: {
      light:    "cine_codex_reject",
      neutral:  "cine_codex_study",
      dark:     "cine_codex_embrace",
      extreme:  "cine_codex_become_traya",
    },
  },
  {
    id: "nihilus_ascension",
    variants: {
      neutral:  "cine_ascension_doubt",
      dark:     "cine_ascension_consume",
      extreme:  "cine_ascension_unmade",
    },
  },
  {
    id: "malachor_final_choice",
    variants: {
      light:    "cine_malachor_heal_wound",
      neutral:  "cine_malachor_balance",
      dark:     "cine_malachor_widen_wound",
      extreme:  "cine_malachor_become_void",
    },
  },
];

export function resolveCinematic(branchId: string, corruption: number): string | null {
  const branch = CINEMATIC_BRANCHES.find((b) => b.id === branchId);
  if (!branch) return null;
  const tier = tierFromCorruption(corruption);
  // Fallback chain: extreme → dark → neutral → light
  const order: AlignmentTier[] = ["extreme", "dark", "neutral", "light"];
  const startIdx = order.indexOf(tier);
  for (let i = startIdx; i < order.length; i++) {
    const slot = order[i];
    if (slot === undefined) continue;
    const scene = branch.variants[slot];
    if (scene) return scene;
  }
  return null;
}
