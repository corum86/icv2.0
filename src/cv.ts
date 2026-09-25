import { JOBS, SKILLS, CATS, EDU, LANGS } from './data';
import { store, t } from './store';
import { esc, careerYears, period } from './util';
import { Terminal } from './terminal';
import { contactFormHTML, bindContactForm } from './contact';
import { LINKS, GAME_TRIGGER } from './config';

const ui = { openJob: 0, cat: 'all', q: '' };
const STACK = ['Angular', 'React', 'Tailwind', 'Spring Boot', 'PostgreSQL', 'Claude Code'];

export function mountCV(root: HTMLElement, enterGame: () => void) {
  const terminal = new Terminal(enterGame);
  let armed = true; // becomes false once the scroll trigger fired, re-armed on return

  const render = () => {
    const tt = t(), lvl = Math.floor(careerYears());
    root.innerHTML = `
    <a class="skip" href="#main">${esc(tt.skip)}</a>
    <header class="top">
      <div class="wrap top__in">
        <a href="#top" class="logo"><span>~/</span>sergkei</a>
        <nav class="top__nav" aria-label="Sections">
          <a href="#experience">${esc(tt.nav[0])}</a><a href="#skills">${esc(tt.nav[1])}</a><a href="#education">${esc(tt.nav[2])}</a><a href="#contact">${esc(tt.nav[3])}</a>
        </nav>
        <div class="seg" role="group" aria-label="Language">
          <button data-lang="en" aria-pressed="${store.state.lang === 'en'}">EN</button><button data-lang="de" aria-pressed="${store.state.lang === 'de'}">DE</button>
        </div>
        <button class="btn-ghost" data-action="theme">◐ ${esc(store.state.theme === 'dark' ? tt.light : tt.dark)}</button>
        <button class="btn-play" data-action="play">▶ ${esc(tt.play)}</button>
      </div>
    </header>

    <main id="main" class="wrap">
      <section class="hero" id="top">
        <div class="hero__main">
          <p class="hero__meta"><span class="dot"></span><span>${esc(tt.loc)}</span><span>/</span><span>${esc(tt.spec)}</span></p>
          <h1 class="hero__name">Sergkei<br>Kournosenkov</h1>
          <p class="hero__role">&gt; ${esc(tt.role)}<span class="caret" aria-hidden="true"></span></p>
          <p class="hero__profile">${esc(tt.profile)}</p>
          <div class="ctas">
            <a class="btn-primary" href="mailto:${LINKS.email}">✉ ${esc(tt.email)}</a>
            <a class="btn-outline" href="${LINKS.github}" target="_blank" rel="noopener">GitHub ↗</a>
            <a class="btn-outline" href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
          </div>
          <p class="stack"><span>${esc(tt.stackLabel)}:</span>${STACK.map((s) => `<span class="pill">${esc(s)}</span>`).join('')}</p>
        </div>
        <div class="hero__side">${terminal.html()}</div>
      </section>

      <section class="facts" aria-label="Key facts">
        ${[[lvl + '+', tt.fYears], ['2019→', tt.fEcs], ['4', tt.fLang], ['B.Sc.', tt.fEdu]].map(([n, l]) => `<div class="fact"><span class="fact__n">${esc(n)}</span><span class="fact__l">${esc(l)}</span></div>`).join('')}
      </section>

      <section id="experience" class="sec">
        <h2 class="sec__h"><span>// 01</span> ${esc(tt.sExp)}</h2>
        <div class="jobs" data-jobs>${jobsHTML()}</div>
      </section>

      <section id="skills" class="sec">
        <h2 class="sec__h"><span>// 02</span> ${esc(tt.sSkills)}</h2>
        <label class="grep"><span>$ grep -i</span><input data-q value="${esc(ui.q)}" placeholder="${esc(tt.grep)}" spellcheck="false" autocomplete="off"><span class="grep__count" data-count></span></label>
        <div class="chips" data-cats></div>
        <div class="skills" data-skills></div>
      </section>

      <section id="education" class="sec two">
        <div>
          <h2 class="sec__h"><span>// 03</span> ${esc(tt.sEdu)}</h2>
          ${EDU.map((e) => `<div class="row"><span class="row__t">${esc(e.t[store.state.lang])}</span><span class="row__s">${esc(e.s[store.state.lang])}</span><span class="row__y">${esc(e.y)}</span></div>`).join('')}
        </div>
        <div>
          <h2 class="sec__h"><span>// 04</span> ${esc(tt.sLang)}</h2>
          ${LANGS.map((l) => `<div class="row"><div class="row__split"><span class="row__t">${esc(l.n[store.state.lang])}</span><span class="row__lvl">${esc(l.l[store.state.lang])}</span></div><div class="meter"><div style="width:${l.p}%"></div></div></div>`).join('')}
        </div>
      </section>

      <section id="contact" class="sec contact">
        <h2 class="sec__h"><span>// 05</span> ${esc(tt.sContact)}</h2>
        <p class="contact__title">${esc(tt.cTitle)}</p>
        <a class="contact__mail" href="mailto:${LINKS.email}">${LINKS.email}</a>
        <div class="ctas">
          <a class="btn-primary" href="mailto:${LINKS.email}">✉ ${esc(tt.email)}</a>
          <a class="btn-outline" href="${LINKS.github}" target="_blank" rel="noopener">GitHub ↗</a>
          <a class="btn-outline" href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
        </div>
        <div class="contact__form"><h3>${esc(tt.form.title)}</h3>${contactFormHTML('cv')}</div>
      </section>
    </main>

    <footer class="foot wrap">
      <span>© ${new Date().getFullYear()} Sergkei Kournosenkov</span>
      <a href="/datenschutz.html">${esc(tt.footer.privacy)}</a>
    </footer>

    <section class="zone ${GAME_TRIGGER === 'scroll' ? 'zone--scroll' : ''}" data-zone>
      <div class="zone__in">
        <div class="zone__box" data-zone-box>
          <span class="zone__cmd">$ ./start --mode=game</span>
          <p class="zone__title" data-zone-title>${esc(GAME_TRIGGER === 'scroll' ? tt.zTitle : tt.zBtn)}</p>
          <p class="zone__sub">${esc(tt.zSub)}</p>
          ${GAME_TRIGGER === 'scroll' ? `<div class="zone__bar"><div class="zone__track"><div data-zone-fill></div></div><span data-zone-pct>0%</span></div>` : ''}
          <button class="zone__btn" data-action="play">▶ ${esc(GAME_TRIGGER === 'scroll' ? tt.zSkip : tt.zBtn)}</button>
        </div>
      </div>
    </section>`;
    renderSkills();
    terminal.bind(root);
    bindContactForm(root);
  };

  const jobsHTML = () => {
    const L = store.state.lang;
    return JOBS.map((j, i) => {
      const open = ui.openJob === i;
      return `<div class="job ${open ? 'is-open' : ''}">
        <button class="job__head" data-job="${i}" aria-expanded="${open}">
          <span class="job__period">${esc(period(j, L))}</span>
          <span class="job__title"><span class="job__role">${esc(j.role[L])}</span><span class="job__co">${esc(j.company + (j.place ? ' · ' + j.place[L] : ''))}</span></span>
          <span class="job__sign" aria-hidden="true">${open ? '−' : '+'}</span>
        </button>
        ${open ? `<div class="job__body"><span></span><div>
          <ul>${j.b[L].map((b) => `<li><span aria-hidden="true">–</span><span>${esc(b)}</span></li>`).join('')}</ul>
          <div class="tags">${j.tags.map((x) => `<span class="pill pill--card">${esc(x)}</span>`).join('')}</div>
        </div></div>` : ''}
      </div>`;
    }).join('');
  };

  const renderSkills = () => {
    const tt = t(), q = ui.q.trim().toLowerCase();
    const list = SKILLS.filter((k) => (ui.cat === 'all' || k.c === ui.cat) && (!q || k.n.toLowerCase().includes(q)));
    root.querySelector('[data-cats]')!.innerHTML = [['all', tt.all], ...CATS.map((c) => [c, (tt.cats as any)[c]])]
      .map(([id, label]) => `<button class="chip" data-cat="${id}" aria-pressed="${ui.cat === id}">${esc(label)}</button>`).join('');
    root.querySelector('[data-skills]')!.innerHTML = list.length
      ? list.map((k) => `<div class="skill"><span class="skill__n">${esc(k.n)}</span><span class="skill__c">${esc((tt.cats as any)[k.c])}</span></div>`).join('')
      : `<p class="skills__none">${esc(tt.none)}</p>`;
    root.querySelector('[data-count]')!.textContent = `${list.length} ${tt.matches}`;
  };

  root.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-action],[data-lang],[data-job],[data-cat]');
    if (!el) return;
    if (el.dataset.action === 'play') enterGame();
    else if (el.dataset.action === 'theme') store.set({ theme: store.state.theme === 'dark' ? 'light' : 'dark' });
    else if (el.dataset.lang) store.set({ lang: el.dataset.lang as any });
    else if (el.dataset.job) { const i = +el.dataset.job; ui.openJob = ui.openJob === i ? -1 : i; root.querySelector('[data-jobs]')!.innerHTML = jobsHTML(); }
    else if (el.dataset.cat) { ui.cat = el.dataset.cat; renderSkills(); }
  });
  root.addEventListener('input', (e) => {
    const el = e.target as HTMLInputElement;
    if (el.matches('[data-q]')) { ui.q = el.value; renderSkills(); }
  });

  // Scroll-driven "loading" zone → glitch into game mode at 100%.
  const onScroll = () => {
    if (GAME_TRIGGER !== 'scroll' || document.body.classList.contains('in-game')) return;
    const zone = root.querySelector<HTMLElement>('[data-zone]'); if (!zone) return;
    const r = zone.getBoundingClientRect(), span = r.height - innerHeight; if (span <= 0) return;
    const p = Math.max(0, Math.min(1, -r.top / span));
    const fill = root.querySelector<HTMLElement>('[data-zone-fill]'), pct = root.querySelector('[data-zone-pct]');
    if (fill) fill.style.width = (p * 100).toFixed(1) + '%';
    if (pct) pct.textContent = Math.round(p * 100) + '%';
    const title = root.querySelector('[data-zone-title]'); if (title) title.textContent = p > 0.9 ? t().zReady : t().zTitle;
    const box = root.querySelector<HTMLElement>('[data-zone-box]');
    if (box) box.style.transform = p > 0.6 ? `translateX(${((Math.random() - 0.5) * p * 10).toFixed(1)}px)` : '';
    if (p < 0.5) armed = true;
    if (p >= 0.995 && armed) { armed = false; enterGame(); }
  };
  addEventListener('scroll', onScroll, { passive: true });

  store.on((c) => {
    if (c.lang) render();
    if (c.theme) { const b = root.querySelector('[data-action="theme"]'); if (b) b.textContent = '◐ ' + (store.state.theme === 'dark' ? t().light : t().dark); }
  });
  render();
  onScroll();
  return { onReturn() { armed = false; scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); } };
}
