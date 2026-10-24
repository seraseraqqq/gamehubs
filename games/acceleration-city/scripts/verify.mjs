// Configuration and static output checks. Does not assert external Unity gameplay.
import assert from 'node:assert/strict';import {readFile,stat,mkdtemp,writeFile,rm}from'node:fs/promises';import path from'node:path';import os from'node:os';import{build,root}from'./build.mjs';
import{verifyReloadFlow}from'./reload-flow.test.mjs';
const work=await mkdtemp(path.join(os.tmpdir(),'acceleration-city-verify-'));const checks=[];
function check(name,fn){fn();checks.push(name);}
try{
  const preview=await build({outDir:path.join(work,'preview')});
  check('default export remains non-production',()=>assert.equal(preview.production,false));
  for(const name of ['index.html','guide.html','about.html']){
    const html=await readFile(path.join(preview.outDir,name),'utf8');
    check(`${name}: noindex`,()=>assert.match(html,/<meta name="robots" content="noindex, nofollow">/));
    check(`${name}: one H1`,()=>assert.equal((html.match(/<h1\b/g)||[]).length,1));
    check(`${name}: title <=60`,()=>assert.ok(html.match(/<title>([^<]+)<\/title>/)[1].length<=60));
    check(`${name}: description <=155`,()=>assert.ok(html.match(/name="description" content="([^"]+)"/)[1].length<=155));
    check(`${name}: preview has no canonical`,()=>assert.doesNotMatch(html,/rel="canonical"/));
    const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    check(`${name}: valid schema with no invented ratings`,()=>{assert.equal(graph['@context'],'https://schema.org');assert.doesNotMatch(JSON.stringify(graph),/aggregateRating|ratingValue/);});
    for(const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){const relative=match[1]==='/'?'index.html':match[1].slice(1);check(`${name}: local ${relative} resolves`,()=>assert.ok(['index.html','guide.html','about.html','style.css','app.js','favicon.svg'].includes(relative)));}
  }
  check('preview robots blocks crawling',()=>assert.equal(preview.production,false));
  await assert.rejects(()=>build({origin:'https://acceleration-city-build-check.invalid',license:'',outDir:path.join(work,'blocked')}),/licen/);checks.push('production export requires explicit licence confirmation');
  for(const origin of ['http://insecure.invalid','https://secure.invalid/path','https://user:pass@secure.invalid','https://secure.invalid/?q=1','not a URL']){await assert.rejects(()=>build({origin,license:'true',outDir:path.join(work,'invalid')}));checks.push(`reject invalid origin: ${origin.replace(/user:pass@/,'[credentials]@')}`);}
  const production=await build({origin:'https://acceleration-city-build-check.invalid',license:'true',outDir:path.join(work,'production')});
  const homepage=await readFile(path.join(production.outDir,'index.html'),'utf8'),robots=await readFile(path.join(production.outDir,'robots.txt'),'utf8'),sitemap=await readFile(path.join(production.outDir,'sitemap.xml'),'utf8');
  check('production canonical derives from origin',()=>assert.match(homepage,/rel="canonical" href="https:\/\/acceleration-city-build-check.invalid\/"/));
  check('production indexing explicitly enabled',()=>assert.match(homepage,/name="robots" content="index, follow"/));
  check('production sitemap has three URLs',()=>assert.equal((sitemap.match(/<loc>/g)||[]).length,3));
  check('production robots points to origin sitemap',()=>assert.match(robots,/Sitemap: https:\/\/acceleration-city-build-check.invalid\/sitemap.xml/));
  const forced=await build({origin:'https://acceleration-city-build-check.invalid',license:'true',preview:true,outDir:path.join(work,'forced-preview')});
  check('Vercel preview always remains noindex',()=>assert.equal(forced.production,false));
  const forcedHtml=await readFile(path.join(forced.outDir,'index.html'),'utf8');check('forced preview does not emit canonical',()=>assert.doesNotMatch(forcedHtml,/rel="canonical"/));
  const app=await readFile(path.join(root,'app.js'),'utf8');check('embed points to clean official URL',()=>assert.match(app,/const SOURCE='https:\/\/activities.cs2n.org\/acceleration-city\/'/));check('no embedded credential token',()=>assert.doesNotMatch(app,/[?&]token=|eyJhbGci/));
  check('reload uses no blocking browser confirm',()=>assert.doesNotMatch(app,/window\.confirm\(/));
  checks.push(...await verifyReloadFlow());
  await stat(path.join(preview.outDir,'404.html'));checks.push('standalone 404 page exported');
  const report={at:new Date().toISOString(),passed:checks.length,checks,limits:['Final inline reload confirmation and viewport adjustment have not been browser-recaptured.','Native fullscreen and mobile layout/gameplay remain unverified.','Desktop original-game launch, Continue, W-forward driving and focus view were verified separately before the inline-confirm change.','External Unity loading time is not measured by these checks.','Commercial embedding rights remain unknown.']};
  await writeFile(path.join(root,'scripts/verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:checks.length,report:'scripts/verification.json'},null,2));
}finally{const resolved=path.resolve(work),temp=path.resolve(os.tmpdir());if(resolved.startsWith(temp+path.sep)&&path.basename(resolved).startsWith('acceleration-city-verify-'))await rm(resolved,{recursive:true,force:true});}
