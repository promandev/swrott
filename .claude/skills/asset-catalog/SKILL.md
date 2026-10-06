---
name: asset-catalog
description: Keep the SWROTT art/audio catalogs in docs/assets/ in sync with the codebase. Use when the user adds/generates a new asset (character sprite, skill/talent icon, item icon, music track, scene backdrop) or asks to refresh, re-sync, audit, or regenerate prompts for the asset catalog. Invoked as /asset-catalog [all|characters|icons|items|music|backgrounds].
---

# Asset Catalog sync

> **Complementaria de `/content-prompts`.** Esa skill mantiene `docs/prompts/` (la biblioteca de
> prompts completos, uno por entidad) y se dispara al **crear** contenido. Ésta mantiene
> `docs/assets/` (el tablero de estado + pipeline) y se dispara al **producir e integrar** un
> asset. No dupliques trabajo: si el encargo es "hay contenido nuevo, necesito su prompt", esa es
> `/content-prompts`.

You maintain the **living catalogs** in `docs/assets/` so they always reflect the game data and
what art/audio actually exists on disk. The catalogs hold copy-paste **pixel-art** prompts
(Leonardo) / Suno prompts, organized by **planet → type → state**.

**Authoritative style + conventions:** `docs/assets/README.md` (the Style Bible). Always reuse
its STYLE SUFFIX blocks and the global NEGATIVE; never invent a new style. Filename = entity `id`
(or `{id}_{state}`). Glyphs: ✅ exists · ⬜ to generate · ♻️ placeholder reuse · 👑 boss (4 states) · ⭐ top priority.

## Scope

Arg selects the catalog(s) to refresh. No arg or `all` → do every category.
`characters` | `icons` | `items` | `music` | `backgrounds`.

## Procedure (per category)

1. **Enumerate entities** from the data source(s) below — read them and extract every
   `id`, `name`, grouping (planet / class / type / slot / element), and `description`.
2. **Check existence** on disk in the asset folder(s) below (use Glob/ls). Mark each entity
   ✅ (file present), ⬜ (missing), or ♻️ (registry/catalog points it at another asset).
3. **Update the catalog .md**: keep the existing structure and ordering; flip status glyphs;
   **add entries for anything new** in the data; for ⬜ items write/refresh a tight one-line
   subject/motif using the matching STYLE SUFFIX from README. Don't rewrite good existing lines.
4. **Report** a short diff: how many ✅/⬜/♻️, what was added/changed since last sync.

### Category → data sources → catalog → asset folder

| Category | Read (data) | Update (catalog) | Asset folder / filename |
|---|---|---|---|
| characters | `src/game/engine/combat/enemies.ts`, `engine/combat/planet-enemies.ts`, `engine/combat/enemy-registry.ts`, `data/npcs/*` (dedupe by id; later files override), `engine/companions/companions.ts`, class ids `marauder/inquisitor/assassin` | `docs/assets/characters.md` | `public/images/characters/{id}.svg` (+ `{id}_attack/_hurt/_down.svg`) |
| icons | `src/game/data/skills/*` (id, `icon` slug, damageType, class), `data/talents/*` (tree ids + nodes) | `docs/assets/icons-talents.md` | `public/images/icons/skills/{slug}.png`, `public/images/icons/talents/{tree}.png` |
| items | `src/game/data/items/*` (korriban-items, planet-items, legendary-items, set-items, crystals, sets) → id, name, slot, weaponType, rarity, description | `docs/assets/items.md` | `public/images/icons/items/{id}.png` |
| music | `src/game/audio/types.ts` (`MusicTrackId`, `SfxId`), `audio/audio-manager.ts` | `docs/assets/music.md` | `public/audio/music/{id}.ogg` (sfx: `public/audio/sfx/{id}.ogg`) |
| backgrounds | `src/game/data/zones/all-zones.ts` (unique `sceneId` + zone name/description) | `docs/assets/backgrounds.md` | `public/images/backgrounds/{sceneId}.png` *(scenes are procedural today — optional)* |

## When the user just generated a CHARACTER sprite

1. Confirm the source art is in `public/images/characters/full_body_sprite/` (or ask where).
2. Add `"file.ext" = "{id}"` to `$RENAME_MAP` in `scripts/convert-characters.ps1` (tune
   `$TOLERANCE_OVERRIDES` only if the QA preview shows trouble), then run it:
   `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/convert-characters.ps1`.
   It flood-fills the flat bg → `public/images/characters/{id}.svg` and writes a magenta QA
   preview to `public/images/characters/_qa/{id}.png` — eyeball it, then delete `_qa/`.
3. **Register** in `src/game/utils/character-images.ts`: add `"{id}": "/images/characters/{id}.svg"`.
   Dialogue resolves portraits by **speaker name** (DialogueUI passes no npcId), so if the NPC
   speaks, add a name heuristic in `getSpeakerImage`. Enemies/bosses can add `{id}_{state}` keys.
4. Re-run this skill for `characters` to flip the entry to ✅.

## Adding a brand-new MUSIC id

Extend the `MusicTrackId` union in `audio/types.ts` and set the zone's `musicTrackId` in
`data/zones/all-zones.ts`, then drop `{id}.ogg` in `public/audio/music/`.

## Notes

- Keep prompts **pixel art** and consistent with README. Subject/motif line only — the suffix is
  appended by the user; don't duplicate the suffix into every row.
- Preserve the by-planet / by-type / by-state organization. New planets → new section.
- The high-level overview is `docs/ASSET_INVENTORY.md`; keep its counts roughly current if they drift.
