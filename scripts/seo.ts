// SEO output generated from the CV data (src/data.ts, work.ts, i18n.ts), so it never drifts from the site:
//  - llms.txt + llms-full.txt (llmstxt.org) and sitemap.xml, emitted into dist/ (served by a middleware in dev)
//  - the CV / portfolio as plain HTML inside <noscript>, for crawlers and agents that don't run JavaScript
// English only. robots.txt is hand-written in public/.
import type { Plugin } from 'vite';
import { JOBS, SKILLS, CATS, EDU, LANGS, CAREER_START } from '../src/data';
import { WORK, SELECTED, type Work } from '../src/work';
import { T } from '../src/i18n';
import { LINKS } from '../src/config';
import { esc, period } from '../src/format';

const L = 'en', tt = T[L], c = tt.cvp;
const NAME = 'Sergkei Kournosenkov';
const url = (path = '') => LINKS.site + path;
const tagline = `${tt.role} · ${tt.spec} · ${tt.loc}`;
const skills = CATS.map((cat) => [(tt.cats as Record<string, string>)[cat], SKILLS.filter((k) => k.c === cat).sort((a, b) => b.r - a.r).map((k) => k.n)] as const)
  .filter(([, names]) => names.length);
const liveUrl = (w: Work) => (w.live && !w.offline ? w.live : '');

// ---------- Markdown ----------

function llmsTxt() {
  const now = JOBS.find((j) => !j.to)!;
  const since = new Intl.DateTimeFormat(L, { month: 'long', year: 'numeric' }).format(CAREER_START);
  return `# ${NAME}

> ${tagline}. ${tt.profile}

- Current role: ${now.role[L]} at ${now.company} (${period(now, L)})
- Working as a developer since ${since}
- Core stack: ${now.tags.join(', ')}
- Education: ${EDU[0].t[L]}, ${EDU[0].s[L]}
- Spoken languages: ${LANGS.map((l) => `${l.n[L]} (${l.l[L]})`).join(', ')}

The website is an interactive CV in English, German and Greek (append \`?lang=en\`, \`?lang=de\` or \`?lang=el\`). For plain text, use the full CV below.

## CV

- [Full CV (Markdown)](${url('llms-full.txt')}): complete work experience, projects, skills, education and languages
- [Interactive CV](${url()}): the website. Scrolling past the end turns the CV into a playable retro RPG
- [Portfolio](${url('portfolio.html')}): all projects with case studies
- [Printable CV](${url('cv.html')}): A4 version for print and PDF

## Contact

- [Email](mailto:${LINKS.email}): ${LINKS.email}
- [GitHub](${LINKS.github})
- [LinkedIn](${LINKS.linkedin})

## Optional

- [Privacy policy](${url('datenschutz.html')}): German, English and Greek
`;
}

function llmsFullTxt() {
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

> ${tagline}

${tt.profile}

- Email: ${LINKS.email}
- Website: ${url()}
- Portfolio: ${url('portfolio.html')}
- GitHub: ${LINKS.github}
- LinkedIn: ${LINKS.linkedin}

## ${c.experience}

${job}

## Projects

${project}

## ${c.skills}

${skills.map(([cat, names]) => `- **${cat}:** ${names.join(', ')}`).join('\n')}

## ${c.education}

${EDU.map((e) => `- ${e.t[L]}, ${e.s[L]} (${e.y})`).join('\n')}

## ${c.languages}

${LANGS.map((l) => `- ${l.n[L]}: ${l.l[L]}`).join('\n')}
`;
}

/** Indexable pages + llms.txt (cv.html and datenschutz.html are noindex). */
function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['', 'portfolio.html', 'llms.txt'].map((p) => `  <url><loc>${url(p)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
}

const FILES: Record<string, { type: string; body: () => string }> = {
  'llms.txt': { type: 'text/plain; charset=utf-8', body: llmsTxt },
  'llms-full.txt': { type: 'text/plain; charset=utf-8', body: llmsFullTxt },
  'sitemap.xml': { type: 'application/xml; charset=utf-8', body: sitemapXml },
};

// ---------- <noscript> HTML ----------

const link = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;

function cvHtml() {
  return `<h1>${esc(NAME)}</h1>
      <p>${esc(tagline)}</p>
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
      <p>${link('/portfolio.html', 'Portfolio: all projects')}</p>
      <h2>${esc(c.skills)}</h2>
      <ul>${skills.map(([cat, names]) => `<li>${esc(cat)}: ${esc(names.join(', '))}</li>`).join('')}</ul>
      <h2>${esc(c.education)}</h2>
      <ul>${EDU.map((e) => `<li>${esc(e.t[L])}, ${esc(e.s[L])} (${esc(e.y)})</li>`).join('')}</ul>
      <h2>${esc(c.languages)}</h2>
      <ul>${LANGS.map((l) => `<li>${esc(l.n[L])}: ${esc(l.l[L])}</li>`).join('')}</ul>
      <p>${link('/cv.html', c.btn)} · ${link('/llms-full.txt', 'Plain text')} · ${link('/datenschutz.html', tt.footer.privacy)}</p>`;
}

function portfolioHtml() {
  return `<h1>${esc(tt.pfTitle)}</h1>
      ${WORK.map((w) => `<h2>${esc(w.title[L])}</h2>
      <p>${esc(w.client[L])} · ${esc(w.year)} · ${esc(tt.wRole)}: ${esc(w.role[L])}</p>
      <p>${esc(w.outcome[L])}</p>${([[tt.wProblem, w.problem], [tt.wApproach, w.approach], [tt.wResult, w.result]] as const)
    .map(([label, text]) => (text ? `\n      <p>${esc(label)}: ${esc(text[L])}</p>` : '')).join('')}
      <p>${esc(tt.wStack)}: ${esc(w.tags.join(', '))}${liveUrl(w) ? ` · ${link(liveUrl(w), tt.live)}` : ''}</p>`).join('\n      ')}
      <p>${link('/', 'kournosenkov.com')} · ${link('/cv.html', c.btn)} · ${link('/llms-full.txt', 'Plain text')} · ${link('/datenschutz.html', tt.footer.privacy)}</p>`;
}

export const seoFiles = (): Plugin => ({
  name: 'seo-files',
  transformIndexHtml: (html) => html.replace('<!--seo:cv-->', cvHtml).replace('<!--seo:portfolio-->', portfolioHtml),
  generateBundle() {
    for (const [fileName, f] of Object.entries(FILES)) this.emitFile({ type: 'asset', fileName, source: f.body() });
  },
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const f = FILES[(req.url ?? '').split('?')[0].slice(1)];
      if (!f) return next();
      res.setHeader('Content-Type', f.type);
      res.end(f.body());
    });
  },
});
