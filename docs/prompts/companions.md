# Compañeros — prompts de personaje

Los cinco compañeros reclutables. Combaten a tu lado, así que idealmente llevan las cuatro poses; como mínimo la idle. Datos: `src/game/engine/companions/companions.ts`.

> **Cómo usarlo:** copia el bloque de prompt tal cual en Leonardo.ai. El *negative prompt*
> es común a todo el fichero (abajo) — pégalo una vez en su casilla. El nombre de archivo
> **debe** coincidir con el `id` indicado o el juego no encontrará el arte.

<details><summary><b>Negative prompt (común a todas las entradas)</b></summary>

```
photo, photorealistic, 3d render, octane, blurry, soft focus, anti-aliased edges, jpeg artifacts, smooth gradients, watermark, signature, text, caption, UI, frame, border, drop shadow, cast shadow on ground, busy background, multiple characters, cropped, out of frame, extra limbs, extra fingers, deformed hands, lens flare, bokeh
```
</details>

---

### Kaelis Dren — `kaelis`
**Tipo:** Compañero · **Se recluta en:** korriban · **Clase:** marauder · **Archivo:** `public/images/characters/companion_kaelis.svg` · **Estado:** ✅ en disco
*“El Rival Reforjado”*
> Un compañero acólito Sith que puede convertirse en tu mayor aliado o en tu enemigo más acérrimo. Hábil duelista con un código de honor inusual para un Sith.

**Prompt — pose base (idle)**
```
honorable young Sith duelist, mid-twenties, athletic and upright, dark red and black light armor with a clean unadorned breastplate and a single shoulder guard, short dark hair, a duelist's trimmed beard, one red lightsaber held in a formal high guard, proud level bearing, a leather sword-belt with a house token, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Es el espejo honorable del jugador: postura de esgrima de academia, nada de saña. Ropa cuidada aunque gastada.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`kaelis_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
honorable young Sith duelist, mid-twenties, athletic and upright, dark red and black light armor with a clean unadorned breastplate and a single shoulder guard, short dark hair, a duelist's trimmed beard, one red lightsaber held in a formal high guard, proud level bearing, a leather sword-belt with a house token, clean committed forward lunge with the saber extended at full reach, front foot planted, expression focused rather than cruel, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`kaelis_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
honorable young Sith duelist, mid-twenties, athletic and upright, dark red and black light armor with a clean unadorned breastplate and a single shoulder guard, short dark hair, a duelist's trimmed beard, one red lightsaber held in a formal high guard, proud level bearing, a leather sword-belt with a house token, guard broken high, saber arm forced wide, one step back, teeth gritted, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`kaelis_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
honorable young Sith duelist, mid-twenties, athletic and upright, dark red and black light armor with a clean unadorned breastplate and a single shoulder guard, short dark hair, a duelist's trimmed beard, one red lightsaber held in a formal high guard, proud level bearing, a leather sword-belt with a house token, on one knee with the saber point-down in the dirt, one hand gripping the hilt, head up and still defiant, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### V3X-9 — `v3x9`
**Tipo:** Compañero · **Se recluta en:** korriban · **Clase:** assassin · **Archivo:** `public/images/characters/companion_v3x9.svg` · **Estado:** ✅ en disco
*“El Droide Rebelde”*
> Un antiguo droide asesino con los bancos de memoria corruptos y un humor seco. Eficiente en combate, de ética cuestionable.

**Prompt — pose base (idle)**
```
ancient battered assassin droid, humanoid chassis, scratched matte-grey plating over exposed cabling and hydraulics, mismatched replacement panels riveted on, a single glowing red optic in a narrow skull-like head, retractable vibroblades along both forearms, scored carbon burns across the chest plate, hunched efficient posture, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** La historia está en los remiendos: cada panel de repuesto es de un color de gris distinto. Un solo punto rojo de luz.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`v3x9_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
ancient battered assassin droid, humanoid chassis, scratched matte-grey plating over exposed cabling and hydraulics, mismatched replacement panels riveted on, a single glowing red optic in a narrow skull-like head, retractable vibroblades along both forearms, scored carbon burns across the chest plate, hunched efficient posture, both forearm vibroblades fully extended and driven forward in a scissoring strike, servo-joints tensed, optic flaring bright red, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`v3x9_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
ancient battered assassin droid, humanoid chassis, scratched matte-grey plating over exposed cabling and hydraulics, mismatched replacement panels riveted on, a single glowing red optic in a narrow skull-like head, retractable vibroblades along both forearms, scored carbon burns across the chest plate, hunched efficient posture, chassis jerked backward by the impact, sparks bursting from a shoulder joint, optic flickering, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`v3x9_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
ancient battered assassin droid, humanoid chassis, scratched matte-grey plating over exposed cabling and hydraulics, mismatched replacement panels riveted on, a single glowing red optic in a narrow skull-like head, retractable vibroblades along both forearms, scored carbon burns across the chest plate, hunched efficient posture, collapsed backward on the ground, one arm torn loose and lying apart, optic dimmed to a faint ember, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Serana Voss — `serana`
**Tipo:** Compañero · **Se recluta en:** nar_shaddaa · **Clase:** inquisitor · **Archivo:** `public/images/characters/serana.svg` · **Estado:** ⬜ por generar
*“La Jedi Caída”*
> Una antigua Padawan Jedi que perdió a su maestra a manos de los Sith. Se debate entre la luz y la oscuridad. Poderosa usuaria de la Fuerza.

**Prompt — pose base (idle)**
```
former Jedi padawan turning to the dark side, early twenties, light leather Jedi robes torn and re-stitched with Sith straps and black panels, auburn hair with a severed padawan braid, freckled face caught between grief and anger, holding a lightsaber whose blade fades from blue at the emitter to violet at the tip, one hand half-open as if about to let go, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** La transición está en el sable y en las costuras: mitad Jedi, mitad Sith. Expresión conflictuada, nunca cruel.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`serana_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
former Jedi padawan turning to the dark side, early twenties, light leather Jedi robes torn and re-stitched with Sith straps and black panels, auburn hair with a severed padawan braid, freckled face caught between grief and anger, holding a lightsaber whose blade fades from blue at the emitter to violet at the tip, one hand half-open as if about to let go, two-handed descending saber cut, blue-to-violet blade bright across the frame, face contorted with an anger she did not choose, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`serana_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
former Jedi padawan turning to the dark side, early twenties, light leather Jedi robes torn and re-stitched with Sith straps and black panels, auburn hair with a severed padawan braid, freckled face caught between grief and anger, holding a lightsaber whose blade fades from blue at the emitter to violet at the tip, one hand half-open as if about to let go, recoiling with the free hand at her ribs, braid whipping across the face, eyes wide, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`serana_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
former Jedi padawan turning to the dark side, early twenties, light leather Jedi robes torn and re-stitched with Sith straps and black panels, auburn hair with a severed padawan braid, freckled face caught between grief and anger, holding a lightsaber whose blade fades from blue at the emitter to violet at the tip, one hand half-open as if about to let go, kneeling with the saber deactivated on the ground beside her, both hands on her thighs, head hanging, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Torvak — `torvak`
**Tipo:** Compañero · **Se recluta en:** dxun · **Clase:** marauder · **Archivo:** `public/images/characters/torvak.svg` · **Estado:** ⬜ por generar
*“El Mandaloriano”*
> Un guerrero mandaloriano curtido en batalla que busca rivales dignos. Respeta la fuerza y desprecia el engaño.

**Prompt — pose base (idle)**
```
battle-hardened Mandalorian warrior, heavy build, dented beskar plate in earth-and-iron tones with one crimson-painted pauldron, T-visor helmet carried under one arm revealing a scarred jaw and grey-streaked beard, heavy vibrosword slung across the back, gauntlet flamethrower nozzle on the left forearm, weathered flight suit and a trophy-strung belt, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Casco en el brazo, no en la cabeza: es el compañero al que le ves la cara. Abolladuras reales, no decorativas.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`torvak_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
battle-hardened Mandalorian warrior, heavy build, dented beskar plate in earth-and-iron tones with one crimson-painted pauldron, T-visor helmet carried under one arm revealing a scarred jaw and grey-streaked beard, heavy vibrosword slung across the back, gauntlet flamethrower nozzle on the left forearm, weathered flight suit and a trophy-strung belt, helmet on and visor forward, heavy vibrosword swung in a two-handed horizontal arc, gauntlet flamethrower spitting a short burst of orange flame, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`torvak_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
battle-hardened Mandalorian warrior, heavy build, dented beskar plate in earth-and-iron tones with one crimson-painted pauldron, T-visor helmet carried under one arm revealing a scarred jaw and grey-streaked beard, heavy vibrosword slung across the back, gauntlet flamethrower nozzle on the left forearm, weathered flight suit and a trophy-strung belt, knocked half-around by the hit, one arm flung out, helmet dropped from under the arm, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`torvak_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
battle-hardened Mandalorian warrior, heavy build, dented beskar plate in earth-and-iron tones with one crimson-painted pauldron, T-visor helmet carried under one arm revealing a scarred jaw and grey-streaked beard, heavy vibrosword slung across the back, gauntlet flamethrower nozzle on the left forearm, weathered flight suit and a trophy-strung belt, seated hard against the ground, one leg folded under, vibrosword driven upright into the earth beside him, hand still on the grip, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Echo Shade — `echo_shade`
**Tipo:** Compañero · **Se recluta en:** dantooine · **Clase:** inquisitor · **Archivo:** `public/images/characters/echo_shade.svg` · **Estado:** ⬜ por generar
*“El Fantasma de la Fuerza”*
> Una entidad espectral atada a un antiguo artefacto sith. Ni del todo viva ni muerta. Vasto conocimiento del lado oscuro.

**Prompt — pose base (idle)**
```
translucent Sith force-ghost, semi-transparent cyan-violet spectral robes whose hem dissolves into drifting mist instead of feet, hollow glowing eyes in a serene ancient face, faint scrollwork of old Sith glyphs visible through the body, one hand resting on a small floating shard artifact that orbits slowly at chest height, calm and weightless, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #FF00FF magenta
**Notas de dirección:** Translúcido de verdad: el borde del fondo debe verse a través de la túnica. Sin sombra proyectada. Que flote — nunca toca el suelo.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`echo_shade_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
translucent Sith force-ghost, semi-transparent cyan-violet spectral robes whose hem dissolves into drifting mist instead of feet, hollow glowing eyes in a serene ancient face, faint scrollwork of old Sith glyphs visible through the body, one hand resting on a small floating shard artifact that orbits slowly at chest height, calm and weightless, both arms sweeping outward, the shard artifact blazing white-violet, spectral robes streaming forward into a wave of dark energy, face gone fierce, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`echo_shade_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
translucent Sith force-ghost, semi-transparent cyan-violet spectral robes whose hem dissolves into drifting mist instead of feet, hollow glowing eyes in a serene ancient face, faint scrollwork of old Sith glyphs visible through the body, one hand resting on a small floating shard artifact that orbits slowly at chest height, calm and weightless, form destabilising into horizontal glitch-bands of light, the shard flickering, silhouette briefly doubled, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
**`echo_shade_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
translucent Sith force-ghost, semi-transparent cyan-violet spectral robes whose hem dissolves into drifting mist instead of feet, hollow glowing eyes in a serene ancient face, faint scrollwork of old Sith glyphs visible through the body, one hand resting on a small floating shard artifact that orbits slowly at chest height, calm and weightless, form dissipating from the hem upward into scattering motes, only the head, shoulders and the falling shard still coherent, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background
```
</details>
