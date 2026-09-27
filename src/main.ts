// Latin subset only: per-subset fontsource CSS has no unicode-range, so adding more subsets would download them all.
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/press-start-2p/400.css'; // glitch label; the rest of the game fonts load with the game chunk
import './styles/fonts.css';
import './styles/cv.css';
import './styles/work.css';
import { applyDocument } from './store';
import { mountCV } from './cv';
import { playGlitch } from './glitch';
import { initAnalytics } from './analytics';
import type { Game } from './game/game';

applyDocument();
initAnalytics();

// Game mode is lazy: fetched on intent (hover/focus on Play, scrolling into the zone), otherwise on Play itself.
let gameP: Promise<typeof import('./game/game')> | undefined;
const loadGame = () => (gameP ??= import('./game/game').catch((e) => { gameP = undefined; throw e; }));

let busy = false, game: Game | undefined;
const cv = mountCV(document.getElementById('app')!, async () => {
  if (busy || document.body.classList.contains('in-game')) return;
  busy = true;
  try {
    const [mod] = await Promise.all([loadGame(), playGlitch()]);
    game ??= new mod.Game(document.getElementById('game-root')!, () => cv.onReturn());
    game.open();
  } catch (e) {
    console.error('Game mode failed to load', e);
  } finally {
    busy = false;
  }
}, () => { loadGame().catch(() => {}); });
