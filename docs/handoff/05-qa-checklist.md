# 05 · QA checklist & known causes of the broken layout

## Root causes already identified (fix these first)

1. **Global class collision (fixed in this handoff).** `game.css` defined `.hero { position:absolute; width:5.469%; … background:url(hero.png) }` for the game sprite, and `cv.css` used `.hero` for the CV hero section. Because both stylesheets load globally, the CV hero section became a tiny absolutely-positioned box, and everything below it collapsed upward. The game sprite is now `.game .player`.
   **→ Rule: scope every game selector under `.game`** (or prefix with `g-`), and every CV selector under `#app` or `.cv-`. Audit `game.css` for other generic names still global: `.hint`, `.label`, `.lead`, `.card`, `.status`, `.items`, `.scroll`, `.slot`, `.obj`, `.kv`, `.attr`, `.toast`, `.scan`, `.bottom`, `.stage`, `.map`. Nest them all under `.game` (and the panel overlay, which is inside `.game`).
2. **Map sizing (fixed).** The map width was an estimate (`100dvh − 300px`), so it overflowed the dialog on short screens and was tiny on tall ones. It now uses container query units on `.stage` (`container-type: size`, width `min(100cqw, 100cqh·32/21)`). Verify there's no overlap at 1440×900, 1280×720, 1024×768, 390×844 and 844×390.
3. **Button reset.** `cv.css` resets `button { background:none; border:0; padding:0; font:inherit; color:inherit }`. Every styled button must set its own padding/border. Check the language segmented control, chips, accordion headers, D-pad and panel rows after the reset.
4. **Hidden roots.** `#game-root[hidden]` must be `display:none`, and `.panel-wrap[hidden]` too (the `display:grid` rule otherwise overrides the `hidden` attribute). Both rules exist. Keep them after any refactor.
5. **Fonts.** Make sure all `@fontsource` CSS imports load (network tab: 7 woff2 files, all same-origin). If Plex fails to load, the name/headings reflow badly.

## Visual acceptance (compare with `design-reference/Sergkei CV.dc.html`)

### CV
- [ ] Header is a single row at every width. Nav is hidden ≤ 640px. Logo, EN/DE, theme and Play are visible.
- [ ] 1440×900: name, role, profile, 3 CTAs and the core-stack pills all fit **above the fold**. The terminal sits to the right, vertically centred.
- [ ] ≤ 899px: the terminal stacks under the text, full width.
- [ ] Facts: 4 columns at ≥ 1000px, wrapping gracefully below. No orphaned borders.
- [ ] Experience: period column 160px on desktop, bullets aligned under the role title. ECS open by default. The +/− sign flips.
- [ ] Skills: typing filters live without losing focus. The count updates. Chips toggle. Hover lift on tiles.
- [ ] Education/Languages side by side ≥ 730px, stacked below. Language meters at 100/85/70/70%.
- [ ] Contact: title, email link, CTAs, form (2 fields in a row + message), privacy note linking to `/datenschutz.html`.
- [ ] Footer links to Datenschutz.
- [ ] Game zone: sticky box centred, bar fills with scroll, jitter above 60%, title text switches above 90%.
- [ ] Light theme: all text readable. Accent text uses `#6d35d6`.
- [ ] No horizontal scrollbar at 390px (check `document.documentElement.scrollWidth === innerWidth`).

### Game
- [ ] Glitch covers the screen ~0.9s, then the game appears with no CV visible behind it and no page scroll.
- [ ] HUD on one row on desktop. The 6 buttons fit on one row at 390px.
- [ ] Map is crisp (no blur), keeps 32:21, never overlaps the HUD or dialog, and is centred.
- [ ] Name plates sit on the roofs of the 5 houses and read correctly (EN/DE).
- [ ] Hero is ~2 tiles tall, feet on the tile, walking animation cycles, idles after stopping, faces left/right correctly.
- [ ] Water animates. The trees on the border overlap correctly (drawn by base y).
- [ ] Dialog: typewriter, click skips, `▼` when done, hint text matches the input type (keyboard vs touch).
- [ ] Every panel opens from its door, looks like the spec, scrolls internally when tall, and closes via ESC, the button and a backdrop click. The hero steps out of the doorway on close.
- [ ] Toasts appear centred under the HUD and fade.
- [ ] Mobile portrait: HUD → map → dialog → big D-pad, all visible without scrolling at 390×844 and 375×667.
- [ ] Mobile landscape (844×390): map left, D-pad + dialog right, map fills the height.

## Functional acceptance
- [ ] Keyboard: arrows/WASD, C/I/Q, M, X/Esc, Enter/Space, panel navigation as in `04`.
- [ ] Touch: tap tile, tap building, swipe, hold D-pad. No double-tap zoom, no text selection, no context menu on long press.
- [ ] Typing in the contact form (CV or Post Office) never triggers game shortcuts.
- [ ] Contact form: validation, sending state, success, error with mailto fallback. With `vercel dev` and a Resend key, an email arrives with the correct reply-to.
- [ ] EN/DE switch in the CV and in the game (HUD button), persisted across reloads. `?lang=de` works.
- [ ] Theme persisted. The first visit respects system preference.
- [ ] Returning from the game scrolls to the top and doesn't immediately re-trigger. Scrolling down fully again re-triggers.
- [ ] `prefers-reduced-motion` respected.

## Technical acceptance
- [ ] `npm run build` passes (strict tsc for `src` and `vite.config.ts`).
- [ ] No console errors or warnings.
- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO 100.
- [ ] Only same-origin requests (except Plausible if enabled). No Google Fonts, no cookies.
- [ ] `og-image.png` resolves at `https://www.kournosenkov.com/og-image.png`, checked with a social preview debugger.
- [ ] `vercel.json` redirects apex → www, security headers present.

## Nice-to-have (after acceptance)
- Keep game progress (visited areas, position) for the session.
- A back-facing row for the hero sprite (sheet currently has only down/left/right).
- Blend path edges using the terrain autotiles instead of plain dirt tiles.
- Pre-render the English CV into `index.html` at build time for faster first paint and no-JS crawlers.
