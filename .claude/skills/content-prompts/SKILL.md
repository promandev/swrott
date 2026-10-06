---
name: content-prompts
description: Genera el prompt detallado para IA externas (Leonardo.ai / Suno.ai) de todo contenido nuevo de SWROTT. Úsala SIEMPRE que se cree o modifique un personaje, compañero, NPC, enemigo, jefe, combate, zona/nivel, planeta/mundo o pista de música — aunque el usuario no la pida — y también cuando pida refrescar, auditar o regenerar los prompts de docs/prompts/. Invocable como /content-prompts [all|classes|companions|npcs|enemies|music|worlds].
---

# Prompts de contenido para IA externas

Mantienes [`docs/prompts/`](../../../docs/prompts/): **un fichero por entidad** con el prompt
completo y listo para pegar en Leonardo.ai (arte) o Suno.ai (música).

**Regla de oro: las entidades no se mezclan.** Los personajes jugables, los compañeros, los NPCs,
los enemigos, la música y los mundos viven cada uno en su propio `.md` y en su propio
`_seeds/*.json`. Nunca metas un prompt de música en un fichero de personajes ni al revés.

## Lo que disparas tú solo

Cuando en una sesión se **crea o cambia** contenido de juego, esto forma parte del trabajo —
no esperes a que te lo pidan:

| Se crea… | Escribe semilla en | Y además |
|---|---|---|
| clase jugable | `_seeds/player-classes.json` | 4 poses obligatorias |
| compañero | `_seeds/companions.json` | 4 poses obligatorias |
| NPC con diálogo | `_seeds/npcs.json` | solo pose base |
| enemigo o jefe | `_seeds/enemies.json` | `planet` siempre; `states` si es `boss` |
| combate/encuentro nuevo | `_seeds/enemies.json` | cubre **todos** los `enemyId` del encuentro |
| zona / nivel | `_seeds/worlds.json` → `scenes[sceneId]` | |
| planeta / mundo | `_seeds/worlds.json` | ficha de mundo **+** una escena por `sceneId` **+** su `ambient` en `_seeds/music.json` |
| pista de música | `_seeds/music.json` | |

Luego **siempre**:

```bash
node scripts/build-content-prompts.mjs
```

y menciona en tu respuesta qué prompts nuevos hay y dónde. El build lee los ids, nombres,
niveles, zonas y descripciones **del código**, así que la semilla solo aporta la dirección
artística — no dupliques ahí datos que ya están en `src/`.

## El estudio (`npm run studio`)

`scripts/prompt-studio.mjs` sirve en `http://localhost:4300` la lista de los prompts con su
estado real, y **automatiza todo menos el clic de generar**:

1. "Copiar y armar" → copia el prompt al portapapeles y arma esa entidad.
2. El usuario pega en Leonardo/Suno y descarga.
3. El estudio detecta la descarga, la renombra al `id`, la convierte con
   `convert-characters.ps1 -File … -Id …`, la registra en `character-images.ts` (sección
   *"Añadidos por prompt-studio"*) y relanza el build.

Lee `docs/prompts/_index.json`, que **emite el build** — si el estudio dice que el índice falta
o está desfasado, corre `npm run prompts`. Si el recorte de fondo sale mal, los botones
"Reconvertir tol 100 / tol 45" rehacen la conversión desde el original sin volver a generar.

Lo único que el estudio **no** puede hacer solo: añadir la heurística por nombre de hablante en
`getSpeakerImage` cuando el NPC nuevo habla en diálogo. Recuérdalo al usuario.

## Procedimiento

1. **Construye en seco** para ver qué falta: `node scripts/build-content-prompts.mjs --check`.
   Lista cada entidad del código sin semilla y sale con error si hay alguna.
2. **Lee la entidad en el código** antes de escribir su prompt — nombre, `description`, nivel,
   zona, título. La dirección artística debe ser **fiel a la ficha**, no inventada: si el código
   dice que Grot es rodiano, el prompt dice rodiano.
3. **Escribe la semilla** siguiendo el formato de abajo.
4. **Reconstruye** y comprueba que la entrada nueva sale sin ⚠️.

## Formato de semilla

Personajes (`player-classes` / `companions` / `npcs` / `enemies`):

```json
"tuk_ata": {
  "planet": "korriban",
  "subject": "especie y rol, edad y complexión, vestuario y materiales, arma o prop característico, expresión y postura",
  "bg": "green",
  "notes": "qué es lo que hace legible al personaje — para ti, no para la IA",
  "states": { "attack": "…", "hurt": "…", "down": "…" }
}
```

- `subject` — **solo el sujeto, en inglés, en minúsculas y sin punto final.** El sufijo de estilo,
  el fondo croma y los ajustes los añade el build. Nunca pegues el sufijo en la semilla.
- `planet` — obligatorio en `enemies.json` (agrupa el fichero); los NPCs lo deducen de su `zoneId`.
- `bg` — solo para forzar croma. Por defecto se elige verde si el sujeto lleva rojos/carmesíes
  (el magenta se confunde con el rojo Sith) y magenta en el resto.
- `states` — solo jefes, compañeros y clases. Son **deltas de pose** que se concatenan al
  `subject`: describe la pose, no repitas el vestuario.
- `notes` — dirección en español para el humano que genera la imagen.

Música (`music.json`): `group` (`core` | `ambient` | `sting`), `title`, `songTitle`, `brief` (en
español: qué debe transmitir y dónde suena), `style` (el prompt de Suno, en inglés),
`instrumental`, `length`, `bpm`, `key`, `loop`, `exclude`.

Mundos (`worlds.json`): por planeta `fantasy`, `light`, `architecture`, `motif` y un mapa
`scenes` de `sceneId` → línea de escena en inglés (sin sufijo).

## Consistencia

- El estilo global vive en [`_seeds/style.json`](../../../docs/prompts/_seeds/style.json):
  sufijos, negative, croma, ajustes de motor y paleta por planeta. **Cambia ahí y se propaga**;
  no repitas estilo en las semillas individuales.
- El juego entero es **pixel art** de la era KOTOR. No introduzcas otro estilo.
- Reskin de un enemigo o NPC existente → dilo en `notes` ("reutiliza el diseño de `x`") para que
  compartan paleta y silueta.
- Planeta nuevo → añádelo también a `planets` en `style.json` (nombre, `levels`, `palette`, y
  `prefix` si el `zoneId` no empieza por el `planetId`).

## Relación con `/asset-catalog`

Son complementarias y **no se pisan**: `/asset-catalog` mantiene `docs/assets/` como tablero de
estado (qué arte existe ya, pipeline de conversión, guía de estilo original). Esta skill mantiene
`docs/prompts/` como biblioteca de prompts. Al crear contenido corre **esta**; al generar e
integrar un asset ya producido, corre **aquella**.
