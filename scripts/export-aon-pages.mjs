import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { aonLegalPages, aonLegalSlugs, aonOrigin, aonDeveloperCredit, aonCopyright } from '../src/content/astronomy-open-night-legal.ts';

const escape = (text) => text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const policyText = [aonLegalPages.privacy.intro, ...aonLegalPages.privacy.sections.flatMap(section => [section.heading, ...section.body])].join('\n\n');

try {
  const [appDirectory, outputDirectory] = process.argv.slice(2);
  if (!appDirectory || !outputDirectory) throw new Error('Usage: node scripts/export-aon-pages.mjs APP_DIRECTORY OUTPUT_DIRECTORY');
  const app = path.resolve(appDirectory);
  const output = path.resolve(outputDirectory);
  const en = JSON.parse(await readFile(path.join(app, 'lib/l10n/app_en.arb'), 'utf8'));
  const fa = JSON.parse(await readFile(path.join(app, 'lib/l10n/app_fa.arb'), 'utf8'));
  if (en.settingsPrivacyPolicyBody !== policyText) throw new Error('Hosted privacy copy differs from the English in-app policy. Align the reviewed sources before export.');
  await mkdir(output, { recursive: true });
  const nav = `<nav aria-label="App links"><a href="/">Open app</a><a href="/privacy">Privacy</a><a href="/support">Support</a><a href="/terms">Terms</a></nav>`;
  const style = `:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#05070f;color:#e7eaf2;font:17px/1.7 system-ui,sans-serif}main,nav,footer{max-width:780px;margin:auto;padding:24px}nav{display:flex;flex-wrap:wrap;gap:24px}a{color:#ffd08a;text-underline-offset:4px}a:focus-visible{outline:3px solid #ffd08a;outline-offset:5px}h1{font-size:clamp(1.8rem,5vw,2.7rem);line-height:1.2}h2{font-size:1.3rem;margin-top:36px}p{overflow-wrap:anywhere}footer{border-top:1px solid #454959}section:target{scroll-margin-top:24px}`;
  for (const slug of aonLegalSlugs) {
    const page = aonLegalPages[slug];
    const sections = page.sections.map(s => `<section><h2>${escape(s.heading)}</h2>${s.body.map(p => `<p>${escape(p)}</p>`).join('')}${s.links ? `<ul>${s.links.map(l => `<li><a href="${escape(l.href)}">${escape(l.label)}</a></li>`).join('')}</ul>` : ''}</section>`).join('');
    const persian = slug === 'privacy' ? `<section lang="fa" dir="rtl" id="persian"><h2>سیاست حریم خصوصی</h2>${fa.settingsPrivacyPolicyBody.split('\n\n').map(p => `<p>${escape(p)}</p>`).join('')}</section>` : '';
    const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><link rel="canonical" href="${aonOrigin}/${slug}"><meta property="og:url" content="${aonOrigin}/${slug}"><style>${style}</style></head><body>${nav}<main><h1>${escape(page.title)}</h1>${slug === 'privacy' ? '<a href="#persian" lang="fa">فارسی</a>' : ''}<p>${escape(page.intro)}</p>${sections}${persian}</main><footer>Developed by ${escape(aonDeveloperCredit)}<br>${escape(aonCopyright)}</footer></body></html>`;
    await writeFile(path.join(output, `${slug}.html`), html);
  }
  console.log('Exported privacy, support and terms; English in-app parity verified.');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Could not export app pages.');
  process.exitCode = 1;
}
