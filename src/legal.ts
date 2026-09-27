import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import '@fontsource/ibm-plex-sans/latin-400.css';
import './styles/fonts.css';
import './styles/legal.css';
import { applyDocument, store } from './store';
import { initAnalytics } from './analytics';
import type { Lang } from './data';

const TITLE: Record<Lang, string> = {
  en: 'Privacy Policy — Sergkei Kournosenkov',
  de: 'Datenschutzerklärung — Sergkei Kournosenkov',
  el: 'Πολιτική απορρήτου — Sergkei Kournosenkov',
};

const buttons = document.querySelectorAll<HTMLButtonElement>('.legal__seg [data-lang]');

function sync() {
  document.title = TITLE[store.state.lang];
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === store.state.lang)));
}

buttons.forEach((b) => b.addEventListener('click', () => store.set({ lang: b.dataset.lang as Lang })));
store.on((c) => { if (c.lang) sync(); });

applyDocument();
sync();
initAnalytics();
