import pg from 'pg';
import { KB_DOCS } from './kb.mjs';

const { Pool } = pg;

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL (Railway Postgres).');
  }
  return new Pool({ connectionString, ssl: process.env.PGSSLMODE === 'disable' ? false : undefined });
}

export async function ensureSchema(pool) {
  await pool.query(`
    create table if not exists kb_documents (
      id text primary key,
      language text not null,
      title text not null,
      content text not null,
      updated_at timestamptz not null default now()
    );

    create index if not exists kb_documents_language_idx on kb_documents(language);
  `);

  // Full-text search index (language-agnostic using 'simple' config).
  await pool.query(`
    create index if not exists kb_documents_fts_idx
      on kb_documents
      using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,'')));
  `);

  await pool.query(`
    create table if not exists chat_conversations (
      id text primary key,
      language text not null,
      created_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists chat_messages (
      id bigserial primary key,
      conversation_id text not null references chat_conversations(id) on delete cascade,
      role text not null,
      content text not null,
      created_at timestamptz not null default now()
    );

    create index if not exists chat_messages_conv_idx on chat_messages(conversation_id, created_at);
  `);

  await pool.query(`
    create table if not exists contact_messages (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      email text not null,
      message text not null,
      created_at timestamptz not null default now(),
      read boolean not null default false
    );

    create index if not exists contact_messages_created_idx on contact_messages (created_at desc);
  `);

  // Seed / upsert KB
  for (const doc of KB_DOCS) {
    await pool.query(
      `
      insert into kb_documents (id, language, title, content)
      values ($1, $2, $3, $4)
      on conflict (id) do update
        set language = excluded.language,
            title = excluded.title,
            content = excluded.content,
            updated_at = now()
    `,
      [doc.id, doc.language, doc.title, doc.content]
    );
  }
}

export async function ensureConversation(pool, conversationId, language) {
  await pool.query(
    `
    insert into chat_conversations (id, language)
    values ($1, $2)
    on conflict (id) do update set language = excluded.language
  `,
    [conversationId, language]
  );
}

export async function addMessage(pool, conversationId, role, content) {
  await pool.query(
    `insert into chat_messages (conversation_id, role, content) values ($1, $2, $3)`,
    [conversationId, role, content]
  );
}

export async function getRecentMessages(pool, conversationId, limit = 10) {
  const { rows } = await pool.query(
    `
      select role, content
      from chat_messages
      where conversation_id = $1
      order by created_at desc
      limit $2
    `,
    [conversationId, limit]
  );
  return rows.reverse();
}

export async function searchKb(pool, language, query, limit = 6) {
  // Full-text search with keyword OR to avoid overly-strict AND queries.
  const tokens = String(query)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .split(/\s+/g)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => t.length >= 4);

  const stop = new Set([
    'para',
    'como',
    'que',
    'qué',
    'esto',
    'esta',
    'este',
    'esos',
    'esas',
    'pero',
    'donde',
    'cuando',
    'with',
    'what',
    'how',
    'does',
    'work',
    'your',
    'about',
    'from',
    'this',
    'that',
    'they',
    'them',
  ]);

  const keywords = Array.from(new Set(tokens.filter((t) => !stop.has(t))));
  const tsQuery = keywords.length ? keywords[0] : String(query);

  const { rows } = await pool.query(
    `
      select id, title, content
      from kb_documents
      where language = $1
        and to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content,'')) @@ to_tsquery('simple', $2)
      order by updated_at desc
      limit $3
    `,
    [language, tsQuery, limit]
  );
  return rows;
}
