// Run with: node scripts/test_dashboard.mjs. No browser or formal-data writes.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const elements=new Map();
const document={getElementById(id){if(!elements.has(id))elements.set(id,{value:'',innerHTML:'',setAttribute(){}});return elements.get(id);}};
const context=vm.createContext({document,console,URL,structuredClone});
const source=readFileSync(new URL('../dashboard/app.js',import.meta.url),'utf8').split("$('save-reviews').onclick")[0];
vm.runInContext(source,context);
const run=code=>vm.runInContext(code,context);
run(`data={plans:[],keywords:[
{id:'a',term:'alpha',aliases:[],sites:[],keywordStatus:'observing',batchDate:'2026-10-24',metrics:{volume:0,kd:0,intitle:0,ratio:null}},
{id:'b',term:'beta',aliases:[],sites:[{id:'s',name:'Beta site',page:'/play'}],keywordStatus:'live',batchDate:'2026-10-25',metrics:{volume:100,kd:25,intitle:50,ratio:.5}},
{id:'c',term:'unknown',aliases:[],sites:[],keywordStatus:'building',batchDate:null,metrics:{volume:null,kd:null,intitle:null,ratio:null}}
]};`);
for(const key of ['volume','kd','intitle','batchDate']){
 document.getElementById('sort').value=key;
 run("direction='asc'");assert.deepEqual(Array.from(run('rows().map(r=>r.id)')),['a','b','c']);
 run("direction='desc'");assert.deepEqual(Array.from(run('rows().map(r=>r.id)')),['b','a','c']);
}
for(const direction of ['asc','desc']){run(`direction='${direction}'`);document.getElementById('sort').value='ratio';assert.equal(run('rows()[0].id'),'b');}
document.getElementById('status-filter').value='live';assert.equal(run('rows().length'),1);
document.getElementById('status-filter').value='';document.getElementById('site-filter').value='unlinked';assert.equal(run('rows().length'),2);
document.getElementById('site-filter').value='s';assert.equal(run('rows()[0].id'),'b');
document.getElementById('site-filter').value='';document.getElementById('search').value='/play';assert.equal(run('rows()[0].id'),'b');
run(`data.sites=[{id:'s',keywordMappings:[{keywordId:'b',role:'primary'}]},{id:'standalone',keywordMappings:[{keywordId:'missing',role:'primary',metrics:{volume:200,kd:12,intitle:20}}]}]`);
assert.equal(run('siteMetrics(data.sites[0]).volume'),100);assert.equal(run('siteMetrics(data.sites[1]).ratio'),.1);
assert.equal(run('siteBatchDate(data.sites[0])'),'2026-10-25');assert.equal(run('siteBatchDate(data.sites[1])'),null);
assert.equal(run('siteMetrics(data.sites[0])===data.keywords[1].metrics'),true,'linked sites must read the same metric object as the keyword pool');
run('data.sites[0].keywordMappings[0].metrics={volume:999,intitle:999};data.keywords[1].metrics.intitle=0');
assert.equal(run('siteMetrics(data.sites[0]).volume'),100,'stale mapping copies must not override the pool');
assert.equal(run('siteMetrics(data.sites[0]).intitle'),0,'zero must propagate to the site directory');
assert.match(run('sitePrimaryLabel(data.sites[1])'),/未入词池/);
assert.match(run('siteMetricReason(data.sites[1])'),/不能套用其他词/);
assert.equal(run("siteStatus({stage:'deployed'})"),'live');assert.equal(run("siteStatus({stage:'planned'})"),'observing');
assert.notEqual(run('ratio(.00000001)'), '0');
run("post=async (path,payload)=>{saved=payload;return{}}; data.keywords[0].statusOverride=null;");
assert.equal(await run("saveKeywordEdit(data.keywords[0],{volume:0,kd:0,intitle:0},null,'no change')"),false);
assert.equal(await run("saveKeywordEdit(data.keywords[0],{volume:0,kd:0,intitle:0},'abandoned','status only')"),true);
assert.equal(Object.keys(run('saved.metrics')).length,0,'status-only edits must not freeze research metrics');
assert.equal(run('saved.keywordStatus'),'abandoned');
console.log('Dashboard checks passed: both sort directions, missing/zero values, status, site/page search, primary metrics.');
