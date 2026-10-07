const SITE = 'https://castlexpert.com';

const MOCKUPS = {
  cmmsInventario: {
    url: `${SITE}/mockups/cmms-inventario/`,
    es: `Claro. Aquí tienes la presentación del CMMS con inventario (mockup interactivo):\nhttps://castlexpert.com/mockups/cmms-inventario/\n\nAhí puedes recorrer dashboard, órdenes e inventario. Si quieres, también te dejo el demo funcional: https://castlexpert.com/demos/cmms`,
    en: `Here is the CMMS with inventory presentation (interactive mockup):\nhttps://castlexpert.com/mockups/cmms-inventario/\n\nYou can walk through the dashboard, work orders, and inventory. The functional demo is here: https://castlexpert.com/demos/cmms`,
  },
  logisticInternacional: {
    url: `${SITE}/mockups/logistic-internacional/`,
    es: `Claro. Aquí tienes la presentación de Logistic Internacional (mockup interactivo):\nhttps://castlexpert.com/mockups/logistic-internacional/`,
    en: `Here is the Logistic Internacional presentation (interactive mockup):\nhttps://castlexpert.com/mockups/logistic-internacional/`,
  },
  erpInventario: {
    url: `${SITE}/mockups/erp-inventario/`,
    es: `Claro. Aquí tienes la presentación del ERP Inventario (mockup):\nhttps://castlexpert.com/mockups/erp-inventario/\n\nIncluye vista general, movimientos, centros de costo y bodegas.`,
    en: `Here is the ERP Inventory presentation (mockup):\nhttps://castlexpert.com/mockups/erp-inventario/\n\nIt includes the overview, movements, cost centers, and warehouses.`,
  },
};

const DEMOS = {
  erpInventarios: {
    es: `Claro. ERP Inventarios es nuestro sistema de inventarios multi-empresa: bodegas con plano visual, centros de costo, movimientos con costo promedio, tomas físicas con app de bodega y API para el CMMS de mantenimiento.\n\nDemo: https://castlexpert.com/demos/erp-inventarios\nGuía visual: https://castlexpert.com/demos/erp-inventarios/guide/\n\nSi prefieres una presentación rápida, también está el mockup: https://castlexpert.com/mockups/erp-inventario/`,
    en: `Sure. ERP Inventory is our multi-company inventory system: visual warehouse layouts, cost centers, movements with average cost, physical counts with a warehouse app, and an API for the maintenance CMMS.\n\nDemo: https://castlexpert.com/demos/erp-inventarios\nVisual guide (Spanish): https://castlexpert.com/demos/erp-inventarios/guide/\n\nFor a quick presentation, there is also the mockup: https://castlexpert.com/mockups/erp-inventario/`,
  },
  cmmsErpIntegration: {
    es: `Sí. El CMMS (MANTE Preventivo) se integra con ERP Inventarios por API: consulta el stock de repuestos antes de la orden y registra el consumo de cada orden de trabajo contra la bodega y el centro de costo, así el inventario baja solo y el costo queda imputado.\n\nIntegración (guía): https://castlexpert.com/demos/erp-inventarios/guide/11-cmms.html\nDemo ERP Inventarios: https://castlexpert.com/demos/erp-inventarios\nDemo CMMS: https://castlexpert.com/demos/cmms\nPresentación CMMS con inventario: https://castlexpert.com/mockups/cmms-inventario/`,
    en: `Yes. The CMMS (MANTE Preventive) integrates with ERP Inventory through an API: it checks spare-part stock before the job and records each work order’s consumption against the warehouse and cost center, so inventory drops automatically and the cost is charged correctly.\n\nIntegration (guide): https://castlexpert.com/demos/erp-inventarios/guide/11-cmms.html\nERP Inventory demo: https://castlexpert.com/demos/erp-inventarios\nCMMS demo: https://castlexpert.com/demos/cmms\nCMMS with inventory presentation: https://castlexpert.com/mockups/cmms-inventario/`,
  },
  crmIa: {
    es: `¡Claro! CastleXpert CRM IA es nuestro nuevo CRM con inteligencia artificial: reúne ventas, cotizaciones con IVA, negociaciones, gestiones con SLA y el WhatsApp de su empresa con un bot que atiende, cotiza y agenda. Con solo la cédula ve el historial 360 del cliente, y el copiloto Xpert le da seguimiento por usted.\n\nDemo en vivo (datos ficticios): https://castlexpert.com/demos/crm-ia/live/app\nFicha técnica y planes: https://castlexpert.com/demos/crm-ia/live/\nMás información: https://castlexpert.com/demos/crm-ia\n\nPaquetes desde ₡29.900 al mes para hasta 3 usuarios (precio fijo por paquete, no por usuario). ¿Le gustaría que un asesor le ayude a implementarlo?`,
    en: `Sure! CastleXpert CRM IA is our new AI-powered CRM: it brings together sales, quotes with VAT, deals, service requests with SLAs, and your company’s WhatsApp with a bot that answers, quotes, and schedules. With just a national ID you see the customer’s 360° history, and the Xpert copilot follows up for you.\n\nLive demo (fictional data): https://castlexpert.com/demos/crm-ia/live/app\nSpec sheet and plans (Spanish): https://castlexpert.com/demos/crm-ia/live/\nMore info: https://castlexpert.com/demos/crm-ia\n\nPackages from ₡29,900 per month for up to 3 users (flat price per package, not per user). Would you like an advisor to help you set it up?`,
  },
};

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Si la pregunta pide una presentación concreta (o el demo ERP Inventarios / su integración
 * con el CMMS), devolvemos el enlace sin depender del índice del sitio ni del modelo.
 */
export function answerMockupPresentation(message, language) {
  const q = normalize(message);
  const lang = language === 'en' ? 'en' : 'es';

  const wantsShow =
    /presentacion|presentar|mockup|maqueta|prototipo|ver\b|mostrar|link|enlace|url/.test(q) ||
    q.includes('quiero ver');
  const wantsMockup = /presentacion|presentar|mockup|maqueta|prototipo/.test(q);

  const isCmmsInv =
    (q.includes('cmms') || q.includes('mante')) &&
    (q.includes('inventario') ||
      q.includes('inventory') ||
      q.includes('mro') ||
      q.includes('repuesto') ||
      q.includes('spare part') ||
      q.includes('erp'));

  const isLogisticIntl =
    (q.includes('logistic') && (q.includes('internacional') || q.includes('international'))) ||
    q.includes('logistica internacional');

  const isErpInv =
    q.includes('erp') &&
    (q.includes('inventario') ||
      q.includes('inventory') ||
      q.includes('bodega') ||
      q.includes('warehouse') ||
      wantsShow ||
      q.includes('mockup'));

  const isCrmIa =
    /\bcrm\b/.test(q) &&
    !isCmmsInv &&
    !q.includes('erp') &&
    !/precio|cuanto|cuesta|costo|plan(es)?\b|usuarios|integra|api\b|price|cost|users|how much/.test(q);

  if (isCrmIa) {
    return DEMOS.crmIa[lang];
  }
  if (isCmmsInv) {
    return wantsMockup ? MOCKUPS.cmmsInventario[lang] : DEMOS.cmmsErpIntegration[lang];
  }
  if (isErpInv) {
    return wantsMockup ? MOCKUPS.erpInventario[lang] : DEMOS.erpInventarios[lang];
  }
  if (isLogisticIntl) {
    return MOCKUPS.logisticInternacional[lang];
  }
  return null;
}
