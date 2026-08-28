/**
 * Injects Methodology section into migracion-oracle/index.html
 */
import fs from 'node:fs';

const path = 'public/servicios/migracion-oracle/index.html';
let html = fs.readFileSync(path, 'utf8');

const css = `
    /* Methodology */
    .method-block { margin-top: 1.75rem; }
    .method-block + .method-block { margin-top: 2.2rem; }
    .method-kicker {
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--brand); margin-bottom: 0.35rem;
    }
    .method-block h3 {
      font-size: clamp(1.15rem, 2.2vw, 1.4rem); color: var(--brand-deep); margin-bottom: 0.35rem;
    }
    .method-block > .sub {
      color: var(--ink-soft); font-size: 0.98rem; margin-bottom: 1rem; max-width: 52rem;
    }
    .method-steps {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.7rem;
    }
    .method-step {
      border-radius: 14px; padding: 0.95rem 0.9rem 1.05rem;
      background: rgba(255,255,255,0.72); border: 1px solid var(--line);
    }
    .method-step.gate { border-color: rgba(196,163,90,0.55); background: rgba(196,163,90,0.12); }
    .method-step.milestone {
      background: linear-gradient(135deg, var(--brand), var(--brand-deep));
      color: #fff; border: 0;
    }
    .method-step .num {
      width: 1.7rem; height: 1.7rem; border-radius: 50%;
      display: grid; place-items: center;
      font-size: 0.75rem; font-weight: 800;
      background: rgba(13,77,56,0.12); color: var(--brand); margin-bottom: 0.55rem;
    }
    .method-step.gate .num { background: rgba(196,163,90,0.35); color: var(--brand-deep); }
    .method-step.milestone .num { background: rgba(255,255,255,0.2); color: #fff; }
    .method-step h4 {
      font-family: var(--font-display); font-size: 1rem; font-weight: 600;
      color: var(--brand-deep); margin: 0 0 0.35rem; line-height: 1.2;
    }
    .method-step.milestone h4 { color: #fff; }
    .method-step p { font-size: 0.82rem; color: var(--muted); margin: 0; }
    .method-step.milestone p { color: rgba(255,255,255,0.82); }

    .method-cards {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.85rem;
    }
    @media (max-width: 800px) { .method-cards { grid-template-columns: 1fr; } }
    .method-card {
      border-radius: 18px; padding: 1.15rem 1.1rem 1.25rem;
      background: rgba(255,255,255,0.72); border: 1px solid var(--line);
    }
    .method-card .n {
      font-family: var(--font-display); font-size: 1.45rem; color: var(--accent); font-weight: 700;
    }
    .method-card h4 {
      font-size: 1.05rem; color: var(--brand-deep); margin: 0.25rem 0 0.4rem;
      font-family: var(--font-display); font-weight: 600;
    }
    .method-card p { font-size: 0.9rem; color: var(--muted); margin: 0; }

    .sec-compare {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-top: 0.9rem;
    }
    @media (max-width: 720px) { .sec-compare { grid-template-columns: 1fr; } }
    .sec-panel {
      border-radius: 18px; overflow: hidden; border: 1px solid var(--line);
      background: rgba(255,255,255,0.72);
    }
    .sec-panel .head {
      padding: 0.85rem 1.1rem; font-weight: 700; font-size: 0.95rem; color: #fff;
      background: var(--brand-deep);
    }
    .sec-panel.alt .head { background: var(--brand); }
    .sec-panel .body { padding: 1rem 1.1rem 1.15rem; }
    .sec-panel ul { list-style: none; display: grid; gap: 0.55rem; }
    .sec-panel li {
      font-size: 0.9rem; color: var(--ink-soft);
      padding-left: 0.9rem; position: relative;
    }
    .sec-panel li::before {
      content: ""; position: absolute; left: 0; top: 0.55rem;
      width: 0.4rem; height: 0.4rem; border-radius: 50%; background: var(--brand);
    }
    .sec-note {
      margin-top: 0.9rem; border-radius: 14px; padding: 0.95rem 1.1rem;
      background: rgba(196,163,90,0.16); border: 1px solid rgba(196,163,90,0.35);
      font-size: 0.92rem; color: var(--ink-soft);
    }

    .branch-wrap {
      border-radius: var(--radius); padding: 1.25rem 1.2rem 1.4rem;
      background: rgba(255,255,255,0.62); border: 1px solid var(--line); box-shadow: var(--shadow);
    }
    .branch-source {
      display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;
    }
    .branch-source .box {
      border-radius: 12px; padding: 0.65rem 1rem;
      background: rgba(13,77,56,0.1); border: 1px dashed rgba(13,77,56,0.35);
      color: var(--brand-deep); font-weight: 700; font-size: 0.9rem;
    }
    .branch-source .down { color: var(--brand); font-weight: 800; font-size: 1.2rem; }
    .branches { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }
    @media (max-width: 720px) { .branches { grid-template-columns: 1fr; } }
    .branch {
      border-radius: 16px; padding: 1.1rem 1.05rem 1.15rem; border: 1px solid var(--line);
      background: #fff;
    }
    .branch.a { background: rgba(13,77,56,0.07); border-color: rgba(13,77,56,0.18); }
    .branch.b { background: rgba(196,163,90,0.12); border-color: rgba(196,163,90,0.35); }
    .branch .badge {
      display: inline-block; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.08em;
      text-transform: uppercase; padding: 0.22rem 0.55rem; border-radius: 999px; margin-bottom: 0.45rem;
      background: var(--brand); color: #fff;
    }
    .branch.b .badge { background: var(--accent); color: var(--brand-deep); }
    .branch h4 {
      font-family: var(--font-display); font-size: 1.08rem; color: var(--brand-deep);
      margin: 0 0 0.4rem; font-weight: 600;
    }
    .branch .lead { font-size: 0.9rem; color: var(--muted); margin: 0 0 0.55rem; }
    .branch ul { list-style: none; display: grid; gap: 0.4rem; margin: 0; }
    .branch li {
      font-size: 0.88rem; color: var(--ink-soft); padding-left: 0.85rem; position: relative;
    }
    .branch li::before {
      content: ""; position: absolute; left: 0; top: 0.5rem;
      width: 0.35rem; height: 0.35rem; border-radius: 50%; background: var(--brand);
    }
    .branch .use-when {
      margin-top: 0.85rem; padding-top: 0.75rem; border-top: 1px dashed var(--line);
      font-size: 0.82rem; color: var(--muted);
    }
    .converge {
      margin-top: 1rem; text-align: center; font-size: 0.88rem; font-weight: 700;
      color: var(--brand); letter-spacing: 0.02em;
    }

    .cycle {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.45rem;
      padding: 1.1rem; border-radius: var(--radius);
      background: rgba(255,255,255,0.62); border: 1px solid var(--line); box-shadow: var(--shadow);
    }
    .cycle-node {
      width: 7.2rem; height: 7.2rem; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; text-align: center;
      padding: 0.6rem; font-size: 0.78rem; font-weight: 700; color: var(--brand-deep);
      background: #fff; border: 2px solid var(--brand); line-height: 1.25;
    }
    .cycle-node.repo { border-color: var(--brand-glow); color: var(--brand); }
    .cycle-node.client { border-color: var(--accent); color: #7a5a1e; }
    .cycle-arrow { color: var(--brand); font-weight: 800; font-size: 1.1rem; }
    .cycle-note {
      margin-top: 0.85rem; text-align: center; font-size: 0.9rem; color: var(--muted); max-width: 46rem; margin-left: auto; margin-right: auto;
    }

    .timeline-wrap {
      overflow-x: auto; border-radius: var(--radius);
      background: rgba(255,255,255,0.72); border: 1px solid var(--line); box-shadow: var(--shadow);
    }
    table.timeline {
      width: 100%; border-collapse: collapse; font-size: 0.9rem; min-width: 640px;
    }
    table.timeline th {
      background: var(--brand-deep); color: #fff; text-align: left;
      padding: 0.75rem 1rem; font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase;
    }
    table.timeline td {
      padding: 0.8rem 1rem; border-bottom: 1px solid var(--line); color: var(--ink-soft); vertical-align: top;
    }
    table.timeline tr:last-child td { border-bottom: 0; }
    .phase-tag {
      display: inline-block; padding: 0.2rem 0.65rem; border-radius: 999px;
      font-size: 0.72rem; font-weight: 800; color: #fff; background: var(--brand);
    }
    .phase-tag.amber { background: var(--accent); color: var(--brand-deep); }
    .phase-tag.green { background: var(--brand-glow); }
    .phase-tag.muted { background: var(--muted); }
`;

if (!html.includes('.method-block {')) {
  html = html.replace(
    '    .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1); }',
    css + '\n    .reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1); }',
  );
}

const sectionHtml = `
    <section class="section" id="metodologia">
      <div class="wrap">
        <div class="section-head reveal">
          <h2 data-m="methTitle">Metodología de migración</h2>
          <p data-m="methLead">
            Ruta de modernización open-source: del formulario legacy (.fmb / .mmx / .rdf) a una plataforma web moderna,
            preservando la lógica de negocio original y con validación conjunta cliente–CastleXpert en cada etapa.
          </p>
        </div>

        <div class="method-block reveal">
          <p class="method-kicker" data-m="m1k">Proceso</p>
          <h3 data-m="m1t">1. Flujo general del proceso</h3>
          <p class="sub" data-m="m1s">Desde la entrega de los archivos originales hasta la puesta en producción de las pantallas migradas.</p>
          <div class="method-steps" aria-label="Flujo de metodología">
            <article class="method-step"><div class="num">1</div><h4 data-m="s1t">Entrega de archivos</h4><p data-m="s1d">Cliente entrega .FMB, .MMX y .RDF del sistema actual.</p></article>
            <article class="method-step"><div class="num">2</div><h4 data-m="s2t">Análisis previo</h4><p data-m="s2d">Inventario de módulos/submódulos, prioridades y modelo de seguridad.</p></article>
            <article class="method-step"><div class="num">3</div><h4 data-m="s3t">Conversión a XML</h4><p data-m="s3d">Forms2XML extrae bloques, triggers, LOVs y estructura de cada forma.</p></article>
            <article class="method-step gate"><div class="num">4</div><h4 data-m="s4t">Cotización</h4><p data-m="s4d">Peso/costo de migración por complejidad, módulo y prioridad.</p></article>
            <article class="method-step gate"><div class="num">5</div><h4 data-m="s5t">Visto bueno</h4><p data-m="s5d">Aprobación formal del cliente para iniciar la migración.</p></article>
            <article class="method-step"><div class="num">6</div><h4 data-m="s6t">Migración con IA</h4><p data-m="s6d">Vía libre (desde XML) o guiada (desde print screen). Ver sección 3.</p></article>
            <article class="method-step"><div class="num">7</div><h4 data-m="s7t">Repositorio compartido</h4><p data-m="s7d">Pantallas migradas se suben para acceso conjunto de ambas partes.</p></article>
            <article class="method-step"><div class="num">8</div><h4 data-m="s8t">Ciclo de pruebas</h4><p data-m="s8d">Periodo prudencial de pruebas cliente ↔ CastleXpert. Ver sección 4.</p></article>
            <article class="method-step milestone"><div class="num">9</div><h4 data-m="s9t">Ajustes y entrega</h4><p data-m="s9d">Correcciones finales y puesta en producción del módulo.</p></article>
          </div>
        </div>

        <div class="method-block reveal">
          <p class="method-kicker" data-m="m2k">Antes de cotizar</p>
          <h3 data-m="m2t">2. Análisis previo — lo que se define antes de cotizar</h3>
          <p class="sub" data-m="m2s">Estas decisiones se toman una sola vez, pero se heredan a lo largo de toda la migración.</p>
          <div class="method-cards">
            <article class="method-card"><div class="n">01</div><h4 data-m="c1t">Inventario de módulos y submódulos</h4><p data-m="c1d">Mapeo completo del sistema: qué formas pertenecen a qué dominio de negocio (facturación, inventario, RRHH, etc.) y sus relaciones entre sí.</p></article>
            <article class="method-card"><div class="n">02</div><h4 data-m="c2t">Priorización de migración</h4><p data-m="c2d">Orden de migración según criticidad para el negocio, dependencias técnicas entre módulos, y valor rápido para el cliente.</p></article>
            <article class="method-card"><div class="n">03</div><h4 data-m="c3t">Modelo de seguridad a heredar</h4><p data-m="c3d">Definición temprana de cómo se replica el control de acceso — decisión que impacta la arquitectura completa.</p></article>
          </div>

          <div class="sec-compare">
            <div class="sec-panel">
              <div class="head" data-m="sec1h">Seguridad basada en menús de Forms</div>
              <div class="body">
                <ul>
                  <li data-m="sec1a">El acceso se controla mediante roles asociados a opciones de menú dentro de Forms.</li>
                  <li data-m="sec1b">Migra hacia un sistema de rutas protegidas + roles en React (route guards) y middleware de autorización en Node.</li>
                  <li data-m="sec1c">Requiere mapear cada opción de menú Forms a una ruta/permiso equivalente en la nueva plataforma.</li>
                </ul>
              </div>
            </div>
            <div class="sec-panel alt">
              <div class="head" data-m="sec2h">Seguridad por sistema a medida</div>
              <div class="body">
                <ul>
                  <li data-m="sec2a">El control de acceso vive en tablas propias del negocio (perfiles, permisos por pantalla/acción, etc.).</li>
                  <li data-m="sec2b">Se preserva el modelo tal cual — se traduce la tabla de permisos existente a un servicio de autorización en Node (RBAC/ABAC según el caso).</li>
                  <li data-m="sec2c">Menor riesgo de pérdida de reglas de negocio, porque la fuente de verdad ya está en base de datos.</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="sec-note" data-m="secNote"><strong>Por qué se define primero:</strong> el modelo de seguridad no es una pantalla más — es una regla de negocio transversal. Cambiar de enfoque a mitad de la migración implica retrabajo en todos los módulos ya migrados.</div>
        </div>

        <div class="method-block reveal">
          <p class="method-kicker" data-m="m3k">Diseño de pantallas</p>
          <h3 data-m="m3t">3. Dos rutas para capturar el diseño de pantalla</h3>
          <p class="sub" data-m="m3s">Ambas parten de la misma lógica de negocio migrada; lo que cambia es cómo se define la distribución visual de campos.</p>
          <div class="branch-wrap">
            <div class="branch-source">
              <div class="box" data-m="branchSrc">XML del Forms (Forms2XML)</div>
              <div class="down" aria-hidden="true">↓</div>
            </div>
            <div class="branches">
              <div class="branch a">
                <span class="badge" data-m="baBadge">Ruta A</span>
                <h4 data-m="baTitle">Migración libre desde XML</h4>
                <p class="lead" data-m="baLead">El agente interpreta directamente la estructura del XML (bloques, orden de items, agrupaciones) y propone la distribución de campos.</p>
                <ul>
                  <li data-m="ba1">Más rápida — no requiere insumos adicionales del cliente.</li>
                  <li data-m="ba2">El resultado sigue la lógica interna de Forms, no necesariamente el “look” visual percibido por el usuario final.</li>
                </ul>
                <div class="use-when" data-m="baWhen">Ideal para: pantallas CRUD estándar, formularios internos, módulos donde el diseño exacto no es crítico.</div>
              </div>
              <div class="branch b">
                <span class="badge" data-m="bbBadge">Ruta B</span>
                <h4 data-m="bbTitle">Migración guiada por captura de pantalla</h4>
                <p class="lead" data-m="bbLead">El cliente entrega un print screen del formulario en ejecución; el agente combina XML + imagen para replicar la distribución visual real de los campos.</p>
                <ul>
                  <li data-m="bb1">Mayor fidelidad visual al formulario que el usuario final ya conoce.</li>
                  <li data-m="bb2">Reduce curva de adaptación del usuario final al nuevo sistema.</li>
                </ul>
                <div class="use-when" data-m="bbWhen">Ideal para: pantallas de alto uso diario, formularios con layout no estándar, módulos sensibles a la experiencia de usuario.</div>
              </div>
            </div>
            <div class="converge" data-m="converge">Ambas rutas convergen en: componente React + endpoints Node.js</div>
          </div>
        </div>

        <div class="method-block reveal">
          <p class="method-kicker" data-m="m4k">Validación</p>
          <h3 data-m="m4t">4. Ciclo de pruebas compartido</h3>
          <p class="sub" data-m="m4s">Una vez migrado el lote, se habilita un espacio de validación conjunta antes de cerrar el módulo.</p>
          <div class="cycle" aria-label="Ciclo de pruebas">
            <div class="cycle-node repo" data-m="cy1">Repositorio compartido</div>
            <div class="cycle-arrow" aria-hidden="true">→</div>
            <div class="cycle-node client" data-m="cy2">Cliente prueba pantallas</div>
            <div class="cycle-arrow" aria-hidden="true">→</div>
            <div class="cycle-node" data-m="cy3">CastleXpert revisa hallazgos</div>
            <div class="cycle-arrow" aria-hidden="true">→</div>
            <div class="cycle-node" data-m="cy4">Ajustes puntuales</div>
            <div class="cycle-arrow" aria-hidden="true">→</div>
            <div class="cycle-node repo" data-m="cy5">Nueva versión en repositorio</div>
          </div>
          <p class="cycle-note" data-m="cyNote">Este ciclo se repite tantas veces como sea necesario dentro del tiempo prudencial acordado por módulo, antes de pasar a producción.</p>
        </div>

        <div class="method-block reveal">
          <p class="method-kicker" data-m="m5k">Resumen</p>
          <h3 data-m="m5t">5. Resumen de fases y responsables</h3>
          <div class="timeline-wrap">
            <table class="timeline">
              <thead>
                <tr>
                  <th data-m="thPhase">Fase</th>
                  <th data-m="thAct">Actividad</th>
                  <th data-m="thOwn">Responsable</th>
                  <th data-m="thDel">Entregable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="phase-tag" data-m="ph1">Análisis</span></td>
                  <td data-m="ph1a">Inventario, priorización y definición de modelo de seguridad</td>
                  <td data-m="ph1o">CastleXpert + Cliente</td>
                  <td data-m="ph1d">Documento de alcance y prioridades</td>
                </tr>
                <tr>
                  <td><span class="phase-tag amber" data-m="ph2">Cotización</span></td>
                  <td data-m="ph2a">Conversión a XML y estimación de costo por complejidad</td>
                  <td data-m="ph2o">CastleXpert</td>
                  <td data-m="ph2d">Propuesta económica</td>
                </tr>
                <tr>
                  <td><span class="phase-tag" data-m="ph3">Migración</span></td>
                  <td data-m="ph3a">Generación de pantallas (ruta libre o guiada por captura)</td>
                  <td data-m="ph3o">CastleXpert (agentes IA + revisión)</td>
                  <td data-m="ph3d">Componentes React + endpoints Node en repositorio</td>
                </tr>
                <tr>
                  <td><span class="phase-tag green" data-m="ph4">Validación</span></td>
                  <td data-m="ph4a">Pruebas conjuntas, hallazgos y ajustes</td>
                  <td data-m="ph4o">Cliente + CastleXpert</td>
                  <td data-m="ph4d">Módulo aprobado</td>
                </tr>
                <tr>
                  <td><span class="phase-tag muted" data-m="ph5">Cierre</span></td>
                  <td data-m="ph5a">Entrega final y paso a producción del módulo</td>
                  <td data-m="ph5o">CastleXpert</td>
                  <td data-m="ph5d">Módulo en producción</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
`;

if (!html.includes('id="metodologia"')) {
  html = html.replace(
    '    <section class="section" id="entrega">',
    sectionHtml + '\n    <section class="section" id="entrega">',
  );
}

// Hero CTA for methodology
if (!html.includes('href="#metodologia"')) {
  html = html.replace(
    `<div class="cta-row no-print">
            <a class="btn btn-primary" href="#evaluacion">Ver Evaluación de Modernización</a>
            <a class="btn btn-ghost" href="#arquitectura">Ver arquitectura destino</a>
          </div>`,
    `<div class="cta-row no-print">
            <a class="btn btn-primary" href="#evaluacion">Ver Evaluación de Modernización</a>
            <a class="btn btn-ghost" href="#metodologia">Ver metodología</a>
            <a class="btn btn-ghost" href="#arquitectura">Ver arquitectura destino</a>
          </div>`,
  );
}

fs.writeFileSync(path, html);
console.log('HTML/CSS section injected');
