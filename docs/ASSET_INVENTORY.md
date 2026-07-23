# SWROTT — Inventario de Assets para externalizar (Leonardo.ai / Suno.ai)

> 📂 **Los prompts detallados y listos para copiar viven ahora en [`docs/assets/`](assets/)**
> (catálogos vivos por categoría, estilo **pixel art**, organizados por planeta → tipo → estado):
> [characters](assets/characters.md) · [icons-talents](assets/icons-talents.md) ·
> [items](assets/items.md) · [music](assets/music.md) · [backgrounds](assets/backgrounds.md) ·
> y la **guía de estilo** en [assets/README.md](assets/README.md).
> Se mantienen sincronizados con el código mediante la skill **`/asset-catalog`**.
> Este archivo es el **resumen de alto nivel**.

> Este documento lista **todo** el arte y audio que el juego puede consumir, con la
> metadata necesaria para escribir prompts. En otra sesión, tráeme la sección que
> quieras producir y te preparo los prompts concretos.
>
> **Reglas de integración (importantes — el arte debe entrar sin retoques):**
> - **Retratos de personaje**: PNG **1024×1024**, **fondo plano sólido** (magenta `#FF00FF`
>   o verde croma `#00FF66`), iluminación neutra. El script
>   [`scripts/convert-characters.ps1`](../scripts/convert-characters.ps1) quita el fondo
>   muestreando el píxel de la esquina superior-izquierda (tolerancia 45) y lo envuelve en SVG.
> - **Iconos** (skills/talentos): cuadrados, **256×256** o **512×512**, fondo transparente
>   (o sólido para keying), un solo motivo centrado, estilo coherente (grabado Sith / glifo).
> - **Estados de combate** (idle/attack/hurt/down): las 4 poses del mismo personaje deben
>   compartir lienzo, escala, centrado y línea de suelo. Ver `## 1. Personajes`.
> - **Nomenclatura**: el nombre de archivo **debe** coincidir con el `id` indicado, o el juego
>   no lo encontrará.

---

## Resumen de cantidades

| Categoría | Únicos | Nº de assets si se hace el set completo |
|---|---|---|
| Clases jugador | 3 | 12 (×4 estados) |
| Compañeros | 5 | 5 retratos (20 si ×4 estados) |
| NPCs nombrados | 20 | 20 retratos |
| Enemigos (templates) | 57 | 57 idle + ~19 jefes ×4 estados |
| Iconos de skill | 64 | 64 |
| Emblemas de árbol de talento | 9 | 9 (+ opcional 90 nodos) |
| Pistas de música | 8 (faltan ~5 por planeta) | 8–13 |
| SFX | 15 (hoy sintetizados) | 15 |

---

## 1. Personajes — retratos y sprites de estado

**Estados de combate** (cableado ya en el motor → caen a `idle` si el arte no existe):

| Estado | Archivo | Pose |
|---|---|---|
| idle | `{id}.svg` *(el base)* | Postura de combate neutra, arma lista. Es el que "respira". |
| attack | `{id}_attack.svg` | Golpe **en el sitio** (el lunge lo anima el código). |
| hurt | `{id}_hurt.svg` | Retroceso / flinch de dolor. |
| down | `{id}_down.svg` | Derrotado, arrodillado / desplomándose. |

### 1a. Clases jugador — PRIORIDAD MÁXIMA (siempre en pantalla) → 4 estados c/u

| id (registry) | Clase | Notas de diseño |
|---|---|---|
| `marauder` | Marauder (Sith Warrior) | Melé pesado, doble sable rojo / sable a dos manos. Armadura recia. |
| `inquisitor` | Inquisitor (Sith Sorcerer) | Túnica, rayos de la Fuerza. Pose de canalización para `_attack`. |
| `assassin` | Assassin (Sith Shadow) | Sigilo, doble sable. Esbelto, capucha. |

*(Existe también `character` = retrato genérico de fallback.)*

### 1b. Compañeros (combaten contigo → ideal 4 estados; mínimo idle)

| id | Nombre | Notas |
|---|---|---|
| `kaelis` | Kaelis Dren | *(ya tiene retrato idle)* |
| `v3x9` | V3X-9 | Droide. *(ya tiene retrato idle)* |
| `serana` | Serana Voss | Sin arte aún. |
| `torvak` | Torvak | Sin arte aún. |
| `echo_shade` | Echo Shade | Sin arte aún. |

### 1c. NPCs nombrados — solo retrato idle (aparecen en diálogo; encuadre busto/cuerpo)

| id | Nombre | Descripción breve (para el prompt) |
|---|---|---|
| `npc_lord_malvek` | Lord Malvek | Sith Lord enjuto, pelo plateado, sonrisa de serpiente. |
| `npc_blind_seer_tavros` | Tavros the Unseen | Figura con ojos vendados, profético. |
| `npc_captain_rhea` | Captain Rhea Vayne | Comandante de guarnición imperial. |
| `npc_darth_seris` | Darth Seris | Mujer cuya presencia hiela la sala. |
| `npc_moff_kallus` | Moff Kallus | Burócrata corpulento, manos sudorosas. |
| `npc_acolyte_thirix` | Acolyte Thirix | Zabrak joven, arrepentido. |
| `npc_merchant_drayven` | Drayven | Mercader de armas imperial. |
| `npc_vex` | Vex | Twi'lek tratante de información. |
| `npc_broker_neth` | Broker Neth | Jefe del Exchange en Nar Shaddaa. |
| `npc_cyra_venn` | Cyra Venn | Cazarrecompensas Mirialan letal. |
| `npc_dockmaster_kull` | Dockmaster Kull | Gamorreano masivo, jefe de muelles. |
| `npc_zek` | Zek | Duros nervioso, tratante de secretos. |
| `npc_mira` | Mira | Humana cortante, cantinera veterana. |
| `npc_arms_dealer` (Saka) | Saka | Weequay con brazo mecánico. |
| `npc_alchemist` (Ossian) | Ossian | Sith caído, alquimista. |
| `npc_queen_talira` | Queen Talira Marath | Monarca de Onderon. |
| `npc_general_therrik` | General Voss Therrik | General veterano de Onderon. |
| `npc_ronar_sol` | Ronar Sol | Jedi infiltrado en la resistencia. |
| `npc_dregg` | Dregg | Zabrak, gestor del coliseo. |
| `npc_rhen` | Rhen | Acólito tímido. |

> ⚠️ Verifica el `id` exacto de cada NPC en
> [`src/game/data/npcs/planet-npcs.ts`](../src/game/data/npcs/planet-npcs.ts) antes de
> nombrar archivos — algunos ids arriba son aproximados.

### 1d. Enemigos (57 templates) — idle siempre; los marcados 👑 merecen 4 estados

> Hoy varios **reutilizan** retrato (rompe la inmersión) o caen al SVG genérico. El `id`
> es el `EnemyTemplate.id` (autoridad: `enemy-registry.ts` / `planet-enemies.ts`).

**Korriban / Sith:** `sith_acolyte`, `sith_pureblood`, `klor_slug`, `klor_slug_queen` 👑,
`tuk_ata`, `tukata_alpha` 👑, `shyrack`, `hssiss`, `terentatek` 👑, `tomb_droid`,
`tomb_wraith`, `tomb_beast`, `tomb_guardian_boss` 👑, `mine_overseer` 👑 (Overseer Drex),
`smuggler_raider`, `thane_deserter` 👑, `ragnos_spirit` 👑 (Spirit of Marka Ragnos),
`darth_voren` 👑, `daryth_rival` 👑, `imperial_guard`.

**Dromund Kaas:** `kaas_vine_cat`, `kaas_shadow_assassin`, `kaas_temple_voice` 👑,
`kaas_gundark`, `kaas_gundark_alpha` 👑, `mortis_assassin`, `temple_sentinel`,
`sanctum_keeper` 👑, `sludge_creeper`, `undercroft_horror` 👑.

**Nar Shaddaa:** `street_thug`, `bounty_hunter`, `exchange_enforcer`, `rakghoul`,
`exchange_boss` 👑.

**Dxun / Onderon:** `boma_beast`, `drexl_larva`, `mandalorian_scout`, `mandalorian_warrior`,
`cannok`, `tomb_lord_dxun` 👑, `kath_hound`, `kinrath`.

**Telos / varios:** `mercenary`, `corrupted_guardian`, `czerka_merc`, `salvage_droid`,
`wild_beast`, `rakata_construct`.

**Malachor V:** `storm_beast`, `shadow_assassin`, `void_wraith`, `sith_marauder_elite`,
`ghost_captain` 👑, `darth_sion` 👑, `darth_nihilus` 👑, `darth_traya` 👑.

---

## 2. Iconos de habilidad (64) — cuadrado 256/512, fondo transparente

> Nombre de archivo = el **icon slug** de la tabla. El color/elemento te da la paleta del
> prompt: `physical`=acero, `energy`=cian, `mental`=índigo, `force`=violeta,
> `poison`=verde, `fire`=naranja, `shock`=violeta eléctrico.

##### Marauder
| Skill | icon slug (file) | Damage type |
|---|---|---|
| Heavy Slash | `heavy-slash` | physical |
| Cleave | `cleave` | physical |
| Saber Throw | `saber-throw` | energy |
| Rage Burst | `rage-burst` | physical |
| Execute | `execute` | physical |
| Unstoppable | `unstoppable` | buff |
| Blood Rage | `blood-rage` | buff |
| Annihilation | `annihilation` | physical |
| Flurry | `flurry` | physical |
| Power Attack | `power-attack` | physical |
| Critical Strike | `critical-strike` | physical |
| Force Choke Slam | `choke` | force |
| Sundering Strike | `sunder` | physical |
| Defiant Roar | `roar` | mental |
| Berserker's Trance | `berserkers-trance` | buff |
| Vicious Throw | `vicious-throw` | energy |
| Rallying Cry | `rallying-cry` | buff |

##### Inquisitor
| Skill | icon slug (file) | Damage type |
|---|---|---|
| Lightning Bolt | `lightning-bolt` | shock |
| Drain Life | `drain-life` | force |
| Force Storm | `force-storm` | shock |
| Dark Heal | `dark-heal` | heal |
| Mind Crush | `mind-crush` | mental |
| Corruption Aura | `corruption-aura` | buff |
| Chain Lightning | `chain-lightning` | shock |
| Terror Wave | `terror-wave` | mental |
| Force Choke | `force-choke` | force |
| Spectral Armor | `spectral-armor` | buff |
| Madness | `madness` | mental |
| Soul Drain | `soul-drain` | force |
| Nihilus's Hunger | `nihilus-hunger` | force |
| Death Field | `death-field` | force |
| Force Subjugate | `force-subjugate` | mental |

##### Assassin
| Skill | icon slug (file) | Damage type |
|---|---|---|
| Shadow Strike | `shadow-strike` | physical |
| Vanish | `vanish` | buff |
| Poison Blade | `poison-blade` | poison |
| Double Strike | `double-strike` | physical |
| Force Cloak | `force-cloak` | buff |
| Death Mark | `death-mark` | force |
| Backstab | `backstab` | physical |
| Shadow Dash | `shadow-dash` | physical |
| Phantom Execution | `phantom-execution` | force |
| Shadow Step | `shadow-step` | buff |
| Smoke Bomb | `smoke-bomb` | physical |
| Death Blossom | `death-blossom` | physical |
| Voidstrike | `voidstrike` | force |
| Envenom | `envenom` | poison |
| Phantom Blade | `phantom-blade` | physical |
| Toxic Nova | `toxic-nova` | poison |

##### Force Powers (compartidas)
| Skill | icon slug (file) | Damage type |
|---|---|---|
| Force Push | `force-push` | force |
| Force Fear | `force-fear` | mental |
| Force Speed | `force-speed` | buff |
| Force Stasis | `force-stasis` | force |
| Force Heal | `force-heal` | heal |
| Drain Minor | `drain-minor` | force |
| Force Lightning | `force-lightning-universal` | shock |
| Force Choke (univ.) | `force-choke` | force |
| Force Frenzy | `force-frenzy` | buff |
| Force Wave | `force-wave` | force |
| Drain Life (univ.) | `drain-life` | force |
| Mind Control | `force-mind-control` | mental |
| Force Storm (leg.) | `force-storm-legendary` | shock |
| Soul Consumption | `soul-consumption` | force |
| Void Step | `void-step` | force |
| Echo of Malachor | `echo-of-malachor` | force |

> Nota: hoy solo ~13 skills del Marauder llevan `icon` definido en datos; el resto usa el
> slug propuesto (= `id` con guiones). Al añadir el icono, registra el slug en el dato del skill.

---

## 3. Iconos de árbol de talentos — 9 emblemas (PRIORIDAD) + 90 nodos (opcional)

Cada clase tiene 3 árboles. El **emblema de árbol** es lo más visible (cabecera de columna).

| Clase | Árbol (id) | Tema → motivo del emblema |
|---|---|---|
| Marauder | `juggernaut` | Supervivencia/armadura/control → escudo-yelmo Sith. |
| Marauder | `berserker` | Daño bruto/furia/AoE → sable partido en llamas. |
| Marauder | `duelist` | Crítico/precisión 1v1 → sable cruzado con punto de mira. |
| Inquisitor | `sorcerer` | Rayos/ráfaga → mano irradiando relámpagos. |
| Inquisitor | `corruptor` | Corrupción/plagas/drenaje → cráneo con zarcillos. |
| Inquisitor | `dominator` | Miedo/control mental → ojo dominante. |
| Assassin | `shadowblade` | Sigilo/crítico → daga entre sombras. |
| Assassin | `poisoner` | Toxinas/DoT → vial goteante. |
| Assassin | `specter` | Evasión/capa/movilidad → silueta difuminada. |

> Los **90 nodos** individuales (ej. Thick Skin, Keen Edge, Plague Touch…) pueden usar iconos
> más adelante; lista completa en
> [`src/game/data/talents/`](../src/game/data/talents/). Pídemelos por árbol cuando quieras.

---

## 4. Audio — Música (Suno.ai) y SFX

### 4a. Música — `public/audio/music/{id}.ogg`

**Existen (8):** `theme_main`, `korriban_ambient`, `nar_shaddaa_ambient`, `onderon_ambient`,
`dxun_ambient`, `malachor_ambient`, `combat_normal`, `combat_boss`.

**Faltan (planetas que hoy reutilizan ambiente)** — buenos candidatos para Suno:
- `dromund_kaas_ambient` — capital imperial, tormenta perpetua, coros oscuros.
- `dantooine_ambient` — pradera serena, melancólico.
- `telos_ambient` — estación restaurada, sintetizador esperanzado-frío.
- `ziost_ambient` — mundo Sith helado, drones glaciales.
- `cantina_jizz` — música diegética de cantina (Nar Shaddaa).
- (opcional) `victory_sting` / `defeat_sting` — remates cortos de fin de combate.

> Suno es para **música**. Para SFX (abajo) usa un generador de efectos (p. ej. ElevenLabs
> SFX o similar); aquí los listo igualmente porque comparten el mismo cableado.

### 4b. SFX — hoy **sintetizados** en [`audio-manager.ts`](../src/game/audio/audio-manager.ts); sustituibles por samples

Tipo `SfxId` (en [`src/game/audio/types.ts`](../src/game/audio/types.ts)) — 15 efectos:

| SfxId | Uso | Sugerencia |
|---|---|---|
| `click` | Botón UI | clic seco, sutil |
| `hover` | Hover UI | tick suave |
| `open_panel` | Abrir panel | whoosh metálico |
| `close_panel` | Cerrar panel | whoosh inverso |
| `combat_hit_light` | Golpe leve | impacto de sable corto |
| `combat_hit_heavy` | Golpe fuerte (≥60 dmg) | impacto grave + cuerpo |
| `combat_crit` | Crítico | clang agudo + reverb |
| `combat_miss` | Fallo | silbido al aire |
| `combat_dodge` | Esquiva | swish + paso |
| `saber_swing` | Windup melé | encendido/zumbido de sable |
| `force_lightning` | Windup Fuerza/rayo | crepitar eléctrico |
| `level_up` | Subir nivel | acorde ascendente oscuro |
| `item_pickup` | Recoger objeto | tintineo |
| `quest_complete` | Misión completada | fanfarria breve |
| `dialogue_advance` | Avanzar diálogo | blip de texto |

> El cableado ya existe; cuando tengas los `.ogg`, se cargan con Howler en `audio-manager.ts`
> sin tocar el resto del juego (pídemelo y lo conecto).

---

## 5. Cómo pedírmelo en la otra sesión

Los prompts **ya están escritos** en [`docs/assets/`](assets/) (pixel art). Para producir:

1. Copia la línea de sujeto del catálogo + el **STYLE SUFFIX** correspondiente de
   [`assets/README.md`](assets/README.md) + el NEGATIVE global → lánzalo en Leonardo/Suno.
2. Mete el resultado en la carpeta fuente, **keyéalo** con
   [`scripts/convert-characters.ps1`](../scripts/convert-characters.ps1) (personajes) y regístralo.
3. Ejecuta **`/asset-catalog`** para re-sincronizar el catálogo (marca ✅ lo que ya existe y
   escribe prompts para lo que falte). Ver [`.claude/skills/asset-catalog/SKILL.md`](../.claude/skills/asset-catalog/SKILL.md).

Si quieres que ajuste un prompt concreto, tráeme el `id` + (opcional) una imagen de anclaje de
estilo y lo afino (seed, modifiers, negative).
