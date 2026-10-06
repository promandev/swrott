# Prompts de contenido — catálogo para IA externas

Un fichero **por entidad**, con el prompt **completo y listo para pegar**. Nada se mezcla: los
personajes no comparten fichero con la música, ni los NPCs con los enemigos.

| Fichero | Contiene | Destino |
|---|---|---|
| [`player-classes.md`](player-classes.md) | 3 clases jugables · 4 poses c/u | Leonardo.ai |
| [`companions.md`](companions.md) | 5 compañeros · 4 poses c/u | Leonardo.ai |
| [`npcs.md`](npcs.md) | 61 NPCs · pose base | Leonardo.ai |
| [`enemies.md`](enemies.md) | 66 enemigos (17 jefes) · jefes con 4 poses | Leonardo.ai |
| [`music.md`](music.md) | 15 pistas | Suno.ai |
| [`worlds.md`](worlds.md) | 54 escenarios en 10 mundos | Leonardo.ai |

## El estudio — pegar y descargar, nada más

```bash
npm run studio     # http://localhost:4300
```

Lista estos mismos prompts con su estado real. Pulsa **Copiar y armar**, pega en
Leonardo/Suno y descarga: el estudio detecta la descarga, la renombra al `id`, le quita el
fondo, la registra en `character-images.ts` y refresca este catálogo. Si el recorte sale mal,
reconvierte con otra tolerancia sin volver a generar la imagen.

Vigila `%USERPROFILE%\Downloads` (o `SWROTT_DOWNLOADS`). Lo que **no** hace: la heurística
por nombre en `getSpeakerImage` para NPCs con diálogo — eso sigue siendo manual.

## Cómo se mantiene

Estos `.md` **se generan**; no los edites a mano. La parte creativa de cada prompt vive en
[`_seeds/`](_seeds/) (un JSON por entidad) y el resto —ids, nombres, niveles, zonas,
descripciones, qué existe ya en disco— se lee del código en cada build.

```bash
node scripts/build-content-prompts.mjs          # reconstruye los seis ficheros
node scripts/build-content-prompts.mjs --check  # falla si hay contenido sin dirección de arte
```

Cuando crees **un personaje, un nivel, un mundo o un combate** nuevos, la skill
[`/content-prompts`](../../.claude/skills/content-prompts/SKILL.md) escribe su semilla y
vuelve a construir, de modo que su prompt aparece aquí solo. Lo que esté en el código sin
semilla sale marcado como ⚠️ **SIN DIRECCIÓN DE ARTE** en lugar de desaparecer sin más.

## Estilo

Todo el juego es **pixel art**, Sith de la era KOTOR. Los sufijos de estilo, el negative común,
la paleta por planeta y los ajustes de motor están en [`_seeds/style.json`](_seeds/style.json)
y se inyectan en cada prompt al construir — cambia allí y se propaga a los seis ficheros.

## Relación con `docs/assets/`

[`docs/assets/`](../assets/) es el **tablero de estado** (qué existe, qué falta, el pipeline de
conversión y la guía de estilo original). `docs/prompts/` es la **biblioteca de prompts**: el
texto completo que se lanza a la IA. Uno dice *qué falta*; el otro, *qué escribir*.
