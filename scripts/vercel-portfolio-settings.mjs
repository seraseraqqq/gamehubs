// Explicitly scoped Vercel portfolio settings. Uses the CLI's existing login; never reads tokens.
// node scripts/vercel-portfolio-settings.mjs --manifest <json> --cli <vercel/dist/index.js> --action inspect|analytics|domains --report <json>
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import path from 'node:path';
import assert from 'node:assert/strict';
const args=process.argv.slice(2),opt=k=>args[args.indexOf(k)+1];
for(const k of ['--manifest','--cli','--action','--report'])assert(args.includes(k),'Missing '+k);
const manifest=JSON.parse(await readFile(opt('--manifest'),'utf8'));
const action=opt('--action'),report=path.resolve(opt('--report'));
assert(['inspect','analytics','domains'].includes(action));assert(manifest.scope&&manifest.projects?.length);
const cli=path.resolve(opt('--cli'));
function run(params,input){return new Promise((resolve,reject)=>{
 const child=execFile(process.execPath,[cli,...params,'--scope',manifest.scope],{windowsHide:true,maxBuffer:8*1024*1024,timeout:60000},(err,stdout,stderr)=>{
  if(err)return reject(Error(stderr.slice(-1600)||err.message));
  try{resolve(JSON.parse(stdout));}catch{reject(Error('Non-JSON CLI response: '+stdout.slice(0,250)));}
 });if(input!==undefined)child.stdin.end(JSON.stringify(input));else child.stdin.end();
});}
const api=(route,method='GET',body)=>run(['api',route,'--method',method,'--raw',...(body===undefined?[]:['--input','-'])],body);
const results=[];
for(const p of manifest.projects){
 try{
  assert(/^prj_[A-Za-z0-9]+$/.test(p.projectId)&&/^[a-z0-9-]+$/.test(p.projectName));
  let result={siteId:p.siteId,projectId:p.projectId,projectName:p.projectName};
  if(action==='analytics')result.result=await run(['project','web-analytics','enable',p.projectName,'--json']);
  if(action==='domains'&&p.apex){
   assert(/^[a-z0-9.-]+$/.test(p.apex)&&!p.apex.startsWith('www.')&&!p.apex.endsWith('.vercel.app'));
   const base='/v9/projects/'+p.projectId+'/domains/';
   const before=await api(base+p.apex);
   assert(before.verified,'Apex ownership not verified');
   if(before.redirect||before.gitBranch)await api(base+p.apex,'PATCH',{redirect:null,gitBranch:null});
   const www=await api(base+'www.'+p.apex);
   assert(www.verified,'www ownership not verified');
   if(www.redirect!==p.apex||www.redirectStatusCode!==301||www.gitBranch)await api(base+'www.'+p.apex,'PATCH',{redirect:p.apex,redirectStatusCode:301,gitBranch:null});
  }
  const project=await api('/v9/projects/'+p.projectId);
  const domains=await api('/v9/projects/'+p.projectId+'/domains');
  result.webAnalytics=project.webAnalytics??null;
  result.buildCommand=project.buildCommand??null;
  result.production=project.targets?.production?{id:project.targets.production.id,url:project.targets.production.url,readyState:project.targets.production.readyState,gitCommitSha:project.targets.production.meta?.githubCommitSha}:null;
  result.domains=domains.domains.map(d=>({name:d.name,redirect:d.redirect??null,redirectStatusCode:d.redirectStatusCode??null,gitBranch:d.gitBranch??null,verified:d.verified}));
  result.passed=action==='analytics'?!!project.webAnalytics?.enabledAt:action==='domains'&&p.apex?result.domains.some(d=>d.name===p.apex&&!d.redirect&&!d.gitBranch&&d.verified)&&result.domains.some(d=>d.name==='www.'+p.apex&&d.redirect===p.apex&&d.redirectStatusCode===301&&d.verified):true;
  results.push(result);console.log(JSON.stringify({siteId:p.siteId,action,passed:result.passed,analyticsEnabled:!!project.webAnalytics?.enabledAt}));
 }catch(e){results.push({siteId:p.siteId,passed:false,error:e.message});console.log(JSON.stringify({siteId:p.siteId,passed:false,error:e.message}));}
 await mkdir(path.dirname(report),{recursive:true});await writeFile(report,JSON.stringify({checkedAt:new Date().toISOString(),action,results},null,2)+'\n');
}
if(results.some(r=>!r.passed))process.exitCode=1;
