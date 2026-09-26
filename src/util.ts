import { CAREER_START, type Job, type Lang } from './data';
import { T } from './i18n';

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

// Trusted Types (enforced via CSP `require-trusted-types-for 'script'`). All HTML goes through setHTML();
// templates escape content with esc(), so the policy passes HTML through. Script URLs are allowlisted.
interface TTPolicy { createHTML(s: string): unknown; createScriptURL(s: string): unknown }
declare global { interface Window { trustedTypes?: { createPolicy(name: string, rules: { createHTML(s: string): string; createScriptURL(s: string): string }): TTPolicy } } }

const SCRIPT_ORIGINS = [location.origin, 'https://plausible.io'];
const allowScript = (u: string) => {
  if (SCRIPT_ORIGINS.includes(new URL(u, location.href).origin)) return u;
  throw new TypeError('Blocked script URL: ' + u);
};
const policy = window.trustedTypes?.createPolicy('cv', { createHTML: (s) => s, createScriptURL: allowScript });

export const setHTML = (el: Element, html: string) => { el.innerHTML = (policy ? policy.createHTML(html) : html) as string; };
export const scriptURL = (u: string) => (policy ? policy.createScriptURL(u) : allowScript(u)) as string;

export const careerYears = () => (Date.now() - CAREER_START.getTime()) / (365.25 * 864e5);

export function period(j: Job, L: Lang) {
  const f = (a: [number, number]) => (j.yearsOnly ? String(a[0]) : String(a[1]).padStart(2, '0') + '/' + a[0]);
  return f(j.from) + ' – ' + (j.to ? f(j.to) : T[L].present);
}

export function duration(j: Job, L: Lang) {
  const g = T[L].g, now = new Date();
  const to = j.to || [now.getFullYear(), now.getMonth() + 1];
  const m = (to[0] - j.from[0]) * 12 + (to[1] - j.from[1]) + (j.to ? 1 : 0);
  return `${Math.floor(m / 12)}${g.yrs} ${m % 12}${g.mos} ${g.xp}`;
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
