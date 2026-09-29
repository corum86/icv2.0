# kournosenkov.com — interactive CV

Personal CV site for **Sergkei Kournosenkov** (Web & Software Developer, Full-Stack with a frontend focus).
The top of the page is a terminal-styled CV (EN/DE, dark/light). Scrolling past the end glitches into a playable retro-RPG village where each building opens part of the CV.

Stack: **Vite + vanilla TypeScript**, no framework. Hosted on **Vercel**, contact form via a Vercel Function + Resend.

## Run

```bash
npm install
cp .env.example .env    # optional: analytics config
npm run dev             # http://localhost:5173
npm run build           # type-check + production build → dist/
npm run preview
```

## Project structure

```
index.html              SEO meta, OG/Twitter tags, JSON-LD Person
datenschutz.html        Privacy policy (GDPR), DE/EN/EL
cv.html                 Printable CV (A4, HR-oriented), rendered by src/print.ts
portfolio.html          All projects + case studies, rendered by src/portfolio.ts
vercel.json             Build settings, apex→www redirect, security + cache headers
api/
  contact.ts            Vercel Function: POST /api/contact → sends mail via Resend
public/
  sprites/              Game sprite sheets (16px tiles) + hero.png (3×3 frames, 28×34 each)
  og-image.png          1200×630 social share image
  favicon.svg / favicon-32.png / apple-touch-icon.png / site.webmanifest
  robots.txt / sitemap.xml
src/
  main.ts               Bootstrap: fonts, CV, game, glitch transition
  config.ts             Links (email, GitHub, LinkedIn), GAME_TRIGGER, SCANLINES
  data.ts               ← CV content (jobs, skills, education, languages). Edit here.
  i18n.ts               UI strings EN/DE/EL
  store.ts              lang/theme state (URL ?lang=, localStorage, system prefs)
  cv.ts                 CV page render + interactions + scroll-to-game zone
  terminal.ts           Fake shell in the hero (help, whoami, stack, contact, play, lang, theme, clear)
  contact.ts            Contact form UI (CV + game Post Office), posts JSON to /api/contact
  glitch.ts             Hard-cut glitch overlay
  analytics.ts          Vercel Web Analytics loader + track()
  print.ts              Printable CV page: same data as the site, toolbar (print, language), A4 print rules
  work.ts               Projects (WORK). `portfolioOnly` ones are left out of the CV's selected work (SELECTED)
  work-section.ts       Project cards + case-study drawer, used by the CV (SELECTED) and portfolio.ts (all)
  portfolio.ts          Portfolio page: header, all projects, footer
  game/
    world.ts            Map layout, collisions, canvas drawing, BFS pathfinding
    game.ts             Game controller: HUD, hero movement/animation, panels, dialog, keyboard/touch
    audio.ts            WebAudio chiptune SFX
  styles/cv.css, game.css, legal.css, print.css
```

## Editing content

- **CV text**: `src/data.ts`. Every job/education/language entry has `en` and `de`. Both the CV page and the game read from here.
- **UI copy**: `src/i18n.ts` (`BASE` for original strings, `EXTRA` for form/footer/touch strings).
- **Links**: `src/config.ts`.
- **Game trigger**: `GAME_TRIGGER = 'button'` in `src/config.ts` disables the scroll trigger (only Play buttons start the game).

## Game

- Map is 32×21 tiles of 16px, drawn on a canvas and scaled with `image-rendering: pixelated`.
- Buildings: Guild Hall → quest log (jobs), Armory → inventory (skills), Academy → education, Tavern → languages, Post Office → contact form. Status sheet via `C`.
- Controls: arrows/WASD, click/tap to walk (BFS path), swipe to walk in a direction, hold the D-pad, `C`/`I`/`Q` panels, `M` sound, `X`/`Esc` exit.
- To move things: edit `BLD`, `POND`, the path lines and the decor list in `src/game/world.ts`. `blocked()` defines collisions; doors are the bottom-centre tile of each 7×7 building footprint.
- Houses are composited from `house.png`: a 108px pitched roof (`ROOF` x-offsets per colour) + a 32px wall row (`WALLY` per material).
- Hero sheet has no back-facing row; walking up uses the front frames. Add a 4th row to `hero.png` and set `HERO_ROW.up = 3` and `background-size: 300% 400%` to support it.
- Sprite art licensing: check the licence of the tileset/sprite packs before publishing and add attribution if required.

## Contact form (Vercel Function + Resend)

The forms POST JSON to `/api/contact` (`api/contact.ts`). The function validates input, drops honeypot submissions (`bot-field`) and sends the message through Resend with `reply_to` set to the visitor's address.

Setup:
1. Create a Resend account, add and verify the domain `kournosenkov.com` (DNS records), create an API key.
2. In Vercel → Project → Settings → Environment Variables set `RESEND_API_KEY`, `CONTACT_TO` (default `ser.corum@gmail.com`) and `CONTACT_FROM` (e.g. `kournosenkov.com <contact@kournosenkov.com>`).
3. Local testing of the function: `npm i -g vercel && vercel dev` (plain `npm run dev` serves the site but not `/api`; the form then shows the email fallback).

To use a different mail service, only `api/contact.ts` changes. Update `datenschutz.html` §3 accordingly.

## Analytics (Vercel Web Analytics)

Cookieless and first-party (script served from `/_vercel/insights/` on our own domain), so no consent banner and no extra CSP entries. To turn it on: enable **Web Analytics** for the project in the Vercel dashboard, then set `VITE_VERCEL_ANALYTICS=true` (Vercel → Environment Variables; read at build time, so redeploy after changing). Unset or empty = no analytics script at all. Never loads on localhost. Page views work on the free Hobby plan. The custom events sent via `track()` (`Game Entered`, `Area Visited`, `All Areas Explored`, `Contact Submitted`, `Work Opened`, `Portfolio Opened`, `Printable CV Opened`, `CV Printed`, …) are only recorded on Vercel's Pro plan; on Hobby they are dropped.

## Deploy (Vercel)

1. Push this folder to a Git repo, then in Vercel "Add New → Project" and import it. Framework preset: Vite (settings are also in `vercel.json`: build `npm run build`, output `dist`).
2. Set the environment variables (Resend + `VITE_VERCEL_ANALYTICS`, see above) and enable Web Analytics in the project.
3. Domains: add `www.kournosenkov.com` and `kournosenkov.com`, choose "Redirect kournosenkov.com → www.kournosenkov.com" (a matching rule is also in `vercel.json`). Set the DNS records Vercel shows at your registrar.
4. Sign Vercel's and Resend's DPA (GDPR) in their dashboards.

## Legal

`datenschutz.html` is a template written for this setup (Vercel hosting, Resend for the contact form, Vercel Web Analytics, self-hosted fonts, localStorage for lang/theme). **Have it checked** before going live. Update it if you change the hosting, form or analytics provider.

## Accessibility & performance notes

- Fonts are self-hosted via `@fontsource` (no Google Fonts requests: GDPR).
- `prefers-reduced-motion` shortens the glitch and disables shake/animations.
- Skip link, `aria-expanded` on the experience accordion, `aria-pressed` on toggles, dialogs with `role="dialog"`.
- Game panels are keyboard-navigable. Typing in the contact form doesn't trigger game shortcuts.
