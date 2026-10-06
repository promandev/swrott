#!/usr/bin/env node
/**
 * build-content-prompts.mjs — construye docs/prompts/*.md
 *
 * Fuente de verdad:
 *   - datos del juego  (src/game/**)        → ids, nombres, niveles, zonas, descripciones
 *   - dirección de arte (docs/prompts/_seeds/*.json) → la parte creativa de cada prompt
 *   - estilo global    (docs/prompts/_seeds/style.json)
 *
 * Salida: un .md por ENTIDAD (clases, compañeros, NPCs, enemigos, música, mundos),
 * con el prompt COMPLETO ya ensamblado y listo para pegar en Leonardo.ai / Suno.ai.
 *
 * Uso:
 *   node scripts/build-content-prompts.mjs            # reconstruye todo
 *   node scripts/build-content-prompts.mjs --check    # no escribe; falla si algo está sin semilla
 *
 * Añadir contenido nuevo → añade su entrada en el _seeds/ que toque y vuelve a ejecutar.
 * Lo que esté en el código pero no en las semillas sale marcado como ⚠️ SIN DIRECCIÓN DE ARTE.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEEDS = path.join(ROOT, 'docs/prompts/_seeds');
const OUT = path.join(ROOT, 'docs/prompts');
const CHECK_ONLY = process.argv.includes('--check');

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const seed = (n) => JSON.parse(fs.readFileSync(path.join(SEEDS, n + '.json'), 'utf8'));
const exists = (p) => fs.existsSync(path.join(ROOT, p));

// ── Extracción de entidades desde el código ──────────────────────────────────

const FIELD = (body, k) => {
  const r = new RegExp(k + ':\\s*(?:"((?:[^"\\\\]|\\\\.)*)"|`([^`]*)`|([A-Za-z0-9_.\\-]+))');
  const x = body.match(r);
  return x ? (x[1] ?? x[2] ?? x[3]) : undefined;
};

/** Devuelve todos los literales de objeto que empiezan por `id: "..."`. */
function objects(src) {
  const out = [];
  const re = /\{\s*\n?\s*id:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 0, i = m.index;
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') { depth--; if (depth === 0) { i++; break; } }
    }
    const body = src.slice(m.index, i);
    out.push({
      id: m[1],
      name: FIELD(body, 'name'),
      title: FIELD(body, 'title'),
      description: FIELD(body, 'description'),
      level: FIELD(body, 'level'),
      category: FIELD(body, 'category'),
      zoneId: FIELD(body, 'zoneId'),
      planetId: FIELD(body, 'planetId'),
      sceneId: FIELD(body, 'sceneId'),
      musicTrackId: FIELD(body, 'musicTrackId'),
      classId: FIELD(body, 'classId'),
      recruitPlanetId: FIELD(body, 'recruitPlanetId'),
      levelRange: FIELD(body, 'levelRange'),
    });
    re.lastIndex = m.index + 1;
  }
  return out;
}

function collect(files) {
  const seen = new Map();
  for (const f of files) for (const o of objects(read(f))) if (o.name) seen.set(o.id, o);
  return [...seen.values()];
}

const DATA = {
  enemies: collect(['src/game/engine/combat/enemies.ts', 'src/game/engine/combat/planet-enemies.ts']),
  npcs: collect([
    'src/game/data/npcs/korriban-npcs.ts', 'src/game/data/npcs/dromund-kaas-npcs.ts',
    'src/game/data/npcs/galaxy-npcs.ts', 'src/game/data/npcs/planet-npcs.ts',
    'src/game/data/npcs/side-npcs.ts', 'src/game/data/npcs/ziost-npcs.ts',
  ]),
  companions: collect(['src/game/engine/companions/companions.ts']),
  zones: collect(['src/game/data/zones/all-zones.ts', 'src/game/data/zones/dungeons.ts', 'src/game/data/zones/player-ship.ts']),
};

/** Ids de música declarados en el union MusicTrackId. */
function musicIds() {
  const src = read('src/game/audio/types.ts');
  const block = src.slice(src.indexOf('MusicTrackId'), src.indexOf('SfxId'));
  return [...block.matchAll(/"([a-z_0-9]+)"/g)].map((m) => m[1]);
}

// ── Estilo ───────────────────────────────────────────────────────────────────

const STYLE = seed('style');
const RED = /\b(crimson|scarlet|ruby|red|blood.?red|maroon|burgundy|rust|auburn|magenta|pink)\b/i;
/** El croma magenta se confunde con los rojos Sith → verde en ese caso. */
const chroma = (subject, forced) => forced || (RED.test(subject) ? 'green' : 'magenta');

function spriteSuffix(subject, forcedBg) {
  const key = chroma(subject, forcedBg);
  return STYLE.sprite.suffix.replace('{BG}', STYLE.chroma[key]);
}

const PLANETS = STYLE.planets;
/** El planeta se deduce del prefijo del zoneId (`malachor_surface` → `malachor_v`). */
const planetOf = (zoneId = '') =>
  Object.keys(PLANETS).find((p) => zoneId.startsWith(PLANETS[p].prefix || p)) || 'galaxy';

// ── Helpers de render ────────────────────────────────────────────────────────

const fence = (s) => '```\n' + s + '\n```';
const missing = [];
/** Índice plano de todos los prompts — lo consume `scripts/prompt-studio.mjs`. */
const JOBS = [];
const job = (j) => { JOBS.push(j); return j; };

/** id → ruta declarada en CHARACTER_REGISTRY (algunas no se llaman `{id}.svg`). */
const REGISTRY = (() => {
  const src = read('src/game/utils/character-images.ts');
  const body = src.slice(src.indexOf('CHARACTER_REGISTRY'));
  const map = {};
  for (const m of body.matchAll(/^\s*([A-Za-z_][\w]*)\s*:\s*"(\/images\/characters\/[^"]+)"/gm)) map[m[1]] = m[2];
  return map;
})();

/** El arte de una entidad existe si está registrada y su fichero está en disco. */
function assetPath(id) {
  const rel = REGISTRY[id] || `/images/characters/${id}.svg`;
  return 'public' + rel;
}
const hasAsset = (id) => Boolean(REGISTRY[id]) && exists(assetPath(id));

function statusOf(id) {
  if (hasAsset(id)) return '✅ en disco';
  if (exists(assetPath(id))) return '⚠️ el fichero existe pero no está en `character-images.ts`';
  return '⬜ por generar';
}

/** Ficha completa de un personaje (clase / compañero / NPC / enemigo). */
function characterCard(ent, art, opts = {}) {
  const { states = false, kind = 'NPC' } = opts;
  const lines = [];
  const title = art?.displayName || ent.name;
  lines.push(`### ${title} — \`${ent.id}\``);

  const meta = [`**Tipo:** ${kind}`];
  if (ent.level) meta.push(`**Nivel:** ${ent.level}`);
  if (ent.category) meta.push(`**Rango:** ${ent.category}`);
  if (ent.zoneId) meta.push(`**Zona:** \`${ent.zoneId}\``);
  if (ent.recruitPlanetId) meta.push(`**Se recluta en:** ${ent.recruitPlanetId}`);
  if (ent.classId) meta.push(`**Clase:** ${ent.classId}`);
  meta.push(`**Archivo:** \`${assetPath(ent.id)}\``);
  meta.push(`**Estado:** ${statusOf(ent.id)}`);
  lines.push(meta.join(' · '));
  if (ent.title) lines.push(`*“${ent.title}”*`);
  if (ent.description) lines.push(`> ${ent.description}`);

  if (!art) {
    missing.push(`${kind} ${ent.id} (${ent.name})`);
    lines.push('');
    lines.push('⚠️ **SIN DIRECCIÓN DE ARTE** — añade una entrada `"' + ent.id + '"` en ' +
      '`docs/prompts/_seeds/' + (kind === 'Enemigo' ? 'enemies' : kind === 'NPC' ? 'npcs' : 'companions') +
      '.json` y vuelve a ejecutar `node scripts/build-content-prompts.mjs`.');
    lines.push('');
    return lines.join('\n');
  }

  const bg = chroma(art.subject, art.bg);
  job({
    type: 'character', kind, id: ent.id, state: 'idle', outId: ent.id,
    label: title, group: opts.group || 'General', level: ent.level || null,
    file: assetPath(ent.id), done: hasAsset(ent.id), registered: Boolean(REGISTRY[ent.id]),
    prompt: art.subject + spriteSuffix(art.subject, art.bg),
    negative: STYLE.negative, settings: STYLE.sprite.settings, bg: STYLE.chroma[bg],
    notes: art.notes || null, description: ent.description || null,
  });
  lines.push('');
  lines.push('**Prompt — pose base (idle)**');
  lines.push(fence(art.subject + spriteSuffix(art.subject, art.bg)));
  lines.push(`**Ajustes:** ${STYLE.sprite.settings} · **Fondo:** ${STYLE.chroma[bg]}`);

  if (art.notes) lines.push(`**Notas de dirección:** ${art.notes}`);

  if (states && art.states) {
    lines.push('');
    lines.push('<details><summary><b>Estados de combate</b> — misma semilla, misma paleta, misma línea de suelo</summary>');
    lines.push('');
    for (const [st, pose] of Object.entries(art.states)) {
      const outId = `${ent.id}_${st}`;
      job({
        type: 'character', kind, id: ent.id, state: st, outId,
        label: `${title} · ${st}`, group: opts.group || 'General', level: ent.level || null,
        file: assetPath(outId), done: hasAsset(outId), registered: Boolean(REGISTRY[outId]),
        prompt: art.subject + ', ' + pose + spriteSuffix(art.subject, art.bg),
        negative: STYLE.negative, settings: STYLE.sprite.settings, bg: STYLE.chroma[bg],
        notes: STYLE.sprite.states[st], description: ent.description || null,
      });
      lines.push(`**\`${outId}.svg\`** — ${STYLE.sprite.states[st]}`);
      lines.push(fence(art.subject + ', ' + pose + spriteSuffix(art.subject, art.bg)));
    }
    lines.push('</details>');
  }
  lines.push('');
  return lines.join('\n');
}

function header(titulo, intro, extra = []) {
  return [
    `# ${titulo}`, '',
    intro, '',
    '> **Cómo usarlo:** copia el bloque de prompt tal cual en Leonardo.ai. El *negative prompt*',
    '> es común a todo el fichero (abajo) — pégalo una vez en su casilla. El nombre de archivo',
    '> **debe** coincidir con el `id` indicado o el juego no encontrará el arte.',
    '',
    '<details><summary><b>Negative prompt (común a todas las entradas)</b></summary>', '',
    fence(STYLE.negative), '</details>', '',
    ...extra, '---', '',
  ].join('\n');
}

// ── 1. Clases jugables ───────────────────────────────────────────────────────

function buildClasses() {
  const art = seed('player-classes');
  const out = [header(
    'Clases jugables — prompts de personaje',
    'Las tres clases del jugador. **Máxima prioridad**: están en pantalla en cada combate, así que ' +
    'merecen las cuatro poses. Registro: `src/game/utils/character-images.ts`.',
  )];
  for (const [id, a] of Object.entries(art)) {
    out.push(characterCard({ id, name: a.displayName, description: a.pitch }, a, { states: true, kind: 'Clase jugable', group: 'Clases jugables' }));
  }
  return out.join('\n');
}

// ── 2. Compañeros ────────────────────────────────────────────────────────────

function buildCompanions() {
  const art = seed('companions');
  const out = [header(
    'Compañeros — prompts de personaje',
    'Los cinco compañeros reclutables. Combaten a tu lado, así que idealmente llevan las cuatro ' +
    'poses; como mínimo la idle. Datos: `src/game/engine/companions/companions.ts`.',
  )];
  for (const c of DATA.companions) {
    out.push(characterCard(c, art[c.id], { states: true, kind: 'Compañero', group: 'Compañeros' }));
  }
  return out.join('\n');
}

// ── 3. NPCs ──────────────────────────────────────────────────────────────────

function buildNpcs() {
  const art = seed('npcs');
  const byPlanet = {};
  for (const n of DATA.npcs) (byPlanet[planetOf(n.zoneId)] ||= []).push(n);

  const out = [header(
    'NPCs — prompts de personaje',
    `Los ${DATA.npcs.length} NPCs con diálogo del juego, agrupados por planeta. Solo necesitan la pose ` +
    'base: aparecen en conversación, no en combate. Datos: `src/game/data/npcs/*`.',
    ['> ⚠️ El diálogo resuelve el retrato **por nombre de hablante** (`getSpeakerImage` en',
      '> `src/game/utils/character-images.ts`), no por id — al registrar un NPC nuevo añade también',
      '> su heurística de nombre allí.', ''],
  )];

  for (const [pid, list] of Object.entries(byPlanet)) {
    out.push(`## ${PLANETS[pid]?.name || pid}\n`);
    if (PLANETS[pid]?.palette) out.push(`*Paleta del planeta: ${PLANETS[pid].palette}*\n`);
    for (const n of list.sort((a, b) => a.id.localeCompare(b.id))) {
      out.push(characterCard(n, art[n.id], { kind: 'NPC', group: PLANETS[pid]?.name || pid }));
    }
  }
  return out.join('\n');
}

// ── 4. Enemigos ──────────────────────────────────────────────────────────────

function buildEnemies() {
  const art = seed('enemies');
  const byPlanet = {};
  for (const e of DATA.enemies) {
    const pid = art[e.id]?.planet || 'galaxy';
    (byPlanet[pid] ||= []).push(e);
  }
  const order = ['korriban', 'dromund_kaas', 'ziost', 'nar_shaddaa', 'onderon', 'dxun', 'dantooine', 'telos', 'malachor_v', 'galaxy'];

  const bosses = DATA.enemies.filter((e) => e.category === 'boss').length;
  const out = [header(
    'Enemigos y jefes — prompts de combate',
    `Los ${DATA.enemies.length} enemigos del bestiario (${bosses} jefes), agrupados por planeta y ordenados por nivel. ` +
    'Los **jefes** llevan las cuatro poses de combate; los esbirros, solo la base. ' +
    'Datos: `src/game/engine/combat/enemies.ts` y `planet-enemies.ts`.',
  )];

  for (const pid of order) {
    const list = byPlanet[pid];
    if (!list) continue;
    out.push(`## ${PLANETS[pid]?.name || pid}\n`);
    if (PLANETS[pid]?.palette) out.push(`*Paleta del planeta: ${PLANETS[pid].palette}*\n`);
    for (const e of list.sort((a, b) => Number(a.level) - Number(b.level))) {
      out.push(characterCard(e, art[e.id], { states: e.category === 'boss', kind: 'Enemigo', group: PLANETS[pid]?.name || pid }));
    }
  }
  return out.join('\n');
}

// ── 5. Música ────────────────────────────────────────────────────────────────

function buildMusic() {
  const art = seed('music');
  const declared = musicIds();
  const zonesByTrack = {};
  for (const z of DATA.zones) if (z.musicTrackId) (zonesByTrack[z.musicTrackId] ||= []).push(z.name);

  const out = [
    '# Música — prompts de Suno.ai', '',
    'Toda la banda sonora, una ficha por pista. **Nada de arte aquí**: los prompts de personaje ' +
    'viven en sus propios ficheros (ver [`README.md`](README.md)).', '',
    '> **Cómo usarlo:** pega el bloque **Style** en la casilla de estilo de Suno, activa ' +
    '**Instrumental** salvo que la ficha diga lo contrario, genera 2–3 min y recorta una sección ' +
    'que cierre sobre sí misma. Exporta a OGG en `public/audio/music/{id}.ogg`.', '',
    '> **Alta de una pista nueva:** amplía el union `MusicTrackId` en ' +
    '[`src/game/audio/types.ts`](../../src/game/audio/types.ts) y asigna `musicTrackId` a la zona ' +
    'en [`src/game/data/zones/all-zones.ts`](../../src/game/data/zones/all-zones.ts).', '',
    '---', '',
  ];

  const groups = { core: 'Tema principal y combate', ambient: 'Ambientes de planeta', sting: 'Stingers y diegético' };
  for (const [g, label] of Object.entries(groups)) {
    const entries = Object.entries(art).filter(([, a]) => a.group === g);
    if (!entries.length) continue;
    out.push(`## ${label}\n`);
    for (const [id, a] of entries) {
      const wired = declared.includes(id);
      const file = exists(`public/audio/music/${id}.ogg`);
      out.push(`### \`${id}\` — ${a.title}`);
      out.push([
        `**Archivo:** \`public/audio/music/${id}.ogg\``,
        `**Audio:** ${file ? '✅ en disco' : '⬜ por producir'}`,
        `**Cableado:** ${wired ? '✅ en `MusicTrackId`' : '⬜ falta declarar el id'}`,
        zonesByTrack[id] ? `**Suena en:** ${zonesByTrack[id].length} zona(s)` : null,
      ].filter(Boolean).join(' · '));
      job({
        type: 'music', kind: 'Música', id, state: null, outId: id,
        label: a.title, group: label, level: null,
        file: `public/audio/music/${id}.ogg`, done: file,
        prompt: a.style, negative: a.exclude || STYLE.music.exclude,
        settings: [`Instrumental: ${a.instrumental === false ? 'OFF' : 'ON'}`, `Duración: ${a.length || '2–3 min'}`,
          a.bpm ? `Tempo: ${a.bpm}` : null, a.key ? `Tonalidad: ${a.key}` : null].filter(Boolean).join(' · '),
        bg: null, notes: `${a.loop} · Título sugerido: ${a.songTitle}`, description: a.brief,
      });
      out.push(`> ${a.brief}`);
      out.push('');
      out.push('**Suno — Style**');
      out.push(fence(a.style));
      out.push([
        `**Título sugerido:** ${a.songTitle}`,
        `**Instrumental:** ${a.instrumental === false ? 'OFF (voz/coro indicado)' : 'ON'}`,
        `**Duración:** ${a.length || '2–3 min'}`,
        a.bpm ? `**Tempo:** ${a.bpm}` : null,
        a.key ? `**Tonalidad:** ${a.key}` : null,
      ].filter(Boolean).join(' · '));
      out.push(`**Exclude styles:** \`${a.exclude || STYLE.music.exclude}\``);
      out.push(`**Loop:** ${a.loop}`);
      if (zonesByTrack[id]) out.push(`**Zonas:** ${zonesByTrack[id].join(' · ')}`);
      out.push('');
    }
  }

  // Diagnóstico: zonas cuya música pertenece a otro planeta, o que no tienen pista asignada.
  const prestadas = DATA.zones.filter((z) => z.sceneId && z.musicTrackId &&
    art[z.musicTrackId]?.group === 'ambient' && planetOf(z.id) !== 'galaxy' &&
    !z.musicTrackId.startsWith(PLANETS[planetOf(z.id)]?.prefix || planetOf(z.id)));
  const huerfanas = DATA.zones.filter((z) => z.sceneId && !z.musicTrackId);
  if (prestadas.length || huerfanas.length) {
    out.push('---\n\n## Diagnóstico de cableado\n');
    out.push('*Generado a partir de `musicTrackId` en las zonas — no es una lista de tareas de audio,');
    out.push('sino de qué zonas suenan hoy a un planeta que no es el suyo.*\n');
    if (prestadas.length) {
      out.push('**Zonas con música prestada de otro planeta**\n');
      for (const z of prestadas) out.push(`- \`${z.id}\` (${z.name}) → \`${z.musicTrackId}\``);
      out.push('');
    }
    if (huerfanas.length) {
      out.push(`**Zonas sin \`musicTrackId\` propio** (${huerfanas.length}) — heredan la pista que ya sonaba\n`);
      out.push(huerfanas.map((z) => `\`${z.id}\``).join(' · '));
      out.push('');
    }
  }

  const orphans = declared.filter((id) => !art[id]);
  if (orphans.length) {
    out.push('---\n\n## ⚠️ Declaradas en el código sin ficha aquí\n');
    out.push(orphans.map((o) => `- \`${o}\` — añade su entrada en \`_seeds/music.json\``).join('\n'));
    missing.push(...orphans.map((o) => `Música ${o}`));
  }
  return out.join('\n');
}

// ── 6. Mundos y niveles ──────────────────────────────────────────────────────

function buildWorlds() {
  const art = seed('worlds');
  const zones = DATA.zones.filter((z) => z.sceneId);
  const byPlanet = {};
  for (const z of zones) (byPlanet[z.planetId] ||= []).push(z);

  const out = [
    '# Mundos y niveles — prompts de escenario', '',
    `Los ${Object.keys(byPlanet).length} mundos del juego y sus ${new Set(zones.map((z) => z.sceneId)).size} escenarios únicos. ` +
    'Cada planeta abre con su **ficha de mundo** (lo que define su identidad visual y sonora) y ' +
    'sigue con un prompt de fondo por `sceneId`.', '',
    '> **Hoy los escenarios son procedurales**: cada zona se dibuja con un generador `DynamicScene` ' +
    'a partir de su `sceneId`, sin imagen de fondo. Estos prompts son para cuando quieras **sustituir ' +
    'o reforzar** una escena con un fondo pintado → `public/images/backgrounds/{sceneId}.png`.', '',
    '<details><summary><b>Negative prompt (común)</b></summary>', '', fence(STYLE.negative), '</details>', '',
    '---', '',
  ];

  for (const pid of Object.keys(PLANETS)) {
    const list = byPlanet[pid];
    if (!list) continue;
    const p = PLANETS[pid];
    const w = art[pid];
    out.push(`## ${p.name}\n`);
    out.push([
      p.levels ? `**Niveles:** ${p.levels}` : null,
      `**Zonas:** ${list.length}`,
      `**Música:** \`${[...new Set(list.map((z) => z.musicTrackId).filter(Boolean))].join('`, `') || '— sin asignar'}\``,
    ].filter(Boolean).join(' · '));
    out.push('');
    if (w) {
      out.push('**Ficha de mundo**\n');
      out.push(`- **Fantasía:** ${w.fantasy}`);
      out.push(`- **Paleta:** ${p.palette}`);
      out.push(`- **Luz y clima:** ${w.light}`);
      out.push(`- **Arquitectura y materiales:** ${w.architecture}`);
      out.push(`- **Motivo recurrente:** ${w.motif}`);
      out.push('');
    } else {
      missing.push(`Mundo ${pid}`);
      out.push(`⚠️ **SIN FICHA DE MUNDO** — añade \`"${pid}"\` en \`_seeds/worlds.json\`.\n`);
    }

    const seenScene = new Set();
    for (const z of list) {
      if (seenScene.has(z.sceneId)) continue;
      seenScene.add(z.sceneId);
      const scene = w?.scenes?.[z.sceneId];
      out.push(`### \`${z.sceneId}\` — ${z.name}`);
      out.push(`**Zonas que lo usan:** ${list.filter((x) => x.sceneId === z.sceneId).map((x) => x.name).join(' · ')}`);
      if (z.description) out.push(`> ${z.description}`);
      out.push('');
      if (!scene) {
        missing.push(`Escena ${z.sceneId}`);
        out.push(`⚠️ **SIN PROMPT DE ESCENA** — añade \`"${z.sceneId}"\` bajo \`scenes\` de \`${pid}\` en \`_seeds/worlds.json\`.\n`);
        continue;
      }
      job({
        type: 'scene', kind: 'Escenario', id: z.sceneId, state: null, outId: z.sceneId,
        label: z.name, group: p.name, level: null,
        file: `public/images/backgrounds/${z.sceneId}.png`,
        done: exists(`public/images/backgrounds/${z.sceneId}.png`),
        prompt: scene + STYLE.scene.suffix, negative: STYLE.negative,
        settings: STYLE.scene.settings, bg: null,
        notes: `Opcional — hoy la escena es procedural. Motivo del mundo: ${w.motif}`,
        description: z.description || null,
      });
      out.push(fence(scene + STYLE.scene.suffix));
      out.push(`**Ajustes:** ${STYLE.scene.settings}`);
      out.push('');
    }
  }
  return out.join('\n');
}

// ── README índice ────────────────────────────────────────────────────────────

function buildReadme() {
  const counts = {
    'player-classes.md': `${Object.keys(seed('player-classes')).length} clases jugables`,
    'companions.md': `${DATA.companions.length} compañeros`,
    'npcs.md': `${DATA.npcs.length} NPCs`,
    'enemies.md': `${DATA.enemies.length} enemigos (${DATA.enemies.filter((e) => e.category === 'boss').length} jefes)`,
    'music.md': `${Object.keys(seed('music')).length} pistas`,
    'worlds.md': `${new Set(DATA.zones.filter((z) => z.sceneId).map((z) => z.sceneId)).size} escenarios en ` +
      `${new Set(DATA.zones.filter((z) => z.sceneId).map((z) => z.planetId)).size} mundos`,
  };
  return [
    '# Prompts de contenido — catálogo para IA externas', '',
    'Un fichero **por entidad**, con el prompt **completo y listo para pegar**. Nada se mezcla: los',
    'personajes no comparten fichero con la música, ni los NPCs con los enemigos.', '',
    '| Fichero | Contiene | Destino |',
    '|---|---|---|',
    `| [\`player-classes.md\`](player-classes.md) | ${counts['player-classes.md']} · 4 poses c/u | Leonardo.ai |`,
    `| [\`companions.md\`](companions.md) | ${counts['companions.md']} · 4 poses c/u | Leonardo.ai |`,
    `| [\`npcs.md\`](npcs.md) | ${counts['npcs.md']} · pose base | Leonardo.ai |`,
    `| [\`enemies.md\`](enemies.md) | ${counts['enemies.md']} · jefes con 4 poses | Leonardo.ai |`,
    `| [\`music.md\`](music.md) | ${counts['music.md']} | Suno.ai |`,
    `| [\`worlds.md\`](worlds.md) | ${counts['worlds.md']} | Leonardo.ai |`,
    '',
    '## El estudio — pegar y descargar, nada más', '',
    '```bash',
    'npm run studio     # http://localhost:4300',
    '```', '',
    'Lista estos mismos prompts con su estado real. Pulsa **Copiar y armar**, pega en',
    'Leonardo/Suno y descarga: el estudio detecta la descarga, la renombra al `id`, le quita el',
    'fondo, la registra en `character-images.ts` y refresca este catálogo. Si el recorte sale mal,',
    'reconvierte con otra tolerancia sin volver a generar la imagen.', '',
    'Vigila `%USERPROFILE%\\Downloads` (o `SWROTT_DOWNLOADS`). Lo que **no** hace: la heurística',
    'por nombre en `getSpeakerImage` para NPCs con diálogo — eso sigue siendo manual.', '',
    '## Cómo se mantiene', '',
    'Estos `.md` **se generan**; no los edites a mano. La parte creativa de cada prompt vive en',
    '[`_seeds/`](_seeds/) (un JSON por entidad) y el resto —ids, nombres, niveles, zonas,',
    'descripciones, qué existe ya en disco— se lee del código en cada build.', '',
    '```bash',
    'node scripts/build-content-prompts.mjs          # reconstruye los seis ficheros',
    'node scripts/build-content-prompts.mjs --check  # falla si hay contenido sin dirección de arte',
    '```', '',
    'Cuando crees **un personaje, un nivel, un mundo o un combate** nuevos, la skill',
    '[`/content-prompts`](../../.claude/skills/content-prompts/SKILL.md) escribe su semilla y',
    'vuelve a construir, de modo que su prompt aparece aquí solo. Lo que esté en el código sin',
    'semilla sale marcado como ⚠️ **SIN DIRECCIÓN DE ARTE** en lugar de desaparecer sin más.', '',
    '## Estilo', '',
    `Todo el juego es **pixel art**, Sith de la era KOTOR. Los sufijos de estilo, el negative común,`,
    'la paleta por planeta y los ajustes de motor están en [`_seeds/style.json`](_seeds/style.json)',
    'y se inyectan en cada prompt al construir — cambia allí y se propaga a los seis ficheros.', '',
    '## Relación con `docs/assets/`', '',
    '[`docs/assets/`](../assets/) es el **tablero de estado** (qué existe, qué falta, el pipeline de',
    'conversión y la guía de estilo original). `docs/prompts/` es la **biblioteca de prompts**: el',
    'texto completo que se lanza a la IA. Uno dice *qué falta*; el otro, *qué escribir*.', '',
  ].join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

const outputs = {
  'README.md': buildReadme,
  'player-classes.md': buildClasses,
  'companions.md': buildCompanions,
  'npcs.md': buildNpcs,
  'enemies.md': buildEnemies,
  'music.md': buildMusic,
  'worlds.md': buildWorlds,
};

fs.mkdirSync(OUT, { recursive: true });
for (const [file, fn] of Object.entries(outputs)) {
  const body = fn();
  if (!CHECK_ONLY) fs.writeFileSync(path.join(OUT, file), body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
  console.log(`${CHECK_ONLY ? 'check' : 'escrito'}  docs/prompts/${file}`);
}

if (!CHECK_ONLY) {
  fs.writeFileSync(path.join(OUT, '_index.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    counts: { total: JOBS.length, pendientes: JOBS.filter((j) => !j.done).length },
    jobs: JOBS,
  }, null, 1));
  console.log(`escrito  docs/prompts/_index.json  (${JOBS.length} prompts, ${JOBS.filter((j) => !j.done).length} pendientes)`);
}

if (missing.length) {
  console.log(`\n⚠️  ${missing.length} sin dirección de arte:`);
  for (const m of missing) console.log('   · ' + m);
  if (CHECK_ONLY) process.exit(1);
} else {
  console.log('\n✅ Todo el contenido del código tiene prompt.');
}
