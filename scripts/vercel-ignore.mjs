// Vercel convention: exit0 skips; exit1 builds. Errors always allow a build.
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const normalized=value=>value.replaceAll('\\','/').replace(/\/$/,'');
export function validPath(value){return typeof value==='string'&&value.length>0&&!path.isAbsolute(value)&&!value.startsWith('-')&&!normalized(value).split('/').some(part=>part==='..'||part==='');}
export function runtimeFile(relative){
 const file=normalized(relative),parts=file.split('/'),leaf=parts.at(-1);
 if(['.rankup','.impeccable','.vercel','node_modules','dist','design','tests','test','research'].includes(parts[0]))return false;
 // Root documentation is excluded; distributed legal notices must still rebuild.
 if(parts.length===1&&/\.md$/i.test(leaf)&&!/^(license|copying|notice|third_party_notices)/i.test(leaf))return false;
 if(parts[0]==='scripts'&&(/^(verification|export-checks)\.json$/i.test(leaf)||/^(verify|check|serve)\.mjs$/i.test(leaf)||/\.test\.(mjs|js|cjs)$/i.test(leaf)))return false;
 return true;
}
export function affected(project,files,shared=[]){
 if(!validPath(project)||shared.some(p=>!validPath(p)))throw Error('Invalid project/shared path');
 const prefix=normalized(project)+'/';
 return files.some(file=>file.startsWith(prefix)?runtimeFile(file.slice(prefix.length)):shared.some(input=>file===normalized(input)||file.startsWith(normalized(input)+'/')));
}
export function decide({cwd=process.cwd(),project,previous=process.env.VERCEL_GIT_PREVIOUS_SHA,force=process.env.GAMEHUBS_FORCE_BUILD,shared=[]}={}){
 const git=args=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:20000}).trim();
 try{
  if(force==='1')return {build:true,reason:'explicit force'};
  if(!validPath(project))return {build:true,reason:'invalid/missing project path'};
  const head=git(['rev-parse','HEAD']);
  if(!previous||! /^[a-f0-9]{40,64}$/i.test(previous))return {build:true,reason:'no successful deployment baseline'};
  if(head===previous)return {build:true,reason:'same-commit manual redeploy'};
  try{git(['cat-file','-e',previous+'^{commit}']);}catch{
   // Vercel shallow-clones. Fetch only the known last successful commit.
   try{git(['fetch','--no-tags','--depth=1','origin',previous]);}catch{return {build:true,reason:'baseline unavailable; safe fallback'};}
  }
  const files=git(['diff','--name-only','--no-renames','-z',previous,head,'--']).split('\0').filter(Boolean);
  const build=affected(project,files,shared);
  return {build,reason:build?'game/runtime dependency changed':'only unrelated files or game documentation changed',baseline:previous.slice(0,12),head:head.slice(0,12)};
 }catch{return {build:true,reason:'comparison unavailable; safe fallback'};}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=decide({project:process.argv[2],shared:process.argv.slice(3)});
 console.log('[gamehubs selective build] '+JSON.stringify(result));
 process.exitCode=result.build?1:0;
}
