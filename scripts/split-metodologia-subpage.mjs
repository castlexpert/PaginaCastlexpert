/**
 * Moves methodology from migracion-oracle/index.html into
 * migracion-oracle/metodologia/index.html (standalone subpage).
 */
import fs from 'node:fs';
import path from 'node:path';

const root = 'public/servicios/migracion-oracle';
const mainPath = path.join(root, 'index.html');
let main = fs.readFileSync(mainPath, 'utf8');

const methCssMatch = main.match(/\/\* Methodology \*\/[\s\S]*?\.phase-tag\.muted \{[^}]+\}/);
if (!methCssMatch) throw new Error('Methodology CSS not found');
const methCss = methCssMatch[0];

const sectionMatch = main.match(/<section class="section" id="metodologia">[\s\S]*?<\/section>\n\n/);
if (!sectionMatch) throw new Error('Methodology section not found');
const sectionHtml = sectionMatch[0].trim();

// Extract ES/EN methodology keys (from methTitle through ph5d)
function extractMethKeys(block) {
  const start = block.indexOf("methTitle:");
  if (start < 0) return '';
  const end = block.indexOf("ph5d:");
  if (end < 0) return '';
  const endLine = block.indexOf('\n', end);
  return block.slice(start, endLine + 1);
}

const esObj = main.slice(main.indexOf('es: {'), main.indexOf('en: {'));
const enObj = main.slice(main.indexOf('en: {'), main.indexOf('};\n\n  function detectLang'));
const methEs = extractMethKeys(esObj);
const methEn = extractMethKeys(enObj);
if (!methEs || !methEn) throw new Error('Methodology i18n keys not found');

const sectionClean = sectionHtml
  .replace(
    '<h2 data-m="methTitle">Metodología de migración</h2>',
    '<h2 class="visually-hidden" style="position:absolute;width:1px;height:1px;overflow:hidden" data-m="methTitle">Metodología de migración</h2>',
  )
  .replace(/<p data-m="methLead">[\s\S]*?<\/p>/, '');

const subpage = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Metodología de migración Oracle → Web | CastleXpert</title>
  <meta name="description" content="Metodología CastleXpert para migrar Oracle Forms/Reports a React + Node.js: análisis, Forms2XML, rutas XML o captura, pruebas conjuntas y entrega." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" defer></script>
  <style>
    :root {
      --ink: #0c1a14;
      --ink-soft: #3d4f46;
      --muted: #6b7c72;
      --paper: #f3efe6;
      --brand: #0d4d38;
      --brand-deep: #072a1f;
      --brand-glow: #1a7a58;
      --accent: #c4a35a;
      --line: rgba(12, 26, 20, 0.12);
      --shadow: 0 28px 60px -28px rgba(7, 42, 31, 0.45);
      --radius: 20px;
      --font-display: "Fraunces", Georgia, serif;
      --font-body: "Instrument Sans", "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: var(--font-body);
      color: var(--ink);
      background:
        radial-gradient(900px 420px at 8% -10%, rgba(13, 77, 56, 0.14), transparent 55%),
        radial-gradient(700px 380px at 100% 8%, rgba(196, 163, 90, 0.14), transparent 50%),
        linear-gradient(180deg, #f7f3ea 0%, var(--paper) 45%, #ebe5d6 100%);
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3 { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.03em; line-height: 1.12; margin: 0; text-wrap: balance; }
    p { margin: 0; }
    ul { margin: 0; padding: 0; }

    .cx-bar {
      position: sticky; top: 0; z-index: 50;
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem;
      padding: 0.8rem 1.15rem;
      background: rgba(13, 77, 56, 0.97);
      color: #fff;
      box-shadow: 0 10px 28px rgba(0,0,0,0.18);
    }
    .cx-bar .left { display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap; }
    .cx-bar a, .cx-bar button {
      font-family: inherit; cursor: pointer;
      text-decoration: none; font-weight: 700; font-size: 0.9rem;
      border-radius: 10px; padding: 0.48rem 0.9rem;
      border: 1px solid rgba(255,255,255,0.28);
      background: transparent; color: #fff;
    }
    .cx-bar .home { background: #fff; color: var(--brand); border-color: #fff; }
    .cx-bar .pdf {
      background: var(--accent); color: var(--brand-deep); border-color: var(--accent);
    }
    .cx-bar .pdf:disabled { opacity: 0.65; cursor: wait; }
    .cx-bar #btnLang { min-width: 2.6rem; letter-spacing: 0.04em; }

    .wrap { width: min(1100px, calc(100% - 2.4rem)); margin: 0 auto; }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 0.55rem;
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
      color: var(--brand); margin-bottom: 0.85rem;
    }
    .eyebrow::before { content: ""; width: 1.5rem; height: 2px; background: var(--accent); border-radius: 99px; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
      border-radius: 12px; padding: 0.85rem 1.2rem;
      font-weight: 700; font-size: 0.95rem; text-decoration: none; border: 0; cursor: pointer;
      font-family: inherit;
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .btn:hover { transform: translateY(-2px); }
    .btn-primary { background: var(--brand); color: #fff; box-shadow: 0 14px 28px -12px rgba(13,77,56,0.65); }
    .btn-ghost { background: transparent; color: var(--brand-deep); border: 1px solid rgba(13,77,56,0.28); }

    .hero { padding: clamp(2.2rem, 4.5vw, 3.2rem) 0 0.4rem; }
    .hero-copy { max-width: 46rem; }
    .hero h1 { font-size: clamp(2rem, 4.4vw, 2.85rem); color: var(--brand-deep); }
    .hero-lead { margin-top: 1rem; font-size: 1.05rem; color: var(--ink-soft); max-width: 54ch; }
    .cta-row { margin-top: 1.35rem; display: flex; flex-wrap: wrap; gap: 0.7rem; }

    .section { padding: 0.6rem 0 3.2rem; }
    .section-head { max-width: 42rem; margin-bottom: 0.4rem; }
    .section-head h2 { font-size: clamp(1.7rem, 3.2vw, 2.35rem); color: var(--brand-deep); }
    .section-head p { margin-top: 0.7rem; color: var(--ink-soft); font-size: 1.02rem; }

    .note { margin-top: 1.1rem; text-align: center; font-size: 0.8rem; color: var(--muted); }

    ${methCss}

    .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1); }
    .reveal.in { opacity: 1; transform: none; }

    @media print {
      .cx-bar, .no-print { display: none !important; }
      body { background: #fff; }
      .reveal { opacity: 1 !important; transform: none !important; }
    }
  </style>
</head>
<body>
  <div class="cx-bar no-print">
    <div class="left">
      <button type="button" class="pdf" id="btnPdf">Descargar PDF</button>
      <button type="button" id="btnLang">EN</button>
    </div>
    <div class="left" style="margin-left:auto">
      <a class="home" id="backService" href="/servicios/migracion-oracle/">Volver al servicio</a>
      <a href="/" id="backHome" style="margin-left:0.4rem">Inicio</a>
    </div>
  </div>

  <div id="pdf-root">
    <header class="hero">
      <div class="wrap">
        <div class="hero-copy reveal">
          <p class="eyebrow" data-m="eyebrow">Metodología de servicio</p>
          <h1 data-m="pageTitle">Metodología de migración</h1>
          <p class="hero-lead" data-m="methLead">
            Ruta de modernización open-source: del formulario legacy (.fmb / .mmx / .rdf) a una plataforma web moderna,
            preservando la lógica de negocio original y con validación conjunta cliente–CastleXpert en cada etapa.
          </p>
          <div class="cta-row no-print">
            <a class="btn btn-primary" id="ctaService" href="/servicios/migracion-oracle/">Ver servicio completo</a>
            <a class="btn btn-ghost" href="/contacto" data-m="ctaContact">Solicitar evaluación</a>
          </div>
        </div>
      </div>
    </header>

    ${sectionClean}

    <div class="wrap">
      <p class="note" data-m="note">CastleXpert · Metodología Oracle Developer → web moderna</p>
    </div>
  </div>

<script>
(function () {
  const KEY = 'cx-lang';
  const I18N = {
    es: {
      title: 'Metodología de migración Oracle → Web | CastleXpert',
      pdf: 'Descargar PDF',
      langBtn: 'EN',
      backService: 'Volver al servicio',
      backHome: 'Inicio',
      ctaService: 'Ver servicio completo',
      ctaContact: 'Solicitar evaluación',
      eyebrow: 'Metodología de servicio',
      pageTitle: 'Metodología de migración',
      note: 'CastleXpert · Metodología Oracle Developer → web moderna',
      pdfBusy: 'Generando PDF…',
      ${methEs.trim().replace(/,$/, '')}
    },
    en: {
      title: 'Oracle migration methodology → Web | CastleXpert',
      pdf: 'Download PDF',
      langBtn: 'ES',
      backService: 'Back to service',
      backHome: 'Home',
      ctaService: 'View full service',
      ctaContact: 'Request assessment',
      eyebrow: 'Service methodology',
      pageTitle: 'Migration methodology',
      note: 'CastleXpert · Oracle Developer methodology → modern web',
      pdfBusy: 'Generating PDF…',
      ${methEn.trim().replace(/,$/, '')}
    },
  };

  function detectLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'es') return q;
    try {
      const stored = localStorage.getItem(KEY);
      if (stored === 'en' || stored === 'es') return stored;
    } catch {}
    return 'es';
  }

  function serviceUrl(lang) {
    return lang === 'en' ? '/servicios/migracion-oracle/?lang=en' : '/servicios/migracion-oracle/';
  }

  function apply(lang) {
    const t = I18N[lang] || I18N.es;
    document.documentElement.lang = lang;
    document.title = t.title;
    try { localStorage.setItem(KEY, lang); } catch {}

    document.getElementById('btnPdf').textContent = t.pdf;
    document.getElementById('btnLang').textContent = t.langBtn;
    document.getElementById('backService').textContent = t.backService;
    document.getElementById('backService').href = serviceUrl(lang);
    document.getElementById('backHome').textContent = t.backHome;
    document.getElementById('ctaService').textContent = t.ctaService;
    document.getElementById('ctaService').href = serviceUrl(lang);

    document.querySelectorAll('[data-m]').forEach((el) => {
      const key = el.getAttribute('data-m');
      if (!key || t[key] == null) return;
      if (key === 'secNote') el.innerHTML = t[key];
      else el.textContent = t[key];
    });

    window.__cxPdfBusy = t.pdfBusy;
    window.__cxPdfLabel = t.pdf;
  }

  let lang = detectLang();
  apply(lang);

  document.getElementById('btnLang')?.addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    apply(lang);
  });

  const btn = document.getElementById('btnPdf');
  btn?.addEventListener('click', async () => {
    const root = document.getElementById('pdf-root');
    if (!root || typeof html2pdf === 'undefined') { window.print(); return; }
    btn.disabled = true;
    btn.textContent = window.__cxPdfBusy || 'Generando PDF…';
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    try {
      await html2pdf()
        .set({
          margin: [10, 10, 12, 10],
          filename: 'CastleXpert-Oracle-Migration-Methodology.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(root)
        .save();
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      btn.disabled = false;
      btn.textContent = window.__cxPdfLabel || 'Descargar PDF';
    }
  });

  document.querySelectorAll('.reveal').forEach((el) => {
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    io.observe(el);
  });
})();
</script>
</body>
</html>
`;

fs.mkdirSync(path.join(root, 'metodologia'), { recursive: true });
fs.writeFileSync(path.join(root, 'metodologia', 'index.html'), subpage);

// --- Clean main page ---
main = main.replace(/\/\* Methodology \*\/[\s\S]*?\.phase-tag\.muted \{[^}]+\}\n\n/, '');
main = main.replace(/<section class="section" id="metodologia">[\s\S]*?<\/section>\n\n/, '');

// CTA: link to subpage instead of #metodologia
main = main.replace(
  'href="#metodologia"',
  'href="/servicios/migracion-oracle/metodologia/" id="ctaMeth"',
);

// Remove methodology apply hook
main = main.replace(
  /\n\s*document\.querySelectorAll\('#metodologia \[data-m\]'\)\.forEach\(\(el\) => \{[\s\S]*?\}\);\n/,
  '\n',
);

// Update CTA apply to set href based on lang
if (!main.includes('ctaMethLink')) {
  main = main.replace(
    `const ctas = document.querySelectorAll('.cta-row .btn');
    if (ctas[0]) ctas[0].textContent = t.ctaEval;
    if (ctas[1] && t.ctaMeth) ctas[1].textContent = t.ctaMeth;
    if (ctas[2]) ctas[2].textContent = t.ctaArch;`,
    `const ctas = document.querySelectorAll('.cta-row .btn');
    if (ctas[0]) ctas[0].textContent = t.ctaEval;
    if (ctas[1] && t.ctaMeth) {
      ctas[1].textContent = t.ctaMeth;
      ctas[1].href = lang === 'en'
        ? '/servicios/migracion-oracle/metodologia/?lang=en'
        : '/servicios/migracion-oracle/metodologia/';
    }
    if (ctas[2]) ctas[2].textContent = t.ctaArch;`,
  );
}

// Keep ctaMeth label keys; optional: strip unused meth* keys to slim file — leave for now (harmless)

fs.writeFileSync(mainPath, main);
console.log('Created metodologia/index.html and cleaned main page');
