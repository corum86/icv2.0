import { T, type Dict } from './i18n';
import type { Lang } from './data';

type Theme = 'dark' | 'light';
interface State { lang: Lang; theme: Theme }

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };

const q = new URLSearchParams(location.search).get('lang');
const initialLang: Lang = q === 'de' || q === 'en' ? q : ((read('lang') as Lang) || (navigator.language.toLowerCase().startsWith('de') ? 'de' : 'en'));
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

export function applyDocument() {
  const el = document.documentElement;
  el.lang = store.state.lang;
  el.dataset.theme = store.state.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', store.state.theme === 'dark' ? '#0f0e13' : '#f7f6f9');
}
