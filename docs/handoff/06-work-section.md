# 06 · Selected work: implementation guide

Implements the **// 02 selected work** section and its **case-study drawer** in the Vite + vanilla TS site, matching the prototype `design-reference/Sergkei CV.dc.html` (section `#work`, drawer under `drawerOpen`). Everything you need is already in the repo. This guide says how to wire it up.

## Files provided (ready to use)

| File | What it is | Action |
|---|---|---|
| `src/work.ts` | Typed data: `WORK` (5 projects), `WORK_TAGS`, interfaces | Use as-is. It's the single source of truth |
| `src/work-i18n.ts` | EN/DE UI strings for the section | Merge into `T.en` / `T.de` in `src/i18n.ts`, then delete the file |
| `src/styles/work.css` | Complete styles (card, filter, drawer, gauges, stats, phone, diagram) | `import './styles/work.css'` in `main.ts` after `cv.css`. Only `.wk-*` classes |
| `src/work-diagram.ts` | `migrationDiagramHTML()` for the NDA project | Call where `work.diagram === 'migration'` |
| `public/work/*` | Videos, posters, stills (23 files, see Assets) | Already in place |
| `scripts/record-work.mjs` | Re-records videos/stills from archive/live URLs | Only when media changes (`npm run record:work -- <slug>`) |

## You write

1. **`src/work-section.ts`**: `renderWork(root: HTMLElement)` plus `openCase(slug)` / `closeCase()`, following the markup and behaviour below.
2. **`src/cv.ts`**: insert the section **after Experience, before Skills**. Renumber the headings: `// 01 experience`, `// 02 selected work`, `// 03 skills`, `// 04 education`, `// 05 languages`, `// 06 contact`. Add a nav link `#work` (`T.navWork`) right after "Experience".
3. **`vercel.json`**: already has `Cache-Control` for `/work/(.*)`. Nothing to do.
4. **`public/sitemap.xml`**: nothing to do (hash URLs aren't indexed).

---

## Markup

Use template strings with `esc()` from `util.ts` for every data string. Keep the class names exactly as below (they match `work.css`).

### Section

```html
<section id="work" class="wk" aria-labelledby="wk-h">
  <div class="wk-head">
    <h2 id="wk-h" class="sec-h"><span>// 02</span> ${T.sWork}</h2>   <!-- reuse the CV section-heading class -->
    <span class="wk-count">${n} ${T.projects}</span>
  </div>
  <div class="wk-filter" role="group" aria-label="Filter projects">
    <span class="wk-filter__cmd">$ ls ./work --tag=</span>
    <!-- one per WORK_TAGS entry; label = tag.toLowerCase(), 'all' → T.all.toLowerCase() -->
    <button class="wk-chip" aria-pressed="true" data-tag="all">all</button>
  </div>
  <div class="wk-grid"><!-- cards --></div>
</section>
```

### Card (one per project, in `WORK` order)

```html
<button class="wk-card" data-slug="nonomo" aria-haspopup="dialog">
  <div class="wk-media">
    <!-- A) diagram:  ${migrationDiagramHTML()} -->
    <!-- B) media:    <img src="${base}-poster.${ext}" alt="" loading="lazy" width="1280" height="800">
                      + <video> injected later if media.video (see Video) -->
    <!-- nda:     <span class="wk-badge wk-badge--nda">NDA</span> -->
    <!-- offline: <span class="wk-badge wk-badge--offline">${T.offline}</span> -->
  </div>
  <div class="wk-body">
    <div class="wk-meta"><span>${client}</span><span>${year}</span></div>
    <h3 class="wk-title">${title}</h3>
    <p class="wk-outcome">${outcome}</p>
    <!-- stats:      <div class="wk-stats"><div><b>150K</b><span>lines of code migrated</span></div>…</div> -->
    <!-- lighthouse: <div class="wk-lh">lighthouse <b>98</b><b>96</b><b>100</b><b>100</b></div> -->
    <div class="wk-tags"><span>JTL Shop</span>…</div>
    <div class="wk-foot"><span>${T.caseStudy} →</span><span>${versions.length > 1 ? versions.length + ' ' + T.versions : ''}</span></div>
  </div>
</button>
```
A card that is a `<button>` can't contain other interactive elements. It doesn't need any.

### Drawer (a single instance, re-rendered per project)

```html
<div class="wk-overlay" hidden>                      <!-- click on overlay (not drawer) closes -->
  <aside class="wk-drawer" role="dialog" aria-modal="true" aria-labelledby="wk-d-title" tabindex="-1">
    <div class="wk-bar">
      <span class="wk-bar__path">~/work/${slug}</span>
      <div class="wk-bar__btns">
        <button class="wk-btn" data-act="prev" aria-label="Previous project">←</button>
        <button class="wk-btn" data-act="next" aria-label="Next project">→</button>
        <button class="wk-btn" data-act="close">esc ✕</button>
      </div>
    </div>
    <div class="wk-content">
      <div class="wk-stage">
        <!-- only if versions.length > 1 -->
        <div class="wk-versions"><span>${T.beforeAfter}</span>
          <div class="wk-versions__tabs"><button class="wk-chip" aria-pressed="…" data-v="0">2016 · Start · intern</button>…</div></div>
        <div class="wk-media"><!-- diagram OR <img src="${base}-${vi+1}.${ext}" alt="${title} – ${versionLabel}"> --></div>
        <!-- only if versions exist -->
        <div class="wk-caption"><span>${caption}</span>
          <!-- only if version.url --><a href="${url}" target="_blank" rel="noopener">${T.archive} ↗</a></div>
      </div>
      <div class="wk-intro">
        <span class="wk-meta">${client} · ${year}</span>
        <h3 id="wk-d-title">${title}</h3>
        <p>${outcome}</p>
        <!-- offline --><span class="wk-offline-note">${T.offlineNote}</span>
      </div>
      <dl class="wk-factgrid"><div><dt>${T.wRole}</dt><dd>${role}</dd></div><div><dt>${T.wStack}</dt><dd>${tags.join(', ')}</dd></div><div><dt>${T.wYear}</dt><dd>${year}</dd></div></dl>
      <!-- stats -->      <div class="wk-bigstats"><div><b>150K</b><span>…</span></div>…</div>
      <!-- lighthouse --> <div class="wk-section"><span class="wk-h">## Lighthouse <small>· ${T.desktop}</small></span>
                            <div class="wk-gauges"><div class="wk-gauge"><div class="wk-gauge__ring" style="--v:98"><b>98</b></div>Performance</div>…</div></div>
      <!-- media.mobile --><div class="wk-mobile"><div class="wk-phone"><video …></video></div>
                            <div class="wk-mobile__cap"><span class="wk-h">## ${T.mobile}</span><span>${lastVersion.label} · ${lastVersion.year} · mobile</span></div></div>
      <!-- problem/approach/result: render only those that exist -->
      <div class="wk-section"><span class="wk-h">## ${T.wProblem}</span><p>…</p></div>
      <div class="wk-actions">
        <!-- primary, unless offline: live → T.live ; else latest version with url → "${label} ${year} ↗" ; else omit -->
        <!-- code: only if work.code -->
      </div>
    </div>
  </aside>
</div>
```
Reuse the CV's existing primary/outline button classes for `.wk-actions` links.

---

## Behaviour

**Filter**
- Single-select, default `all`. A project matches when **any tag starts with** the chip value (case-insensitive), so `Angular` matches `Angular 15 → 22`.
- Update `aria-pressed` on the chips, show/hide cards (toggle `hidden`, don't re-render videos), and update `.wk-count`.

**Drawer**
- Open: click or Enter on a card. Set `location.hash = '#work/<slug>'` via `history.pushState`. Lock body scroll (`overflow:hidden` on `html`). Focus the drawer. Trap Tab inside it.
- Close: ✕, `Esc`, a click on the overlay, or browser Back (listen to `popstate`: no `#work/…` hash means close). Restore focus to the card that opened it. Restore scroll.
- `←` / `→` keys and the buttons cycle through `WORK` (the full list, ignoring the filter) with `history.replaceState`. Reset the version tab to the latest.
- Deep link: on load, if the hash is `#work/<slug>` and the slug exists, scroll to `#work` and open it.
- Version tabs: default to the **last** version. Switching changes only the stage image and caption.
- **The game-mode keyboard handler must ignore keys while the drawer is open.** The CV scroll trigger must not fire while it's open either.

**Video (cards + phone)**
- Only projects with `media.video` (card) or `media.mobile` (drawer). Don't put `<video>` in the initial HTML. Inject it after a `HEAD` check succeeds, to avoid 404 noise in the console:
  ```ts
  const ext = document.createElement('video').canPlayType('video/webm') ? 'webm' : 'mp4';
  const ok = (await fetch(`${base}.${ext}`, { method: 'HEAD' })).ok;   // cache the result per URL
  ```
- Element: `muted`, `loop`, `playsInline`, `preload="metadata"`, `poster` = the poster/still. Set `.muted = true` in JS too (iOS).
- Play only while ≥ 35% visible (one shared `IntersectionObserver`). Pause otherwise, and pause everything when the drawer opens (the drawer's phone video plays instead).
- `prefers-reduced-motion: reduce`: never inject videos, show the poster only.
- On `error`: remove the video (the poster `<img>` stays underneath).

**Analytics** (`track()` from `analytics.ts`): `Work Opened {slug}`, `Work Filter {tag}`, `Work Archive Link {slug, version}`.

**i18n**
- On language change: re-render the section text and the drawer if it's open, keeping the open slug and version. Don't re-inject videos that are already playing: patch the text nodes, or re-render only `.wk-body` and the drawer content.
- Proper nouns stay as written: `Nuvé` keeps the é, and "Lighthouse" and metric names stay English.

---

## Assets (`public/work/`)

| Project (slug) | Card | Drawer stills | Phone | Notes |
|---|---|---|---|---|
| `energy-platform` | diagram | diagram | — | NDA badge, stats row |
| `paidopsy` | `paidopsy-poster.png` (no video yet) | `paidopsy-1.png` | — | Lighthouse (desktop) 98/96/100/100, live link. `npm run record:work -- paidopsy` then set `media.video/mobile: true` and `ext:'jpg'` |
| `nuve` | `nuve.webm/.mp4`, `nuve-poster.jpg` | `nuve-1.jpg` | `nuve-mobile.*` | Offline badge, no live/code buttons |
| `nonomo` | `nonomo.webm/.mp4`, `nonomo-poster.jpg` | `nonomo-1..3.jpg` | `nonomo-mobile.*` | 3 versions, archive links |
| `fidella` | `fidella.webm/.mp4`, `fidella-poster.jpg` | `fidella-1..2.jpg` | `fidella-mobile.*` | 2 versions, archive links |

Naming rule: `${base}-poster.${ext}` (card still), `${base}-${n}.${ext}` (version n, 1-based), `${base}.webm|.mp4`, `${base}-mobile.webm|.mp4`.

## Responsive

- Grid: 3 columns at ≥ 1060px content width, 2 at ~680–1059px, 1 below.
- Drawer is full-width on phones. Gauges become 2×2 below 480px (in CSS).
- Diagram text has pixel minimums. Check it's legible at a 320px card width.

## Game mode (optional, after launch)

A sixth building, "Gallery"/"Galerie", whose panel lists `WORK` as exhibits (title, year, outcome, Case study button that exits to the CV and opens `#work/<slug>`).

## Acceptance checklist

- [x] The section sits between Experience and Skills. Headings are renumbered 01–06. The nav has "Work".
- [x] 5 cards in this order: energy-platform, paidopsy, nuve, nonomo, fidella. Badges: NDA (energy), Offline (Nuvé).
- [x] Filter chips work. "Angular" shows the energy platform. "JTL Shop" shows nonomo + fidella. The count updates.
- [x] Videos autoplay muted only when visible, pause off-screen, never play with reduced motion. No 404s in the console.
- [x] Drawer: open, close (✕, Esc, overlay, Back), ←/→, focus trap and restore, `#work/nonomo` deep link works.
- [x] Before/after tabs only for nonomo (3) and fidella (2). Archive link only on archive versions.
- [x] Lighthouse gauges (paidopsy), big stats (energy), phone video (nuve, nonomo, fidella).
- [x] Offline project: no live/code buttons, offline note shown.
- [x] EN/DE switch updates everything and keeps the drawer state.
- [x] Light theme: all text readable, diagram adapts.
- [x] No horizontal scroll at 390px. `npm run build` passes.
