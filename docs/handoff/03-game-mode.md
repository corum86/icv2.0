# 03 · Game mode

Full-screen view that replaces the CV after the glitch transition. **Always dark.** `position: fixed; inset: 0; z-index: 50`. While active: `body { overflow: hidden }` and the CV is hidden (visibility), with no page scroll. Respect safe-area insets (`env(safe-area-inset-*)` padding).

## Screen layout (desktop ≥ 721px)

A vertical flex column filling `100dvh`:

```
┌──────────────────────────── HUD (auto height) ────────────────────────────┐
│ [SK] SERGKEI  LV 11  XP ▓▓▓░░  0/5 explored        [C][I][Q][M][DE][X]      │
├────────────────────────────────────────────────────────────────────────────┤
│                          STAGE (flex: 1, min-height: 0)                     │
│               ┌──────────── MAP 32:21, centred ────────────┐               │
│               │ canvas + building hotspots + hero sprite    │               │
│               └─────────────────────────────────────────────┘               │
├────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────── DIALOG (flex:1, min-h 132px) ──────────────┐  ┌─D-pad─┐     │
│ │ GUIDE                                                    │  │ ▲     │     │
│ │ Welcome, traveler…                                       │  │◀   ▶  │     │
│ │ ARROWS / WASD move · click to walk · …                   │  │ ▼     │     │
│ └──────────────────────────────────────────────────────────┘  └───────┘     │
└────────────────────────────────────────────────────────────────────────────┘
```

### Map sizing (most important rule)

The map must be the **largest 32:21 box that fits in the stage** without overlapping the HUD or dialog. Don't estimate with `100vh - Npx`. Size it from the stage's real box:

```css
.stage { flex: 1; min-height: 0; display: grid; place-items: center; padding: 14px; container-type: size; }
.map   { aspect-ratio: 32 / 21; width: min(100cqw, 100cqh * 32 / 21); }
```

(`cqw/cqh` container units are supported in all evergreen browsers. As a fallback, compute the size in JS with a `ResizeObserver` on `.stage` and set `width` in px.) Border 4px `--ink`, `box-shadow: 0 0 0 4px var(--bg0), 8px 8px 0 4px #000`, `overflow: hidden`, `touch-action: none`, `position: relative`.

### Map contents (all absolutely positioned inside `.map`, in %)

- `<canvas width=512 height=336>` (32×21 tiles × 16px) filling the map, `image-rendering: pixelated`. Drawn by `world.draw()` and redrawn every 380ms (water animation, 3 frames).
- **Building hotspots**: one `<button>` per building, positioned at `left = x/32`, `top = y/21`, `width = 7/32`, `height = 7/21` (in %). Transparent. Hover `rgba(255,255,255,.06)`. Contains a **name plate** centred at the top (`margin-top: -6px`): Press Start 2P `clamp(6px, .7vw, 10px)`, bg `--panel`, 2px `--ink` border, padding 4px 6px, `box-shadow: 2px 2px 0 var(--bg0)`, nowrap. Visited buildings get a `★ ` prefix.
- **Hero**: div `width: 5.469%` (28/512), `height: 10.119%` (34/336). Position so the sprite's feet sit on the tile: `left = (px*16 − 6)/512`, `top = ((py+1)*16 − 32)/336`. Background `/sprites/hero.png`, `background-size: 300% 300%`, `background-position: {frame*50}% {row*50}%`. `transition: left .1s linear, top .1s linear`. z-index 3, `pointer-events: none`.
  - Sheet: 3 columns (frames) × 3 rows: row 0 = facing down (also used for up), row 1 = left, row 2 = right. Idle = frame 1 (middle). While walking cycle `[0,1,2,1]` per step. Back to idle 170ms after the last step.

### HUD

- Flex wrap, `gap: 10px 18px`, padding 10px 16px, bg `--panel`, bottom border 4px `--ink`.
- Left group (`margin-right: auto`, gap 12px, wrap): 34×34 badge "SK" (bg `#9b5cff`, 3px `--ink` border, Press Start 10px, text `--bg0`) · `SERGKEI` (PS 11px) · `LV 11` (PS 11px `--gold`) · `XP` + 110×10 bar (2px `--ink` border, fill `#9b5cff` = fraction of current career year) · `N/5 explored` (VT323 18px `--dim`).
- Right group (gap 6px, wrap): buttons `[C] STATUS`, `[I] ITEMS`, `[Q] QUESTS`, `[M] SOUND ON|OFF`, `DE|EN` (language toggle), `[X] EXIT TO CV` (gold border + text; hover gold fill). Button: 2px `--ink` border, padding 8px 10px, Press Start 9px, min-height 36px, hover fill `#9b5cff` text `--bg0`.

### Bottom bar

- Flex row, gap 14px, padding `0 16px 16px`.
- **Dialog**: flex 1, `min-width: 0`, **min-height 132px** (fits 3 lines of text + hint so the map never reflows), bg `--panel`, 4px `--ink` border + 4px `--bg0` ring, padding 12px 16px, column gap 6px, cursor pointer (click = skip typing).
  - `GUIDE` Press Start 9px `--gold` · text VT323 23px/1.15 (typewriter, 2 chars / 22ms, `  ▼` appended when done) · hint VT323 17px `--dim` pinned to the bottom (`margin-top: auto`). The hint text is the keyboard version, or the touch version on touch devices (`(hover: none), (pointer: coarse)`).
- **D-pad**: 3×3 grid, 44px cells, gap 3px. Only the 4 edge cells are buttons (▲ ◀ ▶ ▼), 2px `--ink` border, bg `--panel`. Pressed (`.is-down` / `:active`): fill `#9b5cff`, text `--bg0`. `touch-action: none`.

## Mobile layout (≤ 720px wide, or coarse pointer)

- HUD: padding 8px 10px. Hide XP bar and explored count. The button row takes full width with `justify-content: space-between`. Buttons PS 8px, padding 8px 7px. **All 6 buttons must fit on one row at 390px.** If not, drop the `[C]/[I]/[Q]` key hints on touch.
- Stage padding 8px. Map border 3px. Name plates 6px, 1px border.
- Bottom bar becomes a **column**: dialog (min-height 96px, text 20px, hint 15px) above a **larger D-pad** (56×52 cells, gap 4px, arrows 14px) centred.
- Map sizing rule stays the same (container units), so the map automatically takes the space left between the HUD and the bottom bar.

### Phone landscape (≤ 720px wide AND landscape, i.e. height is the constraint)

- HUD full width on top. Below it a **row**: stage (flex 1) on the left, a 200px column on the right with the D-pad above a compact dialog. The map fills the stage height.

## Panels (modal windows)

- Overlay: fixed, inset 0, z 60, bg `rgba(5,4,12,.72)`, grid centred, padding 16px (8px on phones). Click on the backdrop closes.
- Window: `width: min(920px, 100%)`, `max-height: calc(100dvh − 48px)`, `overflow: auto`, bg `--panel`, 4px `--ink` border, `box-shadow: 0 0 0 4px var(--bg0), 10px 10px 0 4px #000`, padding 22px (14px phones), column gap 20px. `role=dialog`, `aria-modal=true`. Focus the close button on open.
- Header: flex space-between: title `◆ QUEST LOG` (PS 14px, ◆ in `#9b5cff`, 11px on phones) + close button `ESC · CLOSE` (same as HUD button).

| Panel | Opened by | Content layout |
|---|---|---|
| **Quest log** | Guild Hall door, `Q` | 2-col grid `repeat(auto-fit, minmax(250px,1fr))`, gap 20px. **Left:** quest rows (button, 2px border `--line2`, padding 10px 12px, VT323 22px). Row = `▶` cursor (gold, 14px wide) + company + status line (18px: `ACTIVE` green / `COMPLETE` dim / `SIDE QUEST · COMPLETE`). Selected: border gold, bg `--panel2`. Hint `↑ ↓ select quest` (17px dim, hidden on touch). **Right:** left border 2px dashed `--line2`, padding-left 20px (becomes a top border on phones). Role (PS 11px gold, lh 1.6) · key/value grid (Quest giver, Period, Reward = duration "7y 5m experience"), 20px, keys dim · `OBJECTIVES` label (PS 9px dim) · one line per bullet: `✔` green (ended jobs) or `◆` gold (current job) + text VT323 20px. |
| **Inventory** | Armory door, `I` | Category tabs (8, wrap, gap 6px; VT323 19px, 2px `--line2`, padding 6px 10px; selected: gold fill, `--bg0` text). Below, 2-col grid (min 260px): **slot grid** `repeat(auto-fill, minmax(66px,1fr))`, gap 6px, square slots, bg `--panel2`, 3px border in rarity colour, 2–3-letter abbreviation VT323 28px in rarity colour. Selected slot: bg `#2a2650`, ring `0 0 0 3px var(--ink)`. **Item card**: 3px rarity border, padding 16px: rarity (PS 9px), name (VT323 32px), `Type: <category>` (19px dim), `Used at: <companies>` or "Listed in technical skills" (19px). |
| **Academy** | Academy door | Grid `repeat(auto-fit, minmax(200px,1fr))` gap 12px of "scroll" cards: 3px `--ink` border, bg `--panel2`, padding 14px: `SCROLL · 2008 – 2015` (PS 9px `#5fb4ff`), title (VT323 23px), school (18px dim). |
| **Tavern** | Tavern door | Intro line (22px). Grid `minmax(190px,1fr)` of NPC cards: speech bubble (ink bg, `--bg0` text, 22px, e.g. "Γεια σου!"), colour swatch 28px + language name (22px), level (18px dim), 10px bar with 2px ink border and coloured fill. |
| **Post office** | Post Office door | Intro line, link buttons row (`✉ SEND RAVEN` primary = accent fill; `GITHUB`; `LINKEDIN`; PS 10px, 3px borders, padding 14px 16px), label `WRITE A LETTER`, then the **game-styled contact form** (same fields as CV; inputs VT323 20px, bg `--bg0`, 3px ink border, no radius, focus border gold; submit gold fill PS 10px). Text selection enabled inside the form. |
| **Status** | `C` | 2-col grid (min 260px): key/value list (VT323 22px, keys dim): Name, Class, Specialization, Home, Guild, Level. Attributes list: rows with 2px dashed `--line2` bottom border: label (21px) + value (PS 13px gold): Years in the field, Quests completed, Items in inventory, Languages, Scrolls earned. |

## Overlays

- **Scanlines** (`SCANLINES=true`): fixed, inset 0, z 80, pointer-events none, `repeating-linear-gradient(0deg, rgba(0,0,0,.2) 0 1px, transparent 1px 3px)`.
- **Toast**: fixed, top 80px, centred (`left:50%; translateX(-50%)`), z 90. Gold bg, `--bg0` text, 4px `--bg0` border + 3px ink ring, padding 12px 18px, PS 11px, `★ NEW AREA: GUILD HALL`. Animation `toastIn` 2.8s (slide down 20px + fade in, hold, fade out). Phones: 8px, width 80vw, wraps.
- **Glitch transition** (CV → game): fixed full-screen, z 9999, pointer-events none. `backdrop-filter: hue-rotate(120deg) contrast(1.8) saturate(2)`, bg `rgba(11,10,20,.35)`, `flash` animation 0.9s steps(6). 16 horizontal bars (random top/height 1–8%, colours cycle through the glitch palette, `mix-blend-mode: difference`, `glitchBar` jitter 0.06–0.16s steps(2) infinite). Centre label `GAME MODE` (PS `clamp(16px,4vw,44px)`, ink, `text-shadow: 4px 0 #ff2d6f, -4px 0 #00f0ff`, `shake` .07s). `body` shakes during the glitch. After 900ms, swap to game mode and remove the overlay. `prefers-reduced-motion`: no bars, no shake, 250ms.

## Map data (for reference, implemented in `world.ts`)

- 32×21 tiles. Blocked: outer ring of tiles, building footprints except their door tile, pond, decor tiles.
- Buildings (7×7 footprint, door = `(x+3, y+6)`): Guild Hall (3,2) red roof/plaster, Post Office (12,2) green/wood, Armory (22,2) dark/dark-stone, Academy (5,11) blue/stone, Tavern (19,11) tan/wood.
- Hero start: tile (15,10). Paths: row 9 (x 2–29), row 18 (x 8–22), column 15 (y 9–18).
- House sprite = 108×82 pitched roof from `house.png` (x-offset per colour: gray 306, red 418, tan 530, dark 642, blue 754, green 865; y 147) + a 32px wall strip built from segments `[18,12] [160,16] [72,40] [160,16] [50,12]` at the material's y (plaster 64, wood 160, stone 224, dark 288). Drawn at `(x*16+2, y*16−2)`.
- Draw order: ground → pond → objects & houses sorted by base y.
