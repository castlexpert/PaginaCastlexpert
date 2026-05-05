/**
 * Aviso por correo del formulario "Contáctenos".
 * Opciones (en orden):
 * 1) RESEND_API_KEY + RESEND_FROM → API Resend (recomendado en Railway).
 * 2) SMTP_HOST + SMTP_USER + SMTP_PASS → nodemailer.
 * Si no hay ninguno, no envía correo (el mensaje igual queda en Postgres).
 *
 * CONTACT_NOTIFY_TO: destinatarios separados por coma (ej. info@...,otro@...).
 */

function notifyRecipients() {
  const raw = process.env.CONTACT_NOTIFY_TO?.trim() || 'info@castlexpert.com,castlexpertcr@gmail.com';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function sendViaResend({ name, visitorEmail, message, recipients }) {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!key || !from) return { sent: false, skipped: true };

  const subject = `[CastleXpert] Nuevo mensaje de contacto — ${name}`;
  const text = [
    `Nombre: ${name}`,
    `Correo del visitante: ${visitorEmail}`,
    '',
    'Mensaje:',
    message,
  ].join('\n');

  const html = `
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Correo del visitante:</strong> <a href="mailto:${escapeHtml(visitorEmail)}">${escapeHtml(visitorEmail)}</a></p>
    <p><strong>Mensaje:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: visitorEmail,
      subject,
      text,
      html,
    }),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error('[mail] Resend error:', res.status, bodyText);
    const err = new Error(`Resend: ${bodyText || res.status}`);
    err.code = 'MAIL_RESEND_FAILED';
    throw err;
  }
  return { sent: true, provider: 'resend' };
}

async function sendViaSmtp({ name, visitorEmail, message, recipients }) {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return { sent: false, skipped: true };

  const port = Number(process.env.SMTP_PORT || '587');
  const secure =
    process.env.SMTP_SECURE === '1' ||
    process.env.SMTP_SECURE === 'true' ||
    port === 465;
  const from = process.env.SMTP_FROM?.trim() || `CastleXpert <${user}>`;

  const nodemailer = (await import('nodemailer')).default;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: recipients,
    replyTo: visitorEmail,
    subject: `[CastleXpert] Nuevo mensaje de contacto — ${name}`,
    text: [
      `Nombre: ${name}`,
      `Correo del visitante: ${visitorEmail}`,
      '',
      'Mensaje:',
      message,
    ].join('\n'),
    html: `
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Correo del visitante:</strong> <a href="mailto:${escapeHtml(visitorEmail)}">${escapeHtml(visitorEmail)}</a></p>
      <p><strong>Mensaje:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
    `,
  });

  return { sent: true, provider: 'smtp' };
}

/**
 * @returns {Promise<{ sent: boolean; skipped?: boolean; provider?: string }>}
 */
export async function notifyContactFormSubmission({ name, email, message }) {
  const recipients = notifyRecipients();
  if (!recipients.length) {
    // eslint-disable-next-line no-console
    console.warn('[mail] CONTACT_NOTIFY_TO vacío; no se envía correo.');
    return { sent: false, skipped: true };
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM?.trim();
  if (resendKey && resendFrom) {
    return await sendViaResend({ name, visitorEmail: email, message, recipients });
  }

  const smtp = await sendViaSmtp({ name, visitorEmail: email, message, recipients });
  if (smtp.sent) return smtp;

  // eslint-disable-next-line no-console
  console.warn('[mail] Ni Resend ni SMTP configurados; solo se guardó en base de datos.');
  return { sent: false, skipped: true };
}
