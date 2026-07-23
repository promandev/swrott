# Scene backdrops (optional)

> **Status today: scenes are PROCEDURAL.** Each zone renders via a `DynamicScene` generator
> keyed by `sceneId` (no background image files). These prompts are **optional** — use them only
> if you decide to replace/augment a procedural scene with a painted pixel backdrop.
>
> Style: **pixel art**. Final prompt = **[scene line] + [STYLE SUFFIX E]** from
> [`README.md`](README.md) + global NEGATIVE. Wide, no characters, parallax-friendly layers.
> One entry per **unique `sceneId`** (some zones share a generator). Suggested path if adopted:
> `public/images/backgrounds/{sceneId}.png`. Source: [`data/zones/all-zones.ts`](../../src/game/data/zones/all-zones.ts).

## Korriban
| sceneId | Scene line |
|---|---|
| `korriban_exterior` | `grand sandstone Sith Academy entrance under twin blazing red suns, ancient carved pillars, desert ridge` |
| `korriban_interior` | `dark Sith Academy corridor lined with glowing holocrons, obsidian columns, red braziers` |
| `korriban_valley` | `Valley of the Dark Lords, rows of monumental tombs receding to a crimson horizon, dust and dark energy haze` |
| `korriban_tomb` | `interior of an ancient Sith tomb, carved glyph walls, broken sarcophagi, faint red ghost-light, traps` |
| `korriban_arena` | `blood-stained sand combat arena ringed by stone tiers, Academy banners, harsh sun` |
| `korriban_mines` | `dark slave-mine tunnels, crude supports, dripping water, insectoid nests, dim lamplight` |

## Dromund Kaas
| sceneId | Scene line |
|---|---|
| `dromund_kaas_spaceport` | `rain-soaked durasteel landing platforms, Imperial shuttles, ozone glow, stormy sky` |
| `dromund_kaas_citadel` | `black Imperial citadel interior, towering spires beyond tall windows, lightning, austere halls` |
| `dromund_kaas_market` | `covered Kaas City bazaar, lantern-lit stalls in the citadel's shadow, ration queues` |
| `dromund_kaas_jungle` | `vine-choked stormy jungle, violet lightning, the Dark Temple looming in the distance` |
| `dromund_kaas_temple` | `ancient Sith ziggurat half-swallowed by jungle, oppressive whispering atmosphere` |
| `dromund_kaas_sanctum` | `cold dry temple sanctum below the storm, three burning binding wards in the dark` |
| `dromund_kaas_undercroft` | `drowned city foundations, flickering maintenance lights over black water` |

## Ziost
| sceneId | Scene line |
|---|---|
| `ziost_spaceport` | `wind-scoured landing platform on a frozen spire, cyan aurora over a dead ice-bound Sith capital` |
| `ziost_citadel` | `New Adasta, ice-drowned obsidian Sith towers leaning under frozen weight, eerie stillness` |
| `ziost_wastes` | `white frozen plain of buried tombs and standing stones, distant haunting glow, blowing snow` |
| `ziost_tomb` | `descending stair of black glass into a Singing Tomb, faint resonant glow, breath-held silence` |

## Nar Shaddaa
| sceneId | Scene line |
|---|---|
| `nar_shaddaa_promenade` | `neon-drenched rain-slick promenade, towering signage, endless vertical cityscape, smog glow` |
| `nar_shaddaa_cantina` | `smoky pazaak den cantina, neon bar, gambling tables, hazy lounge light` |
| `nar_shaddaa_market` | `crowded shadow black-market alley, hanging wares, illegal goods, distrustful crowd` |
| `nar_shaddaa_lower` | `decaying lower-city slum, broken pipes, gang graffiti, grim half-light below the neon` |
| `nar_shaddaa_exchange` | `fortified Exchange HQ interior, armored security, opulent crime-lord office` |

## Onderon
| sceneId | Scene line |
|---|---|
| `onderon_city` | `walled Iziz royal city, gilded corridors and balconies, beast-riders in the sky beyond` |
| `onderon_palace` | `opulent Onderon royal palace throne hall, banners, political grandeur` |
| `onderon_undercity` | `broken tunnels beneath the city walls, prowling jungle beasts, dripping dark` |

## Dxun
| sceneId | Scene line |
|---|---|
| `dxun_jungle` | `dense demon-moon jungle canopy, thick mist, ancient ruins, predatory shadows` |
| `dxun_mando_camp` | `Mandalorian war-camp clearing, tents and weapon racks, banner standards, cookfires` |
| `dxun_sith_tomb` | `overgrown ancient Sith tomb entrance, dark-side pressure, glowing glyphs in the gloom` |

## Dantooine
| sceneId | Scene line |
|---|---|
| `dantooine_enclave` | `shattered Jedi enclave ruins reclaimed by grassland, fallen columns, golden light` |
| `dantooine_plains` | `vast windswept crystal plains, scattered crystal formations, big sky, roaming herds` |
| `dantooine_crystal_cave` | `sacred crystal cave, glowing lightsaber crystals growing from walls, cool radiant light` |
| `dantooine_sublevel` | `secret enclave sublevel, dusty archives and sealed meditation vaults, dim emergency light` |

## Telos IV
| sceneId | Scene line |
|---|---|
| `telos_citadel` | `massive orbital Citadel Station interior, observation viewports over the planet, clean restored corridors` |
| `telos_surface` | `recovering bombarded surface, fragile new growth among ruins, pale restored sky` |
| `telos_rakata_lab` | `ancient Rakata laboratory, alien obsidian-and-bronze tech, reality-bending geometry, red glow` |

## Malachor V
| sceneId | Scene line |
|---|---|
| `malachor_surface` | `shattered planet surface, floating debris, gravity anomalies, screaming dark-side sky` |
| `malachor_depths` | `descent toward the Trayus Academy, crushing dark-side pressure, jagged black rock, red veins` |
| `malachor_ghost_ship` | `derelict Republic warship in gravitational limbo, frozen wreckage, spectral cold light` |
| `malachor_trayus` | `Trayus Academy core, black mirror halls, swirling dark-side energy, the heart of the Triumvirate` |
