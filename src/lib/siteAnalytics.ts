import { getAdminAnalyticsBaseUrl } from './publicApi';
import { hasStoredCookieConsent } from '../components/CookieBanner';

const VISITOR_KEY = 'cx_analytics_visitor_v1';
const SESSION_KEY = 'cx_analytics_session_v1';
const LANDING_KEY = 'cx_analytics_landing_v1';

type TrackProps = Record<string, unknown>;

type QueuedEvent = {
  eventName: string;
  path?: string;
  title?: string;
  referrer?: string;
  properties?: TrackProps;
  occurredAt: string;
};

let queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let enabled = false;
let lastPathTracked = '';
let clickTrackingBound = false;
let lastClickKey = '';
let lastClickAt = 0;

function randomId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function readStorage(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function getVisitorId(): string {
  const existing = readStorage(localStorage, VISITOR_KEY);
  if (existing) return existing;
  const id = randomId('v');
  writeStorage(localStorage, VISITOR_KEY, id);
  return id;
}

function getSessionId(): string {
  const existing = readStorage(sessionStorage, SESSION_KEY);
  if (existing) return existing;
  const id = randomId('s');
  writeStorage(sessionStorage, SESSION_KEY, id);
  return id;
}

function getLandingPath(currentPath: string): string {
  const existing = readStorage(sessionStorage, LANDING_KEY);
  if (existing) return existing;
  writeStorage(sessionStorage, LANDING_KEY, currentPath || '/');
  return currentPath || '/';
}

function utmFromSearch(search: string) {
  const params = new URLSearchParams(search || '');
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || ''
  };
}

function screenInfo() {
  if (typeof window === 'undefined') return {};
  return {
    screenWidth: window.screen?.width || window.innerWidth || undefined,
    screenHeight: window.screen?.height || window.innerHeight || undefined
  };
}

async function flush() {
  if (!enabled || queue.length === 0) return;
  const base = getAdminAnalyticsBaseUrl();
  if (!base) return;

  const batch = queue.splice(0, 25);
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const utm = utmFromSearch(search);

  try {
    await fetch(`${base}/api/public/analytics/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        language: typeof navigator !== 'undefined' ? navigator.language : '',
        landingPath: getLandingPath(path),
        referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
        ...utm,
        ...screenInfo(),
        events: batch
      }),
      keepalive: true
    });
  } catch {
    queue = [...batch, ...queue].slice(0, 50);
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, 400);
}

function cleanLabel(raw: string) {
  return raw.replace(/\s+/g, ' ').trim().slice(0, 120);
}

function findTrackableTarget(start: EventTarget | null): HTMLElement | null {
  if (!(start instanceof Element)) return null;
  const el = start.closest(
    'button, a[href], [role="button"], input[type="submit"], input[type="button"], [data-track]'
  );
  return el instanceof HTMLElement ? el : null;
}

function describeClick(el: HTMLElement) {
  const tag = el.tagName.toLowerCase();
  const dataTrack = el.getAttribute('data-track');
  const aria = el.getAttribute('aria-label');
  const title = el.getAttribute('title');
  const text = cleanLabel(el.innerText || el.textContent || '');
  const href = el instanceof HTMLAnchorElement ? el.href : el.getAttribute('href') || '';
  const id = el.id ? `#${el.id}` : '';
  const name = el.getAttribute('name') || '';

  const label =
    cleanLabel(dataTrack || '') ||
    cleanLabel(aria || '') ||
    cleanLabel(title || '') ||
    text ||
    cleanLabel(name) ||
    cleanLabel(href) ||
    `${tag}${id}` ||
    tag;

  return {
    label,
    element: tag,
    href: href ? href.slice(0, 500) : '',
    id: el.id || '',
    trackId: dataTrack || ''
  };
}

function onDocumentClick(ev: MouseEvent) {
  if (!hasStoredCookieConsent()) return;
  const el = findTrackableTarget(ev.target);
  if (!el) return;

  // Ignore pure language/cookie chrome noise if unlabeled tiny icons without text? Keep all buttons.

  const info = describeClick(el);
  const key = `${info.element}|${info.label}|${info.href}`;
  const now = Date.now();
  if (key === lastClickKey && now - lastClickAt < 400) return;
  lastClickKey = key;
  lastClickAt = now;

  trackEvent('ui_click', info);
}

export function enableSiteAnalytics() {
  if (!hasStoredCookieConsent()) return;
  enabled = true;
  bindClickTracking();
  void flush();
}

function bindClickTracking() {
  if (clickTrackingBound || typeof document === 'undefined') return;
  document.addEventListener('click', onDocumentClick, true);
  clickTrackingBound = true;
}

export function trackEvent(eventName: string, props?: TrackProps) {
  if (!hasStoredCookieConsent()) return;
  enabled = true;
  bindClickTracking();

  const path = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
  queue.push({
    eventName,
    path,
    title: typeof document !== 'undefined' ? document.title : '',
    referrer: typeof document !== 'undefined' ? document.referrer || '' : '',
    properties: props,
    occurredAt: new Date().toISOString()
  });
  scheduleFlush();
}

export function trackPageView(pathname?: string) {
  if (!hasStoredCookieConsent()) return;
  const path = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  if (path === lastPathTracked) return;
  lastPathTracked = path;
  trackEvent('page_view', { path });
}

export function initSiteAnalytics() {
  if (typeof window === 'undefined') return;
  if (hasStoredCookieConsent()) {
    enableSiteAnalytics();
    trackPageView(window.location.pathname);
  }

  const onHide = () => {
    void flush();
  };
  window.addEventListener('pagehide', onHide);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush();
  });
}
