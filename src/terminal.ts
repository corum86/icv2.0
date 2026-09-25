import { store, t } from './store';
import { esc } from './util';
import { LINKS } from './config';

type Kind = 'in' | 'out' | 'dim' | 'acc' | 'err';
interface Line { k: Kind; s: string }

/** Tiny fake shell in the hero. Commands: help, whoami, stack, contact, experience, play, lang, theme, clear. */
export class Terminal {
  private lines: Line[] | null = null;
  constructor(private enterGame: () => void) {}

  private defaults(): Line[] {
    return [
      { k: 'in', s: 'whoami' },
      { k: 'out', s: 'Sergkei Kournosenkov — ' + t().role },
      { k: 'dim', s: 'commands: help · stack · contact · play' },
    ];
  }

  html() {
    return `
    <div class="term" data-term>
      <div class="term__bar"><span>sergkei@wuppertal: ~</span><span>${esc(t().termHint)}</span></div>
      <div class="term__body" data-term-body>
        <div data-term-lines>${this.linesHTML()}</div>
        <label class="term__prompt"><span aria-hidden="true">❯</span><input data-term-input spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Terminal command"></label>
      </div>
    </div>`;
  }

  private linesHTML() {
    return (this.lines || this.defaults()).map((l) => `<div class="term__line term__line--${l.k}">${l.k === 'in' ? '❯ ' : ''}${esc(l.s)}</div>`).join('');
  }

  bind(root: ParentNode) {
    const term = root.querySelector<HTMLElement>('[data-term]'); if (!term) return;
    const input = term.querySelector<HTMLInputElement>('[data-term-input]')!;
    const body = term.querySelector<HTMLElement>('[data-term-body]')!;
    term.addEventListener('click', () => input.focus({ preventScroll: true }));
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      this.run(input.value); input.value = '';
      term.querySelector('[data-term-lines]')!.innerHTML = this.linesHTML();
      body.scrollTop = body.scrollHeight;
    });
  }

  private run(raw: string) {
    const c = raw.trim().toLowerCase(), out: Line[] = [];
    const P = (s: string, k: Kind = 'out') => out.push({ k, s });
    if (!c) return;
    if (c === 'help') P('whoami · stack · contact · experience · play · lang · theme · clear');
    else if (c === 'whoami') P(`Sergkei Kournosenkov — ${t().role} (${t().loc})`);
    else if (c === 'stack' || c === 'skills') P('Angular · React · Tailwind · Java Spring Boot · PostgreSQL · MySQL · Mendix · Claude Code');
    else if (c === 'contact') P(`${LINKS.email} · github.com/corum86`, 'acc');
    else if (c === 'experience') { P('→ #experience'); setTimeout(() => { const el = document.getElementById('experience'); if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - 60, behavior: 'smooth' }); }, 50); }
    else if (c === 'play' || c === 'start') { P('loading game mode…', 'acc'); setTimeout(this.enterGame, 400); }
    else if (c.startsWith('lang')) { const l = store.state.lang === 'en' ? 'de' : 'en'; P('lang = ' + l); setTimeout(() => store.set({ lang: l }), 0); }
    else if (c === 'theme') { store.set({ theme: store.state.theme === 'dark' ? 'light' : 'dark' }); P('theme = ' + store.state.theme); }
    else if (c === 'clear') { this.lines = []; return; }
    else if (c.startsWith('sudo')) P('nice try.', 'err');
    else P('command not found: ' + c, 'err');
    this.lines = [...(this.lines || this.defaults()), { k: 'in', s: raw }, ...out];
  }
}
