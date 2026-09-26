const DEFAULTS = {
  bot_enabled: true,
  handoff_channel: 'baileys',
  advisor_phone: '+50685070818',
  twilio_account_sid: '',
  twilio_auth_token: '',
  twilio_whatsapp_from: '',
  welcome_message_es:
    'Hola, soy el asistente de CastleXpert. Puedo explicarte TrackLogic, Foodly, CMMS, migración Oracle y nuestros servicios. ¿En qué te ayudo?',
  welcome_message_en:
    "Hi, I'm CastleXpert's assistant. I can explain TrackLogic, Foodly, CMMS, Oracle migration, and our services. How can I help?",
};

export async function ensureWhatsAppConfigSchema(pool) {
  await pool.query(`
    create table if not exists whatsapp_bot_config (
      id int primary key default 1 check (id = 1),
      bot_enabled boolean not null default true,
      handoff_channel text not null default 'baileys',
      advisor_phone text not null default '',
      twilio_account_sid text not null default '',
      twilio_auth_token text not null default '',
      twilio_whatsapp_from text not null default '',
      welcome_message_es text not null default '',
      welcome_message_en text not null default '',
      updated_at timestamptz not null default now()
    );
  `);

  await pool.query(`
    create table if not exists whatsapp_bot_pauses (
      remote_jid text primary key,
      paused_until timestamptz,
      reason text,
      updated_at timestamptz not null default now()
    );
  `);

  const { rows } = await pool.query(`select id from whatsapp_bot_config where id = 1`);
  if (!rows.length) {
    await pool.query(
      `insert into whatsapp_bot_config (
        id, bot_enabled, handoff_channel, advisor_phone,
        twilio_account_sid, twilio_auth_token, twilio_whatsapp_from,
        welcome_message_es, welcome_message_en
      ) values (1, $1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        DEFAULTS.bot_enabled,
        DEFAULTS.handoff_channel,
        process.env.ADVISOR_WHATSAPP_TO?.replace(/^whatsapp:/i, '').trim() || DEFAULTS.advisor_phone,
        process.env.TWILIO_ACCOUNT_SID?.trim() || '',
        process.env.TWILIO_AUTH_TOKEN?.trim() || '',
        process.env.TWILIO_WHATSAPP_FROM?.trim() || '',
        DEFAULTS.welcome_message_es,
        DEFAULTS.welcome_message_en,
      ]
    );
  }
}

export async function getWhatsAppConfig(pool) {
  await ensureWhatsAppConfigSchema(pool);
  const { rows } = await pool.query(`select * from whatsapp_bot_config where id = 1`);
  const row = rows[0] || {};
  return {
    bot_enabled: row.bot_enabled ?? DEFAULTS.bot_enabled,
    handoff_channel: row.handoff_channel || DEFAULTS.handoff_channel,
    advisor_phone: row.advisor_phone || DEFAULTS.advisor_phone,
    twilio_account_sid: row.twilio_account_sid || '',
    twilio_auth_token: row.twilio_auth_token || '',
    twilio_whatsapp_from: row.twilio_whatsapp_from || '',
    welcome_message_es: row.welcome_message_es || DEFAULTS.welcome_message_es,
    welcome_message_en: row.welcome_message_en || DEFAULTS.welcome_message_en,
    updated_at: row.updated_at || null,
  };
}

/** Public-safe config (no secrets). */
export function publicWhatsAppConfig(cfg) {
  return {
    bot_enabled: Boolean(cfg.bot_enabled),
    handoff_channel: cfg.handoff_channel === 'twilio' ? 'twilio' : 'baileys',
    advisor_phone: cfg.advisor_phone || '',
    twilio_configured: Boolean(cfg.twilio_account_sid && cfg.twilio_auth_token && cfg.twilio_whatsapp_from),
    twilio_whatsapp_from: cfg.twilio_whatsapp_from || '',
    has_twilio_sid: Boolean(cfg.twilio_account_sid),
    has_twilio_token: Boolean(cfg.twilio_auth_token),
    welcome_message_es: cfg.welcome_message_es || '',
    welcome_message_en: cfg.welcome_message_en || '',
    updated_at: cfg.updated_at,
  };
}

export async function updateWhatsAppConfig(pool, patch = {}) {
  const current = await getWhatsAppConfig(pool);
  const next = {
    bot_enabled: patch.bot_enabled !== undefined ? Boolean(patch.bot_enabled) : current.bot_enabled,
    handoff_channel:
      patch.handoff_channel === 'twilio' || patch.handoff_channel === 'baileys'
        ? patch.handoff_channel
        : current.handoff_channel,
    advisor_phone:
      patch.advisor_phone !== undefined ? String(patch.advisor_phone).trim() : current.advisor_phone,
    twilio_account_sid:
      patch.twilio_account_sid !== undefined
        ? String(patch.twilio_account_sid).trim()
        : current.twilio_account_sid,
    twilio_auth_token:
      patch.twilio_auth_token !== undefined && String(patch.twilio_auth_token).trim() !== ''
        ? String(patch.twilio_auth_token).trim()
        : patch.twilio_auth_token === ''
          ? ''
          : current.twilio_auth_token,
    twilio_whatsapp_from:
      patch.twilio_whatsapp_from !== undefined
        ? String(patch.twilio_whatsapp_from).trim()
        : current.twilio_whatsapp_from,
    welcome_message_es:
      patch.welcome_message_es !== undefined
        ? String(patch.welcome_message_es)
        : current.welcome_message_es,
    welcome_message_en:
      patch.welcome_message_en !== undefined
        ? String(patch.welcome_message_en)
        : current.welcome_message_en,
  };

  await pool.query(
    `update whatsapp_bot_config set
      bot_enabled = $1,
      handoff_channel = $2,
      advisor_phone = $3,
      twilio_account_sid = $4,
      twilio_auth_token = $5,
      twilio_whatsapp_from = $6,
      welcome_message_es = $7,
      welcome_message_en = $8,
      updated_at = now()
     where id = 1`,
    [
      next.bot_enabled,
      next.handoff_channel,
      next.advisor_phone,
      next.twilio_account_sid,
      next.twilio_auth_token,
      next.twilio_whatsapp_from,
      next.welcome_message_es,
      next.welcome_message_en,
    ]
  );

  return getWhatsAppConfig(pool);
}

export async function isChatPaused(pool, remoteJid) {
  const { rows } = await pool.query(
    `select paused_until from whatsapp_bot_pauses where remote_jid = $1`,
    [remoteJid]
  );
  const until = rows[0]?.paused_until;
  if (!until) return false;
  return new Date(until).getTime() > Date.now();
}

export async function pauseChat(pool, remoteJid, hours = 24, reason = 'handoff') {
  const until = new Date(Date.now() + hours * 3600 * 1000);
  await pool.query(
    `insert into whatsapp_bot_pauses (remote_jid, paused_until, reason, updated_at)
     values ($1, $2, $3, now())
     on conflict (remote_jid) do update
       set paused_until = excluded.paused_until,
           reason = excluded.reason,
           updated_at = now()`,
    [remoteJid, until.toISOString(), reason]
  );
}

export async function resumeChat(pool, remoteJid) {
  await pool.query(`delete from whatsapp_bot_pauses where remote_jid = $1`, [remoteJid]);
}
