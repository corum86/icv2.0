import { scriptURL } from './util';

declare global { interface Window { plausible?: (e: string, o?: { props?: Record<string, string | number> }) => void } }

/** Plausible: cookieless, no personal data, no consent banner required. Disabled when VITE_PLAUSIBLE_DOMAIN is empty. */
export function initAnalytics() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  if (!domain || location.hostname === 'localhost') return;
  const s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = domain;
  s.src = scriptURL((import.meta.env.VITE_PLAUSIBLE_SRC as string) || 'https://plausible.io/js/script.js');
  document.head.appendChild(s);
  window.plausible = window.plausible || function (...args: any[]) { ((window.plausible as any).q = (window.plausible as any).q || []).push(args); };
}

export function track(event: string, props?: Record<string, string | number>) {
  window.plausible?.(event, props ? { props } : undefined);
}
