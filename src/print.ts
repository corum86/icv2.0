// Printable, HR-oriented CV (cv.html). Same content as the site (data.ts, work.ts, i18n.ts), plain document styling,
// A4 print rules in styles/print.css. The toolbar is screen-only.
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import './styles/fonts.css';
import './styles/print.css';
import { JOBS, SKILLS, CATS, EDU, LANGS, LANG_CODES, type Lang } from './data';
import { WORK } from './work';
import { store, t, applyDocument, langUrl } from './store';
import { esc, setHTML, period } from './util';
import { LINKS } from './config';
import { initAnalytics, track } from './analytics';

const NAME = 'Sergkei Kournosenkov';
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const link = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;

function render(root: HTMLElement) {
  const L = store.state.lang, tt = t(), c = tt.cvp;
  const asOf = new Intl.DateTimeFormat(L, { month: 'long', year: 'numeric' }).format(new Date());
  const skills = CATS.map((cat) => [(tt.cats as Record<string, string>)[cat], SKILLS.filter((k) => k.c === cat).sort((a, b) => b.r - a.r).map((k) => k.n)] as const)
    .filter(([, names]) => names.length);

  setHTML(root, `
  <div class="pv-bar" role="toolbar" aria-label="${esc(c.title)}">
    <a class="pv-back" href="${langUrl('/')}">← ${esc(c.back)}</a>
    <div class="pv-seg" role="group" aria-label="Language">${LANG_CODES.map((l) => `<button type="button" data-lang="${l}" aria-pressed="${l === L}">${l.toUpperCase()}</button>`).join('')}</div>
    <button type="button" class="pv-print" data-print>${esc(c.print)}</button>
  </div>

  <main class="pv-page">
    <header class="pv-head">
      <div>
        <h1>${NAME}</h1>
        <p class="pv-role">${esc(tt.role)} · ${esc(tt.spec)}</p>
      </div>
      <ul class="pv-contact">
        <li>${esc(tt.loc)}</li>
        <li>${link('mailto:' + LINKS.email, LINKS.email)}</li>
        <li>${link(LINKS.site, host(LINKS.site))}</li>
        <li>${link(LINKS.github, host(LINKS.github))}</li>
        <li>${link(LINKS.linkedin, host(LINKS.linkedin))}</li>
      </ul>
    </header>

    <section class="pv-sec">
      <h2>${esc(c.profile)}</h2>
      <p class="pv-lead">${esc(tt.profile)}</p>
    </section>

    <section class="pv-sec">
      <h2>${esc(c.experience)}</h2>
      ${JOBS.map((j) => `<article class="pv-item${j.b[L].length <= 6 ? ' pv-keep' : ''}">
        <div class="pv-item__head">
          <div>
            <h3>${esc(j.role[L])}</h3>
            <p class="pv-org">${esc(j.company)}${j.place ? ' · ' + esc(j.place[L]) : ''}${j.side ? ` <span class="pv-tag">${esc(c.side)}</span>` : ''}</p>
          </div>
          <span class="pv-when">${esc(period(j, L))}</span>
        </div>
        <ul class="pv-list">${j.b[L].map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
        <p class="pv-tech"><span>${esc(c.tech)}:</span> ${esc(j.tags.join(', '))}</p>
      </article>`).join('')}
    </section>

    <section class="pv-sec">
      <h2>${esc(c.projects)}</h2>
      ${WORK.map((w) => `<article class="pv-item pv-item--small">
        <div class="pv-item__head">
          <div>
            <h3>${esc(w.title[L])}</h3>
            <p class="pv-org">${esc(w.client[L])}${w.live && !w.offline && !w.client[L].includes(host(w.live)) ? ' · ' + link(w.live, host(w.live)) : ''}</p>
          </div>
          <span class="pv-when">${esc(w.year)}</span>
        </div>
        <p>${esc(w.outcome[L])}</p>
      </article>`).join('')}
    </section>

    <section class="pv-sec">
      <h2>${esc(c.skills)}</h2>
      <dl class="pv-skills">${skills.map(([cat, names]) => `<dt>${esc(cat)}</dt><dd>${esc(names.join(', '))}</dd>`).join('')}</dl>
    </section>

    <div class="pv-cols">
      <section class="pv-sec">
        <h2>${esc(c.education)}</h2>
        ${EDU.map((e) => `<div class="pv-row"><div><h3>${esc(e.t[L])}</h3><p class="pv-org">${esc(e.s[L])}</p></div><span class="pv-when">${esc(e.y)}</span></div>`).join('')}
      </section>
      <section class="pv-sec">
        <h2>${esc(c.languages)}</h2>
        ${LANGS.map((l) => `<div class="pv-row"><h3>${esc(l.n[L])}</h3><span class="pv-when">${esc(l.l[L])}</span></div>`).join('')}
      </section>
    </div>

    <footer class="pv-foot">${esc(NAME)} · ${esc(c.asOf)} ${esc(asOf)} · ${link(LINKS.site, host(LINKS.site))}</footer>
  </main>`);
  document.title = `${NAME} – ${c.title}`;
}

const root = document.getElementById('cv')!;
root.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>('[data-lang],[data-print]');
  if (!b) return;
  if (b.dataset.lang) {
    store.set({ lang: b.dataset.lang as Lang });
    history.replaceState(null, '', `?lang=${store.state.lang}`); // reload / share keeps the language
  } else print();
});
store.on((ch) => { if (ch.lang) render(root); });
addEventListener('beforeprint', () => track('CV Printed', { lang: store.state.lang })); // toolbar button and Ctrl+P

applyDocument();
render(root);
initAnalytics();
