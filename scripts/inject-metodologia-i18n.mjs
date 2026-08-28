/**
 * Adds methodology i18n (ES/EN) + apply() hooks into migracion-oracle/index.html
 */
import fs from 'node:fs';

const path = 'public/servicios/migracion-oracle/index.html';
let html = fs.readFileSync(path, 'utf8');

const methEs = `
      ctaMeth: 'Ver metodología',
      methTitle: 'Metodología de migración',
      methLead: 'Ruta de modernización open-source: del formulario legacy (.fmb / .mmx / .rdf) a una plataforma web moderna, preservando la lógica de negocio original y con validación conjunta cliente–CastleXpert en cada etapa.',
      m1k: 'Proceso', m1t: '1. Flujo general del proyecto', m1s: 'Desde la entrega de los archivos originales hasta la puesta en producción de las pantallas migradas.',
      s1t: 'Entrega de archivos', s1d: 'Cliente entrega .FMB, .MMX y .RDF del sistema actual.',
      s2t: 'Análisis previo', s2d: 'Inventario de módulos/submódulos, prioridades y modelo de seguridad.',
      s3t: 'Conversión a XML', s3d: 'Forms2XML extrae bloques, triggers, LOVs y estructura de cada forma.',
      s4t: 'Cotización', s4d: 'Peso/costo de migración por complejidad, módulo y prioridad.',
      s5t: 'Visto bueno', s5d: 'Aprobación formal del cliente para iniciar la migración.',
      s6t: 'Migración con IA', s6d: 'Vía libre (desde XML) o guiada (desde print screen). Ver sección 3.',
      s7t: 'Repositorio compartido', s7d: 'Pantallas migradas se suben para acceso conjunto de ambas partes.',
      s8t: 'Ciclo de pruebas', s8d: 'Periodo prudencial de pruebas cliente ↔ CastleXpert. Ver sección 4.',
      s9t: 'Ajustes y entrega', s9d: 'Correcciones finales y puesta en producción del módulo.',
      m2k: 'Antes de cotizar', m2t: '2. Análisis previo — lo que se define antes de cotizar', m2s: 'Estas decisiones se toman una sola vez, pero se heredan a lo largo de toda la migración.',
      c1t: 'Inventario de módulos y submódulos', c1d: 'Mapeo completo del sistema: qué formas pertenecen a qué dominio de negocio (facturación, inventario, RRHH, etc.) y sus relaciones entre sí.',
      c2t: 'Priorización de migración', c2d: 'Orden de migración según criticidad para el negocio, dependencias técnicas entre módulos, y valor rápido para el cliente.',
      c3t: 'Modelo de seguridad a heredar', c3d: 'Definición temprana de cómo se replica el control de acceso — decisión que impacta la arquitectura completa.',
      sec1h: 'Seguridad basada en menús de Forms',
      sec1a: 'El acceso se controla mediante roles asociados a opciones de menú dentro de Forms.',
      sec1b: 'Migra hacia un sistema de rutas protegidas + roles en React (route guards) y middleware de autorización en Node.',
      sec1c: 'Requiere mapear cada opción de menú Forms a una ruta/permiso equivalente en la nueva plataforma.',
      sec2h: 'Seguridad por sistema a medida',
      sec2a: 'El control de acceso vive en tablas propias del negocio (perfiles, permisos por pantalla/acción, etc.).',
      sec2b: 'Se preserva el modelo tal cual — se traduce la tabla de permisos existente a un servicio de autorización en Node (RBAC/ABAC según el caso).',
      sec2c: 'Menor riesgo de pérdida de reglas de negocio, porque la fuente de verdad ya está en base de datos.',
      secNote: '<strong>Por qué se define primero:</strong> el modelo de seguridad no es una pantalla más — es una regla de negocio transversal. Cambiar de enfoque a mitad de la migración implica retrabajo en todos los módulos ya migrados.',
      m3k: 'Diseño de pantallas', m3t: '3. Dos rutas para capturar el diseño de pantalla', m3s: 'Ambas parten de la misma lógica de negocio migrada; lo que cambia es cómo se define la distribución visual de campos.',
      branchSrc: 'XML del Forms (Forms2XML)',
      baBadge: 'Ruta A', baTitle: 'Migración libre desde XML',
      baLead: 'El agente interpreta directamente la estructura del XML (bloques, orden de items, agrupaciones) y propone la distribución de campos.',
      ba1: 'Más rápida — no requiere insumos adicionales del cliente.',
      ba2: 'El resultado sigue la lógica interna de Forms, no necesariamente el “look” visual percibido por el usuario final.',
      baWhen: 'Ideal para: pantallas CRUD estándar, formularios internos, módulos donde el diseño exacto no es crítico.',
      bbBadge: 'Ruta B', bbTitle: 'Migración guiada por captura de pantalla',
      bbLead: 'El cliente entrega un print screen del formulario en ejecución; el agente combina XML + imagen para replicar la distribución visual real de los campos.',
      bb1: 'Mayor fidelidad visual al formulario que el usuario final ya conoce.',
      bb2: 'Reduce curva de adaptación del usuario final al nuevo sistema.',
      bbWhen: 'Ideal para: pantallas de alto uso diario, formularios con layout no estándar, módulos sensibles a la experiencia de usuario.',
      converge: 'Ambas rutas convergen en: componente React + endpoints Node.js',
      m4k: 'Validación', m4t: '4. Ciclo de pruebas compartido', m4s: 'Una vez migrado el lote, se habilita un espacio de validación conjunta antes de cerrar el módulo.',
      cy1: 'Repositorio compartido', cy2: 'Cliente prueba pantallas', cy3: 'CastleXpert revisa hallazgos', cy4: 'Ajustes puntuales', cy5: 'Nueva versión en repositorio',
      cyNote: 'Este ciclo se repite tantas veces como sea necesario dentro del tiempo prudencial acordado por módulo, antes de pasar a producción.',
      m5k: 'Resumen', m5t: '5. Resumen de fases y responsables',
      thPhase: 'Fase', thAct: 'Actividad', thOwn: 'Responsable', thDel: 'Entregable',
      ph1: 'Análisis', ph1a: 'Inventario, priorización y definición de modelo de seguridad', ph1o: 'CastleXpert + Cliente', ph1d: 'Documento de alcance y prioridades',
      ph2: 'Cotización', ph2a: 'Conversión a XML y estimación de costo por complejidad', ph2o: 'CastleXpert', ph2d: 'Propuesta económica',
      ph3: 'Migración', ph3a: 'Generación de pantallas (ruta libre o guiada por captura)', ph3o: 'CastleXpert (agentes IA + revisión)', ph3d: 'Componentes React + endpoints Node en repositorio',
      ph4: 'Validación', ph4a: 'Pruebas conjuntas, hallazgos y ajustes', ph4o: 'Cliente + CastleXpert', ph4d: 'Módulo aprobado',
      ph5: 'Cierre', ph5a: 'Entrega final y paso a producción del módulo', ph5o: 'CastleXpert', ph5d: 'Módulo en producción',
`;

const methEn = `
      ctaMeth: 'See methodology',
      methTitle: 'Migration methodology',
      methLead: 'Open-source modernization path: from legacy forms (.fmb / .mmx / .rdf) to a modern web platform, preserving original business logic and with joint client–CastleXpert validation at every stage.',
      m1k: 'Process', m1t: '1. Overall project flow', m1s: 'From delivery of the original files to production of the migrated screens.',
      s1t: 'File delivery', s1d: 'Client delivers .FMB, .MMX, and .RDF from the current system.',
      s2t: 'Prior analysis', s2d: 'Inventory of modules/submodules, priorities, and security model.',
      s3t: 'XML conversion', s3d: 'Forms2XML extracts blocks, triggers, LOVs, and structure from each form.',
      s4t: 'Quote', s4d: 'Migration weight/cost by complexity, module, and priority.',
      s5t: 'Go-ahead', s5d: 'Formal client approval to start the migration.',
      s6t: 'AI-assisted migration', s6d: 'Free path (from XML) or guided (from screenshot). See section 3.',
      s7t: 'Shared repository', s7d: 'Migrated screens are uploaded for joint access by both parties.',
      s8t: 'Test cycle', s8d: 'Prudential client ↔ CastleXpert testing period. See section 4.',
      s9t: 'Adjustments & delivery', s9d: 'Final fixes and production rollout of the module.',
      m2k: 'Before quoting', m2t: '2. Prior analysis — what is defined before quoting', m2s: 'These decisions are made once, then inherited across the entire migration.',
      c1t: 'Module and submodule inventory', c1d: 'Full system map: which forms belong to which business domain (billing, inventory, HR, etc.) and how they relate.',
      c2t: 'Migration prioritization', c2d: 'Migration order by business criticality, technical dependencies, and quick value for the client.',
      c3t: 'Security model to inherit', c3d: 'Early definition of how access control is replicated — a decision that shapes the full architecture.',
      sec1h: 'Security based on Forms menus',
      sec1a: 'Access is controlled via roles tied to menu options inside Forms.',
      sec1b: 'Migrates to protected routes + roles in React (route guards) and authorization middleware in Node.',
      sec1c: 'Requires mapping each Forms menu option to an equivalent route/permission on the new platform.',
      sec2h: 'Custom security system',
      sec2a: 'Access control lives in business tables (profiles, screen/action permissions, etc.).',
      sec2b: 'The model is preserved as-is — existing permission tables become a Node authorization service (RBAC/ABAC as needed).',
      sec2c: 'Lower risk of losing business rules, because the source of truth already lives in the database.',
      secNote: '<strong>Why define it first:</strong> the security model is not just another screen — it is a cross-cutting business rule. Changing approach mid-migration means rework across every module already migrated.',
      m3k: 'Screen design', m3t: '3. Two paths to capture screen layout', m3s: 'Both start from the same migrated business logic; what changes is how the visual field layout is defined.',
      branchSrc: 'Forms XML (Forms2XML)',
      baBadge: 'Path A', baTitle: 'Free migration from XML',
      baLead: 'The agent reads the XML structure (blocks, item order, groupings) and proposes the field layout.',
      ba1: 'Faster — no extra client inputs required.',
      ba2: 'The result follows Forms internal logic, not necessarily the visual “look” end users perceive.',
      baWhen: 'Ideal for: standard CRUD screens, internal forms, modules where pixel-perfect layout is not critical.',
      bbBadge: 'Path B', bbTitle: 'Screenshot-guided migration',
      bbLead: 'The client provides a running-form screenshot; the agent combines XML + image to replicate the real visual field layout.',
      bb1: 'Higher visual fidelity to the form end users already know.',
      bb2: 'Shortens the end-user adaptation curve to the new system.',
      bbWhen: 'Ideal for: high daily-use screens, non-standard layouts, modules sensitive to user experience.',
      converge: 'Both paths converge into: React component + Node.js endpoints',
      m4k: 'Validation', m4t: '4. Shared test cycle', m4s: 'Once a batch is migrated, a joint validation space opens before closing the module.',
      cy1: 'Shared repository', cy2: 'Client tests screens', cy3: 'CastleXpert reviews findings', cy4: 'Targeted fixes', cy5: 'New version in repository',
      cyNote: 'This cycle repeats as needed within the agreed prudential window per module, before going to production.',
      m5k: 'Summary', m5t: '5. Phase and ownership summary',
      thPhase: 'Phase', thAct: 'Activity', thOwn: 'Owner', thDel: 'Deliverable',
      ph1: 'Analysis', ph1a: 'Inventory, prioritization, and security-model definition', ph1o: 'CastleXpert + Client', ph1d: 'Scope and priorities document',
      ph2: 'Quote', ph2a: 'XML conversion and complexity-based cost estimate', ph2o: 'CastleXpert', ph2d: 'Commercial proposal',
      ph3: 'Migration', ph3a: 'Screen generation (free path or screenshot-guided)', ph3o: 'CastleXpert (AI agents + review)', ph3d: 'React components + Node endpoints in repository',
      ph4: 'Validation', ph4a: 'Joint testing, findings, and adjustments', ph4o: 'Client + CastleXpert', ph4d: 'Approved module',
      ph5: 'Close-out', ph5a: 'Final delivery and production rollout of the module', ph5o: 'CastleXpert', ph5d: 'Module in production',
`;

if (!html.includes('ctaMeth:')) {
  html = html.replace(
    "      ctaEval: 'Ver Evaluación de Modernización',\n      ctaArch: 'Ver arquitectura destino',",
    "      ctaEval: 'Ver Evaluación de Modernización',\n      ctaMeth: 'Ver metodología',\n      ctaArch: 'Ver arquitectura destino',",
  );
  // Actually methEs already has ctaMeth - insert full block before flowAria in es
  html = html.replace(
    "      pdfBusy: 'Generando PDF…',\n      flowAria: 'Flujo de migración',\n    },\n    en: {",
    "      pdfBusy: 'Generando PDF…',\n      flowAria: 'Flujo de migración'," +
      methEs.replace(/\n      ctaMeth:[^\n]+\n/, '\n') +
      "\n    },\n    en: {",
  );
}

if (!html.includes("ctaMeth: 'See methodology'")) {
  html = html.replace(
    "      ctaEval: 'See Modernization Assessment',\n      ctaArch: 'See target architecture',",
    "      ctaEval: 'See Modernization Assessment',\n      ctaMeth: 'See methodology',\n      ctaArch: 'See target architecture',",
  );
  html = html.replace(
    "      pdfBusy: 'Generating PDF…',\n      flowAria: 'Migration flow',\n    },\n  };",
    "      pdfBusy: 'Generating PDF…',\n      flowAria: 'Migration flow'," +
      methEn.replace(/\n      ctaMeth:[^\n]+\n/, '\n') +
      "\n    },\n  };",
  );
}

const applyHook = `
    const ctas = document.querySelectorAll('.cta-row .btn');
    if (ctas[0]) ctas[0].textContent = t.ctaEval;
    if (ctas[1] && t.ctaMeth) ctas[1].textContent = t.ctaMeth;
    if (ctas[2]) ctas[2].textContent = t.ctaArch;
`;

// Replace old CTA apply (2 buttons) with 3-button version
html = html.replace(
  `    const ctas = document.querySelectorAll('.cta-row .btn');
    if (ctas[0]) ctas[0].textContent = t.ctaEval;
    if (ctas[1]) ctas[1].textContent = t.ctaArch;`,
  applyHook.trim(),
);

const methApply = `
    document.querySelectorAll('#metodologia [data-m]').forEach((el) => {
      const key = el.getAttribute('data-m');
      if (!key || t[key] == null) return;
      if (key === 'secNote') el.innerHTML = t[key];
      else el.textContent = t[key];
    });
`;

if (!html.includes("#metodologia [data-m]")) {
  html = html.replace(
    "    setText('#contacto .close-inner h2', t.closeTitle);",
    methApply + "\n    setText('#contacto .close-inner h2', t.closeTitle);",
  );
}

fs.writeFileSync(path, html);
console.log('i18n injected');
