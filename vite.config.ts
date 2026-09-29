import { defineConfig, type Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const page = (f: string) => fileURLToPath(new URL(f, import.meta.url));

/** Global security headers from vercel.json, so `npm run preview` enforces the same CSP / Trusted Types as production. */
const vercel = JSON.parse(readFileSync(page('./vercel.json'), 'utf8')) as { headers: { source: string; headers: { key: string; value: string }[] }[] };
const globalHeaders = Object.fromEntries(vercel.headers.find((h) => h.source === '/(.*)')!.headers.map((h) => [h.key, h.value]));

// No font preloads on purpose: with the metric-matched fallbacks in src/styles/fonts.css the swap causes no shift,
// and preloading made the fonts land during the first layout, adding a relayout before first paint (measured: later LCP).
/** Build only: replace the page's <link rel="stylesheet"> tags with inline <style>. Vite splits the CSS per shared chunk
 *  (4 files for index.html); each was a render-blocking request before first paint (Lighthouse: ~0.9 s on mobile).
 *  CSP already allows inline styles ('unsafe-inline' in style-src). The .css files stay in dist for any other reference. */
const inlineCss = (): Plugin => ({
  name: 'inline-css',
  apply: 'build',
  enforce: 'post',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      return html.replace(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/g, (tag, file: string) => {
        const asset = ctx.bundle?.[file];
        return asset && asset.type === 'asset' ? `<style>${String(asset.source)}</style>` : tag;
      });
    },
  },
});

export default defineConfig({
  plugins: [inlineCss()],
  preview: { headers: globalHeaders },
  build: {
    // Never base64-inline fonts into CSS: it bloats the render-blocking stylesheet and CSP font-src is 'self' only.
    assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined),
    rollupOptions: {
      input: {
        main: page('./index.html'),
        datenschutz: page('./datenschutz.html'),
        cv: page('./cv.html'),
        portfolio: page('./portfolio.html'),
      },
    },
  },
});
