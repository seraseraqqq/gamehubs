// Standalone static export. Sources stay readable; only runtime assets are published.
import { cp, mkdir, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node scripts/build.mjs [--origin https://confirmed-domain.example]');
  console.log('Without --origin, or in Vercel preview: noindex export. No deployment occurs.');
  process.exit(0);
}
if (args.length && (args[0] !== '--origin' || args.length !== 2)) throw new Error('Expected one --origin HTTPS value');
let origin = null;
if (args.length) {
  const url = new URL(args[1]);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.username || url.password || url.port || url.search || url.hash) throw new Error('Expected a bare public HTTPS origin');
  origin = url.origin;
}
if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') origin = null;
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const runtime = ['style.css', 'game.js', 'favicon.svg', 'manifest.json', 'THIRD_PARTY_NOTICES.md'];
const names = await readdir(root);
for (const optional of ['items.js', 'audio.js']) if (names.includes(optional)) runtime.push(optional);
for (const name of runtime) await cp(path.join(root, name), path.join(out, name));
await cp(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
let html = await readFile(path.join(root, 'index.html'), 'utf8');
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
if (!canonical) throw new Error('Source must declare its confirmed canonical');
if (origin) {
  const previousOrigin = new URL(canonical[1]).origin;
  html = html.split(previousOrigin).join(origin);
  await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
} else {
  html = html.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow">');
  await writeFile(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
}
await writeFile(path.join(out, 'index.html'), html);
console.log(`Exported ${out}; ${origin || 'preview / noindex'}. Nothing was deployed.`);
