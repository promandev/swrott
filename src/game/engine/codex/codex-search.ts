/**
 * Codex search (Complementary Loop 6 / Idea CL6-B).
 *
 * Lightweight token-based search over the codex/lore database. Returns
 * results scored by how many query tokens match the entry's text fields.
 */

export interface CodexEntry {
  id: string;
  title: string;
  category: "lore" | "enemy" | "skill" | "item" | "faction" | "place";
  body: string;
  /** Optional alias terms for synonym matching. */
  aliases?: string[];
  /** True if locked until the player discovers it in-game. */
  locked?: boolean;
}

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1);
}

export interface CodexSearchResult {
  entry: CodexEntry;
  score: number;
  matchedTokens: string[];
}

export function searchCodex(query: string, entries: readonly CodexEntry[]): CodexSearchResult[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];
  const results: CodexSearchResult[] = [];
  for (const entry of entries) {
    if (entry.locked) continue;
    const haystack = [
      entry.title,
      entry.body,
      entry.category,
      ...(entry.aliases ?? []),
    ].join(" ");
    const hTokens = new Set(tokenize(haystack));
    const matched: string[] = [];
    let score = 0;
    for (const q of qTokens) {
      if (hTokens.has(q)) {
        matched.push(q);
        score += 2;
      } else {
        // partial substring match — weaker
        for (const h of hTokens) {
          if (h.includes(q) || q.includes(h)) {
            score += 1;
            matched.push(q);
            break;
          }
        }
      }
    }
    if (score > 0) results.push({ entry, score, matchedTokens: matched });
  }
  return results.sort((a, b) => b.score - a.score);
}
