# Música — prompts de Suno.ai

Toda la banda sonora, una ficha por pista. **Nada de arte aquí**: los prompts de personaje viven en sus propios ficheros (ver [`README.md`](README.md)).

> **Cómo usarlo:** pega el bloque **Style** en la casilla de estilo de Suno, activa **Instrumental** salvo que la ficha diga lo contrario, genera 2–3 min y recorta una sección que cierre sobre sí misma. Exporta a OGG en `public/audio/music/{id}.ogg`.

> **Alta de una pista nueva:** amplía el union `MusicTrackId` en [`src/game/audio/types.ts`](../../src/game/audio/types.ts) y asigna `musicTrackId` a la zona en [`src/game/data/zones/all-zones.ts`](../../src/game/data/zones/all-zones.ts).

---

## Tema principal y combate

### `theme_main` — Tema principal
**Archivo:** `public/audio/music/theme_main.ogg` · **Audio:** ✅ en disco · **Cableado:** ✅ en `MusicTrackId` · **Suena en:** 1 zona(s)
> Suena en el menú principal y en el puente de tu nave. Es la promesa del juego: grandeza Sith y tragedia. Debe poder escucharse cien veces sin cansar.

**Suno — Style**
```
epic dark orchestral main theme, Star Wars Sith villain grandeur, ominous low brass statement of a single memorable four-note motif, deep male choir in Latin, taiko drums and timpani, soaring tragic strings that answer the brass, slow inexorable build from a solitary cello to an overwhelming full-orchestra climax, then a quiet unresolved coda, cinematic, wide concert-hall reverb
```
**Título sugerido:** Rise of the Triumvirate · **Instrumental:** OFF (voz/coro indicado) · **Duración:** 2:30–3:00 · **Tempo:** 72–80 BPM, rubato en la apertura · **Tonalidad:** Re menor
**Exclude styles:** `pop, rap, edm, upbeat, cheerful, lo-fi, spoken word, modern drums`
**Loop:** No necesita bucle perfecto — se desvanece en el menú. Marca un punto de reentrada limpio después del clímax.
**Zonas:** Puente de la Nave

### `combat_normal` — Combate estándar
**Archivo:** `public/audio/music/combat_normal.ogg` · **Audio:** ✅ en disco · **Cableado:** ✅ en `MusicTrackId`
> El 90% de los combates del juego. Tiene que empujar sin robar atención: nada de melodía fuerte que compita con el HUD y los golpes.

**Suno — Style**
```
driving dark hybrid-orchestral battle music, relentless sixteenth-note low string ostinato, war percussion with a hard backbeat, short aggressive brass stabs on the accents, electric bass reinforcement, rising tension with no dominant melody line, propulsive and repetitive by design, dry punchy mix
```
**Título sugerido:** Blade Discipline · **Instrumental:** ON · **Duración:** 2:00–2:30 · **Tempo:** 138–145 BPM · **Tonalidad:** Mi menor
**Exclude styles:** `pop, rap, edm, dubstep, cheerful, vocals, solo melody, ballad`
**Loop:** **Bucle perfecto obligatorio.** Corta en un compás completo de 8 tiempos; el combate puede durar mucho más que la pista.

### `combat_boss` — Combate de jefe
**Archivo:** `public/audio/music/combat_boss.ogg` · **Audio:** ✅ en disco · **Cableado:** ✅ en `MusicTrackId`
> Los 17 jefes del juego. Cuando entra esta pista el jugador debe saber, sin leer nada, que esto es distinto.

**Suno — Style**
```
epic Sith boss battle, full dramatic choir chanting ominously in Latin, thunderous taiko and timpani barrages, aggressive stacked brass, frantic tremolo strings climbing in semitones, a pipe organ underneath, overwhelming and relentless, huge cinematic mix with deep sub
```
**Título sugerido:** The Weight of Thrones · **Instrumental:** OFF (voz/coro indicado) · **Duración:** 2:30–3:00 · **Tempo:** 150–160 BPM · **Tonalidad:** Do menor
**Exclude styles:** `pop, rap, edm, cheerful, clean solo vocals, spoken word`
**Loop:** Bucle en la sección de coro completo. Evita que el arranque suene a intro si se repite.

## Ambientes de planeta

### `korriban_ambient` — Korriban — exploración
**Archivo:** `public/audio/music/korriban_ambient.ogg` · **Audio:** ✅ en disco · **Cableado:** ✅ en `MusicTrackId` · **Suena en:** 21 zona(s)
> Mundo natal Sith, tumbas y academia. Las primeras horas del juego suenan así: seco, antiguo, vigilado.

**Suno — Style**
```
desolate dark ambient, Sith tomb world, low ominous sustained drones, a distant whispering choir just below the threshold of words, sparse ethnic frame drum hits at long irregular intervals, dry desert wind, bowed metal and stone textures, eerie and ancient, almost no melody
```
**Título sugerido:** Valley of the Dark Lords · **Instrumental:** ON · **Duración:** 3:00 · **Tempo:** libre, sin pulso marcado · **Tonalidad:** centro tonal en Re, modo frigio
**Exclude styles:** `pop, edm, drums groove, upbeat, melody lead, orchestral fanfare`
**Loop:** Bucle largo e imperceptible: sin eventos que delaten el punto de corte.
**Zonas:** Exterior de la Academia · Academia Sith · Valle de los Lores Oscuros · Tumba de Ajunta Pall · Arena de Entrenamiento · Minas de Esclavos · Asentamiento de Dreshdae · Tumba de Tulak Hord · Puerto Espacial de Kaas City · Ciudadela Imperial · Bazar de Kaas City · Jungla Tormentosa · El Templo Oscuro · Sanctasanctórum del Templo · La Cripta · Plataforma de New Adasta · New Adasta · Los Yermos Helados · La Tumba Cantora · Tumba de Ragnos — Entrada · Tumba de Ragnos — Salas de los Muertos

### `dromund_kaas_ambient` — Dromund Kaas — exploración
**Archivo:** `public/audio/music/dromund_kaas_ambient.ogg` · **Audio:** ⬜ por producir · **Cableado:** ⬜ falta declarar el id
> Capital imperial bajo tormenta perpetua. Es el peso del Imperio, no el misterio de las tumbas: orden opresivo.

**Suno — Style**
```
imperial capital under eternal storm, dark militaristic orchestral ambient, heavy rain and distant rolling thunder woven into the texture, low foreboding male choir held on one syllable, slow ominous brass swells answered by silence, a distant martial snare pattern barely audible, oppressive grandeur, wet cavernous reverb
```
**Título sugerido:** Eternal Storm · **Instrumental:** OFF (voz/coro indicado) · **Duración:** 3:00 · **Tempo:** 60 BPM implícito en el tambor lejano · **Tonalidad:** Do menor
**Exclude styles:** `pop, edm, cheerful, bright strings, solo melody, acoustic guitar`
**Loop:** La lluvia cubre la costura — corta dentro de un tramo de lluvia sostenida.

### `ziost_ambient` — Ziost — exploración
**Archivo:** `public/audio/music/ziost_ambient.ogg` · **Audio:** ⬜ por producir · **Cableado:** ⬜ falta declarar el id
> Primera capital Sith, congelada y muerta. El planeta guarda un secreto que canta: la nota de coro sostenida es el gancho.

**Suno — Style**
```
glacial dark ambient, frozen dead Sith capital, deep sub-bass drones under everything, ice crackle and groaning glacial pressure as percussion, a single distant wordless choir note held endlessly as if something ancient were waking, glassy high harmonics, creeping dread, vast empty space in the mix
```
**Título sugerido:** The Singing Tomb · **Instrumental:** OFF (voz/coro indicado) · **Duración:** 3:00 · **Tempo:** sin pulso · **Tonalidad:** pedal en La bemol
**Exclude styles:** `pop, edm, drums, warm strings, melody, percussion groove`
**Loop:** La nota de coro sostenida enmascara el bucle. Corta a mitad de la nota.

### `nar_shaddaa_ambient` — Nar Shaddaa — exploración
**Archivo:** `public/audio/music/nar_shaddaa_ambient.ogg` · **Audio:** ✅ en disco · **Cableado:** ✅ en `MusicTrackId` · **Suena en:** 5 zona(s)
> La Luna de los Contrabandistas. Único planeta con groove: aquí el peligro es humano y transaccional, no sobrenatural.

**Suno — Style**
```
neon-noir downtempo, smoky analog synth pads, sultry duduk and breathy tenor saxophone trading phrases, lazy electronic groove with brushed hats and a soft sub-bass pulse, rain on neon, tape saturation and vinyl noise, seedy and nocturnal, night-city reverb
```
**Título sugerido:** Neon Debt · **Instrumental:** ON · **Duración:** 3:00 · **Tempo:** 82 BPM · **Tonalidad:** Fa sostenido menor
**Exclude styles:** `orchestral, choir, epic, edm drop, rap, cheerful`
**Loop:** Bucle de 8 compases sobre el groove. Es el único ambiente del juego con pulso constante.
**Zonas:** El Paseo · Antro de Pazaak · Mercado de las Sombras · Ciudad Baja · Cuartel General del Intercambio

### `onderon_ambient` — Onderon — exploración
**Archivo:** `public/audio/music/onderon_ambient.ogg` · **Audio:** ✅ en disco · **Cableado:** ✅ en `MusicTrackId` · **Suena en:** 1 zona(s)
> Ciudad amurallada y corte real. Es el único mundo que suena noble y cálido — con la intriga cociéndose debajo.

**Suno — Style**
```
regal exotic orchestral, lush warm string section, a solo woodwind melody with an eastern modal inflection, light hand percussion and frame drums, harp and dulcimer ornaments, courtly grandeur with a persistent low drone of unease beneath the melody, noble and warm, concert-hall space
```
**Título sugerido:** The Iziz Court · **Instrumental:** ON · **Duración:** 3:00 · **Tempo:** 88 BPM · **Tonalidad:** Sol menor con color dórico
**Exclude styles:** `pop, edm, rock drums, choir, dark ambient, distortion`
**Loop:** Corta al final de una frase melódica completa para que el bucle no suene truncado.
**Zonas:** Ciudad Real de Iziz

### `dxun_ambient` — Dxun — exploración
**Archivo:** `public/audio/music/dxun_ambient.ogg` · **Audio:** ✅ en disco · **Cableado:** ✅ en `MusicTrackId` · **Suena en:** 1 zona(s)
> Luna selvática de Onderon, campamentos mandalorianos y depredadores. Primitivo y físico: percusión por encima de todo.

**Suno — Style**
```
primal tribal war ambient, deep layered jungle drums and log percussion driving the whole piece, low brass horn calls answering across a distance like Mandalorian battle-horns, bone flute fragments, jungle insect and predator textures woven in, dangerous and feral, humid close mix
```
**Título sugerido:** The Demon Moon · **Instrumental:** ON · **Duración:** 3:00 · **Tempo:** 96 BPM · **Tonalidad:** Mi menor pentatónica
**Exclude styles:** `orchestral strings, choir, synth, pop, edm, cheerful`
**Loop:** Bucle sobre el patrón de tambores; que las llamadas de cuerno caigan fuera del punto de corte.
**Zonas:** Jungla de Dxun

### `dantooine_ambient` — Dantooine — exploración
**Archivo:** `public/audio/music/dantooine_ambient.ogg` · **Audio:** ⬜ por producir · **Cableado:** ⬜ falta declarar el id · **Suena en:** 1 zona(s)
> Llanuras y ruinas del enclave Jedi. El respiro emocional del juego: lo único hermoso que visita un Sith.

**Suno — Style**
```
serene melancholic pastoral, soft warm string pads, a solo woodwind melody left deliberately unresolved, gentle acoustic guitar harmonics, distant wind over open grassland, an undercurrent of loss beneath the peace, spacious and unhurried, natural room reverb
```
**Título sugerido:** What the Grass Kept · **Instrumental:** ON · **Duración:** 3:00 · **Tempo:** 64 BPM · **Tonalidad:** La mayor con inflexiones menores
**Exclude styles:** `dark ambient, choir, percussion, epic, edm, pop`
**Loop:** Corta en el silencio entre dos frases de la melodía solista.
**Zonas:** Ruinas del Enclave Jedi

### `telos_ambient` — Telos IV — exploración
**Archivo:** `public/audio/music/telos_ambient.ogg` · **Audio:** ⬜ por producir · **Cableado:** ⬜ falta declarar el id · **Suena en:** 1 zona(s)
> Estación orbital y superficie en recuperación. Ciencia ficción fría con una esperanza frágil y probablemente falsa.

**Suno — Style**
```
cold hopeful sci-fi ambient, restored space-station synth pads, glassy crystalline bell textures, a slow arpeggiated sequence rising and never quite arriving, faint station hum and air handling, fragile optimism suspended over emptiness, clean wide stereo field
```
**Título sugerido:** Restoration Project · **Instrumental:** ON · **Duración:** 3:00 · **Tempo:** 72 BPM en el arpegio · **Tonalidad:** Do mayor virando a menor
**Exclude styles:** `orchestral, choir, drums, pop, edm, distortion, organic instruments`
**Loop:** El arpegio marca el bucle: corta al completar un ciclo del secuenciador.
**Zonas:** Estación Ciudadela

### `malachor_ambient` — Malachor V — exploración
**Archivo:** `public/audio/music/malachor_ambient.ogg` · **Audio:** ✅ en disco · **Cableado:** ✅ en `MusicTrackId` · **Suena en:** 3 zona(s)
> El mundo roto, acto final. Terror cósmico: la Fuerza misma está herida aquí y el sonido debe doler un poco.

**Suno — Style**
```
bleak cosmic-horror dark ambient, dissonant detuned string clusters sliding microtonally against each other, vast sub-bass void drones, a choir of the dead murmuring in reversed fragments, sparse metallic impacts with impossibly long decay, crushing and sparse, cavernous inhuman space
```
**Título sugerido:** The Wound · **Instrumental:** OFF (voz/coro indicado) · **Duración:** 3:00 · **Tempo:** sin pulso · **Tonalidad:** sin centro tonal estable — buscado
**Exclude styles:** `melody, groove, pop, edm, warm strings, cheerful, resolution`
**Loop:** Bucle largo. Deja que los impactos metálicos decaigan del todo antes del corte.
**Zonas:** Superficie de Malachor V · Catedral del Hambre — Umbral · Catedral del Hambre — Nave

## Stingers y diegético

### `cantina_jizz` — Cantina (diegético)
**Archivo:** `public/audio/music/cantina_jizz.ogg` · **Audio:** ⬜ por producir · **Cableado:** ⬜ falta declarar el id
> Suena desde dentro de la escena en las cantinas: la banda del local. Debe sonar a grabación de sala, no a banda sonora.

**Suno — Style**
```
Star Wars cantina jizz-wail band, upbeat jazzy brass ensemble, kloo horn lead trading with a squealing reed, bouncy swing groove with upright bass and brushed drums, fizzy retro-future lounge, deliberately lo-fi as if heard through a busy room, diegetic source music
```
**Título sugerido:** Dreshdae Shuffle · **Instrumental:** ON · **Duración:** 2:00 · **Tempo:** 132 BPM swing · **Tonalidad:** Si bemol mayor
**Exclude styles:** `orchestral, dark, choir, epic, edm, modern pop`
**Loop:** Bucle de 16 compases. Mézclalo apagado y con poca dinámica — va por debajo del diálogo.

### `victory_sting` — Sting de victoria
**Archivo:** `public/audio/music/victory_sting.ogg` · **Audio:** ⬜ por producir · **Cableado:** ⬜ falta declarar el id
> Salta al ganar un combate. Oscuro, no heroico: has ganado, pero sigues siendo Sith.

**Suno — Style**
```
short triumphant dark fanfare, rising brass and a single choir hit landing on a powerful unresolved minor chord, a taiko flourish underneath, cinematic and brief, no fade
```
**Título sugerido:** Spoils · **Instrumental:** OFF (voz/coro indicado) · **Duración:** 4–6 segundos · **Tempo:** — · **Tonalidad:** Re menor
**Exclude styles:** `cheerful, major key resolution, pop, long intro, fade in`
**Loop:** Sin bucle. Ataque inmediato en el primer frame y cola corta y limpia.

### `defeat_sting` — Sting de derrota
**Archivo:** `public/audio/music/defeat_sting.ogg` · **Audio:** ⬜ por producir · **Cableado:** ⬜ falta declarar el id
> Salta al caer en combate. Breve, sin drama: en la filosofía Sith, morir es una respuesta.

**Suno — Style**
```
short somber defeat sting, descending detuned strings over a low mournful brass swell, a single distant tolling bell, fading into silence, cinematic and restrained, no percussion
```
**Título sugerido:** The Weak Perish · **Instrumental:** ON · **Duración:** 3–5 segundos · **Tempo:** — · **Tonalidad:** Sol menor
**Exclude styles:** `epic, loud, drums, choir, cheerful, hopeful resolution`
**Loop:** Sin bucle. Ataque inmediato y desvanecido total a silencio.

---

## Diagnóstico de cableado

*Generado a partir de `musicTrackId` en las zonas — no es una lista de tareas de audio,
sino de qué zonas suenan hoy a un planeta que no es el suyo.*

**Zonas con música prestada de otro planeta**

- `dromund_kaas_spaceport` (Puerto Espacial de Kaas City) → `korriban_ambient`
- `dromund_kaas_citadel` (Ciudadela Imperial) → `korriban_ambient`
- `dromund_kaas_market` (Bazar de Kaas City) → `korriban_ambient`
- `dromund_kaas_jungle` (Jungla Tormentosa) → `korriban_ambient`
- `dromund_kaas_temple` (El Templo Oscuro) → `korriban_ambient`
- `dromund_kaas_sanctum` (Sanctasanctórum del Templo) → `korriban_ambient`
- `dromund_kaas_undercroft` (La Cripta) → `korriban_ambient`
- `ziost_spaceport` (Plataforma de New Adasta) → `korriban_ambient`
- `ziost_citadel` (New Adasta) → `korriban_ambient`
- `ziost_wastes` (Los Yermos Helados) → `korriban_ambient`
- `ziost_tomb` (La Tumba Cantora) → `korriban_ambient`

**Zonas sin `musicTrackId` propio** (22) — heredan la pista que ya sonaba

`onderon_palace` · `onderon_undercity` · `dxun_mando_camp` · `dxun_sith_tomb` · `dantooine_plains` · `dantooine_crystal_cave` · `dantooine_sublevel` · `telos_surface` · `telos_rakata_lab` · `malachor_depths` · `malachor_ghost_ship` · `malachor_trayus` · `dungeon_ragnos_puzzle` · `dungeon_ragnos_guardian` · `dungeon_ragnos_sanctum` · `dungeon_ragnos_vault` · `dungeon_cathedral_puzzle` · `dungeon_cathedral_altar` · `dungeon_cathedral_void` · `dungeon_cathedral_heart` · `player_ship_quarters` · `player_ship_hold`
