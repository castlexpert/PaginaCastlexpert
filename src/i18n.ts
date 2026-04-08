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
    mainTitle: string;
    mainItems: Array<{ title: string; description: string }>;
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{ title: string; description: string; number: string }>;
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
      mainTitle: 'Servicios Principales',
      mainItems: [
        { title: 'Desarrollo de apps Android', description: 'Aplicaciones nativas optimizadas para Android' },
        { title: 'Desarrollo de PWA', description: 'Apps web progresivas compatibles con iOS' },
        { title: 'Sitios web económicos', description: 'Presencia digital profesional para emprendedores' },
      ],
    },
    process: {
      title: '¿Cómo funciona?',
      subtitle: 'De la idea a la realidad en 4 simples pasos',
      steps: [
        { title: 'Idea', description: 'Cuéntanos qué necesitas. Nos reunimos contigo para entender tu visión.', number: '01' },
        { title: 'Diseño rápido', description: 'Creamos un prototipo funcional que puedes revisar y aprobar.', number: '02' },
        { title: 'Desarrollo ágil', description: 'Desarrollamos tu app con las mejores prácticas y tecnologías.', number: '03' },
        { title: 'Entrega + soporte', description: 'Recibe tu app lista para usar con soporte continuo incluido.', number: '04' },
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
      mainTitle: 'Main Services',
      mainItems: [
        { title: 'Android app development', description: 'Native applications optimized for Android' },
        { title: 'PWA development', description: 'Progressive web apps compatible with iOS' },
        { title: 'Affordable websites', description: 'Professional digital presence for entrepreneurs' },
      ],
    },
    process: {
      title: 'How does it work?',
      subtitle: 'From idea to reality in 4 simple steps',
      steps: [
        { title: 'Idea', description: 'Tell us what you need. We meet with you to understand your vision.', number: '01' },
        { title: 'Fast design', description: 'We create a functional prototype for you to review and approve.', number: '02' },
        { title: 'Agile development', description: 'We build your app with modern best practices and technology.', number: '03' },
        { title: 'Delivery + support', description: 'Receive your app ready to use with ongoing support included.', number: '04' },
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
