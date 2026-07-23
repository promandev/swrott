#!/usr/bin/env node
/**
 * gen-prompts.js — genera prompts listos para Leonardo.ai / Suno desde docs/assets/
 *
 * Uso:
 *   node scripts/gen-prompts.js [category] [options]
 *
 * Categorías (default: characters):
 *   characters | icons | items | music | backgrounds
 *
 * Opciones:
 *   --all             incluye entradas ya generadas (✅) — por defecto solo ⬜ pendientes
 *   --id=<id>         filtra por id exacto o prefijo  (ej: --id=marauder, --id=npc_)
 *   --state=<state>   solo ese estado: idle|attack|hurt|down  (characters)
 *   --planet=<name>   solo esa sección de planeta  (characters, coincidencia parcial)
 *
 * Ejemplos:
 *   node scripts/gen-prompts.js
 *   node scripts/gen-prompts.js characters --all --id=marauder
 *   node scripts/gen-prompts.js characters --state=attack
 *   node scripts/gen-prompts.js icons --all
 *   node scripts/gen-prompts.js items
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── Style suffixes (hardcoded de README.md para no parsear) ──────────────────

const SUFFIX_A_MAGENTA =
  ', full-body pixel-art game sprite, front view, full figure centered with small headroom and ' +
  'floor room, neutral combat-ready stance, crisp clean 1px dark outline, limited cohesive ' +
  'palette (24–32 colours), flat cel shading with a single top-left light, minimal dithering only ' +
  'on large surfaces, sharp readable pixel clusters, no blur, KOTOR-era Star Wars Sith dark ' +
  'fantasy, solid flat #FF00FF magenta background';

const SUFFIX_A_GREEN =
  ', full-body pixel-art game sprite, front view, full figure centered with small headroom and ' +
  'floor room, neutral combat-ready stance, crisp clean 1px dark outline, limited cohesive ' +
  'palette (24–32 colours), flat cel shading with a single top-left light, minimal dithering only ' +
  'on large surfaces, sharp readable pixel clusters, no blur, KOTOR-era Star Wars Sith dark ' +
  'fantasy, solid flat #00FF66 green background';

// Usa fondo verde si el subject contiene rojos/carmesíes (el modelo confunde magenta con rojo)
const RED_WORDS = /\b(crimson|scarlet|ruby|red|blood.?red|maroon|burgundy|rust|auburn)\b/i;
function suffixA(subject) {
  return RED_WORDS.test(subject) ? SUFFIX_A_GREEN : SUFFIX_A_MAGENTA;
}

const SUFFIX_C =
  ', pixel-art game ability icon, single centered emblem motif, bold silhouette readable at 64px, ' +
  'chunky 1px outline, limited palette keyed to the element colour, flat cel shading, slight inner ' +
  'glow, no text, no border, KOTOR-era Sith glyph aesthetic, solid flat #00FF66 green background';

const SUFFIX_D = (rarity) =>
  `, pixel-art inventory item icon, single object centered at 3/4 top-down angle, bold silhouette, ` +
  `chunky 1px outline, limited palette, flat cel shading with rim light, rarity glow halo ` +
  `(${rarity || 'none/grey'}), no text, no border, KOTOR-era Sith dark fantasy, solid flat #00FF66 green background`;

const SUFFIX_E =
  ', pixel-art environment backdrop, wide establishing shot, no characters, painterly pixel scene ' +
  'with parallax-friendly layers, atmospheric depth, KOTOR-era Star Wars Sith dark fantasy mood lighting';

const NEGATIVE =
  'NEGATIVE: photo, photorealistic, 3d render, octane, blurry, soft focus, anti-aliased edges, ' +
  'jpeg artifacts, smooth gradients, watermark, signature, text, caption, UI, frame, border, ' +
  'drop shadow, cast shadow on ground, busy background, multiple characters, cropped, out of frame, ' +
  'extra limbs, extra fingers, deformed hands, lens flare, bokeh';

// ── Argument parsing ─────────────────────────────────────────────────────────

const args       = process.argv.slice(2);
const CATEGORIES = ['characters', 'icons', 'items', 'music', 'backgrounds'];
const category   = args.find(a => CATEGORIES.includes(a)) || 'characters';
const showAll    = args.includes('--all');
const idFilter   = (args.find(a => a.startsWith('--id='))     || '').slice(5);
const stateFilter= (args.find(a => a.startsWith('--state='))  || '').slice(8);
const planetFilter=(args.find(a => a.startsWith('--planet=')) || '').slice(9).toLowerCase();

// ── Helpers ──────────────────────────────────────────────────────────────────

function readCatalog(name) {
  const p = path.join(ROOT, 'docs', 'assets', `${name}.md`);
  if (!fs.existsSync(p)) { console.error(`Not found: ${p}`); process.exit(1); }
  return fs.readFileSync(p, 'utf8');
}

function statusOf(str) {
  if (str.includes('✅')) return '✅';
  if (str.includes('♻️')) return '♻️';
  return '⬜';
}

// ── Characters parser ────────────────────────────────────────────────────────
// Handles three formats:
//   1. NPC/enemy/companion bullet:  - **Name** — `id` FLAGS — `subject`
//   2. Player-class header:         ### Name (class) — `id` FLAGS
//      followed by:                 Subject: `subject`
//      state lines:                 - **state** `id_state` — `pose delta`
//   3. Companion table rows (skipped — details come from the bullet entries below)

function parseCharacters(md) {
  const entries  = [];
  const lines    = md.split('\n');

  let currentPlanet    = '';
  let currentClass     = null;   // { id, name, subject, statusLine }
  let inClassStates    = false;

  // NPC bullet: - **Name** — `id` [flags] — `subject`
  const reNpc = /^[-*]\s+\*\*([^*]+)\*\*\s+—\s+`([^`]+)`\s*(.*?)\s+—\s+`([^`]+)`/;
  // Class header: ### Name — `id` FLAGS  (excludes "NPCs" / "Enemies" section headings)
  const reClassHdr = /^###\s+(.+?)\s+—\s+`([^`]+)`\s*(.*)/;
  // Class Subject line
  const reSubject = /^Subject:\s*`?([^`]+)`?/;
  // Class state sub-bullet: - **state** `id_state` — `pose delta`
  const reState = /^[-*]\s+\*\*(\w+)\*\*\s+`([^`]+)`\s+—\s+`([^`]+)`/;
  // Planet/section heading: ## KORRIBAN  or  ## Companions  etc.
  const rePlanet = /^##\s+(.+)/;

  for (const line of lines) {
    // Track planet/section
    const planetMatch = line.match(rePlanet);
    if (planetMatch) {
      currentPlanet = planetMatch[1].trim();
      currentClass  = null;
      inClassStates = false;
      continue;
    }

    // Class header (### but NOT "NPCs" / "Enemies" headings)
    const clsMatch = line.match(reClassHdr);
    if (clsMatch && !line.includes('NPCs') && !line.includes('Enemies')) {
      currentClass   = { id: clsMatch[2], name: clsMatch[1], statusLine: clsMatch[3], subject: null };
      inClassStates  = false;
      continue;
    }

    // Subject line (immediately after a class header)
    if (currentClass && !currentClass.subject) {
      const subMatch = line.match(reSubject);
      if (subMatch) {
        currentClass.subject = subMatch[1].trim();
        const idleStatus = currentClass.statusLine.includes('✅') ? '✅' : '⬜';
        entries.push({
          id: currentClass.id, name: currentClass.name, planet: currentPlanet,
          subject: currentClass.subject, state: 'idle', status: idleStatus
        });
        inClassStates = true;
        continue;
      }
    }

    // Class state sub-bullet
    if (inClassStates && currentClass) {
      const stMatch = line.match(reState);
      if (stMatch) {
        const [, stateName, stateId, poseDelta] = stMatch;
        // Check if this state has ✅ in the header flags
        const flagSection = currentClass.statusLine.toLowerCase();
        const hasFlag = flagSection.includes(`✅ ${stateName}`) || flagSection.includes(`✅${stateName}`);
        entries.push({
          id: stateId, name: `${currentClass.name} — ${stateName}`, planet: currentPlanet,
          subject: `${currentClass.subject}, ${poseDelta}`, state: stateName,
          status: hasFlag ? '✅' : '⬜'
        });
        continue;
      }
      // If we hit a non-indented line that's not empty, we're out of the state block
      if (line.trim() && !line.startsWith(' ') && !line.startsWith('\t') && !line.startsWith('-')) {
        inClassStates = false;
      }
    }

    // NPC / enemy / companion bullet
    const npcMatch = line.match(reNpc);
    if (npcMatch) {
      currentClass  = null;
      inClassStates = false;
      const [, name, id, flags, subject] = npcMatch;
      entries.push({
        id, name, planet: currentPlanet, subject, state: 'idle', status: statusOf(flags)
      });
    }
  }

  return entries;
}

// ── Icons parser ──────────────────────────────────────────────────────────────
// Table rows: | Skill Name | `slug` | element | Motif |
//        or:  | Emblem | `tree` | STATUS | Motif |

function parseIcons(md) {
  const entries = [];
  const lines   = md.split('\n');
  let section   = '';

  for (const line of lines) {
    if (line.startsWith('#')) { section = line; continue; }
    if (!line.startsWith('|') || line.startsWith('|---')) continue;

    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 3) continue;

    const idMatch = line.match(/`([^`]+)`/);
    if (!idMatch) continue;
    const id = idMatch[1];

    const statusStr = cols.find(c => c.includes('✅') || c.includes('⬜') || c.includes('♻️')) || '';
    const status    = statusOf(statusStr);

    // Last non-status, non-id cell = motif
    const motif = cols
      .filter(c => !c.includes('`') && !c.match(/^[✅⬜♻️👑⭐]/) && c.length > 5)
      .pop() || cols[cols.length - 1];

    const name = cols[0].replace(/[*_`]/g, '');
    const isTalent = section.toLowerCase().includes('talent') || section.toLowerCase().includes('emblem');

    entries.push({ id, name, subject: motif, status, isTalent, section });
  }

  return entries;
}

// ── Items parser ──────────────────────────────────────────────────────────────
// Table rows: | Name | `id` | slot | rarity | Motif |

function parseItems(md) {
  const entries = [];
  const lines   = md.split('\n');
  let section   = '';

  for (const line of lines) {
    if (line.startsWith('#')) { section = line; continue; }
    if (!line.startsWith('|') || line.startsWith('|---')) continue;

    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 3) continue;

    const idMatch = line.match(/`([^`]+)`/);
    if (!idMatch) continue;
    const id = idMatch[1];

    const statusStr = cols.find(c => c.match(/[✅⬜♻️]/)) || '';
    const status    = statusOf(statusStr);

    const rarityMatch = line.match(/\b(common|uncommon|rare|epic|legendary|mythic)\b/i);
    const rarity = rarityMatch ? rarityMatch[1].toLowerCase() : 'common';

    const motif = cols
      .filter(c => !c.includes('`') && !c.match(/^[✅⬜♻️]/) && !c.match(/^(common|uncommon|rare|epic|legendary|mythic)$/i) && c.length > 4)
      .pop() || '';

    const name = cols[0].replace(/[*_`]/g, '');
    entries.push({ id, name, subject: motif, status, rarity, section });
  }

  return entries;
}

// ── Backgrounds parser ────────────────────────────────────────────────────────
// Table rows: | `sceneId` | Scene line |

function parseBackgrounds(md) {
  const entries = [];
  const lines   = md.split('\n');
  let planet    = '';

  for (const line of lines) {
    if (line.match(/^##\s/)) { planet = line.replace(/^##\s+/, '').trim(); continue; }
    if (!line.startsWith('|') || line.startsWith('|---')) continue;

    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 2) continue;

    const idMatch = cols[0].match(/`([^`]+)`/);
    if (!idMatch) continue;
    const id      = idMatch[1];
    const subject = cols[1];

    // Backgrounds don't have a status glyph — check if file exists
    const diskPath = path.join(ROOT, 'public', 'images', 'backgrounds', `${id}.png`);
    const status   = fs.existsSync(diskPath) ? '✅' : '⬜';

    entries.push({ id, subject, status, planet });
  }

  return entries;
}

// ── Output helpers ────────────────────────────────────────────────────────────

function header(category, count) {
  const SETTINGS = {
    characters: 'Model=Leonardo Phoenix 1.0 | Canvas=1024×1024 | AR=1:1 | Guidance=7 | Prompt Magic=OFF | Background=#FF00FF magenta',
    icons:      'Model=Leonardo Phoenix 1.0 | Canvas=512×512  | AR=1:1 | Guidance=7 | Prompt Magic=OFF | Background=#00FF66 green',
    items:      'Model=Leonardo Phoenix 1.0 | Canvas=512×512  | AR=1:1 | Guidance=7 | Prompt Magic=OFF | Background=#00FF66 green',
    backgrounds:'Model=Leonardo Phoenix 1.0 | Canvas=1536×1024 | AR=3:2 | Guidance=7',
    music:      'Suno.ai — copy prompt as-is',
  };
  console.log(`\n${'═'.repeat(80)}`);
  console.log(` LEONARDO PROMPTS — ${category.toUpperCase()} — ${count} entries`);
  console.log(` ${SETTINGS[category] || ''}`);
  console.log(`${'═'.repeat(80)}\n`);
  console.log(NEGATIVE);
  console.log(`\n${'─'.repeat(80)}\n`);
}

function printEntry(n, { id, name, subject, state, status, rarity, isTalent }, suffix) {
  const stateLabel = state && state !== 'idle' ? ` [${state}]` : '';
  console.log(`${String(n).padStart(3, ' ')}. [${status}] ${id}${stateLabel} — ${name}`);
  console.log(`     PROMPT: ${subject}${suffix}`);
  console.log('');
}

// ── Main ──────────────────────────────────────────────────────────────────────

function run() {
  switch (category) {

    case 'characters': {
      const md      = readCatalog('characters');
      let entries   = parseCharacters(md);

      if (!showAll)     entries = entries.filter(e => e.status === '⬜');
      if (idFilter)     entries = entries.filter(e => e.id === idFilter || e.id.startsWith(idFilter));
      if (stateFilter)  entries = entries.filter(e => e.state === stateFilter);
      if (planetFilter) entries = entries.filter(e => e.planet.toLowerCase().includes(planetFilter));

      if (!entries.length) {
        console.log('Sin entradas pendientes. Usa --all para incluir las ya generadas.');
        return;
      }

      header('characters', entries.length);

      let n = 1;
      let lastPlanet = '';
      for (const e of entries) {
        if (e.planet !== lastPlanet) {
          console.log(`── ${e.planet} ${'─'.repeat(Math.max(0, 74 - e.planet.length))}`);
          lastPlanet = e.planet;
        }
        printEntry(n++, e, suffixA(e.subject));
      }
      break;
    }

    case 'icons': {
      const md    = readCatalog('icons-talents');
      let entries = parseIcons(md);

      if (!showAll)  entries = entries.filter(e => e.status === '⬜');
      if (idFilter)  entries = entries.filter(e => e.id.startsWith(idFilter));

      if (!entries.length) {
        console.log('Sin entradas pendientes. Usa --all para ver todas.');
        return;
      }

      header('icons', entries.length);
      let n = 1;
      for (const e of entries) {
        printEntry(n++, e, SUFFIX_C);
      }
      break;
    }

    case 'items': {
      const md    = readCatalog('items');
      let entries = parseItems(md);

      if (!showAll)  entries = entries.filter(e => e.status === '⬜');
      if (idFilter)  entries = entries.filter(e => e.id.startsWith(idFilter));

      if (!entries.length) {
        console.log('Sin entradas pendientes. Usa --all para ver todas.');
        return;
      }

      header('items', entries.length);
      let n = 1;
      for (const e of entries) {
        printEntry(n++, e, SUFFIX_D(e.rarity));
      }
      break;
    }

    case 'backgrounds': {
      const md    = readCatalog('backgrounds');
      let entries = parseBackgrounds(md);

      if (!showAll)     entries = entries.filter(e => e.status === '⬜');
      if (idFilter)     entries = entries.filter(e => e.id.startsWith(idFilter));
      if (planetFilter) entries = entries.filter(e => e.planet.toLowerCase().includes(planetFilter));

      if (!entries.length) {
        console.log('Sin fondos pendientes. Usa --all para ver todos.');
        return;
      }

      header('backgrounds', entries.length);
      let n = 1;
      let lastPlanet = '';
      for (const e of entries) {
        if (e.planet !== lastPlanet) {
          console.log(`── ${e.planet} ${'─'.repeat(Math.max(0, 74 - e.planet.length))}`);
          lastPlanet = e.planet;
        }
        printEntry(n++, e, SUFFIX_E);
      }
      break;
    }

    case 'music': {
      const md    = readCatalog('music');
      console.log('\n═══ SUNO PROMPTS — MUSIC ═══\n');
      // Print the music catalog as-is (Suno prompts are already complete in the .md)
      console.log(md);
      break;
    }

    default:
      console.error(`Categoría desconocida: ${category}`);
      console.error('Válidas: characters | icons | items | music | backgrounds');
      process.exit(1);
  }
}

run();
