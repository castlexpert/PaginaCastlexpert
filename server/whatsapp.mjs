import twilio from 'twilio';

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
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

  const from = process.env.TWILIO_WHATSAPP_FROM?.trim(); // e.g. "whatsapp:+14155238886"
  const to = process.env.ADVISOR_WHATSAPP_TO?.trim(); // e.g. "whatsapp:+50685070818"
  if (!from || !to) {
    const err = new Error('Missing TWILIO_WHATSAPP_FROM or ADVISOR_WHATSAPP_TO.');
    err.code = 'NO_WHATSAPP_NUMBERS';
    throw err;
  }

  return await client.messages.create({ from, to, body });
}
