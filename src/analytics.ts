import { scriptURL } from './util';

declare global { interface Window { va?: (type: 'event' | 'pageview', payload?: unknown) => void; vaq?: unknown[][] } }

// Vercel Web Analytics: cookieless, first-party (served from our own domain under /_vercel/insights), no consent banner
// needed. Loads only when VITE_VERCEL_ANALYTICS is "true" or "1" (read at build time) and Web Analytics is enabled for
// the project in the Vercel dashboard (otherwise the script 404s). Not @vercel/analytics: its inject() assigns a plain
// string to script.src, which our Trusted Types CSP blocks; scriptURL() goes through the site's policy instead.
const enabled = () => /^(true|1)$/i.test((import.meta.env.VITE_VERCEL_ANALYTICS as string | undefined) ?? '') && location.hostname !== 'localhost';

export function initAnalytics() {
  if (!enabled() || window.va) return;
  window.va = (...args) => { (window.vaq = window.vaq || []).push(args); }; // queue until the script takes over
  const s = document.createElement('script');
  s.defer = true;
  s.src = scriptURL('/_vercel/insights/script.js');
  document.head.appendChild(s);
}

/** Custom event. Page views are automatic; custom events are only recorded on Vercel's Pro plan (dropped on Hobby). */
export function track(event: string, props?: Record<string, string | number>) {
  window.va?.('event', { name: event, data: props });
}
