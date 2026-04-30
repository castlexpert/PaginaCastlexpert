#!/usr/bin/env node
/**
 * 1) Lee DATABASE_PUBLIC_URL (Postgres) y OPENAI_* del servicio web desde Railway CLI.
 * 2) Ejecuta `index-from-i18n.ts` (contenido desde src/i18n.ts: secciones + modales) contra esa base.
 * 3) Despliega el servicio web con `railway up --detach`.
 *
 * Requisito: `railway login` y proyecto enlazado (`railway link`).
 *
 * Uso:
 *   node scripts/rag/sync-index-and-deploy.mjs [BASE_URL]
 *   npm run sync:railway -- https://castlexpert.com
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

const BASE = process.argv[2] || process.env.SITE_BASE_URL || 'https://castlexpert.com';
const RAILWAY_ENV = process.env.RAILWAY_ENVIRONMENT || 'production';

function railwayJson(args) {
  const cmd = `railway ${args.join(' ')}`;
  try {
    return execSync(cmd, { encoding: 'utf8', cwd: projectRoot, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    const err = new Error(
      `Fallo ejecutando: ${cmd}\n${e.stderr?.toString?.() || e.message}\n¿Ejecutaste "railway login" y estás en la carpeta enlazada al proyecto?`
    );
    err.cause = e;
    throw err;
  }
}

function parseVariablesJson(stdout) {
  const raw = stdout.trim();
  if (!raw) return {};
  const j = JSON.parse(raw);
  if (Array.isArray(j)) {
    const out = {};
    for (const row of j) {
      const k = row.name ?? row.key;
      const v = row.value ?? row.val;
      if (k) out[k] = v;
    }
    return out;
  }
  if (typeof j === 'object' && j !== null) return j;
  return {};
}

function main() {
  const pgVars = parseVariablesJson(
    railwayJson(['variable', 'list', '--service', 'Postgres', '--environment', RAILWAY_ENV, '--json'])
  );
  const webVars = parseVariablesJson(
    railwayJson(['variable', 'list', '--service', 'PaginaCastlexpert', '--environment', RAILWAY_ENV, '--json'])
  );

  // Desde tu PC siempre usa la URL pública del Postgres (la interna no resuelve fuera de Railway).
  const dbUrl = pgVars.DATABASE_PUBLIC_URL || pgVars.DATABASE_URL;
  if (!dbUrl) {
    console.error('No encontré DATABASE_PUBLIC_URL ni DATABASE_URL en el servicio Postgres.');
    process.exit(1);
  }

  const openaiKey = webVars.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!openaiKey?.trim()) {
    console.error('No hay OPENAI_API_KEY en PaginaCastlexpert ni en el entorno local.');
    process.exit(1);
  }

  const env = {
    ...process.env,
    DATABASE_URL: dbUrl,
    OPENAI_API_KEY: openaiKey.trim(),
    OPENAI_MODEL: webVars.OPENAI_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    SITE_BASE_URL: BASE,
  };

  console.log('[sync] Indexando copy del proyecto (i18n + modales) hacia Postgres…');
  try {
    execSync('npx tsx scripts/rag/index-from-i18n.ts', {
      cwd: projectRoot,
      env,
      stdio: 'inherit',
      shell: true,
    });
  } catch (e) {
    console.error('[sync] Indexación i18n falló');
    process.exit(1);
  }

  console.log('[sync] railway up --detach …');
  execSync('railway up --detach', { cwd: projectRoot, stdio: 'inherit' });
  console.log('[sync] Listo.');
}

main();
