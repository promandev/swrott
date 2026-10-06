# Enemigos y jefes — prompts de combate

Los 66 enemigos del bestiario (17 jefes), agrupados por planeta y ordenados por nivel. Los **jefes** llevan las cuatro poses de combate; los esbirros, solo la base. Datos: `src/game/engine/combat/enemies.ts` y `planet-enemies.ts`.

> **Cómo usarlo:** copia el bloque de prompt tal cual en Leonardo.ai. El *negative prompt*
> es común a todo el fichero (abajo) — pégalo una vez en su casilla. El nombre de archivo
> **debe** coincidir con el `id` indicado o el juego no encontrará el arte.

<details><summary><b>Negative prompt (común a todas las entradas)</b></summary>

```
photo, photorealistic, 3d render, octane, blurry, soft focus, anti-aliased edges, jpeg artifacts, smooth gradients, watermark, signature, text, caption, UI, frame, border, drop shadow, cast shadow on ground, busy background, multiple characters, cropped, out of frame, extra limbs, extra fingers, deformed hands, lens flare, bokeh
```
</details>

---

## Korriban

*Paleta del planeta: arenisca roja, obsidiana, oro deslustrado, brasa carmesí; dos soles duros y polvo en suspensión*

### Acólito Sith — `sith_acolyte`
**Tipo:** Enemigo · **Nivel:** 1 · **Rango:** minion · **Archivo:** `public/images/characters/sith_acolyte.svg` · **Estado:** ✅ en disco
> Un compañero de estudios que compite por el favor de tu maestro. Peligroso y desesperado.

**Prompt — pose base (idle)**
```
rival Sith acolyte, young and wiry, black training robes with a crimson sash belt and forearm wraps, brown hair, green eyes, red ritual marks painted on both cheeks, fists clenched at the sides, desperate aggression in the stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green

### Babosa k'lor — `klor_slug`
**Tipo:** Enemigo · **Nivel:** 1 · **Rango:** minion · **Archivo:** `public/images/characters/klor_slug.svg` · **Estado:** ⬜ por generar
> Un insectoide excavador venenoso. Las tumbas de Korriban están infestadas de ellos.

**Prompt — pose base (idle)**
```
venomous insectoid burrower, segmented chitinous grey-green body the length of a man, many small scrabbling legs, dripping mandibles, a blunt eyeless head, hunched low against the ground ready to strike, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Bestia sin rostro: la lectura es la silueta segmentada y las mandíbulas.

### Shyrack — `shyrack`
**Tipo:** Enemigo · **Nivel:** 1 · **Rango:** minion · **Archivo:** `public/images/characters/shyrack.svg` · **Estado:** ⬜ por generar
> Moradores de cuevas con aspecto de murciélago. Débiles en solitario, mortíferos en enjambre.

**Prompt — pose base (idle)**
```
bat-like cave creature, pale grey membrane wings spread wide, an eyeless screeching maw of needle teeth taking up half the body, hooked wing-claws, small clinging hind legs, caught mid-shriek, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Débil en solitario: hazlo pequeño en el lienzo, con las alas abiertas ocupando el ancho.

### Tuk'ata — `tuk_ata`
**Tipo:** Enemigo · **Nivel:** 2 · **Rango:** minion · **Archivo:** `public/images/characters/tuk_ata.svg` · **Estado:** ⬜ por generar
> Sabueso sith sensible a la Fuerza. Cazadores implacables que recorren el Valle de los Lores Oscuros.

**Prompt — pose base (idle)**
```
Sith hound, muscular six-legged quadruped beast, leathery red-black hide over heavy shoulders, bony facial crests and a fan of spines along the spine, no visible eyes, jaws open in a snarl, low stalking stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Seis patas — que se cuenten. Carmesí y negro: usa croma verde.

### Thane — `thane_deserter`
**Tipo:** Enemigo · **Nivel:** 2 · **Rango:** minion · **Archivo:** `public/images/characters/npc_thane.svg` · **Estado:** ✅ en disco
> Un acólito fracasado al que no le queda nada que perder. La desesperación hace peligroso hasta al débil.

**Prompt — pose base (idle)**
```
cornered deserter acolyte, hood thrown back revealing a young terrified face, dark-red under-robe torn at the sleeve, a plain knife drawn in a shaking two-handed grip, backed into a defensive crouch, tears and defiance together, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Reutiliza el diseño de `npc_thane` — mismo rostro y ropa, capucha caída y cuchillo fuera.

### Peregrino corrupto — `corrupted_pilgrim`
**Tipo:** Enemigo · **Nivel:** 2 · **Rango:** minion · **Archivo:** `public/images/characters/corrupted_pilgrim.svg` · **Estado:** ⬜ por generar
> Un aspirante a acólito que nunca salió de las tumbas. El lado oscuro lleva su mente como un guante.

**Prompt — pose base (idle)**
```
corrupted would-be acolyte, tattered pilgrim robes bleached by tomb dust, skin grey and veined black at the temples and hands, eyes filmed over with dark-side corruption, mouth slack, arms hanging wrong, shuffling forward off-balance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** El lado oscuro lleva su mente como un guante: el cuerpo se mueve antes que la intención. Postura desarticulada.

### Carroñero de tumbas — `tomb_scavenger`
**Tipo:** Enemigo · **Nivel:** 2 · **Rango:** minion · **Archivo:** `public/images/characters/tomb_scavenger.svg` · **Estado:** ⬜ por generar
> Un desesperado profanador de tumbas de Dreshdae que desvalija las tumbas del Valle en busca de reliquias que vender — y mata a quien lo delate ante los Supervisores.

**Prompt — pose base (idle)**
```
desperate Dreshdae tomb robber, mismatched scavenged desert wraps and a dust-scarf over the face, a bulging relic sack slung across the back, a crude vibroknife reversed in one grimy hand, crouched and furtive, eyes darting, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Mata a quien lo delate: el cuchillo va en agarre invertido, listo para el asalto, no para el duelo.

### Droide Guardián de la Tumba — `tomb_droid`
**Tipo:** Enemigo · **Nivel:** 3 · **Rango:** minion · **Archivo:** `public/images/characters/tomb_droid.svg` · **Estado:** ⬜ por generar
> Un antiguo droide de seguridad aún funcional tras milenios. Fuertemente blindado.

**Prompt — pose base (idle)**
```
ancient four-legged security droid, corroded bronze armour plating streaked with millennia of verdigris, a single red sensor eye on a squat head, an integrated blaster arm raised, heavy clawed feet, deliberate mechanical gait, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Milenios de corrosión: verdín y arena incrustada en cada junta.

### Daryth — `daryth_rival`
**Tipo:** Enemigo · **Nivel:** 3 · **Rango:** elite · **Archivo:** `public/images/characters/npc_daryth.svg` · **Estado:** ✅ en disco
> Tu acólito rival. Su crueldad solo la iguala su ambición — y hoy, uno de los dos sale de la arena en brazos.

**Prompt — pose base (idle)**
```
rival Sith acolyte in arena combat, dark grey-black acolyte robes with the sleeves bound back, short brown hair, a single red lightsaber raised overhead, cruel ambition on a young face, aggressive forward stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Reutiliza el diseño de `npc_daryth`: misma cara y ropa, sable encendido y la sonrisa vuelta crueldad.

### Draco hssiss — `hssiss_drake`
**Tipo:** Enemigo · **Nivel:** 3 · **Rango:** minion · **Archivo:** `public/images/characters/hssiss_drake.svg` · **Estado:** ⬜ por generar
> Un dragón-lagarto del lado oscuro cuya mordedura supura veneno de sombra. Atraído por los usuarios de la Fuerza.

**Prompt — pose base (idle)**
```
small dark-side drake, serpentine scaled lizard body on four clawed legs, oily black-violet scales, shadow-venom weeping from the fangs and steaming where it drips, glowing violet slit eyes, long low body coiled to lunge, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Versión joven y menor del `hssiss`: misma paleta, la mitad de masa.

### Contrabandista de Dreshdae — `dreshdae_smuggler`
**Tipo:** Enemigo · **Nivel:** 3 · **Rango:** minion · **Archivo:** `public/images/characters/dreshdae_smuggler.svg` · **Estado:** ⬜ por generar
> Un traficante de armas de tres al cuarto que depreda a los acólitos solitarios que dejan la Academia.

**Prompt — pose base (idle)**
```
cheap arms trafficker, scuffed spacer jacket over a stained undershirt, a bandolier of mismatched power packs, blaster pistol already levelled in one hand, greasy hair, opportunist's sneer, weight forward on the toes, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Depreda a acólitos solitarios: ya tiene el bláster apuntando en la pose base.

### Guerrero Sith de Sangre Pura — `sith_pureblood`
**Tipo:** Enemigo · **Nivel:** 4 · **Rango:** elite · **Archivo:** `public/images/characters/npc_archivist_kheln.svg` · **Estado:** ✅ en disco
> Un Sith de sangre pura. Más fuerte en la Fuerza, desdeñoso con las especies inferiores.

**Prompt — pose base (idle)**
```
crimson-skinned Sith pureblood warrior, facial tendrils framing the jaw and a heavy brow ridge, ornate black-and-gold battle armour with layered plates, dual short red lightsabers held low and apart, contemptuous sneer, broad rooted stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Desdeñoso con las especies inferiores: la barbilla alta y la mirada baja.

### Bestia de la Tumba — `tomb_beast`
**Tipo:** Enemigo · **Nivel:** 4 · **Rango:** elite · **Archivo:** `public/images/characters/tomb_beast.svg` · **Estado:** ⬜ por generar
> Una criatura que ha vivido en las tumbas oscuras durante siglos, alimentándose de carroña y de los ecos de la energía del lado oscuro. Brutales ataques de sangrado.

**Prompt — pose base (idle)**
```
gaunt carrion tomb predator, mottled grey hide stretched tight over a visible ribcage, long hooked claws, a blood-matted maw of uneven teeth, sunken white eyes, hunched quadruped stance with the spine arched high, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Siglos comiendo carroña: famélico pero peligroso, todo hueso y tendón.

### Reina Babosa k'lor — `klor_slug_queen`
**Tipo:** Enemigo · **Nivel:** 4 · **Rango:** boss · **Archivo:** `public/images/characters/klor_slug_queen.svg` · **Estado:** ⬜ por generar
> Un horror hinchado del tamaño de un deslizador de carga. Los túneles profundos resuenan con el chasquido de su prole.

**Prompt — pose base (idle)**
```
bloated insectoid queen the size of a cargo speeder, a swollen translucent grey-green egg-sac abdomen dragging behind, a massive armoured thorax, clicking layered mandibles, dozens of small thrashing limbs along the flanks, reared up at the front, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefa. La masa está en el abdomen: que la silueta sea claramente distinta de la `klor_slug` normal.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`klor_slug_queen_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
bloated insectoid queen the size of a cargo speeder, a swollen translucent grey-green egg-sac abdomen dragging behind, a massive armoured thorax, clicking layered mandibles, dozens of small thrashing limbs along the flanks, reared up at the front, reared fully upright with the thorax exposed, layered mandibles spread wide, a spray of venom arcing from the maw, forelimbs slamming down, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`klor_slug_queen_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
bloated insectoid queen the size of a cargo speeder, a swollen translucent grey-green egg-sac abdomen dragging behind, a massive armoured thorax, clicking layered mandibles, dozens of small thrashing limbs along the flanks, reared up at the front, thorax wrenched sideways, egg-sac split and leaking, limbs spasming, mandibles clamped shut, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`klor_slug_queen_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
bloated insectoid queen the size of a cargo speeder, a swollen translucent grey-green egg-sac abdomen dragging behind, a massive armoured thorax, clicking layered mandibles, dozens of small thrashing limbs along the flanks, reared up at the front, collapsed flat with the abdomen ruptured, limbs curled inward over the body, mandibles slack in the dirt, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

### Tuk'ata Alfa — `tukata_alpha`
**Tipo:** Enemigo · **Nivel:** 4 · **Rango:** elite · **Archivo:** `public/images/characters/tukata_alpha.svg` · **Estado:** ⬜ por generar
> El líder de la manada — el doble de grande que los suyos, la melena erizada de energía del lado oscuro. Ha aprendido a cazar acólitos.

**Prompt — pose base (idle)**
```
huge pack-leader Sith hound, twice the mass of its kin, scarred red-black hide, a bristling dark-side mane crackling with visible violet energy along the neck and spine, oversized bony crests, jaws parted in a roar, front legs braced, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** El doble de grande que los suyos: incluye la melena de energía como rasgo exclusivo del alfa.

### Supervisor Drex — `mine_overseer`
**Tipo:** Enemigo · **Nivel:** 4 · **Rango:** elite · **Archivo:** `public/images/characters/npc_overseer_raxis.svg` · **Estado:** ✅ en disco
> El capataz de esclavos de la mina. Su látigo de descargas ha acabado con más vidas que los propios túneles.

**Prompt — pose base (idle)**
```
brutal mine slave-driver, heavy dark overseer armour with a shoulder mantle, a coiled shock-lash whip gripped in one fist, a vibroblade at the hip, a cruel scarred face with a broken nose, shaved head, weight forward and ready to swing, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Comparte lenguaje de diseño con `npc_overseer_raxis` — misma armadura de supervisor, hombre y más brutal.

### Saqueador de Tumbas — `smuggler_raider`
**Tipo:** Enemigo · **Nivel:** 4 · **Rango:** minion · **Archivo:** `public/images/characters/smuggler_raider.svg` · **Estado:** ⬜ por generar
> Un contrabandista de otro mundo que desvalija las tumbas en busca de artefactos. Rápido con el bláster, más rápido huyendo.

**Prompt — pose base (idle)**
```
off-world tomb raider, scuffed spacer jacket and a loaded bandolier, blaster pistol drawn and low, a sack of stolen artefacts slung over one shoulder, dust goggles pushed up on the forehead, shifty sideways stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Rápido con el bláster: postura de fuga, no de combate frontal.

### Acólito duelista — `acolyte_duelist`
**Tipo:** Enemigo · **Nivel:** 4 · **Rango:** elite · **Archivo:** `public/images/characters/acolyte_duelist.svg` · **Estado:** ⬜ por generar
> Un rival que ha sobrevivido a una docena de pruebas a filo de hoja. Preciso, paciente, letal.

**Prompt — pose base (idle)**
```
veteran acolyte duelist, fitted black duelling robes with a reinforced leading shoulder and forearm guard, a dozen thin scars across the face and hands, a single red lightsaber held in a precise high guard, feet placed in a formal duelling line, patient cold focus, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Preciso y paciente: la diferencia con `sith_acolyte` es la técnica — pies colocados, guardia correcta.

### Espectro de la Tumba — `tomb_wraith`
**Tipo:** Enemigo · **Nivel:** 5 · **Rango:** elite · **Archivo:** `public/images/characters/tomb_wraith.svg` · **Estado:** ⬜ por generar
> Un vestigio espectral de un antiguo Lord Sith. Aparece y desaparece de la existencia.

**Prompt — pose base (idle)**
```
spectral Sith lord remnant, semi-transparent tattered robes trailing into nothing below the waist, a skeletal glowing face inside the hood, phasing wisps of dark energy peeling off the shoulders, one skeletal hand extended, floating slightly above the ground, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Aparece y desaparece: el borde inferior debe disolverse. Sin sombra proyectada.

### Guardián de la Tumba — `tomb_guardian_boss`
**Tipo:** Enemigo · **Nivel:** 5 · **Rango:** boss · **Archivo:** `public/images/characters/tomb_guardian_boss.svg` · **Estado:** ⬜ por generar
> Un antiguo constructo de guerra sith reactivado por tu intrusión. Protege el sanctasanctórum interior.

**Prompt — pose base (idle)**
```
towering ancient Sith war construct, a massive body of carved stone and tarnished bronze covered in glowing red glyph-work, a featureless helm-like head, a burning red core visible through the chest seams, enormous fists at the ends of long arms, monolithic planted stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Jefe. Protege el sanctasanctórum: que parezca una estatua que acaba de decidir moverse.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`tomb_guardian_boss_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
towering ancient Sith war construct, a massive body of carved stone and tarnished bronze covered in glowing red glyph-work, a featureless helm-like head, a burning red core visible through the chest seams, enormous fists at the ends of long arms, monolithic planted stance, one enormous fist driven downward in a shattering overhead strike, chest core flaring white-hot, glyph-work blazing along the arms, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`tomb_guardian_boss_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
towering ancient Sith war construct, a massive body of carved stone and tarnished bronze covered in glowing red glyph-work, a featureless helm-like head, a burning red core visible through the chest seams, enormous fists at the ends of long arms, monolithic planted stance, torso wrenched back with stone plates cracking away from the shoulder, core light guttering, fissures spreading, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`tomb_guardian_boss_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
towering ancient Sith war construct, a massive body of carved stone and tarnished bronze covered in glowing red glyph-work, a featureless helm-like head, a burning red core visible through the chest seams, enormous fists at the ends of long arms, monolithic planted stance, collapsed to both knees with one arm broken off at the elbow on the ground, core dimmed to a dull ember, glyphs dark, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Hssiss — `hssiss`
**Tipo:** Enemigo · **Nivel:** 6 · **Rango:** elite · **Archivo:** `public/images/characters/hssiss.svg` · **Estado:** ⬜ por generar
> Un dragón del lado oscuro de las tumbas profundas. Su veneno corroe el espíritu con la misma certeza que la carne.

**Prompt — pose base (idle)**
```
dark-side dragon, long serpentine scaled body on four heavy clawed legs, oily black-and-violet scales, venom dripping from bared fangs, glowing violet eyes, a crest of spines behind the skull, head lowered and body coiled, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Su veneno corroe el espíritu: el goteo debe parecer sombra líquida, no baba.

### Darth Voren — `darth_voren`
**Tipo:** Enemigo · **Nivel:** 7 · **Rango:** boss · **Archivo:** `public/images/characters/npc_darth_voren.svg` · **Estado:** ✅ en disco
> Tu primer maestro en la Academia. Cruel, poderoso y convencido de que eres prescindible. Te aguarda un duelo ritual.

**Prompt — pose base (idle)**
```
Sith Lord master in ritual combat, corpse-pale gaunt skull-like face with burning red eyes, heavy black robe lined in dark crimson with armoured steel pauldrons, sleeves bound back for the duel, a single red lightsaber ignited and held in a contemptuous one-handed guard, utterly composed, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Jefe. Reutiliza la cara y la ropa de `npc_darth_voren`, con el sable encendido y las mangas recogidas. Te considera prescindible: nunca parece esforzarse.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`darth_voren_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
Sith Lord master in ritual combat, corpse-pale gaunt skull-like face with burning red eyes, heavy black robe lined in dark crimson with armoured steel pauldrons, sleeves bound back for the duel, a single red lightsaber ignited and held in a contemptuous one-handed guard, utterly composed, a single precise one-handed saber thrust driven straight forward, robe barely disturbed, face impassive, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`darth_voren_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
Sith Lord master in ritual combat, corpse-pale gaunt skull-like face with burning red eyes, heavy black robe lined in dark crimson with armoured steel pauldrons, sleeves bound back for the duel, a single red lightsaber ignited and held in a contemptuous one-handed guard, utterly composed, half a step back with the free hand raised, the first genuine surprise breaking the composure, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`darth_voren_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
Sith Lord master in ritual combat, corpse-pale gaunt skull-like face with burning red eyes, heavy black robe lined in dark crimson with armoured steel pauldrons, sleeves bound back for the duel, a single red lightsaber ignited and held in a contemptuous one-handed guard, utterly composed, on one knee with the saber fallen and extinguished beside him, one hand pressed to the chest, red eyes still fixed on the viewer, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Terentatek — `terentatek`
**Tipo:** Enemigo · **Nivel:** 8 · **Rango:** boss · **Archivo:** `public/images/characters/terentatek.svg` · **Estado:** ⬜ por generar
> El horror de las tumbas que se alimenta de sangre sensible a la Fuerza. Hasta los Lores Sith hablan de él en susurros. A pocos de los que encuentran uno se les cree — menos aún sobreviven.

**Prompt — pose base (idle)**
```
massive tomb-horror, hunched ape-like body with overlong forelimbs, black bristling spines down the spine and shoulders, huge upward tusks, enormous poison-slick claws, tiny beady hungry eyes in a broad flat face, knuckle-braced stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Se alimenta de sangre sensible a la Fuerza: hasta los Lores Sith le temen. Masa por encima de todo.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`terentatek_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
massive tomb-horror, hunched ape-like body with overlong forelimbs, black bristling spines down the spine and shoulders, huge upward tusks, enormous poison-slick claws, tiny beady hungry eyes in a broad flat face, knuckle-braced stance, rearing to full height with both clawed forelimbs raised overhead to smash down, jaws open past the tusks, spines flared, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`terentatek_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
massive tomb-horror, hunched ape-like body with overlong forelimbs, black bristling spines down the spine and shoulders, huge upward tusks, enormous poison-slick claws, tiny beady hungry eyes in a broad flat face, knuckle-braced stance, head snapped violently to one side, one forelimb thrown out for balance, blood on the tusks, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`terentatek_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
massive tomb-horror, hunched ape-like body with overlong forelimbs, black bristling spines down the spine and shoulders, huge upward tusks, enormous poison-slick claws, tiny beady hungry eyes in a broad flat face, knuckle-braced stance, slumped forward onto both forelimbs with the head hanging, spines flattened, one leg folded beneath, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

### Espíritu de Marka Ragnos — `ragnos_spirit`
**Tipo:** Enemigo · **Nivel:** 10 · **Rango:** boss · **Archivo:** `public/images/characters/ragnos_spirit.svg` · **Estado:** ⬜ por generar
> La sombra atada del Lord Oscuro cuyas conquistas fundaron la Edad de Oro de los Sith. La muerte solo afiló su odio.

**Prompt — pose base (idle)**
```
colossal ancient Sith lord ghost, semi-transparent gold-and-green spectral armour with a tall crowned helm, a long beard of drifting mist, hollow blazing eyes, arms spread wide in judgement, the lower body dissolving into a column of spectral smoke, radiating overwhelming ancient power, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe de mazmorra. La sombra atada del Lord Oscuro que fundó la Edad de Oro sith: escala descomunal, verde y oro en vez de rojo.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`ragnos_spirit_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
colossal ancient Sith lord ghost, semi-transparent gold-and-green spectral armour with a tall crowned helm, a long beard of drifting mist, hollow blazing eyes, arms spread wide in judgement, the lower body dissolving into a column of spectral smoke, radiating overwhelming ancient power, both arms sweeping forward to unleash a torrent of spectral green fire, the crown blazing, the mist-beard streaming back, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`ragnos_spirit_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
colossal ancient Sith lord ghost, semi-transparent gold-and-green spectral armour with a tall crowned helm, a long beard of drifting mist, hollow blazing eyes, arms spread wide in judgement, the lower body dissolving into a column of spectral smoke, radiating overwhelming ancient power, form rippling and briefly doubling as the spectral armour destabilises, crown tilted, mist shredding, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`ragnos_spirit_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
colossal ancient Sith lord ghost, semi-transparent gold-and-green spectral armour with a tall crowned helm, a long beard of drifting mist, hollow blazing eyes, arms spread wide in judgement, the lower body dissolving into a column of spectral smoke, radiating overwhelming ancient power, dissipating from the base upward, armour breaking apart into drifting motes, only the crowned head and blazing eyes still coherent, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

## Dromund Kaas

*Paleta del planeta: negro imperial, gris durasteel mojado, verde jungla profundo, violeta de relámpago; todo bajo lluvia*

### Guardia imperial — `imperial_guard`
**Tipo:** Enemigo · **Nivel:** 9 · **Rango:** minion · **Archivo:** `public/images/characters/sith_acolyte.svg` · **Estado:** ✅ en disco
> Soldado imperial de armadura negra con vibroespada y bláster. Disciplinado e inquebrantable.

**Prompt — pose base (idle)**
```
black-armoured Imperial soldier, full sealed helmet with a narrow visor slit, segmented matte-black plate over a dark bodyglove, a vibrosword in one hand and a blaster holstered at the thigh, rigid disciplined parade stance, rain beading on the plate, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Disciplinado e inquebrantable: la postura es de formación, perfectamente simétrica.

### Gato de las lianas — `kaas_vine_cat`
**Tipo:** Enemigo · **Nivel:** 9 · **Rango:** minion · **Archivo:** `public/images/characters/kaas_vine_cat.svg` · **Estado:** ⬜ por generar
> Un depredador de la jungla de seis extremidades con colmillos bioluminiscentes. Caza en parejas.

**Prompt — pose base (idle)**
```
six-limbed jungle predator, sleek wet-black fur slicked with rain, bioluminescent cyan fangs and eyes glowing through the gloom, a long lashing tail, splayed gripping claws, body flattened low in a pounce-ready crouch, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Caza en pareja pero el sprite es individual. El cian bioluminiscente es la única luz.

### Gundark de la jungla — `kaas_gundark`
**Tipo:** Enemigo · **Nivel:** 10 · **Rango:** minion · **Archivo:** `public/images/characters/kaas_gundark.svg` · **Estado:** ⬜ por generar
> Músculo y furia de cuatro brazos. Los gundarks de Kaas crecen más que sus primos — las tormentas los crían fieros.

**Prompt — pose base (idle)**
```
four-armed jungle brute, grey-green muscled hide, a tusked underbite and small deep-set eyes, large flared ears, two upper arms raised and two lower arms braced, thick-legged and heavy, storm-soaked, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Los gundarks de Kaas crecen más que sus primos: cuatro brazos claramente diferenciados.

### Agente de Mortis — `mortis_assassin`
**Tipo:** Enemigo · **Nivel:** 10 · **Rango:** minion · **Archivo:** `public/images/characters/mortis_assassin.svg` · **Estado:** ⬜ por generar
> La mano de Darth Mortis llega lejos. Sus agentes no lucen ningún emblema — sus hojas envenenadas firman por ellos.

**Prompt — pose base (idle)**
```
unmarked assassin, dark hooded bodysuit with no insignia anywhere, a face-wrap leaving only the eyes, twin poisoned curved daggers held in reverse grip, crouched low and compact, utterly anonymous, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Sus agentes no lucen ningún emblema: literalmente ni una marca, ni un color, ni un adorno.

### Centinela del Templo — `temple_sentinel`
**Tipo:** Enemigo · **Nivel:** 10 · **Rango:** minion · **Archivo:** `public/images/characters/temple_sentinel.svg` · **Estado:** ⬜ por generar
> Un droide de guerra del viejo Imperio, aún haciendo su guardia tras mil años. Su lealtad sobrevivió a sus creadores.

**Prompt — pose base (idle)**
```
ancient war droid, tall weathered bronze chassis green with age, a narrow sensor visor, a long glaive held vertically in both hands, a shock-emitter node on the shoulder, standing in an eternal unmoved sentry pose, vines creeping up one leg, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Mil años de guardia: la vegetación que lo ha empezado a reclamar cuenta el tiempo.

### Bestia de tormenta — `kaas_storm_beast`
**Tipo:** Enemigo · **Nivel:** 10 · **Rango:** minion · **Archivo:** `public/images/characters/kaas_storm_beast.svg` · **Estado:** ⬜ por generar
> Un depredador de la jungla que se ha alimentado del relámpago eterno de Dromund Kaas tanto tiempo que su piel crepita con carga almacenada.

**Prompt — pose base (idle)**
```
jungle predator charged with stored lightning, a heavy quadruped body with dark wet hide, visible violet-white electricity crawling in branching arcs across the flanks and along the spine, glowing overcharged eyes, fur standing on end, braced low with steam rising off the back, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Se ha alimentado del relámpago eterno: la carga almacenada debe recorrer la piel, no rodearla.

### Sombra imperial — `kaas_shadow_assassin`
**Tipo:** Enemigo · **Nivel:** 11 · **Rango:** elite · **Archivo:** `public/images/characters/class_assassin.svg` · **Estado:** ✅ en disco
> Un asesino con armadura negra mate, que se funde con la tormenta de la jungla. Golpea desde el ocultamiento.

**Prompt — pose base (idle)**
```
Imperial shadow assassin, matte-black sealed armour with a smooth segmented helmet and no visor light, twin vibroblades held reversed along the forearms, the silhouette blurring and dissolving into streaks of falling rain at the edges, coiled low, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Golpea desde la tormenta: el contorno debe deshacerse en lluvia por un lado. Comparte lenguaje con la clase `assassin`.

### Gundark alfa — `kaas_gundark_alpha`
**Tipo:** Enemigo · **Nivel:** 11 · **Rango:** elite · **Archivo:** `public/images/characters/kaas_gundark_alpha.svg` · **Estado:** ⬜ por generar
> El que se llevó el brazo de Brakk. Piel llena de cicatrices, colmillos rotos y memoria para cada cazador que lo hirió.

**Prompt — pose base (idle)**
```
giant scarred alpha gundark, one tusk broken off short, a torn ragged ear, deep old scars across the chest and shoulders, storm-beaten grey-green hide, all four massive arms spread wide, head lowered in challenge, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** El que se llevó el brazo de Brakk: la cicatriz y el colmillo roto son obligatorios, son continuidad narrativa.

### Reptador del fango — `sludge_creeper`
**Tipo:** Enemigo · **Nivel:** 11 · **Rango:** minion · **Archivo:** `public/images/characters/sludge_creeper.svg` · **Estado:** ⬜ por generar
> Una cosa pálida y sin ojos que caza en la Cripta por vibración. Los obreros desaparecidos la alimentaron bien.

**Prompt — pose base (idle)**
```
pale eyeless cave horror, a slick segmented amphibian body on short splayed limbs, long sensory feelers waving from a blunt head, translucent skin showing dark organs beneath, dripping with black sludge, crouched and quivering, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Caza por vibración: los apéndices sensoriales están desplegados y tensos.

### Acólito oscuro del culto — `kaas_dark_acolyte`
**Tipo:** Enemigo · **Nivel:** 11 · **Rango:** elite · **Archivo:** `public/images/characters/kaas_dark_acolyte.svg` · **Estado:** ⬜ por generar
> Un devoto de los susurros del Templo Oscuro. Las voces se han comido su nombre, dejando solo hambre y el relámpago.

**Prompt — pose base (idle)**
```
cult dark acolyte, soaked black temple robes with the cowl thrown back, a face gone slack and nameless with eyes rolled to white, violet lightning crawling between the outstretched fingers of both hands, head tilted listening to something that is not there, mouth slightly open, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Las voces se han comido su nombre: la expresión es de escucha, no de odio. Es lo que lo hace inquietante.

### La Voz Superpuesta — `kaas_temple_voice`
**Tipo:** Enemigo · **Nivel:** 12 · **Rango:** boss · **Archivo:** `public/images/characters/kaas_temple_voice.svg` · **Estado:** ⬜ por generar
> Un antiguo espíritu sith atado al Templo Oscuro. Conoce tu nombre. Lo conocía antes de que nacieras.

**Prompt — pose base (idle)**
```
ancient Sith spirit manifest, several overlapping translucent robed silhouettes offset from one another as if speaking as one, a single pair of violet eyes shared between them, swirling dark mist below where legs should be, hoods empty, arms raised in unison, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Conoce tu nombre: el efecto es de varias figuras mal alineadas, no de una sola fantasmal.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`kaas_temple_voice_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
ancient Sith spirit manifest, several overlapping translucent robed silhouettes offset from one another as if speaking as one, a single pair of violet eyes shared between them, swirling dark mist below where legs should be, hoods empty, arms raised in unison, all overlapping silhouettes snapping into perfect alignment for an instant as a wave of violet force erupts forward, eyes blazing white, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`kaas_temple_voice_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
ancient Sith spirit manifest, several overlapping translucent robed silhouettes offset from one another as if speaking as one, a single pair of violet eyes shared between them, swirling dark mist below where legs should be, hoods empty, arms raised in unison, the silhouettes tearing apart out of sync, scattering sideways, the shared eyes flickering, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`kaas_temple_voice_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
ancient Sith spirit manifest, several overlapping translucent robed silhouettes offset from one another as if speaking as one, a single pair of violet eyes shared between them, swirling dark mist below where legs should be, hoods empty, arms raised in unison, the layered figures collapsing inward into a single thinning shape sinking into the floor mist, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

### El Guardián del Sanctasanctórum — `sanctum_keeper`
**Tipo:** Enemigo · **Nivel:** 12 · **Rango:** boss · **Archivo:** `public/images/characters/sanctum_keeper.svg` · **Estado:** ⬜ por generar
> Un imponente constructo de piedra y relámpago atado, alzado por los constructores del Templo para custodiar lo que no debe salir.

**Prompt — pose base (idle)**
```
towering construct of carved black stone bound with arcing chains of lightning, glowing white-violet rune-seams running between the stone plates, a featureless blank face, monolithic shoulders, enormous arms hanging at the sides, standing as an immovable guardian, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Alzado por los constructores del Templo: piedra y relámpago atado, sin una sola parte orgánica.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`sanctum_keeper_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
towering construct of carved black stone bound with arcing chains of lightning, glowing white-violet rune-seams running between the stone plates, a featureless blank face, monolithic shoulders, enormous arms hanging at the sides, standing as an immovable guardian, both arms brought together overhead discharging a column of chained lightning downward, every rune-seam blazing white, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`sanctum_keeper_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
towering construct of carved black stone bound with arcing chains of lightning, glowing white-violet rune-seams running between the stone plates, a featureless blank face, monolithic shoulders, enormous arms hanging at the sides, standing as an immovable guardian, stone plates blown loose from the torso and hanging on the lightning chains, runes flickering erratically, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`sanctum_keeper_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
towering construct of carved black stone bound with arcing chains of lightning, glowing white-violet rune-seams running between the stone plates, a featureless blank face, monolithic shoulders, enormous arms hanging at the sides, standing as an immovable guardian, broken apart at the waist and kneeling in its own rubble, lightning chains gone slack and dark, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

### El Horror de la Cripta — `undercroft_horror`
**Tipo:** Enemigo · **Nivel:** 12 · **Rango:** boss · **Archivo:** `public/images/characters/undercroft_horror.svg` · **Estado:** ⬜ por generar
> Algo que las filtraciones del Templo Oscuro hicieron de un experimento de engendro sith fugado. Anida bajo Kaas City — y sigue creciendo.

**Prompt — pose base (idle)**
```
bloated sithspawn abomination, fused mismatched limbs of different creatures grafted at wrong angles, tumorous corrupted flesh in grey and sickly violet, many weeping eyes scattered across the mass, half-submerged in black water, dragging itself forward, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Un experimento fundido con las filtraciones del Templo: la simetría está rota a propósito en todas partes.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`undercroft_horror_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
bloated sithspawn abomination, fused mismatched limbs of different creatures grafted at wrong angles, tumorous corrupted flesh in grey and sickly violet, many weeping eyes scattered across the mass, half-submerged in black water, dragging itself forward, surging up out of the black water with every mismatched limb thrown forward, the mass of eyes wide, a lamprey mouth opening in the torso, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`undercroft_horror_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
bloated sithspawn abomination, fused mismatched limbs of different creatures grafted at wrong angles, tumorous corrupted flesh in grey and sickly violet, many weeping eyes scattered across the mass, half-submerged in black water, dragging itself forward, recoiling with several limbs torn loose and trailing, eyes squeezed shut across the body, mass sagging, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`undercroft_horror_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
bloated sithspawn abomination, fused mismatched limbs of different creatures grafted at wrong angles, tumorous corrupted flesh in grey and sickly violet, many weeping eyes scattered across the mass, half-submerged in black water, dragging itself forward, sunk back into the black water with only the slack upper mass and dimming eyes above the surface, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

## Nar Shaddaa

*Paleta del planeta: neón magenta y cian sobre óxido y mugre, charcos que reflejan anuncios, humo ámbar*

### Matón callejero — `street_thug`
**Tipo:** Enemigo · **Nivel:** 11 · **Rango:** minion · **Archivo:** `public/images/characters/street_thug.svg` · **Estado:** ⬜ por generar
> Escoria de baja estofa de la Luna de los Contrabandistas. Desesperados y armados con blásters robados.

**Prompt — pose base (idle)**
```
lowlife street thug, mismatched scavenged armour pieces strapped over street clothes, a stolen blaster pistol held sideways, cheap facial tattoos, neon-lit grime on the skin, sneering, cocky loose stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Escoria de baja estofa: el bláster mal agarrado delata que no sabe usarlo.

### Ejecutor del Intercambio — `exchange_enforcer`
**Tipo:** Enemigo · **Nivel:** 12 · **Rango:** minion · **Archivo:** `public/images/characters/exchange_enforcer.svg` · **Estado:** ⬜ por generar
> Músculo del sindicato criminal del Intercambio. Fuertemente armado y leal a los créditos.

**Prompt — pose base (idle)**
```
heavy crime-syndicate enforcer, plated black armour with Exchange sigils on the shoulder, a heavy repeating blaster held across the body, a stun baton on the belt, broad menacing build, helmet under the arm showing a flat unbothered face, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Leal a los créditos: profesionalidad sin convicción.

### Rakghoul — `rakghoul`
**Tipo:** Enemigo · **Nivel:** 12 · **Rango:** minion · **Archivo:** `public/images/characters/rakghoul.svg` · **Estado:** ⬜ por generar
> Seres mutados que acechan en la Ciudad Baja. Su mordedura porta la plaga rakghoul.

**Prompt — pose base (idle)**
```
mutated rakghoul, hunched grey diseased flesh stretched over a warped humanoid frame, long hooked claws, a fanged lamprey maw split wide, weeping plague-sores across the shoulders and back, lunging forward on all fours, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Su mordedura porta la plaga: las llagas deben ser lo primero que se lee.

### Vurl el Malversador — `exchange_accountant`
**Tipo:** Enemigo · **Nivel:** 12 · **Rango:** elite · **Archivo:** `public/images/characters/exchange_accountant.svg` · **Estado:** ⬜ por generar
> Un contable del Intercambio que sisó al jefe equivocado y huyó a los niveles inferiores. Manos blandas, gatillo nervioso y una pequeña fortuna en créditos robados.

**Prompt — pose base (idle)**
```
Exchange accountant turned fugitive, a fine but rumpled suit slept in for a week, soft uncallused hands, thinning hair stuck to a sweating forehead, an expensive holdout blaster held far too tightly in both shaking hands, a bulging credit case clutched under one arm, panic in the eyes, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Manos blandas y gatillo nervioso: el arma cara y el agarre incorrecto cuentan el chiste.

### Cazarrecompensas — `bounty_hunter`
**Tipo:** Enemigo · **Nivel:** 13 · **Rango:** minion · **Archivo:** `public/images/characters/bounty_hunter.svg` · **Estado:** ⬜ por generar
> Cazador profesional que rastrea objetivos en Nar Shaddaa. Bien equipado e ingenioso.

**Prompt — pose base (idle)**
```
professional bounty hunter, sleek armoured flight-suit with a full helmet and rangefinder, a carbine held at low ready, grenades clipped across the chest, a jetpack with scorched vents, balanced and unhurried ready stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Bien equipado e ingenioso: todo el equipo está cuidado, al contrario que el matón callejero.

### El Jefe del Intercambio — `exchange_boss`
**Tipo:** Enemigo · **Nivel:** 16 · **Rango:** boss · **Archivo:** `public/images/characters/exchange_boss.svg` · **Estado:** ⬜ por generar
> Señor del crimen de los bajos fondos de Nar Shaddaa. Rodeado de guardaespaldas y tecnología peligrosa.

**Prompt — pose base (idle)**
```
underworld crime lord, an opulent armoured coat of dark silk over a plated cuirass, chrome cybernetic implants at the temple and along one jaw, a heavy custom blaster resting across one forearm, rings and chains, smug absolute confidence, feet planted wide, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Rodeado de tecnología y guardaespaldas: el lujo y el blindaje deben ir mezclados.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`exchange_boss_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
underworld crime lord, an opulent armoured coat of dark silk over a plated cuirass, chrome cybernetic implants at the temple and along one jaw, a heavy custom blaster resting across one forearm, rings and chains, smug absolute confidence, feet planted wide, the heavy custom blaster brought up two-handed and fired, muzzle flash lighting the coat and the cybernetics, coat flaring, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`exchange_boss_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
underworld crime lord, an opulent armoured coat of dark silk over a plated cuirass, chrome cybernetic implants at the temple and along one jaw, a heavy custom blaster resting across one forearm, rings and chains, smug absolute confidence, feet planted wide, spun a quarter turn by the impact, blaster arm flung wide, implants sparking at the jaw, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`exchange_boss_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
underworld crime lord, an opulent armoured coat of dark silk over a plated cuirass, chrome cybernetic implants at the temple and along one jaw, a heavy custom blaster resting across one forearm, rings and chains, smug absolute confidence, feet planted wide, fallen back against his own armoured chair, blaster on the floor, one hand pressed to the cuirass, disbelief on his face, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

## Onderon

*Paleta del planeta: verde selva y oro real, piedra clara, púrpura de la corte; luz cálida y alta*

### Caudillo jinete de drexl — `drexl_chieftain`
**Tipo:** Enemigo · **Nivel:** 12 · **Rango:** boss · **Archivo:** `public/images/characters/drexl_chieftain.svg` · **Estado:** ⬜ por generar
> Un señor de la guerra saqueador de bestias que cabalga a la batalla sobre un drexl medio domado. Las patrullas orientales de Onderon han sangrado por él demasiado tiempo.

**Prompt — pose base (idle)**
```
beast-riding raider warlord mounted on a half-tamed drexl, the rider in bone-and-hide armour with a horned trophy helm and a long war-lance, the drexl beneath him rearing with wings spread and beak open, chains and goad-hooks biting into the beast's neck, both roaring, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Es jinete y montura en un solo sprite: la bestia está sometida por dolor, no domada — que se vean las cadenas.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`drexl_chieftain_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
beast-riding raider warlord mounted on a half-tamed drexl, the rider in bone-and-hide armour with a horned trophy helm and a long war-lance, the drexl beneath him rearing with wings spread and beak open, chains and goad-hooks biting into the beast's neck, both roaring, the drexl lunging forward with wings driven down and beak snapping while the rider's war-lance is thrust over its head, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`drexl_chieftain_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
beast-riding raider warlord mounted on a half-tamed drexl, the rider in bone-and-hide armour with a horned trophy helm and a long war-lance, the drexl beneath him rearing with wings spread and beak open, chains and goad-hooks biting into the beast's neck, both roaring, the drexl twisting sideways in pain with one wing folded wrong, the rider thrown half out of the saddle and clutching the chains, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`drexl_chieftain_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
beast-riding raider warlord mounted on a half-tamed drexl, the rider in bone-and-hide armour with a horned trophy helm and a long war-lance, the drexl beneath him rearing with wings spread and beak open, chains and goad-hooks biting into the beast's neck, both roaring, the drexl collapsed on its side with wings splayed, the rider pinned beneath one shoulder, lance broken in the dirt, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

### Bestia boma — `boma_beast`
**Tipo:** Enemigo · **Nivel:** 15 · **Rango:** minion · **Archivo:** `public/images/characters/boma_beast.svg` · **Estado:** ⬜ por generar
> Gran depredador nativo de Onderon y Dxun. Poderoso ataque de embestida.

**Prompt — pose base (idle)**
```
large quadruped predator, armoured grey-brown hide in overlapping natural plates, a broad horned head lowered for the charge, massive shoulders, short powerful legs, small furious eyes, mid-charge with dirt kicking back, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Poderoso ataque de embestida: la pose base ya insinúa la carga.

### Larva de drexl — `drexl_larva`
**Tipo:** Enemigo · **Nivel:** 17 · **Rango:** minion · **Archivo:** `public/images/characters/drexl_larva.svg` · **Estado:** ⬜ por generar
> Drexl juvenil. Ya del tamaño de un deslizador y muy agresivo.

**Prompt — pose base (idle)**
```
juvenile drexl, a speeder-sized winged reptilian grub, leathery wings half-spread and still translucent, a snapping hooked beak, a segmented pale underbelly, clawed grasping forelimbs, rearing up aggressively, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Ya del tamaño de un deslizador y muy agresivo: las alas aún no sirven para volar del todo.

## Dxun

*Paleta del planeta: verde-negro de dosel, beskar hierro y carmesí de clan, naranja de hoguera en la niebla*

### Explorador mandaloriano — `mandalorian_scout`
**Tipo:** Enemigo · **Nivel:** 18 · **Rango:** minion · **Archivo:** `public/images/characters/mandalorian_scout.svg` · **Estado:** ⬜ por generar
> Un guerrero mandaloriano de patrulla. Rápido y letal a distancia.

**Prompt — pose base (idle)**
```
fast Mandalorian scout, light grey-blue beskar plate over a dark flexible bodyglove, a compact jetpack, a blaster carbine held at high ready, a T-visor helmet with a scout's antenna, agile ready crouch on the balls of the feet, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Rápido y letal a distancia: armadura ligera, nada que pese.

### Cannok — `cannok`
**Tipo:** Enemigo · **Nivel:** 18 · **Rango:** minion · **Archivo:** `public/images/characters/cannok.svg` · **Estado:** ⬜ por generar
> Depredador de manada de Dxun. Pequeños pero numerosos, abruman a sus presas por número.

**Prompt — pose base (idle)**
```
small pack predator, a stocky lizard-dog body barely knee-high, an oversized jaw that takes up half the skull, mottled green-brown jungle hide, stubby legs, snapping upward with the head low, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Pequeños pero numerosos: la mandíbula desproporcionada es toda la personalidad.

### Guerrero mandaloriano — `mandalorian_warrior`
**Tipo:** Enemigo · **Nivel:** 20 · **Rango:** elite · **Archivo:** `public/images/characters/mandalorian_warrior.svg` · **Estado:** ⬜ por generar
> Mandaloriano veterano. Armadura pesada, armas pesadas y sin miedo.

**Prompt — pose base (idle)**
```
veteran Mandalorian warrior, heavy crimson-and-iron beskar plate with battle scoring, a gauntlet flamethrower on the left forearm, a vibroblade in the right hand, a horned T-visor helm, cape of pelts at the shoulder, unflinching planted stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Armadura pesada, armas pesadas y sin miedo. Carmesí dominante: croma verde.

### Lord de la Tumba de Dxun — `tomb_lord_dxun`
**Tipo:** Enemigo · **Nivel:** 25 · **Rango:** boss · **Archivo:** `public/images/characters/tomb_lord_dxun.svg` · **Estado:** ⬜ por generar
> Antiguo espíritu sith atado a la tumba de Dxun. Domina la sombra y el fuego.

**Prompt — pose base (idle)**
```
ancient Sith spirit, a towering spectral robed figure wreathed in shadow and green flame, a crowned skull face inside the hood, long trailing sleeves ending in skeletal hands, the lower body dissolving into a bank of dark mist, one arm raised commanding the dead, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Domina la sombra y el fuego: el fuego espectral es verde, no naranja.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`tomb_lord_dxun_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
ancient Sith spirit, a towering spectral robed figure wreathed in shadow and green flame, a crowned skull face inside the hood, long trailing sleeves ending in skeletal hands, the lower body dissolving into a bank of dark mist, one arm raised commanding the dead, both skeletal arms sweeping forward as a wall of green spectral flame erupts from the robes, the crowned skull blazing, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`tomb_lord_dxun_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
ancient Sith spirit, a towering spectral robed figure wreathed in shadow and green flame, a crowned skull face inside the hood, long trailing sleeves ending in skeletal hands, the lower body dissolving into a bank of dark mist, one arm raised commanding the dead, the robed form buckling and tearing, green flame guttering down to embers, crown askew, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`tomb_lord_dxun_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
ancient Sith spirit, a towering spectral robed figure wreathed in shadow and green flame, a crowned skull face inside the hood, long trailing sleeves ending in skeletal hands, the lower body dissolving into a bank of dark mist, one arm raised commanding the dead, sinking into the mist from the hem upward, arms falling, only the crowned skull and two green eye-flames remaining, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

## Dantooine

*Paleta del planeta: oro de pradera, piedra blanca caída, azul kyber; luz de tarde larga y melancólica*

### Sabueso kath — `kath_hound`
**Tipo:** Enemigo · **Nivel:** 20 · **Rango:** minion · **Archivo:** `public/images/characters/kath_hound.svg` · **Estado:** ⬜ por generar
> El depredador emblemático de Dantooine. Cazadores de manada que pululan por las llanuras de cristal.

**Prompt — pose base (idle)**
```
pack predator, a shaggy tan-brown quadruped with heavy shoulders and a blunt horned snout, small dark eyes, bared fangs, lean muscular legs, head low and ears flat in a hunting stalk, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** El depredador emblemático de Dantooine: cálido, terroso, casi familiar — lo que lo hace creíble.

### Mercenario — `mercenary`
**Tipo:** Enemigo · **Nivel:** 21 · **Rango:** minion · **Archivo:** `public/images/characters/mercenary.svg` · **Estado:** ⬜ por generar
> Chatarreros y mercenarios que merodean las ruinas. Armados y dispuestos a matar por créditos.

**Prompt — pose base (idle)**
```
ruins salvager mercenary, patched mismatched armour over practical fatigues, a breath-mask hanging loose at the throat, a blaster rifle held at the hip and a vibroblade at the belt, dust-caked boots, an opportunist's wary stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Dispuesto a matar por créditos: equipo remendado, sin lealtad a nada.

### Kinrath — `kinrath`
**Tipo:** Enemigo · **Nivel:** 22 · **Rango:** minion · **Archivo:** `public/images/characters/kinrath.svg` · **Estado:** ⬜ por generar
> Criaturas con aspecto de araña que habitan las cuevas de cristal. Venenosas y territoriales.

**Prompt — pose base (idle)**
```
cave spider-creature, a pale armoured carapace with a faint crystalline sheen, many jointed legs raised high, a venom-tipped segmented tail arched over the back, clustered black eyes, crystal-cave light glinting off the shell, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Venenosas y territoriales: la cola sobre el lomo, lista.

### Guardián corrupto — `corrupted_guardian`
**Tipo:** Enemigo · **Nivel:** 26 · **Rango:** boss · **Archivo:** `public/images/characters/corrupted_guardian.svg` · **Estado:** ⬜ por generar
> Un constructo guardián Jedi pervertido por el lado oscuro. Reliquia de una Orden caída.

**Prompt — pose base (idle)**
```
dark-twisted Jedi guardian construct, cracked white-and-gold ceremonial plating bleeding violet corruption from every fissure, a hollow helm with a single dim glow inside, dual lightsabers held in a corrupted echo of a Jedi form, one shoulder plate fallen away, standing wrong, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Reliquia de una Orden caída: la postura debe ser una forma Jedi correcta ejecutada por algo que ya no entiende para qué servía.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`corrupted_guardian_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
dark-twisted Jedi guardian construct, cracked white-and-gold ceremonial plating bleeding violet corruption from every fissure, a hollow helm with a single dim glow inside, dual lightsabers held in a corrupted echo of a Jedi form, one shoulder plate fallen away, standing wrong, both sabers swept into a wide crossing strike, violet corruption spraying from the widening chest fissure, helm glow flaring, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`corrupted_guardian_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
dark-twisted Jedi guardian construct, cracked white-and-gold ceremonial plating bleeding violet corruption from every fissure, a hollow helm with a single dim glow inside, dual lightsabers held in a corrupted echo of a Jedi form, one shoulder plate fallen away, standing wrong, knocked back with one shoulder plate shattering away, corruption gouting from the crack, sabers dipping, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`corrupted_guardian_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
dark-twisted Jedi guardian construct, cracked white-and-gold ceremonial plating bleeding violet corruption from every fissure, a hollow helm with a single dim glow inside, dual lightsabers held in a corrupted echo of a Jedi form, one shoulder plate fallen away, standing wrong, kneeling with both sabers fallen and dark, the chest fissure gone black, helm light extinguished, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

## Telos IV

*Paleta del planeta: gris estación y azul limpio, naranja corporativo Czerka, verde frágil de superficie restaurada*

### Mercenario de Czerka — `czerka_merc`
**Tipo:** Enemigo · **Nivel:** 28 · **Rango:** minion · **Archivo:** `public/images/characters/czerka_merc.svg` · **Estado:** ⬜ por generar
> Ejecutores corporativos de la Corporación Czerka. Asesinos profesionales con respaldo empresarial.

**Prompt — pose base (idle)**
```
corporate enforcer, sleek grey Czerka combat armour with the company logo stencilled on the chest plate, a heavy blaster held at low ready, a sealed visor helmet, clean well-maintained gear, professional cold at-ease stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Asesinos profesionales con respaldo empresarial: el equipo está impecable y estandarizado.

### Bestia salvaje — `wild_beast`
**Tipo:** Enemigo · **Nivel:** 28 · **Rango:** minion · **Archivo:** `public/images/characters/wild_beast.svg` · **Estado:** ⬜ por generar
> Fauna mutada en la superficie de Telos en recuperación. Agresiva y territorial.

**Prompt — pose base (idle)**
```
mutated surface beast, matted irradiated fur in patchy clumps, asymmetric tumorous growths along one flank and shoulder, an extra malformed limb, bared uneven teeth, snarling territorial quadruped stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Fauna mutada de una superficie en recuperación: la asimetría es la historia de Telos.

### Droide de salvamento — `salvage_droid`
**Tipo:** Enemigo · **Nivel:** 29 · **Rango:** minion · **Archivo:** `public/images/characters/salvage_droid.svg` · **Estado:** ⬜ por generar
> Droides de construcción reprogramados. Pesados e implacables.

**Prompt — pose base (idle)**
```
bulky reprogrammed construction droid, orange-and-rust industrial plating with faded hazard stripes, a hydraulic claw on one arm and a cutting torch on the other, a squat sensor head, heavy treaded feet, lumbering forward gait, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Pesados e implacables: herramienta industrial reconvertida, nada de diseño militar.

### Constructo Rakata — `rakata_construct`
**Tipo:** Enemigo · **Nivel:** 35 · **Rango:** boss · **Archivo:** `public/images/characters/rakata_construct.svg` · **Estado:** ⬜ por generar
> Antigua tecnología del Imperio Infinito aún operativa. Escudos de energía y rayos de desintegración.

**Prompt — pose base (idle)**
```
ancient Rakata war construct, smooth obsidian-and-bronze alien geometry unlike any known design, a glowing red disintegration array set into the torso, a shimmering hexagonal energy shield flickering around the frame, no face, floating slightly above the ground, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Jefe. Tecnología del Imperio Infinito: el diseño no debe parecerse a nada más del juego — sin juntas visibles, sin remaches.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`rakata_construct_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
ancient Rakata war construct, smooth obsidian-and-bronze alien geometry unlike any known design, a glowing red disintegration array set into the torso, a shimmering hexagonal energy shield flickering around the frame, no face, floating slightly above the ground, the torso array opening fully and firing a wide red disintegration beam, the energy shield snapping flat against the frame, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`rakata_construct_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
ancient Rakata war construct, smooth obsidian-and-bronze alien geometry unlike any known design, a glowing red disintegration array set into the torso, a shimmering hexagonal energy shield flickering around the frame, no face, floating slightly above the ground, the shield shattering into hexagonal fragments, the frame knocked askew, the array stuttering dark, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`rakata_construct_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
ancient Rakata war construct, smooth obsidian-and-bronze alien geometry unlike any known design, a glowing red disintegration array set into the torso, a shimmering hexagonal energy shield flickering around the frame, no face, floating slightly above the ground, fallen to the ground with the obsidian shell cracked open and the array gone black, shield fragments dissolving, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

## Malachor V

*Paleta del planeta: negro roto y gris ceniza con vetas rojas, cielo sin color; la luz parece caer hacia dentro*

### Bestia de tormenta — `storm_beast`
**Tipo:** Enemigo · **Nivel:** 35 · **Rango:** minion · **Archivo:** `public/images/characters/storm_beast.svg` · **Estado:** ⬜ por generar
> Enormes depredadores nativos de Malachor V. Atraídos por la energía del lado oscuro.

**Prompt — pose base (idle)**
```
massive dark-side predator, jagged black-grey hide like broken rock, visible static crackling along the dorsal spines, glowing pale eyes, an oversized fanged jaw, heavy forelimbs braced against a wind that is not there, drawn toward the wound in the Force, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Atraídos por la energía del lado oscuro: el pelaje y la piedra son indistinguibles.

### Asesino de las sombras — `shadow_assassin`
**Tipo:** Enemigo · **Nivel:** 37 · **Rango:** elite · **Archivo:** `public/images/characters/class_assassin.svg` · **Estado:** ✅ en disco
> Asesinos sith adiestrados en el sigilo y la muerte. Emergen de las sombras sin previo aviso.

**Prompt — pose base (idle)**
```
Trayus shadow assassin, sealed matte-black robes and a featureless mask, a double-bladed red lightsaber ignited and held across the body, the lower robes dissolving into darkness, emerging out of solid shadow, coiled and silent, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Emergen de las sombras sin previo aviso: el cuerpo sale de la oscuridad, no está simplemente de pie en ella.

### Espectro del vacío — `void_wraith`
**Tipo:** Enemigo · **Nivel:** 38 · **Rango:** elite · **Archivo:** `public/images/characters/void_wraith.svg` · **Estado:** ⬜ por generar
> Entidades espectrales nacidas de la destrucción del Generador de Sombra Másica. Se alimentan de la fuerza vital.

**Prompt — pose base (idle)**
```
spectral void entity, tattered black-violet wisps circling a hollow empty core where a torso should be, long skeletal grasping hands reaching forward, no face, a visible life-draining aura bending the air around it, drifting above the ground, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Nacidas de la destrucción del Generador de Sombra Másica: el centro está literalmente vacío — se ve a través.

### Merodeador Sith de élite — `sith_marauder_elite`
**Tipo:** Enemigo · **Nivel:** 40 · **Rango:** elite · **Archivo:** `public/images/characters/class_marauder.svg` · **Estado:** ✅ en disco
> Guerrero adiestrado en Trayus. Sables dobles y furia desatada.

**Prompt — pose base (idle)**
```
Trayus-trained elite marauder, scarred blood-red armour over black underplate with spiked pauldrons, twin red lightsabers crossed before the chest, a ritual-scarred bare face twisted with feral fury, heavy boots, aggressive forward-leaning stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Furia desatada. Comparte lenguaje con la clase `marauder` pero más desgastado y más salvaje. Croma verde.

### Capitán fantasma — `ghost_captain`
**Tipo:** Enemigo · **Nivel:** 42 · **Rango:** boss · **Archivo:** `public/images/characters/ghost_captain.svg` · **Estado:** ⬜ por generar
> El capitán espectral de una nave de guerra de la República. Atrapado entre la vida y la muerte desde el Generador de Sombra Másica.

**Prompt — pose base (idle)**
```
spectral Republic warship captain, a translucent blue-grey dress uniform and peaked cap, a saber-scar across one side of the face, one hand resting on a spectral sidearm, the legs fading below the knee, weary authority, trapped between life and death, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Jefe. Sigue al mando de una nave que ya no existe: la postura es de puente de mando, no de combate.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`ghost_captain_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
spectral Republic warship captain, a translucent blue-grey dress uniform and peaked cap, a saber-scar across one side of the face, one hand resting on a spectral sidearm, the legs fading below the knee, weary authority, trapped between life and death, spectral sidearm raised and fired, the whole form flaring bright cold blue with the recoil, cap brim shadowing blazing eyes, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`ghost_captain_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
spectral Republic warship captain, a translucent blue-grey dress uniform and peaked cap, a saber-scar across one side of the face, one hand resting on a spectral sidearm, the legs fading below the knee, weary authority, trapped between life and death, the form tearing into horizontal bands of interference, cap knocked loose and dissolving before it lands, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`ghost_captain_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
spectral Republic warship captain, a translucent blue-grey dress uniform and peaked cap, a saber-scar across one side of the face, one hand resting on a spectral sidearm, the legs fading below the knee, weary authority, trapped between life and death, fading from the feet upward while still standing at attention, one hand raised in a final salute, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>

### Darth Sion, Señor del Dolor — `darth_sion`
**Tipo:** Enemigo · **Nivel:** 45 · **Rango:** boss · **Archivo:** `public/images/characters/darth_sion.svg` · **Estado:** ⬜ por generar
> El Señor del Dolor. Su cuerpo está destrozado, pero lo mantienen unido la pura rabia y el lado oscuro. No puede morir de verdad.

**Prompt — pose base (idle)**
```
broken undying Sith lord, a body that is a mosaic of cracked decaying flesh and bone held together only by rage, glowing red fissures burning between every fragment, one milk-white blind eye, a single heavy red lightsaber held loose in a fist, shoulders hunched, hateful glare, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Jefe. El Señor del Dolor: cada trozo del cuerpo está separado del siguiente por una grieta encendida.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`darth_sion_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
broken undying Sith lord, a body that is a mosaic of cracked decaying flesh and bone held together only by rage, glowing red fissures burning between every fragment, one milk-white blind eye, a single heavy red lightsaber held loose in a fist, shoulders hunched, hateful glare, a brutal one-handed downward saber smash with the whole body thrown into it, fissures blazing white-hot, fragments visibly grinding apart, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`darth_sion_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
broken undying Sith lord, a body that is a mosaic of cracked decaying flesh and bone held together only by rage, glowing red fissures burning between every fragment, one milk-white blind eye, a single heavy red lightsaber held loose in a fist, shoulders hunched, hateful glare, the body blown partly apart at the shoulder and ribs, fragments hanging suspended in the air, already pulling back together, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`darth_sion_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
broken undying Sith lord, a body that is a mosaic of cracked decaying flesh and bone held together only by rage, glowing red fissures burning between every fragment, one milk-white blind eye, a single heavy red lightsaber held loose in a fist, shoulders hunched, hateful glare, collapsed into a loose heap of separated fragments with the fissure light dimming, the blind eye still open and aimed at the viewer, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Darth Nihilus, Señor del Hambre — `darth_nihilus`
**Tipo:** Enemigo · **Nivel:** 47 · **Rango:** boss · **Archivo:** `public/images/characters/darth_nihilus.svg` · **Estado:** ⬜ por generar
> El Señor del Hambre. Más vacío que hombre. Consume mundos y devora la Fuerza misma.

**Prompt — pose base (idle)**
```
void-wreathed Sith lord, a cracked white-and-red mask floating at head height with nothing visible behind it, flowing black shroud robes that dissolve into hungry swirling darkness where the body should be, long empty sleeves, a devouring presence bending the light inward, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Jefe. Más vacío que hombre: bajo la túnica no hay cuerpo, y debe notarse. La máscara es el único punto de contraste.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`darth_nihilus_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
void-wreathed Sith lord, a cracked white-and-red mask floating at head height with nothing visible behind it, flowing black shroud robes that dissolve into hungry swirling darkness where the body should be, long empty sleeves, a devouring presence bending the light inward, the shroud thrown wide as the mask tips back and a wave of devouring void erupts outward, the surrounding light visibly draining toward it, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`darth_nihilus_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
void-wreathed Sith lord, a cracked white-and-red mask floating at head height with nothing visible behind it, flowing black shroud robes that dissolve into hungry swirling darkness where the body should be, long empty sleeves, a devouring presence bending the light inward, the mask cracking further along an existing fissure, the shroud collapsing inward as if losing pressure, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`darth_nihilus_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
void-wreathed Sith lord, a cracked white-and-red mask floating at head height with nothing visible behind it, flowing black shroud robes that dissolve into hungry swirling darkness where the body should be, long empty sleeves, a devouring presence bending the light inward, the mask falling forward through the empty robes as the shroud drops to the ground and evaporates, mask landing face-up, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Darth Traya, Señora de la Traición — `darth_traya`
**Tipo:** Enemigo · **Nivel:** 50 · **Rango:** boss · **Archivo:** `public/images/characters/darth_traya.svg` · **Estado:** ⬜ por generar
> La Señora de la Traición. La forma final de Kreia. Tres sables de luz la orbitan, guiados solo por la Fuerza. La prueba definitiva.

**Prompt — pose base (idle)**
```
the final form of Kreia, an old woman in layered grey-and-white robes with a deep cowl, milky blind eyes, one hand ending in a severed wrist, three lightsabers in red, violet and orange orbiting her slowly in the air by the Force alone with no hands on them, serene absolute authority, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Jefe final. La Señora de la Traición: los tres sables orbitan solos — jamás los empuña. La serenidad es la amenaza.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`darth_traya_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
the final form of Kreia, an old woman in layered grey-and-white robes with a deep cowl, milky blind eyes, one hand ending in a severed wrist, three lightsabers in red, violet and orange orbiting her slowly in the air by the Force alone with no hands on them, serene absolute authority, the three orbiting sabers snapping outward in three directions at once, robes lifting, blind eyes wide and white, arms spread, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`darth_traya_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
the final form of Kreia, an old woman in layered grey-and-white robes with a deep cowl, milky blind eyes, one hand ending in a severed wrist, three lightsabers in red, violet and orange orbiting her slowly in the air by the Force alone with no hands on them, serene absolute authority, two sabers spinning out of formation and wavering, the cowl falling back, one shoulder dropping, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`darth_traya_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
the final form of Kreia, an old woman in layered grey-and-white robes with a deep cowl, milky blind eyes, one hand ending in a severed wrist, three lightsabers in red, violet and orange orbiting her slowly in the air by the Force alone with no hands on them, serene absolute authority, seated on the ground with the three sabers extinguished and fallen around her in a circle, head bowed, robes settled, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>
