import { T, type Dict } from './i18n';
import { LANG_CODES, isLang, type Lang } from './data';
import { LINKS, LOCALIZED, type LocalizedPage } from './config';

type Theme = 'dark' | 'light';
interface State { lang: Lang; theme: Theme }

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

// On a language URL (/de/, /de/portfolio.html) the path decides the language. Everywhere else: ?lang=, saved choice, browser.
const m = location.pathname.match(new RegExp(`^/(${LANG_CODES.join('|')})(/.*)?$`));
const page = (m ? m[2] || '/' : location.pathname).replace(/\/index\.html$/, '/') as LocalizedPage;
const localized = LOCALIZED.includes(page);
const q = new URLSearchParams(location.search).get('lang');
const saved = read('lang'), nav = navigator.language.toLowerCase().slice(0, 2);
const initialLang: Lang = m && localized ? (m[1] as Lang) : isLang(q) ? q : isLang(saved) ? saved : isLang(nav) ? nav : 'en';
const initialTheme: Theme = (read('theme') as Theme) || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

const listeners = new Set<(changed: Partial<State>) => void>();

export const store = {
  state: { lang: initialLang, theme: initialTheme } as State,
  set(patch: Partial<State>) {
    Object.assign(this.state, patch);
    if (patch.lang) write('lang', patch.lang);
    if (patch.theme) write('theme', patch.theme);
    applyDocument();
    listeners.forEach((f) => f(patch));
  },
  on(f: (changed: Partial<State>) => void) { listeners.add(f); return () => listeners.delete(f); },
};

export const t = (): Dict => T[store.state.lang];
/** The language after the current one, for single-button toggles (game HUD, terminal). */
export const nextLang = (): Lang => LANG_CODES[(LANG_CODES.indexOf(store.state.lang) + 1) % LANG_CODES.length];
/** A localized page in the current (or given) language: langUrl('/portfolio.html') → '/de/portfolio.html'. */
export const langUrl = (path: LocalizedPage, lang: Lang = store.state.lang) => `/${lang}${path}`;

export function applyDocument() {
  const el = document.documentElement;
  el.lang = store.state.lang;
  el.dataset.theme = store.state.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', store.state.theme === 'dark' ? '#0f0e13' : '#f7f6f9');
  if (!localized) return;
  // Keep the address bar and the canonical on the language URL, without a reload. Other params and the hash stay.
  const qs = new URLSearchParams(location.search);
  qs.delete('lang');
  const s = qs.toString(), url = langUrl(page) + (s && '?' + s);
  if (location.pathname + location.search !== url) history.replaceState(history.state, '', url + location.hash);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', new URL(langUrl(page), LINKS.site).href);
}
// Back/Forward can land on an entry from before a language switch: move it to the current language too.
if (localized) addEventListener('popstate', applyDocument);
