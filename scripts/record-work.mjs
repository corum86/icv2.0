/**
 * Records looping before→after videos of archived project pages for the Work section.
 *
 * Setup (once):   npm i -D playwright && npx playwright install chromium
 *                 ffmpeg + ffprobe on PATH (brew install ffmpeg / choco install ffmpeg)
 * Run:            npm run record:work              (all projects)
 *                 VERCEL_BYPASS=<secret> npm run record:work -- nuve   (protected Vercel preview)
 *                 npm run record:work -- nonomo    (one project)
 *
 * Output per project in public/work/:  <slug>.webm, <slug>.mp4, <slug>-poster.jpg,
 * <slug>-mobile.webm/.mp4 (last step, phone viewport), and one still per step: <slug>-<n>.jpg
 * (drop the stills into the case-study "before / after" tabs).
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, renameSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const PROJECTS = {
  // Protected Vercel preview: set VERCEL_BYPASS (Project → Settings → Deployment Protection →
  // "Protection Bypass for Automation") or temporarily disable Vercel Authentication.
  nuve: [
    { label: 'Nuvé Apartment', url: 'https://nuve-apartment-310jmb1hq-sercorum-1754s-projects.vercel.app/' },
  ],
  paidopsy: [
    { label: 'paidopsy-trikala.gr', url: 'https://paidopsy-trikala.gr/' },
  ],
  nonomo: [
    { label: '2016 · Start', url: 'https://web.archive.org/web/20160808023237if_/https://www.nonomo.de/' },
    { label: '2016 · First upgrade', url: 'https://web.archive.org/web/20161006000606if_/https://www.nonomo.de/' },
    { label: '2019 · Relaunch', url: 'https://web.archive.org/web/20190103055319if_/https://www.nonomo.de/' },
  ],
  fidella: [
    { label: '2016 · Before', url: 'https://web.archive.org/web/20160229103848if_/https://fidella.org/' },
    { label: '2019 · Modernised', url: 'https://web.archive.org/web/20190818065410if_/https://fidella.org/' },
  ],
};

const DESKTOP = { width: 1280, height: 800 };
const MOBILE = { width: 390, height: 844 };
const SCROLL_MS = 3200;   // scroll duration per step
const HOLD_MS = 700;      // pause at top before scrolling and at the end
const MAX_SCROLL = 2200;  // px, keeps each step short
const FADE = 0.4;         // crossfade seconds
const OUT = resolve('public/work');
const TMP = resolve('.rec');

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();
const duration = (f) => parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]));

/** Archive snapshots are slow and flaky: retry, and wait until a real body with content exists. */
async function load(page, url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
      await page.waitForFunction(() => document.body && document.body.children.length > 0, null, { timeout: 45_000 });
      await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {}); // old pages keep polling; don't fail on that
      return;
    } catch (e) {
      console.warn(`    load attempt ${attempt} failed: ${e.message.split('\n')[0]}`);
      if (attempt === 3) throw new Error(`Could not load ${url}. Open it in a browser; if the snapshot is broken, pick another timestamp.`);
      await page.waitForTimeout(3000 * attempt);
    }
  }
}

async function recordStep(browser, step, viewport, dir, still) {
  const bypass = process.env.VERCEL_BYPASS && step.url.includes('.vercel.app')
    ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS, 'x-vercel-set-bypass-cookie': 'true' } : undefined;
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, recordVideo: { dir, size: viewport }, extraHTTPHeaders: bypass });
  const page = await ctx.newPage();
  await load(page, step.url);
  // Warm lazy images, hide cookie banners from the archive snapshot, add a version label.
  await page.evaluate(async ({ label }) => {
    const se = document.scrollingElement || document.documentElement;
    for (let y = 0; y < se.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0);
    document.querySelectorAll('[id*="cookie" i],[class*="cookie" i],#wm-ipp-base,#wm-ipp,#donato').forEach((e) => e.remove());
    const b = document.createElement('div');
    b.textContent = label;
    Object.assign(b.style, { position: 'fixed', right: '16px', bottom: '16px', zIndex: 2147483647, padding: '8px 12px',
      background: '#0f0e13', color: '#ecebf1', font: '600 14px ui-monospace, Menlo, monospace', borderRadius: '6px',
      border: '1px solid #9b5cff', letterSpacing: '0' });
    (document.body || document.documentElement).appendChild(b);
  }, step);
  await page.waitForTimeout(1200);
  if (still) await page.screenshot({ path: still, type: 'jpeg', quality: 82 });
  const t0 = Date.now();
  await page.waitForTimeout(HOLD_MS);
  await page.evaluate(async ({ ms, max }) => {
    const se = document.scrollingElement || document.documentElement;
    const end = Math.max(0, Math.min(se.scrollHeight - innerHeight, max)), s = performance.now();
    await new Promise((r) => { const f = (t) => { const p = Math.min((t - s) / ms, 1);
      scrollTo(0, end * (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2)); p < 1 ? requestAnimationFrame(f) : r(); };
      requestAnimationFrame(f); });
  }, { ms: SCROLL_MS, max: MAX_SCROLL });
  await page.waitForTimeout(HOLD_MS);
  const recorded = (Date.now() - t0) / 1000;
  const video = page.video();
  await ctx.close();
  const file = await video.path();
  // Trim the page-load part: keep only the last `recorded` seconds.
  const total = duration(file), trimmed = file.replace(/\.webm$/, '-t.webm');
  sh('ffmpeg', ['-y', '-v', 'error', '-ss', String(Math.max(0, total - recorded)), '-i', file, '-an', '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', trimmed]);
  return trimmed;
}

function stitch(clips, base, size) {
  const inputs = clips.flatMap((c) => ['-i', c]);
  let filter = '', last = '[0:v]', offset = 0;
  for (let i = 1; i < clips.length; i++) {
    offset += duration(clips[i - 1]) - FADE;
    const out = i === clips.length - 1 ? '[x]' : `[v${i}]`;
    filter += `${last}[${i}:v]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(2)}${out};`;
    last = out;
  }
  const map = clips.length > 1 ? `${filter}[x]scale=${size.width}:${size.height},fps=30[o]` : `[0:v]scale=${size.width}:${size.height},fps=30[o]`;
  sh('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', map, '-map', '[o]', '-an', '-c:v', 'libvpx-vp9', '-crf', '36', '-b:v', '0', '-row-mt', '1', `${base}.webm`]);
  sh('ffmpeg', ['-y', '-v', 'error', '-i', `${base}.webm`, '-an', '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${base}.mp4`]);
}

const only = process.argv[2];
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const [slug, steps] of Object.entries(PROJECTS)) {
  if (only && only !== slug) continue;
  console.log(`▶ ${slug}`);
  rmSync(TMP, { recursive: true, force: true });
  const clips = [];
  for (const [i, step] of steps.entries()) {
    console.log(`  ${i + 1}/${steps.length} ${step.label}`);
    clips.push(await recordStep(browser, step, DESKTOP, join(TMP, `d${i}`), join(OUT, `${slug}-${i + 1}.jpg`)));
  }
  stitch(clips, join(OUT, slug), DESKTOP);
  sh('ffmpeg', ['-y', '-v', 'error', '-i', join(OUT, `${slug}.mp4`), '-vf', 'select=eq(n\\,0)', '-frames:v', '1', '-q:v', '3', join(OUT, `${slug}-poster.jpg`)]);
  console.log('  mobile');
  const m = await recordStep(browser, steps.at(-1), MOBILE, join(TMP, 'm'), null);
  stitch([m], join(OUT, `${slug}-mobile`), MOBILE);
}
await browser.close();
rmSync(TMP, { recursive: true, force: true });
console.log(`✔ done → ${OUT}`);
