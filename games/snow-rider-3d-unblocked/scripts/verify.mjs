// Repeatable static/export QA; no browser bridge or service credentials needed.
import {readFile,stat,readdir,writeFile} from 'node:fs/promises';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),checks=[];
const read=name=>readFile(new URL(name,root),'utf8');
function check(name,pass,detail){checks.push({name,pass,detail});assert.ok(pass,name);}
function build(args=[],env={}){execFileSync(process.execPath,[new URL('./build.mjs',import.meta.url).pathname.replace(/^\/([A-Z]:)/,'$1'),...args],{env:{...process.env,SITE_ORIGIN:'',VERCEL_ENV:'',...env},stdio:'pipe'});}
const pages=['index.html','snow-rider-3d-controls.html','about.html'];
for(const page of pages){const html=await read(page),title=html.match(/<title>(.*?)<\/title>/)?.[1],description=html.match(/name="description" content="([^"]+)"/)?.[1];check(page+': one H1', (html.match(/<h1[ >]/g)||[]).length===1);check(page+': unique sensible title',!!title&&title.length<=60,title);check(page+': description <=155 characters',!!description&&description.length<=155,{length:description?.length,description});check(page+': source stays noindex',html.includes('noindex, nofollow'));check(page+': independent-site disclosure',/independen/i.test(html));
 for(const match of html.matchAll(/(?:href|src)="(\.\/[^"#]+)(?:#[^"]*)?"/g)){const asset=match[1];check(page+': local target '+asset,await stat(new URL(asset==='./'?'index.html':asset,root)).then(()=>true,()=>false));}
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){const schema=JSON.parse(match[1]);check(page+': valid JSON-LD without fabricated reviews',schema['@context']==='https://schema.org'&&!schema.aggregateRating&&!schema.review);}
 check(page+': no external executable before interaction',!/<(?:script|iframe)[^>]+src="https?:/i.test(html));
}
const home=await read('index.html');check('main keyword in title and H1',home.includes('<h1>Snow Rider 3D Unblocked</h1>')&&home.includes('<title>Snow Rider 3D Unblocked'));
check('homepage loads publisher wrapper, no original simulation',home.includes('src="./player.js"')&&!home.includes('<canvas')&&!home.includes('src="./game.js"'));
check('publisher and third-party privacy are disclosed',home.includes('GameDistribution')&&home.includes('privacy prompt'));
const wrapper=await read('player.js');check('wrapper uses existing publisher game ID',wrapper.includes('https://html5.gamedistribution.com/3b79a8537ebc414fb4f9672a9b8c68c8/'));
check('SDK referrer uses actual page URL',wrapper.includes('page.origin+page.pathname'));
const config=JSON.parse(await read('vercel.json')),policy=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;check('CSP permits the selected publisher and its official SDK frame',policy.includes('frame-src https://html5.gamedistribution.com https://html5.api.gamedistribution.com;')&&!policy.includes('frame-src *'));
const descriptions=await Promise.all(pages.map(async p=>(await read(p)).match(/name="description" content="([^"]+)"/)[1]));check('unique page descriptions',new Set(descriptions).size===pages.length);
build();check('preview blocks indexing',(await read('dist/robots.txt')).includes('Disallow: /'));check('preview omits canonical',!(await read('dist/index.html')).includes('rel="canonical"'));
for(const old of ['engine.js','scene.js','game.js','vendor','assets/social-card.jpg'])check('export excludes superseded original file '+old,await stat(new URL('dist/'+old,root)).then(()=>false,()=>true));
const origin='https://qa-owned-origin.example';build(['--origin',origin]);for(const page of pages){const html=await read('dist/'+page),url=origin+(page==='index.html'?'/':'/'+page);check(page+': production canonical',html.includes(`rel="canonical" href="${url}"`));check(page+': production indexable',html.includes('content="index, follow, max-image-preview:large"'));check(page+': absolute social image',html.includes('content="'+origin+'/assets/publisher-cover.jpg"'));}
const sitemap=await read('dist/sitemap.xml');check('sitemap has exactly three production URLs',(sitemap.match(/<loc>/g)||[]).length===3&&!sitemap.includes('localhost'));check('robots advertises production sitemap',(await read('dist/robots.txt')).includes(origin+'/sitemap.xml'));
build(['--origin',origin],{VERCEL_ENV:'preview'});check('Vercel preview cannot accidentally index',(await read('dist/robots.txt')).includes('Disallow: /')&&!(await read('dist/index.html')).includes('rel="canonical"'));
for(const bad of ['http://bad.example','https://bad.example/a','https://localhost','https://user:pass@bad.example']){let rejected=false;try{build(['--origin',bad]);}catch{rejected=true;}check('reject invalid origin '+bad,rejected);}
build();check('final export is safe preview',(await read('dist/robots.txt')).includes('Disallow: /'));
const report={checkedAt:new Date().toISOString(),checks,passed:checks.length};await writeFile(new URL('./verification.json',import.meta.url),JSON.stringify(report,null,2));console.log(`${checks.length} static and export checks passed. Final dist is noindex.`);
