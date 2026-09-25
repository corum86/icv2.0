# 04 · Behaviour, state & interactions

## Global state (`src/store.ts`)

| Key | Values | Initial | Persisted |
|---|---|---|---|
| `lang` | `en` \| `de` | `?lang=` param → `localStorage.lang` → `navigator.language` starts with `de` → `en` | localStorage |
| `theme` | `dark` \| `light` | `localStorage.theme` → `prefers-color-scheme` → `dark` | localStorage |

On change: set `<html lang>` and `data-theme`, update `<meta name="theme-color">`. A language change re-renders the CV (and the game shell if open). A theme change only updates CSS (attribute) and the theme button label. **Scroll position must be kept on language change.**

## CV interactions

| Element | Behaviour |
|---|---|
| Nav links | Smooth scroll to section. Sections have `scroll-margin-top: 60px` for the sticky header |
| EN/DE | Switch language instantly. `aria-pressed` on the active one |
| Theme button | Toggle dark/light, 0.3s colour transition |
| Play buttons (header, zone "Skip") | Start game (glitch → game) |
| Terminal | Commands (case-insensitive): `help`, `whoami`, `stack`/`skills`, `contact`, `experience` (scroll to section), `play`/`start` (enter game after 400ms), `lang` (toggle), `theme` (toggle), `clear`, `sudo…` → "nice try.", anything else → `command not found: x` (red). History survives language changes. Click anywhere on the card focuses the input without scrolling the page |
| Experience | Accordion, single open, ECS open by default |
| Skills search | Live substring filter across the selected category. Count updates. Input keeps focus |
| Skill chips | Single-select category filter, "All" default |
| Contact form | See below |
| Game zone | Scroll progress `p = clamp(−rect.top / (rect.height − innerHeight), 0, 1)` updates the bar and %. At `p ≥ 0.995` trigger game once. Re-arm only after the user scrolled back below 50%, so returning from the game never re-triggers immediately |

## Game lifecycle

1. **Enter:** guard against double triggers → glitch (900ms) → mount game DOM → start map draw loop (380ms) → attach keydown → play start jingle → after 350ms type the intro dialog → `track('Game Entered')`.
2. **Exit** (`X`, `Esc` with no panel open, or the Exit button): clear all timers, remove listeners, unmount, `body` scroll restored, **scroll CV to top instantly**, scroll trigger disarmed until re-armed as above.
3. Game state (position, visited areas) resets on each entry. Optional improvement: keep it in memory for the session.

## Movement

- Grid-based, 1 tile per step. `blocked(x,y)` decides collisions. Bumping plays a low "bump" and turns the hero to face the wall.
- **Keyboard:** Arrows / WASD step. Holding a key uses OS key-repeat (fine). Any manual step cancels auto-walk.
- **Click/tap on the map:** BFS path (`findPath`) to the tile, 105ms per step. Doors are only allowed as the final tile (never walk *through* a door).
- **Click/tap a building:** walk to its door.
- **Swipe on the map** (> 28px): walk continuously in the swipe direction every 120ms until blocked or a door is reached.
- **D-pad:** `pointerdown` steps once, then repeats every 150ms while held. Stops on `pointerup/cancel/lostpointercapture`. Use pointer capture. Prevent the context menu and double-tap zoom (`touch-action: none`).
- **Door tiles:** stepping onto one stops all walking and opens that building's panel after 150ms.

## Areas, progress, achievements

- First visit of a building: mark it visited, show toast `★ NEW AREA: <NAME>`, add `★` to its name plate, update `N/5 explored`, `track('Area Visited', {area})`.
- When all 5 are visited: after 1.2s toast `★ ACHIEVEMENT UNLOCKED: EXPLORER` + fanfare, `track('All Areas Explored')`. When that panel is closed, the guide says the "all explored" line (once).
- Closing a panel while standing on a door moves the hero one tile down (out of the doorway) so it doesn't re-open.

## Panels: keyboard

| Panel | Keys |
|---|---|
| Any | `Esc`/`Backspace` close. `C`/`I`/`Q` switch panel |
| Quest log | `↑↓`/`WS` select quest (wraps) |
| Inventory | `←→`/`AD` select item in category (wraps), `↑↓`/`WS` switch category (wraps, resets item to 0) |

Mouse/touch: click rows, tabs and slots. `Enter`/`Space` outside panels skip the dialog typewriter. `M` toggles sound. Game shortcuts are **ignored while focus is in an input/textarea**, so typing a letter in the form must not move the hero or close anything.

## Sound (`src/game/audio.ts`)

WebAudio square/triangle beeps, created lazily on the first user gesture. Events: step, bump, select, tab, open (3-note), close, typewriter tick (every 6 chars), start jingle (4-note), achievement (5-note), glitch noise (12 random sawtooth blips). Toggle with `M`/button. Default on.

## Contact form

- Fields: `name` (required, ≤ 120), `email` (required, type email, ≤ 200), `message` (required, ≤ 5000), hidden `source` (`cv` | `game`), honeypot `bot-field`.
- Client: native validation (`reportValidity`), then `POST /api/contact` with JSON. The button shows "Sending…" and is disabled. Success: reset the form, show the green message, `track('Contact Submitted', {source})`. Error: red message + mailto fallback link.
- Server (`api/contact.ts`): validates again, silently accepts honeypot hits, sends via Resend with `reply_to` = the visitor's email. Returns `{ok:boolean}`. Env: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.

## i18n rules

- All copy from `T[lang]` (`src/i18n.ts`) and `data.ts` `{en, de}` fields. No literal UI strings in templates except proper nouns, commands and the `SK` badge.
- Terminal output stays English in both languages (it's a shell).
- German legal pages are German-only with a one-line English note.

## Analytics events (Plausible, cookieless)

`Game Entered`, `Area Visited {area}`, `All Areas Explored`, `Contact Submitted {source}`. Loaded only when `VITE_PLAUSIBLE_DOMAIN` is set and not on localhost.

## Accessibility

- Skip link to `#main`. Visible `:focus-visible` outline 2px `--accent`, offset 2px.
- Accordion headers are buttons with `aria-expanded`. Toggles use `aria-pressed`. Panels are `role=dialog aria-modal`. The dialog text is `aria-live=polite`. The canvas and hero are `aria-hidden`. Building hotspots are real buttons (keyboard-focusable, Enter opens by walking to the door).
- `prefers-reduced-motion`: disable caret blink, jitter, shake, hero transition. Glitch becomes a 250ms fade.
- Contrast: body text ≥ 4.5:1 in both themes (tokens are chosen for this).
