/** Offline cross-surface and evidence-link audit; no browser or paid requests. */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const ledger=JSON.parse(await fs.readFile(path.join(root,'keyword-ledger.json'),'utf8'));
const rawNames=(await fs.readdir(path.join(root,'raw'))).filter(x=>x.endsWith('.json'));
const byName=new Map(ledger.keywords.map(x=>[x.keyword,x]));
assert.equal(byName.size,ledger.keywords.length,'Duplicate keywords');
const parse=s=>{const m=s?.replaceAll(',','').match(/^(\d+(?:\.\d+)?)([KM])?$/);return m?+m[1]*({K:1000,M:1000000}[m[2]]||1):null;};
let checkedOverviewPairs=0;
for(const name of rawNames){
  const text=await fs.readFile(path.join(root,'raw',name),'utf8');
  assert(!/ayWzA3|__gmitm=[A-Za-z0-9]/.test(text),'Access token left in '+name);
  const d=JSON.parse(text);
  if(!name.startsWith('semrush-serp-'))continue;
  assert.equal(new URL(d.url).searchParams.get('db'),'us','Wrong country');
  const keyword=d.keyword||d.text.match(/Keyword Overview:\s*\n([^\n]+)/)?.[1];
  assert.equal(new URL(d.url).searchParams.get('q'),keyword,'Wrong query identity');
  const x=byName.get(keyword);assert(x,'Unexpected SERP keyword '+keyword);
  const v=d.text.match(/Keyword summary\s*\nVolume\s*\n([^\n]+)/);
  const kd=d.text.match(/Keyword Difficulty\s*\n(\d+)%/);
  if(v&&parse(v[1])!==null){assert.equal(parse(v[1]),x.volume,'Bulk/overview volume mismatch '+keyword);checkedOverviewPairs++;}
  if(kd)assert.equal(+kd[1],x.kd,'Bulk/overview KD mismatch '+keyword);
}
for(const x of ledger.keywords){
  assert(x.trends||x.relatedTrends.length,'No Trends evidence');
  const refs=[x.metricFile,x.trends?.file,x.serp?.file,...x.relatedTrends.map(r=>r.file)].filter(Boolean);
  for(const file of refs)await fs.access(path.join(root,file));
  if(x.volume>10000&&x.kd!==null&&x.kd<30){
    assert(x.trends&&x.trends.nonZeroPeriods>0,'Strict term lacks usable series');
    assert(x.serp?.rows.length,'Strict term lacks SERP');
  }
}
let checkedLocalLinks=0;
for(const file of ['README.md','SHORTLIST.md']){
  const md=await fs.readFile(path.join(root,file),'utf8');
  for(const m of md.matchAll(/\]\(([^)]+)\)/g)){
    if(/^(https?:|#)/.test(m[1]))continue;
    await fs.access(path.resolve(root,m[1].split('#')[0]));checkedLocalLinks++;
  }
}
const evidence={checkedAt:new Date().toISOString(),keywords:ledger.keywords.length,strictMetricMatches:ledger.counts.strictMetricMatches,allStrictTermsHaveSeriesAndSerp:true,checkedOverviewPairs,checkedLocalLinks,rawJsonFiles:rawNames.length,accessTokensFound:0,localLinksBroken:0,note:'Checks extraction consistency and evidence completeness; does not authenticate the mirror or predict rankings.'};
await fs.writeFile(path.join(root,'validation.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence));
