// "Selected work" section (filterable cards) and the case-study drawer. Spec: docs/handoff/06-work-section.md.
// The section element is created once and survives CV re-renders (cv.ts moves it into each new tree), so
// looping videos keep playing across language switches; only text is re-rendered.
// Two uses: the CV's selected work (SELECTED + a button to the portfolio) and portfolio.html (all of WORK).
import { WORK, WORK_TAGS, type Work, type WorkVersion } from './work';
import { migrationDiagramHTML } from './work-diagram';
import type { Lang } from './data';
import { store, t, langUrl } from './store';
import { esc, setHTML, reducedMotion } from './util';
import { track } from './analytics';

const EXT = document.createElement('video').canPlayType('video/webm') ? 'webm' : 'mp4';

// HEAD-check before injecting a <video> (no 404 noise). Vite's dev server answers missing files with index.html, hence the type check.
const probes = new Map<string, Promise<boolean>>();
const exists = (url: string) => {
  let p = probes.get(url);
  if (!p) probes.set(url, (p = fetch(url, { method: 'HEAD' }).then((r) => r.ok && !(r.headers.get('content-type') || '').includes('text/html'), () => false)));
  return p;
};

const hashSlug = (hash: string) => /^#work\/([\w-]+)$/.exec(hash)?.[1];
const find = (list: Work[], slug?: string) => (slug ? list.findIndex((w) => w.slug === slug) : -1);
const matches = (w: Work, tag: string) => tag === 'all' || w.tags.some((x) => x.toLowerCase().startsWith(tag.toLowerCase()));
const isArchive = (u?: string) => !!u && u.startsWith('https://web.archive.org/');
const tabLabel = (v: WorkVersion, L: Lang) => (v.year === 'Live' ? v.label[L] : `${v.year} · ${v.label[L]}`);
const capLabel = (v: WorkVersion, L: Lang) => (v.year === 'Live' ? v.label[L] : `${v.label[L]} · ${v.year}`);
const arrow = (s: string) => `${s} ↗`;

/** `all`: portfolio.html (h1, every project). Otherwise the CV section, which links to the portfolio. */
export function mountWork(page: HTMLElement, items: Work[], all = false) {
  const el = document.createElement('section');
  el.id = 'work';
  el.className = all ? 'wk wk--all' : 'wk';
  el.setAttribute('aria-labelledby', 'wk-h');
  const overlay = document.createElement('div');
  overlay.className = 'wk-overlay';
  overlay.hidden = true;
  // Persistent dialog: only its content is re-rendered, so ←/→ don't replay the slide-in animation.
  const drawer = document.createElement('aside');
  drawer.className = 'wk-drawer';
  drawer.tabIndex = -1;
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-labelledby', 'wk-d-title');
  overlay.append(drawer);
  document.body.append(overlay);

  let tag = 'all', cur = -1, ver = -1, pushed = false, scrollY0 = 0;
  let opener: HTMLElement | null = null, phone: { slug: string; v: HTMLVideoElement } | null = null;

  // ---------- video: one shared observer. Cards play while ≥35% visible and the drawer is closed; the drawer's phone plays while open.
  const visible = new Set<HTMLVideoElement>();
  const sync = (v: HTMLVideoElement) => {
    if (visible.has(v) && (cur < 0 || overlay.contains(v))) v.play().catch(() => {});
    else v.pause();
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target as HTMLVideoElement;
    if (e.isIntersecting) visible.add(v); else visible.delete(v);
    sync(v);
  }), { threshold: 0.35 });
  const drop = (v: HTMLVideoElement) => {
    io.unobserve(v); visible.delete(v); v.pause();
    const box = v.closest<HTMLElement>('.wk-mobile');
    if (box) box.hidden = true;
    if (phone?.v === v) phone = null;
    v.remove(); // the poster <img> underneath stays
  };
  const video = (src: string, poster?: string) => {
    const v = document.createElement('video');
    v.muted = v.defaultMuted = true; // property + attribute: iOS only autoplays when both are set
    v.loop = true; v.playsInline = true; v.preload = 'metadata';
    v.setAttribute('aria-hidden', 'true');
    if (poster) v.poster = poster;
    v.addEventListener('error', () => drop(v));
    v.src = src;
    io.observe(v);
    return v;
  };

  // ---------- section
  const bySlug = (s?: string) => find(items, s);
  const headHTML = () => (all ? `<h1 id="wk-h" class="sec__h"><span>~/</span>${esc(t().sPortfolio)}</h1>` : `<h2 id="wk-h" class="sec__h"><span>// 02</span> ${esc(t().sWork)}</h2>`)
    + '<span class="wk-count"></span>';
  const tags = WORK_TAGS.filter((x) => items.some((w) => matches(w, x))); // no chips that would empty the grid
  const filterHTML = () => `<span class="wk-filter__cmd">$ ls ./work --tag=</span>` + tags.map((x) =>
    `<button class="wk-chip" data-tag="${esc(x)}" aria-pressed="${x === tag}">${esc((x === 'all' ? t().all : x).toLowerCase())}</button>`).join('');
  const offlineBadge = () => `<span class="wk-badge wk-badge--offline">${esc(t().offline)}</span>`;
  const cardMedia = (w: Work) => (w.diagram === 'migration' ? migrationDiagramHTML()
    : w.media ? `<img src="${esc(w.media.base)}-poster.${w.media.ext}" alt="" loading="lazy" width="1280" height="800">` : '')
    + (w.nda ? '<span class="wk-badge wk-badge--nda">NDA</span>' : '') + (w.offline ? offlineBadge() : '');
  const cardBody = (w: Work) => {
    const tt = t(), L = store.state.lang, n = w.versions?.length ?? 0;
    return `<div class="wk-meta"><span>${esc(w.client[L])}</span><span>${esc(w.year)}</span></div>
      <h3 class="wk-title">${esc(w.title[L])}</h3>
      <p class="wk-outcome">${esc(w.outcome[L])}</p>
      ${w.stats ? `<div class="wk-stats">${w.stats.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label[L])}</span></div>`).join('')}</div>` : ''}
      ${w.lighthouse ? `<div class="wk-lh">lighthouse ${w.lighthouse.scores.map((s) => `<b title="${esc(s.label)}">${s.score}</b>`).join('')}</div>` : ''}
      <div class="wk-tags">${w.tags.map((x) => `<span>${esc(x)}</span>`).join('')}</div>
      <div class="wk-foot"><span>${esc(tt.caseStudy)} →</span><span>${n > 1 ? `${n} ${esc(tt.versions)}` : ''}</span></div>`;
  };

  setHTML(el, `<div class="wk-head">${headHTML()}</div>
    <div class="wk-filter" role="group" aria-label="${esc(t().wFilter)}">${filterHTML()}</div>
    <div class="wk-grid">${items.map((w) => `<button class="wk-card" data-slug="${esc(w.slug)}" aria-haspopup="dialog">
      <div class="wk-media">${cardMedia(w)}</div><div class="wk-body">${cardBody(w)}</div></button>`).join('')}</div>
    ${all ? '' : '<div class="wk-more"></div>'}`);
  const head = el.querySelector<HTMLElement>('.wk-head')!, filter = el.querySelector<HTMLElement>('.wk-filter')!;
  const cards = [...el.querySelectorAll<HTMLElement>('.wk-card')];
  const more = el.querySelector<HTMLElement>('.wk-more');
  const renderMore = () => more && setHTML(more,
    `<a class="btn-outline" href="${langUrl('/portfolio.html')}" data-portfolio>$ ls ./portfolio · ${esc(t().wAll)} (${WORK.length}) →</a>`);
  renderMore();

  const applyFilter = () => {
    filter.querySelectorAll('[data-tag]').forEach((c) => c.setAttribute('aria-pressed', String((c as HTMLElement).dataset.tag === tag)));
    let n = 0;
    cards.forEach((c, i) => { const on = matches(items[i], tag); c.hidden = !on; n += +on; });
    el.querySelector('.wk-count')!.textContent = `${n} ${t().projects}`;
  };
  applyFilter();

  // Card videos attach only when the card nears the viewport: a <video poster> ignores loading="lazy", so attaching at mount
  // downloaded every poster + video header during page load (competing with fonts, hurting FCP/LCP).
  if (!reducedMotion()) {
    const near = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      near.unobserve(e.target);
      const i = cards.indexOf(e.target as HTMLElement), m = items[i].media!;
      const src = `${m.base}.${EXT}`;
      exists(src).then((ok) => { if (ok) cards[i].querySelector('.wk-media')!.append(video(src, `${m.base}-poster.${m.ext}`)); });
    }), { rootMargin: '400px 0px' });
    items.forEach((w, i) => { if (w.media?.video) near.observe(cards[i]); });
  }

  el.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('[data-portfolio]')) track('Portfolio Opened', { lang: store.state.lang });
    const x = (e.target as HTMLElement).closest<HTMLElement>('[data-tag],[data-slug]');
    if (!x) return;
    if (x.dataset.tag) {
      if (x.dataset.tag === tag) return;
      tag = x.dataset.tag;
      applyFilter();
      track('Work Filter', { tag });
    } else open(bySlug(x.dataset.slug), 'push', x);
  });

  // ---------- drawer
  const drawerHTML = (w: Work) => {
    const tt = t(), L = store.state.lang, vs = w.versions ?? [], last = vs[vs.length - 1];
    const primary = w.offline ? null : w.live ? { href: w.live, label: tt.live } : last?.url ? { href: last.url, label: `${last.label[L]} ${last.year}` } : null;
    const sections = ([[tt.wProblem, w.problem], [tt.wApproach, w.approach], [tt.wResult, w.result]] as const)
      .filter(([, p]) => p).map(([h, p]) => `<div class="wk-section"><span class="wk-h">## ${esc(h)}</span><p>${esc(p![L])}</p></div>`).join('');
    const actions = (primary ? `<a class="btn-primary" href="${esc(primary.href)}" target="_blank" rel="noopener"${isArchive(primary.href) ? ` data-archive="${esc(`${last.year} ${last.label.en}`)}"` : ''}>${esc(arrow(primary.label))}</a>` : '')
      + (w.code && !w.offline ? `<a class="btn-outline" href="${esc(w.code)}" target="_blank" rel="noopener">${esc(arrow(tt.code))}</a>` : '');
    return `<div class="wk-bar">
        <span class="wk-bar__path">~/work/${esc(w.slug)}</span>
        <div class="wk-bar__btns">
          <button class="wk-btn" data-act="prev" aria-label="${esc(tt.wPrev)}">←</button>
          <button class="wk-btn" data-act="next" aria-label="${esc(tt.wNext)}">→</button>
          <button class="wk-btn" data-act="close" aria-label="${esc(tt.wClose)}">esc ✕</button>
        </div>
      </div>
      <div class="wk-content">
        <div class="wk-stage">
          ${vs.length > 1 ? `<div class="wk-versions"><span>${esc(tt.beforeAfter)}</span><div class="wk-versions__tabs">${vs.map((v, i) =>
            `<button class="wk-chip" data-v="${i}" aria-pressed="${i === ver}">${esc(tabLabel(v, L))}</button>`).join('')}</div></div>` : ''}
          <div class="wk-media" data-stage></div>
          ${vs.length ? '<div class="wk-caption" data-caption></div>' : ''}
        </div>
        <div class="wk-intro">
          <span class="wk-meta">${esc(w.client[L])} · ${esc(w.year)}</span>
          <h3 id="wk-d-title">${esc(w.title[L])}</h3>
          <p>${esc(w.outcome[L])}</p>
          ${w.offline ? `<span class="wk-offline-note">${esc(tt.offlineNote)}</span>` : ''}
        </div>
        <dl class="wk-factgrid"><div><dt>${esc(tt.wRole)}</dt><dd>${esc(w.role[L])}</dd></div><div><dt>${esc(tt.wStack)}</dt><dd>${esc(w.tags.join(', '))}</dd></div><div><dt>${esc(tt.wYear)}</dt><dd>${esc(w.year)}</dd></div></dl>
        ${w.stats ? `<div class="wk-bigstats">${w.stats.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label[L])}</span></div>`).join('')}</div>` : ''}
        ${w.lighthouse ? `<div class="wk-section"><span class="wk-h">## Lighthouse <small>· ${esc(w.lighthouse.mode === 'desktop' ? tt.desktop : tt.mobile.toLowerCase())}</small></span>
          <div class="wk-gauges">${w.lighthouse.scores.map((s) => `<div class="wk-gauge"><div class="wk-gauge__ring" style="--v:${+s.score}"><b>${+s.score}</b></div>${esc(s.label)}</div>`).join('')}</div></div>` : ''}
        ${w.media?.mobile && last && !reducedMotion() ? `<div class="wk-mobile" hidden><div class="wk-phone"></div>
          <div class="wk-mobile__cap"><span class="wk-h">## ${esc(tt.mobile)}</span><span>${esc(`${last.label[L]} · ${last.year} · mobile`)}</span></div></div>` : ''}
        ${sections}
        ${actions ? `<div class="wk-actions">${actions}</div>` : ''}
      </div>`;
  };

  // Version switch: only the stage image, tab state and caption change.
  const renderStage = () => {
    const w = items[cur], L = store.state.lang, v = w.versions?.[ver], m = w.media;
    overlay.querySelectorAll<HTMLElement>('[data-v]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.v! === ver)));
    setHTML(overlay.querySelector('[data-stage]')!, w.diagram === 'migration' ? migrationDiagramHTML()
      : m ? `<img src="${esc(m.base)}-${v ? ver + 1 : 'poster'}.${m.ext}" alt="${esc(w.title[L] + (v ? ' – ' + tabLabel(v, L) : ''))}" width="1280" height="800">` : '');
    const cap = overlay.querySelector('[data-caption]');
    if (cap && v) setHTML(cap, `<span>${esc(capLabel(v, L))}</span>` + (isArchive(v.url)
      ? `<a href="${esc(v.url)}" target="_blank" rel="noopener" data-archive="${esc(`${v.year} ${v.label.en}`)}">${esc(arrow(t().archive))}</a>` : ''));
  };

  const renderDrawer = () => {
    const w = items[cur];
    setHTML(drawer, drawerHTML(w));
    renderStage();
    const box = overlay.querySelector<HTMLElement>('.wk-mobile');
    if (phone && (phone.slug !== w.slug || !box)) drop(phone.v);
    if (!box) return;
    // Same project (language switch): move the playing video into the new markup, synchronously so it doesn't pause.
    if (phone) { box.querySelector('.wk-phone')!.append(phone.v); box.hidden = false; return; }
    const src = `${w.media!.base}-mobile.${EXT}`, slug = w.slug;
    exists(src).then((ok) => {
      const b = overlay.querySelector<HTMLElement>('.wk-mobile');
      if (!ok || !b || phone || items[cur]?.slug !== slug) return;
      phone = { slug, v: video(src) };
      b.querySelector('.wk-phone')!.append(phone.v);
      b.hidden = false;
    });
  };

  const lock = (on: boolean) => {
    document.documentElement.classList.toggle('wk-lock', on); // also read by game mode and the CV scroll trigger
    page.toggleAttribute('inert', on);
  };

  function open(i: number, history_: 'push' | 'replace' | 'none', from: HTMLElement | null = null) {
    if (i < 0) return;
    const first = cur < 0, act = (document.activeElement as HTMLElement | null)?.dataset?.act;
    cur = i;
    ver = (items[i].versions?.length ?? 0) - 1; // latest version by default
    const url = '#work/' + items[i].slug;
    if (history_ === 'push') { history.pushState(null, '', url); pushed = true; }
    else if (history_ === 'replace') history.replaceState(null, '', url);
    if (first) {
      opener = from;
      scrollY0 = scrollY;
      lock(true);
      overlay.hidden = false;
      addEventListener('keydown', onKey);
      el.querySelectorAll('video').forEach((v) => v.pause());
    }
    renderDrawer();
    drawer.scrollTop = 0;
    // Keep focus on ←/→ when cycling with the buttons; otherwise focus the dialog.
    ((act && drawer.querySelector<HTMLElement>(`[data-act="${act}"]`)) || drawer).focus();
    track('Work Opened', { slug: items[i].slug });
  }

  function close() {
    if (cur < 0) return;
    const slug = items[cur].slug;
    cur = -1; pushed = false;
    removeEventListener('keydown', onKey);
    if (phone) drop(phone.v);
    overlay.hidden = true;
    drawer.replaceChildren();
    lock(false);
    if (scrollY !== scrollY0) scrollTo({ top: scrollY0, behavior: 'instant' as ScrollBehavior });
    (opener?.isConnected ? opener : cards[bySlug(slug)])?.focus({ preventScroll: true });
    opener = null;
    el.querySelectorAll('video').forEach(sync);
  }

  // If we pushed the entry, go back so Back/Forward stay consistent (popstate then closes). Deep links just drop the slug.
  const requestClose = () => {
    if (pushed) history.back();
    else { history.replaceState(null, '', location.pathname + location.search + '#work'); close(); }
  };
  const cycle = (d: number) => open((cur + d + items.length) % items.length, 'replace');

  const trap = (e: KeyboardEvent) => {
    const f = [...overlay.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')].filter((x) => !x.closest('[hidden]'));
    if (!f.length) return;
    const a = document.activeElement, inside = a !== drawer && overlay.contains(a);
    const edge = e.shiftKey ? f[0] : f[f.length - 1];
    if (!inside || a === edge) { e.preventDefault(); (e.shiftKey ? f[f.length - 1] : f[0]).focus(); }
  };

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); requestClose(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); cycle(e.key === 'ArrowRight' ? 1 : -1); }
    else if (e.key === 'Tab') trap(e);
  }

  overlay.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === overlay) return requestClose();
    const b = target.closest<HTMLElement>('[data-act],[data-v],[data-archive]');
    if (!b) return;
    if (b.dataset.act === 'close') requestClose();
    else if (b.dataset.act) cycle(b.dataset.act === 'next' ? 1 : -1);
    else if (b.dataset.v) { ver = +b.dataset.v; renderStage(); }
    else track('Work Archive Link', { slug: items[cur].slug, version: b.dataset.archive! });
  });

  addEventListener('popstate', () => {
    const i = bySlug(hashSlug(location.hash));
    if (i < 0) close();
    else if (i !== cur && !document.body.classList.contains('in-game')) open(i, 'none');
  });

  store.on((c) => {
    if (!c.lang) return;
    setHTML(head, headHTML());
    filter.setAttribute('aria-label', t().wFilter);
    setHTML(filter, filterHTML());
    renderMore();
    cards.forEach((c, i) => {
      setHTML(c.querySelector('.wk-body')!, cardBody(items[i]));
      const badge = c.querySelector('.wk-badge--offline');
      if (badge) badge.textContent = t().offline;
    });
    applyFilter();
    if (cur >= 0) { const y = drawer.scrollTop; renderDrawer(); drawer.scrollTop = y; drawer.focus({ preventScroll: true }); }
  });

  return {
    el,
    /** Deep link: call once the section is in the DOM. */
    openFromHash() {
      const slug = hashSlug(location.hash), i = bySlug(slug), j = find(WORK, slug);
      // A portfolio-only project linked from the CV page: open it on the portfolio page.
      if (i < 0 && j >= 0 && !all) return location.replace(`${langUrl('/portfolio.html')}${location.search}#work/${WORK[j].slug}`);
      if (i < 0) return;
      el.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      open(i, 'none');
    },
    openCase: (slug: string) => open(bySlug(slug), 'push'),
    closeCase: requestClose,
  };
}
