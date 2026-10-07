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

/** @type {Array<{ slug: string; source: string; mode: 'all' | 'cmms' | 'pura-puntos' | 'erp-inventarios' | 'crm-ia' }>} */
const DEMOS = [
  { slug: 'tracklogic', source: 'C:\\Proyectos\\Track_logistic\\guide', mode: 'all' },
  { slug: 'foodly', source: 'C:\\Proyectos\\DEMO_fastfood\\guide', mode: 'all' },
  { slug: 'cmms', source: 'C:\\Proyectos\\MANTE_PREVENTIVO\\guide', mode: 'cmms' },
  {
    slug: 'pura-puntos',
    source: 'C:\\Proyectos\\LOYALTY\\loyalty-platform\\guide',
    mode: 'pura-puntos',
  },
  { slug: 'erp-inventarios', source: 'C:\\Proyectos\\ERP Inventarios\\guide', mode: 'erp-inventarios' },
  { slug: 'crm-ia', source: 'C:\\Proyectos\\CRM IA\\web', mode: 'crm-ia' },
];

/** El CRM IA es una SPA (ficha + demo con datos ficticios): se compila con base propia en vez de copiar una guía. */
const CRM_IA_BASE = '/demos/crm-ia/live/';
const CRM_IA_BAR_H = '2.75rem';

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyAll(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  if (process.platform === 'win32') {
    try {
      execFileSync('robocopy', [src, dest, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/nc', '/ns', '/np'], {
        stdio: 'inherit',
      });
    } catch (e) {
      // robocopy exit codes 0–7 mean success (1 = files copied); 8+ are real failures.
      if (typeof e?.status !== 'number' || e.status >= 8) throw e;
    }
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

/** Guía multipágina: copia todo y oculta detalles de desarrollo local (puertos) en el índice. */
function syncErpInventarios(src, dest) {
  copyAll(src, dest);
  const indexPath = path.join(dest, 'index.html');
  const html = fs
    .readFileSync(indexPath, 'utf8')
    .replace(/web · puerto \d+/g, 'web · navegador')
    .replace(/backend · puerto \d+/g, 'REST · integración CMMS');
  fs.writeFileSync(indexPath, html, 'utf8');
}

function buildCrmIa(src, dest) {
  execFileSync('npx', ['vite', 'build', '--base', CRM_IA_BASE, '--outDir', dest, '--emptyOutDir'], {
    cwd: src,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  const indexPath = path.join(dest, 'index.html');
  const html = fs
    .readFileSync(indexPath, 'utf8')
    .replace(/<title>[^<]*<\/title>/, '<title>CastleXpert CRM IA · Ficha y demo en vivo</title>')
    .replace(
      '</head>',
      `    <meta name="description" content="CastleXpert CRM IA: CRM con inteligencia artificial, WhatsApp con bot, historial 360 por cédula, cotizaciones con IVA y tableros. Demo en vivo con datos ficticios." />\n    <link rel="canonical" href="https://castlexpert.com${CRM_IA_BASE}" />\n  </head>`,
    );
  fs.writeFileSync(indexPath, html, 'utf8');
}

/** Barra delgada para la SPA del CRM: su nav, header y sidebar son sticky en top:0 y deben quedar debajo. */
function crmIaBarHtml() {
  return `
<!-- cx-guide-nav -->
<style id="cx-guide-nav-style">
  .cx-guide-back {
    position: fixed; top: 0; left: 0; right: 0; z-index: 55; height: ${CRM_IA_BAR_H};
    display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
    padding: 0 0.9rem;
    background: rgba(13, 77, 56, 0.98);
    color: #fff;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  }
  .cx-guide-back a {
    color: #fff; text-decoration: none; font-weight: 600; font-size: 0.85rem; white-space: nowrap;
    border-radius: 9px; padding: 0.3rem 0.8rem;
    border: 1px solid rgba(255,255,255,0.28);
  }
  .cx-guide-back a:hover { background: rgba(255,255,255,0.14); }
  .cx-guide-back__home { background: #fff; color: #0d4d38 !important; border-color: #fff !important; }
  .cx-guide-back__home:hover { background: #f3f4f6 !important; }
  body { padding-top: ${CRM_IA_BAR_H} !important; }
  .sticky.top-0 { top: ${CRM_IA_BAR_H} !important; }
  aside.sticky.h-screen { height: calc(100vh - ${CRM_IA_BAR_H}) !important; }
</style>
<nav class="cx-guide-back" aria-label="Navegación CastleXpert">
  <a class="cx-guide-back__prev" href="/demos/crm-ia">← CastleXpert CRM IA</a>
  <a class="cx-guide-back__home" href="/">Volver a CastleXpert</a>
</nav>
<!-- /cx-guide-nav -->
`.trim();
}

/** The ERP guide sidebar is sticky at top:0, so it must start below the fixed CastleXpert bar. */
const EXTRA_BAR_CSS = {
  'erp-inventarios': `
  .nav { top: 4.25rem !important; height: calc(100vh - 4.25rem) !important; }`,
};

/** Páginas de la guía que reciben la barra: todas las .html si la guía es multipágina. */
function guidePagesFor(slug, guideDir) {
  if (slug === 'crm-ia') return [path.join(demosPublic, 'crm-ia', 'live', 'index.html')];
  if (slug !== 'erp-inventarios') return [path.join(guideDir, 'index.html')];
  if (!fs.existsSync(guideDir)) return [];
  return fs
    .readdirSync(guideDir)
    .filter((name) => name.toLowerCase().endsWith('.html'))
    .map((name) => path.join(guideDir, name));
}

function backBarHtml(slug) {
  const demoUrl = `/demos/${slug}`;
  const extraCss = EXTRA_BAR_CSS[slug] || '';
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
  .theme-toggle { top: calc(18px + 4.25rem) !important; }${extraCss}
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
  const bar = slug === 'crm-ia' ? crmIaBarHtml() : backBarHtml(slug);
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
    const pages = guidePagesFor(demo.slug, path.join(demosPublic, demo.slug, 'guide'));
    const ok = pages.filter((p) => injectGuideBackBar(p, demo.slug)).length > 0;
    // eslint-disable-next-line no-console
    console.log(ok ? `[demos:sync] injected nav → ${demo.slug}` : `[demos:sync] SKIP inject ${demo.slug}`);
  }
} else {
  for (const demo of demosToRun) {
    if (!fs.existsSync(demo.source)) {
      console.warn(`[demos:sync] SKIP ${demo.slug}: source missing ${demo.source}`);
      continue;
    }
    const dest = path.join(demosPublic, demo.slug, demo.mode === 'crm-ia' ? 'live' : 'guide');
    rmrf(dest);
    if (demo.mode === 'crm-ia') buildCrmIa(demo.source, dest);
    else if (demo.mode === 'cmms') syncCmms(demo.source, dest);
    else if (demo.mode === 'pura-puntos') syncPuraPuntos(demo.source, dest);
    else if (demo.mode === 'erp-inventarios') syncErpInventarios(demo.source, dest);
    else copyAll(demo.source, dest);
    for (const page of guidePagesFor(demo.slug, dest)) injectGuideBackBar(page, demo.slug);
    // eslint-disable-next-line no-console
    console.log(`[demos:sync] OK ${demo.slug} ← ${demo.source}`);
  }
}
