# Skill icons & talent emblems

> Style: **pixel art**. Final prompt = **[motif line] + [STYLE SUFFIX C]** from
> [`README.md`](README.md) + global NEGATIVE. Square, single centered emblem, readable at 64px.
> **Element palette:** physical=steel · energy=cyan · mental=indigo · force=violet ·
> poison=toxic-green · fire=orange · shock=electric-violet · buff=gold · heal=jade.
>
> **Target paths (proposed):** skill icons → `public/images/icons/skills/{slug}.png`,
> talent emblems → `public/images/icons/talents/{tree}.png`. Filename = the **icon slug**.
> Set the skill's `icon` field to the slug when the art lands (see `data/skills/*`).
> Status: ⬜ all to generate (no icon art on disk yet).

---

## Talent-tree emblems — 9 (PRIORITY: column headers, most visible)

| Class | Tree (`id`) | Motif line |
|---|---|---|
| Marauder | `juggernaut` | `a Sith war-helm fused with a tower shield, riveted steel and crimson, heraldic emblem (steel grey, buff gold accents)` |
| Marauder | `berserker` | `a snapped lightsaber hilt erupting in red flame, savage emblem (orange fire over crimson)` |
| Marauder | `duelist` | `two crossed red lightsabers behind a thin targeting reticle, precise emblem (steel grey + crimson)` |
| Inquisitor | `sorcerer` | `an open hand radiating forked violet force-lightning, arcane emblem (electric violet)` |
| Inquisitor | `corruptor` | `a Sith skull wrapped in creeping plague tendrils, emblem (toxic green over black)` |
| Inquisitor | `dominator` | `a single dominant glowing eye ringed by mind-control glyphs, emblem (indigo)` |
| Assassin | `shadowblade` | `a curved dagger half-dissolved into shadow, emblem (steel grey in violet shadow)` |
| Assassin | `poisoner` | `a dripping alchemical vial with a skull stopper, emblem (toxic green)` |
| Assassin | `specter` | `a blurred hooded silhouette splitting into after-images, emblem (cool violet-grey)` |

---

## Marauder skill icons (17)

| Skill | slug | Motif line |
|---|---|---|
| Heavy Slash | `heavy-slash` | `a single heavy downward saber slash arc (steel grey, physical)` |
| Cleave | `cleave` | `a wide horizontal saber sweep cutting two arcs (steel grey, physical)` |
| Saber Throw | `saber-throw` | `a spinning thrown lightsaber with a motion ring (cyan energy)` |
| Rage Burst | `rage-burst` | `a clenched fist erupting in a shock-burst of red rage (crimson physical)` |
| Execute | `execute` | `a saber driven down through a cracked skull (steel grey, physical)` |
| Unstoppable | `unstoppable` | `a charging armored silhouette wreathed in a golden buff aura (gold buff)` |
| Blood Rage | `blood-rage` | `a heart-shaped flame dripping blood, fury buff (crimson + gold)` |
| Annihilation | `annihilation` | `twin crossed sabers in an explosive star-burst (steel grey, physical)` |
| Flurry | `flurry` | `three overlapping rapid saber-strike streaks (steel grey, physical)` |
| Power Attack | `power-attack` | `a two-handed saber raised with impact lines (steel grey, physical)` |
| Critical Strike | `critical-strike` | `a saber tip striking a glowing crit star (steel grey + gold)` |
| Force Choke Slam | `choke` | `a clawed Force-grip hand crushing a throat glyph (violet force)` |
| Sundering Strike | `sunder` | `a cracked shattering armor plate struck by a blade (steel grey, physical)` |
| Defiant Roar | `roar` | `a roaring open-mouth silhouette with indigo sound rings (indigo mental)` |
| Berserker's Trance | `berserkers-trance` | `a meditating warrior wreathed in golden fury runes (gold buff)` |
| Vicious Throw | `vicious-throw` | `a hurled jagged blade with a cyan energy trail (cyan energy)` |
| Rallying Cry | `rallying-cry` | `a raised fist with a golden banner and uplift rays (gold buff)` |

## Inquisitor skill icons (15)

| Skill | slug | Motif line |
|---|---|---|
| Lightning Bolt | `lightning-bolt` | `a single forked bolt of violet force-lightning (electric violet shock)` |
| Drain Life | `drain-life` | `a hand pulling glowing red life-threads from a husk (violet force)` |
| Force Storm | `force-storm` | `a swirling vortex spitting multiple lightning forks (electric violet shock)` |
| Dark Heal | `dark-heal` | `a dark hand cupping a glowing jade restorative orb (jade heal)` |
| Mind Crush | `mind-crush` | `a cracking skull gripped by indigo psychic claws (indigo mental)` |
| Corruption Aura | `corruption-aura` | `a figure radiating a ring of toxic-green corruption (toxic green buff)` |
| Chain Lightning | `chain-lightning` | `lightning arcing between three nodes (electric violet shock)` |
| Terror Wave | `terror-wave` | `an expanding indigo shock-ring of screaming faces (indigo mental)` |
| Force Choke | `force-choke` | `a clawed Force-grip hand around a throat glyph (violet force)` |
| Spectral Armor | `spectral-armor` | `a translucent violet rune-barrier around a torso (violet buff)` |
| Madness | `madness` | `a fractured face splitting into indigo shards (indigo mental)` |
| Soul Drain | `soul-drain` | `a spectral soul-wisp siphoned into a dark hand (violet force)` |
| Nihilus's Hunger | `nihilus-hunger` | `a hungry void-maw shaped like Nihilus' mask devouring light (violet/black force)` |
| Death Field | `death-field` | `a circular field of skull glyphs and violet decay (violet force)` |
| Force Subjugate | `force-subjugate` | `a puppet-string hand over a kneeling silhouette (indigo mental)` |

## Assassin skill icons (16)

| Skill | slug | Motif line |
|---|---|---|
| Shadow Strike | `shadow-strike` | `a dagger lunging out of a shadow plume (steel grey, physical)` |
| Vanish | `vanish` | `a silhouette dissolving into smoke wisps (cool grey buff)` |
| Poison Blade | `poison-blade` | `a dagger dripping toxic-green venom (toxic green poison)` |
| Double Strike | `double-strike` | `two crossed quick daggers with twin streaks (steel grey, physical)` |
| Force Cloak | `force-cloak` | `a cloaked figure shimmering invisible, edge-only outline (cyan buff)` |
| Death Mark | `death-mark` | `a glowing violet target sigil over a skull (violet force)` |
| Backstab | `backstab` | `a dagger striking a spine from behind (steel grey, physical)` |
| Shadow Dash | `shadow-dash` | `a dashing blur trail ending in a dagger (steel grey, physical)` |
| Phantom Execution | `phantom-execution` | `a spectral blade passing through a ghostly skull (violet force)` |
| Shadow Step | `shadow-step` | `two footprints linked by a shadow-teleport wisp (cool violet buff)` |
| Smoke Bomb | `smoke-bomb` | `a bursting smoke canister with billowing clouds (steel grey, physical)` |
| Death Blossom | `death-blossom` | `a radial flurry of daggers in a bloom pattern (steel grey, physical)` |
| Voidstrike | `voidstrike` | `a blade tearing a small black void rift (violet/black force)` |
| Envenom | `envenom` | `a coiled serpent over a venom drop (toxic green poison)` |
| Phantom Blade | `phantom-blade` | `a translucent floating dagger with after-image (steel grey, physical)` |
| Toxic Nova | `toxic-nova` | `an exploding ring of toxic-green gas and droplets (toxic green poison)` |

## Force Powers — shared (16)

| Skill | slug | Motif line |
|---|---|---|
| Force Push | `force-push` | `an open palm emitting a concussive force shock-ring (violet force)` |
| Force Fear | `force-fear` | `a shadowy face with hollow eyes radiating dread (indigo mental)` |
| Force Speed | `force-speed` | `a running silhouette with golden speed streaks (gold buff)` |
| Force Stasis | `force-stasis` | `a frozen figure caught in violet force-binding rings (violet force)` |
| Force Heal | `force-heal` | `cupped hands around a jade healing light (jade heal)` |
| Drain Minor | `drain-minor` | `a small wisp of energy pulled into a fingertip (violet force)` |
| Force Lightning | `force-lightning-universal` | `two hands loosing a sheet of violet lightning (electric violet shock)` |
| Force Choke (univ.) | `force-choke` | `a Force-grip claw-hand around a throat glyph (violet force)` |
| Force Frenzy | `force-frenzy` | `a figure haloed in golden frenzied speed-runes (gold buff)` |
| Force Wave | `force-wave` | `a massive expanding force shock-wave ring (violet force)` |
| Drain Life (univ.) | `drain-life` | `a hand siphoning red life-threads from a husk (violet force)` |
| Mind Control | `force-mind-control` | `a hand with puppet strings over a glowing eye (indigo mental)` |
| Force Storm (leg.) | `force-storm-legendary` | `a colossal storm-vortex of branching lightning (electric violet shock)` |
| Soul Consumption | `soul-consumption` | `multiple soul-wisps spiraling into a dark maw (violet/black force)` |
| Void Step | `void-step` | `a figure stepping through a small black rift (violet/black force)` |
| Echo of Malachor | `echo-of-malachor` | `a shattered planet fragment radiating a death-echo ring (violet force)` |

---

## Talent nodes — 90 (optional, later)

Each tree has ~10 nodes (e.g. Thick Skin, Keen Edge, Plague Touch). Generate these only if you
want per-node art; otherwise the engine can tint/recolor the tree emblem. When ready, run
`/asset-catalog icons` and it will enumerate the nodes from `data/talents/*` and emit one motif
line each, reusing STYLE SUFFIX C. Source: [`src/game/data/talents/`](../../src/game/data/talents/).
