// Read-only release verification. Run from repository root.
import fs from 'node:fs/promises';
const sites=[['playheadsoccer.com','/how-to-play.html','/app.js'],['snowrider3d.top','/snow-rider-3d-controls.html','/player.js']];
const results=[];
for(const [domain,guide,script]of sites){
 const origin='https://'+domain,publisherPending=domain==='snowrider3d.top';
 try{
  const response=await fetch(origin,{signal:AbortSignal.timeout(15000)}),html=await response.text();
  const resources=[];
  for(const[name,p]of [['robots','/robots.txt'],['sitemap','/sitemap.xml'],['guide',guide],['script',script],['style','/style.css']]){
   const r=await fetch(origin+p,{signal:AbortSignal.timeout(15000)}),body=await r.text();
   const expectedStatus=publisherPending&&name==='sitemap'?404:200;
   resources.push({name,status:r.status,expectedStatus,valid:name==='robots'?(publisherPending?body.includes('Disallow: /'):body.includes('Allow: /')&&body.includes(origin+'/sitemap.xml')):name==='sitemap'?(publisherPending?r.status===404:body.includes(origin+guide)):!!body.length});
  }
  const redirect=await fetch('https://www.'+domain+'/',{redirect:'manual',signal:AbortSignal.timeout(15000)});
  const canonical=html.match(/rel="canonical" href="([^"]+)/)?.[1],noindex=/noindex/.test(html);
  const result={domain,publisherPending,status:response.status,finalURL:response.url,title:html.match(/<title>([^<]+)/)?.[1],canonical:canonical??null,noindex,server:response.headers.get('server'),csp:response.headers.get('content-security-policy'),wwwRedirect:{status:redirect.status,location:redirect.headers.get('location')},resources};
  const indexingCorrect=publisherPending?noindex&&!canonical&&html.includes('Awaiting publisher approval for this domain.'):canonical===origin+'/'&&!noindex;
  result.pass=result.status===200&&indexingCorrect&&redirect.status===301&&redirect.headers.get('location')===origin+'/'&&resources.every(r=>r.status===r.expectedStatus&&r.valid);
  results.push(result);
 }catch(e){results.push({domain,error:e.message,code:e.cause?.code,pass:false});}
}
const report={checkedAt:new Date().toISOString(),results};
await fs.writeFile('deployments/evidence/2026-10-24/production-http.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(results.some(r=>!r.pass))process.exitCode=1;
