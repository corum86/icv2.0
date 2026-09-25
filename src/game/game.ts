import { JOBS, SKILLS, CATS, EDU, LANGS } from '../data';
import { RARITY_COLORS } from '../i18n';
import { store, t } from '../store';
import { esc, careerYears, period, duration } from '../util';
import { LINKS, SCANLINES } from '../config';
import { contactFormHTML, bindContactForm } from '../contact';
import { track } from '../analytics';
import { sfx } from './audio';
import { W, H, BLD, blocked, draw, loadSheets, findPath, type Building, type PanelId, type Sheets } from './world';

type Dir = 'down' | 'up' | 'left' | 'right';
const DIRS: Record<Dir, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const HERO_ROW: Record<Dir, number> = { down: 0, up: 0, left: 1, right: 2 }; // hero.png has no back-facing row
const isTouch = () => matchMedia('(hover: none), (pointer: coarse)').matches;

export class Game {
  private s = { px: 15, py: 10, dir: 'down' as Dir, walking: false, anim: 0, panel: null as PanelId | null, visited: {} as Record<string, boolean>, achDone: false, achTold: false, qSel: 0, iSel: 0, gCat: 0, dlg: '', dlgN: 0 };
  private timers: { type?: number; walk?: number; idle?: number; map?: number; hold?: number } = {};
  private sheets?: Promise<Sheets>;
  private offLang?: () => void;
  private el!: { hero: HTMLElement; dlg: HTMLElement; panel: HTMLElement; toast: HTMLElement; canvas: HTMLCanvasElement };

  constructor(private root: HTMLElement, private onExit: () => void) {}

  open() {
    this.root.hidden = false;
    document.body.classList.add('in-game');
    this.shell();
    this.startMap();
    addEventListener('keydown', this.onKey);
    this.offLang = store.on((c) => { if (c.lang) { this.shell(); this.startMap(); this.renderPanel(); } });
    sfx.start();
    setTimeout(() => this.say(t().g.intro), 350);
    track('Game Entered');
  }

  close() {
    Object.values(this.timers).forEach((id) => { clearInterval(id); clearTimeout(id); });
    this.timers = {};
    removeEventListener('keydown', this.onKey);
    this.offLang?.();
    this.root.hidden = true; this.root.innerHTML = '';
    document.body.classList.remove('in-game');
    this.s.panel = null;
    this.onExit();
  }

  // ---------- DOM ----------
  private shell() {
    const g = t().g, lvl = Math.floor(careerYears()), xp = ((careerYears() - lvl) * 100).toFixed(0);
    this.root.innerHTML = `
    <div class="game" role="application" aria-label="Game mode">
      <div class="hud">
        <div class="hud__who">
          <span class="hud__badge">SK</span><span class="px">SERGKEI</span><span class="px hud__lv">${g.lv} ${lvl}</span>
          <span class="hud__xp">XP <span class="hud__xpbar"><span style="width:${xp}%"></span></span></span>
          <span class="hud__explored" data-explored></span>
        </div>
        <div class="hud__btns">
          <button class="rbtn" data-g="status">[C] ${esc(g.status)}</button>
          <button class="rbtn" data-g="items">[I] ${esc(g.items)}</button>
          <button class="rbtn" data-g="quests">[Q] ${esc(g.quests)}</button>
          <button class="rbtn" data-g="sound" data-sound>[M] ${esc(sfx.on ? g.on : g.off)}</button>
          <button class="rbtn" data-g="lang">${store.state.lang === 'en' ? 'DE' : 'EN'}</button>
          <button class="rbtn rbtn--exit" data-g="exit">[X] ${esc(g.exit)}</button>
        </div>
      </div>
      <div class="stage">
        <div class="map" data-map>
          <canvas width="${W * 16}" height="${H * 16}" data-canvas aria-hidden="true"></canvas>
          ${BLD.map((b) => `<button class="bld" data-b="${b.id}" style="left:${(b.x / W) * 100}%;top:${(b.y / H) * 100}%;width:${(b.w / W) * 100}%;height:${(b.h / H) * 100}%"><span class="bld__name">${this.s.visited[b.id] ? '★ ' : ''}${esc((g.b as any)[b.id])}</span></button>`).join('')}
          <div class="player" data-hero aria-hidden="true"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="dlg" data-dlgbox>
          <span class="px dlg__who">GUIDE</span>
          <span class="dlg__text" data-dlg aria-live="polite"></span>
          <span class="dlg__hint">${esc(isTouch() ? g.touch : g.controls)}</span>
        </div>
        <div class="dpad" aria-label="Movement">
          <span></span><button data-dir="up" aria-label="Up">▲</button><span></span>
          <button data-dir="left" aria-label="Left">◀</button><span></span><button data-dir="right" aria-label="Right">▶</button>
          <span></span><button data-dir="down" aria-label="Down">▼</button><span></span>
        </div>
      </div>
      <div class="panel-wrap" data-panel hidden></div>
      ${SCANLINES ? '<div class="scan" aria-hidden="true"></div>' : ''}
      <div class="toast-slot" data-toast></div>
    </div>`;
    const q = <T extends Element>(s: string) => this.root.querySelector(s) as T;
    this.el = { hero: q('[data-hero]'), dlg: q('[data-dlg]'), panel: q('[data-panel]'), toast: q('[data-toast]'), canvas: q('[data-canvas]') };
    this.bindUI();
    this.updateHero();
    this.updateExplored();
    this.el.dlg.textContent = this.s.dlg.slice(0, this.s.dlgN) + (this.s.dlg && this.s.dlgN >= this.s.dlg.length ? '  ▼' : '');
  }

  private bindUI() {
    const game = this.root.querySelector<HTMLElement>('.game')!;
    game.addEventListener('click', (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-g],[data-dlgbox],[data-close],[data-quest],[data-item],[data-gcat]');
      if (!el) return;
      const a = el.dataset.g;
      if (a === 'status' || a === 'items' || a === 'quests') this.openPanel(a);
      else if (a === 'sound') { sfx.on = !sfx.on; el.textContent = `[M] ${sfx.on ? t().g.on : t().g.off}`; }
      else if (a === 'lang') store.set({ lang: store.state.lang === 'en' ? 'de' : 'en' });
      else if (a === 'exit') this.close();
      else if (el.dataset.dlgbox !== undefined) this.skipDialog();
      else if (el.dataset.close !== undefined) this.closePanel();
      else if (el.dataset.quest) { this.s.qSel = +el.dataset.quest; sfx.select(); this.renderPanel(); }
      else if (el.dataset.item) { this.s.iSel = +el.dataset.item; sfx.select(); this.renderPanel(); }
      else if (el.dataset.gcat) { this.s.gCat = +el.dataset.gcat; this.s.iSel = 0; sfx.tab(); this.renderPanel(); }
    });

    // D-pad: press-and-hold walks continuously.
    this.root.querySelectorAll<HTMLButtonElement>('[data-dir]').forEach((b) => {
      const dir = b.dataset.dir as Dir;
      const stop = () => { clearInterval(this.timers.hold); b.classList.remove('is-down'); };
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.setPointerCapture(e.pointerId); b.classList.add('is-down'); this.cancelWalk(); this.step(dir); clearInterval(this.timers.hold); this.timers.hold = window.setInterval(() => this.step(dir), 150); });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => b.addEventListener(ev, stop));
      b.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    // Map: tap = walk to tile / building, swipe = walk in that direction until something is in the way.
    const map = this.root.querySelector<HTMLElement>('[data-map]')!;
    let start: { x: number; y: number } | null = null;
    map.addEventListener('pointerdown', (e) => { start = { x: e.clientX, y: e.clientY }; });
    map.addEventListener('pointerup', (e) => {
      if (!start || this.s.panel) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y; start = null;
      if (Math.hypot(dx, dy) > 28) { this.walkDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')); return; }
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-b]');
      if (b) { const bd = BLD.find((x) => x.id === b.dataset.b)!; this.walkTo(bd.dx, bd.dy); return; }
      const r = map.getBoundingClientRect();
      this.walkTo(Math.floor(((e.clientX - r.left) / r.width) * W), Math.floor(((e.clientY - r.top) / r.height) * H));
    });
  }

  private startMap() {
    clearInterval(this.timers.map);
    this.sheets = this.sheets || loadSheets();
    const cv = this.el.canvas;
    this.sheets.then((im) => {
      if (this.el.canvas !== cv) return;
      const g = cv.getContext('2d')!; let f = 0;
      const tick = () => draw(g, im, f++);
      tick(); this.timers.map = window.setInterval(tick, 380);
    });
  }

  private updateHero() {
    const s = this.s, frame = s.walking ? [0, 1, 2, 1][s.anim % 4] : 1;
    const st = this.el.hero.style;
    st.left = ((s.px * 16 - 6) / (W * 16)) * 100 + '%';
    st.top = (((s.py + 1) * 16 - 32) / (H * 16)) * 100 + '%';
    st.backgroundPosition = `${frame * 50}% ${HERO_ROW[s.dir] * 50}%`;
  }

  private updateExplored() {
    const n = Object.keys(this.s.visited).length;
    const e = this.root.querySelector('[data-explored]'); if (e) e.textContent = `${n}/${BLD.length} ${t().g.explored}`;
  }

  // ---------- movement ----------
  private step(dir: Dir) {
    if (this.s.panel) return;
    const [dx, dy] = DIRS[dir], nx = this.s.px + dx, ny = this.s.py + dy;
    this.s.dir = dir;
    if (blocked(nx, ny)) { sfx.bump(); this.cancelWalk(); this.updateHero(); return false; }
    this.s.px = nx; this.s.py = ny; this.s.anim++; this.s.walking = true;
    clearTimeout(this.timers.idle);
    this.timers.idle = window.setTimeout(() => { this.s.walking = false; this.updateHero(); }, 170);
    this.updateHero(); sfx.step();
    const b = BLD.find((b) => b.dx === nx && b.dy === ny);
    if (b) { this.cancelWalk(); clearInterval(this.timers.hold); setTimeout(() => this.enter(b), 150); }
    return true;
  }

  private cancelWalk() { clearInterval(this.timers.walk); }

  private walkTo(tx: number, ty: number) {
    if (this.s.panel) return;
    const path = findPath([this.s.px, this.s.py], [tx, ty]); if (!path || !path.length) return;
    this.cancelWalk();
    this.timers.walk = window.setInterval(() => {
      const n = path.shift(); if (!n) return this.cancelWalk();
      const dx = n[0] - this.s.px, dy = n[1] - this.s.py;
      this.step(dx > 0 ? 'right' : dx < 0 ? 'left' : dy < 0 ? 'up' : 'down');
    }, 105);
  }

  private walkDir(dir: Dir) {
    this.cancelWalk();
    this.timers.walk = window.setInterval(() => { if (this.step(dir) === false) this.cancelWalk(); }, 120);
  }

  // ---------- areas & panels ----------
  private enter(b: Building) {
    const g = t().g, isNew = !this.s.visited[b.id];
    this.s.visited[b.id] = true;
    const all = BLD.every((x) => this.s.visited[x.id]);
    this.openPanel(b.panel, false); sfx.open();
    if (isNew) {
      this.toast(`${g.found}: ${(g.b as any)[b.id]}`);
      const lbl = this.root.querySelector(`[data-b="${b.id}"] .bld__name`); if (lbl) lbl.textContent = '★ ' + (g.b as any)[b.id];
      this.updateExplored();
      track('Area Visited', { area: b.id });
    }
    if (all && !this.s.achDone) { this.s.achDone = true; setTimeout(() => { this.toast(g.ach); sfx.achievement(); }, 1200); track('All Areas Explored'); }
  }

  private openPanel(p: PanelId, sound = true) {
    this.cancelWalk(); clearInterval(this.timers.hold);
    this.s.panel = p; if (sound) sfx.select();
    this.renderPanel();
    this.el.panel.querySelector<HTMLElement>('[data-close]')?.focus({ preventScroll: true });
  }

  private closePanel() {
    if (!this.s.panel) return;
    const s = this.s, onDoor = BLD.some((b) => b.dx === s.px && b.dy === s.py);
    s.panel = null; this.renderPanel(); sfx.close();
    if (onDoor && !blocked(s.px, s.py + 1)) { s.py++; s.dir = 'down'; this.updateHero(); }
    if (s.achDone && !s.achTold) { s.achTold = true; setTimeout(() => this.say(t().g.allDone), 200); }
  }

  private renderPanel() {
    const wrap = this.el.panel, p = this.s.panel;
    if (!p) { wrap.hidden = true; wrap.innerHTML = ''; return; }
    const g = t().g;
    wrap.hidden = false;
    wrap.innerHTML = `<div class="pwin" role="dialog" aria-modal="true" aria-label="${esc((g.p as any)[p])}">
      <div class="pwin__head"><span class="px pwin__title"><span>◆</span> ${esc((g.p as any)[p])}</span><button class="rbtn" data-close>${esc(g.close)}</button></div>
      ${this.panelBody(p)}
    </div>`;
    wrap.onclick = (e) => { if (e.target === wrap) this.closePanel(); };
    if (p === 'contact') bindContactForm(wrap);
  }

  private panelBody(p: PanelId): string {
    const L = store.state.lang, g = t().g, tt = t();
    if (p === 'quests') {
      const qs = this.s.qSel, j = JOBS[qs];
      const status = (x: typeof j) => (x.side ? g.side : x.to ? g.done : g.active);
      return `<div class="quests">
        <div class="quests__list">${JOBS.map((x, i) => `<button class="qrow ${i === qs ? 'is-sel' : ''}" data-quest="${i}"><span class="qrow__cur">${i === qs ? '▶' : ''}</span><span class="qrow__txt"><span>${esc(x.company)}</span><span class="${x.to ? '' : 'is-active'}">${esc(status(x))}</span></span></button>`).join('')}
          <span class="hint">${esc(g.questHint)}</span></div>
        <div class="quests__detail">
          <span class="px quests__role">${esc(j.role[L])}</span>
          <dl class="kv"><dt>${esc(g.giver)}</dt><dd>${esc(j.company + (j.place ? ' · ' + j.place[L] : ''))}</dd><dt>${esc(g.when)}</dt><dd>${esc(period(j, L))}</dd><dt>${esc(g.reward)}</dt><dd>${esc(duration(j, L))}</dd></dl>
          <span class="px label">${esc(g.obj)}</span>
          ${j.b[L].map((b) => `<div class="obj"><span class="${j.to ? 'is-done' : 'is-active'}">${j.to ? '✔' : '◆'}</span><span>${esc(b)}</span></div>`).join('')}
        </div></div>`;
    }
    if (p === 'items') {
      const list = SKILLS.filter((k) => k.c === CATS[this.s.gCat]), sel = Math.min(this.s.iSel, list.length - 1), si = list[sel];
      const ab = (n: string) => { const w = n.replace(/[()/&]/g, ' ').split(/\s+/).filter(Boolean); return (w.length > 1 && n.length > 6 ? w[0][0] + w[1][0] : w[0].slice(0, 3)).toUpperCase(); };
      const key = si.n.split(' ')[0].toLowerCase();
      const used = JOBS.filter((j) => j.tags.some((tg) => si.n.toLowerCase().includes(tg.toLowerCase()) || tg.toLowerCase().includes(key)) || j.b.en.some((b) => b.toLowerCase().includes(key))).map((j) => j.company);
      const rc = RARITY_COLORS[si.r];
      return `<div class="items">
        <div class="items__tabs">${CATS.map((c, i) => `<button class="gtab ${i === this.s.gCat ? 'is-sel' : ''}" data-gcat="${i}">${esc((tt.cats as any)[c])}</button>`).join('')}</div>
        <div class="items__main">
          <div class="slots">${list.map((k, i) => `<button class="slot ${i === sel ? 'is-sel' : ''}" data-item="${i}" style="--rc:${RARITY_COLORS[k.r]}" aria-label="${esc(k.n)}"><span>${esc(ab(k.n))}</span></button>`).join('')}</div>
          <div class="card" style="--rc:${rc}">
            <span class="px card__rar">${esc(g.rar[si.r])}</span><span class="card__n">${esc(si.n)}</span>
            <span class="card__m">${esc(g.type)}: ${esc((tt.cats as any)[si.c])}</span>
            <span class="card__src">${esc(used.length ? g.found_in + ': ' + used.join(', ') : g.fromCv)}</span>
          </div>
        </div>
        <span class="hint">${esc(g.itemHint)}</span></div>`;
    }
    if (p === 'academy') return `<div class="scrolls">${EDU.map((e) => `<div class="scroll"><span class="px">SCROLL · ${esc(e.y)}</span><span class="scroll__t">${esc(e.t[L])}</span><span class="scroll__s">${esc(e.s[L])}</span></div>`).join('')}</div>`;
    if (p === 'tavern') return `<p class="lead">${esc(g.tavernIntro)}</p><div class="npcs">${LANGS.map((l) => { const col = `oklch(0.72 0.15 ${l.hue})`; return `<div class="npc"><div class="npc__say">${esc(l.hi)}</div><div class="npc__who"><span style="background:${col}"></span>${esc(l.n[L])}</div><span class="npc__lvl">${esc(l.l[L])}</span><div class="npc__bar"><div style="width:${l.p}%;background:${col}"></div></div></div>`; }).join('')}</div>`;
    if (p === 'contact') return `<p class="lead">${esc(g.postIntro)}</p>
      <div class="ravens"><a class="rbtn rbtn--primary" href="mailto:${LINKS.email}">✉ ${esc(g.raven)}</a><a class="rbtn" href="${LINKS.github}" target="_blank" rel="noopener">GITHUB</a><a class="rbtn" href="${LINKS.linkedin}" target="_blank" rel="noopener">LINKEDIN</a></div>
      <span class="px label">${esc(g.letter)}</span>${contactFormHTML('game')}`;
    // status
    const lvl = Math.floor(careerYears());
    const rows = [[g.st.name, 'Sergkei Kournosenkov'], [g.st.cls, g.cls], [g.st.spec, g.specV], [g.st.home, 'Wuppertal'], [g.st.guild, 'ECS GmbH'], [g.st.lv, lvl]];
    const attrs = [[g.aYears, lvl + '+'], [g.aQuests, JOBS.filter((j) => j.to).length], [g.aItems, SKILLS.length], [g.aLangs, LANGS.length], [g.aScrolls, EDU.length]];
    return `<div class="status"><dl class="kv kv--lg">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <div class="attrs"><span class="px label">${esc(g.attrs)}</span>${attrs.map(([k, v]) => `<div class="attr"><span>${esc(k)}</span><span class="px">${esc(v)}</span></div>`).join('')}</div></div>`;
  }

  // ---------- dialog & toast ----------
  private say(text: string) {
    clearInterval(this.timers.type);
    this.s.dlg = text; this.s.dlgN = 0;
    this.timers.type = window.setInterval(() => {
      this.s.dlgN = Math.min(this.s.dlg.length, this.s.dlgN + 2);
      if (this.s.dlgN % 6 === 0) sfx.type();
      if (this.s.dlgN >= this.s.dlg.length) clearInterval(this.timers.type);
      this.el.dlg.textContent = this.s.dlg.slice(0, this.s.dlgN) + (this.s.dlgN >= this.s.dlg.length ? '  ▼' : '');
    }, 22);
  }

  private skipDialog() {
    clearInterval(this.timers.type); this.s.dlgN = this.s.dlg.length;
    this.el.dlg.textContent = this.s.dlg + (this.s.dlg ? '  ▼' : '');
  }

  private toast(text: string) {
    const d = document.createElement('div');
    d.className = 'toast px'; d.textContent = '★ ' + text;
    this.el.toast.replaceChildren(d);
    setTimeout(() => d.remove(), 2800);
  }

  // ---------- keyboard ----------
  private onKey = (e: KeyboardEvent) => {
    const s = this.s, k = e.key, lk = k.length === 1 ? k.toLowerCase() : k;
    if ((e.target as HTMLElement).closest?.('input,textarea')) return;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(k)) e.preventDefault();
    const vert = lk === 'ArrowDown' || lk === 's' ? 1 : lk === 'ArrowUp' || lk === 'w' ? -1 : 0;
    const horiz = lk === 'ArrowRight' || lk === 'd' ? 1 : lk === 'ArrowLeft' || lk === 'a' ? -1 : 0;
    if (s.panel) {
      if (k === 'Escape' || k === 'Backspace') return this.closePanel();
      if (s.panel === 'quests' && vert) { s.qSel = (s.qSel + vert + JOBS.length) % JOBS.length; sfx.select(); this.renderPanel(); }
      if (s.panel === 'items') {
        const n = SKILLS.filter((x) => x.c === CATS[s.gCat]).length;
        if (horiz) { s.iSel = (s.iSel + horiz + n) % n; sfx.select(); this.renderPanel(); }
        if (vert) { s.gCat = (s.gCat + vert + CATS.length) % CATS.length; s.iSel = 0; sfx.tab(); this.renderPanel(); }
      }
      if (lk === 'c') this.openPanel('status'); if (lk === 'i') this.openPanel('items'); if (lk === 'q') this.openPanel('quests');
      return;
    }
    if (k === 'Enter' || k === ' ') return this.skipDialog();
    const m: Record<string, Dir> = { ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down', ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right' };
    if (m[lk]) { this.cancelWalk(); this.step(m[lk]); return; }
    if (lk === 'c') this.openPanel('status'); if (lk === 'i') this.openPanel('items'); if (lk === 'q') this.openPanel('quests');
    if (lk === 'm') { sfx.on = !sfx.on; const b = this.root.querySelector('[data-sound]'); if (b) b.textContent = `[M] ${sfx.on ? t().g.on : t().g.off}`; }
    if (lk === 'x' || k === 'Escape') this.close();
  };
}
