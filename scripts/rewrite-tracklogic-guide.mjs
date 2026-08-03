/**
 * Reescribe la guía TrackLogic con nombres/URLs públicos (sin PWA / API / SUPER_ADMIN).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targets = [
  path.resolve(__dirname, '../public/demos/tracklogic/guide/index.html'),
  'C:\\Proyectos\\Track_logistic\\guide\\index.html',
];

const URL_MANAGER = 'https://tracklogistic-manager.castlexpert.com';
const URL_CLIENT = 'https://tracklogistic.castlexpert.com';
const URL_LOGIC = 'https://tracklogistic-logic.castlexpert.com';

function transform(html) {
  let h = html;

  // Keep CastleXpert back-nav if present; strip then re-apply only on public copy later
  const navMatch = h.match(/<!-- cx-guide-nav -->[\s\S]*?<!-- \/cx-guide-nav -->\s*/);
  const nav = navMatch ? navMatch[0] : '';
  h = h.replace(/<!-- cx-guide-nav -->[\s\S]*?<!-- \/cx-guide-nav -->\s*/g, '');

  const reps = [
    [/PWA Clientes/g, 'Tracklogistic'],
    [/PWA Repartidores/g, 'Tracklogistic Logic'],
    [/PWA clientes/g, 'Tracklogistic'],
    [/PWA repartidores/g, 'Tracklogistic Logic'],
    [/desde la PWA/g, 'desde Tracklogistic'],
    [/en la PWA/g, 'en Tracklogistic'],
    [/la PWA/g, 'Tracklogistic'],
    [/\(PWA\)/g, ''],
    [/PWA/g, ''],
    [/SUPER_ADMIN/g, 'Administrador CastleXpert'],
    [/Super admin/gi, 'Administrador de CastleXpert'],
    [/super admin/gi, 'administrador de CastleXpert'],
    [/Web Manager/g, 'Tracklogistic Manager'],
    [/conectadas a la misma API/g, 'que trabajan juntas de punta a punta'],
    [/administración de tenants/g, 'administración de compañías'],
    [/crear tenants demo, ampliar trial, purgar/g, 'crear y administrar compañías'],
    [/lista pública de tenants activos/g, 'lista de compañías activas'],
    [/· Multitenant \(varias compañías\)/g, '· Varias compañías en una misma plataforma'],
  ];
  for (const [a, b] of reps) h = h.replace(a, b);
  h = h.replace(/ {2,}/g, ' ');
  h = h.replace(/ \(solo administrador de CastleXpert\) — crear y administrar compañías\./g,
    ' — el administrador de castlexpert.com crea y administra las compañías.');

  // TOC labels (after replacements)
  h = h.replace(
    /<li><a href="#manager">[^<]*<\/a><\/li>\s*<li><a href="#clientes">[^<]*<\/a><\/li>\s*<li><a href="#repartidores">[^<]*<\/a><\/li>/,
    `<li><a href="#manager">Tracklogistic Manager</a></li>
        <li><a href="#clientes">Tracklogistic</a></li>
        <li><a href="#repartidores">Tracklogistic Logic</a></li>`
  );

  // Summary cards
  h = h.replace(
    /<h3>Tracklogistic Manager<\/h3>\s*<p>\s*Panel de operaciones:[\s\S]*?<\/p>/,
    `<h3>Tracklogistic Manager</h3>
          <p>
            Panel de operaciones en escritorio: dashboard, mapa de clientes, bodega, paquetes, tarifas y usuarios.
            Acceso: <a href="${URL_MANAGER}" target="_blank" rel="noopener">tracklogistic-manager.castlexpert.com</a>
          </p>`
  );
  h = h.replace(
    /<h3>Tracklogistic<\/h3>\s*<p>\s*El cliente se registra[\s\S]*?<\/p>/,
    `<h3>Tracklogistic</h3>
          <p>
            El cliente se registra, ve su código, prealerta paquetes, consulta estado y recibe avisos.
            Acceso: <a href="${URL_CLIENT}" target="_blank" rel="noopener">tracklogistic.castlexpert.com</a>
          </p>`
  );
  h = h.replace(
    /<h3>Tracklogistic Logic<\/h3>\s*<p>\s*Entregas en ruta[\s\S]*?<\/p>/,
    `<h3>Tracklogistic Logic</h3>
          <p>
            Entregas en ruta (en camino / entregado) y escáner de bodega (peso, precio, código cliente).
            Acceso: <a href="${URL_LOGIC}" target="_blank" rel="noopener">tracklogistic-logic.castlexpert.com</a>
          </p>`
  );

  // Roles table
  h = h.replace(
    /<td><strong>Administrador CastleXpert<\/strong><\/td>\s*<td>Seed \/ plataforma CastleXpert<\/td>\s*<td>Tracklogistic Manager \(todas las compañías\)<\/td>/,
    `<td><strong>Administrador de CastleXpert</strong></td>
              <td>El administrador de castlexpert.com crea las compañías</td>
              <td>Tracklogistic Manager (todas las compañías)<br><a href="${URL_MANAGER}" target="_blank" rel="noopener">tracklogistic-manager.castlexpert.com</a></td>`
  );
  h = h.replace(
    /<td>Al crear compañía, o desde Usuarios<\/td>\s*<td>Tracklogistic Manager<\/td>/,
    `<td>Al crear compañía, o desde Usuarios</td>
              <td>Tracklogistic Manager<br><a href="${URL_MANAGER}" target="_blank" rel="noopener">tracklogistic-manager.castlexpert.com</a></td>`
  );
  h = h.replace(
    /Manager y\/o Tracklogistic Logic/g,
    `Tracklogistic Manager y/o Tracklogistic Logic<br><a href="${URL_LOGIC}" target="_blank" rel="noopener">tracklogistic-logic.castlexpert.com</a>`
  );
  h = h.replace(
    /<td>Auto-registro en Tracklogistic, o admin desde Clientes<\/td>\s*<td>Tracklogistic<\/td>/,
    `<td>Auto-registro en Tracklogistic, o admin desde Clientes</td>
              <td>Tracklogistic<br><a href="${URL_CLIENT}" target="_blank" rel="noopener">tracklogistic.castlexpert.com</a></td>`
  );

  h = h.replace(/Registro de un cliente\s*\(\s*\)/g, 'Registro de un cliente');
  h = h.replace(
    /Abrir <strong>Tracklogistic<\/strong> →/,
    `Abrir <strong>Tracklogistic</strong> (<a href="${URL_CLIENT}" target="_blank" rel="noopener">tracklogistic.castlexpert.com</a>) →`
  );
  h = h.replace(
    /Entrar como <strong>Admin<\/strong> a Tracklogistic Manager\./,
    `Entrar como <strong>Admin</strong> a Tracklogistic Manager (<a href="${URL_MANAGER}" target="_blank" rel="noopener">tracklogistic-manager.castlexpert.com</a>).`
  );

  // Section headings / copy cleanup
  h = h.replace(
    /<h2>Tracklogistic Manager<\/h2>\s*<p>\s*Centro de control[\s\S]*?<\/p>/,
    `<h2>Tracklogistic Manager</h2>
        <p>
          Centro de control para admins y asesores en
          <a href="${URL_MANAGER}" target="_blank" rel="noopener">tracklogistic-manager.castlexpert.com</a>.
          Pensado para usar en computadora (navegador). Incluye mapa, inventario, tarifas y administración de compañías.
        </p>`
  );
  h = h.replace(
    /<h2>Tracklogistic<\/h2>\s*<p>\s*App web instalable[\s\S]*?<\/p>/,
    `<h2>Tracklogistic</h2>
        <p>
          App para el teléfono del cliente final en
          <a href="${URL_CLIENT}" target="_blank" rel="noopener">tracklogistic.castlexpert.com</a>:
          registro, código de cliente, prealerta de tracking, seguimiento y notificaciones.
        </p>`
  );
  h = h.replace(
    /<h2>Tracklogistic Logic<\/h2>\s*<p>\s*Para personal de ruta[\s\S]*?<\/p>/,
    `<h2>Tracklogistic Logic</h2>
        <p>
          App para personal de ruta y bodega en
          <a href="${URL_LOGIC}" target="_blank" rel="noopener">tracklogistic-logic.castlexpert.com</a>:
          marcar entregas y escanear tracking al recibir mercancía (peso, precio y ligue a código de cliente).
        </p>`
  );

  h = h.replace(/Uso básico — Tracklogistic Logic/g, 'Uso básico — Tracklogistic Logic');
  h = h.replace(/Uso básico — \s*/g, 'Uso básico — ');

  h = h.replace(/1\. Cliente se registra \(\s*\)/g, '1. Cliente se registra (Tracklogistic)');
  h = h.replace(/3\. Bodega escanea \(\s*\)/g, '3. Bodega escanea (Tracklogistic Logic)');
  h = h.replace(
    /Administrador de CastleXpert \(si aplica\) crea nuevas compañías desde <strong>Compañías<\/strong>\./g,
    'El administrador de castlexpert.com crea las compañías desde <strong>Compañías</strong>.'
  );

  h = h.replace(
    /<div class="note">\s*URLs de producción[\s\S]*?<\/div>/,
    `<div class="note">
        Accesos de las aplicaciones:<br>
        · Manager: <a href="${URL_MANAGER}" target="_blank" rel="noopener">tracklogistic-manager.castlexpert.com</a><br>
        · Clientes (Tracklogistic): <a href="${URL_CLIENT}" target="_blank" rel="noopener">tracklogistic.castlexpert.com</a><br>
        · Operaciones / repartidores (Tracklogistic Logic): <a href="${URL_LOGIC}" target="_blank" rel="noopener">tracklogistic-logic.castlexpert.com</a>
      </div>`
  );

  h = h.replace(
    /<p style="margin:0\.4rem 0 0;font-size:0\.8rem">\s*Abrir: <code>guide\/index\.html<\/code>\s*<\/p>/,
    ''
  );

  // Restore nav only for public site file
  return { html: h, nav };
}

for (const file of targets) {
  if (!fs.existsSync(file)) {
    console.warn('skip missing', file);
    continue;
  }
  const { html, nav } = transform(fs.readFileSync(file, 'utf8'));
  let out = html;
  if (file.includes(`${path.sep}public${path.sep}demos${path.sep}`) && nav) {
    out = html.replace(/<body([^>]*)>/i, `<body$1>\n${nav}`);
  } else if (file.includes(`${path.sep}public${path.sep}demos${path.sep}`)) {
    // ensure body exists
  }
  // For source Track_logistic, don't inject CastleXpert sticky nav
  if (!file.includes(`${path.sep}public${path.sep}demos${path.sep}`)) {
    out = html; // without nav
  } else if (nav && !out.includes('cx-guide-nav')) {
    out = html.replace(/<body([^>]*)>/i, `<body$1>\n${nav}`);
  }

  fs.writeFileSync(file, out, 'utf8');
  const pwa = (out.match(/PWA/gi) || []).length;
  const api = (out.match(/\bAPI\b/g) || []).length;
  console.log('OK', file, { pwa, api });
}
