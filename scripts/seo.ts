// SEO output generated from the CV data (src/data.ts, work.ts, i18n.ts), so it never drifts from the site:
//  - the language pages /en/, /de/, /el/ (+ /<lang>/portfolio.html): one copy of index.html / portfolio.html per
//    language with its own <html lang>, title, description, canonical, hreflang, OG tags and <noscript> content
//  - the CV / portfolio as plain HTML inside <noscript>, for crawlers and agents that don't run JavaScript
//  - llms.txt + llms-full.txt (llmstxt.org, English) and sitemap.xml, emitted into dist/ (served by a middleware in dev)
// robots.txt is hand-written in public/.
import type { Plugin } from 'vite';
import { JOBS, SKILLS, CATS, EDU, LANGS, LANG_CODES, CAREER_START, type Lang } from '../src/data';
import { WORK, SELECTED, type Work } from '../src/work';
import { T } from '../src/i18n';
import { LINKS, LOCALIZED, type LocalizedPage } from '../src/config';
import { esc, period } from '../src/format';

const NAME = 'Sergkei Kournosenkov';
const DEFAULT: Lang = 'en'; // x-default, and what the unprefixed entry pages (/, /portfolio.html) are canonical to
const url = (path = '') => LINKS.site + path;
const langUrl = (page: LocalizedPage, L: Lang) => url(L + page);
const tagline = (L: Lang) => `${T[L].role} · ${T[L].spec} · ${T[L].loc}`;
const skills = (L: Lang) => CATS.map((cat) => [(T[L].cats as Record<string, string>)[cat], SKILLS.filter((k) => k.c === cat).sort((a, b) => b.r - a.r).map((k) => k.n)] as const)
  .filter(([, names]) => names.length);
const liveUrl = (w: Work) => (w.live && !w.offline ? w.live : '');

// ---------- Markdown (English) ----------

function llmsTxt() {
  const L = DEFAULT, tt = T[L], now = JOBS.find((j) => !j.to)!;
  const since = new Intl.DateTimeFormat(L, { month: 'long', year: 'numeric' }).format(CAREER_START);
  return `# ${NAME}

> ${tagline(L)}. ${tt.profile}

- Current role: ${now.role[L]} at ${now.company} (${period(now, L)})
- Working as a developer since ${since}
- Core stack: ${now.tags.join(', ')}
- Education: ${EDU[0].t[L]}, ${EDU[0].s[L]}
- Spoken languages: ${LANGS.map((l) => `${l.n[L]} (${l.l[L]})`).join(', ')}

The website is an interactive CV in English (\`/en/\`), German (\`/de/\`) and Greek (\`/el/\`). For plain text, use the full CV below.

## CV

- [Full CV (Markdown)](${url('llms-full.txt')}): complete work experience, projects, skills, education and languages
- [Interactive CV](${langUrl('/', L)}): the website. Scrolling past the end turns the CV into a playable retro RPG
- [Portfolio](${langUrl('/portfolio.html', L)}): all projects with case studies
- [Printable CV](${url('cv.html')}): A4 version for print and PDF

## Contact

- [Email](mailto:${LINKS.email}): ${LINKS.email}
- [GitHub](${LINKS.github})
- [LinkedIn](${LINKS.linkedin})

## Optional

- [Lebenslauf (Deutsch)](${langUrl('/', 'de')}): the same CV in German
- [Βιογραφικό (Ελληνικά)](${langUrl('/', 'el')}): the same CV in Greek
- [Privacy policy](${url('datenschutz.html')}): German, English and Greek
`;
}

function llmsFullTxt() {
  const L = DEFAULT, tt = T[L], c = tt.cvp;
  const job = JOBS.map((j) => `### ${j.role[L]}, ${j.company}${j.place ? ' · ' + j.place[L] : ''}

${period(j, L)}${j.side ? ` · ${c.side}` : ''}

${j.b[L].map((b) => `- ${b}`).join('\n')}

${c.tech}: ${j.tags.join(', ')}`).join('\n\n');

  const project = WORK.map((w) => [
    `### ${w.title[L]}`,
    `${w.client[L]} · ${w.year} · ${tt.wRole}: ${w.role[L]}`,
    w.outcome[L],
    w.problem && `**${tt.wProblem}:** ${w.problem[L]}`,
    w.approach && `**${tt.wApproach}:** ${w.approach[L]}`,
    w.result && `**${tt.wResult}:** ${w.result[L]}`,
    w.stats && w.stats.map((s) => `- ${s.value} ${s.label[L]}`).join('\n'),
    `${tt.wStack}: ${w.tags.join(', ')}`,
    liveUrl(w) && `${tt.live}: ${liveUrl(w)}`,
  ].filter(Boolean).join('\n\n')).join('\n\n');

  return `# ${NAME}: ${c.title}

> ${tagline(L)}

${tt.profile}

- Email: ${LINKS.email}
- Website: ${url()}
- Portfolio: ${langUrl('/portfolio.html', L)}
- GitHub: ${LINKS.github}
- LinkedIn: ${LINKS.linkedin}

## ${c.experience}

${job}

## Projects

${project}

## ${c.skills}

${skills(L).map(([cat, names]) => `- **${cat}:** ${names.join(', ')}`).join('\n')}

## ${c.education}

${EDU.map((e) => `- ${e.t[L]}, ${e.s[L]} (${e.y})`).join('\n')}

## ${c.languages}

${LANGS.map((l) => `- ${l.n[L]}: ${l.l[L]}`).join('\n')}
`;
}

/** Every language page + llms.txt. The unprefixed entry pages are canonical to /en/…; cv.html and datenschutz.html are noindex. */
function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const paths = [...LOCALIZED.flatMap((page) => LANG_CODES.map((l) => l + page)), 'llms.txt'];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${url(p)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
}

const FILES: Record<string, { type: string; body: () => string }> = {
  'llms.txt': { type: 'text/plain; charset=utf-8', body: llmsTxt },
  'llms-full.txt': { type: 'text/plain; charset=utf-8', body: llmsFullTxt },
  'sitemap.xml': { type: 'application/xml; charset=utf-8', body: sitemapXml },
};

// ---------- Language pages: <head> tags + <noscript> HTML ----------

const OG_LOCALE: Record<Lang, string> = { en: 'en_US', de: 'de_DE', el: 'el_GR' };
const LANG_NAME: Record<Lang, string> = { en: 'English', de: 'Deutsch', el: 'Ελληνικά' };
const link = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;
const meta = (key: 'name' | 'property', name: string, content: string) => `<meta ${key}="${name}" content="${esc(content)}">`;

function headHtml(page: LocalizedPage, L: Lang) {
  const tt = T[L], s = tt.seo, home = page === '/';
  const ogTitle = home ? s.ogTitle : tt.pfTitle, ogDesc = home ? s.ogDesc : s.pfOgDesc, image = url('og-image.png');
  return [
    `<title>${esc(home ? s.title : tt.pfTitle)}</title>`,
    meta('name', 'description', home ? s.desc : s.pfDesc),
    `<link rel="canonical" href="${langUrl(page, L)}">`,
    ...LANG_CODES.map((l) => `<link rel="alternate" hreflang="${l}" href="${langUrl(page, l)}">`),
    `<link rel="alternate" hreflang="x-default" href="${langUrl(page, DEFAULT)}">`,
    meta('property', 'og:type', home ? 'profile' : 'website'),
    meta('property', 'og:url', langUrl(page, L)),
    meta('property', 'og:title', ogTitle),
    meta('property', 'og:description', ogDesc),
    meta('property', 'og:image', image),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:locale', OG_LOCALE[L]),
    ...LANG_CODES.filter((l) => l !== L).map((l) => meta('property', 'og:locale:alternate', OG_LOCALE[l])),
    ...(home ? [meta('property', 'profile:first_name', 'Sergkei'), meta('property', 'profile:last_name', 'Kournosenkov')] : []),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', ogTitle),
    meta('name', 'twitter:description', ogDesc),
    meta('name', 'twitter:image', image),
  ].join('\n  ');
}

/** Last line of the <noscript> content: the other languages (crawlable links) + the pages without a language URL. */
const footHtml = (page: LocalizedPage, L: Lang) =>
  `<p>${LANG_CODES.map((l) => `<a href="/${l}${page}" hreflang="${l}" lang="${l}">${esc(LANG_NAME[l])}</a>`).join(' · ')}</p>
      <p>${link(`/cv.html?lang=${L}`, T[L].cvp.btn)} · ${link('/llms-full.txt', 'llms-full.txt')} · ${link('/datenschutz.html', T[L].footer.privacy)}</p>`;

function cvHtml(L: Lang) {
  const tt = T[L], c = tt.cvp;
  return `<h1>${esc(NAME)}</h1>
      <p>${esc(tagline(L))}</p>
      <p>${esc(tt.profile)}</p>
      <p>${link('mailto:' + LINKS.email, LINKS.email)} · ${link(LINKS.github, 'GitHub')} · ${link(LINKS.linkedin, 'LinkedIn')}</p>
      <h2>${esc(c.experience)}</h2>
      ${JOBS.map((j) => `<h3>${esc(j.role[L])}, ${esc(j.company)}${j.place ? ' · ' + esc(j.place[L]) : ''}</h3>
      <p>${esc(period(j, L))}</p>
      <ul>${j.b[L].map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      <p>${esc(c.tech)}: ${esc(j.tags.join(', '))}</p>`).join('\n      ')}
      <h2>${esc(c.projects)}</h2>
      ${SELECTED.map((w) => `<h3>${esc(w.title[L])}</h3>
      <p>${esc(w.client[L])} · ${esc(w.year)}</p>
      <p>${esc(w.outcome[L])}</p>`).join('\n      ')}
      <p>${link(`/${L}/portfolio.html`, `Portfolio: ${tt.wAll}`)}</p>
      <h2>${esc(c.skills)}</h2>
      <ul>${skills(L).map(([cat, names]) => `<li>${esc(cat)}: ${esc(names.join(', '))}</li>`).join('')}</ul>
      <h2>${esc(c.education)}</h2>
      <ul>${EDU.map((e) => `<li>${esc(e.t[L])}, ${esc(e.s[L])} (${esc(e.y)})</li>`).join('')}</ul>
      <h2>${esc(c.languages)}</h2>
      <ul>${LANGS.map((l) => `<li>${esc(l.n[L])}: ${esc(l.l[L])}</li>`).join('')}</ul>
      ${footHtml('/', L)}`;
}

function portfolioHtml(L: Lang) {
  const tt = T[L];
  return `<h1>${esc(tt.pfTitle)}</h1>
      ${WORK.map((w) => `<h2>${esc(w.title[L])}</h2>
      <p>${esc(w.client[L])} · ${esc(w.year)} · ${esc(tt.wRole)}: ${esc(w.role[L])}</p>
      <p>${esc(w.outcome[L])}</p>${([[tt.wProblem, w.problem], [tt.wApproach, w.approach], [tt.wResult, w.result]] as const)
    .map(([label, text]) => (text ? `\n      <p>${esc(label)}: ${esc(text[L])}</p>` : '')).join('')}
      <p>${esc(tt.wStack)}: ${esc(w.tags.join(', '))}${liveUrl(w) ? ` · ${link(liveUrl(w), tt.live)}` : ''}</p>`).join('\n      ')}
      <p>${link(`/${L}/`, `← ${tt.cvp.back}`)}</p>
      ${footHtml('/portfolio.html', L)}`;
}

/** index.html / portfolio.html (written in English, with <!--seo:…--> markers) → the page in language L. */
const localize = (html: string, page: LocalizedPage, L: Lang) => html
  .replace('<html lang="en"', `<html lang="${L}"`)
  .replace('<!--seo:head-->', () => headHtml(page, L))
  .replace('<!--seo:body-->', () => (page === '/' ? cvHtml(L) : portfolioHtml(L)));

const fileOf = (page: LocalizedPage) => (page === '/' ? 'index.html' : page.slice(1));
const LANG_PATH = new RegExp(`^/(${LANG_CODES.join('|')})(/[^?]*)?(\\?.*)?$`); // /de, /de/, /de/portfolio.html?x → [lang, page, query]
const isLocalized = (page: string): page is LocalizedPage => (LOCALIZED as readonly string[]).includes(page);

export const seoFiles = (): Plugin => ({
  name: 'seo-files',
  // Dev: one HTML file serves every language URL (see the middleware below); the language comes from the requested URL.
  transformIndexHtml(html, ctx) {
    if (!ctx.server) return; // build: generateBundle localizes the finished HTML instead
    const page = ctx.path.replace(/\/index\.html$/, '/');
    if (!isLocalized(page)) return;
    return localize(html, page, (ctx.originalUrl?.match(LANG_PATH)?.[1] as Lang | undefined) ?? DEFAULT);
  },
  generateBundle: {
    order: 'post', // after Vite has emitted the HTML (scripts, inlined CSS)
    handler(_, bundle) {
      for (const [fileName, f] of Object.entries(FILES)) this.emitFile({ type: 'asset', fileName, source: f.body() });
      for (const page of LOCALIZED) {
        const name = fileOf(page), asset = bundle[name];
        if (asset?.type !== 'asset' || typeof asset.source !== 'string') return this.error(`seo-files: ${name} is not in the bundle`);
        const html = asset.source;
        for (const l of LANG_CODES) this.emitFile({ type: 'asset', fileName: `${l}/${name}`, source: localize(html, page, l) });
        asset.source = localize(html, page, DEFAULT); // the entry page: same as /en/…, which is also its canonical
      }
    },
  },
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const m = req.url?.match(LANG_PATH), page = m?.[2] || '/';
      if (m && isLocalized(page)) { req.url = '/' + fileOf(page) + (m[3] ?? ''); return next(); }
      const f = FILES[(req.url ?? '').split('?')[0].slice(1)];
      if (!f) return next();
      res.setHeader('Content-Type', f.type);
      res.end(f.body());
    });
  },
});
