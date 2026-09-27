# Handoff: kournosenkov.com — Interactive CV + RPG game mode

**Read this first.** This folder is the implementation spec for Claude Code. Its job is to make the Vite + vanilla TS project in the repo root match the approved design exactly.

## Source of truth

1. **`design-reference/Sergkei CV.dc.html`**: the approved, working prototype. Open it in a browser (serve the folder, e.g. `npx serve design-reference`) to see the intended result. All layout values in these docs were taken from it. **If a doc and the prototype disagree, the prototype wins.**
2. `design-reference/world.js`: the prototype's map/drawing code. `src/game/world.ts` is a direct port and should behave the same.
3. These docs describe exact measurements, states and behaviour so you don't have to reverse-engineer the prototype's inline styles.

The prototype uses inline styles in a custom template format. **Don't copy that format.** Recreate it as plain HTML (template strings) + CSS classes in `src/styles/*.css`, which is what the project already does. The current CSS was ported by hand and **the layout is reported as broken**. Treat `src/styles/cv.css` and `src/styles/game.css` as a draft to fix against these docs. Don't assume they're correct.

## Documents

| File | Content |
|---|---|
| `01-design-tokens.md` | Colours, typography, spacing, radii, borders, z-index |
| `02-cv-page.md` | CV page, section by section: layout, sizes, states, responsive rules |
| `03-game-mode.md` | Game screen layout: HUD, map, hero, dialog, D-pad, panels, toasts |
| `04-behaviour.md` | Interactions, state, transitions, keyboard/touch, i18n, analytics events |
| `05-qa-checklist.md` | Acceptance checklist + likely causes of the current layout breakage |
| `06-work-section.md` | Portfolio section: cards, videos, case-study drawer, record:work script |

## Fidelity

**High fidelity.** Match colours, type, spacing and interactions exactly. Pixel art must stay crisp (`image-rendering: pixelated`, integer-ish scaling, never smoothed).

## Scope / priorities

1. **P0: Fix layout** of the CV page and game mode to match `02` and `03` at 1440px, 1024px, 768px, 390px widths, plus a phone in landscape.
2. **P0:** Game mode must fill the viewport with no page scroll. The map keeps a 32:21 aspect ratio and never overlaps the dialog box or HUD.
3. **P1:** All behaviour in `04` works (keyboard, touch, panels, i18n, theme, contact form, scroll trigger).
4. **P1:** Lighthouse: Accessibility ≥ 95, SEO 100, Performance ≥ 90 on mobile.
5. **P2:** Code quality. Keep the existing module split (see repo `README.md`). No frameworks.

## Hard constraints

- Vite + vanilla TypeScript. No UI framework, no CSS framework.
- Fonts self-hosted via `@fontsource/*` only (GDPR). Never add Google Fonts `<link>`s.
- No cookies. Analytics only via `track()` (Plausible). Contact form only via `api/contact.ts` (Vercel Function → Resend).
- Content comes from `src/data.ts` (CV) and `src/i18n.ts` (UI). Every string exists in `en` and `de`. Don't hard-code copy in markup.
- Deployed on Vercel (`vercel.json`). Server code only in `/api`.

## Workflow suggestion for Claude Code

1. `npm run dev` and open `design-reference/Sergkei CV.dc.html` side by side (served separately).
2. Work section by section in the order of `02-cv-page.md`, then `03-game-mode.md`. Compare at each breakpoint.
3. Tick the boxes in `05-qa-checklist.md`.
4. `npm run build` must pass (`tsc` strict + Vite).
