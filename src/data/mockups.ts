/** Catálogo de mockups / presentaciones publicados en CastleXpert. */
export type MockupId = 'cmms-inventario' | 'logistic-internacional' | 'erp-inventario';

export type SiteMockup = {
  id: MockupId;
  pagePath: string;
  image?: string;
};

export const siteMockups: SiteMockup[] = [
  {
    id: 'cmms-inventario',
    pagePath: '/mockups/cmms-inventario/',
    image: '/demos/cmms/guide/images/01-overview-wm-vs-pwa.png',
  },
  {
    id: 'logistic-internacional',
    pagePath: '/mockups/logistic-internacional/',
    image: '/images/demos/soluciones-pyme-card.webp',
  },
  {
    id: 'erp-inventario',
    pagePath: '/mockups/erp-inventario/',
    image: '/images/demos/soluciones-empresa-card.webp',
  },
];
