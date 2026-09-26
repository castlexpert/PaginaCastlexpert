import twilio from 'twilio';
import { getWhatsAppConfig } from './whatsappConfig.mjs';
import { notifyAdvisorViaBaileys } from './baileysWhatsApp.mjs';

function cleanEnv(value) {
  if (!value) return '';
  return String(value).replace(/\u200b|\u200c|\u200d|\ufeff/g, '').trim();
}

/** Twilio expects `whatsapp:+E164` for Messaging API. */
function normalizeWhatsAppAddress(raw) {
  let s = cleanEnv(raw);
  if (!s) return '';
  if (/^whatsapp:/i.test(s)) return s;
  const digits = s.replace(/\s/g, '');
  if (/^\+\d{10,15}$/.test(digits)) return `whatsapp:${digits}`;
  if (/^\d{10,15}$/.test(digits)) return `whatsapp:+${digits}`;
  return s;
}

function isValidWhatsAppAddress(addr) {
  return /^whatsapp:\+\d{10,15}$/i.test(String(addr || '').trim());
}

// Twilio WhatsApp body hard-limit is 1600 chars. Keep buffer for prefixes.
const WHATSAPP_MAX_BODY = 1550;

function splitWhatsAppBody(text) {
  const s = String(text ?? '').replace(/\u0000/g, '');
  if (s.length <= WHATSAPP_MAX_BODY) return [s];

  const chunks = [];
  let rest = s;
  while (rest.length > 0) {
    if (rest.length <= WHATSAPP_MAX_BODY) {
      chunks.push(rest);
      break;
    }

    const window = rest.slice(0, WHATSAPP_MAX_BODY + 1);
    const nl = window.lastIndexOf('\n');
    const cut = nl > Math.floor(WHATSAPP_MAX_BODY * 0.6) ? nl : WHATSAPP_MAX_BODY;
    chunks.push(rest.slice(0, cut).trimEnd());
    rest = rest.slice(cut).trimStart();
  }
  return chunks.filter(Boolean);
}

async function notifyViaTwilio({ body, config }) {
  const sid = cleanEnv(config.twilio_account_sid) || cleanEnv(process.env.TWILIO_ACCOUNT_SID);
  const token = cleanEnv(config.twilio_auth_token) || cleanEnv(process.env.TWILIO_AUTH_TOKEN);
  if (!sid || !token) {
    const err = new Error('Missing Twilio credentials (configure in WAdministrativo or env).');
    err.code = 'NO_TWILIO';
    throw err;
  }

  const from = normalizeWhatsAppAddress(
    config.twilio_whatsapp_from || process.env.TWILIO_WHATSAPP_FROM
  );
  const to = normalizeWhatsAppAddress(config.advisor_phone || process.env.ADVISOR_WHATSAPP_TO);
  if (!from || !to) {
    const err = new Error('Missing Twilio from/to WhatsApp numbers.');
    err.code = 'NO_WHATSAPP_NUMBERS';
    throw err;
  }
  if (!isValidWhatsAppAddress(from) || !isValidWhatsAppAddress(to)) {
    const err = new Error(
      'Invalid WhatsApp sender/recipient. Expected "whatsapp:+E164".'
    );
    err.code = 'NO_WHATSAPP_NUMBERS';
    throw err;
  }

  const client = twilio(sid, token);
  const parts = splitWhatsAppBody(body);

  try {
    const results = [];
    for (let i = 0; i < parts.length; i += 1) {
      const prefix = parts.length > 1 ? `[${i + 1}/${parts.length}]\n` : '';
      const payload = `${prefix}${parts[i]}`.slice(0, WHATSAPP_MAX_BODY);
      // eslint-disable-next-line no-await-in-loop
      const msg = await client.messages.create({ from, to, body: payload });
      results.push(msg);
    }
    return results[results.length - 1] ?? null;
  } catch (e) {
    const twilioCode = e?.code;
    const twilioStatus = e?.status;
    const detail = e?.message || String(e);
    // eslint-disable-next-line no-console
    console.error('[twilio] messages.create failed:', { twilioCode, twilioStatus, detail });
    const err = new Error(`Twilio: ${detail}${twilioCode != null ? ` (code ${twilioCode})` : ''}`);
    err.code = 'TWILIO_REST_ERROR';
    err.twilioCode = twilioCode;
    err.twilioStatus = twilioStatus;
    throw err;
  }
}

/**
 * Notify advisor about a chatbot handoff.
 * Default channel: Baileys (connected business WhatsApp).
 * Optional: Twilio if handoff_channel === 'twilio' in config.
 */
export async function notifyAdvisor({ body, db }) {
  const config = db ? await getWhatsAppConfig(db) : null;
  const channel = config?.handoff_channel || process.env.WA_HANDOFF_CHANNEL || 'baileys';

  if (channel === 'twilio') {
    return notifyViaTwilio({ body, config: config || {} });
  }

  if (!db) {
    const err = new Error('Database required for Baileys handoff.');
    err.code = 'WA_NOT_CONNECTED';
    throw err;
  }

  try {
    return await notifyAdvisorViaBaileys(db, { body });
  } catch (e) {
    if (e?.code === 'WA_NOT_CONNECTED' || e?.code === 'WA_BAD_RECIPIENT') {
      throw e;
    }
    const err = new Error(e?.message || 'Baileys handoff failed');
    err.code = e?.code || 'WA_SEND_ERROR';
    throw err;
  }
}
