# Mundos y niveles — prompts de escenario

Los 10 mundos del juego y sus 54 escenarios únicos. Cada planeta abre con su **ficha de mundo** (lo que define su identidad visual y sonora) y sigue con un prompt de fondo por `sceneId`.

> **Hoy los escenarios son procedurales**: cada zona se dibuja con un generador `DynamicScene` a partir de su `sceneId`, sin imagen de fondo. Estos prompts son para cuando quieras **sustituir o reforzar** una escena con un fondo pintado → `public/images/backgrounds/{sceneId}.png`.

<details><summary><b>Negative prompt (común)</b></summary>

```
photo, photorealistic, 3d render, octane, blurry, soft focus, anti-aliased edges, jpeg artifacts, smooth gradients, watermark, signature, text, caption, UI, frame, border, drop shadow, cast shadow on ground, busy background, multiple characters, cropped, out of frame, extra limbs, extra fingers, deformed hands, lens flare, bokeh
```
</details>

---

## Korriban

**Niveles:** 1–10 · **Zonas:** 14 · **Música:** `korriban_ambient`

**Ficha de mundo**

- **Fantasía:** Estás en el mundo natal de los Sith y todo aquí ya ha decidido que eres reemplazable. Academia, tumbas y un valle lleno de los muertos que lo hicieron mejor que tú.
- **Paleta:** arenisca roja, obsidiana, oro deslustrado, brasa carmesí; dos soles duros y polvo en suspensión
- **Luz y clima:** Dos soles rojos, altos y sin piedad. Sombras cortas y duras de día; braseros carmesíes y luz de holocrón en interiores. Polvo en suspensión en cada haz de luz.
- **Arquitectura y materiales:** Arenisca monumental y obsidiana pulida. Todo está tallado con glifos, todo es demasiado grande para una escala humana, todo lleva milenios aquí.
- **Motivo recurrente:** La escala aplastante: cualquier puerta, estatua o sarcófago debe ser cinco veces más alto que una persona.

### `korriban_exterior` — Exterior de la Academia
**Zonas que lo usan:** Exterior de la Academia · Asentamiento de Dreshdae
> La gran entrada a la Academia Sith. Dos soles arden sobre la antigua piedra arenisca.

```
grand sandstone Sith Academy entrance under twin blazing red suns, colossal carved pillars flanking a stair of a hundred steps, statues of hooded Sith lords eroded by millennia, a dry desert ridge beyond, dust hanging in the shafts of hard red light, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `korriban_interior` — Academia Sith
**Zonas que lo usan:** Academia Sith
> Oscuros corredores flanqueados por holocrones y los susurros de antiguos Sith. Maestros y acólitos se vigilan con recelo.

```
dark Sith Academy corridor of polished obsidian columns, alcoves lined with glowing red holocrons, iron braziers burning crimson along the walls, glyph-carved lintels, deep shadow between every pool of firelight, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `korriban_valley` — Valle de los Lores Oscuros
**Zonas que lo usan:** Valle de los Lores Oscuros
> Antiguas tumbas de Lores Sith se extienden hacia el horizonte carmesí. El aire crepita con energía oscura residual.

```
the Valley of the Dark Lords, two rows of monumental tomb facades receding toward a crimson horizon, colossal seated statues flanking the processional road, drifting dust and a haze of visible dark-side energy above the valley floor, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `korriban_tomb` — Tumba de Ajunta Pall
**Zonas que lo usan:** Tumba de Ajunta Pall · Tumba de Tulak Hord
> El lugar de descanso del primer Lord Oscuro. Trampas, droides y guardianes espectrales aguardan al incauto.

```
interior of an ancient Sith tomb, walls carved floor to ceiling with glyph reliefs, broken stone sarcophagi spilling dust, faint red ghost-light with no visible source, pressure plates and a collapsed ceiling section, air thick and still, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `korriban_arena` — Arena de Entrenamiento
**Zonas que lo usan:** Arena de Entrenamiento
> Donde los acólitos demuestran su valía con sangre. La arena está manchada de rojo para siempre.

```
a blood-stained sand combat arena ringed by tiered stone benches, tattered Academy banners hanging from the upper rail, iron weapon racks at the edge, harsh overhead sun and a hard-edged shadow across half the sand, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `korriban_mines` — Minas de Esclavos
**Zonas que lo usan:** Minas de Esclavos
> Túneles oscuros donde los esclavos se afanan sin fin. Las babosas k'lor han hecho aquí sus nidos.

```
dark slave-mine tunnels braced with crude timber supports, a rough-hewn shaft descending into blackness, dripping water pooling in the rails, insectoid nests clustered in the ceiling corners, dim guttering lamplight, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_ragnos_entry` — Tumba de Ragnos — Entrada
**Zonas que lo usan:** Tumba de Ragnos — Entrada
> Las enormes puertas de piedra se abren con un chirrido. Un aire frío sale a borbotones, cargado de susurros de poder antiguo.

```
the sealed threshold of the Tomb of Marka Ragnos, an enormous door of black stone carved with a single gold Sith glyph, flanking braziers long cold, a stair of broken flagstones descending into the dark, gold-and-green light bleeding faintly through the door seam, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_ragnos_halls` — Tumba de Ragnos — Salas de los Muertos
**Zonas que lo usan:** Tumba de Ragnos — Salas de los Muertos
> Corredores interminables flanqueados de sarcófagos. Algunos están abiertos. Algunos no deberían estarlo.

```
the Halls of the Dead inside Ragnos' tomb, rank upon rank of standing sarcophagi in wall niches receding into darkness, spectral green-gold light pooling on the floor between them, dust suspended and unmoving in the still air, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_ragnos_puzzle` — Tumba de Ragnos — Prueba del Conocimiento
**Zonas que lo usan:** Tumba de Ragnos — Prueba del Conocimiento
> Una cámara de glifos sith y muros cambiantes. La tumba pone a prueba tu mente antes que tu hoja.

```
an ancient Sith trial chamber, a circular floor inlaid with rotating stone glyph rings, four pedestals holding unlit crystal sconces at the cardinal points, cold green light from a slot high in the ceiling, everything waiting to be solved, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_ragnos_guardian` — Tumba de Ragnos — Cámara del Guardián
**Zonas que lo usan:** Tumba de Ragnos — Cámara del Guardián
> Un enorme constructo de guerra se activa. El minijefe custodia la senda al sanctasanctórum.

```
a vast echoing guardian chamber of bare black stone, a colossal empty throne of carved obsidian at the far end, chains and shattered weapons scattered across the floor, a single shaft of red light falling on the centre of the floor, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_ragnos_sanctum` — Tumba de Ragnos — Sanctasanctórum
**Zonas que lo usan:** Tumba de Ragnos — Sanctasanctórum
> El lugar de descanso del propio Marka Ragnos. Su espíritu se cierne sobre un trono de obsidiana.

```
the innermost sanctum of Ragnos' tomb, a raised sarcophagus of gold-veined black stone on a stepped dais, gold-and-green spectral energy rising from the seams in slow ribbons, glyph-walls blazing with reflected light, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_ragnos_vault` — Tumba de Ragnos — Cámara del Tesoro
**Zonas que lo usan:** Tumba de Ragnos — Cámara del Tesoro
> La cámara del tesoro. Artefactos sith antiguos, armas y holocrones aguardan.

```
a Sith treasure vault, toppled chests of ancient coin and ritual blades, racked holocrons glowing faint red on stone shelves, gold spilling across the floor, an oppressive sense of being counted by something unseen, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Dromund Kaas

**Niveles:** 8–12 · **Zonas:** 7 · **Música:** `korriban_ambient`

**Ficha de mundo**

- **Fantasía:** La capital del Imperio bajo una tormenta que no acaba nunca. Aquí el poder Sith no es antiguo ni místico: es burocrático, armado y siempre mojado.
- **Paleta:** negro imperial, gris durasteel mojado, verde jungla profundo, violeta de relámpago; todo bajo lluvia
- **Luz y clima:** Perpetuamente gris y azulado, sin sol. Relámpagos violetas que recortan siluetas cada pocos segundos. Interiores fríos de iluminación imperial blanca y dura.
- **Arquitectura y materiales:** Durasteel negro y monolitos imperiales de líneas rectas y verticales, en contraste con un templo Sith antiquísimo que la jungla se está tragando.
- **Motivo recurrente:** La lluvia. Corre por cada superficie, brilla en cada plano, y todo lo que no está mojado está bajo tierra.

### `dromund_kaas_spaceport` — Puerto Espacial de Kaas City
**Zonas que lo usan:** Puerto Espacial de Kaas City
> La lluvia cae sobre las plataformas de duracero. Los guardias imperiales vigilan cada llegada. El olor a ozono e incienso llega desde la ciudad.

```
rain-soaked durasteel landing platforms over a black city, Imperial shuttles parked under floodlights, ozone glow around the repulsor pads, steam rising where the rain hits hot plating, a stormy sky torn by distant violet lightning, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dromund_kaas_citadel` — Ciudadela Imperial
**Zonas que lo usan:** Ciudadela Imperial
> Agujas negras perforan el cielo asolado por la tormenta. Los Lores Sith recorren los pasillos; los sirvientes se inclinan sin levantar la vista.

```
the interior of the black Imperial citadel, an austere hall of sheer vertical durasteel and tall narrow windows, the spires of Kaas City visible beyond through the rain, lightning throwing hard moving shadows across the polished floor, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dromund_kaas_market` — Bazar de Kaas City
**Zonas que lo usan:** Bazar de Kaas City
> Un mercado cubierto a la sombra de la Ciudadela. Puestos iluminados con farolillos, colas de racionamiento y una cantina donde los oficiales fuera de servicio hablan de más.

```
a covered Kaas City bazaar in the citadel's shadow, lantern-lit stalls under dripping awnings, ration queues along one wall, wet flagstones reflecting the lantern light, soldiers watching from an upper walkway, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dromund_kaas_jungle` — Jungla Tormentosa
**Zonas que lo usan:** Jungla Tormentosa
> Árboles ahogados por las lianas y depredadores al acecho. El cielo se quiebra con relámpagos violetas. El Templo Oscuro se alza en la distancia.

```
a vine-choked storm jungle, enormous dripping fronds and buttress roots, violet lightning flashing through the canopy, the black silhouette of the Dark Temple looming on a ridge in the far distance, standing water everywhere, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dromund_kaas_temple` — El Templo Oscuro
**Zonas que lo usan:** El Templo Oscuro
> Un antiguo zigurat sith medio engullido por la jungla. Susurros superpuestos llenan el aire. Las piedras recuerdan.

```
an ancient Sith ziggurat half-swallowed by jungle, its stepped black stone faces cracked and root-bound, a yawning entrance at the base, rain sheeting off the upper tiers, an oppressive whispering atmosphere, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dromund_kaas_sanctum` — Sanctasanctórum del Templo
**Zonas que lo usan:** Sanctasanctórum del Templo
> Bajo el zigurat, el aire es frío y seco, ajeno a la tormenta de arriba. Tres sellos de atadura arden en la oscuridad — más antiguos que el propio Imperio.

```
a cold dry temple sanctum far below the storm, three burning binding wards set in a triangle on a black stone floor, carved restraint-glyphs covering the walls, absolute silence implied, the only light from the wards themselves, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dromund_kaas_undercroft` — La Cripta
**Zonas que lo usan:** La Cripta
> Los cimientos anegados de Kaas City. Las luces de mantenimiento parpadean sobre el agua negra. En algún lugar de la oscuridad, algo se alimenta.

```
the drowned foundations of an older city, flooded halls of black water reflecting a low ceiling, flickering maintenance lights on failing conduits, debris and broken columns breaking the surface, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Ziost

**Niveles:** 12–16 · **Zonas:** 4 · **Música:** `korriban_ambient`

**Ficha de mundo**

- **Fantasía:** La primera capital Sith, congelada y abandonada hace milenios. No hay enemigos suficientes aquí: el peligro es el frío y lo que sigue despierto bajo el hielo.
- **Paleta:** blanco hielo, obsidiana bajo escarcha, cian de aurora, azul muerto; luz plana y sin sombras
- **Luz y clima:** Luz plana de día nublado sobre nieve, sin sombras definidas. Auroras cian de noche. Todo tiene un brillo helado y ninguna fuente de calor.
- **Arquitectura y materiales:** Obsidiana Sith idéntica a la de Korriban pero vencida por el peso del hielo: torres inclinadas, arcos partidos, todo bajo una capa de escarcha.
- **Motivo recurrente:** La quietud absoluta. Nada se mueve salvo la nieve arrastrada por el viento.

### `ziost_spaceport` — Plataforma de New Adasta
**Zonas que lo usan:** Plataforma de New Adasta
> Una plataforma de aterrizaje azotada por el viento se aferra al costado de una aguja helada. La nieve silba sobre el duracero negro; la aurora sangra cian sobre la muerta capital sith de abajo.

```
a wind-scoured landing platform clinging to a frozen spire, ice-crusted mooring clamps and a half-buried shuttle, a cyan aurora burning over a dead ice-bound Sith capital below, blowing snow crossing the frame, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `ziost_citadel` — New Adasta
**Zonas que lo usan:** New Adasta
> La primera capital sith, sepultada en hielo durante milenios. Torres de obsidiana se inclinan bajo su propio peso congelado; algo en la piedra profunda aún recuerda haber sido adorado.

```
New Adasta, ice-drowned obsidian Sith towers leaning at wrong angles under the weight of frozen centuries, streets filled to the first-floor windows with packed snow, an eerie total stillness, pale blue light, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `ziost_wastes` — Los Yermos Helados
**Zonas que lo usan:** Los Yermos Helados
> Una llanura blanca de tumbas enterradas y piedras erguidas. El viento arrastra voces que no son el viento. A lo lejos, un sonido como diez mil gargantas sosteniendo una sola nota.

```
a white frozen plain of half-buried tombs and standing stones, a line of monoliths receding into a whiteout, a distant haunting cyan glow on the horizon, snow blowing in long low streamers, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `ziost_tomb` — La Tumba Cantora
**Zonas que lo usan:** La Tumba Cantora
> Bajo el Coro, una escalera de cristal negro desciende hacia un aliento contenido. La nota es más fuerte aquí — y en el fondo, algo tan antiguo como para haber enseñado a los primeros Sith espera a que lo canten para liberarlo.

```
a descending stair of polished black glass cut into the ice, leading down into the Singing Tomb, a faint resonant glow rising from below, frost patterns radiating outward across the walls as if from a sound, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Nar Shaddaa

**Niveles:** 11–18 · **Zonas:** 5 · **Música:** `nar_shaddaa_ambient`

**Ficha de mundo**

- **Fantasía:** La Luna de los Contrabandistas: mil niveles de ciudad vertical donde todo se compra, incluida la gente. El único planeta donde nadie teme a los Sith por ser Sith.
- **Paleta:** neón magenta y cian sobre óxido y mugre, charcos que reflejan anuncios, humo ámbar
- **Luz y clima:** Neón magenta y cian como única fuente, reflejado en charcos y metal mojado. Nunca hay cielo, solo anuncios. Contraluces constantes.
- **Arquitectura y materiales:** Acumulación: tubería, andamio y cartelería apiladas sobre estructuras que nadie recuerda haber construido. Nada se demuele, todo se recubre.
- **Motivo recurrente:** La vertical. Siempre hay ciudad por encima y abismo por debajo, y el encuadre debe enseñar ambas.

### `nar_shaddaa_promenade` — El Paseo
**Zonas que lo usan:** El Paseo
> Las luces de neón se reflejan en las calles mojadas por la lluvia. La Luna de los Contrabandistas nunca duerme.

```
a neon-drenched rain-slick promenade, towering holographic signage in a dozen alphabets, an endless vertical cityscape falling away below the rail and rising out of frame above, smog glowing in the sign-light, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `nar_shaddaa_cantina` — Antro de Pazaak
**Zonas que lo usan:** Antro de Pazaak
> Una cantina llena de humo donde las fortunas cambian de manos entre cartas y tratos susurrados.

```
a smoky pazaak den, a curved neon-edged bar, low gambling tables ringed by mismatched stools, hazy lounge light in magenta and amber, booths receding into darkness at the back, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `nar_shaddaa_market` — Mercado de las Sombras
**Zonas que lo usan:** Mercado de las Sombras
> Mercancía ilegal, artefactos raros y gente peligrosa. Aquí los créditos hablan más alto que los sables de luz.

```
a crowded shadow-market alley, illegal goods hung from overhead racks and stacked in open crates, tarps strung between buildings, harsh work-lights and deep shadows, barely room to pass, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `nar_shaddaa_lower` — Ciudad Baja
**Zonas que lo usan:** Ciudad Baja
> Bajo el neón yace la podredumbre. Territorio de bandas. Los desesperados depredan a los aún más desesperados.

```
a decaying lower-city slum, burst pipes venting steam, gang graffiti layered on every surface, makeshift shelters against a structural wall, grim half-light filtering down from the neon levels far above, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `nar_shaddaa_exchange` — Cuartel General del Intercambio
**Zonas que lo usan:** Cuartel General del Intercambio
> La fortaleza del criminal Intercambio. Seguridad férrea. El señor del crimen aguarda.

```
a fortified Exchange headquarters interior, an opulent crime-lord office of dark polished stone and gold, armoured blast doors standing open, security scanners framing the entrance, a wall of surveillance screens, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Onderon

**Niveles:** 15–22 · **Zonas:** 3 · **Música:** `onderon_ambient`

**Ficha de mundo**

- **Fantasía:** Una ciudad amurallada que lleva siglos resistiendo a la jungla que la rodea, gobernada por una corte que se apuñala con protocolo. Aquí eres un extranjero peligroso que todos quieren usar.
- **Paleta:** verde selva y oro real, piedra clara, púrpura de la corte; luz cálida y alta
- **Luz y clima:** Sol alto y cálido, luz dorada real. Interiores de palacio iluminados por ventanales altos. La subciudad, en cambio, es verde y sin sol.
- **Arquitectura y materiales:** Piedra clara y oro, arcos altos y balcones abiertos a la jungla. Grandeza real genuina, no fortaleza.
- **Motivo recurrente:** El muro. Siempre se intuye la muralla o la jungla al otro lado: la ciudad es una isla.

### `onderon_city` — Ciudad Real de Iziz
**Zonas que lo usan:** Ciudad Real de Iziz
> La capital amurallada de Onderon. La intriga política se filtra por los corredores dorados.

```
the walled royal city of Iziz, gilded corridors and high open balconies overlooking tiled rooftops, beast-riders circling on winged mounts in the sky beyond the wall, warm golden daylight, banners of the Crown, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `onderon_palace` — Palacio Real
**Zonas que lo usan:** Palacio Real
> El asiento del poder en Onderon. La Reina Talia lucha contra la conspiración.

```
an opulent Onderon royal palace throne hall, a long approach between paired columns, tall stained windows throwing coloured light across a polished floor, the throne raised on a stepped dais, house banners along both walls, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `onderon_undercity` — Subciudad de Onderon
**Zonas que lo usan:** Subciudad de Onderon
> Bajo las murallas de la ciudad, bestias de la luna de Dxun merodean por túneles derruidos.

```
broken tunnels beneath the city walls, roots forcing through cracked masonry, standing water and dripping dark, a collapsed section opening onto jungle gloom, the tracks of prowling beasts in the mud, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Dxun

**Niveles:** 18–28 · **Zonas:** 3 · **Música:** `dxun_ambient`

**Ficha de mundo**

- **Fantasía:** La luna selvática de Onderon, donde los mandalorianos se reconstruyen y todo lo que vive intenta comerte. Aquí no hay política: hay honor y depredadores.
- **Paleta:** verde-negro de dosel, beskar hierro y carmesí de clan, naranja de hoguera en la niebla
- **Luz y clima:** Luz verde filtrada por un dosel espeso, casi crepuscular a mediodía. Hogueras naranjas en el campamento. Niebla permanente entre los troncos.
- **Arquitectura y materiales:** Nada permanente salvo una tumba Sith que la selva no ha conseguido borrar. El resto son tiendas, empalizadas y cosas que se pueden levantar en un día.
- **Motivo recurrente:** La niebla entre capas de vegetación: la profundidad se cuenta con tres o cuatro planos de verde cada vez más claro.

### `dxun_jungle` — Jungla de Dxun
**Zonas que lo usan:** Jungla de Dxun
> La luna demoníaca de Onderon. Densa cubierta de jungla, antiguos campamentos mandalorianos y cosas peores en las sombras.

```
a dense demon-moon jungle canopy, colossal buttressed trunks receding into thick mist in four distinct depth layers, ancient overgrown ruins half-visible between them, shafts of green light, predatory shadows implied, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dxun_mando_camp` — Campamento Mandaloriano
**Zonas que lo usan:** Campamento Mandaloriano
> Los restos del ejército de Mandalore se reagrupan aquí. El respeto se gana en combate.

```
a Mandalorian war-camp clearing, hide tents and weapon racks arranged around a central firepit, clan banner standards driven into the mud, a forge under an open lean-to, cookfires glowing orange against the mist, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dxun_sith_tomb` — Tumba Sith (Dxun)
**Zonas que lo usan:** Tumba Sith (Dxun)
> Un antiguo Lord Sith fue sepultado aquí hace siglos. El lado oscuro es abrumador.

```
an overgrown ancient Sith tomb entrance swallowed by jungle, black stone lintels prised apart by roots, glowing green glyphs still legible in the gloom, a palpable pressure of dark-side energy at the threshold, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Dantooine

**Niveles:** 20–30 · **Zonas:** 4 · **Música:** `dantooine_ambient`

**Ficha de mundo**

- **Fantasía:** Pradera abierta y las ruinas de un enclave Jedi que nadie ha reclamado. Es lo más bonito que ve el jugador en todo el juego, y por eso duele.
- **Paleta:** oro de pradera, piedra blanca caída, azul kyber; luz de tarde larga y melancólica
- **Luz y clima:** Luz de tarde larga y dorada, sombras alargadas. En la cueva de cristal, luz azul kyber fría que viene de las propias paredes.
- **Arquitectura y materiales:** Piedra blanca caída y columnas vencidas sobre hierba alta. La naturaleza no ha destruido las ruinas: ha acabado de asimilarlas.
- **Motivo recurrente:** El cielo. Es el único mundo con horizonte abierto y mucho aire por encima.

### `dantooine_enclave` — Ruinas del Enclave Jedi
**Zonas que lo usan:** Ruinas del Enclave Jedi
> Los restos destrozados de la academia Jedi. La naturaleza reclama lo que la guerra destruyó.

```
shattered Jedi enclave ruins reclaimed by grassland, fallen white columns lying in long grass, a broken dome open to the sky, golden late-afternoon light raking across the stone, nothing threatening in sight, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dantooine_plains` — Llanuras de Cristal
**Zonas que lo usan:** Llanuras de Cristal
> Vastas praderas salpicadas de formaciones de cristal. Los sabuesos kath vagan en libertad.

```
vast windswept crystal plains, scattered pale crystal formations breaking through golden grass, distant herds moving on the horizon, an enormous sky with high thin cloud, long shadows, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dantooine_crystal_cave` — Cueva de Cristal
**Zonas que lo usan:** Cueva de Cristal
> Sagrada para los Jedi. Aquí crecen los cristales de sable de luz — pero también la oscuridad.

```
a sacred crystal cave, lightsaber crystals growing in clusters from the walls and ceiling, cool blue-white radiance coming from the stone itself with no other light source, a still black pool reflecting the glow, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dantooine_sublevel` — Subnivel del Enclave
**Zonas que lo usan:** Subnivel del Enclave
> Los niveles inferiores secretos del Enclave Jedi. Archivos, cámaras de meditación y bóvedas selladas.

```
a secret enclave sublevel, dusty archive shelving and sealed meditation vault doors, a collapsed stair at one end, dim red emergency lighting, undisturbed dust across the floor, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Telos IV

**Niveles:** 28–38 · **Zonas:** 3 · **Música:** `telos_ambient`

**Ficha de mundo**

- **Fantasía:** Una estación orbital limpia sobre un planeta que fue bombardeado hasta la roca y que ahora intentan resucitar. Corporativo, frío y con la esperanza cotizando a la baja.
- **Paleta:** gris estación y azul limpio, naranja corporativo Czerka, verde frágil de superficie restaurada
- **Luz y clima:** Luz de estación blanca y uniforme arriba; abajo, un sol pálido sobre una superficie que aún no sabe si va a vivir.
- **Arquitectura y materiales:** Modular, limpio, atornillado: paneles, pasarelas y ventanales enormes en la estación; prefabricados y chatarra en la superficie.
- **Motivo recurrente:** El contraste entre lo pulcro y lo improvisado. Arriba todo encaja; abajo todo está atado con alambre.

### `telos_citadel` — Estación Ciudadela
**Zonas que lo usan:** Estación Ciudadela
> Una enorme estación orbital sobre la superficie en recuperación. Sede del Proyecto de Restauración de Telos.

```
the interior of a massive orbital Citadel Station, a clean restored corridor of white panelling and handrails, enormous observation viewports looking down on the planet below, soft uniform lighting, everything maintained, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `telos_surface` — Superficie de Telos
**Zonas que lo usan:** Superficie de Telos
> Un mundo que aún se cura del bombardeo sith. La vida lucha por volver entre las ruinas.

```
a recovering bombarded surface, fragile new growth pushing up between slabs of shattered ruin, prefab shelters and salvage stacked under a pale restored sky, a restoration marker post, thin cold light, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `telos_rakata_lab` — Laboratorio Rakata
**Zonas que lo usan:** Laboratorio Rakata
> Tecnología antigua del Imperio Infinito. La realidad se dobla de formas que no deberían ser posibles.

```
an ancient Rakata laboratory, smooth obsidian-and-bronze alien technology with no visible seams, geometry that meets at angles that should not close, a deep red glow from an unseen source below the floor, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Malachor V

**Niveles:** 35–50 · **Zonas:** 10 · **Música:** `malachor_ambient`

**Ficha de mundo**

- **Fantasía:** Un planeta partido por un arma y abandonado con la herida abierta. La Fuerza misma está rota aquí. Es el acto final y debe sentirse como el fondo de algo.
- **Paleta:** negro roto y gris ceniza con vetas rojas, cielo sin color; la luz parece caer hacia dentro
- **Luz y clima:** Sin sol y sin color. Una luz gris que no proyecta sombras limpias, y vetas rojas que laten desde las grietas del suelo.
- **Arquitectura y materiales:** Roca negra fracturada en ángulos imposibles, con restos de naves y de academia suspendidos en gravedad rota.
- **Motivo recurrente:** La gravedad equivocada: siempre hay algo flotando o cayendo hacia el lado que no toca.

### `malachor_surface` — Superficie de Malachor V
**Zonas que lo usan:** Superficie de Malachor V
> Un mundo hecho pedazos. Anomalías gravitatorias, escombros flotantes y los ecos aullantes del Generador de Sombra Másica.

```
a shattered planet surface, slabs of black rock floating motionless above the ground in broken gravity, red veins pulsing in the fissures below, a screaming colourless dark-side sky, debris suspended mid-fall, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `malachor_depths` — Profundidades de Trayus
**Zonas que lo usan:** Profundidades de Trayus
> El camino a la Academia de Trayus. Aquí el lado oscuro es una fuerza física que presiona tu mente.

```
a descent toward the Trayus Academy, jagged black rock walls narrowing overhead, red veins running through the stone, crushing dark-side pressure implied by the compressed perspective, a faint light far below, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `malachor_ghost_ship` — Crucero Fantasma
**Zonas que lo usan:** Crucero Fantasma
> Una nave de guerra de la República congelada en un limbo gravitatorio. Los espíritus de la tripulación aún recorren los pasillos.

```
a derelict Republic warship held in gravitational limbo, a corridor torn open to the void with wreckage frozen in mid-drift, spectral cold blue light, hull plating peeled outward and hanging, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `malachor_trayus` — Academia de Trayus
**Zonas que lo usan:** Academia de Trayus
> El corazón del poder del Triunvirato Sith. Donde nacieron Traya, Nihilus y Sion — y donde terminarán.

```
the Trayus Academy core, a hall of black mirror-polished stone reflecting nothing correctly, swirling dark-side energy coiling between the columns, a central ring of seats facing inward, the heart of the Triumvirate, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_cathedral_entry` — Catedral del Hambre — Umbral
**Zonas que lo usan:** Catedral del Hambre — Umbral
> La entrada palpita de hambre. Sientes que tu Fuerza se drena con solo permanecer aquí.

```
the threshold of the Cathedral of Hunger, an immense doorway of fused black stone shaped like an open mouth, the ground before it stripped bare and grey, the light visibly bending inward toward the opening, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_cathedral_nave` — Catedral del Hambre — Nave
**Zonas que lo usan:** Catedral del Hambre — Nave
> Pilares de energía oscura cristalizada sostienen un techo perdido en la sombra. Hay voces que susurran desde todas las direcciones.

```
the nave of a cathedral built to devour, a colossal vaulted hall of black rib-like buttresses, rows of empty stone stalls facing an unseen altar, a cold grey light with no source, everything drawn toward the far end, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_cathedral_puzzle` — Catedral del Hambre — Cámara del Ritual
**Zonas que lo usan:** Catedral del Hambre — Cámara del Ritual
> Hay que completar un antiguo ritual sith para avanzar. La elección equivocada significa la muerte.

```
a ritual chamber inside the Cathedral of Hunger, a circular floor of interlocking black plates with a hollow at the centre, three carved basins holding still dark liquid, faint red script crawling across the walls, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_cathedral_altar` — Catedral del Hambre — Altar del Vacío
**Zonas que lo usan:** Catedral del Hambre — Altar del Vacío
> Un enorme altar donde Nihilus consumió por primera vez un mundo. El minijefe aguarda.

```
the Altar of the Void, a raised block of seamless black stone with a shallow depression worn into its surface, the surrounding floor cracked outward in a radial pattern, absolute lightlessness above the altar, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_cathedral_void` — Catedral del Hambre — El Vacío
**Zonas que lo usan:** Catedral del Hambre — El Vacío
> Nada. Y todo. El espacio entre los espacios. Nihilus espera en el centro del hambre absoluta.

```
a chamber that is mostly absence, a narrow stone walkway crossing a space where there is no floor, wall or ceiling, only a devouring grey nothing, fragments of the cathedral drifting away into it, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `dungeon_cathedral_heart` — Catedral del Hambre — Corazón
**Zonas que lo usan:** Catedral del Hambre — Corazón
> El núcleo de la Catedral. Aquí reposan reliquias sith antiguas de un poder inimaginable.

```
the heart of the Cathedral of Hunger, a vast spherical cavity of black stone with a slow pulse of red light at its centre, ribbed walls like the inside of something alive, the architecture breathing, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

## Tu nave

**Zonas:** 3 · **Música:** `theme_main`

**Ficha de mundo**

- **Fantasía:** Tu nave: el único sitio del juego que es tuyo. Estrecho, funcional y poco a poco más habitado según avanza la campaña.
- **Paleta:** gris cabina, ámbar de instrumentos, rojo Sith en los detalles; interior estrecho y habitado
- **Luz y clima:** Ámbar de instrumentos y luz de trabajo fría, con el rojo Sith solo en los detalles. Nunca luz natural.
- **Arquitectura y materiales:** Interior de nave pequeña: mamparos, conductos vistos, asideros y superficies que alguien usa a diario.
- **Motivo recurrente:** La escala humana. Después de nueve mundos monumentales, aquí todo está al alcance de la mano.

### `ship_bridge` — Puente de la Nave
**Zonas que lo usan:** Puente de la Nave
> La cabina de tu nave estelar. El mapa galáctico brilla en la consola principal.

```
the cramped bridge of a small starship, two forward crew seats before a curved instrument console glowing amber, a forward viewport onto starfield, overhead conduit runs and grab handles, worn seat padding, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `ship_quarters` — Camarotes de la Tripulación
**Zonas que lo usan:** Camarotes de la Tripulación
> Literas y una zona común. Tus compañeros se reúnen aquí entre misiones.

```
the crew quarters of a small starship, two bunks recessed into the bulkhead, a fold-down table with personal effects left out, a locker standing open, low warm light, lived-in and untidy, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD

### `ship_hold` — Bodega de Carga
**Zonas que lo usan:** Bodega de Carga
> Cajas de almacenaje, un banco de trabajo y el leve zumbido del hipermotor.

```
a starship cargo hold, crates strapped down under cargo netting along both bulkheads, a deck hatch and a loading ramp seam at one end, exposed structural ribs, cold blue work-lighting, pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene with parallax-friendly foreground / midground / background layers, atmospheric depth and haze, KOTOR-era Star Wars Sith dark fantasy mood lighting
```
**Ajustes:** 1536×1024 (`--ar 3:2`) o 1920×1080 (`--ar 16:9`) · Prompt Magic **OFF** · Guidance 6–8 · sin personajes ni HUD
