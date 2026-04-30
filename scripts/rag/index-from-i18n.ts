/**
 * Indexa el contenido real del sitio desde src/i18n.ts (SPA: no depende del HTML vacío).
 * Genera un documento por sección + cada modal de servicios, principales y demos.
 */
import 'dotenv/config';
import type { AppCopy } from '../../src/i18n.ts';
import { copy } from '../../src/i18n.ts';
import { embedDocumentsBatch, embeddingInput } from './embeddings.mjs';
import { ensureRagSchema, getPool, upsertPage } from './db-rag.mjs';

const SITE_EMAIL = 'info@castlexpert.com';
const SITE_WHATSAPP = '+506 85070818';

export type IndexDoc = {
  url: string;
  titulo: string;
  descripcion: string;
  secciones: { titulo: string; descripcion: string }[];
};

function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);
}

function highlightsToSecciones(highlights: string[], lang: 'es' | 'en') {
  const p = lang === 'es' ? 'Punto' : 'Point';
  return highlights.map((h, i) => ({ titulo: `${p} ${i + 1}`, descripcion: h }));
}

function buildDocuments(c: AppCopy, lang: 'es' | 'en', base: string): IndexDoc[] {
  const docs: IndexDoc[] = [];
  const L = lang;

  const hash = (part: string) => `${base}/#${L}-${part}`;

  docs.push({
    url: hash(`inicio`),
    titulo: `${L === 'es' ? 'Inicio' : 'Home'} — ${c.hero.title}`,
    descripcion: [
      c.hero.badge,
      c.hero.architectureBadge,
      c.hero.description,
      c.hero.availability,
      c.hero.recommendation,
      `${c.hero.revenueLabel}: ${c.hero.growthStat}`,
      c.hero.activeClients,
    ]
      .filter(Boolean)
      .join(' '),
    secciones: c.hero.dockItems.map((d) => ({
      titulo: d.label,
      descripcion: `${L === 'es' ? 'Sección' : 'Section'} #${d.target}`,
    })),
  });

  docs.push({
    url: hash(`proceso`),
    titulo: c.process.title,
    descripcion: c.process.subtitle,
    secciones: c.process.steps.map((s) => ({
      titulo: `${s.number} ${s.title}`,
      descripcion: s.description,
    })),
  });

  docs.push({
    url: hash(`servicios-resumen`),
    titulo: c.services.title,
    descripcion: c.services.subtitle,
    secciones: c.services.items.map((i) => ({ titulo: i.title, descripcion: i.description })),
  });

  c.services.items.forEach((item, i) => {
    const modal = c.services.itemModals[i];
    if (!modal) return;
    const imgNote =
      modal.images?.length > 0
        ? `\n${L === 'es' ? 'Galería' : 'Gallery'}: ${modal.images.join(', ')}`
        : '';
    docs.push({
      url: hash(`modal-servicio-${i}-${slug(modal.title)}`),
      titulo: `${L === 'es' ? 'Modal — Servicio' : 'Modal — Service'}: ${modal.title}`,
      descripcion: modal.description + imgNote,
      secciones: highlightsToSecciones(modal.highlights, L),
    });
  });

  docs.push({
    url: hash(`servicios-principales`),
    titulo: c.services.mainTitle,
    descripcion: c.services.mainItems.map((m) => `${m.title}: ${m.description}`).join('\n'),
    secciones: c.services.mainItems.map((m) => ({ titulo: m.title, descripcion: m.description })),
  });

  c.services.mainItems.forEach((item, i) => {
    const modal = c.services.mainModals[i];
    if (!modal) return;
    docs.push({
      url: hash(`modal-principal-${i}-${slug(modal.title)}`),
      titulo: `${L === 'es' ? 'Modal — Principal' : 'Modal — Main'}: ${modal.title}`,
      descripcion: modal.description,
      secciones: highlightsToSecciones(modal.highlights, L),
    });
  });

  docs.push({
    url: hash(`demos`),
    titulo: c.services.demos.title,
    descripcion: c.services.demos.subtitle,
    secciones: c.services.demos.items.map((i) => ({ titulo: i.title, descripcion: i.description })),
  });

  c.services.demos.items.forEach((item, i) => {
    const modal = c.services.demos.modals[i];
    if (!modal) return;
    const links =
      modal.links?.map((l) => `${l.label}${l.url?.trim() ? `: ${l.url}` : ` (${L === 'es' ? 'pendiente' : 'pending'})`}`).join('; ') ||
      '';
    docs.push({
      url: hash(`modal-demo-${i}-${slug(modal.title)}`),
      titulo: `${L === 'es' ? 'Modal — Demo' : 'Modal — Demo'}: ${modal.title}`,
      descripcion: [modal.description, links ? `${L === 'es' ? 'Enlaces' : 'Links'}: ${links}` : ''].filter(Boolean).join('\n'),
      secciones: highlightsToSecciones(modal.highlights, L),
    });
  });

  docs.push({
    url: hash(`beneficios`),
    titulo: c.benefits.title,
    descripcion: c.benefits.subtitle,
    secciones: c.benefits.items.map((i) => ({ titulo: i.title, descripcion: i.description })),
  });

  docs.push({
    url: hash(`beneficios-cta`),
    titulo: c.benefits.ctaTitle,
    descripcion: [c.benefits.ctaDescription, c.benefits.ctaButton].join(' — '),
    secciones: [{ titulo: c.benefits.ctaButton, descripcion: c.benefits.ctaDescription }],
  });

  docs.push({
    url: hash(`contacto`),
    titulo: c.contact.title,
    descripcion: [
      c.contact.subtitle,
      `${c.contact.emailLabel}: ${SITE_EMAIL}`,
      `${c.contact.whatsappLabel}: ${SITE_WHATSAPP}`,
    ].join('\n'),
    secciones: [
      { titulo: c.contact.emailLabel, descripcion: SITE_EMAIL },
      { titulo: c.contact.whatsappLabel, descripcion: SITE_WHATSAPP },
      { titulo: c.contact.form.submit, descripcion: c.contact.form.success },
    ],
  });

  docs.push({
    url: hash(`acerca`),
    titulo: c.about.title,
    descripcion: c.about.paragraphs.join('\n\n'),
    secciones: c.about.paragraphs.map((p, i) => ({
      titulo: `${L === 'es' ? 'Texto' : 'Copy'} ${i + 1}`,
      descripcion: p,
    })),
  });

  docs.push({
    url: hash(`chat-ui`),
    titulo: L === 'es' ? 'Chat del sitio' : 'Site chat',
    descripcion: [c.chat.title, c.chat.subtitle, c.chat.welcome].join('\n'),
    secciones: [
      { titulo: c.chat.askAdvisor, descripcion: c.chat.phonePlaceholder },
    ],
  });

  docs.push({
    url: hash(`pie`),
    titulo: L === 'es' ? 'Pie de página' : 'Footer',
    descripcion: c.footer.description,
    secciones: [
      { titulo: c.footer.linksTitle, descripcion: `${c.footer.aboutLink}, ${c.footer.servicesLink}, ${c.footer.contactLink}` },
      { titulo: 'castlexpert.com', descripcion: c.footer.followUs },
    ],
  });

  docs.push({
    url: hash(`whatsapp`),
    titulo: 'WhatsApp',
    descripcion: c.whatsapp.tooltip,
    secciones: [{ titulo: SITE_WHATSAPP, descripcion: c.whatsapp.tooltip }],
  });

  return docs;
}

async function main() {
  const base = process.env.SITE_BASE_URL?.trim() || 'https://castlexpert.com';

  const pool = getPool();
  await ensureRagSchema(pool);

  const docs: IndexDoc[] = [...buildDocuments(copy.es, 'es', base), ...buildDocuments(copy.en, 'en', base)];

  console.log(`[index-i18n] ${docs.length} documentos (${docs.length / 2} por idioma aprox.)`);

  const texts = docs.map((d) =>
    embeddingInput({
      titulo: d.titulo,
      descripcion: d.descripcion,
      secciones: d.secciones,
    })
  );

  const embeddings = await embedDocumentsBatch(texts);

  let ok = 0;
  for (let i = 0; i < docs.length; i++) {
    await upsertPage(pool, {
      url: docs[i].url,
      titulo: docs[i].titulo,
      descripcion: docs[i].descripcion,
      secciones: docs[i].secciones,
      embedding: embeddings[i],
    });
    ok++;
    console.log(`[ok] ${docs[i].url}`);
  }

  console.log(`[index-i18n] listo: ${ok} filas en site_page_index`);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
