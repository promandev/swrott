# SWROTT — Asset Catalog (living docs)

> 🧭 **¿Buscas el prompt completo y listo para pegar?** Está en
> [`docs/prompts/`](../prompts/) — un fichero por entidad (clases, compañeros, NPCs, enemigos,
> música, mundos), con el sufijo de estilo ya incorporado, mantenido por la skill
> `/content-prompts`. **Esta carpeta** es el *tablero de estado*: qué arte existe, qué falta y
> cómo se convierte e integra.

This folder is the **single source of truth for art & audio to externalize** (Leonardo.ai
for image, Suno.ai for music). Every catalog here is **kept in sync with the codebase by the
`/asset-catalog` skill** — when you generate a new asset, run the skill and it updates the
relevant catalog (status, states, and prompts) from the data files.

> The high-level overview lives in [`../ASSET_INVENTORY.md`](../ASSET_INVENTORY.md).
> **This folder holds the detailed, copy-paste-ready prompts**, organized the way you asked:
> by **planet → type (NPC / enemy / companion / class) → state**, plus one file per category.

## Catalogs

| File | Covers | Source of truth (code) |
|---|---|---|
| [`characters.md`](characters.md) | Player classes, companions, named NPCs, all enemies — full-body sprites + combat states | `engine/combat/enemies.ts`, `engine/combat/planet-enemies.ts`, `data/npcs/*`, `engine/companions/companions.ts` |
| [`icons-talents.md`](icons-talents.md) | 64 skill icons + 9 talent-tree emblems | `data/skills/*`, `data/talents/*` |
| [`items.md`](items.md) | Item icons (base archetypes, legendaries, sets, crystals) | `data/items/*` |
| [`music.md`](music.md) | Music tracks (Suno) + the SFX wishlist | `audio/types.ts`, `audio/audio-manager.ts` |
| [`backgrounds.md`](backgrounds.md) | Per-zone scene backdrops (optional — scenes are procedural today) | `data/zones/all-zones.ts` |

## The skill that keeps these alive

```
/asset-catalog            # re-sync ALL catalogs against the code + asset folders
/asset-catalog characters # re-sync one catalog
/asset-catalog items
```

What it does: reads the data files, lists every entity, checks which assets already exist on
disk, marks each ✅ / ⬜, and (re)writes a detailed prompt for anything missing — using the
**Style Bible** below so every prompt stays consistent. See
[`.claude/skills/asset-catalog/SKILL.md`](../../.claude/skills/asset-catalog/SKILL.md).

---

# Style Bible — **Pixel Art** (locked 2026-06-16)

The whole game is **pixel art**, KOTOR-era Sith dark fantasy: crimson, ash-black, gilt, and
cold force-cyan/violet. Everything below assumes that. **Read this once; every catalog entry
is just the *subject* line — you append the matching STYLE SUFFIX from here.**

```
FINAL PROMPT  =  [subject line from the catalog]  +  [STYLE SUFFIX for that asset class]
```

### Global negative prompt (use on every generation)

```
NEGATIVE: photo, photorealistic, 3d render, octane, blurry, soft focus, anti-aliased edges,
jpeg artifacts, smooth gradients, watermark, signature, text, caption, UI, frame, border,
drop shadow, cast shadow on ground, busy background, multiple characters, cropped, out of
frame, extra limbs, extra fingers, deformed hands, lens flare, bokeh
```

### A. Character full-body sprite — STYLE SUFFIX

```
, full-body pixel-art game sprite, front view, full figure centered with small headroom and
floor room, neutral combat-ready stance, crisp clean 1px dark outline, limited cohesive
palette (24–32 colours), flat cel shading with a single top-left light, minimal dithering only
on large surfaces, sharp readable pixel clusters, no blur, KOTOR-era Star Wars Sith dark
fantasy, solid flat #FF00FF magenta background
```
- **Canvas:** 1024×1024, `--ar 1:1`.
- **Background colour:** flat **#FF00FF magenta** by default. If the character itself contains
  magenta/hot-pink, use **#00FF66 green** instead. (The converter learns the bg from the image
  border automatically, so any *flat* colour works — magenta/green just key cleanest.)

### B. Combat-state variants (idle / attack / hurt / down)

Generate the **idle** first, then reuse the **same seed, palette, scale, and floor line** and
change only the pose. The four poses must line up on one ground line.

| State | File | Pose direction (append after the subject) |
|---|---|---|
| idle   | `{id}.svg`        | neutral ready stance, weapon lowered, "breathing" |
| attack | `{id}_attack.svg` | mid-strike **in place** (the lunge is animated in code) — weapon raised/extended, weight forward |
| hurt   | `{id}_hurt.svg`   | recoiling flinch, head back, one step off-balance, pain on face |
| down   | `{id}_down.svg`   | defeated, kneeling / collapsing, weapon dropped |

### C. Skill / talent icon — STYLE SUFFIX

```
, pixel-art game ability icon, single centered emblem motif, bold silhouette readable at 64px,
chunky 1px outline, limited palette keyed to the element colour, flat cel shading, slight inner
glow, no text, no border, KOTOR-era Sith glyph aesthetic, solid flat #00FF66 green background
```
- **Canvas:** 512×512, `--ar 1:1`. **Element palette:** physical=steel grey, energy=cyan,
  mental=indigo, force=violet, poison=toxic green, fire=orange, shock=electric violet,
  buff=gold, heal=jade.

### D. Item / inventory icon — STYLE SUFFIX

```
, pixel-art inventory item icon, single object centered at 3/4 top-down angle, bold silhouette,
chunky 1px outline, limited palette, flat cel shading with rim light, rarity glow halo
({rarity colour}), no text, no border, KOTOR-era Sith dark fantasy, solid flat #00FF66 green
background
```
- **Canvas:** 256×256 or 512×512, `--ar 1:1`.
- **Rarity glow:** common=none/grey, uncommon=green, rare=blue, epic=violet, legendary=orange,
  mythic=red-gold.

### E. Scene backdrop (optional) — STYLE SUFFIX

```
, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene
with parallax-friendly layers, atmospheric depth, KOTOR-era Star Wars Sith dark fantasy mood
lighting
```
- **Canvas:** 1536×1024 (`--ar 3:2`) or 1920×1080 (`--ar 16:9`).

### Leonardo.ai settings (pixel art)

- **Model:** Leonardo Phoenix 1.0 or AlbedoBase XL.
- **Preset Style:** "Pixel Art" if offered, else **None / RAW**.
- **Prompt Magic:** OFF (it softens pixels). **Alchemy:** optional.
- **Guidance Scale:** 6–8. **Contrast:** medium-high.
- **Dimensions:** per asset class above; generate 4, pick the cleanest silhouette.
- Optionally add a **"Pixel Art" Element/LoRA** at ~0.5–0.7.
- You can use Leonardo's **Remove Background** in Canvas, but our pipeline keys it for you —
  exporting on a flat magenta/green field is enough.

---

# Pipeline: from prompt to in-game

1. **Generate** in Leonardo with the catalog prompt + the right STYLE SUFFIX, on a flat
   magenta/green field. Download the PNG/JPG.
2. **Drop** it into the source folder for its class:
   - characters → `public/images/characters/full_body_sprite/`
   - (icons/items/backgrounds get their own source folders when we start them)
3. **Key + convert** (characters): add `"file.ext" = "{id}"` to `$RENAME_MAP` in
   [`scripts/convert-characters.ps1`](../../scripts/convert-characters.ps1) and run it. It
   flood-fills the flat background → transparent and writes `{id}.svg` (+ a magenta QA preview
   in `characters/_qa/` you can eyeball, then delete).
4. **Register** the path (characters → `src/game/utils/character-images.ts`; the registry key
   **must equal the entity id**, and dialogue resolves by speaker name so add a heuristic there
   too if the NPC speaks).
5. **Re-sync** the catalog: run `/asset-catalog` so this doc flips the entry to ✅.

## Naming rule (hard requirement)

**Filename = the entity's `id`** (or `{id}_{state}` for combat variants). If they don't match,
the game can't find the art. IDs are listed in every catalog entry.

## Legend used in the catalogs

- ✅ art exists on disk &nbsp;·&nbsp; ⬜ to generate &nbsp;·&nbsp; ♻️ reuses another asset (placeholder)
- 👑 boss / hero — worth the full 4 combat states &nbsp;·&nbsp; ⭐ always on screen — top priority
