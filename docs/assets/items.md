# Item icons

> Style: **pixel art**. Final prompt = **[object line] + [STYLE SUFFIX D]** from
> [`README.md`](README.md) + global NEGATIVE. Single object, centered, 3/4 top-down, rarity glow.
> **Rarity glow:** common=grey/none · uncommon=green · rare=blue · epic=violet · legendary=orange · mythic=red-gold.
>
> **Target path (proposed):** `public/images/icons/items/{id}.png`. Filename = item `id`.
> Status: ⬜ none on disk yet. Source of truth: [`src/game/data/items/`](../../src/game/data/items/).
>
> Strategy: generate one **base archetype** icon per slot/weapon-type for the bulk of common→rare
> drops (tint the glow by rarity), then a **bespoke** icon for every named unique below.

---

## Base archetypes (cover all generic drops — tint glow by rarity)

| Archetype | suggested id | Object line |
|---|---|---|
| Single saber | `base_saber_single` | `a single-hilt lightsaber, metallic grey hilt with red blade` |
| Dual saber | `base_saber_dual` | `a pair of matched lightsaber hilts crossed, red blades` |
| Curved saber | `base_curved_saber` | `a curved-hilt lightsaber, elegant black hilt, red blade` |
| Saber pike | `base_pike` | `a double-bladed saberstaff, long dark hilt, red blades both ends` |
| Vibrosword | `base_vibrosword` | `a serrated metal vibrosword, worn grip, faint energy edge` |
| Sidearm | `base_sidearm` | `a blocky blaster pistol, scuffed gunmetal` |
| Off-hand focus | `base_offhand` | `a floating Sith focus-shard / small force totem` |
| Head / mask | `base_mask` | `a sinister Sith face-mask, dark metal` |
| Chest / robes | `base_robes` | `folded dark Sith robes with red trim` |
| Chest / plate | `base_plate` | `a dark Sith cuirass, layered plate` |
| Gloves | `base_gloves` | `a pair of armored dark gauntlets` |
| Belt | `base_belt` | `a utility war-belt with pouches` |
| Boots | `base_boots` | `a pair of heavy dark boots` |
| Relic | `base_relic` | `an ancient Sith relic talisman on a cord` |
| Implant | `base_implant` | `a cybernetic implant chip with circuitry` |

## Consumables & materials

| Item | id | Object line |
|---|---|---|
| Basic Medpack | `medpack_basic` | `a small white-and-red medpack vial` |
| Advanced Medpack | `medpack_advanced` | `a larger medpack with twin red vials and readout` |
| Force Stimulant | `stim_force` | `a glowing violet stim-injector` |
| Adrenal: Strength | `adrenal_strength` | `a red adrenal injector with a fist glyph` |
| Antidote | `antidote` | `a green antidote vial with a serpent glyph` |
| Scrap Metal | `mat_scrap` | `a pile of twisted scrap metal pieces` |
| Crystal Shard | `mat_crystal_shard` | `a small jagged glowing crystal shard` |
| Dark Essence | `mat_dark_essence` | `a swirling vial of black-violet essence` |
| Broken Holocron | `mat_broken_holocron` | `a cracked Sith holocron cube, dim red glow` |

---

## Korriban — named gear

| Item | id (verify) | Object line |
|---|---|---|
| Training Saber | `korriban_training_saber` | `a plain practice lightsaber, dull grey hilt, thin red blade (common)` |
| Acolyte Blade | `korriban_acolyte_blade` | `a basic acolyte's saber, utilitarian hilt, red blade (common)` |
| Bloodforged Saber | `korriban_bloodforged_saber` | `a ritual saber, blood-etched crimson hilt, vivid red blade (rare)` |
| Corroded Vibrosword | `korriban_corroded_vibrosword` | `a pitted rusted vibrosword, jagged edge (uncommon)` |
| Crimson Fang | `korriban_crimson_fang` | `a vicious curved saber, fang-shaped crimson hilt, bleeding-red blade (rare, unique)` |
| Slave Rags | `korriban_slave_rags` | `tattered grey slave rags (common)` |
| Acolyte Robes | `korriban_acolyte_robes` | `dark grey acolyte robes with thin red sash (common)` |
| Warrior's Plate | `korriban_warriors_plate` | `heavy crimson-black warrior cuirass (uncommon)` |
| Duelist's Garb | `korriban_duelists_garb` | `sleek dark duelist's leathers (uncommon)` |
| Voren's Dark Mantle | `korriban_vorens_mantle` | `a Sith lord's black mantle with red-lined high collar (rare, unique)` |
| Hood of Shadows | `korriban_hood_of_shadows` | `a deep assassin's hood, shadow-wrapped (uncommon)` |
| Iron Sith Mask | `korriban_iron_sith_mask` | `a riveted iron Sith face-mask (uncommon)` |
| Iron Gauntlets | `korriban_iron_gauntlets` | `heavy riveted iron gauntlets (common)` |
| Utility Belt | `korriban_utility_belt` | `a worn utility belt with pouches (common)` |
| Sandwalker Boots | `korriban_sandwalker_boots` | `dusty desert travel boots (common)` |
| Bone Talisman | `korriban_bone_talisman` | `a carved bone talisman on a cord (uncommon relic)` |
| Reflex Enhancement Chip | `korriban_reflex_chip` | `a cybernetic reflex implant chip (uncommon)` |
| Voren's Amulet | `korriban_vorens_amulet` | `an ornate red-gemmed Sith amulet (rare relic, unique)` |
| Tomb Seal Fragment | `korriban_tomb_seal` | `a broken stone tomb-seal shard with glowing glyphs (rare relic)` |

> Planet gear (Dromund Kaas, Nar Shaddaa, Onderon, Dxun, Dantooine, Telos, Malachor) uses the
> same archetypes at higher tiers — see [`planet-items.ts`](../../src/game/data/items/planet-items.ts).
> Run `/asset-catalog items` to enumerate exact ids/names per planet.

---

## Legendaries & Mythics (bespoke — orange/red-gold glow)

| Item | id | Object line |
|---|---|---|
| Hunger of Nihilus | `legend_hunger_of_nihilus` | `a saber forged from a fragment of Nihilus' cracked white-red mask, void-black blade (legendary, force)` |
| Blackstar Saber | `legend_blackstar_saber` | `a saber whose crystal devours light, hilt rimmed in collapsing dark, near-black blade (legendary)` |
| Crimson Reaver | `legend_crimson_reaver` | `twin blood-soaked dual sabers, jagged crimson hilts, dripping red blades (legendary, marauder)` |
| Staff of Nihilus | `legend_staff_of_nihilus` | `a saberstaff grown from petrified bone, pale hilt, hungry violet blades (legendary, inquisitor)` |
| Shadowfang | `legend_shadowfang` | `a curved light-drinking saber, obsidian hilt, shadow-edged blade (legendary, assassin)` |
| The Empty Saber | `legend_the_empty_saber` | `an unadorned silent saber hilt, blade barely visible as a void slit (mythic, red-gold glow)` |
| Voidweaver Robes | `legend_voidweaver_robes` | `flowing black-violet sorcerer robes woven with void-thread, faint star-field shimmer (legendary set chest)` |
| Mask of Silent Death | `legend_mask_of_silent_death` | `a smooth featureless assassin death-mask, matte black (legendary set head)` |
| Mask of Xerev the Devourer | `legend_mask_of_xerev` | `a gaping hungry Sith devourer mask, fanged, corrupted (legendary set head)` |
| Helm of Endless Fury | `legend_helm_of_endless_fury` | `a horned crimson war-helm wreathed in faint flame (legendary set head)` |
| Traya's Codex | `legend_trayas_codex` | `a grey Sith holocron etched with betrayal glyphs, dim violet glow (legendary relic)` |
| Heart of Malachor | `legend_heart_of_malachor` | `a pulsing red wound-crystal veined with black, harvested from a dead world (legendary relic)` |
| Fragment of Sion | `legend_fragment_of_sion` | `a cracked undying bone-shard refusing to crumble, faint red seams (legendary relic)` |
| Nihilus Bone Charm | `legend_nihilus_bone_charm` | `a fingerbone on a leather cord, hungering violet aura (legendary relic)` |
| Traya's Eye | `legend_trayas_eye` | `a milky crystal sphere reflecting a tiny death, prophetic glow (mythic relic, red-gold)` |

## Set pieces (match the legendary anchor's palette)

**Void Lord** (inquisitor, void-violet): `legend_voidweaver_robes` (chest), `set_voidweaver_hood` (head), `set_voidweaver_gloves` (gloves), `set_voidweaver_sash` (belt), `set_voidweaver_boots` (boots) — all `black-violet void-thread sorcerer vestments with faint starfield shimmer`.

**Bloodforged Warlord** (marauder, crimson-iron): `legend_helm_of_endless_fury`/`legend_mask_of_xerev` (head), `set_bloodforged_cuirass` (chest), `set_bloodforged_gauntlets` (gloves), `set_bloodforged_cinch` (belt), `set_bloodforged_sabatons` (boots) — all `ritual-drenched crimson-and-black warlord plate, blood-etched`.

**Whisperveil** (assassin, shadow-grey): `legend_mask_of_silent_death` (head), `set_whisperveil_vest` (chest), `set_whisperveil_wraps` (gloves), `set_whisperveil_cord` (belt), `set_whisperveil_slippers` (boots) — all `matte-black shadow-assassin wraps, light-drinking cloth, minimal trim`.

## Saber crystals (6) — glowing gem icons

| Crystal | id | Object line |
|---|---|---|
| Red Synthetic | `crystal_red_synthetic` | `a faceted blood-red saber crystal, faint inner glow (uncommon)` |
| Bleeding Red | `crystal_red_bleeding` | `a cracked red crystal weeping light, unstable (rare)` |
| Corrupted Purple | `crystal_purple_corrupted` | `a violet crystal warped with dark veins (rare)` |
| Black Void | `crystal_black_void` | `a light-bending black crystal, edges dissolving (epic)` |
| Ancient Sith | `crystal_ancient_sith` | `a screaming pre-Republic Sith crystal, deep red with ghostly faces (legendary)` |
| Lifedrinker | `crystal_lifedrinker` | `a pulsing crimson crystal that drinks light, vein-like glow (epic)` |
