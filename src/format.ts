// DOM-free helpers: used in the browser (re-exported by util.ts) and by the Node build (scripts/seo.ts).
import type { Job, Lang } from './data';
import { T } from './i18n';

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export function period(j: Job, L: Lang) {
  const f = (a: [number, number]) => (j.yearsOnly ? String(a[0]) : String(a[1]).padStart(2, '0') + '/' + a[0]);
  return f(j.from) + ' – ' + (j.to ? f(j.to) : T[L].present);
}
