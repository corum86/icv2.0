import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const page = (f: string) => fileURLToPath(new URL(f, import.meta.url));

/** Global security headers from vercel.json, so `npm run preview` enforces the same CSP / Trusted Types as production. */
const vercel = JSON.parse(readFileSync(page('./vercel.json'), 'utf8')) as { headers: { source: string; headers: { key: string; value: string }[] }[] };
const globalHeaders = Object.fromEntries(vercel.headers.find((h) => h.source === '/(.*)')!.headers.map((h) => [h.key, h.value]));

// No font preloads on purpose: with the metric-matched fallbacks in src/styles/fonts.css the swap causes no shift,
// and preloading made the fonts land during the first layout, adding a relayout before first paint (measured: later LCP).
export default defineConfig({
  preview: { headers: globalHeaders },
  build: {
    // Never base64-inline fonts into CSS: it bloats the render-blocking stylesheet and CSP font-src is 'self' only.
    assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined),
    rollupOptions: {
      input: {
        main: page('./index.html'),
        datenschutz: page('./datenschutz.html'),
        cv: page('./cv.html'),
      },
    },
  },
});
