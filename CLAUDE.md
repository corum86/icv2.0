# CLAUDE.md

Personal CV website (Vite + vanilla TypeScript, no framework). See README.md for structure.

## Conventions
- No frameworks or UI libraries. Rendering is template strings + `esc()` from `src/util.ts`. Always escape user/content strings.
- All content lives in `src/data.ts` (CV) and `src/i18n.ts` (UI). Every string needs `en`, `de` and `el` (Greek; keep commands, tech terms and job titles in English). The compiler enforces it via `L10n` and the `satisfies` checks in `i18n.ts`.
- Styles: plain CSS in `src/styles/`. Theme tokens are CSS variables on `[data-theme]`. Game colours are scoped on `.game`.
- Game pixel art is 16px native. Keep `image-rendering: pixelated`; never smooth-scale sprites.
- Accent colour `#9b5cff`. Fonts: IBM Plex Mono/Sans (CV), Press Start 2P + VT323 (game), Nova Mono (game dialog box). Self-hosted via @fontsource. Never add Google Fonts links (GDPR).
- Analytics only via `track()` in `src/analytics.ts` (Vercel Web Analytics: cookieless, first-party, on only when `VITE_VERCEL_ANALYTICS=true`). No cookies, no other trackers. If you add any third-party service, update `datenschutz.html`.
- Hosting is Vercel. Server code lives only in `api/` (Vercel Functions, Web `Request`/`Response` handlers). Secrets are server-side env vars, never `VITE_`-prefixed.
- SEO: `scripts/seo.ts` (Vite plugin) generates `llms.txt`, `llms-full.txt`, `sitemap.xml` and the language pages from `data.ts`/`work.ts`/`i18n.ts`. Never hand-write those. Only `public/robots.txt` is static. Code it imports must stay DOM-free (`src/format.ts`, not `src/util.ts`).
- Language URLs: `index.html` and `portfolio.html` (`LOCALIZED` in `src/config.ts`) are built once per language as `/en/`, `/de/`, `/el/` and `/<lang>/portfolio.html`. Their title, description, canonical, hreflang, OG tags and `<noscript>` content come from `scripts/seo.ts` (markers `<!--seo:head-->`, `<!--seo:body-->`; texts in `i18n.ts` → `seo`), so never put those tags in the HTML files. On a language URL the path decides the language; `/` and `/portfolio.html` are entry points that detect it and move to the language URL (`src/store.ts`). Link to these pages with `langUrl()` from `src/store.ts`; `public/lang-init.js` must follow the same rules.
- Keep the top of the page "important info first": name, role, profile, CTAs (Email, GitHub, LinkedIn) in the first viewport.

## Commands
- `npm run dev`, `npm run build` (runs `tsc --noEmit` first), `npm run preview`.

## Design reference
The original interactive prototype (design reference, not production code) is `design-reference/Sergkei CV.dc.html` + `world.js`.

## Implementation spec
**Start with `docs/handoff/00-README.md`.** It contains the exact layout, tokens, behaviour and QA checklist the implementation must match. Scope all game CSS under `.game` and all CV CSS under the CV root. Never use bare global class names shared by both views.

## Selected work
Spec: `docs/handoff/06-work-section.md`. `src/work-section.ts` (`mountWork(page, items, all)`) builds the section once; `cv.ts` re-inserts that element on every render so card videos keep playing across language switches. Data in `src/work.ts`: the CV shows `SELECTED` plus a button to `portfolio.html` (`src/portfolio.ts`, all of `WORK`); `portfolioOnly: true` keeps a project off the CV, and the CV forwards `#work/<slug>` links for those to the portfolio. Strings in `src/i18n.ts`, styles in `src/styles/work.css` (`.wk-*` only), media in `public/work/` (re-record with `npm run record:work -- <slug>`). While the case-study drawer is open `html.wk-lock` is set; game keys and the CV scroll trigger check it.

## Collaboration
- **Claude Code owns:** `src/`, `api/`, build config.
- **Claude Design owns:** `design-reference/`, `docs/handoff/`, new media in `public/`.
- **Design changes** arrive as `handoff/<date>-<topic>/CHANGES.md` packages. Apply them by merging, never by overwriting files Claude Code has changed. Then delete the folder.
