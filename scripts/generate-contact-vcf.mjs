/**
 * Genera public/contacto.vcf con foto embebida (base64) para máxima compatibilidad al guardar contacto.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const logoPath = path.join(root, 'public', 'castlexpert-logo.png');
const outPath = path.join(root, 'public', 'contacto.vcf');

const siteUrl = (process.env.VITE_SITE_URL || 'https://castlexpert.com').replace(/\/$/, '');

const fullName = 'Deiby Castillo';
const familyName = 'Castillo';
const givenName = 'Deiby';
const title = 'Founder & CEO';
const org = 'CastleXpert';
const email = 'info@castlexpert.com';
const tel = '+50685070818';
const whatsapp = 'https://wa.me/50685070818';

/** Pliega líneas largas según RFC 2425 (75 octetos). */
function foldLine(line) {
  if (line.length <= 75) return line;
  const parts = [];
  parts.push(line.slice(0, 75));
  let i = 75;
  while (i < line.length) {
    parts.push(` ${line.slice(i, i + 74)}`);
    i += 74;
  }
  return parts.join('\r\n');
}

let photoLine = `PHOTO;VALUE=URI:${siteUrl}/castlexpert-logo.png`;
if (fs.existsSync(logoPath)) {
  const b64 = fs.readFileSync(logoPath).toString('base64');
  photoLine = foldLine(`PHOTO;ENCODING=b;TYPE=PNG:${b64}`);
}

const lines = [
  'BEGIN:VCARD',
  'VERSION:3.0',
  `FN:${fullName}`,
  `N:${familyName};${givenName};;;`,
  `TITLE:${title}`,
  `ORG:${org}`,
  `EMAIL;TYPE=WORK,INTERNET:${email}`,
  `TEL;TYPE=CELL,VOICE:${tel}`,
  `URL:${siteUrl}`,
  `item1.URL:${whatsapp}`,
  'item1.X-ABLabel:WhatsApp',
  `NOTE:CastleXpert — ${title}. Sitio: ${siteUrl}`,
  photoLine,
  'END:VCARD',
  '',
];

fs.writeFileSync(outPath, lines.join('\r\n'), 'utf8');
// eslint-disable-next-line no-console
console.log(`[vcf] wrote ${outPath} (${fs.statSync(outPath).size} bytes)`);
