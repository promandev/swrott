/**
 * Character image registry.
 *
 * Maps entity IDs (NPC IDs, companion IDs, class IDs, enemy template IDs)
 * to their SVG portrait paths served from /public/images/characters/.
 *
 * ── HOW TO ADD A NEW CHARACTER IMAGE ──────────────────────────────────
 * 1. Run scripts/convert-characters.ps1 with the new images:
 *      - Fill in $RENAME_MAP at the top of the script
 *      - This converts JPG/PNG → SVG with transparent background
 *      - Renames the file to the correct output_name.svg
 * 2. Add an entry to CHARACTER_REGISTRY below:
 *        entity_id: "/images/characters/output_name.svg"
 *    The entity_id MUST match the id field in the relevant definition:
 *      · Player class    → ClassId value ("marauder", "inquisitor", "assassin")
 *      · NpcDefinition   → npc.id        (e.g. "npc_darth_voren")
 *      · CompanionDefinition → companion.id (e.g. "kaelis")
 *      · EnemyTemplate   → template.id   (e.g. "sith_acolyte")
 * ──────────────────────────────────────────────────────────────────────
 */
const CHARACTER_REGISTRY: Record<string, string> = {
  // ── Player classes ───────────────────────────────────────────────────
  marauder:   "/images/characters/class_marauder.svg",
  inquisitor: "/images/characters/class_inquisitor.svg",
  assassin:   "/images/characters/class_assassin.svg",
  // Generic fallback
  character:  "/images/characters/character.svg",

  // ── NPCs — matches NpcDefinition.id ──────────────────────────────────
  npc_darth_voren:     "/images/characters/npc_darth_voren.svg",
  npc_archivist_kheln: "/images/characters/npc_archivist_kheln.svg",
  npc_overseer_raxis:  "/images/characters/npc_overseer_raxis.svg",
  npc_daryth:          "/images/characters/npc_daryth.svg",
  npc_kira_slave:      "/images/characters/npc_kira_slave.svg",
  npc_merchant_grot:   "/images/characters/npc_merchant_grot.svg",
  npc_seyla:           "/images/characters/npc_seyla.svg",
  npc_czerka_varn:     "/images/characters/npc_czerka_varn.svg",
  npc_thane:           "/images/characters/npc_thane.svg",

  // Archetype reuse — NPCs without dedicated art borrow the closest portrait
  npc_darth_seris:      "/images/characters/npc_darth_voren.svg",
  npc_lord_malvek:      "/images/characters/npc_darth_voren.svg",
  npc_blind_seer_tavros:"/images/characters/npc_archivist_kheln.svg",
  npc_alchemist:        "/images/characters/npc_archivist_kheln.svg",
  npc_merchant_drayven: "/images/characters/npc_merchant_grot.svg",
  npc_arms_dealer:      "/images/characters/npc_merchant_grot.svg",

  // ── Companions — matches CompanionDefinition.id ───────────────────────
  kaelis: "/images/characters/companion_kaelis.svg",
  v3x9:   "/images/characters/companion_v3x9.svg",

  // ── Enemies — matches EnemyTemplate.id ───────────────────────────────
  sith_acolyte:        "/images/characters/sith_acolyte.svg",
  imperial_guard:      "/images/characters/sith_acolyte.svg",
  thane_deserter:      "/images/characters/npc_thane.svg",
  darth_voren:         "/images/characters/npc_darth_voren.svg",
  daryth_rival:        "/images/characters/npc_daryth.svg",
  mine_overseer:       "/images/characters/npc_overseer_raxis.svg",
  sith_pureblood:      "/images/characters/npc_archivist_kheln.svg",
  sith_marauder_elite: "/images/characters/class_marauder.svg",
  shadow_assassin:     "/images/characters/class_assassin.svg",
  kaas_shadow_assassin:"/images/characters/class_assassin.svg",
};

/** Typed index access — returns undefined-safe string | null. */
function reg(key: string): string | null {
  const v = CHARACTER_REGISTRY[key];
  return v !== undefined ? v : null;
}

// ─── Public API ───────────────────────────────────────────────────────

/** Returns the SVG path for an entity by its exact registry ID, or null. */
export function getCharacterImage(id: string): string | null {
  return reg(id);
}

/**
 * Returns the SVG portrait for a player class.
 * Falls back to the generic character image when no specific image exists.
 */
export function getClassImage(classId: string): string {
  return reg(classId) ?? reg("character") ?? "/images/characters/character.svg";
}

/**
 * Resolves a dialogue speaker name to its portrait path.
 * Accepts an optional npcId for a direct lookup; otherwise uses
 * speaker-name heuristics to find the closest match.
 * Returns null when no image is registered.
 */
export function getSpeakerImage(speakerName: string, npcId?: string): string | null {
  if (npcId) return reg(npcId);

  const n = speakerName.toLowerCase().trim();
  if (n.includes("voren"))              return reg("npc_darth_voren");
  if (n.includes("kheln"))              return reg("npc_archivist_kheln");
  if (n.includes("raxis"))              return reg("npc_overseer_raxis");
  if (n === "daryth")                   return reg("npc_daryth");
  if (n === "kira")                     return reg("npc_kira_slave");
  if (n === "grot")                     return reg("npc_merchant_grot");
  if (n === "seyla")                    return reg("npc_seyla");
  if (n.includes("varn"))               return reg("npc_czerka_varn");
  if (n === "thane")                    return reg("npc_thane");
  if (n === "kaelis" || n.includes("kaelis dren")) return reg("kaelis");
  if (n === "v3x-9")                    return reg("v3x9");
  // Archetype reuse for NPCs without dedicated art
  if (n.includes("seris") || n.includes("malvek")) return reg("npc_darth_voren");
  if (n.includes("tavros") || n === "ossian")      return reg("npc_archivist_kheln");
  if (n.includes("drayven") || n === "saka")       return reg("npc_merchant_grot");
  return null;
}

/**
 * Extracts the enemy template ID from a runtime combatant ID.
 * e.g. "enemy_sith_acolyte_0" → "sith_acolyte"
 */
export function extractEnemyTemplateId(combatantId: string): string | null {
  const m = combatantId.match(/^enemy_(.+?)_\d+$/);
  return m?.[1] ?? null;
}

/** Returns the SVG portrait for an enemy combatant by its runtime ID, or null. */
export function getEnemyImage(combatantId: string): string | null {
  const templateId = extractEnemyTemplateId(combatantId);
  if (!templateId) return null;
  return reg(templateId);
}

// ─── Combat pose states ───────────────────────────────────────────────
//
// Characters can ship extra portraits per combat state. A state-variant
// lives in the registry under `${baseId}_${state}` (e.g. "marauder_attack",
// "sith_acolyte_hurt"). When that art doesn't exist yet, every resolver
// gracefully falls back to the base idle portrait — so the combat code can
// ask for any state today and the game keeps working until the art lands.
//
// ── ADDING POSE ART (per the convert-characters.ps1 pipeline) ──────────
// File:     public/images/characters/{baseId}_{state}.svg
// Registry: `${baseId}_${state}`: "/images/characters/{baseId}_{state}.svg"
//   e.g.    marauder_attack: "/images/characters/marauder_attack.svg",
// States:   "attack" | "hurt" | "down"   ("idle" = the existing base art)

export type CharacterState = "idle" | "attack" | "hurt" | "down";

/** Resolve a state-variant path for any base id, falling back to its idle art. */
function regState(baseId: string, state: CharacterState, idleFallback: string | null): string | null {
  if (state === "idle") return idleFallback;
  return reg(`${baseId}_${state}`) ?? idleFallback;
}

/** Player-class portrait for a given combat state (falls back to the idle class art). */
export function getClassStateImage(classId: string, state: CharacterState): string {
  return regState(classId, state, getClassImage(classId)) ?? getClassImage(classId);
}

/** Enemy portrait for a given combat state (falls back to the idle enemy art, or null). */
export function getEnemyStateImage(combatantId: string, state: CharacterState): string | null {
  const templateId = extractEnemyTemplateId(combatantId);
  if (!templateId) return null;
  return regState(templateId, state, reg(templateId));
}
