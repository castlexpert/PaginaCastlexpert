const GUIDE_MODULES = [
  {
    id: 'index',
    href: 'index.html',
    num: '',
    title: 'Mapa de módulos',
    meta: 'Índice visual',
  },
  {
    id: '00-inicio',
    href: '00-inicio.html',
    num: '00',
    title: 'Acceso',
    meta: 'Portal y app',
  },
  {
    id: '01-dashboard',
    href: '01-dashboard.html',
    num: '01',
    title: 'Dashboard',
    meta: 'Portal',
  },
  {
    id: '02-catalogo',
    href: '02-catalogo.html',
    num: '02',
    title: 'Catálogo',
    meta: 'Portal',
  },
  {
    id: '03-bodegas',
    href: '03-bodegas.html',
    num: '03',
    title: 'Bodegas',
    meta: 'Portal',
  },
  {
    id: '04-centros-costo',
    href: '04-centros-costo.html',
    num: '04',
    title: 'Centros de costo',
    meta: 'Portal',
  },
  {
    id: '05-movimientos',
    href: '05-movimientos.html',
    num: '05',
    title: 'Movimientos',
    meta: 'Portal',
  },
  {
    id: '06-saldos',
    href: '06-saldos.html',
    num: '06',
    title: 'Saldos',
    meta: 'Portal',
  },
  {
    id: '07-tomas-fisicas',
    href: '07-tomas-fisicas.html',
    num: '07',
    title: 'Tomas físicas',
    meta: 'Portal',
  },
  {
    id: '08-app-bodega',
    href: '08-app-bodega.html',
    num: '08',
    title: 'App de bodega',
    meta: 'Flutter',
  },
  {
    id: '09-usuarios',
    href: '09-usuarios.html',
    num: '09',
    title: 'Usuarios y roles',
    meta: 'Portal',
  },
  {
    id: '10-empresas',
    href: '10-empresas.html',
    num: '10',
    title: 'Empresas y temas',
    meta: 'Super admin',
  },
  {
    id: '11-cmms',
    href: '11-cmms.html',
    num: '11',
    title: 'API CMMS',
    meta: 'Integración',
  },
];

function currentPageId() {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!file || file === 'guide' || file === '') return 'index';
  return file.replace(/\.html$/, '') || 'index';
}

function renderNav() {
  const mount = document.getElementById('guide-nav');
  if (!mount) return;
  const active = currentPageId();
  const items = GUIDE_MODULES.map((m) => {
    const isActive = m.id === active;
    return `<a class="item${isActive ? ' active' : ''}" href="${m.href}">
      <span class="num">${m.num || '•'}</span>
      <span><span class="label">${m.title}</span><span class="meta">${m.meta}</span></span>
    </a>`;
  }).join('');

  mount.innerHTML = `
    <div class="nav-brand">
      <strong>ERP Inventarios</strong>
      <span>Guía operativa</span>
      <small>Portal · App · API</small>
    </div>
    <div class="nav-section">Módulos</div>
    ${items}
  `;
}

function renderPager() {
  const mount = document.getElementById('guide-pager');
  if (!mount) return;
  const active = currentPageId();
  const idx = GUIDE_MODULES.findIndex((m) => m.id === active);
  if (idx < 0) return;
  const prev = GUIDE_MODULES[idx - 1];
  const next = GUIDE_MODULES[idx + 1];
  mount.innerHTML = `
    ${prev ? `<a href="${prev.href}">← ${prev.title}</a>` : '<span></span>'}
    ${next ? `<a href="${next.href}">${next.title} →</a>` : '<span></span>'}
  `;
}

function wireMobileNav() {
  const btn = document.getElementById('menu-btn');
  const overlay = document.getElementById('nav-overlay');
  const close = () => document.body.classList.remove('nav-open');
  btn?.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  overlay?.addEventListener('click', close);
  document.querySelectorAll('#guide-nav a').forEach((a) => a.addEventListener('click', close));
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderPager();
  wireMobileNav();
});
