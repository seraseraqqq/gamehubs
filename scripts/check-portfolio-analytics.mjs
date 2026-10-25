// Read-only production HTTP acceptance for the exact projects in a rollout manifest.
// node scripts/check-portfolio-analytics.mjs --manifest <json> --report <json>
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const args=process.argv.slice(2),get=k=>args[args.indexOf(k)+1];
assert(args.includes('--manifest')&&args.includes('--report'));
const manifest=JSON.parse(await readFile(get('--manifest'),'utf8'));
const reportFile=path.resolve(get('--report')),results=[];
const expectedNoindex=new Set(['coreball','minute-cryptic-unlimited','snow-rider-3d-unblocked','cluster-rush','colordle','cutle','metazooa','poople','travle']);
// Git checkouts on Windows may use CRLF; Vercel checks out LF from Git.
const sha=v=>createHash('sha256').update(v.replace(/\r\n/g,'\n')).digest('hex');
async function read(url){try{const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});return{url,status:r.status,location:r.headers.get('location'),body:await r.text(),csp:r.headers.get('content-security-policy')};}catch(e){return{url,error:e.message};}}
async function checkProject(p){
 const checks=[];
 try{
  const home=await read(p.origin+'/');
  const robots=home.body?.match(/name="robots" content="([^"]+)"/)?.[1]??null;
  const canonical=home.body?.match(/rel="canonical" href="([^"]+)"/)?.[1]??null;
  checks.push({kind:'homepage',status:home.status,passed:home.status===200&&(!p.apex||canonical===p.origin+'/')&&(/noindex/.test(robots??'')===expectedNoindex.has(p.siteId)),canonical,robots});
  const dist=path.join(p.root,p.react?'apps/web/dist/client':'dist');
  const routes=p.react?['/how-to-play','/about','/privacy','/credits','/'+({cutle:'strategy',poople:'solver',colordle:'color-guide',metazooa:'taxonomy-guide',travle:'strategy'}[p.siteId])]: (await readdir(dist)).filter(x=>x.endsWith('.html')&&!['index.html','404.html'].includes(x)).map(x=>'/'+x);
  for(const route of routes){const r=await read(p.origin+route),c=r.body?.match(/rel="canonical" href="([^"]+)"/)?.[1];checks.push({kind:'page',route,status:r.status,canonical:c??null,passed:r.status===200&&(!p.apex||c===p.origin+route)});}
  if(!p.react){const r=await read(p.origin+'/analytics.js'),local=await readFile(path.join(p.root,'analytics.js'),'utf8');checks.push({kind:'bootstrap',status:r.status,sha256:r.body?sha(r.body):null,passed:r.status===200&&sha(r.body)===sha(local)&&home.body?.includes('src="/analytics.js"')});}
  const script=await read(p.origin+'/_vercel/insights/script.js');checks.push({kind:'analytics-script',status:script.status,passed:script.status===200&&script.body?.length>1000});
  // Public deployments allow crawling so Google can observe either index or meta noindex.
  const robot=await read(p.origin+'/robots.txt');checks.push({kind:'robots',status:robot.status,body:robot.body,passed:robot.status===200&&/^Allow:\s*\/$/m.test(robot.body)&&!/^Disallow:\s*\/\s*$/m.test(robot.body)});
  const sitemap=await read(p.origin+'/sitemap.xml'),locs=[...(sitemap.body??'').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
  const xml=/<urlset\b[^>]*xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/.test(sitemap.body??'')&&/<\/urlset>/.test(sitemap.body??'');
  const held=expectedNoindex.has(p.siteId);
  checks.push({kind:'sitemap',status:sitemap.status,urlCount:locs.length,passed:held?(sitemap.status===404||sitemap.status===200&&xml&&locs.length===0):sitemap.status===200&&xml&&locs.length>0&&locs.every(u=>u.startsWith(p.origin+'/'))});
  if(p.apex)for(const route of ['/','/domain-check?source=gamehubs']){const r=await read('https://www.'+p.apex+route);checks.push({kind:'www-301',route,status:r.status,location:r.location,passed:r.status===301&&r.location===p.origin+route});}
  results.push({siteId:p.siteId,origin:p.origin,csp:home.csp,passed:checks.every(x=>x.passed),checks});
 }catch(e){results.push({siteId:p.siteId,origin:p.origin,passed:false,checks,error:e.message});}
 const last=results.at(-1);console.log(JSON.stringify({siteId:p.siteId,passed:last.passed,checks:last.checks.length,failed:last.checks.filter(x=>!x.passed),error:last.error}));
}
const queue=[...manifest.projects];
await Promise.all(Array.from({length:4},async()=>{while(queue.length)await checkProject(queue.shift());}));
await mkdir(path.dirname(reportFile),{recursive:true});await writeFile(reportFile,JSON.stringify({checkedAt:new Date().toISOString(),results,limits:['HTTP proves exports, script delivery and redirects; real browser pageviews and Vercel receipt are recorded separately.','Gameplay, real-device acceptance and search-engine indexing are not inferred.']},null,2)+'\n');
if(results.some(r=>!r.passed))process.exitCode=1;
