# CLAUDE.md

Personal CV website (Vite + vanilla TypeScript, no framework). See README.md for structure.

## Conventions
- No frameworks or UI libraries. Rendering is template strings + `esc()` from `src/util.ts`. Always escape user/content strings.
- All content lives in `src/data.ts` (CV) and `src/i18n.ts` (UI). Every string needs both `en` and `de`.
- Styles: plain CSS in `src/styles/`. Theme tokens are CSS variables on `[data-theme]`. Game colours are scoped on `.game`.
- Game pixel art is 16px native. Keep `image-rendering: pixelated`; never smooth-scale sprites.
- Accent colour `#9b5cff`. Fonts: IBM Plex Mono/Sans (CV), Press Start 2P + VT323 (game). Self-hosted via @fontsource. Never add Google Fonts links (GDPR).
- Analytics only via `track()` in `src/analytics.ts` (Plausible, cookieless). No cookies, no other trackers. If you add any third-party service, update `datenschutz.html`.
- Hosting is Vercel. Server code lives only in `api/` (Vercel Functions, Web `Request`/`Response` handlers). Secrets are server-side env vars, never `VITE_`-prefixed.
- Keep the top of the page "important info first": name, role, profile, CTAs (Email, GitHub, LinkedIn) in the first viewport.

## Commands
- `npm run dev`, `npm run build` (runs `tsc --noEmit` first), `npm run preview`.

## Design reference
The original interactive prototype (design reference, not production code) is `design-reference/Sergkei CV.dc.html` + `world.js`.

## Implementation spec
**Start with `docs/handoff/00-README.md`.** It contains the exact layout, tokens, behaviour and QA checklist the implementation must match. Scope all game CSS under `.game` and all CV CSS under the CV root. Never use bare global class names shared by both views.
