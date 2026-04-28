export type Language = 'es' | 'en';

export type AppCopy = {
  hero: {
    dockItems: Array<{ label: string; target: string }>;
    availability: string;
    badge: string;
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
    };
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; description: string; number: string; image?: string }>;
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
      title: 'Impulsa tu negocio con apps y sistemas a medida',
      description:
        'Diseñamos herramientas prácticas para el control de operaciones, automatización y crecimiento. Todo claro, rápido y adaptado a tu empresa.',
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
      subtitle: 'Herramientas poderosas para hacer crecer tu negocio',
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
          images: [],
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
          images: [],
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
      mainTitle: 'Servicios Principales',
      mainItems: [
        { title: 'Desarrollo de apps Android', description: 'Aplicaciones nativas optimizadas para Android' },
        { title: 'Desarrollo de PWA', description: 'Apps web progresivas compatibles con iOS' },
        { title: 'Sitios web económicos', description: 'Presencia digital profesional para emprendedores' },
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
          title: 'Sitios web económicos',
          description:
            'Un sitio moderno y claro que convierta visitas en clientes. Diseñamos páginas veloces, atractivas y enfocadas en resultados: credibilidad, llamadas a la acción y una presentación profesional de tus servicios.',
          highlights: [
            'Diseño moderno con enfoque en conversión.',
            'Optimización de velocidad y experiencia móvil.',
            'Estructura clara para mostrar servicios y contacto.',
            'SEO básico para que te encuentren.',
            'Escalable para agregar secciones o funcionalidades.',
          ],
          images: [],
        },
      ],
      modalLabels: {
        close: 'Cerrar',
        gallery: 'Imágenes',
        highlights: 'Lo que incluye',
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
      title: 'Grow your business with custom apps and systems',
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
      subtitle: 'Powerful tools to help your business grow',
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
          images: [],
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
          images: [],
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
      mainTitle: 'Main Services',
      mainItems: [
        { title: 'Android app development', description: 'Native applications optimized for Android' },
        { title: 'PWA development', description: 'Progressive web apps compatible with iOS' },
        { title: 'Affordable websites', description: 'Professional digital presence for entrepreneurs' },
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
          title: 'Affordable websites',
          description:
            'A modern, clean site that turns visitors into customers. We design fast pages focused on trust and conversion: strong messaging, clear calls to action, and a professional presentation of your services.',
          highlights: [
            'Modern design focused on conversion.',
            'Speed‑optimized and mobile‑first.',
            'Clear structure for services and contact.',
            'Basic SEO setup to get discovered.',
            'Easy to expand with new sections/features.',
          ],
          images: [],
        },
      ],
      modalLabels: {
        close: 'Close',
        gallery: 'Gallery',
        highlights: 'Highlights',
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
