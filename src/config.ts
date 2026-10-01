export const LINKS = {
  email: 'ser.corum@gmail.com',
  github: 'https://github.com/corum86',
  linkedin: 'https://www.linkedin.com/in/sergkei-kournosenkov-10659592/',
  site: 'https://www.kournosenkov.com/',
};

/** Pages that also exist per language: /en/, /de/, /el/ and /<lang>/portfolio.html (emitted by scripts/seo.ts).
 *  The unprefixed URLs stay as entry points: src/store.ts picks the language there and moves to the language URL. */
export const LOCALIZED = ['/', '/portfolio.html'] as const;
export type LocalizedPage = typeof LOCALIZED[number];

/** 'scroll' =scrolling to the end of the CV glitches into game mode. 'button' = only the Play buttons do. */
export const GAME_TRIGGER: 'scroll' | 'button' = 'scroll';
/** CRT scanline overlay in game mode. */
export const SCANLINES = true;
