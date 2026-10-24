// Public read-only evidence collector. Run: node research-domains.mjs. No login or purchase.
import {writeFile} from 'node:fs/promises';
const domains=['snowrider3dunblocked.com','snowrider3dunblocked.net','snowrider3dunblocked.org','playsnowrider3d.com','snowrider3dplay.com','snowrider3donline.com','snowrider3dunblocked.xyz','snowrider3dfree.com'];
const records=await Promise.all(domains.map(async domain=>{
 const url=domain.endsWith('.com')?'https://rdap.verisign.com/com/v1/domain/'+domain:domain.endsWith('.net')?'https://rdap.verisign.com/net/v1/domain/'+domain:domain.endsWith('.org')?'https://rdap.publicinterestregistry.org/rdap/domain/'+domain:'https://rdap.centralnic.com/xyz/domain/'+domain;
 try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});const raw=await r.text();let body={};try{body=JSON.parse(raw);}catch{}return {domain,url,httpStatus:r.status,status:r.status===404?'registry-not-found-candidate':r.ok&&body.ldhName?'registered':'unknown',registeredAt:body.events?.find(x=>x.eventAction==='registration')?.eventDate??null,registryStatus:body.status??[],error:body.title??null};}catch(e){return {domain,url,status:'unknown',error:e.message};}
}));
let suggestions;try{const r=await fetch('https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=snow%20rider%203d%20unblocked',{signal:AbortSignal.timeout(15000)});suggestions=await r.json();}catch(e){suggestions={error:e.message};}
const report={checkedAt:new Date().toISOString(),caveat:'404 is absence in registry, not registrar availability, price, clean history or legal clearance.',domains:records,suggestions};
await writeFile(new URL('./domain-evidence.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
