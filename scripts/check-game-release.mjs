// Read-only HTTP acceptance for an explicitly selected static game release.
// Usage: node scripts/check-game-release.mjs --origin https://example.com --routes /,/guide.html --www www.example.com --www-status 301 --report deployments/evidence/release/http.json
// Checks public access, route-specific metadata, exported assets, real 404s and optional www redirect.
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const args=process.argv.slice(2);
const option=name=>args[args.indexOf(name)+1];
if(!args.includes('--origin')||!args.includes('--report'))throw Error('Pass --origin and --report');
const origin=new URL(option('--origin')).origin;
const routes=(args.includes('--routes')?option('--routes'):'/').split(',');
const checks=[];
const discoveredAssets=new Set();
const read=async url=>{
  try{const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15000)});return{url,status:r.status,location:r.headers.get('location'),robotsHeader:r.headers.get('x-robots-tag'),contentType:r.headers.get('content-type'),body:await r.text()};}
  catch(error){return{url,error:error.message,cause:error.cause?.code};}
};
for(const route of routes){
  const r=await read(new URL(route,origin));
  const html=r.body||'';
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)?.[1]||null;
  const robots=html.match(/name="robots" content="([^"]+)"/)?.[1]||null;
  const images=[...html.matchAll(/(?:property="og:image"|name="twitter:image") content="([^"]+)"/g)].map(m=>m[1]);
  if(args.includes('--discover-assets'))for(const match of html.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:js|css|svg|png|ico|webmanifest))"/g))discoveredAssets.add(match[1]);
  checks.push({...r,body:undefined,title:html.match(/<title>(.*?)<\/title>/)?.[1],canonical,robots,images,iframes:[...html.matchAll(/<iframe\b[^>]*src="([^"]+)"/g)].map(m=>m[1]),jsonLd:[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>{try{JSON.parse(m[1]);return true;}catch{return false;}}),passed:r.status===200&&(!canonical||canonical===new URL(route,origin).href)});
}
const assetRoutes=args.includes('--discover-assets')?[...discoveredAssets]:['/app.js','/style.css','/favicon.svg'];
for(const route of [...assetRoutes,'/robots.txt','/sitemap.xml','/__gamehubs_missing_release_check__']){
  const r=await read(new URL(route,origin));
  const expected=route==='/__gamehubs_missing_release_check__'?404:route==='/sitemap.xml'?null:200;
  checks.push({...r,body:route==='/robots.txt'||route==='/sitemap.xml'?r.body:undefined,passed:expected===null?[200,404].includes(r.status):r.status===expected});
}
if(args.includes('--www')){
  const expectedStatus=args.includes('--www-status')?Number(option('--www-status')):301;
  if(![301,308].includes(expectedStatus))throw Error('--www-status must be 301 (default) or explicit legacy 308');
  const r=await read('https://'+option('--www')+'/guide.html?source=release-check');
  checks.push({...r,body:undefined,expectedStatus,passed:r.status===expectedStatus&&r.location===origin+'/guide.html?source=release-check'});
}
const report={checkedAt:new Date().toISOString(),origin,checks,passed:checks.every(c=>c.passed),limits:['HTTP and metadata checks do not prove complete game loading or gameplay.','No search-engine indexing, physical-device or performance acceptance is inferred.']};
const file=path.resolve(option('--report'));await mkdir(path.dirname(file),{recursive:true});await writeFile(file,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({origin,passed:report.passed,checks:checks.length,failed:checks.filter(c=>!c.passed),report:file},null,2));
if(!report.passed)process.exitCode=1;
