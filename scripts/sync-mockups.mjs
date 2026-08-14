/**
 * Copia mockups desde las rutas originales → public/mockups/<slug>/
 * e inyecta la barra CastleXpert (Anterior → /mockups).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const destRoot = path.join(root, 'public', 'mockups');

/** @type {Array<{ slug: string; sourceFile: string; fallback?: string }>} */
const MOCKUPS = [
  {
    slug: 'cmms-inventario',
    sourceFile: 'C:\\Proyectos\\MANTE_PREVENTIVO\\guide\\inventario-mockup.html',
  },
  {
    slug: 'logistic-internacional',
    sourceFile: 'C:\\Proyectos\\Logistic\\mockup\\index.html',
  },
  {
    slug: 'erp-inventario',
    sourceFile: 'C:\\Users\\castl\\Downloads\\Mockup_ERP_Inventario.html',
    fallback: path.join(root, 'mockups-src', 'Mockup_ERP_Inventario.html'),
  },
];

function backBarHtml() {
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
  body { padding-top: 4.25rem !important; box-sizing: border-box !important; }
  header { top: 4.25rem !important; }
</style>
<nav class="cx-guide-back" aria-label="Navegación CastleXpert">
  <a class="cx-guide-back__prev" href="/mockups">← Anterior</a>
  <a class="cx-guide-back__home" href="/">Volver a CastleXpert</a>
</nav>
<!-- /cx-guide-nav -->
`.trim();
}

function injectNav(html) {
  const cleaned = html.replace(/<!-- cx-guide-nav -->[\s\S]*?<!-- \/cx-guide-nav -->\s*/g, '');
  const bar = backBarHtml();
  if (/<body[^>]*>/i.test(cleaned)) {
    return cleaned.replace(/<body([^>]*)>/i, `<body$1>\n${bar}\n`);
  }
  return `${bar}\n${cleaned}`;
}

for (const mockup of MOCKUPS) {
  const source =
    fs.existsSync(mockup.sourceFile) ? mockup.sourceFile : mockup.fallback && fs.existsSync(mockup.fallback) ? mockup.fallback : null;
  if (!source) {
    console.warn(`[mockups:sync] SKIP ${mockup.slug}: missing ${mockup.sourceFile}`);
    continue;
  }
  const destDir = path.join(destRoot, mockup.slug);
  fs.mkdirSync(destDir, { recursive: true });
  const html = injectNav(fs.readFileSync(source, 'utf8'));
  fs.writeFileSync(path.join(destDir, 'index.html'), html, 'utf8');
  console.log(`[mockups:sync] OK ${mockup.slug} ← ${source}`);
}
