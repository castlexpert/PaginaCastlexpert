/**
 * Discover URLs from sitemap(s) and/or same-origin link crawl.
 */

function sameOrigin(a, b) {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

function normalizeUrl(href, base) {
  try {
    const u = new URL(href, base);
    u.hash = '';
    if (u.pathname !== '/' && u.pathname.endsWith('/')) u.pathname = u.pathname.replace(/\/+$/, '');
    return u.href;
  } catch {
    return null;
  }
}

function isHttpUrl(u) {
  return u.startsWith('http://') || u.startsWith('https://');
}

/** No seguir assets estáticos como si fueran “páginas”. */
const STATIC_PATH = /\.(css|js|mjs|map|json|pdf|zip|png|jpg|jpeg|gif|webp|svg|ico|woff2?|woff|ttf|eot|mp4|webm|wasm)$/i;

export function shouldIndexUrl(url) {
  try {
    const u = new URL(url);
    if (STATIC_PATH.test(u.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function fetchText(url, { signal, timeoutMs = 30000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: signal ?? controller.signal,
      headers: { 'User-Agent': 'CastleXpertSiteIndexer/1.0' },
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!/text\/html|application\/xhtml\+xml/i.test(ct) && !url.endsWith('.html')) {
      // still try to read (some servers mislabel)
    }
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function parseSitemapXml(xml) {
  const urls = new Set();
  let m;
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1]?.trim();
    if (u && isHttpUrl(u)) urls.add(u);
  }
  return [...urls];
}

/**
 * @param {string} baseUrl - e.g. https://castlexpert.com
 * @param {{ maxPages?: number, maxDepth?: number, onError?: (e:Error,ctx:string)=>void }} opts
 */
export async function discoverUrls(baseUrl, opts = {}) {
  const maxPages = opts.maxPages ?? 100;
  const onError = opts.onError ?? (() => {});

  const origin = new URL(baseUrl).origin;
  const found = new Set();
  const queue = [normalizeUrl(baseUrl, baseUrl)];

  const sitemapPaths = ['/sitemap.xml', '/sitemap_index.xml', '/sitemap_index.xml.gz'];

  for (const path of sitemapPaths) {
    const smUrl = normalizeUrl(path, baseUrl);
    if (!smUrl) continue;
    try {
      const xml = await fetchText(smUrl);
      const locs = parseSitemapXml(xml);
      for (const u of locs) {
        if (sameOrigin(u, baseUrl) && isHttpUrl(u) && shouldIndexUrl(u)) found.add(u);
      }
      // sitemap index: recurse into nested sitemaps
      if (path.includes('sitemap_index') && locs.some((u) => u.endsWith('.xml'))) {
        for (const nested of locs) {
          if (!nested.endsWith('.xml')) continue;
          if (!sameOrigin(nested, baseUrl)) continue;
          try {
            const nestedXml = await fetchText(nested);
            for (const u of parseSitemapXml(nestedXml)) {
              if (sameOrigin(u, baseUrl) && isHttpUrl(u) && shouldIndexUrl(u)) found.add(u);
            }
          } catch (e) {
            onError(e, `nested sitemap ${nested}`);
          }
        }
      }
    } catch (e) {
      onError(e, `sitemap ${smUrl}`);
    }
  }

  // BFS link crawl from homepage if we still have few URLs (SPA often has one route)
  const visited = new Set();
  while (queue.length && found.size < maxPages) {
    const next = queue.shift();
    if (!next || visited.has(next)) continue;
    visited.add(next);
    if (!sameOrigin(next, baseUrl)) continue;

    let html;
    try {
      html = await fetchText(next);
    } catch (e) {
      onError(e, `fetch ${next}`);
      continue;
    }

    found.add(next);
    if (found.size >= maxPages) break;

    // extract hrefs (cheap regex to avoid cheerio on huge docs twice – optional)
    const hrefRe = /href\s*=\s*["']([^"']+)["']/gi;
    let hm;
    while ((hm = hrefRe.exec(html)) !== null) {
      const abs = normalizeUrl(hm[1], next);
      if (!abs || !sameOrigin(abs, baseUrl)) continue;
      if (abs.includes('mailto:') || abs.includes('tel:')) continue;
      if (!shouldIndexUrl(abs)) continue;
      if (!found.has(abs) && !visited.has(abs) && queue.length < maxPages * 2) queue.push(abs);
    }
  }

  const list = [...found].filter(shouldIndexUrl).slice(0, maxPages);
  return { urls: list, origin };
}

/**
 * Descarga solo si el Content-Type parece HTML (evita indexar CSS/JS por error).
 */
export async function fetchPageHtml(url, opts) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 30000);
  try {
    const res = await fetch(url, {
      signal: opts?.signal ?? controller.signal,
      headers: { 'User-Agent': 'CastleXpertSiteIndexer/1.0', Accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!/text\/html|application\/xhtml\+xml/i.test(ct)) {
      throw new Error(`No es HTML (Content-Type: ${ct || 'vacío'})`);
    }
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}
