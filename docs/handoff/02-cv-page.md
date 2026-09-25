# 02 · CV page

Order top→bottom: **Header (sticky) → Hero → Facts → 01 Experience → 02 Skills → 03 Education + 04 Languages → 05 Contact → Footer → Game zone**. Everything important (name, role, profile, 3 CTAs, core stack) must be visible in the first viewport at 1440×900 and 1024×768.

All content sits inside `.wrap` (max 1120px, padding `clamp(20px,4vw,40px)`), except the header background and the game zone, which are full-bleed.

---

## Header (sticky)

- `position: sticky; top: 0; z-index: 20`. Background `color-mix(in srgb, var(--bg) 86%, transparent)` + `backdrop-filter: blur(10px)`. Bottom border 1px `--line`.
- Inner `.wrap`: flex row, `align-items: center`, `gap: 12px 22px`, `flex-wrap: wrap`, padding 12px vertical. Font Mono 13px.
- Children left→right:
  1. **Logo** `~/sergkei`: "~/" in `--acc`, "sergkei" in `--fg`, weight 600, links to `#top`.
  2. **Nav**: 4 anchor links (Experience, Skills, Education, Contact → `#experience`, `#skills`, `#education`, `#contact`), `gap: 18px`, colour `--mut`, hover `--fg`, no underline. Has `margin-right: auto`, which pushes the controls right.
  3. **Language segmented control**: 1px `--line` border, radius 6px, overflow hidden. Two buttons "EN" / "DE", padding 5px 9px. Active: bg `--fg`, text `--bg`. Inactive: transparent, text `--mut`.
  4. **Theme button** `◐ Light` / `◐ Dark` (shows the theme you'd switch **to**). Padding 5px 10px, 1px `--line` border, radius 6px, text `--mut` → hover `--fg`.
  5. **Play button** `▶ Play`: bg `--accent`, text `--on-accent`, weight 600, padding 5px 12px, radius 6px, hover bg `--accent-hi`.
- **≤ 640px:** hide nav, keep logo left (`margin-right:auto` on logo) and the 3 controls right. The header must not wrap to more than one row at 390px. If it does, shorten the theme button to just `◐`.

## Hero

- Grid: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr))`, `gap: 48px`, padding `clamp(40px,7vw,88px) 0 56px`, `align-items: center`. At ≥ 900px this is 2 columns (text left, terminal right). Below that it stacks.
- **Left column** (flex column, `gap: 26px`, `min-width: 0`):
  1. **Meta line**: flex, gap 10px, Mono 13px `--mut`: 8px accent dot (`--accent`, circle) · "Wuppertal, Germany" · "/" · "Full-Stack · Frontend focus". Wraps on mobile.
  2. **Name h1**: "Sergkei" `<br>` "Kournosenkov". See type scale. Must not overflow at 390px (at 40px Mono it fits ~320px, which is OK).
  3. **Role line**: `> Web & Software Developer` in `--acc`, followed by a blinking block caret (0.6em × 1.1em, `--accent`, `blink 1s steps(1) infinite`).
  4. **Profile paragraph**: see type scale. Copy from `i18n.profile` verbatim.
  5. **CTA row**: flex, gap 10px, wrap. Three buttons, each padding 13px 20px, radius 8px, Mono 14px, min-height 44px:
     - Primary `✉ Email me` → `mailto:ser.corum@gmail.com`: bg `--accent`, text `--on-accent`, weight 600, hover `--accent-hi`.
     - Outline `GitHub ↗` → `https://github.com/corum86` (new tab, `rel=noopener`): 1px `--line`, text `--fg`, hover border `--accent`.
     - Outline `LinkedIn ↗` → `https://www.linkedin.com/in/sergkei-kournosenkov-10659592/`.
  6. **Core stack line**: flex wrap, gap 8px, Mono 12px: label `core stack:` in `--mut`, then 6 pills (Angular, React, Tailwind, Spring Boot, PostgreSQL, Claude Code). Pill: padding 4px 9px, 1px `--line`, radius 99px, text `--fg`.
- **Right column**: the **terminal card** only. No photo (removed on purpose).
  - Card: bg `--card`, 1px `--line`, radius 12px, overflow hidden, Mono 13px, cursor text. Clicking anywhere focuses the input.
  - Title bar: flex space-between, padding 9px 14px, bottom border 1px `--line`, 12px `--mut`: `sergkei@wuppertal: ~` | `type 'help'`.
  - Body: fixed height **240px** (prototype 150px + photo; without the photo 240px balances the column), `overflow: auto`, padding 12px 14px, flex column gap 3px, line-height 1.45. Auto-scroll to bottom after each command.
  - Line colours: input `--fg` (prefixed `❯ `), output `--mut`, accent `--acc`, error `#ff6b8a`.
  - Prompt row: `❯` in `--acc` + borderless input (inherits font, `caret-color: --accent`). **Input font-size 16px on mobile** (prevents iOS zoom), 13px ≥ 700px.

## Facts strip

- Full-width inside `.wrap`, top and bottom 1px `--line`. Grid `repeat(auto-fit, minmax(200px, 1fr))`. 4 items → 4 columns on desktop, 2 on tablet, 1 on phone (2 at 390px is also fine).
- Each: padding `26px 22px 26px 0`, flex column gap 6px. Number (Mono 34px 600): `{years}+` (years since 11/2014, floored, currently 11), `2019→`, `4`, `B.Sc.`. Label Sans 14px `--mut`.

## 01 Experience (accordion)

- Section heading (see tokens) with `margin-bottom: 28px`.
- List has a bottom border; each item has a top border (1px `--line`).
- **Item header** is a full-width `<button>` (`aria-expanded`): flex wrap, `gap: 6px 24px`, padding 24px 0, `align-items: baseline`, text-align left, hover colour `--acc`.
  - Period: `flex: 0 0 160px`, Mono 13px `--mut` (e.g. `04/2019 – present`, Refuel shows years only `2006 – 2011`).
  - Title block: `flex: 1 1 340px`, `min-width: 0`, column gap 4px: role (Sans 21px 500) + company line (Sans 15px `--mut`, Refuel adds ` · Ioannina, Greece`).
  - Sign: Mono 20px `--acc`, width 20px, right-aligned: `+` closed / `−` open.
- **Item body** (only when open): flex wrap gap 24px, padding-bottom 30px. First child is an empty 160px spacer so the content aligns under the title (hide the spacer ≤ 560px). Content column: gap 18px:
  - Bullets `ul` (no list style), gap 10px. Each `li` flex gap 12px: `–` in `--acc` Mono + text (Sans 16px/1.55, 88% opacity).
  - Tag pills (from `job.tags`): Mono 12px, padding 4px 9px, radius 99px, bg `--card`, 1px `--line`.
- Default: the first job (ECS) is open. Clicking an open item closes it. Only one open at a time.

## 02 Skills

- **Search field** (a `<label>`): flex, gap 10px, padding 14px 16px, 1px `--line`, radius 10px, bg `--card`, Mono 15px. Parts: `$ grep -i` (`--acc`, nowrap) · borderless input (flex 1, placeholder "filter skills…", 16px) · count `N matches` (12px `--mut`, nowrap). Live filtering by substring, case-insensitive.
- **Category chips** below (gap 6px, wrap, margin 18px 0): All, Frontend & UI, Backend & Languages, Databases, APIs & Architecture, Quality & Testing, AI Tooling, DevOps & VCS, Platforms & Tools. Chip: padding 6px 12px, radius 99px, 1px `--line`, Mono 12px `--mut`, min-height 32px. Active (`aria-pressed=true`): bg `--fg`, text `--bg`. Hover border `--accent`.
- **Skill grid**: `repeat(auto-fill, minmax(170px, 1fr))`, gap 8px. Tile: padding 14px 16px, 1px `--line`, radius 10px, column gap 6px: name (Sans 16px 500) + category (Mono 11px `--mut`). Hover: border `--accent`, `translateY(-2px)`, transition .15s. No levels/ratings on the CV page.
- Empty state: `No matches.` Mono `--mut`.
- Filtering must **not** re-render the input (focus and caret must survive typing).

## 03 Education + 04 Languages

- Two-column grid `repeat(auto-fit, minmax(min(100%, 340px), 1fr))`, gap 48px. Each column has its own section heading.
- Row: padding 16px 0, top border 1px `--line`, column gap 4–6px.
  - Education: title (17px 500), school (14px `--mut`), years (Mono 12px `--acc`).
  - Languages: flex space-between name (17px 500) / level (Mono 13px `--mut`), then a 4px meter (track `--line`, radius 4px, fill `--accent`) at 100 / 85 / 70 / 70%.

## 05 Contact

- Column flex gap 26px, padding 120px top/bottom (prototype).
- Heading `// 05 contact` · big title `Let's build something.` / `Lass uns etwas bauen.` · email as a large underlined link (`text-underline-offset: 6px`, `width: fit-content`, `word-break: break-all` on phones) · CTA row (same three buttons as the hero).
- **Contact form** (new vs. prototype), max-width 720px, below the CTAs with a small Mono 15px `--mut` heading "Send a message":
  - Row 1: Name + Email side by side (`repeat(auto-fit, minmax(220px,1fr))`, gap 14px). Row 2: Message textarea (5 rows, vertical resize).
  - Field label: Mono 12px `--mut` above the control (gap 6px). Control: Sans 16px, bg `--card`, 1px `--line`, radius 8px, padding 12px 14px. Focus: border `--accent`, no outline glow.
  - Footer row: primary submit button (same as primary CTA) + privacy note (13px `--mut`, link to `/datenschutz.html`).
  - Status line below (Mono 14px, success `#3fbf6f`, error `#ff6b8a` with mailto fallback). Honeypot field visually hidden (off-screen, not `display:none`).

## Footer

- Inside `.wrap`, top border 1px `--line`, padding 24px 0, flex gap 20px wrap, Mono 12px `--mut`: `© {year} Sergkei Kournosenkov` · `Privacy`/`Datenschutz` → `/datenschutz.html`.

## Game zone (bottom, full-bleed)

- Section with top border 1px `--line`. **Height 180vh** when the scroll trigger is on (`GAME_TRIGGER='scroll'`), 100vh otherwise.
- Inner wrapper `position: sticky; top: 0; height: 100vh; display: grid; place-items: center; padding: 0 24px`.
- Box: `width: min(560px, 100%)`, flex column gap 20px, Mono:
  - `$ ./start --mode=game` (13px `--mut`)
  - Title (see type scale): "Keep scrolling to enter game mode". Switches to "Entering game mode…" above 90%.
  - Sub: "The rest of this CV is playable." (15px `--mut`)
  - Progress row: flex gap 14px: track (flex 1, height 14px, 1px `--fg` border, 2px padding) with `--accent` fill = progress%, then `NN%` (14px, width 48px, right-aligned).
  - Button `▶ Skip, enter now`: padding 10px 16px, 1px `--accent` border, radius 6px, text `--acc`, 13px, hover fill `--accent` + text `--on-accent`.
- Above 60% progress the box jitters horizontally (random ±5px × progress per scroll event).

## Responsive summary

| Width | Changes |
|---|---|
| ≥ 1120 | Everything as specced, 2-col hero, 4 facts |
| 900–1119 | Same, narrower |
| 641–899 | Hero stacks (terminal below text), facts 2–4 cols by auto-fit |
| ≤ 640 | Nav hidden, header one row |
| ≤ 560 | Job body spacer hidden, bullets full width |
| 390 | No horizontal scroll anywhere. Name and email fit. CTAs wrap to 2 rows |
