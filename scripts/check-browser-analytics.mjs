// End-to-end Vercel Analytics request acceptance in the owner's real Chrome through OpenCLI.
// Requires an already connected OpenCLI profile. Does not install/reconfigure browser extensions.
// node scripts/check-browser-analytics.mjs --manifest <json> --opencli <main.js> --session <unique-name> --report <json> [--slugs a,b]
// Verified 2026-10-25; screenshot + Vercel dashboard receipt are separate evidence.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
const args=process.argv.slice(2),get=k=>args[args.indexOf(k)+1];
for(const k of ['--manifest','--opencli','--session','--report'])assert(args.includes(k),'Missing '+k);
const manifest=JSON.parse(await readFile(get('--manifest'),'utf8'));
const selected=args.includes('--slugs')?new Set(get('--slugs').split(',')):null;
const projects=manifest.projects.filter(p=>!selected||selected.has(p.siteId));
const session=get('--session');assert(/^gamehubs-[a-z0-9-]+$/.test(session));
const file=path.resolve(get('--report')),results=[];
function run(a){return new Promise((resolve,reject)=>execFile(process.execPath,[get('--opencli'),'browser',session,...a],{windowsHide:true,timeout:30000,maxBuffer:4*1024*1024},(err,stdout,stderr)=>err?reject(Error(stderr.slice(-1200)||stdout.slice(-500)||err.message)):resolve(stdout.trim())));}
const inspect=`JSON.stringify({url:location.href,title:document.title,h1:document.querySelector('h1')?.textContent,scripts:[...document.scripts].filter(s=>s.src.includes('/_vercel/insights/')).map(s=>s.src),requests:performance.getEntriesByType('resource').filter(e=>e.name.startsWith(location.origin+'/_vercel/insights/')).map(e=>({url:e.name,status:e.responseStatus,initiator:e.initiatorType,duration:e.duration}))})`;
try{
 for(const p of projects){
  try{
   const opened=await run(['open',p.origin+'/?analytics_check=20261025','--window','background','--timeout','12000']);
   let state;
   for(let attempt=0;attempt<5;attempt++){
    state=JSON.parse(await run(['eval',inspect]));
    if(state.requests.some(x=>x.url===p.origin+'/_vercel/insights/view'&&x.status>=200&&x.status<300))break;
    await new Promise(r=>setTimeout(r,700));
   }
   const row={siteId:p.siteId,checkedAt:new Date().toISOString(),...state,passed:!!state.h1&&state.url.startsWith(p.origin+'/')&&state.requests.some(x=>x.url===p.origin+'/_vercel/insights/view'&&x.status>=200&&x.status<300)};
   results.push(row);console.log(JSON.stringify({siteId:p.siteId,passed:row.passed,requests:row.requests}));
  }catch(e){results.push({siteId:p.siteId,passed:false,error:e.message});console.log(JSON.stringify(results.at(-1)));}
  await mkdir(path.dirname(file),{recursive:true});await writeFile(file,JSON.stringify({checkedAt:new Date().toISOString(),profileScope:'owner real Chrome; OpenCLI connected profile',results},null,2)+'\n');
 }
}finally{await run(['close']).catch(()=>{});}
if(results.some(r=>!r.passed))process.exitCode=1;
