// Dependency-free static export; publish only the files required by the counter.
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node scripts/build.mjs [--origin https://your-approved-domain.example]');
  console.log('Without --origin: noindex local export. No deployment occurs.');
  process.exit(0);
}
if (args.length && (args[0] !== '--origin' || args.length !== 2)) throw new Error('Expected --origin followed by one approved HTTPS origin');
let origin = null;
if (args.length) {
  const url = new URL(args[1]);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('Use a bare approved HTTPS origin');
  origin = url.origin;
}
if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') origin = null;
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const name of ['style.css', 'game.js', 'favicon.svg', 'LICENSE']) await cp(path.join(root, name), path.join(out, name));
let html = await readFile(path.join(root, 'index.html'), 'utf8');
if (origin) {
  html = html.replace('content="noindex, nofollow"', 'content="index, follow"');
  const tags = [
    `<link rel="canonical" href="${origin}/">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="Spacebar Counter — A Simple Spacebar Speed Test">',
    '<meta property="og:description" content="Count distinct spacebar presses, compare timed local rounds, or try a separately labeled tap test.">',
    `<meta property="og:url" content="${origin}/">`,
    '<meta name="twitter:card" content="summary">',
    `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Spacebar Counter', url: `${origin}/`, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web browser', isAccessibleForFree: true, inLanguage: 'en' })}</script>`
  ];
  html = html.replace('</head>', '  ' + tags.join('\n  ') + '\n</head>');
  await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
} else await writeFile(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await writeFile(path.join(out, 'index.html'), html);
console.log(`Static export ready: ${out}\nMode: ${origin ? 'production URLs for ' + origin : 'local preview, noindex'}\nNothing was deployed.`);
