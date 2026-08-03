/** Catálogo de demos funcionales publicados en CastleXpert. */
export type FunctionalDemoId = 'tracklogic' | 'foodly' | 'cmms';

export type FunctionalDemo = {
  id: FunctionalDemoId;
  /** Ruta SPA de explicación */
  pagePath: string;
  /** Guía estática HTML */
  guidePath: string;
  /** Imagen de card / hero */
  image: string;
  /** Slug en WAdministrativo apk_systems_master (si aplica) */
  apkSlug?: string;
  /** Video promocional / acceso (ej. CMMS MANTE) */
  video?: { src: string; poster?: string };
  /** Ruta original de la guía (para re-sync) */
  sourceGuidePath: string;
};

export const functionalDemos: FunctionalDemo[] = [
  {
    id: 'foodly',
    pagePath: '/demos/foodly',
    guidePath: '/demos/foodly/guide/',
    image: '/demos/foodly/guide/img/foodly-hero.png',
    apkSlug: 'foodly-rest',
    sourceGuidePath: 'C:\\Proyectos\\DEMO_fastfood\\guide',
  },
  {
    id: 'cmms',
    pagePath: '/demos/cmms',
    guidePath: '/demos/cmms/guide/',
    image: '/demos/cmms/guide/images/01-overview-wm-vs-pwa.png',
    video: {
      src: '/images/demos/MANTE_Preventivo.mp4',
      poster: '/images/demos/soluciones-empresa-modal.webp',
    },
    sourceGuidePath: 'C:\\Proyectos\\MANTE_PREVENTIVO\\guide',
  },
  {
    id: 'tracklogic',
    pagePath: '/demos/tracklogic',
    guidePath: '/demos/tracklogic/guide/',
    image: '/images/demos/soluciones-personales-card.webp',
    sourceGuidePath: 'C:\\Proyectos\\Track_logistic\\guide',
  },
];

export function getFunctionalDemo(id: string): FunctionalDemo | undefined {
  return functionalDemos.find((d) => d.id === id);
}
