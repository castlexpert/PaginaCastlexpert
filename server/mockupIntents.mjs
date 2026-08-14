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

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Si la pregunta pide una presentación concreta, devolvemos el enlace
 * sin depender del índice del sitio ni del modelo.
 */
export function answerMockupPresentation(message, language) {
  const q = normalize(message);
  const lang = language === 'en' ? 'en' : 'es';

  const wantsShow =
    /presentacion|presentar|mockup|maqueta|prototipo|ver\b|mostrar|link|enlace|url/.test(q) ||
    q.includes('quiero ver');

  const isCmmsInv =
    (q.includes('cmms') || q.includes('mante')) &&
    (q.includes('inventario') || q.includes('inventory') || q.includes('mro'));

  const isLogisticIntl =
    (q.includes('logistic') && (q.includes('internacional') || q.includes('international'))) ||
    q.includes('logistica internacional');

  const isErpInv =
    q.includes('erp') &&
    (q.includes('inventario') ||
      q.includes('inventory') ||
      q.includes('bodega') ||
      wantsShow ||
      q.includes('mockup'));

  if (isErpInv) {
    return MOCKUPS.erpInventario[lang];
  }
  if (isCmmsInv && (wantsShow || q.includes('inventario') || q.includes('inventory'))) {
    return MOCKUPS.cmmsInventario[lang];
  }
  if (isLogisticIntl) {
    return MOCKUPS.logisticInternacional[lang];
  }
  return null;
}
