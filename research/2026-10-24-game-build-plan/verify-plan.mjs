/** Validate local plan consistency; this does not certify third-party measurements or rights. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
await fs.writeFile(path.join(dir,'validation.json'),JSON.stringify({result:'pending; not yet passed'})+'\n');
const read=async f=>JSON.parse(await fs.readFile(path.join(dir,f),'utf8'));
const plan=await read('plan.json'),remaining=await read('dispositions.json');
const ledger=await read('../2026-10-24-keyword-opportunities/keyword-ledger.json');
const quote=await read('evidence/domain-quotes.json');
const results=JSON.parse(quote.response.content.find(c=>c.type==='text').text).result.results;
const checks=[];const pass=(n,v)=>{assert.ok(v,n);checks.push(n);};
pass('11 selected + 106 deferred = 117 ledger terms',plan.sites.length===11&&remaining.length===106&&ledger.keywords.length===117);
const all=[...plan.sites.map(s=>s.metric.keyword),...remaining.map(r=>r.keyword)];
pass('all terms unique and exactly cover previous ledger',new Set(all).size===117&&all.every(x=>ledger.keywords.some(k=>k.keyword===x)));
pass('first cohort order',plan.sites.slice(0,3).map(s=>s.slug).join(',')==='cutle,poople,colordle');
let linkedSources=0;
for(const s of plan.sites){
 const k=ledger.keywords.find(k=>k.keyword===s.metric.keyword);
 pass(`${s.slug}: metrics and trend exactly match ledger`,s.metric.volume===k.volume&&s.metric.kd===k.kd&&s.trend.first4===k.trends.first4&&s.trend.last4===k.trends.last4);
 for(const f of [s.metric.file,s.trend.file,s.serpFile]){await fs.access(path.resolve(dir,f));linkedSources++;}
 pass(`${s.slug}: domain quotes match raw response`,s.domains.every(d=>{const q=results.find(q=>q.domain===d.domain);return q?.available===true&&q.price===d.price&&q.renewalPrice===d.renewalPrice&&q.premium===false;}));
 pass(`${s.slug}: scope, keyword pages and acceptance present`,s.status.startsWith('planned')&&s.route&&s.sources.length&&s.tasks.length&&s.seo.pages.length);
}
pass('first cohort strictly volume >10000 and KD <30',plan.sites.slice(0,3).every(s=>s.metric.volume>10000&&s.metric.kd<30));
pass('30 queries, 25 positive quotes; exact input order',results.length===30&&results.filter(x=>x.available).length===25&&results.every((x,i)=>x.domain===quote.request.domains[i]));
pass('first cohort registration total USD33.75',plan.sites.slice(0,3).reduce((a,s)=>a+s.domains[0].price,0)===33.75);
pass('first cohort estimate sums 10-13 days',plan.sites.slice(0,3).reduce((a,s)=>a+s.days[0],0)===10&&plan.sites.slice(0,3).reduce((a,s)=>a+s.days[1],0)===13);
const google=await read('evidence/google-cross-check.json');
pass('all first-cohort terms have live Google result links',plan.sites.slice(0,3).every(s=>google.queries.some(q=>q.keyword===s.metric.keyword&&q.results.length>=8)));
const license=await read('evidence/source-checks.json');
pass('MIT color data license was actually fetched',JSON.stringify(license['more-source-2']).includes('MIT License'));
pass('Unlicense word data was actually fetched',JSON.stringify(license['licensed-4']).includes('public domain'));
let mdLinks=0,jsonFiles=0,taskCount=0;
for(const file of await fs.readdir(dir)){
 if(file.endsWith('.json')){await read(file);jsonFiles++;}
 if(!file.endsWith('.md'))continue;
 const body=await fs.readFile(path.join(dir,file),'utf8');
 pass(file+': no mirror access token or account UI payload',!/__gmitm=|Google Account:/i.test(body));
 if(file==='TASKS.md')taskCount=(body.match(/^- \[ \]/gm)||[]).length;
 for(const m of body.matchAll(/\]\(([^)]+)\)/g)){
  const href=m[1];if(/^(https?:|mailto:)/.test(href))continue;
  const [relative,anchor]=href.split('#');const target=path.resolve(dir,relative||file);
  await fs.access(target);mdLinks++;
  if(anchor){const txt=await fs.readFile(target,'utf8');assert.ok(txt.includes(`id="${anchor}"`),file+' anchor '+href);}
 }
}
for(const f of await fs.readdir(path.join(dir,'evidence'))){if(f.endsWith('.json')){await read('evidence/'+f);jsonFiles++;}}
pass('checklist contains actionable future items',taskCount>=70);
const validation={checkedAt:new Date().toISOString(),result:'passed',checks:checks.length,selected:plan.sites.length,deferred:remaining.length,metricsTrendSerpFiles:linkedSources,localMarkdownLinks:mdLinks,jsonFilesChecked:jsonFiles,taskCheckboxes:taskCount,domainsQueried:results.length,domainsAvailable:results.filter(x=>x.available).length,notes:['Validates extraction, linkage, arithmetic and planning coverage only','Does not certify official Semrush values, domain/trademark history or distribution authorization','No game implementation or device gameplay tests were run in this planning task'],checksPassed:checks};
await fs.writeFile(path.join(dir,'validation.json'),JSON.stringify(validation,null,2)+'\n');
console.log(JSON.stringify(validation,null,2));
