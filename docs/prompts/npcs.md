# NPCs — prompts de personaje

Los 61 NPCs con diálogo del juego, agrupados por planeta. Solo necesitan la pose base: aparecen en conversación, no en combate. Datos: `src/game/data/npcs/*`.

> **Cómo usarlo:** copia el bloque de prompt tal cual en Leonardo.ai. El *negative prompt*
> es común a todo el fichero (abajo) — pégalo una vez en su casilla. El nombre de archivo
> **debe** coincidir con el `id` indicado o el juego no encontrará el arte.

<details><summary><b>Negative prompt (común a todas las entradas)</b></summary>

```
photo, photorealistic, 3d render, octane, blurry, soft focus, anti-aliased edges, jpeg artifacts, smooth gradients, watermark, signature, text, caption, UI, frame, border, drop shadow, cast shadow on ground, busy background, multiple characters, cropped, out of frame, extra limbs, extra fingers, deformed hands, lens flare, bokeh
```
</details>

> ⚠️ El diálogo resuelve el retrato **por nombre de hablante** (`getSpeakerImage` en
> `src/game/utils/character-images.ts`), no por id — al registrar un NPC nuevo añade también
> su heurística de nombre allí.

---

## Korriban

*Paleta del planeta: arenisca roja, obsidiana, oro deslustrado, brasa carmesí; dos soles duros y polvo en suspensión*

### Rhen — `npc_acolyte_rhen`
**Tipo:** NPC · **Zona:** `korriban_academy_interior` · **Archivo:** `public/images/characters/npc_acolyte_rhen.svg` · **Estado:** ⬜ por generar
*“Acólito Cobarde”*
> Un acólito menudo y de voz suave que se paraliza en los duelos de práctica y que claramente no encaja aquí. Vino a la Academia a buscar poder; encontró sobre todo pavor.

**Prompt — pose base (idle)**
```
slight timid young acolyte, oversized grey acolyte robes with sleeves past the hands, hunched narrow shoulders, clutching an unlit training saber across the chest like a shield, mousy hair, anxious sidelong glance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** La ropa le queda grande a propósito: parece un niño disfrazado de Sith.

### Archivista Kheln — `npc_archivist_kheln`
**Tipo:** NPC · **Zona:** `korriban_academy_interior` · **Archivo:** `public/images/characters/npc_archivist_kheln.svg` · **Estado:** ✅ en disco
*“Guardián de los Textos Prohibidos”*
> Un antiguo Sith de sangre pura que habla en acertijos. Su conocimiento de las viejas costumbres no tiene rival.

**Prompt — pose base (idle)**
```
elderly red-skinned Sith pureblood archivist, tendril cheeks and a long white goatee, deep black hood pulled forward, dark-red floor-length robe embroidered with gold Sith glyphs running down the front placket, cradling a small golden orrery-orb in both hands, spectacles of dark glass, patient and amused, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Habla en acertijos: la sonrisa mínima es lo que lo vende. El orbe dorado es su punto de luz cálida.

### Dregg — `npc_arena_master_dregg`
**Tipo:** NPC · **Zona:** `korriban_arena` · **Archivo:** `public/images/characters/npc_arena_master_dregg.svg` · **Estado:** ⬜ por generar
*“Maestro de la Arena”*
> Un zabrak de anchas espaldas que gestiona los combates de la arena de entrenamiento. Tiene ojo para el talento y un negocio paralelo en las apuestas de combate.

**Prompt — pose base (idle)**
```
broad-shouldered Zabrak arena master, crown of short facial horns and black facial tattoos, sleeveless studded leather harness over heavily scarred muscle, forearm wraps, a string of betting chits and a coiled whip at the belt, arms crossed over a barrel chest, bored appraising look, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Ve cuerpos como apuestas. Cicatrices viejas y bien curadas, no heridas.

### Varn Dassik — `npc_czerka_varn`
**Tipo:** NPC · **Zona:** `korriban_dreshdae` · **Archivo:** `public/images/characters/npc_czerka_varn.svg` · **Estado:** ✅ en disco
*“Representante de Czerka”*
> Un hombre de empresa con un traje impecable, sudando bajo el calor de Korriban y fingiendo que no. En él, todo está en venta.

**Prompt — pose base (idle)**
```
middle-aged human corporate man sweating through an immaculate navy Czerka suit with a company pin, red tie slightly loosened, slicked-back thinning hair, clutching a datapad against the chest with both hands, forced nervous smile, damp collar, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** El calor de Korriban es parte del personaje: brillos de sudor en la frente y el cuello.

### Darth Voren — `npc_darth_voren`
**Tipo:** NPC · **Zona:** `korriban_academy_interior` · **Archivo:** `public/images/characters/npc_darth_voren.svg` · **Estado:** ✅ en disco
*“Tu Maestro”*
> Un imponente Lord Sith con ojos como brasas ardientes. Te considera como uno consideraría una herramienta — útil hasta que se rompe.

**Prompt — pose base (idle)**
```
tall imposing Sith Lord, gaunt corpse-pale grey skull-like face with sunken cheeks and glowing ember-red eyes, heavy floor-length black robe lined in dark crimson with a high collar, armored steel pauldrons and a segmented gorget, black gauntlets, one hand resting on a lightsaber hilt at the belt, utterly still and commanding, looking down at the viewer, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Tu primer maestro. Debe leerse como alguien que ya ha decidido que eres prescindible: quietud absoluta, cero tensión muscular.

### Daryth — `npc_daryth`
**Tipo:** NPC · **Zona:** `korriban_academy_interior` · **Archivo:** `public/images/characters/npc_daryth.svg` · **Estado:** ✅ en disco
*“Acólito Rival”*
> Un acólito humano con una sonrisa cruel y un resentimiento a cuestas. Te ve como un obstáculo que eliminar.

**Prompt — pose base (idle)**
```
young male Sith acolyte in his early twenties, plain dark grey-black acolyte robes with a plain belt, short brown hair, pale blue eyes, arms folded, a faint confident smirk that does not reach the eyes, wiry build, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Rival de academia. Todo en él es ordinario menos la sonrisa — ahí está el resentimiento.

### Senna Vael — `npc_dreshdae_senna`
**Tipo:** NPC · **Zona:** `korriban_dreshdae` · **Archivo:** `public/images/characters/npc_dreshdae_senna.svg` · **Estado:** ⬜ por generar
*“Acólita Fracasada”*
> Falló las pruebas de la Academia y fue arrojada a Dreshdae sin nada. Ahora un préstamo de Czerka que pidió para sobrevivir ha vencido — con un interés que solo la sangre puede pagar.

**Prompt — pose base (idle)**
```
washed-out former acolyte woman in her twenties, threadbare civilian tunic thrown over the grey Academy underlayers she never replaced, hollow-eyed with dark circles, hair unwashed, arms crossed defensively over the chest, weight shifted back, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Sigue llevando la ropa interior de la Academia: no ha aceptado que la echaron.

### Kira — `npc_kira_slave`
**Tipo:** NPC · **Zona:** `korriban_mines` · **Archivo:** `public/images/characters/npc_kira_slave.svg` · **Estado:** ✅ en disco
*“Esclava Trabajadora”*
> Una joven esclava twi'lek que trabaja las minas. Ojos desafiantes pese a sus cadenas.

**Prompt — pose base (idle)**
```
young blue-skinned Twi'lek slave girl, two lekku wrapped in a dark cloth headband, ragged maroon wrap-dress patched at the hem, broken shackle rings still closed on both wrists, bare dusty feet, thin from the mines, chin up with defiant eyes, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Las cadenas rotas son el detalle narrativo. Desafío, no súplica.

### Grot — `npc_merchant_grot`
**Tipo:** NPC · **Zona:** `korriban_academy_interior` · **Archivo:** `public/images/characters/npc_merchant_grot.svg` · **Estado:** ✅ en disco
*“Traficante del Mercado Negro”*
> Un rodiano que, de algún modo, mantiene un puesto de comercio en los niveles inferiores de la Academia. No preguntes de dónde sale su mercancía.

**Prompt — pose base (idle)**
```
Rodian black-market trader, green pebbled skin, large faceted black eyes and a short snout, antennae, worn leather utility vest over a grubby undershirt, satchel and bandolier of tools and trinkets, both hands open mid-pitch, shrewd posture, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** El código lo define como rodiano — respeta la anatomía rodiana (ojos grandes, hocico, antenas).

### Supervisora Raxis — `npc_overseer_raxis`
**Tipo:** NPC · **Zona:** `korriban_academy_interior` · **Archivo:** `public/images/characters/npc_overseer_raxis.svg` · **Estado:** ✅ en disco
*“Supervisora de Entrenamiento”*
> Una veterana llena de cicatrices que adiestra a los acólitos con brutal eficacia. No tiene paciencia para la debilidad.

**Prompt — pose base (idle)**
```
stern human woman in her forties, cropped auburn hair, a red ritual scar cut across the brow, dark purple-black overseer armor with a long tabard to the knee, gold hoop earrings, gloved hands clasped behind the back, lean and upright, evaluating stare, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Adiestra a base de brutalidad eficiente: la postura es de inspección, no de amenaza.

### Sera Vant — `npc_sera_vant`
**Tipo:** NPC · **Zona:** `korriban_dreshdae` · **Archivo:** `public/images/characters/npc_sera_vant.svg` · **Estado:** ⬜ por generar
*“Hermana de un Acólito Caído”*
> Una joven de ojos secos de tanto llorar que limpia mesas en Dreshdae para pagarse el pasaje fuera de Korriban. Su hermano Joren entró en la Academia hace un año. Le devolvieron una urna y una mentira.

**Prompt — pose base (idle)**
```
young human woman in her early twenties, plain Dreshdae serving clothes with a stained apron and a rag tucked at the waist, dark hair pulled back severely, eyes dry and red-rimmed from crying too long, holding a small sealed funerary urn against her stomach with both hands, exhausted composure, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Ya no llora — ese es el punto. La urna es el prop que cuenta toda la quest.

### Koro — `npc_servitor_koro`
**Tipo:** NPC · **Zona:** `korriban_academy_interior` · **Archivo:** `public/images/characters/npc_servitor_koro.svg` · **Estado:** ⬜ por generar
*“Sirviente de la Academia”*
> Un sirviente twi'lek que ha fregado sangre de las ranuras de la Academia desde antes de que la actual Supervisora respirara. Sobrevive leyendo a los poderosos e inclinándose primero.

**Prompt — pose base (idle)**
```
elderly Twi'lek manservant, pale grey-lavender skin, thin lekku hanging limp with age, plain dark Academy servant's tunic worn colourless at the elbows, a scrubbing cloth and bucket in one hand, deeply bowed at the waist with eyes carefully lowered, decades of caution in the posture, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Sobrevive inclinándose primero. La reverencia es refleja, no respetuosa.

### Seyla — `npc_seyla`
**Tipo:** NPC · **Zona:** `korriban_dreshdae` · **Archivo:** `public/images/characters/npc_seyla.svg` · **Estado:** ✅ en disco
*“Cantinera”*
> Una curtida mujer humana que ha sobrevivido a tres administraciones de Czerka y a más acólitos de los que puede contar. Lo oye todo.

**Prompt — pose base (idle)**
```
weathered human cantina keeper woman in her sixties, grey hair tied back in a faded bandana, lean wiry build, worn brown leather vest over an olive shirt with rolled sleeves, heavy utility belt with pouches, steel forearm guards, scuffed boots, one hand on the hip, knowing half-smile, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Ha sobrevivido a tres administraciones de Czerka: la seguridad viene del peso en las caderas, no de la ropa.

### Thane — `npc_thane`
**Tipo:** NPC · **Zona:** `korriban_dreshdae` · **Archivo:** `public/images/characters/npc_thane.svg` · **Estado:** ✅ en disco
*“Figura Encapuchada”*
> Un joven apretado contra un rincón en sombras, la capucha calada, las manos temblando. El hedor del miedo lo envuelve como humo.

**Prompt — pose base (idle)**
```
frightened young man in his late teens, low brown hood and travel cloak pulled close, dark-red acolyte under-robe visible at the throat, trembling hands half-hidden in the sleeves, a deserter's brand burned on the back of one hand, downcast eyes, shoulders drawn in, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Ocupa el menor espacio posible. La marca de desertor debe verse.

## Dromund Kaas

*Paleta del planeta: negro imperial, gris durasteel mojado, verde jungla profundo, violeta de relámpago; todo bajo lluvia*

### Acólito Thirix — `npc_acolyte_thirix`
**Tipo:** NPC · **Zona:** `dromund_kaas_jungle` · **Archivo:** `public/images/characters/npc_acolyte_thirix.svg` · **Estado:** ⬜ por generar
*“Acólito Perdido”*
> Un joven zabrak enviado a estudiar al Templo Oscuro. Se arrepiente por completo y está desesperado por salir con vida.

**Prompt — pose base (idle)**
```
young frightened Zabrak acolyte, small crown of facial horns and faint clan tattoos, grey initiate robes too new to be worn in, glancing back over one shoulder, both hands gripping the opposite forearms, on the edge of bolting, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Se arrepiente por completo de haber venido: el cuerpo ya está girado hacia la salida.

### Veyra — `npc_agent_veyra`
**Tipo:** NPC · **Zona:** `dromund_kaas_market` · **Archivo:** `public/images/characters/npc_agent_veyra.svg` · **Estado:** ⬜ por generar
*“Una Desconocida que Observa”*
> Lleva en esa mesa desde que entraste en el Bazar, y su café se ha quedado frío sin tocar. Sus ojos no dejan de moverse — salvo cuando se posan en ti.

**Prompt — pose base (idle)**
```
watchful undercover agent woman in her thirties, plain civilian coat cut a little too straight over a concealed hip holster, hair unremarkable, a cold untouched cup of caf on the table before her, restless eyes tracking off to the side, stillness that costs effort, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** El café frío indica cuánto lleva sentada. Ropa deliberadamente olvidable.

### Tavros el Invisible — `npc_blind_seer_tavros`
**Tipo:** NPC · **Zona:** `dromund_kaas_temple` · **Archivo:** `public/images/characters/npc_archivist_kheln.svg` · **Estado:** ✅ en disco
*“Vidente Ciego”*
> Una figura con túnica y los ojos vendados que se sienta junto al muro exterior del Templo Oscuro. Habla en fragmentos del futuro. La mayoría lo tacha de loco — esa gente suele lamentarlo.

**Prompt — pose base (idle)**
```
blind seer, grey rag robes layered over a bony frame, eyes wrapped in stained yellowed bandages, long gnarled wooden staff held in both hands, weathered upturned face, rain-soaked hem, unnatural prophetic stillness, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Sentado junto al muro exterior del Templo: empapado, inmóvil, orientado hacia ti sin ojos.

### Capitana Rhea Vayne — `npc_captain_rhea`
**Tipo:** NPC · **Zona:** `dromund_kaas_citadel` · **Archivo:** `public/images/characters/npc_captain_rhea.svg` · **Estado:** ⬜ por generar
*“Comandante Imperial”*
> La comandante de la guarnición del distrito sur de Dromund Kaas. Hace cumplir la ley imperial sin piedad, pero bajo la armadura hay alguien que resiente profundamente a los Sith que le dan órdenes.

**Prompt — pose base (idle)**
```
Imperial garrison commander woman in her thirties, sleek black Imperial officer armor with a peaked cap and rank insignia, blaster sidearm holstered at the thigh, short practical hair, jaw tight, weary resentful eyes, standing at a parade rest she no longer believes in, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Hace cumplir una ley en la que ya no cree: el cansancio está en los ojos, no en la postura.

### Darth Seris — `npc_darth_seris`
**Tipo:** NPC · **Zona:** `dromund_kaas_citadel` · **Archivo:** `public/images/characters/npc_darth_voren.svg` · **Estado:** ✅ en disco
*“Representante del Consejo Oscuro”*
> Una mujer alta cuya presencia roba el calor de una sala. Habla de ti en tercera persona aunque estés presente. Un contacto del Consejo Oscuro — si eso te ayuda o te condena no está claro.

**Prompt — pose base (idle)**
```
tall cold Sith Lord woman of the Dark Council, floor-length black silk robes with silver filigree at the cuffs and collar, severe sculpted beauty, black hair drawn back flawlessly, hands hidden in opposing sleeves, looking through the viewer rather than at them, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Habla de ti en tercera persona estando tú delante: la mirada no se enfoca en la cámara.

### Brakk — `npc_hunter_brakk`
**Tipo:** NPC · **Zona:** `dromund_kaas_jungle` · **Archivo:** `public/images/characters/npc_hunter_brakk.svg` · **Estado:** ⬜ por generar
*“Cazador Manco”*
> Un cazador trandoshano con un muñón cibernético y un libro de cuentas de rencores. La entrada más grande tiene cuatro brazos y vive en una hondonada al norte.

**Prompt — pose base (idle)**
```
Trandoshan hunter, green-brown reptilian scales and a heavy jaw of small teeth, yellow slit eyes, one arm ending in a crude cybernetic stump below the elbow, trophy-strung leather harness of claws and teeth over a bare scaled chest, battered slug-thrower rifle braced on the good arm, resentful set to the head, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** El muñón cibernético es de un gundark alfa — barato y mal ajustado, no de alta tecnología.

### Vex — `npc_informant_vex`
**Tipo:** NPC · **Zona:** `dromund_kaas_citadel` · **Archivo:** `public/images/characters/npc_informant_vex.svg` · **Estado:** ⬜ por generar
*“Corredor de Inteligencia”*
> Un tratante de información twi'lek que conoce los secretos de todos. Posiblemente empleado por tres facciones distintas a la vez.

**Prompt — pose base (idle)**
```
scarred Twi'lek information broker, deep violet skin, lekku wrapped in dark protective cloth, dark hooded jacket over a mesh underlayer, a thin scar splitting one eyebrow, datapad palmed low at the hip, sly distrustful grin, weight on the back foot, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Siempre listo para irse: el peso atrás y la salida controlada.

### Jorra — `npc_jorra_cantina`
**Tipo:** NPC · **Zona:** `dromund_kaas_market` · **Archivo:** `public/images/characters/npc_jorra_cantina.svg` · **Estado:** ⬜ por generar
*“Tabernera de la Espira Rota”*
> Una curtida mirialana que sirve a soldados, espías y Sith por igual. Lo oye todo y casi nada repite.

**Prompt — pose base (idle)**
```
weathered Mirialan cantina keeper woman in her fifties, olive-green skin with geometric black chin and cheek tattoos, apron over a practical tunic with sleeves rolled, pouring from a bottle into a glass without looking at it, head tilted in the posture of someone listening to the next table, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Lo oye todo: sirve mirando a otro lado. Ese gesto es el personaje.

### Lord Malvek — `npc_lord_malvek`
**Tipo:** NPC · **Zona:** `dromund_kaas_citadel` · **Archivo:** `public/images/characters/npc_darth_voren.svg` · **Estado:** ✅ en disco
*“Magistrado Sith”*
> Un esbelto Lord Sith de cabello plateado, uñas cuidadas y sonrisa de serpiente. Ostenta poder político en Ciudad Kaas y usará a cualquiera como peldaño.

**Prompt — pose base (idle)**
```
lean Sith magistrate in his fifties, silver hair slicked straight back, manicured hands with rings, fine black-and-violet court robes with a tailored waist and gold piping, thin serpentine smile, fingers steepled at chest height, elegant contained posture, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Cortesano antes que guerrero: la ropa está hecha a medida y sin una arruga.

### Drayven — `npc_merchant_drayven`
**Tipo:** NPC · **Zona:** `dromund_kaas_spaceport` · **Archivo:** `public/images/characters/npc_merchant_grot.svg` · **Estado:** ✅ en disco
*“Armero Imperial”*
> Un mercader de armas afín a los Sith con acceso a equipo de grado imperial. Precios justos si tienes credenciales imperiales — desorbitados si no.

**Prompt — pose base (idle)**
```
Sith artificer armorer, heavy scorched leather apron over dark work clothes, bare forearms marked with old burn scars, a harness of kyber-cutting tools across the chest, a brass cybernetic loupe over one eye, forge-smudged hands holding a half-finished hilt, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Precio alto, calidad real. Manchas de forja auténticas, no decorativas.

### Moff Kallus — `npc_moff_kallus`
**Tipo:** NPC · **Zona:** `dromund_kaas_spaceport` · **Archivo:** `public/images/characters/npc_moff_kallus.svg` · **Estado:** ⬜ por generar
*“Moff Imperial”*
> Un burócrata obeso de palmas sudorosas y un talento para la supervivencia política. Venderá a cualquiera con tal de conservar su cómodo despacho.

**Prompt — pose base (idle)**
```
obese polished Imperial Moff, immaculate grey-green uniform straining slightly at the buttons with a rank plaque and code cylinders, thinning hair combed flat, cold grey eyes in a soft face, gloved hands clasped over the belly, sweating faintly, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Burócrata obeso con talento para sobrevivir: la pulcritud del uniforme contra la blandura del hombre.

### Sargento Brel Korso — `npc_sergeant_korso`
**Tipo:** NPC · **Zona:** `dromund_kaas_jungle` · **Archivo:** `public/images/characters/npc_sergeant_korso.svg` · **Estado:** ⬜ por generar
*“Desertor del 4º de Fusileros de Kaas”*
> Único superviviente de una escuadra imperial enviada a la selva del Templo Oscuro como cebo para un ritual sith. Caza al círculo del culto que llevó a sus hombres al matadero, con un rifle viejo y nada que perder.

**Prompt — pose base (idle)**
```
Imperial deserter sergeant, mid-thirties, torn Kaas Rifles fatigues with the unit patch deliberately cut away, jungle mud caked to the knees, a week of beard, an old scoped rifle held across the body with both hands, hollow furious eyes, rain-plastered hair, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Único superviviente de su escuadra. El parche arrancado es el detalle clave: ya no es imperial.

## Nar Shaddaa

*Paleta del planeta: neón magenta y cian sobre óxido y mugre, charcos que reflejan anuncios, humo ámbar*

### Ossian — `npc_alchemist`
**Tipo:** NPC · **Zona:** `nar_shaddaa_market` · **Archivo:** `public/images/characters/npc_archivist_kheln.svg` · **Estado:** ✅ en disco
*“Alquimista Sith Renegado”*
> Un Sith caído que ahora vende soluciones alquímicas a cualquiera que pueda pagarlas. Su laboratorio huele a cosas que probablemente sean ilegales.

**Prompt — pose base (idle)**
```
rogue Sith alchemist, gaunt hooded robed figure, acid-stained gloves and cuffs, a bandolier rack of glowing vials in toxic green and violet across the chest, sunken eyes lit from below by the vials, unsettling calm half-smile, thin and still, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Los viales son la única fuente de luz: iluminan la cara desde abajo.

### Saka — `npc_arms_dealer`
**Tipo:** NPC · **Zona:** `nar_shaddaa_market` · **Archivo:** `public/images/characters/npc_merchant_grot.svg` · **Estado:** ✅ en disco
*“Traficante de Armas del Mercado Negro”*
> Un weequay con un brazo derecho mecánico y una filosofía sobre la 'neutralidad moral de las armas'.

**Prompt — pose base (idle)**
```
Weequay arms dealer, deeply wrinkled leathery tan skin, beaded chin braids, a mechanical right arm of exposed chrome servos, open vest over a bare chest, an open crate of blaster pistols at his feet, sly sideways grin, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Filosofía de 'neutralidad moral': vende a todos, sonríe a todos.

### Mira — `npc_bartender_mira`
**Tipo:** NPC · **Zona:** `nar_shaddaa_cantina` · **Archivo:** `public/images/characters/npc_bartender_mira.svg` · **Estado:** ⬜ por generar
*“Camarera de Cantina”*
> Una humana de lengua afilada que lleva veinte años tras esta barra. Sabe lo que la gente quiere de verdad antes de que lo pidan.

**Prompt — pose base (idle)**
```
sharp-tongued human bartender woman in her forties, sleeves rolled to the elbow over strong forearms, apron tied at the waist, dishrag slung over one shoulder, dark hair knotted up, one eyebrow raised in a knowing smirk, neon rim-light from below and behind, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Veinte años tras la misma barra. La luz de neón de Nar Shaddaa debe teñirle el borde del pelo.

### Corredor Neth — `npc_broker_neth`
**Tipo:** NPC · **Zona:** `nar_shaddaa_exchange` · **Archivo:** `public/images/characters/npc_broker_neth.svg` · **Estado:** ⬜ por generar
*“Señor del Crimen del Intercambio”*
> El jefe supremo de la operación del Intercambio en Nar Shaddaa. Cuatro guardaespaldas, un despacho blindado a medida, y una memoria muy larga para quienes lo han agraviado.

**Prompt — pose base (idle)**
```
Exchange crime lord, heavyset human in a fine dark coat with metal signet rings on thick fingers, a lit cigarra between two knuckles, slicked hair and a trimmed beard, seated heavily in a custom armored office chair, unblinking long-memory glare, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Es el único NPC sentado: la silla blindada es parte de la silueta.

### Cyra Venn — `npc_cyra_venn`
**Tipo:** NPC · **Zona:** `nar_shaddaa_promenade` · **Archivo:** `public/images/characters/npc_cyra_venn.svg` · **Estado:** ⬜ por generar
*“Cazarrecompensas”*
> Una letal cazadora mirialana de calmado talante profesional. Tiene contratos permanentes con tres facciones distintas. Posiblemente cuatro.

**Prompt — pose base (idle)**
```
lethal Mirialan bounty hunter woman, olive-green skin with fine black geometric tattoos across the nose and cheekbones, sleek charcoal armor with a segmented cuirass and thigh plates, twin blaster pistols holstered low on both hips, hair in a tight braid, calm professional stare, relaxed ready stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Profesional, no sádica. La calma es la amenaza.

### Kull — `npc_dockmaster_kull`
**Tipo:** NPC · **Zona:** `nar_shaddaa_promenade` · **Archivo:** `public/images/characters/npc_dockmaster_kull.svg` · **Estado:** ⬜ por generar
*“Jefe de Muelle Filósofo”*
> Un jefe de muelle gamorreano que cita meditaciones entre manifiestos de carga. Mira dice que sus consejos han salvado más vidas que cualquier médico de la luna.

**Prompt — pose base (idle)**
```
massive Gamorrean dockmaster, green porcine bulk with tusks and small deep-set eyes, grease-stained heavy work harness over a swollen belly, a datapad manifest held delicately in one enormous hand, head slightly tilted in unexpectedly thoughtful contemplation, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Cita meditaciones entre manifiestos: el contraste entre la mole y la delicadeza con la que sostiene el datapad.

### Zek — `npc_informant_zek`
**Tipo:** NPC · **Zona:** `nar_shaddaa_cantina` · **Archivo:** `public/images/characters/npc_informant_zek.svg` · **Estado:** ⬜ por generar
*“Informante Clandestino”*
> Un duros nervioso que comercia con susurros. Sabe demasiado sobre demasiada gente y se siente profundamente incómodo con su propia existencia.

**Prompt — pose base (idle)**
```
nervous Duros informant, smooth blue-green skin, large lidless red eyes and a lipless mouth, no nose, rumpled spacer coat over a stained undershirt, hunched narrow shoulders, one hand twitching at the collar, glancing sideways, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Sabe demasiado sobre demasiada gente: el tic nervioso es constante.

### Oziri Sath — `npc_oziri_sath`
**Tipo:** NPC · **Zona:** `nar_shaddaa_cantina` · **Archivo:** `public/images/characters/npc_oziri_sath.svg` · **Estado:** ⬜ por generar
*“Corredor de Reputaciones”*
> Un agente de información al servicio de los Hutt que comercia con lo único que no se devalúa en Nar Shaddaa: lo que la galaxia sabe de ti. Ha oído de tus hazañas — todas — y cada una tiene un precio.

**Prompt — pose base (idle)**
```
smooth Hutt-employed information agent, slender human-like figure in an expensive iridescent coat over dark silks, rings on every finger, oiled dark hair, a small holoprojector disc balanced on the palm, an appraising smile that is already quoting you a price, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Comercia con tu reputación: te mira como quien tasa una pieza, no como quien saluda.

### Vethra Oan — `npc_refugee_elder`
**Tipo:** NPC · **Zona:** `nar_shaddaa_lower` · **Archivo:** `public/images/characters/npc_refugee_elder.svg` · **Estado:** ⬜ por generar
*“Portavoz de los Refugiados”*
> Una anciana twi'lek que sacó a tres familias del avance del Triunvirato y las trajo a la única roca donde nadie las perseguiría: el fondo de Nar Shaddaa. Ahora descubre que aquí los depredadores solo cambian de cara.

**Prompt — pose base (idle)**
```
elderly Twi'lek woman, pale green weathered skin, thin lekku wrapped in a worn shawl, layered refugee clothing mended many times in mismatched cloth, a heavy travel pack still on her back as if never unpacked, gnarled hands gripping a walking stave, tired unbroken dignity, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Sacó a tres familias de la guerra. Nunca ha deshecho el petate: no cree que esto sea el final del viaje.

### Vross — `npc_slaver_vross`
**Tipo:** NPC · **Zona:** `nar_shaddaa_lower` · **Archivo:** `public/images/characters/npc_slaver_vross.svg` · **Estado:** ⬜ por generar
*“Corredor del Intercambio”*
> Un weequay de sonrisa torcida y un datapad lleno de vidas ajenas. Compra y vende deudas — y a la gente que no puede pagarlas. Tiene a la niña Roan en una jaula de transporte.

**Prompt — pose base (idle)**
```
Weequay Exchange debt-broker, leathery creased skin, a crooked smile of yellow teeth, dark quilted coat with a heavy credit-chit purse at the belt, a datapad full of other people's names held casually at waist height, relaxed and utterly comfortable, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** La comodidad es lo repulsivo: vende personas con la misma calma con que se revisa una lista de carga.

### Tessa Roan — `npc_tessa_roan`
**Tipo:** NPC · **Zona:** `nar_shaddaa_lower` · **Archivo:** `public/images/characters/npc_tessa_roan.svg` · **Estado:** ⬜ por generar
*“Madre Endeudada”*
> Una estibadora de los muelles bajos de Nar Shaddaa cuya hija de nueve años fue tomada por el Intercambio como aval de una deuda imposible. Al amanecer la subirán a un carguero de esclavos rumbo al Borde Exterior.

**Prompt — pose base (idle)**
```
human dockworker woman in her thirties, heavy loader's harness and padded work gloves over a grease-marked jumpsuit, strong shoulders, hair escaping a work tie, a child's small knitted toy clutched in one fist, face wrecked by a night without sleep, pleading and rigid at once, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** El juguete de la niña en el puño cerrado es todo el gancho emocional de la quest.

## Onderon

*Paleta del planeta: verde selva y oro real, piedra clara, púrpura de la corte; luz cálida y alta*

### Castellano Maron Dree — `npc_castellan_dree`
**Tipo:** NPC · **Zona:** `onderon_palace` · **Archivo:** `public/images/characters/npc_castellan_dree.svg` · **Estado:** ⬜ por generar
*“Guardián de la Casa Real”*
> El senescal de cabello gris del palacio. Ha sobrevivido a cuatro monarcas fijándose en todo y diciendo casi nada.

**Prompt — pose base (idle)**
```
grey-haired palace seneschal in his sixties, formal dark court livery with silver piping and a ring of ceremonial keys of office at the belt, spotless white gloves, hands folded at the waist, composed observant expression, impeccable upright bearing, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Ha sobrevivido a cuatro monarcas fijándose en todo: la mirada está ligeramente fuera de eje, observando la sala.

### Dama Yvane Marr — `npc_dama_yvane`
**Tipo:** NPC · **Zona:** `onderon_city` · **Archivo:** `public/images/characters/npc_dama_yvane.svg` · **Estado:** ⬜ por generar
*“Matriarca de una Casa Humillada”*
> La anciana cabeza de la Casa Marr, antaño poderosa en la corte de Iziz, hoy hazmerreír tras ser deshonrada en pleno Salón del Trono por un rival. Tiene oro de sobra y orgullo de menos, y busca un Sith sin escrúpulos heredados.

**Prompt — pose base (idle)**
```
elderly Onderonian noblewoman, once-fine court gown of faded purple velvet now a season out of fashion and carefully repaired at the cuffs, heavy old house jewellery, white hair in a severe formal arrangement, a cane she grips harder than she needs to, jaw set against humiliation, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Le sobra oro y le falta orgullo: la ropa cara pero pasada de moda cuenta la caída de la Casa Marr.

### General Vaklu Therrik — `npc_general_vaklu`
**Tipo:** NPC · **Zona:** `onderon_city` · **Archivo:** `public/images/characters/npc_general_vaklu.svg` · **Estado:** ⬜ por generar
*“Comandante Militar de Onderon”*
> Un veterano curtido que ha defendido las murallas de Onderon durante treinta años. Desconfía de los usuarios de la Fuerza por principio y respeta la fuerza por instinto.

**Prompt — pose base (idle)**
```
grizzled veteran Onderonian general in his sixties, dress military uniform in deep green with campaign medals and a shoulder cord, grey crew cut, a long scar across the jaw, hands clasped behind the back, broad chest, planted stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Duplicado de `npc_general_voss` en los datos. Una sola imagen, dos ids en el registro.

### General Voss Therrik — `npc_general_voss`
**Tipo:** NPC · **Zona:** `onderon_city` · **Archivo:** `public/images/characters/npc_general_voss.svg` · **Estado:** ⬜ por generar
*“Estratega Militar”*
> Un general veterano y curtido que ha defendido Onderon durante treinta años. Respeta la fuerza y desconfía de los usuarios de la Fuerza — pero trabajará con cualquiera que ayude a su pueblo.

**Prompt — pose base (idle)**
```
grizzled veteran Onderonian general in his sixties, dress military uniform in deep green with a row of campaign medals and a shoulder cord, grey crew cut, a long scar across the jaw, hands clasped behind the back, broad chest, weight evenly planted, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Comparte personaje con `npc_general_vaklu` (dos ids en los datos) — mismo arte para ambos.

### Ronar Sol — `npc_hidden_jedi_ronar`
**Tipo:** NPC · **Zona:** `onderon_undercity` · **Archivo:** `public/images/characters/npc_hidden_jedi_ronar.svg` · **Estado:** ⬜ por generar
*“Jedi Oculto”*
> Un Jedi que sobrevivió a las purgas infiltrándose a fondo en la resistencia clandestina de Onderon. No empuña un sable de luz desde hace años. Conocerte lo obliga a tomar una decisión.

**Prompt — pose base (idle)**
```
Jedi in hiding, middle-aged man in plain Onderonian labourer's clothes with rolled sleeves and work-worn boots, weathered calm face and short greying hair, a lightsaber hilt half-hidden under the belt at the back, watchful steady eyes, deliberately unremarkable posture, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Todo en él dice obrero salvo la quietud de los ojos y el bulto bajo el cinturón.

### Lord Sarn Vael — `npc_lord_sarn`
**Tipo:** NPC · **Zona:** `onderon_city` · **Archivo:** `public/images/characters/npc_lord_sarn.svg` · **Estado:** ⬜ por generar
*“El Rival Arrogante”*
> El noble que humilló a la Casa Marr ante toda la corte y compró un campeón mandaloriano con el botín. Desprecia a los Sith — hasta que uno con rango suficiente, o corrupción suficiente, le recuerda lo que es el verdadero poder.

**Prompt — pose base (idle)**
```
arrogant young Onderonian noble, fashionable court coat in black and gold with an oversized house crest, rings and a jewelled duelling rapier worn as decoration, chin raised, one hand on the hip pushing the coat open, a smile of pure inherited certainty, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Desprecia a los Sith hasta que uno le enseña lo que es el poder: la arrogancia debe ser frágil, no imponente.

### Heralda Ysane — `npc_onderon_herald`
**Tipo:** NPC · **Zona:** `onderon_city` · **Archivo:** `public/images/characters/npc_onderon_herald.svg` · **Estado:** ⬜ por generar
*“Voz de la Corona de Iziz”*
> La heralda de la Reina Talia, enviada a tomarte la medida después de que el General Vaklu te tantease. En Onderon, ningún forastero con poder pasa mucho tiempo sin que ambos bandos sepan exactamente dónde pisa.

**Prompt — pose base (idle)**
```
Onderonian royal herald woman, formal tabard in the Crown's green and gold over a fitted court coat, a silver speaking-horn badge of office at the throat, hair pinned high, a sealed scroll-case held in the crook of one arm, measuring you with polite unblinking attention, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** La han enviado a tomarte la medida: cortesía perfecta, ojos de inventario.

### Berga — `npc_onderon_merchant`
**Tipo:** NPC · **Zona:** `onderon_city` · **Archivo:** `public/images/characters/npc_onderon_merchant.svg` · **Estado:** ⬜ por generar
*“Tratante del Mercado de Bestias”*
> Una bulliciosa onderoniana que comercia con cuero de drexl, reliquias de la jungla y cualquier otra cosa que las murallas dejen fuera. Su puesto huele a piel engrasada y especia.

**Prompt — pose base (idle)**
```
boisterous Onderonian beast-market trader woman, heavy drexl-leather apron over bright market clothes, forearms scarred from handling livestock, jungle relics and carved fangs strung on a display rack beside her, hands thrown wide mid-sales-pitch, hearty open grin, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Energía alta: es la única NPC de Onderon con la boca abierta.

### Reina Talia Marath — `npc_queen_talia`
**Tipo:** NPC · **Zona:** `onderon_palace` · **Archivo:** `public/images/characters/npc_queen_talia.svg` · **Estado:** ⬜ por generar
*“Reina de Onderon”*
> La monarca reinante de Onderon. Ferozmente independiente y políticamente brillante — y convencida de que alguien de su corte responde ante los Sith.

**Prompt — pose base (idle)**
```
regal Onderonian queen in her forties, ornate green-and-gold royal gown with a heavy embroidered mantle over the shoulders, a slim circlet crown over dark braided hair, hands folded before her, chin level, proud political poise and a politician's unreadable face, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Duplicado de `npc_queen_talira` en los datos. Genera una sola imagen y regístrala con los dos ids.

### Reina Talira Marath — `npc_queen_talira`
**Tipo:** NPC · **Zona:** `onderon_city` · **Archivo:** `public/images/characters/npc_queen_talira.svg` · **Estado:** ⬜ por generar
*“Reina de Onderon”*
> La monarca reinante de Onderon. Ferozmente independiente y políticamente brillante. Sospecha que los Sith manipulan su corte y necesita a alguien que opere fuera de los canales oficiales.

**Prompt — pose base (idle)**
```
regal Onderonian queen in her forties, ornate green-and-gold royal gown with a heavy embroidered mantle over the shoulders, a slim circlet crown over dark braided hair, sceptre-less hands folded before her, chin level, proud political poise and a politician's unreadable face, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Comparte personaje con `npc_queen_talia` (dos ids en los datos) — el mismo arte sirve para ambos.

## Dxun

*Paleta del planeta: verde-negro de dosel, beskar hierro y carmesí de clan, naranja de hoguera en la niebla*

### Dral Karr — `npc_dral_karr`
**Tipo:** NPC · **Zona:** `dxun_mando_camp` · **Archivo:** `public/images/characters/npc_dral_karr.svg` · **Estado:** ⬜ por generar
*“El Mandaloriano Exiliado”*
> Un mandaloriano que huyó cuando una gran bestia boma destrozó a sus hermanos de caza, y fue desterrado por su clan por cobardía. Vive solo en los márgenes del campamento de Dxun, buscando una forma de morir con honor — o de recuperarlo.

**Prompt — pose base (idle)**
```
exiled Mandalorian warrior, beskar armor stripped of all clan colour and sigils down to bare scoured metal, no helmet, shaved head and a heavy untended beard, deep parallel claw scars across the chest plate and throat, a single blaster carbine held slack at the side, shoulders low, eyes fixed on the ground, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Desterrado por cobardía: la armadura sin colores de clan y la mirada baja son la vergüenza hecha silueta.

### Mandalore — `npc_mandalore`
**Tipo:** NPC · **Zona:** `dxun_mando_camp` · **Archivo:** `public/images/characters/npc_mandalore.svg` · **Estado:** ⬜ por generar
*“Líder de los Clanes Mandalorianos”*
> El señor de la guerra enmascarado que reconstruye los clanes desde la jungla de Dxun. Cada palabra que pronuncia la sopesa como munición.

**Prompt — pose base (idle)**
```
masked Mandalorian warlord, battle-worn beskar plate in deep clan blue and iron with field repairs, a horned T-visor helm, a heavy cape of predator pelts across one shoulder, blaster and vibroblade at the belt, arms loose and ready, immovable commanding stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Nunca se quita el casco. La autoridad viene del peso y la quietud, no de la pose heroica.

### Vrenn Ordo — `npc_mando_armorer`
**Tipo:** NPC · **Zona:** `dxun_mando_camp` · **Archivo:** `public/images/characters/npc_mando_armorer.svg` · **Estado:** ⬜ por generar
*“Armera del Clan”*
> Una herrera mandaloriana cuya forja nunca se enfría. Juzga a los visitantes por el desgaste de sus armas, no por las palabras de su boca.

**Prompt — pose base (idle)**
```
Mandalorian clan armorer woman, heavy scorched forge apron over partial beskar armor, visor flipped up revealing soot-streaked cheeks and hard eyes, a smith's hammer in one hand and glowing tongs in the other, forge-light rim on the plate, braced working stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** La luz naranja de la forja es su fuente secundaria — que caliente el borde inferior de la armadura.

### Sargento Kessa — `npc_scout_kessa`
**Tipo:** NPC · **Zona:** `dxun_jungle` · **Archivo:** `public/images/characters/npc_scout_kessa.svg` · **Estado:** ⬜ por generar
*“Última Exploradora de la Tercera Patrulla”*
> Una exploradora onderoniana con el brazo entablillado y una mirada perdida en el infinito. Su campamento está destrozado; su escuadrón no va a volver.

**Prompt — pose base (idle)**
```
Onderonian scout woman in her late twenties, mud-caked jungle camo fatigues, one arm splinted and slung across the chest, carbine slung muzzle-down over the good shoulder, hair matted under a field cap, a thousand-metre stare fixed past the viewer, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Última superviviente de su patrulla: la mirada no se enfoca en nada de esta escena.

## Dantooine

*Paleta del planeta: oro de pradera, piedra blanca caída, azul kyber; luz de tarde larga y melancólica*

### El Corazón de Cristal — `npc_crystal_heart`
**Tipo:** NPC · **Zona:** `dantooine_crystal_cave` · **Archivo:** `public/images/characters/npc_crystal_heart.svg` · **Estado:** ⬜ por generar
*“Presencia en la Fuerza”*
> No es una persona, sino una voluntad: el inmenso kyber que late en la cámara más honda de la cueva, lo bastante puro como para curvar la Fuerza — y lo bastante despierto como para devolverte la mirada.

**Prompt — pose base (idle)**
```
colossal living kyber crystal formation, not a person, a two-metre cluster of pale blue-white crystal rising from the cave floor and pulsing with slow internal light, smaller shards orbiting it in slow suspension, faint refracted glow washing the surrounding rock, a presence rather than a face, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** No es un personaje: es una voluntad. Ignora la pose de combate del sufijo — centra el cristal en el lienzo y deja aire alrededor. Sin rostro, sin miembros.

### Maestra Senka Vell — `npc_jedi_master`
**Tipo:** NPC · **Zona:** `dantooine_enclave` · **Archivo:** `public/images/characters/npc_jedi_master.svg` · **Estado:** ⬜ por generar
*“Jedi en la Clandestinidad”*
> Una serena miraluka que cuida las ruinas del viejo enclave. Sobrevivió a la purga convirtiéndose en parte del paisaje — paciente, callada, vigilante.

**Prompt — pose base (idle)**
```
serene Miraluka Jedi woman in her sixties, eyeless with a simple woven cloth band across the brow, plain earth-toned robes in undyed linen, weathered calm face, silver-grey hair cropped short, hands resting one over the other, so still she seems part of the landscape, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Sobrevivió a la purga escondiéndose a plena vista. Nada de sables, nada de poses.

## Telos IV

*Paleta del planeta: gris estación y azul limpio, naranja corporativo Czerka, verde frágil de superficie restaurada*

### Director Adjunto Halex — `npc_czerka_rep`
**Tipo:** NPC · **Zona:** `telos_citadel` · **Archivo:** `public/images/characters/npc_czerka_rep.svg` · **Estado:** ⬜ por generar
*“Czerka — Adquisiciones de Telos”*
> Sonrisa de catálogo, ojos de auditoría. Gestiona los intereses 'no oficiales' de Czerka bajo el Proyecto de Restauración, y sabe exactamente cuánto cuesta cada conciencia que ha comprado.

**Prompt — pose base (idle)**
```
polished Czerka deputy director, immaculate corporate suit in Czerka orange-and-grey with a company pin, perfect catalogue smile, cold auditing eyes behind thin glasses, a datapad held like a ledger, hands soft and unmarked, relaxed predatory ease, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Sonrisa de catálogo, ojos de auditoría: la sonrisa y la mirada deben contradecirse abiertamente.

### Renn — `npc_dockhand_renn`
**Tipo:** NPC · **Zona:** `telos_citadel` · **Archivo:** `public/images/characters/npc_dockhand_renn.svg` · **Estado:** ⬜ por generar
*“Estibador, Módulo 4”*
> Un estibador enjuto cuyos ojos no dejan de saltar a las cámaras de seguridad. Suda incluso bajo el control climático de la estación.

**Prompt — pose base (idle)**
```
wiry nervous cargo handler in his twenties, grease-stained station jumpsuit with the sleeves tied at the waist, heavy work gloves, thin build, eyes flicking up and off to the side toward the security cameras, sweating at the temples, weight shifting, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** No mira nunca a cámara: la mirada va arriba y fuera de cuadro, hacia las cámaras de seguridad.

### Doctora Lira Venn — `npc_dr_lira`
**Tipo:** NPC · **Zona:** `telos_surface` · **Archivo:** `public/images/characters/npc_dr_lira.svg` · **Estado:** ⬜ por generar
*“Ecóloga del Proyecto de Restauración”*
> Una científica del Proyecto de Restauración de Telos que documentó cómo Czerka envenena en secreto un valle recuperado para declararlo inviable y arrasarlo en busca de mineral. Los ejecutores de la corporación la cazan por lo que sabe.

**Prompt — pose base (idle)**
```
Restoration Project ecologist woman in her thirties, field coat over practical layers with sample vials clipped to the chest strap, hair tied back hastily, a scuffed datapad clutched to the chest, mud on the knees and forearms, hunted glance over one shoulder, frightened but resolved, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** La cazan por lo que sabe: la postura es de alguien que lleva días sin dormir en el mismo sitio.

### Garrek Sool — `npc_survivor_leader`
**Tipo:** NPC · **Zona:** `telos_surface` · **Archivo:** `public/images/characters/npc_survivor_leader.svg` · **Estado:** ⬜ por generar
*“Capataz de los Supervivientes”*
> Antiguo técnico del Proyecto de Restauración que se quedó cuando los créditos se acabaron y las cuadrillas se fueron. Mantiene vivo a un puñado de colonos a base de chatarra, terquedad y un rifle con más remiendos que cañón.

**Prompt — pose base (idle)**
```
hard-worn human foreman in his fifties, layered scavenged coldweather gear over a faded Restoration Project jumpsuit with the logo half worn off, grey stubble and wind-cracked skin, a patched rifle with more repair tape than barrel held across the body, stubborn planted stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Chatarra, terquedad y un rifle remendado: el mono del Proyecto descolorido es lo que queda de la esperanza institucional.

### Comandante Issa Locke — `npc_telos_commander`
**Tipo:** NPC · **Zona:** `telos_citadel` · **Archivo:** `public/images/characters/npc_telos_commander.svg` · **Estado:** ⬜ por generar
*“Jefa de Seguridad de la Estación Ciudadela”*
> La oficial que mantiene unida la Estación Ciudadela con muy poca gente y muy poco sueño. Paga bien por problemas que desaparecen sin ruido.

**Prompt — pose base (idle)**
```
station security chief woman in her forties, blue-grey TSF officer uniform with a utility vest and rank tabs, sidearm holstered, short dark hair, a datapad tucked under one arm, dark circles under sharp alert eyes, exhausted but entirely in command, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Sostiene la estación con poca gente y pocos créditos: cansancio competente, nunca derrota.

## Ziost

*Paleta del planeta: blanco hielo, obsidiana bajo escarcha, cian de aurora, azul muerto; luz plana y sin sombras*

### Archivista Sarn — `npc_ziost_archivist`
**Tipo:** NPC · **Zona:** `ziost_spaceport` · **Archivo:** `public/images/characters/npc_ziost_archivist.svg` · **Estado:** ⬜ por generar
*“Guardián del Archivo de Cristal”*
> Un erudito pálido y de voz suave enviado por el Archivo Sith para catalogar a los muertos de Ziost. No ha dormido en días. Sea lo que sea lo que hay en los páramos, lo oye en los dientes.

**Prompt — pose base (idle)**
```
pale soft-spoken scholar in his thirties, dark Sith Archive robes dusted with frost at the shoulders and hem, sleepless shadowed eyes, thin frostbitten fingers holding a datapad and stylus, a scarf pulled down to speak, haunted by what he has been cataloguing, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Lleva demasiado tiempo escuchando la Tumba Cantora: la mirada está a punto de quebrarse.

### Guardiana Veth — `npc_ziost_keeper`
**Tipo:** NPC · **Zona:** `ziost_spaceport` · **Archivo:** `public/images/characters/npc_ziost_keeper.svg` · **Estado:** ⬜ por generar
*“Guardiana del Relicario”*
> Una anciana quemada por la escarcha y envuelta en capas de hilo de cortosis. Lleva cuarenta años rebuscando en las ruinas de Nueva Adasta y vende lo que el hielo entrega — a un precio que el hielo aprobaría.

**Prompt — pose base (idle)**
```
frost-burned old woman, face and hands marked by pale frostbite scarring, wrapped in many layers of pale cortosis-thread cloth, an ice-rimed hood and a breath-frosted scarf, a heavy scavenger's pack of salvaged relics on her back, shrewd narrow squint against the wind, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Paleta fría en todo menos la piel quemada por el hielo. El aliento debe verse.

### Supervisora Maliss — `npc_ziost_overseer`
**Tipo:** NPC · **Zona:** `ziost_citadel` · **Archivo:** `public/images/characters/npc_ziost_overseer.svg` · **Estado:** ⬜ por generar
*“Custodia de Nueva Adasta”*
> La Sith dejada para custodiar las ruinas de Ziost. Siglos de frío la han vuelto paciente y extraña. Habla de la ciudad congelada como si pudiera oírla — porque, insiste, puede.

**Prompt — pose base (idle)**
```
centuries-old Sith warden woman, frost-cracked black armor rimed with ice at every seam, a long white braid stiff with frost, pale bloodless skin, a strange faraway gaze fixed on something far behind the viewer, standing motionless as if she has not moved in years, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Siglos de frío la han vuelto ausente. La escarcha debe parecer parte de la armadura, no nieve reciente.
