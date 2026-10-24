/** Public source/embedding evidence only. No cookies, game downloads, or execution.
 * node research/2026-10-24-game-build-plan/inspect-public-sources.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const targets=[
 ['cutle','https://pfiffel.com/cutle/'],['poople','https://poople.io/'],
 ['colordle','https://colordle.ryantanen.com/'],['metazooa','https://metazooa.com/'],
 ['spotle','https://spotle.io/'],['songless','https://lessgames.com/songless'],
 ['scrandle','https://scrandle.com/'],['traffic-road','https://azgames.io/traffic-road'],
 ['x-trench-run-license','https://www.marketjs.com/item/x-trench-run/'],
 ['travle','https://travle.earth/'],['travle-imois','https://imois.in/games/travle/'],
 ['maptap','https://maptap.gg/']
];
await fs.mkdir(path.join(root,'evidence'),{recursive:true});
const results=[];
for(let i=0;i<targets.length;i+=3){
 const batch=await Promise.allSettled(targets.slice(i,i+3).map(async ([name,url])=>{
  const r=await fetch(url,{signal:AbortSignal.timeout(20000)});const html=await r.text();
  const attrs=(tag,attribute)=>[...html.matchAll(new RegExp('<'+tag+'\\b[^>]*\\b'+attribute+'=["\\\']([^"\\\']+)','gi'))].map(m=>m[1]);
  const links=attrs('a','href').map(h=>{try{return new URL(h,r.url).href;}catch{return null;}}).filter(Boolean);
  const visible=html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  return{name,url,finalUrl:r.url,status:r.status,observedAt:new Date().toISOString(),title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||null,bytes:html.length,frameHeaders:{xFrameOptions:r.headers.get('x-frame-options'),contentSecurityPolicy:r.headers.get('content-security-policy')},relevantLinks:[...new Set(links.filter(h=>/github|terms|privacy|licen[cs]e|copyright|embed|publish|distribut|faq|about/i.test(h)))],iframeSources:attrs('iframe','src'),scriptSources:attrs('script','src'),briefVisibleExcerpt:visible.split(' ').slice(0,10).join(' '),contains5999:/5[,\s]?999/.test(visible),containsEmbed:/embed|iframe/i.test(visible)};
 }));
 batch.forEach((r,j)=>{const d=r.status==='fulfilled'?r.value:{name:targets[i+j][0],url:targets[i+j][1],status:'unknown',error:r.reason.message};results.push(d);console.log(JSON.stringify({name:d.name,status:d.status,title:d.title,links:d.relevantLinks,iframes:d.iframeSources}));});
}
await fs.writeFile(path.join(root,'evidence/public-sources.json'),JSON.stringify({observedAt:new Date().toISOString(),note:'Frame headers indicate technical behavior only, never distribution permission.',results},null,2)+'\n');
