# 01 · Design tokens

## Colour

### CV page (themeable via `html[data-theme]`)

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--bg` | `#0f0e13` | `#f7f6f9` | Page background |
| `--fg` | `#ecebf1` | `#17161c` | Primary text |
| `--mut` | `#9c9aa8` | `#5b5967` | Secondary text, labels, meta |
| `--line` | `#26242e` | `#e3e1e9` | 1px borders, dividers, meter track |
| `--card` | `#16151c` | `#ffffff` | Terminal, search field, tag pills |
| `--acc` | `#b48bff` | `#6d35d6` | **Accent text/links** (contrast-safe per theme) |

Theme-independent:

| Token | Value | Use |
|---|---|---|
| `--accent` | `#9b5cff` | Accent **fills**: primary buttons, dot, caret, progress bars |
| `--accent-hi` | `#b48bff` | Hover of accent fills |
| `--on-accent` | `#0f0e13` | Text on accent fills (always dark, 5.3:1) |
| error | `#ff6b8a` | Terminal errors, form error |
| success | `#3fbf6f` | Form success (CV) |

Rule: text in accent colour uses `--acc`, backgrounds use `--accent`. Never put white text on `#9b5cff`.

Theme transition: `background .3s, color .3s` on `body`.

### Game mode (always dark, not themeable)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#f2f0ff` | Text, window borders |
| `--bg0` | `#0b0a14` | Screen background, outer shadow ring |
| `--panel` | `#14122a` | HUD bar, dialog, panel windows |
| `--panel2` | `#1d1a3a` | Cards inside panels, selected rows |
| `--dim` | `#a9a6c4` | Secondary text |
| `--gold` | `#ffb84d` | Highlights, level, cursor ▶, toast bg, exit button |
| `--line2` | `#3a3760` | Unselected borders, dashed dividers |
| accent | `#9b5cff` | Hero badge, XP fill, hover fill of buttons |
| green | `#7ee08a` | "ACTIVE"/complete marks |
| Rarity | Common `#b8b6c4`, Rare `#5fb4ff`, Epic `#b48bff`, Legendary `#ffb84d` | Item borders/text |
| Tavern NPC colours | `oklch(0.72 0.15 H)` with H = 250 / 25 / 85 / 150 | Swatch + level bar |
| Glitch bars | `#9b5cff`, `#00f0ff`, `#ff2d6f`, `#f2f0ff` | Transition overlay |

## Typography

| Family | Package | Weights | Where |
|---|---|---|---|
| IBM Plex Mono | `@fontsource/ibm-plex-mono` | 400, 500, 600 | CV: logo, nav, headings, meta, labels, buttons, terminal, numbers |
| IBM Plex Sans | `@fontsource/ibm-plex-sans` | 400, 500 | CV: body copy, job roles, skill names |
| Press Start 2P | `@fontsource/press-start-2p` | 400 | Game: titles, labels, buttons (small sizes: 6–14px) |
| VT323 | `@fontsource/vt323` | 400 | Game: all running text (17–32px) |

### CV type scale

| Role | Font | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Name (h1) | Mono | `clamp(40px, 6.4vw, 78px)` | 600 | 0.98 | −0.035em |
| Contact title | Mono | `clamp(34px, 5.5vw, 64px)` | 600 | 1.02 | −0.03em |
| Zone title | Mono | `clamp(24px, 3.4vw, 36px)` | 600 | 1.15 | −0.02em |
| Fact number | Mono | 34px | 600 | normal | −0.02em |
| Role line | Mono | `clamp(17px, 2vw, 21px)` | 400 | normal | 0 |
| Contact email | Mono | `clamp(18px, 2.4vw, 26px)` | 400 | normal | 0 |
| Job role | Sans | 21px | 500 | 1.3 | 0 |
| Profile | Sans | 18px | 400 | 1.6 | 0, max-width 58ch, 88% opacity |
| Job bullet | Sans | 16px | 400 | 1.55 | 0 |
| Row title (edu/lang), skill name | Sans | 17px / 16px | 500 | normal | 0 |
| Section heading `// 01 experience` | Mono | 15px | 500 | normal | 0, colour `--mut`, "// 01" in `--acc` |
| Meta / nav / buttons / terminal | Mono | 13–14px | 400 (buttons 600 for primary) | 1.45 (terminal) | 0 |
| Tiny labels (skill category, pills, counts) | Mono | 11–12px | 400 | normal | 0 |

Use `text-wrap: pretty` on paragraphs and bullets.

## Spacing & sizing

- Content container `.wrap`: `max-width: 1120px`, centred, horizontal padding `clamp(20px, 4vw, 40px)`.
- Section rhythm: each section has `padding-top: 88px`. Contact section: `padding: 120px 0` in the prototype (the build uses 88/96, fine either way).
- Common gaps: 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 48px (flex/grid `gap`, not margins).
- Minimum hit target on touch: 44×44px (buttons, D-pad, chips ≥ 32px high).

## Radii, borders, shadows

- CV: buttons & terminal/search `8px` / `10–12px`, pills & chips `99px`, segmented control `6px`. Borders 1px `--line`. No shadows.
- Game: **no radii anywhere.** Window borders 4px `--ink` + outer ring `box-shadow: 0 0 0 4px var(--bg0)`; windows add hard drop shadow `10px 10px 0 4px #000` (map: `8px 8px 0 4px #000`). Buttons 2px `--ink` borders.

## Z-index

| Layer | z |
|---|---|
| Sticky CV header | 20 |
| Game root | 50 |
| Building hotspots | 2 (inside map) |
| Hero | 3 (inside map) |
| Panel overlay | 60 |
| Scanlines | 80 |
| Toast | 90 |
| Glitch overlay | 9999 |
