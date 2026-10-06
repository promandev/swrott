#!/usr/bin/env node
/**
 * prompt-studio.mjs — lanzadera local de prompts + ingesta automática de descargas.
 *
 *   npm run studio     →  http://localhost:4300
 *
 * QUÉ HACE
 * ────────
 * 1. Lista los 279 prompts de `docs/prompts/_index.json` (filtrables, con estado real).
 * 2. Al pulsar "Copiar", copia el prompt al portapapeles y **arma** esa entidad.
 * 3. Vigila tu carpeta de Descargas. La siguiente imagen que aparezca se asigna a la
 *    entidad armada: la renombra al `id`, la convierte con convert-characters.ps1
 *    (fondo → transparente), la registra en `character-images.ts` y refresca el catálogo.
 *
 * Es decir: tú pegas en Leonardo y descargas. El resto lo hace esto.
 *
 * Carpeta de descargas: %USERPROFILE%\Downloads, o la variable SWROTT_DOWNLOADS.
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.SWROTT_STUDIO_PORT || 4300);
const DOWNLOADS = process.env.SWROTT_DOWNLOADS ||
  path.join(process.env.USERPROFILE || process.env.HOME || '.', 'Downloads');

const INDEX = path.join(ROOT, 'docs/prompts/_index.json');
const SPRITE_SRC = path.join(ROOT, 'public/images/characters/full_body_sprite');
const QA_DIR = path.join(ROOT, 'public/images/characters/_qa');
const REGISTRY_TS = path.join(ROOT, 'src/game/utils/character-images.ts');

const IMG = /\.(png|jpe?g|webp)$/i;
const AUDIO = /\.(ogg|mp3|wav|m4a|flac)$/i;

// ── Estado en memoria ────────────────────────────────────────────────────────

let jobs = [];
let armed = null;                 // outId armado
const log = [];                   // eventos recientes, el más nuevo primero
const seen = new Set();           // ficheros de Descargas ya vistos

const say = (level, msg, extra = {}) => {
  const e = { at: new Date().toISOString(), level, msg, ...extra };
  log.unshift(e);
  log.length = Math.min(log.length, 60);
  console.log(`[${level}] ${msg}`);
  return e;
};

function loadIndex() {
  if (!fs.existsSync(INDEX)) {
    console.error('Falta docs/prompts/_index.json — ejecuta primero:  npm run prompts');
    process.exit(1);
  }
  jobs = JSON.parse(fs.readFileSync(INDEX, 'utf8')).jobs;
}

const jobOf = (outId) => jobs.find((j) => j.outId === outId);

// ── Registro en character-images.ts ──────────────────────────────────────────

/** Inserta `id: "/images/characters/{id}.svg",` en CHARACTER_REGISTRY si no está. */
function registerCharacter(id) {
  const src = fs.readFileSync(REGISTRY_TS, 'utf8');
  if (new RegExp(`^\\s*${id}\\s*:`, 'm').test(src)) return { ok: true, already: true };

  const start = src.indexOf('const CHARACTER_REGISTRY');
  const open = src.indexOf('{', start);
  let depth = 0, close = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) { close = i; break; } }
  }
  if (close < 0) return { ok: false, error: 'no se encontró el cierre de CHARACTER_REGISTRY' };

  const MARK = '  // ── Añadidos por prompt-studio ───────────────────────────────────────\n';
  const line = `  ${id}: "/images/characters/${id}.svg",\n`;
  const before = src.slice(0, close);
  const next = src.includes(MARK)
    ? before.replace(MARK, MARK + line) + src.slice(close)
    : before.replace(/\s*$/, '\n\n') + MARK + line + src.slice(close);

  fs.writeFileSync(REGISTRY_TS, next);
  return { ok: true };
}

// ── Conversión ───────────────────────────────────────────────────────────────

const run = (file, args) => new Promise((res) => {
  execFile(file, args, { cwd: ROOT, windowsHide: true, maxBuffer: 1 << 24 },
    (err, stdout, stderr) => res({ ok: !err, out: (stdout || '') + (stderr || ''), err }));
});

/** Según el shell desde el que arranques, `powershell` puede no estar en el PATH. */
const POWERSHELL = (() => {
  const sys = process.env.SystemRoot || 'C:\\Windows';
  for (const c of [
    path.join(sys, 'System32/WindowsPowerShell/v1.0/powershell.exe'),
    path.join(sys, 'SysWOW64/WindowsPowerShell/v1.0/powershell.exe'),
  ]) if (fs.existsSync(c)) return c;
  return 'powershell';
})();

const psConvert = (srcFile, id, tolerance) => run(POWERSHELL, [
  '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(ROOT, 'scripts/convert-characters.ps1'),
  '-File', srcFile, '-Id', id, ...(tolerance ? ['-Tolerance', String(tolerance)] : []),
]);

const rebuild = () => run(process.execPath, [path.join(ROOT, 'scripts/build-content-prompts.mjs')]);

/** Espera a que el fichero deje de crecer (la descarga ha terminado). */
async function settled(file) {
  let last = -1;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    let size;
    try { size = fs.statSync(file).size; } catch { return false; }
    if (size > 0 && size === last) return true;
    last = size;
  }
  return false;
}

// ── Ingesta ──────────────────────────────────────────────────────────────────

async function ingest(file, tolerance = 0, forceId = null) {
  const outId = forceId || armed;
  const job = outId && jobOf(outId);
  if (!job) return say('warn', `Descarga sin destino: ${path.basename(file)} — arma una entidad antes de descargar`);

  const ext = path.extname(file).toLowerCase();

  if (job.type === 'music') {
    if (!AUDIO.test(ext)) return say('warn', `${path.basename(file)} no es audio; ${outId} sigue armado`);
    const dest = path.join(ROOT, 'public/audio/music', outId + ext);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
    armed = null;
    await rebuild(); loadIndex();
    return say(ext === '.ogg' ? 'ok' : 'warn',
      ext === '.ogg' ? `${outId}.ogg colocado en public/audio/music/`
        : `${outId}${ext} copiado — conviértelo a .ogg para que el juego lo cargue`, { outId });
  }

  if (!IMG.test(ext)) return say('warn', `${path.basename(file)} no es una imagen; ${outId} sigue armado`);

  if (job.type === 'scene') {
    const dest = path.join(ROOT, 'public/images/backgrounds', outId + '.png');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
    armed = null;
    await rebuild(); loadIndex();
    return say('ok', `${outId}.png colocado en public/images/backgrounds/`, { outId });
  }

  // Personaje: copiar al source, convertir, registrar.
  fs.mkdirSync(SPRITE_SRC, { recursive: true });
  const srcCopy = path.join(SPRITE_SRC, outId + ext);
  fs.copyFileSync(file, srcCopy);

  const conv = await psConvert(srcCopy, outId, tolerance);
  if (!conv.ok || !fs.existsSync(path.join(ROOT, 'public/images/characters', outId + '.svg'))) {
    return say('error', `Falló la conversión de ${outId}: ${conv.out.trim().split('\n').pop()}`, { outId });
  }

  const reg = registerCharacter(outId);
  armed = null;
  await rebuild(); loadIndex();
  return say('ok',
    `${outId}.svg convertido${reg.already ? '' : ' y registrado'}${tolerance ? ` (tolerancia ${tolerance})` : ''}` +
    ' — revisa la vista QA',
    { outId, qa: fs.existsSync(path.join(QA_DIR, outId + '.png')) ? outId : null });
}

/** Reconvierte un id ya ingerido con otra tolerancia (cuando el recorte sale mal). */
async function retry(outId, tolerance) {
  const hit = fs.readdirSync(SPRITE_SRC).find((f) => path.parse(f).name === outId);
  if (!hit) return say('error', `No queda el original de ${outId} en full_body_sprite/`);
  return ingest(path.join(SPRITE_SRC, hit), tolerance, outId);
}

// ── Vigilancia de Descargas ──────────────────────────────────────────────────

function watchDownloads() {
  if (!fs.existsSync(DOWNLOADS)) {
    say('error', `No existe la carpeta de descargas: ${DOWNLOADS} — define SWROTT_DOWNLOADS`);
    return;
  }
  for (const f of fs.readdirSync(DOWNLOADS)) seen.add(f);   // lo que ya había no cuenta
  say('info', `Vigilando ${DOWNLOADS}`);

  let busy = false;
  fs.watch(DOWNLOADS, async (_e, filename) => {
    if (!filename || busy) return;
    if (!IMG.test(filename) && !AUDIO.test(filename)) return;
    if (seen.has(filename)) return;
    const full = path.join(DOWNLOADS, filename);
    if (!fs.existsSync(full)) return;
    seen.add(filename);
    busy = true;
    try {
      if (await settled(full)) await ingest(full);
    } catch (e) { say('error', `Ingesta de ${filename}: ${e.message}`); }
    busy = false;
  });
}

// ── UI ───────────────────────────────────────────────────────────────────────

const PAGE = /* html */ `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>SWROTT Prompt Studio</title><style>
:root{--bg:#12100f;--card:#1b1817;--line:#322c2a;--fg:#e8e0da;--dim:#9a8d85;--red:#c2402f;--gold:#c9a227;--ok:#4f8a5b}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 ui-sans-serif,system-ui,sans-serif}
header{position:sticky;top:0;z-index:5;background:#12100feb;backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding:12px 16px}
h1{margin:0 0 8px;font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:var(--gold)}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
input,select{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:7px 10px;font:inherit}
input[type=search]{flex:1;min-width:180px}
button{background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:7px 12px;font:inherit;cursor:pointer}
button:hover{border-color:var(--gold)}button.go{background:var(--red);border-color:var(--red);color:#fff;font-weight:600}
main{padding:16px;max-width:1100px;margin:0 auto}
.armed{border:1px solid var(--gold);background:#231d10;border-radius:8px;padding:12px;margin-bottom:14px}
.armed b{color:var(--gold)}
.card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px;margin-bottom:10px}
.card.done{opacity:.45}
.meta{color:var(--dim);font-size:12px;margin:2px 0 8px}
.prompt{background:#0d0b0a;border:1px solid var(--line);border-radius:6px;padding:9px;font:12px/1.5 ui-monospace,monospace;color:#cfc6bf;max-height:74px;overflow:auto;white-space:pre-wrap}
.tag{display:inline-block;border:1px solid var(--line);border-radius:99px;padding:1px 8px;font-size:11px;color:var(--dim);margin-right:5px}
.tag.boss{border-color:var(--red);color:#e9836f}.tag.ok{border-color:var(--ok);color:#8fce9c}
.note{color:var(--gold);font-size:12px;margin-top:7px}
#log{font:12px/1.6 ui-monospace,monospace;max-height:190px;overflow:auto}
#log div{padding:2px 0;border-bottom:1px solid #221e1d}
.lv-ok{color:#8fce9c}.lv-warn{color:var(--gold)}.lv-error{color:#e9836f}.lv-info{color:var(--dim)}
.qa{max-width:190px;border:1px solid var(--line);border-radius:6px;margin-top:8px;display:block}
.bar{height:5px;background:#2a2422;border-radius:3px;overflow:hidden;margin-top:8px}
.bar>i{display:block;height:100%;background:var(--gold)}
</style></head><body>
<header>
  <h1>SWROTT · Prompt Studio</h1>
  <div class="row">
    <input type="search" id="q" placeholder="Buscar por nombre o id…">
    <select id="type"><option value="">Todo</option><option value="character">Personajes</option><option value="scene">Escenarios</option><option value="music">Música</option></select>
    <select id="group"></select>
    <label class="row" style="gap:5px;color:var(--dim)"><input type="checkbox" id="pend" checked style="width:auto"> solo pendientes</label>
    <span id="count" style="color:var(--dim)"></span>
  </div>
  <div class="bar"><i id="pbar" style="width:0%"></i></div>
</header>
<main>
  <div id="armed"></div>
  <div id="list"></div>
  <h3 style="color:var(--gold);font-size:13px;letter-spacing:.06em;text-transform:uppercase">Actividad</h3>
  <div id="log" class="card"></div>
</main>
<script>
let S={jobs:[],armed:null,log:[]};
const $=s=>document.querySelector(s);
async function pull(){S=await(await fetch('/api/state')).json();render()}
async function post(u,b){await fetch(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b||{})});pull()}
function filtered(){
  const q=$('#q').value.toLowerCase(),t=$('#type').value,g=$('#group').value,p=$('#pend').checked;
  return S.jobs.filter(j=>(!t||j.type===t)&&(!g||j.group===g)&&(!p||!j.done)&&
    (!q||(j.label+' '+j.outId).toLowerCase().includes(q)));
}
function render(){
  const groups=[...new Set(S.jobs.map(j=>j.group))];
  const sel=$('#group');
  if(sel.options.length!==groups.length+1){const cur=sel.value;
    sel.innerHTML='<option value="">Todos los grupos</option>'+groups.map(g=>'<option>'+g+'</option>').join('');sel.value=cur}
  const done=S.jobs.filter(j=>j.done).length;
  $('#pbar').style.width=(done/S.jobs.length*100)+'%';
  $('#count').textContent=done+' / '+S.jobs.length+' hechos';

  const a=S.armed&&S.jobs.find(j=>j.outId===S.armed);
  $('#armed').innerHTML=a?'<div class="armed"><b>Armado:</b> '+esc(a.label)+' <code>'+a.outId+'</code><br>'+
    '<span class="meta">La próxima imagen que descargues se asignará a esta entidad.</span>'+
    '<div class="row" style="margin-top:8px"><button onclick="post(\\'/api/unarm\\')">Desarmar</button></div></div>'
    :'<div class="armed" style="border-color:var(--line);background:transparent;color:var(--dim)">Nada armado — pulsa <b>Copiar y armar</b> en una entidad antes de generar.</div>';

  const F=filtered().slice(0,120);
  $('#list').innerHTML=F.map(j=>'<div class="card'+(j.done?' done':'')+'">'+
    '<div><b>'+esc(j.label)+'</b> <code style="color:var(--dim)">'+j.outId+'</code></div>'+
    '<div class="meta"><span class="tag'+(j.done?' ok':'')+'">'+(j.done?'hecho':'pendiente')+'</span>'+
      '<span class="tag">'+esc(j.kind)+'</span><span class="tag">'+esc(j.group)+'</span>'+
      (j.level?'<span class="tag">nivel '+j.level+'</span>':'')+
      (j.state&&j.state!=='idle'?'<span class="tag boss">'+j.state+'</span>':'')+
      '<br>'+esc(j.file)+'</div>'+
    '<div class="prompt">'+esc(j.prompt)+'</div>'+
    (j.notes?'<div class="note">'+esc(j.notes)+'</div>':'')+
    '<div class="row" style="margin-top:9px">'+
      '<button class="go" onclick="copyArm(\\''+j.outId+'\\')">Copiar y armar</button>'+
      '<button onclick="copyText(\\''+j.outId+'\\',\\'negative\\')">Copiar negative</button>'+
      (j.type==='character'?'<button onclick="post(\\'/api/retry\\',{outId:\\''+j.outId+'\\',tolerance:100})">Reconvertir tol 100</button>'+
        '<button onclick="post(\\'/api/retry\\',{outId:\\''+j.outId+'\\',tolerance:45})">tol 45</button>':'')+
    '</div>'+
    (j.done&&j.type==='character'?'<img class="qa" src="/qa/'+j.outId+'.png?'+Date.now()+'" onerror="this.remove()">':'')+
    '</div>').join('')||'<p style="color:var(--dim)">Nada que mostrar con esos filtros.</p>';

  $('#log').innerHTML=S.log.map(e=>'<div class="lv-'+e.level+'">'+e.at.slice(11,19)+'  '+esc(e.msg)+'</div>').join('');
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function copyArm(id){const j=S.jobs.find(x=>x.outId===id);await navigator.clipboard.writeText(j.prompt);await post('/api/arm',{outId:id})}
async function copyText(id,f){const j=S.jobs.find(x=>x.outId===id);await navigator.clipboard.writeText(j[f]||'')}
for(const el of ['#q','#type','#group','#pend'])$(el).addEventListener('input',render);
pull();setInterval(pull,2000);
</script></body></html>`;

// ── Servidor ─────────────────────────────────────────────────────────────────

const body = (req) => new Promise((res) => {
  let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { try { res(JSON.parse(b || '{}')); } catch { res({}); } });
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const json = (o) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)); };

  if (url.pathname === '/') { res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); return res.end(PAGE); }
  if (url.pathname === '/api/state') return json({ jobs, armed, log });

  if (url.pathname.startsWith('/qa/')) {
    const f = path.join(QA_DIR, path.basename(url.pathname));
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': 'image/png' }); return res.end(fs.readFileSync(f));
  }

  if (req.method === 'POST') {
    const b = await body(req);
    if (url.pathname === '/api/arm') {
      armed = b.outId; const j = jobOf(armed);
      say('info', `Armado ${armed}${j ? ' — ' + j.label : ''}`);
      return json({ ok: true });
    }
    if (url.pathname === '/api/unarm') { armed = null; say('info', 'Desarmado'); return json({ ok: true }); }
    if (url.pathname === '/api/retry') { await retry(b.outId, Number(b.tolerance) || 0); return json({ ok: true }); }
  }

  res.writeHead(404); res.end();
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n  El puerto ${PORT} ya está ocupado — ¿tienes otro studio abierto?`);
    console.error(`  Ciérralo, o arranca en otro puerto:  SWROTT_STUDIO_PORT=4301 npm run studio\n`);
    process.exit(1);
  }
  throw e;
});

server.listen(PORT, () => {
  loadIndex();
  const pend = jobs.filter((j) => !j.done).length;
  console.log(`\n  SWROTT Prompt Studio → http://localhost:${PORT}`);
  console.log(`  ${jobs.length} prompts · ${pend} pendientes`);
  console.log(`  Descargas vigiladas: ${DOWNLOADS}\n`);
  watchDownloads();
});
