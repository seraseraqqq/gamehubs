// Static export. Preview stays noindex unless an explicit production origin is supplied.
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const args = process.argv.slice(2);
const at = args.indexOf('--origin');
if (args.includes('--help')) {
  console.log('node scripts/build.mjs [--origin https://your-approved-domain.example]');
  console.log('Without --origin: private local-preview export, noindex and blocked robots. No deployment occurs.');
  process.exit(0);
}
if (args.length && (args[0] !== '--origin' || args.length !== 2)) throw new Error('Expected --origin followed by one approved HTTPS origin');
let origin = null;
if (at >= 0) {
  if (!args[at + 1]) throw new Error('--origin requires an HTTPS origin');
  const url = new URL(args[at + 1]);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('Use a bare approved HTTPS origin, without path, query or credentials');
  origin = url.origin;
}
// Vercel preview builds remain private even though the production origin is configured.
if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') origin = null;
await rm(out, { recursive: true, force: true }); await mkdir(path.join(out, 'assets'), { recursive: true });
for (const name of ['style.css', 'game.mjs', 'engine.mjs', 'favicon.svg', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) await cp(path.join(root, name), path.join(out, name));
for (const name of ['cupcakes-atlas.webp', 'og-cover.png', 'LICENSE-2048.txt']) {
  const file = path.join(root, 'assets', name);
  await cp(file, path.join(out, 'assets', name));
}
let html = await readFile(path.join(root, 'index.html'), 'utf8');
if (origin) {
  html = html.replace('content="noindex, nofollow"', 'content="index, follow, max-image-preview:large"');
  const tags = [`<link rel="canonical" href="${origin}/">`, `<meta property="og:url" content="${origin}/">`, '<meta name="twitter:card" content="summary_large_image">'];
  tags.push(`<meta property="og:image" content="${origin}/assets/og-cover.png">`, '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:image:alt" content="2048 Cupcakes: slide, match and merge toward the rainbow cupcake">', `<meta name="twitter:image" content="${origin}/assets/og-cover.png">`, '<meta name="twitter:image:alt" content="2048 Cupcakes: slide, match and merge toward the rainbow cupcake">');
  tags.push('<meta name="twitter:title" content="2048 Cupcakes — A Cozy Cupcake Merge Game">', '<meta name="twitter:description" content="Slide and merge matching cupcakes toward 2048. Play free with undo, local saves, arrow keys, WASD or swipe controls.">');
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, start, raw, end) => {
    const game = JSON.parse(raw);
    game.url = `${origin}/`;
    game['@id'] = `${origin}/#game`;
    game.image = `${origin}/assets/og-cover.png`;
    return start + JSON.stringify(game) + end;
  });
  html = html.replace('</head>', '  ' + tags.join('\n  ') + '\n</head>');
  await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
} else await writeFile(path.join(out, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
await writeFile(path.join(out, 'index.html'), html);
console.log(`Static export ready: ${out}\nMode: ${origin ? 'production URLs for ' + origin : 'local preview, noindex'}\nNothing was deployed.`);
