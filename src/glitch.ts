import { reducedMotion } from './util';
import { sfx } from './game/audio';

/** Hard-cut glitch overlay. Resolves when the screen is fully covered and it's safe to swap views. */
export function playGlitch(): Promise<void> {
  const quick = reducedMotion();
  const o = document.createElement('div');
  o.className = 'glitch';
  o.setAttribute('aria-hidden', 'true');
  if (!quick) {
    const cols = ['#9b5cff', '#00f0ff', '#ff2d6f', '#f2f0ff'];
    for (let i = 0; i < 16; i++) {
      const b = document.createElement('div');
      b.className = 'glitch__bar';
      b.style.cssText = `top:${i * 6.2 + Math.random() * 4}%;height:${1 + Math.random() * 7}%;background:${cols[i % 4]};animation-duration:${0.06 + Math.random() * 0.1}s`;
      o.appendChild(b);
    }
    document.body.classList.add('is-shaking');
  }
  const label = document.createElement('div');
  label.className = 'glitch__label';
  label.textContent = 'GAME MODE';
  o.appendChild(label);
  document.body.appendChild(o);
  sfx.glitch();
  return new Promise((res) => setTimeout(() => {
    document.body.classList.remove('is-shaking');
    res();
    setTimeout(() => o.remove(), 60);
  }, quick ? 250 : 900));
}
