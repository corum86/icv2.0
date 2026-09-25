let ctx: AudioContext | null = null;
let enabled = true;

function ac() {
  if (!enabled) return null;
  try { ctx = ctx || new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function beep(f: number, d = 0.06, type: OscillatorType = 'square', v = 0.04, delay = 0) {
  const a = ac(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = f; g.gain.value = v;
  o.connect(g); g.connect(a.destination);
  const t0 = a.currentTime + delay;
  o.start(t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d); o.stop(t0 + d + 0.02);
}

export const sfx = {
  get on() { return enabled; },
  set on(v: boolean) { enabled = v; },
  step: () => beep(260, 0.02, 'triangle', 0.02),
  bump: () => beep(110, 0.04, 'square', 0.02),
  select: () => beep(600, 0.03),
  tab: () => beep(450, 0.04),
  open: () => [392, 523, 659].forEach((f, i) => beep(f, 0.08, 'square', 0.035, i * 0.06)),
  close: () => beep(330, 0.05),
  type: () => beep(700, 0.02, 'square', 0.015),
  start: () => [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.12, 'square', 0.04, i * 0.1)),
  achievement: () => [523, 659, 784, 1047, 1319].forEach((f, i) => beep(f, 0.1, 'square', 0.04, i * 0.08)),
  glitch: () => { for (let i = 0; i < 12; i++) beep(80 + Math.random() * 900, 0.06, 'sawtooth', 0.03, i * 0.06); },
};
