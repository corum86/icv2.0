import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/press-start-2p/400.css';
import '@fontsource/vt323/400.css';
import './styles/cv.css';
import './styles/game.css';
import { applyDocument } from './store';
import { mountCV } from './cv';
import { Game } from './game/game';
import { playGlitch } from './glitch';
import { initAnalytics } from './analytics';

applyDocument();
initAnalytics();

let busy = false;
const cv = mountCV(document.getElementById('app')!, async () => {
  if (busy || document.body.classList.contains('in-game')) return;
  busy = true;
  await playGlitch();
  game.open();
  busy = false;
});
const game = new Game(document.getElementById('game-root')!, () => cv.onReturn());
