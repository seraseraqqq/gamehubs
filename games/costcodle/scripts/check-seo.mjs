// Verify the production domain migration and preview indexing boundary against real exports.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const build=fileURLToPath(new URL('build.mjs',import.meta.url));
const read=name=>readFile(new URL('../dist/'+name,import.meta.url),'utf8');
const run=(args=[],env={})=>execFileSync(process.execPath,[build,...args],{cwd:root,env:{...process.env,VERCEL_ENV:'',...env},stdio:'pipe'});
try {
  run(['--origin','https://costcodle.cc']);
  const html=await read('index.html');
  assert.match(html,/<meta name="robots" content="index, follow/);
  assert.match(html,/<link rel="canonical" href="https:\/\/costcodle.cc\/">/);
  assert.doesNotMatch(html,/costcodle-unlimited\.vercel\.app/);
  for(const key of ['og:url','og:image','twitter:image']) assert.match(html,new RegExp('(?:name|property)="'+key+'" content="https://costcodle.cc/'));
  assert.match(await read('sitemap.xml'),/<loc>https:\/\/costcodle.cc\/<\/loc>/);
  assert.match(await read('robots.txt'),/Sitemap: https:\/\/costcodle.cc\/sitemap.xml/);
  assert.match(await read('game.js'),/Play free: https:\/\/costcodle.cc\//);
  for(const mode of ['default','preview']) {
    run(mode==='preview'?['--origin','https://costcodle.cc']:[],mode==='preview'?{VERCEL_ENV:'preview'}:{});
    const preview=await read('index.html');
    assert.match(preview,/<meta name="robots" content="noindex, nofollow">/);
    assert.doesNotMatch(preview,/rel="canonical"|property="og:url"/);
    assert.match(await read('robots.txt'),/Disallow: \//);
    await assert.rejects(access(new URL('../dist/sitemap.xml',import.meta.url)));
  }
  console.log('PASS: Costcodle production domain/share URLs and default + Vercel preview noindex isolation');
} finally {run();}
