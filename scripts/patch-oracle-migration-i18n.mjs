import fs from 'node:fs';

const path = 'public/servicios/migracion-oracle/index.html';
let html = fs.readFileSync(path, 'utf8');

html = html.replace(
  'Antes y después: del cliente Oracle Forms a una experiencia web moderna, responsive y mantenible.',
  'De Oracle Forms a una experiencia web moderna: responsive, accesible y preparada para el futuro.',
);
html = html.replace(
  'arquitectura moderna encima de su Oracle Database, con frontend y API separados.',
  'arquitectura moderna sobre su Oracle Database, con frontend y API separados.',
);
html = html.replace(
  `Liberamos avances por etapas para que su operación pruebe la migración real,
              dé feedback y reduzca riesgo antes de continuar.`,
  'Liberamos avances por etapas para que su operación pruebe la migración real.',
);

html = html.replace(
  `<div class="cx-bar no-print">
    <div class="left">
      <button type="button" class="pdf" id="btnPdf">Descargar PDF</button>
    </div>
    <a class="home" href="/">Volver a CastleXpert</a>
  </div>`,
  `<div class="cx-bar no-print">
    <div class="left">
      <button type="button" class="pdf" id="btnPdf" data-i18n="pdf">Descargar PDF</button>
      <button type="button" id="btnLang">EN</button>
    </div>
    <a class="home" href="/" data-i18n="home">Volver a CastleXpert</a>
  </div>`,
);

const i18nScript = `
<script>
(function () {
  const KEY = 'cx-lang';
  const I18N = {
    es: {
      title: 'Evaluación y migración Oracle Developer → Web | CastleXpert',
      pdf: 'Descargar PDF',
      home: 'Volver a CastleXpert',
      langBtn: 'EN',
      eyebrow: 'Servicio propietario CastleXpert',
      h1: 'Nosotros migramos su Oracle Developer <em>y entregamos el código fuente</em>',
      lead: 'Ejecutamos la modernización de sistemas Oracle Forms 6i, 9i, 10g, 11g, 12c y 14c hacia una plataforma web responsive con React, Vite, Node.js y API REST — manteniendo Oracle Database cuando aplica. Es un servicio de migración entregado por nuestro equipo.',
      p1: '<strong>CastleXpert realiza la migración</strong> de punta a punta.',
      p2: '<strong>Se entregan los códigos fuente</strong> de lo desarrollado.',
      p3: '<strong>Entrega incremental</strong> para que su equipo pruebe cada avance.',
      p4: '<strong>Costo según complejidad de cada Form</strong> (no un precio genérico).',
      ctaEval: 'Ver Evaluación de Modernización',
      ctaArch: 'Ver arquitectura destino',
      imgAlt: 'Antes y después: Oracle Forms en monitor legado frente a aplicación web moderna',
      caption: 'De Oracle Forms a una experiencia web moderna: responsive, accesible y preparada para el futuro.',
      flowTitle: 'El camino de la migración',
      flowSub: 'Partimos del sistema actual, hacemos una evaluación técnica profunda y construimos la arquitectura moderna sobre su Oracle Database, con frontend y API separados.',
      f1l: 'Sistema actual', f1t: 'Oracle Forms 6i–14c', f1s: 'Cliente pesado / Forms + Reports',
      f2l: 'Base de datos', f2t: 'Oracle Database', f2s: 'Datos, PL/SQL, packages, jobs',
      f3l: 'CastleXpert', f3t: 'Evaluación técnica', f3s: 'Inventario, riesgos, plan incremental',
      f4l: 'Destino', f4t: 'Arquitectura moderna',
      f5l: 'Frontend', f5t: 'React + Vite', f5s: 'Interfaz web responsive',
      f6l: 'Backend', f6t: 'Node.js · API REST', f6s: 'Lógica de negocio expuesta',
      f7l: 'Persistencia', f7t: 'Oracle Database', f7s: 'Se conserva y se conecta vía API',
      flowNote: 'Evitamos el enfoque “big bang”: migramos por olas, con entregas que usted puede probar mientras el resto del sistema sigue operando.',
      archTitle: 'Arquitectura moderna',
      archSub: 'Alineación React + Node.js con flujo de API estructurado, contratos compartidos y herramientas comunes — adaptada a una migración desde Oracle Developer.',
      archH3: 'Alineación React y Node.js en servicios',
      archCap: 'Flujo de API estructurado + herramientas y contratos compartidos. En migraciones Oracle, la base puede permanecer en Oracle Database conectada por API REST.',
      svgReact: 'Aplicación React',
      svgGw: 'Puerta de enlace API (API Gateway)',
      svgA: 'Servicio Node.js A', svgB: 'Servicio Node.js B', svgC: 'Servicio Node.js C',
      svgRest: 'API REST', svgBiz: 'Lógica de negocio', svgDb: 'Base de datos',
      svgEco: 'Ecosistema JavaScript compartido',
      svgC1: 'Contratos API', svgC1s: '(OpenAPI / JSON)',
      svgC2: 'Validación', svgC2s: '(Zod / Joi)',
      svgC3: 'Herramientas', svgC3s: '(npm, CI/CD)',
      svgC4: 'Pruebas', svgC4s: '(Jest, ESLint)',
      evalTitle: 'Evaluación de Modernización',
      evalSub: 'Ofrecemos un análisis previo para decidir con datos: qué migrar, en qué orden y con qué esfuerzo estimado — antes de iniciar la construcción.',
      e1: 'Inventario de Forms, Reports, Libraries y módulos.',
      e2: 'Dependencias entre módulos.',
      e3: 'Complejidad de la lógica PL/SQL.',
      e4: 'Integraciones existentes.',
      e5: 'Uso de triggers, procedures, packages, jobs, etc.',
      e6: 'Dependencias de versiones de Oracle.',
      e7: 'Riesgos técnicos de una migración.',
      e8: 'Qué componentes pueden reutilizarse.',
      e9: 'Qué debería convertirse a API REST.',
      e10: 'Qué debería pasar a frontend web.',
      e11: 'Propuesta de arquitectura moderna.',
      e12: 'Estrategia de migración incremental (sin “big bang”).',
      e13: 'Estimación preliminar de esfuerzo y fases.',
      delTitle: 'Modelo de entrega y costo',
      delSub: 'Transparente, medible y alineado a la realidad de cada Form.',
      d1t: 'Costo por complejidad',
      d1d: 'El valor se calcula según el nivel de complejidad de cada Form (pantallas simples, flujos con PL/SQL denso, integraciones, reportes, etc.).',
      d2t: 'Entrega incremental',
      d2d: 'Liberamos avances por etapas para que su operación pruebe la migración real.',
      d3t: 'Código fuente incluido',
      d3d: 'Al cerrar cada entrega, usted recibe los fuentes de lo desarrollado: frontend React/Vite y servicios Node.js / API REST correspondientes.',
      closeTitle: '¿Listo para una Evaluación de Modernización?',
      closeText: 'Analizamos su inventario Oracle Developer y le devolvemos una propuesta concreta: arquitectura, fases, riesgos y estimación por complejidad — para que CastleXpert ejecute la migración y le entregue los códigos fuente.',
      closeCta: 'Solicitar evaluación',
      note: 'CastleXpert · Migración Oracle Developer → web moderna',
      pdfBusy: 'Generando PDF…',
      flowAria: 'Flujo de migración',
    },
    en: {
      title: 'Oracle Developer assessment & migration to web | CastleXpert',
      pdf: 'Download PDF',
      home: 'Back to CastleXpert',
      langBtn: 'ES',
      eyebrow: 'CastleXpert proprietary service',
      h1: 'We migrate your Oracle Developer system <em>and deliver the source code</em>',
      lead: 'We modernize Oracle Forms 6i, 9i, 10g, 11g, 12c, and 14c into a responsive web platform with React, Vite, Node.js, and REST APIs — keeping Oracle Database when it applies. This is a migration service delivered by our team.',
      p1: '<strong>CastleXpert runs the migration</strong> end to end.',
      p2: '<strong>Source code is delivered</strong> for what we build.',
      p3: '<strong>Incremental delivery</strong> so your team can test each advance.',
      p4: '<strong>Pricing by each Form’s complexity</strong> (not a generic price).',
      ctaEval: 'See Modernization Assessment',
      ctaArch: 'See target architecture',
      imgAlt: 'Before and after: legacy Oracle Forms monitor versus a modern web application',
      caption: 'From Oracle Forms to a modern web experience: responsive, accessible, and built for the future.',
      flowTitle: 'The migration path',
      flowSub: 'We start from the current system, perform a deep technical assessment, and build the modern architecture on your Oracle Database, with separate frontend and API.',
      f1l: 'Current system', f1t: 'Oracle Forms 6i–14c', f1s: 'Thick client / Forms + Reports',
      f2l: 'Database', f2t: 'Oracle Database', f2s: 'Data, PL/SQL, packages, jobs',
      f3l: 'CastleXpert', f3t: 'Technical assessment', f3s: 'Inventory, risks, incremental plan',
      f4l: 'Target', f4t: 'Modern architecture',
      f5l: 'Frontend', f5t: 'React + Vite', f5s: 'Responsive web interface',
      f6l: 'Backend', f6t: 'Node.js · REST API', f6s: 'Business logic exposed',
      f7l: 'Persistence', f7t: 'Oracle Database', f7s: 'Kept and connected via API',
      flowNote: 'We avoid a “big bang” approach: we migrate in waves, with deliveries you can test while the rest of the system keeps running.',
      archTitle: 'Modern architecture',
      archSub: 'React + Node.js alignment with a structured API flow, shared contracts, and common tooling — adapted for an Oracle Developer migration.',
      archH3: 'React and Node.js service alignment',
      archCap: 'Structured API flow + shared tooling and contracts. In Oracle migrations, the database can remain Oracle Database connected through REST APIs.',
      svgReact: 'React application',
      svgGw: 'API Gateway',
      svgA: 'Node.js service A', svgB: 'Node.js service B', svgC: 'Node.js service C',
      svgRest: 'REST API', svgBiz: 'Business logic', svgDb: 'Database',
      svgEco: 'Shared JavaScript ecosystem',
      svgC1: 'API contracts', svgC1s: '(OpenAPI / JSON)',
      svgC2: 'Validation', svgC2s: '(Zod / Joi)',
      svgC3: 'Tooling', svgC3s: '(npm, CI/CD)',
      svgC4: 'Testing', svgC4s: '(Jest, ESLint)',
      evalTitle: 'Modernization Assessment',
      evalSub: 'We offer a prior analysis so decisions are data-driven: what to migrate, in what order, and with what estimated effort — before construction begins.',
      e1: 'Inventory of Forms, Reports, Libraries, and modules.',
      e2: 'Dependencies between modules.',
      e3: 'Complexity of PL/SQL logic.',
      e4: 'Existing integrations.',
      e5: 'Use of triggers, procedures, packages, jobs, etc.',
      e6: 'Oracle version dependencies.',
      e7: 'Technical risks of a migration.',
      e8: 'Which components can be reused.',
      e9: 'What should become a REST API.',
      e10: 'What should move to the web frontend.',
      e11: 'Modern architecture proposal.',
      e12: 'Incremental migration strategy (no “big bang”).',
      e13: 'Preliminary effort and phase estimate.',
      delTitle: 'Delivery and pricing model',
      delSub: 'Transparent, measurable, and aligned to each Form’s reality.',
      d1t: 'Pricing by complexity',
      d1d: 'Value is calculated by each Form’s complexity level (simple screens, dense PL/SQL flows, integrations, reports, etc.).',
      d2t: 'Incremental delivery',
      d2d: 'We release progress in stages so your operations can test the real migration.',
      d3t: 'Source code included',
      d3d: 'At each delivery close, you receive the sources we built: React/Vite frontend and corresponding Node.js / REST API services.',
      closeTitle: 'Ready for a Modernization Assessment?',
      closeText: 'We analyze your Oracle Developer inventory and return a concrete proposal: architecture, phases, risks, and complexity-based estimate — so CastleXpert can execute the migration and deliver the source code.',
      closeCta: 'Request assessment',
      note: 'CastleXpert · Oracle Developer migration → modern web',
      pdfBusy: 'Generating PDF…',
      flowAria: 'Migration flow',
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

  function setText(sel, value, html) {
    const el = document.querySelector(sel);
    if (!el || value == null) return;
    if (html) el.innerHTML = value;
    else el.textContent = value;
  }

  function apply(lang) {
    const t = I18N[lang] || I18N.es;
    document.documentElement.lang = lang;
    document.title = t.title;
    try { localStorage.setItem(KEY, lang); } catch {}

    setText('#btnPdf', t.pdf);
    setText('#btnLang', t.langBtn);
    setText('.cx-bar .home', t.home);
    setText('.hero-copy .eyebrow', t.eyebrow);
    setText('.hero-copy h1', t.h1, true);
    setText('.hero-lead', t.lead);
    const promises = document.querySelectorAll('.promise li');
    [t.p1, t.p2, t.p3, t.p4].forEach((v, i) => { if (promises[i]) promises[i].innerHTML = v; });
    const ctas = document.querySelectorAll('.cta-row .btn');
    if (ctas[0]) ctas[0].textContent = t.ctaEval;
    if (ctas[1]) ctas[1].textContent = t.ctaArch;
    const img = document.querySelector('.hero-visual img');
    if (img) img.alt = t.imgAlt;
    setText('.hero-caption', t.caption);
    setText('#flujo .section-head h2', t.flowTitle);
    setText('#flujo .section-head p', t.flowSub);
    const flow = document.querySelector('.flow');
    if (flow) flow.setAttribute('aria-label', t.flowAria);
    const nodes = document.querySelectorAll('.flow-node');
    const map = [
      [t.f1l, t.f1t, t.f1s],
      [t.f2l, t.f2t, t.f2s],
      [t.f3l, t.f3t, t.f3s],
      [t.f4l, t.f4t, null],
      [t.f5l, t.f5t, t.f5s],
      [t.f6l, t.f6t, t.f6s],
      [t.f7l, t.f7t, t.f7s],
    ];
    nodes.forEach((node, i) => {
      const m = map[i];
      if (!m) return;
      const lbl = node.querySelector('.lbl');
      const ttl = node.querySelector('.ttl');
      const sub = node.querySelector('.sub');
      if (lbl) lbl.textContent = m[0];
      if (ttl) ttl.textContent = m[1];
      if (sub && m[2]) sub.textContent = m[2];
    });
    setText('.flow-merge-note', t.flowNote);
    setText('#arquitectura .section-head h2', t.archTitle);
    setText('#arquitectura .section-head p', t.archSub);
    setText('#arquitectura .arch h3', t.archH3);
    setText('#arquitectura .arch-caption', t.archCap);

    const svg = document.querySelector('#arquitectura svg');
    if (svg) {
      const texts = svg.querySelectorAll('text');
      // Fixed order matching the SVG structure
      const svgVals = [
        t.svgReact, t.svgGw,
        t.svgA, t.svgRest, t.svgBiz,
        t.svgB, t.svgRest, t.svgBiz,
        t.svgC, t.svgRest, t.svgBiz,
        t.svgDb, t.svgDb, t.svgDb,
        t.svgEco, t.svgC1, t.svgC1s, t.svgC2, t.svgC2s, t.svgC3, t.svgC3s, t.svgC4, t.svgC4s,
      ];
      texts.forEach((el, i) => { if (svgVals[i]) el.textContent = svgVals[i]; });
    }

    setText('#evaluacion .section-head h2', t.evalTitle);
    setText('#evaluacion .section-head p', t.evalSub);
    document.querySelectorAll('#evaluacion .check-list li').forEach((li, i) => {
      const key = 'e' + (i + 1);
      if (t[key]) li.textContent = t[key];
    });
    setText('#entrega .section-head h2', t.delTitle);
    setText('#entrega .section-head p', t.delSub);
    const tiles = document.querySelectorAll('#entrega .tile');
    const dels = [[t.d1t, t.d1d], [t.d2t, t.d2d], [t.d3t, t.d3d]];
    tiles.forEach((tile, i) => {
      const h = tile.querySelector('h3');
      const p = tile.querySelector('p');
      if (h) h.textContent = dels[i][0];
      if (p) p.textContent = dels[i][1];
    });
    setText('#contacto .close-inner h2', t.closeTitle);
    setText('#contacto .close-inner p', t.closeText);
    setText('#contacto .close-inner .btn', t.closeCta);
    setText('#contacto .note', t.note);
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
    if (!root || typeof html2pdf === 'undefined') {
      window.print();
      return;
    }
    btn.disabled = true;
    btn.textContent = window.__cxPdfBusy || 'Generando PDF…';
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    try {
      await html2pdf()
        .set({
          margin: [10, 10, 12, 10],
          filename: 'CastleXpert-Oracle-Migration.pdf',
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
})();
</script>
`;

// Remove old script blocks for reveal+pdf and append combined
html = html.replace(/<script>\s*document\.querySelectorAll\('\.reveal'\)[\s\S]*?<\/script>\s*<\/body>/, `${i18nScript}\n<script>
    document.querySelectorAll('.reveal').forEach((el) => {
      if (!('IntersectionObserver' in window)) { el.classList.add('in'); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      io.observe(el);
    });
  </script>\n</body>`);

fs.writeFileSync(path, html);
console.log('OK updated', path);
