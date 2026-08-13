/**
 * Sincroniza guías de demos desde las rutas originales → public/demos/<slug>/guide
 * Ver demos/SOURCES.md
 *
 * Tras copiar, inyecta barra "Anterior / CastleXpert" en cada index.html.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const demosPublic = path.join(root, 'public', 'demos');

/** @type {Array<{ slug: string; source: string; mode: 'all' | 'cmms' | 'pura-puntos' }>} */
const DEMOS = [
  { slug: 'tracklogic', source: 'C:\\Proyectos\\Track_logistic\\guide', mode: 'all' },
  { slug: 'foodly', source: 'C:\\Proyectos\\DEMO_fastfood\\guide', mode: 'all' },
  { slug: 'cmms', source: 'C:\\Proyectos\\MANTE_PREVENTIVO\\guide', mode: 'cmms' },
  {
    slug: 'pura-puntos',
    source: 'C:\\Proyectos\\LOYALTY\\loyalty-platform\\guide',
    mode: 'pura-puntos',
  },
];

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyAll(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  if (process.platform === 'win32') {
    execFileSync('robocopy', [src, dest, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/nc', '/ns', '/np'], {
      stdio: 'inherit',
    });
  } else {
    fs.cpSync(src, dest, { recursive: true });
  }
}

function syncCmms(src, dest) {
  fs.mkdirSync(path.join(dest, 'images'), { recursive: true });
  fs.copyFileSync(path.join(src, 'index.html'), path.join(dest, 'index.html'));
  const images = path.join(src, 'images');
  if (fs.existsSync(images)) {
    for (const name of fs.readdirSync(images)) {
      const from = path.join(images, name);
      if (fs.statSync(from).isFile()) fs.copyFileSync(from, path.join(dest, 'images', name));
    }
  }
}

/** Guía single-file → index.html + assets; suaviza menciones técnicas de PWA. */
function syncPuraPuntos(src, dest) {
  fs.mkdirSync(path.join(dest, 'assets'), { recursive: true });
  const guideSrc = path.join(src, 'pura-puntos-guia.html');
  let html = fs.readFileSync(guideSrc, 'utf8');
  html = html
    .replace(/instalarla como PWA en la pantalla de inicio/gi, 'instalarla en la pantalla de inicio')
    .replace(/Instalable como aplicación \(PWA\)/g, 'Instalable como aplicación');
  fs.writeFileSync(path.join(dest, 'index.html'), html, 'utf8');
  const assets = path.join(src, 'assets');
  if (fs.existsSync(assets)) {
    for (const name of fs.readdirSync(assets)) {
      const from = path.join(assets, name);
      if (fs.statSync(from).isFile()) fs.copyFileSync(from, path.join(dest, 'assets', name));
    }
  }
}

function backBarHtml(slug) {
  const demoUrl = `/demos/${slug}`;
  return `
<!-- cx-guide-nav -->
<style id="cx-guide-nav-style">
  .cx-guide-back {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.65rem;
    padding: 0.85rem 1.1rem;
    background: rgba(13, 77, 56, 0.98);
    color: #fff;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    box-shadow: 0 10px 28px rgba(0,0,0,0.22);
  }
  .cx-guide-back a {
    color: #fff; text-decoration: none; font-weight: 600; font-size: 0.95rem;
    border-radius: 10px; padding: 0.5rem 0.95rem;
    border: 1px solid rgba(255,255,255,0.28);
    transition: background 0.15s ease;
  }
  .cx-guide-back a:hover { background: rgba(255,255,255,0.14); }
  .cx-guide-back__home { background: #fff; color: #0d4d38 !important; border-color: #fff !important; }
  .cx-guide-back__home:hover { background: #f3f4f6 !important; }
  body { padding-top: 4.25rem !important; }
  .theme-toggle { top: calc(18px + 4.25rem) !important; }
</style>
<nav class="cx-guide-back" aria-label="Navegación CastleXpert">
  <a class="cx-guide-back__prev" href="${demoUrl}">← Anterior</a>
  <a class="cx-guide-back__home" href="/">Volver a CastleXpert</a>
</nav>
<!-- /cx-guide-nav -->
`.trim();
}

export function injectGuideBackBar(indexHtmlPath, slug) {
  if (!fs.existsSync(indexHtmlPath)) return false;
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  // Quitar inyección previa si existe
  html = html.replace(/<!-- cx-guide-nav -->[\s\S]*?<!-- \/cx-guide-nav -->\s*/g, '');
  const bar = backBarHtml(slug);
  if (/<body[^>]*>/i.test(html)) {
    html = html.replace(/<body([^>]*)>/i, `<body$1>\n${bar}\n`);
  } else {
    html = `${bar}\n${html}`;
  }
  fs.writeFileSync(indexHtmlPath, html, 'utf8');
  return true;
}

const onlyInject = process.argv.includes('--inject-only');
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const onlySlug = onlyArg ? onlyArg.slice('--only='.length) : null;
const demosToRun = onlySlug ? DEMOS.filter((d) => d.slug === onlySlug) : DEMOS;

if (onlyInject) {
  for (const demo of demosToRun) {
    const indexHtml = path.join(demosPublic, demo.slug, 'guide', 'index.html');
    const ok = injectGuideBackBar(indexHtml, demo.slug);
    // eslint-disable-next-line no-console
    console.log(ok ? `[demos:sync] injected nav → ${demo.slug}` : `[demos:sync] SKIP inject ${demo.slug}`);
  }
} else {
  for (const demo of demosToRun) {
    if (!fs.existsSync(demo.source)) {
      console.warn(`[demos:sync] SKIP ${demo.slug}: source missing ${demo.source}`);
      continue;
    }
    const dest = path.join(demosPublic, demo.slug, 'guide');
    rmrf(dest);
    if (demo.mode === 'cmms') syncCmms(demo.source, dest);
    else if (demo.mode === 'pura-puntos') syncPuraPuntos(demo.source, dest);
    else copyAll(demo.source, dest);
    injectGuideBackBar(path.join(dest, 'index.html'), demo.slug);
    // eslint-disable-next-line no-console
    console.log(`[demos:sync] OK ${demo.slug} ← ${demo.source}`);
  }
}
