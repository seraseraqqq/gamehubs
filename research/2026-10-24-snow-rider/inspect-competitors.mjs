// Public HTTP source inspection only, 2026-10-24. No account, browser or game package download.
import {mkdir,writeFile} from 'node:fs/promises';
const folder=new URL('./competitor-source/',import.meta.url);await mkdir(folder,{recursive:true});
const urls=[
 'https://snowrider.app/','https://snowrunner.org/','https://snowrider.com/',
 'https://dnrweqffuwjtx.cloudfront.net/snow-rider-3d/','https://hoparcade.com/',
 'https://snow-rider-3d.gitlab.io/','https://snow-rider3d.github.io/',
 'https://topvaz.com/go/snow-rider-3d/','https://catninja.co/snow-rider',
 'https://snowrider3dunblocked.me/?play=1','https://www.hoodamath.com/games/snowrider3d.html',
 'https://snowrider3d.com/'
];
const attr=(tag,key)=>{const m=tag.match(new RegExp('\\b'+key+'\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))','i'));return m?.[1]??m?.[2]??m?.[3]??null;};
const results=await Promise.all(urls.map(async url=>{
 try{const r=await fetch(url,{signal:AbortSignal.timeout(18000),headers:{'User-Agent':'Mozilla/5.0'}});const html=await r.text();
 const name=new URL(url).hostname.replaceAll('.','_');await writeFile(new URL(name+'.html',folder),html);
 const frames=[...html.matchAll(/<iframe\b[^>]*>/gi)].map(m=>({src:attr(m[0],'src'),dataSrc:attr(m[0],'data-src'),id:attr(m[0],'id'),title:attr(m[0],'title')}));
 const scripts=[...html.matchAll(/<script\b[^>]*>/gi)].map(m=>attr(m[0],'src')).filter(Boolean);
 const signals=[...html.matchAll(/.{0,90}(?:UnityLoader|createUnityInstance|UnityInstance|\.unityweb|\.wasm|\.data\b|three\.module|three\.js|three\.min|createElement\(["']iframe|createElement\(["']canvas|\/game\/|\/game["'?]|\.loader\.js|\.framework\.js).{0,170}/gi)].slice(0,16).map(m=>m[0]);
 return {url,finalUrl:r.url,status:r.status,bytes:html.length,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],frames,scripts,canvasTags:(html.match(/<canvas\b/gi)||[]).length,signals};
 }catch(e){return {url,error:e.message};}
}));
await writeFile(new URL('./competitor-source-evidence.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),method:'Public HTTP HTML only. Search result sample, not a verified personalized Google top-10 ordering. iframe alone does not determine authorship.',sites:results},null,2));
for(const r of results)console.log(JSON.stringify(r));
