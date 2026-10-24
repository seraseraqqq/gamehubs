// Portfolio regression check: actual static exports, approved origins and release holds.
// node management/tools/check-portfolio-seo.mjs [--site SITE_ID] [--public]
// Build each game with its own build command first. This checker never deploys or builds.
import {readFile, readdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node management/tools/check-portfolio-seo.mjs [--site SITE_ID] [--public]');
  process.exit(0);
}
const selected = args.includes('--site') ? args[args.indexOf('--site') + 1] : null;
if (args.some((v,i) => v !== '--public' && v !== '--site' && args[i-1] !== '--site')) throw Error('Unknown argument');
const publicMode = args.includes('--public');
const origins = {
  'block-blast-unblocked':'https://playblockblastunblocked.com',
  '2048-cupcakes':'https://www.2048cupcakes.xyz',
  'spacebar-counter':'https://www.spacebarcounter.xyz',
  'gulper-io':'https://gulperio.com',
  'head-soccer-2026':'https://www.playheadsoccer.com',
  'krillion-unlimited':'https://krilliononline.com',
  costcodle:'https://costcodle.cc',
};
const games = JSON.parse(await readFile(path.join(root,'management/data/repositories.json'),'utf8')).games.filter(g => !selected || selected === g.siteId);
if (!games.length) throw Error('Unknown site');
const results = [];
const decode = s => s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(m => [m[1].toLowerCase(),decode(m[3])]));
async function exists(file) {try {return (await stat(file)).isFile();} catch {return false;}}
for (const game of games) {
  const out = path.join(game.localPath || path.join(root,game.rootDirectory),'dist');
  const origin = publicMode ? origins[game.siteId] : null;
  const files = (await readdir(out)).filter(n => n.endsWith('.html'));
  const pages = new Map(await Promise.all(files.map(async n => [n,await readFile(path.join(out,n),'utf8')])));
  const titles = new Set(), descriptions = new Set();
  for (const [name,html] of pages) {
    const issues = [];
    const fail = (test,msg) => {if (!test) issues.push(msg);};
    const metadata = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0]));
    const meta = key => metadata.filter(m => (m.name || m.property) === key).map(m => m.content || '');
    const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0])).filter(a => a.rel === 'canonical').map(a => a.href);
    const is404 = name === '404.html';
    fail(!!title && !titles.has(title),'missing or duplicate title');titles.add(title);
    if (!is404) {fail(meta('description').length === 1 && !!meta('description')[0] && !descriptions.has(meta('description')[0]),'missing or duplicate description');descriptions.add(meta('description')[0]);}
    fail((html.match(/<h1\b/gi)||[]).length === 1,'expected one H1');
    fail(/<html\b[^>]*\blang=["'][^"']+/i.test(html),'missing language');
    fail(meta('viewport').length === 1,'missing viewport');
    fail(!/\b(?:lorem ipsum|EST\. 20XX|your-domain\.com|coming soon)\b/i.test(html),'placeholder text');
    const robots = meta('robots').join(',').toLowerCase();
    if (origin && !is404) {
      const expected = origin+(name === 'index.html' ? '/' : '/'+name);
      fail(canonical.length === 1 && canonical[0] === expected,'canonical differs from approved final origin/path');
      fail(meta('og:url')[0] === expected,'og:url differs from canonical');
      fail(!robots.includes('noindex'),'public page unexpectedly noindex');
    } else {
      fail(robots.includes('noindex'),'preview/held page missing noindex');
      if (!is404) fail(canonical.length === 0,'preview declares a production canonical');
    }
    for (const key of is404 ? [] : ['og:title','og:description','og:image','twitter:card','twitter:title','twitter:description','twitter:image']) {
      fail(meta(key).length === 1 && !!meta(key)[0], 'missing or duplicate '+key);
    }
    for (const key of ['og:image','twitter:image']) {
      const value = meta(key)[0];
      if (!value) continue;
      const u = new URL(value,origin || 'https://preview.invalid');
      fail(await exists(path.join(out,decodeURIComponent(u.pathname))),'missing share asset '+value);
      if (origin && !is404) fail(u.origin === origin && /^https:\/\//.test(value),'share image not absolute on approved origin');
    }
    for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      try { JSON.parse(m[1]); } catch {issues.push('invalid JSON-LD');}
    }
    for (const m of html.matchAll(/<(?:a|link|script|img)\b[^>]*>/gi)) {
      const a=attrs(m[0]), value=a.href || a.src;
      if (!value || /^(?:https?:|mailto:|tel:|data:|\/\/)/i.test(value)) continue;
      const u=new URL(value,'https://preview.invalid/'+name);
      let target=decodeURIComponent(u.pathname).replace(/^\//,'');
      if (!target || target.endsWith('/')) target+='index.html';
      fail(await exists(path.join(out,target)), 'broken local reference '+value);
      if (u.hash && pages.has(target)) fail(pages.get(target).includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),'broken anchor '+value);
      if (m[0].startsWith('<img')) fail(Object.hasOwn(a,'alt'),'image missing alt');
    }
    results.push({site:game.siteId,page:name,title,description:meta('description')[0],canonical,robots,issues});
  }
  const sitemapFile = path.join(out,'sitemap.xml');
  const robots = await readFile(path.join(out,'robots.txt'),'utf8');
  if (origin) {
    const sitemap=await readFile(sitemapFile,'utf8');
    const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>decode(m[1])).sort();
    const expected=files.filter(n=>n!=='404.html').map(n=>origin+(n==='index.html'?'/':'/'+n)).sort();
    if (JSON.stringify(urls)!==JSON.stringify(expected) || !robots.includes('Sitemap: '+origin+'/sitemap.xml')) throw Error(game.siteId+': sitemap/robots mismatch');
  } else if (await exists(sitemapFile) && /<loc>/.test(await readFile(sitemapFile,'utf8'))) throw Error(game.siteId+': preview/held build advertises sitemap URLs');
}
console.log(JSON.stringify({checkedAt:new Date().toISOString(),mode:publicMode?'public (release holds preserved)':'preview',sites:games.length,pages:results.length,failures:results.filter(r=>r.issues.length),results},null,2));
if (results.some(r=>r.issues.length)) process.exitCode=1;
