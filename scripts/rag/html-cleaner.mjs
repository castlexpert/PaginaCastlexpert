import { load } from 'cheerio';

const REMOVED = 'script, style, noscript, iframe, svg, template, object, embed, link[rel=stylesheet]';

/**
 * Remove scripts, styles and low-signal nodes; return mostly body text.
 */
export function cleanHtmlToText(html) {
  const $ = load(html, { decodeEntities: true });
  $(REMOVED).remove();
  $('nav, footer, header, [role="navigation"]').remove();
  const text = $('body').text() || $.root().text();
  return text
    .replace(/\s+/g, ' ')
    .replace(/\u00a0/g, ' ')
    .trim();
}

/**
 * Truncate for model input (keep head of page as proxy for "content").
 */
export function truncateText(text, maxChars = 12000) {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n[… recortado …]';
}
