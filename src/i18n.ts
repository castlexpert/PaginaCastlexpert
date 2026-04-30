export type Language = 'es' | 'en';

export type AppCopy = {
  hero: {
    dockItems: Array<{ label: string; target: string }>;
    availability: string;
    badge: string;
    architectureBadge: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    processCta: string;
    recommendation: string;
    revenueLabel: string;
    growthStat: string;
    activeClients: string;
    navCta: string;
    languageButton: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; description: string }>;
    itemModals: Array<{
      title: string;
      description: string;
      highlights: string[];
      images: string[];
    }>;
    mainTitle: string;
    mainItems: Array<{ title: string; description: string }>;
    mainModals: Array<{
      title: string;
      description: string;
      highlights: string[];
      images: string[];
    }>;
    modalLabels: {
      close: string;
      gallery: string;
      highlights: string;
      links: string;
      open: string;
    };
    demos: {
      title: string;
      subtitle: string;
      items: Array<{ title: string; description: string }>;
      modals: Array<{
        title: string;
        description: string;
        highlights: string[];
        images: string[];
        links: Array<{ label: string; url: string }>;
      }>;
    };
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; description: string; number: string; image?: string }>;
  };
  about: {
    title: string;
    paragraphs: [string, string, string];
    close: string;
  };
  chat: {
    launcherLabel: string;
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    sending: string;
    askAdvisor: string;
    phoneLabel: string;
    phonePlaceholder: string;
    advisorSent: string;
    advisorError: string;
    assistantName: string;
    welcome: string;
  };
  benefits: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; description: string }>;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  contact: {
    title: string;
    subtitle: string;
    emailLabel: string;
    whatsappLabel: string;
    form: {
      name: string;
      email: string;
      message: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      success: string;
      error: string;
    };
  };
  footer: {
    description: string;
    linksTitle: string;
    aboutLink: string;
    servicesLink: string;
    contactLink: string;
    followUs: string;
    rights: string;
  };
  whatsapp: {
    tooltip: string;
  };
};

export const copy: Record<Language, AppCopy> = {
  es: {
    hero: {
      dockItems: [
        { label: 'Inicio', target: 'top' },
        { label: 'Servicios', target: 'services' },
        { label: 'Proceso', target: 'process' },
        { label: 'Contacto', target: 'contact' },
      ],
      availability: 'Disponible para trabajar',
      badge: 'Soluciones móviles premium',
      architectureBadge: 'Arquitectura de Aplicaciones',
      title: 'Diseño de Apps y Arquitectura Digital',
      description:
        'Diseñamos herramientas prácticas para empresas y proyectos personales, automatizando procesos y potenciando su crecimiento.',
      primaryCta: 'Empezar proyecto',
      secondaryCta: 'Ver servicios',
      processCta: '¿Cómo funciona?',
      recommendation: 'Recomendado por clientes en Costa Rica',
      revenueLabel: 'Ingresos',
      growthStat: '+34% de crecimiento operativo en 90 días',
      activeClients: 'Únete a 1,000+ clientes activos',
      navCta: 'Empezar',
      languageButton: 'EN',
    },
    services: {
      title: 'Nuestras Soluciones',
      subtitle: 'Apps, sistemas y arquitectura web para hacer crecer tu negocio',
      items: [
        { title: 'Microapps de seguimiento', description: 'Apps ligeras para rastrear lo que necesites en tiempo real' },
        { title: 'Control de inventarios', description: 'Gestiona tu stock de forma eficiente desde cualquier lugar' },
        { title: 'Control de órdenes', description: 'Administra pedidos y entregas de manera organizada' },
        { title: 'Órdenes de trabajo', description: 'Asigna y da seguimiento a tareas y proyectos' },
        { title: 'Control de empleados', description: 'Gestiona asistencia, horarios y productividad' },
        { title: 'Control de gastos e ingresos', description: 'Lleva tu contabilidad al día con reportes automáticos' },
        { title: 'Planeamiento a futuro', description: 'Organiza eventos, citas y objetivos empresariales' },
        { title: 'Notificaciones automáticas', description: 'Recibe alertas importantes en tiempo real' },
        { title: 'Reportes inteligentes', description: 'Analiza datos y toma mejores decisiones' },
        { title: 'Arquitectura web escalable', description: 'Diseño de plataformas para alto volumen y pymes en crecimiento' },
        { title: 'Consulta de tipo de cambio', description: 'Información actualizada de divisas en tu app' },
      ],
      itemModals: [
        {
          title: 'Microapps de seguimiento',
          description:
            'Convierte el “control” en una rutina simple. Creamos microapps rápidas y claras para registrar, consultar y dar seguimiento a lo que importa en tu negocio: entregas, visitas, mantenimiento, ventas, cobros o cualquier proceso repetitivo. Ideal para equipos en calle y operación diaria.',
          highlights: [
            'Registro en segundos: formularios simples y rápidos.',
            'Historial y búsqueda para encontrar información al instante.',
            'Filtros por fecha, estado, cliente, ruta o responsable.',
            'Notificaciones y recordatorios para no dejar tareas pendientes.',
            'Diseñadas para crecer: se pueden escalar a un sistema completo.',
          ],
          images: [
            '/services/microapps/microapps-1.webp',
            '/services/microapps/microapps-2.webp',
            '/services/microapps/microapps-3.webp',
            '/services/microapps/microapps-4.webp',
          ],
        },
        {
          title: 'Control de inventarios',
          description:
            'Evita pérdidas y toma decisiones con datos reales. Te damos un inventario moderno para saber qué tienes, dónde está y cuándo reponerlo, con un flujo súper simple para entradas, salidas, ajustes y conteos. Menos “enredos”, más control.',
          highlights: [
            'Stock por producto y por ubicación (bodega/sucursal).',
            'Alertas por mínimo y productos de alta rotación.',
            'Movimientos: entradas, salidas, devoluciones y ajustes.',
            'Conteos cíclicos y auditoría para control total.',
            'Reportes para compras y proyección de demanda.',
          ],
          images: [
            '/services/inventory/inventory-1.webp',
            '/services/inventory/inventory-2.webp',
            '/services/inventory/inventory-3.webp',
            '/services/inventory/inventory-4.webp',
          ],
        },
        {
          title: 'Control de órdenes',
          description:
            'Deja de depender de chats y notas sueltas. Centraliza tus pedidos y entregas en un solo lugar: crea órdenes, asigna responsables, define estados y consulta el avance en tiempo real. Un proceso ordenado se siente en la experiencia del cliente.',
          highlights: [
            'Estados claros: recibido, en proceso, enviado, entregado.',
            'Asignación de responsables y rutas de entrega.',
            'Notas, fotos y evidencias por orden.',
            'Historial por cliente y por fecha.',
            'Panel rápido para operación diaria.',
          ],
          images: [
            '/services/orders/orders-1.webp',
            '/services/orders/orders-2.webp',
            '/services/orders/orders-3.webp',
            '/services/orders/orders-4.webp',
          ],
        },
        {
          title: 'Órdenes de trabajo',
          description:
            'Perfecto para mantenimiento, instalaciones y servicios técnicos. Gestiona tareas con un flujo profesional: asignación, checklist, evidencias y cierre, todo desde el celular. Así tu equipo trabaja con orden y tu cliente nota la diferencia.',
          highlights: [
            'Asignación por técnico y calendario de visitas.',
            'Checklists por tipo de servicio.',
            'Fotos antes/después y firma/confirmación (opcional).',
            'Tiempo invertido y control de materiales (opcional).',
            'Historial por cliente, equipo o ubicación.',
          ],
          images: [],
        },
        {
          title: 'Control de empleados',
          description:
            'Haz más simple la administración del equipo. Registra asistencia, turnos y productividad de manera práctica, sin procesos pesados. Ideal para cuadrillas, operaciones en campo o equipos distribuidos.',
          highlights: [
            'Asistencia, horarios y turnos por colaborador.',
            'Permisos, vacaciones y observaciones (opcional).',
            'Asignación de tareas y seguimiento de avance.',
            'Reportes por semana/mes para control interno.',
            'Acceso por roles para cuidar la información.',
          ],
          images: [],
        },
        {
          title: 'Control de gastos e ingresos',
          description:
            'Ordena tus finanzas sin complicarte. Registra gastos e ingresos al momento, clasifica por categoría y revisa reportes claros para entender en qué se va el dinero y qué está funcionando. Ideal para emprendedores y pymes.',
          highlights: [
            'Registro rápido desde el celular con categorías.',
            'Reportes por periodos (día, semana, mes).',
            'Comparación de ingresos vs gastos y tendencias.',
            'Exportable para contabilidad (opcional).',
            'Alertas y metas para mantenerte en control.',
          ],
          images: [],
        },
        {
          title: 'Planeamiento a futuro',
          description:
            'Pasa de “apagar fuegos” a planificar. Te damos una herramienta para programar eventos, citas, metas y tareas clave, con recordatorios y vistas claras. Ideal para ventas, operaciones y proyectos.',
          highlights: [
            'Calendario con recordatorios automáticos.',
            'Seguimiento de metas y tareas por responsable.',
            'Notas y adjuntos por evento (opcional).',
            'Vistas por semana/mes para planificación real.',
            'Historial para medir consistencia y resultados.',
          ],
          images: [],
        },
        {
          title: 'Notificaciones automáticas',
          description:
            'Haz que el sistema trabaje por ti. Configuramos avisos y recordatorios para pagos, vencimientos, tareas, inventario o cualquier evento importante. Menos seguimiento manual, más eficiencia.',
          highlights: [
            'Recordatorios por fecha, estado o condiciones.',
            'Mensajes internos y notificaciones push (según app).',
            'Alertas por inventario mínimo y pendientes.',
            'Plantillas de mensajes para consistencia.',
            'Menos errores: el sistema te avisa a tiempo.',
          ],
          images: [],
        },
        {
          title: 'Reportes inteligentes',
          description:
            'No es “tener datos”; es tener claridad. Creamos paneles y reportes fáciles de entender para que tomes decisiones rápidas: ventas, tiempos, órdenes, inventario y desempeño. La información que necesitas, cuando la necesitas.',
          highlights: [
            'Dashboard con métricas clave (KPI) personalizadas.',
            'Filtros por periodo, cliente, producto o zona.',
            'Tendencias y comparaciones para ver crecimiento.',
            'Exportación y envío (opcional) de reportes.',
            'Reportes pensados para acción, no solo números.',
          ],
          images: [],
        },
        {
          title: 'Arquitectura web escalable',
          description:
            'Diseñamos la arquitectura técnica de tu sitio o plataforma para soportar crecimiento real: más usuarios, más transacciones y más procesos sin perder rendimiento. Desde una pyme hasta operaciones de alto volumen, planificamos estructura, módulos, seguridad y escalabilidad desde el inicio.',
          highlights: [
            'Arquitectura modular para crecer por fases.',
            'Diseño orientado a rendimiento y alta concurrencia.',
            'Buenas prácticas de seguridad, estabilidad y monitoreo.',
            'Integraciones con APIs, pagos, ERP o sistemas existentes.',
            'Base técnica sólida para evolución continua.',
          ],
          images: [],
        },
        {
          title: 'Consulta de tipo de cambio',
          description:
            'Si cobras o compras en diferentes monedas, integrar el tipo de cambio te da control y transparencia. Incorporamos consultas actualizadas y cálculos automáticos para tus precios, cobros o reportes.',
          highlights: [
            'Consulta de tipo de cambio actualizada.',
            'Conversión automática en órdenes o reportes (opcional).',
            'Historial para auditoría y análisis.',
            'Configuración simple según tu necesidad.',
            'Mejor experiencia para clientes y para tu equipo.',
          ],
          images: [],
        },
      ],
      mainTitle: 'Servicios Principales y Arquitectura Web',
      mainItems: [
        { title: 'Desarrollo de apps Android', description: 'Aplicaciones nativas optimizadas para Android' },
        { title: 'Desarrollo de PWA', description: 'Apps web progresivas compatibles con iOS' },
        { title: 'Arquitectura de sitios web', description: 'Plataformas para empresas de alto volumen y emprendimientos pymes' },
      ],
      mainModals: [
        {
          title: 'Desarrollo de apps Android',
          description:
            'Apps nativas pensadas para rendimiento y experiencia de usuario. Diseñamos soluciones que se sienten rápidas, modernas y confiables, con flujos claros para tu operación y escalabilidad para crecer con tu negocio.',
          highlights: [
            'Experiencia fluida y optimizada para Android.',
            'Integración con notificaciones, cámara, GPS y más.',
            'Diseño UI/UX profesional para conversión y uso diario.',
            'Publicación y acompañamiento en el ciclo de vida.',
            'Evolución por fases: MVP → versión completa.',
          ],
          images: [],
        },
        {
          title: 'Desarrollo de PWA',
          description:
            'Una app que se abre desde el navegador, se puede “instalar” y funciona en iOS/Android sin tiendas. Ideal para lanzar rápido, reducir costos y tener presencia moderna con excelente compatibilidad.',
          highlights: [
            'Compatible con iOS y Android desde un solo desarrollo.',
            'Rápida, ligera y lista para compartir por link.',
            'Experiencia tipo app: pantalla completa e instalación.',
            'Actualizaciones inmediatas sin esperar revisiones.',
            'Excelente opción para MVP y expansión.',
          ],
          images: [],
        },
        {
          title: 'Arquitectura de sitios web',
          description:
            'Diseñamos la arquitectura web ideal para tu etapa de negocio: desde emprendedores y pymes que necesitan lanzar rápido, hasta empresas que requieren estructura robusta para alto tráfico, catálogos grandes o flujos complejos.',
          highlights: [
            'Arquitectura web para pymes y operaciones de alto volumen.',
            'Estructura escalable para módulos, integraciones y crecimiento.',
            'Optimización de velocidad, disponibilidad y experiencia móvil.',
            'Diseño orientado a conversión y objetivos comerciales.',
            'Base preparada para evolucionar sin rehacer todo.',
          ],
          images: [],
        },
      ],
      modalLabels: {
        close: 'Cerrar',
        gallery: 'Imágenes',
        highlights: 'Lo que incluye',
        links: 'Demos',
        open: 'Abrir',
      },
      demos: {
        title: 'DEMOS',
        subtitle: 'Ejemplos para visualizar cómo se vería tu solución antes de implementarla.',
        items: [
          { title: 'Soluciones Personales', description: 'Demos para uso individual: control, organización y productividad.' },
          { title: 'Soluciones Familiares', description: 'Demos pensados para el hogar: coordinación, recordatorios y control.' },
          { title: 'Soluciones Empresa', description: 'Demos para operaciones empresariales: procesos, reportes y control.' },
          { title: 'Soluciones PYME', description: 'Demos ideales para pymes: herramientas simples que escalan contigo.' },
        ],
        modals: [
          {
            title: 'Soluciones Personales',
            description:
              'Prueba demos diseñados para ayudarte a organizarte, dar seguimiento a tareas y mantener tu día a día bajo control. Ideales para validar la idea rápido y ver cómo una app puede simplificar tus hábitos.',
            highlights: [
              'Flujos simples para registrar y consultar información.',
              'Interfaz rápida y enfocada en productividad.',
              'Listo para evolucionar a una app completa.',
            ],
            images: [],
            links: [
              { label: 'Demo Web', url: '' },
              { label: 'APK (Android)', url: '' },
            ],
          },
          {
            title: 'Soluciones Familiares',
            description:
              'Demos orientados a coordinación familiar: recordatorios, listas, organización de actividades y control compartido. Perfectos para visualizar una solución fácil de usar por todos.',
            highlights: [
              'Enfoque en simplicidad y comunicación.',
              'Recordatorios y organización por categorías.',
              'Pensado para uso en móvil.',
            ],
            images: [],
            links: [
              { label: 'Demo Web', url: '' },
              { label: 'APK (Android)', url: '' },
            ],
          },
          {
            title: 'Soluciones Empresa',
            description:
              'Demos para procesos empresariales: seguimiento de operaciones, orden, reportes y visibilidad. Útiles para ver cómo se estructura un sistema para equipos y roles.',
            highlights: [
              'Paneles y estados para control operativo.',
              'Reportes claros para decisiones rápidas.',
              'Base sólida para crecer por módulos.',
            ],
            images: [],
            links: [
              { label: 'Demo Web', url: '' },
              { label: 'APK (Android)', url: '' },
            ],
          },
          {
            title: 'Soluciones PYME',
            description:
              'Demos pensados para pymes: herramientas prácticas para controlar inventario, órdenes, gastos y tareas sin complejidad. Ideales para empezar con lo esencial y escalar luego.',
            highlights: [
              'Implementación rápida tipo MVP.',
              'Enfoque en ahorro de tiempo y control.',
              'Escalable: agrega funcionalidades cuando lo necesites.',
            ],
            images: [],
            links: [
              { label: 'Demo Web', url: '' },
              { label: 'APK (Android)', url: '' },
            ],
          },
        ],
      },
    },
    process: {
      title: '¿Cómo funciona?',
      subtitle: 'De la idea a la realidad en 4 simples pasos',
      steps: [
        { title: 'Idea', description: 'Cuéntanos qué necesitas. Nos reunimos contigo para entender tu visión.', number: '01', image: '/process/idea.webp' },
        { title: 'Diseño rápido', description: 'Creamos un prototipo funcional que puedes revisar y aprobar.', number: '02', image: '/process/design.webp' },
        { title: 'Desarrollo ágil', description: 'Desarrollamos tu app con las mejores prácticas y tecnologías.', number: '03', image: '/process/develop.webp' },
        { title: 'Entrega + soporte', description: 'Recibe tu app lista para usar con soporte continuo incluido.', number: '04', image: '/process/delivery.webp' },
      ],
    },
    about: {
      title: 'Acerca de',
      paragraphs: [
        'Castlexpert nace de una amplia experiencia liderando proyectos tecnológicos, desarrollando soluciones empresariales y diseñando sistemas de alto rendimiento.',
        'Hoy llevamos ese conocimiento al siguiente nivel mediante plataformas modernas, automatización inteligente y herramientas digitales orientadas a resultados reales.',
        'No solo desarrollamos software. Creamos ventajas competitivas.',
      ],
      close: 'Cerrar',
    },
    chat: {
      launcherLabel: 'Abrir chat',
      title: 'Chat CastleXpert',
      subtitle: 'Pregúntame sobre nuestros servicios y proceso.',
      placeholder: 'Escribe tu pregunta...',
      send: 'Enviar',
      sending: 'Enviando...',
      askAdvisor: 'Hablar con un asesor por WhatsApp',
      phoneLabel: 'Tu WhatsApp (opcional)',
      phonePlaceholder: '+506 85070818',
      advisorSent: 'Listo. Un asesor fue notificado por WhatsApp.',
      advisorError: 'No se pudo contactar al asesor. Intenta de nuevo.',
      assistantName: 'Asistente',
      welcome:
        'Hola, soy el asistente de CastleXpert. Puedo ayudarte con información sobre servicios, demos y el proceso. ¿Qué te gustaría saber?',
    },
    benefits: {
      title: 'Beneficios',
      subtitle: 'Ventajas que transformarán tu forma de trabajar',
      items: [
        { title: 'Todo en tu celular', description: 'Accede a tu información desde cualquier lugar, en cualquier momento.' },
        { title: 'Información organizada', description: 'Mantén todos tus datos estructurados y fáciles de consultar.' },
        { title: 'Acceso en la nube', description: 'Tus datos seguros y sincronizados automáticamente.' },
        { title: 'Automatización de tareas', description: 'Ahorra tiempo con procesos inteligentes y notificaciones.' },
        { title: 'Bajo costo', description: 'Soluciones accesibles diseñadas para emprendedores y pequeñas empresas.' },
      ],
      ctaTitle: '¿Listo para digitalizar tu negocio?',
      ctaDescription: 'Únete a las empresas que ya están optimizando sus operaciones con nuestras soluciones móviles.',
      ctaButton: 'Comienza ahora',
    },
    contact: {
      title: 'Contáctanos',
      subtitle: 'Cuéntanos sobre tu proyecto y te responderemos lo antes posible',
      emailLabel: 'Correo electrónico',
      whatsappLabel: 'WhatsApp',
      form: {
        name: 'Nombre',
        email: 'Correo electrónico',
        message: 'Mensaje',
        namePlaceholder: 'Tu nombre',
        emailPlaceholder: 'tu@email.com',
        messagePlaceholder: 'Cuéntanos sobre tu proyecto...',
        submit: 'Enviar mensaje',
        sending: 'Enviando...',
        success: 'Mensaje enviado con éxito. Te contactaremos pronto.',
        error: 'Hubo un error al enviar el mensaje. Intenta nuevamente.',
      },
    },
    footer: {
      description: 'Soluciones móviles inteligentes para tu día a día y tu negocio.',
      linksTitle: 'Enlaces rápidos',
      aboutLink: 'Acerca de',
      servicesLink: 'Servicios',
      contactLink: 'Contacto',
      followUs: 'Síguenos',
      rights: 'Todos los derechos reservados.',
    },
    whatsapp: {
      tooltip: 'Chatea con nosotros',
    },
  },
  en: {
    hero: {
      dockItems: [
        { label: 'Home', target: 'top' },
        { label: 'Services', target: 'services' },
        { label: 'Process', target: 'process' },
        { label: 'Contact', target: 'contact' },
      ],
      availability: 'Available for work',
      badge: 'Premium mobile solutions',
      architectureBadge: 'Application Architecture',
      title: 'Grow your business with custom apps, systems, and digital architecture',
      description:
        'We design practical tools for operations control, automation, and growth. Everything is clear, fast, and tailored to your business.',
      primaryCta: 'Start project',
      secondaryCta: 'View services',
      processCta: 'How does it work?',
      recommendation: 'Recommended by clients in Costa Rica',
      revenueLabel: 'Revenue',
      growthStat: '+34% operational growth in 90 days',
      activeClients: 'Join 1,000+ active clients',
      navCta: 'Get started',
      languageButton: 'ES',
    },
    services: {
      title: 'Our Solutions',
      subtitle: 'Apps, systems, and web architecture to grow your business',
      items: [
        { title: 'Tracking microapps', description: 'Lightweight apps to track whatever you need in real time' },
        { title: 'Inventory control', description: 'Manage your stock efficiently from anywhere' },
        { title: 'Order management', description: 'Organize requests and deliveries with clarity' },
        { title: 'Work orders', description: 'Assign and track tasks and projects' },
        { title: 'Employee control', description: 'Manage attendance, schedules, and productivity' },
        { title: 'Income and expense tracking', description: 'Keep your accounting up to date with automatic reports' },
        { title: 'Future planning', description: 'Organize events, appointments, and business goals' },
        { title: 'Automatic notifications', description: 'Receive important alerts in real time' },
        { title: 'Smart reports', description: 'Analyze data and make better decisions' },
        { title: 'Scalable web architecture', description: 'Platform design for high-volume companies and growing SMBs' },
        { title: 'Exchange rate lookup', description: 'Up-to-date currency information inside your app' },
      ],
      itemModals: [
        {
          title: 'Tracking microapps',
          description:
            'Turn day‑to‑day control into a simple habit. We build fast, focused microapps to record, search, and follow up on what matters: deliveries, visits, maintenance, sales, collections, and any repeating workflow. Perfect for field teams and daily operations.',
          highlights: [
            'Capture data in seconds with streamlined forms.',
            'Instant search and history for quick answers.',
            'Filters by date, status, customer, route, or owner.',
            'Reminders and notifications to keep work moving.',
            'Built to scale: start small, grow into a full system.',
          ],
          images: [
            '/services/microapps/microapps-1.webp',
            '/services/microapps/microapps-2.webp',
            '/services/microapps/microapps-3.webp',
            '/services/microapps/microapps-4.webp',
          ],
        },
        {
          title: 'Inventory control',
          description:
            'Reduce losses and make decisions with real data. Get a modern inventory flow to know what you have, where it is, and when to restock—without complicated steps. Simple in, out, adjustments, and counts with clear reporting.',
          highlights: [
            'Stock by product and location (warehouse/branch).',
            'Low‑stock alerts and fast‑moving items insights.',
            'Movements: inbound, outbound, returns, adjustments.',
            'Cycle counts and audit trail for full control.',
            'Reports that support smarter purchasing.',
          ],
          images: [
            '/services/inventory/inventory-1.webp',
            '/services/inventory/inventory-2.webp',
            '/services/inventory/inventory-3.webp',
            '/services/inventory/inventory-4.webp',
          ],
        },
        {
          title: 'Order management',
          description:
            'Stop relying on scattered chats and notes. Centralize orders and deliveries in one place: create orders, assign owners, track statuses, and see progress in real time. A cleaner process means a better customer experience.',
          highlights: [
            'Clear statuses: received, in progress, shipped, delivered.',
            'Assign owners and delivery routes.',
            'Notes, photos, and proof per order.',
            'Customer history and date‑based tracking.',
            'Fast daily operations board.',
          ],
          images: [
            '/services/orders/orders-1.webp',
            '/services/orders/orders-2.webp',
            '/services/orders/orders-3.webp',
            '/services/orders/orders-4.webp',
          ],
        },
        {
          title: 'Work orders',
          description:
            'Ideal for maintenance, installations, and technical services. Manage tasks like a pro: assignments, checklists, evidence, and closure—right from mobile. Your team stays organized and your customers feel the difference.',
          highlights: [
            'Assign by technician and schedule visits.',
            'Service‑type checklists and quality steps.',
            'Before/after photos and confirmation (optional).',
            'Time tracking and materials control (optional).',
            'History by customer, asset, or location.',
          ],
          images: [],
        },
        {
          title: 'Employee control',
          description:
            'Make team administration easier. Track attendance, shifts, and productivity with practical flows—without heavy HR tools. Great for crews, field operations, or distributed teams.',
          highlights: [
            'Attendance, schedules, and shift planning.',
            'Permissions, vacations, and notes (optional).',
            'Task assignments and progress tracking.',
            'Weekly/monthly summaries for better control.',
            'Role‑based access to protect sensitive data.',
          ],
          images: [],
        },
        {
          title: 'Income and expense tracking',
          description:
            'Get financial clarity without headaches. Log income and expenses on the go, categorize instantly, and review clean reports to understand what’s working and where money is going. Perfect for entrepreneurs and small businesses.',
          highlights: [
            'Quick mobile logging with categories.',
            'Reports by day, week, and month.',
            'Income vs expenses and trend views.',
            'Export options for accounting (optional).',
            'Goals and alerts to stay on track.',
          ],
          images: [],
        },
        {
          title: 'Future planning',
          description:
            'Move from “putting out fires” to planning ahead. Organize events, appointments, goals, and key tasks with reminders and clear views. Great for sales, operations, and projects.',
          highlights: [
            'Calendar with automatic reminders.',
            'Goals and tasks by owner.',
            'Notes and attachments per event (optional).',
            'Weekly/monthly views for real planning.',
            'History to measure consistency and results.',
          ],
          images: [],
        },
        {
          title: 'Automatic notifications',
          description:
            'Let the system work for you. Set up reminders for payments, deadlines, tasks, inventory, and any important event. Less manual follow‑up, more efficiency—and fewer missed items.',
          highlights: [
            'Triggers by date, status, and conditions.',
            'Internal messages and push notifications (as needed).',
            'Low‑stock and pending work alerts.',
            'Message templates for consistent communication.',
            'Fewer errors: get notified on time.',
          ],
          images: [],
        },
        {
          title: 'Smart reports',
          description:
            'Data is only useful when it brings clarity. We build dashboards and reports that are easy to understand and action‑oriented: sales, timings, orders, inventory, and performance. Get answers fast and make confident decisions.',
          highlights: [
            'Custom KPI dashboards for your business.',
            'Filters by period, customer, product, or area.',
            'Trends and comparisons to track growth.',
            'Export and scheduled sending (optional).',
            'Reports designed for action—not just numbers.',
          ],
          images: [],
        },
        {
          title: 'Scalable web architecture',
          description:
            'We design your website or platform architecture to support real growth: more users, more transactions, and more workflows without losing performance. From small businesses to high-volume operations, we define modules, security, integrations, and scalability from day one.',
          highlights: [
            'Modular architecture that scales by phases.',
            'Performance-first design for high concurrency.',
            'Security, stability, and monitoring best practices.',
            'API/payment/ERP integrations as needed.',
            'Strong technical foundation for long-term growth.',
          ],
          images: [],
        },
        {
          title: 'Exchange rate lookup',
          description:
            'If you buy or sell in multiple currencies, exchange‑rate integration brings control and transparency. We can add updated rates and automatic calculations for pricing, orders, and reporting.',
          highlights: [
            'Up‑to‑date exchange rate lookup.',
            'Automatic conversion in orders/reports (optional).',
            'History for auditing and analysis.',
            'Simple configuration to match your needs.',
            'Better experience for both customers and staff.',
          ],
          images: [],
        },
      ],
      mainTitle: 'Main Services and Web Architecture',
      mainItems: [
        { title: 'Android app development', description: 'Native applications optimized for Android' },
        { title: 'PWA development', description: 'Progressive web apps compatible with iOS' },
        { title: 'Website architecture', description: 'Platforms for high-volume companies and SMB entrepreneurship' },
      ],
      mainModals: [
        {
          title: 'Android app development',
          description:
            'High‑performance native apps designed for real business workflows. We build experiences that feel fast, modern, and reliable—ready to grow with your operations and future features.',
          highlights: [
            'Smooth, optimized experience for Android.',
            'Integrations: notifications, camera, GPS, and more.',
            'Professional UI/UX to drive adoption and results.',
            'Support through launch and ongoing improvements.',
            'Phase approach: MVP → full product.',
          ],
          images: [],
        },
        {
          title: 'PWA development',
          description:
            'An app‑like experience delivered through the web. PWAs can be installed, shared by link, and run on iOS/Android without app stores—ideal to launch fast and keep costs efficient.',
          highlights: [
            'Works on iOS and Android with one build.',
            'Fast, lightweight, and easy to share.',
            'App‑like UX with installable behavior.',
            'Instant updates without store approvals.',
            'Great for MVPs and scaling later.',
          ],
          images: [],
        },
        {
          title: 'Website architecture',
          description:
            'We design the right web architecture for your business stage: from entrepreneurs and SMBs that need to launch quickly, to high-volume companies that require robust structures for traffic, catalogs, and complex workflows.',
          highlights: [
            'Web architecture for SMBs and high-volume operations.',
            'Scalable structure for modules, integrations, and growth.',
            'Speed, availability, and mobile-first optimization.',
            'Design aligned with conversion and business goals.',
            'Foundation ready to evolve without full rebuilds.',
          ],
          images: [],
        },
      ],
      modalLabels: {
        close: 'Close',
        gallery: 'Gallery',
        highlights: 'Highlights',
        links: 'Demos',
        open: 'Open',
      },
      demos: {
        title: 'DEMOS',
        subtitle: 'Quick examples to visualize your solution before building the full product.',
        items: [
          { title: 'Personal Solutions', description: 'Individual-focused demos for organization and productivity.' },
          { title: 'Family Solutions', description: 'Household demos for coordination, reminders, and shared control.' },
          { title: 'Business Solutions', description: 'Operational demos for teams, workflows, and reporting.' },
          { title: 'SMB Solutions', description: 'Small-business demos: simple tools that scale as you grow.' },
        ],
        modals: [
          {
            title: 'Personal Solutions',
            description:
              'Explore demos designed to help you stay organized, track tasks, and keep daily routines under control. Ideal to validate the idea quickly and see how an app can simplify habits.',
            highlights: [
              'Fast flows to capture and review information.',
              'Clean UI focused on productivity.',
              'Ready to evolve into a full app.',
            ],
            images: [],
            links: [
              { label: 'Web demo', url: '' },
              { label: 'APK (Android)', url: '' },
            ],
          },
          {
            title: 'Family Solutions',
            description:
              'Demos built for family coordination: reminders, lists, shared activities, and simple organization. Great to visualize a solution that everyone can use easily.',
            highlights: [
              'Simple and friendly experience.',
              'Reminders and categorized organization.',
              'Designed mobile-first.',
            ],
            images: [],
            links: [
              { label: 'Web demo', url: '' },
              { label: 'APK (Android)', url: '' },
            ],
          },
          {
            title: 'Business Solutions',
            description:
              'Operational demos for teams: tracking, status flows, reporting, and visibility. Useful to see how a system is structured with roles and shared processes.',
            highlights: [
              'Operational boards and clear statuses.',
              'Actionable reporting for quick decisions.',
              'Solid base to scale by modules.',
            ],
            images: [],
            links: [
              { label: 'Web demo', url: '' },
              { label: 'APK (Android)', url: '' },
            ],
          },
          {
            title: 'SMB Solutions',
            description:
              'Demos for small businesses: practical tools for inventory, orders, expenses, and tasks—without complexity. Start with the essentials and scale when you are ready.',
            highlights: [
              'Fast MVP-style rollout.',
              'Focus on saving time and gaining control.',
              'Scalable: add features as needed.',
            ],
            images: [],
            links: [
              { label: 'Web demo', url: '' },
              { label: 'APK (Android)', url: '' },
            ],
          },
        ],
      },
    },
    process: {
      title: 'How does it work?',
      subtitle: 'From idea to reality in 4 simple steps',
      steps: [
        { title: 'Idea', description: 'Tell us what you need. We meet with you to understand your vision.', number: '01', image: '/process/idea.webp' },
        { title: 'Fast design', description: 'We create a functional prototype for you to review and approve.', number: '02', image: '/process/design.webp' },
        { title: 'Agile development', description: 'We build your app with modern best practices and technology.', number: '03', image: '/process/develop.webp' },
        { title: 'Delivery + support', description: 'Receive your app ready to use with ongoing support included.', number: '04', image: '/process/delivery.webp' },
      ],
    },
    about: {
      title: 'About',
      paragraphs: [
        'CastleXpert is born from broad experience leading technology projects, building business solutions, and designing high-performance systems.',
        'Today, we take that knowledge to the next level through modern platforms, intelligent automation, and digital tools focused on real outcomes.',
        'We do not just build software. We create competitive advantages.',
      ],
      close: 'Close',
    },
    chat: {
      launcherLabel: 'Open chat',
      title: 'CastleXpert Chat',
      subtitle: 'Ask about our services and process.',
      placeholder: 'Type your question...',
      send: 'Send',
      sending: 'Sending...',
      askAdvisor: 'Talk to an advisor via WhatsApp',
      phoneLabel: 'Your WhatsApp (optional)',
      phonePlaceholder: '+506 85070818',
      advisorSent: 'Done. An advisor was notified via WhatsApp.',
      advisorError: 'Could not reach the advisor. Please try again.',
      assistantName: 'Assistant',
      welcome:
        "Hi, I'm CastleXpert's assistant. I can help with info about services, demos, and the process. What would you like to know?",
    },
    benefits: {
      title: 'Benefits',
      subtitle: 'Advantages that will transform how you work',
      items: [
        { title: 'Everything on your phone', description: 'Access your information from anywhere, anytime.' },
        { title: 'Organized information', description: 'Keep all your data structured and easy to consult.' },
        { title: 'Cloud access', description: 'Your data stays secure and automatically synchronized.' },
        { title: 'Task automation', description: 'Save time with smart processes and notifications.' },
        { title: 'Low cost', description: 'Accessible solutions designed for entrepreneurs and small businesses.' },
      ],
      ctaTitle: 'Ready to digitize your business?',
      ctaDescription: 'Join the companies already optimizing their operations with our mobile solutions.',
      ctaButton: 'Start now',
    },
    contact: {
      title: 'Contact us',
      subtitle: 'Tell us about your project and we will get back to you as soon as possible',
      emailLabel: 'Email',
      whatsappLabel: 'WhatsApp',
      form: {
        name: 'Name',
        email: 'Email',
        message: 'Message',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'you@email.com',
        messagePlaceholder: 'Tell us about your project...',
        submit: 'Send message',
        sending: 'Sending...',
        success: 'Message sent successfully. We will contact you soon.',
        error: 'There was an error sending your message. Please try again.',
      },
    },
    footer: {
      description: 'Smart mobile solutions for your daily operations and your business.',
      linksTitle: 'Quick links',
      aboutLink: 'About',
      servicesLink: 'Services',
      contactLink: 'Contact',
      followUs: 'Follow us',
      rights: 'All rights reserved.',
    },
    whatsapp: {
      tooltip: 'Chat with us',
    },
  },
};
