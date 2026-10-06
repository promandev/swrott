# Clases jugables — prompts de personaje

Las tres clases del jugador. **Máxima prioridad**: están en pantalla en cada combate, así que merecen las cuatro poses. Registro: `src/game/utils/character-images.ts`.

> **Cómo usarlo:** copia el bloque de prompt tal cual en Leonardo.ai. El *negative prompt*
> es común a todo el fichero (abajo) — pégalo una vez en su casilla. El nombre de archivo
> **debe** coincidir con el `id` indicado o el juego no encontrará el arte.

<details><summary><b>Negative prompt (común a todas las entradas)</b></summary>

```
photo, photorealistic, 3d render, octane, blurry, soft focus, anti-aliased edges, jpeg artifacts, smooth gradients, watermark, signature, text, caption, UI, frame, border, drop shadow, cast shadow on ground, busy background, multiple characters, cropped, out of frame, extra limbs, extra fingers, deformed hands, lens flare, bokeh
```
</details>

---

### Marauder (Guerrero Sith) — `marauder`
**Tipo:** Clase jugable · **Archivo:** `public/images/characters/class_marauder.svg` · **Estado:** ✅ en disco
> Melé pesado. Sable a dos manos o doble sable rojo, armadura recia, furia. Es la silueta más ancha de las tres.

**Prompt — pose base (idle)**
```
imposing Sith warrior juggernaut, broad heavy build, heavy layered crimson-and-black plate armor with tall spiked pauldrons and a segmented gorget, battle-scarred bare forearms, tattered dark war-skirt over greaves, heavy armored boots, wielding a two-handed red lightsaber held low across the body, shaven scarred head with ritual burn marks, jaw set in contempt, aggressive grounded wide stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Silueta más ancha que alta — las hombreras definen el personaje. Fondo verde porque el carmesí domina el sprite.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`marauder_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
imposing Sith warrior juggernaut, broad heavy build, heavy layered crimson-and-black plate armor with tall spiked pauldrons and a segmented gorget, battle-scarred bare forearms, tattered dark war-skirt over greaves, heavy armored boots, wielding a two-handed red lightsaber held low across the body, shaven scarred head with ritual burn marks, jaw set in contempt, aggressive grounded wide stance, mid overhead two-handed saber swing, both arms extended, weight thrown forward onto the front foot, snarling open-mouthed, war-skirt flaring back, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`marauder_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
imposing Sith warrior juggernaut, broad heavy build, heavy layered crimson-and-black plate armor with tall spiked pauldrons and a segmented gorget, battle-scarred bare forearms, tattered dark war-skirt over greaves, heavy armored boots, wielding a two-handed red lightsaber held low across the body, shaven scarred head with ritual burn marks, jaw set in contempt, aggressive grounded wide stance, recoiling flinch with guard broken, saber arm swung wide, head snapped back, one step retreating, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`marauder_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
imposing Sith warrior juggernaut, broad heavy build, heavy layered crimson-and-black plate armor with tall spiked pauldrons and a segmented gorget, battle-scarred bare forearms, tattered dark war-skirt over greaves, heavy armored boots, wielding a two-handed red lightsaber held low across the body, shaven scarred head with ritual burn marks, jaw set in contempt, aggressive grounded wide stance, down on one knee, saber stabbed blade-first into the ground as a crutch, head bowed, shoulders heaving, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Inquisitor (Hechicero Sith) — `inquisitor`
**Tipo:** Clase jugable · **Archivo:** `public/images/characters/class_inquisitor.svg` · **Estado:** ✅ en disco
> Control y Fuerza. Túnica, rayos, sable fino al cinto. Pose de canalización en ataque.

**Prompt — pose base (idle)**
```
gaunt Sith sorcerer, tall and thin, flowing black-and-violet hooded robes with gilt trim and long trailing sleeves, high collar, pale hollow-cheeked face half-shadowed by the hood, sunken eyes ringed in dark-side corruption veins, violet force-lightning crackling around raised skeletal fingers, a single thin red lightsaber hilt clipped at the hip, bare feet under the hem, poised upright stance, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** La luz del rayo violeta es la única fuente cálida del sprite — que se refleje en la cara y el borde de la túnica.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`inquisitor_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
gaunt Sith sorcerer, tall and thin, flowing black-and-violet hooded robes with gilt trim and long trailing sleeves, high collar, pale hollow-cheeked face half-shadowed by the hood, sunken eyes ringed in dark-side corruption veins, violet force-lightning crackling around raised skeletal fingers, a single thin red lightsaber hilt clipped at the hip, bare feet under the hem, poised upright stance, both hands thrust forward in a channeling pose, arcs of violet force lightning erupting from the fingertips, robes and sleeves blown backward, head tilted down with eyes blazing, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`inquisitor_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
gaunt Sith sorcerer, tall and thin, flowing black-and-violet hooded robes with gilt trim and long trailing sleeves, high collar, pale hollow-cheeked face half-shadowed by the hood, sunken eyes ringed in dark-side corruption veins, violet force-lightning crackling around raised skeletal fingers, a single thin red lightsaber hilt clipped at the hip, bare feet under the hem, poised upright stance, staggering back, hood falling off the shoulders, robe whipping sideways, one arm raised in a broken ward, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`inquisitor_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
gaunt Sith sorcerer, tall and thin, flowing black-and-violet hooded robes with gilt trim and long trailing sleeves, high collar, pale hollow-cheeked face half-shadowed by the hood, sunken eyes ringed in dark-side corruption veins, violet force-lightning crackling around raised skeletal fingers, a single thin red lightsaber hilt clipped at the hip, bare feet under the hem, poised upright stance, collapsed to both knees, robes pooled on the ground, one hand splayed flat for support, hood fully off, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>

### Assassin (Sombra Sith) — `assassin`
**Tipo:** Clase jugable · **Archivo:** `public/images/characters/class_assassin.svg` · **Estado:** ✅ en disco
> Sigilo y crítico. Doble sable, silueta esbelta, capucha que oculta el rostro.

**Prompt — pose base (idle)**
```
lithe hooded Sith assassin, slim athletic build, matte-black wrapped armor with segmented plates and a long torn cloak, face fully shadowed inside the hood with only two faint red eye-glints visible, forearm wraps and soft-soled boots, holding a double-bladed red lightsaber angled across the body, coiled low predatory stance ready to spring, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**Ajustes:** 1024×1024 · `--ar 1:1` · Leonardo Phoenix 1.0 o AlbedoBase XL · Preset "Pixel Art" (o None/RAW) · Prompt Magic **OFF** · Guidance 6–8 · contraste medio-alto · genera 4 y quédate con la silueta más limpia · **Fondo:** #00FF66 green
**Notas de dirección:** Todo negro sobre negro: la legibilidad viene del filo rojo y del borde de luz superior-izquierda. Nada de detalle dentro de la capucha.

<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>

**`assassin_attack.svg`** — golpe **en el sitio** — el lunge lo anima el código; arma alzada o extendida, peso adelantado
```
lithe hooded Sith assassin, slim athletic build, matte-black wrapped armor with segmented plates and a long torn cloak, face fully shadowed inside the hood with only two faint red eye-glints visible, forearm wraps and soft-soled boots, holding a double-bladed red lightsaber angled across the body, coiled low predatory stance ready to spring, mid-lunge spinning double-saber strike, both blades arcing in a bright crossing sweep, cloak flaring wide behind, body low and extended, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`assassin_hurt.svg`** — retroceso de dolor, cabeza atrás, un paso desequilibrado
```
lithe hooded Sith assassin, slim athletic build, matte-black wrapped armor with segmented plates and a long torn cloak, face fully shadowed inside the hood with only two faint red eye-glints visible, forearm wraps and soft-soled boots, holding a double-bladed red lightsaber angled across the body, coiled low predatory stance ready to spring, twisting away from the blow, cloak flaring, off-balance on one foot, hood half torn back, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
**`assassin_down.svg`** — derrotado, de rodillas o desplomándose, arma caída
```
lithe hooded Sith assassin, slim athletic build, matte-black wrapped armor with segmented plates and a long torn cloak, face fully shadowed inside the hood with only two faint red eye-glints visible, forearm wraps and soft-soled boots, holding a double-bladed red lightsaber angled across the body, coiled low predatory stance ready to spring, crumpled sideways on the ground, double-bladed saber fallen and deactivated beside the hand, hood off revealing a pale scarred face, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, crisp clean 1px dark outline, limited cohesive palette (24-32 colours), flat cel shading with a single top-left light source, minimal dithering only on large surfaces, sharp readable pixel clusters, strong silhouette, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #00FF66 green background
```
</details>
