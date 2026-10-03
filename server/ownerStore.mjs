export async function ensureOwnerSchema(pool) {
  await pool.query(`
    create table if not exists owner_items (
      id bigserial primary key,
      kind text not null check (kind in ('task', 'note')),
      content text not null,
      done boolean not null default false,
      created_at timestamptz not null default now(),
      done_at timestamptz
    );
    create index if not exists owner_items_kind_idx on owner_items (kind, done, created_at desc);
  `);

  await pool.query(`
    create table if not exists owner_reminders (
      id bigserial primary key,
      message text not null,
      due_at timestamptz not null,
      sent_at timestamptz,
      created_at timestamptz not null default now()
    );
    create index if not exists owner_reminders_due_idx on owner_reminders (due_at) where sent_at is null;
  `);
}

export async function addItem(pool, kind, content) {
  const { rows } = await pool.query(
    `insert into owner_items (kind, content) values ($1, $2) returning id, kind, content, created_at`,
    [kind, String(content).trim().slice(0, 2000)]
  );
  return rows[0];
}

export async function listItems(pool, kind, includeDone = false) {
  const { rows } = await pool.query(
    `select id, kind, content, done, created_at, done_at
     from owner_items
     where kind = $1 and ($2::boolean or not done)
     order by created_at asc
     limit 100`,
    [kind, Boolean(includeDone)]
  );
  return rows;
}

export async function completeItem(pool, id) {
  const { rows } = await pool.query(
    `update owner_items set done = true, done_at = now()
     where id = $1 and kind = 'task'
     returning id, content`,
    [Number(id)]
  );
  return rows[0] || null;
}

export async function deleteItem(pool, id) {
  const { rows } = await pool.query(
    `delete from owner_items where id = $1 returning id, kind, content`,
    [Number(id)]
  );
  return rows[0] || null;
}

export async function addReminder(pool, message, dueAt) {
  const due = new Date(dueAt);
  if (Number.isNaN(due.getTime())) {
    throw new Error('Fecha inválida para el recordatorio.');
  }
  const { rows } = await pool.query(
    `insert into owner_reminders (message, due_at) values ($1, $2) returning id, message, due_at`,
    [String(message).trim().slice(0, 1000), due.toISOString()]
  );
  return rows[0];
}

export async function listPendingReminders(pool) {
  const { rows } = await pool.query(
    `select id, message, due_at from owner_reminders
     where sent_at is null
     order by due_at asc
     limit 50`
  );
  return rows;
}

export async function cancelReminder(pool, id) {
  const { rows } = await pool.query(
    `delete from owner_reminders where id = $1 and sent_at is null returning id, message, due_at`,
    [Number(id)]
  );
  return rows[0] || null;
}

export async function takeDueReminders(pool, limit = 20) {
  const { rows } = await pool.query(
    `select id, message, due_at from owner_reminders
     where sent_at is null and due_at <= now()
     order by due_at asc
     limit $1`,
    [limit]
  );
  return rows;
}

export async function markReminderSent(pool, id) {
  await pool.query(`update owner_reminders set sent_at = now() where id = $1`, [Number(id)]);
}
