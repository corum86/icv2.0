// Portfolio page (portfolio.html): every project in WORK, same cards + case-study drawer as the CV's selected work.
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import './styles/fonts.css';
import './styles/cv.css';
import './styles/work.css';
import { LANG_CODES, type Lang } from './data';
import { WORK } from './work';
import { mountWork } from './work-section';
import { store, t, applyDocument, langUrl } from './store';
import { esc, setHTML } from './util';
import { initAnalytics } from './analytics';

const root = document.getElementById('app')!;
const work = mountWork(root, WORK, true); // persistent element, re-inserted on every render so its videos keep playing
const themeLabel = () => `◐ ${store.state.theme === 'dark' ? t().light : t().dark}`;

function render() {
  const tt = t(), L = store.state.lang;
  setHTML(root, `
  <a class="skip" href="#main">${esc(tt.skip)}</a>
  <header class="top">
    <div class="wrap top__in">
      <a href="${langUrl('/')}" class="logo"><span>~/</span>sergkei</a>
      <nav class="top__nav" aria-label="Sections"><a class="top__back" href="${langUrl('/')}#work"><span aria-hidden="true">←</span> ${esc(tt.cvp.back)}</a></nav>
      <div class="seg" role="group" aria-label="Language">
        ${LANG_CODES.map((l) => `<button data-lang="${l}" aria-pressed="${L === l}">${l.toUpperCase()}</button>`).join('')}
      </div>
      <button class="btn-ghost" data-action="theme">${esc(themeLabel())}</button>
    </div>
  </header>
  <main id="main" class="wrap"><div data-work></div></main>
  <footer class="foot wrap">
    <span>© ${new Date().getFullYear()} Sergkei Kournosenkov</span>
    <a href="/datenschutz.html">${esc(tt.footer.privacy)}</a>
  </footer>`);
  root.querySelector('[data-work]')!.replaceWith(work.el);
  document.title = tt.pfTitle;
}

root.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-action],[data-lang]');
  if (!el) return;
  if (el.dataset.action === 'theme') store.set({ theme: store.state.theme === 'dark' ? 'light' : 'dark' });
  else if (el.dataset.lang) store.set({ lang: el.dataset.lang as Lang });
});
store.on((c) => {
  if (c.lang) render();
  if (c.theme) { const b = root.querySelector('[data-action="theme"]'); if (b) b.textContent = themeLabel(); }
});

applyDocument();
render();
work.openFromHash();
initAnalytics();
