import twilio from 'twilio';

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
  return s;
}

function getTwilioClient() {
  const sid = cleanEnv(process.env.TWILIO_ACCOUNT_SID);
  const token = cleanEnv(process.env.TWILIO_AUTH_TOKEN);
  if (!sid || !token) return null;
  return twilio(sid, token);
}

export async function notifyAdvisor({ body }) {
  const client = getTwilioClient();
  if (!client) {
    const err = new Error('Missing Twilio credentials.');
    err.code = 'NO_TWILIO';
    throw err;
  }

  const from = normalizeWhatsAppAddress(process.env.TWILIO_WHATSAPP_FROM); // e.g. "whatsapp:+14155238886"
  const to = normalizeWhatsAppAddress(process.env.ADVISOR_WHATSAPP_TO); // e.g. "whatsapp:+50685070818"
  if (!from || !to) {
    const err = new Error('Missing TWILIO_WHATSAPP_FROM or ADVISOR_WHATSAPP_TO.');
    err.code = 'NO_WHATSAPP_NUMBERS';
    throw err;
  }

  const text = String(body ?? '')
    .replace(/\u0000/g, '')
    .slice(0, 3500);

  try {
    const msg = await client.messages.create({ from, to, body: text });
    return msg;
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
