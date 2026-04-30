import pg from 'pg';

const { Pool } = pg;

/** text-embedding-3-small default dimension */
const EMBEDDING_DIM = 1536;

function sslForConnectionString(connectionString) {
  if (process.env.PGSSLMODE === 'disable') return false;
  // Proxy público de Railway (y muchos entornos Windows) suelen requerir esto:
  if (process.env.PG_RAILWAY_INSECURE_SSL === '1') return { rejectUnauthorized: false };
  if (/shuttle\.proxy\.rlwy\.net|\.proxy\.rlwy\.net/i.test(connectionString)) {
    return { rejectUnauthorized: false };
  }
  return undefined;
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Missing DATABASE_URL');
  return new Pool({
    connectionString,
    ssl: sslForConnectionString(connectionString),
  });
}

export async function ensureRagSchema(pool) {
  await pool.query(`create extension if not exists vector`);

  await pool.query(`
    create table if not exists site_page_index (
      url text primary key,
      titulo text not null,
      descripcion text not null default '',
      secciones jsonb not null default '[]'::jsonb,
      embedding vector(${EMBEDDING_DIM}),
      updated_at timestamptz not null default now()
    )
  `);

  await pool.query(`
    create index if not exists site_page_index_embedding_idx
      on site_page_index using ivfflat (embedding vector_cosine_ops)
      with (lists = 100)
  `).catch(() => {
    // ivfflat puede fallar si hay pocas filas; ignorar
  });
}

/**
 * Upsert by URL (dedupe).
 * @param {object} row
 * @param {string} row.url
 * @param {string} row.titulo
 * @param {string} row.descripcion
 * @param {object[]} row.secciones
 * @param {number[]} row.embedding
 */
export async function upsertPage(pool, { url, titulo, descripcion, secciones, embedding }) {
  const secJson = JSON.stringify(secciones ?? []);
  await pool.query(
    `
    insert into site_page_index (url, titulo, descripcion, secciones, embedding, updated_at)
    values ($1, $2, $3, $4::jsonb, $5::vector, now())
    on conflict (url) do update set
      titulo = excluded.titulo,
      descripcion = excluded.descripcion,
      secciones = excluded.secciones,
      embedding = excluded.embedding,
      updated_at = now()
    `,
    [url, titulo, descripcion, secJson, formatVector(embedding)]
  );
}

function formatVector(arr) {
  return `[${arr.join(',')}]`;
}
